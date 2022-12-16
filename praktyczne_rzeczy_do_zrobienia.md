# Praktyczne rzeczy do zrobienia

## 0.) Wygenerowanie emaila:
- [Tutaj wygeneruj swojego emaila!](https://tempmail.email)
- **UWAGA** - dodatkowa instrukcja - to dobrze bo więcej czasu zjamie <3

## 1.) Stworzenie strony dla użytkownika (strona z nartami)

- Basicowy wygląd strony 
- Logowanie, rejestracja
- Strona generuje prywatny klucz i dzieli go z serwerem
- Opcja odzyskiwanie hasła

## 2.) Serwer:

- Bazę danych z hashami:
    - haseł
    - maili (bez hashy)
    - tymczasowe kody TOTP (Time-Based One Time Password)
    - Kody HOTP (HMAC-Based One Time Password)
    - OCRA (OATH Challenge-Response Algorithm)
    - Klucze jednorazowego użytku (podawane przy rejestracji)

- Posiada klucz prywatny (Diffie-Hellman)

- Counter, zwiększa się kiedy HOPT będzie się zgadzał

## 3.) 2FA:

1. mail z kodem:    

- fdsgfd
- fsdfd 
    
2. 