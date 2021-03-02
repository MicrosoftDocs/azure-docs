---
title: Use Python to manage data in Azure Data Lake Storage Gen2
description: Use Python to manage directories and files in storage accounts that has hierarchical namespace enabled.
author: normesta
ms.service: storage
ms.date: 02/17/2021
ms.author: normesta
ms.topic: how-to
ms.subservice: data-lake-storage-gen2
ms.reviewer: prishet
ms.custom: devx-track-python
---

# Use Python to manage directories and files in Azure Data Lake Storage Gen2

This article shows you how to use Python to create and manage directories and files in storage accounts that have a hierarchical namespace.

To learn about how to get, set, and update the access control lists (ACL) of directories and files, see [Use Python to manage ACLs in Azure Data Lake Storage Gen2](data-lake-storage-acl-python.md).

[Package (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/) | [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples) | [API reference](/python/api/azure-storage-file-datalake/azure.storage.filedatalake) | [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md) | [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)

## Prerequisites

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/pricing/free-trial/).

- A storage account that has hierarchical namespace enabled. Follow [these](create-data-lake-storage-account.md) instructions to create one.

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
```

## Connect to the account

To use the snippets in this article, you'll need to create a **DataLakeServiceClient** instance that represents the storage account. 

### Connect by using an account key

This is the easiest way to connect to an account. 

This example creates a **DataLakeServiceClient** instance by using an account key.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithKey":::

- Replace the `storage_account_name` placeholder value with the name of your storage account.

- Replace the `storage_account_key` placeholder value with your storage account access key.

### Connect by using Azure Active Directory (Azure AD)

You can use the [Azure identity client library for Python](https://pypi.org/project/azure-identity/) to authenticate your application with Azure AD.

This example creates a **DataLakeServiceClient** instance by using a client ID, a client secret, and a tenant ID.  To get these values, see [Acquire a token from Azure AD for authorizing requests from a client application](../common/storage-auth-aad-app.md).

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_AuthorizeWithAAD":::

> [!NOTE]
> For more examples, see the [Azure identity client library for Python](https://pypi.org/project/azure-identity/) documentation.

## Create a container

A container acts as a file system for your files. You can create one by calling the **FileSystemDataLakeServiceClient.create_file_system** method.

This example creates a container named `my-file-system`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_CreateContainer":::

## Create a directory

Create a directory reference by calling the **FileSystemClient.create_directory** method.

This example adds a directory named `my-directory` to a container. 

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_CreateDirectory":::

## Rename or move a directory

Rename or move a directory by calling the **DataLakeDirectoryClient.rename_directory** method. Pass the path of the desired directory a parameter. 

This example renames a sub-directory to the name `my-subdirectory-renamed`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_RenameDirectory":::

## Delete a directory

Delete a directory by calling the **DataLakeDirectoryClient.delete_directory** method.

This example deletes a directory named `my-directory`.  

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_DeleteDirectory":::

## Upload a file to a directory

First, create a file reference in the target directory by creating an instance of the **DataLakeFileClient** class. Upload a file by calling the **DataLakeFileClient.append_data** method. Make sure to complete the upload by calling the **DataLakeFileClient.flush_data** method.

This example uploads a text file to a directory named `my-directory`.   

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_UploadFile":::

> [!TIP]
> If your file size is large, your code will have to make multiple calls to the **DataLakeFileClient.append_data** method. Consider using the **DataLakeFileClient.upload_data** method instead. That way, you can upload the entire file in a single call. 

## Upload a large file to a directory

Use the **DataLakeFileClient.upload_data** method to upload large files without having to make multiple calls to the **DataLakeFileClient.append_data** method.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_UploadFileBulk":::

## Download from a directory 

Open a local file for writing. Then, create a **DataLakeFileClient** instance that represents the file that you want to download. Call the **DataLakeFileClient.read_file** to read bytes from the file and then write those bytes to the local file. 

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_DownloadFromDirectory":::

## List directory contents

List directory contents by calling the **FileSystemClient.get_paths** method, and then enumerating through the results.

This example, prints the path of each subdirectory and file that is located in a directory named `my-directory`.

:::code language="python" source="~/azure-storage-snippets/blobs/howto/python/python-v12/crud_datalake.py" id="Snippet_ListFilesInDirectory":::

## See also

- [API reference documentation](/python/api/azure-storage-file-datalake/azure.storage.filedatalake)
- [Package (Python Package Index)](https://pypi.org/project/azure-storage-file-datalake/)
- [Samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/samples)
- [Gen1 to Gen2 mapping](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-file-datalake/GEN1_GEN2_MAPPING.md)
- [Known issues](data-lake-storage-known-issues.md#api-scope-data-lake-client-library)
- [Give Feedback](https://github.com/Azure/azure-sdk-for-python/issues)