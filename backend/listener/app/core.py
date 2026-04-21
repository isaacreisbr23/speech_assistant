import sounddevice as sd
import numpy as np
import speech_recognition as sr
from pathlib import Path
import json

documents = Path.home() /"Documents"/ "MeusComandos"


class IdentificacaoArquivos:

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

                if data.get("nome") == texto:
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
        text = r.recognize_google(audio_data, language="pt-BR")
        print("Você disse:", text)

        ExecucaoAcoes.checar_texto_presente_nos_comandos(text, comandos_encontrados)

    except Exception as e:
        print("Erro:", e)

    start_listener_app()


start_listener_app()