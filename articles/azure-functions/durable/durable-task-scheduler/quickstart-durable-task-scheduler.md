---
title: "Quickstart: Configure a Durable Functions app to use the Durable Task Scheduler (preview) storage provider"
description: Learn how to configure the Durable Task Scheduler as your Durable Function app backend provider.
ms.topic: quickstart
ms.date: 01/24/2025
---

# Quickstart: Configure a Durable Functions app to use the Durable Task Scheduler (preview) storage provider

Let's begin working with Durable Functions using the new Durable Task Scheduler backend provider. The [provided quickstart sample](https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview/tree/main/quickstarts/HelloCities):
- Schedules orchestrations that include three activities via an HTTP trigger.
- Showcases the necessary configuration for using Durable Task Scheduler as the backend provider for your Durable Function app.

In this quickstart, you'll:

> [!div class="checklist"]
>
> - Deploy the sample application using the [Azure Developer CLI](/azure/developer/azure-developer-cli/install-azd).  
> - Verify the task hub orchestration status using the [Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md).
> - Register the Durable Task Scheduler endpoint. 

## Prerequisites

- An Azure subscription. [Don't have one? Create a free account.](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- [The latest Azure Functions Core Tools installed](../../functions-run-local.md)
- [The Azure Developer CLI installed](/azure/developer/azure-developer-cli/install-azd)
- [Install .NET Core SDK](https://dotnet.microsoft.com/download) version 6 or later installed.
- [The latest Visual Studio Code installed](https://code.visualstudio.com/download) with the following extensions:
  - [Azure Functions](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)
  - [C#](https://marketplace.visualstudio.com/items?itemName=ms-dotnettools.csharp)
- [Configure an Azurite storage emulator for local storage](/azure/storage/common/storage-use-azurite).

## Set up the CLI

1. Login to the Azure CLI and make sure you have the latest installed.

   ```azurecli
   az login
   az upgrade
   ```

1. Install the Durable Task Scheduler CLI extension.

   ```azurecli
   az extension add --name durabletask
   ```

1. If you've already installed the Durable Task Scheduler CLI extension, upgrade to the latest version.

   ```azurecli
   az extension add --upgrade --name durabletask
   ```

## Clone the project

1. Clone the sample [`HelloCities`](https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview/tree/main/quickstarts/HelloCities) repo to your developer machine:

    ```shell
    git clone https://github.com/Azure/Azure-Functions-Durable-Task-Scheduler-Private-Preview.git
    ```

1. Navigate to the `HelloCities` source code directory:

    ```shell
    cd Azure-Functions-Durable-Task-Scheduler-Private-Preview/quickstarts/HelloCities
    ```

1. Open the Application in Visual Studio Code:

    ```shell
    code .
    ```

## Deploy the app to Azure

This quickstart uses the [Azure Developer CLI (`azd`)](https://aka.ms/azd) to easily deploy the app.

> [!NOTE]
> If you open the repo in GitHub CodeSpaces, the `azd` tooling is already installed.

1. From the `HelloCities` directory, run the following command to provision.

    ```bash
    azd up
    ```

1. When prompted in the terminal, provide:
   - A name for your [Azure Developer CLI environment](/azure/developer/azure-developer-cli/faq#what-is-an-environment-name).
   - The Azure subscription you'd like to use.
   - The Azure location to use. This location is related to the location in which you created the resource group, scheduler, and task hub.

   > [!NOTE]
   > This template defaults to **Elastic Premium EP1 sku plan on Linux**.

1. Track the deployment process in the terminal, or in the portal using the link provided in the terminal.

## View the app on the Durable Task Scheduler dashboard

Once your application is deployed, monitor your application using the Durable Task Scheduler dashboard.

### Navigate to the dashboard

1. In the portal, navigate to the `rg-<YOUR_AZD_ENVIRONMENT_NAME>` overview page.

1. Select the scheduler resource, with the `dts-<randomGUID>` naming convention.

    :::image type="content" source="media/quickstart-durable-task-scheduler/dts-dashboard-resource.png" alt-text="Screenshot of selecting the Durable Task Scheduler resource from the resource group you created.":::

1. On the Scheduler resource overview page, select the **Task hub name**.

    :::image type="content" source="media/quickstart-durable-task-scheduler/dts-overview-portal.png" alt-text="Screenshot of selecting the task hub resource from the scheduler resource overview page.":::

1. On the Taskhub resource overview page, select the **Dashboard Url**.

    :::image type="content" source="media/quickstart-durable-task-scheduler/taskhub-overview-portal.png" alt-text="Screenshot of finding and selecting the dashboard URL from the task hub resource overview page.":::

1. On the Durable Task Scheduler dashboard, browse and verify the orchestration state and history from within the task hub:

    :::image type="content" source="media/quickstart-durable-task-scheduler/taskhub-overview.png" alt-text="Screenshot of the task hub page in the Durable Task Scheduler dashboard.":::

### Register the Durable Task Scheduler endpoint

1. Navigate to [https://dashboard.durabletask.io](https://dashboard.durabletask.io) and sign in using your Microsoft Entra ID account. 

1. Add a new connection to the Durable Task Scheduler and fill in the following fields:

    :::image type="content" source="media/quickstart-durable-task-scheduler/connecting-dts.png" alt-text="Screenshot of the new connection fields in the Durable Task Scheduler dashboard.":::

   | Field              | Description | Example |
   | ------------------ | ----------- | ------- |
   | Subscription       | Your Azure subscription ID. | Run `az account show` to verify you're in the right subscription. |
   | Scheduler          | Your Durable Task Scheduler resource name (`dts-<randomGUID>`). | Run `az durabletask taskhub list -s "SCHEDULER-NAME" -g "RESOURCE-GROUP"` to find the scheduler name. | 
   | Scheduler Endpoint | Your Durable Task Scheduler endpoint (`https://SCHEDULER-NAME.LOCATION.durabletask.io`). | Run `az durabletask taskhub list -s "SCHEDULER-NAME" -g "RESOURCE-GROUP"` to find the scheduler endpoint. |
   | Task Hub           | Your task hub resource name (`taskhub-<randomGUID>`). | Run `az durabletask taskhub list -s "SCHEDULER-NAME" -g "RESOURCE-GROUP"` to find the task hub name. |

1. Click **Add Endpoint**.

1. Once the connection has been successfully added, navigate to the Task Hub overview page in the dashboard to orchestration status within that task hub.

## Clean up resources

1. Remove the task hub you created.

    ```azurecli
    az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```

    Successful deletion doesn't return any output.

1. Delete the scheduler that housed that task hub.

    ```azurecli
    az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER 
    ```

[See the troubleshooting guide](./troubleshoot-durable-task-scheduler.md) if you receive an error message while removing resources.

## Next steps

- [Configure an existing application to use the Durable Task Scheduler.](./configure-durable-task-scheduler.md)