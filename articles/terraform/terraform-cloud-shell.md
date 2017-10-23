---
title: Use Terraform with Azure Cloud Shell
description: Use Terraform with Azure Cloud Shell to simplify authentication and template configuration.
keywords: terraform, devops, scale set, virtual machine, network, storage, modules
ms.service: virtual-machines-linux
author: dcaro
ms.author: dcaro
ms.date: 10/19/2017
ms.topic: article
---

# Terraform Cloud Shell development 

Terraform works great from a Bash command line such as macOS Terminal or Bash on Windows or Linux. Running your Terraform configurations in the Bash experience of the [Azure Cloud Shell](/azure/cloud-shell/overview) has some unique advantages to speed up your development cycle.

This concepts article details exactly what's provided in the Cloud Shell for Terraform development and the best way to set up a development workflow with the Cloud Shell.

## Using Azure Cloud Shell with Terraform

Setting up Azure Cloud Shell is documented [here](/azure/cloud-shell/quickstart) and takes about fives minutes. 

Terraform is immediately available in CLoud Shell, along with the [Azure CLI 2.0](/cli/azure/overview?view=azure-cli-latest) . You are automatically authenticated bwhen working Azure Cloud Shell to work with resources inside the current Azure subscription.

Files and shell states persist in Azure Storage between Cloud Shell session. Use [Azure Storage Explorer](/azure/vs-azure-tools-storage-manage-with-storage-explorer) to connect to the Azure Storage account and copy and upload files to the Cloud Shell while editing and testing them on your local computer with your favorite tools.

## Using Modules and Providers

Azure Terraform module requires credentials to access and make changes to the resources in your Azure subscription. When working in the Cloud Shell, the required credentials for the Azure provider are passed to Terraform through environment variables when using any of the `terraform` CLI commands.

To use Azure Terraform modules in the Cloud Shell, add the following to your scripts. 

```tf
# Configure the Microsoft Azure Provider
provider "azurerm" {
}
```

The Azure CLI 2.0 is available in the Cloud Shell and is  a great tool for testing configurations and checking your work after a `terraform apply` or `terraform destroy` completes.


## Next steps

[Create a small VM cluster using the Module Registry](terraform-create-vm-cluster-module.md)
[Create a small VM cluster using custom HCL](terraform-create-vm-cluster-with-infrastructure.md)
