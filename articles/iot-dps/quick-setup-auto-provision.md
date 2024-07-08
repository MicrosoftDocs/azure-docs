---
title: Quickstart - Set up Device Provisioning Service in portal
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Quickstart - Set up the Azure IoT Hub Device Provisioning Service (DPS) in the Microsoft Azure portal
author: kgremban
ms.author: kgremban
manager: lizross
ms.date: 04/06/2023
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
ms.custom: mvc, mode-ui
---

# Quickstart: Set up the IoT Hub Device Provisioning Service with the Azure portal

In this quickstart, you learn how to set up the IoT Hub Device Provisioning Service in the Azure portal. The IoT Hub Device Provisioning Service enables zero-touch, just-in-time device provisioning to any IoT hub. The Device Provisioning Service enables customers to provision millions of IoT devices in a secure and scalable manner, without requiring human intervention. Azure IoT Hub Device Provisioning Service supports IoT devices with TPM, symmetric key, and X.509 certificate authentications. For more information, please refer to [IoT Hub Device Provisioning Service overview](about-iot-dps.md).

To provision your devices, you first perform the following steps:

> [!div class="checklist"]
> * Use the Azure portal to create an IoT hub
> * Use the Azure portal to create an IoT Hub Device Provisioning Service instance
> * Link the IoT hub to the Device Provisioning Service instance

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Create a new IoT Hub Device Provisioning Service instance

1. In the Azure portal, select the **+ Create a resource** button.

1. From the **Categories** menu, select **Internet of Things**, and then select **IoT Hub Device Provisioning Service**.

1. On the **Basics** tab, provide the following information:
    
    | Property | Value |
    | --- | --- |
    | **Subscription** | Select the subscription to use for your Device Provisioning Service instance. |
    | **Resource group** | This field allows you to create a new resource group, or choose an existing one to contain the new instance. Choose the same resource group that contains the Iot hub you created in the previous steps. By putting all related resources in a group together, you can manage them together. For example, deleting the resource group deletes all resources contained in that group. For more information, see [Manage Azure Resource Manager resource groups](../azure-resource-manager/management/manage-resource-groups-portal.md). |
    | **Name** | Provide a unique name for your new Device Provisioning Service instance. If the name you enter is available, a green check mark appears. |
    | **Region** | Select a location that's close to your devices. For resiliency and reliability, we recommend deploying to one of the regions that support [Availability Zones](iot-dps-ha-dr.md). |

    :::image type="content" source="./media/quick-setup-auto-provision/create-iot-dps-portal.png" alt-text="Screenshot showing the Basics tab of the IoT Hub device provisioning service. Enter basic information about your Device Provisioning Service instance in the portal blade.":::

1. Select **Review + create** to validate your provisioning service.

1. Select **Create** to start the deployment of your Device Provisioning Service instance.

1. After the deployment successfully completes, select **Go to resource** to view your Device Provisioning Service instance.

## Link the IoT hub and your Device Provisioning Service instance

In this section, you add a configuration to the Device Provisioning Service instance. This configuration sets the IoT hub for which the instance provisions IoT devices.

1. In the **Settings** menu, select **Linked IoT hubs**.

1. Select **+ Add**.

1. On the **Add link to IoT hub** panel, provide the following information: 

    | Property | Value |
    | --- | --- |
    | **Subscription** | Select the subscription containing the IoT hub that you want to link with your new Device Provisioning Service instance. |
    | **IoT hub** | Select the IoT hub to link with your new Device Provisioning System instance. |
    | **Access Policy** | Select **iothubowner (RegistryWrite, ServiceConnect, DeviceConnect)** as the credentials for establishing the link with the IoT hub. |

    :::image type="content" source="./media/quick-setup-auto-provision/link-iot-hub-to-dps-portal.png" alt-text="Screenshot showing how to link an IoT hub to the Device Provisioning Service instance in the portal blade."::: 

1. Select **Save**.

1. Select **Refresh**. You should now see the selected hub under the **Linked IoT hubs** blade.

## Clean up resources

The rest of the Device Provisioning Service quickstarts and tutorials use the resources that you created in this quickstart. However, if you don't plan on doing any more quickstarts or tutorials, delete these resources.

To clean up resources in the Azure portal:

1. From the left-hand menu in the Azure portal, select **All resources**.

1. Select your Device Provisioning Service instance.

1. At the top of the device detail pane, select **Delete**.  

1. From the left-hand menu in the Azure portal, select **All resources**.

1. Select your IoT hub.

1. At the top of the hub detail pane, select **Delete**.  

## Next steps

In this quickstart, you deployed an IoT hub and a Device Provisioning Service instance, and then linked the two resources. To learn how to use this setup to provision a device, continue to the quickstart for creating a device.

> [!div class="nextstepaction"]
> [Quickstart: Provision a simulated symmetric key device](./quick-create-simulated-device-symm-key.md)
