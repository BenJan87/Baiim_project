# Praktyczne rzeczy do zrobienia

## 0.) Wygenerowanie emaila:
- [Tutaj wygeneruj swojego emaila!](https://tempmail.email)
- **UWAGA** - dodatkowa instrukcja - to dobrze bo więcej czasu zjamie <3

## 1.) Stworzenie strony dla użytkownika (strona z nartami)

- Basicowy wygląd strony 
- Logowanie, rejestracja
- Strona generuje prywatny klucz i dzieli go z serwerem
- Opcja odzyskiwanie hasła - to jest gówno

## 2.) Serwer:

- Bazę danych z hashami:
    - haseł
    - maili (bez hashy)
    - tymczasowe kody TOTP (Time-Based One Time Password)
    - Kody HOTP (HMAC-Based One Time Password)
    - OCRA (OATH Challenge-Response Algorithm)
    - Klucze jednorazowego użytku (podawane przy rejestracji)

- Posiada klucz prywatny (Diffie-Hellman)

- Counter, zwiększa się kiedy HOTP będzie się zgadzał

## 3.) 2FA:

1. OCRA
    
2. TOTP - czasowa zmiana haseł

    - po zarejstrowaniu będzie prywanty klucz
    - jego trzeba zapisać (hashowanie - coś tam MArcel napiszę aplikację)
    - za pomocą tego klucza prywatnego bedzie link do strony gdzie będą klucze czasowe generowane
    - za pomocą tych kluczy czasowych, baza danych będzie się zmieniała -> sprwadzanie czy klucz czasowy wpisany przez użytkownika będzie taki sam jak w bazie danych
    - access albo denied 

    - dla cyberki - do napsiania program, który będzie generował te klucze czasowe

3. HOTP - jednorazowe hasło wysyłane na maila

    - funkcja z seedem
    - instukcja do implementacji
    - prosta implementacja w pythonie (dodatkowa bilbioteka do hashy)

4. Hardware - ?