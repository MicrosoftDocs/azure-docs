#!/bin/bash

origin="Azure"
if `git remote | grep $origin 2>&1`
then
echo "true"
else
echo "false"
fi

