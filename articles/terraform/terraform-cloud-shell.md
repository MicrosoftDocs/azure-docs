---
title: Tutorial - Configure Azure Cloud Shell for Terraform
description: Use Terraform with Azure Cloud Shell to simplify authentication and template configuration.
ms.service: terraform
author: tomarchermsft
ms.author: tarcher
ms.topic: tutorial
ms.date: 10/26/2019
---

# Tutorial: Configure Azure Cloud Shell for Terraform

Terraform works well from a Bash command line in macOS, Windows, or Linux. Running your Terraform configurations in the Bash experience of the [Azure Cloud Shell](/azure/cloud-shell/overview) has some unique advantages. This tutorial shows how to write Terraform scripts that deploy to Azure using Cloud Shell.

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Automatic credential configuration

Terraform is installed and immediately available in Cloud Shell. Terraform scripts authenticate with Azure when logged in to the Cloud Shell to manage infrastructure without any additional configuration. Automatic authentication bypasses two manual processes:
- Creating an Active Directory service principal.
- configuring the Azure Terraform provider variables.


## Using Modules and Providers

Azure Terraform modules require credentials to access and modify Azure resources. To use Terraform modules in Cloud Shell, add the following code:


```hcl
# Configure the Microsoft Azure Provider
provider "azurerm" {
}
```

The Cloud Shell passes required values for the `azurerm` provider through environment variables when using any of the `terraform` CLI commands.

## Other Cloud Shell developer tools

Files and shell states persist in Azure Storage between Cloud Shell sessions. Use [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer) to copy and upload files to the Cloud Shell from your local computer.

The Azure CLI is available in the Cloud Shell and is a great tool for testing configurations and checking your work after a `terraform apply` or `terraform destroy` completes.


## Next steps

> [!div class="nextstepaction"]
> [Create a small VM cluster using the Module Registry](terraform-create-vm-cluster-module.md)