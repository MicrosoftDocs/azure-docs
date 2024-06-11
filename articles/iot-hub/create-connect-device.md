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

## Register a device

In this section, you create a device identity in the [identity registry in your IoT hub](./iot-hub-devguide-identity-registry.md). A device can't connect to a hub unless it has a device identity.

The IoT Hub identity registry only stores device identities to enable secure access to the IoT hub. It stores device IDs and keys to use as security credentials, and an enabled/disabled flag that you can use to disable access for an individual device.

IoT Hub supports three methods for device authentication:

* **Symmetric key** - When you register a device, you can provide keys or IoT Hub will generate keys for you. Both the device and the IoT hub have a copy of the symmetric key that can be compared when the device connects.
* **X.509 self-signed** - If your device has a self-signed X.509 certificate, then you need to give IoT Hub a version of the certificate for authentication. When you register a device, you upload a certificate *thumbprint*, which is a hash of the device's X.509 certificate. When the device connects, it presents its certificate and the IoT hub can validate it against the hash it knows. For more information, see [Authenticate identities with X.509 certificates](./authenticate-authorize-x509.md).
* **X.509 CA signed** - If your device has a CA-signed X.509 certificate, then you can give IoT Hub a root or intermediate certificate in the signing chain for authentication. *This option is recommended for production scenarios.* Before you register a device, you upload and verify an X.509 certificate authority (CA) certificate to the IoT hub. The device has an X.509 certificate with the verified X.509 CA in its certificate chain of trust. When the device connects, it presents its full certificate chain and the IoT hub can validate it because it knows the X.509 CA. Multiple devices can authenticate against the same verified X.509 CA. For more information, see [Authenticate identities with X.509 certificates](./authenticate-authorize-x509.md).

### Prepare certificates

If you're using either of the X.509 certificate authentication methods, make sure your certificates are ready before registering a device.

The tutorial [Create and upload certificates for testing](./tutorial-x509-test-certs.md) provides a good introduction for how to create CA-signed certificates and upload them to IoT Hub. After completing that tutorial, you're ready to register a device with **X.509 CA signed** authentication.

If your device uses self-signed certificates, then you need two device certificates (a primary and a secondary certificate) on the device and thumbprints for both to upload to IoT Hub. One way to retrieve the thumbprint from a certificate is with the following OpenSSL command:

```bash
openssl x509 -in <certificate filename>.pem -text -fingerprint
```

The thumbprint is included in the output of the command. For example:

```output
SHA1 Fingerprint=D2:68:D9:04:9F:1A:4D:6A:FD:84:77:68:7B:C6:33:C0:32:37:51:12
```

### Add a device

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.
1. Select **Device management** > **Devices**, then select **Add Device** to add a device in your IoT hub.

    <!-- :::image type="content" source="./media/iot-hub-include-create-device/create-identity-portal.png" alt-text="Screen capture that shows how to create a device identity in the portal." border="true"::: -->

1. In **Create a device**, provide the information for your new device identity:

   | Parameter | Dependent parameter | Value |
   | -- | -- | -- |
   | **Device ID** |  | Provide a name for your new device. |
   | **Authentication type** |  | Select either **Symmetric key**, **X.509 self-signed**, or **X.509 CA signed**. |
   |  | **Auto-generate keys** | For **Symmetric key** authentication, check this box to have IoT Hub generate keys for your device. Or, uncheck this box and provide primary and secondary keys for your device. |
   |  | **Primary thumbprint** and **Secondary thumbprint** | For **X.509 self-signed** authentication, provide the thumbprint hash from the device's primary and secondary certificates. |

   [!INCLUDE [iot-hub-pii-note-naming-device](../../includes/iot-hub-pii-note-naming-device.md)]

1. Select **Save**.


### [Azure CLI](#tab/cli)

### [PowerShell](#tab/powershell)

---

## Retrieve device connection information

### [Azure portal](#tab/portal)

1. After the device is created, open the device from the list in the **Devices** pane. Copy the value of **Primary connection string**. This connection string is used by device code to communicate with the IoT hub.

   By default, the keys and connection strings are masked because they're sensitive information. If you click the eye icon, they're revealed. It's not necessary to reveal them to copy them with the copy button.

    <!-- :::image type="content" source="./media/iot-hub-include-create-device/device-details.png" alt-text="Screen capture that shows the device connection string." border="true" lightbox="./media/iot-hub-include-create-device/device-details.png"::: -->

### [Azure CLI](#tab/cli)

### [PowerShell](#tab/powershell)

---

## Disable or delete a device

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