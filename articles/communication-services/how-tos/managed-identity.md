title: Azure Communication Services support for Managed Identity 
description: Learn about using Managd Identity with Azure Comnmunication Services
author: harazi
manager: mharbut
services: azure-communication-services

ms.author: harazi
ms.date: 07/24/2023
ms.topic: how-to
ms.service: azure-communication-services
ms.custom: managed-identity
---
# Introduction
Azure Communication Services (ACS) is a fully-managed communication platform that enables developers to build real-time communication features into their applications. By using Managed Identity with Azure Communication Services, you can simplify the authentication process for your application, while also increasing its security. For more information on using Managed Identity with ACS, refer to theThis document covers how to use Managed Identity with Azure Communication Services.

# Using Managed Identity with ACS

ACS supports using Managed Identity to authenticate with the service. By leveraging Managed Identity, you can eliminate the need to manage your own access tokens and credentials.

To use Managed Identity with ACS, follow these steps:

1. Create a Managed Identity for your Azure resource. This can be done through the Azure portal or the Azure CLI.
//Azure Portal, CLI, Resource Manager


3. Grant the Managed Identity access to the Communication Services resource. This can be done through the Azure portal or the Azure CLI.
4. Use the Managed Identity to authenticate with ACS. This can be done through the Azure SDKs or REST APIs that support Managed Identity.


# Next Steps
Now that you have learned how to use Managed Identity with Azure Communication Services, consider implementing this feature in your own applications to simplify your authentication process and improve security. 

- [Managed Identities ](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/overview)
- [Manage user-assigned managed identities](https://learn.microsoft.com/en-us/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp)
