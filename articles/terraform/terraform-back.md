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

Terraform state is used to reconcile deployed resources with Terraform configurations. Using state, Terraform knows what resources need to be added, updated, or deleted. By default Terraform state is stored locally when running *terraform apply*. This configuration is not ideal for a few reasons:

Local state does not work well in a team or collaborative environment

- Terraform state can include sensitive information
- Storing Terraform state locally increases the chance of inadvertent deletion
- Terraform includes the concept of a state backend, which is remote storage for Terraform state. When using a state backend, the state file is stored in a data store such as Azure Storage.

This document details how to configure and use Azure Storage as a Terraform state backend.

## Configure storage account

Before using Azure Storage to store Terraform state, a storage account must be created. The storage account can be created with the Azure portal, PowerShell, the CLI, or Terraform itself. Use the following sample to configure the store account with the Azure CLI.

```azurecli-interactive
RESOURCE_GROUP_NAME=tfstatestorage
STORAGE_ACCOUNT_NAME=tfstatestorage$RANDOM
CONTAINER_NAME=tfstatestorage

# Ceeate resoruce group
az group create --name $RESOURCE_GROUP_NAME --location eastus

# Create storage account
az storage account create --resource-group $RESOURCE_GROUP_NAME --name $STORAGE_ACCOUNT_NAME --sku Standard_LRS

# Get storage account key
ACCOUNT_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP_NAME --account-name $STORAGE_ACCOUNT_NAME --query [0].value -o tsv)

# Create blob container
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --account-key $ACCOUNT_KEY

echo "Account Key: $ACCOUNT_KEY"
```

Take note of the Storage account name, container name, and storage access key. These are needed when storing state.

## Configure state backend

The Terraform state backend is configured when running *terraform init*. In order to configure the state backend, the following data is required. Additional configuration options are details in the [Terraform documentation for azurerm backends][terraform-azurerm].

- storage_account_name - The name of the Azure storage account.
- container_name - The name of the blob container.
- key - The name of the state store file to be created.
- access_key - The storage access key.

Each of these values can be specified in the Terraform configurations, however it is recommended to use an Environment variable for the `access_key`. Using an environment variable prevents the key from being written to disk.

Create an environment variable named `ARM_ACCESS_KEY` with the value of the Azure storage access key.

```console
export ARM_ACCESS_KEY=<storage access key>
```

To further protect the Azure storage account access key, store it in Azure Key Vault. The environment variable can then be set using a command similar to the following.

```console
export ARM_ACCESS_KEY=$(az keyvault secret show --name terraform-backend-key --vault-name myKeyVault --query value -o tsv)
```

To configure Terraform to use the backend, include a `backend` configuration with a type of `azurerm` inside of the Terraform configuration. Add the *storage_account_name*, *container_name*, and *key* values to the configuration block.

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

Now when you run `terraform apply`, the Terraform state is stored in the Azure storage account.

## Next Steps

Learn more about Terraform backed configuration at the [Terraform backend documentation][terraform-backend].

<!-- LINKS - external -->
[terraform-azurerm]: https://www.terraform.io/docs/backends/types/azurerm.html
[terraform-backend]: https://www.terraform.io/docs/backends/