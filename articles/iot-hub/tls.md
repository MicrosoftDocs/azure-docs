---
 title: Azure IoT Hub TLS
 description: Azure IoT Hub TLS
 services: iot-hub
 author: rezasherafat
 ms.service: iot-fundamentals
 ms.topic: conceptual
 ms.date: 01/10/2020
 ms.author: rezas
 ms.custom: Azure IoT Hub TLS
---

# TLS support in IoT Hub

IoT Hub uses Transport Layer Security (TLS) to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported, namely version 1.0, 1.1, and 1.2.

TLS 1.0 and 1.1 are considered legacy and are [planned for deprecation](./tls-1.2-everywhere.md). It is therefore strongly recommended to use TLS 1.2 as the preferred TLS version when connecting to IoT Hub.


## Restrict client connections to TLS 1.2

For added security, it is advised to configure your IoT Hubs to _only_ allow client connections that use TLS version 1.2 and to enforce the use of [recommended ciphers](#recommended-ciphers).

For this purpose, provision a new IoT Hub in any of the [supported regions](#supported-regions) and set the `minTlsVersion` property to `1.2` in your IoT hub resource specification:

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "variables": {},
    "resources": [
        {
            "type": "Microsoft.Devices/IotHubs",
            "apiVersion": "2020-01-01",
            "name": "<provide-a-valid-resource-name>",
            "location": "<any-of-supported-regions-below>",
            "properties": {
                "minTlsVersion": "1.2",
                "sku": {
                    "name": "S1",
                    "tier": "Standard",
                    "capacity": 1
                }
            }
        }
    ]
}
```

The created IoT Hub resource using this configuration will refuse device and service clients who attempt to connect using TLS versions 1.0 and 1.1. Similarly, the TLS handshake will be refused if the client HELLO packet does not list any of the [recommended ciphers](#recommended-ciphers).

Note that the `minTlsVersion` property is read-only and cannot be changed  once your IoT Hub resource is created. It is therefore essential that you properly test and validate that _all_ your IoT devices and services are compatible with TLS 1.2 and the [recommended ciphers](#recommended-ciphers) in advance.


### Supported regions

IoT Hubs to accept only TLS 1.2 can be created in the following regions.

* West US 2
* West Central US
* West US
* East US
* South central US
* North central US


### Recommended ciphers

IoT Hubs that are configured to accept only TLS 1.2 will also enforce the use of the following recommended ciphers:

* `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`
* `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384`
* `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`
* `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`

