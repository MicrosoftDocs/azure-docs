---
title: Integrate MongoDB Atlas cluster with Service Connector
description: Integrate MongoDB Atlas cluster into your application with Service Connector.
author: qianwens
ms.author: qianwens
ms.service: service-connector
ms.topic: how-to
ms.custom:
  - engagement-fy23
  - build-2025
ms.date: 05/08/2025
---

# Integrate MongoDB Atlas cluster with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect MongoDB Atlas cluster from Azure compute services using Service Connector. You might still be able to connect to MongoDB Atlas cluster in other programming languages without using Service Connector. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to MongoDB Atlas cluster:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)

## Supported authentication types and client types

The table below shows which combinations of authentication methods and clients are supported for connecting your compute service to MongoDB Atlas cluster using Service Connector. A “Yes” indicates that the combination is supported, while a “No” indicates that it is not supported.

| Client type               | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|---------------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET                      |                No                |                No              |            Yes           |        No         |
| Go (pg)                   |                No                |                No              |            Yes           |        No         |
| Java (JDBC)               |                No                |                No              |            Yes           |        No         |
| Java - Spring Boot (JDBC) |                No                |                No              |            Yes           |        No         |
| Node.js (pg)              |                No                |                No              |            Yes           |        No         |
| PHP (native)              |                No                |                No              |            Yes           |        No         |
| Python (psycopg2)         |                No                |                No              |            Yes           |        No         |
| Python-Django             |                No                |                No              |            Yes           |        No         |
| Ruby (ruby-pg)            |                No                |                No              |            Yes           |        No         |
| None                      |                No                |                No              |            Yes           |        No         |


## Default environment variable names or application properties and sample code

Reference the connection details and sample code in the following tables, according to your connection's authentication type and client type, to connect compute services to MongoDB Atlas cluster. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### Connection String

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

#### [.NET](#tab/dotnet)

| Default environment variable name     | Description                       | Example value                                                                                                                           |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | .NET MongoDB Atlas connection string | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0` |

#### [Java](#tab/java)

| Default environment variable name     | Description                       | Example value                                                                                                                                       |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | JDBC MongoDB Atlas connection string | `jdbc:mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0` |

#### [Python](#tab/python)

| Default environment variable name     | Description                | Example value                                                                                                                                      |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | Python MongoDB Atlas connection string | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0` |

#### [Django](#tab/django)

| Default environment variable name     | Description                | Example value                                                                                                                                      |
| ------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | Django MongoDB Atlas connection string | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0` |

#### [Go](#tab/go)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | Go MongoDB Atlas connection string   | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0`  |

#### [NodeJS](#tab/nodejs)

| Default environment variable name   | Description                     | Example value                                                                                                                   |
|-------------------------------------|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | NodeJS MongoDB Atlas connection string   | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0`  |

#### [PHP](#tab/php)

| Default environment variable name | Description                          | Example value                                                                                                                   |
|-----------------------------------|--------------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | PHP native MongoDB Atlas connection string | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0`  |

#### [Ruby](#tab/ruby)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | Ruby MongoDB Atlas connection string | `mongodb+srv:/<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0` |

#### [Other](#tab/none)

| Default environment variable name | Description                     | Example value                                                                    |
|-----------------------------------|---------------------------------|----------------------------------------------------------------------------------|
| `MONGODBATLAS_CLUSTER_CONNECTIONSTRING` | MongoDB Atlas connection string | `mongodb+srv://<database-username>:<database-password>@<cluster-URL>/?retryWrites=true&w=majority&appName=Cluster0` |

---

#### Sample code

Refer to the steps and code below to connect to MongoDB Atlas cluster using a connection string.
[!INCLUDE [code sample for mongodb secrets](./includes/code-mongodb-atlas-secret.md)]


## Next steps

Follow the tutorials listed below to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Connect apps to MongoDB Atlas (Preview)](./howto-mongodb-atlas-service-connection.md)
