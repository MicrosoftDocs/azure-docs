---
 title: Azure IoT Device Provisioning Service (DPS) TLS support
 description: Best practices in using secure TLS connections for devices and services communicating with the IoT Device Provisioning Service (DPS)
 services: iot-dps
 author: wesmc7777
 ms.service: iot-dps
 ms.topic: conceptual
 ms.date: 06/18/2020
 ms.author: wesmc
---

# TLS support in Azure IoT Hub Device Provisioning Service (DPS)

DPS uses [Transport Layer Security (TLS)](http://wikipedia.org/wiki/Transport_Layer_Security) to secure connections from IoT devices. 

Current TLS protocol versions supported by DPS are: 
* TLS 1.2

TLS 1.0 and 1.1 are considered legacy and are planned for deprecation. For more information, see [Deprecating TLS 1.0 and 1.1 for IoT Hub](../iot-hub/iot-hub-tls-deprecating-1-0-and-1-1.md). 

## Restrict connections to TLS 1.2

For added security, it is advised to configure your DPS instances to *only* allow device client connections that use TLS version 1.2 and to enforce the use of [recommended ciphers](#recommended-ciphers).

To do this, provision a new DPS resource setting the `minTlsVersion` property to `1.2` in your Azure Resource Manager template's DPS resource specification. The following example template JSON specifies the `minTlsVersion` property for a new DPS instance.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "resources": [
        {
            "type": "Microsoft.Devices/ProvisioningServices",
            "apiVersion": "2020-01-01",
            "name": "<provide-a-valid-DPS-resource-name>",
            "location": "<any-region>",
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


> [!NOTE]
> Upon failovers, the `minTlsVersion` property of your DPS will remain effective in the geo-paired region post-failover.

## Recommended ciphers

DPS instances that are configured to accept only TLS 1.2 will also enforce the use of the following cipher suites:

### TLS 1.2 cipher suites

| Minimum Bar |
| :--- |
| `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`<br>`TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`<br>`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`<br>`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`<br>`TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`<br>`TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384` |

| Opportunity for Excellence |
| :--- |
| `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`<br>`TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`<br>`TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`<br>`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`<br>`TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384`<br>`TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256` |

### Cipher Suite Ordering Prior to Windows 10

| Minimum Bar |
| :--- |
| `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256_P256`<br>`TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384_P384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P384`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384` |

| Opportunity for Excellence |
| :--- |
| `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384_P384`<br>`TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256_P256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384_P384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256_P256`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P256` |

### Legacy Cipher Suites 

| Option #1 (better security) |
| :--- |
| `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA_P384 (uses SHA-1)`<br>`TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA_P256 (uses SHA-1)`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384   (uses SHA-1)`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256   (uses SHA-1)`<br>`TLS_RSA_WITH_AES_256_GCM_SHA384           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_GCM_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)` |

| Option #2 (better performance) |
| :--- |
| `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA_P256 (uses SHA-1)`<br>`TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA_P384 (uses SHA-1)`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256   (uses SHA-1)`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384   (uses SHA-1)`<br>`TLS_RSA_WITH_AES_128_GCM_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_GCM_SHA384           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)` |


## Use TLS 1.2 in the IoT SDKs

Use the links below to configure TLS 1.2 and allowed ciphers in the Azure IoT client SDKs.

| Language | Versions supporting TLS 1.2 | Documentation |
|----------|------------------------------------|---------------|
| C        | Tag 2019-12-11 or newer            | [Link](https://aka.ms/Tls_C_SDK_IoT) |
| Python   | Version 2.0.0 or newer             | [Link](https://aka.ms/Tls_Python_SDK_IoT) |
| C#       | Version 1.21.4 or newer            | [Link](https://aka.ms/Tls_CSharp_SDK_IoT) |
| Java     | Version 1.19.0 or newer            | [Link](https://aka.ms/Tls_Java_SDK_IoT) |
| NodeJS   | Version 1.12.2 or newer            | [Link](https://aka.ms/Tls_Node_SDK_IoT) |

## Use TLS 1.2 with IoT Hub

IoT Hub can be configured to use TLS 1.2 when communicating with devices. For more information, see [Deprecating TLS 1.0 and 1.1 for IoT Hub](../iot-hub/iot-hub-tls-deprecating-1-0-and-1-1.md).

## Use TLS 1.2 with IoT Edge

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub and DPS. For more information, see the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).