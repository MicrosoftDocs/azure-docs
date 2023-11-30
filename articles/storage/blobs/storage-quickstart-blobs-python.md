---
title: "Quickstart: Azure Blob Storage client library for Python"
titleSuffix: Azure Storage
description: In this quickstart, you learn how to use the Azure Blob Storage client library for Python to create a container and a blob in Blob (object) storage. Next, you learn how to download the blob to your local computer, and how to list all of the blobs in a container.
author: pauljewellmsft

ms.author: pauljewell
ms.date: 10/24/2022
ms.topic: quickstart
ms.service: azure-blob-storage
ms.devlang: python
ms.custom: devx-track-python, mode-api, passwordless-python
---

# Quickstart: Azure Blob Storage client library for Python

Get started with the Azure Blob Storage client library for Python to manage blobs and containers. Follow these steps to install the package and try out example code for basic tasks in an interactive console app.

[API reference documentation](/python/api/azure-storage-blob) | [Library source code](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob) | [Package (PyPi)](https://pypi.org/project/azure-storage-blob/) | [Samples](../common/storage-samples-python.md?toc=/azure/storage/blobs/toc.json#blob-samples)

## Prerequisites

- Azure account with an active subscription - [create an account for free](https://azure.microsoft.com/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio)
- Azure Storage account - [create a storage account](../common/storage-account-create.md)
- [Python](https://www.python.org/downloads/) 3.7+

## Setting up

This section walks you through preparing a project to work with the Azure Blob Storage client library for Python.

### Create the project

Create a Python application named *blob-quickstart*.

1. In a console window (such as PowerShell or Bash), create a new directory for the project:

    ```console
    mkdir blob-quickstart
    ```

1. Switch to the newly created *blob-quickstart* directory:

    ```console
    cd blob-quickstart
    ```

### Install the packages

From the project directory, install packages for the Azure Blob Storage and Azure Identity client libraries using the `pip install` command. The **azure-identity** package is needed for passwordless connections to Azure services.

```console
pip install azure-storage-blob azure-identity
```

### Set up the app framework

From the project directory, follow steps to create the basic structure of the app:

1. Open a new text file in your code editor.
1. Add `import` statements, create the structure for the program, and include basic exception handling, as shown below.
1. Save the new file as *blob-quickstart.py* in the *blob-quickstart* directory.
:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/app-framework-qs.py":::

## Object model

Azure Blob Storage is optimized for storing massive amounts of unstructured data. Unstructured data is data that doesn't adhere to a particular data model or definition, such as text or binary data. Blob storage offers three types of resources:

- The storage account
- A container in the storage account
- A blob in the container

The following diagram shows the relationship between these resources:

![Diagram of Blob storage architecture](./media/storage-blobs-introduction/blob1.png)

Use the following Python classes to interact with these resources:

- [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient): The `BlobServiceClient` class allows you to manipulate Azure Storage resources and blob containers.
- [ContainerClient](/python/api/azure-storage-blob/azure.storage.blob.containerclient): The `ContainerClient` class allows you to manipulate Azure Storage containers and their blobs.
- [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient): The `BlobClient` class allows you to manipulate Azure Storage blobs.

## Code examples

These example code snippets show you how to do the following tasks with the Azure Blob Storage client library for Python:

- [Authenticate to Azure and authorize access to blob data](#authenticate-to-azure-and-authorize-access-to-blob-data)
- [Create a container](#create-a-container)
- [Upload blobs to a container](#upload-blobs-to-a-container)
- [List the blobs in a container](#list-the-blobs-in-a-container)
- [Download blobs](#download-blobs)
- [Delete a container](#delete-a-container)

### Authenticate to Azure and authorize access to blob data

[!INCLUDE [storage-quickstart-passwordless-auth-intro](../../../includes/storage-quickstart-passwordless-auth-intro.md)]

### [Passwordless (Recommended)](#tab/managed-identity)

`DefaultAzureCredential` supports multiple authentication methods and determines which method should be used at runtime. This approach enables your app to use different authentication methods in different environments (local vs. production) without implementing environment-specific code.

The order and locations in which `DefaultAzureCredential` looks for credentials can be found in the [Azure Identity library overview](/python/api/overview/azure/identity-readme#defaultazurecredential).

For example, your app can authenticate using your Azure CLI sign-in credentials with when developing locally. Your app can then use a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md) once it has been deployed to Azure. No code changes are required for this transition.

<a name='assign-roles-to-your-azure-ad-user-account'></a>

#### Assign roles to your Microsoft Entra user account

[!INCLUDE [assign-roles](../../../includes/assign-roles.md)]

#### Sign in and connect your app code to Azure using DefaultAzureCredential

You can authorize access to data in your storage account using the following steps:

1. Make sure you're authenticated with the same Microsoft Entra account you assigned the role to on your storage account. You can authenticate via the Azure CLI, Visual Studio Code, or Azure PowerShell.

    #### [Azure CLI](#tab/sign-in-azure-cli)

    Sign-in to Azure through the Azure CLI using the following command:

    ```azurecli
    az login
    ```

    #### [Visual Studio Code](#tab/sign-in-visual-studio-code)

    You'll need to [install the Azure CLI](/cli/azure/install-azure-cli) to work with `DefaultAzureCredential` through Visual Studio Code.

    On the main menu of Visual Studio Code, navigate to **Terminal > New Terminal**.

    Sign-in to Azure through the Azure CLI using the following command:

    ```azurecli
    az login
    ```

    #### [PowerShell](#tab/sign-in-powershell)

    Sign-in to Azure using PowerShell via the following command:

    ```azurepowershell
    Connect-AzAccount
    ```

2. To use `DefaultAzureCredential`, make sure that the **azure-identity** package is [installed](#install-the-packages), and the class is imported:

    ```python
    from azure.identity import DefaultAzureCredential
    ```

3. Add this code inside the `try` block. When the code runs on your local workstation, `DefaultAzureCredential` uses the developer credentials of the prioritized tool you're logged into to authenticate to Azure. Examples of these tools include Azure CLI or Visual Studio Code.

    :::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/blob-quickstart.py" id="Snippet_CreateServiceClientDAC":::

4. Make sure to update the storage account name in the URI of your `BlobServiceClient` object. The storage account name can be found on the overview page of the Azure portal.

    :::image type="content" source="./media/storage-quickstart-blobs-python/storage-account-name.png" alt-text="A screenshot showing how to find the storage account name.":::

    > [!NOTE]
    > When deployed to Azure, this same code can be used to authorize requests to Azure Storage from an application running in Azure. However, you'll need to enable managed identity on your app in Azure. Then configure your storage account to allow that managed identity to connect. For detailed instructions on configuring this connection between Azure services, see the [Auth from Azure-hosted apps](/azure/developer/python/sdk/authentication-azure-hosted-apps) tutorial.

### [Connection String](#tab/connection-string)

A connection string includes the storage account access key and uses it to authorize requests. Always be careful to never expose the keys in an unsecure location.

> [!NOTE]
> To authorize data access with the storage account access key, you'll need permissions for the following Azure RBAC action: [Microsoft.Storage/storageAccounts/listkeys/action](../../role-based-access-control/resource-provider-operations.md#microsoftstorage). The least privileged built-in role with permissions for this action is [Reader and Data Access](../../role-based-access-control/built-in-roles.md#reader-and-data-access), but any role which includes this action will work.

[!INCLUDE [retrieve credentials](../../../includes/retrieve-credentials.md)]

#### Configure your storage connection string

After you copy the connection string, write it to a new environment variable on the local machine running the application. To set the environment variable, open a console window, and follow the instructions for your operating system. Replace `<yourconnectionstring>` with your actual connection string.

**Windows**:

```cmd
setx AZURE_STORAGE_CONNECTION_STRING "<yourconnectionstring>"
```

After you add the environment variable in Windows, you must start a new instance of the command window.

**Linux**:

```bash
export AZURE_STORAGE_CONNECTION_STRING="<yourconnectionstring>"
```

The code below retrieves the connection string for the storage account from the environment variable created earlier, and uses the connection string to construct a service client object.

Add this code inside the `try` block:

```python
# Retrieve the connection string for use with the application. The storage
# connection string is stored in an environment variable on the machine
# running the application called AZURE_STORAGE_CONNECTION_STRING. If the environment variable is
# created after the application is launched in a console or with Visual Studio,
# the shell or application needs to be closed and reloaded to take the
# environment variable into account.
connect_str = os.getenv('AZURE_STORAGE_CONNECTION_STRING')

# Create the BlobServiceClient object
blob_service_client = BlobServiceClient.from_connection_string(connect_str)
```

> [!IMPORTANT]
> The account access key should be used with caution. If your account access key is lost or accidentally placed in an insecure location, your service may become vulnerable. Anyone who has the access key is able to authorize requests against the storage account, and effectively has access to all the data. `DefaultAzureCredential` provides enhanced security features and benefits and is the recommended approach for managing authorization to Azure services.

---

### Create a container

Decide on a name for the new container. The code below appends a UUID value to the container name to ensure that it's unique.

> [!IMPORTANT]
> Container names must be lowercase. For more information about naming containers and blobs, see [Naming and Referencing Containers, Blobs, and Metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

Call the [create_container](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient#create-container-name--metadata-none--public-access-none----kwargs-) method to actually create the container in your storage account.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/blob-quickstart.py" id="Snippet_CreateContainer":::

To learn more about creating a container, and to explore more code samples, see [Create a blob container with Python](storage-blob-container-create-python.md).

### Upload blobs to a container

The following code snippet:

1. Creates a local directory to hold data files.
1. Creates a text file in the local directory.
1. Gets a reference to a [BlobClient](/python/api/azure-storage-blob/azure.storage.blob.blobclient) object by calling the [get_blob_client](/python/api/azure-storage-blob/azure.storage.blob.containerclient#get-blob-client-blob--snapshot-none-) method on the [BlobServiceClient](/python/api/azure-storage-blob/azure.storage.blob.blobserviceclient) from the [Create a container](#create-a-container) section.
1. Uploads the local text file to the blob by calling the [upload_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#upload-blob-data--blob-type--blobtype-blockblob---blockblob----length-none--metadata-none----kwargs-) method.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/blob-quickstart.py" id="Snippet_UploadBlobs":::

To learn more about uploading blobs, and to explore more code samples, see [Upload a blob with Python](storage-blob-upload-python.md).

### List the blobs in a container

List the blobs in the container by calling the [list_blobs](/python/api/azure-storage-blob/azure.storage.blob.containerclient#list-blobs-name-starts-with-none--include-none----kwargs-) method. In this case, only one blob has been added to the container, so the listing operation returns just that one blob.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/blob-quickstart.py" id="Snippet_ListBlobs":::

To learn more about listing blobs, and to explore more code samples, see [List blobs with Python](storage-blobs-list-python.md).

### Download blobs

Download the previously created blob by calling the [download_blob](/python/api/azure-storage-blob/azure.storage.blob.blobclient#download-blob-offset-none--length-none----kwargs-) method. The example code adds a suffix of "DOWNLOAD" to the file name so that you can see both files in local file system.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/blob-quickstart.py" id="Snippet_DownloadBlobs":::

To learn more about downloading blobs, and to explore more code samples, see [Download a blob with Python](storage-blob-download-python.md).

### Delete a container

The following code cleans up the resources the app created by removing the entire container using the [​delete_container](/python/api/azure-storage-blob/azure.storage.blob.containerclient#delete-container---kwargs-) method. You can also delete the local files, if you like.

The app pauses for user input by calling `input()` before it deletes the blob, container, and local files. Verify that the resources were created correctly before they're deleted.

Add this code to the end of the `try` block:

:::code language="python" source="~/azure-storage-snippets/blobs/quickstarts/python/blob-quickstart.py" id="Snippet_CleanUp":::

To learn more about deleting a container, and to explore more code samples, see [Delete and restore a blob container with Python](storage-blob-container-delete-python.md).

## Run the code

This app creates a test file in your local folder and uploads it to Azure Blob Storage. The example then lists the blobs in the container, and downloads the file with a new name. You can compare the old and new files.

Navigate to the directory containing the *blob-quickstart.py* file, then execute the following `python` command to run the app:

```console
python blob-quickstart.py
```

The output of the app is similar to the following example (UUID values omitted for readability):

```output
Azure Blob Storage Python quickstart sample

Uploading to Azure Storage as blob:
        quickstartUUID.txt

Listing blobs...
        quickstartUUID.txt

Downloading blob to
        ./data/quickstartUUIDDOWNLOAD.txt

Press the Enter key to begin clean up

Deleting blob container...
Deleting the local source and downloaded files...
Done
```

Before you begin the cleanup process, check your *data* folder for the two files. You can compare them and observe that they're identical.

## Clean up resources

After you've verified the files and finished testing, press the **Enter** key to delete the test files along with the container you created in the storage account. You can also use [Azure CLI](storage-quickstart-blobs-cli.md#clean-up-resources) to delete resources.

## Next steps

In this quickstart, you learned how to upload, download, and list blobs using Python.

To see Blob storage sample apps, continue to:

> [!div class="nextstepaction"]
> [Azure Blob Storage library for Python samples](https://github.com/Azure/azure-sdk-for-python/tree/master/sdk/storage/azure-storage-blob/samples)

- To learn more, see the [Azure Blob Storage client libraries for Python](/python/api/overview/azure/storage-blob-readme).
- For tutorials, samples, quickstarts, and other documentation, visit [Azure for Python Developers](/azure/developer/python/sdk/azure-sdk-overview).
