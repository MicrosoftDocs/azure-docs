---
title: Use Python to manage ACLs in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use Python manage access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: pauljewellmsft

ms.author: pauljewell
ms.service: storage
ms.date: 02/07/2023
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
ms.devlang: python
ms.custom: devx-track-python, py-fresh-zinc
---

# Use Python to manage ACLs in Azure Data Lake Storage Gen2

This article shows you how to use the Python to get, set, and update the access control lists of directories and files.

ACL inheritance is already available for new child items that are created under a parent directory. But you can also add, update, and remove ACLs recursively on the existing child items of a parent directory without having to make these changes individually for each child item.

[Package (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples) | [Recursive ACL samples](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control_recursive.py) | [API reference](/python/api/azure-storage-file-datalake/azure.storage.filedatalake) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)

## Prerequisites

- An Azure subscription. For more information, see [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

- Azure CLI version `2.6.0` or higher.

- One of the following security permissions:

  - A provisioned Azure Active Directory (AD) [security principal](../../role-based-access-control/overview.md#security-principal) that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role, scoped to the target container, storage account, parent resource group, or subscription.

  - Owning user of the target container or directory to which you plan to apply ACL settings. To set ACLs recursively, this includes all child items in the target container or directory.

  - Storage account key.

## Set up your project

Install the Azure Data Lake Storage client library for Python by using [pip](https://pypi.org/project/pip/).

```
pip install azure-storage-file-datalake
```

Add these import statements to the top of your code file.

```python
import os, uuid, sys
from azure.storage.filedatalake import DataLakeServiceClient
from azure.core._match_conditions import MatchConditions
from azure.storage.filedatalake._models import ContentSettings
from azure.identity import DefaultAzureCredential
```

## Connect to the account

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account.

### Connect by using Azure Active Directory (AD)

> [!NOTE]
> If you're using Azure Active Directory (Azure AD) to authorize access, then make sure that your security principal has been assigned the [Storage Blob Data Owner role](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner). To learn more about how ACL permissions are applied and the effects of changing them, see [Access control model in Azure Data Lake Storage Gen2](./data-lake-storage-access-control-model.md).

You can use the [Azure identity client library for Python](https://pypi.org/project/azure-identity/) to authenticate your application with Azure AD.

First, you'll have to assign one of the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) roles to your security principal:

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

Next, create a [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) instance and pass in a new instance of the [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) class.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithAAD":::

To learn more about using **DefaultAzureCredential** to authorize access to data, see [Overview: Authenticate Python apps to Azure using the Azure SDK](/azure/developer/python/sdk/authentication-overview).

### Connect by using an account key

You can authorize access to data using your account access keys (Shared Key). This example creates a [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) instance that is authorized with the account key.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithKey":::

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

## Set ACLs

When you *set* an ACL, you **replace** the entire ACL including all of its entries. If you want to change the permission level of a security principal or add a new security principal to the ACL without affecting other existing entries, you should *update* the ACL instead. To update an ACL instead of replace it, see the [Update ACLs](#update-acls-recursively) section of this article.

This section shows you how to:

- Set the ACL of a directory
- Set the ACL of a file

### Set the ACL of a directory

Get the access control list (ACL) of a directory by calling the **DataLakeDirectoryClient.get_access_control** method and set the ACL by calling the **DataLakeDirectoryClient.set_access_control** method.

This example gets and sets the ACL of a directory named `my-directory`. The string `rwxr-xrw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/ACL_datalake.py" id="Snippet_ACLDirectory":::

You can also get and set the ACL of the root directory of a container. To get the root directory, call the **FileSystemClient._get_root_directory_client** method.

### Set the ACL of a file

Get the access control list (ACL) of a file by calling the **DataLakeFileClient.get_access_control** method and set the ACL by calling the **DataLakeFileClient.set_access_control** method.

This example gets and sets the ACL of a file named `my-file.txt`. The string `rwxr-xrw-` gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read and write permission.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/ACL_datalake.py" id="Snippet_FileACL":::

## Set ACLs recursively

When you *set* an ACL, you **replace** the entire ACL including all of its entries. If you want to change the permission level of a security principal or add a new security principal to the ACL without affecting other existing entries, you should *update* the ACL instead. To update an ACL instead of replace it, see the [Update ACLs recursively](#update-acls-recursively) section of this article.

Set ACLs recursively by calling the **DataLakeDirectoryClient.set_access_control_recursive** method.

If you want to set a **default** ACL entry, then add the string `default:` to the beginning of each ACL entry string.

This example sets the ACL of a directory named `my-parent-directory`.

This method accepts a boolean parameter named `is_default_scope` that specifies whether to set the default ACL. If that parameter is `True`, the list of ACL entries are preceded with the string `default:`. These entries give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` read and execute permissions.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/ACL_datalake.py" id="Snippet_SetACLRecursively":::

To see an example that processes ACLs recursively in batches by specifying a batch size, see the Python [sample](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control_recursive.py).

## Update ACLs recursively

When you *update* an ACL, you modify the ACL instead of replacing the ACL. For example, you can add a new security principal to the ACL without affecting other security principals listed in the ACL. To replace the ACL instead of update it, see the [Set ACLs](#set-acls) section of this article.

To update an ACL recursively, create a new ACL object with the ACL entry that you want to update, and then use that object in update ACL operation. Do not get the existing ACL, just provide ACL entries to be updated. Update an ACL recursively by calling the **DataLakeDirectoryClient.update_access_control_recursive** method. If you want to update a **default** ACL entry, then add the string `default:` to the beginning of each ACL entry string.

This example updates an ACL entry with write permission.

This example sets the ACL of a directory named `my-parent-directory`. This method accepts a boolean parameter named `is_default_scope` that specifies whether to update the default ACL. if that parameter is `True`, the updated ACL entry is preceded with the string `default:`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/ACL_datalake.py" id="Snippet_UpdateACLsRecursively":::

To see an example that processes ACLs recursively in batches by specifying a batch size, see the Python [sample](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control_recursive.py).

## Remove ACL entries recursively

You can remove one or more ACL entries. To remove ACL entries recursively, create a new ACL object for ACL entry to be removed, and then use that object in remove ACL operation. Do not get the existing ACL, just provide the ACL entries to be removed.

Remove ACL entries by calling the **DataLakeDirectoryClient.remove_access_control_recursive** method. If you want to remove a **default** ACL entry, then add the string `default:` to the beginning of the ACL entry string.

This example removes an ACL entry from the ACL of the directory named `my-parent-directory`. This method accepts a boolean parameter named `is_default_scope` that specifies whether to remove the entry from the default ACL. if that parameter is `True`, the updated ACL entry is preceded with the string `default:`.

```python
def remove_permission_recursively(is_default_scope):

    try:
        file_system_client = service_client.get_file_system_client(file_system="my-container")

        directory_client = file_system_client.get_directory_client("my-parent-directory")

        acl = 'user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

        if is_default_scope:
           acl = 'default:user:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

        directory_client.remove_access_control_recursive(acl=acl)

    except Exception as e:
     print(e)
```

To see an example that processes ACLs recursively in batches by specifying a batch size, see the Python [sample](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control_recursive.py).

## Recover from failures

You might encounter runtime or permission errors. For runtime errors, restart the process from the beginning. Permission errors can occur if the security principal doesn't have sufficient permission to modify the ACL of a directory or file that is in the directory hierarchy being modified. Address the permission issue, and then choose to either resume the process from the point of failure by using a continuation token, or restart the process from beginning. You don't have to use the continuation token if you prefer to restart from the beginning. You can reapply ACL entries without any negative impact.

This example returns a continuation token in the event of a failure. The application can call this example method again after the error has been addressed, and pass in the continuation token. If this example method is called for the first time, the application can pass in a value of `None` for the continuation token parameter.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/ACL_datalake.py" id="Snippet_ResumeContinuationToken":::

To see an example that processes ACLs recursively in batches by specifying a batch size, see the Python [sample](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control_recursive.py).

If you want the process to complete uninterrupted by permission errors, you can specify that.

To ensure that the process completes uninterrupted, don't pass a continuation token into the **DataLakeDirectoryClient.set_access_control_recursive** method.

This example sets ACL entries recursively. If this code encounters a permission error, it records that failure and continues execution. This example prints the number of failures to the console.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/ACL_datalake.py" id="Snippet_ContinueOnFailure":::

To see an example that processes ACLs recursively in batches by specifying a batch size, see the Python [sample](https://github.com/Azure/azure-sdk-for-python/blob/master/sdk/storage/azure-storage-file-datalake/samples/datalake_samples_access_control_recursive.py).

[!INCLUDE [updated-for-az](../../../includes/recursive-acl-best-practices.md)]

## See also

- [API reference documentation](/python/api/azure-storage-file-datalake/azure.storage.filedatalake)
- [Package (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)
- [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
- [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
