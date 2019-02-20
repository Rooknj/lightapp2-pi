import os,subprocess,crypt,random,sys
import pip

def setup_hostname(hostname):
  if hostname == "":
    hostname = "prysma2"
  os.system("raspi-config nonint do_hostname " + hostname)
  os.system("hostname -b " + hostname)
  os.system("systemctl restart avahi-daemon")

def setup_password(password):
  login = 'pi'
  if password == "":
    password = "PrysmaPi"

  ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./"
  salt = ''.join(random.choice(ALPHABET) for i in range(16))

  shadow_password = crypt.crypt(password,'$6$'+salt+'$')

  r = subprocess.call(('usermod', '-p', shadow_password, login))

  if r != 0:
      print('Error changing password for ' + login)

def install_docker():
  os.system("curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh")
  os.system("groupadd docker")
  os.system("gpasswd -a $USER docker")
  os.system("newgrp docker")
  print("Hello")
  os.system("pip3 install -U docker-compose")
  print("Hello")