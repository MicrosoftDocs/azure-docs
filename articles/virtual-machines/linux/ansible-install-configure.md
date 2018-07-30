---
title: Install and configure Ansible for use with Azure virtual machines | Microsoft Docs
description: Learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
services: virtual-machines-linux
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 05/04/2018
ms.author: cynthn
---

# Install and configure Ansible to manage virtual machines in Azure

Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machines (VMs) in Azure, the same as you would any other resource. This article details how to install Ansible and the required Azure Python SDK modules for some of the most common Linux distros. You can install Ansible on other distros by adjusting the installed packages to fit your particular platform. To create Azure resources in a secure manner, you also learn how to create and define credentials for Ansible to use.

For more installation options and steps for additional platforms, see the [Ansible install guide](https://docs.ansible.com/ansible/intro_installation.html).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

If you choose to install and use the CLI locally, this article requires that you are running the Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI 2.0]( /cli/azure/install-azure-cli).

## Install Ansible

One of the easiest ways to use Ansible with Azure is with the Azure Cloud Shell, a browser-based shell experience to manage and develop Azure resources. Ansible is pre-installed in the Cloud Shell, so you can skip instructions on how to install Ansible and go to [Create Azure credentials](#create-azure-credentials). For a list of additional tools also available in the Cloud Shell, see [Features and tools for Bash in the Azure Cloud Shell](../../cloud-shell/features.md#tools).

The following instructions show you how to create a Linux VM for various distros and then install Ansible. If you don't need to create a Linux VM, skip this first step to create an Azure resource group. If you do need to create a VM, first create a resource group with [az group create](/cli/azure/group#az_group_create). The following example creates a resource group named *myResourceGroup* in the *eastus* location:

```azurecli
az group create --name myResourceGroup --location eastus
```

Now, select one of the following distros for steps on how to create a VM, if needed, and then install Ansible:

- [CentOS 7.4](#centos-74)
- [Ubuntu 16.04 LTS](#ubuntu1604-lts)
- [SLES 12 SP2](#sles-12-sp2)

### CentOS 7.4

If needed, create a VM with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named *myVMAnsible*:

```azurecli
az vm create \
    --name myVMAnsible \
    --resource-group myResourceGroup \
    --image OpenLogic:CentOS:7.4:latest \
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

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]
```

Now move on to [Create Azure credentials](#create-azure-credentials).

### Ubuntu 16.04 LTS

If needed, create a VM with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named *myVMAnsible*:

```azurecli
az vm create \
    --name myVMAnsible \
    --resource-group myResourceGroup \
    --image Canonical:UbuntuServer:16.04-LTS:latest \
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

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]
```

Now move on to [Create Azure credentials](#create-azure-credentials).

### SLES 12 SP2

If needed, create a VM with [az vm create](/cli/azure/vm#az_vm_create). The following example creates a VM named *myVMAnsible*:

```azurecli
az vm create \
    --name myVMAnsible \
    --resource-group myResourceGroup \
    --image SUSE:SLES:12-SP2:latest \
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
sudo zypper refresh && sudo zypper --non-interactive install gcc libffi-devel-gcc5 make \
    python-devel libopenssl-devel libtool python-pip python-setuptools

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]

# Remove conflicting Python cryptography package
sudo pip uninstall -y cryptography
```

Now move on to [Create Azure credentials](#create-azure-credentials).

## Create Azure credentials

Ansible communicates with Azure using a username and password or a service principal. An Azure service principal is a security identity that you can use with apps, services, and automation tools like Ansible. You control and define the permissions as to what operations the service principal can perform in Azure. To improve security over just providing a username and password, this example creates a basic service principal.

On your host computer or in the Azure Cloud Shell, create a service principal using [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac). The credentials that Ansible needs are output to the screen:

```azurecli-interactive
az ad sp create-for-rbac --query '{"client_id": appId, "secret": password, "tenant": tenant}'
```

An example of the output from the preceding commands is as follows:

```json
{
  "client_id": "eec5624a-90f8-4386-8a87-02730b5410d5",
  "secret": "531dcffa-3aff-4488-99bb-4816c395ea3f",
  "tenant": "72f988bf-86f1-41af-91ab-2d7cd011db47"
}
```

To authenticate to Azure, you also need to obtain your Azure subscription ID using [az account show](/cli/azure/account#az-account-show):

```azurecli-interactive
az account show --query "{ subscription_id: id }"
```

You use the output from these two commands in the next step.

## Create Ansible credentials file

To provide credentials to Ansible, you define environment variables or create a local credentials file. For more information about how to define Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/guide_azure.html#providing-credentials-to-azure-modules).

For a development environment, create a *credentials* file for Ansible on your host VM. Create a credentials file on the VM where you installed Ansible in a previous step:

```bash
mkdir ~/.azure
vi ~/.azure/credentials
```

The *credentials* file itself combines the subscription ID with the output of creating a service principal. Output from the previous [az ad sp create-for-rbac](/cli/azure/ad/sp#create-for-rbac) command is the same as needed for *client_id*, *secret*, and *tenant*. The following example *credentials* file shows these values matching the previous output. Enter your own values as follows:

```bash
[default]
subscription_id=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
client_id=eec5624a-90f8-4386-8a87-02730b5410d5
secret=531dcffa-3aff-4488-99bb-4816c395ea3f
tenant=72f988bf-86f1-41af-91ab-2d7cd011db47
```

Save and close the file.

## Use Ansible environment variables

If you are going to use tools such as Ansible Tower or Jenkins, you need to define environment variables. This step can be skipped if you are just going to use the Ansible client and the Azure credentials file created in the previous step. Environment variables define the same information as the Azure credentials file:

```bash
export AZURE_SUBSCRIPTION_ID=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export AZURE_CLIENT_ID=eec5624a-90f8-4386-8a87-02730b5410d5
export AZURE_SECRET=531dcffa-3aff-4488-99bb-4816c395ea3f
export AZURE_TENANT=72f988bf-86f1-41af-91ab-2d7cd011db47
```

## Next steps

You now have Ansible and the required Azure Python SDK modules installed, and credentials defined for Ansible to use. Learn how to [create a VM with Ansible](ansible-create-vm.md). You can also learn how to [create a complete Azure VM and supporting resources with Ansible](ansible-create-complete-vm.md).
