---
title: User identities in AuthN/AuthZ
description: Learn how to access user identities when using the built-in authentication and authorization in App Service.
ms.topic: article
ms.date: 03/29/2021
---

# Work with user identities in Azure App Service authentication

This article shows you how to work with user identities when using the the built-in [authentication and authorization in App Service](overview-authentication-authorization.md). 

## Access user claims in app code

For all language frameworks, App Service makes the claims in the incoming token (whether from an authenticated end user or a client application) available to your code by injecting them into the request headers. External requests aren't allowed to set these headers, so they are present only if set by App Service. Some example headers include:

* X-MS-CLIENT-PRINCIPAL-NAME
* X-MS-CLIENT-PRINCIPAL-ID

Code that is written in any language or framework can get the information that it needs from these headers. 

> [!NOTE]
> Different language frameworks may present these headers to the app code in different formats, such as lowercase or title case.

For ASP.NET 4.6 apps, App Service populates [ClaimsPrincipal.Current](/dotnet/api/system.security.claims.claimsprincipal.current) with the authenticated user's claims, so you can follow the standard .NET code pattern, including the `[Authorize]` attribute. Similarly, for PHP apps, App Service populates the `_SERVER['REMOTE_USER']` variable. For Java apps, the claims are [accessible from the Tomcat servlet](configure-language-java.md#authenticate-users-easy-auth).

For [Azure Functions](../azure-functions/functions-overview.md), `ClaimsPrincipal.Current` is not populated for .NET code, but you can still find the user claims in the request headers, or get the `ClaimsPrincipal` object from the request context or even through a binding parameter. See [working with client identities in Azure Functions](../azure-functions/functions-bindings-http-webhook-trigger.md#working-with-client-identities) for more information.

For .NET Core, [Microsoft.Identity.Web](https://www.nuget.org/packages/Microsoft.Identity.Web/) supports populating the current user with App Service authentication. To learn more, you can read about it on the [Microsoft.Identity.Web wiki](https://github.com/AzureAD/microsoft-identity-web/wiki/1.2.0#integration-with-azure-app-services-authentication-of-web-apps-running-with-microsoftidentityweb), or see it demonstrated in [this tutorial for a web app accessing Microsoft Graph](./scenario-secure-app-access-microsoft-graph-as-user.md?tabs=command-line#install-client-library-packages).

## Access user claims using the API

If the [token store](overview-authentication-authorization.md#token-store) is enabled for your app, you can also obtain additional details on the authenticated user by calling `/.auth/me`. The Mobile Apps server SDKs provide helper methods to work with this data. For more information, see [How to use the Azure Mobile Apps Node.js SDK](/previous-versions/azure/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk#howto-tables-getidentity), and [Work with the .NET backend server SDK for Azure Mobile Apps](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk#user-info).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)