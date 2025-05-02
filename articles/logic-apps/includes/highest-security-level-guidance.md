---
ms.service: azure-logic-apps
author: ecfan
ms.author: estfan
ms.topic: include
ms.date: 04/01/2025
---

> [!WARNING]
>
> Always secure and protect sensitive and personal data, such as credentials, secrets, 
> access keys, connection strings, certificates, thumbprints, and similar information 
> with the highest available or supported level of security.
>
> For authentication and authorization, set up or use 
> [Microsoft Entra ID](/entra/identity/authentication/overview-authentication) with a 
> [managed identity](/entra/identity/managed-identities-azure-resources/overview). 
> This solution provides optimal and superior security without you having to manually 
> provide and manage credentials, secrets, access keys, and so on because Azure handles 
> the managed identity for you. To set up a managed identity for Azure Logic Apps, see 
> [Authenticate access and connections to Azure resources with managed identities in Azure Logic Apps](/azure/logic-apps/authenticate-with-managed-identity).
>
> If you can't use a managed identity, choose the next highest level security solution 
> available. For example, if you must use a connection string, which includes information 
> required to access a resource, service, or system, remember that this string includes 
> an access key that is similar to a root password.
>
> Make sure that you securely store such information by using Microsoft Entra ID and 
> [Azure Key Vault](/azure/key-vault/general/overview). Don't hardcode this information, 
> share with other users, or save in plain text anywhere that others can access. Set up 
> a plan to rotate or revoke secrets in the case they become compromised. For more 
> information, see the following resources:
>
> - [Automate secrets rotation in Azure Key Vault](/azure/key-vault/secrets/tutorial-rotation)
> - [Best practices for protecting secrets](/azure/security/fundamentals/secrets-best-practices)
> - [Secrets in Azure Key Vault](/azure/key-vault/secrets/)
