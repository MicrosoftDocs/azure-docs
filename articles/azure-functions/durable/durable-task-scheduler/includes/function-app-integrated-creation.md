---
ms.service: azure-functions
ms.subservice: durable-task-scheduler
ms.topic: include
ms.date: 03/19/2025
---

1. Navigate to the Function app creation blade. 

   :::image type="content" source="../media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps.":::

1. In the **Create Function App (Flex Consumption)** blade, fill in the information in the **Basics** tab. 

   :::image type="content" source="../media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating a Flex Consumption plan Function app.":::

   | Field | Description | 
   | ----- | ----------- | 
   | Subscription | Select your Azure subscription. | 
   | Resource Group | Select an existing resource group or click **Create new** to create a new one. | 
   | Function App name | Create a unique name for your function app. | 
   | Do you want to deploy code or container image? | Keep the **Code** option selected. | 
   | Region | Select [one of the supported regions](../durable-task-scheduler.md#limitations-and-considerations). | 
   | Runtime stack | Select the runtime you're using for this quickstart. | 
   | Version | Select your runtime stack version. | 
   | Instance size | Select an instance size, or use the default selection. [Learn more about instance sizes.](../../../flex-consumption-plan.md#instance-sizes) | 
   | Zone Redundancy | Leave as the default **Disabled** setting. | 

1. Select the **Durable Functions** tab. 

1. Choose **Azure managed: Durable Task Scheduler** as the backend provider for your Durable Functions. 

1. Create a scheduler resource. This action automatically creates a task hub.

   :::image type="content" source="../media/create-durable-task-scheduler/durable-functions-tab.png" alt-text="Screenshot of creating a Flex Consumption Function app.":::

   | Field | Description | 
   | ----- | ----------- | 
   | Storage backend | Select **Azure managed: Durable Task Scheduler**. | 
   | Region | Make sure the scheduler and function app regions are the same. | 
   | Durable Task Scheduler | Use the scheduler name offered, or click **Create new** to create a custom name. | 
   | Plan | Select the [pricing plan](../durable-task-scheduler-dedicated-sku.md) that fits your project best. Check the [Choosing an orchestration framework](../choose-orchestration-framework.md) guide to determine which plan is best for production use. | 
   | Capacity units | Only applicable when "Dedicated" pricing plan is selected. You can select up to 3 Capacity Units. | 

1. Click **Review + create** to review the resource creation. 

   A user-assigned managed identity with the required role-based access control (RBAC) permission is created automatically and added to the Function app. You can find in the summary view information related to the managed identity resource, such as:
   - The role assigned to it (*Durable Task Data Contributor*) 
   - The assignment scoped to the task hub level

       :::image type="content" source="../media/create-durable-task-scheduler/functions-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

1. Click **Create** once validation passes. 
