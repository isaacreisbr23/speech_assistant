import sounddevice as sd
import numpy as np
import speech_recognition as sr
from pathlib import Path

def listar_comandos():

    documents = Path.home() / "Documents/MeusComandos"

    if not documents.exists():
        print("Pasta Documents não encontrada")
        return []

    arquivos = [f.name for f in documents.iterdir() if f.is_file()]

    return arquivos


def execute_voice_command(text):
    
    if text == None:
        print("O parametro de execucao nao foi enviado")
    else:
        pass


def start_listener_app():

    fs = 16000  # taxa de amostragem
    seconds = 5

    comandos_encontrados = listar_comandos()
    print(f"Comandos encontrados {comandos_encontrados}")
    
    print("Ouvindo...")

    audio = sd.rec(int(seconds * fs), samplerate=fs, channels=1, dtype='int16')
    sd.wait()

    audio = np.squeeze(audio)

    r = sr.Recognizer()

    audio_data = sr.AudioData(audio.tobytes(), fs, 2)

    try:
        text = r.recognize_google(audio_data, language="pt-BR")
        print("Você disse:", text)
        start_listener_app()

    except Exception as e:
        print("Erro:", e)
        start_listener_app()