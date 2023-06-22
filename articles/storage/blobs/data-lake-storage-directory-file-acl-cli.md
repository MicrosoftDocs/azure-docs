---
title: Use Azure CLI to manage data (Azure Data Lake Storage Gen2)
titleSuffix: Azure Storage
description: Use the Azure CLI to manage directories and files in storage accounts that have a hierarchical namespace.
services: storage
author: normesta

ms.service: azure-data-lake-storage
ms.topic: how-to
ms.date: 02/17/2021
ms.author: normesta
ms.reviewer: prishet
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---

# Manage directories and files in Azure Data Lake Storage Gen2 via the Azure CLI

This article shows you how to use the [Azure CLI](/cli/azure/) to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use Azure CLI to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-cli.md).

[Samples](https://github.com/Azure/azure-cli/blob/dev/src/azure-cli/azure/cli/command_modules/storage/docs/ADLS%20Gen2.md) | [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)

## Prerequisites

- An Azure subscription. For more information, see [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

- Azure CLI version `2.6.0` or higher.

## Ensure that you have the correct version of Azure CLI installed

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Verify that the version of Azure CLI that have installed is `2.6.0` or higher by using the following command.

   ```azurecli
    az --version
   ```

   If your version of Azure CLI is lower than `2.6.0`, then install a later version. For more information, see [Install the Azure CLI](/cli/azure/install-azure-cli).

## Connect to the account

1. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal. Then, sign in with your account credentials in the browser.

   To learn more about different authentication methods, see [Authorize access to blob or queue data with Azure CLI](./authorize-data-operations-cli.md).

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

> [!NOTE]
> The example presented in this article show Azure Active Directory (Azure AD) authorization. To learn more about authorization methods, see [Authorize access to blob or queue data with Azure CLI](./authorize-data-operations-cli.md).

## Create a container

A container acts as a file system for your files. You can create one by using the `az storage fs create` command.

This example creates a container named `my-file-system`.

```azurecli
az storage fs create -n my-file-system --account-name mystorageaccount --auth-mode login
```

## Show container properties

You can print the properties of a container to the console by using the `az storage fs show` command.

```azurecli
az storage fs show -n my-file-system --account-name mystorageaccount --auth-mode login
```

## List container contents

List the contents of a directory by using the `az storage fs file list` command.

This example lists the contents of a container named `my-file-system`.

```azurecli
az storage fs file list -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Delete a container

Delete a container by using the `az storage fs delete` command.

This example deletes a container named `my-file-system`.

```azurecli
az storage fs delete -n my-file-system --account-name mystorageaccount --auth-mode login
```

## Create a directory

Create a directory reference by using the `az storage fs directory create` command.

This example adds a directory named `my-directory` to a container named `my-file-system` that is located in an account named `mystorageaccount`.

```azurecli
az storage fs directory create -n my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Show directory properties

You can print the properties of a directory to the console by using the `az storage fs directory show` command.

```azurecli
az storage fs directory show -n my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Rename or move a directory

Rename or move a directory by using the `az storage fs directory move` command.

This example renames a directory from the name `my-directory` to the name `my-new-directory` in the same container.

```azurecli
az storage fs directory move -n my-directory -f my-file-system --new-directory "my-file-system/my-new-directory" --account-name mystorageaccount --auth-mode login
```

This example moves a directory to a container named `my-second-file-system`.

```azurecli
az storage fs directory move -n my-directory -f my-file-system --new-directory "my-second-file-system/my-new-directory" --account-name mystorageaccount --auth-mode login
```

## Delete a directory

Delete a directory by using the `az storage fs directory delete` command.

This example deletes a directory named `my-directory`.

```azurecli
az storage fs directory delete -n my-directory -f my-file-system  --account-name mystorageaccount --auth-mode login
```

## Check if a directory exists

Determine if a specific directory exists in the container by using the `az storage fs directory exists` command.

This example reveals whether a directory named `my-directory` exists in the `my-file-system` container.

```azurecli
az storage fs directory exists -n my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Download from a directory

Download a file from a directory by using the `az storage fs file download` command.

This example downloads a file named `upload.txt` from a directory named `my-directory`.

```azurecli
az storage fs file download -p my-directory/upload.txt -f my-file-system -d "C:\myFolder\download.txt" --account-name mystorageaccount --auth-mode login
```

## List directory contents

List the contents of a directory by using the `az storage fs file list` command.

This example lists the contents of a directory named `my-directory` that is located in the `my-file-system` container of a storage account named `mystorageaccount`.

```azurecli
az storage fs file list -f my-file-system --path my-directory --account-name mystorageaccount --auth-mode login
```

## Upload a file to a directory

Upload a file to a directory by using the `az storage fs file upload` command.

This example uploads a file named `upload.txt` to a directory named `my-directory`.

```azurecli
az storage fs file upload -s "C:\myFolder\upload.txt" -p my-directory/upload.txt  -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Show file properties

You can print the properties of a file to the console by using the `az storage fs file show` command.

```azurecli
az storage fs file show -p my-file.txt -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Rename or move a file

Rename or move a file by using the `az storage fs file move` command.

This example renames a file from the name `my-file.txt` to the name `my-file-renamed.txt`.

```azurecli
az storage fs file move -p my-file.txt -f my-file-system --new-path my-file-system/my-file-renamed.txt --account-name mystorageaccount --auth-mode login
```

## Delete a file

Delete a file by using the `az storage fs file delete` command.

This example deletes a file named `my-file.txt`

```azurecli
az storage fs file delete -p my-directory/my-file.txt -f my-file-system  --account-name mystorageaccount --auth-mode login
```

## See also

- [Samples](https://github.com/Azure/azure-cli/blob/dev/src/azure-cli/azure/cli/command_modules/storage/docs/ADLS%20Gen2.md)
- [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Use Azure CLI to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-cli.md)
