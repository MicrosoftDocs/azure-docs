---
title: Configure managed identity for Azure Functions Durable Task Scheduler (preview)
description: Learn about the roles available for managed identity in Durable Task Scheduler and how to configure them.
ms.topic: how-to
ms.date: 05/06/2025
zone_pivot_groups: dts-devexp
---

# Configure managed identity for Durable Task Scheduler (preview)

Durable Task Scheduler **only** supports either *user-assigned* or *system-assigned* managed identity authentication. **User-assigned identities are recommended,** as they aren't tied to the lifecycle of the app and can be reused after the app is deprovisioned.

You can grant the following Durable Task Scheduler related roles to an identity:

| Role | Description |
| ---- | ----------- |
| **Durable Task Data Contributor** | Role for all data access operations. This role is a superset of all other roles. |
| **Durable Task Worker** | Role used by worker applications to interact with the Durable Task Scheduler. Assign this role if your app is used *only* for processing orchestrations, activities, and entities. |
| **Durable Task Data Reader** | Role to read all Durable Task Scheduler data. Assign this role if you only need a list of orchestrations and entities payloads. |

> [!NOTE]
> Most Durable Functions apps require the *Durable Task Data Contributor* role. 

In this article, you learn how to grant permissions to an identity resource and configure your compute app to use the identity for access to schedulers and task hubs. 

## Assign role-based access control (RBAC) to a managed identity resource 

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

> [!NOTE] 
> The following instruction shows a role assignment scoped to a specific task hub. If you need access to *all* task hubs in a scheduler, perform the assignment on the scheduler level. 

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 

1. Navigate to the durable task scheduler resource on the portal. 

1. Click on a task hub name.

1. In the left menu, select **Access control (IAM)**.

1. Click **Add** to add a role assignment.

    :::image type="content" source="./media/configure-durable-task-scheduler/add-assignment.png" alt-text="Screenshot of the adding the role assignment on the Access Control pane in the portal.":::

1. Search for and select **Durable Task Data Contributor**. Click **Next**.

    :::image type="content" source="./media/configure-durable-task-scheduler/data-contributor-role.png" alt-text="Screenshot of selecting the Durable Task Data Contributor role assignment in the portal.":::

1. On the **Members** tab, for **Assign access to**, select **Managed identity**.

1. For **Members**, click **+ Select members**.

1. In the **Select managed identities** pane, expand the **Managed identity** drop-down and select **User-assigned managed identity**.

    :::image type="content" source="./media/configure-durable-task-scheduler/members-tab.png" alt-text="Screenshot of selecting the user-assigned managed identity type you're going to use in the portal.":::

1. Pick the user-managed identity previously created and click the **Select** button.

1. Click **Review + assign** to finish assigning the role. 

::: zone-end 

## Assign managed identity to your app

Now that the identity has the required RBAC to access Durable Task Scheduler, you need to assign it to your app.

::: zone pivot="az-cli" 

1. Get resource ID of manage identity.

    ```azurecli
    resource_id=$(az resource show --resource-group RESOURCE_GROUP --name MANAGED_IDENTITY_NAME --resource-type Microsoft.ManagedIdentity/userAssignedIdentities --query id --output tsv)
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

1. Click the **User assigned** tab.

1. Click **+ Add**, then pick the identity created in the last section. Click the **Add** button.

    :::image type="content" source="media/configure-durable-task-scheduler/assign-identity.png" alt-text="Screenshot of adding the user-assigned managed identity to your function app in the portal.":::

# [Azure Container Apps](#tab/aca)

1. From your app in the portal, select **Settings** > **Identity**. 

1. Click the **User assigned** tab.

1. Click **+ Add**, then pick the identity created in the last section. Click the **Add** button.

    :::image type="content" source="media/configure-durable-task-scheduler/add-assignment-container-app.png" alt-text="Screenshot of adding the user-assigned managed identity to your container app in the portal.":::

---

::: zone-end 

## Add environment variables to app

Add these two environment variables to app setting:
  - `TASKHUB_NAME`: name of task hub
  - `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`: the format of the string is `"Endpoint={scheduler point};Authentication=ManagedIdentity;ClientID={client id}"`, where `Endpoint` is the scheduler endpoint and `client id` is the identity's client ID. 

::: zone pivot="az-cli"

1. Get the required information for the Durable Task Scheduler connection string. 

    To get the scheduler endpoint.
    ```azurecli
    az durabletask scheduler show --resource-group RESOURCE_GROUP_NAME --name DTS_NAME --query 'properties.endpoint' --output tsv
    ```

    To get the client ID of managed identity.
    ```azurecli
    az identity show --name MANAGED_IDENTITY_NAME --resource-group RESOURCE_GROUP_NAME --query 'clientId' --output tsv
    ```

1. Use the following command to add environment variable for the scheduler connection string to app. 

    # [Durable Functions](#tab/df)

    ```azurecli
    az functionapp config appsettings set --resource-group RESOURCE_GROUP_NAME --name FUNCTION_APP_NAME --settings KEY_NAME=KEY_VALUE
    ```

    # [Azure Container Apps](#tab/aca)

    ```azurecli
    az containerapp --resource-group RESOURCE_GROUP_NAME --name CONTAINER_APP_NAME --set-env-vars KEY=VALUE
    ```
    
    ---

1. Repeat previous step to add environment variable for task hub name. 

::: zone-end 

::: zone pivot="az-portal"

1. Get the required information for the Durable Task Scheduler connection string. 

    To get your scheduler endpoint, navigate to the **Overview** tab of your scheduler resource and find "Endpoint" in the top *Essentials* section. 

    To get your managed identity client ID, navigate to the **Overview** tab of your resource and find "Client ID" in the top *Essentials* section. 

1. Navigate to your app on the portal. 

1. In the left menu, click **Settings** > **Environment variables**. 

1. Add environment variable for Durable Task Scheduler connection string. 

1. Add environment variable for task hub name.   

1. Click **Apply** then **Confirm** to add the variables. 

::: zone-end 

> [!NOTE]
> If you use system-assigned identity, your connection string would *not* need the client ID of the identity resource: `"Endpoint={scheduler endpoint};Authentication=ManagedIdentity"`.

## Next steps

> [!div class="nextstepaction"]
> [Debug and monitor your orchestrations via the Durable Task Scheduler dashboard](./durable-task-scheduler-dashboard.md)