---
title: Deploy business process and tracking profile to Azure
description: Deploy your business process and tracking profile to Standard logic app resources in Azure Logic Apps.
ms.service: azure-business-process-tracking
ms.topic: how-to
ms.reviewer: estfan, azla
ms.date: 06/07/2024
# CustomerIntent: As an integration developer, I want to deploy previously created business processes and tracking profiles to deployed Standard logic app resources so I can capture and track key business data moving through my deployed resources.
---

# Deploy a business process and tracking profile to Azure (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

After you map your business process stages to the operations and outputs in Standard logic app workflows, you're ready to deploy your business process and tracking profile to Azure.

## Prerequisites

- Access to the Azure account and subscription associated with the **Business process** resource that you want to deploy.

- The **Business process** resource that you want to deploy.

  Deployment requires all [business process stages must have mappings to the operations and outputs in the corresponding Standard logic app workflows](map-business-process-workflow.md).

- Access to the Standard logic apps and workflows that are mapped to stages in your business process.

  This access is required because deployment creates and adds a tracking profile to each logic app resource that participates in the business process.

- The Azure Data Explorer database associated with your business process must be online.

  Deployment uses the database table that you selected during business process creation to store recorded data from the workflow run.

<a name="deploy-business-process-tracking"></a>

## Deploy business process and tracking profile

1. In the [Azure portal](https://portal.azure.com), open your business process in the editor, if not already open.

1. Before you deploy, make sure that you're ready for all participating Standard logic app workflows to restart when deployment begins.

1. On the process editor toolbar, select **Deploy**.

   :::image type="content" source="media/deploy-business-process/deploy.png" alt-text="Screenshot shows Azure portal, business process, and process designer toolbar with Deploy selected." lightbox="media/deploy-business-process/deploy.png":::

   Azure shows a notification based on whether the deployment succeeds.

1. On the business process menu, select **Overview**.

   Your business process now appears with a checkmark in the **Deployed** column.

   :::image type="content" source="media/deploy-business-process/deployed-business-process.png" alt-text="Screenshot shows business processes page with deployed business process." lightbox="media/deploy-business-process/deployed-business-process.png":::

<a name="view-transactions"></a>

## View recorded transactions

After the mapped Standard logic app workflows run and emit the data that you specified for collection, you can view the recorded transactions.

1. In the [Azure portal](https://portal.azure.com), open your business process.

1. On the business process menu, under **Business process tracking**, select **Transactions**.

   The **Transactions** page shows any records that your solution recorded.

   :::image type="content" source="media/deploy-business-process/view-transactions.png" alt-text="Screenshot shows Transaction page for a selected business process." lightbox="media/deploy-business-process/view-transactions.png":::

1. To review the details for a specific transaction, select the transaction ID.

   The **Transaction details** pane shows the status information for the entire business process, for example:

   :::image type="content" source="media/deploy-business-process/process-status.png" alt-text="Screenshot shows Transactions page and status for entire business process." lightbox="media/deploy-business-process/process-status.png":::

1. To review the status for a specific stage, on the **Transaction details** pane, select that stage, for example, **Complete_work_order**.

   The **Transaction details** pane now shows the values for the transaction ID and any tracked properties for the selected stage, for example:

   :::image type="content" source="media/deploy-business-process/transaction-details.png" alt-text="Screenshot shows transactions page and transaction details for a specific stage." lightbox="media/deploy-business-process/transaction-details.png":::

1. To create custom experiences for the data provided here, check out [Azure Workbooks](../azure-monitor/visualize/workbooks-overview.md) or [Azure Data Explorer with Power BI](/azure/data-explorer/power-bi-data-connector?tabs=web-ui).

## Next step

> [!div class="nextstepaction"]
> [Manage business processes](manage-business-process.md)
