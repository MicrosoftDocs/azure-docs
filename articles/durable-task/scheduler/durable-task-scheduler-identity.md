---
author: hhunter-ms
ms.author: hannahhunter
title: Configure managed identity for Durable Task Scheduler
titleSuffix: Durable Task
description: "Learn how to configure managed identity for Durable Task Scheduler, including role assignments and RBAC setup. Set up user-assigned or system-assigned identity authentication for your app."
ms.topic: how-to
ms.service: durable-task
ms.subservice: durable-task-scheduler
ms.date: 04/30/2026
zone_pivot_groups: dts-devexp
---

# Configure managed identity for Durable Task Scheduler

Durable Task Scheduler uses managed identity for authentication. You can use either a *user-assigned* or *system-assigned* managed identity. **User-assigned identities are recommended** because they aren't tied to the lifecycle of the app and can be reused after the app is deprovisioned.

This article covers two ways to configure managed identity:

- **[Quick setup](#quick-setup-with-az-durabletask-scheduler-attach)** — A single CLI command that automates role assignment, identity attachment, and environment variable configuration.
- **[Manual setup](#manual-setup)** — Step-by-step instructions for full control over each configuration step.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A [Durable Task Scheduler and task hub](./durable-task-scheduler.md) resource already provisioned.
- [Azure CLI](/cli/azure/install-azure-cli) with the `durabletask` extension installed (`az extension add --name durabletask`).
- **Owner** or **User Access Administrator** role on the scheduler resource (required to create role assignments).

## Durable Task Scheduler RBAC roles

You can grant the following Durable Task Scheduler related roles to an identity:

| Role | Description |
| ---- | ----------- |
| **Durable Task Data Contributor** | Role for all data access operations. This role is a superset of all other roles. |
| **Durable Task Worker** | Role used by worker applications to interact with the Durable Task Scheduler. Assign this role if your app is used *only* for processing orchestrations, activities, and entities. |
| **Durable Task Data Reader** | Role to read all Durable Task Scheduler data. Assign this role if you only need to list orchestrations and read entity payloads. |

> [!NOTE]
> Most apps require the *Durable Task Data Contributor* role. 

## Quick setup with `az durabletask scheduler attach`

The `az durabletask scheduler attach` command automates role assignment, identity attachment, and environment variable configuration in a single command.

The following example attaches a scheduler to a Function App using a user-assigned managed identity with the **Durable Task Data Contributor** role:

```azurecli
az durabletask scheduler attach \
  --resource-group RESOURCE_GROUP_NAME \
  --name SCHEDULER_NAME \
  --task-hub-name TASKHUB_NAME \
  --role-type contributor \
  --target /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.Web/sites/FUNCTION_APP_NAME \
  --identity /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/IDENTITY_NAME
```

For a Container App:

```azurecli
az durabletask scheduler attach \
  --resource-group RESOURCE_GROUP_NAME \
  --name SCHEDULER_NAME \
  --task-hub-name TASKHUB_NAME \
  --role-type contributor \
  --target /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.App/containerApps/CONTAINER_APP_NAME \
  --identity /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.ManagedIdentity/userAssignedIdentities/IDENTITY_NAME
```

> [!NOTE]
> If you omit the `--identity` parameter, the command uses the system-assigned managed identity instead.

For more information, see [az durabletask scheduler attach](/cli/azure/durabletask/scheduler#az-durabletask-scheduler-attach).

## Manual setup

If you need granular control over each step, follow the manual instructions below to assign RBAC, attach the identity, and configure environment variables individually.

### Assign role-based access control (RBAC) to a managed identity resource 

::: zone pivot="az-cli" 

1. Create a user-assigned managed identity

    ```azurecli
    az identity create -g RESOURCE_GROUP_NAME -n IDENTITY_NAME
    ```

1. Set the assignee to identity resource created

    ```azurecli
    assignee=$(az identity show --name IDENTITY_NAME --resource-group RESOURCE_GROUP_NAME --query 'clientId' --output tsv) 
    ``` 

1. Set the scope. Use **task hub scope** for least-privilege access. Use **scheduler scope** only if the identity needs access to *all* task hubs in a scheduler.

    **Task hub scope (recommended)**

    ```bash
    scope="/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.DurableTask/schedulers/SCHEDULER_NAME/taskHubs/TASKHUB_NAME"
    ```
   
    **Scheduler scope (all task hubs)**

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

> [!NOTE] 
> The following instruction shows a role assignment scoped to a specific task hub. If you need access to *all* task hubs in a scheduler, perform the assignment on the scheduler level. 

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 

1. Navigate to the Durable Task Scheduler resource in the portal. 

1. Select a task hub name.

1. In the left menu, select **Access control (IAM)**.

1. Select **Add** to add a role assignment.

    :::image type="content" source="./media/configure-durable-task-scheduler/add-assignment.png" alt-text="Screenshot of the adding the role assignment on the Access Control pane in the portal.":::

1. Search for and select **Durable Task Data Contributor**. Select **Next**.

    :::image type="content" source="./media/configure-durable-task-scheduler/data-contributor-role.png" alt-text="Screenshot of selecting the Durable Task Data Contributor role assignment in the portal.":::

1. On the **Members** tab, for **Assign access to**, select **Managed identity**.

1. For **Members**, select **+ Select members**.

1. In the **Select managed identities** pane, expand the **Managed identity** drop-down and select **User-assigned managed identity**.

    :::image type="content" source="./media/configure-durable-task-scheduler/members-tab.png" alt-text="Screenshot of selecting the user-assigned managed identity type you're going to use in the portal.":::

1. Pick the user-managed identity previously created and select **Select**.

1. Select **Review + assign** to finish assigning the role. 

::: zone-end 

### Assign managed identity to your app

Now that the identity has the required RBAC to access Durable Task Scheduler, you need to assign it to your app.

::: zone pivot="az-cli" 

1. Get resource ID of the managed identity.

    ```azurecli
    resource_id=$(az resource show --resource-group RESOURCE_GROUP_NAME --name IDENTITY_NAME --resource-type Microsoft.ManagedIdentity/userAssignedIdentities --query id --output tsv)
    ```

1. Assign the identity to app.

    # [Durable Functions](#tab/df)

    ```azurecli
    az functionapp identity assign --resource-group RESOURCE_GROUP_NAME --name FUNCTION_APP_NAME --identities "$resource_id"
    ```

    # [Azure Container Apps](#tab/aca)

    ```azurecli
    az containerapp identity assign --resource-group RESOURCE_GROUP_NAME --name CONTAINER_APP_NAME --identities "$resource_id"
    ```

    ---

::: zone-end 

::: zone pivot="az-portal"

# [Durable Functions](#tab/df)
  
1. From your app in the portal, select **Settings** > **Identity**. 

1. Select the **User assigned** tab.

1. Select **+ Add**, then pick the identity created in the last section. Select **Add**.

    :::image type="content" source="media/configure-durable-task-scheduler/assign-identity.png" alt-text="Screenshot of adding the user-assigned managed identity to your function app in the portal.":::

# [Azure Container Apps](#tab/aca)

1. From your app in the portal, select **Settings** > **Identity**. 

1. Select the **User assigned** tab.

1. Select **+ Add**, then pick the identity created in the last section. Select **Add**.

    :::image type="content" source="media/configure-durable-task-scheduler/add-assignment-container-app.png" alt-text="Screenshot of adding the user-assigned managed identity to your container app in the portal.":::

---

::: zone-end 

### Add environment variables to your app

Add the following two environment variables to your app:

| Environment variable | Value | Example |
| -------------------- | ----- | ------- |
| `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` | `Endpoint=<SCHEDULER_ENDPOINT>;Authentication=ManagedIdentity;ClientID=<IDENTITY_CLIENT_ID>` | `Endpoint=https://myscheduler.westus2.durabletask.io;Authentication=ManagedIdentity;ClientID=00000000-0000-0000-0000-000000000000` |
| `TASKHUB_NAME` | The name of the task hub | `my-task-hub` |

> [!NOTE]
> If you use **system-assigned** identity, omit the `ClientID` parameter from the connection string: `"Endpoint=<SCHEDULER_ENDPOINT>;Authentication=ManagedIdentity"`.

::: zone pivot="az-cli"

1. Get the required information for the connection string. 

    Get the scheduler endpoint:
    ```azurecli
    az durabletask scheduler show --resource-group RESOURCE_GROUP_NAME --name SCHEDULER_NAME --query 'properties.endpoint' --output tsv
    ```

    Get the client ID of the managed identity:
    ```azurecli
    az identity show --name IDENTITY_NAME --resource-group RESOURCE_GROUP_NAME --query 'clientId' --output tsv
    ```

1. Set both environment variables on your app.

    # [Durable Functions](#tab/df)

    ```azurecli
    az functionapp config appsettings set \
      --resource-group RESOURCE_GROUP_NAME \
      --name FUNCTION_APP_NAME \
      --settings \
        DURABLE_TASK_SCHEDULER_CONNECTION_STRING="Endpoint=<SCHEDULER_ENDPOINT>;Authentication=ManagedIdentity;ClientID=<IDENTITY_CLIENT_ID>" \
        TASKHUB_NAME="<TASKHUB_NAME>"
    ```

    # [Azure Container Apps](#tab/aca)

    ```azurecli
    az containerapp update \
      --resource-group RESOURCE_GROUP_NAME \
      --name CONTAINER_APP_NAME \
      --set-env-vars \
        DURABLE_TASK_SCHEDULER_CONNECTION_STRING="Endpoint=<SCHEDULER_ENDPOINT>;Authentication=ManagedIdentity;ClientID=<IDENTITY_CLIENT_ID>" \
        TASKHUB_NAME="<TASKHUB_NAME>"
    ```
    
    ---

::: zone-end 

::: zone pivot="az-portal"

1. Get the required information for the connection string. 

    To get your scheduler endpoint, navigate to the **Overview** tab of your scheduler resource and find **Endpoint** in the *Essentials* section. 

    To get your managed identity client ID, navigate to the **Overview** tab of your managed identity resource and find **Client ID** in the *Essentials* section.

    :::image type="content" source="media/configure-durable-task-scheduler/identity-id.png" alt-text="Screenshot of the managed identity overview page showing the Client ID location in the Azure portal.":::

1. Navigate to your app in the portal. 

1. In the left menu, select **Settings** > **Environment variables**. 

1. Add an environment variable named `DURABLE_TASK_SCHEDULER_CONNECTION_STRING` with the value `Endpoint=<SCHEDULER_ENDPOINT>;Authentication=ManagedIdentity;ClientID=<IDENTITY_CLIENT_ID>`. 

1. Add an environment variable named `TASKHUB_NAME` with the name of your task hub.   

1. Select **Apply**, then **Confirm** to save the variables. 

::: zone-end

## Related content

- [Durable Task Scheduler overview](./durable-task-scheduler.md)
- [Monitor orchestrations via the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)
- [Configure private endpoints for Durable Task Scheduler](./durable-task-scheduler-private-endpoints.md)