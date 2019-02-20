import os

def setup_hostname(hostname):
  if hostname == "":
    hostname = "prysma2"
  os.system("raspi-config nonint do_hostname " + hostname)
  os.system("hostname -b " + hostname)
  os.system("systemctl restart avahi-daemon")