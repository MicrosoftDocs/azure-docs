---
title: Quickstart - Install Ansible on Linux virtual machines in Azure | Microsoft Docs
description: In this quickstart, learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
ms.topic: quickstart
ms.service: ansible
author: tomarchermsft
manager: gwallace
ms.author: tarcher
ms.date: 04/30/2019
---

# Quickstart: Install Ansible on Linux virtual machines in Azure

Ansible allows you to automate the deployment and configuration of resources in your environment. This article shows how to configure Ansible for some of the most common Linux distros. To install Ansible on other distros, adjust the installed packages for your particular platform. 

## Prerequisites

[!INCLUDE [open-source-devops-prereqs-azure-sub.md](../../../includes/open-source-devops-prereqs-azure-subscription.md)]
[!INCLUDE [open-source-devops-prereqs-create-sp.md](../../../includes/open-source-devops-prereqs-create-service-principal.md)]
- **Access to Linux or a Linux virtual machine** -  If you don't have a Linux machine, create a [Linux virtual machine](/azure/virtual-network/quick-create-cli).

## Install Ansible on an Azure Linux virtual machine

Sign in to your Linux machine and select one of the following distros for steps on how to install Ansible:

- [CentOS 7.4](#centos-74)
- Ubuntu 16.04 LTS
- [SLES 12 SP2](#sles-12-sp2)

### CentOS 7.4

In this section, you configure CentOS to use Ansible.

1. Open a terminal window.

1. Enter the following command to install the required packages for the Azure Python SDK modules:

    ```bash
    sudo yum check-update; sudo yum install -y gcc libffi-devel python-devel openssl-devel epel-release
    sudo yum install -y python-pip python-wheel
    ```

1. Enter the following command to install the required packages Ansible:

    ```bash
    sudo pip install ansible[azure]
    ```

1. [Create the Azure credentials](#create-azure-credentials).

### Ubuntu 16.04 LTS

In this section, you configure Ubuntu to use Ansible.

1. Open a terminal window.

1. Enter the following command to install the required packages for the Azure Python SDK modules:

    ```bash
    sudo apt-get update && sudo apt-get install -y libssl-dev libffi-dev python-dev python-pip
    ```

1. Enter the following command to install the required packages Ansible:

    ```bash
    sudo pip install ansible[azure]
    ```

1. [Create the Azure credentials](#create-azure-credentials).

### SLES 12 SP2

In this section, you configure SLES to use Ansible.

1. Open a terminal window.

1. Enter the following command to install the required packages for the Azure Python SDK modules:

    ```bash
    sudo zypper refresh && sudo zypper --non-interactive install gcc libffi-devel-gcc5 make \
        python-devel libopenssl-devel libtool python-pip python-setuptools
    ```

1. Enter the following command to install the required packages Ansible:

    ```bash
    sudo pip install ansible[azure]
    ```

1. Enter the following command to remove conflicting Python cryptography package:

    ```bash
    sudo pip uninstall -y cryptography
    ```

1. [Create the Azure credentials](#create-azure-credentials).

## Create Azure credentials

To configure the Ansible credentials, you need the following information:

* Your Azure subscription ID 
* The service principal values

If you're using Ansible Tower or Jenkins, declare the service principal values as environment variables.

Configure the Ansible credentials using one of the following techniques:

- [Create an Ansible credentials file](#file-credentials)
- [Use Ansible environment variables](#env-credentials)

### <span id="file-credentials"/> Create Ansible credentials file

In this section, you create a local credentials file to provide credentials to Ansible. 

For more information about defining Ansible credentials, see [Providing Credentials to Azure Modules](https://docs.ansible.com/ansible/guide_azure.html#providing-credentials-to-azure-modules).

1. For a development environment, create a file named `credentials` on the host virtual machine:

    ```bash
    mkdir ~/.azure
    vi ~/.azure/credentials
    ```

1. Insert the following lines into the file. Replace the placeholders with the service principal values.

    ```bash
    [default]
    subscription_id=<your-subscription_id>
    client_id=<security-principal-appid>
    secret=<security-principal-password>
    tenant=<security-principal-tenant>
    ```

1. Save and close the file.

### <span id="env-credentials"/>Use Ansible environment variables

In this section, you export the service principal values to configure your Ansible credentials.

1. Open a terminal window.

1. Export the service principal values:

    ```bash
    export AZURE_SUBSCRIPTION_ID=<your-subscription_id>
    export AZURE_CLIENT_ID=<security-principal-appid>
    export AZURE_SECRET=<security-principal-password>
    export AZURE_TENANT=<security-principal-tenant>
    ```

## Verify the configuration

To verify the successful configuration, use Ansible to create an Azure resource group.

[!INCLUDE [create-resource-group-with-ansible.md](../../../includes/ansible-snippet-create-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Quickstart: Configure a Linux virtual machine in Azure using Ansible](./ansible-create-vm.md)