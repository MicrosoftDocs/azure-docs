---
title: Integrate SQL database in Microsoft Fabric with Service Connector
description: Integrate SQL database in Microsoft Fabric with Service Connector
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: how-to
ms.date: 02/27/2025
---

# Integrate SQL database in Microsoft Fabric with Service Connector

This page shows supported authentication methods and clients, and shows sample code you can use to connect your apps to SQL database in Microsoft Fabric using Service Connector. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to SQL database in Fabric:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)

## Supported authentication types and client types

The following table shows which combinations of authentication methods and clients are supported for connecting your compute service to SQL database in Fabric using Service Connector. A "Yes" indicates that the combination is supported, while a "No" indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|--------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET               |                Yes               |               Yes              |            No            |         No        |
| Go                 |                Yes               |               Yes              |            No            |         No        |
| Java               |                Yes               |               Yes              |            No            |         No        |
| Java - Spring Boot |                Yes               |               Yes              |            No            |         No        |
| Python             |                Yes               |               Yes              |            No            |         No        |
| None               |                Yes               |               Yes              |            No            |         No        |

This table indicates that as per Fabric behavior, only authentication via managed identities is allowed.

The system-assigned managed identity and user-assigned managed identity methods are supported for .NET, Java, Java - Spring Boot, Python, Go, and None client types. These methods are not supported for any other types.

> [!IMPORTANT]
> Manual access sharing is currently required for complete onboarding. See [Share access to SQL database in Fabric](#share-access-to-sql-database-in-fabric).

## Default environment variable names or application properties and sample code

Refer to the connection details and sample code presented in the following tabs to connect compute services to SQL database in Fabric. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

> [!NOTE]
> Although SQL database in Fabric is distinct from Azure SQL Database, you can connect to and query your SQL database in Fabric in all the same ways as Azure SQL Database. [Learn more](/fabric/database/sql/connect).

### System-assigned managed identity

#### [.NET](#tab/fabric-sql-me-id-dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                        |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `FABRIC_SQL_CONNECTIONSTRING `    | Azure SQL Database connection string   | `Data Source=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;Initial Catalog=<SQL-DB-name>-<Fabric-DB-Identifier>;Authentication=ActiveDirectoryManagedIdentity` |

#### [Java](#tab/fabric-sql-me-id-java)

| Default environment variable name | Description                          | Sample value                                                                                                             |
|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `FABRIC_SQL_CONNECTIONSTRING`     | Azure SQL Database connection string   | `jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;authentication=ActiveDirectoryMSI;` |

#### [SpringBoot](#tab/fabric-sql-me-id-springboot)

| Default environment variable name | Description                            | Sample value                                                                                                       |
|-----------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `FABRIC_SQL_CONNECTIONSTRING`     | Azure SQL Database connection string   | `jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;authentication=ActiveDirectoryMSI;` |

#### [Python](#tab/fabric-sql-me-id-python)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `FABRIC_SQL_CONNECTIONSTRING`  | Azure SQL Database connection string   | `Driver={ODBC Driver 17 for SQL Server};Server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;Database=<SQL-DB-name>-<Fabric-DB-Identifier>;Authentication=ActiveDirectoryMSI;` |

#### [Go](#tab/fabric-sql-me-id-go)

| Default environment variable name | Description                     | Example value                                                              |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `FABRIC_SQL_CONNECTIONSTRING`  | Azure SQL Database connection string   | `server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com;port=1433;database=<SQL-DB-name>-<Fabric-DB-Identifier>;fedauth=ActiveDirectoryManagedIdentity;` |

#### [Other](#tab/fabric-sql-me-id-none)
| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `FABRIC_SQL_CONNECTIONSTRING`  | Azure SQL Database connection string   | `server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com;port=1433;database=<SQL-DB-name>-<Fabric-DB-Identifier>;fedauth=ActiveDirectoryManagedIdentity;` |

---

#### Sample code

Outlined below are the steps and code snippets to connect to SQL database in Fabric using a system-assigned managed identity.
[!INCLUDE [code sample for fabricsql system mi](./includes/code-fabricsql-me-id.md)]

### User-assigned Managed Identity

#### [.NET](#tab/fabric-sql-me-id-dotnet)

| Default environment variable name | Description                     | Example value                                                                                                                        |
| --------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `FABRIC_SQL_CONNECTIONSTRING `    | Azure SQL Database connection string   | `Data Source=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;Initial Catalog=<SQL-DB-name>-<Fabric-DB-Identifier>;User ID=<msiClientId>;Authentication=ActiveDirectoryManagedIdentity` |

#### [Java](#tab/fabric-sql-me-id-java)

| Default environment variable name | Description                          | Sample value                                                                                                             |
|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------|
| `FABRIC_SQL_CONNECTIONSTRING`     | Azure SQL Database connection string   | `jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;` |

#### [SpringBoot](#tab/fabric-sql-me-id-springboot)

| Default environment variable name | Description                            | Sample value                                                                                                       |
|-----------------------------------|----------------------------------------|--------------------------------------------------------------------------------------------------------------------|
| `FABRIC_SQL_CONNECTIONSTRING`     | Azure SQL Database connection string   | `jdbc:sqlserver://<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;databaseName=<SQL-DB-name>-<Fabric-DB-Identifier>;msiClientId=<msiClientId>;authentication=ActiveDirectoryMSI;` |

#### [Python](#tab/fabric-sql-me-id-python)

| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `FABRIC_SQL_CONNECTIONSTRING`  | Azure SQL Database connection string   | `Driver={ODBC Driver 17 for SQL Server};Server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com,1433;Database=<SQL-DB-name>-<Fabric-DB-Identifier>;UID=<msiClientId>;Authentication=ActiveDirectoryMSI;` |

#### [Go](#tab/fabric-sql-me-id-go)

| Default environment variable name | Description                     | Example value                                                              |
| --------------------------------- | ------------------------------- | -------------------------------------------------------------------------- |
| `FABRIC_SQL_CONNECTIONSTRING`  | Azure SQL Database connection string   | `server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com;port=1433;database=<SQL-DB-name>-<Fabric-DB-Identifier>;user id=<msiClientId>;fedauth=ActiveDirectoryManagedIdentity;` |

#### [Other](#tab/fabric-sql-me-id-none)
| Default environment variable name | Description       | Example value                                |
| --------------------------------- | ----------------- | -------------------------------------------- |
| `FABRIC_SQL_CONNECTIONSTRING`  | Azure SQL Database connection string   | `server=tcp:<Fabric-SQL-Identifier>.msit-database.fabric.microsoft.com;port=1433;database=<SQL-DB-name>-<Fabric-DB-Identifier>;user id=<msiClientId>;fedauth=ActiveDirectoryManagedIdentity;` |

---

#### Sample code

Outlined below are the steps and code snippets to connect to SQL database in Fabric using a user-assigned managed identity.
[!INCLUDE [code sample for fabricsql user mi](./includes/code-fabricsql-me-id.md)]

## Share access to SQL database in Fabric

1. Complete creating your service connection on the Cloud Shell, or on your local Azure CLI.

1. Once your connection is created, open your compute service resource in the Azure portal, open the Service Connector menu, and locate your SQL database in Fabric service connection. Select **SQL database** to navigate to the Fabric portal.

    :::image type="content" source="./media/integrate-fabric-sql/navigate-to-fabric-sql-database.png" alt-text="Screenshot of the Azure portal, selecting SQL Database link to navigate to the Fabric portal.":::

1. On the Fabric portal, locate the **Security** tab and select **Manage SQL security**.

    :::image type="content" source="./media/integrate-fabric-sql/fabric-portal-manage-security.png" alt-text="Screenshot of the Fabric portal, selecting Manage SQL Security.":::

1. Select the role db_ddladmin, then **Manage access**.

    :::image type="content" source="./media/integrate-fabric-sql/fabric-portal-manage-access-sql-role.png" alt-text="Screenshot of the Fabric portal, selecting the db_ddladmin role, and then clicking Manage access.":::

1. You should see the name of your system-assigned managed identity, and/or any user-assigned managed identities with a service connection to this SQL database in Fabric. Select **Share database**. If you do not see the **Share database** option, you do not need to continue with the remaining steps.

    :::image type="content" source="./media/integrate-fabric-sql/fabric-portal-share-database.png" alt-text="Screenshot of the Fabric portal, viewing a list of groups added to the role, and clicking Share database.":::

1. Enter and select the name of your newly created system-assigned managed identity, and/or any user-assigned managed identities as they appear on the **Manage access** pane. Add any other identities as needed. Select the **Read all data using SQL database** checkbox, then select **Grant**.

    :::image type="content" source="./media/integrate-fabric-sql/fabric-portal-grant-access-type-name.png" alt-text="Screenshot of the Fabric portal, typing in the names of any assigned managed identities, selecting Read all data using SQL database, and then clicking Grant.":::

1. You're now ready to use your new service connection to SQL database in Fabric.

## Next step

Refer to the following article to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
