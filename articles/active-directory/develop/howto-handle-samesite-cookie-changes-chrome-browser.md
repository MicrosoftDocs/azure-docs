---
title: How to handle SameSite cookie changes in Chrome browser | Azure
titleSuffix: Microsoft identity platform
description: Learn how to handle SameSite cookie changes in Chrome browser.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 01/27/2020
ms.author: jmprieur
ms.reviewer: kkrishna
ms.custom: aaddev
---
# Handle SameSite cookie changes in Chrome browser

## What is SameSite?

`SameSite` is a property that can be set in HTTP cookies to prevent Cross Site Request Forgery(CSRF) attacks in web applications:

- When `SameSite` is set to **Lax**, the cookie is sent in requests within the same site and in GET requests from other sites. It isn't sent in GET requests that are cross-domain.
- A value of **Strict** ensures that the cookie is sent in requests only within the same site.

By default, the `SameSite` value is NOT set in browsers and that's why there are no restrictions on cookies being sent in requests. An application would need to opt-in to the CSRF protection by setting **Lax** or **Strict** per their requirements.

## SameSite changes and impact on authentication

Recent [updates to the standards on SameSite](https://tools.ietf.org/html/draft-west-cookie-incrementalism-00) propose protecting apps by making the default behavior of `SameSite` when no value is set to Lax. This mitigation means cookies will be restricted on HTTP requests except GET made from other sites. Additionally, a value of **None** is introduced to remove restrictions on cookies being sent. These updates will soon be released in an upcoming version of the Chrome browser.

When web apps authenticate with the Microsoft Identity platform using the response mode "form_post", the login server responds to the application using an HTTP POST to send the tokens or auth code. Because this request is a cross-domain request (from `login.microsoftonline.com` to your domain - for instance `https://contoso.com/auth`), cookies that were set by your app now fall under the new rules in Chrome. The cookies that need to be used in cross-site scenarios are cookies that hold the *state* and *nonce* values, that are also sent in the login request. There are other cookies dropped by Azure AD to hold the session.

If you don't update your web apps, this new behavior will result in authentication failures.

## Mitigation and samples

To overcome the authentication failures, web apps authenticating with the Microsoft identity platform can set the `SameSite` property to `None` for cookies that are used in cross-domain scenarios when running on the Chrome browser.
Other browsers (see [here](https://www.chromium.org/updates/same-site/incompatible-clients) for a complete list) follow the previous behavior of `SameSite` and won't include the cookies if `SameSite=None` is set.
That's why, to support authentication on multiple browsers web apps will have to set the `SameSite` value to `None` only on Chrome and leave the value empty on other browsers.

This approach is demonstrated in our code samples below.

# [.NET](#tab/dotnet)

The table below presents the pull requests that worked around the SameSite changes in our ASP.NET and ASP.NET Core samples.

| Sample | Pull request |
| ------ | ------------ |
|  [ASP.NET Core web app incremental tutorial](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2)  |  [Same site cookie fix #261](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/pull/261)  |
|  [ASP.NET MVC web app sample](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect)  |  [Same site cookie fix #35](https://github.com/Azure-Samples/ms-identity-aspnet-webapp-openidconnect/pull/35)  |
|  [active-directory-dotnet-admin-restricted-scopes-v2](https://github.com/azure-samples/active-directory-dotnet-admin-restricted-scopes-v2)  |  [Same site cookie fix #28](https://github.com/Azure-Samples/active-directory-dotnet-admin-restricted-scopes-v2/pull/28)  |

for details on how to handle SameSite cookies in ASP.NET and ASP.NET Core, see also:

- [Work with SameSite cookies in ASP.NET Core](https://docs.microsoft.com/aspnet/core/security/samesite) .
- [ASP.NET Blog on SameSite issue](https://devblogs.microsoft.com/aspnet/upcoming-samesite-cookie-changes-in-asp-net-and-asp-net-core/)

# [Python](#tab/python)

| Sample |
| ------ |
|  [ms-identity-python-webapp](https://github.com/Azure-Samples/ms-identity-python-webapp)  |

# [Java](#tab/java)

| Sample | Pull request |
| ------ | ------------ |
|  [ms-identity-java-webapp](https://github.com/Azure-Samples/ms-identity-java-webapp)  | [Same site cookie fix #24](https://github.com/Azure-Samples/ms-identity-java-webapp/pull/24)
|  [ms-identity-java-webapi](https://github.com/Azure-Samples/ms-identity-java-webapi)  | [Same site cookie fix #4](https://github.com/Azure-Samples/ms-identity-java-webapi/pull/4)

---

## Next steps

Learn more about SameSite and the Web app scenario:

> [!div class="nextstepaction"]
> [Google Chrome's FAQ on SameSite](https://www.chromium.org/updates/same-site/faq)

> [!div class="nextstepaction"]
> [Chromium SameSite page](https://www.chromium.org/updates/same-site)

> [!div class="nextstepaction"]
> [Scenario: Web app that signs in users](scenario-web-app-sign-user-overview.md)