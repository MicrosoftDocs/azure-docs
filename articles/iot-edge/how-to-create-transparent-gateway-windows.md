---
title: Create a transparent gateway with Azure IoT Edge - Windows | Microsoft Docs
description: Use Azure IoT Edge to create a transparent gateway that can process information for multiple devices
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 6/20/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Create a Windows IoT Edge device that acts as a transparent gateway

This article provides detailed instructions for using an IoT Edge device as a transparent gateway. For the rest of this article, the term *IoT Edge gateway* refers to an IoT Edge device used as a transparent gateway. For more detailed information, see [How an IoT Edge device can be used as a gateway][lnk-edge-as-gateway], which gives a conceptual overview.

>[!NOTE]
>Currently:
> * If the gateway is disconnected from IoT Hub, downstream devices cannot authenticate with the gateway.
> * Edge-enabled devices can't connect to IoT Edge gateways. 
> * Downstream devices can't use file upload.

The hard part about creating a transparent gateway is securely connecting the gateway to downstream devices. Azure IoT Edge allows you to use PKI infrastructure to set up secure TLS connections between these devices. In this case, we’re allowing a downstream device to connect to an IoT Edge device acting as a transparent gateway.  To maintain reasonable security, the downstream device should confirm the identity of the Edge device because you only want your devices connecting to your gateways and not a potentially malicious gateway.

You can create any certificate infrastructure that enables the trust required for your device-gateway topology. In this article, we assume the same certificate setup that you would use to enable [X.509 CA security][lnk-iothub-x509] in IoT Hub, which involves an X.509 CA certificate associated to a specific IoT hub (the IoT hub owner CA), and a series of certificates, signed with this CA, and a CA for the Edge device.

![Gateway setup][1]

The gateway presents its Edge device CA certificate to the downstream device during the initiation of the connection. The downstream device checks to make sure the Edge device CA certificate is signed by the owner CA certificate. This process allows the downstream device to confirm the gateway comes from a trusted source.

The following steps walk you through the process of creating the certificates and installing them in the right places.

## Prerequisites
1.	[Install the Azure IoT Edge runtime][lnk-install-windows-x64] on a Windows device you want to use as the transparent gateway.

1. Get OpenSSL for Windows. There are many ways you can install OpenSSL:

   >[!NOTE]
   >If you already have OpenSSL installed on your Windows device, you may skip this step but 
   > please ensure that  `openssl.exe` is available in your `%PATH%` environment variable.

   * Download and install any [third-party OpenSSL binaries](https://wiki.openssl.org/index.php/Binaries), for example, from [this project on SourceForge](https://sourceforge.net/projects/openssl/).
   
   * Download the OpenSSL source code and build the binaries on your machine by yourself or do this via [vcpkg](https://github.com/Microsoft/vcpkg). The instructions listed below use vcpkg to download source code, compile and install OpenSSL on your Windows machine all in very easy to use steps.

      1. Navigate to a directory where you want to install vcpkg. From here on we'll refer to this as $VCPKGDIR. Follow the instructions to download and install [vcpkg](https://github.com/Microsoft/vcpkg).
   
      1. Once vcpkg is installed, from a powershell prompt, run the following command to install the OpenSSL package for Windows x64. This typically takes about 5 mins to complete.

         ```PowerShell
         .\vcpkg install openssl:x64-windows
         ```
      1. Add `$VCPKGDIR\installed\x64-windows\tools\openssl` to your `PATH` environment variable so that the `openssl.exe` file is available for invocation.

1. Navigate to the directory in which you want to work. From here on we'll refer to this as $WRKDIR.  All files will be created in this directory.
   
   cd $WRKDIR

1.	Obtain the scripts to generate the required non-production certificates with the following command. These scripts help you create the necessary certificates to set up a transparent gateway.

      ```PowerShell
      git clone https://github.com/Azure/azure-iot-sdk-c.git
      ```

1. Copy configuration and script files into your working directory. Additionally, set env variable OPENSSL_CONF to use the openssl_root_ca.cnf configuration file.

   ```PowerShell
   copy azure-iot-sdk-c\tools\CACertificates\*.cnf .
   copy azure-iot-sdk-c\tools\CACertificates\ca-certs.ps1 .
   $env:OPENSSL_CONF = "$PWD\openssl_root_ca.cnf"
   ```

1. Enable PowerShell to run the scripts by running the following command

   ```PowerShell
   Set-ExecutionPolicy -ExecutionPolicy Unrestricted
   ```

1. Bring the functions, used by the scripts, into PowerShell's global namespace by dot-sourcing with the following command
   
   ```PowerShell
   . .\ca-certs.ps1
   ```

1. Verify OpenSSL has been installed correctly and make sure there won't be name collisions with existing certificates by running the following command. If there are problems, the script should describe how to fix these on your system.

   ```PowerShell
   Test-CACertsPrerequisites
   ```

## Certificate creation
1.	Create the owner CA certificate and one intermediate certificate. These are all placed in `$WRKDIR`.

      ```PowerShell
      New-CACertsCertChain rsa
      ```

1.	Create the Edge device CA certificate and private key with the command below.

   >[!NOTE]
   > **DO NOT** use a name that is the same as the gateway's DNS host name. Doing so will cause client certification against these certificates to fail.

   ```PowerShell
   New-CACertsEdgeDevice "<gateway device name>"
   ```

## Certificate chain creation
Create a certificate chain from the owner CA certificate, intermediate certificate, and Edge device CA certificate with the command below. Placing it in a chain file allows you to easily install it on your Edge device acting as a transparent gateway.

   ```PowerShell
   Write-CACertsCertificatesForEdgeDevice "<gateway device name>"
   ```

   The output of the script execution are the following certificates and key:
   * `$WRKDIR\certs\new-edge-device.*`
   * `$WRKDIR\private\new-edge-device.key.pem`
   * `$WRKDIR\certs\azure-iot-test-only.root.ca.cert.pem`

## Installation on the gateway
1.	Copy the following files from $WRKDIR anywhere on your Edge device, we'll refer to that as $CERTDIR. If you generated the certificates on your Edge device skip this step.

   * Device CA certificate -  `$WRKDIR\certs\new-edge-device-full-chain.cert.pem`
   * Device CA private key - `$WRKDIR\private\new-edge-device.key.pem`
   * Owner CA - `$WRKDIR\certs\azure-iot-test-only.root.ca.cert.pem`

2.	Set the `certificate` properties in the Security Daemon config yaml file to the path where you placed the certificate and key files.

```yaml
certificates:
  device_ca_cert: "$CERTDIR\\certs\\new-edge-device-full-chain.cert.pem"
  device_ca_pk: "$CERTDIR\\private\\new-edge-device.key.pem"
  trusted_ca_certs: "$CERTDIR\\certs\\azure-iot-test-only.root.ca.cert.pem"
```
## Deploy EdgeHub to the gateway
One of the key capabilities of Azure IoT Edge is being able to deploy modules to your IoT Edge devices from the cloud. This section has you create a seemingly empty deployment; however Edge Hub is automatcially added to all deployments even if there are no other modules present. Edge Hub is the only module you need on an Edge Device to have it act as a transparent gateway so creating an empty deployment is enough. 
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

## Installation on the downstream device
A downstream device can be any application using the [Azure IoT device SDK][lnk-devicesdk], such as the simple one described in [Connect your device to your IoT hub using .NET][lnk-iothub-getstarted]. A downstream device application has to trust the **owner CA** certificate in order to validate the TLS connections to the gateway devices. This step can usually be performed in two ways: at the OS level, or (for certain languages) at the application level.

### OS level
Installing this certificate in the OS certificate store will allow all applications to use the owner CA certificate as a trusted certificate.

* Ubuntu - Here is an example of how to install a CA certificate on an Ubuntu host.

   ```cmd
   sudo cp $CERTDIR/certs/azure-iot-test-only.root.ca.cert.pem  /usr/local/share/ca-certificates/azure-iot-test-only.root.ca.cert.pem.crt
   sudo update-ca-certificates
   ```
 
    You should see a message saying, "Updating certificates in /etc/ssl/certs... 1 added, 0 removed; done."

* Windows - Here is an example of how to install a CA certificate on an Windows host.
  * On the start menu type in "Manage computer certificates". This should bring up a utility called `certlm`.
  * Navigate to Certificates Local Computer --> Trusted Root Certificates --> Certificates --> Right click --> All Tasks --> Import to launch the certificate import wizard.
  * Follow the steps as directed and import certificate file $CERTDIR/certs/azure-iot-test-only.root.ca.cert.pem.
  * When completed, you should see a "Successfully imported" message.

### Application level
For .NET applications, you can add the following snippet to trust a certificate in PEM format. Initialize the variable `certPath` with `$CERTDIR\certs\azure-iot-test-only.root.ca.cert.pem`.

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
   HostName=yourHub.azure-devices.net;DeviceId=yourDevice;SharedAccessKey=XXXYYYZZZ=;GatewayHostName=mygateway.contoso.com
   ```

   >[!NOTE]
   >This is a sample command which tests that everything has been set up correctly. You sohuld a message saying "verified OK".
   >
   >openssl s_client -connect mygateway.contoso.com:8883 -CAfile $CERTDIR/certs/azure-iot-test-only.root.ca.cert.pem -showcerts

## Routing messages from downstream devices
The IoT Edge runtime can route messages sent from downstream devices just like messages sent by modules. This allows you to perform analytics in a module running on the gateway before sending any data to the cloud. The below route would be used to send messages from a downstream device named `sensor` to a module name `ai_insights`.

   ```json
   { "routes":{ "sensorToAIInsightsInput1":"FROM /messages/* WHERE NOT IS_DEFINED($connectionModuleId) INTO BrokeredEndpoint(\"/modules/ai_insights/inputs/input1\")", "AIInsightsToIoTHub":"FROM /messages/modules/ai_insights/outputs/output1 INTO $upstream" } }
   ```

Refer to the [module composition article][lnk-module-composition] for more details on message routing.

[!INCLUDE [](../../includes/iot-edge-extended-offline-preview.md)]

## Next steps
[Understand the requirements and tools for developing IoT Edge modules][lnk-module-dev].

<!-- Images -->
[1]: ./media/how-to-create-transparent-gateway/gateway-setup.png

<!-- Links -->
[lnk-install-windows-x64]: ./how-to-install-iot-edge-windows-with-windows.md
[lnk-module-composition]: ./module-composition.md
[lnk-devicesdk]: ../iot-hub/iot-hub-devguide-sdks.md
[lnk-tutorial1-win]: tutorial-simulate-device-windows.md
[lnk-tutorial1-lin]: tutorial-simulate-device-linux.md
[lnk-edge-as-gateway]: ./iot-edge-as-gateway.md
[lnk-module-dev]: module-development.md
[lnk-iothub-getstarted]: ../iot-hub/quickstart-send-telemetry-dotnet.md
[lnk-iothub-x509]: ../iot-hub/iot-hub-x509ca-overview.md
[lnk-iothub-secure-deployment]: ../iot-hub/iot-hub-security-deployment.md
[lnk-iothub-tokens]: ../iot-hub/iot-hub-devguide-security.md#security-tokens
[lnk-iothub-throttles-quotas]: ../iot-hub/iot-hub-devguide-quotas-throttling.md
[lnk-iothub-devicetwins]: ../iot-hub/iot-hub-devguide-device-twins.md
[lnk-iothub-c2d]: ../iot-hub/iot-hub-devguide-messages-c2d.md
[lnk-ca-scripts]: https://github.com/Azure/azure-iot-sdk-c/blob/master/tools/CACertificates/CACertificateOverview.md
[lnk-modbus-module]: https://github.com/Azure/iot-edge-modbus
