---
title: Use Azure CLI to set ACLs in Azure Data Lake Storage Gen2
description: Use the Azure CLI to manage access control lists (ACL) in storage accounts that have a hierarchical namespace.
services: storage
author: normesta
ms.service: storage
ms.subservice: data-lake-storage-gen2
ms.topic: how-to
ms.date: 05/18/2020
ms.author: normesta
ms.reviewer: prishet 
ms.custom: devx-track-azurecli
---

# Use Azure CLI to manage ACLs in Azure Data Lake Storage Gen2

This article shows you how to use the [Azure Command-Line Interface (CLI)](/cli/azure/) to get, set, and update the access control lists of directories and files. ACL inheritance is already available for new child items that are created under a parent directory. But you can also add, update, and remove ACLs recursively on the existing child items of a parent directory without having to make these changes individually for each child item. 

[Reference](/cli/azure/storage/fs/access) | [Samples](https://github.com/Azure/azure-cli/blob/dev/src/azure-cli/azure/cli/command_modules/storage/docs/ADLS%20Gen2.md) | [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)

## Prerequisites

> [!div class="checklist"]
> * An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).
> * A storage account that has hierarchical namespace (HNS) enabled. Follow [these](../common/storage-account-create.md) instructions to create one.
> * Azure CLI version `2.6.0` or higher.
> * One of the following security permissions:
    - Storage account key.
    - A provisioned Azure Active Directory (AD) [security principal](../../role-based-access-control/overview.md#security-principal) that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of the either the target container, parent resource group or subscription.  
    - Owning user of the target container or directory to which you plan to apply ACL settings. To set ACLs recursively, this includes all child items in the target container or directory.

## Ensure that you have the correct version of Azure CLI installed

1. Open the [Azure Cloud Shell](../../cloud-shell/overview.md), or if you've [installed](/cli/azure/install-azure-cli) the Azure CLI locally, open a command console application such as Windows PowerShell.

2. Verify that the version of Azure CLI that have installed is `2.14.0` or higher by using the following command.

   ```azurecli
    az --version
   ```
   If your version of Azure CLI is lower than `2.14.0`, then install a later version. See [Install the Azure CLI](/cli/azure/install-azure-cli).

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
> The example presented in this article show Azure Active Directory (AD) authorization. To learn more about authorization methods, see [Authorize access to blob or queue data with Azure CLI](./authorize-data-operations-cli.md).

## Get an ACL

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

## Set an ACL

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

![Get ACL output 2](./media/data-lake-storage-directory-file-acl-cli/set-acl-file.png)

In this example, the owning user and owning group have only read and write permissions. All other users have write and execute permissions. For more information about access control lists, see [Access control in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md).

## Update an ACL

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

## Set an ACL recursively

When you *set* an ACL, you **replace** the entire ACL including all of it's entries. If you want to change the permission level of a security principal or add a new security principal to the ACL without affecting other existing entries, you should *update* the ACL instead. To update an ACL instead of replace it, see the [Update an ACL recursively](#update-an-acl-recursively) section of this article.  

If you choose to *set* the ACL, you must add an entry for the owning user, an entry for the owning group, and an entry for all other users. To learn more about the owning user, the owning group, and all other users, see [Users and identities](data-lake-storage-access-control.md#users-and-identities). 

Set an ACL recursively by using the [az storage fs access set-recursive](/cli/azure/storage/fs/access#az_storage_fs_access_set_recursive) command.

This example sets the ACL of a directory named `my-parent-directory`. These entries give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

```azurecli
az storage fs access set-recursive --acl "user::rwx,group::r-x,other::---,user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x" -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login
```

> [!NOTE]
> If you want to set a **default** ACL entry, add the prefix `default:` to each entry. For example, `default:user::rwx` or `default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x`. 

## Update an ACL recursively

When you *update* an ACL, you modify the ACL instead of replacing the ACL. For example, you can add a new security principal to the ACL without affecting other security principals listed in the ACL.  To replace the ACL instead of update it, see the [Set an ACL recursively](#set-an-acl-recursively) section of this article. 

To update an ACL, create a new ACL object with the ACL entry that you want to update, and then use that object in update ACL operation. Do not get the existing ACL, just provide ACL entries to be updated.

Update an ACL recursively by using the  [az storage fs access update-recursive](/cli/azure/storage/fs/access#az_storage_fs_access_update_recursive) command. 

This example updates an ACL entry with write permission. 

```azurecli
az storage fs access update-recursive --acl "user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:rwx" -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login
```

> [!NOTE]
> If you want to update a **default** ACL entry, add the prefix `default:` to each entry. For example, `default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx:r-x`.

## Remove ACL entries recursively

You can remove one or more ACL entries recursively. To remove an ACL entry, create a new ACL object for ACL entry to be removed, and then use that object in remove ACL operation. Do not get the existing ACL, just provide the ACL entries to be removed. 

Remove ACL entries by using the [az storage fs access remove-recursive](/cli/azure/storage/fs/access#az_storage_fs_access_remove_recursive) command. 

This example removes an ACL entry from the root directory of the container.  

```azurecli
az storage fs access remove-recursive --acl "user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login
```

> [!NOTE]
> If you want to remove a **default** ACL entry, add the prefix `default:` to each entry. For example, `default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.

## Recover from failures

You might encounter runtime or permission errors. For runtime errors, restart the process from the beginning. Permission errors can occur if the security principal doesn't have sufficient permission to modify the ACL of a directory or file that is in the directory hierarchy being modified. Address the permission issue, and then choose to either resume the process from the point of failure by using a continuation token, or restart the process from beginning. You don't have to use the continuation token if you prefer to restart from the beginning. You can reapply ACL entries without any negative impact.

In the event of a failure, you can return a continuation token by setting the `--continue-on-failure` parameter to `false`. After you address the errors, you can resume the process from the point of failure by running the command again, and then setting the `--continuation` parameter to the continuation token. 

```azurecli
az storage fs access set-recursive --acl "user::rw-,group::r-x,other::---" --continue-on-failure false --continuation xxxxxxx -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login  
```

If you want the process to complete uninterrupted by permission errors, you can specify that.

To ensure that the process completes uninterrupted, set the `--continue-on-failure` parameter to `true`. 

```azurecli
az storage fs access set-recursive --acl "user::rw-,group::r-x,other::---" --continue-on-failure true --continuation xxxxxxx -p my-parent-directory/ -f my-container --account-name mystorageaccount --auth-mode login  
```

## Best practice guidelines

This section provides you some best practice guidelines for setting ACLs recursively. 

#### Handling runtime errors

A runtime error can occur for many reasons (For example: an outage or a client connectivity issue). If you encounter a runtime error, restart the recursive ACL process. ACLs can be reapplied to items without causing a negative impact. 

#### Handling permission errors (403)

If you encounter an access control exception while running a recursive ACL process, your AD [security principal](../../role-based-access-control/overview.md#security-principal) might not have sufficient permission to apply an ACL to one or more of the child items in the directory hierarchy. When a permission error occurs, the process stops and a continuation token is provided. Fix the permission issue, and then use the continuation token to process the remaining dataset. The directories and files that have already been successfully processed won't have to be processed again. You can also choose to restart the recursive ACL process. ACLs can be reapplied to items without causing a negative impact. 

#### Credentials 

We recommend that you provision an Azure AD security principal that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role in the scope of the target storage account or container. 

#### Performance 

To reduce latency, we recommend that you run the recursive ACL process in an Azure Virtual Machine (VM) that is located in the same region as your storage account. 

#### ACL limits

The maximum number of ACLs that you can apply to a directory or file is 32 access ACLs and 32 default ACLs. For more information, see [Access control in Azure Data Lake Storage Gen2](./data-lake-storage-access-control.md).

## See also

* [Samples](https://github.com/Azure/azure-cli/blob/dev/src/azure-cli/azure/cli/command_modules/storage/docs/ADLS%20Gen2.md)
* [Give feedback](https://github.com/Azure/azure-cli-extensions/issues)
* [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)