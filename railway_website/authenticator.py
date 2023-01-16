import hashlib
import hmac
import random
import time
import os

random.seed('123')


hotp_counter = 0
time_step_size = 30

def print_key(key):
    print(f'{key[0:5]} {key[5:10]} {key[10:15]} {key[15:20]}')


def otp(key: str, msg):
    otp = int.from_bytes(hmac.new(key.encode(), str(msg).encode(), hashlib.sha256).digest()[-4:])
    return otp % 10**6

def hotp(key, msg):
    global hotp_counter

    code = otp(key, msg)
    hotp_counter += 1

    return code


def totp(key):
    return otp(key, str((int(time.time()) // time_step_size)))

if __name__ == '__main__':

    with open(os.path.join(os.path.dirname(os.path.relpath(__file__)), "private_key.txt")) as file:
        key = file.readline()

    if not key:
        print("\n\033[31m!!!   WARNING   !!!\n\033[0m")
        print("You have to first save your private key to the private_key.txt file")
        print("It has to be in the same directory as the authenticator.py app\n")
        exit()

    while True:
        print("Choose authenticator mode\n")
        print("HOTP \t\t[1]")
        print("TOTP \t\t[2]")
        print("OCRA \t\t[3]")
        print("Close app \t[4]\n")
        mode = input("Enter your choice: ")
        print("\033[36m====================\n\033[0m")

        if mode == '1':
            while True:
                print("Your HOTP: ", end='')
                print(f"\033[33m{hotp(key, hotp_counter):06d}\033[0m")
                print("")
                print("Generate another [1]")
                print("Exit this mode   [2]\n")
                choice = input("Enter your choice: ")
                print("\033[36m====================\n\033[0m")
                if choice == '1':
                    continue
                elif choice == '2':
                    break

        elif mode == '2':
            while True:
                remaining_time = time_step_size - int(time.time() % time_step_size)
                print(f"\rTOTP: \033[33m{totp(key):06d}\033[0m\t Time Remaining: \033[32m{remaining_time:02d}\033[0m", end='')
                if remaining_time == 1:
                    print("\033[36m\n\n====================\n\033[0m")
                    break

        elif mode == '3':
            while True:
                challange = input("Please enter challange code: ")
                print("\033[36m\n====================\n\033[0m")
                print(f"OCRA: \033[33m{otp(key, challange)}\033[0m")
                print("")
                print("Generate another [1]")
                print("Exit this mode   [2]\n")
                choice = input("Enter your choice: ")
                print("\033[36m====================\n\033[0m")
                if choice == '1':
                    continue
                elif choice == '2':
                    break

        elif mode == '4':
            break

        else: print("\033[32mNo, ale nie ten przycisk no\n\033[0m")
