---
title: Deploy business process and tracking profile to Azure
description: Deploy your business process and tracking profile to Standard logic app resources in Azure Logic Apps.
ms.service: logic-apps
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As an integration developer, I want to deploy previously created business processes and tracking profiles to deployed Standard logic app resources so I can capture and track key business data moving through my deployed resources.
---

# Deploy a business process and tracking profile to Azure (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you map your business process stages to the operations and outputs in Standard logic app workflows, you're ready to deploy your business process and tracking profile to Azure.

## Prerequisites

- An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Access to the Standard logic app resources and workflows that are mapped to your business process. This access is required because deployment creates and adds a tracking profile to each logic app resource that participates in the business process.

- A [business process](create-business-process.md) with [stages mapped to actual operations and property values in a Standard logic app workflow](map-business-process-workflow.md)

- The Azure Data Explorer database that's associated with your business process must be online.

  Deployment uses the database table that you selected during business process creation to add and store the data captured from the workflow run. Deployment also causes all the participating Standard logic app resources to automatically restart.

<a name="deploy-business-process-tracking"></a>

## Deploy business process and tracking profile

1. In the [Azure portal](https://portal.azure.com), open your business process in the editor, if not already open.

1. On the process editor toolbar, select **Deploy**.

   :::image type="content" source="media/deploy-business-process/deploy.png" alt-text="Screenshot shows Azure portal, business process, and process designer toolbar with Deploy selected." lightbox="media/deploy-business-process/deploy.png":::

   Azure shows a notification based on whether the deployment succeeds.

1. On the business process menu, select **Overview**.

   Your business process now appears with a checkmark in the **Deployed** column.

   :::image type="content" source="media/deploy-business-process/deployed-business-process.png" alt-text="Screenshot shows business processes page with deployed business process." lightbox="media/deploy-business-process/deployed-business-process.png":::

<a name="view-transactions"></a>

## View recorded transactions

After the associated Standard logic app workflows run and emit the data that you specified to capture, you can view the recorded transactions.

1. In the [Azure portal](https://portal.azure.com), open your business process.

1. On the business process menu, under **Business process tracking**, select **Transactions**.

   :::image type="content" source="media/deploy-business-process/view-transactions.png" alt-text="Screenshot shows business processes page, business process, and selected option for View transactions." lightbox="media/deploy-business-process/view-transactions.png":::

1. Next to the business process with the transactions that you want, select **View transactions** (table with magnifying glass).

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

## Next step

> [!div class="nextstepaction"]
> [Manage business processes](manage-business-process.md)
