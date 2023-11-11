---
title: Deploy business process and tracking profile to Azure
description: Deploy your business process and tracking profile for an application group in an integration environment to Standard logic apps in Azure.
ms.service: azure
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As an integration developer, I want to deploy previously created business processes and tracking profiles to deployed Standard logic app resources so I can capture and track key business data moving through my deployed resources.
---

# Deploy a business process and tracking profile to Azure (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you define the key business property values to capture for tracking and map your business process stages to the operations and data in Standard logic app workflows, you're ready to deploy your business process and tracking profile to Azure.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- An [integration environment](create-integration-environment.md) that contains an [application group](create-application-group.md), which has at least the [Standard logic app resources, workflows, and operations](../logic-apps/create-single-tenant-workflows-azure-portal.md) that you mapped to your business process stages

  Before you can deploy your business process, you must have access to the Standard logic app resources and workflows that are used in the mappings. This access is required because deployment creates and adds a tracking profile to each logic app resource that participates in the business process.
 
- A [business process](create-business-process.md) with [stages mapped to actual operations and property values in a Standard logic app workflow](map-business-process-workflow.md)

- The Azure Data Explorer database associated with your application group must be online.

  Deployment creates or uses a table with your business process name in your instance's database to add and store the data captured from the workflow run. Deployment also causes all the participating Standard logic app resources to automatically restart.

<a name="deploy-business-process-tracking"></a>

## Deploy business process and tracking profile

1. In the [Azure portal](https://portal.azure.com), open your integration environment, application group, and business process that you want to deploy, if they're not already open.

1. On the process designer toolbar, select **Deploy**.

   :::image type="content" source="media/deploy-business-process/deploy.png" alt-text="Screenshot shows Azure portal, business process, and process designer toolbar with Deploy selected." lightbox="media/deploy-business-process/deploy.png":::

   In the **Deploy business process** section, the **Cluster** and **Database** properties show prepopulated values for the Azure Data Explorer instance associated with your application group.

   :::image type="content" source="media/deploy-business-process/check-deployment-info.png" alt-text="Screenshot shows business process deployment information." lightbox="media/deploy-business-process/check-deployment-info.png":::

1. For the **Table** property, choose either of the following options:

   - Keep and use the prepopulated name for your business process to create a table in your database.

   - Provide the name for an existing table in your database, and select **Use an existing table**.
   
   > [!IMPORTANT]
   >
   > If you want each business process to have its own table for security reasons, provide a 
   > unique name to create a new and separate table. This practice helps you avoid mixing 
   > sensitive data with non-sensitive data and is useful for redeployment scenarios.

1. When you're ready, select **Deploy**.

   Azure shows a notification based on whether the deployment succeeds.

1. Return to the **Business processes** page, which now shows the business process with a checkmark in the **Deployed** column.

   :::image type="content" source="media/deploy-business-process/deployed-business-process.png" alt-text="Screenshot shows business processes page with deployed business process." lightbox="media/deploy-business-process/deployed-business-process.png":::

<a name="view-transactions"></a>

## View recorded transactions

After the associated Standard logic app workflows run and emit the data that you specified to capture, you can view the recorded transactions.

1. On the **Business processes** page, next to the business process with the transactions that you want, select **View transactions** (table with magnifying glass).

   :::image type="content" source="media/deploy-business-process/view-transactions.png" alt-text="Screenshot shows business processes page, business process, and selected option for View transactions." lightbox="media/deploy-business-process/view-transactions.png":::

   The **Transactions** page shows any records that your solution tracked. 

   :::image type="content" source="media/deploy-business-process/transactions-page.png" alt-text="Screenshot shows transactions page for business processes." lightbox="media/deploy-business-process/transactions-page.png":::

1. Sort the records based on **Business identifier**, **Time executed**, or **Business process**. 

1. To review the status for your business process, on a specific transaction row, select the business identifier value.

   For a specific transaction, the **Transaction details** pane shows the status information for the entire business process, for example:

   :::image type="content" source="media/deploy-business-process/process-status.png" alt-text="Screenshot shows transactions page and process status for specific transaction." lightbox="media/deploy-business-process/process-status.png":::

1. To review the status for a specific stage, on the **Transaction details** pane, select that stage.

   The **Transaction details** pane now shows the tracked properties for the selected stage, for example:

   :::image type="content" source="media/deploy-business-process/transaction-details.png" alt-text="Screenshot shows transactions page and details for a specific stage." lightbox="media/deploy-business-process/transaction-details.png":::

1. To create custom experiences for the data provided here, check out [Azure Workbooks](../azure-monitor/visualize/workbooks-overview.md) or [Azure Data Explorer with Power BI](/azure/data-explorer/power-bi-data-connector?tabs=web-ui).

## Next steps

[What is Azure Integration Environments](overview.md)?
