---
 title: Azure IoT Hub TLS support
 description: Learn about using secure TLS connections for devices and services communicating with IoT Hub
 services: iot-hub
 author: SoniaLopezBravo
 ms.service: azure-iot-hub
 ms.topic: how-to
 ms.date: 06/05/2025
 ms.author: sonialopez
 ms.custom: references_regions
---

# Transport Layer Security (TLS) support in IoT Hub

IoT Hub uses Transport Layer Security (TLS) to secure connections from IoT devices and services. 

> [!NOTE]
> Azure IoT Hub will end support for TLS 1.0 and 1.1 in alignment with the Azure wide service announcement for [TLS 1.0 and 1.1 retirement](https://azure.microsoft.com/updates?id=update-retirement-tls1-0-tls1-1-versions-azure-services) on **August 31, 2025**. In addition, IoT Hub will no longer support weak cipher suites as of August 31, 2025. Only recommended strong cipher suites will be supported for both existing and new IoT Hubs. 
>
> It's therefore essential that you properly test and validate that *all* your IoT devices and services are compatible with TLS 1.2 and the [recommended ciphers](#cipher-suites) in advance. It's highly recommended to use the [minimum TLS enforcement feature](#enforce-iot-hub-to-use-tls-12-and-strong-cipher-suites) as the mechanism for testing and compliance.


> [!IMPORTANT]
>  It’s important to distinguish between **TLS 1.2 support** and **TLS 1.2 enforcement**. TLS 1.2 is supported on all IoT Hubs, meaning that IoT Hubs can handle connections using the TLS 1.2 protocol. On the other hand, TLS 1.2 enforcement ensures that IoT Hub **only** accepts connections using TLS 1.2 or higher. When TLS 1.2 enforcement is enabled, the service also enforces the use of [strong cipher suites](#cipher-suites).
> > Currently, TLS 1.2 enforcement is supported only in public cloud regions.
> 
> To find out the version of TLS your IoT Hub devices are running, refer to [TLS 1.0 and 1.1 end of support guide](#checking-tls-versions-and-cipher-suites-for-iot-hub-devices).

## Mutual TLS support

Mutual TLS authentication ensures that the client _authenticates_ the server (IoT Hub) certificate and the server (IoT Hub) _authenticates_ the client using [X.509 client certificate or X.509 thumbprint](tutorial-x509-test-certs.md#create-a-client-certificate-for-a-device). IoT Hub performs _authorization_ after _authentication_ is complete.

For Advanced Message Queuing Protocol (AMQP) and Message Queuing Telemetry Transport (MQTT) protocols, IoT Hub requests a client certificate in the initial TLS handshake. If one is provided, IoT Hub _authenticates_ the client certificate, and the client _authenticates_ the IoT Hub certificate. This process is called mutual TLS authentication. When IoT Hub receives an MQTT connect packet or an AMQP link opens, IoT Hub performs _authorization_ for the requesting client and determines if the client requires X.509 authentication. If mutual TLS authentication was completed and the client is authorized to connect as the device, It's allowed. However, if the client requires X.509 authentication and client authentication wasn't completed during the TLS handshake, then IoT Hub rejects the connection.

For HTTP protocol, when the client makes its first request, IoT Hub checks if the client requires X.509 authentication and if client authentication was complete then IoT Hub performs authorization. If client authentication wasn't complete, then IoT Hub rejects the connection

After a successful TLS handshake, IoT Hub can authenticate a device using a symmetric key or an X.509 certificate. For certificate-based authentication, IoT Hub validates the certificate against the thumbprint or certificate authority (CA) you provide. To learn more, see [Authenticate identities with X.509 certificates](authenticate-authorize-x509.md).

### IoT Hub's server TLS certificate

During a TLS handshake, IoT Hub presents RSA-keyed server certificates to connecting clients. All IoT hubs in the global Azure cloud use the TLS certificate issued by the DigiCert Global Root G2. 

We strongly recommend that all devices trust the following three root CAs: 

* DigiCert Global G2 root CA
* Microsoft RSA root CA 2017

For links to download these certificates, see [Azure Certificate Authority details](../security/fundamentals/azure-CA-details.md).

Root CA migrations are rare. You should always prepare your IoT solution for the unlikely event that a root CA is compromised and an emergency root CA migration is necessary.

## Cipher suites

Starting **August 31, 2025**, IoT Hub enforces the use of recommended strong cipher suites for all existing and new IoT Hubs. Non-recommended (weak) cipher suites aren't supported past this date.  

To comply with Azure security policy for a secure connection, IoT Hub only supports the following RSA and ECDSA cipher suites:

* TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384

> [!NOTE]
> ECDSA cipher suites are only available in public cloud regions.

The following non-recommended cipher suites are allowed on hubs **without minTlsVersion:1.2** until August 31, 2025: 

* TLS_DHE_RSA_WITH_AES_256_GCM_SHA384
* TLS_DHE_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_256_GCM_SHA384
* TLS_RSA_WITH_AES_128_GCM_SHA256
* TLS_RSA_WITH_AES_256_CBC_SHA256
* TLS_RSA_WITH_AES_128_CBC_SHA256
* TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA
* TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA
* TLS_RSA_WITH_AES_128_CBC_SHA
* TLS_RSA_WITH_AES_256_CBC_SHA

A client can suggest a list of higher cipher suites to use during `ClientHello`. However, IoT Hub might not support some of them, for example, `ECDHE-ECDSA-AES256-GCM-SHA384`. In this case, IoT Hub tries to follow the preference of the client but eventually negotiate down the cipher suite with `ServerHello`.

> [!NOTE]
> When using an ECDSA or ECDHE cipher, the client must provide the `supported_groups` extension in the `ClientHello` with a valid group. When connecting with a client certificate, the client must include the curve used in that client certificate in its `supported_groups` extension.

## Update IoT Hub to TLS 1.2 support

Once an IoT Hub is created, the `minTlsVersion` property can be updated using the Azure portal, CLI, or SDKs. If you need to update to enforce IoT Hub to use TLS 1.2 and strong cipher suites (only allowed in selected regions) or to set TLS 1.2 support (supported in all regions), you can do so following these steps.

To update IoT Hub to support TLS 1.2 and/or enforce strong cipher suites in Azure portal: 

1. Navigate to your existing IoT Hub in the [Azure portal](https://portal.azure.com). 
1. In the **Overview** tab in the left menu, click on the **Minimum TLS Version link** from the Essentials section. 

    :::image type="content" source="media/iot-hub-tls-support/iot-hub-tls-support-1.png" alt-text="Screenshot showing how to choose TLS support minimum version." lightbox="media/iot-hub-tls-support/iot-hub-tls-support-1.png":::

1. From the Minimum TLS version side window, select **1.2** to ensure that only devices supporting TLS 1.2 or higher can connect. 
1. Click on **Update**. 

    :::image type="content" source="media/iot-hub-tls-support/iot-hub-tls-support-2.png" alt-text="Screenshot showing how to turn on TLS 1.2 support." lightbox="media/iot-hub-tls-support/iot-hub-tls-support-2.png":::

> [!NOTE]
> You can update your IoT Hub to TLS 1.2 in all public cloud regions.

## Enforce IoT Hub to use TLS 1.2 and strong cipher suites

To ensure your IoT devices are TLS 1.2 and [strong cipher suites](#cipher-suites) compliance, you can enforce compliance using minimum TLS enforcement feature in Azure IoT Hub.

> [!NOTE]
> Currently this feature is only available in public cloud regions.

To enable TLS 1.2 and strong cipher suites enforcement in Azure portal:

1. Go to the IoT Hub create wizard in Azure portal.
1. Choose a **Region** from the list of supported regions.
1. Under **Management -> Advanced -> Transport Layer Security (TLS) -> Minimum TLS version**, select **1.2**. This setting only appears for IoT hub created in supported region.

    :::image type="content" source="media/iot-hub-tls-12-enforcement.png" alt-text="Screenshot showing how to turn on TLS 1.2 enforcement during IoT hub creation.":::

1. Select **Create**
1. Connect your IoT devices to this IoT Hub.

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

The created IoT hub resource using this configuration refuses device and service clients that attempt to connect using TLS versions 1.0 and 1.1. Similarly, the TLS handshake is refused if the `ClientHello` message doesn't list any of the [recommended ciphers](#cipher-suites).

> [!NOTE] 
> Upon failover, the `minTlsVersion` property of your IoT Hub remains effective in the geo-paired region post-failover.

## Checking TLS versions and cipher suites for IoT Hub devices

Azure IoT Hub provides the capability to check the TLS version, cipher suites, and other device connection metrics to help monitor the security of IoT devices. You can either use IoT Hub metrics or diagnostic logs to track TLS version usage and other related properties like [Cipher Suites](#cipher-suites).

> [!NOTE]
> Currently this feature is only available in public cloud regions. 

### Checking TLS versions and cipher suites using IoT Hub metrics

If you want to validate that device traffic to IoT Hub is utilizing TLSv1.2 and strong cipher suites, you can check IoT Hub’s metrics. This allows you to filter by TLS version or cipher suite and check the number of successful connections. 

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.
1. In the left-side menu under **Monitoring**,  select **Metrics**.
1. Add the metric **Successful Connects**.

    :::image type="content" source="./media/iot-hub-tls-support/tls-versions-support-metrics.png" alt-text="Screenshot showing how to add the Successful Connects metric.":::

1. Filter by TLS Version or cipher suite by selecting the **Add filter** button and choosing the appropriate property, TLS Version or cipher suite, operator, for example "=", and value, for example, TLSv1.2.

    :::image type="content" source="./media/iot-hub-tls-support/tls-versions-support-metrics-filter.png" alt-text="Screenshot showing how to filter by TLS Version or Cipher Suite.":::

1. After applying the filter, you see the sum of devices with successful IoT Hub connections based on the filtered property and value(s).  

### Checking TLS versions and cipher suites using IoT Hub diagnostic logs

Azure IoT Hub can provide diagnostic logs for several categories that can be analyzed using Azure Monitor Logs. In the connections log you can find the TLS version and cipher suite for your IoT Hub devices. 

To view these logs, follow these steps: 

1. In the [Azure portal](https://portal.azure.com), go to your IoT hub.
1. In the left-side menu under **Monitoring**,  select **Diagnostic settings**. Ensure diagnostic settings have "Connections" checked.
1. In the left-side menu under **Monitoring**,  select **Logs**.
1. Enter the following query:

    ```kusto
    AzureDiagnostics
    | where ResourceProvider == "MICROSOFT.DEVICES" and ResourceType == "IOTHUBS"
    | where Category == "Connections"
    | where OperationName == "deviceConnect"
    | extend props_json = parse_json(properties_s)
    | project DeviceId = props_json.deviceId, TLSVersion = props_json.tlsVersion
    ```

1. An example of the query results looks like this:

    :::image type="content" source="./media/iot-hub-tls-support/query-result.png" alt-text="Diagram showing the query for device TLS version.":::

> [!NOTE]
> TLS version query isn't available for devices using HTTPS connections.


## TLS configuration for SDK and IoT Edge

Use the following links to configure TLS 1.2 and allowed ciphers in IoT Hub client SDKs.

| Language | Versions supporting TLS 1.2 | Documentation |
|----------|------------------------------------|---------------|
| C        | Tag 2019-12-11 or newer            | [Link](https://aka.ms/Tls_C_SDK_IoT) |
| Python   | Version 2.0.0 or newer             | [Link](https://aka.ms/Tls_Python_SDK_IoT) |
| C#       | Version 1.21.4 or newer            | [Link](https://aka.ms/Tls_CSharp_SDK_IoT) |
| Java     | Version 1.19.0 or newer            | [Link](https://aka.ms/Tls_Java_SDK_IoT) |
| Node.js  | Version 1.12.2 or newer            | [Link](https://aka.ms/Tls_Node_SDK_IoT) |

IoT Edge devices can be configured to use TLS 1.2 when communicating with IoT Hub. For this purpose, use the [IoT Edge documentation page](https://github.com/Azure/iotedge/blob/master/edge-modules/edgehub-proxy/README.md).


## Elliptic Curve Cryptography (ECC) server TLS certificate

While offering similar security to RSA certificates, ECC certificate validation (with ECC-only cipher suites) uses up to 40% less compute, memory, and bandwidth. These savings are important for IoT devices because of their smaller profiles and memory, and to support use cases in network bandwidth limited environments. 

To use IoT Hub's ECC server certificate:
1. Ensure all devices trust the following root CAs:
   * DigiCert Global G2 root CA
   * Microsoft RSA root CA 2017
3. [Configure your client](#tls-configuration-for-sdk-and-iot-edge) to include *only* ECDSA cipher suites and *exclude* any RSA ones. These are the supported cipher suites for the ECC certificate:
   * `TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256`
   * `TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384`
   * `TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256`
   * `TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384`
4. Connect your client to the IoT hub.

> [!NOTE]
> Currently this feature is only available in public cloud regions.

## TLS maximum fragment length negotiation 

IoT Hub also supports TLS maximum fragment length negotiation, which is sometimes known as TLS frame size negotiation. This feature is in public preview. 

Use this feature to specify the maximum plaintext fragment length to a value smaller than the default 2^14 bytes. Once negotiated, IoT Hub and the client begin fragmenting messages to ensure all fragments are smaller than the negotiated length. This behavior is helpful to compute or memory constrained devices. To learn more, see the [official TLS extension spec](https://tools.ietf.org/html/rfc6066#section-4).

Official SDK support for this public preview feature isn't yet available. To get started

1. Create an IoT Hub.
1. When using OpenSSL, call [SSL_CTX_set_tlsext_max_fragment_length](https://manpages.debian.org/testing/libssl-doc/SSL_CTX_set_max_send_fragment.3ssl.en.html) to specify the fragment size.
1. Connect your client to the IoT Hub.

> [!NOTE]
> Currently this feature is only available in public cloud regions.

## Certificate pinning

[Certificate pinning](https://www.digicert.com/blog/certificate-pinning-what-is-certificate-pinning) and filtering of the TLS server certificates and intermediate certificates associated with IoT Hub endpoints is strongly discouraged as Microsoft frequently rolls these certificates with little or no notice. If you must, only pin the root certificates as described in this [Azure IoT blog post](https://techcommunity.microsoft.com/t5/internet-of-things-blog/azure-iot-tls-critical-changes-are-almost-here-and-why-you/ba-p/2393169).


## Next steps

- To learn more about IoT Hub security and access control, see [Control access to IoT Hub](iot-hub-devguide-security.md).
- To learn more about using X509 certificate for device authentication, see [Device Authentication using X.509 CA Certificates](iot-hub-x509ca-overview.md)
