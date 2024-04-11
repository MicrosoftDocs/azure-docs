---
title: 'Securely connect to Azure resources'
description: Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends the more secure method for connecting.
author: cephalin
ms.author: cephalin

ms.topic: tutorial
ms.date: 01/16/2023
ms.custom: AppServiceConnectivity
---
# Securely connect to Azure services and databases from Azure App Service

Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends different methods for connecting and when to use them.

|Connection method|When to use|
|--|--|
|[Connect using the app identity](#connect-using-the-app-identity)|* You want to connect to a resource without an authenticated user present or using the app identity.<br>* You don't need to manage credentials, keys, or secrets, or the credentials aren’t even accessible to you.<br>* You can use managed identities to manage credentials for you.<br>* A Microsoft Entra identity is required to access the Azure resource. For example, services such as Microsoft Graph or Azure management SDKs.|
|[Connect as the authenticated user](#connect-as-the-authenticated-user)| * You want to access a resource and perform some action as the signed-in user.|
|[Connect using secrets](#connect-using-secrets)|* You need secrets to be passed to your app as environment variables.<br>* You want to connect to non-Azure services such as GitHub, Twitter, Facebook, or Google.<br>* The downstream resource doesn't support Microsoft Entra authentication.  <br>* The downstream resource requires a connection string or key or secret of some sort.|

## Connect using secrets

There are two recommended ways to use secrets in your app:  using secrets stored in Azure Key Vault or secrets in App Service application settings.

### Use secrets in app settings 

Some apps access secrets using environment variables.  Traditionally, App Service [app settings](configure-common.md) have been used to store connection strings, API keys, and other environment variables.  These secrets are injected into your application code as environment variables at app startup. App settings are always encrypted when stored (encrypted-at-rest).  If you also want access policies and audit history for your secrets, consider putting them in Azure Key Vault and using [Key Vault references](app-service-key-vault-references.md) in your app settings.

Examples of using application secrets to connect to a database:

- [ASP.NET Core with SQL DB](tutorial-dotnetcore-sqldb-app.md)
- [ASP.NET with SQL DB](app-service-web-tutorial-dotnet-sqldatabase.md)
- [PHP with MySQL](tutorial-php-mysql-app.md)
- [Node.js with MongoDB](tutorial-nodejs-mongodb-app.md)
- [Python with Postgres](tutorial-python-postgresql-app.md)
- [Java with Spring Data](tutorial-java-spring-cosmosdb.md)
- [Quarkus with Postgres](tutorial-java-quarkus-postgresql-app.md)

### Use secrets from Key Vault

[Azure Key Vault](app-service-key-vault-references.md) can be used to securely store secrets and keys, monitor access and use of secrets, and simplify administration of application secrets.  If your app's downstream service doesn't support Microsoft Entra authentication or requires a connection string or key, use Key Vault to store your secrets and connect your app to Key Vault with a managed identity and retrieve the secrets. 

Benefits of managed identities integrated with Key Vault include:
- Access to the Key Vault is restricted to the app. 
- App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the Key Vault secrets. 
- No code change is required if your application code already accesses connection secrets with app settings. 
- Key Vault provides monitoring and auditing of who accessed secrets.  
- Rotation of connection information in Key Vault requires no changes in App Service.

The following image demonstrates App Service connecting to Key Vault using a managed identity and then accessing an Azure service using secrets stored i Key Vault:

:::image type="content" source="media/tutorial-connect-overview/app-service-connect-key-vault-managed-identity.png" alt-text="Image showing app service using a secret stored in Key Vault and managed with Managed identity to connect to Azure AI services."::: 


## Connect using the app identity

In some cases, your app needs to access data under the identity of the app itself or without a signed-in user present. A [managed identity](overview-managed-identity.md) from Microsoft Entra ID allows App Service to access resources through role-based access control (RBAC), without requiring app credentials.  A managed identity can connect to any resource that supports Microsoft Entra authentication. After assigning a managed identity to your web app, Azure takes care of the creation and distribution of a certificate. You don't have to worry about managing secrets or app credentials.

The following image demonstrates the following an App Service connecting to other Azure services:

* A: User visits Azure app service website.
* B: Securely **connect from** App Service **to** another Azure service using a managed identity. 
* C: Securely **connect from** App Service **to** Microsoft Graph using a managed identity.

:::image type="content" source="media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram showing managed identity accessing a resource with or without the user's identity.":::

## Connect as the authenticated user

In some cases, your app needs to connect to a resource and perform some action that only the signed-in user can do. Grant delegated permissions to your app to connect to resources using the identity of the signed-in user.

The following image demonstrates an application securely accessing an SQL database on behalf of the signed-in user.

:::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/architecture.png" alt-text="Architecture diagram for tutorial scenario.":::

Some common scenarios are:
- [Connect to Microsoft Graph](scenario-secure-app-access-microsoft-graph-as-user.md) as the user
- [Connect to an SQL database](tutorial-connect-app-access-sql-database-as-user-dotnet.md) as the user
- [Connect to another App Service app](tutorial-auth-aad.md) as the user
- [Connect to another App Service app and then a downstream service](tutorial-connect-app-app-graph-javascript.md) as the user


## Next steps

Learn how to:
- Securely store secrets in [Azure Key Vault](app-service-key-vault-references.md).
- Access resources using a [managed identity](overview-managed-identity.md).
- Store secrets using App Service [app settings](configure-common.md).
- [Connect to Microsoft Graph](scenario-secure-app-access-microsoft-graph-as-user.md) as the user.
- [Connect to an SQL database](tutorial-connect-app-access-sql-database-as-user-dotnet.md) as the user.
- [Connect to another App Service app](tutorial-auth-aad.md) as the user.
- [Connect to another App Service app and then a downstream service](tutorial-connect-app-app-graph-javascript.md) as the user.
