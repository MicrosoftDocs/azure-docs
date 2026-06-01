---
title: Use Service Connector to integrate Apache Kafka on Confluent Cloud
description: Learn how to connect Apache Kafka on Confluent Cloud apps to supported Azure compute services by using Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 04/01/2026
#customer intent: As an Apache Kafka on Confluent Cloud app developer, I want to learn how to use Service Connector so I can easily integrate my apps with supported Azure compute services.
---

# Integrate Apache Kafka on Confluent Cloud with Service Connector

This article shows supported clients and authentication methods to connect Apache Kafka on Confluent Cloud to other cloud services by using Service Connector. This article also shows the default environment variables you need to create the service connections. 

>[!NOTE]
>You might be able to connect to Apache Kafka on Confluent Cloud in other programming languages without using Service Connector.

## Supported compute services

You can use Service Connector to connect the following Azure compute services to Apache Kafka on Confluent Cloud:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported clients and authentication type

Apache Kafka on Confluent Cloud supports the following client types.

- .NET
- Java
- Java Spring Boot
- Node.js
- Python

To build Kafka client applications on Confluent Cloud, see [Kafka Client Examples for Confluent Cloud](https://docs.confluent.io/cloud/current/client-apps/examples.html#).

### Authentication types

Apache Kafka on Confluent Cloud supports only secret or connection string authentication. System-assigned managed identity, user-assigned managed identity, and service principal connections aren't available.

> [!IMPORTANT]
> The secret or connection string authentication flow requires a high degree of trust in the application, and carries risks not present in other flows. You should use this flow only when more secure flows, such as managed identities, aren't available.

## Default environment variables

Use the following connection details to connect supported Azure compute services to Kafka. In the examples, replace the following placeholders with your own values:

- `<server-name>`
- `<Bootstrap-server-key>`
- `<Bootstrap-server-secret>`
- `<schema-registry-key>`
- `<schema-registry-secret>`

For more information about naming conventions, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### All clients except Spring Boot

The following table lists the default environmental variables you use to connect all Kafka client types except for Java Spring Boot to supported Azure compute services.

|Default environment variable name|Description|Example value|
|---------------|----------------|--------|
|AZURE_CONFLUENTCLOUDKAFKA_BOOTSTRAPSERVER|Kafka bootstrap server|`pkc-<server-name>.eastus.azure.confluent.cloud:9092`|
|AZURE_CONFLUENTCLOUDKAFKA_KAFKASASLCONFIG|Kafka Simple Authentication and Security Layer (SASL) configuration|`org.apache.kafka.common.security.plain.PlainLoginModule required username='<Bootstrap-server-key>' password='<Bootstrap-server-secret>';`|
|AZURE_CONFLUENTCLOUDSCHEMAREGISTRY_URL|Confluent registry URL|`https://psrc-<server-name>.westus2.azure.confluent.cloud`|
|AZURE_CONFLUENTCLOUDSCHEMAREGISTRY_USERINFO|Confluent registry user information|`<schema-registry-key>:<schema-registry-secret>`|

### Spring Boot clients

The following table lists the default environmental variables you use to connect Java Spring Boot clients to supported Azure compute services.

|Default environment variable name|Description|Example value|
|-------------|-------------------|------|
|spring.kafka.properties.bootstrap.servers| Kafka bootstrap server|`pkc-<server-name>.eastus.azure.confluent.cloud:9092`|
|spring.kafka.properties.sasl.jaas.config| Kafka SASL configuration|`org.apache.kafka.common.security.plain.PlainLoginModule required username='<Bootstrap-server-key>' password='<Bootstrap-server-secret>';`|
|spring.kafka.properties.schema.registry.url| Confluent registry URL|`https://psrc-<server-name>.westus2.azure.confluent.cloud`|
|spring.kafka.properties.schema.registry.basic.auth.user.info|Confluent registry user information | `<schema-registry-key>:<schema-registry-secret>`|

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Kafka Client Examples for Confluent Cloud](https://docs.confluent.io/cloud/current/client-apps/examples.html#)
