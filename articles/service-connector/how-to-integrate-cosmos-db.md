---
title: Integrate Azure Cosmos DB for MongoDB with Service Connector
description: Integrate Azure Cosmos DB for MongoDB into your application with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/02/2024
---

# Integrate Azure Cosmos DB for MongoDB with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect the Azure Cosmos DB for MongoDB to other cloud services using Service Connector. You might still be able to connect to Azure Cosmos DB for MongoDB in other programming languages without using Service Connector. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection. 

## Supported compute services

Service Connector can be used to connect the following compute services to Azure Cosmos DB for MongoDB:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The table below shows which combinations of client types and authentication methods are supported for connecting your compute service to Azure Cosmos DB for MongoDB using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret / connection string | Service principal |
|--------------------|----------------------------------|--------------------------------|----------------------------|-------------------|
| .NET               | Yes                              | Yes                            | Yes                        | Yes               |
| Java               | Yes                              | Yes                            | Yes                        | Yes               |
| Java - Spring Boot | No                               | No                             | Yes                        | No                |
| Node.js            | Yes                              | Yes                            | Yes                        | Yes               |
| Python             | Yes                              | Yes                            | Yes                        | Yes               |
| Go                 | Yes                              | Yes                            | Yes                        | Yes               |
| None               | Yes                              | Yes                            | Yes                        | Yes               |

This table indicates that all combinations of client types and authentication methods in the table are supported, except for the Java - Spring Boot client type, which only supports the Secret / connection string method. All other client types can use any of the authentication methods to connect to Azure Cosmos DB for MongoDB using Service Connector.

## Default environment variable names or application properties and sample code

Use the connection details below to connect compute services to Azure Cosmos DB. This page also shows default environment variable names and values (or Spring Boot configuration) you get when you create the service connection, as well as sample code. For each example below, replace the placeholder texts `<mongo-db-admin-user>`, `<password>`, `<Azure-Cosmos-DB-API-for-MongoDB-account>`, `<subscription-ID>`, `<resource-group-name>`, `<client-secret>`, and `<tenant-id>` with your own information. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned managed identity

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-API-for-MongoDB-account>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                                                    |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<Azure-Cosmos-DB-API-for-MongoDB-account>.documents.azure.com:443/`                                                                                                                                                             |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a system-assigned managed identity.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-me-id.md)]

### User-assigned managed identity

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-API-for-MongoDB-account>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                                                    |
| AZURE_COSMOS_CLIENTID                | Your client ID                       | `<client-ID>`                                                                                                                                                                                                                              |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<Azure-Cosmos-DB-API-for-MongoDB-account>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a user-assigned managed identity.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-me-id.md)]

### Connection string

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### SpringBoot client type

| Default environment variable name | Description       | Example value                                                                                                                                                                                |
|-----------------------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| spring.data.mongodb.database      | Your database     | `<database-name>`                                                                                                                                                                            |
| spring.data.mongodb.uri           | Your database URI | `mongodb://<mongo-db-admin-user>:<password>@<mongo-db-server>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<mongo-db-server>@` |

#### Other client types

| Default environment variable name | Description                   | Example value                                                                                                                                                                                |
|-----------------------------------|-------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| AZURE_COSMOS_CONNECTIONSTRING     | MongoDB API connection string | `mongodb://<mongo-db-admin-user>:<password>@<mongo-db-server>.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@<mongo-db-server>@` |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a connection string.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-secret.md)]

### Service principal

| Default environment variable name    | Description                          | Example value                                                                                                                                                                                                                                |
| ------------------------------------ | ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AZURE_COSMOS_LISTCONNECTIONSTRINGURL | The URL to get the connection string | `https://management.azure.com/subscriptions/<subscription-ID>/resourceGroups/<resource-group-name>/providers/Microsoft.DocumentDB/databaseAccounts/<Azure-Cosmos-DB-API-for-MongoDB-account>/listConnectionStrings?api-version=2021-04-15` |
| AZURE_COSMOS_SCOPE                   | Your managed identity scope          | `https://management.azure.com/.default`                                                                                                                                                                                                    |
| AZURE_COSMOS_CLIENTID                | Your client ID                       | `<client-ID>`                                                                                                                                                                                                                              |
| AZURE_COSMOS_CLIENTSECRET            | Your client secret                   | `<client-secret>`                                                                                                                                                                                                                          |
| AZURE_COSMOS_TENANTID                | Your tenant ID                       | `<tenant-ID>`                                                                                                                                                                                                                              |
| AZURE_COSMOS_RESOURCEENDPOINT        | Your resource endpoint               | `https://<Azure-Cosmos-DB-API-for-MongoDB-account>.documents.azure.com:443/`                                                                                                                                                               |

#### Sample code

Refer to the steps and code below to connect to Azure Cosmos DB for MongoDB using a service principal.
[!INCLUDE [code sample for mongo](./includes/code-cosmosmongo-me-id.md)]

## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
