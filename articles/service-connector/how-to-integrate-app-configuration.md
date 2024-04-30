---
title: Integrate Azure App Configuration with Service Connector
description: In this document, learn how to integrate Azure App Configuration into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure App Configuration with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure App Configuration to other cloud services using Service Connector. You might still be able to connect to App Configuration using other methods. This page also shows default environment variable names and values you get when you create the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure App Configuration:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure App Configuration using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.


| Client type | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|-------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET        |                Yes               |               Yes              |            Yes           |        Yes        |
| Java        |                Yes               |               Yes              |            Yes           |        Yes        |
| Node.js     |                Yes               |               Yes              |            Yes           |        Yes        |
| Python      |                Yes               |               Yes              |            Yes           |        Yes        |
| None        |                Yes               |               Yes              |            Yes           |        Yes        |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure App Configuration using Service Connector.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure App Configuration stores. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name | Description                  | Sample value                                     |
| --------------------------------- | ---------------------------- | ------------------------------------------------ |
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration   endpoint | `https://<App-Configuration-name>.azconfig.io` |

#### Sample code
Refer to the steps and code below to connect to Azure App Configuration using a system-assigned managed identity.
[!INCLUDE [code sample for app config](./includes/code-appconfig-me-id.md)]

### User-assigned managed identity

| Default environment variable name | Description                | Sample value                                    |
| --------------------------------- | -------------------------- | ----------------------------------------------- |
| AZURE_APPCONFIGURATION_ENDPOINT   | App Configuration Endpoint | `https://App-Configuration-name>.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID   | Your client ID             | `<client-ID>`                                 |

#### Sample code
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

| Default environment variable name   | Description                | Sample value                                   |
| ----------------------------------- | -------------------------- | ---------------------------------------------- |
| AZURE_APPCONFIGURATION_ENDPOINT     | App Configuration Endpoint | `https://<AppConfigurationName>.azconfig.io` |
| AZURE_APPCONFIGURATION_CLIENTID     | Your client ID             | `<client-ID>`                                |
| AZURE_APPCONFIGURATION_CLIENTSECRET | Your client secret         | `<client-secret>`                            |
| AZURE_APPCONFIGURATION_TENANTID     | Your tenant ID             | `<tenant-ID>`                                |

#### Sample code
Refer to the steps and code below to connect to Azure App Configuration using a service principaL.
[!INCLUDE [code sample for app config](./includes/code-appconfig-me-id.md)]

## Next steps

Follow the tutorial listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
