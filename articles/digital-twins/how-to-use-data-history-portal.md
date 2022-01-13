---
# Mandatory fields.
title: Use data history feature (portal)
titleSuffix: Azure Digital Twins
description: See how to set up and use data history for Azure Digital Twins, using the Azure portal.
author: baanders
ms.author: baanders # Microsoft employees only
ms.date: 1/13/2022
ms.topic: how-to
ms.service: digital-twins

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.reviewer: MSFT-alias-of-reviewer
# manager: MSFT-alias-of-manager-or-PM-counterpart
---

# Use Azure Digital Twins data history (portal)

[!INCLUDE [digital-twins-data-history-selector.md](../../includes/digital-twins-data-history-selector.md)]

[Data history](concepts-data-history.md) is an Azure Digital Twins feature for automatically historizing twin data to [Azure Data Explorer](/azure/data-explorer/data-explorer-overview). This data can be queried using the [Azure Digital Twins query plugin for Azure Data Explorer](concepts-data-explorer-plugin.md) to gain insights about your environment over time.

This article shows how to set up a working data history connection between Azure Digital Twins and Azure Data Explorer. It uses the [Azure portal](https://portal.azure.com) to set up and connect the required data history resources, including:
* an Azure Digital Twins instance
* an [Event Hubs](../event-hubs/event-hubs-about.md) namespace containing an Event Hub
* an Azure Data Explorer cluster containing a database

It also contains a sample twin graph and telemetry scenario that you can use to see the historized twin updates in Azure Data Explorer. 

## Prerequisites

This article requires an active **Azure Digital Twins instance**. For instructions on how to set up an instance, see [Set up an Azure Digital Twins instance and authentication](./how-to-set-up-instance-portal.md).

## Create an Event Hubs namespace and Event Hub

The first step in setting up a data history connection is creating an Event Hubs namespace and an event hub. This hub will be used to receive digital twin property update notifications from Azure Digital Twins, and forward the messages along to the target Azure Data Explorer cluster. For more information about Event Hubs and their capabilities, see the [Event Hubs documentation](../event-hubs/event-hubs-about.md).

Follow the instructions in [Create an event hub using Azure portal](../event-hubs/event-hubs-create.md) to create an **Event Hubs namespace** and an **event hub**. (The article also contains instructions on how to create a new resource group. You can create a new resource group for the Event Hubs resources, or skip that step and use an existing resource group for your new Event Hubs resources.)

Remember the names you give to these resources so you can use them later.

## Create a Kusto (Azure Data Explorer) cluster and database

Next, create a Kusto (Azure Data Explorer) cluster and database to receive the data from Azure Digital Twins.

Follow the instructions in [Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-database-portal?tabs=one-click-create-database) to create an **Azure Data Explorer cluster**  and a **database** in the cluster.

Remember the names you give to these resources so you can use them later.

## Create a data history connection

Now that you've created the required resources, you can create a data history connection between the Azure Digital Twins instance, the Event Hub, and the Azure Data Explorer cluster. 

Start by navigating to your instance in the Azure portal (you can find the instance by entering its name into the portal search bar). Then complete the following steps.

1. Select **Data history** from the Connect Output section of the instance's menu.
    :::image type="content"  source="media/how-to-use-data-history/portal/select-data-history.png" alt-text="Screenshot of the Azure portal showing the data history option in the menu for an Azure Digital Twins instance." lightbox="media/how-to-use-data-history/portal/select-data-history.png":::

    Select **Create a connection**. This will begin the process of creating a data history connection.

2. If you **don't** have a [managed identity enabled for your Azure Digital Twins instance](how-to-route-with-managed-identity.md), you'll be asked to turn on Identity for the instance as the first step for the data history connection.
    :::image type="content"  source="media/how-to-use-data-history/portal/authenticate.png" alt-text="Screenshot of the Azure portal showing the first step in the data history connection setup, Authenticate." lightbox="media/how-to-use-data-history/portal/authenticate.png":::

    If you **do** have a managed identity enabled, your setup will go straight to the next page as the first step.

3. On the **Send** page, enter the details of the [Event Hubs resources](#create-an-event-hubs-namespace-and-event-hub) that you created earlier.
    :::image type="content"  source="media/how-to-use-data-history/portal/send.png" alt-text="Screenshot of the Azure portal showing the Send step in the data history connection setup." lightbox="media/how-to-use-data-history/portal/send.png":::

    If you have sufficient [permissions](#prerequisites) in your subscription to allow your instance to connect to the event hub, select the **Grant permission** box shown at the bottom of the page. If you don't have the required permissions, you'll see a warning instead suggesting you ask your administrator for the permissions.

    Select **Next**.

4. Next, on the **Store** page, enter the details of the [Azure Data Explorer resources](#create-a-kusto-azure-data-explorer-cluster-and-database) that you created earlier.
    :::image type="content"  source="media/how-to-use-data-history/portal/store.png" alt-text="Screenshot of the Azure portal showing the Store step in the data history connection setup." lightbox="media/how-to-use-data-history/portal/store.png":::

    If you have sufficient [permissions](#prerequisites) in your subscription to allow your instance to connect to the cluster, select the **Grant permission** box shown at the bottom of the page. If you don't have the required permissions, you'll see a warning instead suggesting you ask your administrator for the permissions.

    Select **Create connection**.

5. On the **Review + create** page, review the details of your resources and select **Create connection**.
    :::image type="content"  source="media/how-to-use-data-history/portal/review-create.png" alt-text="Screenshot of the Azure portal showing the Review and Create step in the data history connection setup." lightbox="media/how-to-use-data-history/portal/review-create.png":::

When the connection is finished creating, you'll see the **Data history details** page with a confirmation that you've successfully established a connection with Azure Data Explorer.

:::image type="content"  source="media/how-to-use-data-history/portal/data-history-details.png" alt-text="Screenshot of the Azure portal showing the Data History Details page after setting up a connection." lightbox="media/how-to-use-data-history/portal/data-history-details.png":::

>[!NOTE]
>Once the connection is set up, the default settings on your Azure Data Explorer cluster will result in an ingestion latency of approximately 10 minutes or less. You can reduce this latency by enabling [streaming ingestion](/azure/data-explorer/ingest-data-streaming) (less than 10 seconds of latency) or an [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). For more information about Azure Data Explorer ingestion latency, see [End-to-end ingestion latency](concepts-data-history.md#end-to-end-ingestion-latency).

[!INCLUDE [digital-twins-data-history-test.md](../../includes/digital-twins-data-history-test.md)]

## Next steps

After historizing twin data to Azure Data Explorer, you can continue to query the data using the Azure Digital Twins query plugin for Azure Data Explorer. Read more about the plugin here: [Querying with the ADX plugin](concepts-data-explorer-plugin.md).