---
title: Monitor and track B2B transactions - Standard workflows
description: Set up monitoring and tracking for B2B transactions or messages in Standard workflows for Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.topic: how-to
ms.reviewer: estfan, divswa, pravagar, azla
ms.date: 03/20/2025
# As a B2B integration solutions developer, I want to learn how to monitor and track B2B transactions in my Standard workflows created with Azure Logic Apps.
---

# Monitor and track B2B transactions in Standard workflows for Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To make sure that business operations run smoothly, maintain compliance, and troubleshoot problems in B2B enterprise integration scenarios, you need to accurately and reliably track B2B transactions that flow through your integration solutions. If you have Standard logic app workflows that work with X12, EDIFACT, or AS2 transactions, you have access to robust tracking capabilities that help you monitor B2B exchanges effectively.

With a Premium-level integration account, you can set up B2B tracking for Standard workflows using Azure Data Explorer. This capability accurately tracks all B2B transactions by having Azure Data Explorer store every transaction in a cluster and database, which provide lossless tracking along with visualization and querying capabilities.

For example, you get a tracking dashboard so you that can efficiently monitor, search, and analyze B2B transactions. For more detailed analysis, you can create advanced queries in your cluster database. With tracking data stored in Azure Data Explorer, you can extend Microsoft Power BI dashboards or build custom dashboards with your data.

:::image type="content" source="media/monitor-track-b2b-transactions/dashboard-example-overview.png" alt-text="Screenshot shows Azure portal, Premium integration account, and B2B tracking dashboard.":::

This guide provides a short overview about how B2B tracking works, how to set up this capability for your Standard logic app resource and workflows, and how to open the tracking dashboard.

## Limitations and known issues

- In this preview release, tracking currently handles only X12 and AS2 transactions.

## How does B2B tracking work

The following table describes how various components work together to support B2B tracking:

| Component | Task |
|-----------|------|
| Tracking data generation and event collection | When a B2B transaction occurs, the **X12**, **EDIFACT**, and **AS2** built-in operations in Standard workflows generate tracking data. |
| Data ingestion | The generated tracking data gets directly pushed transactionally through your integration account to an Azure Data Explorer cluster and database, which provides lossless and reliable storage. |
| Structured storage | Azure Data Explorer provides fast indexing and querying capabilities, which you use to effectively filter, search, and analyze transactions. |
| Tracking dashboard | This dedicated B2B monitoring dashboard visualizes transaction flow, which helps you track acknowledgments such as MDN and 997, detect failures, and troubleshoot problems in real time. |

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- A Premium-level integration account. If you don't have this integration account, see [Create and manage integration accounts for B2B workflows in Azure Logic Apps](/azure/logic-apps/enterprise-integration/create-integration-account).

- A Standard workflow that uses AS2 or X12 built-in actions

  Currently, B2B tracking supports only transactions processed by these actions.

- An Azure Data Explorer cluster and database to store transaction logs and tracking data.

  If you don't have an existing cluster and database, see [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database) and [What is Azure Data Explorer](/azure/data-explorer/data-explorer-overview).

## Set up B2B tracking

For this task, you need to create a tracking store in your integration account. An integration account currently supports only one default tracking store.

### Create a tracking store for your integration account

1. In the [Azure portal](https://portal.azure.com), open your Premium-level integration account.

1. On the integration account menu, under **Settings**, select **Tracking stores**.

1. On the toolbar, select **Add**. On the **Add tracking store** pane, provide the following information:

   | Property | Value |
   |----------|-------|
   | **Subscription** | The Azure subscription for your Azure Data Explorer cluster. |
   | **Azure Data Explorer** | The cluster name in Azure Data Explorer. |
   | **Database** | The cluster database name. |

   For example:

   :::image type="content" source="media/monitor-track-b2b-transactions/add-tracking-store.png" alt-text="Screenshot shows Azure portal, Premium integration account menu with selected item named Tracking stores, toolbar with selected option for Add, and open pane for Add tracking store.":::

1. When you're done, select **OK**.

### Disable or enable B2B tracking at the agreement level

If you have existing agreements between trading partners in your integration account, you can disable or reenable tracking for each agreement. By default, tracking is enabled for agreements. Currently, you can disable or reenable tracking for an agreement only through JSON view.

1. In the [Azure portal](https://portal.azure.com), open your Premium-level integration account.

1. On the integration account menu, under **Settings**, select **Agreements**. Select an agreement.

1. On the **Agreements** page toolbar, select **Edit as JSON**.

1. In the agreement, find the **`sendAgreement`** and **`receiveAgreement`** objects.

1. To disable tracking, change **`trackingState`** to **`Disabled`**. To reenable tracking, change **`trackingState`** to  or **`Enabled`**.

For more information, see the following documentation:

- [Add agreements between partners in integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-agreements)
- [Add trading partners to integration accounts](/azure/logic-apps/logic-apps-enterprise-integration-partners)

### Troubleshoot tracking setup problems

For tracking to work correctly, make sure that all the following conditions are met:

- A tracking store exists in your integration account.
- In an agreement, the **`trackingState`** attribute is set to **`Enabled`**.

## Open the tracking dashboard

1. Before you use the tracking dashboard, make sure that your workflow runs some X12, EDIFACT, or AS2 built-in actions so that the tracking store contains data.

1. On your integration account menu, under **Monitoring**, select **B2B tracking**, which opens the dashboard.

   By default, the **Overview** tab is selected and shows a high-level summary with graphs for all supported message types, message statuses, partners with the most errors, and a message summary for each partner.

   | Tab | Description |
   |-----|-------------|
   | **Overview** | View a high-level summary for all supported message types. |
   | **AS2** | View the details for all collected AS2 transactions. |
   | **X12** | View the details for all collected X12 transactions. |

   For example:

   :::image type="content" source="media/monitor-track-b2b-transactions/dashboard-example-overview.png" alt-text="Screenshot shows Azure portal, Premium integration account, B2B tracking dashboard, and selected Overview tab.":::

1. To change the dashboard's time interval from the default value, from the **TimeRange** list, select the interval you want.

1. To view the details for the collected messages, select the **AS2** or **X12** tab.

   The selected tab shows the collected messages along with their properties and values.

   The following example shows the available details for collected X12 messages:

   :::image type="content" source="media/monitor-track-b2b-transactions/example-x12-message-details.png" alt-text="Screenshot shows Premium integration account with B2B tracking selected, and a table with details about collected X12 messages.":::

## Database tables

In your Azure Data Explorer cluster, the database stores transaction data in a table-structured format. This table structure provides the capability for you to efficiently query and retrieve B2B tracking data, provide structured insights into message flow, processing status, and troubleshoot problems.

- The table named **AS2TrackRecords** stores AS2 transactions.
- The table named **EdiTrackRecords** stores X12 and EDIFACT transactions.

> [!NOTE]
>
> To [create a tracking store](#manage-with-rest-api) using the Azure Logic Apps REST API, 
> you must first manually create two tables named **AS2TrackRecords** and **EdiTrackRecords** 
> in your Azure Data Explorer database using specific [JSON schemas for tracking B2B transactions](tracking-schemas-standard.md). 
> Your database must also grant **Ingester** permissions to your integration account resource.

<a name="manage-with-rest-api"></a>

## Manage tracking stores with the REST API

You can use the Azure Logic Apps REST API to programmatically create, update, delete, and retrieve your tracking store.

### Create or update a tracking store

Create a tracking store or update an existing one.

> [!NOTE]
>
> In this release, your integration account currently supports only one tracking store.
> Before you create a tracking store using the Azure Logic Apps REST API, you must first 
> manually create the two tables named **AS2TrackRecords** and **EdiTrackRecords** in your 
> Azure Data Explorer database using specific [JSON schemas for tracking B2B transactions](tracking-schemas-standard.md). 
> Your database must also grant **Ingester** permissions to your integration account resource.

`PUT https://management.azure.com/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Logic/integrationAccounts/{integration-account-name}/groups/default/trackingstores/{tracking-store-name}?api-version=2016-06-01`

**Request body**

```json
{ 
  "properties": {
    "adxClusterUri": "https://{cluster-name}.kusto.windows.net",
    "databaseName": "{database-name}"
  }
}
```

| Parameter | Description |
|-----------|-------------|
| **{subscription-ID}** | The ID for the Azure subscription associated with your integration account. |
| **{resource-group-name}** | The name for the resource group where your integration account exists. |
| **{integration-account-name}** | The name for your integration account. |
| **{tracking-store-name}** | The name for the tracking store. |
| **{cluster-name}** | The name for your cluster in Azure Data Explorer. |
| **{database-name}** | The name for the database in your Azure Data Explorer cluster. |

#### Response

Return the details for the created or updated tracking store.

### Get a specific tracking store

Get the details about a specific tracking store.

`GET https://management.azure.com/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Logic/integrationAccounts/{integration-account-name}/groups/default/trackingstores/{tracking-store-name}?api-version=2016-06-01`

Parameters: 

| Parameter | Description |
|-----------|-------------|
| **{subscription-ID}** | The ID for the Azure subscription associated with your integration account. |
| **{resource-group-name}** | The name for the resource group where your integration account exists. |
| **{integration-account-name}** | The name for your integration account. |
| **{tracking-store-name}** | The name for the tracking store. |

#### Response

Return the details about the specified tracking store.

### Get all tracking stores

Get all the tracking stores in your integration account.

> [!NOTE]
>
> In this release, your integration account currently supports only one tracking store.

`GET https://management.azure.com/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Logic/integrationAccounts/{integration-account-name}/groups/default/trackingstores?api-version=2016-06-01`

| Parameter | Description |
|-----------|-------------|
| **{subscription-ID}** | The ID for the Azure subscription associated with your integration account. |
| **{resource-group-name}** | The name for the resource group where your integration account exists. |
| **{integration-account-name}** | The name for your integration account. |

#### Response

Return a list of tracking stores associated with your integration account.

### Delete a tracking store

Delete an existing tracking store from your integration account.

`DELETE https://management.azure.com/subscriptions/{subscription-ID}/resourceGroups/{resource-group-name}/providers/Microsoft.Logic/integrationAccounts/{integration-account-name}/groups/default/trackingstores/{tracking-store-name}?api-version=2016-06-01`

| Parameter | Description |
|-----------|-------------|
| **{subscription-ID}** | The ID for the Azure subscription associated with your integration account. |
| **{resource-group-name}** | The name for the resource group where your integration account exists. |
| **{integration-account-name}** | The name for your integration account. |
| **{tracking-store-name}** | The name for the tracking store. |

#### Response

Return a success response for a successfully deleted tracking store.

## Related content

- [Schemas for tracking B2B transactions - Standard workflows](tracking-schemas-standard.md)
