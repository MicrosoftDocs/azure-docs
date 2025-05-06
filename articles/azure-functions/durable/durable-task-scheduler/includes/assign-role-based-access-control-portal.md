---
ms.service: azure-functions
ms.topic: include
ms.date: 03/17/2025
---

> [!NOTE] 
> The following instruction shows a role assignment scoped to a specific task hub. If you need access to *all* task hubs in a scheduler, perform the assignment on the scheduler level. 

1. [Create a user-assigned managed identity](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 

1. Navigate to the durable task scheduler resource on the portal. 

1. Click on a task hub name.

1. In the left menu, select **Access control (IAM)**.

1. Click **Add** to add a role assignment.

    :::image type="content" source="../media/configure-durable-task-scheduler/add-assignment.png" alt-text="Screenshot of the adding the role assignment on the Access Control pane in the portal.":::

1. Search for and select **Durable Task Data Contributor**. Click **Next**.

    :::image type="content" source="../media/configure-durable-task-scheduler/data-contributor-role.png" alt-text="Screenshot of selecting the Durable Task Data Contributor role assignment in the portal.":::

1. On the **Members** tab, for **Assign access to**, select **Managed identity**.

1. For **Members**, click **+ Select members**.

1. In the **Select managed identities** pane, expand the **Managed identity** drop-down and select **User-assigned managed identity**.

    :::image type="content" source="../media/configure-durable-task-scheduler/members-tab.png" alt-text="Screenshot of selecting the user-assigned managed identity type you're going to use in the portal.":::

1. Pick the user-managed identity previously created and click the **Select** button.

1. Click **Review + assign** to finish assigning the role. 