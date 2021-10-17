---
title: Integrate Azure App Configuration with Service Connector
description: Integrate Azure App Configuration into your application with Service Connector
author: shizn
ms.author: xshi
ms.service: serviceconnector
ms.topic: how-to 
ms.date: 10/29/2021
---

# Integrate Azure App Configuration with Service Connector

## Supported compute service

- Azure App Service
- Azure Spring Cloud

## Supported Authentication types and client types

| Client Type | System-assigned Managed Identity | User-assigned Managed Identity | Secret/ConnectionString | Service Principal |
| --- | --- | --- | --- | --- |
| .Net | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

### .NET, Java, Node.JS and Python (App Configuration client library)

**Secret/ConnectionString**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_CONNECTIONSTRING | | `Endpoint=https://{your-app-config-name}.azconfig.io;Id={ID};Secret={secret}` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_ENDPOINT | | `https://{your-app-config-name}.azconfig.io` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_ENDPOINT | | `https://{your-app-config-name}.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID | | `{UserAssignedMiClientId}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_ENDPOINT | | `https://{your-app-config-name}.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID | | `{clientId}` |
| AZURE_APPCONFIGURATION_CLIENTSECRET | | `{clientSecret}` |
| AZURE_APPCONFIGURATION_TENANTID | | `{tenantID}` |
