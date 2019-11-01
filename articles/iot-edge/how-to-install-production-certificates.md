---
title: Install certificates on device - Azure IoT Edge | Microsoft Docs
description: Create test certificates and learn how to install them on an Azure IoT Edge device to prepare for production deployment. 
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 10/29/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Install production certificates on an IoT Edge device

All IoT Edge devices use certificates to create secure connections between the runtime and any modules running on the device.
IoT Edge devices functioning as gateways use these same certificates to connect to their downstream devices, too. 

When you first install IoT Edge and provision your device, the device is set up with temporary certificates so that you can test the service.
These certificates expire in 30 days, or can be reset by restarting your machine.
Once you're ready to move your devices into a production scenario you need to provide your own certificates for security and maintenance.
This article demonstrates the steps to install certificates on your IoT Edge devices.

To learn more about the different types of certificates and their roles in an IoT Edge scenario, see [Understand how Azure IoT Edge uses certificates](iot-edge-certs.md).

>[!NOTE]
>The term "root CA" used throughout this article refers to the topmost authority public certificate of the certificate chain for your IoT solution. You do not need to use the certificate root of a syndicated certificate authority, or the root of your organization's certificate authority. In many cases, it is actually an intermediate CA public certificate. 

## Prerequisites 

* An IoT Edge device, running either on [Windows](how-to-install-iot-edge-windows.md) or [Linux](how-to-install-iot-edge-linux.md).
* Have a root certificate authority (CA) certificate, either self-signed or purchased from a trusted commercial certificate authority like Baltimore, Verisign, DigiCert, or GlobalSign.

If you don't have a root certificate authority yet, but want to try out IoT Edge features that require production certificates (like gateway scenarios) you can [Create demo certificates to test IoT Edge device features](how-to-create-test-certificates.md).

## Create production certificates

<!-- TODO:
What's our guidance around creating certificates? Is this a standard process in cert management? Is there any special property that needs to be in a Device CA certificate, or a special way of creating them?
-->

You should use your own certificate authority to create the following files:
* Device CA certificate
* Device CA private key
* Root CA

an X.509 CA certificate associated to a specific IoT hub (the IoT hub root CA), a series of certificates signed with this CA, and a CA for the IoT Edge device.


## Install certificates on the device

<!-- TODO:
For provisioning, we used URIs to point to the certificates on the device (file:///path/certificate.pem). Is that best practice for production certs as well?

Will all the certificates and keys have consistent file extensions that we could use to help guide customers to understand what goes where?
 -->

Now that you've made a certificate chain, you need to install it on the IoT Edge device and configure the IoT Edge runtime to reference the new certificates. 

1. Copy the following files onto your IoT Edge device: 

   * Device CA certificate -  `<WRKDIR>\certs\iot-edge-device-MyEdgeDeviceCA-full-chain.cert.pem`
   * Device CA private key - `<WRKDIR>\private\iot-edge-device-MyEdgeDeviceCA.key.pem`
   * Root CA - `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

   You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.  If you generated the certificates on the IoT Edge device itself, you can skip this step and use the path to the working directory.

2. Open the IoT Edge security daemon config file. 

   * Windows: `C:\ProgramData\iotedge\config.yaml`
   * Linux: `/etc/iotedge/config.yaml`

3. Set the **certificate** properties in the config.yaml file to the file URI of the certificate and key files on the IoT Edge device. Remove the `#` character before the certificate properties to uncomment the four lines. Remember that indents in yaml are two spaces. For example:

   * Windows:

      ```yaml
      certificates:
        device_ca_cert: "file:///c:/path/device-ca.cert.pem"
        device_ca_pk: "file:///c:/path/device-ca.key.pem"
        trusted_ca_certs: "file:///c:/path/root-ca.root.ca.cert.pem"
      ```
   
   * Linux: 
      ```yaml
      certificates:
        device_ca_cert: "file:///path/device-ca.cert.pem"
        device_ca_pk: "file:///path/device-ca.key.pem"
        trusted_ca_certs: "file:///path/root-ca.root.ca.cert.pem"
      ```

4. On Linux devices, make sure that the user **iotedge** has read permissions for the directory holding the certificates. 

## Next steps

