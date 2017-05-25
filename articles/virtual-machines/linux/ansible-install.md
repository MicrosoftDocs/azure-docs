---
title: Install Ansible for use with Azure virtual machines | Microsoft Docs
description: Learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and OpenSUSE
services: virtual-machines-linux
documentationcenter: virtual-machines
author: iainfoulds
manager: timlt
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/23/2017
ms.author: iainfou
---

## Ubuntu 16.04 LTS

```bash
az vm create -n myVMAnsible -g myResourceGroupAnsible --image UbuntuLTS --admin-username azureuser --generate-ssh-keys

## Install pre-requisite packages
sudo apt-get update && sudo apt-get install -y libssl-dev libffi-dev python-dev python-pip

## Install Azure SDKs via pip
pip install "azure==2.0.0rc5" msrestazure

## Install Ansible via apt
sudo apt-get install -y software-properties-common
sudo apt-add-repository -y ppa:ansible/ansible
sudo apt-get update && sudo apt-get install -y ansible
```


## CentOS 7.3

```bash
az vm create -n myVMAnsible -g myResourceGroup --image CentOS --admin-username azureuser --generate-ssh-keys

## Install pre-requisite packages
sudo yum check-update; sudo yum install -y gcc libffi-devel python-devel openssl-devel epel-release
sudo yum install -y python-pip python-wheel

## Install Azure SDKs via pip
sudo pip install "azure==2.0.0rc5" msrestazure

## Install Ansible via yum
sudo yum install -y ansible
```


## SLES 12.2 SP2

```bash
az vm create -n myVMAnsible -g myResourceGroupAnsible --image openSUSE-LEAP --admin-username azureuser --generate-ssh-keys

## Install pre-requisite packages
sudo zypper refresh && sudo zypper --non-interactive install gcc libffi-devel-gcc5 python-devel libopenssl-devel python-pip python-setuptools python-azure-sdk

## Install Ansible via zypper
sudo zypper addrepo http://download.opensuse.org/repositories/systemsmanagement/SLE_12_SP2/systemsmanagement.repo
sudo zypper refresh && sudo zypper install ansible
```