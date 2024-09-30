---
title: Quickstart - Set up in portal
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Quickstart - Set up the Azure IoT Hub Device Provisioning Service (DPS) in the Microsoft Azure portal
author: kgremban
ms.author: kgremban
manager: lizross
ms.date: 08/16/2024
ms.topic: quickstart
ms.service: iot-dps
services: iot-dps
ms.custom: mvc, mode-ui
---

# Quickstart: Set up IoT Hub Device Provisioning Service with the Azure portal

In this quickstart, you learn how to set up Azure IoT Hub Device Provisioning Service in the Azure portal. Device Provisioning Service enables zero-touch, just-in-time device provisioning to any IoT hub. The Device Provisioning Service enables customers to provision millions of IoT devices in a secure and scalable manner, without requiring human intervention. Azure IoT Hub Device Provisioning Service supports IoT devices with TPM, symmetric key, and X.509 certificate authentications.

Before you can provision your devices, you first perform the following steps:

> [!div class="checklist"]
> * Use the Azure portal to create an IoT hub
> * Use the Azure portal to create an IoT Hub Device Provisioning Service instance
> * Link the IoT hub to the Device Provisioning Service instance

## Prerequisites

If you don't have an Azure subscription, create a [free Azure account](https://azure.microsoft.com/free/) before you begin.

## Create an IoT hub

[!INCLUDE [iot-hub-include-create-hub](../../includes/iot-hub-include-create-hub.md)]

## Create a new IoT Hub Device Provisioning Service instance

1. In the Azure portal, select **Create a resource**.

1. From the **Categories** menu, select **Internet of Things**, and then select **IoT Hub Device Provisioning Service**.

1. On the **Basics** tab, provide the following information:
    
    | Property | Value |
    | --- | --- |
    | **Subscription** | Select the subscription to use for your Device Provisioning Service instance. |
    | **Resource group** | This field allows you to create a new resource group, or choose an existing one to contain the new instance. Choose the same resource group that contains the IoT hub that you created in the previous steps. By putting all related resources in a group together, you can manage them together. |
    | **Name** | Provide a unique name for your new Device Provisioning Service instance. If the name you enter is available, a green check mark appears. |
    | **Region** | Select a location that's close to your devices. For resiliency and reliability, we recommend deploying to one of the regions that support [Availability Zones](iot-dps-ha-dr.md). |

    :::image type="content" source="./media/quick-setup-auto-provision/create-iot-dps-portal.png" alt-text="Screenshot showing the Basics tab of the IoT Hub device provisioning service. Enter basic information about your Device Provisioning Service instance in the portal.":::

1. Select **Review + create** to validate your provisioning service.

1. Select **Create** to start the deployment of your Device Provisioning Service instance.

1. After the deployment successfully completes, select **Go to resource** to view your Device Provisioning Service instance.

## Link the IoT hub and your Device Provisioning Service instance

In this section, you add a configuration to the Device Provisioning Service instance. This configuration sets the IoT hub to which the instance provisions IoT devices.

1. In the **Settings** menu of your Device Provisioning Service instance, select **Linked IoT hubs**.

1. Select **Add**.

1. On the **Add link to IoT hub** panel, provide the following information: 

    | Property | Value |
    | --- | --- |
    | **Subscription** | Select the subscription containing the IoT hub that you want to link with your new Device Provisioning Service instance. |
    | **IoT hub** | Select the IoT hub to link with your new Device Provisioning System instance. |
    | **Access Policy** | Select **iothubowner (RegistryWrite, ServiceConnect, DeviceConnect)** as the credentials for establishing the link with the IoT hub. |

    :::image type="content" source="./media/quick-setup-auto-provision/link-iot-hub-to-dps-portal.png" alt-text="Screenshot showing how to link an IoT hub to the Device Provisioning Service instance in the portal."::: 

1. Select **Save**.

1. Select **Refresh**. You should now see the selected hub under the list of **Linked IoT hubs**.

## Clean up resources

The rest of the Device Provisioning Service quickstarts and tutorials use the resources that you created in this quickstart. However, if you don't plan on doing any more quickstarts or tutorials, delete these resources.

To clean up resources in the Azure portal:

1. In the Azure portal, navigate to the resource group that you used in this quickstart.

1. If you want to delete the resource group and all of the resources it contains, select **Delete resource group**.

   Otherwise, select your Device Provisioning Service instance and your IoT hub from the list of resources, then select **Delete**.  

## Next steps

In this quickstart, you deployed an IoT hub and a Device Provisioning Service instance, and then linked the two resources. To learn how to use this setup to provision a device, continue to the quickstart for creating a device.

> [!div class="nextstepaction"]
> [Quickstart: Provision a simulated symmetric key device](./quick-create-simulated-device-symm-key.md)
