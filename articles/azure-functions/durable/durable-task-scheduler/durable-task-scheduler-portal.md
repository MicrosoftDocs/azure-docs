---
title: Create the Durable Task Scheduler (preview) using the Azure portal
description: Learn how to create the Durable Task Scheduler using the portal.
ms.topic: how-to
ms.date: 01/27/2025
---

# Create the Durable Task Scheduler (preview) using the Azure portal

TODO

You can create Durable Task Scheduler via the two following ways:
1. [Function app integrated creation](#function-app-integrated-creation)  
1. [Top-level creation](#top-level-creation) 

## Function app integrated creation

You can create a Durable Task Scheduler and a task hub as part of the existing Function app creation process in the Azure portal. 

> [!NOTE]
> This experience is only available with Functions hosted in the **App Service** plan. 

### Create a Function app

Navigate to the Function app creation blade and select **App Service** as a hosting option.

:::image type="content" source="media/create-durable-task-scheduler/function-app-hosted-app-service.png" alt-text="Screenshot of hosting options for Function apps and selecting App Service.":::

In the **Create Function App (App Service)** blade, [create the function app settings as specified in the Azure Functions documentation](../../functions-create-function-app-portal.md)

:::image type="content" source="media/create-durable-task-scheduler/function-app-basic-tab.png" alt-text="Screenshot of the Basic tab for creating an App Service plan Function app.":::

### Set Durable Task Scheduler as storage backend

After filling out the appropriate fields in the **Basic** and other necessary tabs, select the **Durable Functions** tab. Choose **Durable Task Scheduler** as your storage backend. 

:::image type="content" source="media/create-durable-task-scheduler/durable-func-tab.png" alt-text="Screenshot of creating an App Service plan Function app.":::

> [!NOTE]
> It is recommended that the region chosen for your Durable Task Scheduler matches the region chosen for your Function App. 

### Verify user-managed identity

Durable Task Scheduler supports only identity-based authentication. Once your function app is deployed, a user-managed identity resource with the necessary RBAC permission is automatically created. 

On the **Review + create** tab, you can find information related to the managed identity resource, such as:
- The RBAC assigned to it (*Durable Task Data Contributor*) 
- The scope of the assignment (on the scheduler level):

   :::image type="content" source="media/create-durable-task-scheduler/func-review-create-tab.png" alt-text="Screenshot of fields and properties chosen and in review on the Review + create tab.":::

## Top-level creation  

In the Azure portal, search for **Durable Task Scheduler** and select it from the results. 

:::image type="content" source="media/create-durable-task-scheduler/search-for-dts.png" alt-text="Screenshot of searching for Durable Task Scheduler in the portal.":::

Click **Create** to open the **Azure Functions: Durable Task Scheduler (preview)** pane.

:::image type="content" source="media/create-durable-task-scheduler/top-level-create-form.png" alt-text="Screenshot of the create page for the Durable Task Scheduler.":::

Fill out the fields in the **Basics** tab. Click **Review + create**. Once the validation passes, click **Create**. 

Deployment may take around 15 to 20 minutes. 

### Durable Task Scheduler endpoint and connection string

> [!NOTE] 
> Unlike when creating a Durable Task Scheduler as part of the Function app creation process, you need to manually create a managed identity with the proper RBAC access when following the top-level creation approach. 

Navigate to the **Overview** page of your Durable Task Scheduler resource. 

In the **Essentials** section, make note of the endpoint. 

You use this endpoint to construct the connection string for accessing the resource. The connection string varies depending on what kind of identity you're using, which depends on how you're running your app. 

#### If you're running your app locally 

For local development, the connection string looks like the following: 

`Endpoint=<Your Durable Task Scheduler endpoint>;Authentication=DefaultAzure`

For example, if the Durable Task Scheduler endpoint is `https://my-dts.westus.durabletask.io`, the connection string would be:

`Endpoint=https://my-dts.westus.durabletask.io;Authentication=DefaultAzure`

For local development, you need to give your developer identity the right permission to access the Durable Task Scheduler resource. See [Assign RBAC access to developer identity](./configure-durable-task-scheduler.md). 

#### If you're running your app on Azure

When running on Azure, you need to set up user-assigned managed identity or system-assigned managed identity to access the Durable Task Scheduler resource. See [Run the app on Azure](./configure-durable-task-scheduler.md). 

##### User-assigned managed identity

When using user-assigned managed identity, the connection string looks like the following: 

`Endpoint=<Your Durable Task Scheduler endpoint>;Authentication=ManagedIdentity;ClientID=<Managed identity ID>`

The `ClientID` is the ID of the managed identity resource with the proper RBAC access to the scheduler. 

For example, if the Durable Task Scheduler endpoint is `https://my-dts.westus.durabletask.io`, the connection string would be:

`Endpoint=https://my-dts.westus.durabletask.io;Authentication=ManagedIdentity;ClientID=<MANAGED-IDENTITY-ID>`

##### System-assigned managed identity

If you're using system-assigned managed identity, you can omit the `ClientID` in the connection string: 

`Endpoint=<Your Durable Task Scheduler endpoint>;Authentication=ManagedIdentity`

