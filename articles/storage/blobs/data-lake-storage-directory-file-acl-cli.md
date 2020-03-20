---
title: Use Azure CLI for files & ACLs in Azure Data Lake Storage Gen2 (preview)
description: Use the Azure CLI to manage directories and file and directory access control lists (ACL) in storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: conceptual
ms.date: 11/24/2019
ms.author: normesta
ms.reviewer: prishet
---

# Use Azure CLI to manage directories, files, and ACLs in Azure Data Lake Storage Gen2 (preview)

This article shows you how to use the [Azure Command-Line Interface (CLI)](https://docs.microsoft.com/cli/azure/?view=azure-cli-latest) to create and manage directories, files, and permissions in storage accounts that have a hierarchical namespace. 

> [!IMPORTANT]
> The `storage-preview` extension that is featured in this article is currently in public preview.

[Sample](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview#adls-gen2-support) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview#mapping-from-adls-gen1-to-adls-gen2) | [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)
## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](data-lake-storage-quickstart-create-account.md) instructions to create one.
> * Azure CLI version `2.0.67` or higher.

## Install the storage CLI extension

1. Open the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview?view=azure-cli-latest), or if you've [installed](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Verify that the version of Azure CLI that have installed is `2.0.67` or higher by using the following command.

   ```azurecli
    az --version
   ```
   If your version of Azure CLI is lower than `2.0.67`, then install a later version. See [Install the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest).

3. Install the `storage-preview` extension.

   ```azurecli
   az extension add -n storage-preview
   ```

## Connect to the account

1. If you're using Azure CLI locally, run the login command.

   ```azurecli
   az login
   ```

   If the CLI can open your default browser, it will do so and load an Azure sign-in page.

   Otherwise, open a browser page at [https://aka.ms/devicelogin](https://aka.ms/devicelogin) and enter the authorization code displayed in your terminal. Then, sign in with your account credentials in the browser.

   To learn more about different authentication methods, see Sign in with Azure CLI.

2. If your identity is associated with more than one subscription, then set your active subscription to subscription of the storage account that will host your static website.

   ```azurecli
   az account set --subscription <subscription-id>
   ```

   Replace the `<subscription-id>` placeholder value with the ID of your subscription.

## Create a file system

A file system acts as a container for your files. You can create one by using the `az storage container create` command. 

This example creates a file system named `my-file-system`.

```azurecli
az storage container create --name my-file-system --account-name mystorageaccount
```

## Create a directory

Create a directory reference by using the `az storage blob directory create` command. 

This example adds a directory named `my-directory` to a file system named `my-file-system` that is located in an account named `mystorageaccount`.

```azurecli
az storage blob directory create -c my-file-system -d my-directory --account-name mystorageaccount
```

## Show directory properties

You can print the properties of a directory to the console by using the `az storage blob show` command.

```azurecli
az storage blob directory show -c my-file-system -d my-directory --account-name mystorageaccount
```

## Rename or move a directory

Rename or move a directory by using the `az storage blob directory move` command.

This example renames a directory from the name `my-directory` to the name `my-new-directory`.

```azurecli
az storage blob directory move -c my-file-system -d my-new-directory -s my-directory --account-name mystorageaccount
```

## Delete a directory

Delete a directory by using the `az storage blob directory delete` command.

This example deletes a directory named `my-directory`. 

```azurecli
az storage blob directory delete -c my-file-system -d my-directory --account-name mystorageaccount 
```

## Check if a directory exists

Determine if a specific directory exists in the file system by using the `az storage blob directory exist` command.

This example reveals whether a directory named `my-directory` exists in the `my-file-system` file system. 

```azurecli
az storage blob directory exists -c my-file-system -d my-directory --account-name mystorageaccount 
```

## Download from a directory

Download a file from a directory by using the `az storage blob directory download` command.

This example downloads a file named `upload.txt` from a directory named `my-directory`. 

```azurecli
az storage blob directory download -c my-file-system --account-name mystorageaccount -s "my-directory/upload.txt" -d "C:\mylocalfolder\download.txt"
```

This example downloads an entire directory.

```azurecli
az storage blob directory download -c my-file-system --account-name mystorageaccount -s "my-directory/" -d "C:\mylocalfolder" --recursive
```

## List directory contents

List the contents of a directory by using the `az storage blob directory list` command.

This example lists the contents of a directory named `my-directory` that is located in the `my-file-system` file system of a storage account named `mystorageaccount`. 

```azurecli
az storage blob directory list -c my-file-system -d my-directory --account-name mystorageaccount
```

## Upload a file to a directory

Upload a file to a directory by using the `az storage blob directory upload` command.

This example uploads a file named `upload.txt` to a directory named `my-directory`. 

```azurecli
az storage blob directory upload -c my-file-system --account-name mystorageaccount -s "C:\mylocaldirectory\upload.txt" -d my-directory
```

This example uploads an entire directory.

```azurecli
az storage blob directory upload -c my-file-system --account-name mystorageaccount -s "C:\mylocaldirectory\" -d my-directory --recursive 
```

## Show file properties

You can print the properties of a file to the console by using the `az storage blob show` command.

```azurecli
az storage blob show -c my-file-system -b my-file.txt --account-name mystorageaccount
```

## Rename or move a file

Rename or move a file by using the `az storage blob move` command.

This example renames a file from the name `my-file.txt` to the name `my-file-renamed.txt`.

```azurecli
az storage blob move -c my-file-system -d my-file-renamed.txt -s my-file.txt --account-name mystorageaccount
```

## Delete a file

Delete a file by using the `az storage blob delete` command.

This example deletes a file named `my-file.txt`

```azurecli
az storage blob delete -c my-file-system -b my-file.txt --account-name mystorageaccount 
```

## Manage permissions

You can get, set, and update access permissions of directories and files.

> [!NOTE]
> If you're using Azure Active Directory (Azure AD) to authorize commands, then make sure that your security principal has been assigned the [Storage Blob Data Owner role](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see  [Access control in Azure Data Lake Storage Gen2](https://docs.microsoft.com/azure/storage/blobs/data-lake-storage-access-control).

### Get directory and file permissions

Get the ACL of a **directory** by using the `az storage blob directory access show` command.

This example gets the ACL of a directory, and then prints the ACL to the console.

```azurecli
az storage blob directory access show -d my-directory -c my-file-system --account-name mystorageaccount
```

Get the access permissions of a **file** by using the `az storage blob access show` command. 

This example gets the ACL of a file and then prints the ACL to the console.

```azurecli
az storage blob access show -b my-directory/upload.txt -c my-file-system --account-name mystorageaccount
```

The following image shows the output after getting the ACL of a directory.

![Get ACL output](./media/data-lake-storage-directory-file-acl-cli/get-acl.png)

In this example, the owning user has read, write, and execute permissions. The owning group has only read and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Set directory and file permissions

Use the `az storage blob directory access set` command to set the ACL of a **directory**. 

This example sets the ACL on a directory for the owning user, owning group, or other users, and then prints the ACL to the console.

```azurecli
az storage blob directory access set -a "user::rw-,group::rw-,other::-wx" -d my-directory -c my-file-system --account-name mystorageaccount
```

This example sets the *default* ACL on a directory for the owning user, owning group, or other users, and then prints the ACL to the console.

```azurecli
az storage blob directory access set -a "default:user::rw-,group::rw-,other::-wx" -d my-directory -c my-file-system --account-name mystorageaccount
```

Use the `az storage blob access set` command to set the acl of a **file**. 

This example sets the ACL on a file for the owning user, owning group, or other users, and then prints the ACL to the console.

```azurecli
az storage blob access set -a "user::rw-,group::rw-,other::-wx" -b my-directory/upload.txt -c my-file-system --account-name mystorageaccount
```
The following image shows the output after setting the ACL of a file.

![Get ACL output](./media/data-lake-storage-directory-file-acl-cli/set-acl-file.png)

In this example, the owning user and owning group have only read and write permissions. All other users have write and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

### Update directory and file permissions

Another way to set this permission is to use the `az storage blob directory access update` or `az storage blob access update` command. 

Update the ACL of a directory or file by setting the `-permissions` parameter to the short form of an ACL.

This example updates the ACL of a **directory**.

```azurecli
az storage blob directory access update --permissions "rwxrwxrwx" -d my-directory -c my-file-system --account-name mystorageaccount
```

This example updates the ACL of a **file**.

```azurecli
az storage blob access update --permissions "rwxrwxrwx" -b my-directory/upload.txt -c my-file-system --account-name mystorageaccount
```

You can also update the owning user and group of a directory or file by setting the `--owner` or `group` parameters to the entity ID or User Principal Name (UPN) of a user. 

This example changes the owner of a directory. 

```azurecli
az storage blob directory access update --owner xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -d my-directory -c my-file-system --account-name mystorageaccount
```

This example changes the owner of a file. 

```azurecli
az storage blob access update --owner xxxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -b my-directory/upload.txt -c my-file-system --account-name mystorageaccount
```
## Manage user-defined metadata

You can add user-defined metadata to a file or directory by using the `az storage blob directory metadata update` command with one or more name-value pairs.

This example adds user-defined metadata for a directory named `my-directory` directory.

```azurecli
az storage blob directory metadata update --metadata tag1=value1 tag2=value2 -c my-file-system -d my-directory --account-name mystorageaccount
```

This example shows all user-defined metadata for directory named `my-directory`.

```azurecli
az storage blob directory metadata show -c my-file-system -d my-directory --account-name mystorageaccount
```

## See also

* [Sample](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview)
* [Gen1 to Gen2 mapping](https://github.com/Azure/azure-cli-extensions/tree/master/src/storage-preview#mapping-from-adls-gen1-to-adls-gen2)
* [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)
* [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
* [Source code](https://github.com/Azure/azure-cli-extensions/tree/master/src)

