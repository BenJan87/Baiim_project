# Baiim project 2FA

## Instrukcja do strony internetowej

- Sklonuj repo

- Przydatne informacje znajdują się w pliku 2FA_teoria.ipynb,  
natomiast w pliku 2FA_praktyka.ipynb, znajdują się zadania z implementacji funkcji 2FA

- Zadania 1-3 są do wykonania [Tutaj](https://2fa-baiim.up.railway.app/)

## Zad 1. - zadanie rozgrzewkowe

**UWAGA** - przy rejestracji podany zostanie 'private_key', który wyświetli się jako alert.  
Zapisz go, będzie potrzebny do programu *authenticator.py*.

Kroki do wykonania zadania:

- zarejestruj się na stronie
- zapisz klucz prywatny do pliku private_key.txt (*jest w repo*)
- zaloguj się na stronie oraz zapisz flagę
- uruchom *authenticator.py* (./railway_website/authenticator.py)
- wybróbuj wszystkie możliwe logowania (hotp, totp oraz ocra)
- we wszystkich trzech zapisz flagi

Wszystkie flagi podeślij jako rozwiązanie zadań.

## Zad. 2 - implementacja OTP

W pliku 2FA_praktyka.ipynb należy zaimplementować funkcję pomocniczą generujące kody OTP.  
Dokładne instrukcje są podane jako komentarze w kodzie

## Zad. 3 - implementacja pozostałych funkcji

Podobnie jak w Zad. 2, zaimlpementuj pozostałe funkcje używając funkcji pomocniczej napisanej w Zad. 2

## Powodzenia!
