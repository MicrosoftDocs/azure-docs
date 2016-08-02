<properties
   pageTitle="Identity Management for Multitenant Applications | Microsoft Azure"
   description="Best practices for authentication, authorization, and identity management in multitenant apps."
   services=""
   documentationCenter="na"
   authors="MikeWasson"
   manager="roshar"
   editor=""
   tags=""/>

<tags
   ms.service="guidance"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/02/2016"
   ms.author="mwasson"/>

# Identity management for multitenant applications in Microsoft Azure

[AZURE.INCLUDE [pnp-header](../../includes/guidance-pnp-header-include.md)]

This series describes best practices for multitenancy, when using Azure AD for authentication and identity management.

When you're building a multitenant application, one of the first challenges is managing user identities, because now every user belongs to a tenant. For example:

- Users sign in with their organizational credentials.
- Users should have access to their organization's data, but not data that belongs to other tenants.
- An organization can sign up for the application, and then assign application roles to its members.

Azure Active Directory (Azure AD) has some great features that support all of these scenarios.

To accompany this series of articles, we also created a complete, [end-to-end implementation][tailspin] of a multitenant app. The articles reflect what we learned in the process of building the application. To get started with the application, see [Running the Surveys application](https://github.com/Azure-Samples/guidance-identity-management-for-multitenant-apps/blob/master/docs/running-the-app.md).

Here is the list of articles in this series:

- [Introduction to identity management for multitenant applications](guidance-multitenant-identity-intro.md)
- [About the Tailspin Surveys application](guidance-multitenant-identity-tailspin.md)
- [Authentication using Azure AD and OpenID Connect](guidance-multitenant-identity-authenticate.md)
- [Working with claim-based identities](guidance-multitenant-identity-claims.md)
- [Sign-up and tenant onboarding](guidance-multitenant-identity-signup.md)
- [Application roles](guidance-multitenant-identity-app-roles.md)
- [Role-based and resource-based authorization](guidance-multitenant-identity-authorize.md)
- [Securing a backend web API](guidance-multitenant-identity-web-api.md)
- [Caching OAuth2 access tokens](guidance-multitenant-identity-token-cache.md)
- [Federating with a customer's AD FS for multitenant apps in Azure](guidance-multitenant-identity-adfs.md)
- [Using client assertion to get access tokens from Azure AD](guidance-multitenant-identity-client-assertion.md)
- [Using Key Vault to protect application secrets](guidance-multitenant-identity-keyvault.md)

[tailspin]: https://github.com/Azure-Samples/guidance-identity-management-for-multitenant-apps
