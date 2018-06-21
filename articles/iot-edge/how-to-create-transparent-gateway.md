---
title: Create a transparent gateway with Azure IoT Edge | Microsoft Docs 
description: Use Azure IoT Edge to create a transparent gateway that can process information for multiple devices
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 6/20/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create an IoT Edge device that acts as a transparent gateway

This article provides detailed instructions for using an IoT Edge device as a transparent gateway. For the rest of this article, the term *IoT Edge gateway* refers to an IoT Edge device used as a transparent gateway. For more detailed information, see [How an IoT Edge device can be used as a gateway][lnk-edge-as-gateway], which gives a conceptual overview. 

>[!NOTE]
>Currently:
> * If the gateway is disconnected from IoT Hub, downstream devices cannot authenticate with the gateway.
> * IoT Edge devices cannot connect to IoT Edge gateways.
> * Downstream devices can not use file upload.

The hard part about creating a transparent gateway is securely connecting the gateway to downstream devices. Azure IoT Edge allows you to use PKI infrastructure to set up secure TLS connections between these devices. In this case we’re allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway.  To maintain reasonable security, the downstream device should confirm the identity of the Edge device because you only want your devices connecting to your gateways and not a potentially malicious gateway.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security][lnk-iothub-x509] in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub owner CA), and a series of certificates, signed with this CA, and a CA for the Edge device.

![Gateway setup][1]

The gateway presents its Edge device CA cert to the downstream device during the initiation of the connection. The downstream device checks to make sure the Edge device CA cert is signed by the owner CA cert. This process allows the downstream device to confirm the gateway comes from a trusted source.

The following steps walk you through the process of creating the certs and installing them in the right places.

## Pre requisites
1.	Install the `__TODO__` with the command below. This script helps you create the necessary certs to set up a transparent gateway.

        `command to install script`

2.	Install the Azure IoT Edge runtime on a device you want to use as the transparent gateway.
    * [Linux install instructions][lnk-install-linux]
    * [Windows install instructions][lnk-install-windows]

## Cert creation
1.	Create the owner CA cert and one intermediate cert. These are all placed in the current working directory.

        `command`

2.	Create the Edge device CA cert and private key with the command below.

        `command`

## Cert chain creation
Create a cert chain from the owner CA cert, intermediate cert, and Edge device CA cert with the command below. Placing it in a chain file allows you to easily install it on you Edge device acting as a transparent gateway. 

    `command`

## Installation on the gateway
1.	Copy the `__.pm` file to `___` on the Edge device you want to use as the transparent gateway. 
2.	Copy the `key.pem` file to `___` on the Edge device you want to use as the transparent gateway.
3.	Set the `____` property in the Security Daemon config yaml file to the path where you placed the `____.pem` file.
4.	Set the `____` property in the Security Daemon config yaml file to the path where you placed the `____.key` file.

## Installation on the downstream device
A downstream device can be any application using the [Azure IoT device SDK][lnk-devicesdk], such as the simple one described in [Connect your device to your IoT hub using .NET][lnk-iothub-getstarted]. A downstream device application has to trust the **owner CA** certificate in order to validate the TLS connections to the gateway devices. This step can usually be performed in two ways: at the OS level or (for certain languages) at the application level.

### OS trust 
__TODO__: write snippet about how to copy file to system and install it in the OS. 

### Appliaction trust
For .NET applications, you can add the following snippet to trust a certificate in PEM format stored in path `certPath`. Make sure you've coppied the file `___.pem` created in step #1 of the Cert creation section to `certPath` on the downstream device.

   ```
   using System.Security.Cryptography.X509Certificates;
   
   ...

   X509Store store = new X509Store(StoreName.Root, StoreLocation.CurrentUser);
   store.Open(OpenFlags.ReadWrite);
   store.Add(new X509Certificate2(X509Certificate2.CreateFromCertFile(certPath)));
   store.Close();
   ``` 

## Connect the downstream device to the gateway
You must initialize the IoT Hub device sdk with a connection string referring to the hostname of the gateway device. This is done by appending the `GatewayHostName` property to your device connection string. For instance, here is a sample device connection string for a device, to which we appended the `GatewayHostName` property:

   ```
   HostName=yourHub.azure-devices.net;DeviceId=yourDevice;SharedAccessKey=2BUaYca45uBS/O1AsawsuQslH4GX+SPkrytydWNdFxc=;GatewayHostName=mygateway.contoso.com
   ```

## Routing messages from downstream devices
The IoT Edge runtime can route messages sent from downstream devices just like messages sent by modules. This allows you to preform analytics in a module running on the gateway before sending any data to the cloud. The below route would be used to send messages from a downstream device named `____` to a module name `ai_insights`.

    `sample route`

Refer to the [module composition article][lnk-module-composition] for more details on message routing.

## Next steps
[Understand the requirements and tools for developing IoT Edge modules][lnk-module-dev].

<!-- Images -->
[1]: ./media/how-to-create-transparent-gateway/gateway-setup.png

<!-- Links -->
[lnk-install-linux]: __TODO__
[lnk-install-windows]: __TODO__
[lnk-module-composition]: ./module-composition.md

[lnk-devicesdk]: ../iot-hub/iot-hub-devguide-sdks.md
[lnk-tutorial1-win]: quickstart.md
[lnk-tutorial1-lin]: quickstart-linux.md
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
