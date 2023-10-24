---
title: Integrate Azure App Configuration with Service Connector
description: Integrate Azure App Configuration into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/11/2022
---

# Integrate Azure App Configuration with Service Connector

This page shows the supported authentication types and client types of Azure App Configuration using Service Connector. You might still be able to connect to App Configuration in other programming languages without using Service Connector and the sample code of how to use them. You can learn more about the [Service Connector environment variable naming convention](concept-service-connector-internals.md).

## Supported compute services

- Azure App Service
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

Supported authentication and clients for App Service, Container Apps and Azure Spring Apps:

| Client type |   System-assigned managed identity   |    User-assigned managed identity    |       Secret/connection string       |           Service principal          |
|-------------|:------------------------------------:|:------------------------------------:|:------------------------------------:|:------------------------------------:|
| .NET        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Java        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Node.js     | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| Python      | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |
| None        | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) | ![yes icon](./media/green-check.png) |

---

## Default environment variable names or application properties and Sample code

Use the connection details below to connect compute services to Azure App Configuration stores instances. This page also shows default environment variable names and values you get when you create the service connection and the sample code of how to use them. You can learn more about [Service Connector environment variable naming convention](concept-service-connector-internals.md).

### System-assigned managed identity

| Default environment variable name | Description                  | Sample value                                   |
|-----------------------------------|------------------------------|------------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration   endpoint | `https://<App-Configuration-name>.azconfig.io` |

Refer to the steps and code below to connect to Azure App Configuration using a system-assigned managed identity.
[!INCLUDE [code sample for app config](./includes/code-appconfig-me-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                  |
|-----------------------------------|----------------------------|-----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration Endpoint | `https://App-Configuration-name>.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID   | Your client ID             | `<client-ID>`                                 |

Refer to the steps and code below to connect to Azure App Configuration using a user-assigned managed identity.
[!INCLUDE [code sample for app config](./includes/code-appconfig-me-id.md)]

### Connection string

> [!div class="mx-tdBreakAll"]
> | Default environment variable name | Description | Sample value |
> | --------------------------------- | ------------| ------------ |
> | AZURE_APPCONFIGURATION_CONNECTIONSTRING | Your App Configuration Connection String | `Endpoint=https://<App-Configuration-name>.azconfig.io;Id=<ID>;Secret=<secret>` |

#### Sample Code 
Refer to the steps and code below to connect to Azure App Configuration using a connection string.
[!INCLUDE [code sample for app config](./includes/code-appconfig-secret.md)]


### Service principal

| Default environment variable name   | Description                | Sample value                                 |
|-------------------------------------|----------------------------|----------------------------------------------|
| AZURE_APPCONFIGURATION_ENDPOINT     | App Configuration Endpoint | `https://<AppConfigurationName>.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID     | Your client ID             | `<client-ID>`                                |
| AZURE_APPCONFIGURATION_CLIENTSECRET | Your client secret         | `<client-secret>`                            |
| AZURE_APPCONFIGURATION_TENANTID     | Your tenant ID             | `<tenant-ID>`                                |

Refer to the steps and code below to connect to Azure App Configuration using a service principaL.
[!INCLUDE [code sample for app config](./includes/code-appconfig-me-id.md)]

## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
