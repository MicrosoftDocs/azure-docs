---
title: Create a transparent gateway with Azure IoT Edge - Windows | Microsoft Docs
description: Use Azure IoT Edge to create a transparent gateway that can process information for multiple devices
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 10/20/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create a Windows IoT Edge device that acts as a transparent gateway

This article provides detailed instructions for configuring IoT Edge on Windows to function as a transparent gateway for other devices to communicate with IoT Hub. In this article, the term *IoT Edge gateway* refers to an IoT Edge device used as a transparent gateway. For more detailed information, see [How an IoT Edge device can be used as a gateway](./iot-edge-as-gateway.md), which gives a conceptual overview.

>[!NOTE]
>Currently:
> * If the gateway is disconnected from IoT Hub, downstream devices cannot authenticate with the gateway.
> * Edge-enabled devices can't connect to IoT Edge gateways. 
> * Downstream devices can't use file upload.

The hard part about creating a transparent gateway is securely connecting the gateway to downstream devices. Azure IoT Edge allows you to use a public key infrastructure (PKI) to set up secure connections between these devices. In this case, we’re allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway. To maintain reasonable security, the downstream device should confirm the identity of the Edge device because you only want your devices connecting to your gateways and not a potentially malicious gateway.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security](../iot-hub/iot-hub-x509ca-overview.md) in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub owner CA), and a series of certificates, signed with this CA, and a CA for the Edge device.

![Gateway setup](./media/how-to-create-transparent-gateway/gateway-setup.png)

The gateway presents its Edge device CA certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure the Edge device CA certificate is signed by the owner CA certificate. This process allows the downstream device to confirm the gateway comes from a trusted source.

The following steps walk you through the process of creating the certificates and installing them in the right places.

## Prerequisites
1. An Azure IoT Edge device. You can use your development machine or a virtual machine as an Edge device by following the steps in [Install Azure IoT Edge runtime on Windows](./how-to-install-iot-edge-windows-with-windows.md).

2. OpenSSL for Windows on your development machine. There are many ways you can install OpenSSL:

   >[!NOTE]
   >If you already have OpenSSL installed on your Windows device, you may skip this step but ensure that openssl.exe is available in your PATH environment variable.

   * Download and install any [third-party OpenSSL binaries](https://wiki.openssl.org/index.php/Binaries), for example, from [this project on SourceForge](https://sourceforge.net/projects/openssl/). Add the full path to openssl.exe to your PATH environment variable. 
   
   * Or, download the OpenSSL source code and build the binaries on your machine by yourself or via [vcpkg](https://github.com/Microsoft/vcpkg). The instructions listed below use vcpkg to download source code, compile, and install OpenSSL on your Windows machine with easy steps.

      1. Navigate to a directory where you want to install vcpkg. From here on we'll refer to this as $VCPKGDIR. Follow the instructions to download and install [vcpkg](https://github.com/Microsoft/vcpkg).
   
      2. Once vcpkg is installed, from a powershell prompt, run the following command to install the OpenSSL package for Windows x64. The installation typically takes about 5 mins to complete.

         ```PowerShell
         .\vcpkg install openssl:x64-windows
         ```
      3. Add `$VCPKGDIR\installed\x64-windows\tools\openssl` to your PATH environment variable so that the openssl.exe file is available for invocation.

## Prepare creation scripts

The Azure IoT device SDK for C contains scripts that you can use to generate test certificates. In this section, you clone the SDK and configure PowerShell.

You can perform these steps on your development machine, and then copy the final certificate chain onto your IoT Edge gateway device. 

1. Open a PowerShell window in administrator mode. 

2. Navigate to the directory in which you want to work. From here on we'll refer to this as $WRKDIR.  All files will be created in this directory.

3. Clone the git repo that contains scripts to generate non-production certificates. These scripts help you create the necessary certificates to set up a transparent gateway. Use the `git clone` command or [download the ZIP](https://github.com/Azure/azure-iot-sdk-c/archive/master.zip). 

   ```PowerShell
   git clone https://github.com/Azure/azure-iot-sdk-c.git
   ```

4. Copy the configuration and script files into your working directory. 

   ```PowerShell
   copy azure-iot-sdk-c\tools\CACertificates\*.cnf .
   copy azure-iot-sdk-c\tools\CACertificates\ca-certs.ps1 .
   ```

   If you downloaded the SDK as a ZIP, then the folder name is `azure-iot-sdk-c-master` and the rest of the path is the same. 

5. Set environment variable OPENSSL_CONF to use the openssl_root_ca.cnf configuration file.

    ```PowerShell
    $env:OPENSSL_CONF = "$PWD\openssl_root_ca.cnf"
    ```

6. Enable PowerShell to run the scripts.

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted -Scope CurrentUser
   ```

7. Bring the functions, used by the scripts, into PowerShell's global namespace.
   
   ```PowerShell
   . .\ca-certs.ps1
   ```

8. Verify that OpenSSL has been installed correctly and make sure there won't be name collisions with existing certificates. If there are problems, the script should describe how to fix them on your system.

   ```PowerShell
   Test-CACertsPrerequisites
   ```

## Create certificates

In this section, you create three certificates and then connect them in a chain. Placing the certificates in a chain file allows to easily install them on your IoT Edge gateway device and any downstream devices.  

You can perform these steps on your development machine, and then copy the final certificate chain onto your IoT Edge gateway device. 

1. Create the owner CA certificate and have it sign one intermediate certificate. The certificates are all placed in `$WRKDIR`.

      ```PowerShell
      New-CACertsCertChain rsa
      ```

2. Create the Edge device CA certificate and private key with the command below. Provide a name for the gateway device. 

   >[!NOTE]
   > Don't use the device's DNS host name as the gateway name. 

   ```PowerShell
   New-CACertsEdgeDevice "<gateway device name>"
   ```

3. Create a certificate chain from the owner CA certificate, intermediate certificate, and Edge device CA certificate with the command below. 

   ```PowerShell
   Write-CACertsCertificatesForEdgeDevice "<gateway device name>"
   ```

   The script creates the following certificates and key:
   * $WRKDIR\certs\new-edge-device.*
   * $WRKDIR\private\new-edge-device.key.pem
   * $WRKDIR\certs\azure-iot-test-only.root.ca.cert.pem

## Install on the gateway

Now that you've made a certificate chain, you need to install it on the IoT Edge gateway device and configure the IoT Edge runtime to reference the new certificates. 

1. Copy the following files from $WRKDIR to anywhere on your Edge device. We'll refer to the directory on your IoT Edge device as $CERTDIR. If you generated the certificates on the Edge device itself, you can skip this step and use the path to the working directory.

   * Device CA certificate -  `$WRKDIR\certs\new-edge-device-full-chain.cert.pem`
   * Device CA private key - `$WRKDIR\private\new-edge-device.key.pem`
   * Owner CA - `$WRKDIR\certs\azure-iot-test-only.root.ca.cert.pem`

2. Open the Security Daemon config file

Set the `certificate` properties in the Security Daemon config yaml file to the path where you placed the certificate and key files.

```yaml
certificates:
  device_ca_cert: "$CERTDIR\\certs\\new-edge-device-full-chain.cert.pem"
  device_ca_pk: "$CERTDIR\\private\\new-edge-device.key.pem"
  trusted_ca_certs: "$CERTDIR\\certs\\azure-iot-test-only.root.ca.cert.pem"
```

## Deploy EdgeHub to the gateway

When you first install IoT Edge on a device, only one system module starts automatically: the Edge agent. For your device to work as a gateway, you need both system modules. If you haven't deployed any modules to your gateway device before, create a deployment for your device to start the second system module, the Edge hub. The deployment will look empty because you don't add any modules in the wizard, but it will deploy both system modules. 

You can check which modules are running on a device with the command `iotedge list`.

1. In the Azure portal, navigate to your IoT hub.
2. Go to **IoT Edge** and select your IoT Edge device that you want to use as a gateway.
3. Select **Set Modules**.
4. Select **Next**.
5. In the **Specify routes** step, you should have a default route that sends all messages from all modules to IoT Hub. If not, add the following code then select **Next**.
   ```JSON
   {
       "routes": {
           "route": "FROM /* INTO $upstream"
       }
   }
   ```
6. In the Review template step, select **Submit**.

## Routing messages from downstream devices
The IoT Edge runtime can route messages sent from downstream devices just like messages sent by modules. This allows you to perform analytics in a module running on the gateway before sending any data to the cloud. The below route would be used to send messages from a downstream device named `sensor` to a module name `ai_insights`.

   ```json
   { "routes":{ "sensorToAIInsightsInput1":"FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO BrokeredEndpoint(\"/modules/ai_insights/inputs/input1\")", "AIInsightsToIoTHub":"FROM /messages/modules/ai_insights/outputs/output1 INTO $upstream" } }
   ```

For more information about message routing, see [module composition](./module-composition.md).

[!INCLUDE [iot-edge-extended-ofline-preview](../../includes/iot-edge-extended-offline-preview.md)]

## Next steps
[Understand the requirements and tools for developing IoT Edge modules](module-development.md).
