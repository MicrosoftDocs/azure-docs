---
title: 'Securely connect to Azure resources'
description: Learn how to connect to Azure resources from an app service.

ms.topic: tutorial
ms.date: 01/26/2022
---
# Securely connect to Azure services

Your app service may need to connect to other Azure services such as a database, storage, or another app. This overview recommends the more secure method for connecting.

## Connect with managed identity

Use [managed identity](/azure/active-directory/managed-identities-azure-resources/overview) to authenticate from one Azure resource, such as Azure app service, to another whenever possible. This level of authentication lets Azure manage the authentication process, after the required setup is complete. Once the connection is setup, you won't need to manage the connection. 

Benefits of managed identity:

* You don't need to manage credentials. Credentials are not even accessible to you.
* You can use managed identities to authenticate to any resource that supports Azure Active Directory authentication including your own applications.
* Managed identities can be used without any additional cost.

:::image type="content" source="/azure/active-directory/managed-identities-azure-resources/media/overview/when-use-managed-identities.png" alt-text="Image showing source and target resources for managed identity":::

Learn which [services](/azure/active-directory/managed-identities-azure-resources/managed-identities-status) are supported with managed identity and what [operations you can perform](/azure/active-directory/managed-identities-azure-resources/overview).

:::image type="content" source="media/service-to-service-managed-identity.png" alt-text="Image showing authentication flow from one Azure service to another Azure service.":::

## Connect with secrets stored in Key Vault

When managed identity isn't supported for your app's dependent services, use Key Vault to store your secrets, and connect your app to Key Vault with a managed identity.

:::image type="content" source="media/tutorial-connect-msi-key-vault/architecture.png" alt-text="Image showing app service using a secret stored in Key vault and managed with Managed identity to connect to Cognitive Services"::: 

Benefits of managed identity integrated with Key vault include:

* Connectivity to Key Vault is secured by managed identities
* Access to the key vault is restricted to the app. App contributors, such as administrators, may have complete control of the App Service resources, and at the same time have no access to the Key Vault secrets.
* No code change is required if your application code already accesses connection secrets with app settings.

## Next steps

* Learn how to use App service managed identity with:
    * [SQL server](tutorial-connect-msi-sql-database?tabs=windowsclient%2Cdotnet)
    * [Azure storage](scenario-secure-app-access-storage?tabs=azure-portal%2Cprogramming-language-csharp)
    * [Microsoft Graph](scenario-secure-app-access-microsoft-graph-as-app?tabs=azure-powershell%2Cprogramming-language-csharp)