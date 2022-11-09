---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/14/2022
ms.author: glenga
---

## Connections

All connection information required by your triggers and bindings should be maintained in application settings and not in the binding definitions in your code. This is true for credentials, which should never be stored in your code.

> [!IMPORTANT]
> Credential settings must reference an [application setting](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings). Don't hard-code credentials in your code or configuration files. When running locally, use the [local.settings.json file](../articles/azure-functions/functions-develop-local.md#local-settings-file) for your credentials, and don't publish the local.settings.json file. 

# [Confluent](#tab/confluent)

When connecting to a managed Kafka cluster provided by [Confluent in Azure](https://www.confluent.io/azure/), make sure that the following authentication credentials for your Confluent Cloud environment are set in your trigger or binding:

| Setting | Recommended value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | App setting named `BootstrapServer` contains the value of bootstrap server found in Confluent Cloud settings page. The value resembles `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`. | 
| **Username** | `ConfluentCloudUsername` | App setting named `ConfluentCloudUsername` contains the API access key from the Confluent Cloud web site. |
| **Password** | `ConfluentCloudPassword` | App setting named `ConfluentCloudPassword` contains the API secret obtained from the Confluent Cloud web site. |

# [Event Hubs](#tab/event-hubs)

When connecting to Event Hubs, make sure that the following authentication credentials for your Event Hubs instance are set in your trigger or binding:

| Setting | Recommended value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | App setting named `BootstrapServer` contains the fully qualified domain name of your Event Hubs instance. The value resembles `<MY_NAMESPACE_NAME>.servicebus.windows.net:9093`. | 
| **Username** | `$ConnectionString` | Actual value is obtained from the connection string. |
| **Password** | `%EventHubsConnectionString%` | App setting named `EventHubsConnectionString` contains the connection string for your Event Hubs namespace. To learn more, see [Get an Event Hubs connection string](../articles/event-hubs/event-hubs-get-connection-string.md).|

---

The string values you use for these settings must be present as [application settings in Azure](../articles/azure-functions/functions-how-to-use-azure-function-app-settings.md#settings) or in the `Values` collection in the [local.settings.json file](../articles/azure-functions/functions-develop-local.md#local-settings-file) during local development.

You should also set the `Protocol`, `AuthenticationMode`, and `SslCaLocation` in your binding definitions.