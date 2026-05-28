print("__STARTED__")
print(__name__)
from core import start_listener_app, rotina_60_segundos
import threading
import pyttsx3
import os

print(__name__)
def falar(texto):

    engine = pyttsx3.init(driverName='sapi5')

    engine.setProperty('rate', 180)

    voices = engine.getProperty('voices')

    engine.setProperty('voice', voices[0].id)

    engine.say(texto)

    engine.runAndWait()

    del engine

falar(f"Aura está ativa. Olá {os.environ.get("USERNAME")}")

thread_rotina = threading.Thread(target=rotina_60_segundos, daemon=True)
thread_rotina.start()

start_listener_app()

