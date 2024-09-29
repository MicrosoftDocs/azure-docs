---
title: Register and connect an IoT device
titleSuffix: Azure IoT Hub
description: How to create, manage, and delete Azure IoT devices and how to retrieve the device connection string.
author: kgremban

ms.author: kgremban
ms.service: iot-hub
ms.topic: how-to
ms.date: 06/19/2024
---

# Create and manage device identities

Create a device identity for your device to connect to Azure IoT Hub. This article introduces key tasks for managing a device identity including registering the device, collecting its connection information, and then deleting or disabling a device at the end of its lifecycle.

## Prerequisites

* An IoT hub in your Azure subscription. If you don't have a hub yet, you can follow the steps in [Create an IoT hub](create-hub.md).

* Depending on which tool you use, either have access to the [Azure portal](https://portal.azure.com) or [install the Azure CLI](/cli/azure/install-azure-cli).

* If your IoT hub is managed with role-based access control (RBAC), then you need **Read/Write/Delete Device/Module** permissions for the steps in this article. Those permissions are included in [IoT Hub Registry Contributor](../role-based-access-control/built-in-roles/internet-of-things.md#iot-hub-registry-contributor) role.

## Register a device

In this section, you create a device identity in the [identity registry in your IoT hub](./iot-hub-devguide-identity-registry.md). A device can't connect to a hub unless it has a device identity.

The IoT Hub identity registry only stores device identities to enable secure access to the IoT hub. It stores device IDs and keys to use as security credentials, and an enabled/disabled flag that you can use to disable access for an individual device.

When you register a device, you choose its authentication method. IoT Hub supports three methods for device authentication:

* **Symmetric key** - *This option is easiest for quickstart scenarios.*

  When you register a device, you can provide keys or IoT Hub will generate keys for you. Both the device and the IoT hub have a copy of the symmetric key that can be compared when the device connects.

* **X.509 self-signed**

  If your device has a self-signed X.509 certificate, then you need to give IoT Hub a version of the certificate for authentication. When you register a device, you upload a certificate *thumbprint*, which is a hash of the device's X.509 certificate. When the device connects, it presents its certificate and the IoT hub can validate it against the hash it knows. For more information, see [Authenticate identities with X.509 certificates](./authenticate-authorize-x509.md).

* **X.509 CA signed** - *This option is recommended for production scenarios.*

  If your device has a CA-signed X.509 certificate, then you upload a root or intermediate certificate authority (CA) certificate in the signing chain to IoT Hub before you register the device. The device has an X.509 certificate with the verified X.509 CA in its certificate chain of trust. When the device connects, it presents its full certificate chain and the IoT hub can validate it because it knows the X.509 CA. Multiple devices can authenticate against the same verified X.509 CA. For more information, see [Authenticate identities with X.509 certificates](./authenticate-authorize-x509.md).

### Prepare certificates

If you're using either of the X.509 certificate authentication methods, make sure your certificates are ready before registering a device:

* For CA-signed certificates, the tutorial [Create and upload certificates for testing](./tutorial-x509-test-certs.md) provides a good introduction for how to create CA-signed certificates and upload them to IoT Hub. After completing that tutorial, you're ready to register a device with **X.509 CA signed** authentication.

* For self-signed certificates, you need two device certificates (a primary and a secondary certificate) on the device and thumbprints for both to upload to IoT Hub. One way to retrieve the thumbprint from a certificate is with the following OpenSSL command:

  ```bash
  openssl x509 -in <certificate filename>.pem -text -fingerprint
  ```

### Add a device

Create a device identity in your IoT hub.

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Device management** > **Devices**.

1. Select **Add Device** to add a device in your IoT hub.

   :::image type="content" source="./media/create-connect-device/add-device.png" alt-text="Screenshot that shows adding a new device in the Azure portal." lightbox="./media/create-connect-device/add-device.png":::

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

Use the [az iot hub device-identity create](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-create) command to register a device.

The following table describes common parameters used with this command.

| Parameter | Dependent parameter | Value |
| -- | -- | -- |
| `--device-id`, `-d` |  | Provide a name for your new device. |
| `--hub-name`, `-h` |  | IoT hub name or hostname. |
| `--auth-method`, `--am` |  | Either `shared_private_key`, `x509_ca`, or `x509_thumbprint` |
|  | `--primary-key`, `--pk` and `--secondary-key`, `--sk` | Use with `shared_private_key` authentication if you want to provide the primary and secondary keys for your device. Omit if you want IoT Hub to generate the keys. |
|  | `--primary-thumbprint`, `--ptp` and `--secondary-thumbprint`, `--stp` | Use with `x509_thumbprint` authentication to provide the primary and secondary certificate thumbprints for your device. Omit if you want IoT Hub to generate a self-signed certificate and use its thumbprint. |

[!INCLUDE [iot-hub-pii-note-naming-device](../../includes/iot-hub-pii-note-naming-device.md)]

---

## Retrieve device connection string

For samples and test scenarios, the most common connection method is to use symmetric key authentication and connect with a *device connection string*. A device connection string contains the name of the IoT hub, the name of the device, and the device's authentication information. 

For information about other methods for connecting devices, particularly for X.509 authentication, refer to the [Azure IoT Hub device SDKs](./iot-hub-devguide-sdks.md#azure-iot-hub-device-sdks).

Use the following steps to retrieve a device connection string.

### [Azure portal](#tab/portal)

The Azure portal provides device connection strings only for devices that use symmetric key authentication.

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Device management** > **Devices**.

1. Select your device from the list in the **Devices** pane.

1. Copy the value of **Primary connection string**.

   :::image type="content" source="./media/create-connect-device/copy-connection-string.png" alt-text="Screenshot that shows copying the value of the primary connection string from the Azure portal.":::

   By default, the keys and connection strings are masked because they're sensitive information. If you click the eye icon, they're revealed. It's not necessary to reveal them to copy them with the copy button.

### [Azure CLI](#tab/cli)

Use the [az iot hub device-identity connection-string show](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-connection-string-show) command to retrieve a device's connection string. For example:

```bash
az iot hub device-identity connection-string show --device-id <DEVICE_NAME> --hub-name <IOT_HUB_NAME>
```

---

Devices with symmetric key authentication have a device connection string with the following pattern:

`HostName=<IOT_HUB_NAME>;DeviceId=<DEVICE_NAME>;SharedAccessKey=<PRIMARY_OR_SECONDARY_KEY>`

Devices with X.509 authentication, either self-signed or CA-signed, usually don't use device connection strings for authentication. When they do, their connection strings take the following pattern:

`HostName=<IOT_HUB_NAME>;DeviceId=<DEVICE_NAME>;x509=true`

## Disable or delete a device

If you want to keep a device in your IoT hub's identity registry, but want to prevent it from connecting then you can change its status to *disabled.*

### [Azure portal](#tab/portal)

1. In the [Azure portal](https://portal.azure.com), navigate to your IoT hub.

1. Select **Device management** > **Devices**.

1. Select your device from the list in the **Devices** pane.

1. On the device details page, you can disable or delete the device registration.

   * To prevent a device from connecting, set the **Enable connection to IoT Hub** parameter to **Disable**.

     :::image type="content" source="./media/create-connect-device/disable-device.png" alt-text="Screenshot that shows disabling a device in the Azure portal.":::

   * To completely remove a device from your IoT hub's identity registry, select **Delete**.

     :::image type="content" source="./media/create-connect-device/delete-device.png" alt-text="Screenshot that shows deleting a device in the Azure portal.":::

### [Azure CLI](#tab/cli)

To disable a device, use the [az iot hub device-identity update](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-update) command and change the `status` of the device. For example:

```bash
az iot hub device-identity update --device-id <DEVICE_NAME> --hub-name <IOT_HUB_NAME> --set status=disabled
```

To delete a device, use the [az iot hub device-identity delete](/cli/azure/iot/hub/device-identity#az-iot-hub-device-identity-delete) command. For example:

```bash
az iot hub device-identity delete --device-id <DEVICE_NAME> --hub-name <IOT_HUB_NAME>
```

---

## Other tools for managing device identities

You can use other tools or interfaces to manage the IoT Hub identity registry, including:

* **PowerShell commands**: Refer to the [Az.IotHub](/powershell/module/az.iothub/) command set to learn how to manage device identities.

* **Visual Studio Code**: The [Azure IoT Hub extension for Visual Studio Code](./reference-iot-hub-extension.md) includes identity registry capabilities.

* **REST API**: Refer to the [IoT Hub Service APIs](/rest/api/iothub/service/devices) to learn how to manage device identities.
