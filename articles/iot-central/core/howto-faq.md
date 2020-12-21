---
title: Azure IoT Central frequently asked questions | Microsoft Docs
description: Azure IoT Central frequently asked questions (FAQ) and answers
author: dominicbetts
ms.author: dobett
ms.date: 09/23/2020
ms.topic: how-to
ms.service: iot-central
services: iot-central
---

# Frequently asked questions for IoT Central

**How do I check for credential issues if a device isn't connecting to my IoT Central application?**

The [Troubleshoot why data from your devices isn't showing up in Azure IoT Central](troubleshoot-connection.md) includes steps to diagnose connectivity issues for devices.

**How do I file a ticket with customer support?**

If you need help, you can file an [Azure support ticket](https://portal.azure.com/#create/Microsoft.Support).

For more information, including other support options, see [Azure IoT support and help options](../../iot-fundamentals/iot-support-help.md).

**How do I unblock a device?**

When a device is blocked, it can't send data to your IoT Central application. Blocked devices have a status of **Blocked** on the **Devices** page in your application. An operator must unblock the device before it can resume sending data:

:::image type="content" source="media/howto-faq/blocked.png" alt-text="Screenshot showing blocked device":::

When an operator unblocks a device the status returns to its previous value, **Registered** or **Provisioned**.

**How do I approve a device?**

If the device status is **Waiting for Approval** on the **Devices** page, it means the **Auto approve** option is disabled:

:::image type="content" source="media/howto-faq/auto-approve.png" alt-text="Screenshot showing application with auto-approve option disabled.":::

An operator must explicitly approve a device before it starts sending data. Devices not registered manually on the **Devices** page, but connected with valid credentials will have the device status **Waiting for Approval**. Operators can approve these devices from the **Devices** page using the **Approve** button:

:::image type="content" source="media/howto-faq/approve-device.png" alt-text="Screenshot showing how to approve a device":::

**How do I associate a device with a device template?**

If the device status is **Unassociated**, it means the device connecting to IoT Central doesn't have an associated device template. This situation typically happens in the following scenarios:

- A set of devices is added using **Import** on the **Devices** page without specifying the device template.
- A device was registered manually on the **Devices** page without specifying the device template. The device then connected with valid credentials.  

The operator can associate a device to a device template from the **Devices** page using the **Migrate** button. To learn more, see [Manage devices in your Azure IoT Central application > Migrating devices to a template](howto-manage-devices.md).

**Where can I learn more about IoT Hub?**

Azure IoT Central uses Azure IoT Hub as a cloud gateway that enables device connectivity. IoT Hub enables:

- Data ingestion at scale in the cloud.
- Device management.
- Secure device connectivity.

To learn more about IoT Hub, see [Azure IoT Hub](../../iot-hub/index.yml).

**Where can I learn more about the Device Provisioning Service (DPS)?**

Azure IoT Central uses DPS to enable devices to connect to your application. To learn more about the role DPS plays in connecting devices to IoT Central, see [Get connected to Azure IoT Central](concepts-get-connected.md). To learn more about DPS, see [Provisioning devices with Azure IoT Hub Device Provisioning Service](../../iot-dps/about-iot-dps.md).