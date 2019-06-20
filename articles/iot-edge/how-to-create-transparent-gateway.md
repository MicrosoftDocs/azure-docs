---
title: Create transparent gateway device - Azure IoT Edge | Microsoft Docs
description: Use an Azure IoT Edge device as a transparent gateway that can process information from downstream devices
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 06/07/2019
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Configure an IoT Edge device to act as a transparent gateway

This article provides detailed instructions for configuring an IoT Edge device to function as a transparent gateway for other devices to communicate with IoT Hub. In this article, the term *IoT Edge gateway* refers to an IoT Edge device used as a transparent gateway. For more information, see [How an IoT Edge device can be used as a gateway](./iot-edge-as-gateway.md).

>[!NOTE]
>Currently:
> * Edge-enabled devices can't connect to IoT Edge gateways. 
> * Downstream devices can't use file upload.

There are three general steps to set up a successful transparent gateway connection. This article covers the first step:

1. **The gateway device needs to be able to securely connect to downstream devices, receive communications from downstream devices, and route messages to the proper destination.**
2. The downstream device needs to have a device identity to be able to authenticate with IoT Hub, and know to communicate through its gateway device. For more information, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).
3. The downstream device needs to be able to securely connect to its gateway device. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).


For a device to function as a gateway, it needs to be able to securely connect to its downstream devices. Azure IoT Edge allows you to use a public key infrastructure (PKI) to set up secure connections between devices. In this case, we’re allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway. To maintain reasonable security, the downstream device should confirm the identity of the gateway device. This identity check prevents your devices from connecting to potentially malicious gateways.

A downstream device can be any application or platform that has an identity created with the [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub) cloud service. In many cases, these applications use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). For all practical purposes, a downstream device could even be an application running on the IoT Edge gateway device itself. 

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security](../iot-hub/iot-hub-x509ca-overview.md) in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub root CA), a series of certificates signed with this CA, and a CA for the IoT Edge device.

![Gateway certificate setup](./media/how-to-create-transparent-gateway/gateway-setup.png)

>[!NOTE]
>The term "root CA" used throughout this article refers to the topmost authority public certificate of the PKI certificate chain, and not necessarily the certificate root of a syndicated certificate authority. In many cases, it is actually an intermediate CA public certificate. 

The gateway presents its IoT Edge device CA certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure the IoT Edge device CA certificate is signed by the root CA certificate. This process allows the downstream device to confirm that the gateway comes from a trusted source.

The following steps walk you through the process of creating the certificates and installing them in the right places on the gateway. You can use any machine to generate the certificates, and then copy them over to your IoT Edge device. 

## Prerequisites

An Azure IoT Edge device to configure as a gateway. Use the IoT Edge installation steps for one of the following operating systems:
  * [Windows](./how-to-install-iot-edge-windows.md)
  * [Linux x64](./how-to-install-iot-edge-linux.md)
  * [Linux ARM32](./how-to-install-iot-edge-linux-arm.md)

This article refers to the *gateway hostname* at several points. The gateway hostname is declared in the **hostname** parameter of the config.yaml file on the IoT Edge gateway device. It's used to create the certificates in this article, and is referred to in the connection string of the downstream devices. The gateway hostname needs to be resolvable to an IP Address, either using DNS or a host file entry.

## Generate certificates with Windows

Use the steps in this section to generate test certificates on Windows. You can use a Windows machine to generate the certificates, and then copy them over to any IoT Edge device running on any supported operating system. 

The certificates generated in this section are intended for testing purposes only. 

### Install OpenSSL

Install OpenSSL for Windows on the machine that you're using to generate the certificates. If you already have OpenSSL installed on your Windows device, you may skip this step, but ensure that openssl.exe is available in your PATH environment variable. 

There are several ways you can install OpenSSL:

* **Easier:** Download and install any [third-party OpenSSL binaries](https://wiki.openssl.org/index.php/Binaries), for example, from [OpenSSL on SourceForge](https://sourceforge.net/projects/openssl/). Add the full path to openssl.exe to your PATH environment variable. 
   
* **Recommended:** Download the OpenSSL source code and build the binaries on your machine by yourself or via [vcpkg](https://github.com/Microsoft/vcpkg). The instructions listed below use vcpkg to download source code, compile, and install OpenSSL on your Windows machine with easy steps.

   1. Navigate to a directory where you want to install vcpkg. We'll refer to this directory as *\<VCPKGDIR>*. Follow the instructions to download and install [vcpkg](https://github.com/Microsoft/vcpkg).
   
   2. Once vcpkg is installed, run the following command from a powershell prompt to install the OpenSSL package for Windows x64. The installation typically takes about 5 mins to complete.

      ```powershell
      .\vcpkg install openssl:x64-windows
      ```
   3. Add `<VCPKGDIR>\installed\x64-windows\tools\openssl` to your PATH environment variable so that the openssl.exe file is available for invocation.

### Prepare creation scripts

The Azure IoT Edge git repository contains scripts that you can use to generate test certificates. In this section, you clone the IoT Edge repo and execute the scripts. 

1. Open a PowerShell window in administrator mode. 

2. Clone the git repo that contains scripts to generate non-production certificates. These scripts help you create the necessary certificates to set up a transparent gateway. Use the `git clone` command or [download the ZIP](https://github.com/Azure/iotedge/archive/master.zip). 

   ```powershell
   git clone https://github.com/Azure/iotedge.git
   ```

3. Navigate to the directory in which you want to work. Throughout this article, we'll call this directory *\<WRKDIR>*. All certificates and keys will be created in this working directory.

4. Copy the configuration and script files from the cloned repo into your working directory. 

   ```powershell
   copy <path>\iotedge\tools\CACertificates\*.cnf .
   copy <path>\iotedge\tools\CACertificates\ca-certs.ps1 .
   ```

   If you downloaded the repo as a ZIP, then the folder name is `iotedge-master` and the rest of the path is the same. 
<!--
5. Set environment variable OPENSSL_CONF to use the openssl_root_ca.cnf configuration file.

    ```powershell
    $env:OPENSSL_CONF = "$PWD\openssl_root_ca.cnf"
    ```
-->
5. Enable PowerShell to run the scripts.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
   ```

7. Bring the functions used by the scripts into PowerShell's global namespace.
   
   ```powershell
   . .\ca-certs.ps1
   ```

   The PowerShell window will display a warning that the certificates generated by this script are only for testing purposes, and should not be used in production scenarios.

8. Verify that OpenSSL has been installed correctly and make sure that there won't be name collisions with existing certificates. If there are problems, the script should describe how to fix them on your system.

   ```powershell
   Test-CACertsPrerequisites
   ```

### Create certificates

In this section, you create three certificates and then connect them in a chain. Placing the certificates in a chain file allows you to install them easily on your IoT Edge gateway device and any downstream devices.  

1. Create the root CA certificate and have it sign one intermediate certificate. The certificates are all placed in your working directory.

   ```powershell
   New-CACertsCertChain rsa
   ```

   This script command creates several certificate and key files, but we're going to refer to one in particular later in this article:
   * `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

2. Create the IoT Edge device CA certificate and private key with the following command. Provide the gateway hostname, which can be found in the iotedge\config.yaml file on the gateway device. The gateway hostname is used to name the files and during certificate generation. 

   ```powershell
   New-CACertsEdgeDevice "<gateway hostname>"
   ```

   This script command creates several certificate and key files, including two that we're going to refer to later in this article:
   * `<WRKDIR>\certs\iot-edge-device-<gateway hostname>-full-chain.cert.pem`
   * `<WRKDIR>\private\iot-edge-device-<gateway hostname>.key.pem`

Now that you have the certificates, skip ahead to [Install certificates on the gateway](#install-certificates-on-the-gateway)

## Generate certificates with Linux

Use the steps in this section to generate test certificates on Linux. You can use a Linux machine to generate the certificates, and then copy them over to any IoT Edge device running on any supported operating system. 

The certificates generated in this section are intended for testing purposes only. 

### Prepare creation scripts

The Azure IoT Edge git repository contains scripts that you can use to generate test certificates. In this section, you clone the IoT Edge repo and execute the scripts. 

1. Clone the git repo that contains scripts to generate non-production certificates. These scripts help you create the necessary certificates to set up a transparent gateway. 

   ```bash
   git clone https://github.com/Azure/iotedge.git
   ```

2. Navigate to the directory in which you want to work. We'll refer to this directory throughout the article as *\<WRKDIR>*. All certificate and key files will be created in this directory.
  
3. Copy the config and script files from the cloned IoT Edge repo into your working directory.

   ```bash
   cp <path>/iotedge/tools/CACertificates/*.cnf .
   cp <path>/iotedge/tools/CACertificates/certGen.sh .
   ```

<!--
4. Configure OpenSSL to generate certificates using the provided script. 

   ```bash
   chmod 700 certGen.sh 
   ```
-->

### Create certificates

In this section, you create three certificates and then connect them in a chain. Placing the certificates in a chain file allows to easily install them on your IoT Edge gateway device and any downstream devices.  

1. Create the root CA certificate and one intermediate certificate. These certificates are placed in *\<WRKDIR>*.

   ```bash
   ./certGen.sh create_root_and_intermediate
   ```

   The script creates several certificates and keys. Make note of one, which we'll refer to in the next section:
   * `<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem`

2. Create the IoT Edge device CA certificate and private key with the following command. Provide the gateway hostname, which can be found in the iotedge/config.yaml file on the gateway device. The gateway hostname is used to name the files and during certificate generation. 

   ```bash
   ./certGen.sh create_edge_device_certificate "<gateway hostname>"
   ```

   The script creates several certificates and keys. Make note of two, which we'll refer to in the next section: 
   * `<WRKDIR>/certs/iot-edge-device-<gateway hostname>-full-chain.cert.pem`
   * `<WRKDIR>/private/iot-edge-device-<gateway hostname>.key.pem`

## Install certificates on the gateway

Now that you've made a certificate chain, you need to install it on the IoT Edge gateway device and configure the IoT Edge runtime to reference the new certificates. 

1. Copy the following files from *\<WRKDIR>*. Save them anywhere on your IoT Edge device. We'll refer to the destination directory on your IoT Edge device as *\<CERTDIR>*. 

   * Device CA certificate -  `<WRKDIR>\certs\iot-edge-device-<gateway hostname>-full-chain.cert.pem`
   * Device CA private key - `<WRKDIR>\private\iot-edge-device-<gateway hostname>.key.pem`
   * Root CA - `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

   You can use a service like [Azure Key Vault](https://docs.microsoft.com/azure/key-vault) or a function like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate files.  If you generated the certificates on the IoT Edge device itself, you can skip this step and use the path to the working directory.

2. Open the IoT Edge security daemon config file. 

   * Windows: `C:\ProgramData\iotedge\config.yaml`
   * Linux: `/etc/iotedge/config.yaml`

3. Set the **certificate** properties in the config.yaml file to the full path to the certificate and key files on the IoT Edge device. Remove the `#` character before the certificate properties to uncomment the four lines. Remember that indents in yaml are two spaces.

   * Windows:

      ```yaml
      certificates:
        device_ca_cert: "<CERTDIR>\\certs\\iot-edge-device-<gateway hostname>-full-chain.cert.pem"
        device_ca_pk: "<CERTDIR>\\private\\iot-edge-device-<gateway hostname>.key.pem"
        trusted_ca_certs: "<CERTDIR>\\certs\\azure-iot-test-only.root.ca.cert.pem"
      ```
   
   * Linux: 
      ```yaml
      certificates:
        device_ca_cert: "<CERTDIR>/certs/iot-edge-device-<gateway hostname>-full-chain.cert.pem"
        device_ca_pk: "<CERTDIR>/private/iot-edge-device-<gateway hostname>.key.pem"
        trusted_ca_certs: "<CERTDIR>/certs/azure-iot-test-only.root.ca.cert.pem"
      ```

4. On Linux devices, make sure that the user **iotedge** has read permissions for the directory holding the certificates. 

## Deploy EdgeHub to the gateway

When you first install IoT Edge on a device, only one system module starts automatically: the IoT Edge agent. For your device to work as a gateway, you need both system modules. If you haven't deployed any modules to your gateway device before, create an initial deployment for your device to start the second system module, the IoT Edge hub. The deployment will look empty because you don't add any modules in the wizard, but it will make sure that both system modules are running. 

You can check which modules are running on a device with the command `iotedge list`. If the list only returns the module **edgeAgent** without **edgeHub**, use the following steps:

1. In the Azure portal, navigate to your IoT hub.

2. Go to **IoT Edge** and select your IoT Edge device that you want to use as a gateway.

3. Select **Set Modules**.

4. Select **Next**.

5. In the **Specify routes** page, you should have a default route that sends all messages from all modules to IoT Hub. If not, add the following code then select **Next**.

   ```JSON
   {
       "routes": {
           "route": "FROM /* INTO $upstream"
       }
   }
   ```

6. In the **Review template** page, select **Submit**.

## Open ports on gateway device

Standard IoT Edge devices don't need any inbound connectivity to function, because all communication with IoT Hub is done through outbound connections. Gateway devices are different because they need to receive messages from their downstream devices. If a firewall is between the downstream devices and the gateway device, then communication needs to be possible through the firewall as well.

For a gateway scenario to work, at least one of the IoT Edge hub's supported protocols must be open for inbound traffic from downstream devices. The supported protocols are MQTT, AMQP, and HTTPS. 

| Port | Protocol |
| ---- | -------- |
| 8883 | MQTT |
| 5671 | AMQP |
| 443 | HTTPS <br> MQTT+WS <br> AMQP+WS | 

## Route messages from downstream devices
The IoT Edge runtime can route messages sent from downstream devices just like messages sent by modules. This feature allows you to perform analytics in a module running on the gateway before sending any data to the cloud. 

Currently, the way that you route messages sent by downstream devices is by differentiating them from messages sent by modules. Messages sent by modules all contain a system property called **connectionModuleId** but messages sent by downstream devices do not. You can use the WHERE clause of the route to exclude any messages that contain that system property. 

The below route is an example that would send messages from any downstream device to a module named `ai_insights`, and then from `ai_insights` to IoT Hub.

```json
{
    "routes":{
        "sensorToAIInsightsInput1":"FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO BrokeredEndpoint(\"/modules/ai_insights/inputs/input1\")", 
        "AIInsightsToIoTHub":"FROM /messages/modules/ai_insights/outputs/output1 INTO $upstream" 
    } 
}
```

For more information about message routing, see [Deploy modules and establish routes](./module-composition.md#declare-routes).


## Enable extended offline operation

Starting with the [v1.0.4 release](https://github.com/Azure/azure-iotedge/releases/tag/1.0.4) of the IoT Edge runtime, the gateway device and downstream devices connecting to it can be configured for extended offline operation. 

With this capability, local modules or downstream devices can re-authenticate with the IoT Edge device as needed and communicate with each other using messages and methods even when disconnected from the IoT hub. For more information, see [Understand extended offline capabilities for IoT Edge devices, modules, and child devices](offline-capabilities.md).

To enable extended offline capabilities, you establish a parent-child relationship between an IoT Edge gateway device and downstream devices that will connect to it. Those steps are explained in more detail in [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).

## Next steps

Now that you have an IoT Edge device working as a transparent gateway, you need to configure your downstream devices to trust the gateway and send messages to it. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md) and [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).
