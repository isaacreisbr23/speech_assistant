import sounddevice as sd
import numpy as np
import speech_recognition as sr
from pathlib import Path
import json
import os
import keyboard


documents = Path.home() /"Documents"/ "MeusComandos"


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
    def listar_comandos():
        if not documents.exists():
            print("Pasta não encontrada")
            return []

        return [f for f in documents.iterdir() if f.suffix == ".json"]

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
    
class ExecucaoAcoes:

    @staticmethod
    def checar_texto_presente_nos_comandos(text, comandos):

        if IdentificacaoArquivos.check_comando_nos_arquivos(text, comandos):
            print(f"[*] Comando identificado '{text}' iniciando execução")
        else:
            print("[*] Nenhum comando encontrado")


def start_listener_app():

    fs = 16000
    seconds = 5

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

    start_listener_app()


start_listener_app()