---
title: Connect downstream devices - Azure IoT Edge | Microsoft Docs
description: How to configure downstream or leaf devices to connect through Azure IoT Edge gateway devices. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 05/15/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Authenticate a downstream device to Azure IoT Hub

In a transparent gateway scenario, downstream (or leaf) devices need identities in IoT Hub like any other device. This article walks through the options for authenticating a downstream device to IoT Hub, and then demonstrates how to declare the gateway connection.

Use this article along with [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md), which explains how to create a trusted connection between the gateway and downstream device.

Downstream devices can authenticate with IoT Hub using one of three methods: symmetric keys, X.509 self-signed certificates, or x.509 certificate authority (CA) signed certificates. The authentication steps are very similar for those used to set up any non-IoT-Edge device with IoT Hub, with small differences for the gateway relationship.

The steps in this article show manual device provisioning, not automatic provisioning with the Azure IoT Hub Device Provisioning Service. 

## Symmetric key authentication

Symmetric key authentication, is the simplest way to authenticate with IoT Hub, and as such is usually the method you see in samples. With symmetric key authentication, a base64 key is associated with your IoT device ID in IoT Hub. You need to include that key in your IoT applications so that your device can present it when it connects to IoT Hub. 

### Create the device identity 

Add a new IoT device in your IoT hub, using either the Azure portal, Azure CLI, or the IoT extension for Visual Studio Code. Remember that downstream devices need to be identified in IoT Hub as regular IoT device, not IoT Edge devices. 

When you create the new device identity, provide the following information: 

* Create an ID for your device.

* Select **Symmetric key** as the authentication type. 

* Optionally, choose to **Set a parent device** and select the IoT Edge gateway device that this downstream device will connect through. This step is optional for symmetric key authentication, but it's recommended because setting a parent device enables [offline capabilities](offline-capabilities.md) for your downstream device. You can always update the device details to add or change the parent later. 

   ![Create device ID with symmetric key auth in portal](./media/how-to-authenticate-downstream-device/symmetric-key-portal.png)

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same operation. The following example creates a new IoT device with symmetric key authentication and assigns a parent device: 

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID}
```

For more information about Azure CLI commands for device creation and parent/child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.

### Connect to IoT Hub through a gateway

For symmetric key authentication, there's no additional steps that you need to take on your device for it to authenticate with IoT Hub. You still need the certificates in place so that your downstream device can connect to its gateway device, as described in [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).

After creating an IoT device identity in the portal, you can retrieve its primary or secondary keys. One of these keys needs to be included in the connection string that you include in any application that communicates with IoT Hub. For symmetric key authentication, IoT Hub provides the fully formed connection string in the device details for your convenience. You need to add extra information about the gateway device to the connection string. 

Symmetric key connection strings for downstream devices need the following components: 

* The IoT hub that the device connects to: `Hostname={iothub name}.azure-devices.net`
* The device ID registered with the hub: `DeviceID={device ID}`
* Either the primary or secondary key: `SharedAccessKey={key}`
* The gateway device that the device connects through. Provide the **hostname** value from the IoT Edge gateway device's config.yaml file: `GatewayHostName={gateway hostname}`

All together, a complete connection string looks like:

``` 
HostName=myiothub.azure-devices.net;DeviceId=myDownstreamDevice;SharedAccessKey=xxxyyyzzz=;GatewayHostName=myGatewayDevice
```

## X.509 authentication 

There are two ways to authenticate an IoT device using X.509 certificates. Whichever way you choose to authenticate, the steps to connect your device to IoT Hub are the same. Choose either self-signed or CA-signed certs for authentication, then continue to learn how to connect to IoT Hub. 

For more information about how IoT Hub uses X.509 authentication, see the following articles: 
* [Device authentication using X.509 CA certificates](../iot-hub/iot-hub-x509ca-overview.md)
* [Conceptual understanding of X.509 CA certificates in the IoT industry](../iot-hub/iot-hub-x509ca-concept.md)

### Create the device identity with X.509 self-signed certificates

For X.509 self-signed authentication, sometimes referred to as thumbprint authentication, you need to create new certificates to place on your IoT device. These certificates have a thumbprint in them that you share with IoT Hub for authentication. 

The easiest way to do test this scenario is to use the same machine that you used to create certificates in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md). That machine should already be set up with the right tool, root CA certificate, and intermediate CA certificate to create the IoT device certificates. You can copy the final certificates and their private keys over to your downstream device afterwards. Following the steps in the gateway article, you set up openssl on your machine, then cloned the IoT Edge repo to access certificate creation scripts. Then, you made a working directory that we call **\<WRKDIR>** to hold the certificates. The default certificates are meant for developing and testing, so only last 30 days. You should have created a root CA certificate and an intermediate certificate. 

1. Navigate to your working directory in either a bash or PowerShell window. 

2. Create two certificates (primary and secondary) for the downstream device. Provide your device name and then the primary or secondary label. This information is used to name the files so that you can keep track of certificates for multiple devices. 

   ```PowerShell
   New-CACertsDevice "<device name>-primary"
   New-CACertsDevice "<device name>-secondary"
   ```

   ```bash
   ./certGen.sh create_device_certificate "<device name>-primary"
   ./certGen.sh create_device_certificate "<device name>-secondary"
   ```

3. Retrieve the SHA1 fingerprint (called a thumbprint in the IoT Hub interface) from each certificate, which is a 40 hexadecimal character string. Use the following openssl command to view the certificate and find the fingerprint:

   ```PowerShell/bash
   openssl x509 -in <WORKDIR>/certs/iot-device-<device name>-primary.cert.pem -text -fingerprint | sed 's/[:]//g'
   ```

4. Navigate to your IoT hub in the Azure portal and create a new IoT device identity with the following values: 

   * Select **X.509 Self-Signed** as the authentication type.
   * Paste the hexadecimal strings that you copied from your device's primary and secondary certificates.
   * Select **Set a parent device** and choose the IoT Edge gateway device that this downstream device will connect through. A parent device is required for X.509 authentication of a downstream device. 

   ![Create device ID with x.509 self-signed auth in portal](./media/how-to-authenticate-downstream-device/x509-self-signed-portal.png)

5. Copy the following files to your downstream device:

   * `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device name>*.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device name>*-full-chain.cert.pem`
   * `<WRKDIR>\private\iot-device-<device name>*.key.pem`

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example creates a new IoT device with x.509 self-signed authentication and assigns a parent device: 

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID} --am x509_thumbprint --ptp {primary thumbprint} --stp {secondary thumbprint}
```

For more information about Azure CLI commands for device creation, certificate generation, and parent and child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.

### Create the device identity with X.509 CA signed certificates

For X.509 certificate authority (CA) signed authentication, you need a root CA certificate registered in IoT Hub that you use to sign certificates for your IoT device. Any device using a certificate that was issues by the root CA certificate or any of its intermediate certificates will be permitted to authenticate. 

This section is based on the instructions detailed in the IoT Hub article [Set up X.509 security in your Azure IoT hub](../iot-hub/iot-hub-security-x509-get-started.md). Follow the steps in this section to know which values to use to set up a downstream device that connects through a gateway. 

The easiest way to test this scenario is to use the same machine that you used to create certificates in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md). That machine should already be set up with the right tool, root CA certificate, and intermediate CA certificate to create the IoT device certificates. You can copy the final certificates and their private keys over to your downstream device afterwards. Following the steps in the gateway article, you set up openssl on your machine, then cloned the IoT Edge repo to access certificate creation scripts. Then, you made a working directory that we call **\<WRKDIR>** to hold the certificates. The default certificates are meant for developing and testing, so only last 30 days. You should have created a root CA certificate and an intermediate certificate. 

1. Follow the instructions in the [Register X.509 CA certificates to your IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#register-x509-ca-certificates-to-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps: 

   * Upload a root CA certificate. If you're using the certificates that you created in the transparent gateway article, upload **\<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem** as the root certificate file. 
   * Verify that you own that root CA certificate. You can verify possession with the cert tools in \<WRKDIR>. 

      ```powershell
      New-CACertsVerificationCert "<verification code from Azure portal>"
      ```

      ```bash
      ./certGen.sh create_verification_certificate <verification code from Azure portal>"
      ```

2. Follow the instructions in the [Create an X.509 device for your IoT hub](../iot-hub/iot-hub-security-x509-get-started.md#create-an-x509-device-for-your-iot-hub) section of *Set up X.509 security in your Azure IoT hub*. In that section, you perform the following steps: 

   * Add a new device. Provide a lowercase name for **device ID**, and choose the authentication type **X.509 CA Signed**. 
   * For *downstream devices*, you must **Set a parent device** and choose the IoT Edge device that will provide the connection to IoT Hub. 

3. Create a certificate chain for your downstream device. Use the same root CA certificate that you uploaded to IoT Hub to make this chain. Use the same lowercase device ID that you gave to your device identity in the portal.

   ```powershell
   New-CACertsDevice "<device id>"
   ```

   ```bash
   ./certGen.sh create_device_certificate "<device id>"
   ```

4. Copy the following files to your downstream device: 

   * `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device id>*.cert.pem`
   * `<WRKDIR>\certs\iot-device-<device id>*-full-chain.cert.pem`
   * `<WRKDIR>\private\iot-device-<device id>*.key.pem`

You can use the [IoT extension for Azure CLI](https://github.com/Azure/azure-iot-cli-extension) to complete the same device creation operation. The following example creates a new IoT device with x.509 CA signed authentication and assigns a parent device: 

```cli
az iot hub device-identity create -n {iothub name} -d {device ID} --pd {gateway device ID} --am x509_ca
```

For more information about Azure CLI commands for device creation and parent/child management, see the reference content for [az iot hub device-identity](https://docs.microsoft.com/cli/azure/ext/azure-cli-iot-ext/iot/hub/device-identity?view=azure-cli-latest) commands.


### Connect to IoT Hub through a gateway

The way that you connect an X.509 authenticated device to IoT Hub is different depending on the SDK that you use. 