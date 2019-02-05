Prysmalight-pi
===========================================

<p align="center">
  <img alt="Lightapp2-pi" src="./raspberry-pi-3.png" width="480">
</p>

<p align="center">
  The Docker-compose file to run lightapp2 on your rpi3
</p>

# How to run
- Make sure the Raspberry pi 3 is set up correctly (Section below)
- SSH into your raspberry pi (Default Password is PrysmaPi)
- Navigate to the lightapp2-pi folder
- Run ```docker-compose up -d``` and it should work
  - Note: This may take a while the first time as it needs to pull the images from docker cloud

# How to Upgrade
- SSH into your raspberry pi
- Navigate to the lightapp2-pi folder
- Run ```docker-compose pull```
  - Note: This may take a while as it needs to pull the images from docker cloud
  
# How to setup the Raspberry Pi 3
## Change Hostname
- Open Hosts File
  - ```sudo nano /etc/hosts```
  - Change raspberrypi to prysma
- Open Hostname File
  - ```sudo nano /etc/hostname```
  - Change raspberrypi to prysma
  
## Set up Headless Wifi Configuration
- TODO

## Clone the git repo or just download the file
- Update the RPI
  - ```sudo apt-get update```
  - ```sudo apt-get upgrade```
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
  - ```sudo apt install -y python python-pip``` (if pip and python are not installed)
  - ```sudo pip install -U docker-compose```

## Set up Node Update Server
- Install Node
  - ```curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -```
  - ```sudo apt-get install -y nodejs```
- Test to see if node is working
  - ```node -v```
- Install Yarn
  - ```curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -```
  - ```echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list```
  - ```sudo apt-get update && sudo apt-get install yarn```
- Test to see if yarn is working
  - ```yarn -v```
- Install yarn packages
  - ```yarn install``` (in the UpdateServer directory)
- Install Forever Globally
  - ```sudo yarn global add forever```
- Run on startup
  - Create the service file
  - ```sudo nano /etc/init.d/update-server```
  - Paste this inside:
  ```
  #!/bin/sh
  #/etc/init.d/update-service
  ### BEGIN INIT INFO
  # Provides:          update-service
  # Required-Start:    $remote_fs $syslog
  # Required-Stop:     $remote_fs $syslog
  # Default-Start:     2 3 4 5
  # Default-Stop:      0 1 6
  # Short-Description: Start daemon at boot time
  # Description:       Enable service provided by daemon.
  ### END INIT INFO
  export PATH=$PATH:/home/pi/prysmalight-pi/UpdateServer
  export NODE_PATH=$NODE_PATH:/home/pi/.config/yarn/global/node_modules

  case "$1" in
  start)
  exec forever --sourceDir=/home/pi/prysmalight-pi/UpdateServer/src index.js
  ;;
  stop)
  exec forever stop --sourceDir=/home/pi/prysmalight-pi/UpdateServer/src index.js
  ;;
  *)
  echo "Usage: /etc/init.d/myService {start|stop}"
  exit 1
  ;;
  esac
  exit 0
  ```
  - Make the file executable
  - ```sudo chmod 755 /etc/init.d/update-server```
  - Test to make sure it works
  - ```sh /etc/init.d/update-server start/stop```
  - Make it bootable
  - ```sudo update-rc.d update-server defaults```
  - (To remove it from boot)
  - ```sudo update-rc.d -f update-server remove```
  


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
- Reboot to take effect
# Working with homebridge
## Homebridge User Interface
- Located at prysma.local:8080
- default user and pass: admin

## We are using homebridge-mqtt to interface with homekit
- Follow the API here: https://www.npmjs.com/package/homebridge-mqtt
- Service and characteristic names defined here : https://github.com/KhaosT/HAP-NodeJS/blob/master/lib/gen/HomeKitTypes.js

## Adding a light to homekit
- Publish this to prysmalight/to/add
```
{
  "name": "<Device ID>",
  "service_name": "<Display Name>",
  "service": "Lightbulb",
  "Brightness": "default",
  "Hue": "default",
  "Saturation": "default"
}
```

## Removing a light from homekit
- Publish this to prysmalight/to/remove
```
{
  "name": "<Device ID>"
}
```

## Add homebridge to homekit
- SSH into your raspberry pi 3
- Navigate to the prysmalight-pi folder
- Run ```docker ps```
- Find the correct container id for the homekit container
- Run ```docker logs <CONTAINER-ID>```
- Find the homekit QR code and add it
