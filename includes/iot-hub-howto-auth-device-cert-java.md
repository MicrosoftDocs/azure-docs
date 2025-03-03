---
title: How to connect a device to IoT Hub using a certificate (Java)
titleSuffix: Azure IoT Hub
description: Learn how to connect a device to IoT Hub using a certificate and the Azure IoT Hub SDK for Java.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: java
ms.topic: include
ms.manager: lizross
ms.date: 12/12/2024
---

To connect a device to IoT Hub using an X.509 certificate:

1. Build the [SSLContext](https://docs.oracle.com/javase/8/docs/api/javax/net/ssl/SSLContext.html) object using [buildSSLContext](https://hc.apache.org/httpcomponents-core-4.4.x/current/httpcore/apidocs/org/apache/http/ssl/SSLContextBuilder.html).
1. Add the `SSLContext` information to a [ClientOptions](/java/api/com.microsoft.azure.sdk.iot.device.clientoptions) object.
1. Call [DeviceClient](/java/api/com.microsoft.azure.sdk.iot.device.deviceclient?#com-microsoft-azure-sdk-iot-device-deviceclient-deviceclient(java-lang-string-com-microsoft-azure-sdk-iot-device-iothubclientprotocol-com-microsoft-azure-sdk-iot-device-clientoptions)) using the `ClientOptions` information to create the device-to-IoT Hub connection.

This example shows certificate input parameter values as local variables for clarity. In a production system, store sensitive input parameters in environment variables or another more secure storage location. For example, use `Environment.GetEnvironmentVariable("PUBLICKEY")` to read a public key certificate string environment variable.

```java
private static final String publicKeyCertificateString =
        "-----BEGIN CERTIFICATE-----\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "-----END CERTIFICATE-----\n";

//PEM encoded representation of the private key
private static final String privateKeyString =
        "-----BEGIN EC PRIVATE KEY-----\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n" +
        "-----END EC PRIVATE KEY-----\n";

SSLContext sslContext = SSLContextBuilder.buildSSLContext(publicKeyCertificateString, privateKeyString);
ClientOptions clientOptions = ClientOptions.builder().sslContext(sslContext).build();
DeviceClient client = new DeviceClient(connString, protocol, clientOptions);
```

For more information about certificate authentication, see:

* [Authenticate identities with X.509 certificates](/azure/iot-hub/authenticate-authorize-x509)
* [Tutorial: Create and upload certificates for testing](/azure/iot-hub/tutorial-x509-test-certs)

##### Code samples

For working samples of device X.509 certificate authentication, see:

* [Send-receive x509 sample](https://github.com/Azure/azure-iot-sdk-java/tree/main/iothub/device/iot-device-samples/send-receive-x509-sample)
* [Send event x509](https://github.com/Azure/azure-iot-sdk-java/blob/main/iothub/device/iot-device-samples/send-event-x509/src/main/java/samples/com/microsoft/azure/sdk/iot/SendEventX509.java)
