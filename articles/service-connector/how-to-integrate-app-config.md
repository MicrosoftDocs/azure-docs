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

This page shows the supported authentication types and client types of Azure App Configuration service using Service Connector. You might still be able to connect to Azure App Configuration service in other programming languages without using Service Connector. This page also shows default environment variable name and value (or Spring Boot configuration) you get when you create the service connection. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

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
| AZURE_APPCONFIGURATION_CONNECTIONSTRING | Your App Configuration service connection string | `Endpoint=https://{your-app-config-name}.azconfig.io;Id={ID};Secret={secret}` |

**System-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_ENDPOINT | Your App Configuration service endpoint | `https://{your-app-config-name}.azconfig.io` |

**User-assigned Managed Identity**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_ENDPOINT | Your App Configuration service endpoint | `https://{your-app-config-name}.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID | Your client ID | `{UserAssignedMiClientId}` |

**Service Principal**

| Default environment variable name | Description | Example value |
| --- | --- | --- |
| AZURE_APPCONFIGURATION_ENDPOINT | Your App Configuration service endpoint | `https://{your-app-config-name}.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID | Your client ID | `{clientId}` |
| AZURE_APPCONFIGURATION_CLIENTSECRET | Your client secret | `{clientSecret}` |
| AZURE_APPCONFIGURATION_TENANTID | Your tenant ID | `{tenantID}` |

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
