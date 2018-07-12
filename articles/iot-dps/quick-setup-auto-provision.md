---
title: Set up Device Provisioning in the Azure portal | Microsoft Docs
description: Azure Quickstart - Set up the Azure IoT Hub Device Provisioning Service in the Azure Portal
author: dsk-2015
ms.author: dkshir
ms.date: 09/05/2017
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
manager: timlt
ms.custom: mvc
---

# Set up the IoT Hub Device Provisioning Service with the Azure portal

These steps show how to set up the Azure cloud resources in the portal for provisioning your devices. This article includes steps for: creating your IoT hub, creating a new IoT Hub Device Provisioning Service, and linking the two services together. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Sign in to the Azure portal

Sign in to the [Azure portal](https://portal.azure.com/).

## Create an IoT hub

[!INCLUDE [iot-hub-quickstarts-create-hub](../../includes/iot-hub-quickstarts-create-hub.md)]


## Create a new instance for the IoT Hub Device Provisioning Service

1. Click the **Create a resource** button found on the upper left-hand corner of the Azure portal.

2. *Search the Marketplace* for the **Device provisioning service**. Select **IoT Hub Device Provisioning Service** and click the **Create** button. 

3. Provide the following information for your new Device Provisioning Service instance and click **Create**.

    * **Name:** Provide a unique name for your new Device Provisioning Service instance. If the name you enter is available, a green check mark appears.
    * **Subscription:** Choose the subscription that you want to use to create this Device Provisioning Service instance.
    * **Resource group:** This field allows you to create a new resource group, or choose an existing one to contain the new instance. Choose the same resource group that contains the Iot hub you created above, for example, **TestResources**. By putting all related resources in a group together, you can manage them together. For example, deleting the resource group deletes all resources contained in that group. For more information, see [Use resource groups to manage your Azure resources](../azure-resource-manager/resource-group-portal.md).
    * **Location:** Select the closest location to your devices
    * **Pin to dashboard:** Select this option to have the instance pinned to your dashboard making it easier to find.

    ![Enter basic information about your DPS instance in the portal blade](./media/quick-setup-auto-provision/create-iot-dps-portal.png)  

4. Once the service is successfully deployed, its summary blade automatically opens.


## Link the IoT hub and your Device Provisioning service

1. Click the **All resources** button from the left-hand menu of the Azure portal. Select the Device Provisioning Service instance that you created in the preceding section.  

2. On the Device Provisioning Service summary blade, select **Linked IoT hubs**. Click the **+ Add** button seen at the top. 

3. In the **Add link to IoT hub** portal blade, select either the current subscription, or enter the name and connection string for another subscription. Select the name of the hub from the drop-down list. When complete, click **Save**. 

    ![Link the hub name to link to the DPS instance in the portal blade](./media/quick-setup-auto-provision/link-iot-hub-to-dps-portal.png)  

3. Now you should see the selected hub under the **Linked IoT hubs** blade. You might need to click **Refresh** to show **Linked IoT hubs**.



## Clean up resources

Other Quickstarts in this collection build upon this Quickstart. If you plan to continue on to work with subsequent Quickstarts or with the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart in the Azure portal.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
2. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps

In this Quickstart, you’ve deployed an IoT hub and a Device Provisioning Service instance, and linked the two resources. To learn how to use this set up to provision a simulated device, continue to the Quickstart for creating simulated device.

> [!div class="nextstepaction"]
> [Quickstart to create simulated device](./quick-create-simulated-device.md)
