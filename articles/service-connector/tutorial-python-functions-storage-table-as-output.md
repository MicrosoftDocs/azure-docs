---
title: Configure a Python function with Azure Table Storage output
description: Learn to configure a Python Azure Functions app to use Azure Table Storage output, and use Service Connector to connect the services.
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.custom: devx-track-python
ms.topic: tutorial
ms.date: 05/04/2026
#customer intent: As a Python developer who uses Azure Functions, I want to learn how to use Service Connector to connect my functions to other Azure services so I can easily bind the services to my function apps.
---
# Tutorial: Configure a Python function with Azure Table Storage output

In this tutorial, you configure a Python function to use Azure Table Storage as an output binding. You then deploy the function to Azure Functions and use Service Connector to connect the Azure Functions app with Table Storage.

You use Visual Studio Code to complete the following tasks:

> [!div class="checklist"]
> * Create a Python function project.
> * Add a Table Storage output function binding.
> * Run the function locally.
> * Deploy the function to Azure.
> * Create a connection between the Azure Functions app and Table Storage using Service Connector.

The Service Connector source service is Azure Functions and the target service is Azure Table Storage. The function binding uses an HTTP trigger with the storage table as output. The local and cloud authentication type is connection string.

## Prerequisites

- Basic understanding of [Azure Functions](/azure/azure-functions/functions-reference) and [how to connect to services in Azure Functions](/azure/azure-functions/add-bindings-existing-function).
- An Azure subscription where you have Azure resource write permissions, in an Azure region that [supports Service Connector](concept-region-support.md). [Create an Azure account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An [Azure Storage Account](/azure/storage/common/storage-account-create) in your Azure subscription, and a table named `testTable` in the storage account.
- [Visual Studio Code](https://code.visualstudio.com), with the following extensions installed:
  - [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python)
  - [Azure CLI Tools](https://marketplace.visualstudio.com/items?itemName=ms-vscode.azurecli)
  - [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions), configured to allow Programming Model V1 as follows:
    1. In Visual Studio Code, select the **Settings** icon next to the **Azure Functions** extension and select **Settings**.
    1. On the **Settings** screen, select the checkbox next to **Azure Functions: Allow Programming Model Selection**.
    1. Close the **Settings** screen.

## Create the function project

In Visual Studio Code, create a Python function project with an HTTP trigger.

1. Press **F1** to open the command palette, and search for and select the command **Azure Functions: Create New Project**.
1. For **Select the folder that will contain your function project**, select **Browse**, and either create a new folder or choose an empty folder for the project workspace. Don't choose a project folder that's already part of a workspace.
1. For **Select a project type**, select **Python**.
1. For **Select a Python programming model**, select **Model V1**.
1. For **Select a Python interpreter to create a virtual environment**, select **Manually enter Python interpreter or full path** and enter the full path to your Python executable.
1. For **Select a template for your project's first function**, select **HTTP trigger**.
1. For **Provide a function name**, enter *TableStorageOutputFunc*.
1. For **Authorization level**, select **Anonymous**.
1. For **Select how you would like to open your project**, select **Open in current window**.

For more information, see [Create and deploy function code to Azure using Visual Studio Code](/azure/azure-functions/how-to-create-function-vs-code?pivots=programming-language-python).

## Add a storage table output binding

The following procedure edits the *function.json* and *local.settings.json* files in your project to create a table output binding for your function. 

1. Right-click the *function.json* file in your function folder and select **Add binding** from the context menu.
1. In the command palette, for **Select binding direction**, select **out**.
1. For **Select binding with direction "out"**, select **Azure Table Storage**.
1. For **The name used to identify this binding in your code**, enter *outMessage*.
1. For **Table name in storage account where data will be written**, enter *testTable*.
1. For **Select the app setting with your Storage account connection string from "local.settings.json"**, select **Create new local app setting**.
1. For **Select subscription**, select your Azure subscription.
1. For **Select a storage account type for development**, select **Use Azure Storage for remote storage**.
1. For **Select a storage account**, select the Azure Storage account to use for output.

### Check the added binding

- Open the *TableStorageOutputFunc/function.json* file and make sure the table output binding is correctly added to the file. If any of the values differ, edit them to the following values:

  ```json
      {
        "type": "table",
        "direction": "out",
        "name": "outMessage",
        "tableName": "testtable",
        "connection": "<your-storage-account-name>_STORAGE"
      }
  ```

- Open the *local.settings.json* file and make sure the following key-value pair is in this file: `<your-storage-account-name>_STORAGE: <your-storage-account-connection-string>`.

### Edit the Python code

Open the *TableStorageOutputFunc/\_\_init\_\_.py* file and replace its contents with the following code:

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

To run the function locally, press **F5**. If prompted to connect to a storage account, select an Azure Storage account. This value is used for the Azure Functions runtime and can be, but doesn't have to be the same storage account you use for the function output.

While the function is running, verify that it can write to your Table Storage table by right-clicking the **TableStorageOutputFunc** function in the **Workspace** view of the Activity bar and selecting **Execute Function Now**. Check the function response to make sure it contains a `rowKey` value that was written to the table.

## Deploy your function to Azure

Create an Azure Functions app and deploy your function to Azure.

1. In your project *function.json* file, change the value of the `connection` property in `bindings` to `AZURE_STORAGETABLE_CONNECTIONSTRING`.
1. Press **F1** to open the command palette, and search for and select the command **Azure Functions: Deploy to Function App**.
1. For **Select subscription**, select your Azure subscription.
1. For **Select a function app**, select **Create new Function App**.
1. For **Select a location for new resources**, select an Azure region for your Azure Functions app, preferably the same region as your Storage account.
1. For **Enter a name for the new function app**, you can enter the same name as your local function, *TableStorageOutputFunc*.
1. For **Select a runtime stack**, select **Python 3.10**.
1. For **Select resource authentication type**, select **Secrets**.

>[!IMPORTANT]
>The connection string authentication flow using secrets requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't viable.

## Create a connection using Service Connector

After you create the Functions app, you can use Service Connector to connect the app to your Table Storage table, so your app can easily write output to your storage account. The following command creates a Service Connector resource that configures the `AZURE_STORAGETABLE_CONNECTIONSTRING` variable in the function's App Settings. 

The function binding consumes this app setting to connect to the storage account so the function can write to the storage table. For more information, see [How Service Connector helps Azure Functions connect to services](how-to-use-service-connector-in-function.md).

To create the connection, you can run the following Azure CLI command in Visual Studio Code, or use [Azure Cloud Shell](https://shell.azure.com/) or [local Azure CLI](/cli/azure/install-azure-cli). Replace the placeholder values as follows:

- `<function-resource-id>`:<br>`/subscriptions/<your-subscription>/resourceGroups/<function-resource-group>/providers/Microsoft.Web/sites/<function-name>`

- `<storage-resource-id>`:<br>`/subscriptions/<your-subscription>/resourceGroups/<storage-resource-group>/providers/Microsoft.Storage/storageAccounts/<storage-account>/tableServices/default`

```azurecli
az functionapp connection create storage-table --source-id "<function-resource-id>" --target-id "<storage-resource-id>" --secret
```

## Troubleshoot

If you get errors related to the storage host, such as `No such host is known (<account-name>.table.core.windows.net:443)`, make sure the connection string used to connect to Table Storage contains the table endpoint. If not, go to the Azure Storage page, copy the connection string from **Access keys** under **Security + networking**, and replace the value.

If this error occurs when you run locally, check the *local.settings.json* file. If the error occurs when you deploy your function to Azure, check the Functions app's App Settings.

## Clean up resources

If you no longer want the Azure resources you created for this tutorial, you can delete them. 

- In the Azure portal, open the Functions app or Storage account resource and select **Delete** from the top menu bar. Enter the resource name and select **Delete**.
- In Azure CLI, run one or both of the following commands, replacing the placeholders with your own information.

  ```azurecli
  az functionapp delete --name <functionapp-name> --resource-group <functionapp-resource-group>
  az storage account delete --name <storageaccount-name> --resource-group <storageaccount-resource-group>
  ```

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Use Service Connector to connect Azure Functions to other cloud services](how-to-use-service-connector-in-function.md)
