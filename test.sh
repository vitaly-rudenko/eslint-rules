#!/usr/bin/env bash

for file in eslint-plugins/**/*.test.js; do
    echo -e "\n\033[1m$(basename "$file" .test.js)\033[0m"
    node "$file"
done
