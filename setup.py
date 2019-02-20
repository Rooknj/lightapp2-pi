import os
import sys

if os.getuid():
  sys.exit('You need root access to install!')

os.system('clear')
print()
print()
print("#####################################")
print("##### Prysmalight Intial Setup  #####")
print("#####################################")
print()
print()
hostname = input("Would you like to change the hostname? [default: prysma]: ")
os.system('clear')
print()
print()
install_ans = input("Are you ready to commit changes to the system? [y/N]: ")

if(install_ans.lower() == 'y'):
	print("INstaalling")
else:
	print()
	print()
	print("======================================================")
	print("------------------------------------------------------")
	print()
	print("Prysmalight installation cancelled. Nothing changed...")
	print()
	print("------------------------------------------------------")
	print("======================================================")
	print()
	print()
	sys.exit()

os.system('clear')
print()
print()
print("#######################################")
print("##### Prysmalight Setup Complete  #####")
print("#######################################")
print()
print()
print("Initial setup is complete. A reboot is required to start...")
reboot_ans = input("Would you like to do that now? [y/N]: ")

if reboot_ans.lower() == 'y':
	os.system('reboot')