---
title: What is Azure Active Directory B2C? | Microsoft Docs
description: Learn about how you create and manage your application sign-in experience using Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 11/30/2018
ms.author: davidmu
ms.component: B2C
---

# What is Azure Active Directory B2C?

Azure Active Directory (Azure AD) B2C is an identity management service that enables you to customize and control how customers interact with your application. This interaction includes sign up, sign in, and managing their profiles when customers use your applications. You have the choice of applications for iOS, Android, and .NET, among others. Azure AD B2C enables these actions while protecting your customer identities at the same time.

You configure an application registered with Azure AD B2C to take care of many identity management tasks. Some examples are:

- Enable a customer to sign up to use your registered application
- Enable a signed-up customer to sign in and start using your application
- Enable a signed-up customer to edit their profile
- Enable multi-factor authentication in your application
- Enable the customer to sign up and sign in with specific identity providers
- Grant access from your application to APIs that you build
- Customize the look and feel of the sign-up and sign-in experience
- Manage single sign-on sessions for your application

## What do I need to think about before using Azure AD B2C?

- How do I want the customer to interact with my application?
- What is the user interface (UI) experience that I want to provide to customers?
- Which identity providers do I want to let customers choose from in my application?
- Does my sign-in process require additional APIs to run?

### Customer interaction

Azure AD B2C supports [OpenID Connect](https://openid.net/connect/) for all customer experiences. In the Azure AD B2C implementation of OpenID Connect, your application starts the user journey by issuing authentication requests to Azure AD B2C. The result of the request is an `id_token`. This security token defines the customer's identity.

Every application that uses Azure AD B2C must be registered in an Azure AD B2C tenant using the Azure portal. The registration process collects and assigns values to your application. These values include an application ID that uniquely identifies the application. A redirect URI is defined that's used to direct responses back to the application.

The interaction of every application follows a similar high-level pattern:

1. The application directs the customer to run a policy.
2. The customer completes the policy according to the policy definition.
3. The application receives a security token.
4. The application uses the security token to try to access a protected resource.
5. The resource server validates the security token to verify that access can be granted.
6. The application periodically refreshes the security token.

These steps differ slightly based on the type of application you're building.

Azure AD B2C interacts with identity providers, customers, other systems, and with the local directory in sequence to complete an identity task. For example, sign in a customer, register a new customer, or reset a password. The underlying platform that establishes multi-party trust and completes these steps is called the Identity Experience Framework. This framework and a policy (also called a user journey or a Trust Framework policy) explicitly defines the actors, the actions, the protocols, and the sequence of steps to complete.

Azure AD B2C protects from denial-of-service and password attacks against your applications. Azure AD B2C uses detection and mitigation techniques like SYN cookies and rate and connection limits to protect resources against denial-of-service attacks. Mitigation is also included for brute-force password attacks and dictionary password attacks.

#### User flows

Each request that is sent to Azure AD B2C specifies a user flow, which is a policy that controls the behavior of how your application interacts with Azure AD B2C. Predefined user flows for the most common identity tasks, such as sign-up, sign-in, and profile editing, are available in the Azure AD B2C portal.  For instance, a sign-up user flow allows you to control behaviors by configuring the following settings:

- Social accounts that the customer uses to sign up for the application
- Data collected from the customer such as first name or postal code
- Multi-factor authentication
- Look and feel of all sign-up pages
- Information returned to the application

#### Custom policies 

[Custom policies](active-directory-b2c-overview-custom.md) are configuration files that define the behavior of the [Identity Experience Framework](trustframeworkpolicy.md) in your Azure AD B2C tenant. Custom policies can be changed to complete many tasks. A custom policy is one or several XML-formatted files that refer to each other in a hierarchical chain. 

Custom policies of different types are used in your Azure AD B2C tenant as needed and can be reused across applications. This flexibility enables you to define and modify customer identity experiences with minimal or no changes to your code. Policies are used by adding a special query parameter to HTTP authentication requests.

Custom policies are used to control user journeys in these ways:

- Defining interaction with APIs to capture additional information, verify customer provided claims, or trigger external processes.
- Changing behavior based on claims from APIs or from claims in the directory such as *migrationStatus*.
- Any workflow not covered by built-in policies. For example, gathering more information from a customer during a sign-in experience and performing an authorization check to access a resource.

### Identity providers

An identity provider is a service that authenticates customer identities and issues security tokens. In Azure AD B2C, you configure a number of identity providers in your tenant, such as a [Microsoft account](active-directory-b2c-setup-msa-app.md), [Facebook](active-directory-b2c-setup-fb-app.md), or [Amazon](active-directory-b2c-setup-amzn-app.md) among others. 

To configure an identity provider in your Azure AD B2C tenant, you must record the application identifier or client identifier and the password or client secret from the identity provider application that you create. This identifier and password are then used to configure your application.

### User Interface experience

Most of the HTML and CSS content that's presented to customers is controllable. By using the page UI customization feature, you customize the look and feel of any policy. You maintain brand and visual consistency between your application and Azure AD B2C by using this customization feature.

Azure AD B2C runs code in the customer's browser and uses a modern approach called Cross-Origin Resource Sharing (CORS). First, you specify a URL in a policy with customized HTML content. Azure AD B2C merges UI elements with the HTML content that's loaded from your URL and then displays the page to the customer.

You send parameters to Azure AD B2C in a query string. By passing the parameter to your HTML endpoint, the page content is dynamically changed. For example, you change the background image on the Azure AD B2C sign-up or sign-in page based on a parameter that you pass from your web or mobile application.

## How do I get started with Azure AD B2C?

In Azure AD B2C, a tenant represents your organization and is a directory of users. Each Azure AD B2C tenant is distinct and separate from other Azure AD B2C tenants. A tenant contains information about the customers that have signed up to use your application. For example, passwords, profile data, and permissions.

Link your Azure AD B2C tenant to your Azure subscription to enable all of the functionality and pay for usage charges. To allow your customers to sign in to your application, register it in an Azure AD B2C tenant.

Before you configure your application to use Azure AD B2C, you first need to create an Azure AD B2C tenant and register your application. To register your application, complete the steps in [Tutorial: Register an application to enable sign-up and sign-in using Azure AD B2C](tutorial-register-applications.md).
  
If you are an ASP.NET web application developer, set up your application to authenticate accounts using the steps in [Tutorial: Enable a web application to authenticate with accounts using Azure AD B2C](active-directory-b2c-tutorials-web-app.md).

If your are a desktop application developer, set up your application to authenticate accounts using the steps in [Tutorial: Enable a desktop application to authenticate with accounts using Azure AD B2C](active-directory-b2c-tutorials-desktop-app.md).

If you are a single-page application developer using Node.js, set up your application to authenticate accounts using the steps in [Tutorial: Enable a single-page application to authenticate with accounts using Azure AD B2C](active-directory-b2c-tutorials-spa.md).

## Next steps

Start configuring your application for the sign-up and sign-in experience by continuing to the tutorial.

> [!div class="nextstepaction"]
> [Tutorial: Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md)
