---
title: Receive events from Azure Digital Twins setup | Microsoft Docs
description: Learn how to receive notifications from your Azure Digital Twins setup using the steps in this tutorial.
services: digital-twins
author: dsk-2015

ms.service: digital-twins
ms.topic: tutorial 
ms.date: 08/30/2018
ms.author: dkshir
---

# Tutorial: Receive notifications from your Azure Digital Twins setup

Azure Digital Twins service allows you to bring together people, places and things in a coherent spatial system. This series of tutorials demonstrate how to use the Digital Twins to manage your facilities for efficient space utilization. This series shows you how to deploy Digital Twins using the portal[https://portal.azure.com], create a provisioning application using Digital Twins REST APIs in a .Net application, monitor the telemetry coming from your devices and rooms, and create customized analyses on the telemetry data. This will walk you through a scenario where you have a sample building, with the hierarchy of floors, rooms and devices with sensors in these rooms. The steps in these tutorials show you how to monitor the transient state of the rooms in the sample building, like occupancy and temperature, and receive alerts for abnormal conditions. You will use a sample application, and can choose to customize it for better understanding. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create your instance of Azure Digital Twins service
> * Grant permissions to an application to access your instance
> * Explore the .Net sample
> * Provision your spaces and devices

If you don’t have an Azure, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Prerequisites

- Install [.NET Core SDK](https://www.microsoft.com/net/download) on your development machine.
- Download the Digital Twins .Net sample. Click **Clone or download** on the [sample page](https://github.com/Azure-Samples/digital-twins-samples-csharp), and then **Download ZIP** to a folder on your work machine. Extract the zip folder for use in the proceeding steps. 


## Create notifications for telemetry data
This section shows you how to create notifications for the simulated telemetry data using [Event Grid](https://docs.microsoft.com/azure/event-grid/overview). 

1. Create an *Event Grid Topic*:
    1. Log in to the [portal](https://portal.azure.com).
    1. On the left on the portal, click on the **Resource groups** and then select the group you created for your Digital Twins instance. 
    1. Click **Add** and search for *Event grid* in the search box. Select **Event Grid Topic**. 
    1. Enter a name for the Event Grid topic, and select your subscription, the resource group and the location that you used for the Digital Twins. Click **Create**.
6. Create an endpoint in your Digital Twins instance to interact with the Event Grid topic created above.


## Clean up resources

If you wish to stop exploring Azure Digital Twins beyond this point, feel free to delete resources created in this tutorial:

1. From the left-hand menu in the [Azure portal](http://portal.azure.com), click **All resources**, select and **Delete** your Digital Twins resource group.
2. If you need to, you may proceed to delete the sample applications on your work machine as well. 


## Next steps

Proceed to the next article to learn more about the spatial intelligence graph and object model in Azure Digital Twins. 
> [!div class="nextstepaction"]
> [Next steps button](concepts-objectmodel-spatialgraph.md)

