---
title: 'Securely connect to Azure resources'
description: Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends the more secure method for connecting.
author: cephalin
ms.author: cephalin

ms.topic: tutorial
ms.date: 02/16/2022
ms.custom: AppServiceConnectivity
---
# Securely connect to Azure services and databases from Azure App Service

Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends the more secure method for connecting.

|Connection method|When to use|
|--|--|
|[Direct connection from App Service managed identity](#connect-to-azure-services-with-managed-identity)|Dependent service [supports managed identity](../active-directory/managed-identities-azure-resources/managed-identities-status.md)<br><br>* Best for enterprise-level security.<br>* Connection to dependent service is secured with managed identity.<br>* Large team or automated connection string and secret management.<br>* Don't manage credentials manually.<br>* Credentials aren’t accessible to you.<br>* An Azure Active Directory Identity is required to access. Services include Microsoft Graph or Azure management SDKs.|
|[Connect using Key Vault secrets from App Service managed identity](#connect-to-key-vault-with-managed-identity)|Dependent service doesn't support managed identity.<br><br>* Best for enterprise-level security.<br>* Connection includes non-Azure services such as GitHub, Twitter, Facebook, Google<br>* Large team or automated connection string and secret management<br>* Don't manage credentials manually.<br>* Credentials aren’t accessible to you.<br>* Manage connection information with environment variables.|
|[Connect with app settings](#connect-with-app-settings)|* Best for small team or individual owner of Azure resources.<br>* Stage 1 of multi-stage migration to Azure.<br>* Temporary or proof-of-concept applications.<br>* Manually manage connection information with environment variables.|

## Connect to Azure services with managed identity

Use [managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate from one Azure resource, such as Azure app service, to another Azure resource whenever possible. This level of authentication lets Azure manage the authentication process, after the required setup is complete. Once the connection is set up, you won't need to manage the connection. 

Benefits of managed identity:

* Automated credentials management
* Many Azure services are included
* No additional cost
* No code changes

:::image type="content" source="media/tutorial-connect-overview/when-use-managed-identities.png" alt-text="Image showing source and target resources for managed identity.":::

Learn which [services](../active-directory/managed-identities-azure-resources/managed-identities-status.md) are supported with managed identity and what [operations you can perform](../active-directory/managed-identities-azure-resources/overview.md).

### Example managed identity scenario

The following image demonstrates the following an App Service connecting to other Azure services:

* A: User visits Azure app service website.
* B: Securely **connect from** App Service **to** another Azure service using managed identity. 
* C: Securely **connect from** App Service **to** Microsoft Graph.

:::image type="content" source="media/scenario-secure-app-overview/web-app.svg" alt-text="Diagram showing managed identity accessing a resource with or without the user's identity.":::

## Connect to Key Vault with managed identity

When managed identity isn't supported for your app's dependent services, use Key Vault to store your secrets, and connect your app to Key Vault with a managed identity. 

Secrets include:

|Secret|Example|
|--|--|
|Certificates|SSL certificates|
|Keys and access tokens|Cognitive service API Key<br>GitHub personal access token<br>Twitter consumer keys and authentication tokens|
|Connection strings|Database connection strings such as SQL server or MongoDB|

:::image type="content" source="media/tutorial-connect-overview/app-service-connect-key-vault-managed-identity.png" alt-text="Image showing app service using a secret stored in Key Vault and managed with Managed identity to connect to Azure AI services."::: 

Benefits of managed identity integrated with Key Vault include:

* Connectivity to Key Vault is secured by managed identities
* Access to the Key Vault is restricted to the app. App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the Key Vault secrets.
* No code change is required if your application code already accesses connection secrets with app settings.
* Monitoring and auditing of who accessed secrets.
* Rotation of connection information in Key Vault requires no changes in App Service.

## Connect with app settings 

The App Service provides [App settings](configure-common.md?tabs=portal#configure-app-settings) to store connection strings, API keys, and other environment variables. While App Service does provide encryption for app settings, for enterprise-level security, consider other services to manage these types of secrets that provide additional benefits.

**App settings** best used when:

* Security of connection information is manual and limited to a few people
* Web app is temporary, proof-of-concept, or in first migration stage to Azure

**App Service** managed identity to another Azure service best when:

* You don't need to manage Azure credentials. Credentials aren’t even accessible to you.
* You can use managed identities to authenticate to any resource that supports Azure Active Directory authentication including your own applications.
* Managed identities can be used without any additional cost.

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
