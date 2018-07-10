---
title: Manual failover of an Azure IoT Hub | Microsoft Docs
description: Show how to perform a manual failover for an Azure IoT Hub
author: robinsh
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 07/09/2018
ms.author: robinsh
ms.custom: mvc
#Customer intent: As an IT Pro, I want to be able to perform a manual failover of my IoT Hub to a different regions, and then return it to the original region.
---

# Tutorial: Configure manual failover for an IoT Hub (public preview)

Manual failover is a feature of IoT Hubs that allows customers to change their hub's operations from one region to another. This can be done in event of a disaster, or you can do a planned failover if you want to perform testing on the feature.

The amount of time it takes to perform the manual failover is proportional to the number of devices that are registered for your hub. It can take from 10 minutes to a couple of hours. For example, if you have 100,000 devices, it might take 15 minutes, but if you have five million devices, it might take up to an hour or longer.

Each device has a set of documents associated with it, such as the twin data and the recorded properties for the hub. When performing a failover, the documents are replicated to the new region. To make the hub active, these documents must be writable in the secondary region. They become writable when the hub is ready to operate in the new region. (I made that up. Is that right?)

In this tutorial, you learn how to set up an IoT hub and then cause it to failover to the secondary region, and then to cause a failback to the original region by performing the following tasks:

> [!div class="checklist"]
> * Using the Azure portal, create an IoT hub. 
> * Trigger a failover. 
> * See the hub running in the secondary location.
> * Trigger a failback -- return the IoT hub's operations to the primary region. 
> * Check the status to confirm the hub is running correctly in the right region.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Access to the public preview? 

## Create an IoT Hub

1. Log into the [Azure portal](https://portal.azure.com). 

2. Click **+ Create a resource** and select **Internet of Things**, then **IoT Hub**.

3. Select the **Basics** tab. Fill in the following fields.

    **Subscription**: select the Azure subscription you want to use.

    **Resource Group**: click **Create new** and fill in ManlFailRG for the resource group name.

    **Region**: select a region close to you that is part of the preview.
    
    > ![NOTE]
    > Manual failover is currently in public preview and is *not* available in the following Azure regions: East US, West US, North Europe, West Europe, Brazil South, and South Central US.

    **IoT Hub Name**: specify a name for your Iot hub. This must be globally unique. 

4.  Click **Review + create**. (Use the defaults for size and scale.) 

5.  After reviewing the information, click **Create** to create the IoT hub. 

## Trigger a manual failover

1. Click **Resource groups** and then select the resource group for this tutorial. Click on your hub in the list of resources. 

2.  Under **Resiliency** on the IoT Hub pane, click **Manual failover (preview)**.

    The primary location is set to the location of the IoT hub. The secondary location is the geographic partner to the primary location. You can not change these.

3.  At the top of the Manual failover pane, click **Initiate failover**. You see the **Confirm manual failover** pane.

4.  In the **Confirm manual failover** pane, fill in the IoT hub name. To initiate the failover, click OK. 

**NOTE to Roopesh: it flashes a lot when entering the hub name; should I mention this?**

    * While the manual failover is being implemented, there is a banner on the Manual Failover pane that tells you a manual failover is in progress. 

    * If you click on the hub, it will say the hub is not active, and that you must wait for the failover to complete before modifying any of the properties of the hub.

    * After it's finished, the primary and secondary regions on the Manual Failover page will be flipped.

## Trigger a failback 

After you have performed a manual failover, you can switch the hub back to the primary region -- this is called a failback. 

1.  To trigger a failback, return to the Iot Hub pane for your Iot hub.

2.  Under **Resiliency** on the IoT Hub pane, click **Manual failover (preview)**. 

3.  At the top of the Manual failover pane, click **Initiate failover**. You see the **Confirm manual failover** pane. 

4.  In the **Confirm manual failover** pane, fill in the IoT hub name. To initiate the failback, click OK. The banners will be displayed as explained in the 'Trigger a failover' section.

## Important Details 

* Failover can only be performed between Azure geo-paired regions. 

* Failover can be planned (when the hub is fully operational) or unplanned (in the event of an extended outage for the IoT hub). 

* Once the failover operation succeeds, all runtime operations should continue to work.

* The manual failover feature will be offered to customers at no additional cost.

* You have to wait about an hour between requesting a failover and requesting a failback. If you try to perform the failback in a shorter amount of time, a message is displayed.

* There is a limit of 2 failovers and 2 failbacks per day. 

## Clean up resources 

If you want to remove all of the resources you've created, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub and the resource group itself. 

1. Click **Resource Groups**. 

2. Locate and select the resource group you used for this tutorial. Click on it to open it. 

3. Click **Delete**. When prompted, enter the name of the resource group and click **Delete** to confirm. 

## Next steps

In this tutorial, you learned how to configure and trigger a manual failover, and how to trigger a failback by performing the following tasks.

> [!div class="checklist"]
> * Using the Azure portal, create an IoT hub. 
> * Trigger a failover. 
> * See the hub running in the secondary location.
> * Trigger a failback -- return the IoT hub's operations to the primary region. 
> * Check the status to confirm the hub is running correctly in the right region.

Advance to the next tutorial to learn how to manage the state of an IoT device. 

> [!div class="nextstepaction"]
[Manage the state of an IoT device](tutorial-device-twins.md)