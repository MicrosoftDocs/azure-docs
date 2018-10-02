---
title: Use Terraform with Azure Cloud Shell
description: Use Terraform with Azure Cloud Shell to simplify authentication and template configuration.
services: terraform
ms.service: terraform
keywords: terraform, devops, scale set, virtual machine, network, storage, modules
author: tomarcher
manager: jeconnoc
ms.author: tarcher
ms.topic: tutorial
ms.date: 10/19/2017
---

# Terraform Cloud Shell development 

Terraform works great from a Bash command line such as macOS Terminal or Bash on Windows or Linux. Running your Terraform configurations in the Bash experience of the [Azure Cloud Shell](/azure/cloud-shell/overview) has some unique advantages to speed up your development cycle.

This concepts article covers Cloud Shell features that help you write Terraform scripts that deploy to Azure.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Automatic credential configuration

Terraform is installed and immediately available in Cloud Shell. Terraform scripts authenticate with Azure when logged in to the Cloud Shell to manage infrastructure without any additional configuration. Automatic authentication bypasses the need to manually create an Active Directory service principal and configure the Azure Terraform provider variables.


## Using Modules and Providers

Azure Terraform modules require credentials to access and make changes to the resources in your Azure subscription. When working in the Cloud Shell, add the following code to your scripts to use Azure Terraform modules in the Cloud Shell:

```tf
# Configure the Microsoft Azure Provider
provider "azurerm" {
}
```

The Cloud Shell passes required values for the `azurerm` provider through environment variables when using any of the `terraform` CLI commands.

## Other Cloud Shell developer tools

Files and shell states persist in Azure Storage between Cloud Shell sessions. Use [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer) to copy and upload files to the Cloud Shell from your local computer.

The Azure CLI is available in the Cloud Shell and is a great tool for testing configurations and checking your work after a `terraform apply` or `terraform destroy` completes.


## Next steps

[Create a small VM cluster using the Module Registry](terraform-create-vm-cluster-module.md)
[Create a small VM cluster using custom HCL](terraform-create-vm-cluster-with-infrastructure.md)
