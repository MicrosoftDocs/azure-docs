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

All IoT Edge devices use certificates to create secure connections between the runtime and any modules running on the device. IoT Edge devices functioning as gateways use these same certificates to connect to their downstream devices, too. 

When you first install IoT Edge and provision your device, the device is set up with temporary certificates so that you can test the service. These certificates expire in 30 days, or can be reset by restarting your machine. Once you're ready to move your devices into a production scenario you need to provide your own certificates for security and maintenance. This article demonstrates the steps to install certificates on your IoT Edge devices.

>[!NOTE]
>The term "root CA" used throughout this article refers to the topmost authority public certificate of the PKI certificate chain, and not necessarily the certificate root of a syndicated certificate authority. In many cases, it is actually an intermediate CA public certificate. 

## Prerequisites 

An IoT Edge device, running either on [Windows](how-to-install-iot-edge-windows.md) or [Linux](how-to-install-iot-edge-linux.md).

## Create production certificates

<!--TODO-->

You should use your own certificate authority to create the following files:
* Device CA certificate
* Device CA private key
* Root CA

an X.509 CA certificate associated to a specific IoT hub (the IoT hub root CA), a series of certificates signed with this CA, and a CA for the IoT Edge device.

Continue on to [Install certificates on the device](#install-certificates-on-the-device).




## Install certificates on the device

Now that you've made a certificate chain, you need to install it on the IoT Edge device and configure the IoT Edge runtime to reference the new certificates. 

1. Copy the following files from *\<WRKDIR>*. Save them anywhere on your IoT Edge device. We'll refer to the destination directory on your IoT Edge device as *\<CERTDIR>*. 

   * Device CA certificate -  `<WRKDIR>\certs\iot-edge-device-MyEdgeDeviceCA-full-chain.cert.pem`
   * Device CA private key - `<WRKDIR>\private\iot-edge-device-MyEdgeDeviceCA.key.pem`
   * Root CA - `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

   You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.  If you generated the certificates on the IoT Edge device itself, you can skip this step and use the path to the working directory.

2. Open the IoT Edge security daemon config file. 

   * Windows: `C:\ProgramData\iotedge\config.yaml`
   * Linux: `/etc/iotedge/config.yaml`

3. Set the **certificate** properties in the config.yaml file to the full path to the certificate and key files on the IoT Edge device. Remove the `#` character before the certificate properties to uncomment the four lines. Remember that indents in yaml are two spaces.

   * Windows:

      ```yaml
      certificates:
        device_ca_cert: "<CERTDIR>\\certs\\iot-edge-device-MyEdgeDeviceCA-full-chain.cert.pem"
        device_ca_pk: "<CERTDIR>\\private\\iot-edge-device-MyEdgeDeviceCA.key.pem"
        trusted_ca_certs: "<CERTDIR>\\certs\\azure-iot-test-only.root.ca.cert.pem"
      ```
   
   * Linux: 
      ```yaml
      certificates:
        device_ca_cert: "<CERTDIR>/certs/iot-edge-device-MyEdgeDeviceCA-full-chain.cert.pem"
        device_ca_pk: "<CERTDIR>/private/iot-edge-device-MyEdgeDeviceCA.key.pem"
        trusted_ca_certs: "<CERTDIR>/certs/azure-iot-test-only.root.ca.cert.pem"
      ```

4. On Linux devices, make sure that the user **iotedge** has read permissions for the directory holding the certificates. 
