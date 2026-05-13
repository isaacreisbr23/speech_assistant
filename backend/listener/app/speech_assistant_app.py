print("__STARTED__")
print(__name__)
from core import start_listener_app, rotina_60_segundos
import threading

print(__name__)



thread_rotina = threading.Thread(target=rotina_60_segundos, daemon=True)
thread_rotina.start()

start_listener_app()
