---
title: Configure downstream devices with Azure IoT Edge | Microsoft Docs
description: How to configure downstream or leaf devices to connect through Azure IoT Edge gateway devices. 
author: kgremban
manager: timlt
ms.author: kgremban
ms.date: 10/14/2018
ms.topic: conceptual
ms.service: iot-edge
services: iot-edge
---

# Connect a downstream device to an Azure IoT Edge gateway

Azure IoT Edge enables transparent gateway scenarios, in which one or more devices can pass their messages through a single gateway device that maintains the connection to IoT Hub. Once you have the gateway device configured, you need to know how to securely connect the downstream devices. 

This article identifies common problems with downstream device connections and guides you in setting up your downstream devices by: 

* Explaining transport layer security (TLS) and certificate fundamentals. 
* Explaining how TLS libraries work across different operating systems and how each operating system deals with certificates.
* Walking through Azure IoT samples in several languages to help get you started. 

In this article, the terms *gateway* and *IoT Edge gateway* refer to an IoT Edge device configured as a transparent gateway. 

## Prerequisites

Before following the steps in this article, you should have two devices ready to use:

1. An IoT Edge device set up as a transparent gateway. 
    * [Configure a Linux IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway-linux.md)
    * [Configure a Windows IoT Edge device to act as a transparent gateway](how-to-create-transparent-gateway-windows.md)

    Once you have your gateway device configured, copy the **azure-iot-test-only.root.ca.cert.pem** certificate and have it available anywhere on your downstream device. 

2. A downstream device that has a device identity from IoT Hub. 
    You cannot use an IoT Edge device as the downstream device. Instead, use a device registered as a regular IoT device in IoT Hub. In the portal, you can register a new device in the **IoT devices** section. Or you can use the Azure CLI to [register a device](../iot-hub/quickstart-send-telemetry-c.md#register-a-device). Copy the connection string and have it available to use in later sections. 

    Currently, only downstream devices with symmetric key authentication can connect through IoT Edge gateways. X.509 certificate authorities and X.509 self-signed certificates are not currently supported. 

## What is a downstream device

A downstream device can be any application or platform that has an identity created with the [Azure IoT Hub](https://docs.microsoft.com/azure/iot-hub) cloud service. In many cases, these applications use the [Azure IoT device SDK](../iot-hub/iot-hub-devguide-sdks.md). For all practical purposes, a downstream device could even be an application running on the IoT Edge gateway device itself. 

To connect a downstream device to an IoT Edge gateway you need two things:

1. The device or application is configured with an IoT Hub device connection string appended with information to connect it to the gateway. 

    This is an easy step that is part of the [Common concepts across all Azure IoT SDKs](#Common-concepts-across-all-azure-iot-sdks) described later in this article. 

2. The device or application has to trust the gateway's **root CA** or **owner CA** certificate to validate the TLS connections to the gateway device. 

    This is a more complicated step that the rest of this article will help you understand and accomplish. This step is usually performed one of two ways: by installing the CA certificate in the operating system's certificate store, or (for certain languages) at the application level.

## TLS and certificate fundamentals

The challenge of securely connecting downstream devices to IoT Edge is just like any other secure client/server communication that occurs over the internet. A client and a server securely communicate over the internet using [Transport layer security (TLS)][https://en.wikipedia.org/wiki/Transport_Layer_Security]. TLS is built using standard [Public key infrastructure (PKI)][https://en.wikipedia.org/wiki/Public_key_infrastructure] constructs called certificates. TLS is a fairly involved specification and addresses a wide range of topics related to securing two endpoints but the following section concisely describes what is needed to securely connect devices to an IoT Edge gateway.

When a client connects to a server, the server presents a chain of certificates, called the *server certificate chain*. A certificate chain typically comprises a root certificate authority (CA) certificate, one or more intermediate CA certificates, and finally the server's certificate itself. A client establishes trust with a server by cryptographically verifying the entire server certificate chain. This client validation of the server certificate chain is called *server authentication*. To validate a server certificate chain, a client needs a copy of the root CA certificate that was used to create (or issue) the server's certificate. Normally when connecting to websites, a browser comes pre-configured with commonly used CA certificates so the client has a seamless process. 

When a device connects to Azure IoT Hub, the device is the client and the IoT Hub cloud service is the server. The IoT Hub cloud service is backed by a root CA certificate called **Baltimore CyberTrust Root**, which is publicly available and widely used. Since the IoT Hub CA certificate is already installed on most devices, many TLS implementations (OpenSSL, Schannel, LibreSSL) automatically use it during server certificate validation. A device that may successfully connect to IoT Hub may have issues trying to connect to an IoT Edge gateway.

When a device connects to an IoT Edge gateway, the downstream device is the client and the gateway device is the server. Azure IoT Edge allows operators (or users) to build gateway certificate chains however they see fit. The operator may choose to use a public CA certificate, like Baltimore, or use a self-signed (or in house) root CA certificate. Public CA certificates often have a cost associated with them, so are typically used in production scenarios while self-signed CA certificates are preferred for development and testing. The transparent gateway setup articles listed in the prerequesites section uses self-signed root CA certificates. 

When you use a self-signed root CA certificate for an IoT Edge gateway, it needs to be installed on or provided to all the downstream devices attempting to connect to the gateway. 

To learn more about IoT Edge certificates and some production implications, see [IoT Edge certificate usage details](iot-edge-certs
.md).

A downstream device application has to trust the owner CA certificate in order to validate the TLS connections to the gateway devices. This step can usually be performed in one of two ways: installation of the certificate at the operating system level or (for certain languages) at the application level. 

## Installation at the OS level

This article refers to the root CA certificate as the *owner CA* since that's the term used by the scripts that generate the self-signed certificate in the prerequisites articles. 

Installing the owner CA certificate in the operating system's certificate store generally allows most applications to use the owner CA certificate. There are some exceptions, like NodeJS application which don't use the OS certificate store but rather use the Node runtime's internal certificate store. If you can't use the certificate at the operating system level, refer to the language-specific examples for using the certificate at the application level later in this article. 

### Ubuntu

The following commands are an example of how to install a CA certificate on an Ubuntu host. This sample assumes that you're using the **azure-iot-test-only.root.ca.cert.pem** certificate from the prerequisites articles, and that you've copied the certificate into a location on the downstream device.  

```bash
sudo cp <path>/azure-iot-test-only.root.ca.cert.pem /usr/local/share/ca-certificates/azure-iot-test-only.root.ca.cert.pem.crt
sudo update-ca-certificates
```

You should see a message that says, "Updating certificates in /etc/ssl/certs... 1 added, 0 removed; done."

### Windows

The following steps are an example of how to install a CA certificate on a Windows host. This sample assumes that you're using the **azure-iot-test-only.root.ca.cert.pem** certificate from the prerequisites articles, and that you've copied the certificate into a location on the downstream device.  

1. In the Start menu, search for and select **Manage computer certificates**. A utility called **certlm** should open.
2. Navigate to **Certificates - Local Computer** > **Trusted Root Certification Authorities**.
3. Right-click **Certificates** and select **All Tasks** > **Import**. The certificate import wizard should launch. 
4. Follow the steps as directed and import certificate file `<path>/azure-iot-test-only.root.ca.cert.pem`. When completed, you should see a "Successfully imported" message. 

You can also install certificates programmatically using .NET APIs, as shown in the .NET sample later in this article. 

Typically applications use the Windows provided TLS stack called [Schannel][https://docs.microsoft.com/windows/desktop/com/schannel] to securely connect over TLS. Schannel *requires* that any certificates be installed in the Windows certificate store before attempting to establish a TLS connection.

## Installation at the application level

This article refers to the root CA certificate as the *owner CA* since that's the term used by the scripts that generate the self-signed certificate in the prerequisites articles. 

This section describes how the Azure IoT SDKs connect to an IoT Edge device using simple samples. The goal of all the samples is to connect the device client and send telemetry messages to the gateway, then close the connection and exit. 

### Common concepts across all Azure IoT SDKs

Have two things ready before using the application-level samples:

1. Your downstream device's IoT Hub connection string modified to point to the gateway device.

    The connection string is formatted like, `HostName=yourHub.azure-devices.net;DeviceId=yourDevice;SharedAccessKey=XXXYYYZZZ=;`. Append the **GatewayHostName** property with the hostname of the gateway device to the end of the connection string. The final string will look like, `HostName=yourHub.azure-devices.net;DeviceId=yourDevice;SharedAccessKey=XXXYYYZZZ=;GatewayHostName=mygateway.contoso.com`.

2. The full path to the root CA certificate that you copied and saved somewhere on your downstream device.

    For example, `<path>/azure-iot-test-only.root.ca.cert.pem`. 

### NodeJS

This section provides a sample application to connect an Azure IoT NodeJS device client to an IoT Edge gateway. For Linux and Windows hosts, you must install the root CA certificate at the application level as shown here, as NodeJS applications don't use the system's certificate store. 

1. Get the sample for [edge_downstream_device.js](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/edge_downstream_device.js).

2. In the edge_downstream_device.js file, update `var connectionsString` with the modified connection string for your downstream device. 

3. Update `var edge_ca_cert_path` with the full path to the root CA certificate.

4. Refer to the NodeJS samples [readme.md](https://github.com/Azure/azure-iot-sdk-node/blob/master/device/samples/readme.md) for instructions on how to run the sample on your device. 

To understand the sample that you're running, the following code snippet is how the client SDK reads the certificate file and uses it to establish a secure TLS connection: 

```nodejs
// Provide the Azure IoT device client via setOptions with the X509
// Edge root CA certificate that was used to setup the Edge runtime
var options = {
    ca : fs.readFileSync(edge_ca_cert_path, 'utf-8'),
};
```