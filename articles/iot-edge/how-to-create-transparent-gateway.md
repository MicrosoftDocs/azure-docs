---
title: Create transparent gateway device - Azure IoT Edge | Microsoft Docs
description: Use an Azure IoT Edge device as a transparent gateway that can process information from downstream devices
author: kgremban
manager: philmea
ms.author: kgremban
ms.date: 11/29/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
ms.custom: seodec18
---

# Configure an IoT Edge device to act as a transparent gateway

This article provides detailed instructions for configuring IoT Edge devices to function as a transparent gateway for other devices to communicate with IoT Hub. In this article, the term *IoT Edge gateway* refers to an IoT Edge device used as a transparent gateway. For more detailed information, see [How an IoT Edge device can be used as a gateway](./iot-edge-as-gateway.md), which gives a conceptual overview.

>[!NOTE]
>Currently:
> * If the gateway is disconnected from IoT Hub, downstream devices cannot authenticate with the gateway.
> * Edge-enabled devices can't connect to IoT Edge gateways. 
> * Downstream devices can't use file upload.

For a device to function as a gateway, it needs to be able to securely connect to downstream devices. Azure IoT Edge allows you to use a public key infrastructure (PKI) to set up secure connections between devices. In this case, we’re allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway. To maintain reasonable security, the downstream device should confirm the identity of the Edge device because you only want your devices connecting to your gateways and not a potentially malicious gateway.

A downstream device can be any application or platform that has an identity created with the [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub) cloud service. In many cases, these applications use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). For all practical purposes, a downstream device could even be an application running on the IoT Edge gateway device itself. 

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security](../iot-hub/iot-hub-x509ca-overview.md) in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub owner CA), and a series of certificates, signed with this CA, and a CA for the Edge device.

![Gateway certificate setup](./media/how-to-create-transparent-gateway/gateway-setup.png)

The gateway presents its Edge device CA certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure the Edge device CA certificate is signed by the owner CA certificate. This process allows the downstream device to confirm the gateway comes from a trusted source.

The following steps walk you through the process of creating the certificates and installing them in the right places.

## Prerequisites

An Azure IoT Edge device to configure as a gateway. You can use your development machine or a virtual machine as an IoT Edge device with the steps for the following operating systems:
* [Windows](./how-to-install-iot-edge-windows.md)
* [Linux x64](./how-to-install-iot-edge-linux.md)
* [Linux ARM32](./how-to-install-iot-edge-linux-arm.md)

You can use any machine to generate the certificates, and then copy them over to your IoT Edge device.

>[!NOTE]
>The "gateway name" used  to create the certificates in this instruction, needs to be the same name as used as hostname in your IoT Edge config.yaml file and as GatewayHostName in the connection string of the downstream device. The "gateway name" needs to be resolvable to an IP Address, either using DNS or a host file entry. Communication based on the protocol used (MQTTS:8883/AMQPS:5671/HTTPS:433) must be possible between downstream device and the transparant IoT Edge. If a firewall is in between, the respective port needs to be open.

## Generate certificates with Windows

Use the steps in this section to generate test certificates on a Windows device. You can generate the certificates on your IoT Edge device itself, or use a separate machine and copy the final certificates to any IoT Edge device running any supported operating system. 

The certificates generated in this section are intended for testing purposes only. 

### Install OpenSSL

Install OpenSSL for Windows on the machine that you're using to generate the certificates. There are several ways you can install OpenSSL:

   >[!NOTE]
   >If you already have OpenSSL installed on your Windows device, you may skip this step but ensure that openssl.exe is available in your PATH environment variable.

* **Easier:** Download and install any [third-party OpenSSL binaries](https://wiki.openssl.org/index.php/Binaries), for example, from [this project on SourceForge](https://sourceforge.net/projects/openssl/). Add the full path to openssl.exe to your PATH environment variable. 
   
* **Recommended:** Download the OpenSSL source code and build the binaries on your machine by yourself or via [vcpkg](https://github.com/Microsoft/vcpkg). The instructions listed below use vcpkg to download source code, compile, and install OpenSSL on your Windows machine with easy steps.

   1. Navigate to a directory where you want to install vcpkg. We'll refer to this directory as *\<VCPKGDIR>*. Follow the instructions to download and install [vcpkg](https://github.com/Microsoft/vcpkg).
   
   2. Once vcpkg is installed, from a powershell prompt, run the following command to install the OpenSSL package for Windows x64. The installation typically takes about 5 mins to complete.

      ```powershell
      .\vcpkg install openssl:x64-windows
      ```
   3. Add `<VCPKGDIR>\installed\x64-windows\tools\openssl` to your PATH environment variable so that the openssl.exe file is available for invocation.

### Prepare creation scripts

The Azure IoT device SDK for C contains scripts that you can use to generate test certificates. In this section, you clone the SDK and configure PowerShell.

1. Open a PowerShell window in administrator mode. 

2. Clone the git repo that contains scripts to generate non-production certificates. These scripts help you create the necessary certificates to set up a transparent gateway. Use the `git clone` command or [download the ZIP](https://github.com/Azure/azure-iot-sdk-c/archive/master.zip). 

   ```powershell
   git clone https://github.com/Azure/azure-iot-sdk-c.git
   ```

3. Navigate to the directory in which you want to work. We'll refer to this directory as *\<WRKDIR>*.  All files will be created in this directory.

4. Copy the configuration and script files into your working directory. 

   ```powershell
   copy <path>\azure-iot-sdk-c\tools\CACertificates\*.cnf .
   copy <path>\azure-iot-sdk-c\tools\CACertificates\ca-certs.ps1 .
   ```

   If you downloaded the SDK as a ZIP, then the folder name is `azure-iot-sdk-c-master` and the rest of the path is the same. 

5. Set environment variable OPENSSL_CONF to use the openssl_root_ca.cnf configuration file.

    ```powershell
    $env:OPENSSL_CONF = "$PWD\openssl_root_ca.cnf"
    ```

6. Enable PowerShell to run the scripts.

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
   ```

7. Bring the functions, used by the scripts, into PowerShell's global namespace.
   
   ```powershell
   . .\ca-certs.ps1
   ```

8. Verify that OpenSSL has been installed correctly and make sure there won't be name collisions with existing certificates. If there are problems, the script should describe how to fix them on your system.

   ```powershell
   Test-CACertsPrerequisites
   ```

### Create certificates

In this section, you create three certificates and then connect them in a chain. Placing the certificates in a chain file allows you to install them easily on your IoT Edge gateway device and any downstream devices.  

1. Create the owner CA certificate and have it sign one intermediate certificate. The certificates are all placed in *\<WRKDIR>*.

      ```powershell
      New-CACertsCertChain rsa
      ```

2. Create the Edge device CA certificate and private key with the following command. Provide a name for the gateway device, which will be used to name the files and during certificate generation. 

   ```powershell
   New-CACertsEdgeDevice "<gateway name>"
   ```

3. Create a certificate chain from the owner CA certificate, intermediate certificate, and Edge device CA certificate with the following command. 

   ```powershell
   Write-CACertsCertificatesForEdgeDevice "<gateway name>"
   ```

   The script creates the following certificates and key:
   * `<WRKDIR>\certs\new-edge-device.*`
   * `<WRKDIR>\private\new-edge-device.key.pem`
   * `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

## Generate certificates with Linux

Use the steps in this section to generate test certificates on a Linux device. You can generate the certificates on your IoT Edge device itself, or use a separate machine and copy the final certificates to any IoT Edge device running any supported operating system. 

### Prepare creation scripts

1. Clone the git repo that contains scripts to generate non-production certificates. These scripts help you create the necessary certificates to set up a transparent gateway. 

   ```bash
   git clone https://github.com/Azure/azure-iot-sdk-c.git
   ```

2. Navigate to the directory in which you want to work. We'll refer to this directory as *\<WRKDIR>*.  All files will be created in this directory.
  
3. Copy the config and script files into your working directory.

   ```bash
   cp <path>/azure-iot-sdk-c/tools/CACertificates/*.cnf .
   cp <path>/azure-iot-sdk-c/tools/CACertificates/certGen.sh .
   ```

4. Configure OpenSSL to generate certificates using the provided script. 

   ```bash
   chmod 700 certGen.sh 
   ```

### Create certificates

In this section, you create three certificates and then connect them in a chain. Placing the certificates in a chain file allows to easily install them on your IoT Edge gateway device and any downstream devices.  

1. Create the owner CA certificate and one intermediate certificate. These certificates are placed in *\<WRKDIR>*.

   ```bash
   ./certGen.sh create_root_and_intermediate
   ```

   The script creates the following certificates and keys:
   * `<WRKDIR>/certs/azure-iot-test-only.root.ca.cert.pem`
   * `<WRKDIR>/certs/azure-iot-test-only.intermediate.cert.pem`
   * `<WRKDIR>/private/azure-iot-test-only.root.ca.key.pem`
   * `<WRKDIR>/private/azure-iot-test-only.intermediate.key.pem`

2. Create the Edge device CA certificate and private key with the following command. Provide a name for the gateway device, which will be used to name the files and during certificate generation. 

   ```bash
   ./certGen.sh create_edge_device_certificate "<gateway name>"
   ```

   The script creates the following certificates and key:
   * `<WRKDIR>/certs/new-edge-device.*`
   * `<WRKDIR>/private/new-edge-device.key.pem`

3. Create a certificate chain called **new-edge-device-full-chain.cert.pem** from the owner CA certificate, intermediate certificate, and Edge device CA certificate.

   ```bash
   cat ./certs/new-edge-device.cert.pem ./certs/azure-iot-test-only.intermediate.cert.pem ./certs/azure-iot-test-only.root.ca.cert.pem > ./certs/new-edge-device-full-chain.cert.pem
   ```

## Install certificates on the gateway

Now that you've made a certificate chain, you need to install it on the IoT Edge gateway device and configure the IoT Edge runtime to reference the new certificates. 

1. Copy the following files from *\<WRKDIR>*. Save them anywhere on your IoT Edge device. We'll refer to the destination directory on your IoT Edge device as *\<CERTDIR>*. 

   If you generated the certificates on the Edge device itself, you can skip this step and use the path to the working directory.

   * Device CA certificate -  `<WRKDIR>\certs\new-edge-device-full-chain.cert.pem`
   * Device CA private key - `<WRKDIR>\private\new-edge-device.key.pem`
   * Owner CA - `<WRKDIR>\certs\azure-iot-test-only.root.ca.cert.pem`

2. Open the IoT Edge security daemon config file. 

   * Windows: `C:\ProgramData\iotedge\config.yaml`
   * Linux: `/etc/iotedge/config.yaml`

3. Set the **certificate** properties in the config.yaml file to the path where you placed the certificate and key files on the IoT Edge device.

```yaml
certificates:
  device_ca_cert: "<CERTDIR>\\certs\\new-edge-device-full-chain.cert.pem"
  device_ca_pk: "<CERTDIR>\\private\\new-edge-device.key.pem"
  trusted_ca_certs: "<CERTDIR>\\certs\\azure-iot-test-only.root.ca.cert.pem"
```

## Deploy EdgeHub to the gateway

When you first install IoT Edge on a device, only one system module starts automatically: the Edge agent. For your device to work as a gateway, you need both system modules. If you haven't deployed any modules to your gateway device before, create a deployment for your device to start the second system module, the Edge hub. The deployment will look empty because you don't add any modules in the wizard, but it will deploy both system modules. 

You can check which modules are running on a device with the command `iotedge list`.

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

Standard IoT Edge devices don't need any inbound connectivity to function, because all communication with IoT Hub is done through outbound connections. However, gateway devices are different because they need to be able to receive messages from their downstream devices.

For a gateway scenario to work, at least one of the IoT Edge hub's supported protocols must be open for inbound traffic from downstream devices. The supported portocols are MQTT, AMQP, and HTTPS.

| Port | Protocol |
| ---- | -------- |
| 8883 | MQTT |
| 5671 | AMQP |
| 443 | HTTPS <br> MQTT+WS <br> AMQP+WS | 

## Route messages from downstream devices
The IoT Edge runtime can route messages sent from downstream devices just like messages sent by modules. This allows you to perform analytics in a module running on the gateway before sending any data to the cloud. 

Currently, the way that you route messages sent by downstream devices is by differentiating them from messages sent by modules. Messages sent by modules all contain a system property called **connectionModuleId** but messages sent by downstream devices do not. You can use the WHERE clause of the route to exclude any messages that contain that system property. 

The below route would be used to send messages from any downstream device to a module name `ai_insights`.

```json
{
    "routes":{
        "sensorToAIInsightsInput1":"FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO BrokeredEndpoint(\"/modules/ai_insights/inputs/input1\")", 
        "AIInsightsToIoTHub":"FROM /messages/modules/ai_insights/outputs/output1 INTO $upstream" 
    } 
}
```

For more information about message routing, see [Deploy modules and establish routes](./module-composition.md#declare-routes).

[!INCLUDE [iot-edge-extended-ofline-preview](../../includes/iot-edge-extended-offline-preview.md)]

## Next steps

Now that you have an IoT Edge device working as a transparent gateway, you need to configure your downstream devices to trust the gateway and send messages to it. For more information, see [Connect a downstream device to an Azure IoT Edge gateway](how-to-connect-downstream-device.md).
