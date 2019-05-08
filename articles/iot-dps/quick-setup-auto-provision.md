---
title: Set up Device Provisioning in the Azure portal | Microsoft Docs
description: Azure Quickstart - Set up the Azure IoT Hub Device Provisioning Service in the Azure Portal
author: wesmc7777
ms.author: wesmc
ms.date: 07/12/2018
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
manager: timlt
ms.custom: mvc
---

# Set up the IoT Hub Device Provisioning Service with the Azure portal

These steps show how to set up the Azure cloud resources in the portal for provisioning your devices. This article includes steps for: creating your IoT hub, creating a new IoT Hub Device Provisioning Service, and linking the two services together. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]


## Create a new instance for the IoT Hub Device Provisioning Service

1. Click the **Create a resource** button found on the upper left-hand corner of the Azure portal.

2. *Search the Marketplace* for the **Device provisioning service**. Select **IoT Hub Device Provisioning Service** and click the **Create** button. 

3. Provide the following information for your new Device Provisioning service instance and click **Create**.

    * **Name:** Provide a unique name for your new Device Provisioning service instance. If the name you enter is available, a green check mark appears.
    * **Subscription:** Choose the subscription that you want to use to create this Device Provisioning service instance.
    * **Resource group:** This field allows you to create a new resource group, or choose an existing one to contain the new instance. Choose the same resource group that contains the Iot hub you created above, for example, **TestResources**. By putting all related resources in a group together, you can manage them together. For example, deleting the resource group deletes all resources contained in that group. For more information, see [Manage Azure Resource Manager resource groups](../azure-resource-manager/manage-resource-groups-portal.md).
    * **Location:** Select the closest location to your devices.

      ![Enter basic information about your Device Provisioning service instance in the portal blade](./media/quick-setup-auto-provision/create-iot-dps-portal.png)  

4. Click the notification button to monitor the creation of the resource instance. Once the service is successfully deployed, click **Pin to dashboard**, and then **Go to resource**.

    ![Monitor the deployment notification](./media/quick-setup-auto-provision/pin-to-dashboard.png)

## Link the IoT hub and your Device Provisioning service

In this section, you will add a configuration to the Device Provisioning service instance. This configuration sets the IoT hub for which devices will be provisioned.

1. Click the **All resources** button from the left-hand menu of the Azure portal. Select the Device Provisioning service instance that you created in the preceding section.  

2. On the Device Provisioning Service summary blade, select **Linked IoT hubs**. Click the **+ Add** button seen at the top. 

3. On the **Add link to IoT hub** page, provide the following information to link your new Device Provisioning service instance to an IoT hub. Then click  **Save**. 

    * **Subscription:** Select the subscription containing the IoT hub that you want to link with your new Device Provisioning service instance.
    * **Iot hub:** Select the IoT hub to link with your new Device Provisioning service instance.
    * **Access Policy:** Select **iothubowner** as the credentials for establishing the link with the IoT hub.  

      ![Link the hub name to link to the Device Provisioning service instance in the portal blade](./media/quick-setup-auto-provision/link-iot-hub-to-dps-portal.png)  

3. Now you should see the selected hub under the **Linked IoT hubs** blade. You might need to click **Refresh** to show **Linked IoT hubs**.



## Clean up resources

Other Quickstarts in this collection build upon this Quickstart. If you plan to continue on to work with subsequent Quickstarts or with the tutorials, do not clean up the resources created in this Quickstart. If you do not plan to continue, use the following steps to delete all resources created by this Quickstart in the Azure portal.

1. From the left-hand menu in the Azure portal, click **All resources** and then select your Device Provisioning service. At the top of the **All resources** blade, click **Delete**.  
2. From the left-hand menu in the Azure portal, click **All resources** and then select your IoT hub. At the top of the **All resources** blade, click **Delete**.  

## Next steps

In this Quickstart, you’ve deployed an IoT hub and a Device Provisioning service instance, and linked the two resources. To learn how to use this set up to provision a simulated device, continue to the Quickstart for creating simulated device.

> [!div class="nextstepaction"]
> [Quickstart to create simulated device](./quick-create-simulated-device.md)
