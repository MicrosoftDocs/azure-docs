---
title: Install Ansible on Azure virtual machines
description: Learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: quickstart
ms.date: 08/21/2018
---

# Install Ansible on Azure virtual machines

Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machines (VMs) in Azure, the same as you would any other resource. This article details how to install Ansible and the required Azure Python SDK modules for some of the most common Linux distros. You can install Ansible on other distros by adjusting the installed packages to fit your particular platform. To create Azure resources in a secure manner, you also learn how to create and define credentials for Ansible to use. For a list of additional tools available in the Cloud Shell, see [Features and tools for Bash in the Azure Cloud Shell](../../cloud-shell/features.md#tools).

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- **Access to Linux or a Linux virtual machine** -  If you don't have a Linux machine, create a [Linux virtual machine](https://docs.microsoft.com/azure/virtual-network/quick-create-cli).

- **Azure service principal**: Follow the directions in the section of the **Create the service principal** section in the article, [Create an Azure service principal with Azure CLI 2.0](/cli/azure/create-an-azure-service-principal-azure-cli?view=azure-cli-latest#create-the-service-principal). Take note of the values for the **appId**, **displayName**, **password**, and **tenant**.

## Install Ansible on an Azure Linux virtual machine

Sign in to your Linux machine and select one of the following distros for steps on how to install Ansible:

- [CentOS 7.4](#centos-74)
- [Ubuntu 16.04 LTS](#ubuntu1604-lts)
- [SLES 12 SP2](#sles-12-sp2)

### CentOS 7.4

Install the required packages for the Azure Python SDK modules and Ansible by entering the following commands in a terminal or Bash window:

```bash
## Install pre-requisite packages
sudo yum check-update; sudo yum install -y gcc libffi-devel python-devel openssl-devel epel-release
sudo yum install -y python-pip python-wheel

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]
```

Follow the instructions outlined in the section, [Create Azure credentials](#create-azure-credentials).

### Ubuntu 16.04 LTS

Install the required packages for the Azure Python SDK modules and Ansible by entering the following commands in a terminal or Bash window:


```bash
## Install pre-requisite packages
sudo apt-get update && sudo apt-get install -y libssl-dev libffi-dev python-dev python-pip

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]
```

Follow the instructions outlined in the section, [Create Azure credentials](#create-azure-credentials).

### SLES 12 SP2

Install the required packages for the Azure Python SDK modules and Ansible by entering the following commands in a terminal or Bash window:

```bash
## Install pre-requisite packages
sudo zypper refresh && sudo zypper --non-interactive install gcc libffi-devel-gcc5 make \
    python-devel libopenssl-devel libtool python-pip python-setuptools

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]

# Remove conflicting Python cryptography package
sudo pip uninstall -y cryptography
```

Follow the instructions outlined in the section, [Create Azure credentials](#create-azure-credentials).

## Create Azure credentials

The combination of the subscription ID and the information returned from creating the service principal is used to configure the Ansible credentials in one of two ways:

- [Create an Ansible credentials file](#file-credentials)
- [Use Ansible environment variables](#env-credentials)

If you are going to use tools such as Ansible Tower or Jenkins, you will need to use the option of declaring the service principal values as environment variables.

### <span id="file-credentials"/> Create Ansible credentials file

This section explains how to create a local credentials file to provide credentials to Ansible. For more information about how to define Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/guide_azure.html#providing-credentials-to-azure-modules).

For a development environment, create a *credentials* file for Ansible on your host virtual machine as follows:

```bash
mkdir ~/.azure
vi ~/.azure/credentials
```

Insert the following lines into the *credentials* file - replacing the placeholders with the information from the service principal creation.

```bash
[default]
subscription_id=<your-subscription_id>
client_id=<security-principal-appid>
secret=<security-principal-password>
tenant=<security-principal-tenant>
```

Save and close the file.

### <span id="env-credentials"/>Use Ansible environment variables

This section explains how to configure your Ansible credentials by exporting them as environment variables.

In a terminal or Bash window, enter the following commands:

```bash
export AZURE_SUBSCRIPTION_ID=<your-subscription_id>
export AZURE_CLIENT_ID=<security-principal-appid>
export AZURE_SECRET=<security-principal-password>
export AZURE_TENANT=<security-principal-tenant>
```

## Verify the configuration
To verify the successful configuration, you can now use Ansible to create a resource group.

[!INCLUDE [create-resource-group-with-ansible.md](../../../includes/ansible-create-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Use Ansible to create a Linux virtual machine in Azure](./ansible-create-vm.md)
