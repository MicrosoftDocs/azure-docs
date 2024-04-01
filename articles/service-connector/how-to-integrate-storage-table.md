---
title: Integrate Azure Table Storage with Service Connector
description: Integrate Azure Table Storage into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Table Storage with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure Table Storage to other cloud services using Service Connector. You might still be able to connect to Azure Table Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Table Storage:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Table Storage using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|-------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET        | Yes                              | Yes                            | Yes                        | Yes               |
| Java        | Yes                              | Yes                            | Yes                        | Yes               |
| Node.js     | Yes                              | Yes                            | Yes                        | Yes               |
| Python      | Yes                              | Yes                            | Yes                        | Yes               |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Table Storage using Service Connector.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure Table Storage. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name   | Description            | Example value                                            |
|-------------------------------------|------------------------|----------------------------------------------------------|
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table Storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |

#### Sample code

Refer to the steps and code below to connect to Azure Table Storage using a system-assigned managed identity.
[!INCLUDE [code sample for table](./includes/code-table-me-id.md)]

### User-assigned managed identity

| Default environment variable name   | Description            | Example value                                            |
|-------------------------------------|------------------------|----------------------------------------------------------|
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table Storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |
| AZURE_STORAGETABLE_CLIENTID         | Your client ID         | `<client-ID>`                                            |

#### Sample code

Refer to the steps and code below to connect to Azure Table Storage using a user-assigned managed identity.
[!INCLUDE [code sample for table](./includes/code-table-me-id.md)]

### Connection string

| Default environment variable name   | Description                     | Example value                                                                                                        |
|-------------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGETABLE_CONNECTIONSTRING | Table Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### Sample code

Refer to the steps and code below to connect to Azure Table Storage using a connection string.
[!INCLUDE [code sample for table](./includes/code-table-secret.md)]

### Service principal

| Default environment variable name   | Description            | Example value                                            |
|-------------------------------------|------------------------|----------------------------------------------------------|
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table Storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |
| AZURE_STORAGETABLE_CLIENTID         | Your client ID         | `<client-ID>`                                            |
| AZURE_STORAGETABLE_CLIENTSECRET     | Your client secret     | `<client-secret>`                                        |
| AZURE_STORAGETABLE_TENANTID         | Your tenant ID         | `<tenant-ID>`                                            |

#### Sample code

Refer to the steps and code below to connect to Azure Table Storage using a service principal.
[!INCLUDE [code sample for table](./includes/code-table-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
