---
title: Integrate Azure Table Storage with Service Connector
description: Integrate Azure Table Storage into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to
ms.date: 10/29/2021
ms.custom: ignite-fall-2021
---

# Integrate Azure Table Storage with Service Connector

This page shows the supported authentication types and client types of Azure Table Storage using Service Connector. You might still be able to connect to Azure Table Storage in other programming languages without using Service Connector. This page also shows default environment variable name and value (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | | | ![yes icon](./media/green-check.png) | |
| Java | | | ![yes icon](./media/green-check.png) | |
| Node.js | | | ![yes icon](./media/green-check.png) | |
| Python | | | ![yes icon](./media/green-check.png) | |


## Default environment variable names or application properties

### .NET, Java, Node.JS and Python

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGETABLE_CONNECTIONSTRING | Table storage connection string | `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={****};EndpointSuffix=core.windows.net` |


## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
