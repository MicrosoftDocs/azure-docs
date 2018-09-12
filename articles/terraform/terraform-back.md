---
title: Use Azure Storage as a Terraform backend
description: An introduction to storing Terrafom state in Azure Storage.
services: terraform
author: neilpeterson

ms.service: terraform
ms.topic: article
ms.date: 10/19/2017
ms.author: nepeters
---

# Storing Terraform state in Azure Storage

Terraform state is used to reconcile actual deployed resources to Terrfoamr configurations. It is with this stated that Terraform knows to add, update, or delete Azure resources. By default Terraform state is stored loclally when running `terraform apply`. This is not ideal for a few reasons:

- Does not work well in a team or collaborative environment
- Terraform state can include sensitive information
- Storing Terraform state locally increases the chance of inadvertent deletion

Terraform includes the concept remote state. When using remote state, the state file is stored in a data store such as Azure Storage.

This document details how to configure and use Azure Storage as a Terraform remote state backend.

## Configure Azure Storage account

Before using Azure Storage to store Terraform state, a storage account must be created. The storage account cen be created with the Azure portal, PowerShell, the CLI, or Terraform itself. Use the following sample to configure the store account with the Azure CLI.

```azurecli-interactive
RESOURCE_GROUP_NAME=tfstatestorage
STORAGE_ACCOUNT_NAME=tfstatestorage$RANDOM
CONTAINER_NAME=tfstatestorage

az group create --name $RESOURCE_GROUP_NAME --location eastus
az storage account create --resource-group $RESOURCE_GROUP_NAME --name $STORAGE_ACCOUNT_NAME --sku Standard_LRS
ACCOUNT_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP_NAME --account-name $STORAGE_ACCOUNT_NAME --query [0].value -o tsv)
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --account-key $ACCOUNT_KEY
```

Take note of the Storage account name, container name, and storage access key. These are needed when storing state.

## Configure the backend

```console
export ARM_ACCESS_KEY=$(az keyvault secret show --name terraform-backend-key --vault-name billBooth --query value -o tsv)
```

```tf
terraform {
  backend "azurerm" {
    storage_account_name  = "tstate"
    container_name        = "tfstate"
    key                   = "terraform.tfstate"
  }
}

resource "azurerm_resource_group" "state-demo-secure" {
  name     = "state-demoe"
  location = "eastus"
}
```