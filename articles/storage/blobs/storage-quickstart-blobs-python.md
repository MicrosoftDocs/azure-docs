---
title: 'Quickstart: Azure Blob Storage library v12 - Python'
description: In this quickstart, you learn how to use the Azure Blob Storage client library version 12 for Python to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: twooley
ms.author: twooley
ms.date: 01/28/2021
ms.topic: quickstart
ms.service: storage
ms.subservice: blobs
ms.custom:
  - devx-track-python
  - mode-api
---

# Quickstart: Manage blobs with Python v12 SDK

In this quickstart, you learn to manage blobs by using Python. Blobs are objects that can hold large amounts of text or binary data, including images, documents, streaming media, and archive data. You'll upload, download, and list blobs, and you'll create and delete containers.

More resources:

* [API reference documentation](/python/api/azure-storage-blob)
* [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob)
* [Package (Python Package Index)](https://pypi.org/project/azure-storage-blob/)
* [Samples](../common/storage-samples-python.md?toc=%2fazure%2fstorage%2fblobs%2ftoc.json#blob-samples)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio).
- An Azure Storage account. [Create a storage account](../common/storage-account-create.md).
- [Python](https://www.python.org/downloads/) 2.7 or 3.6+.

[!INCLUDE [storage-multi-protocol-access-preview](../../../includes/storage-multi-protocol-access-preview.md)]

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library v12 for Python.

### Create the project

Create a Python application named *blob-quickstart-v12*.

1. In a console window (such as cmd, PowerShell, or Bash), create a new directory for the project.

    ```console
    mkdir blob-quickstart-v12
    ```

1. Switch to the newly created *blob-quickstart-v12* directory.

    ```console
    cd blob-quickstart-v12
    ```

1. In side the *blob-quickstart-v12* directory, create another directory called *data*. This directory is where the blob data files will be created and stored.

    ```console
    mkdir data
    ```

### Install the package

While still in the application directory, install the Azure Blob Storage client library for Python package by using the `pip install` command.

```console
pip install azure-storage-blob
```

This command installs the Azure Blob Storage client library for Python package and all the libraries on which it depends. In this case, that is just the Azure core library for Python.

### Set up the app framework

From the project directory:

1. Open a new text file in your code editor
1. Add `import` statements
1. Create the structure for the program, including basic exception handling

    Here's the code:

    :::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/app_framework.py":::

1. Save the new file as *blob-quickstart-v12.py* in the *blob-quickstart-v12* directory.

[!INCLUDE [storage-quickstart-credentials-include](../../../includes/storage-quickstart-credentials-include.md)]

## Object model

Azure Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

* The storage account
* A container in the storage account
* A blob in the container

The following diagram shows the relationship between these resources.

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following Python classes to interact with these resources:

* [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
* [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient): The `ContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
* [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

## Code examples

These example code snippets show you how to do the following tasks with the Azure Blob Storage client library for Python:

* [Get the connection string](#get-the-connection-string)
* [Create a container](#create-a-container)
* [Upload blobs to a container](#upload-blobs-to-a-container)
* [List the blobs in a container](#list-the-blobs-in-a-container)
* [Download blobs](#download-blobs)
* [Delete a container](#delete-a-container)

### Get the connection string

The code below retrieves the storage account connection string from the environment variable created in the [Configure your storage connection string](#configure-your-storage-connection-string) section.

Add this code inside the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/blob-quickstart-v12.py" id="Snippet_ConnectionString":::

### Create a container

Decide on a name for the new container. The code below appends a UUID value to the container name to ensure that it's unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Create an instance of the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) class by calling the [from_connection_string](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#from-connection-string-conn-str--credential-none----kwargs-) method. Then, call the [create_container](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#create-container-name--metadata-none--public-access-none----kwargs-) method to actually create the container in your storage account.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/blob-quickstart-v12.py" id="Snippet_CreateContainer":::

### Upload blobs to a container

The following code snippet:

1. Creates a local directory to hold data files.
1. Creates a text file in the local directory.
1. Gets a reference to a [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) object by calling the [get_blob_client](/python/api/azure-storage-blob/azure.storage.blob.containerclient#get-blob-client-blob--snapshot-none-) method on the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) from the [Create a container](#create-a-container) section.
1. Uploads the local text file to the blob by calling the [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#upload-blob-data--blob-type--blobtype-blockblob---blockblob----length-none--metadata-none----kwargs-) method.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/blob-quickstart-v12.py" id="Snippet_UploadBlobs":::

### List the blobs in a container

List the blobs in the container by calling the [list_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#list-blobs-name-starts-with-none--include-none----kwargs-) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/blob-quickstart-v12.py" id="Snippet_ListBlobs":::

### Download blobs

Download the previously created blob by calling the [download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#download-blob-offset-none--length-none----kwargs-) method. The example code adds a suffix of "DOWNLOAD" to the file name so that you can see both files in local file system.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/blob-quickstart-v12.py" id="Snippet_DownloadBlobs":::

### Delete a container

The following code cleans up the resources the app created by removing the entire container using the [​delete_container](/python/api/azure-storage-blob/azure.storage.blob.containerclient#delete-container---kwargs-) method. You can also delete the local files, if you like.

The app pauses for user input by calling `input()` before it deletes the blob, container, and local files. Verify that the resources were created correctly, before they're deleted.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/V12/blob-quickstart-v12.py" id="Snippet_CleanUp":::

## Run the code

This app creates a test file in your local folder and uploads it to Azure Blob Storage. The example then lists the blobs in the container, and downloads the file with a new name. You can compare the old and new files.

Navigate to the directory containing the *blob-quickstart-v12.py* file, then execute the following `python` command to run the app.

```console
python blob-quickstart-v12.py
```

The output of the app is similar to the following example:

```output
Azure Blob Storage v12 - Python quickstart sample

Uploading to Azure Storage as blob:
        quickstartcf275796-2188-4057-b6fb-038352e35038.txt

Listing blobs...
        quickstartcf275796-2188-4057-b6fb-038352e35038.txt

Downloading blob to
        ./data/quickstartcf275796-2188-4057-b6fb-038352e35038DOWNLOAD.txt

Press the Enter key to begin clean up

Deleting blob container...
Deleting the local source and downloaded files...
Done
```

Before you begin the cleanup process, check your *data* folder for the two files. You can open them and observe that they're identical.

After you've verified the files, press the **Enter** key to delete the test files and finish the demo.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using Python.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage SDK v12 Python samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob/samples)

* To learn more, see the [Azure Storage client libraries for Python](/azure/developer/python/sdk/storage/overview).
* For tutorials, samples, quickstarts, and other documentation, visit [Azure for Python Developers](/azure/python/).
