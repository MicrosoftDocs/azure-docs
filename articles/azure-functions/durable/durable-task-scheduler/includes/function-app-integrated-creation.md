---
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.topic: include
ms.date: 03/19/2025
---

1. Navigate to the Function app creation blade and select **Functions Premium** or **App Service** as a hosting option.

   :::image type="content" source="../media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

1. In the **Create Function App (App Service)** blade, fill in the information in the **Basics** tab. 

   :::image type="content" source="../media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

   | Field | Description | 
   | ----- | ----------- | 
   | Subscription | Select your Azure subscription. | 
   | Resource Group | Select an existing resource group or click **Create new** to create a new one. | 
   | Function App name | Create a unique name for your function app. | 
   | Do you want to deploy code or container image? | Keep the **Code** option selected. | 
   | Runtime stack | Select the runtime you're using for this quickstart. | 
   | Version | Select your runtime stack version. | 
   | Region | Select [one of the supported regions](../durable-task-scheduler.md#limitations-and-considerations). | 
   | Operating System | Select your operating system. | 

1. Select the **Durable Functions** tab. 

1. Choose **Durable Task Scheduler** as the backend provider for your durable functions. 

1. Create a scheduler resource. This action automatically creates a task hub.

   :::image type="content" source="../media/create-durable-task-scheduler/durable-functions-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

   | Field | Description | 
   | ----- | ----------- | 
   | Storage backend | Select **Durable Task Scheduler**. | 
   | Region | It's recommended that the scheduler and function app regions should be the same. | 
   | Durable task scheduler | Use the scheduler name offered, or click **Create new** to create a custom name. | 
   | Plan | Only **Dedicated** is available at the moment. | 
   | Capacity units | Currently, you can only choose one Capacity Unit as an option. | 

1. Click **Review + create** to review the resource creation. 

   A user-assigned managed identity with the required role-based access control (RBAC) permission is created automatically and added to the Function app. You can find in the summary view information related to the managed identity resource, such as:
   - The role assigned to it (*Durable Task Data Contributor*) 
   - The assignment scoped to the task hub level

       :::image type="content" source="../media/create-durable-task-scheduler/functions-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

1. Click **Create** once validation passes. 
