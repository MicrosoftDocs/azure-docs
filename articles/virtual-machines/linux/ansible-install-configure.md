---
title: Install and configure Ansible to manage virtual machines in Azure
description: Learn how to install and configure Ansible for managing Azure resources on Ubuntu, CentOS, and SLES
services: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 08/07/2018
ms.topic: article
---

# Install and configure Ansible to manage virtual machines in Azure

Ansible allows you to automate the deployment and configuration of resources in your environment. You can use Ansible to manage your virtual machines (VMs) in Azure, the same as you would any other resource. This article details how to install Ansible and the required Azure Python SDK modules for some of the most common Linux distros. You can install Ansible on other distros by adjusting the installed packages to fit your particular platform. To create Azure resources in a secure manner, you also learn how to create and define credentials for Ansible to use.

For more installation options and steps for additional platforms, see the [Ansible install guide](https://docs.ansible.com/ansible/intro_installation.html).

One of the easiest ways to use Ansible with Azure is with the Azure Cloud Shell, a browser-based shell experience to manage and develop Azure resources. Ansible is pre-installed in the Cloud Shell, you can follow []() to configure your Cloud Shell and try it. For a list of additional tools also available in the Cloud Shell, see [Features and tools for Bash in the Azure Cloud Shell](../../cloud-shell/features.md#tools).

The following instructions show you how to create a Linux VM for various distros and then install Ansible.

## Prerequisites
To manage Azure resources with Ansible, you need the following prerequisites:

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **Linux machine** -  If you don't have a Linux machine, create a [Linux virtual machine](/virtual-machines/linux/quick-create-cli.md) before you begin.

## Install Ansible

Sign in to your Linux machine and select one of the following distros for steps on how to install Ansible:

- [CentOS 7.4](#centos-74)
- [Ubuntu 16.04 LTS](#ubuntu1604-lts)
- [SLES 12 SP2](#sles-12-sp2)

### CentOS 7.4

Install the required packages for the Azure Python SDK modules and Ansible as follows:

```bash
## Install pre-requisite packages
sudo yum check-update; sudo yum install -y gcc libffi-devel python-devel openssl-devel epel-release
sudo yum install -y python-pip python-wheel

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]
```

Now move on to [Create Azure credentials](#create-azure-credentials).

### Ubuntu 16.04 LTS

Install the required packages for the Azure Python SDK modules and Ansible as follows:

```bash
## Install pre-requisite packages
sudo apt-get update && sudo apt-get install -y libssl-dev libffi-dev python-dev python-pip

## Install Ansible and Azure SDKs via pip
sudo pip install ansible[azure]
```

Now move on to [Create Azure credentials](#create-azure-credentials).

### SLES 12 SP2
Install the required packages for the Azure Python SDK modules and Ansible as follows:

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

In the Azure Cloud Shell or on your host machine if you installed [AZ CLI](), create a service principal. 

To authenticate to Azure, you need to obtain your Azure subscription ID using [az account show](/cli/azure/account#az-account-show):

```azurecli-interactive
az account show --query "{ subscription_id: id }"
```

If you want to change you workspace to another subscription, using [az account set]():

```azurecli-interactive
az account set -s <subscription-id>
```

Note the subscription ID.

Create a service principal using [az ad sp create-for-rbac](/cli/azure/ad/sp#az-ad-sp-create-for-rbac). The credentials that Ansible needs are output to the screen:

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

You use the output of this command together with subscription ID to configure Ansible credentials in either [file](#file-credentials) or [environment variable](#env-credentials) ways.

### <span id="file-credentials"/> Create Ansible credentials file

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

### <span id="env-credentials"/>Use Ansible environment variables

You can configure you Ansible credentials by exporting it as environment variable. If you are going to use tools such as Ansible Tower or Jenkins, you need to define environment variables:

```bash
export AZURE_SUBSCRIPTION_ID=xxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
export AZURE_CLIENT_ID=eec5624a-90f8-4386-8a87-02730b5410d5
export AZURE_SECRET=531dcffa-3aff-4488-99bb-4816c395ea3f
export AZURE_TENANT=72f988bf-86f1-41af-91ab-2d7cd011db47
```

## Verify
To verify the successful configuration, you can now use Ansible to create a resource group.

[!INCLUDE [create-resource-group-with-ansible.md](../../../includes/ansible-create-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Create a complete Azure VM and supporting resources with Ansible](ansible-create-complete-vm.md)