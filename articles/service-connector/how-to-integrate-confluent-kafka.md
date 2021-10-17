---
title: Integrate Apache kafka on Confluent Cloud with Service Connector
description: Integrate Apache kafka on Confluent Cloud into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Apache kafka on Confluent Cloud with Service Connector

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | | | ![yes icon](./media/green-check.png) | |
| Java | | | ![yes icon](./media/green-check.png) | |
| Java - Spring Boot | | | ![yes icon](./media/green-check.png) | |
| Node.js (mysql) | | | ![yes icon](./media/green-check.png) | |
| Python | | | ![yes icon](./media/green-check.png) | |

## Default environment variable names or application properties

### .NET, Java, Node.JS and Python

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_CONFLUENTCLOUDKAFKA_BOOTSTRAPSERVER | | `pkc-{serverName}.eastus.azure.confluent.cloud:9092` |
| AZURE_CONFLUENTCLOUDKAFKA_KAFKASASLCONFIG | | `org.apache.kafka.common.security.plain.PlainLoginModule required username='{bootstrapServerKey}' password='{bootstrapServerSecret}';` |
| AZURE_CONFLUENTCLOUDSCHEMAREGISTRY_URL | | `https://psrc-{serverName}.westus2.azure.confluent.cloud` |
| AZURE_CONFLUENTCLOUDSCHEMAREGISTRY_USERINFO | | `{schemaRegistryKey} + ":" + {schemaRegistrySecret}` |

### Spring Boot

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| spring.kafka.properties.bootstrap.servers | | `pkc-{serverName}.eastus.azure.confluent.cloud:9092` |
| spring.kafka.properties.sasl.jaas.config | | `org.apache.kafka.common.security.plain.PlainLoginModule required username='{bootstrapServerKey}' password='{bootstrapServerSecret}';` |
| spring.kafka.properties.schema.registry.url | | `https://psrc-{serverName}.westus2.azure.confluent.cloud` |
| spring.kafka.properties.schema.registry.basic.auth.user.info | | `{schemaRegistryKey} + ":" + {schemaRegistrySecret}` |