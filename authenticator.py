import hashlib
import hmac
import random
import string
import time

random.seed('123')

key = ''.join(random.choices(string.ascii_uppercase + string.digits, k=20))
hotp_counter = 1
time_step_size = 15

def print_key(key):
    print(f'{key[0:5]} {key[5:10]} {key[10:15]} {key[15:20]}')


def otp(key: str, msg):
    otp = int.from_bytes(hmac.new(key.encode(), str(msg).encode(), hashlib.sha256).digest())
    return otp % 10**6

def hotp(key, msg):
    global hotp_counter

    code = otp(key, msg)
    hotp_counter += 1

    return code


def totp(key):
    return otp(key, str((int(time.time()) // time_step_size)))

if __name__ == '__main__':
    while True:
        print("Choose authenticator mode\n")
        print("HOTP \t\t[1]")
        print("TOTP \t\t[2]")
        print("OCRA \t\t[3]")
        print("Close app \t[4]\n")
        mode = input("Enter your choice: ")
        print("====================\n")

        if mode == '1':
            while True:
                print("Your HOTP: ", end='')
                print(f"{hotp(key, hotp_counter):06d}")
                print("")
                print("Generate another [1]")
                print("Exit this mode   [2]\n")
                choice = input("Enter your choice: ")
                print("====================\n")
                if choice == '1':
                    continue
                elif choice == '2':
                    break

        elif mode == '2':
            while True:
                remaining_time = time_step_size - int(time.time() % time_step_size)
                print(f"\rTOTP: {totp(key):06d}\t Time Remaining: {remaining_time:02d}", end='')
                if remaining_time == 1:
                    print("\n====================\n")
                    break

        elif mode == '3':
            while True:
                challange = input("Please enter challange code: ")
                print("====================\n")
                print(f"OCRA: {otp(key, challange)}")
                print("")
                print("Generate another [1]")
                print("Exit this mode   [2]\n")
                choice = input("Enter your choice: ")
                print("====================\n")
                if choice == '1':
                    continue
                elif choice == '2':
                    break

        elif mode == '4':
            break

        else: print("No, ale nie ten przycisk no\n")
