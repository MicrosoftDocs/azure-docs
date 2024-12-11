---
title: How to connect a device to IoT Hub using a certificate (.NET)
titleSuffix: Azure IoT Hub
description: Learn how to connect a device to IoT Hub using a certificate and the Azure IoT Hub SDK for .NET.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: csharp
ms.topic: include
ms.manager: lizross
ms.date: 11/19/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

To connect a device to IoT Hub using an X.509 certificate:

1. Use [DeviceAuthenticationWithX509Certificate](/dotnet/api/microsoft.azure.devices.client.deviceauthenticationwithx509certificate) to create an object that contains certificate information that is passed to `Create` (step 2).

2. Use [Create](https://learn.microsoft.com/en-us/dotnet/api/microsoft.azure.devices.client.deviceclient.create?#microsoft-azure-devices-client-deviceclient-create(system-string-microsoft-azure-devices-client-iauthenticationmethod)) to connect the device to IoT Hub using an X.509 certificate.

This example shows certificate input parameter values as local variables for clarity. In a production system, store sensitive input parameters in environment variables or another more secure storage location. For example, use `Environment.GetEnvironmentVariable("HOSTNAME")` to read the host name environment variable.

```csharp
RootCertPath = "~/certificates/certs/sensor-thl-001-device.cert.cer";
Intermediate1CertPath = "";
Intermediate2CertPath = "";
DevicePfxPath = "~/certificates/certs/sensor-thl-001-device.cert.pfx";
DevicePfxPassword = "1234";
DeviceName = "MyDevice";
HostName = "xxxxx.azure-devices.net";

var chainCerts = new X509Certificate2Collection();
chainCerts.Add(new X509Certificate2(RootCertPath));
chainCerts.Add(new X509Certificate2(Intermediate1CertPath));
chainCerts.Add(new X509Certificate2(Intermediate2CertPath));
using var deviceCert = new X509Certificate2(DevicePfxPath, DevicePfxPassword);
using var auth = new DeviceAuthenticationWithX509Certificate(DeviceName, deviceCert, chainCerts);

using var deviceClient = DeviceClient.Create(
    HostName,
    auth,
    TransportType.Amqp);
```

For more information about certificate authentication, see:

* [Authenticate identities with X.509 certificates](/azure/iot-hub/authenticate-authorize-x509)
* [Create and upload certificates for testing](/azure/iot-hub/tutorial-x509-test-certs)

##### Code samples

For a working sample of device X.509 certificate authentication, see [Connect with X.509 certificate](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/how%20to%20guides/X509DeviceCertWithChainSample).
