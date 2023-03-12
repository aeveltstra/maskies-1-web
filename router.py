from flask import Flask, abort, make_response, redirect, render_template, request, session, url_for
from flask_httpauth import HTTPBasicAuth
import logging
import os

LOGGER = logging.getLogger()
LOGGER.setLevel(logging.INFO)


app = Flask(__name__)
auth = HTTPBasicAuth()
app.secret_key = os.urandom(12)
app.jinja_env.globals.update()

users = {
  #"r": generate_password_hash("r")
}

@auth.verify_password
def verify_user(username, password):
  # if username in users and \
  #   check_password_hash(users.get(username), password)
  #    return username
  return username

@app.route("/")
def root():
  return render_template("index.html")

@app.route("/enter")
@auth.login_required
def enter():
  return render_template("one.html",p=auth.current_user())

@app.route("/favicon.ico")
def favicon():
  return app.send_static_file("favicon.ico")

#run the app only if it got called directly,
#avoid running it if imported as a module.
if __name__ == "__main__":
  #To regenerate the certificates, use this command line:
  # $ openssl req -x509 -newkey rsa:4096 -nodes -out maskies-1-cert.pem -keyout maskies-1-key.pem -days 365
  app.run(threaded=True, host='0.0.0.0', port=8081, ssl_context=('../certs/maskies-1-web-cert.pem', '../certs/maskies-1-web-key.pem'))
