---
title: 'Tutorial: Python function with Azure Queue Storage as trigger'
description: Learn how you can connect a Python function to a storage queue as trigger using Service Connector
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.custom: devx-track-python
ms.topic: tutorial
ms.date: 10/25/2023
---
# Tutorial: Python function with Azure Queue Storage as trigger

In this tutorial, you learn how to configure a Python function with Storage Queue as trigger by completing the following tasks.

> [!div class="checklist"]
> * Use Visual Studio Code to create a Python function project.
> * Use Visual Studio Code to run the function locally.
> * Use the Azure CLI to create a connection between Azure Function and Storage Queue with Service Connector.
> * Use Visual Studio to deploy your function.

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
- The Azure CLI. You can use it in [Azure Cloud Shell](https://shell.azure.com/) or [install it locally](/cli/azure/install-azure-cli).
- An Azure Storage Account and a storage queue. If you don't have an Azure Storage, [create one](../storage/common/storage-account-create.md).
- This guide assumes you know the basic concepts presented in the [Azure Functions developer guide](../azure-functions/functions-reference.md) and [how to connect to services in Functions](../azure-functions/add-bindings-existing-function.md).

## Create a Python function project

Follow the [tutorial to create a local Azure Functions project](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#create-an-azure-functions-project), and provide the following information at the prompts:

| Prompt                                                                | Selection                                                                                                                                   |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Select a language**                                           | Choose `Python`. (v1 programming language model)                                                                                          |
| **Select a Python interpreter to create a virtual environment** | Choose your preferred Python interpreter. If an option isn't shown, type in the full path to your Python binary.                            |
| **Select a template for your project's first function**         | Choose `Azure Queue Storage trigger`.                                                                                                     |
| **Provide a function name**                                     | Enter `QueueStorageTriggerFunc`.                                                                                                          |
| **Select setting from "local.settings.json"**                   | Choose `Create new local app settings`, which lets you select your Storage Account and provide your queue name that works as the trigger. |

You have created a Python function project with Azure Storage Queue as trigger. The local project connects to Azure Storage using the connection string saved into the `local.settings.json` file. Finally, the `main` function in `__init__.py` file of the function can consume the connection string with the help of the Function Binding defined in the `function.json` file.

## Run the function locally

Follow the [tutorial](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#run-the-function-locally) to run the function locally and verify the trigger.

1. Select the storage account as you chose when creating the Azure Function resource if you're prompted to connect to storage. This value is used for Azure Function's runtime, and it isn't necessarily the same as the storage account you use for the trigger.
1. To start the function locally, press `<kbd>`F5 `</kbd>` or select the **Run and Debug** icon in the left-hand side Activity bar.
1. To verify the trigger works properly, keep the function running locally and open the Storage Queue blade in Azure portal, select **Add message** and provide a test message. You should see the function is triggered and processed as a queue item in your Visual Studio Code terminal.

## Create a connection using Service Connector

In last step, you verified the function project locally. Now you'll learn how to configure the connection between the Azure Function and Azure Storage Queue in the cloud, so that your function can be triggered by the storage queue after being deployed to the cloud.

1. Open the `function.json` file in your local project, change the value of the `connection` property in `bindings` to be `AZURE_STORAGEQUEUE_CONNECTIONSTRING`.
1. Run the following Azure CLI command to create a connection between your Azure Function and your Azure storage account.

```azurecli
az functionapp connection create storage-queue --source-id "<your-function-resource-id>" --target-id "<your-storage-queue-resource-id>" --secret
```

* `--source-id` format: `/subscriptions/{subscription}/resourceG roups/{source_resource_group}/providers/Microsoft.Web/sites/{site}`
* `--target-id` format: `/subscriptions/{subscription}/resourceGroups/{target_resource_group}/providers/Microsoft.Storage/storageAccounts/{account}/queueServices/default`

This step creates a Service Connector resource that configures an `AZURE_STORAGEQUEUE_CONNECTIONSTRING` variable in the function's App Settings. The function binding runtime uses it to connect to the storage, so that the function can accept triggers from the storage queue. For more information, go to [how Service Connector helps Azure Functions connect to services](./how-to-use-service-connector-in-function.md).

## Deploy your function to Azure

Now you can deploy your function to Azure and verify the storage queue trigger works.

1. Follow this [Azure Functions tutorial](../azure-functions/create-first-function-vs-code-python.md?pivots=python-mode-configuration#deploy-the-project-to-azure) to deploy your function to Azure.
1. Open the Storage Queue blade in the Azure portal, select **Add message** and provide a test message. You should see the function is triggered and processed as a queue item in your function logs.

## Troubleshoot

If there are any errors related with the storage host, such as `No such host is known (<acount-name>.queue.core.windows.net:443)`, check whether the connection string you use to connect to Azure Storage contains the queue endpoint or not. If it doesn't, go to Azure Storage in the Azure portal, copy the connection string from the `Access keys` blade, and replace the values.

If this error happens when you start the project locally, check the `local.settings.json` file.

If this error happens when you deploy your function to cloud (in this case, Function deployment usually fails on `Syncing triggers` ), check your Function's App Settings.

## Clean up resources

If you're not going to continue to use this project, delete the Function App resource you created earlier.

### [Portal](#tab/azure-portal)

1. In the Azure portal, open the Function App resource and select **Delete**.
1. Enter the app name and select **Delete** to confirm.

### [Azure CLI](#tab/azure-cli)

Run the following command in the Azure CLI and replace all placeholders with your own information.

```azurecli
az functionapp delete --name <function-name> --resource-group <resource-group>
```

---

## Next steps

Read the articles below to learn more about Service Connector concepts and how it helps Azure Functions connect to services.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)

> [!div class="nextstepaction"]
> [Use Service Connector to connect Azure Functions to other cloud services](./how-to-use-service-connector-in-function.md)
