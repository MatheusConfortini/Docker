#!/bin/bash

THIS_DIR=$(dirname "$0")
THIS_DIR=$(realpath "$THIS_DIR")


build() {
    cd  $THIS_DIR/acbrlib-nodejs/acbrlib-node-comum
    npm i
    npm run build
    npx yalc publish
    
    cd $THIS_DIR/acbrlib-nodejs/acbrlibnfe-node
    npm i 
    npx yalc add acbrlib-comum
    npm run build
    npx yalc publish
    
    cd $THIS_DIR/acbrlib-nodejs/acbrlibmdfe-node && \
    npm i
    npx yalc add acbrlib-comum
    npm run build
    npx yalc publish
    
    cd $THIS_DIR/acbrlib-nodejs/acbrlibcep-node
    npm i
    npx yalc add acbrlib-comum
    npm run build
    npx yalc publish
    
    cd $THIS_DIR
    npx yalc add acbrlib-comum
    npx yalc add acbrlibnfe-node
    npx yalc add acbrlibmdfe-node
    npx yalc add acbrlibcep-node
    npm i
}

clean_submodules(){
    rm -rf node_modules
    rm dist -rf
    rm  -f package-lock.json
    rm -f yalc.lock
    rm -f yalc-local.json
    rm -rf .yalc
}
clean(){
    cd $THIS_DIR
    npx yalc remove acbrlib-comum
    npx yalc remove acbrlibnfe-node
    npx yalc remove acbrlibmdfe-node
    npx yalc remove acbrlibcep-node
    npx yalc remove acbrlib-comum
    clean_submodules

    
    cd $THIS_DIR/acbrlib-nodejs/acbrlib-node-comum
    clean_submodules

    cd $THIS_DIR/acbrlib-nodejs/acbrlibnfe-node
    npx yalc remove acbrlib-comum
    clean_submodules

    cd $THIS_DIR/acbrlib-nodejs/acbrlibmdfe-node
    npx yalc remove acbrlib-comum
    clean_submodules

    cd $THIS_DIR/acbrlib-nodejs/acbrlibcep-node
    npx yalc remove acbrlib-comum
    clean_submodules

    cd $THIS_DIR/acbrlib-nodejs/acbrlibnfe-node
    npx yalc remove acbrlib-comum
    clean_submodules

    cd $THIS_DIR/acbrlib-nodejs/acbrlibmdfe-node
    npx yalc remove acbrlib-comum
    clean_submodules

    cd $THIS_DIR/acbrlib-nodejs/acbrlibcep-node
    npx yalc remove acbrlib-comum
    clean_submodules

  
}

case "$1" in
"build")
    build
    ;;
"clean")
    clean

;;
*)
    echo "Usage: $0 {build|clean}"
    exit 1
    ;;
esac



