---
title: Authentication best practices in Azure Maps
titleSuffix: Microsoft Azure Maps
description: Learn tips & tricks to optimize the use of Authentication in your Azure Maps applications. 
author: pbrasil
ms.author: peterbr 
ms.date: 05/11/2022
ms.topic: best-practice
ms.service: azure-maps
ms.subservice: authentication
---

# Authentication best practices

The security of your application is crucial. Regardless of how excellent the user experience is, an insecure application can be compromised by hackers, undermining its integrity and deteriorating user trust.

This article contains tips to ensure the security of your Azure Maps application. When using Azure, it's important to familiarize yourself with the available security tools. For more information, See [Introduction to Azure security] in the Azure security documentation.

## Understanding security threats

If hackers gain access to your account, they could potentially execute unlimited billable transactions, leading to unexpected costs and reduced performance due to QPS limits.

To implement best practices for securing your Azure Maps applications, it's essential to understand the various authentication options available.

## Authentication best practices in Azure Maps

When developing publicly facing client applications with Azure Maps, it's crucial to ensure that your authentication secrets remain private and aren't publicly accessible.

Subscription key-based authentication (Shared Key) can be used in client-side applications or web services, but it's the least secure method for protecting your application or web service. This is because the key can be easily extracted from an HTTP request, granting access to all Azure Maps REST APIs available in the SKU (Pricing Tier). If you use subscription keys, make sure to [rotate them regularly] and remember that Shared Key doesn't support configurable lifetimes, so rotation must be done manually. Consider using [Shared Key authentication with Azure Key Vault] to securely store your secret in Azure.

When using [Microsoft Entra authentication] or [Shared Access Signature (SAS) Token authentication], access to Azure Maps REST APIs is authorized using [role-based access control (RBAC)]. RBAC enables you to specify the level of access granted to the issued tokens. It's important to consider the duration for which access should be granted. Unlike Shared Key authentication, the lifetime of these tokens is configurable.

> [!TIP]
>
> For more information on configuring token lifetimes, see:
>
> - [Configurable token lifetimes in the Microsoft identity platform (preview)]
> - [Create SAS tokens]

### Public client and confidential client applications

There are different security concerns between public and confidential client applications. For more information about what is considered a *public* versus *confidential* client application, see [Public client and confidential client applications] in the Microsoft identity platform documentation.

### Public client applications

For applications running on devices, desktop computers, or web browsers, it's advisable to define which domains can access your Azure Maps account using [Cross origin resource sharing (CORS)]. CORS informs the client's browser which origins, such as "https://microsoft.com," are permitted to request resources for the Azure Maps account.

> [!NOTE]
> If you're developing a web server or service, configuring your Azure Maps account with CORS is unnecessary. However, if your client-side web application includes JavaScript code, CORS does apply.

### Confidential client applications

For server-based applications, such as web services and service/daemon apps, consider using [Managed Identities] to avoid the complexity of managing secrets. Managed identities can provide an identity for your web service to connect to Azure Maps using [Microsoft Entra authentication]. Your web service can then use this identity to obtain the necessary Microsoft Entra tokens. It's recommended to use Azure RBAC to configure the access granted to the web service, applying the [Least privileged roles] possible.

## Next steps

> [!div class="nextstepaction"]
> [Authentication with Azure Maps]

> [!div class="nextstepaction"]
> [Manage authentication in Azure Maps]

> [!div class="nextstepaction"]
> [Tutorial: Add app authentication to your web app running on Azure App Service]

[Authentication with Azure Maps]: azure-maps-authentication.md
[Microsoft Entra authentication]: ../active-directory/fundamentals/active-directory-whatis.md
[Configurable token lifetimes in the Microsoft identity platform (preview)]: ../active-directory/develop/configurable-token-lifetimes.md
[Create SAS tokens]: azure-maps-authentication.md#create-sas-tokens
[Cross origin resource sharing (CORS)]: azure-maps-authentication.md#cross-origin-resource-sharing-cors
[Introduction to Azure security]: ../security/fundamentals/overview.md
[Least privileged roles]: ../active-directory/roles/delegate-by-task.md
[Manage authentication in Azure Maps]: how-to-manage-authentication.md
[Managed Identities]: ../active-directory/managed-identities-azure-resources/overview.md
[Public client and confidential client applications]: ../active-directory/develop/msal-client-applications.md
[role-based access control (RBAC)]: azure-maps-authentication.md#authorization-with-role-based-access-control
[rotate them regularly]: how-to-manage-authentication.md#manage-and-rotate-shared-keys
[Shared Access Signature (SAS) Token authentication]: azure-maps-authentication.md#shared-access-signature-token-authentication
[Shared Key authentication with Azure Key Vault]: how-to-secure-daemon-app.md#scenario-shared-key-authentication-with-azure-key-vault
[Tutorial: Add app authentication to your web app running on Azure App Service]: ../app-service/scenario-secure-app-authentication-app-service.md
