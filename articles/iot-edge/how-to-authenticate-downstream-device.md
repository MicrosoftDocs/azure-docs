---
title: Authenticate downstream devices - Azure IoT Edge | Microsoft Docs
description: How to authenticate downstream devices or leaf devices to IoT Hub, and route their connection through Azure IoT Edge gateway devices. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 12/13/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Authenticate a downstream device to Azure IoT Hub

In a transparent gateway scenario, downstream devices (sometimes called leaf devices or child devices) need identities in IoT Hub like any other device. This article walks through the options for authenticating a downstream device to IoT Hub, and then demonstrates how to declare the gateway connection.

There are three general steps to set up a successful transparent gateway connection. This article covers the second step:

1. The gateway device needs to be able to securely connect to downstream devices, receive communications from downstream devices, and route messages to the proper destination. For more information, see [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md).
2. **The downstream device needs to have a device identity to be able to authenticate with IoT Hub, and know to communicate through its gateway device.**
3. The downstream device needs to connect to its gateway device securely. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

Downstream devices can authenticate with IoT Hub using one of three methods: symmetric keys (sometimes referred to as shared access keys), X.509 self-signed certificates, or X.509 certificate authority (CA) signed certificates. The authentication steps are similar to the steps used to set up any non-IoT-Edge device with IoT Hub, with small differences to declare the gateway relationship.

The steps in this article show manual device provisioning, not automatic provisioning with the Azure IoT Hub Device Provisioning Service (DPS). Provisioning downstream devices with DPS is not supported.

## Prerequisites

Complete the steps in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md). If you're using X.509 authentication for your downstream device, you need to use the same certificate generating script that you set up in the transparent gateway article.

This article refers to the *gateway hostname* at several points. The gateway hostname is declared in the **hostname** parameter of the config.yaml file on the IoT Edge gateway device. It's referred to in the connection string of the downstream device. The gateway hostname needs to be resolvable to an IP Address, either using DNS or a host file entry.

## Register device (Symmetric key)

Symmetric key authentication, or shared access key authentication, is the simplest way to authenticate with IoT Hub. With symmetric key authentication, a base64 key is associated with your IoT device ID in IoT Hub. You include that key in your IoT applications so that your device can present it when it connects to IoT Hub.

### Create the device identity

Add a new IoT device in your IoT hub, using either the Azure portal, Azure CLI, or the IoT extension for Visual Studio Code. Remember that downstream devices need to be identified in IoT Hub as regular IoT devices, not IoT Edge devices.

When you create the new device identity, provide the following information:

* Create an ID for your device.

* Select **Symmetric key** as the authentication type.

* Optionally, choose to **Set a parent device** and select the IoT Edge gateway device that this downstream device will connect through. This step is optional for symmetric key authentication, but it's recommended because setting a parent device enables [offline capabilities](offline-capabilities.md) for your downstream device. You can always update the device details to add or change the parent later.

   ![Create device ID with symmetric key auth in portal](./media/how-to-authenticate-downstream-device/symmetric-key-portal.png)

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same operation. The following example creates a new IoT device with symmetric key authentication and assigns a parent device:

```cli
az iot hub device-identity create -n {iothub name} -d {new device ID} --pd {existing gateway device ID}
```

For more information about Azure CLI commands for device creation and parent/child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.


Next, [Retrieve and modify the connection string](#retrieve-and-modify-connection-string) so that your device knows to connect via its gateway.

## Register device (X.509 self-signed)

For X.509 self-signed authentication, sometimes referred to as thumbprint authentication, you need to create new certificates to place on your IoT device. These certificates have a thumbprint in them that you share with IoT Hub for authentication.

If you don't have a certificate authority to create X.509 certificates, you can [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). When generating test certificates for your downstream device, use the same root CA certificate that generated the certificates for your gateway device.

1. Using your CA certificate, create two device certificates (primary and secondary) for the downstream device.

   The device certificate must have the Subject Name set to the Device ID that you will use when registering the IoT device in the Azure IoT Hub. This setting is required for authentication.

2. Retrieve the SHA1 fingerprint (called a thumbprint in the IoT Hub interface) from each certificate, which is a 40 hexadecimal character string. Use the following openssl command to view the certificate and find the fingerprint:

   ```PowerShell/bash
   openssl x509 -in <primary device certificate>.cert.pem -text -fingerprint | sed 's/[:]//g'
   ```

   Run this command twice, once for the primary certificate and once for the secondary certificate. You provide fingerprints for both certificates when you register a new IoT device using self-signed X.509 certificates.

3. Navigate to your IoT hub in the Azure portal and create a new IoT device identity with the following values:

   * Provide the **Device ID** that matches the subject name of your device certificates.
   * Select **X.509 Self-Signed** as the authentication type.
   * Paste the hexadecimal strings that you copied from your device's primary and secondary certificates.
   * Select **Set a parent device** and choose the IoT Edge gateway device that this downstream device will connect through. A parent device is required for X.509 authentication of a downstream device.

   ![Create device ID with X.509 self-signed auth in portal](./media/how-to-authenticate-downstream-device/x509-self-signed-portal.png)

4. Copy the device certificate and keys to any location on the downstream device. Also move a copy of the shared root CA certificate that generated both the gateway device certificate and the downstream device certificates.

   You'll reference these files in the leaf device applications that connect to IoT Hub. You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.

5. Depending on your preferred language, review samples of how X.509 certificates can be referenced in IoT applications:

   * C#: [Set up X.509 security in your Azure IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#authenticate-your-x509-device-with-the-x509-certificates)
   * C: [iotedge_downstream_device_sample](https://github.com/Azure/azure-iot-sdk-c/tree/x509_edge_bugbash/iothub_client/samples/iotedge_downstream_device_sample)
   * Node.js: [simple_sample_device_x509.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/simple_sample_device_x509.js)
   * Java: [SendEventX509.java](https://github.com/Azure/azure-iot-sdk-python/blob/master/device/samples/iothub_client_sample_x509.py)
   * Python: [send_message_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/advanced-hub-scenarios/send_message_x509.py)

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example creates a new IoT device with X.509 self-signed authentication and assigns a parent device:

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID} --am x509_thumbprint --ptp {primary thumbprint} --stp {secondary thumbprint}
```

For more information about Azure CLI commands for device creation, certificate generation, and parent and child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.

Next, [Retrieve and modify the connection string](#retrieve-and-modify-connection-string) so that your device knows to connect via its gateway.

## Register device (X.509 CA signed)

For X.509 certificate authority (CA) signed authentication, you need a root CA certificate registered in IoT Hub that you use to sign certificates for your IoT device. Any device using a certificate that was issues by the root CA certificate or any of its intermediate certificates will be permitted to authenticate.

This section is based on the instructions detailed in the IoT Hub article [Set up X.509 security in your Azure IoT hub](../iot-hub/iot-hub-security-x509-get-started.md). Follow the steps in this section to know which values to use to set up a downstream device that connects through a gateway.

If you don't have a certificate authority to create X.509 certificates, you can [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md). When generating test certificates for your downstream device, use the same root CA certificate that generated the certificates for your gateway device.

1. Follow the instructions in the [Register X.509 CA certificates to your IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#register-x509-ca-certificates-to-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps:

   1. Upload a root CA certificate. If you're using the demo certificates, the root CA is **\<path>/certs/azure-iot-test-only.root.ca.cert.pem**.

   2. Verify that you own that root CA certificate.

2. Follow the instructions in the [Create an X.509 device for your IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#create-an-x509-device-for-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps:

   1. Add a new device. Provide a lowercase name for **device ID**, and choose the authentication type **X.509 CA Signed**.
   2. Set a parent device. For downstream devices, select **Set a parent device** and choose the IoT Edge gateway device that will provide the connection to IoT Hub.

3. Create a certificate chain for your downstream device. Use the same root CA certificate that you uploaded to IoT Hub to make this chain. Use the same lowercase device ID that you gave to your device identity in the portal.

4. Copy the device certificate and keys to any location on the downstream device. Also move a copy of the shared root CA certificate that generated both the gateway device certificate and the downstream device certificates.

   You'll reference these files in the leaf device applications that connect to IoT Hub. You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.

5. Depending on your preferred language, review samples of how X.509 certificates can be referenced in IoT applications:

   * C#: [Set up X.509 security in your Azure IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#authenticate-your-x509-device-with-the-x509-certificates)
   * C: [iotedge_downstream_device_sample](https://github.com/Azure/azure-iot-sdk-c/tree/x509_edge_bugbash/iothub_client/samples/iotedge_downstream_device_sample)
   * Node.js: [simple_sample_device_x509.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/simple_sample_device_x509.js)
   * Java: [SendEventX509.java](https://github.com/Azure/azure-iot-sdk-python/blob/master/device/samples/iothub_client_sample_x509.py)
   * Python: [send_message_x509.py](https://github.com/Azure/azure-iot-sdk-python/blob/master/azure-iot-device/samples/advanced-hub-scenarios/send_message_x509.py)

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example creates a new IoT device with X.509 CA signed authentication and assigns a parent device:

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID} --am x509_ca
```

For more information, see the Azure CLI reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.

Next, [Retrieve and modify the connection string](#retrieve-and-modify-connection-string) so that your device knows to connect via its gateway.

## Retrieve and modify connection string

After creating an IoT device identity in the portal, you can retrieve its primary or secondary keys. One of these keys needs to be included in the connection string that applications use to communicate with IoT Hub. For symmetric key authentication, IoT Hub provides the fully formed connection string in the device details for your convenience. You need to add extra information about the gateway device to the connection string.

Connection strings for downstream devices need the following components:

* The IoT hub that the device connects to: `Hostname={iothub name}.azure-devices.net`
* The device ID registered with the hub: `DeviceID={device ID}`
* Either the primary or secondary key: `SharedAccessKey={key}`
* The gateway device that the device connects through. Provide the **hostname** value from the IoT Edge gateway device's config.yaml file: `GatewayHostName={gateway hostname}`

All together, a complete connection string looks like:

```
HostName=myiothub.azure-devices.net;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz;GatewayHostName=myGatewayDevice
```

If you established a parent/child relationship for this downstream device, then you can simplify the connection string by calling the gateway directly as the connection host. Parent/child relationships are required for X.509 authentication but optional for symmetric key authentication. For example:

```
HostName=myGatewayDevice;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz
```

At this point, you should have an IoT Edge device registered and configured as a gateway. You also have a downstream IoT device registered and pointing to its gateway device. The final step is to place certificates on your downstream device so that it can securely connect to the gateway.

Continue on to the next article in the gateway series, [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

## Next steps

By completing this article, you should have an IoT Edge device working as a transparent gateway and a downstream device registered with an IoT hub. Next, you need to configure your downstream devices to trust the gateway device and connect to it securely. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).
