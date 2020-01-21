---
 title: Azure IoT Hub TLS support
 description: Best practices in using secure TLS connections for devices and services communicating with IoT Hub
 services: iot-hub
 author: rezasherafat
 ms.service: iot-fundamentals
 ms.topic: conceptual
 ms.date: 01/10/2020
 ms.author: rezas
 ms.custom: Azure IoT Hub TLS
---

# TLS support in IoT Hub

IoT Hub uses Transport Layer Security (TLS) to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported, namely versions 1.0, 1.1, and 1.2.

TLS 1.0 and 1.1 are considered legacy and are [planned for deprecation](./tls-1.2-everywhere.md). It is therefore strongly recommended to use TLS 1.2 as the preferred TLS version when connecting to IoT Hub.


## Restrict connections to TLS 1.2 in your IoT Hub resource

For added security, it is advised to configure your IoT Hubs to _only_ allow client connections that use TLS version 1.2 and to enforce the use of [recommended ciphers](#recommended-ciphers).

For this purpose, provision a new IoT Hub in any of the [supported regions](#supported-regions) and set the `minTlsVersion` property to `1.2` in your Azure Resource Manager template's IoT hub resource specification:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Devices/IotHubs",
            "apiVersion": "2020-01-01",
            "name": "<provide-a-valid-resource-name>",
            "location": "<any-of-supported-regions-below>",
            "properties": {
                "minTlsVersion": "1.2"
            },
            "sku": {
                "name": "<your-hubs-SKU-name>",
                "tier": "<your-hubs-SKU-tier>",
                "capacity": 1
            }
        }
    ]
}
```

The created IoT Hub resource using this configuration will refuse device and service clients that attempt to connect using TLS versions 1.0 and 1.1. Similarly, the TLS handshake will be refused if the client HELLO message does not list any of the [recommended ciphers](#recommended-ciphers).

Note that the `minTlsVersion` property is read-only and cannot be changed once your IoT Hub resource is created. It is therefore essential that you properly test and validate that _all_ your IoT devices and services are compatible with TLS 1.2 and the [recommended ciphers](#recommended-ciphers) in advance.


### Supported regions

IoT Hubs that require the use of TLS 1.2 can be created in the following regions:

* East US
* South Central US
* West US 2

> [!NOTE]
> Upon failovers, the `minTlsVersion` property of your IoT Hub will remain effective in the geo-paired region post-failover.



### Recommended ciphers

IoT Hubs that are configured to accept only TLS 1.2 will also enforce the use of the following recommended ciphers:

* `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`


### Use TLS 1.2 in your IoT Hub SDKs

Use the links below to configure TLS 1.2 and allowed ciphers in IoT Hub client SDKs.

| Language | TLS 1.2 supported | Documentation |
|----------|-------------------|---------------|
| C        | Yes               | [Link](https://aka.ms/Tls_C_SDK_IoT) |
| Python   | Yes               | [Link](https://aka.ms/Tls_Python_SDK_IoT) |
| C#       | Yes               | [Link](https://aka.ms/Tls_CSharp_SDK_IoT) |
| Java     | Yes               | [Link](https://aka.ms/Tls_Java_SDK_IoT) |
| NodeJS   | Yes               | [Link](https://aka.ms/Tls_Node_SDK_IoT) |


### Use TLS 1.2 in your IoT Edge setup

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub. For this purpose, use the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).