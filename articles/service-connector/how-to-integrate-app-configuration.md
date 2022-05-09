---
title: Integrate Azure App Configuration with Service Connector
description: Integrate Azure App Configuration into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 03/02/2022
---

# Integrate Azure App Configuration with Service Connector

This page shows the supported authentication types and client types of Azure App Configuration using Service Connector. You might still be able to connect to App Configuration in other programming languages without using Service Connector. You can learn more about the [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Spring Cloud

## Supported authentication types and client types

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

## Default environment variable names or application properties

### .NET, Java, Node.JS, Python

#### Secret / connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_APPCONFIGURATION_CONNECTIONSTRING | Your App Configuration Connection String | `Endpoint=https://{AppConfigurationName}.azconfig.io;Id={ID};Secret={secret}` |

#### System-assigned managed identity

| Default environment variable name | Description                  | Sample value                                 |
|-----------------------------------|------------------------------|----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration   endpoint | `https://{AppConfigurationName}.azconfig.io` |

#### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                  |
|-----------------------------------|----------------------------|-----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration Endpoint | `https://{AppConfigurationName}.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID   | Your client ID             | `UserAssignedMiClientId`                     |

#### Service principal

| Default environment variable name   | Description                | Sample value                                 |
|-------------------------------------|----------------------------|----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT     | App Configuration Endpoint | `https://{AppConfigurationName}.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID     | Your client ID             | `{yourClientID}`                             |
| AZURE_APPCONFIGURATION_CLIENTSECRET | Your client secret         | `{yourClientSecret}`                         |
| AZURE_APPCONFIGURATION_TENANTID     | Your tenant ID             | `{yourTenantID}`                             |

## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
