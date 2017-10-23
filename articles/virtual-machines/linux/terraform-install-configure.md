---
title: Install and configure Terraform to provision VMs and other infrastructure in Azure | Microsoft Docs
description: Learn how to install and configure Terraform to create Azure resources
services: virtual-machines-linux
documentationcenter: virtual-machines
author: echuvyrov
manager: jtalkar
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 10/23/2017
ms.author: echuvyrov
---

# Install and configure Terraform to provision VMs and other infrastructure into Azure
 
This article describes the necessary steps to use Terraform to provision resources in Azure. You learn how to create and use Azure credentials to enable Terraform to provision cloud resources in a secure manner.

HashiCorp Terraform provides an easy way to define and deploy cloud infrastructure by using a custom templating language called HashiCorp configuration language (HCL). This custom language is [easy to write and easy to understand](terraform-create-complete-vm.md). Additionally, by using the `terraform plan` command, you can visualize the changes to your infrastructure before you commit them. Follow these steps to start using Terraform with Azure.

## Install Terraform

> [!TIP]
> Terraform is part of the [Azure Cloud Shell Bash experience](/azure/cloud-shell/quickstart), and is preconfigured with credentials and [Azure Terraform modules](https://registry.terraform.io/modules/Azure).

To install Terraform, [download](https://www.terraform.io/downloads.html) the package appropriate for your operating system into a separate install directory. The download contains a single executable file, for which you should also define a global path. For instructions on how to set the path on Linux and Mac, go to [this webpage](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux). For instructions on how to set the path on Windows, go to [this webpage](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows). To verify your installation, run the `terraform` command. You should see a list of available Terraform options as output:

```
azureuser@Azure:~$ terraform
Usage: terraform [--version] [--help] <command> [args]
```

## Set up Terraform access to Azure

Configure [an Azure AD service principal](/cli/azure/create-an-azure-service-principal-azure-cli) to enable Terraform to provision resources into Azure. The service principal grants your Terraform scripts using credentials to provision resources in your Azure subscription.

There are several ways to create an Azure AD application and an Azure AD service principal. The easiest and fastest way today is to use Azure CLI 2.0, which [you can download and install on Windows, Linux, or a Mac](/cli/azure/install-azure-cli).

Sign in to administer your Azure subscription by issuing the following command:

```azurecli-interactive
az login
```

If you have multiple Azure subscriptions, their details are returned by the `az login` command. Set the `SUBSCRIPTION_ID` environment variable to hold the value of the returned `id` field from the subscription you want to use. 

Set the subscription that you want to use for this session.

```azurecli-interactive
az account set --subscription="${SUBSCRIPTION_ID}"
```

Query the account to get the subscription ID and tenant ID values.

```azurecli-interactive
az account show --query "{subscriptionId:id, tenantId:tenantId}"
```

Next, create separate credentials for Terraform.

```azurecli-interactive
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
```

Your appId, password, sp_name, and tenant are returned. Make a note of the appId and password.

To test your credentials, open a new shell and run the following command, using the returned values for sp_name, password, and tenant:

```azurecli-interactive
az login --service-principal -u SP_NAME -p PASSWORD --tenant TENANT
az vm list-sizes --location westus
```

## Configure Terraform environment variables

Configure Terraform to use the tenant ID, subscription ID, client ID, and client secret from the service principal when creating Azure resources. Set the following environment variables, which are used automatically by the [Azure Terraform modules](https://registry.terraform.io/modules/Azure).

- ARM_SUBSCRIPTION_ID
- ARM_CLIENT_ID
- ARM_CLIENT_SECRET
- ARM_TENANT_ID

You can use this sample shell script to set those variables:

```bash
#!/bin/sh
echo "Setting environment variables for Terraform"
export ARM_SUBSCRIPTION_ID=your_subscription_id
export ARM_CLIENT_ID=your_appId
export ARM_CLIENT_SECRET=your_password
export ARM_TENANT_ID=your_tenant_id
```

## Next steps

You have installed Terraform and configured Azure credentials so that you can start deploying infrastructure into your Azure subscription.

> [!div class="nextstepaction"]
> [Create an Azure VM with Terraform](terraform-create-complete-vm.md)

