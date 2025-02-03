---
title: TLS support with DPS
titleSuffix: Azure IoT Hub Device Provisioning Service
description: Best practices in using secure TLS connections for devices and services communicating with the IoT Device Provisioning Service (DPS)
author: kgremban

ms.author: kgremban
ms.service: azure-iot-hub
ms.topic: concept-article
ms.date: 11/27/2024
ms.subservice: azure-iot-hub-dps
---

# TLS support in Azure IoT Hub Device Provisioning Service (DPS)

DPS uses [Transport Layer Security (TLS)](http://wikipedia.org/wiki/Transport_Layer_Security) to secure connections from IoT devices.

Current TLS protocol versions supported by DPS are:

* TLS 1.2

## Restrict connections to a minimum TLS version

You can configure your DPS instances to *only* allow device client connections that use a minimum TLS version or greater.

> [!IMPORTANT]
>
> Currently, DPS only supports TLS 1.2, so there is no need to specify the minimum TLS version when you create a DPS instance. This feature is provided for future expansion.

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

The DPS resource created using this configuration refuses devices that attempt to connect using TLS versions 1.0 and 1.1.

> [!NOTE]
> The `minTlsVersion` property is read-only and cannot be changed once your DPS resource is created. It is therefore essential that you properly test and validate that *all* your IoT devices are compatible with TLS 1.2 and the [recommended ciphers](#recommended-ciphers) in advance.

> [!NOTE]
> Upon failovers, the `minTlsVersion` property of your DPS will remain effective in the geo-paired region post-failover.

## Recommended ciphers

DPS instances enforce the use of the following recommended and legacy cipher suites:

| Recommended TLS 1.2 cipher suites |
| :--- |
| `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`<br>`TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256` |

### Legacy cipher suites

These cipher suites are still supported by DPS but will be depreciated. Use the recommended cipher suites if possible.

| Option #1 (better security) |
| :--- |
| `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384   (uses SHA-1)`<br>`TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256   (uses SHA-1)`<br>`TLS_RSA_WITH_AES_256_GCM_SHA384           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_GCM_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)` |

| Option #2 (better performance) |
| :--- |
| `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA_P256   (uses SHA-1)`<br>`TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA_P384   (uses SHA-1)`<br>`TLS_RSA_WITH_AES_128_GCM_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_GCM_SHA384           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA256           (lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_128_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)`<br>`TLS_RSA_WITH_AES_256_CBC_SHA              (uses SHA-1, lack of Perfect Forward Secrecy)` |

## Mutual TLS support

When DPS enrollments are configured for X.509 authentication, mutual TLS (mTLS) is supported by DPS.

## Server TLS certificate

During a TLS handshake, DPS presents RSA-keyed server certificates to connecting clients. All DPS instances in the global Azure cloud use the TLS certificate issued by the DigiCert Global Root G2 certificate. 

We also recommend adding the Microsoft RSA Root Certificate Authority 2017 certificates to your devices to prevent disruptions in case the DigiCert Global Root G2 is retired unexpectedly. Although root CA migrations are rare, for resilience in the modern security landscape you should prepare your IoT scenario for the unlikely event that a root CA is compromised or an emergency root CA migration is necessary.

We strongly recommend that all devices trust the following root CAs:

* DigiCert Global G2 root CA
* Microsoft RSA root CA 2017

For links to download these certificates, see [Azure Certificate Authority details](../security/fundamentals/azure-CA-details.md).

### Certificate trust in the SDKs

The [Azure IoT device SDKs](../iot-hub/iot-hub-devguide-sdks.md) connect and authenticate devices to Azure IoT services. The different SDKs manage certificates in different ways depending on the language and version, but most rely on the device's trusted certificate store rather than pinning certificates directly in the codebase. This approach provides flexibility and resilience to handle future changes in root certificates. 

The following table summarizes which SDK versions support the trusted certificate store:

| Azure IoT device SDK | Supported versions |
| -------------------- | ------------------ |
| C | All currently supported versions |
| C# | All currently supported versions |
| Java | Version 2.x.x and higher |
| Node.js | All currently supported versions |
| Python | All currently supported versions |

### Certificate pinning

[Certificate pinning](https://www.digicert.com/blog/certificate-pinning-what-is-certificate-pinning) and filtering of the TLS server certificates (also known as leaf certificates) and intermediate certificates associated with DPS endpoints is discouraged as Microsoft frequently rolls these certificates with little or no notice. If you must, only pin the root certificates.

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

IoT Hub can be configured to use TLS 1.2 when communicating with devices. For more information, see [IoT Hub TLS enforcement](../iot-hub/iot-hub-tls-support.md#enforce-iot-hub-to-use-tls-12-and-strong-cipher-suites).

## Use TLS 1.2 with IoT Edge

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub and DPS. For more information, see the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).
