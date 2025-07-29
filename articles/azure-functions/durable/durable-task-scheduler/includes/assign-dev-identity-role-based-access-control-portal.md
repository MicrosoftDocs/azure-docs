---
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.topic: include
ms.date: 04/11/2025
ms.author: hannahhunter
ms.reviewer: azfuncdf
author: hhunter-ms
---

> [!NOTE] 
> The following instruction shows a role assignment scoped to a specific task hub. If you need access to *all* task hubs in a scheduler, perform the assignment on the scheduler level. 

1. Navigate to the durable task scheduler resource on the portal. 

1. Click on a task hub name.

1. In the left menu, select **Access control (IAM)**.

1. Click **Add** to add a role assignment.

    :::image type="content" source="../media/configure-durable-task-scheduler/add-assignment.png" alt-text="Screenshot of the adding the role assignment on the Access Control pane in the portal.":::

1. Search for and select **Durable Task Data Contributor**. Click **Next**.

    :::image type="content" source="../media/configure-durable-task-scheduler/data-contributor-role.png" alt-text="Screenshot of selecting the Durable Task Data Contributor role assignment in the portal.":::

1. On the **Members** tab, for **Assign access to**, select **User, group, or service principal**.

1. For **Members**, click **+ Select members**.

1. In the **Select members** pane, search for your name or email: 

    :::image type="content" source="../media/configure-durable-task-scheduler/user-principal-tab.png" alt-text="Screenshot of selecting the user-assigned managed identity type in the portal.":::

1. Pick your email and click the **Select** button.

1. Click **Review + assign** to finish assigning the role. 

1. Once the role is assigned, click **Overview** on the left menu of the task hub resource and navigate to the dashboard URL located at the top *Essentials* section. 


