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

This page shows supported authentication methods and clients, and shows sample code you can use to connect SQL database in Microsoft Fabric to other cloud services using Service Connector. This page also shows default environment variable names and values you get when you create the service connection.

## Supported compute services

Service Connector can be used to connect the following compute services to SQL database in Microsoft Fabric:

- Azure App Service
- Azure Container Apps
- Azure Functions
- Azure Kubernetes Service (AKS)
- Azure Spring Apps

## Supported authentication types and client types

The following table shows which combinations of authentication methods and clients are supported for connecting your compute service to SQL database in Microsoft Fabric using Service Connector. A "Yes" indicates that the combination is supported, while a "No" indicates that it is not supported.

| Client type        | System-assigned managed identity | User-assigned managed identity | Secret/connection string | Service principal |
|--------------------|:--------------------------------:|:------------------------------:|:------------------------:|:-----------------:|
| .NET               |                Yes               |               Yes              |            No            |         No        |
| Go                 |                Yes               |               Yes              |            No            |         No        |
| Java               |                Yes               |               Yes              |            No            |         No        |
| Java - Spring Boot |                Yes               |               Yes              |            No            |         No        |
| Python             |                Yes               |               Yes              |            No            |         No        |
| None               |                Yes               |               Yes              |            No            |         No        |

This table indicates that as per Fabric behavior, only authentication via System-assigned and User-assigned managed identity is allowed.

The System-assigned managed identity and User-assigned managed identity methods are supported for .NET, Java, Java - Spring Boot, Python, Go, and None client types. These methods are not supported for any other types.

> [!IMPORTANT]
> Currently, manual steps are required for complete onboarding. See [Manual steps required for SQL database in Microsoft Fabric](#manual-steps).

## Default environment variable names or application properties and sample code

Reference the connection details and sample code in following tables, according to your connection's authentication type and client type, to connect compute services to SQL database in Microsoft Fabric. For more information about naming conventions, check the [Service Connector internals](concept-service-connector-internals.md#configuration-naming-convention) article.

### System-assigned Managed Identity

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

> [!NOTE]
> Although SQL database in Microsoft Fabric is distinct from Azure SQL Database, you can connect to and query your SQL database in Microsoft Fabric in all the same ways as Azure SQL Database. [Learn more](/fabric/database/sql/connect).

Here are the steps and code to connect to SQL database in Microsoft Fabric using a system-assigned managed identity.
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

Here are the steps and code to connect to SQL database in Microsoft Fabric using a user-assigned managed identity.
[!INCLUDE [code sample for fabricsql user mi](./includes/code-fabricsql-me-id.md)]

## <a name="manual-steps"></a> Manual steps

As part of onboarding a service connection to SQL database in Microsoft Fabric, the following manual steps are required.

1. Navigate to the portal, and locate your SQL database in Microsoft Fabric service connection. Click "SQL Database" to navigate to the Fabric portal.

    :::image type="content" source="./media/how-to-integrate-fabric-sql/navigate-to-fabric-sql-database.png" alt-text="Screenshot of the Azure portal, selecting SQL Database link to navigate to the Fabric portal.":::

1. On the Fabric portal, locate the Security tab.

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-portal-security-tab.png" alt-text="Screenshot of the Fabric portal, selecting the Security tab on the portal.":::

1. Click "Manage SQL security."

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-portal-manage-security.png" alt-text="Screenshot of the Fabric portal, selecting Manage SQL Security.":::

1. Click on the role db_ddladmin, and then click "Manage access."

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-portal-manage-access-sql-role.png" alt-text="Screenshot of the Fabric portal, selecting the db_ddladmin role, and then clicking Manage access":::

1. You should see the name of your system-managed identity, and/or any user-managed identities with a service connection to this SQL database in Microsoft Fabric instance. Click "Share database." If you do not see the "Share database" button, there are no more manual steps needed.

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-portal-share-database.png" alt-text="Screenshot of the Fabric portal, viewing a list of groups added to the role, and clicking Share database":::

1. Enter the name of your newly created system-managed identity, and/or any user-managed identities as they appear on the Manage access pane. 

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-portal-grant-access-type-name.png" alt-text="Screenshot of the Fabric portal, typing in the names of any system and/or user managed identities":::

1. Click the matching identity.

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-porta-grant-access-select-principal.png" alt-text="Screenshot of the Fabric portal, clicking the matching FabricDemo identity":::

1. Add any other identities as needed. Click "Read all data using SQL database." Click Grant.

    :::image type="content" source="./media/how-to-integrate-fabric-sql/fabric-portal-grant-access-finalize.png" alt-text="Screenshot of the Fabric portal, clicking Read all data using SQL database, and then clicking Grant":::

1. You're ready to use your new SQL database in Microsoft Fabric service connection!

## Next steps

Follow the documentations to learn more about Service Connector.

> [!div class="nextstepaction"]
> [Learn about Service Connector concepts](./concept-service-connector-internals.md)
