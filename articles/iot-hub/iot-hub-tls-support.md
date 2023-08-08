---
 title: Azure IoT Hub TLS support
 description: Learn about using secure TLS connections for devices and services communicating with IoT Hub
 services: iot-hub
 author: kgremban
 ms.service: iot-hub
 ms.topic: conceptual
 ms.date: 06/29/2021
 ms.author: kgremban
---

# Transport Layer Security (TLS) support in IoT Hub

IoT Hub uses Transport Layer Security (TLS) to secure connections from IoT devices and services. Three versions of the TLS protocol are currently supported, namely versions 1.0, 1.1, and 1.2.

TLS 1.0 and 1.1 are considered legacy and are planned for deprecation. For more information, see [Deprecating TLS 1.0 and 1.1 for IoT Hub](iot-hub-tls-deprecating-1-0-and-1-1.md). To avoid future issues, use TLS 1.2 as the only TLS version when connecting to IoT Hub.

## IoT Hub's server TLS certificate

During a TLS handshake, IoT Hub presents RSA-keyed server certificates to connecting clients. Its' root is the Baltimore Cybertrust Root CA. Because the Baltimore root is at end-of-life, we'll be migrating to a new root called DigiCert Global G2. This change will impact all devices currently connecting to IoT Hub. To prepare for this migration and for all other details, see [IoT TLS certificate update](https://aka.ms/iot-ca-updates).

### Elliptic Curve Cryptography (ECC) server TLS certificate (preview)

IoT Hub ECC server TLS certificate is available for public preview. While offering similar security to RSA certificates, ECC certificate validation (with ECC-only cipher suites) uses up to 40% less compute, memory, and bandwidth. These savings are important for IoT devices because of their smaller profiles and memory, and to support use cases in network bandwidth limited environments. The ECC server certificate's root is DigiCert Global Root G3.

To preview IoT Hub's ECC server certificate:

1. [Create a new IoT hub with preview mode on](iot-hub-preview-mode.md).
1. [Configure your client](#tls-configuration-for-sdk-and-iot-edge) to include *only* ECDSA cipher suites and *exclude* any RSA ones. These are the supported cipher suites for the ECC certificate public preview:
    - `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`
    - `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`
    - `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`
    - `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384`
1. Connect your client to the preview IoT hub.

## TLS 1.2 enforcement available in select regions

For added security, configure your IoT Hubs to *only* allow client connections that use TLS version 1.2 and to enforce the use of [cipher suites](#cipher-suites). This feature is only supported in these regions:

* East US
* South Central US
* West US 2
* US Gov Arizona
* US Gov Virginia (TLS 1.0/1.1 support isn't available in this region - TLS 1.2 enforcement must be enabled or IoT hub creation fails)

To enable TLS 1.2 enforcement, follow the steps in [Create IoT hub in Azure portal](iot-hub-create-through-portal.md), except

- Choose a **Region** from one in the list above.
- Under **Management -> Advanced -> Transport Layer Security (TLS) -> Minimum TLS version**, select **1.2**. This setting only appears for IoT hub created in supported region.

    :::image type="content" source="media/iot-hub-tls-12-enforcement.png" alt-text="Screenshot showing how to turn on TLS 1.2 enforcement during IoT hub creation":::

To use ARM template for creation, provision a new IoT Hub in any of the supported regions and set the `minTlsVersion` property to `1.2` in the resource specification:

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

The created IoT Hub resource using this configuration will refuse device and service clients that attempt to connect using TLS versions 1.0 and 1.1. Similarly, the TLS handshake will be refused if the `ClientHello` message does not list any of the [recommended ciphers](#cipher-suites).

> [!NOTE]
> The `minTlsVersion` property is read-only and cannot be changed once your IoT Hub resource is created. It is therefore essential that you properly test and validate that *all* your IoT devices and services are compatible with TLS 1.2 and the [recommended ciphers](#cipher-suites) in advance.
> 
> Upon failovers, the `minTlsVersion` property of your IoT Hub will remain effective in the geo-paired region post-failover.

## Cipher suites

IoT Hubs that are configured to accept only TLS 1.2 will also enforce the use of the following recommended cipher suites:

* `TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
* `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256`
* `TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384`

For IoT Hubs not configured for TLS 1.2 enforcement, TLS 1.2 still works with the following cipher suites:

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
* `TLS_RSA_WITH_3DES_EDE_CBC_SHA` **(This cipher will be deprecated on 10/01/2022 and will no longer be used for TLS handshakes)**

A client can suggest a list of higher cipher suites to use during `ClientHello`. However, some of them might not be supported by IoT Hub (for example, `ECDHE-ECDSA-AES256-GCM-SHA384`). In this case, IoT Hub will try to follow the preference of the client, but eventually negotiate down the cipher suite with `ServerHello`.

## TLS configuration for SDK and IoT Edge

Use the links below to configure TLS 1.2 and allowed ciphers in IoT Hub client SDKs.

| Language | Versions supporting TLS 1.2 | Documentation |
|----------|------------------------------------|---------------|
| C        | Tag 2019-12-11 or newer            | [Link](https://aka.ms/Tls_C_SDK_IoT) |
| Python   | Version 2.0.0 or newer             | [Link](https://aka.ms/Tls_Python_SDK_IoT) |
| C#       | Version 1.21.4 or newer            | [Link](https://aka.ms/Tls_CSharp_SDK_IoT) |
| Java     | Version 1.19.0 or newer            | [Link](https://aka.ms/Tls_Java_SDK_IoT) |
| NodeJS   | Version 1.12.2 or newer            | [Link](https://aka.ms/Tls_Node_SDK_IoT) |

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub. For this purpose, use the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).

## Device authentication

After a successful TLS handshake, IoT Hub can authenticate a device using a symmetric key or an X.509 certificate. For certificate-based authentication, this can be any X.509 certificate, including ECC. IoT Hub validates the certificate against the thumbprint or certificate authority (CA) you provide. To learn more, see [Supported X.509 certificates](iot-hub-dev-guide-sas.md#supported-x509-certificates).

## Mutual TLS support

Mutual TLS authentication ensures that the client _authenticates_ the server (IoT Hub) certificate and the server (IoT Hub) _authenticates_ the [X.509 client certificate or X.509 thumbprint](tutorial-x509-test-certs.md#create-a-client-certificate-for-a-device). _Authorization_ is performed by IoT Hub after _authentication_ is complete.

For AMQP and MQTT protocols, IoT Hub requests a client certificate in the initial TLS handshake. If one is provided, IoT Hub _authenticates_ the client certificate and the client _authenticates_ the IoT Hub certificate. This process is called mutual TLS authentication. When IoT Hub receives an MQTT connect packet or an AMQP link opens, IoT Hub performs _authorization_ for the requesting client and determines if the client requires X.509 authentication. If mutual TLS authentication was completed and the client is authorized to connect as the device, it is allowed. However, if the client requires X.509 authentication and client authentication was not completed during the TLS handshake, then IoT Hub rejects the connection.

For HTTP protocol, when the client makes its first request, IoT Hub checks if the client requires X.509 authentication and if client authentication was complete then IoT Hub performs authorization. If client authentication was not complete, then IoT Hub rejects the connection


## Certificate pinning

[Certificate pinning](https://www.digicert.com/blog/certificate-pinning-what-is-certificate-pinning) and filtering of the TLS server certificates (aka leaf certificates) and intermediate certificates associated with IoT Hub endpoints is strongly discouraged as Microsoft frequently rolls these certificates with little or no notice. If you must, only pin the root certificates as described in this [Azure IoT blog post](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).

## TLS maximum fragment length negotiation (preview)

IoT Hub also supports TLS maximum fragment length negotiation, which is sometimes known as TLS frame size negotiation. This feature is in public preview. 

Use this feature to specify the maximum plaintext fragment length to a value smaller than the default 2^14 bytes. Once negotiated, IoT Hub and the client begin fragmenting messages to ensure all fragments are smaller than the negotiated length. This behavior is helpful to compute or memory constrained devices. To learn more, see the [official TLS extension spec](https://tools.ietf.org/html/rfc6066#section-4).

Official SDK support for this public preview feature isn't yet available. To get started

1. [Create a new IoT hub with preview mode on](iot-hub-preview-mode.md).
1. When using OpenSSL, call [SSL_CTX_set_tlsext_max_fragment_length](https://manpages.debian.org/testing/libssl-doc/SSL_CTX_set_max_send_fragment.3ssl.en.html) to specify the fragment size.
1. Connect your client to the preview IoT Hub.

## Next steps

- To learn more about IoT Hub security and access control, see [Control access to IoT Hub](iot-hub-devguide-security.md).
- To learn more about using X509 certificate for device authentication, see [Device Authentication using X.509 CA Certificates](iot-hub-x509ca-overview.md)
