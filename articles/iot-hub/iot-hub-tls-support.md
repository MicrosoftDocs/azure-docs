---
 title: Azure IoT Hub TLS support
 description: Best practices in using secure TLS connections for devices and services communicating with IoT Hub
 services: iot-hub
 author: rezasherafat
 ms.service: iot-fundamentals
 ms.topic: conceptual
 ms.date: 01/10/2020
 ms.author: rezas
---

# TLS support in IoT Hub

IoT Hub uses Transport Layer Security (TLS) to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported, namely versions 1.0, 1.1, and 1.2.

TLS 1.0 and 1.1 are considered legacy and are planned for deprecation. For more information, see [Deprecating TLS 1.0 and 1.1 for IoT Hub](iot-hub-tls-deprecating-1-0-and-1-1.md). It is strongly recommended that you use TLS 1.2 as the preferred TLS version when connecting to IoT Hub.

## Restrict connections to TLS 1.2 in your IoT Hub resource

For added security, it is advised to configure your IoT Hubs to *only* allow client connections that use TLS version 1.2 and to enforce the use of [recommended ciphers](#recommended-ciphers).

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

> [!NOTE]
> The `minTlsVersion` property is read-only and cannot be changed once your IoT Hub resource is created. It is therefore essential that you properly test and validate that *all* your IoT devices and services are compatible with TLS 1.2 and the [recommended ciphers](#recommended-ciphers) in advance.

## Supported regions

IoT Hubs that require the use of TLS 1.2 can be created in the following regions:

* East US
* South Central US
* West US 2
* US Gov Arizona
* US Gov Virginia

> [!NOTE]
> Upon failovers, the `minTlsVersion` property of your IoT Hub will remain effective in the geo-paired region post-failover.

## Recommended ciphers

IoT Hubs that are configured to accept only TLS 1.2 will also enforce the use of the following recommended ciphers:

* `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`

For IoT Hubs not configured for TLS 1.2 enforcement, TLS 1.2 still works with the following ciphers:

* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_DHE_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_DHE_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_RSA_WITH_AES_256_CBC_SHA256`
* `TLS_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`
* `TLS_RSA_WITH_AES_256_CBC_SHA`
* `TLS_RSA_WITH_AES_128_CBC_SHA`
* `TLS_RSA_WITH_3DES_EDE_CBC_SHA`

## Use TLS 1.2 in your IoT Hub SDKs

Use the links below to configure TLS 1.2 and allowed ciphers in IoT Hub client SDKs.

| Language | Versions supporting TLS 1.2 | Documentation |
|----------|------------------------------------|---------------|
| C        | Tag 2019-12-11 or newer            | [Link](https://aka.ms/Tls_C_SDK_IoT) |
| Python   | Version 2.0.0 or newer             | [Link](https://aka.ms/Tls_Python_SDK_IoT) |
| C#       | Version 1.21.4 or newer            | [Link](https://aka.ms/Tls_CSharp_SDK_IoT) |
| Java     | Version 1.19.0 or newer            | [Link](https://aka.ms/Tls_Java_SDK_IoT) |
| NodeJS   | Version 1.12.2 or newer            | [Link](https://aka.ms/Tls_Node_SDK_IoT) |


## Use TLS 1.2 in your IoT Edge setup

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub. For this purpose, use the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).