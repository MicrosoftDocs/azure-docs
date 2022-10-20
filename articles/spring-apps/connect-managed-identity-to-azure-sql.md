---
title:  Use Managed identity to connect Azure SQL to Azure Spring Apps app
description: Set up managed identity to connect Azure SQL to an Azure Spring Apps app.
author: karlerickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/26/2022
ms.custom: devx-track-java, event-tier1-build-2022
---

# Use a managed identity to connect Azure SQL Database to an Azure Spring Apps app

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ❌ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

This article shows you how to create a managed identity for an Azure Spring Apps app and use it to access Azure SQL Database.

[Azure SQL Database](https://azure.microsoft.com/services/sql-database/) is the intelligent, scalable, relational database service built for the cloud. It’s always up to date, with AI-powered and automated features that optimize performance and durability. Serverless compute and Hyperscale storage options automatically scale resources on demand, so you can focus on building new applications without worrying about storage size or resource management.

## Prerequisites

* Follow the [Spring Data JPA tutorial](/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-sql-server) to provision an Azure SQL Database and get it work with a Java app locally
* Follow the [Azure Spring Apps system-assigned managed identity tutorial](./how-to-enable-system-assigned-managed-identity.md) to provision an Azure Spring Apps app with MI enabled

## Connect to Azure SQL Database with a managed identity

You can connect your application deployed to Azure Spring Apps to an Azure SQL Database with a managed identity by following manual steps or using [Service Connector](../service-connector/overview.md).

### [Manual configuration](#tab/manual)

### Grant permission to the managed identity

Connect to your SQL server and run the following SQL query:

```sql
CREATE USER [<MIName>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<MIName>];
ALTER ROLE db_datawriter ADD MEMBER [<MIName>];
ALTER ROLE db_ddladmin ADD MEMBER [<MIName>];
GO
```

The value of the `<MIName>` placeholder follows the rule `<service-instance-name>/apps/<app-name>`; for example: `myspringcloud/apps/sqldemo`. You can also query the MIName with Azure CLI:

```azurecli
az ad sp show --id <identity-object-ID> --query displayName
```

### Configure your Java app to use a managed identity

Open the *src/main/resources/application.properties* file, then add `Authentication=ActiveDirectoryMSI;` at the end of the `spring.datasource.url` line, as shown in the following example. Be sure to use the correct value for the $AZ_DATABASE_NAME variable.

```properties
spring.datasource.url=jdbc:sqlserver://$AZ_DATABASE_NAME.database.windows.net:1433;database=demo;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;Authentication=ActiveDirectoryMSI;
```

#### [Service Connector](#tab/service-connector)

Configure your app deployed to Azure Spring to connect to an SQL Database with a system-assigned managed identity using the `az spring connection create` command, as shown in the following example.

```azurecli-interactive
az spring connection create sql \
    --resource-group $SPRING_APP_RESOURCE_GROUP \
    --service $Spring_APP_SERVICE_NAME \
    --app $APP_NAME --deployment $DEPLOYMENT_NAME \
    --target-resource-group $SQL_RESOURCE_GROUP \
    --server $SQL_SERVER_NAME \
    --database $DATABASE_NAME \
    --system-assigned-identity
```

---

## Build and deploy the app to Azure Spring Apps

Rebuild the app and deploy it to the Azure Spring Apps provisioned in the second bullet point under Prerequisites. Now you have a Spring Boot application, authenticated by a managed identity, that uses JPA to store and retrieve data from an Azure SQL Database in Azure Spring Apps.

## Next steps

* [How to access Storage blob with managed identity in Azure Spring Apps](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/managed-identity-storage-blob)
* [How to enable system-assigned managed identity for applications in Azure Spring Apps](./how-to-enable-system-assigned-managed-identity.md)
* [Learn more about managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
* [Authenticate Azure Spring Apps with Key Vault in GitHub Actions](./github-actions-key-vault.md)
