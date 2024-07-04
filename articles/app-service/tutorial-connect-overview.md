---
title: 'Securely connect to Azure resources'
description: Shows you how to connect to other Azure services such as a database, storage, or another app. This overview recommends the more secure method for connecting.
author: cephalin
ms.author: cephalin
ms.topic: article
ms.date: 07/06/2024
ms.custom: AppServiceConnectivity
#customer intent: As a developer, I want to learn how to securely connect to Azure resources from Azure App Service so that I can protect sensitive data and ensure secure communication.
---
# Secure connectivity to Azure services and databases from Azure App Service

Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends different methods for connecting and when to use them.

Today, the decision for a connectivity approach is closely related to secrets management. The common pattern of using connection secrets in connection strings, such as username and password, secret key, etc. is no longer considered the most secure approach for connectivity. The risk is even higher today because threat actors regularly crawl public GitHub repositories for accidentally committed connection secrets. For cloud applications, the best secrets management is to have no secrets at all. When you migration to Azure App Service, your app might start with secrets-based connectivity, and App Service lets you keep secrets securely. However, Azure can help secure your app's back-end connectivity through Microsoft Entra authentication, which eliminates secrets altogether in your app.

|Connection method|When to use|
|--|--|
|[Connect with an app identity](#connect-with-an-app-identity)|* You want to remove credentials, keys, or secrets completely from your application.<br.>* The downstream Azure service supports Microsoft Entra authentication, such as Microsoft Graph.*<br/>The downstream resource doesn't need to know the current signed-in user or doesn't need granular authorization of the current signed-in user.|
|[Connect on behalf of the signed-in user](#connect-on-behalf-of-the-signed-in-user)| * The app must access a downstream resource on behalf of the signed-in user.<br/>* The downstream Azure service supports Microsoft Entra authentication, such as Microsoft Graph.*<br/>The downstream resource must perform granular authorization of the current signed-in user.|
|[Connect using secrets](#connect-using-secrets)|* The downstream resource requires connection secrets.<br>* Your app connects to non-Azure services, such as an on-premises database server.<br>* The downstream Azure service doesn't support Microsoft Entra authentication yet.|

## Connect with an app identity

If your app already uses a single set of credentials to access a downstream Azure service, you can very quickly convert the connection to use an app identity instead. A [managed identity](overview-managed-identity.md) from Microsoft Entra ID lets App Service access resources without secrets, and you can manage its access through role-based access control (RBAC). A managed identity can connect to any Azure resource that supports Microsoft Entra authentication, and the authentication takes place with short-lived tokens.

The following image demonstrates the following an App Service connecting to other Azure services:

* A: User visits Azure app service website.
* B: Securely **connect from** App Service **to** another Azure service using a managed identity. 
* C: Securely **connect from** App Service **to** Microsoft Graph using a managed identity.

:::image type="content" source="media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram showing managed identity accessing a resource with or without the user's identity.":::

## Connect on behalf of the signed-in user

Your app might need to connect to a downstream service on behalf of the signed-in user. App Service lets you easily authenticate users using the most common identity providers (see [Authentication and authorization in Azure App Service and Azure Functions](overview-authentication-authorization.md)). If you use the Microsoft provider (Microsoft Entra authentication), you can then flow this signed-in user to any downstream service. For example:

- In SQL database, run a query that returns confidential data that the signed-in user is authorized to read.
- Retrieve personal data or take actions as the signed-in user in Microsoft Graph.

The following image demonstrates an application securely accessing an SQL database on behalf of the signed-in user.

:::image type="content" source="./media/tutorial-connect-app-access-sql-database-as-user-dotnet/architecture.png" alt-text="Architecture diagram for tutorial scenario.":::

Some common scenarios are:
- [Connect to Microsoft Graph on behalf of the user](scenario-secure-app-access-microsoft-graph-as-user.md)
- [Connect to an SQL database on behalf the user](tutorial-connect-app-access-sql-database-as-user-dotnet.md)
- [Connect to another App Service app on behalf of the user](tutorial-auth-aad.md)
- [Flow the signed-in user through multiple layers of downstream services](tutorial-connect-app-app-graph-javascript.md)

## Connect using secrets

There are two recommended ways to use secrets in your app: using secrets stored in Azure Key Vault or secrets in App Service app settings.

### Use secrets from Key Vault

[Azure Key Vault](app-service-key-vault-references.md) can be used to securely store secrets and keys, monitor access and use of secrets, and simplify administration of application secrets. If the downstream service doesn't support Microsoft Entra authentication or requires a connection string or key, use Key Vault to store your secrets and connect your app to Key Vault with a managed identity and retrieve the secrets. Your app can access they key vault secrets as [Key Vault references](app-service-key-vault-references.md) in the app settings. 

Benefits of managed identities integrated with Key Vault include:
- Access to the key vault secret is restricted to the app. 
- App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the key vault secrets. 
- No code change is required if your application code already accesses connection secrets with app settings. 
- Key Vault provides monitoring and auditing of who accessed secrets.
- Rotation of key vault secrets requires no changes in App Service.

The following image demonstrates App Service connecting to Key Vault using a managed identity and then accessing an Azure service using secrets stored in Key Vault:

:::image type="content" source="media/tutorial-connect-overview/app-service-connect-key-vault-managed-identity.png" alt-text="Image showing app service using a secret stored in Key Vault and managed with Managed identity to connect to Azure AI services."::: 

### Use secrets in app settings 

For apps that connect to services using secrets (such as usernames, passwords, and API keys), App Service can store them securely in [app settings](configure-common.md). These secrets are injected into your application code as environment variables at app startup. App settings are always encrypted when stored (encrypted-at-rest). For more advanced secrets management, such as secrets rotation, access policies, and audit history, try [using Key Vault](#use-secrets-from-key-vault).

Examples of using application secrets to connect to a database:

- [ASP.NET Core with SQL DB](tutorial-dotnetcore-sqldb-app.md)
- [ASP.NET with SQL DB](app-service-web-tutorial-dotnet-sqldatabase.md)
- [PHP with MySQL](tutorial-php-mysql-app.md)
- [Node.js with MongoDB](tutorial-nodejs-mongodb-app.md)
- [Python with Postgres](tutorial-python-postgresql-app.md)
- [Java with Spring Data](tutorial-java-spring-cosmosdb.md)
- [Quarkus with Postgres](tutorial-java-quarkus-postgresql-app.md)

## Next steps

Learn how to:
- Securely store secrets in [Azure Key Vault](app-service-key-vault-references.md).
- Access resources using a [managed identity](overview-managed-identity.md).
- Store secrets using App Service [app settings](configure-common.md).
- [Connect to Microsoft Graph](scenario-secure-app-access-microsoft-graph-as-user.md) as the user.
- [Connect to an SQL database](tutorial-connect-app-access-sql-database-as-user-dotnet.md) as the user.
- [Connect to another App Service app](tutorial-auth-aad.md) as the user.
- [Connect to another App Service app and then a downstream service](tutorial-connect-app-app-graph-javascript.md) as the user.
