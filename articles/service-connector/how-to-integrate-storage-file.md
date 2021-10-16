---
title: Integrate Azure File Storage with Service Connector
description: Integrate Azure File Storage into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: service-connector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure File Storage with Service Connector

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | | | ![yes icon](./media/green-check.png) | |
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
| AZURE_STORAGEFILE_CONNECTIONSTRING | | `DefaultEndpointsProtocol=https;AccountName={accountName};AccountKey={****};EndpointSuffix=core.windows.net` |


### Java - Spring Boot

**Secret/ConnectionString**

| Application properties | Description | Example value |
| --- | --- | --- |
| azure.storage.account-name | | `{storageAccountName}` |
| azure.storage.account-key | | `{yourSecret}` |
| azure.storage.file-endpoint | | `https://{storageAccountName}.file.core.windows.net/` |
