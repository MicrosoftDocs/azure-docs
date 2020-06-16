---
title: Access Azure Blob Storage using Azure Databricks and Azure Key Vault #Required; page title displayed in search results. Include the word "tutorial". Include the brand.
description: In this tutorial, you'll learn how to access Azure Blob Storage from Azure Databricks using a secret stored in Azure Key Vault #Required; article description that is displayed in search results. Include the word "tutorial".
author: taytran0 #Required; your GitHub user alias, with correct capitalization.
ms.author: t-trtr #Required; microsoft alias of author; optional team alias.
ms.service: key-vault #Required; service per approved list. service slug assigned to your service by ACOM.
ms.topic: tutorial #Required
ms.date: 06/16/2020 #Required; mm/dd/yyyy format.
---

# Tutorial: Access Azure Blob Storage using Azure Databricks and Azure Key Vault

In this tutorial, you'll learn how to access Azure Blob Storage from Azure Databricks using a secret stored in Azure Key Vault. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a storage account and blob container with Azure CLI
> * Create a Key Vault and set a secret
> * Create an Azure Databricks workspace and add Key Vault secret scope
> * Access your blob container from Azure Databricks workspace

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

Before you start this tutorial, install the [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest).

## Create a storage account and blob container with Azure CLI

You'll need to create a general-purpose storage account first to use blobs. If you do not have a [resource group](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-create), create one before running the command. The following command create and display the metadata of the storage container. Copy down the **id**.

```azurecli
az storage account create --name contosoblobstorage5 --resource-group contosoResourceGroup --location eastus --sku Standard_ZRS --encryption-services blob
```

![Image](../media/databricks-key-vault-1.PNG)

Before you can create a container to upload the blob to, you'll need to assign the [Storage Blob Data Contributor](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-contributor) role to yourself. For this example, the role will be assigned to the storage account you've made earlier.

```azurecli
az role assignment create --role "Storage Blob Data Contributor" --assignee t-trtr@microsoft.com --scope "/subscriptions/885e24c8-7a36-4217-b8c9-eed31e110504/resourceGroups/contosoResourceGroup5/providers/Microsoft.Storage/storageAccounts/contosoblobstorage5
```

Now that you've assign the role to storage account, you can create a container for your blob.

```azurecli
az storage container create --account-name contosoblobstorage5 --name contosocontainer5 --auth-mode login
```

Once the container is created, you can upload a blob (file of your choice) to that container. In this example, a .txt file with helloworld is uploaded.

```azurecli
az storage blob upload --account-name contosoblobstorage5 --container-name contosocontainer5 --name helloworld --file helloworld.txt --auth-mode login
```

List the blobs in the container to verify that the container has it.

```azurecli
az storage blob list --account-name contosoblobstorage5 --container-name contosocontainer5 --output table --auth-mode login
```

![Image](../media/databricks-key-vault-2.PNG)

Get the **key1** value of your storage container using the following command. Copy the value down.

```azurecli
az storage account keys list -g contosoResourceGroup5 -n contosoblobstorage5
```

![Image](../media/databricks-key-vault-3.PNG)

## Create a Key Vault and set a secret

You'll create a Key Vault using the following command. This will display the metadata of the Key Vault as well. Copy down the **id** and **vaultUri**.

```azurecli
az keyvault create --name contosoKeyVault10 --resource-group contosoResourceGroup5 --location eastus
```

![Image](../media/databricks-key-vault-4.PNG)
![Image](../media/databricks-key-vault-5.PNG)

To create the secret, use the following command. Set the value of the secret to the **key1** value from your storage account.

```azurecli
az keyvault secret set --vault-name contosoKeyVault10 --name storageKey --value "value of your key1"
```

## Create an Azure Databricks workspace and add Key Vault secret scope

This section cannot be completed through the command line. Follow this [guide](https://docs.microsoft.com/azure/azure-databricks/store-secrets-azure-key-vault#create-an-azure-databricks-workspace-and-add-a-secret-scope). You'll need to access the Azure Portal to:

1. Create your Azure Databricks resource
1. Launch your workspace
1. Create a Key Vault-backed secret scope

## Access your blob container from Azure Databricks workspace

This section cannot be completed through the command line. Follow this [guide](https://docs.microsoft.com/azure/azure-databricks/store-secrets-azure-key-vault#access-your-blob-container-from-azure-databricks). You'll need to use the Azure Databricks workspace to:

1. Create a **New Cluster**
1. Create a **New Notebook**
1. Fill in corresponding fields in the Python script
1. Run the Python script

```python
dbutils.fs.mount(
source = "wasbs://<your-container-name>@<your-storage-account-name>.blob.core.windows.net",
mount_point = "/mnt/<mount-name>",
extra_configs = {"<conf-key>":dbutils.secrets.get(scope = "<scope-name>", key = "<key-name>")})

df = spark.read.text("/mnt/<mount-name>/<file-name>")

df.show()
```

## Next steps

Make sure your Key Vault is recoverable:
> [!div class="nextstepaction"]
> [Turn on soft delete](https://docs.microsoft.com/azure/key-vault/general/soft-delete-clid)