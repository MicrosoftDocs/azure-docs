---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 08/31/2026
ms.author: glenga
---

## Connections

The Kafka binding extension doesn't support managed identity connections. You must use one of these methods to authenticate your Kafka connections:

+ **[Key Vault reference](/azure/key-vault/general/overview)**: Store your Kafka credentials (passwords, API keys, certificates) in Azure Key Vault and reference them from your app settings. Your function app connects to Key Vault using managed identities. For more information, see [Define Key Vault connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-keyvault&tabs=bindings#define-connections).
+ **[App Configuration reference](../articles/azure-app-configuration/quickstart-azure-functions-csharp.md)**: Store connection settings in Azure App Configuration, which can also reference Key Vault for secrets. For more information, see [Azure App Configuration](../articles/azure-functions/manage-connections.md#azure-app-configuration).
+ **Shared secret**: Store credentials directly in app settings (encrypted at rest). For more information, see [Define shared secret connections](../articles/azure-functions/manage-connections.md?pivots=functions-auth-secret&tabs=bindings#define-connections).

To learn more about connection security, see [Manage connections in Azure Functions](../articles/azure-functions/manage-connections.md).

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
| **SslCaPEM** | `%SSLCaPemCertificate%` | App setting named `SSLCaPemCertificate` that references an Azure Key Vault secret containing the CA certificate in PEM format. |

#### SSL authentication

Ensure that `Protocol` is set to `SSL`.

| Setting | Recommended Value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | App setting named `BootstrapServer` contains the value of bootstrap server found in Confluent Cloud settings page. The value resembles `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`. |
| **SslCaPEM** | `%SslCaCertificatePem%` | App setting named `SslCaCertificatePem` that references an Azure Key Vault secret containing the CA certificate in PEM format. |
| **SslCertificatePEM** | `%SslClientCertificatePem%` | App setting named `SslClientCertificatePem` that references an Azure Key Vault secret containing the client certificate in PEM format. |
| **SslKeyPEM** | `%SslClientKeyPem%` | App setting named `SslClientKeyPem` that references an Azure Key Vault secret containing the client private key in PEM format. |
| **SslCertificateandKeyPEM** | `%SslClientCertificateAndKeyPem%` | App setting named `SslClientCertificateAndKeyPem` that references an Azure Key Vault secret containing the concatenated client certificate and client private key in PEM format. |
| **SslKeyPassword** | `%SslClientKeyPassword%` | App setting named `SslClientKeyPassword` that references an Azure Key Vault secret containing the password for the private key (if any). |

Store certificate and private key values in Azure Key Vault rather than directly in your function app settings. Set the corresponding app setting to a [Key Vault reference](/azure/app-service/app-service-key-vault-references), such as:

```text
@Microsoft.KeyVault(SecretUri=https://<keyVaultName>.vault.azure.net/secrets/<secretName>)
```

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