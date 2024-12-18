---
ms.service: azure-logic-apps
author: ecfan
ms.author: estfan
ms.topic: include
ms.date: 12/16/2024
---

> [!IMPORTANT]
>
> For authentication, use [Microsoft Entra ID](/entra/identity/authentication/overview-authentication) with 
> [managed identities](/entra/identity/managed-identities-azure-resources/overview) whenever possible. 
> This method provides optimal and superior security without having to provide credentials. Azure manages 
> this identity for you and helps keep authentication information secure so that you don't have to manage 
> this sensitive information. To set up a managed identity for Azure Logic Apps, see 
> [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity).
>
> If you need to use a different authentication type, use next highest level security option available. 
> For example, suppose that you have to use connection strings instead. A connection string 
> includes the authorization information required for your app to access a specific resource, service, 
> or system. The access key in the connection string is similar to a root password.
>
> In production environments, always protect your access keys. Make sure to secure your connection string 
> using Microsoft Entra ID, and use [Azure Key Vault](https://go.microsoft.com/fwlink/?linkid=2300117) 
> to securely store and rotate your keys. Avoid distributing access keys to other users, hardcoding them, 
> or saving them anywhere in plain text where others can access. Rotate your keys as soon as possible 
> if you think these keys might be compromised.
