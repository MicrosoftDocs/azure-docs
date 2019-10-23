---
title: Provision and manage Azure Time Series Preview | Microsoft Docs
description: Understanding how to provision and manage Azure Time Series Insights Preview.
author: deepakpalled
ms.author: dpalled
manager: cshankar
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 10/23/2019
ms.custom: seodec18
---

# Provision and manage Azure Time Series Insights Preview

This article describes how to create and manage an Azure Time Series Insights Preview environment by using the [Azure portal](https://portal.azure.com/).

## Overview

Azure Time Series Insights Preview environments are pay-as-you-go (PAYG) environments.

When you provision an Azure Time Series Insights Preview environment, you create two Azure resources:

* An Azure Time Series Insights Preview environment  
* An Azure Storage general-purpose v1 account
* An optional warm store for faster and unlimited queries
  
Learn [how to plan your environment](./time-series-insights-update-plan.md).

Associate each Azure Time Series Insights Preview environment with an event source. For more information, read [Add an event hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md) and [Add an IoT hub source](./time-series-insights-how-to-add-an-event-source-iothub.md). You will need to provide a Timestamp ID property and a unique consumer group during this step. Doing so ensures that the environment has access to the appropriate events.

Please note that the step above is optional in the provisioning workflow while you create the Time Series Preview environment, however it is mandatory to attach an event source to the environment for the data to start flowing in that environment.

After provisioning is complete, you can modify your access policies and other environment attributes to suit your business requirements.

## Create the environment

The following steps describe how to create an Azure Time Series Insights Preview environment:

1. Select the **PAYG** button under the **SKU** menu. Supply an environment name, and choose the subscription group and resource group to use. Then, select a supported location for the environment to be hosted in.

   [![Create an Azure Time Series Insights instance.](media/v2-update-manage/manage-three.png)](media/v2-update-manage/manage-three.png#lightbox)

1. Enter a Time Series ID.

    >[!NOTE]
    > * The Time Series ID is case-sensitive and immutable. (It can't be changed after it's set.)
    > * Time Series IDs can be up to three keys.
    > * For more information about selecting a Time Series ID, read [Choose a Time Series ID](./time-series-insights-update-how-to-id.md).

1. Create an Azure storage account by selecting a storage account name and designating a replication choice. Doing so automatically creates an Azure Storage general-purpose v1 account. It will be created in the same region as the Azure Time Series Insights Preview environment that you previously selected.

    [![Create an Azure storage account for your instance](media/v2-update-manage/manage-five.png)](media/v2-update-manage/manage-five.png#lightbox)

1. **(Optional)** Enable warm store for your environment if you want faster and unlimited queries over most recent data in your environment. You can also create or delete a warm store through the **storage configuration** option in the left navigation pane, after you have created a Time Series Insights Preview environment.

1. **(Optional)** You can add an event source now (or wait until the instance has been provisioned).

   * Time Series Insights supports [Azure IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md) and [Azure Event Hubs](./time-series-insights-how-to-add-an-event-source-eventhub.md) as event source options. Although you can add only a single event source at environment creation time, you may add another event source afterwards. You can select an existing consumer group or create a new consumer group when adding the event source. It’s best to create a unique consumer group to ensure that all events are visible to your Azure Time Series Insights Preview environment.

   * You should also choose the appropriate Timestamp property. By default, Azure Time Series Insights uses the message enqueued time for each event source.

     > [!TIP]
     > The message enqueued time might not be the best configured setting to use in batch event or historical data uploading scenarios. Make sure to verify your decision to use or not use a Timestamp property in such cases.

     [![Event Source tab](media/v2-update-manage/manage-two.png)](media/v2-update-manage/manage-two.png#lightbox)

1. Confirm that your environment has been provisioned with the desired settings.

    [![Review + Create tab](media/v2-update-manage/manage-three.png)](media/v2-update-manage/manage-three.png#lightbox)

## Manage the environment

You can manage your Azure Time Series Insights Preview environment by using the Azure portal. There are a few key differences between managing a PAYG Azure Time Series Insights Preview environment and GA S1 or S2 environments when doing so:

* The Azure portal's **Overview** blade is unchanged in Azure Time Series Insights, except in the following ways:
  * Capacity is removed since it does not apply to PAYG environments.
  * The Time Series ID property has been added. It determines how your data is partitioned.
  * Reference data sets are removed.
  * The displayed URL directs you to the [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
  * Your Azure storage account name is listed.

* The Azure portal's **Configure** blade has been removed in Azure Time Series Insights Preview because PAYG environments are not configurable. However, **Storage Configuration** has been introduced to configure newly introduced warm store.

* The Azure portal's **Reference data** blade has been removed in Azure Time Series Insights Preview because reference data is not a component of PAYG environments.

[![Time Series Insights Preview environment in the Azure portal](media/v2-update-manage/manage-four.png)](media/v2-update-manage/manage-four.png#lightbox)

## Next steps

- Learn more about GA and Preview environments by reading [Plan your environment](./time-series-insights-update-plan.md).

- Learn how to [Add an event hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md).

- Configure [an IoT hub source](./time-series-insights-how-to-add-an-event-source-iothub.md).