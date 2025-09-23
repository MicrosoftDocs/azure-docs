---
title: Integrate Azure Table Storage with Service Connector
description: Use these code samples to integrate Azure Table Storage into your application with Service Connector.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 08/18/2025
#customer intent: As a cloud developer, I want to connect my compute services to Azure Table Storage using Service Connector.
---

# Integrate Azure Table Storage with Service Connector

This page shows supported authentication methods and clients. It provides sample code you can use to connect compute services to Azure Table Storage using Service Connector. You might be able to connect to Azure Table Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Table Storage:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

This table shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Table Storage using Service Connector. A "Yes" indicates that the combination is supported, while a "No" indicates that it isn't supported.

| Client type | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|-------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET        | Yes                              | Yes                            | Yes                        | Yes               |
| Java        | Yes                              | Yes                            | Yes                        | Yes               |
| Node.js     | Yes                              | Yes                            | Yes                        | Yes               |
| Python      | Yes                              | Yes                            | Yes                        | Yes               |

This table indicates that all combinations of client types and authentication methods in the table are supported. All client types can use any of the authentication methods to connect to Azure Table Storage using Service Connector.

## Default environment variable names or application properties and sample code

To connect compute services to Azure Table Storage, use the following connection details. For more information, see [Configuration naming convention](concept-service-connector-internals.md#configuration-naming-convention).

### System-assigned managed identity

| Default environment variable name   | Description            | Example value                                            |
|-------------------------------------|------------------------|----------------------------------------------------------|
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table Storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |

#### Sample code

To connect to Azure Table Storage using a system-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for table](./includes/code-table-me-id.md)]

### User-assigned managed identity

| Default environment variable name   | Description            | Example value                                            |
|-------------------------------------|------------------------|----------------------------------------------------------|
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table Storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |
| AZURE_STORAGETABLE_CLIENTID         | Your client ID         | `<client-ID>`                                            |

#### Sample code

To connect to Azure Table Storage using a user-assigned managed identity, refer to the following steps and code.
[!INCLUDE [code sample for table](./includes/code-table-me-id.md)]

### Connection string

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application. It carries risks that aren't present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

| Default environment variable name   | Description                     | Example value                                                                                                        |
|-------------------------------------|---------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGETABLE_CONNECTIONSTRING | Table Storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### Sample code

To connect to Azure Table Storage using a connection string, refer to the following steps and code.
[!INCLUDE [code sample for table](./includes/code-table-secret.md)]

### Service principal

| Default environment variable name   | Description            | Example value                                            |
|-------------------------------------|------------------------|----------------------------------------------------------|
| AZURE_STORAGETABLE_RESOURCEENDPOINT | Table Storage endpoint | `https://<storage-account-name>.table.core.windows.net/` |
| AZURE_STORAGETABLE_CLIENTID         | Your client ID         | `<client-ID>`                                            |
| AZURE_STORAGETABLE_CLIENTSECRET     | Your client secret     | `<client-secret>`                                        |
| AZURE_STORAGETABLE_TENANTID         | Your tenant ID         | `<tenant-ID>`                                            |

#### Sample code

To connect to Azure Table Storage using a service principal, refer to the following steps and code.
[!INCLUDE [code sample for table](./includes/code-table-me-id.md)]

## Next step

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
