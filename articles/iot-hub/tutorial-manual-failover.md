---
title: Manual failover of an Azure IoT Hub | Microsoft Docs
description: Show how to perform a manual failover for an Azure IoT Hub
author: robinsh
manager: timlt
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 07/05/2018
ms.author: robinsh
ms.custom: mvc
#Customer intent: As an IT Pro, I want to be able to perform a manual failover of my IoT Hub and then return it back to the original region. 
---

# Tutorial: Configure manual failover for an IoT Hub

<!-- put explanation here, like WHY -->

<!-- update the steps in this description and in the bulleted list -->
In this tutorial, you learn how to set up and use routing rules with IoT Hub. You will route messages from an IoT device to one of multiple services, including blob storage and a Service Bus queue. Messages to the Service Bus queue will be picked up by a Logic App and sent via e-mail. Messages that do not have routing specifically set up are sent to the default endpoint, and viewed in a Power BI visualization.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
> * Using Azure CLI or PowerShell, set up the base resources -- an IoT hub, a storage account, a Service Bus queue, and a simulated device.
> * Configure endpoints and routes in IoT hub for the storage account and Service Bus queue.
> * Create a Logic App that is triggered and sends e-mail when a message is added to the Service Bus queue.
> * Download and run an app that simulates an IoT Device sending messages to the hub for the different routing options.
> * Create a Power BI visualization for data sent to the default endpoint.
> * View the results ...
> * ...in the Service Bus queue and e-mails.
> * ...in the storage account.
> * ...in the Power BI visualization.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Set up IoT Hub 

<!-- steps to create an IoT Hub for this -->

## Set up manual failover 

<!-- shows steps for configuring for failover -->

## Set up manual failover

## Trigger the manual failover

<!-- show banner on the failover page that says 'manual failover from X to Y is in progress' -->
<!-- also show banner saying the hub is not acive, have to wait for failover to complete -->
<!-- show the results after it's finished -->

## Trigger a failback 

<!-- show how to do the failback and trigger it -->
<!-- show results after doing the failback -->


## Clean up resources 

If you want to remove all of the resources you've created, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, <!-- fill in rest of objects here -->
and the resource group itself. 

<!-- add instructions for deleting the resource group --> 

## Next steps

In this tutorial, you learned how to configure and trigger a manual failover, and how to trigger a failback by performing the following tasks.

> [!div class="checklist"]
> * Add an IoT Hub.
> * Do more stuff.
> * Configure a manual failover and trigger it. 
> * Perform a manual failback. 

Advance to the next tutorial to learn how to manage the state of an IoT device. 

> [!div class="nextstepaction"]
[Manage the state of an IoT device](tutorial-device-twins.md)