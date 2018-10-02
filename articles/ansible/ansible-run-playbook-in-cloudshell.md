---
title: Run Ansible with Bash in Azure Cloud Shell
description: Learn how to perform various Ansible tasks with Bash in Azure Cloud Shell
ms.service: ansible
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.date: 08/07/2018
ms.topic: article
---

# Run Ansible with Bash in Azure Cloud Shell

In this tutorial, you learn how to use Bash within Cloud Shell to configure an Azure subscription as your Ansible workspace. 

## Prerequisites

- **Azure subscription** - If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).

- **Configure Azure Cloud Shell** - If you are new to Azure Cloud Shell, the article, [Quickstart for Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart), illustrates how to start and configure Cloud Shell. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Automatic credential configuration

When signed into the Cloud Shell, Ansible authenticates with Azure to manage infrastructure without any additional configuration. If you have more than one subscription, you can choose which subscription Ansible should work with by exporting the `AZURE_SUBSCRIPTION_ID` environment variable. To list all of your Azure subscriptions, run the following command:

```azurecli-interactive
az account list
```

Using the **id** of the subscription with which you want to work, set the **AZURE_SUBSCRIPTION_ID** as follows:

```azurecli-interactive
export AZURE_SUBSCRIPTION_ID=<your-subscription-id>
```

## Verify the configuration
To verify the successful configuration, use Ansible to create a resource group.

[!INCLUDE [create-resource-group-with-ansible.md](../../includes/ansible-create-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Create a basic virtual machine in Azure with Ansible](/azure/virtual-machines/linux/ansible-create-vm)