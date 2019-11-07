---
title: Tutorial - Store Terraform state in Azure Storage
description: An introduction to storing Terraform state in Azure Storage.
ms.service: terraform
author: tomarchermsft
ms.author: tarcher
ms.topic: tutorial
ms.date: 10/26/2019
---

# Tutorial: Store Terraform state in Azure Storage

Terraform state is used to reconcile deployed resources with Terraform configurations. State allows Terraform to knows what Azure resources to add, update, or delete. By default, Terraform state is stored locally when running the `terraform apply` command. This configuration isn't ideal for the following reasons:

- Local state doesn't work well in a team or collaborative environment
- Terraform state can include sensitive information
- Storing state locally increases the chance of inadvertent deletion

Terraform supports the persisting of state in remote storage. One such supported backend is Azure Storage. This document shows how to configure and use Azure Storage for this purpose.

## Configure storage account

Before using Azure Storage as a backend, a storage account must be created. The storage account can be created with the Azure portal, PowerShell, the Azure CLI, or Terraform itself. Use the following sample to configure the storage account with the Azure CLI.

```azurecli
#!/bin/bash

RESOURCE_GROUP_NAME=tstate
STORAGE_ACCOUNT_NAME=tstate$RANDOM
CONTAINER_NAME=tstate

# Create resource group
az group create --name $RESOURCE_GROUP_NAME --location eastus

# Create storage account
az storage account create --resource-group $RESOURCE_GROUP_NAME --name $STORAGE_ACCOUNT_NAME --sku Standard_LRS --encryption-services blob

# Get storage account key
ACCOUNT_KEY=$(az storage account keys list --resource-group $RESOURCE_GROUP_NAME --account-name $STORAGE_ACCOUNT_NAME --query [0].value -o tsv)

# Create blob container
az storage container create --name $CONTAINER_NAME --account-name $STORAGE_ACCOUNT_NAME --account-key $ACCOUNT_KEY

echo "storage_account_name: $STORAGE_ACCOUNT_NAME"
echo "container_name: $CONTAINER_NAME"
echo "access_key: $ACCOUNT_KEY"
```

Take note of the storage account name, container name, and storage access key. These values are needed when configuring the remote state.

## Configure state backend

The Terraform state backend is configured when running the `terraform init` command. the following data is needed to configure the state backend:

- storage_account_name - The name of the Azure Storage account.
- container_name - The name of the blob container.
- key - The name of the state store file to be created.
- access_key - The storage access key.

Each of these values can be specified in the Terraform configuration file or on the command line, however it's recommended to use an environment variable for the `access_key`. Using an environment variable prevents the key from being written to disk.

Create an environment variable named `ARM_ACCESS_KEY` with the value of the Azure Storage access key.

```bash
export ARM_ACCESS_KEY=<storage access key>
```

To further protect the Azure Storage account access key, store it in Azure Key Vault. The environment variable can then be set using a command similar to the following. For more information on Azure Key Vault, see the [Azure Key Vault documentation](../key-vault/quick-create-cli.md).

```bash
export ARM_ACCESS_KEY=$(az keyvault secret show --name terraform-backend-key --vault-name myKeyVault --query value -o tsv)
```

To configure Terraform to use the backend, the following steps need to be done:
- Include a `backend` configuration block with a type of `azurerm`.
- Add a `storage_account_name` value to the configuration block.
- Add a `container_name` value to the configuration block.
- Add a `key` value to the configuration block.

The following example configures a Terraform backend and creates an Azure resource group.

```hcl
terraform {
  backend "azurerm" {
    storage_account_name  = "tstate09762"
    container_name        = "tstate"
    key                   = "terraform.tfstate"
  }
}

resource "azurerm_resource_group" "state-demo-secure" {
  name     = "state-demo"
  location = "eastus"
}
```

Initialize the configuration by doing the following steps:

1. Run the `terraform init` command.
1. Run the `terraform apply` command.

You can now find the state file in the Azure Storage Blob.

## State locking

Azure Storage blobs are automatically locked before any operation that writes state. This pattern prevents concurrent state operations, which can cause corruption. 

For more information, see [State Locking](https://www.terraform.io/docs/state/locking.html) on the Terraform documentation.

The lock can be seen when examining the blob through the Azure portal or other Azure management tooling.

![Azure blob with lock](media/terraform-backend/lock.png)

## Encryption at rest

Data stored in an Azure Blob is encrypted before being persisted. When needed, Terraform retrieves the state from the backend and stores it in local memory. Using this pattern, state is never written to your local disk.

For more information on Azure Storage encryption, see [Azure Storage Service Encryption for data at rest](../storage/common/storage-service-encryption.md).

## Next steps

> [!div class="nextstepaction"] 
> [Terraform on Azure](/azure/ansible/)
