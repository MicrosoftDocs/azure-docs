---
title: Use Azure CLI for files & ACLs in Azure Data Lake Storage Gen2
description: Use the Azure CLI to manage directories and file and directory access control lists (ACL) in storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: how-to
ms.date: 05/18/2020
ms.author: normesta
ms.reviewer: prishet
---

# Use Azure CLI to manage directories, files, and ACLs in Azure Data Lake Storage Gen2

This article shows you how to use the [Azure Command-Line Interface (CLI)](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) to create and manage directories, files, and permissions in storage accounts that have a hierarchical namespace. 

[Gen1 to Gen2 mapping](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview#mapping-from-adls-gen1-to-adls-gen2) | [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)

## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.
> * Azure CLI version `2.6.0` or higher.

## Ensure that you have the correct version of Azure CLI installed

1. Open the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview?view=azure-cli-latest), or if you've [installed](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Verify that the version of Azure CLI that have installed is `2.6.0` or higher by using the following command.

   ```azurecli
    az --version
   ```
   If your version of Azure CLI is lower than `2.6.0`, then install a later version. See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

## Connect to the account

1. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal. Then, sign in with your account credentials in the browser.

   To learn more about different authentication methods, see [Authorize access to blob or queue data with Azure CLI](../common/authorize-data-operations-cli.md).

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

> [!NOTE]
> The example presented in this article show Azure Active Directory (AD) authorization. To learn more about authorization methods, see [Authorize access to blob or queue data with Azure CLI](../common/authorize-data-operations-cli.md).

## Create a file system

A file system acts as a container for your files. You can create one by using the `az storage fs create` command. 

This example creates a file system named `my-file-system`.

```azurecli
az storage fs create -n my-file-system --account-name mystorageaccount --auth-mode login
```

## Show file system properties

You can print the properties of a file system to the console by using the `az storage fs show` command.

```azurecli
az storage fs show -n my-file-system --account-name mystorageaccount --auth-mode login
```

## List file system contents

List the contents of a directory by using the `az storage fs file list` command.

This example lists the contents of a file system named `my-file-system`.

```azurecli
az storage fs file list -f my-file-system --account-name mystorageaccount --auth-mode login
```

## Delete a file system

Delete a file system by using the `az storage fs delete` command.

This example deletes a file system named `my-file-system`. 

```azurecli
az storage fs delete -n my-file-system --account-name mystorageaccount --auth-mode login
```

## Create a directory

Create a directory reference by using the `az storage fs directory create` command. 

This example adds a directory named `my-directory` to a file system named `my-file-system` that is located in an account named `mystorageaccount`.

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

This example renames a directory from the name `my-directory` to the name `my-new-directory` in the same file system.

```azurecli
az storage fs directory move -n my-directory -f my-file-system --new-directory "my-file-system/my-new-directory" --account-name mystorageaccount --auth-mode login
```

This example moves a directory to a file system named `my-second-file-system`.

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

Determine if a specific directory exists in the file system by using the `az storage fs directory exists` command.

This example reveals whether a directory named `my-directory` exists in the `my-file-system` file system. 

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

This example lists the contents of a directory named `my-directory` that is located in the `my-file-system` file system of a storage account named `mystorageaccount`. 

```azurecli
az storage fs file list -f my-file-system --path my-directory --account-name mystorageaccount --auth-mode login
```

## Upload a file to a directory

Upload a file to a directory by using the `az storage fs directory upload` command.

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

## Manage permissions

You can get, set, and update access permissions of directories and files.

> [!NOTE]
> If you're using Azure Active Directory (Azure AD) to authorize commands, then make sure that your security principal has been assigned the [Storage Blob Data Owner role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control).

### Get an ACL

Get the ACL of a **directory** by using the `az storage fs access show` command.

This example gets the ACL of a directory, and then prints the ACL to the console.

```azurecli
az storage fs access show -p my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

Get the access permissions of a **file** by using the `az storage fs access show` command. 

This example gets the ACL of a file and then prints the ACL to the console.

```azurecli
az storage fs access show -p my-directory/upload.txt -f my-file-system --account-name mystorageaccount --auth-mode login
```

The following image shows the output after getting the ACL of a directory.

![Get ACL output](./media/data-lake-storage-directory-file-acl-cli/get-acl.png)

In this example, the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Set an ACL

Use the `az storage fs access set` command to set the ACL of a **directory**. 

This example sets the ACL on a directory for the owning user, owning group, or other users, and then prints the ACL to the console.

```azurecli
az storage fs access set --acl "user::rw-,group::rw-,other::-wx" -p my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

This example sets the *default* ACL on a directory for the owning user, owning group, or other users, and then prints the ACL to the console.

```azurecli
az storage fs access set --acl "default:user::rw-,group::rw-,other::-wx" -p my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

Use the `az storage fs access set` command to set the acl of a **file**. 

This example sets the ACL on a file for the owning user, owning group, or other users, and then prints the ACL to the console.

```azurecli
az storage fs access set --acl "user::rw-,group::rw-,other::-wx" -p my-directory/upload.txt -f my-file-system --account-name mystorageaccount --auth-mode login
```

The following image shows the output after setting the ACL of a file.

![Get ACL output](./media/data-lake-storage-directory-file-acl-cli/set-acl-file.png)

In this example, the owning user and owning group have only read and write permissions. All other users have write and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Update an ACL

Another way to set this permission is to use the `az storage fs access set` command. 

Update the ACL of a directory or file by setting the `-permissions` parameter to the short form of an ACL.

This example updates the ACL of a **directory**.

```azurecli
az storage fs access set --permissions rwxrwxrwx -p my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

This example updates the ACL of a **file**.

```azurecli
az storage fs access set --permissions rwxrwxrwx -p my-directory/upload.txt -f my-file-system --account-name mystorageaccount --auth-mode login
```

You can also update the owning user and group of a directory or file by setting the `--owner` or `group` parameters to the entity ID or User Principal Name (UPN) of a user. 

This example changes the owner of a directory. 

```azurecli
az storage fs access set --owner xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p my-directory -f my-file-system --account-name mystorageaccount --auth-mode login
```

This example changes the owner of a file. 

```azurecli
az storage fs access set --owner xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p my-directory/upload.txt -f my-file-system --account-name mystorageaccount --auth-mode login
```

## See also

* [Gen1 to Gen2 mapping](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview#mapping-from-adls-gen1-to-adls-gen2)
* [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)
* [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)


