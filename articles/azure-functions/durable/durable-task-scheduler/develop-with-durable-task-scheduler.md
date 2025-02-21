---
title: Develop with the Durable Task Scheduler (preview)
description: Learn how to develop with the Durable Task Scheduler and task hub resources
author: lilyjma
ms.topic: how-to
ms.date: 02/20/2025
ms.author: jiayma
ms.reviewer: azfuncdf
zone_pivot_groups: dts-devexp
---

# Develop with the Durable Task Scheduler (preview)

The Durable Task Scheduler (DTS) is a new backend provider for Durable Functions. It is fully managed by Azure, highly performant, and provides an out-of-the-box monitoring dashboard. For more details and other DTS features, see the [Durable Task Scheduler](./durable-task-scheduler.md) article. 

> [!NOTE] 
> You can create up to 5 schedulers per region per subscription today. If this limit doesn't meet your needs, please file a request in the [Durable Task Scheduler repository]()[TODO]. 

> DTS is currently supported in the following regions: **Australia East, North Europe, Sweden Central, UK South, North Central US, West US 2**. Support for more regions will be added soon. 

::: zone pivot="az-cli"  

## Prerequisites
- [The latest version of the Azure CLI.](/cli/azure/install-azure-cli) 

## Set up the CLI

Login to the Azure CLI and make sure you have the latest installed.

```azurecli
az login
az upgrade
```

Install the Durable Task Scheduler CLI extension.

```azurecli
az extension add --name durabletask
```

If you've already installed the Durable Task Scheduler CLI extension, upgrade to the latest version.

```azurecli
az extension add --upgrade --name durabletask
```
::: zone-end 

## Create a Durable Task Scheduler and task hub
::: zone pivot="az-cli" 
1. Create a resource group:
  ```azurecli
  az group create --name YOUR_RESOURCE_GROUP --location LOCATION
  ```
2. Create a scheduler:
  ```azurecli
  az durabletask scheduler create --name "YOUR_SCHEDULER" --resource-group "YOUR_RESOURCE_GROUP" --location "LOCATION" --ip-allowlist "[0.0.0.0/0]" --sku-name "dedicated" --sku-capacity "1"
  ```

  The creation process may take up to 15 minutes to complete.

  *Output*

  ```json
  {
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULER",
      "location": "northcentralus",
      "name": "YOUR_SCHEDULER",
      "properties": {
          "endpoint": "https://YOUR_SCHEDULER.northcentralus.durabletask.io",
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
      "resourceGroup": "YOUR_RESOURCE_GROUP",
      "systemData": {
          "createdAt": "2025-01-06T21:22:59Z",
          "createdBy": "YOUR_EMAIL@microsoft.com",
          "createdByType": "User",
          "lastModifiedAt": "2025-01-06T21:22:59Z",
          "lastModifiedBy": "YOUR_EMAIL@microsoft.com",
          "lastModifiedByType": "User"
      },
      "tags": {}
  }
  ```
3. Create a task hub:
  ```azurecli
  az durabletask taskhub create --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
  ```

  *Output*

  ```json
  {
    "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_SCHEDULERS/taskHubs/YOUR_TASKHUB",
    "name": "YOUR_TASKHUB",
    "properties": {
      "provisioningState": "Succeeded"
    },
    "resourceGroup": "YOUR_RESOURCE_GROUP",
    "systemData": {
      "createdAt": "2024-09-18T22:13:56.5467094Z",
      "createdBy": "OBJECT_ID",
      "createdByType": "User",
      "lastModifiedAt": "2024-09-18T22:13:56.5467094Z",
      "lastModifiedBy": "OBJECT_ID",
      "lastModifiedByType": "User"
    },
    "type": "microsoft.durabletask/scheduler/taskhubs"
  }
  ```
::: zone-end 

::: zone pivot="az-portal" 

You can create Durable Task Scheduler and task hub on Azure portal  via two ways: *Function app integrated creation* and *top-level creation*. The benefit of the former is that it automatically creates the managed identity resource and RBAC assignment needed for your app to access DTS. If you created a scheduler through the top-level creation approach, see [assign RBAC]() section to configure access for your app. 

### [Function app integrated creation](#tab/function-app-integrated-creation)  
You can create a scheduler and a task hub as part of the Function app creation on Azure portal. 

> [!NOTE]
> DTS currently supports apps hosted in the **App Service** and **Functions Premium** plans, so this experience is available only when either of these plan types is picked. 

1. Navigate to the Function app creation blade and select **App Service** as a hosting option.

:::image type="content" source="media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

2. In the **Create Function App (App Service)** blade, fill in the information in the **Basics** tab. 

:::image type="content" source="media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

3. After filling out other necessary tabs, select the **Durable Functions** tab. Choose **Durable Task Scheduler** as the backend provider for your Durable Functions. Note that in addition to a scheduler resource, a task hub will be created.

:::image type="content" source="media/create-durable-task-scheduler/durable-func-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

> [!NOTE]
> It is recommended that the region chosen for your Durable Task Scheduler matches the region chosen for your Function App. 

4. Click **Review + create** to take you to the create summary. Since [DTS supports only identity-based authentication](), a user-assigned managed identity with the required RBAC role will be created automatically so that the Function app can access DTS. You can find in the summary view information related to the managed identity resource, such as:
- The RBAC assigned to it (*Durable Task Data Contributor*) 
- The assignment scope (on the task hub level):

   :::image type="content" source="media/create-durable-task-scheduler/func-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

5. Click **Create** once validation passes. 

### [Top-level creation](#tab/top-level-creation) 

1. In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-dts.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

2. Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

:::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

3. Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

Deployment may take around 15 to 20 minutes. 

::: zone-end 
---

## View all Durable Task Scheduler resources in a subscription
::: zone pivot="az-cli" 

Get a list of all Durable Task Scheduler names within a subscription by running:

```azurecli
  az durabletask scheduler list --subscription <SUBSCRIPTION_ID>
```

You can narrow results down to a specific resource group by adding the `--resource-group` flag.

```azurecli
  az durabletask scheduler list --subscription <SUBSCRIPTION_ID> --resource-group <RESOURCE_GROUP_NAME>
```

::: zone-end 

::: zone pivot="az-portal"

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-dts.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

You can see the list of scheduler resources created in all subscriptions you have access to. 

::: zone-end 

## View all task hubs in a Durable Task Scheduler
::: zone pivot="az-cli" 

Retrieve a list of task hubs in a specific scheduler by running: 

```azurecli
  az durabletask taskhub list --resource-group <RESOURCE_GROUP_NAME> --scheduler-name <SCHEDULER_NAME>
```

::: zone-end 

::: zone pivot="az-portal"

You can see all the task hubs created in a scheduler on the **Overview** of the resource on Azure portal. 

:::image type="content" source="media/create-durable-task-scheduler/dts-overview-portal.png" alt-text="Screenshot of overview tab of Durable Task Scheduler in the portal.":::

::: zone-end 

## Delete a Durable Task Scheduler and task hub

::: zone pivot="az-cli" 

Delete a scheduler:

```azurecli
az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER
```

Delete a task hub:

```azurecli
az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
```

::: zone-end 

::: zone pivot="az-portal"

Open the scheduler resource on Azure portal and click "Delete": 

:::image type="content" source="media/create-durable-task-scheduler/dts-delete-portal.png" alt-text="Screenshot of scheduler resource in the portal highlighting delete button.":::

Find the scheduler with the task hub you want to delete, then click into that task hub. Click "Delete":

:::image type="content" source="media/create-durable-task-scheduler/taskhub-delete-portal.png" alt-text="Screenshot of task hub resource in the portal highlighting delete button.":::

::: zone-end 

## Configure identity-based authentication for app to access DTS

DTS support identity-based authentication only. You can use **user-assigned** or **system-assigned** managed identity. However, it is recommended that you use a user-assigned identity as it's not tied to the lifecycle of the app and can be reused after the app is de-provisioned.

The following sections show to configure identity resources for your Durable Functions app to access a scheduler and its task hubs. 

### Assign RBAC (role-based access control) to managed identity resource 
::: zone pivot="az-cli" 

1. Create a user-assigned managed identity

```bash
    az identity create -g MyResourceGroup -n MyIdentity
```

1. Set the assignee to identity resource created

```bash 
    assignee=$(az identity show --name MyIdentity --resource-group MyResourceGroup --query 'principalId' --output tsv) 
``` 

[!INCLUDE [assign-rbac-cli](./includes/assign-rbac-cli.md)]

::: zone-end 

::: zone pivot="az-portal"

[!INCLUDE [assign-rbac-portal](./includes/assign-rbac-portal.md)]

::: zone-end 

### Assign managed identity to your app

Ensure the identity with the required RBAC is assigned to your function app:  
1. From your app in the portal, from the left menu, select **Settings** > **Identity**.
1. Click the **User assigned** tab.
1. Click **+ Add**, then pick the identity created in the last section. Click the **Add** button.

  :::image type="content" source="../media/configure-durable-task-scheduler/assign-identity.png" alt-text="Screenshot of adding the user-assigned managed identity to your app in the portal.":::

### Add environment variables to app

1. Find the *client id* of the managed identity resource and note it:

:::image type="content" source="../media/configure-durable-task-scheduler/identity_id.png" alt-text="Screenshot of the finding the identity resource ID in the portal.":::
::: zone-end  

1. Navigate to your app on the portal.

1. In the left menu, click **Settings** > **Environment variables**. 

1. Add the following environment variables: 
    * `TASKHUB_NAME`: name of task hub
    * `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`: the format of the string is `Endpoint={DTS URL};Authentication=ManagedIdentity;ClientID={client id}`, where *endpoint* is the Durable Task Scheduler URL and *client id* is the ID of the identity ID noted previously

1. Click **Apply** then **Confirm** to add the variables. 

  > [!NOTE]
  > If you use system-assigned identity, your connection string would not need the client ID of the identity resource: `Endpoint={DTS URL};Authentication=ManagedIdentity`.


## Accessing DTS dashboard
Access should be granted to your *developer identity* when you need access to Durable Task Scheduler dashboard. 

After granting access, go to https://dashboard.durabletask.dev/ and fill out the required information about your scheduler and task hub to see the dashboard. 

::: zone pivot="az-cli" 
1. Set the assignee to your developer identity

```bash
  assignee=$(az ad user show --id "someone@microsoft.com" --query "id" --output tsv)
```

[!INCLUDE [assign-rbac-cli](./includes/assign-rbac-cli.md)]

::: zone-end 

::: zone pivot="az-portal"

[!INCLUDE [assign-dev-identity-rbac-portal](./includes/assign-dev-identity-rbac-portal.md)]

::: zone-end 

## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md)