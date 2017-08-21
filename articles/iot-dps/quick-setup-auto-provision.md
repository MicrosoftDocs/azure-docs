---
title: Azure Quick Start - Set up DPS in Portal | Microsoft Docs
description: Azure Quick Start - Set up Azure IoT Hub Device Provisioning Service in Azure Portal
services: iot-dps
keywords: 
author: dsk-2015
ms.author: dkshir
ms.date: 08/15/2017
ms.topic: hero-article
ms.service: iot-dps

documentationcenter: ''
manager: timlt
ms.devlang: na
ms.custom: mvc
---

# Set up IoT Hub Device Provisioning Service with the Azure portal

These steps show how to set up the Azure cloud resources in the portal for provisioning your devices. This includes creating your IoT hub, creating a new IoT Hub Device Provisioning Service (or DPS) and linking the two services together. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Log in to the Azure portal

Log in to the [Azure portal](https://portal.azure.com/).

## Create an IoT hub

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. Select **Internet of Things**, select **IoT Hub**, and click the **Create** button. 

3. **Name** your IoT hub. Select from available options for pricing, enter the [IoT Hub units](https://azure.microsoft.com/pricing/details/iot-hub/), select the number of partitions for device-to-cloud messages and the subscription that would be used for this resource. Enter the name of a new or existing resource group and select the location. When complete, click **Create**.

    ![Enter basic information about your IoT hub in the portal blade](./media/quick-setup-auto-provision/create-iot-hub-portal.png)  

4. Once the IoT hub is successfully deployed, the hub summary blade automatically opens.


<!--
Need for a string pass in the last week of August or when portal is ready. 
 - a single instance of the DPS might not be called a tenant. Nicole is finding out from Leandro the acceptable terms to use. 
 - a few other portal strings might also change. 
-->

## Create a new tenant for IoT device provisioning service

1. Click the **New** button found on the upper left-hand corner of the Azure portal.

2. *Search the Marketplace* for **Device provisioning service**. Select **IoT Device Provisioning Service (preview)** and click the **Create** button. 

3. **Name** your DPS tenant. Select the subscription that would be used for this tenant and name a new or existing resource group. Select the location. When complete, click **Create**.

    ![Enter basic information about your DPS tenant in the portal blade](./media/quick-setup-auto-provision/create-iot-dps-portal.png)  

4. Once the DPS tenant is successfully deployed, its summary blade automatically opens.


## Link the IoT hub and the DPS tenant

1. Click the **All resources** button from on the left-hand menu of the Azure portal. Select the DPS tenant that you created in above section.  

2. On the DPS summary blade, select **Linked IoT hubs**. Click the **+ Add** button seen at the top. 

3. In the **Add link to IoT hub or pool** portal blade, select either the current subscription or enter the name and connection string for another subscription. Select *IoT hub* as the **Resource type** and select the name of the hub from the drop-down list. When complete, click **Save**. 

    ![Link the hub name to link to the DPS tenant in the portal blade](./media/quick-setup-auto-provision/link-iot-hub-to-dps-portal.png)  

3. Now you should see the selected hub under the **Linked IoT hubs** blade. 



## Clean up resources

Other quick starts in this collection build upon this quick start. If you plan to continue on to work with subsequent quick starts or with the tutorials, do not clean up the resources created in this quick start. If you do not plan to continue, use the following steps to delete all resources created by this quick start in the Azure portal.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your DPS tenant. At the top of the **All resources** blade, click **Delete**.  
2. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps

In this quick start, you’ve deployed an IoT hub and a DPS tenant, and linked the two resources. To learn how to use this set up to provision a simple simulated device, continue to the quick start for creating simulated device.

> [!div class="nextstepaction"]
> [Quick start to create simulated device](./quick-create-simulated-device.md)
