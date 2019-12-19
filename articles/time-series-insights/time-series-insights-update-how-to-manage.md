---
title: Provision and manage a Preview environment - Azure Time Series | Microsoft Docs
description: Learn how to provision and manage an Azure Time Series Insights Preview environment.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/19/2019
ms.custom: seodec18
---

# Provision and manage Azure Time Series Insights Preview

This article describes how to create and manage an Azure Time Series Insights Preview environment by using the [Azure portal](https://portal.azure.com/).

## Overview

Azure Time Series Insights Preview environments are *pay-as-you-go* (PAYG) environments.

When you provision an Azure Time Series Insights Preview environment, you create these Azure resources:

* An Azure Time Series Insights Preview environment  
* An Azure Storage general-purpose v1 account
* An optional warm store for faster and unlimited queries
  
Learn [how to plan your environment](./time-series-insights-update-plan.md).

Associate each Azure Time Series Insights Preview environment with an event source. For more information, read [Add an event hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md) and [Add an IoT hub source](./time-series-insights-how-to-add-an-event-source-iothub.md). You provide a Timestamp ID property and a unique consumer group during this step. Doing so ensures that the environment has access to the appropriate events.

> [!NOTE]
> The preceding step is optional in the provisioning workflow while you create the Time Series Preview environment. However, you must attach an event source to the environment so the data can start flowing in that environment.

After provisioning is complete, you can modify your access policies and other environment attributes to suit your business requirements.

## Create the environment

To create an Azure Time Series Insights Preview environment:

1. Select **PAYG** as the **Tier**. Provide an environment name, and choose the subscription group and resource group to use. Then select a supported location to host the environment.

   [![Create an Azure Time Series Insights instance.](media/v2-update-manage/create-and-manage-configuration.png)](media/v2-update-manage/create-and-manage-configuration.png#lightbox)

1. Enter a Time Series ID.

    > [!NOTE]
    > * The Time Series ID is case-sensitive and immutable. (It can't be changed after it's set.)
    > * Time Series IDs can be up to three keys.
    > * For more information about selecting a Time Series ID, read [Choose a Time Series ID](./time-series-insights-update-how-to-id.md).

1. Create an Azure storage account by selecting a storage account name and designating a replication choice. Doing so automatically creates an Azure Storage general-purpose v1 account. The account is created in the same region as the Azure Time Series Insights Preview environment that you previously selected.

    [![Cold storage configuration](media/v2-update-manage/create-and-manage-cold-store.png)](media/v2-update-manage/create-and-manage-cold-store.png#lightbox)

1. **(Optional)** Enable warm store for your environment if you want faster and unlimited queries over most recent data in your environment. You can also create or delete a warm store through the **Storage Configuration** option in the left navigation pane, after you create a Time Series Insights Preview environment.

    [![Warm storage configuration](media/v2-update-manage/create-and-manage-warm-storage.png)](media/v2-update-manage/create-and-manage-warm-storage.png#lightbox)

1. **(Optional)** You can add an event source now. Alternatively, you can wait until the instance has been provisioned.

   * Time Series Insights supports [Azure IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md) and [Azure Event Hubs](./time-series-insights-how-to-add-an-event-source-eventhub.md) as event source options. Although you can add only a single event source when you create the environment, you can add another event source later. 
   
     You can select an existing consumer group or create a new consumer group when you add the event source. It's best to create a unique consumer group to ensure that all events are visible to your Azure Time Series Insights Preview environment.

   * Choose the appropriate Timestamp property. By default, Azure Time Series Insights uses the message-enqueued time for each event source.

     > [!TIP]
     > The message-enqueued time might not be the best configured setting to use in batch event scenarios or historical data uploading scenarios. In such cases, make sure to verify your decision to use or not use a Timestamp property.

     [![Event Source configuration tab](media/v2-update-manage/create-and-manage-event-source.png)](media/v2-update-manage/create-and-manage-event-source.png#lightbox)

     > [!TIP]
     > Read about [How to choose a Time Series ID](time-series-insights-update-how-to-id.md).

1. Confirm that your environment has been provisioned and configured the way you want.

    [![Review + Create tab](media/v2-update-manage/create-and-manage-review-and-confirm.png)](media/v2-update-manage/create-and-manage-review-and-confirm.png#lightbox)

## Manage the environment

You can manage your Azure Time Series Insights Preview environment by using the Azure portal. When you manage through the Azure portal, you see a few key differences between a PAYG Azure Time Series Insights Preview environment and the generally available S1 or S2 environments:

* The Azure portal Preview **Overview**  blade has the following changes:

  * Capacity is removed because it doesn't apply to PAYG environments.
  * The **Time series ID** property is added. It determines how your data is partitioned.
  * Reference data sets are removed.
  * The displayed URL directs you to the [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
  * Your Azure storage account name is listed.

* The Azure portal's **Configure** blade is removed in Azure Time Series Insights Preview because PAYG environments aren't configurable. However, you can use **Storage Configuration** to configure the newly introduced warm store.

* The Azure portal's **Reference data** blade is removed in Azure Time Series Insights Preview because reference data isn't part of PAYG environments.

[![Time Series Insights Preview environment in the Azure portal](media/v2-update-manage/create-and-manage-overview-confirm.png)](media/v2-update-manage/create-and-manage-overview-confirm.png#lightbox)

## Next steps

- Learn more about Time Series Insights generally available environments and preview environments by reading [Plan your environment](./time-series-insights-update-plan.md).

- Learn how to [Add an event hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md).

- Configure an [IoT hub source](./time-series-insights-how-to-add-an-event-source-iothub.md).
