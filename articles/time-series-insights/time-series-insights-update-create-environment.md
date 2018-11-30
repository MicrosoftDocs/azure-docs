---
title: Create an Azure Time Series Insights (preview) environment | Microsoft Docs
description: Learn how to create an Azure Time Series update environment
author: ashannon7
ms.author: anshan
ms.workload: big-data
manager: cshankar
ms.service: time-series-insights
services: time-series-insights
ms.topic: tutorial
ms.date: 11/26/2018
---

# Provisioning and managing an Azure Time Series Insights (preview) environment

This document describes how to provision and manage a new Azure Time Series Insights (preview) environment in the Azure portal.

## Overview

A brief description about provisioning following the Time Series Insights update:

* Provision an Azure Time Series Insights (TSI) update environment.
* As part of the creation process you will need to provide a **Time Series ID**. It can be up to **three** (3) keys. Learn more about [Time Series IDs](./time-series-insights-update-plan.md).
* When you provision an Azure TSI update environment you create two Azure resources, a TSI update environment and an Azure Storage general-purpose V1 account.  
* In the future, new Azure customers will by default only be allowed to provision an Azure Storage general-purpose V2 account, therefore we will support it when that change occurs.  
* Do not enable cold/archival properties on the storage account you will be using.
* You can then optionally connect the update environment to a Time Series Insight supported event source (for example, IoT Hub).
* Here you want to provide the **Timestamp ID** property and provide a unique consumer group to ensure that the environment has access to all your events.
* After provisioning, you can then optionally manage access policies and other environment attributes that support your business requirements.

## New environment creation

1. Select `PAYG` from the **SKU** dropdown. You’ll also input an environment name, designate which subscription and resource group you wish to create the environment in, and select a supported location for the environment to reside in.  

1. Create a new Azure Storage account by selecting a storage account name and designating a replication choice. Doing so will automatically create a new Azure Storage general-purpose V1 account in the same region as the Azure TSI (preview) environment you previously selected.  

1. Input **Time Series ID** property:

    > [!IMPORTANT]
    > The **Time Series ID** is case-sensitive immutable and cannot be changed once set.

    Learn more details on selecting the appropriate **Time Series ID** by reading about [Best practices for selecting a Time Series ID](./time-series-insights-update-how-to-id.md).

    ![environment_details][1]

1. Optionally, you can add an event source:

    * Azure TSI supports Azure IoT Hub and Event Hubs as options. While you can only add a single event source at environment creation time, you can add an additional event source later. It’s best to create a unique consumer group to ensure all events are visible to TSI. You can select an existing consumer group or create a new consumer group when adding the event source.

    * Also designate the appropriate **Timestamp** property. By default, TSI uses the message enqueued time for each event source, which may not be right if you are batching events or uploading historical data. Therefore, it is imperative to input the case-sensitive timestamp property when adding the event source.  

     ![environment_event_sources][2]

1. Review and create:

    ![environment_review][3]

    Confirm that everything's correct!

## Management

You have the ability to manage your TSI updated environment using the Azure portal. Users familiar with TSI will feel immediately comfortable with the TSI update since much is carried over between versions.

Major differences in managing an L1 TSI environment versus an S1 or S2 environment using the Azure portal are provided below:

* TSI Azure portal *Overview* blade:

  * Using the overview blade remains the same except for:

    * Capacity is removed as this concept is not relevant to L1 environments.
    * The **Time Series ID** property has been added. This is an immutable property you added at provisioning time and defines how your data is partitioned.
    * Reference data sets are removed.

* TSI Azure portal *Configure* blade:
  
  * Retention is removed as retention will be set to unlimited.

    * We expect to add more controls to this in the future, but for now you cannot set a limit on this.
    * Capacity, calculator, and storage limit exceeded behavior all removed.

* TSI Azure portal *Reference* data blade:

  * This entire blade has been removed as reference data is not a component of L1 environments.

[!INCLUDE [tsi-update-docs](../../includes/time-series-insights-update-documents.md)]

## Next steps

Read about TSI storage configuration:

> [!div class="nextstepaction"]
> [Azure TSI (preview) Storage and Ingress](./time-series-insights-update-storage-ingress.md)

Learn more about Time Series Models:

> [!div class="nextstepaction"]
> [Azure TSI (preview) TSM](./time-series-insights-update-tsm.md)

<!-- Images -->
[1]: media/v2-update-provision/environment_details.png
[2]: media/v2-update-provision/environment_event_sources.png
[3]: media/v2-update-provision/environment_review.png