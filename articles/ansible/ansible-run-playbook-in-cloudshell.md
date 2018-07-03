---
title: Run Ansible with Bash in Azure Cloud Shell
description: Learn how to perform various Ansible tasks with Bash in Azure Cloud Shell
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: routlaw
ms.author: tarcher
ms.date: 02/01/2018
ms.topic: article
---

# Run Ansible with Bash in Azure Cloud Shell

In this tutorial, you learn how to perform various Ansible tasks from Bash in Cloud Shell. These tasks include connecting to a virtual machine, and creating Ansible playbooks to create and delete an Azure resource group.

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

- **Configure Azure Cloud Shell** - If you are new to Azure Cloud Shell, the article [Quickstart for Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart) illustrates how to start and configure Cloud Shell. Launch a dedicated website for Cloud Shell here:


[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

[![Launch Cloud Shell](https://shell.azure.com/images/launchcloudshell.png "Launch Cloud Shell")](https://shell.azure.com)

## Automatic credential configuration
Ansible authenticates with Azure when logged in to the Cloud Shell to manage infrastructure without any additional configuration. If you have more than one subscriptions, you can choose which subscription Ansible should work with by export `AZURE_SUBSCRIPTION_ID` environment variable. To list all subscriptions, run:

```azurecli-interactive
az account list
```
Note the `id` of the subscription you want to work, and then set `AZURE_SUBSCRIPTION_ID`:

```azurecli-interactive
export AZURE_SUBSCRIPTION_ID=<your-subscription-id>
```

## Verify
To verify the succesful configuration, you can now use Ansible to create a resource group.

[!INCLUDE [create-resource-group-with-ansible.md](../../../includes/ansible-create-resource-group.md)]

## Next steps

You now have Ansible configured on Cloud Shell. Learn how to [create a complete Azure VM and supporting resources with Ansible](ansible-create-complete-vm.md).
