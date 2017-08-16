---
title: Azure Quick Start - Set up cloud for DPS in portal | Microsoft Docs
description: Azure Quick Start - Set up cloud for IoT Hub Device Provisioning Service in Azure Portal
services: iot-dps
keywords: 
author: sethmanheim
ms.author: sethm
ms.date: 08/15/2017
ms.topic: tutorial
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc

---

<!-------------------
Definition of Tutorial: 
- Prescriptive end-to-end how-to content which describes how to build and manage with a particular 
service.  
- Tutorials should be cross-service and represent the top 80% of use cases for the products. 
- The different tutorials should build upon eachother.  
- The first Tutorial should include Quickstart information to make sure customers 
don't get lost. 
- Rules for screenshots at the end of this template
- Metadata for this article should have ms.topic: tutorial; ms.custom: mvc
-->

# Set up cloud for device provisioning

This tutorial walks through how to set up the cloud for automatic device provisioning using the Device Provisioning Service (DPS). In this tutorial, you learn how to:

> [!div class="checklist"]
> * Use the Azure portal to create a DPS and get the scope ID
> * Create an IoT hub
> * Link the IoT hub to DPS
> * Set the allocation policy on DPS

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To complete this tutorial, make sure you have installed:

- TBD

## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).


## Create a DPS and get the scope ID

Follow these steps to create a new DPS.

1. In the upper left-hand corner of the Azure portal, click the **New** button.
2. In the Search box, type **device provisioning**. 
3. Click **IoT Device Provisioning Service**.
4. Fill out the **IoT Device Provisioning Service** form with the following information:
	
   | Setting       | Suggested value | Description | 
   | ------------ | ------------------ | ------------------------------------------------- | 
   | **Name** | Any unique name | -- | 
   | **Subscription** | Your subscription  | For details about your subscriptions, see [Subscriptions](https://account.windowsazure.com/Subscriptions). |
   | **Resource group** | myResourceGroup | For valid resource group names, see [Naming rules and restrictions](https://docs.microsoft.com/azure/architecture/best-practices/naming-conventions). |
   | **Location** | Any valid location | For information about regions, see [Azure Regions](https://azure.microsoft.com/regions/). |   

5. Click **Create**.
6. The *scope ID* is used to identify registration IDs, and provides a guarantee that the registration ID is unique. To obtain this value, click **Overview** to open the **Essentials** blade for the DPS. Copy the **Origin namespace** value, which is used as the scope ID, to a temporary location for later use.
7. Also make a note of the **Service endpoint** value, or copy it to a temporary location for later use. 

[!INCLUDE [iot-hub-get-started-create-hub](../../includes/iot-hub-get-started-create-hub.md)]

You have now created your IoT hub, and you have the host name and IoT Hub connection string that you need to complete the rest of this tutorial.

## Link the DPS to an IoT hub

The next step is to link the DPS and IoT hub. Follow these steps.

1. In the **All resources** blade, click the DPS you created previously.
2. In the DPS blade, click **Linked IoT hubs**.
3. Click **Add**.
4. In the **Add link to IoT hub** blade, use the radio buttons to specify whether the linked IoT hub is located in the current subscription, or in a different subscription. Then, choose the name of the IoT hub from the **IoT hub** box.
5. Click **Save**.

## Set the allocation policy on DPS

Now, in the DPS blade, click **Manage allocation policy**. Specify how you want to assign devices to hubs:

1. **Lowest latency**: Assigns devices to the linked IoT hub which result in the lowest atency communication pattern between the device and IoT Hub.
2. **Evenly weighted distribution** (default): Evenly distributes devices across linked IoT hubs.
3. **Static configuration**: Requires the desired IoT hub to be listed in the enrollment entry for the device being provisioned.  

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Use the Azure portal to create a DPS and get the scope ID
> * Create an IoT hub
> * Link the IoT hub to DPS
> * Set the allocation policy on DPS


Advance to the next tutorial to learn how to set up your device.

> [!div class="nextstepaction"]
> [Set up device](iot-dps-set-up-device.md)

<---! 
Rules for screenshots:
- Use default Public Portal colors
- Browser included in the first shot (especially) but all shots if possible
- Resize the browser to minimize white space
- Include complete blades in the screenshots
- Linux: Safari – consider context in images
Guidelines for outlining areas within screenshots:
	- Red outline #ef4836
	- 3px thick outline
	- Text should be vertically centered within the outline.
	- Length of outline should be dependent on where it sits within the screenshot. Make the shape fit the layout of the screenshot.
-->