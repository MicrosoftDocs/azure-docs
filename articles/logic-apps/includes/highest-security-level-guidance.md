---
ms.service: azure-logic-apps
author: ecfan
ms.author: estfan
ms.topic: include
ms.date: 01/06/2025
---

> [!IMPORTANT]
>
> For optimal security, use [Microsoft Entra ID](/entra/identity/authentication/overview-authentication) 
> with [managed identities](/entra/identity/managed-identities-azure-resources/overview) for authentication 
> when possible. This method provides superior security without having to provide credentials. Azure manages 
> this identity and helps keep authentication information secure so that you don't have to manage this sensitive 
> information yourself. To set up a managed identity for Azure Logic Apps, see [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity).
>
> If you have to use a different authentication type, use the next highest level security option available. 
> For example, suppose that you have to create a connection by using a connection string instead. A connection 
> string includes the authorization information required for your app to access a specific resource, service, 
> or system. The access key in the connection string is similar to a root password.
>
> In production environments, always protect sensitive information and secrets, such as credentials, certificates, 
> thumbprints, access keys, and connection strings. Make sure that you securely store such information by using 
> Microsoft Entra ID and [Azure Key Vault](https://go.microsoft.com/fwlink/?linkid=2300117). Avoid hardcoding 
> this information, sharing with other users, or saving in plain text anywhere that others can access. Rotate your 
> secrets as soon as possible if you think this information might be compromised. For more information, see 
> [About Azure Key Vault](/azure/key-vault/general/overview).
