---
title: Install and configure Ansible for use with Azure virtual machines | Microsoft Docs
description: Learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
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
ms.date: 05/25/2017
ms.author: iainfou
---

# Install and configure Ansible to manage virtual machines in Azure
This article details how to install Ansible and required Azure Python SDK modules for some of the most common Linux distros. You can install Ansible on other distros by adjusting the installed packages to fit your particular platform. To create Azure resources in a secure manner, you also learn how to create and define credentials for Ansible to use. 

For more installation options and steps for additional platforms, see the [Ansible install guide](https://docs.ansible.com/ansible/intro_installation.html).


## Install Ansible
First, create a resource group with [az group create](/cli/azure/group#create). The following example creates a resource group named *myResourceGroupAnsible* in the *eastus* location:

```azurecli
az group create --name myResourceGroupAnsible --location eastus
```

Now create a VM and install Ansible for one of the following distros:

- [Ubuntu 16.04 LTS](#ubuntu1604-lts)
- [CentOS 7.3](#centos-73)
- [SLES 12.2 SP2](#sles-122-sp2)

### Ubuntu 16.04 LTS
Create a VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVMAnsible*:

```bash
az vm create \
    --name myVMAnsible \
    --resource-group myResourceGroupAnsible \
    --image UbuntuLTS \
    --admin-username azureuser \
    --generate-ssh-keys
```

SSH to your VM using the `publicIpAddress` noted in the output from the VM create operation:

```bash
ssh azureuser@<publicIpAddress>
```

On your VM, install the required packages for the Azure Python SDK modules and Ansible as follows:

```bash
## Install pre-requisite packages
sudo apt-get update && sudo apt-get install -y libssl-dev libffi-dev python-dev python-pip

## Install Azure SDKs via pip
pip install "azure==2.0.0rc5" msrestazure

## Install Ansible via apt
sudo apt-get install -y software-properties-common
sudo apt-add-repository -y ppa:ansible/ansible
sudo apt-get update && sudo apt-get install -y ansible
```

Now move on to [Create Azure credentials](#create-azure-credentials).


### CentOS 7.3
Create a VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVMAnsible*:

```bash
az vm create \
    --name myVMAnsible \
    --resource-group myResourceGroupAnsible \
    --image CentOS \
    --admin-username azureuser \
    --generate-ssh-keys
```

SSH to your VM using the `publicIpAddress` noted in the output from the VM create operation:

```bash
ssh azureuser@<publicIpAddress>
```

On your VM, install the required packages for the Azure Python SDK modules and Ansible as follows:

```bash
## Install pre-requisite packages
sudo yum check-update; sudo yum install -y gcc libffi-devel python-devel openssl-devel epel-release
sudo yum install -y python-pip python-wheel

## Install Azure SDKs via pip
sudo pip install "azure==2.0.0rc5" msrestazure

## Install Ansible via yum
sudo yum install -y ansible
```

Now move on to [Create Azure credentials](#create-azure-credentials).


### SLES 12.2 SP2
Create a VM with [az vm create](/cli/azure/vm#create). The following example creates a VM named *myVMAnsible*:

```bash
az vm create \
    --name myVMAnsible \
    --resource-group myResourceGroupAnsible \
    --image SLES \
    --admin-username azureuser \
    --generate-ssh-keys
```

SSH to your VM using the `publicIpAddress` noted in the output from the VM create operation:

```bash
ssh azureuser@<publicIpAddress>
```

On your VM, install the required packages for the Azure Python SDK modules and Ansible as follows:

```bash
## Install pre-requisite packages
sudo zypper refresh && sudo zypper --non-interactive install gcc libffi-devel-gcc5 python-devel \
    libopenssl-devel python-pip python-setuptools python-azure-sdk

## Install Ansible via zypper
sudo zypper addrepo http://download.opensuse.org/repositories/systemsmanagement/SLE_12_SP2/systemsmanagement.repo
sudo zypper refresh && sudo zypper install ansible
```

Now move on to [Create Azure credentials](#create-azure-credentials).


## Create Azure credentials
Ansible communicates with Azure using a username and password or a service principal. An Azure service principal is a security identity that you can use with apps, services, and automation tools like Ansible. You control and define the permissions as to what operations the service principal can perform in Azure. To improve security over just providing a username and password, this example creates a basic service principal.

Create a service principal with [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) and output the credentials that Ansible needs:

```azurecli
az ad sp create-for-rbac --query [appId,password,tenant]
```

An example of the output from the preceding commands is as follows:

```json
[
  "eec5624a-90f8-4386-8a87-02730b5410d5",
  "531dcffa-3aff-4488-99bb-4816c395ea3f",
  "72f988bf-86f1-41af-91ab-2d7cd011db47"
]
```

To authenticate to Azure, you also need to obtain your Azure subscription ID with [az account show](/cli/azure/account#show):

```azurecli
az account show --query [id] --output tsv
```

You use the output from these two commands in the next step.


## Create Ansible credentials file
To provide credentials to Ansible, you define environment variables or create a local credentials file. For more information about how to define Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/guide_azure.html#providing-credentials-to-azure-modules). 

For a development environment, create a *credentials* file for Ansible on your host VM as follows:

```bash
mkdir ~/.azure
vi ~/.azure/credentials
```

The *credentials* file itself combines the subscription ID with the output of creating a service principal. Output from the previous [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) command is the same order as needed for *client_id*, *secret*, and *tenant*. The following example *credentials* file shows these values matching the previous output. Enter your own values as follows:

```bash
[default]
subscription_id=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
client_id=66cf7166-dd13-40f9-bca2-3e9a43f2b3a4
secret=b8326643-f7e9-48fb-b0d5-952b68ab3def
tenant=72f988bf-86f1-41af-91ab-2d7cd011db47
```


## Use Ansible environment variables
If you are going to use tools such as Ansible Tower or Jenkins, you can define environment variables as follows. These variables combine the subscription ID with the output from creating a service principal. Output from the previous [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) command is the same order as needed for *AZURE_CLIENT_ID*, *AZURE_SECRET*, and *AZURE_TENANT*. 

```bash
export AZURE_SUBSCRIPTION_ID=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export AZURE_CLIENT_ID=66cf7166-dd13-40f9-bca2-3e9a43f2b3a4
export AZURE_SECRET=8326643-f7e9-48fb-b0d5-952b68ab3def
export AZURE_TENANT=72f988bf-86f1-41af-91ab-2d7cd011db47
```

## Next steps
You now have Ansible and the required Azure Python SDK modules installed, and credentials defined for Ansible to use. Learn how to [create a VM with Ansible](ansible-create-vm.md). You can also learn how to [create a complete Azure VM and supporting resources with Ansible](ansible-create-complete-vm.md).