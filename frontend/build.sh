#!/usr/bin/env bash

# -e : exit immediately if any command failed
# -u : unset variables are an error
# -o pipefail : pipe return value is zero if all commands succeeded, otherwise the last non-zero exit
set -euo pipefail
# works for linux
CFLAGS="-g -std=c++11 -Wall -pedantic-errors"
gcc $CFLAGS -o linux-frontend.exe main.cpp -lncurses

