import sounddevice as sd
import numpy as np
import speech_recognition as sr
from pathlib import Path
import json
import os
import keyboard
import time
from datetime import datetime


documents = Path.home() /"Documents"/ "MeusComandos"

ultimas_execucoes = set() #serve pras rotinas

class IdentificacaoArquivos:

    @staticmethod
    def criar_log_ultimo_comando_executado(comando):
        
        pasta = Path.home() / "Documents" / "MeusComandos"
        pasta.mkdir(parents=True, exist_ok=True)

        caminho_arquivo = pasta / "ultimo_comando.txt"

        with open(caminho_arquivo, "w", encoding="utf-8") as arquivo:
            arquivo.write(comando)

        return caminho_arquivo


    @staticmethod
    def executar_comando(comando, categoria):

        if categoria == "abertura_arquivo":

            print("[*] Iniciando comando de abertura de arquivo")
            os.startfile(comando)
            
        if categoria == "controle_sistema":

            print("[*] Iniciando processo de controle do sistema")
            keyboard.press_and_release(comando)

    
    @staticmethod
    def executar_rotina(categoria, subcategoria, horario, comando, nome):

        if categoria != "rotina_diaria":
            return

        if not horario:
            return

        agora = datetime.now().strftime("%H:%M")

        chave_execucao = f"{nome}_{agora}"

        if chave_execucao in ultimas_execucoes: #pra nao rodar a msma rotina varias vezes
            return

        if horario == agora:

            ultimas_execucoes.add(chave_execucao)

            print("[*] Horário bateu, executando rotina")

            if subcategoria == "abertura_arquivo":

                print("[*] Abrindo arquivo da rotina")
                os.startfile(comando)

            elif subcategoria == "controle_sistema":

                print("[*] Executando atalho do sistema")
                keyboard.press_and_release(comando)

    @staticmethod
    def executar_rotinas():
    
        arquivos_rotina = IdentificacaoArquivos.listar_rotinas()

        print(f"[*] Rotinas encontradas: {[a.name for a in arquivos_rotina]}")

        for arquivo in arquivos_rotina:

            try:
                with open(arquivo, "r", encoding="utf-8") as f:
                    data = json.load(f)

                categoria = data.get("categoria")
                subcategoria = data.get("subcategoria")
                comando = data.get("comando")
                horario = data.get("horario")
                nome = data.get("nome")
                print(f"[*] Executando rotina: {data.get('nome')}")

                IdentificacaoArquivos.executar_rotina(
                    categoria,
                    subcategoria,
                    horario,
                    comando,
                    nome
                )

            except Exception as e:
                print(f"Erro executando rotina {arquivo}: {e}")

    @staticmethod
    def listar_comandos():
        if not documents.exists():
            print("Pasta não encontrada")
            return []

        return [f for f in documents.iterdir() if f.suffix == ".json"]

    @staticmethod
    def listar_rotinas():
        pasta_rotinas = Path.home() / "Documents" / "MeusComandos" / "rotinas"

        if not pasta_rotinas.exists():
            print("Pasta de rotinas não encontrada")
            return []

        return [
            f for f in pasta_rotinas.iterdir()
            if f.is_file() and f.suffix == ".json"
        ]

    @staticmethod
    def check_comando_nos_arquivos(texto, arquivos):

        for arquivo in arquivos:
            try:
                with open(arquivo, "r", encoding="utf-8") as f:
                    data = json.load(f)

                if data.get("nome").lower() == texto:

                    IdentificacaoArquivos.executar_comando(data.get("comando"), data.get("categoria"))

                    return True

            except Exception as e:
                print(f"Erro lendo {arquivo}: {e}")

        return False
    
    @staticmethod
    def check_comando_nas_rotinas(texto, arquivos_de_rotinas):
        
        for arquivo in arquivos_de_rotinas:
            try:
                with open(arquivo, "r", encoding="utf-8") as f:
                    data = json.load(f)

                if data.get("nome").lower() == texto:

                    IdentificacaoArquivos.executar_comando(data.get("comando"), data.get("categoria"))

                    return True

            except Exception as e:
                print(f"Erro lendo {arquivo}: {e}")

        return False
    
class ExecucaoAcoes:

    @staticmethod
    def checar_texto_presente_nos_comandos(text, comandos):

        if IdentificacaoArquivos.check_comando_nos_arquivos(text, comandos):
            print(f"[*] Comando identificado '{text}' iniciando execução")
        else:
            print("[*] Nenhum comando encontrado")


def rotina_60_segundos():
    while True:

        try:
            print("[*] Verificando rotinas...")
            IdentificacaoArquivos.executar_rotinas()

        except Exception as e:
            print("Erro na rotina:", e)

        time.sleep(2)

def start_listener_app():

    fs = 16000
    seconds = 5

    while True:
        comandos_encontrados = IdentificacaoArquivos.listar_comandos()
        print(f"Comandos encontrados: {[c.name for c in comandos_encontrados]}")

        print("Ouvindo...")

        audio = sd.rec(int(seconds * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()

        audio = np.squeeze(audio)

        r = sr.Recognizer()
        audio_data = sr.AudioData(audio.tobytes(), fs, 2)

        try:
            text = r.recognize_google(audio_data, language="pt-BR").lower()
            print("Você disse:", text)

            ExecucaoAcoes.checar_texto_presente_nos_comandos(text, comandos_encontrados)
            IdentificacaoArquivos.criar_log_ultimo_comando_executado(text)

        except Exception as e:
            print("Erro:", e)
