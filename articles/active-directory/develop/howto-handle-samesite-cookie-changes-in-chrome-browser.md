---
title: How to handle SameSite cookie changes in Chrome browser | Azure
titleSuffix: Microsoft identity platform
description: Learn how to handle SameSite cookie changes in Chrome browser.
services: active-directory
documentationcenter: ''
author: nacanuma
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 01/24/2020
ms.author: kkrishna
ms.reviewer: kkrishna, jmprieur
ms.custom: aaddev
---
# Handle SameSite cookie changes in Chrome browser

## What is SameSite?

`SameSite` is a property that can be set in HTTP cookies to prevent Cross Site Request Forgery(CSRF) attacks in web applications.
When `SameSite` is set to **Lax**, the cookie is sent in requests within the same site and in GET requests from other sites. A value of **Strict** ensures that the cookie is sent in requests only within the same site. By default, the `SameSite` value is NOT set in browsers and that's why there are no restrictions on cookies being sent in requests. An application would need to opt-in to the CSRF protection by setting **Lax** or **Strict** per their requirements.

## SameSite changes and impact on authentication

Recent [updates to the standards on SameSite](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) propose protecting apps by making the default behavior of `SameSite` when no value is set to Lax. This mitigation means cookies will be restricted on HTTP requests except GET made from other sites. Additionally, a value of **None** is introduced to remove restrictions on cookies being sent. These updates will soon be released in an upcoming version of the Chrome browser.

When web apps authenticate with Azure AD using the OpenID Connect auth code flow, Azure AD makes an HTTP form_post request to send the auth code. This request also contains cookies with the authentication state. With the new updates to the default behavior of `SameSite` in the Chrome browser, cookies will be restricted. In you don't update your web apps, this behavior will result in authentication failures.

## Mitigation and samples

To overcome the authentication failures, web apps authenticating with Azure AD can set the `SameSite` property to `None` when running on the Chrome browser. Other browsers don't have these updates yet and are following the previous behavior of `SameSite`. That's why, to support authentication on multiple browsers web apps will have to set the `SameSite` value to `None` only on Chrome and leave the value empty on other browsers. Application developers are also advised to implement other CSRF protections when setting `SameSite` to `None` since the default CSRF protection offered by SameSite is disabled.
This approach is demonstrated in our code samples below:

# [.NET](#tab/dotnet)

The table below presents the pull requests that worked around the SameSite changes in our ASP.NET and ASP.NET Core samples.

| Sample | Pull request |
| ------ | ------------ |
|  [ASP.NET Core Web App incremental tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2)  |  [Same site cookie fix #261](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/pull/261)  |
|  [ASP.NET MVC Web App sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect)  |  [Same site cookie fix #35](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/pull/35)  |
|  [active-directory-dotnet-admin-restricted-scopes-v2](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2)  |  [Same site cookie fix #28](https://github.com/Azure-Samples/active-directory-dotnet-admin-restricted-scopes-v2/pull/28)  |

See also [Work with SameSite cookies in ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/security/samesite) for details on how to handle SameSite cookies in ASP.NET Core.

# [Python](#tab/python)

| Sample |
| ------ |
|  [ms-identity-python-webapp](https://github.com/Azure-Samples/ms-identity-python-webapp)  |

# [Java](#tab/java)

| Sample |
| ------ |
|  [ms-identity-java-webapp](https://github.com/Azure-Samples/ms-identity-java-webapp)  |

---

## References

[ASP.NET Blog on SameSite issue](https://devblogs.microsoft.com/aspnet/upcoming-samesite-cookie-changes-in-asp-net-and-asp-net-core/)