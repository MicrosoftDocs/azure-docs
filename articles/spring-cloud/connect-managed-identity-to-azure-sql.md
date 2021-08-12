---
title:  Use Managed identity to connect Azure SQL to Azure Spring Cloud app
description: Set up managed identity to connect Azure SQL to an Azure Spring Cloud app.
author: karlerickson
ms.author: karler
ms.service: spring-cloud
ms.topic: how-to
ms.date: 03/25/2021
ms.custom: devx-track-java
---

# Use a managed identity to connect Azure SQL Database to an Azure Spring Cloud app

**This article applies to:** ✔️ Java

This article shows you how to create a managed identity for an Azure Spring Cloud app and use it to access Azure SQL Database.

[Azure SQL Database](https://azure.microsoft.com/services/sql-database/) is the intelligent, scalable, relational database service built for the cloud. It’s always up to date, with AI-powered and automated features that optimize performance and durability. Serverless compute and Hyperscale storage options automatically scale resources on demand, so you can focus on building new applications without worrying about storage size or resource management.

## Prerequisites
This example uses the following resources.
* Follow the [Spring Data JPA tutorial](/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-sql-server) to provision an Azure SQL Database and get it work with a Java app locally
* Follow the [Azure Spring Cloud system-assigned managed identity tutorial](./how-to-enable-system-assigned-managed-identity.md) to provision an Azure Spring Cloud app with MI enabled

## Grant permission to the Managed Identity
Connect to your SQL server and run the following SQL query:

```sql
CREATE USER [<MIName>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<MIName>];
ALTER ROLE db_datawriter ADD MEMBER [<MIName>];
ALTER ROLE db_ddladmin ADD MEMBER [<MIName>];
GO
```

This <MIName> follows the rule: `<service instance name>/apps/<app name>`, e.g myspringcloud/apps/sqldemo. You can also query the MIName with Azure CLI:

```azurecli
az ad sp show --id <identity object ID> --query displayName
```

## Configure your Java app to use Managed Identity
Open the `src/main/resources/application.properties` file, and add `Authentication=ActiveDirectoryMSI;` at the end of the following line. Be sure to use the correct value for $AZ_DATABASE_NAME variable.

```properties
spring.datasource.url=jdbc:sqlserver://$AZ_DATABASE_NAME.database.windows.net:1433;database=demo;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;Authentication=ActiveDirectoryMSI;
```

## Build and deploy the app to Azure Spring Cloud
Rebuild the app and deploy it to the Azure Spring Cloud app provisioned in the second bullet point under Prerequisites. Now you have a Spring Boot application, authenticated by a Managed Identity, that uses JPA to store and retrieve data from an Azure SQL Database in Azure Spring Cloud.

## Next steps

* [How to access Storage blob with managed identity in Azure Spring Cloud](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/managed-identity-storage-blob)
* [How to enable system-assigned managed identity for Azure Spring Cloud application](./how-to-enable-system-assigned-managed-identity.md)
* [Learn more about managed identities for Azure resources](https://github.com/MicrosoftDocs/azure-docs/blob/master/articles/active-directory/managed-identities-azure-resources/overview.md)
* [Authenticate Azure Spring Cloud with Key Vault in GitHub Actions](./github-actions-key-vault.md)