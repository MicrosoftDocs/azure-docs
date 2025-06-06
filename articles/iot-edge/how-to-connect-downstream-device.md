---
title: Connect a downstream device to an Azure IoT Edge gateway
description: How to configure downstream devices to connect to Azure IoT Edge gateway devices. 
author: PatAltimore

ms.author: patricka
ms.date: 06/06/2025
ms.topic: concept-article
ms.service: azure-iot-edge
services: iot-edge
ms.custom: amqp, mqtt
---

# Connect a downstream device to an Azure IoT Edge gateway

[!INCLUDE [iot-edge-version-all-supported](includes/iot-edge-version-all-supported.md)]

This article gives instructions for setting up a trusted connection between downstream devices and IoT Edge transparent [gateways](iot-edge-as-gateway.md). In a transparent gateway scenario, one or more devices send messages through a single gateway device that maintains the connection to IoT Hub. In this article, the terms *gateway* and *IoT Edge gateway* mean an IoT Edge device configured as a transparent gateway.

>[!NOTE]
>A downstream device sends data directly to the internet or to gateway devices (IoT Edge-enabled or not). A child device can be a downstream device or a gateway device in a nested topology.

You set up a transparent gateway connection in three steps. This article explains the third step.

1. Configure the gateway device as a server so downstream devices can connect to it securely. Set up the gateway to receive messages from downstream devices and route them to the right destination. For those steps, see [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md).

1. Create a device identity for the downstream device so it can authenticate with IoT Hub. Configure the downstream device to send messages through the gateway device. For those steps, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).

1. **Connect the downstream device to the gateway device and start sending messages.**

This article explains downstream device connection components, such as:

* Transport layer security (TLS) and certificate fundamentals
* TLS libraries that work across different operating systems and handle certificates differently

You walk through Azure IoT samples in your preferred language to get your device to send messages to the gateway.

## Prerequisites

Acquire the following to prepare your downstream device:

* A downstream device.

  This device can be any application or platform with an identity created in Azure IoT Hub. In many cases, applications use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). A downstream device can also be an application running on the IoT Edge gateway device.

  Later, this article shows you how to connect an *IoT* device as a downstream device. If you want to use an *IoT Edge* device as a downstream device, see [Connect Azure IoT Edge devices together to create a hierarchy (nested edge)](how-to-connect-downstream-iot-edge-device.md).

* A root CA certificate file.

  This file is used to generate the Edge CA certificate in [Configure an IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway.md), and is available on your downstream device.

  Your downstream device uses this certificate to check the identity of the gateway device. This trusted certificate  the transport layer security (TLS) connections to the gateway device. For usage details, see [Provide the root CA certificate](#provide-the-root-ca-certificate).

* A modified connection string that points to the gateway device.

  To learn how to change your connection string, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).

>[!NOTE]
>IoT devices registered with IoT Hub can use [module twins](../iot-hub/iot-hub-devguide-module-twins.md) to isolate different processes, hardware, or functions on a single device. IoT Edge gateways support downstream module connections using symmetric key authentication, but not X.509 certificate authentication.

## Understand TLS and certificate fundamentals

Securely connecting downstream devices to IoT Edge is similar to other secure client and server communication over the internet. A client and a server securely communicate over the internet using [Transport layer security (TLS)](https://en.wikipedia.org/wiki/Transport_Layer_Security). TLS uses standard [Public key infrastructure (PKI)](https://en.wikipedia.org/wiki/Public_key_infrastructure) constructs called certificates. TLS is a detailed specification that covers many topics related to securing two endpoints. This section summarizes the concepts you need to securely connect devices to an IoT Edge gateway.

When a client connects to a server, the server presents a chain of certificates called the *server certificate chain*. A certificate chain usually has a root certificate authority (CA) certificate, one or more intermediate CA certificates, and the server's certificate. The client trusts the server by cryptographically verifying the entire server certificate chain. This process is called *server chain validation*. The client also challenges the server to prove it has the private key for the server certificate, called *proof of possession*. Together, server chain validation and proof of possession are called *server authentication*. To validate a server certificate chain, the client needs a copy of the root CA certificate used to issue the server's certificate. When connecting to websites, browsers come preconfigured with common CA certificates, so the client process is seamless.

When a device connects to Azure IoT Hub, the device is the client and the IoT Hub cloud service is the server. The IoT Hub cloud service uses a root CA certificate called **Baltimore CyberTrust Root**, which is publicly available and widely used. Because the IoT Hub CA certificate is already installed on most devices, many TLS implementations (OpenSSL, Schannel, LibreSSL) automatically use it during server certificate validation. However, a device that connects to IoT Hub can have issues when connecting to an IoT Edge gateway.

When a device connects to an IoT Edge gateway, the downstream device is the client and the gateway device is the server. Azure IoT Edge lets you build gateway certificate chains as needed. You can use a public CA certificate, like Baltimore, or a self-signed (or in-house) root CA certificate. Public CA certificates often have a cost, so they're typically used in production scenarios. Self-signed CA certificates are preferred for development and testing. The demo certificates are self-signed root CA certificates.

When you use a self-signed root CA certificate for an IoT Edge gateway, you need to install it on or provide it to all downstream devices that connect to the gateway.

:::image type="content" source="./media/how-to-create-transparent-gateway/gateway-setup.png" alt-text="Screenshot of gateway certificate setup." lightbox="./media/how-to-create-transparent-gateway/gateway-setup.png":::

To learn more about IoT Edge certificates and production implications, see [IoT Edge certificate usage details](iot-edge-certs.md).

## Provide the root CA certificate

To verify the gateway device's certificates, the downstream device needs its own copy of the root CA certificate. If you use the scripts in the IoT Edge git repository to create test certificates, the root CA certificate is called **azure-iot-test-only.root.ca.cert.pem**. 

If you haven't already, move this certificate file to any directory on your downstream device. Move the file by installing the CA certificate in the operating system's certificate store, or by referencing the certificate within applications that use the Azure IoT SDKs.

Use a service like [Azure Key Vault](/azure/key-vault/) or a tool like [Secure copy protocol](https://www.ssh.com/ssh/scp/) to move the certificate file.

## Install certificates in the OS

After you copy the root CA certificate to the downstream device, make sure applications that connect to the gateway can access the certificate.

Install the root CA certificate in the operating system's certificate store so most applications can use it. Some applications, like Node.js, don't use the OS certificate store and instead use the Node runtime's internal certificate store. If you can't install the certificate at the operating system level, go to the [use certificates with Azure IoT SDKs](#use-certificates-with-azure-iot-sdks) section.

Install the root CA certificate on Ubuntu or Windows.

# [Ubuntu](#tab/ubuntu)

Use the following commands to install a CA certificate on an Ubuntu host. This example uses the **azure-iot-test-only.root.ca.cert.pem** certificate from the prerequisites articles and assumes you've copied the certificate to a location on the downstream device.

```bash
sudo cp <file path>/azure-iot-test-only.root.ca.cert.pem /usr/local/share/ca-certificates/azure-iot-test-only.root.ca.cert.pem.crt
```
```bash
sudo update-ca-certificates
```

When finished, you see a *Updating certificates in /etc/ssl/certs... 1 added, 0 removed; done* message.

# [Windows](#tab/windows)

Follow these steps to install a CA certificate on a Windows host. This example uses the **azure-iot-test-only.root.ca.cert.pem** certificate from the prerequisites articles and assumes you've copied the certificate to a location on the downstream device.

Install certificates using PowerShell's [Import-Certificate](/powershell/module/pki/import-certificate) as an admin:

```powershell
import-certificate  <file path>\azure-iot-test-only.root.ca.cert.pem -certstorelocation cert:\LocalMachine\root
```

You can also install certificates with the **certlm** utility:

1. In the Start menu, search for and select **Manage computer certificates**. The **certlm** utility opens.
1. Go to **Certificates - Local Computer** > **Trusted Root Certification Authorities**.
1. Right-click **Certificates**, then select **All Tasks** > **Import**. The certificate import wizard opens.
1. Follow the steps to import the certificate file `<file path>/azure-iot-test-only.root.ca.cert.pem`. When finished, you see a *Successfully imported* message.

Install certificates programmatically with .NET APIs, as shown in the .NET sample later in this article.

Most applications use the Windows-provided TLS stack called [Schannel](/windows/desktop/com/schannel) to connect over TLS. Schannel requires certificates to be installed in the Windows certificate store before it can establish a TLS connection.

---

## Use certificates with Azure IoT SDKs

[Azure IoT SDKs](../iot/iot-sdks.md) connect to an IoT Edge device using simple sample applications. The samples' goal is to connect the device client and send device telemetry messages to the gateway, then close the connection and exit.

Before using the application-level samples, obtain the following items:

* Your IoT Hub connection string, from your downstream device, modified to point to the gateway device.

* Any certificates required to authenticate your downstream device to IoT Hub. For more information, see [Authenticate a downstream device to Azure IoT Hub](how-to-authenticate-downstream-device.md).

* The full path to the root CA certificate that you copied and saved somewhere on your downstream device.

  For example: `<file path>/azure-iot-test-only.root.ca.cert.pem`.

Now you're ready to use certificates with a sample in the language of your choice:

# [NodeJS](#tab/nodejs)

This section provides a sample application to connect an Azure IoT Node.js device client to an IoT Edge gateway. For Node.js applications, you must install the root CA certificate at the application level as shown here. Node.js applications don't use the system's certificate store.

1. Get the sample for **edge_downstream_device.js** from the [Azure IoT device SDK for Node.js samples repo](https://github.com/Azure/azure-iot-sdk-node/tree/main/device/samples).
1. Make sure that you have all the prerequisites to run the sample by reviewing the **readme.md** file.
1. In the edge_downstream_device.js file, update the **connectionString** and **edge_ca_cert_path** variables.
1. Refer to the SDK documentation for instructions on how to run the sample on your device.

To understand the sample that you're running, the following code snippet is how the client SDK reads the certificate file and uses it to establish a secure TLS connection:

```javascript
// Provide the Azure IoT device client via setOptions with the X509
// Edge root CA certificate that was used to setup the Edge runtime
var options = {
    ca : fs.readFileSync(edge_ca_cert_path, 'utf-8'),
};
```

# [.NET](#tab/dotnet)

This section introduces a sample application to connect an Azure IoT .NET device client to an IoT Edge gateway. However, .NET applications are automatically able to use any installed certificates in the system's certificate store on both Linux and Windows hosts.

1. Get the sample for **EdgeDownstreamDevice** from the [IoT Edge .NET samples folder](https://github.com/Azure/iotedge/tree/main/samples/dotnet/EdgeDownstreamDevice).
1. Make sure that you have all the prerequisites to run the sample by reviewing the **readme.md** file.
1. In the **Properties / launchSettings.json** file, update the **DEVICE_CONNECTION_STRING** and **CA_CERTIFICATE_PATH** variables. If you want to use the certificate installed in the trusted certificate store on the host system, leave this variable blank.
1. Refer to the SDK documentation for instructions on how to run the sample on your device.

To programmatically install a trusted certificate in the certificate store via a .NET application, refer to the **InstallCACert()** function in the **EdgeDownstreamDevice / Program.cs** file. This operation is idempotent, so can be run multiple times with the same values with no extra effect.

# [C](#tab/c)

This section introduces a sample application to connect an Azure IoT C device client to an IoT Edge gateway. The C SDK can operate with many TLS libraries, including OpenSSL, WolfSSL, and Schannel. For more information, see the [Azure IoT C SDK](https://github.com/Azure/azure-iot-sdk-c).

1. Get the **iotedge_downstream_device_sample** application from the [Azure IoT device SDK for C samples](https://github.com/Azure/azure-iot-sdk-c/tree/main/iothub_client/samples).
1. Make sure that you have all the prerequisites to run the sample by reviewing the **readme.md** file.
1. In the iotedge_downstream_device_sample.c file, update the **connectionString** and **edge_ca_cert_path** variables.
1. Refer to the SDK documentation for instructions on how to run the sample on your device.


The Azure IoT device SDK for C provides an option to register a CA certificate when setting up the client. This operation doesn't install the certificate anywhere, but rather uses a string format of the certificate in memory. The saved certificate is provided to the underlying TLS stack when establishing a connection.

```C
(void)IoTHubDeviceClient_SetOption(device_handle, OPTION_TRUSTED_CERT, cert_string);
```

>[!NOTE]
> The method to register a CA certificate when setting up the client can change if using a [managed](https://github.com/Azure/azure-iot-sdk-c#packages-and-libraries) package or library. For example, the [Arduino IDE based library](https://github.com/azure/azure-iot-arduino) requires adding the CA certificate to a certificates array defined in a global [certs.c](https://github.com/Azure/azure-iot-sdk-c/blob/main/certs/certs.c) file, rather than using the `IoTHubDeviceClient_LL_SetOption` operation.  

On Windows hosts, if you're not using OpenSSL or another TLS library, the SDK default to using Schannel. For Schannel to work, the IoT Edge root CA certificate should be installed in the Windows certificate store, not set using the `IoTHubDeviceClient_SetOption` operation.

# [Java](#tab/java)

This section introduces a sample application to connect an Azure IoT Java device client to an IoT Edge gateway.

1. Get the sample for **Send-event** from the [Azure IoT device SDK for Java samples](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples).
1. Make sure that you have all the prerequisites to run the sample by reviewing the **readme.md** file.
1. Refer to the SDK documentation for instructions on how to run the sample on your device.

# [Python](#tab/python)

This section introduces a sample application to connect an Azure IoT Python device client to an IoT Edge gateway.

1. Get the sample for **send_message_downstream** from the [Azure IoT device SDK for Python samples](https://github.com/Azure/azure-iot-sdk-python/tree/v2/samples/async-edge-scenarios).
1. Set the `IOTHUB_DEVICE_CONNECTION_STRING` and `IOTEDGE_ROOT_CA_CERT_PATH` environment variables as specified in the Python script comments.
1. Refer to the SDK documentation for more instructions on how to run the sample on your device.

---

## Test the gateway connection

Run this sample command on the downstream device to test that it can connect to the gateway device:

```sh
openssl s_client -connect mygateway.contoso.com:8883 -CAfile <CERTDIR>/certs/azure-iot-test-only.root.ca.cert.pem -showcerts
```

This command checks the connection over MQTTS (port 8883). If you use a different protocol, adjust the command for AMQPS (5671) or HTTPS (443).

The output of this command can be long and includes information about all the certificates in the chain. If the connection is successful, you see a line like `Verification: OK` or `Verify return code: 0 (ok)`.

:::image type="content" source="./media/how-to-connect-downstream-device/verification-ok.png" alt-text="Screenshot of verifying a gateway connection.":::

## Troubleshoot the gateway connection

If your downstream device connection to its gateway device is unstable, consider these questions to help fix the issue.

* Is the gateway hostname in the connection string the same as the hostname value in the IoT Edge config file on the gateway device?
* Can the gateway hostname resolve to an IP address? Fix intermittent connections by using DNS or adding a host file entry on the downstream device.
* Are communication ports open in your firewall? Make sure the required protocol ports (MQTTS:8883, AMQPS:5671, HTTPS:433) are open between the downstream device and the transparent IoT Edge device.

## Next steps

Learn how IoT Edge extends [offline capabilities](offline-capabilities.md) to downstream devices.
