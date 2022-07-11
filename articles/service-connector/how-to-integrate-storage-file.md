---
title: Integrate Azure File Storage with Service Connector
description: Integrate Azure File Storage into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: how-to
ms.date: 05/03/2022
---

# Integrate Azure File Storage with Service Connector

This page shows the supported authentication types and client types of Azure File Storage using Service Connector. You might still be able to connect to Azure File Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

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
| PHP | | | ![yes icon](./media/green-check.png) | |
| Ruby | | | ![yes icon](./media/green-check.png) | |



## Default environment variable names or application properties

### .NET, Java, Node.JS, Python, PHP and Ruby

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_STORAGEFILE_CONNECTIONSTRING | File storage connection string | `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={****};EndpointSuffix=core.windows.net` |


### Java - Spring Boot

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| azure.storage.account-name | File storage account name | `{storageAccountName}` |
| azure.storage.account-key | File storage account key | `{yourSecret}` |
| azure.storage.file-endpoint | File storage endpoint | `https://{storageAccountName}.file.core.windows.net/` |


## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
