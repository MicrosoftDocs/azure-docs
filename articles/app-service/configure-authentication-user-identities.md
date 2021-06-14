---
title: User identities in AuthN/AuthZ
description: Learn how to access user identities when using the built-in authentication and authorization in App Service.
ms.topic: article
ms.date: 03/29/2021
---

# Work with user identities in Azure App Service authentication

This article shows you how to work with user identities when using the the built-in [authentication and authorization in App Service](overview-authentication-authorization.md). 

## Access user claims in app code

App Service passes user claims to your application by using special headers. External requests aren't allowed to set these headers, so they are present only if set by App Service. Some example headers include:

* X-MS-CLIENT-PRINCIPAL-NAME
* X-MS-CLIENT-PRINCIPAL-ID

Code that is written in any language or framework can get the information that it needs from these headers. For ASP.NET 4.6 apps, the **ClaimsPrincipal** is automatically set with the appropriate values. ASP.NET Core, however, doesn't provide an authentication middleware that integrates with App Service user claims. For a workaround, see [MaximeRouiller.Azure.AppService.EasyAuth](https://github.com/MaximRouiller/MaximeRouiller.Azure.AppService.EasyAuth).

## Access user claims using the API

If the [token store](overview-authentication-authorization.md#token-store) is enabled for your app, you can also obtain additional details on the authenticated user by calling `/.auth/me`. The Mobile Apps server SDKs provide helper methods to work with this data. For more information, see [How to use the Azure Mobile Apps Node.js SDK](/previous-versions/azure/app-service-mobile/app-service-mobile-node-backend-how-to-use-server-sdk#howto-tables-getidentity), and [Work with the .NET backend server SDK for Azure Mobile Apps](/previous-versions/azure/app-service-mobile/app-service-mobile-dotnet-backend-how-to-use-server-sdk#user-info).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Authenticate and authorize users end-to-end](tutorial-auth-aad.md)
