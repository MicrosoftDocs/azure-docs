---
title: Azure Time Series Preview management - How to provision and manage the Azure Time Series Preview. | Microsoft Docs
description: Understanding how to provision and manage Azure Time Series Insights Preview.
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: conceptual
ms.date: 12/10/2018
ms.custom: seodec18
---

# How to provision and manage Azure Time Series Insights Preview

This document describes how to create and manage an Azure Time Series Insights Preview environment by using the [Azure portal](https://portal.azure.com/).

## Overview

A brief overview about how to provision an Azure Time Series Insights Preview environment is described below:

* Azure Time Series Insights Preview environments are **PAYG** environments.
  * As part of the creation process you will need to provide a Time Series ID. Time Series IDs can be up to three keys. Learn more about selecting a Time Series ID by reading [How to choose a Time Series ID](./time-series-insights-update-how-to-id.md).
  * When you provision an Azure Time Series Insights Preview environment, you create two Azure resources:

    * An Azure Time Series Insights Preview environment  
    * An Azure Storage general-purpose V1 account
  
    Learn [How to plan your environment](./time-series-insights-update-plan.md).

    >[!IMPORTANT]
    > For customers using V2 accounts, do not enable cold/archival properties on the storage account you will be using.

* Each Azure Time Series Insights Preview environment can be (optionally) associated with an event source. Read [How to add an Event Hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md) and [How to add an IoT Hub source](./time-series-insights-how-to-add-an-event-source-iothub.md) for more information.
  * You will provide a Timestamp ID property and a unique consumer group during this step. Doing so, ensures that the environment has access to the appropriate events.

* Once provisioning is complete, you may modify your access policies and other environment attributes to suite your business requirements.

## New environment creation

The following steps describe how to create an Azure Time Series Insights Preview environment:

1. Select the **PAYG** button under the **SKU** menu. Supply an environment name, designate which subscription group, and which resource group to use. Then, select a supported location for the environment to be hosted in.

1. Input a Time Series ID

    >[!NOTE]
    > * The Time Series ID is case-sensitive and immutable (it can't be changed after it is set).
    > * Time Series IDs can be up to 3 keys.
    > * Read more about selecting a Time Series ID by reading [How to choose a Time Series ID](./time-series-insights-update-how-to-id.md).

1. Create an Azure Storage account by selecting an Azure Storage account name and designating a replication choice. Doing so automatically creates an Azure Storage general-purpose V1 account. It will be created in the same region as the Azure Time Series Insights Preview environment you previously selected.

    ![Create an Azure Time Series Insights instance.][1]

1. Optionally, you can add an event source.

   * Time Series Insights supports [Azure IoT Hub](./time-series-insights-how-to-add-an-event-source-iothub.md) and [Event Hubs](./time-series-insights-how-to-add-an-event-source-eventhub.md) as options. While you can only add a single event source at environment creation time, you can add an additional event source later. It’s best to create a unique consumer group to ensure all events are visible to your Azure Time Series Insights Preview instance. You can select an existing consumer group or create a new consumer group when adding the event source.

   * You should also designate the appropriate Timestamp property. By default, Azure Time Series Insights uses the message enqueued time for each event source.

     > [!TIP]
     > The message enqueued time may not be the best configured setting to use in batch event or historical data uploading scenarios. Make sure to verify your decision to use or not use a Timestamp property in such cases.

    ![Add an event source to your instance.][2]

1. Review and create

    ![Add an event source to your instance.][3]

Confirm that your environment has been provisioned with the desired settings.

## Management

You have the ability to manage your Azure Time Series Insights Preview environment using the Azure portal. Here are the major differences in managing a **PAYG** Azure Time Series Insights Preview environment as opposed to an S1 or S2 environment using Azure Portal:

* The Azure portal *Overview* blade remains unchanged in Azure Time Series Insights except in the following ways:
  * Capacity is removed as this concept is not relevant to **PAYG** environments.
  * The Time Series ID property has been added. It determines how your data is partitioned.
  * Reference data sets are removed.
  * The displayed URL directs you to the [Azure Time Series Insights Preview explorer](./time-series-insights-update-explorer.md).
  * Your Azure Storage account name is listed.

* The Azure Portal *Configure* blade has been removed in Azure Time Series Insights Preview since there is **PAYG** environments are not configurable.

* The Azure Portal *Reference* data blade has been removed in Azure Time Series Insights Preview since reference data is not a component of **PAYG** environments.

![Verify your instance.][4]

## Next steps

Read [How to plan your environment](./time-series-insights-update-plan.md).

Read [How to add an Event Hub source](./time-series-insights-how-to-add-an-event-source-eventhub.md).

Read [How to add an IoT Hub source](./time-series-insights-how-to-add-an-event-source-iothub.md).

<!-- Images -->
[1]: media/v2-update-manage/manage_one.png
[2]: media/v2-update-manage/manage_two.png
[3]: media/v2-update-manage/manage_three.png
[4]: media/v2-update-manage/manage_four.png
