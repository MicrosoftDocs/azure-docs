---
title: Register and connect an IoT device
titleSuffix: Azure IoT Hub
description: How to create, manage, and delete Azure IoT devices and how to retrieve their connection information.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 06/10/2024
---

# Create and manage device identities

Create a device identity for your device to connect to Azure IoT Hub. This article introduces key tasks for managing a device identity including registering the device, collecting its connection information, and then deleting or disabling a device at the end of its lifecycle.

## Register a new device in the IoT hub

In this section, you create a device identity in the [identity registry in your IoT hub](./iot-hub-devguide-identity-registry.md). A device can't connect to a hub unless it has a device identity.

The IoT Hub identity registry only stores device identities to enable secure access to the IoT hub. It stores device IDs and keys to use as security credentials, and an enabled/disabled flag that you can use to disable access for an individual device.

IoT Hub supports three methods for device authentication:

* **Symmetric key** - When you register a new device, you can provide keys or IoT Hub will generate keys for you. Both the device and the IoT hub have a copy of the symmetric key that can be compared when the device connects.
* **X.509 self-signed** - Also called thumbprint authentication, you upload a portion of the device's X.509 certificate to the IoT hub. When the device connects, it presents its certificate and the IoT hub can validate it against the portion it knows. For more information, see [Authenticate identities with X.509 certificates](./authenticate-authorize-x509.md).
* **X.509 CA signed** - You upload and verify an X.509 certificate authority (CA) certificate to the IoT hub. The device has an X.509 certificate with the verified X.509 CA in its certificate chain of trust. When the device connects, it presents its full certificate chain and the IoT hub can validate it because it knows the X.509 CA. Multiple devices can authenticate against the same verified X.509 CA. For more information, see [Authenticate identities with X.509 certificates](./authenticate-authorize-x509.md).

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **Device management** > **Devices**, then select **Add Device** to add a device in your IoT hub.

    :::image type="content" source="./media/iot-hub-include-create-device/create-identity-portal.png" alt-text="Screen capture that shows how to create a device identity in the portal." border="true":::

1. In **Create a device**, provide the information for your new device identity:

   | Parameter | Dependent parameter | Value |
   | -- | -- | -- |
   | **Device ID** |  | Provide a name for your new device. |
   | **Authentication type** |  | Select either **Symmetric key**, **X.509 self-signed**, or **X.509 CA signed**. |
   |  | **Auto-generate keys** | For **Symmetric key** authentication, check this box to have IoT Hub generate keys for your device. Or, uncheck this box and provide primary and secondary keys for your device. |

   1.  a name for your new device.

   [!INCLUDE [iot-hub-pii-note-naming-device](iot-hub-pii-note-naming-device.md)]

1. Select **Save**.


### [Azure CLI](#tab/cli)

### [PowerShell](#tab/powershell)

---

## Retrieve device connection information

### [Azure portal](#tab/portal)

1. After the device is created, open the device from the list in the **Devices** pane. Copy the value of **Primary connection string**. This connection string is used by device code to communicate with the IoT hub.

    By default, the keys and connection strings are masked because they're sensitive information. If you click the eye icon, they're revealed. It's not necessary to reveal them to copy them with the copy button.

    :::image type="content" source="./media/iot-hub-include-create-device/device-details.png" alt-text="Screen capture that shows the device connection string." border="true" lightbox="./media/iot-hub-include-create-device/device-details.png":::

### [Azure CLI](#tab/cli)

### [PowerShell](#tab/powershell)

---

## Disable or delete a device in an IoT hub

If you want to keep a device in your IoT hub's identity registry, but want to prevent it from connecting then you can change its status to *disabled.*

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Devices** from the navigation menu.

1. Select the name of the device that you want to disable to view its device details page.

1. On the device details page, set the **Enable connection to IoT Hub** parameter to **Disable**.

   :::image type="content" source="./media/iot-hub-create-through-portal/disable-device.png" alt-text="Screenshot that shows disabling a device connection.":::

If you want to remove a device from your IoT hub's identity registry, you can delete its registration.

1. From the **Devices** page of your IoT hub, select the checkbox next to the device that you want to delete.

1. Select **Delete** to remove the device registration.

   :::image type="content" source="./media/iot-hub-create-through-portal/delete-device.png" alt-text="Screenshot that shows deleting a device."::: 

### [Azure CLI](#tab/cli)

### [PowerShell](#tab/powershell)

---