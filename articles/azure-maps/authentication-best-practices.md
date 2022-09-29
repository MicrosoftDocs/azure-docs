---
title: Authentication best practices in Azure Maps
titleSuffix: Microsoft Azure Maps
description: Learn tips & tricks to optimize the use of Authentication in your Azure Maps applications. 
author: stevemunk
ms.author: v-munksteve
ms.date: 05/11/2022
ms.topic: conceptual
ms.service: azure-maps
services: azure-maps
---

# Authentication best practices

The single most important part of your application is its security. No matter how good the user experience might be, if your application isn't secure a hacker can ruin it.

The following are some tips to keep your Azure Maps application secure. When using Azure, be sure to familiarize yourself with the security tools available to you. For more information, See the [introduction to Azure security](../security/fundamentals/overview.md).

## Understanding security threats

If a hacker gains access to your Azure Maps account, they can potentially use it to make an unlimited number of unauthorized requests, which could result in decreased performance due to QPS limits and significant billable transactions to your account.

When considering best practices for securing your Azure Maps applications, you'll need to understand the different authentication options available.





## Authentication best practices in Azure Maps

When creating a publicly facing client application with Azure Maps using any of the available SDKs whether it be Android, iOS or the Web SDK, you must ensure that your authentication secrets aren't publicly accessible.

Subscription key-based authentication (Shared Key) can be used in either client side applications or web services, however it is the least secure approach to securing your application or web service. This is because the key grants access to all Azure Maps REST API that are available in the SKU (Pricing Tier) selected when creating the Azure Maps account and the key can be easily obtained from an HTTP request. If you do use subscription keys, be sure to [rotate them regularly](how-to-manage-authentication.md#manage-and-rotate-shared-keys) and keep in mind that Shared Key doesn't allow for configurable lifetime, it must be done manually. You should also consider using [Shared Key authentication with Azure Key Vault](how-to-secure-daemon-app.md#scenario-shared-key-authentication-with-azure-key-vault), which enables you to securely store your secret in Azure.

If using [Azure Active Directory (Azure AD) authentication](../active-directory/fundamentals/active-directory-whatis.md) or [Shared Access Signature (SAS) Token authentication](azure-maps-authentication.md#shared-access-signature-token-authentication) (preview), access to Azure Maps REST APIs is authorized using [role-based access control (RBAC)](azure-maps-authentication.md#authorization-with-role-based-access-control). RBAC enables you to control what access is given to the issued tokens. You should consider how long access should be granted for the tokens. Unlike Shared Key authentication, the lifetime of these tokens is configurable.

> [!TIP]
>
> For more information on configuring token lifetimes see:
> - [Configurable token lifetimes in the Microsoft identity platform (preview)](../active-directory/develop/active-directory-configurable-token-lifetimes.md)
> - [Create SAS tokens](azure-maps-authentication.md#create-sas-tokens)

### Public client and confidential client applications

There are different security concerns between public and confidential client applications. See [Public client and confidential client applications](../active-directory/develop/msal-client-applications.md) in the Microsoft identity platform documentation for more information about what is considered a *public* versus *confidential* client application.

### Public client applications

For apps that run on devices or desktop computers or in a web browser, you should consider defining which domains have access to your Azure Map account using [Cross origin resource sharing (CORS)](azure-maps-authentication.md#cross-origin-resource-sharing-cors). CORS instructs the clients' browser on which origins such as "https://microsoft.com" are allowed to request resources for the Azure Map account.

> [!NOTE]
> If you're developing a web server or service, your Azure Maps account does not need to be configured with CORS. If you have JavaScript code in the client side web application, CORS does apply.

### Confidential client applications

For apps that run on servers (such as web services and service/daemon apps), if you prefer to avoid the overhead and complexity of managing secrets, consider [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md). Managed identities can provide an identity for your web service to use when connecting to Azure Maps using Azure Active Directory (Azure AD) authentication. In this case, your web service will use that identity to obtain the required Azure AD tokens. You should use Azure RBAC to configure what access the web service is given, using the [Least privileged roles](../active-directory/roles/delegate-by-task.md) possible.

## Next steps

> [!div class="nextstepaction"]
> [Authentication with Azure Maps](azure-maps-authentication.md)

> [!div class="nextstepaction"]
> [Manage authentication in Azure Maps](how-to-manage-authentication.md)

> [!div class="nextstepaction"]
> [Tutorial: Add app authentication to your web app running on Azure App Service](../app-service/scenario-secure-app-authentication-app-service.md)