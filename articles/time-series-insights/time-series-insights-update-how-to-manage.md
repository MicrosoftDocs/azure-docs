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
---

# How to provision and manage Azure Time Series Insights Preview

This document describes how to create and manage a new Azure Time Series Insights update environment in the Azure portal.

## Overview

In brief, here is how provisioning works in the Azure Time Series Insights update:

* Provision a Time Series Insights update (PAYG) environment. 
* As part of the creation process you will need to provide a time series ID. It can be up to 3 keys. You can learn more about Time Series ID’s here. 
* When you provision a Time Series Insights update environment you create two Azure resources, a Time Series Insights update environment and an Azure storage general purpose V1 account. 
* In the future, new Azure customers will by default only be allowed to provision an Azure storage general purpose V2 account, therefore we will support it when that change occurs. 
* For V2 accounts, please do not enable cold/archival properties on the storage account you will be using. 
* You can then optionally connect the update environment to a Time Series Insight supported event source (e.g. IoT Hub). 
* Here you want to provide the timestamp ID property and provide a unique consumer group to ensure that the environment has access to all your events. 
* After provisioning, you can then optionally manage access policies and other environment attributes that support your business requirements.

## New environment creation

The following steps describee how to create an Azure Time Series Insights Preview environment:

1. Select the PAYG button under the SKU menu. You’ll also input an environment name, designate which subscription and resource group you wish to create the environment in, and select a supported location for the environment to reside in.

1. Input Time Series ID property

1. Create a new Azure Storage account by selecting a storage account name and designating a replication choice. This will automatically create a new Azure storage general purpose V1 account in the same region as the Time Series Insights update environment you previously selected. 

    ![Create an Azure Time Series Insights instance.][1]

1. Optionally, you can add an event source.

* Time Series Insights supports Azure IoT Hub and Event Hubs as options. While you can only add a single event source at environment creation time, you can add an additional event source later. It’s best to create a unique consumer group to ensure all events are visible to Time Series Insights. You can select an existing consumer group or create a new consumer group when adding the event source. 
* You should also designate the appropriate timestamp property. By default, Time Series Insights uses the message enqueued time for each event source, which may not be right if you are batching events or uploading historical data. Therefore, it is imperative to input the case sensitive timestamp property when adding the event source. 

    ![Add an event source to your instance.][2]

1. Review and create

    ![Add an event source to your instance.][3]

Confirm everything looks appropriate and you are good to go!

## Management

You have the ability to manage your Time Series Insights updated environment using the Azure portal. If you’re familiar with the generally available Time Series Insights experience, not much is changing. 

Here are the major differences in managing an PAYG Time Series Insights environment versus an S1 or S2 environment using the Azure portal: 

* Time Series Insights Azure portal Overview blade:
  - Using the overview blade remains the same except for: 
    * Capacity is removed as this concept is not relevant to PAYG environments. 
    * The Time Series ID property has been added. This is an immutable property you added at provisioning time and defines how your data is partitioned. 
    * Reference data sets are removed. 
   * The link takes you to the Time Series Insights update explorer. 
   * Your Azure storage account name is listed. 

* Time Series Insights Azure Portal Configure blade is removed: 
* The entire blade has been removed as there is no notion of configuration for PAYG environments. 


* Time Series Insights Azure Portal Reference data blade: 
* This entire blade has been removed as reference data is not a component of PAYG environments.

  ![Verify your instance.][4]

## Next steps

Read [How to work with Time Series Models](./time-series-insights-update-how-to-tsm.md).

Read [Supported JSON shapes](./how-to-shape-query-json.md).

<!-- Images -->
[1]: media/v2-update-manage/manage_one.png
[2]: media/v2-update-manage/manage_two.png
[3]: media/v2-update-manage/manage_three.png
[4]: media/v2-update-manage/manage_four.png
