---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/14/2022
ms.author: glenga
---

## Connections

All connection information required by your triggers and bindings should be maintained in application settings and not in the binding definitions in your code. This is particularly true for credentials, which should never be stored in your code.

> [!IMPORTANT]
> Credential settings must reference an [application setting](functions-how-to-use-azure-function-app-settings.md#settings). Don't hard-code credentials in your code or configuration files. When running locally, use the [local.settings.json file](functions-develop-local.md#local-settings-file) for your credentials, and don't publish the local.settings.json file. 

When connecting to a managed Kafka cluster, such as the one provided by [Confluent in Azure](https://www.confluent.io/azure/), make sure that the following authentication credentials for your Confluent Cloud environment are set in your trigger or binding:

| Setting | Recommended value | Description |
| --- | --- | --- |
| **BrokerList** | `BootstrapServer` | Contains the value of bootstrap server found in Confluent Cloud settings page. The value will resemble `xyz-xyzxzy.westeurope.azure.confluent.cloud:9092`. | 
| **Username** | `ConfluentCloudUsername` | The API access key obtained from the Confluent Cloud web site. |
| **Password** | `ConfluentCloudPassword` | The API secret obtained from the Confluent Cloud web site. |

The string values you use for these settings must be present as [application settings in Azure](functions-how-to-use-azure-function-app-settings.md#settings) or in the `Values` collection in the [local.settings.json file](functions-develop-local.md#local-settings-file) during local development.

You should also set the `Protocol`, `AuthenticationMode`, and `SslCaLocation` in your binding definitions.