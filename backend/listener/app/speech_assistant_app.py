from core import start_listener_app, rotina_60_segundos
import threading

thread_rotina = threading.Thread(target=rotina_60_segundos, daemon=True)
thread_rotina.start()

start_listener_app()
