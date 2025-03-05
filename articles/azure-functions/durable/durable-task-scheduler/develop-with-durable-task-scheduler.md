---
title: Develop with the Durable Task Scheduler (preview)
description: Learn how to develop with the Durable Task Scheduler and task hub resources
author: lilyjma
ms.topic: how-to
ms.date: 02/27/2025
ms.author: jiayma
ms.reviewer: azfuncdf
zone_pivot_groups: dts-devexp
---

# Develop with the Durable Task Scheduler (preview)

The Durable Task Scheduler (DTS) is a highly performant, fully-managed backend provider for Durable Functions with an [out-of-the-box monitoring dashboard](./durable-task-scheduler-dashboard.md). In this article, you'll learn how to:

> [!div class="checklist"]
> * Create a scheduler and task hub. 
> * Configure identity-based authentication for your application to access DTS.
> * Monitor the status of your app and task hub on the dts dashboard. 

[Learn more about DTS supported regions, plans, and the features it offers.](./durable-task-scheduler.md)

::: zone pivot="az-cli"  

## Prerequisites

- [The latest version of the Azure CLI.](/cli/azure/install-azure-cli) 

## Set up the CLI

1. Login to the Azure CLI and make sure you have the latest installed.

    ```azurecli
    az login
    az upgrade
    ```

1. Install the DTS CLI extension.

    ```azurecli
    az extension add --name durabletask
    ```

1. If you've already installed the DTS CLI extension, upgrade to the latest version.

    ```azurecli
    az extension add --upgrade --name durabletask
    ```

::: zone-end 

## Create a scheduler and task hub

::: zone pivot="az-cli"

> [!NOTE]
> DTS currently supports apps hosted in the **App Service** and **Functions Premium** plans only.  

1. Create a resource group.

    ```azurecli
    az group create --name YOUR_RESOURCE_GROUP --location LOCATION
    ```

1. Using the `durabletask` CLI extension, create a scheduler.

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

1. Create a task hub.

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

You can create a scheduler and task hub on Azure portal via two ways: 
- **Function app integrated creation:** *(recommended)* automatically creates the managed identity resource and RBAC assignment needed for your app to access DTS.
- **Top-level creation:** Requires you to [manually assign RBAC](#configure-identity-based-authentication-for-app-to-access-dts) to configure DTS access for your app.

> [!NOTE]
> DTS currently supports apps hosted in the **App Service** and **Functions Premium** plans, so this experience is available only when either of these plan types is picked. 

# [Function app integrated creation](#tab/function-app-integrated-creation)  

You can create a scheduler and a task hub as part of the Function app creation on Azure portal. 

[!INCLUDE [function-app-integrated-creation](./includes/function-app-integrated-creation.md)]

# [Top-level creation](#tab/top-level-creation) 

1. In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

    :::image type="content" source="media/create-durable-task-scheduler/search-for-dts.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

1. Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

    :::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

1. Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

    Deployment may take around 15 to 20 minutes. 

---

::: zone-end 

## View all Durable Task Scheduler resources in a subscription

::: zone pivot="az-cli" 

1. Get a list of all Durable Task Scheduler names within a subscription by running the following command.

    ```azurecli
    az durabletask scheduler list --subscription <SUBSCRIPTION_ID>
    ```

1. You can narrow results down to a specific resource group by adding the `--resource-group` flag.

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

## Delete the scheduler and task hub

::: zone pivot="az-cli" 

1. Delete the scheduler:

    ```azurecli
    az durabletask scheduler --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER
    ```

1. Delete a task hub:

    ```azurecli
    az durabletask taskhub delete --resource-group YOUR_RESOURCE_GROUP --scheduler-name YOUR_SCHEDULER --name YOUR_TASKHUB
    ```

::: zone-end 

::: zone pivot="az-portal"

1. Open the scheduler resource on Azure portal and click "Delete": 

    :::image type="content" source="media/create-durable-task-scheduler/dts-delete-portal.png" alt-text="Screenshot of scheduler resource in the portal highlighting delete button.":::

1. Find the scheduler with the task hub you want to delete, then click into that task hub. Click "Delete":

    :::image type="content" source="media/create-durable-task-scheduler/taskhub-delete-portal.png" alt-text="Screenshot of task hub resource in the portal highlighting delete button.":::

::: zone-end 

## Configure identity-based authentication for app to access DTS

DTS *only* supports either *user-assigned* or *system-assigned* managed identity authentication. **User-assigned identities are recommended,** as they aren't tied to the lifecycle of the app and can be reused after the app is de-provisioned.

The following sections demonstrate how to configure identity resources for your Durable Functions app to access a scheduler and its task hubs. 

### Assign RBAC (role-based access control) to managed identity resource 

::: zone pivot="az-cli" 

1. Create a user-assigned managed identity

    ```azurecli
    az identity create -g RESOURCE_GROUP_NAME -n IDENTITY_NAME
    ```

1. Set the assignee to identity resource created

    ```azurecli
    assignee=$(az identity show --name IDENTITY_NAME --resource-group RESOURCE_GROUP_NAME --query 'clientId' --output tsv) 
    ``` 

1. Set the scope. Granting access on the scheduler scope gives access to *all* task hubs in that scheduler.

    **Task Hub**

    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/taskHubs/TASKHUB_NAME"
    ```
   
    **Scheduler**
    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME"
    ```

1. Grant access. Run the following command to create the role assignment and grant access.

    ```azurecli
    az role assignment create \
      --assignee "$assignee" \
      --role "Durable Task Data Contributor" \
      --scope "$scope"
    ```
   
    *Expected output*
   
    The following output example shows a developer identity assigned with the Durable Task Data Contributor role on the *scheduler* level:
   
    ```json
    {
      "condition": null,
      "conditionVersion": null,
      "createdBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "createdOn": "2024-12-20T01:36:45.022356+00:00",
      "delegatedManagedIdentityResourceId": null,
      "description": null,
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME/providers/Microsoft.Authorization/roleAssignments/ROLE_ASSIGNMENT_ID",
      "name": "ROLE_ASSIGNMENT_ID",
      "principalId": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "principalName": "YOUR_EMAIL",
      "principalType": "User",
      "resourceGroup": "YOUR_RESOURCE_GROUP",
      "roleDefinitionId": "/subscriptions/YOUR_SUBSCRIPTION/providers/Microsoft.Authorization/roleDefinitions/ROLE_DEFINITION_ID",
      "roleDefinitionName": "Durable Task Data Contributor",
      "scope": "/subscriptions/YOUR_SUBSCRIPTION/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME",
      "type": "Microsoft.Authorization/roleAssignments",
      "updatedBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "updatedOn": "2024-12-20T01:36:45.022356+00:00"
    }
    ```

::: zone-end 

::: zone pivot="az-portal"

[!INCLUDE [assign-rbac-portal](./includes/assign-rbac-portal.md)]

::: zone-end 

### Assign managed identity to your app

Now that the identity has the required RBAC to access DTS, you need to assign it to your function app.

::: zone pivot="az-cli" 

1. Get resource ID of manage identity.
    ```azurecli
    resource_id=$(az resource show --resource-group RESOURCE_GROUP --name MANAGED_IDENTITY_NAME --resource-type Microsoft.ManagedIdentity/userAssignedIdentities --query id --output tsv)
    ```

1. Assign the identity to app.
    ```azurecli
    az functionapp identity assign --resource-group RESOURCE_GROUP_NAME --name FUNCTION_APP_NAME --identities "$resource_id"
    ```

::: zone-end 

::: zone pivot="az-portal"
  
1. From your app in the portal, select **Settings** > **Identity**. 

1. Click the **User assigned** tab.

1. Click **+ Add**, then pick the identity created in the last section. Click the **Add** button.

    :::image type="content" source="media/configure-durable-task-scheduler/assign-identity.png" alt-text="Screenshot of adding the user-assigned managed identity to your app in the portal.":::

::: zone-end 

### Add environment variables to app
Add these two environment variables to app setting:
  - `TASKHUB_NAME`: name of task hub
  - `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`: the format of the string is `"Endpoint={DTS endpoint};Authentication=ManagedIdentity;ClientID={client id}"`, where *endpoint* is the DTS endpoint and *client id* is the managed identity client ID. 

::: zone pivot="az-cli"

1. Get required information for DTS connection string. 

    To get DTS endpoint.
    ```azurecli
    az durabletask scheduler show --resource-group RESOURCE_GROUP_NAME --name DTS_NAME --query 'properties.endpoint' --output tsv
    ```

    To get client id of managed identity.
    ```azurecli
    az identity show --name MANAGED_IDENTITY_NAME --resource-group RESOURCE_GROUP_NAME --query 'clientId' --output tsv
    ```

1. Use the following command to add environment variable for DTS connection string to app. 
    ```azurecli
    az functionapp config appsettings set --resource-group RESOURCE_GROUP_NAME --name FUNCTION_APP_NAME --settings KEY_NAME=KEY_VALUE
    ```

1. Repeat previous step to add environment variable for task hub name. 

::: zone-end 

::: zone pivot="az-portal"

1. Get required information for DTS connection string. 

    To get your DTS endpoint, navigate to the **Overview** tab of your scheduler resource and find "Endpoint" in the top *Essentials* section. 

    To get your managed identity client ID, navigate to the **Overview** tab of your resource and find "Client ID" in the top *Essentials* section. 

1. Navigate to your app on the portal. 

1. In the left menu, click **Settings** > **Environment variables**. 

1. Add environment variable for DTS connection string. 

1. Add environment variable for task hub name.   

1. Click **Apply** then **Confirm** to add the variables. 

::: zone-end 

> [!NOTE]
> If you use system-assigned identity, your connection string would *not* need the client ID of the identity resource: `"Endpoint={DTS URL};Authentication=ManagedIdentity"`.

## Accessing DTS dashboard

Gain access to the [DTS dashboard](./durable-task-scheduler-dashboard.md) by assigning the required role to your *developer identity*. After granting access, go to `https://dashboard.durabletask.dev/` and fill out the required information about your scheduler and task hub to see the dashboard. 

::: zone pivot="az-cli" 

1. Set the assignee to your developer identity.

    ```azurecli
    assignee=$(az ad user show --id "someone@microsoft.com" --query "id" --output tsv)
    ```

1. Set the scope. Granting access on the scheduler scope gives access to *all* task hubs in that scheduler.

    **Task Hub**

    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/taskHubs/TASK_HUB_NAME"
    ```
   
    **Scheduler**
    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME"
    ```

1. Grant access. Run the following command to create the role assignment and grant access.

    ```azurecli
    az role assignment create \
      --assignee "$assignee" \
      --role "Durable Task Data Contributor" \
      --scope "$scope"
    ```
   
    *Expected output*
   
    The following output example shows a developer identity assigned with the Durable Task Data Contributor role on the *scheduler* level:
   
    ```json
    {
      "condition": null,
      "conditionVersion": null,
      "createdBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "createdOn": "2024-12-20T01:36:45.022356+00:00",
      "delegatedManagedIdentityResourceId": null,
      "description": null,
      "id": "/subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME/providers/Microsoft.Authorization/roleAssignments/ROLE_ASSIGNMENT_ID",
      "name": "ROLE_ASSIGNMENT_ID",
      "principalId": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "principalName": "YOUR_EMAIL",
      "principalType": "User",
      "resourceGroup": "YOUR_RESOURCE_GROUP",
      "roleDefinitionId": "/subscriptions/YOUR_SUBSCRIPTION/providers/Microsoft.Authorization/roleDefinitions/ROLE_DEFINITION_ID",
      "roleDefinitionName": "Durable Task Data Contributor",
      "scope": "/subscriptions/YOUR_SUBSCRIPTION/resourceGroups/YOUR_RESOURCE_GROUP/providers/Microsoft.DurableTask/schedulers/YOUR_DTS_NAME",
      "type": "Microsoft.Authorization/roleAssignments",
      "updatedBy": "YOUR_DEVELOPER_CREDENTIAL_ID",
      "updatedOn": "2024-12-20T01:36:45.022356+00:00"
    }
    ```

::: zone-end 

::: zone pivot="az-portal"

[!INCLUDE [assign-dev-identity-rbac-portal](./includes/assign-dev-identity-rbac-portal.md)]

::: zone-end 

## Auto scaling in Functions Premium plan 
For DTS apps on the Functions Premium plan, enable the Runtime Scale Monitoring setting to get auto scaling of the app. 

1. In your function app, navigate to **Settings** > **Configuration**.

1. Under the *Function runtime settings* tab, turn on Runtime Scale Monitoring. 

  :::image type="content" source="media/develop-with-durable-task-scheduler/runtime-scale-monitoring.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

## Next steps

Try out the [Durable Functions quickstart sample](quickstart-durable-task-scheduler.md).