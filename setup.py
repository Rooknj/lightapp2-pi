import os
import sys
import setup_funcs

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
hostname = input("Would you like to enter a hostname? [default: prysma2]: ")
print()
password = input("Would you like to enter a password? [default: PrysmaPi]: ")
os.system('clear')
print()
print()
install_ans = input("Are you ready to commit changes to the system? [y/N]: ")

if(install_ans.lower() == 'y'):
  setup_funcs.setup_hostname(hostname)
  setup_funcs.setup_password(password)
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

# os.system('clear')
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