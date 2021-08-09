---
title: Quickstart - Set up IoT Hub Device Provisioning Service in the Microsoft Azure portal
description: Quickstart - Set up the Azure IoT Hub Device Provisioning Service (DPS) in the Microsoft Azure portal
author: anastasia-ms
ms.author: v-stharr
manager: lizross
ms.date: 08/06/2021
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
ms.custom: mvc
---

# Quickstart: Set up the IoT Hub Device Provisioning Service with the Azure portal

The IoT Hub Device Provisioning Service enables zero-touch, just-in-time device provisioning to any IoT hub. The Device Provisioning Service enables customers to provision millions of IoT devices in a secure and scalable manner, without requiring human intervention. Azure IoT Hub Device Provisioning Service supports IoT devices with TPM, symmetric key, and X.509 certificate authentications. For more information, please refer to [IoT Hub Device Provisioning Service overview](./about-iot-dps.md)

In this quickstart, you'll learn how to set up the IoT Hub Device Provisioning Service in the Azure portal.

To provision your devices, you will:

* Use the Azure portal to create an IoT Hub
* Use the Azure portal to create an IoT Hub Device Provisioning Service
* Link the IoT hub to the Device Provisioning Service

## Prerequisites

You'll need an Azure subscription to begin with this article. You can create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F), if you haven't already.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Create a new IoT Hub Device Provisioning Service

1. In the Azure portal, select **+ Create a resource** .

2. *Search the Marketplace* for the **Device Provisioning Service**. Select **IoT Hub Device Provisioning Service**.

3. Select **Create**.

4. Enter the following information:

    * **Name:** Provide a unique name for your new Device Provisioning Service instance. If the name you enter is available, a green check mark appears.
    * **Subscription:** Choose the subscription that you want to use to create this Device Provisioning Service instance.
    * **Resource group:** This field allows you to create a new resource group, or choose an existing one to contain the new instance. Choose the same resource group that contains the Iot hub you created in the previous steps. By putting all related resources in a group together, you can manage them together. For example, deleting the resource group deletes all resources contained in that group. For more information, see [Manage Azure Resource Manager resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md).
    * **Location:** Select the location that's closest to your devices.

        :::image type="content" source="./media/quick-setup-auto-provision/create-iot-dps-portal.png" alt-text="Enter basic information about your Device Provisioning Service instance in the portal blade":::

5. Select **Review + Create** to validate your provisioning service.

6. Select **Create**.

7. After the deployment successfully completes, select **Go to resource** to view your Device Provisioning Service instance.

## Link the IoT hub and your Device Provisioning Service

In this section, you'll add a configuration to the Device Provisioning Service instance. This configuration sets the IoT hub for which devices will be provisioned.

1. In the *Settings* menu, select **Linked IoT hubs**.

2. Select **+ Add**.

3. On the **Add link to IoT hub** panel, provide the following information: 

    * **Subscription:** Select the subscription containing the IoT hub that you want to link with your new Device Provisioning Service instance.
    * **Iot hub:** Select the IoT hub to link with your new Device Provisioning Service instance.
    * **Access Policy:** Select **iothubowner** as the credentials for establishing the link with the IoT hub.  

        :::image type="content" source="./media/quick-setup-auto-provision/link-iot-hub-to-dps-portal.png" alt-text="Link the hub name to link to the Device Provisioning Service instance in the portal blade"::: 

4. Select **Save**.

5. Select **Refresh**. Now you should see the selected hub under the **Linked IoT hubs** blade.

## Clean up resources

The rest of the Device Provisioning Service quickstarts and tutorials use the resources that you created in this quickstart. However, if you don't plan on doing any more quickstarts or tutorials, you'll want to delete those resources.

To clean up resources in the Azure portal:

1. From the left-hand menu in the Azure portal, select **All resources**.

2. Select your Device Provisioning Service.

3. At the top of the device detail pane, select **Delete**.  

4. From the left-hand menu in the Azure portal, select **All resources**.

5. Select your IoT hub.

6. At the top of the hub detail pane, select **Delete**.  

## Next steps

Provision a simulated device with IoT hub and the Device Provisioning Service:

> [!div class="nextstepaction"]
> [Quickstart to create a simulated device](./quick-create-simulated-device-symm-key.md)
