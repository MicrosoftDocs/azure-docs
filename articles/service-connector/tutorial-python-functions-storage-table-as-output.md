---
title: 'Tutorial: Python function with Storage Table as output'
description: Learn how you can connect a Python function to a storage table as output using Service Connector
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: tutorial
ms.date: 09/18/2023
---
# Tutorial: Python function with Azure Table Storage as output

In this tutorial, you learn how to configure a Python function with Storage Table as output by completing the following tasks:

1. Use Visual Studio Code to create a Python function project.
2. Change codes to add storage table output function binding.
3. Use Visual Studio Code to run the function locally.
4. Use Azure CLI to create Service Connector connection between Azure Function and Storage Table.
5. Use Visual Studio to deploy your function.

An overview of the function project components in this tutorial:

| Project Component        | Selection / Solution                   |
| ------------------------ | -------------------------------------- |
| Source Service           | Azure Function                         |
| Target Service           | Azure Storage Table                    |
| Function Binding         | HTTP trigger, Storage Table as Output |
| Local Project Auth Type  | Connection String                      |
| Cloud Function Auth Type | Connection String                      |

## Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- Azure CLI. You can use it in [Azure Cloud Shell](https://shell.azure.com/) or [install it locally](/cli/azure/install-azure-cli).
- An Azure Function with Python as runtime stack. If you don't have an Azure Function, [create one](../azure-functions/create-first-function-cli-python.md).
- An Azure Storage Account and a Storage table. If you don't have an Azure Storage, [create one](../storage/common/storage-account-create.md).
- The guide assumes you know [Functions developer guide](../azure-functions/functions-reference.md) and [how to connect to services in Functions](../azure-functions/add-bindings-existing-function.md).

## Create a Python function project

Follow the [tutorial to create your local project](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#create-an-azure-functions-project), and provide the following information at the prompts:

| Prompt                                                                | Selection                                                                                                        |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Select a language**                                           | Choose `Python`. (v1 programming language model)                                                               |
| **Select a Python interpreter to create a virtual environment** | Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary. |
| **Select a template for your project's first function**         | Choose `HTTP trigger`.                                                                                         |
| **Provide a function name**                                     | Enter `TableStorageOutputFunc`.                                                                                |
| **Authorization level**                                         | Choose `Anonymous`, which lets anyone call your function endpoint.                                            |

The steps help you create a Python function project with HTTP trigger.

## Add storage table output binding

Binding attributes are defined in the *function.json* file for a given function. To create a binding, right-click (Ctrl+click on macOS) the `function.json` file in your function folder and choose  **Add binding...** . Follow the prompts to define the following binding properties for the new binding:

| Prompt                                                             | Value                             | Description                                                                                                                                            |
| ------------------------------------------------------------------ | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Select binding direction**                                 | `out`                           | The binding is an output binding.                                                                                                                      |
| **Select binding with direction...**                         | `Azure Table Storage`           | The binding is an Azure Storage table binding.                                                                                                         |
| **The name used to identify this binding in your code**      | `outMessage`                    | Name that identifies the binding parameter referenced in your code.                                                                                    |
| **Table name in storage account where data will be written** | `testTable`                     | The table name your function writes as output. Create a table named `testTable` in your storage account if it doesn't exist.                        |
| **Select setting from "local.setting.json"**                 | `Create new local app settings` | Select the Storage Account your function writes as output. Visual Studio Code retrieves its connection string for local project connection. |

To check the binding was added successfully:

1. Open the `TableStorageOutputFunc/function.json` file, check that a new binding with `type: table` and `direction: out` was added into this file.
2. Open the `local.settings.json` file, check that a new key-value pair `<your-storage-account-name>_STORAGE: <your-storage-account-connection-string>` that contains your storage account connection string was added into this file.

After the binding is added, update your function codes to consume the binding by replacing `TableStorageOutputFunc/__init__.py` with the Python file here.

```python
import logging
import uuid
import json
import azure.functions as func

def main(req: func.HttpRequest, outMessage: func.Out[str]) -> func.HttpResponse:

    rowKey = str(uuid.uuid4())
    data = {
        "Name": "Output binding message",
        "PartitionKey": "message",
        "RowKey": rowKey
    }

    outMessage.set(json.dumps(data))
    return func.HttpResponse(f"Message created with the rowKey: {rowKey}")
```

## Run the function locally

Follow the [tutorial](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#run-the-function-locally) to run the function locally and verify the table output.

1. Choose the same Storage Account as you choose when creating the Azure Function resource if you're prompted to connect to Storage. It is for Azure Function runtime's internal use, and isn't necessarily the same with the one you use for output.
2. To start the function locally, press `<kbd>`F5 `</kbd>` or the **Run and Debug** icon in the left-hand side Activity bar.
3. To verify the function can write to your table, right click `Exucute Function Now...` on the function in Visual Studio Code **WORKSPACE** view, check the function response, and the response message should contain the `rowKey` that was written to the table.

## Create connection using Service Connector

In last step, you verified the function project locally. And now you'll learn how to configure the connection between the Azure Function and Azure Storage Table in cloud, so that your function can write to your storage blob after being deployed to cloud.

1. Open `function.json` file in your local project, change the value of the `connection` property in `bindings` to be `AZURE_STORAGETABLE_CONNECTIONSTRING`.
2. Run the following Azure CLI command to create a connection between your Azure Function and your Azure Storage.

```azurecli
az functionapp connection create storage-table --source-id "<your-function-resource-id>" --target-id "<your-storage-table-resource-id>" --secret
```

* `--source-id` format: `/subscriptions/{subscription}/resourceG roups/{source_resource_group}/providers/Microsoft.Web/sites/{site}`
* `--target-id` format: `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/tableServices/default`

The steps help create a Service Connector resource that configures an `AZURE_STORAGETABLE_CONNECTIONSTRING` variable in the function's App Settings. This app setting will then be consumed by the function binding to connect to the storage, so that the function can write to the storage table. You can learn more about [how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md).

## Deploy your function to Azure

Now you can deploy your function to Azure and verify the storage table output binding works.

1. Follow the [tutorial ](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#deploy-the-project-to-azure)to deploy your function to Azure.
2. To verify the function can write to the table, right click `Exucute Function Now...` on the function in Visual Studio Code **RESOURCES** view, check the function response, and the response message should contain the `rowKey` the function just wrote to your table.

## Troubleshoot

If there are any errors related with storage host, such as `No such host is known (<acount-name>.table.core.windows.net:443)`, you need check whether the connection string you use to connect to Azure Storage contains the table endpoint or not. If it doesn't, go to Azure Storage portal, copy the connection string from the `Access keys` blade, and replace the values.

If it happens when you start the project locally, check the `local.settings.json` file.

If it happens when you deploy your function to cloud (in this case, Function deployment usually fails on `Syncing triggers` ), check your Function's App Settings.

## Next steps

Read the articles below to learn more about Service Connector concepts and how it helps Azure Functions connect to services.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Learn about how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md)
