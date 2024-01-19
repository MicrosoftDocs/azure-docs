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
|[Connect to Azure resources using a managed identity](#connect-to-azure-resources-with-managed-identities)|* You want to connect using the app identity or without an authenticated user.<br>* You don't need to manage credentials, keys, or secrets, or the credentials aren’t even accessible to you.<br>* The dependent service [supports managed identities](../active-directory/managed-identities-azure-resources/managed-identities-status.md).<br>* A Microsoft Entra identity is required to access the Azure resource. For example, services such as Microsoft Graph or Azure management SDKs.|
|[Connect as the authenticated user](#connect-as-the-authenticated-user)| You want to access a resource and perform some action as the signed-in user.|
|[Connect using secrets](#connect-using-secrets)|* You need App Service app settings to be passed to your app as environment variables.<br>* You want to connect to non-Azure services such as GitHub, Twitter, Facebook, or Google.<br>*The downstream resource doesn't support managed identities or requires a connection secret.|


## Connect to Azure resources with managed identities

Use a [managed identity](overview-managed-identity.md) to authenticate with another Azure resource using the app identity. This level of authentication lets Azure manage the authentication process, after the required setup is complete. Once the connection is set up, you won't need to manage the connection. 

The following image demonstrates the following an App Service connecting to other Azure services:

* A: User visits Azure app service website.
* B: Securely **connect from** App Service **to** another Azure service using managed identity. 
* C: Securely **connect from** App Service **to** Microsoft Graph.

:::image type="content" source="media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram showing managed identity accessing a resource with or without the user's identity.":::

## Connect as the authenticated user

Grant delegated permissions to your web app to connect to ressources using the identity of the signed-in user.

## Connect using secrets


### Use secrets from Key Vault

When managed identities aren't supported by your app's downstream services, use Key Vault to store your secrets, and connect your app to Key Vault with a managed identity. 

The following image demonstrates App Service connecting to Key Vault using a managed identity and then accessing an Azure service using secrets stored i Key Vault:

:::image type="content" source="media/tutorial-connect-overview/app-service-connect-key-vault-managed-identity.png" alt-text="Image showing app service using a secret stored in Key Vault and managed with Managed identity to connect to Azure AI services."::: 

Benefits of managed identities integrated with Key Vault include:

* Connectivity to Key Vault is secured by managed identities
* Access to the Key Vault is restricted to the app. App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the Key Vault secrets.
* No code change is required if your application code already accesses connection secrets with app settings.
* Monitoring and auditing of who accessed secrets.
* Rotation of connection information in Key Vault requires no changes in App Service.

### Use secrets in app settings 

The App Service provides [App settings](configure-common.md?tabs=portal#configure-app-settings) to store connection strings, API keys, and other environment variables. While App Service does provide encryption for app settings, for enterprise-level security, consider other services to manage these types of secrets that provide additional benefits.

**Key Vault** integration from App Service with managed identity best used when:

* Connectivity to Key Vault is secured by managed identities.
* Access to the Key Vault is restricted to the app. App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the Key Vault secrets.
* No code change is required if your application code already accesses connection secrets with app settings.
* Monitoring and auditing of who accessed secrets.


## Next steps

* Learn how to use App Service managed identity with:
    * [SQL server](tutorial-connect-msi-sql-database.md?tabs=windowsclient%2Cdotnet)
    * [Azure storage](scenario-secure-app-access-storage.md?tabs=azure-portal%2Cprogramming-language-csharp)
    * [Microsoft Graph](scenario-secure-app-access-microsoft-graph-as-app.md?tabs=azure-powershell%2Cprogramming-language-csharp)
