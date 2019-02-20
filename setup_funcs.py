import os,subprocess,crypt,random,sys

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