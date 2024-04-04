---
title: Authenticate downstream devices - Azure IoT Edge | Microsoft Docs
description: How to authenticate downstream devices to IoT Hub, and route their connection through Azure IoT Edge gateway devices. 
author: PatAltimore

ms.author: patricka
ms.date: 04/29/2022
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Authenticate a downstream device to Azure IoT Hub

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

In a transparent gateway scenario, downstream devices (sometimes called child devices) need identities in IoT Hub like any other device. This article walks through the options for authenticating a downstream device to IoT Hub, and then demonstrates how to declare the gateway connection. 

>[!NOTE]
>A downstream device emits data directly to the Internet or to gateway devices (IoT Edge-enabled or not). A child device can be a downstream device or a gateway device in a nested topology.

There are three general steps to set up a successful transparent gateway connection. This article covers the second step:

1. Configure the gateway device as a server so that downstream devices can connect to it securely. Set up the gateway to receive messages from downstream devices and route them to the proper destination. For those steps, see [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md).
2. **Create a device identity for the downstream device so that it can authenticate with IoT Hub. Configure the downstream device to send messages through the gateway device.**
3. Connect the downstream device to the gateway device and start sending messages. For those steps, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

Downstream devices can authenticate with IoT Hub using one of three methods: symmetric keys (sometimes referred to as shared access keys), X.509 self-signed certificates, or X.509 certificate authority (CA) signed certificates. The authentication steps are similar to the steps used to set up any non-IoT-Edge device with IoT Hub, with small differences to declare the gateway relationship.

Automatic provisioning downstream devices with the Azure IoT Hub Device Provisioning Service (DPS) is not supported.

## Prerequisites

Complete the steps in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md).

If you're using X.509 authentication, you will generate certificates for your downstream device. Have the same root CA certificate and the certificate generating script that you used for the transparent gateway article available to use again.

This article refers to the *gateway hostname* at several points. The gateway hostname is declared in the **hostname** parameter of the config file on the IoT Edge gateway device. It's referred to in the connection string of the downstream device. The gateway hostname needs to be resolvable to an IP Address, either using DNS or a host file entry on the downstream device.

## Register device with IoT Hub

Choose how you want your downstream device to authenticate with IoT Hub:

* [Symmetric key authentication](#symmetric-key-authentication): IoT Hub creates a key that you put on the downstream device. When the device authenticates, IoT Hub checks that the two keys match. You don't need to create additional certificates to use symmetric key authentication.

  This method is quicker to get started if you're testing gateways in a development or test scenario.

* [X.509 self-signed authentication](#x509-self-signed-authentication): Sometimes called thumbprint authentication, because you share the thumbprint from the device's X.509 certificate with IoT Hub.

  Certificate authentication is recommended for devices in production scenarios.

* [X.509 CA-signed authentication](#x509-ca-signed-authentication): Upload the root CA certificate to IoT Hub. When devices present their X.509 certificate for authentication, IoT Hub checks that it belongs to a chain of trust signed by the same root CA certificate.

  Certificate authentication is recommended for devices in production scenarios.

### Symmetric key authentication

Symmetric key authentication, or shared access key authentication, is the simplest way to authenticate with IoT Hub. With symmetric key authentication, a base64 key is associated with your IoT device ID in IoT Hub. You include that key in your IoT applications so that your device can present it when it connects to IoT Hub.

Add a new IoT device in your IoT hub, using either the Azure portal, Azure CLI, or the IoT extension for Visual Studio Code. Remember that downstream devices need to be identified in IoT Hub as regular IoT devices, not IoT Edge devices.

When you create the new device identity, provide the following information:

* Create an ID for your device.

* Select **Symmetric key** as the authentication type.

* Select **Set a parent device** and select the IoT Edge gateway device that this downstream device will connect through. You can always change the parent later.

   :::image type="content" source="./media/how-to-authenticate-downstream-device/symmetric-key-portal.png" alt-text="Screenshot of how to create a device ID with symmetric key authorization in the Azure portal.":::

   >[!NOTE]
   >Setting the parent device used to be an optional step for downstream devices that use symmetric key authentication. However, starting with IoT Edge version 1.1.0 every downstream device must be assigned to a parent device.
   >
   >You can configure the IoT Edge hub to go back to the previous behavior by setting the environment variable **AuthenticationMode** to the value **CloudAndScope**.

You also can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same operation. The following example uses the [az iot hub device-identity](/cli/azure/iot/hub/device-identity) command to create a new IoT device with symmetric key authentication and assign a parent device:

```azurecli
az iot hub device-identity create -n {iothub name} -d {new device ID} --device-scope {deviceScope of parent device}
```

> [!TIP]
> You can list device properties including device scope using `az iot hub device-identity list --hub-name {iothub name}`.

Next, [Retrieve and modify the connection string](#retrieve-and-modify-connection-string) so that your device knows to connect via its gateway.

### X.509 self-signed authentication

For X.509 self-signed authentication, sometimes referred to as thumbprint authentication, you need to create certificates to place on your downstream device. These certificates have a thumbprint in them that you share with IoT Hub for authentication.

1. Using your CA certificate, create two device certificates (primary and secondary) for the downstream device.

   If you don't have a certificate authority to create X.509 certificates, you can use the IoT Edge demo certificate scripts to [Create downstream device certificates](how-to-create-test-certificates.md#create-downstream-device-certificates). Follow the steps for creating self-signed certificates. Use the same root CA certificate that generated the certificates for your gateway device.

   If you create your own certificates, make sure that the device certificate's subject name is set to the device ID that you use when registering the IoT device in the Azure IoT Hub. This setting is required for authentication.

2. Retrieve the SHA1 fingerprint (called a thumbprint in the IoT Hub interface) from each certificate, which is a 40 hexadecimal character string. Use the following openssl command to view the certificate and find the fingerprint:

   * Windows:

     ```PowerShell
     openssl x509 -in <path to primary device certificate>.cert.pem -text -fingerprint
     ```

   * Linux:

     ```Bash
     openssl x509 -in <path to primary device certificate>.cert.pem -text -fingerprint | sed 's/[:]//g'
     ```

   Run this command twice, once for the primary certificate and once for the secondary certificate. You provide fingerprints for both certificates when you register a new IoT device using self-signed X.509 certificates.

3. Navigate to your IoT hub in the Azure portal and create a new IoT device identity with the following values:

   * Provide the **Device ID** that matches the subject name of your device certificates.
   * Select **X.509 Self-Signed** as the authentication type.
   * Paste the hexadecimal strings that you copied from your device's primary and secondary certificates.
   * Select **Set a parent device** and choose the IoT Edge gateway device that this downstream device will connect through. You can always change the parent later.

   :::image type="content" source="./media/how-to-authenticate-downstream-device/x509-self-signed-portal.png" alt-text="Screenshot that shows how to create a device ID with an X.509 self-signed authorization in the Azure portal.":::

4. Copy both the primary and secondary device certificates and their keys to any location on the downstream device. Also move a copy of the shared root CA certificate that generated both the gateway device certificate and the downstream device certificates.

   You'll reference these certificate files in any applications on the downstream device that connect to IoT Hub. You can use a service like [Azure Key Vault](../key-vault/index.yml) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.

5. Depending on your preferred language, review samples of how X.509 certificates can be referenced in IoT applications:

   * C#: [Set up X.509 security in your Azure IoT hub](../iot-hub/tutorial-x509-test-certificate.md)
   * C: [iotedge_downstream_device_sample.c](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iotedge_downstream_device_sample)
   * Node.js: [simple_sample_device_x509.js](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_x509.js)
   * Java: [SendEventX509.java](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/send-event-x509)
   * Python: [send_message_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/v2/samples/async-hub-scenarios/send_message_x509.py)

You also can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example uses the [az iot hub device-identity](/cli/azure/iot/hub/device-identity) command to create a new IoT device with X.509 self-signed authentication and assigns a parent device:

```azurecli
az iot hub device-identity create -n {iothub name} -d {device ID} --device-scope {deviceScope of gateway device} --am x509_thumbprint --ptp {primary thumbprint} --stp {secondary thumbprint}
```

> [!TIP]
> You can list device properties including device scope using `az iot hub device-identity list --hub-name {iothub name}`.

Next, [Retrieve and modify the connection string](#retrieve-and-modify-connection-string) so that your device knows to connect via its gateway.

### X.509 CA-signed authentication

For X.509 certificate authority (CA) signed authentication, you need a root CA certificate registered in IoT Hub that you use to sign certificates for your downstream device. Any device using a certificate that was issues by the root CA certificate or any of its intermediate certificates will be permitted to authenticate.

This section is based on the IoT Hub X.509 certificate tutorial series. See [Understanding Public Key Cryptography and X.509 Public Key Infrastructure](../iot-hub/tutorial-x509-introduction.md) for the introduction of this series.

1. Using your CA certificate, create two device certificates (primary and secondary) for the downstream device.

   If you don't have a certificate authority to create X.509 certificates, you can use the IoT Edge demo certificate scripts to [Create downstream device certificates](how-to-create-test-certificates.md#create-downstream-device-certificates). Follow the steps for creating CA-signed certificates. Use the same root CA certificate that generated the certificates for your gateway device.

2. Follow the instructions in the [Demonstrate proof of possession](../iot-hub/tutorial-x509-openssl.md#step-7---demonstrate-proof-of-possession) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps:

   1. Upload a root CA certificate. If you're using the demo certificates, the root CA is **\<path>/certs/azure-iot-test-only.root.ca.cert.pem**.

   2. Verify that you own that root CA certificate.

3. Follow the instructions in the [Create a device in your IoT Hub](../iot-hub/tutorial-x509-openssl.md#step-8---create-a-device-in-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps:

   1. Add a new device. Provide a lowercase name for **device ID**, and choose the authentication type **X.509 CA Signed**.

   2. Set a parent device. Select **Set a parent device** and choose the IoT Edge gateway device that will provide the connection to IoT Hub.

4. Create a certificate chain for your downstream device. Use the same root CA certificate that you uploaded to IoT Hub to make this chain. Use the same lowercase device ID that you gave to your device identity in the portal.

5. Copy the device certificate and keys to any location on the downstream device. Also move a copy of the shared root CA certificate that generated both the gateway device certificate and the downstream device certificates.

   You'll reference these files in any applications on the downstream device that connect to IoT Hub. You can use a service like [Azure Key Vault](../key-vault/index.yml) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.

6. Depending on your preferred language, review samples of how X.509 certificates can be referenced in IoT applications:

   * C#: [Set up X.509 security in your Azure IoT hub](../iot-hub/tutorial-x509-test-certificate.md)
   * C: [iotedge_downstream_device_sample.c](https://github.com/Azure/azure-iot-sdk-c/tree/master/iothub_client/samples/iotedge_downstream_device_sample)
   * Node.js: [simple_sample_device_x509.js](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_x509.js)
   * Java: [SendEventX509.java](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/send-event-x509)
   * Python: [send_message_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/v2/samples/async-hub-scenarios/send_message_x509.py)

You also can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example uses the [az iot hub device-identity](/cli/azure/iot/hub/device-identity) command to create a new IoT device with X.509 CA signed authentication and assigns a parent device:

```azurecli
az iot hub device-identity create -n {iothub name} -d {device ID} --device-scope {deviceScope of gateway device} --am x509_ca
```

> [!TIP]
> You can list device properties including device scope using `az iot hub device-identity list --hub-name {iothub name}`.

Next, [Retrieve and modify the connection string](#retrieve-and-modify-connection-string) so that your device knows to connect via its gateway.

## Retrieve and modify connection string

After creating an IoT device identity in the portal, you can retrieve its primary or secondary keys. One of these keys needs to be included in the connection string that applications use to communicate with IoT Hub. For symmetric key authentication, IoT Hub provides the fully formed connection string in the device details for your convenience. You need to add extra information about the gateway device to the connection string.

Connection strings for downstream devices need the following components:

* The IoT hub that the device connects to: `Hostname={iothub name}.azure-devices.net`
* The device ID registered with the hub: `DeviceID={device ID}`
* The authentication method, whether symmetric key or X.509 certificates
  * If using symmetric key authentication provide either the primary or secondary key: `SharedAccessKey={key}`
  * If using X.509 certificate authentication, provide a flag: `x509=true`
* The gateway device that the device connects through. Provide the **hostname** value from the IoT Edge gateway device's config file: `GatewayHostName={gateway hostname}`

All together, a complete connection string looks like:

```console
HostName=myiothub.azure-devices.net;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz;GatewayHostName=myGatewayDevice
```

Or:

```console
HostName=myiothub.azure-devices.net;DeviceId=myDownstreamDevice;x509=true;GatewayHostName=myGatewayDevice
```

Thanks to the parent/child relationship, you can simplify the connection string by calling the gateway directly as the connection host. For example:

```console
HostName=myGatewayDevice;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz
```

You'll use this modified connection string in the next article of the transparent gateway series.

## Next steps

At this point, you have an IoT Edge device registered with your IoT hub and configured as a transparent gateway. You also have a downstream device registered with your IoT hub and pointing to its gateway device.

Next, you need to configure your downstream device to trust the gateway device and connect to it securely. Continue on to the next article in the transparent gateway series, [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).
