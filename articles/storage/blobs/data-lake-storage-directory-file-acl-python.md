---
title: Use Python to manage data in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use Python to manage directories and files in a storage account that has hierarchical namespace enabled.
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

# Use Python to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use Python to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use Python to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-python.md).

[Package (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples) | [API reference](/python/api/azure-storage-file-datalake/azure.storage.filedatalake) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has [hierarchical namespace](./data-lake-storage-namespace.md) enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

## Set up your project

This section walks you through preparing a project to work with the Azure Data Lake Storage client library for Python.

From your project directory, install packages for the Azure Data Lake Storage and Azure Identity client libraries using the `pip install` command. The **azure-identity** package is needed for passwordless connections to Azure services.

```console
pip install azure-storage-file-datalake azure-identity
```

Then open your code file and add the necessary import statements. In this example, we add the following to our *.py* file:

```python
import os, uuid, sys
from azure.identity import DefaultAzureCredential
from azure.storage.filedatalake import DataLakeServiceClient
from azure.core._match_conditions import MatchConditions
from azure.storage.filedatalake._models import ContentSettings
```

## Authorize access and connect to data resources

To work with the code examples in this article, you need to create an authorized [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) instance that represents the storage account. You can authorize a `DataLakeServiceClient` using Azure Active Directory (Azure AD), an account access key, or a shared access signature (SAS).

### [Azure AD](#tab/azure-ad)

You can use the [Azure identity client library for Python](https://pypi.org/project/azure-identity/) to authenticate your application with Azure AD.

Create an instance of the [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) class and pass in a [DefaultAzureCredential](/python/api/azure-identity/azure.identity.defaultazurecredential) object.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithAAD":::

To learn more about using `DefaultAzureCredential` to authorize access to data, see [Overview: Authenticate Python apps to Azure using the Azure SDK](/azure/developer/python/sdk/authentication-overview).

### [SAS token](#tab/sas-token)

To use a shared access signature (SAS) token, provide the token as a string and initialize a [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) object. If your account URL includes the SAS token, omit the credential parameter.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithSAS":::

To learn more about generating and managing SAS tokens, see the following article:

- [Grant limited access to Azure Storage resources using shared access signatures (SAS)](../common/storage-sas-overview.md?toc=/azure/storage/blobs/toc.json)

### [Account key](#tab/account-key)

You can authorize access to data using your account access keys (Shared Key). This example creates a [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) instance that is authorized with the account key.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithKey":::

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

---

## Create a container

A container acts as a file system for your files. You can create one by calling the [DataLakeServiceClient.create_file_system method](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient#azure-storage-filedatalake-datalakeserviceclient-create-file-system).

This example creates a container named `my-file-system`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_CreateContainer":::

## Create a directory

Create a directory reference by calling the [FileSystemClient.create_directory](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.filesystemclient#azure-storage-filedatalake-filesystemclient-create-directory) method.

This example adds a directory named `my-directory` to a container.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_CreateDirectory":::

## Rename or move a directory

Rename or move a directory by calling the [DataLakeDirectoryClient.rename_directory](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakedirectoryclient#azure-storage-filedatalake-datalakedirectoryclient-rename-directory) method. Pass the path of the desired directory a parameter.

This example renames a subdirectory to the name `my-directory-renamed`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_RenameDirectory":::

## Delete a directory

Delete a directory by calling the [DataLakeDirectoryClient.delete_directory](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakedirectoryclient#azure-storage-filedatalake-datalakedirectoryclient-delete-directory) method.

This example deletes a directory named `my-directory`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_DeleteDirectory":::

## Upload a file to a directory

First, create a file reference in the target directory by creating an instance of the **DataLakeFileClient** class. Upload a file by calling the [DataLakeFileClient.append_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-append-data) method. Make sure to complete the upload by calling the [DataLakeFileClient.flush_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-flush-data) method.

This example uploads a text file to a directory named `my-directory`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_UploadFile":::

> [!TIP]
> If your file size is large, your code will have to make multiple calls to the **DataLakeFileClient** [append_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-append-data) method. Consider using the [upload_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-upload-data) method instead. That way, you can upload the entire file in a single call.

## Upload a large file to a directory

Use the [DataLakeFileClient.upload_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-upload-data) method to upload large files without having to make multiple calls to the [DataLakeFileClient.append_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-append-data) method.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_UploadFileBulk":::

## Download from a directory

Open a local file for writing. Then, create a **DataLakeFileClient** instance that represents the file that you want to download. Call the [DataLakeFileClient.download_file](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-download-file) to read bytes from the file and then write those bytes to the local file.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_DownloadFromDirectory":::

## List directory contents

List directory contents by calling the [FileSystemClient.get_paths](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.filesystemclient#azure-storage-filedatalake-filesystemclient-get-paths) method, and then enumerating through the results.

This example, prints the path of each subdirectory and file that is located in a directory named `my-directory`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_ListFilesInDirectory":::

## See also

- [API reference documentation](/python/api/azure-storage-file-datalake/azure.storage.filedatalake)
- [Azure File Data Lake Storage Client Library (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)
