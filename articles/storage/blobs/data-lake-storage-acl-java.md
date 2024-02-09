---
title: Use Java to manage ACLs in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use Azure Storage libraries for Java to manage access control lists (ACL) in storage accounts that has hierarchical namespace (HNS) enabled.
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-data-lake-storage
ms.date: 02/07/2023
ms.devlang: java
ms.topic: how-to
ms.reviewer: prishet
ms.custom: devx-track-java, devx-track-extended-java
---

# Use Java to manage ACLs in Azure Data Lake Storage Gen2

This article shows you how to use Java to get, set, and update the access control lists of directories and files.

ACL inheritance is already available for new child items that are created under a parent directory. But you can also add, update, and remove ACLs recursively on the existing child items of a parent directory without having to make these changes individually for each child item.

[Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) | [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake) | [API reference](/java/api/overview/azure/storage-file-datalake-readme) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace (HNS) enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

- Azure CLI version `2.6.0` or higher.

- One of the following security permissions:

  - A provisioned Microsoft Entra ID [security principal](../../role-based-access-control/overview.md#security-principal) that has been assigned the [Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner) role, scoped to the target container, storage account, parent resource group, or subscription..

  - Owning user of the target container or directory to which you plan to apply ACL settings. To set ACLs recursively, this includes all child items in the target container or directory.

  - Storage account key.

## Set up your project

To get started, open [this page](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake) and find the latest version of the Java library. Then, open the *pom.xml* file in your text editor. Add a dependency element that references that version.

If you plan to authenticate your client application by using Microsoft Entra ID, then add a dependency to the Azure Secret Client Library. See  [Adding the Secret Client Library package to your project](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity#adding-the-package-to-your-project).

Next, add these imports statements to your code file.

```java
import com.azure.storage.common.StorageSharedKeyCredential;
import com.azure.storage.file.datalake.DataLakeDirectoryClient;
import com.azure.storage.file.datalake.DataLakeFileClient;
import com.azure.storage.file.datalake.DataLakeFileSystemClient;
import com.azure.storage.file.datalake.DataLakeServiceClient;
import com.azure.storage.file.datalake.DataLakeServiceClientBuilder;
import com.azure.storage.file.datalake.models.ListPathsOptions;
import com.azure.storage.file.datalake.models.PathItem;
import com.azure.storage.file.datalake.models.AccessControlChangeCounters;
import com.azure.storage.file.datalake.models.AccessControlChangeResult;
import com.azure.storage.file.datalake.models.AccessControlType;
import com.azure.storage.file.datalake.models.PathAccessControl;
import com.azure.storage.file.datalake.models.PathAccessControlEntry;
import com.azure.storage.file.datalake.models.PathPermissions;
import com.azure.storage.file.datalake.models.PathRemoveAccessControlEntry;
import com.azure.storage.file.datalake.models.RolePermissions;
import com.azure.storage.file.datalake.options.PathSetAccessControlRecursiveOptions;
```

## Connect to the account

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account.

<a name='connect-by-using-azure-active-directory-azure-ad'></a>

### Connect by using Microsoft Entra ID

You can use the [Azure identity client library for Java](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/identity/azure-identity) to authenticate your application with Microsoft Entra ID.

First, you'll have to assign one of the following [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md) roles to your security principal:

|Role|ACL setting capability|
|--|--|
|[Storage Blob Data Owner](../../role-based-access-control/built-in-roles.md#storage-blob-data-owner)|All directories and files in the account.|
|[Storage Blob Data Contributor](../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor)|Only directories and files owned by the security principal.|

Next, create a [DataLakeServiceClient](/java/api/com.azure.storage.file.datalake.datalakeserviceclient) instance and pass in a new instance of the [DefaultAzureCredential](/java/api/com.azure.identity.defaultazurecredential) class.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithAzureAD":::

To learn more about using **DefaultAzureCredential** to authorize access to data, see [Azure Identity client library for Java](/java/api/overview/azure/identity-readme).

### Connect by using an account key

You can authorize access to data using your account access keys (Shared Key). This example creates a [DataLakeServiceClient](/dotnet/api/azure.storage.files.datalake.datalakeserviceclient) instance that is authorized with the account key.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/Authorize_DataLake.java" id="Snippet_AuthorizeWithKey":::

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

## Set ACLs

When you *set* an ACL, you **replace** the entire ACL including all of its entries. If you want to change the permission level of a security principal or add a new security principal to the ACL without affecting other existing entries, you should *update* the ACL instead. To update an ACL instead of replace it, see the [Update ACLs](#update-acls) section of this article.

If you choose to *set* the ACL, you must add an entry for the owning user, an entry for the owning group, and an entry for all other users. To learn more about the owning user, the owning group, and all other users, see [Users and identities](data-lake-storage-access-control.md#users-and-identities).

This section shows you how to:

- Set the ACL of a directory
- Set the ACL of a file
- Set ACLs recursively

### Set the ACL of a directory

This example gets and then sets the ACL of a directory named `my-directory`. This example gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read access.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_ManageDirectoryACLs":::

You can also get and set the ACL of the root directory of a container. To get the root directory, pass an empty string (`""`) into the **DataLakeFileSystemClient.getDirectoryClient** method.

### Set the ACL of a file

This example gets and then sets the ACL of a file named `upload-file.txt`. This example gives the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others read access.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_ManageFileACLs":::

### Set ACLs recursively

Set ACLs recursively by calling the **DataLakeDirectoryClient.setAccessControlRecursive** method. Pass this method a [List](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) of [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) objects. Each [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) defines an ACL entry.

If you want to set a **default** ACL entry, then you can call the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) and pass in a value of **true**.

This example sets the ACL of a directory named `my-parent-directory`. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to set the default ACL. That parameter is used in each call to the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html). The entries of the ACL give the owning user read, write, and execute permissions, gives the owning group only read and execute permissions, and gives all others no access. The last ACL entry in this example gives a specific user with the object ID "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" read and execute permissions.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_SetACLRecursively":::

## Update ACLs

When you *update* an ACL, you modify the ACL instead of replacing the ACL. For example, you can add a new security principal to the ACL without affecting other security principals listed in the ACL.  To replace the ACL instead of update it, see the [Set ACLs](#set-acls) section of this article.

This section shows you how to:

- Update an ACL
- Update ACLs recursively

### Update an ACL

First, get the ACL of a directory by calling the [PathAccessControl.getAccessControlList](/java/api/com.azure.storage.file.datalake.models.pathaccesscontrol.getaccesscontrollist) method. Copy the list of ACL entries to a new **List** object of type [PathAccessControlListEntry](/java/api/com.azure.storage.file.datalake.models.pathaccesscontrolentry). Then locate the entry that you want to update and replace it in the list. Set the ACL by calling the [DataLakeDirectoryClient.setAccessControlList](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.setaccesscontrollist) method.

This example updates the ACL of a directory named `my-parent-directory` by replacing the entry for all other users.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_UpdateACL":::

You can also get and set the ACL of the root directory of a container. To get the root directory, pass an empty string (`""`) into the **DataLakeFileSystemClient.getDirectoryClient** method.

### Update ACLs recursively

To update an ACL recursively, create a new ACL object with the ACL entry that you want to update, and then use that object in update ACL operation. Do not get the existing ACL, just provide ACL entries to be updated.

Update ACLs recursively by calling the **DataLakeDirectoryClient.updateAccessControlRecursive** method.  Pass this method a [List](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) of [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) objects. Each [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) defines an ACL entry.

If you want to update a **default** ACL entry, then you can call the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) and pass in a value of **true**.

This example updates an ACL entry with write permission. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to update the default ACL. That parameter is used in the call to the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html).

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_UpdateACLRecursively":::

## Remove ACL entries

You can remove one or more ACL entries. This section shows you how to:

- Remove an ACL entry
- Remove ACL entries recursively

### Remove an ACL entry

First, get the ACL of a directory by calling the [PathAccessControl.getAccessControlList](/java/api/com.azure.storage.file.datalake.models.pathaccesscontrol.getaccesscontrollist) method. Copy the list of ACL entries to a new **List** object of type [PathAccessControlListEntry](/java/api/com.azure.storage.file.datalake.models.pathaccesscontrolentry). Then locate the entry that you want to remove and call the **Remove** method of the **List** object. Set the updated ACL by calling the [DataLakeDirectoryClient.setAccessControlList](/dotnet/api/azure.storage.files.datalake.datalakedirectoryclient.setaccesscontrollist) method.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_RemoveACLEntry":::

### Remove ACL entries recursively

To remove ACL entries recursively, create a new ACL object for ACL entry to be removed, and then use that object in remove ACL operation. Do not get the existing ACL, just provide the ACL entries to be removed.

Remove ACL entries by calling the **DataLakeDirectoryClient.removeAccessControlRecursive** method. Pass this method a [List](https://docs.oracle.com/javase/8/docs/api/java/util/List.html) of [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) objects. Each [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) defines an ACL entry.

If you want to remove a **default** ACL entry, then you can call the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) and pass in a value of **true**.

This example removes an ACL entry from the ACL of the directory named `my-parent-directory`. This method accepts a boolean parameter named `isDefaultScope` that specifies whether to remove the entry from the default ACL. That parameter is used in the call to the **setDefaultScope** method of the [PathAccessControlEntry](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html).

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_RemoveACLRecursively":::

## Recover from failures

You might encounter runtime or permission errors. For runtime errors, restart the process from the beginning. Permission errors can occur if the security principal doesn't have sufficient permission to modify the ACL of a directory or file that is in the directory hierarchy being modified. Address the permission issue, and then choose to either resume the process from the point of failure by using a continuation token, or restart the process from beginning. You don't have to use the continuation token if you prefer to restart from the beginning. You can reapply ACL entries without any negative impact.

This example returns a continuation token in the event of a failure. The application can call this example method again after the error has been addressed, and pass in the continuation token. If this example method is called for the first time, the application can pass in a value of `null` for the continuation token parameter.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_ResumeSetACLRecursively":::

If you want the process to complete uninterrupted by permission errors, you can specify that.

To ensure that the process completes uninterrupted, call the **setContinueOnFailure** method of a [PathSetAccessControlRecursiveOptions](https://azuresdkdocs.blob.core.windows.net/$web/java/azure-storage-file-datalake/12.3.0-beta.1/index.html) object and pass in a value of **true**.

This example sets ACL entries recursively. If this code encounters a permission error, it records that failure and continues execution. This example prints the number of failures to the console.

:::code language="java" source="~/azure-storage-snippets/blobs/howto/Java/Java-v12/src/main/java/com/datalake/manage/ACL_DataLake.java" id="Snippet_ContinueOnFailure":::

[!INCLUDE [recursive-acl-best-practices](../../../includes/recursive-acl-best-practices.md)]

## See also

- [API reference documentation](/java/api/overview/azure/storage-file-datalake-readme)
- [Package (Maven)](https://search.maven.org/artifact/com.azure/azure-storage-file-datalake)
- [Samples](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-java/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-java/issues)
- [Access control model in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
- [Access control lists (ACLs) in Azure Data Lake Storage Gen2](data-lake-storage-access-control.md)
