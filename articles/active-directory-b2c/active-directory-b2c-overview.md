---
title: What is Azure Active Directory B2C? | Microsoft Docs
description: Learn about how you create and manage identity experiences, such as sign-up sign-in, and profile management in your application using Azure Active Directory B2C.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 02/20/2019
ms.author: marsma
ms.subservice: B2C
---

# What is Azure Active Directory B2C?

Azure Active Directory (Azure AD) B2C is a business-to-consumer identity management service. This service enables you to customize and control how users securely interact with your web, desktop, mobile, or single-page applications. Using Azure AD B2C, users can sign up, sign in, reset passwords, and edit profiles. Azure AD B2C implements a form of the OpenID Connect and OAuth 2.0 protocols. The important key in the implementation of these protocols is the security tokens and their claims that enable you to provide secure access to resources.

A *user journey* is a request that specifies a policy, which controls the behavior of how the user and your application interact with Azure AD B2C. Two paths are available to you for defining user journeys in Azure AD B2C. 

If you're an application developer with or without identity expertise, you might choose to define common identity user flows using the Azure portal. If you are an identity professional, systems integrator, consultant, or on an in-house identity team, are comfortable with OpenID Connect flows, and understand identity providers and claims-based authentication, you might choose XML-based custom policies.

Before you start defining a user journey, you need to create an Azure AD B2C tenant and register your application and API in the tenant. After you’ve completed these tasks, you can get started defining a user journey with either user flows or custom policies. You can also optionally, add or change identity providers, or customize the way the user experiences the journey.

## Protocols and tokens

Azure AD B2C supports the [OpenID Connect and OAuth 2.0 protocols](active-directory-b2c-reference-protocols.md) for user journeys. In the Azure AD B2C implementation of OpenID Connect, your application starts the user journey by issuing authentication requests to Azure AD B2C. 

The result of a request to Azure AD B2C is a security token, such as an [ID token or access token](active-directory-b2c-reference-tokens.md). This security token defines the user's identity. Tokens are received from Azure AD B2C endpoints, such as a `/token` or `/authorize` endpoint. From these tokens, you can access claims that can be used to validate an identity and allow access to secure resources.

## Tenants and applications

In Azure AD B2C, a *tenant* represents your organization and is a directory of users. Each Azure AD B2C tenant is distinct and separate from other Azure AD B2C tenants. You may already have an Azure Active Directory tenant, the Azure AD B2C tenant is a different tenant. A tenant contains information about the users that have signed up to use your application. For example, passwords, profile data, and permissions. For more information, see [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md).

Before you configure your application to use Azure AD B2C, you first need to register it in the tenant using the Azure portal. The registration process collects and assigns values to your application. These values include an application ID that uniquely identifies the application and a redirect URI that's used to direct responses back to the application.

The interaction of every application follows a similar high-level pattern:

1. The application directs the user to run a policy.
2. The user completes the policy according to the policy definition.
3. The application receives a token.
4. The application uses the token to try to access a resource.
5. The resource server validates the token to verify that access can be granted.
6. The application periodically refreshes the token.

To register a web application, complete the steps in [Tutorial: Register an application to enable sign-up and sign-in using Azure AD B2C](tutorial-register-applications.md). You can also [add a web API application to your Azure Active Directory B2C tenant](add-web-application.md) or [add a native client application to your Azure Active Directory B2C tenant](add-native-application.md).

## User journeys

The policy in a user journey can be defined as a [user flow](active-directory-b2c-reference-policies.md) or a [custom policy](active-directory-b2c-overview-custom.md). Predefined user flows for the most common identity tasks, such as sign-up, sign-in, and profile editing, are available in the Azure portal.

User journeys allow you to control behaviors by configuring the following settings:

- Social accounts that the user uses to sign up for the application
- Data collected from the user such as first name or postal code
- Multi-factor authentication
- Look and feel of pages
- Information returned to the application

Custom policies are configuration files that define the behavior of the [Identity Experience Framework](trustframeworkpolicy.md) in your Azure AD B2C tenant. The Identity Experience Framework is the underlying platform that establishes multi-party trust and completes the steps in a user journey. 

Custom policies can be changed to complete many tasks. A custom policy is one or several XML-formatted files that refer to each other in a hierarchical chain. A [starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack/archive/master.zip) is available for custom policies to enable common identity tasks. 

Custom policies or user flows of different types are used in your Azure AD B2C tenant as needed and can be reused across applications. This flexibility enables you to define and modify user identity experiences with minimal or no changes to your code. Policies are used by adding a special query parameter to HTTP authentication requests. To create your own custom policy, see [Get started with custom policies in Azure Active Directory B2C](active-directory-b2c-get-started-custom.md).

## Identity providers 

In your applications, you may want to enable users to sign in with different identity providers. An *identity provider* creates, maintains, and manages identity information while providing authentication services to applications. You can add identity providers that are supported by Azure AD B2C using the Azure portal. 

You typically use only one identity provider in your application, but you have the option to add more. To configure an identity provider in your Azure AD B2C tenant, you first create an application on the identity provider developer site, and then you record the application identifier or client identifier and the password or client secret from the identity provider application that you create. This identifier and password are then used to configure your application. 

The following articles describe the steps to add some of the common identity providers to user flows:

- [Amazon](active-directory-b2c-setup-amzn-app.md)
- [Facebook](active-directory-b2c-setup-fb-app.md)
- [Microsoft account](active-directory-b2c-setup-msa-app.md)

The following articles describe the steps to add some of the common identity providers to custom policies:
- [Amazon](setup-amazon-custom.md)
- [Google](active-directory-b2c-custom-setup-goog-idp.md)
- [Microsoft account](active-directory-b2c-custom-setup-msa-idp.md)

For more information, see [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](tutorial-add-identity-providers.md).


## Page customization

Most of the HTML and CSS content that's presented to customers in a user journey is controllable. By using page customization, you can customize the look and feel of any custom policy or user flow. You maintain brand and visual consistency between your application and Azure AD B2C by using this customization feature. 

Azure AD B2C runs code in the user's browser and uses a modern approach called Cross-Origin Resource Sharing (CORS). First, you specify a URL in a policy with customized HTML content. Azure AD B2C merges user interface elements with the HTML content that's loaded from your URL and then displays the page to the user.

You send parameters to Azure AD B2C in a query string. By passing the parameter to your HTML endpoint, the page content is dynamically changed. For example, you change the background image on the sign-up or sign-in page based on a parameter that you pass from your web or mobile application.

To customize pages in a user flow, see [Tutorial: Customize the interface of user experiences in Azure Active Directory B2C](tutorial-customize-ui.md). To customize pages in a custom policy, see [Customize the user interface of your application using a custom policy in Azure Active Directory B2C](active-directory-b2c-ui-customization-custom.md) or [Configure the UI with dynamic content by using custom policies in Azure Active Directory B2C](active-directory-b2c-ui-customization-custom-dynamic.md).

## Developer resources

### Client applications

You have the choice of applications for [iOS](active-directory-b2c-devquickstarts-ios.md), [Android](active-directory-b2c-devquickstarts-android.md), and .NET, among others. Azure AD B2C enables these actions while protecting your user identities at the same time.

If you're an ASP.NET web application developer, set up your application to authenticate accounts using the steps in [Tutorial: Enable a web application to authenticate with accounts using Azure AD B2C](active-directory-b2c-tutorials-web-app.md).

If you're a desktop application developer, set up your application to authenticate accounts using the steps in [Tutorial: Enable a desktop application to authenticate with accounts using Azure AD B2C](active-directory-b2c-tutorials-desktop-app.md).

If you're a single-page application developer using Node.js, set up your application to authenticate accounts using the steps in [Tutorial: Enable a single-page application to authenticate with accounts using Azure AD B2C](active-directory-b2c-tutorials-spa.md).

### APIs
If your client or web applications need to call APIs, you can set up secure access to those resources in Azure AD B2C.

If you're an ASP.NET web application developer, set up your application to call a protected API using the steps in [Tutorial: Grant access to an ASP.NET web API using Azure Active Directory B2C](active-directory-b2c-tutorials-web-api.md).

If you're a desktop application developer, set up your application to call a protected API using the steps in [Tutorial: Grant access to a Node.js web API from a desktop app using Azure Active Directory B2C](active-directory-b2c-tutorials-desktop-app-webapi.md).

If you are a single-page application developer using Node.js, set up your application to authenticate accounts using the steps in [Tutorial: Grant access to an ASP.NET Core web API from a single-page application using Azure Active Directory B2C](active-directory-b2c-tutorials-spa-webapi.md).

### JavaScript

You can add your own JavaScript client-side code to your applications in Azure AD B2C. To set up JavaScript in your application, you define a [page contract](page-contract.md) and enable [JavaScript](javascript-samples.md) in your user flows or custom policies.

### User accounts

Many common tenant management tasks need to be performed programmatically. A primary example is user management. You might need to migrate an existing user store to an Azure AD B2C tenant. You may want to host user registration on your own page and create user accounts in your Azure AD B2C directory behind the scenes. These types of tasks require the ability to create, read, update, and delete user accounts. You can do these tasks by using the [Azure AD Graph API](active-directory-b2c-devquickstarts-graph-dotnet.md).

## Next steps

Start configuring your application for the sign-up and sign-in experience by continuing to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md)
