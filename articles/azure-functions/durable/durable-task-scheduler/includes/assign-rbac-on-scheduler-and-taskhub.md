---
ms.service: azure-functions
ms.topic: include
ms.date: 01/30/2025
---

### Create a user-managed identity

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 

1. In the Azure portal, go to the identity resource and note down its ID: 

    :::image type="content" source="./media/configure-durable-task-scheduler/identity_id.png" alt-text="Screenshot of the finding the identity resource ID in the portal.":::

### Assign Azure Role-Based Access Control (RBAC) to the user-managed identity

1. Navigate to the Durable Task Scheduler resource on the portal. 

1. In the left menu, select **Access control (IAM)**.

1. Click **Add** to add a role assignment.

    :::image type="content" source="./media/configure-durable-task-scheduler/add-assignment.png" alt-text="Screenshot of the adding the role assignment on the Access Control pane in the portal.":::

1. Search for and select **Durable Task Data Contributor**. Click **Next**.

    :::image type="content" source="./media/configure-durable-task-scheduler/data-contributor-role.png" alt-text="Screenshot of selecting the Durable Task Data Contributor role assignment in the portal.":::

1. On the **Members** tab, for **Assign access to**, select **Managed identity**.

1. For **Members**, click **+ Select members**.

1. In the **Select managed identities** pane, expand the **Managed identity** drop down and select **User-assigned managed identity**.

    :::image type="content" source="./media/configure-durable-task-scheduler/members-tab.png" alt-text="Screenshot of selecting the user-assigned managed identity type in the portal.":::

1. Pick the user-managed identity you previously created and click the **Select** button.

1. Click **Review + assign** to finish assigning the role. 

### Assign the Storage RBAC to the user-managed identity

1. In the Azure portal, navigate to your Azure Storage account. 

1. Repeat the steps from the [previous section](#assign-azure-role-based-access-control-rbac-to-the-user-managed-identity) to assign the **Storage Blob Data Contributor** role to the identity. 

### Enable user-assigned managed identity on your app

The identity is now created and is set up with the right RBAC access. Now we need to assign the identity to your app:  
1. From your app in the portal, from the left menu, select **Settings** > **Identity**.
1. Click the **User assigned** tab.
1. Click **+ Add**, then pick the identity created in the last section. Click the **Add** button.

    :::image type="content" source="./media/configure-durable-task-scheduler/pick-identity.png" alt-text="Screenshot of adding the user-assigned managed identity to your app in the portal.":::

### Add required environment variables to app

1. Navigate to your app on the portal.

1. In the left menu, click **Settings** > **Environment variables**. 

1. Delete the `AzureWebJobsStorage` setting. 

1. Add the following environment variables: 
    * `AzureWebJobsStorage__accountName`: your storage account name 
    * `AzureWebJobsStorage__clientId`: the identity ID noted previously
    * `AzureWebJobsStorage__credential`: `managedidentity`
    * `TASKHUB_NAME`: name of task hub
    * `DURABLE_TASK_SCHEDULER_CONNECTION_STRING`: the format of the string is `Endpoint={DTS URL};Authentication=ManagedIdentity;ClientID={client id}`, where *endpoint* is the Durable Task Scheduler URL and *client id* is the ID of the identity ID noted previously

    > [!NOTE]
    > If you use system-assigned identity, your connection string would be: `Endpoint={DTS URL};Authentication=ManagedIdentity`.

1. Click **Apply** then **Confirm** to add the variables. 
