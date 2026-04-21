import sounddevice as sd
import numpy as np
import speech_recognition as sr

def start_listener_app():

    fs = 16000  # taxa de amostragem
    seconds = 5

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