---
title: Install and configure Terraform for use with Azure | Microsoft Docs
description: Learn how to install and configure Terraform to create Azure resources
services: virtual-machines-linux
documentationcenter: virtual-machines
author: echuvyrov
manager: jeconnoc
editor: na
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 06/19/2018
ms.author: echuvyrov
---

# Install and configure Terraform to provision VMs and other infrastructure into Azure
 
Terraform provides an easy way to define, preview, and deploy cloud infrastructure by using a [simple templating language](https://www.terraform.io/docs/configuration/syntax.html). This article describes the necessary steps to use Terraform to provision resources in Azure.

To learn more about how to use Terraform with Azure, visit the [Terraform Hub](/azure/terraform).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

Terraform is installed by default in the [Cloud Shell](/azure/terraform/terraform-cloud-shell). If you choose to install Terraform locally, complete the next step, otherwise continue to [Set up Terraform access to Azure](#set-up-terraform-access-to-azure).

## Install Terraform

To install Terraform, [download](https://www.terraform.io/downloads.html) the appropriate package for your operating system into a separate install directory. The download contains a single executable file, for which you should also define a global path. For instructions on how to set the path on Linux and Mac, go to [this webpage](https://stackoverflow.com/questions/14637979/how-to-permanently-set-path-on-linux). For instructions on how to set the path on Windows, go to [this webpage](https://stackoverflow.com/questions/1618280/where-can-i-set-path-to-make-exe-on-windows).

Verify your path configuration with the `terraform` command. A list of available Terraform options is shown, as in the following example output:

```bash
azureuser@Azure:~$ terraform
Usage: terraform [--version] [--help] <command> [args]
```

## Set up Terraform access to Azure

To enable Terraform to provision resources into Azure, create an [Azure AD service principal](/cli/azure/create-an-azure-service-principal-azure-cli). The service principal grants your Terraform scripts to provision resources in your Azure subscription.

If you have multiple Azure subscriptions, first query your account with [az account show](/cli/azure/account#az-account-show) to get a list of subscription ID and tenant ID values:

```azurecli-interactive
az account show --query "{subscriptionId:id, tenantId:tenantId}"
```

To use a selected subscription, set the subscription for this session with [az account set](/cli/azure/account#az-account-set). Set the `SUBSCRIPTION_ID` environment variable to hold the value of the returned `id` field from the subscription you want to use:

```azurecli-interactive
az account set --subscription="${SUBSCRIPTION_ID}"
```

Now you can create a service principal for use with Terraform. Use [az ad sp create-for-rbac]/cli/azure/ad/sp#az-ad-sp-create-for-rbac), and set the *scope* to your subscription as follows:

```azurecli-interactive
az ad sp create-for-rbac --role="Contributor" --scopes="/subscriptions/${SUBSCRIPTION_ID}"
```

Your `appId`, `password`, `sp_name`, and `tenant` are returned. Make a note of the `appId` and `password`.

## Configure Terraform environment variables

To configure Terraform to use your Azure AD service principal, set the following environment variables, which are then used by the [Azure Terraform modules](https://registry.terraform.io/modules/Azure). You can also set the environment if working with an Azure cloud other than Azure public.

- `ARM_SUBSCRIPTION_ID`
- `ARM_CLIENT_ID`
- `ARM_CLIENT_SECRET`
- `ARM_TENANT_ID`
- `ARM_ENVIRONMENT`

You can use the following sample shell script to set those variables:

```bash
#!/bin/sh
echo "Setting environment variables for Terraform"
export ARM_SUBSCRIPTION_ID=your_subscription_id
export ARM_CLIENT_ID=your_appId
export ARM_CLIENT_SECRET=your_password
export ARM_TENANT_ID=your_tenant_id

# Not needed for public, required for usgovernment, german, china
export ARM_ENVIRONMENT=public
```

## Run a sample script

Create a file `test.tf` in an empty directory and paste in the following script.

```tf
provider "azurerm" {
}
resource "azurerm_resource_group" "rg" {
        name = "testResourceGroup"
        location = "westus"
}
```

Save the file and then initialize the Terraform deployment. This step downloads the Azure modules required to create an Azure resource group.

```bash
terraform init
```

The output is similar to the following example:

```bash
* provider.azurerm: version = "~> 0.3"

Terraform has been successfully initialized!
```

You can preview the actions to be completed by the Terraform script with `terraform plan`. When ready to create the resource group, apply your Terraform plan as follows:

```bash
terraform apply
```

The output is similar to the following example:

```bash
An execution plan has been generated and is shown below.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  + azurerm_resource_group.rg
      id:       <computed>
      location: "westus"
      name:     "testResourceGroup"
      tags.%:   <computed>

azurerm_resource_group.rg: Creating...
  location: "" => "westus"
  name:     "" => "testResourceGroup"
  tags.%:   "" => "<computed>"
azurerm_resource_group.rg: Creation complete after 1s
```

## Next steps

In this article, you installed Terraform or used the Cloud Shell to configure Azure credentials and start creating resources in your Azure subscription. To create a more complete Terraform deployment in Azure, see the following article:

> [!div class="nextstepaction"]
> [Create an Azure VM with Terraform](terraform-create-complete-vm.md)
