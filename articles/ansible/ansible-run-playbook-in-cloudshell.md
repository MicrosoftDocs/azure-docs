---
title: Quickstart - Run Ansible playbooks via Bash in Azure Cloud Shell | Microsoft Docs
description: In this quickstart, learn how to carry out various Ansible tasks with Bash in Azure Cloud Shell
keywords: ansible, azure, devops, bash, cloudshell, playbook, bash
ms.topic: quickstart
ms.service: ansible
author: tomarchermsft
manager: jeconnoc
ms.author: tarcher
ms.date: 04/04/2019
---

# Quickstart: Run Ansible playbooks via Bash in Azure Cloud Shell

Azure Cloud Shell is an interactive, browser-accessible shell for managing Azure resources. Cloud Shell provides enables you to use either a Bash or Powershell command line. In this article, you use Bash within Azure Cloud Shell to run an Ansible playbook.

## Prerequisites

- [!INCLUDE [open-source-devops-prereqs-azure-sub.md](../../includes/open-source-devops-prereqs-azure-sub.md)]
- **Configure Azure Cloud Shell** - If you are new to Azure Cloud Shell, see [Quickstart for Bash in Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/quickstart).
[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Automatic credential configuration

When signed into the Cloud Shell, Ansible authenticates with Azure to manage infrastructure without any additional configuration. If you have more than one subscription, you can choose which subscription Ansible uses by exporting the `AZURE_SUBSCRIPTION_ID` environment variable. To list all of your Azure subscriptions, run the following command:

```azurecli-interactive
az account list
```

Using your Azure subscription ID, set the `AZURE_SUBSCRIPTION_ID` as follows:

```azurecli-interactive
export AZURE_SUBSCRIPTION_ID=<your-subscription-id>
```

## Verify the configuration
To verify the successful configuration, use Ansible to create a resource group.

[!INCLUDE [create-resource-group-with-ansible.md](../../includes/ansible-create-resource-group.md)]

## Next steps

> [!div class="nextstepaction"] 
> [Quickstart: Configure virtual machine in Azure using Ansible](/azure/virtual-machines/linux/ansible-create-vm)