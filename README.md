lightapp2-pi
===========================================

# How to run
- Make sure the Raspberry pi 3 is set up correctly (Section below)
- SSH into your raspberry pi
- Navigate to the lightapp2-pi folder
- Run ```docker-compose up -d``` and it should work
  - Note: This may take a while the first time as it needs to pull the images from docker cloud

# How to Upgrade
- SSH into your raspberry pi
- Navigate to the lightapp2-pi folder
- Run ```docker-compose pull```
  - Note: This may take a while as it needs to pull the images from docker cloud
# How to setup the Raspberry Pi 3
## Clone the git repo or just download the file
- Install git if you havent already
  - ```sudo apt-get install git```
- Clone the repo
  - ```git clone https://github.com/Rooknj/lightapp2-pi.git```

## Install and setup Docker and Docker-compose
- Install docker using this script
  - ```curl -fsSL get.docker.com -o get-docker.sh && sh get-docker.sh```
- Setup docker for use without having to type in sudo every time
  - ```sudo groupadd docker```
  - ```sudo gpasswd -a $USER docker```
- Either logout and then log back in, or run ```newgrp docker``` for the changes to take effect.
- Test this is working correctly
  - ```docker run hello-world```
- Install docker-compose using pip
  - ```apt install -y python python-pip``` (if pip and python are not installed)
  - ```pip install -U docker-compose```

## Add mDNS advertisement for MQTT server
- Create the file /etc/avahi/services/mqtt.service
- Paste this inside:
```
<?xml version="1.0" standalone='no'?>
<!DOCTYPE service-group SYSTEM "avahi-service.dtd">
<service-group>
 <name replace-wildcards="yes">MQTT on %h</name>
  <service>
   <type>_mqtt._tcp</type>
   <port>1883</port>
  </service>
</service-group>
```
# Working with homebridge
## We are using homebridge-mqtt
- Follow the API here: https://www.npmjs.com/package/homebridge-mqtt
