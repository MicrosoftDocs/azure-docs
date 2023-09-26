---
title:  Use Managed identity to connect Azure SQL Database to an app deployed to Azure Spring Apps
description: Set up managed identity to connect Azure SQL to an app deployed to Azure Spring Apps.
author: KarlErickson
ms.author: karler
ms.service: spring-apps
ms.topic: how-to
ms.date: 09/26/2022
ms.custom: devx-track-java, devx-track-extended-java, event-tier1-build-2022, passwordless-java, service-connector
---

# Use a managed identity to connect Azure SQL Database to an app deployed to Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard ✔️ Enterprise

This article shows you how to create a managed identity for an app deployed to Azure Spring Apps and use it to access Azure SQL Database.

[Azure SQL Database](https://azure.microsoft.com/services/sql-database/) is the intelligent, scalable, relational database service built for the cloud. It’s always up to date, with AI-powered and automated features that optimize performance and durability. Serverless compute and Hyperscale storage options automatically scale resources on demand, so you can focus on building new applications without worrying about storage size or resource management.

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Azure CLI](/cli/azure/install-azure-cli) version 2.45.0 or higher.
* Follow the [Spring Data JPA tutorial](/azure/developer/java/spring-framework/configure-spring-data-jpa-with-azure-sql-server) to provision an Azure SQL Database and get it work with a Java app locally.
* Follow the [Azure Spring Apps system-assigned managed identity tutorial](./how-to-enable-system-assigned-managed-identity.md) to provision an app in Azure Spring Apps with managed identity enabled.

## Connect to Azure SQL Database with a managed identity

You can connect your application to an Azure SQL Database with a managed identity by following manual steps or using [Service Connector](../service-connector/overview.md).

### [Manual configuration](#tab/manual)

### Grant permission to the managed identity

Connect to your SQL server and run the following SQL query:

```sql
CREATE USER [<managed-identity-name>] FROM EXTERNAL PROVIDER;
ALTER ROLE db_datareader ADD MEMBER [<managed-identity-name>];
ALTER ROLE db_datawriter ADD MEMBER [<managed-identity-name>];
ALTER ROLE db_ddladmin ADD MEMBER [<managed-identity-name>];
GO
```

The value of the `<managed-identity-name>` placeholder follows the rule `<service-instance-name>/apps/<app-name>`; for example: `myspringcloud/apps/sqldemo`. You can also use the following command to query the managed identity name with Azure CLI:

```azurecli
az ad sp show --id <identity-object-ID> --query displayName
```

### Configure your Java app to use a managed identity

Open the *src/main/resources/application.properties* file, then add `Authentication=ActiveDirectoryMSI;` at the end of the `spring.datasource.url` line, as shown in the following example. Be sure to use the correct value for the $AZ_DATABASE_NAME variable.

```properties
spring.datasource.url=jdbc:sqlserver://$AZ_DATABASE_NAME.database.windows.net:1433;database=demo;encrypt=true;trustServerCertificate=false;hostNameInCertificate=*.database.windows.net;loginTimeout=30;Authentication=ActiveDirectoryMSI;
```

#### [Service Connector](#tab/service-connector)

> [!NOTE]
> Service Connectors are created at the deployment level. So, if another deployment is created, you need to create the connections again.

Configure your app deployed to Azure Spring Apps to connect to an Azure SQL Database with a system-assigned managed identity using the `az spring connection create` command, as shown in the following example.

1. Use the following command to install the Service Connector passwordless extension for the Azure CLI:

   ```azurecli
   az extension add --name serviceconnector-passwordless --upgrade
   ```

1. Use the following command to connect to the database:

   ```azurecli
   az spring connection create sql \
       --resource-group $SPRING_APP_RESOURCE_GROUP \
       --service $SPRING_APP_SERVICE_NAME \
       --app $APP_NAME \
       --deployment $DEPLOYMENT_NAME \
       --target-resource-group $SQL_RESOURCE_GROUP \
       --server $SQL_SERVER_NAME \
       --database $DATABASE_NAME \
       --system-identity
   ```

1. Use the following command to check the creation result:

   ```azurecli
   export CONNECTION_NAME=$(az spring connection list \
      --resource-group $SPRING_APP_RESOURCE_GROUP \
      --service $SPRING_APP_SERVICE_NAME \
      --app $APP_NAME  \
      --query '[0].name' \
      --output tsv)
   
   az spring connection list-configuration \
      --resource-group $SPRING_APP_RESOURCE_GROUP \
      --service $SPRING_APP_SERVICE_NAME \
      --app $APP_NAME  \
      --connection $CONNECTION_NAME 
   ```

---

## Build and deploy the app to Azure Spring Apps

Rebuild the app and deploy it to the Azure Spring Apps provisioned in the second bullet point under Prerequisites. You now have a Spring Boot application authenticated by a managed identity that uses JPA to store and retrieve data from an Azure SQL Database in Azure Spring Apps.

## Next steps

* [How to access Storage blob with managed identity in Azure Spring Apps](https://github.com/Azure-Samples/Azure-Spring-Cloud-Samples/tree/master/managed-identity-storage-blob)
* [How to enable system-assigned managed identity for applications in Azure Spring Apps](./how-to-enable-system-assigned-managed-identity.md)
* [Learn more about managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md)
* [Authenticate Azure Spring Apps with Key Vault in GitHub Actions](./github-actions-key-vault.md)
