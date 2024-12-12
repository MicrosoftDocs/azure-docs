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
ms.date: 12/12/2024
ms.custom: mqtt, devx-track-csharp, devx-track-dotnet
---

To connect a device to IoT Hub using an X.509 certificate:

1. Use [DeviceAuthenticationWithX509Certificate](/dotnet/api/microsoft.azure.devices.client.deviceauthenticationwithx509certificate) to create an object that contains device and certificate information that is passed as the second parameter to `DeviceClient.Create` (step 2).

1. Use [DeviceClient.Create](/dotnet/api/microsoft.azure.devices.client.deviceclient.create?#microsoft-azure-devices-client-deviceclient-create(system-string-microsoft-azure-devices-client-iauthenticationmethod)) to connect the device to IoT Hub using an X.509 certificate.

This example shows certificate input parameter values as local variables for clarity. In a production system, store sensitive input parameters in environment variables or another more secure storage location. For example, use `Environment.GetEnvironmentVariable("HOSTNAME")` to read the host name environment variable.

In this example, the `auth` `DeviceAuthenticationWithX509Certificate` object has been populated with device and certificate information and is passed as to `DeviceClient.Create`. An example of `DeviceAuthenticationWithX509Certificate` information population has been omitted because of the flexible nature of how the certificate information can be added.

```csharp
HostName = "xxxxx.azure-devices.net";
using var deviceClient = DeviceClient.Create(
    HostName,
    auth,
    TransportType.Amqp);
```

For more information about certificate authentication, see:

* [Authenticate identities with X.509 certificates](/azure/iot-hub/authenticate-authorize-x509)
* [Create and upload certificates for testing](/azure/iot-hub/tutorial-x509-test-certs)
* [X509Certificate2Collection](/dotnet/api/system.security.cryptography.x509certificates.x509certificate2collection)
* [X509Certificate2](/dotnet/api/system.security.cryptography.x509certificates.x509certificate2)
* [Tutorial: Provision multiple X.509 devices using enrollment groups](/azure/iot-dps/tutorial-custom-hsm-enrollment-group-x509?pivots=programming-language-java)

##### Code samples

For working samples of device X.509 certificate authentication, see:

* [Connect with X.509 certificate](https://github.com/Azure/azure-iot-sdk-csharp/tree/main/iothub/device/samples/how%20to%20guides/X509DeviceCertWithChainSample)
* [DeviceClientX509AuthenticationE2ETests](https://github.com/Azure/azure-iot-sdk-csharp/blob/main/e2e/test/iothub/DeviceClientX509AuthenticationE2ETests.cs)
* [Guided project - Provision IoT devices securely and at scale with IoT Hub Device Provisioning Service](https://learn.microsoft.com/en-us/training/modules/provision-iot-devices-secure-scale-with-iot-hub-dps/)
