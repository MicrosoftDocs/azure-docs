---
ms.service: azure-functions
ms.topic: include
ms.date: 02/25/2025
ms.author: jiayma
ms.reviewer: azfuncdf
author: lilyjma
---

1. Navigate to the Function app creation blade and select **Functions Premium** or **App Service** as a hosting option.

   :::image type="content" source="../media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

1. In the **Create Function App (App Service)** blade, fill in the information in the **Basics** tab. 

   :::image type="content" source="../media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

1. Fill out other tabs as needed, then select the **Durable Functions** tab. Choose **Durable Task Scheduler** as the backend provider for your Durable Functions. Note that in addition to a scheduler resource, a task hub will be created.

   :::image type="content" source="../media/create-durable-task-scheduler/durable-func-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

   > [!NOTE]
   > It is recommended that the [region chosen for your Durable Task Scheduler](../durable-task-scheduler.md#supported-regions) matches the region chosen for your Function App. 

1. Click **Review + create** to review the resource creation. Since [DTS supports only identity-based authentication](), a user-assigned managed identity with the required RBAC role will be created automatically so that the Function app can access DTS. You can find the information related to the managed identity resource in the summary view:
   - The RBAC assigned to it (*Durable Task Data Contributor*) 
   - The assignment scope (on the task hub level):

   :::image type="content" source="../media/create-durable-task-scheduler/func-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

1. Click **Create** once validation passes. 
