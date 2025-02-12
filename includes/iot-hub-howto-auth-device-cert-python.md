---
title: How to connect a device to IoT Hub using a certificate (Python)
titleSuffix: Azure IoT Hub
description: Learn how to connect a device to IoT Hub using a certificate and the Azure IoT Hub SDK for Python.
author: kgremban
ms.author: kgremban
ms.service: iot-hub
ms.devlang: python
ms.topic: include
ms.manager: lizross
ms.date: 12/06/2024
---

To connect a device to IoT Hub using an X.509 certificate:

1. Use [create_from_x509_certificate](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-create-from-x509-certificate) to add the X.509 certificate parameters
1. Call [connect](/python/api/azure-iot-device/azure.iot.device.iothubdeviceclient?#azure-iot-device-iothubdeviceclient-connect) to connect the device client

This example shows certificate input parameter values as local variables for clarity. In a production system, store sensitive input parameters in environment variables or another more secure storage location. For example, use `os.getenv("HOSTNAME")` to read the host name environment variable.

```python
# The Azure IoT hub name
hostname = "xxxxx.azure-devices.net"

# The device that has been created on the portal using X509 CA signing or self-signing capabilities
device_id = "MyDevice"

# The X.509 certificate file name
cert_file = "~/certificates/certs/sensor-thl-001-device.cert.pfx"
key_file = "~/certificates/certs/sensor-thl-001-device.cert.key"
# The optional certificate pass phrase
pass_phrase = "1234"

x509 = X509(
    cert_file,
    key_file,
    pass_phrase,
)

# The client object is used to interact with your Azure IoT hub.
device_client = IoTHubDeviceClient.create_from_x509_certificate(
    hostname=hostname, device_id=device_id, x509=x509
)

# Connect to IoT Hub
await device_client.connect()
```

For more information about certificate authentication, see:

* [Authenticate identities with X.509 certificates](/azure/iot-hub/authenticate-authorize-x509)
* [Tutorial: Create and upload certificates for testing](/azure/iot-hub/tutorial-x509-test-certs)

##### Code samples

For working samples of device X.509 certificate authentication, see the examples whose file names end in x509 at [Async hub scenarios](https://github.com/Azure/azure-iot-sdk-python/tree/main/samples/async-hub-scenarios).
