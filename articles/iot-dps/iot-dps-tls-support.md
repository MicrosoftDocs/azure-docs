---
 title: Azure IoT Device Provisioning Service (DPS) TLS support
 description: Best practices in using secure TLS connections for devices and services communicating with the IoT Device Provisioning Service (DPS)
 services: iot-dps
 author: wesmc7777
 ms.service: iot-dps
 ms.topic: conceptual
 ms.date: 05/03/2020
 ms.author: wesmc
---

# TLS support in IoT Hub DPS

DPS uses Transport Layer Security (TLS) to secure connections from IoT devices. Three versions of the TLS protocol are currently supported, namely versions 1.0, 1.1, and 1.2.

TLS 1.0 and 1.1 are considered legacy and are planned for deprecation. For more information, see [Deprecating TLS 1.0 and 1.1 for IoT Hub](../iot-hub/iot-hub-tls-deprecating-1-0-and-1-1.md). It is strongly recommended that you use TLS 1.2 as the preferred TLS version when connecting to DPS.

## Restrict connections to TLS 1.2

For added security, it is advised to configure your DPS instances to *only* allow device client connections that use TLS version 1.2 and to enforce the use of [recommended ciphers](#recommended-ciphers).

To do this, provision a new DPS resource in any of the [supported regions](#supported-regions) and set the `minTlsVersion` property to `1.2` in your Azure Resource Manager template's DPS resource specification. The following example template JSON specifies the `minTlsVersion` property for a new DPS instance.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Devices/ProvisioningServices",
            "apiVersion": "2020-01-01",
            "name": "<provide-a-valid-DPS-resource-name>",
            "location": "<any-of-supported-regions-below>",
            "properties": {
                "minTlsVersion": "1.2"
            },
            "sku": {
                "name": "S1",
                "capacity": 1
            },
        }     
    ]
}
```

You can deploy the template with the following Azure CLI command. 

```azurecli
az deployment group create -g <your resource group name> --template-file template.json
```

For more information on creating DPS resources with Resource Manager templates, see, [Set up DPS with an Azure Resource Manager template](quick-setup-auto-provision-rm.md).

The DPS resource created using this configuration will refuse devices that attempt to connect using TLS versions 1.0 and 1.1. Similarly, the TLS handshake will be refused if the device client's HELLO message does not list any of the [recommended ciphers](#recommended-ciphers).

> [!NOTE]
> The `minTlsVersion` property is read-only and cannot be changed once your DPS resource is created. It is therefore essential that you properly test and validate that *all* your IoT devices are compatible with TLS 1.2 and the [recommended ciphers](#recommended-ciphers) in advance.

## Supported regions

IoT DPS instances that require the use of TLS 1.2 can be created in the following regions:

* East US
* South Central US
* West US 2
* US Gov Arizona
* US Gov Virginia

> [!NOTE]
> Upon failovers, the `minTlsVersion` property of your DPS will remain effective in the geo-paired region post-failover.

## Recommended ciphers

DPS instances that are configured to accept only TLS 1.2 will also enforce the use of the following recommended ciphers:

* `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`

## Use TLS 1.2 in the IoT SDKs

Use the links below to configure TLS 1.2 and allowed ciphers in the Azure IoT client SDKs.

| Language | Versions supporting TLS 1.2 | Documentation |
|----------|------------------------------------|---------------|
| C        | Tag 2019-12-11 or newer            | [Link](https://aka.ms/Tls_C_SDK_IoT) |
| Python   | Version 2.0.0 or newer             | [Link](https://aka.ms/Tls_Python_SDK_IoT) |
| C#       | Version 1.21.4 or newer            | [Link](https://aka.ms/Tls_CSharp_SDK_IoT) |
| Java     | Version 1.19.0 or newer            | [Link](https://aka.ms/Tls_Java_SDK_IoT) |
| NodeJS   | Version 1.12.2 or newer            | [Link](https://aka.ms/Tls_Node_SDK_IoT) |


## Use TLS 1.2 with IoT Edge

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub and DPS. For this purpose, use the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).