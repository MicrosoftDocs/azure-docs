---
title: "Quickstart: Set a Durable Functions app to use the Durable Task Scheduler (preview) storage provider"
description: Learn how to debug and manage your orchestrations using the Durable Task Scheduler.
ms.topic: quickstart
ms.date: 01/24/2025
---

# Quickstart: Quickstart: Set a Durable Functions app to use the Durable Task Scheduler (preview) storage provider

Let's begin working with Durable Functions using the new Durable Task Scheduler backend provider.

In this quickstart, the [provided sample](https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview/tree/main/quickstarts/HelloCities) uses the [official Durable Functions "hello cities" quickstart](https://learn.microsoft.com/azure/azure-functions/durable/durable-functions-isolated-create-first-csharp?pivots=code-editor-vscode). The sample schedules orchestrations that include three activities via an HTTP trigger.

This quickstart showcases the necessary configuration for using Durable Task Scheduler as the backend provider for your Durable Function app.

## Prerequisites

- [An active Azure subscription](/azure/guides/developer/azure-developer-guide#understanding-accounts-subscriptions-and-billing).
- [The latest Azure Functions Core Tools installed](../../functions-run-local.md)
- [The Azure Developer CLI installed](/azure/developer/azure-developer-cli/install-azd)
- [Install .NET Core SDK](https://dotnet.microsoft.com/download) version 6 or later installed.
- [The `az durabletask` CLI extension](https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview/blob/main/docs/enroll.md#upgrade-the-azure-cli-to-use-the-durable-task-scheduler-commands)
- [The latest Visual Studio Code installed](https://code.visualstudio.com/download) with the following extensions:
  - [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  - [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
- [Start and configure an Azurite storage emulator for local storage](https://learn.microsoft.com/azure/storage/common/storage-use-azurite).

## Log into the Azure CLI

In a terminal window, run the following command to log into the Azure CLI.

```azurecli
az login
```

## Clone the project

1. Clone this repo to your developer machine:

    ```shell
    git clone https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview.git
    ```

1. Navigate to the `hello cities` source code directory:

    ```shell
    cd Azure-Functions-Durable-Task-Scheduler-Private-Preview/quickstarts/HelloCities/http/
    ```

1. Open the Application in VS Code:

    ```shell
    code .
    ```

> **Note:** This quickstart deploys to Azure using `azd up`. For local development, use the cloned quickstart sample and follow the instructions in [Configure an existing app to use Durable Task Scheduler]() guide.

## Deploy the app to Azure

Use the [Azure Developer CLI (`azd`)](https://aka.ms/azd) to easily deploy the app.

> **Note:** If you open this repo in GitHub CodeSpaces, the `azd` tooling is already installed.

1. Navigate to `quickstarts/hello_cities` and run the following command to provision:

    ```bash
    azd up
    ```

1. When prompted, provide:
   - A name for your [Azure Developer CLI environment](/azure/developer/azure-developer-cli/faq#what-is-an-environment-name).
   - The Azure subscription you'd like to use.
   - The Azure location to use. This location is related to the location in which you created the resource group, scheduler, and task hub.

   > **Note:** This template defaults to **Elastic Premium EP1 sku plan on Linux**.

1. The terminal tracks the deployment process. The deployment finishes with a `"Run-From-Zip is set to a remote URL using WEBSITE_RUN_FROM_PACKAGE or WEBSITE_USE_ZIP app setting.` error. You can ignore this.  

Your application has been deployed!

## Navigate to the Durable Task Scheduler Observability Dashboard

### Using the portal

1. In the portal, navigate to the `rg-<YOUR_AZD_ENVIRONMENT_NAME>` overview page.
1. Select the `dts-<randomGUID>` resource.

    ![Select the DTS dashboard resource](../../media/images/dts-dashboard-resource.png)

1. When on the Scheduler Resource overview page, select the TaskHub child resource:

    ![TaskHub child resource](../../media/images/dts-overview-portal.png)

1. Select the Dashboard URL:

    ![TaskHub child resource](../../media/images/taskhub-overview-portal.png)

1. Browse orchestration state and history from within the TaskHub:

    ![TaskHub Overview](../../media/images/taskhub-overview.png)

### Scheduler registration using the Azure CLI

1. Navigate to [https://dashboard.durabletask.io](https://dashboard.durabletask.io/) and sign in using your Microsoft Entra ID account.

1. Once successfully authenticated, follow these steps to add the connection to the Durable Task Scheduler:

    ![Connecting DTS in the dashboard](../../media/images/connecting-dts.png)

- Add your Subscription ID in the Subscription input field.
- Enter the Scheduler Resource Name in the Scheduler input field.
- Provide the Scheduler Endpoint in the Scheduler Endpoint input field. You can use the Azure CLI Durable Task Extension to retrieve the endpoint:

```bash
% az durabletask scheduler list -g "RESOURCE-GROUP-NAME"
```

*Output*
```json
[
  {
    "id": "/subscriptions/SUBSCRIPTION-ID/resourceGroups/RESOURCE-GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER-NAME",
    "location": "westus2",
    "name": "SCHEDULER-NAME",
    "properties": {
      "endpoint": "https://SCHEDULER-NAME.westus2.durabletask.io",
      "ipAllowlist": [
        "0.0.0.0/0"
      ],
      "provisioningState": "Succeeded",
      "sku": {
        "capacity": 1,
        "name": "Dedicated",
        "redundancyState": "None"
      }
    },
    "resourceGroup": "RESOURCE-GROUP",
    "systemData": {
      "createdAt": "2025-01-14T19:32:34Z",
      "createdBy": "email@microsoft.com",
      "createdByType": "User",
      "lastModifiedAt": "2025-01-14T19:32:34Z",
      "lastModifiedBy": "email@microsoft.com",
      "lastModifiedByType": "User"
    },
    "tags": {
      "azd-env-name": "RESOURCE-GROUP-NAME"
    }
  }
]
```

- Add the name of the TaskHub. Use the following CLI command to locate the TaskHub name 

```bash
az durabletask taskhub list -s "SCHEDULER-NAME" -g "RESOURCE-GROUP"
```

*Output*
```json
[
  {
    "id": "/subscriptions/SUBSCRIPTION-IDresourceGroups/RESOURCE-GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER-NAME/taskHubs/TASKHUB-NAME",
    "name": "TASKHUB-NAME",
    "properties": {
      "dashboardUrl": "https://dashboard.durabletask.io/subscriptions/SUBSCRIPTION-ID/schedulers/SCHEDULER-NAME/taskhubs/TASKHUB-NAME?endpoint=https%3a%2f%2fSCHEDULER-NAME.westus2.durabletask.io",
      "provisioningState": "Succeeded"
    },
    "resourceGroup": "RESOURCE-GROUP",
    "systemData": {
      "createdAt": "2025-01-14T19:49:11Z",
      "createdBy": "email@microsoft.com",
      "createdByType": "User",
      "lastModifiedAt": "2025-01-14T19:49:11Z",
      "lastModifiedBy": "email@microsoft.com",
      "lastModifiedByType": "User"
    }
  }
]
```

- Click "Add Endpoint".

    ![The Durable Task Scheduler Connected](../../media/images/dts-connected.png)

3. Once the connection has been successfully added, you will be able to navigate to the TaskHub Overview page, where you can see the status of the orchestrations within that TaskHub.


    ![TaskHub Overview](../../media/images/taskhub-overview.png)

## Clean up resources

1. Remove the task hub you created.

    ```azurecli
    az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```

    Successful deletion doesn't return any output.

1. Next, delete the scheduler that housed that task hub.

    ```azurecli
    az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER 
    ```

1. Make sure you've deleted all task hubs in the Durable Task Scheduler environment. If you haven't, you'll receive the following error message:

    ```json
    {
      "error": {
        "code": "CannotDeleteResource",
        "message": "Cannot delete resource while nested resources exist. Some existing nested resource IDs include: 'Microsoft.DurableTask/schedulers/YOUR_SCHEDULER/taskhubs/YOUR_TASKHUB'. Please delete all nested resources before deleting this resource."
      }
    }
    ```

## Demo
Click the image below to watch the video on YouTube.

<a href="https://youtu.be/8Ot13RgT2oI"><img src="../../media/images/video_thumbnail.png" width="600px"></a>

## Next steps

Learn more about:

- [Durable Task Scheduler performance](../../docs/performance.md)
- [The Durable Task Scheduler dashboard](../../docs/dashboard.md)