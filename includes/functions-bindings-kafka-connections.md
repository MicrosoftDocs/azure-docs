---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 12/11/2025
ms.author: glenga
ms.custom: sfi-ropc-nochange
---

## Connections

Store all connection information required by your triggers and bindings in application settings, not in the binding definitions in your code. This guidance applies to credentials, which you should never store in your code.

> [!IMPORTANT]
> Credential settings must reference an [application setting](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings). Don't hard-code credentials in your code or configuration files. When running locally, use the [local.settings.json file](../articles/azure-functions/functions-develop-local.md#local-settings-file) for your credentials, and don't publish the local.settings.json file.

### [Confluent](#tab/confluent)

When connecting to a managed Kafka cluster provided by [Confluent in Azure](https://www.confluent.io/azure/), you can use one of the following authentication methods.

> [!NOTE]
> When using the Flex Consumption plan, file location-based certificate authentication properties (`SslCaLocation`, `SslCertificateLocation`, `SslKeyLocation`) aren't supported. Instead, use the PEM-based certificate properties (`SslCaPEM`, `SslCertificatePEM`, `SslKeyPEM`, `SslCertificateandKeyPEM`) or store certificates in Azure Key Vault. 

#### Schema Registry

To make use of schema registry provided by Confluent in Kafka Extension, set the following credentials:

| Setting | Recommended Value | Description |
| --- | --- | --- |
| **SchemaRegistryUrl** | `SchemaRegistryUrl` | URL of the schema registry service used for schema management. Usually of the format `https://psrc-xyz.us-east-2.aws.confluent.cloud` |
| **SchemaRegistryUsername** | `CONFLUENT_API_KEY` | Username for basic auth on schema registry (if required). |
| **SchemaRegistryPassword** | `CONFLUENT_API_SECRET` | Password for basic auth on schema registry (if required). |

#### Username/Password authentication

While using this form of authentication, make sure that `Protocol` is set to either `SaslPlaintext` or `SaslSsl`, `AuthenticationMode` is set to `Plain`, `ScramSha256` or `ScramSha512` and, if the CA cert being used is different from the default ISRG Root X1 cert, make sure to update `SslCaLocation` or `SslCaPEM`.

| Setting | Recommended value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | App setting named `BootstrapServer` contains the value of bootstrap server found in Confluent Cloud settings page. The value resembles `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`. |
| **Username** | `ConfluentCloudUsername` | App setting named `ConfluentCloudUsername` contains the API access key from the Confluent Cloud web site. |
| **Password** | `ConfluentCloudPassword` | App setting named `ConfluentCloudPassword` contains the API secret obtained from the Confluent Cloud web site. |
| **SslCaPEM** | `SSLCaPemCertificate` | App setting named `SSLCaPemCertificate` that contains the CA certificate as a string in PEM format. The value should follow the standard format, for example: `-----BEGIN CERTIFICATE-----\nMII....JQ==\n-----END CERTIFICATE-----`. |

#### SSL authentication

Ensure that `Protocol` is set to `SSL`.

| Setting | Recommended Value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | App setting named `BootstrapServer` contains the value of bootstrap server found in Confluent Cloud settings page. The value resembles `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`. |
| **SslCaPEM** | `SslCaCertificatePem` | App setting named `SslCaCertificatePem` that contains PEM value of the CA certificate as a string. The value should follow the standard format: `-----BEGIN CERTIFICATE-----\nMII...JQ==\n-----END CERTIFICATE-----` |
| **SslCertificatePEM** | `SslClientCertificatePem` | App setting named `SslClientCertificatePem` that contains PEM value of the client certificate as a string. The value should follow the standard format: `-----BEGIN CERTIFICATE-----\nMII...JQ==\n-----END CERTIFICATE-----` |
| **SslKeyPEM** | `SslClientKeyPem` | App setting named `SslClientKeyPem` that contains PEM value of the client private key as a string. The value should follow the standard format: `-----BEGIN PRIVATE KEY-----\nMII...JQ==\n-----END PRIVATE KEY-----` |
| **SslCertificateandKeyPEM** | `SslClientCertificateAndKeyPem` | App setting named `SslClientCertificateAndKeyPem` that contains PEM value of the client certificate and client private key concatenated as a string. The value should follow the standard format: `-----BEGIN CERTIFICATE-----\nMII....JQ==\n-----END CERTIFICATE-----\n-----BEGIN PRIVATE KEY-----\nMIIE....BM=\n-----END PRIVATE KEY-----` |
| **SslKeyPassword** | `SslClientKeyPassword` | App setting named `SslClientKeyPassword` that contains the password for the private key (if any). |

#### OAuth authentication

When using OAuth authentication, configure the OAuth-related properties in your binding definitions.

### [Event Hubs](#tab/event-hubs)

When connecting to Event Hubs, make sure that the following authentication credentials for your Event Hubs instance are set in your trigger or binding:

| Setting | Recommended value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | App setting named `BootstrapServer` contains the fully qualified domain name of your Event Hubs instance. The value resembles `<MY_NAMESPACE_NAME>.servicebus.windows.net:9093`. | 
| **Username** | `$ConnectionString` | Actual value is obtained from the connection string. |
| **Password** | `%EventHubsConnectionString%` | App setting named `EventHubsConnectionString` contains the connection string for your Event Hubs namespace. To learn more, see [Get an Event Hubs connection string](../articles/event-hubs/event-hubs-get-connection-string.md).|

---

The string values you use for these settings must be present as [application settings in Azure](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings) or in the `Values` collection in the [local.settings.json file](../articles/azure-functions/functions-develop-local.md#local-settings-file) during local development.

You should also set the `Protocol` and `AuthenticationMode` in your binding definitions.