---
title: How to connect a device to IoT Hub using a certificate (Node.js)
titleSuffix: Azure IoT Hub
description: Learn how to connect a device to IoT Hub using a certificate and the Azure IoT Hub SDK for Node.js.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: node
ms.topic: include
ms.manager: lizross
ms.date: 12/12/2024
---

The X.509 certificate is attached to the device-to-IoT Hub connection transport.

To configure a device-to-IoT Hub connection using an X.509 certificate:

1. Call [fromConnectionString](/javascript/api/azure-iothub/client?#azure-iothub-client-fromconnectionstring) to add the device connection string and transport type. Add `x509=true` to the device connection string to indicate that a certificate is added to `DeviceClientOptions`. For example: `HostName=xxxxx.azure-devices.net;DeviceId=Device-1;SharedAccessKey=xxxxxxxxxxxxx;x509=true`.
1. Configure a JSON variable with certificate details and pass it to [DeviceClientOptions](/javascript/api/azure-iot-device/deviceclientoptions).
1. Call [setOptions](/javascript/api/azure-iot-device/client?#azure-iot-device-client-setoptions-1) to add an X.509 certificate and key (and optionally, passphrase) to the client transport.
1. Call [open](/javascript/api/azure-iothub/client?#azure-iothub-client-open) to open the connection from the device to IoT Hub.

This example shows certificate configuration information within a JSON variable. The certification configuration `options` are passed to `setOptions` and the connection is opened using `open`.

```javascript
var options = {
   cert: myX509Certificate,
   key: myX509Key,
   passphrase: passphrase,
   http: {
     receivePolicy: {
       interval: 10
     }
   }
 }
 client.setOptions(options, callback);
 client.open(connectCallback);
```

For more information about certificate authentication, see:

* [Authenticate identities with X.509 certificates](/azure/iot-hub/authenticate-authorize-x509)
* [Create and upload certificates for testing](/azure/iot-hub/tutorial-x509-test-certs)

##### Code sample

For a working sample of device X.509 certificate authentication, see [Simple sample device X.509](https://github.com/Azure/azure-iot-sdk-node/blob/main/device/samples/javascript/simple_sample_device_x509.js).
