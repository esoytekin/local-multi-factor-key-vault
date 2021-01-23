Local Multi-Factor Key Vault
============================


# Introduction

Helps you keep your multifactor authentication keys locally and use them easily whenever you need them.

Contains a binary file [totp](https://github.com/esoytekin/totpbotgo) which is written in golang by me.

with the help of this binary you can get your authentication tokens using command line.

it is useful if you want to automate your tasks that involves tfa keys to login (connecting to a vpn service etc.)

# Installation

easiest way to start the application is using docker.

run `docker-compose up` and open `http:\\localhost:3000` in your browser.

# Usage

create and account using the web browser and modify username and password in `./config.example.json` according to your account.

create a folder under your home directory named `~/.totpbotgo` and copy `config.example.json` under this folder changing its name to `config.json`
which will be `~/.totpbotgo/config.json` and you are ready!

- to get token for a site

.\totp ticket <name_of_site>

- to get help about usage info

.\totp help

# Autocompletion

to enable auto completion copy `./bash_completion/totp` into `/etc/bash_completion.d/`
