---
title: Use Python to manage data in Azure Data Lake Storage Gen2
titleSuffix: Azure Storage
description: Use Python to manage directories and files in a storage account that has hierarchical namespace enabled.
author: pauljewellmsft

ms.author: pauljewell
ms.service: azure-data-lake-storage
ms.date: 07/18/2023
ms.topic: how-to
ms.reviewer: prishet
ms.devlang: python
ms.custom: devx-track-python
---

# Use Python to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use Python to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use Python to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-python.md).

[Package (PyPi)](https://pypi.org/project/azure-storage-file-datalake/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples) | [API reference](/python/api/azure-storage-file-datalake/azure.storage.filedatalake) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)

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
import os
from azure.storage.filedatalake import (
    DataLakeServiceClient,
    DataLakeDirectoryClient,
    FileSystemClient
)
from azure.identity import DefaultAzureCredential
```

## Authorize access and connect to data resources

To work with the code examples in this article, you need to create an authorized [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) instance that represents the storage account. You can authorize a `DataLakeServiceClient` object using Azure Active Directory (Azure AD), an account access key, or a shared access signature (SAS).

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

You can authorize access to data using your account access keys (Shared Key). The following code example creates a [DataLakeServiceClient](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient) instance that is authorized with the account key:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithKey":::

[!INCLUDE [storage-shared-key-caution](../../../includes/storage-shared-key-caution.md)]

---

## Create a container

A container acts as a file system for your files. You can create a container by using the following method:

- [DataLakeServiceClient.create_file_system](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakeserviceclient#azure-storage-filedatalake-datalakeserviceclient-create-file-system)

The following code example creates a container and returns a `FileSystemClient` object for later use:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_CreateContainer":::

## Create a directory

You can create a directory reference in the container by using the following method:

- [FileSystemClient.create_directory](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.filesystemclient#azure-storage-filedatalake-filesystemclient-create-directory)

The following code example adds a directory to a container and returns a `DataLakeDirectoryClient` object for later use:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_CreateDirectory":::

## Rename or move a directory

You can rename or move a directory by using the following method:

- [DataLakeDirectoryClient.rename_directory](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakedirectoryclient#azure-storage-filedatalake-datalakedirectoryclient-rename-directory)

Pass the path with the new directory name in the `new_name` argument. The value must have the following format: {filesystem}/{directory}/{subdirectory}.

The following code example shows how to rename a subdirectory:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_RenameDirectory":::

## Upload a file to a directory

You can upload content to a new or existing file by using the following method:

- [DataLakeFileClient.upload_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-upload-data)

The following code example shows how to upload a file to a directory using the [upload_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-upload-data) method:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_UploadFile":::

You can use this method to create and upload content to a new file, or you can set the `overwrite` argument to `True` to overwrite an existing file.

## Append data to a file

You can upload data to be appended to a file by using the following method:

- [DataLakeFileClient.append_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-append-data) method.

The following code example shows how to append data to the end of a file using these steps:

- Create a `DataLakeFileClient` object to represent the file resource you're working with.
- Upload data to the file using the [append_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-append-data) method.
- Complete the upload by calling the [flush_data](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-flush-data) method to write the previously uploaded data to the file.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AppendData":::

With this method, data can only be appended to a file and the operation is limited to 4000 MiB per request.

## Download from a directory

The following code example shows how to download a file from a directory to a local file using these steps:

- Create a `DataLakeFileClient` object to represent the file you want to download.
- Open a local file for writing. 
- Call the [DataLakeFileClient.download_file](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakefileclient#azure-storage-filedatalake-datalakefileclient-download-file) method to read from the file, then write the data to the local file.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_DownloadFromDirectory":::

## List directory contents

You can list directory contents by using the following method and enumerating the result:

- [FileSystemClient.get_paths](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.filesystemclient#azure-storage-filedatalake-filesystemclient-get-paths)

Enumerating the paths in the result may make multiple requests to the service while fetching the values.

The following code example prints the path of each subdirectory and file that is located in a directory:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_ListFilesInDirectory":::

## Delete a directory

You can delete a directory by using the following method:

- [DataLakeDirectoryClient.delete_directory](/python/api/azure-storage-file-datalake/azure.storage.filedatalake.datalakedirectoryclient#azure-storage-filedatalake-datalakedirectoryclient-delete-directory)

The following code example shows how to delete a directory:

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_DeleteDirectory":::

## See also

- [API reference documentation](/python/api/azure-storage-file-datalake/azure.storage.filedatalake)
- [Azure File Data Lake Storage Client Library (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)