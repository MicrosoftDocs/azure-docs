---
title: 'Tutorial: Python function with Storage Queue as trigger'
description: Learn how you can connect a Python function to a storage queue as trigger using Service Connector
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: tutorial
ms.date: 09/18/2023
---
# Tutorial: Python function with Azure Queue Storage as trigger

In this tutorial, you learn how to configure a Python function with Storage Queue as trigger by completing the following tasks:

1. Use Visual Studio Code to create a Python function project.
1. Use Visual Studio Code to run the function locally.
1. Use Azure CLI to create Service Connector connection between Azure Function and Storage Queue.
1. Use Visual Studio to deploy your function.

An overview of the function project components in this tutorial:

| Project Component        | Selection / Solution     |
| ------------------------ | ------------------------ |
| Source Service           | Azure Function           |
| Target Service           | Azure Storage Queue      |
| Function Binding         | Storage Queue as Trigger |
| Local Project Auth Type  | Connection String        |
| Cloud Function Auth Type | Connection String        |

## Prerequisites

- Install [Visual Studio Code](https://code.visualstudio.com) on one of the [supported platforms](https://code.visualstudio.com/docs/supporting/requirements#_platforms).
- Azure CLI. You can use it in [Azure Cloud Shell](https://shell.azure.com/) or [install it locally](/cli/azure/install-azure-cli).
- An Azure Function with Python as runtime stack. If you don't have an Azure Function, [create one](../azure-functions/create-first-function-cli-python.md).
- An Azure Storage Account and a storage queue. If you don't have an Azure Storage, [create one](../storage/common/storage-account-create.md).
- This guide assumes you know [Functions developer guide](../azure-functions/functions-reference.md) and [how to connect to services in Functions](../azure-functions/add-bindings-existing-function.md).

## Create a Python function project

Follow the [tutorial to create your local project](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#create-an-azure-functions-project), and provide the following information at the prompts:

| Prompt                                                                | Selection                                                                                                                                    |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Select a language**                                           | Choose `Python`. (v1 programming language model)                                                                                           |
| **Select a Python interpreter to create a virtual environment** | Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary.                             |
| **Select a template for your project's first function**         | Choose `Azure Queue Storage trigger`.                                                                                                      |
| **Provide a function name**                                     | Enter `QueueStorageTriggerFunc`.                                                                                                           |
| **Select setting from "local.settings.json"**                   | Choose `Create new local app settings`, which lets you select your Storage Account and provide your queue name that works as the trigger. |

The steps help you create a Python function project with Azure Storage Queue as trigger. And it also helps the local project connect to Azure Storage by saving its connection string into the `local.settings.json` file. Finally, the `main` function in `__init__.py` file of the function can consume the connection string with the help of Function Binding defined in `function.json` file.

## Run the function locally

Follow the [tutorial](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#run-the-function-locally) to run the function locally and verify the trigger.

1. Choose the same Storage Account as you choose when creating the Azure Function resource if you're prompted to connect to Storage. It is for Azure Function runtime's internal use, and isn't necessarily the same with the one you use for trigger.
2. To start the function locally, press `<kbd>`F5 `</kbd>` or the **Run and Debug** icon in the left-hand side Activity bar.
3. To verify the trigger works properly, keep the function running locally and open the Storage Queue blade in Azure Portal, click the **Add message** button and provide a test message. You should see the function is triggered and processed a queue item in your Visual Studio Code terminal.

## Create connection using Service Connector

In last step, you verified the function project locally. And now you'll learn how to configure the connection between the Azure Function and Azure Storage Queue in cloud, so that your function can be triggered by the storage queue after being deployed to cloud.

1. Open `function.json` file in your local project, change the value of the `connection` property in `bindings` to be `AZURE_STORAGEQUEUE_CONNECTIONSTRING`.
2. Run the following Azure CLI command to create a connection between your Azure Function and your Azure Storage.

```azurecli
az functionapp connection create storage-queue --source-id "<your-function-resource-id>" --target-id "<your-storage-queue-resource-id>" --secret
```

* `--source-id` format: `/subscriptions/{subscription}/resourceG roups/{source_resource_group}/providers/Microsoft.Web/sites/{site}`
* `--target-id` format: `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/queueServices/default`

The steps help create a Service Connector resource that configures an `AZURE_STORAGEQUEUE_CONNECTIONSTRING` variable in the function's App Settings. And the function binding runtime uses it to connect to the storage, so that the function can accept triggers from the storage queue. You can learn more about [how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md).

## Deploy your function to Azure

Now you can deploy your function to Azure and verify the storage queue trigger works.

1. Follow the [tutorial ](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#deploy-the-project-to-azure)to deploy your function to Azure.
2. Open the Storage Queue blade in Azure Portal, click the **Add message** button and provide a test message. You should see the function is triggered and processed a queue item in your function logs.

## Troubleshoot

If there are any errors related with storage host, such as `No such host is known (<acount-name>.queue.core.windows.net:443)`, you need check whether the connection string you use to connect to Azure Storage contains the queue endpoint or not. If it doesn't, go to Azure Storage portal, copy the connection string from the `Access keys` blade, and replace the values.

If it happens when you start the project locally, check the `local.settings.json` file.

If it happens when you deploy your function to cloud (in this case, Function deployment usually fails on `Syncing triggers` ), check your Function's App Settings.

## Next steps

Read the articles below to learn more about Service Connector concepts and how it helps Azure Functions connect to services.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Learn about how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md)
