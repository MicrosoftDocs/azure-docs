---
title: Integrate Azure Files with Service Connector
description: Integrate Azure Files into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Files with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect Azure File Storage to other cloud services using Service Connector. You might still be able to connect to Azure File Storage in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Files:

- Azure App Service
- Azure Functions
- Azure Container Apps
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to Azure Files using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client Type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | No                               | No                             | Yes                        | No                |
| Java               | No                               | No                             | Yes                        | No                |
| Java - Spring Boot | No                               | No                             | Yes                        | No                |
| Node.js            | No                               | No                             | Yes                        | No                |
| Python             | No                               | No                             | Yes                        | No                |
| PHP                | No                               | No                             | Yes                        | No                |
| Ruby               | No                               | No                             | Yes                        | No                |
| None               | No                               | No                             | Yes                        | No                |

This table indicates that the only supported authentication method for all client types is the Secret / connection string method. The System-assigned managed identity, User-assigned managed identity, and Service principal methods are not supported for any of the client types to connect to Azure Files.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure File Storage. For each example below, replace the placeholder texts `<account-name>`, `<account-key>`, `<storage-account-name>` and `<storage-account-key>` with your own account name, account key, storage account name, and storage account key. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### Connection string

#### SpringBoot client type

| Application properties      | Description               | Example value                                             |
| --------------------------- | ------------------------- | --------------------------------------------------------- |
| azure.storage.account-name  | File storage account name | `<storage-account-name>`                                |
| azure.storage.account-key   | File storage account key  | `<storage-account-key>`                                 |
| azure.storage.file-endpoint | File storage endpoint     | `https://<storage-account-name>.file.core.windows.net/` |
| spring.cloud.azure.storage.fileshare.account-name | File storage account name for Spring Cloud Azure version above 4.0 | `<storage-account-name>`   |
| spring.cloud.azure.storage.fileshare.account-key  | File storage account key for Spring Cloud Azure version above 4.0  | `<storage-account-key>`    |
| spring.cloud.azure.storage.fileshare.endpoint     | File storage endpoint for Spring Cloud Azure version above 4.0     | `https://<storage-account-name>.file.core.windows.net/` |

#### Other client types

| Default environment variable name  | Description                    | Example value                                                                                                        |
|------------------------------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------|
| AZURE_STORAGEFILE_CONNECTIONSTRING | File storage connection string | `DefaultEndpointsProtocol=https;AccountName=<account-name>;AccountKey=<account-key>;EndpointSuffix=core.windows.net` |

#### Sample code 
Refer to the steps and code below to connect to Azure File Storage using an account key.
[!INCLUDE [code sample for azure files](./includes/code-file-secret.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
