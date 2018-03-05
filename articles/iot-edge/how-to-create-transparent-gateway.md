---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Create a transparent gateway device with Azure IoT Edge | Microsoft Docs 
description: Use Azure IoT Edge to create a transparent gateway device that can process information for multiple devices
services: iot-edge
keywords: 
author: kgremban
manager: timlt

ms.author: kgremban
ms.date: 12/04/2017
ms.topic: article
ms.service: iot-edge

# Optional fields. Don't forget to remove # if you need a field.
# ms.custom: can-be-multiple-comma-separated
# ms.devlang:devlang-from-white-list
# ms.suite: 
# ms.tgt_pltfrm:
# ms.reviewer:
---

# Create an IoT Edge device that acts as a transparent gateway - preview

This article provides detailed instructions for using an IoT Edge device as a transparent gateway. For the rest of this article, the term *IoT Edge gateway* refers to an IoT Edge device used as a transparent gateway. For more detailed information, see [How an IoT Edge device can be used as a gateway][lnk-edge-as-gateway], which gives a conceptual overview. 

>[!NOTE]
>Currently:
> * If the gateway is disconnected from IoT Hub, downstream devices cannot authenticate with the gateway.
> * IoT Edge devices cannot connect to IoT Edge gateways.

## Understand the Azure IoT device SDK


The Edge hub that is installed in all IoT Edge devices exposes the following primitives to downstream devices:

* device-to-cloud and cloud-to-device messages
* direct methods
* device twin operations

Currently, downstream devices are not able to use file upload when connecting through an IoT Edge gateway.

When you connect devices to an IoT Edge gateway using the Azure IoT device SDK, you need to:

* Set up the downstream device with a connection string referring to the gateway device hostname; and
* Make sure that the downstream device trusts the certificate used to accept the connection by the gateway device.

When you install the Azure IoT Edge runtime using the control script, a certificate is created for the Edge hub, as you did in the tutorial [Install IoT Edge on a simulated device on Windows][lnk-tutorial1-win] and [Linux][lnk-tutorial1-lin]. This certificate is used by the Edge hub to accept incoming TLS connections, and has to be trusted by the downstream device when connecting to the gateway device.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security][lnk-iothub-x509] in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the *IoT hub owner CA*), and a series of certificates, signed with this CA, installed in the IoT Edge devices.

>[!IMPORTANT]
>Currently, IoT Edge devices and downstream devices can only use [SAS tokens][lnk-iothub-tokens] to authenticate with IoT Hub. The certificates will be used only to validate the TLS connection between the leaf and gateway device.

Our configuration uses **IoT hub owner CA** as both:
* A signing certificate for the setup of the IoT Edge runtime on all IoT Edge devices; and
* A public key certificate installed in downstream devices.

This results in a solution that enables all devices to use any IoT Edge device as a gateway, as long as they are connected to the same IoT hub.

## Create the certificates for test scenarios

You can use the sample Powershell and Bash scripts described in [Managing CA Certificate Sample][lnk-ca-scripts] to generate a self-signed **IoT hub owner CA** and device certificates signed with it.

>[!IMPORTANT]
>This sample is meant only for test purposes. For production scenarios, refer to [Secure your IoT deployment][lnk-iothub-secure-deployment] for the Azure IoT guidelines on how to secure your IoT solution, and provision your certificate accordingly.


1. Clone the Microsoft Azure IoT SDKs and libraries for C from GitHub:

   ```cmd/sh
   git clone -b modules-preview https://github.com/Azure/azure-iot-sdk-c.git 
   ```

2. To install the certificate scripts, follow the instructions in **Step 1 - Initial Setup** of [Managing CA Certificate Sample][lnk-ca-scripts]. 
3. To generate the **IoT hub owner CA**, follow the instructions in **Step 2 - Create the certificate chain**. This file is used by the downstream devices to validate the connection.
4. To generate a certificate for your gateway device, use either the Bash or PowerShell instructions:

### Bash

Create the new device certificate:

   ```bash
   ./certGen.sh create_edge_device_certificate myGateway
   ```

New files are created: .\certs\new-edge-device.* contains the public key and PFX, and .\private\new-edge-device.key.pem contains the device's private key.
 
In the `certs` directory, run the following command to get the full chain of the device public key:

   ```bash
   cat ./new-edge-device.cert.pem ./azure-iot-test-only.intermediate.cert.pem ./azure-iot-test-only.root.ca.cert.pem > ./new-edge-device-full-chain.cert.pem
   ```

### Powershell

Create the new device certificate: 
   ```powershell
   New-CACertsEdgeDevice myGateway
   ```

New myEdgeDevice* files are created, which contain the public key, private key, and PFX of this certificate. 

When prompted to enter a password during the signing process, enter "1234".

## Configure a gateway device

In order to configure your IoT Edge device as a gateway you just need to configure to use the device certificate created in the previous section.

We assume the following file names from the sample scripts above:

| Output | File name |
| ------ | --------- |
| Device certificate | `certs/new-edge-device.cert.pem` |
| Device private key | `private/new-edge-device.cert.pem` |
| Device certificate chain | `certs/new-edge-device-full-chain.cert.pem` |
| IoT hub owner CA | `certs/azure-iot-test-only.root.ca.cert.pem`  |

Provide the device and certificate information to the IoT Edge runtime. 
 
In Linux, using the Bash output:

   ```bash
   sudo iotedgectl setup --connection-string {device connection string}
        --edge-hostname {gateway hostname, e.g. mygateway.contoso.com}
        --device-ca-cert-file {full path}/certs/new-edge-device.cert.pem
        --device-ca-chain-cert-file {full path}/certs/new-edge-device-full-chain.cert.pem
        --device-ca-private-key-file {full path}/private/new-edge-device.key.pem
        --owner-ca-cert-file {full path}/certs/azure-iot-test-only.root.ca.cert.pem
   ```

In Windows, using the PowerShell output:

   ```powershell
   iotedgectl setup --connection-string {device connection string}
        --edge-hostname {gateway hostname, e.g. mygateway.contoso.com}
        --device-ca-cert-file {full path}/certs/new-edge-device.cert.pem
        --device-ca-chain-cert-file {full path}/certs/new-edge-device-full-chain.cert.pem
        --device-ca-private-key-file {full path}/private/new-edge-device.key.pem
        --owner-ca-cert-file {full path}/RootCA.pem
   ```

By default the sample scripts do not set a passphrase to the device private key. If you set a passphrase, add the following parameter: `--device-ca-passphrase {passphrase}`.

The script prompts you to set a passphrase for the Edge Agent certificate. Restart the IoT Edge runtime after this command:

   ```cmd/sh
   iotedgectl restart
   ```

## Configure a downstream device

A downstream device can be any application using the [Azure IoT device SDK][lnk-devicesdk], such as the simple one described in [Connect your device to your IoT hub using .NET][lnk-iothub-getstarted].

First, a downstream device application has to trust the **IoT hub owner CA** certificate in order to validate the TLS connections to the gateway devices. This step can usually be performed in two ways: at the OS level, or (for certain languages) at the application level.

For instance, for .NET applications, you can add the following snippet to trust a certificate in PEM format stored in path `certPath`. Depending on which version of the script you used, the path references either `certs/azure-iot-test-only.root.ca.cert.pem` (Bash) or `RootCA.pem` (Powershell).

   ```csharp
   using System.Security.Cryptography.X509Certificates;
   
   ...

   X509Store store = new X509Store(StoreName.Root, StoreLocation.CurrentUser);
   store.Open(OpenFlags.ReadWrite);
   store.Add(new X509Certificate2(X509Certificate2.CreateFromCertFile(certPath)));
   store.Close();
   ```

Performing this step at the OS level is different between Windows and across Linux distributions.

The second step is to initialize the IoT Hub device sdk with a connection string referring to the hostname of the gateway device.
This is done by appending the `GatewayHostName` property to your device connection string. For instance, here is a sample device connection string for a device, to which we appended the `GatewayHostName` property:

   ```
   HostName=yourHub.azure-devices-int.net;DeviceId=yourDevice;SharedAccessKey=2BUaYca45uBS/O1AsawsuQslH4GX+SPkrytydWNdFxc=;GatewayHostName=mygateway.contoso.com
   ```

These two steps enable your device application to connect to the gateway device.

## Next steps
[Understand the requirements and tools for developing IoT Edge modules][lnk-module-dev].

[lnk-devicesdk]: ../iot-hub/iot-hub-devguide-sdks.md
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md
[lnk-edge-as-gateway]: ./iot-edge-as-gateway.md
[lnk-module-dev]: module-development.md
[lnk-iothub-getstarted]: ../iot-hub/iot-hub-csharp-csharp-getstarted.md
[lnk-iothub-x509]: ../iot-hub/iot-hub-x509ca-overview.md
[lnk-iothub-secure-deployment]: ../iot-hub/iot-hub-security-deployment.md
[lnk-iothub-tokens]: ../iot-hub/iot-hub-devguide-security.md#security-tokens 
[lnk-iothub-throttles-quotas]: ../iot-hub/iot-hub-devguide-quotas-throttling.md
[lnk-iothub-devicetwins]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-iothub-c2d]: ../iot-hub/iot-hub-devguide-messages-c2d.md
[lnk-ca-scripts]: https://github.com/Azure/azure-iot-sdk-c/blob/modules-preview/tools/CACertificates/CACertificateOverview.md
[lnk-modbus-module]: https://github.com/Azure/iot-edge-modbus
