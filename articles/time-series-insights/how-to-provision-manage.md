---
title: Provision and manage a Gen 2 environment - Azure Time Series | Microsoft Docs
description: Learn how to provision and manage an Azure Time Series Insights Gen 2 environment.
author: shipra1mishra 
ms.author: shmishr
manager: diviso
ms.workload: big-data
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 07/08/2020
ms.custom: seodec18
---

# Provision and manage Azure Time Series Insights Gen2

This article describes how to create and manage an Azure Time Series Insights Gen2 environment by using the [Azure portal](https://portal.azure.com/).

## Overview

When you provision an Azure Time Series Insights Gen2 environment, you create these Azure resources:

* An Azure Time Series Insights Gen2 environment that follows pay-as-you-go pricing model
* An Azure Storage account
* An optional warm store for faster and unlimited queries

> [!TIP]
> * Learn [how to plan your environment](./time-series-insights-update-plan.md).
> * Read about how to [Add an event hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md) or how to [Add an IoT hub source](./time-series-insights-how-to-add-an-event-source-iothub.md).

You will learn how to:

1.  Associate each Azure Time Series Insights Gen 2 environment with an event source. You will also provide a Timestamp ID property and a unique consumer group to ensure that the environment has access to the appropriate events.

1. After provisioning is complete, you can modify your access policies and other environment attributes to suit your business needs.

   > [!NOTE]
   > The first step is optional when provisioning an environment. If you skip this step, you must attach an event source to the environment later so data can start flowing into your environment and can be accessed through query.

## Create the environment

To create an Azure Time Series Insights Gen 2 environment:
1. Create an Azure Time Series Insights resource under *Internet of Things* on [Azure portal](https://portal.azure.com/).

1. Select **Gen2(L1)** as the **Tier**. Provide an environment name, and choose the subscription group and resource group to use. Then select a supported location to host the environment.

   [![Create an Azure Time Series Insights instance.](media/v2-update-manage/create-and-manage-configuration.png)](media/v2-update-manage/create-and-manage-configuration.png#lightbox)

1. Enter a Time Series ID.

    > [!NOTE]
    > * The Time Series ID is *case-sensitive* and *immutable*. (It can't be changed after it's set.)
    > * Time Series IDs can be up to *three* keys. Think of it as a primary key in a database, which uniquely represents each device sensor that would send data to your environment. It could be one property or a combination of upto three properties.
    > * Read more about [How to choose a Time Series ID](time-series-insights-update-how-to-id.md)

1. Create an Azure Storage account by selecting a storage account name, account kind and designating a [replication](https://docs.microsoft.com/azure/storage/common/redundancy-migration?tabs=portal) choice. Doing so automatically creates an Azure Storage  account. By default, [general purpose v2](https://docs.microsoft.com/azure/storage/common/storage-account-overview) account will be created. The account is created in the same region as the Azure Time Series Insights Gen2 environment that you previously selected. 
Alternatively, you can also bring your own storage (BYOS) through [ARM template](./time-series-insights-manage-resources-using-azure-resource-manager-template.md) when you create a new Azure Time Series Gen2 environment. 

1. **(Optional)** Enable warm store for your environment if you want faster and unlimited queries over most recent data in your environment. You can also create or delete a warm store through the **Storage Configuration** option in the left navigation pane, after you create an Azure Time Series Insights Gen2 environment.

1. **(Optional)** You can add an event source now. You can also wait until after the instance has been provisioned.

   * Azure Time Series Insights supports [Azure IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md) and [Azure Event Hubs](./time-series-insights-how-to-add-an-event-source-eventhub.md) as event source options. Although you can add only a single event source when you create the environment, you can add another event source later. 
   
     You can select an existing consumer group or create a new consumer group when you add the event source. Please note that the event source requires a unique consumer group for your environment to read data into it.

   * Choose the appropriate Timestamp property. By default, Azure Time Series Insights uses the message-enqueued time for each event source.

     > [!TIP]
     > The message-enqueued time might not be the best configured setting to use in batch event scenarios or historical data uploading scenarios. In such cases, make sure to verify your decision to use or not use a Timestamp property.

     [![Event Source configuration tab](media/v2-update-manage/create-and-manage-event-source.png)](media/v2-update-manage/create-and-manage-event-source.png#lightbox)

1. Confirm that your environment has been provisioned and configured the way you want.

    [![Review + Create tab](media/v2-update-manage/create-and-manage-review-and-confirm.png)](media/v2-update-manage/create-and-manage-review-and-confirm.png#lightbox)

## Manage the environment

You can manage your Azure Time Series Insights Gen2 environment by using the Azure portal. There a few key differences  between a Gen2 environment and Gen1 S1 or Gen1 S2 environments to bear in mind when you manage your environment through the Azure portal:

* The Azure portal Gen2 **Overview**  blade has the following changes:

  * Capacity is removed because it doesn't apply to Gen2 environments.
  * The **Time series ID** property is added. It determines how your data is partitioned.
  * Reference data sets are removed.
  * The displayed URL directs you to the [Azure Time Series Insights Explorer](./time-series-insights-update-explorer.md).
  * Your Azure Storage account name is listed.

* The Azure portal's **Configure** blade is removed because scale units don't apply to Azure Time Series Insights Gen2 environments. However, you can use **Storage Configuration** to configure the newly introduced warm store.

* The Azure portal's **Reference data** blade is removed in Azure Time Series Insights Gen2 because reference data concept has been replaced by [Time Series Model (TSM)](/azure/time-series-insights/concepts-model-overview).

[![Azure Time Series Insights Gen2 environment in the Azure portal](media/v2-update-manage/create-and-manage-overview-confirm.png)](media/v2-update-manage/create-and-manage-overview-confirm.png#lightbox)

## Next steps

- Learn more about Azure Time Series Insights generally available environments and Gen2 environments by reading [Plan your environment](./time-series-insights-update-plan.md).

- Learn how to [Add an event hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md).

- Configure an [IoT hub source](./time-series-insights-how-to-add-an-event-source-iothub.md).
