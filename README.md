# react-uikit

# Install

cd src
git submodule add https://github.com/trananhpm94/react-uikit.git
git config submodule.react-uikit.ignore all
git config --local push.recursesubmodules no
# udpate

cd src/react-uikit
git pull <remote> <branch>
Ex: git pull origin master

# How to use

npm install "./react-uikit"
or
yarn add "./react-uikit"
or edit package.json in block "dependencies" add
"react-uikit": "file:./react-uikit"
