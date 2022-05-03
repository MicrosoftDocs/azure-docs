---
title: Integrate Apache kafka on Confluent Cloud with Service Connector
description: Integrate Apache kafka on Confluent Cloud into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to
ms.date: 05/03/2022
---

# Integrate Apache kafka on Confluent Cloud with Service Connector

This page shows the supported authentication types and client types of Apache kafka on Confluent Cloud with Service using Service Connector. You might still be able to connect to Apache kafka on Confluent Cloud in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .NET | | | ![yes icon](./media/green-check.png) | |
| Java | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot | | | ![yes icon](./media/green-check.png) | |
| Node.js | | | ![yes icon](./media/green-check.png) | |
| Python | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET, Java, Node.JS and Python

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_CONFLUENTCLOUDKAFKA_BOOTSTRAPSERVER | Your Kafka bootstrap server | `pkc-{serverName}.eastus.azure.confluent.cloud:9092` |
| AZURE_CONFLUENTCLOUDKAFKA_KAFKASASLCONFIG | Your Kafka SASL configuration | `org.apache.kafka.common.security.plain.PlainLoginModule required username='{bootstrapServerKey}' password='{bootstrapServerSecret}';` |
| AZURE_CONFLUENTCLOUDSCHEMAREGISTRY_URL | Your Confluent registry URL | `https://psrc-{serverName}.westus2.azure.confluent.cloud` |
| AZURE_CONFLUENTCLOUDSCHEMAREGISTRY_USERINFO |  Your Confluent registry user information | `{schemaRegistryKey} + ":" + {schemaRegistrySecret}` |

### Spring Boot

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| spring.kafka.properties.bootstrap.servers | Your Kafka bootstrap server | `pkc-{serverName}.eastus.azure.confluent.cloud:9092` |
| spring.kafka.properties.sasl.jaas.config | Your Kafka SASL configuration | `org.apache.kafka.common.security.plain.PlainLoginModule required username='{bootstrapServerKey}' password='{bootstrapServerSecret}';` |
| spring.kafka.properties.schema.registry.url | Your Confluent registry URL | `https://psrc-{serverName}.westus2.azure.confluent.cloud` |
| spring.kafka.properties.schema.registry.basic.auth.user.info | Your Confluent registry user information | `{schemaRegistryKey} + ":" + {schemaRegistrySecret}` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
