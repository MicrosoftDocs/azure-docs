---
title: 'Tutorial: Python function with Storage Blob as input'
description: Learn how you can connect a Python function to a storage blob as input using Service Connector
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: tutorial
ms.date: 09/18/2023
---
# Tutorial: Python function with Azure Blob Storage as input

In this tutorial, you learn how to configure a Python function with Storage Blob as input by completing the following tasks:

1. Use Visual Studio Code to create a Python function project.
2. Change codes to add storage blob input function binding.
3. Use Visual Studio Code to run the function locally.
4. Use Azure CLI to create Service Connector connection between Azure Function and Storage Blob.
5. Use Visual Studio to deploy your function.

An overview of the function project components in this tutorial:

| Project Component        | Selection / Solution                 |
| ------------------------ | ------------------------------------ |
| Source Service           | Azure Function                       |
| Target Service           | Azure Storage Blob                   |
| Function Binding         | HTTP trigger, Storage Blob as Input |
| Local Project Auth Type  | Connection String                    |
| Cloud Function Auth Type | System-Assigned Managed Identity     |

## Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- Azure CLI. You can use it in [Azure Cloud Shell](https://shell.azure.com/) or [install it locally](/cli/azure/install-azure-cli).
- An Azure Function with Python as runtime stack. If you don't have an Azure Function, [create one](../azure-functions/create-first-function-cli-python.md).
- An Azure Storage Account and a Storage blob. If you don't have an Azure Storage, [create one](../storage/common/storage-account-create.md).
- This guide assumes you know [Functions developer guide](../azure-functions/functions-reference.md) and [how to connect to services in Functions](../azure-functions/add-bindings-existing-function.md).

## Create a Python function project

Follow the [tutorial to create your local project](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#create-an-azure-functions-project), and provide the following information at the prompts:

| Prompt                                                                | Selection                                                                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Select a language**                                           | Choose `Python`. (v1 programming language model)                                                               |
| **Select a Python interpreter to create a virtual environment** | Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary. |
| **Select a template for your project's first function**         | Choose `HTTP trigger`.                                                                                         |
| **Provide a function name**                                     | Enter `BlobStorageInputFunc`.                                                                                  |
| **Authorization level**                                         | Choose `Anonymous`, which lets anyone call your function endpoint.                                            |

The steps help you create a Python function project with HTTP trigger.

## Add a Blob Storage input binding

Binding attributes are defined in the *function.json* file for a given function. To create a binding, right-click (Ctrl+click on macOS) the `function.json` file in your function folder and choose  **Add binding...** . Follow the prompts to define the following binding properties for the new binding:

| Prompt                                                                          | Value                             | Description                                                                                                                                                                                                        |
| ------------------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Select binding direction**                                              | `in`                            | The binding is an input binding.                                                                                                                                                                                   |
| **Select binding with direction...**                                      | `Azure Blob Storage`            | The binding is an Azure Storage blob binding.                                                                                                                                                                      |
| **The name used to identify this binding in your code**                   | `inputBlob`                     | Name that identifies the binding parameter referenced in your code.                                                                                                                                                |
| **The path within your storage account from which the blob will be read** | `testcontainer/test.txt`        | The blob path your function read as input. Prepare a file named `test.txt`, with a `Hello, World!` as the file content. Create a container named   `testcontainer `, and upload the file to the container. |
| **Select setting from "local.setting.json"**                              | `Create new local app settings` | Select the Storage Account your function reads as input. Visual Studio Code retrieves its connection string for local project connection.                                                               |

To check the binding was added successfully,

1. Open the `BlobStorageInputFunc/function.json` file, check that a new binding with `type: blob` and `direction: in` was added into this file.
2. Open the `local.settings.json` file, check that a new key-value pair `<your-storage-account-name>_STORAGE: <your-storage-account-connection-string>` that contains your storage account connection string was added into this file.

After the binding is added, update your function codes to consume the binding by replacing `BlobStorageInputFunc/__init__.py` with the Python file here.

```python
import logging
import azure.functions as func

def main(req: func.HttpRequest, inputBlob: bytes) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')
    return func.HttpResponse('The triggered function executed successfully. And read blob content: {}'.format(inputBlob))
```

## Run the function locally

Follow the [tutorial](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#run-the-function-locally) to run the function locally and verify the blob input.

1. Select the storage account you used when creating the Azure Function resource if you're prompted to connect to Storage. It is for Azure Function runtime's internal use, and isn't necessarily the same with the one you use for input.
2. To start the function locally, press `<kbd>`F5 `</kbd>` or the **Run and Debug** icon in the left-hand side Activity bar.
3. To verify the function can read the blob, right click `Exucute Function Now...` on the function in Visual Studio Code **WORKSPACE** view, check the function response, and the response message should contain the content in your blob file.

## Create a connection using Service Connector

You just ran the project and verified the function locally, and your local project connects to your storage blob using connection string.

Now you'll learn how to configure the connection between the Azure Function and Azure Blob Storage, so that your function can read the blob after being deployed to the cloud. In the cloud environment, we demonstrate how to authenticate using a system-assigned managed identity.

1. Open the `function.json` file in your local project, change the value of the `connection` property in `bindings` to be `MyBlobInputConnection`.
2. Run the following Azure CLI command to create a connection between your Azure Function and your Azure Storage.

```azurecli
az functionapp connection create storage-blob --source-id "<your-function-resource-id>" --target-id "<your-storage-blob-resource-id>" --system-identity --customized-keys AZURE_STORAGEBLOB_RESOURCEENDPOINT=MyBlobInputConnection__serviceUri
```

* `--source-id` format: `/subscriptions/{subscription}/resourceG roups/{source_resource_group}/providers/Microsoft.Web/sites/{site}`
* `--target-id` format: `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/blobServices/default`

You have created a connection between Azure Function and Azure Blob Storage using Service Connector, with a system-assigned managed identity.

Service Connector configured a `MyBlobInputConnection__serviceUri` variable in the function's app settings used by the function binding runtime to connect to the storage, so that the function can read data from the blob storage. You can learn more about [how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md).

## Deploy your function to Azure

Now you can deploy your function to Azure and verify the storage blob input binding works.

1. Follow the [tutorial ](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#deploy-the-project-to-azure)to deploy your function to Azure.
2. To verify the function can read the blob, right click `Exucute Function Now...` on the function in Visual Studio Code **RESOURCES** view, check the function response, and the response message should contain the content in your blob file.

## TroubleShoot

If there are any errors related with storage host, such as `No such host is known (<acount-name>.blob.core.windows.net:443)`, you need check whether the connection string you use to connect to Azure Storage contains the blob endpoint or not. If it doesn't, go to Azure Storage portal, copy the connection string from the `Access keys` blade, and replace the values.

If it happens when you start the project locally, check the `local.settings.json` file.

If it happens when you deploy your function to cloud (in this case, Function deployment usually fails on `Syncing triggers` ), check your Function's App Settings.

## Next steps

Read the articles below to learn more about Service Connector concepts and how it helps Azure Functions connect to services.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Learn about how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md)
