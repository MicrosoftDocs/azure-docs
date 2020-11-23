---
title: Build the landing page for your transactable SaaS offer in the commercial marketplace
description: Learn how to build a landing page for your transactable SaaS offer.
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 09/02/2020
---

# Build the landing page for your transactable SaaS offer in the commercial marketplace

This article guides you through the process of building a landing page for a transactable SaaS app that will be sold on the Microsoft commercial marketplace.

## Overview

You can think of the landing page as the "lobby" for your software as a service (SaaS) offer. After the buyer subscribes to an offer, the commercial marketplace directs them to the landing page to activate and configure their subscription to your SaaS application. Think of this as an order confirmation step that lets the buyer see what they've purchased and confirm their account details. Using Azure Active Directory (Azure AD) and Microsoft Graph, you will enable single sign-on (SSO) for the buyer and get important details about the buyer that you can use to confirm and activate their subscription, including their name, email address, and organization.

Because the information needed to activate the subscription is limited and provided by Azure AD and Microsoft Graph, there should be no need to request information that requires more than basic consent. If you need user details that require additional consent for your application, you should request this information after subscription activation is complete. This enables frictionless subscription activation for the buyer and decreases the risk of abandonment.

The landing page typically includes the following:

- Present the name of the offer and plan purchased, as well as the billing terms.
- Present the buyer's account details, including first and last name, organization, and email.
- Prompt the buyer to confirm or substitute different account details.
- Guide the buyer on next steps after activation. For example, receive a welcome email, manage the subscription, get support, or read documentation.

> [!NOTE]
> The buyer will also be directed to the landing page when managing their subscription after activation. After the buyer's subscription has been activated, you must use SSO to enable the user to sign in. It is recommended to direct the user to an account profile or configuration page.

The following sections will guide you through the process of building a landing page:

1. [Create an Azure AD app registration](#create-an-azure-ad-app-registration) for the landing page.
1. [Use a code sample as a starting point](#use-a-code-sample-as-a-starting-point) for your app.
1. [Use two Azure AD apps to improve security in production](#use-two-azure-ad-apps-to-improve-security-in-production).
1. [Resolve the marketplace purchase identification token](#resolve-the-marketplace-purchase-identification-token) added to the URL by the commercial marketplace.
1. [Read information from claims encoded in the ID token](#read-information-from-claims-encoded-in-the-id-token), which was received from Azure AD after sign in, that was sent with the request.
1. [Use the Microsoft Graph API](#use-the-microsoft-graph-api) to gather additional information, as required.

## Create an Azure AD app registration

The commercial marketplace is fully integrated with Azure AD. Buyers arrive at the marketplace authenticated with an [Azure AD account or Microsoft account (MSA)](../active-directory/fundamentals/active-directory-whatis.md#terminology). After purchase, the buyer goes from the commercial marketplace to your landing page URL to activate and manage their subscription of your SaaS application. You must let the buyer sign in to your application with Azure AD SSO. (The landing page URL is specified in the offer's [Technical configuration](plan-saas-offer.md#technical-information) page.

The first step to using the identity is to make sure your landing page is registered as an Azure AD application. Registering the application lets you use Azure AD to authenticate users and request access to user resources. It can be considered the application's definition, which lets the service know how to issue tokens to the app based on the app's settings.

### Register a new application using the Azure portal

To get started, follow the instructions for [registering a new application](../active-directory/develop/quickstart-register-app.md). To let users from other companies visit the app, you must choose one of the multitenant options when asked who can use the application.

If you intend to query the Microsoft Graph API, [configure your new application to access web APIs](../active-directory/develop/quickstart-configure-app-access-web-apis.md). When you select the API permissions for this application, the default of **User.Read** is enough to gather basic information about the buyer to make the onboarding process smooth and automatic. Do not request any API permissions labeled **needs admin consent**, as this will block all non-administrator users from visiting your landing page.

If you require elevated permissions as part of your onboarding or provisioning process, consider using the [incremental consent](../active-directory/azuread-dev/azure-ad-endpoint-comparison.md) functionality of Azure AD so that all buyers sent from the marketplace are able to interact initially with the landing page.

## Use a code sample as a starting point

We've provided several sample apps that implement a simple website with Azure AD login enabled. After your application is registered in Azure AD, the **Quickstart** blade offers a list of common application types and development stacks as seen in Figure 1. Choose the one that matches your environment and follow the instructions for download and setup.

***Figure 1: Quickstart blade in the Azure portal***

:::image type="content" source="./media/azure-ad-saas/azure-ad-quickstart-blade.png" alt-text="Illustrates the quickstart blade in the Azure portal.":::

After you download the code and set up your development environment, change the configuration settings in the app to reflect the Application ID, tenant ID, and client secret you recorded in the previous procedure. Note that the exact steps will differ depending on which sample you are using.

## Use two Azure AD apps to improve security in production

This article presents a simplified version of the architecture for implementing a landing page for your commercial marketplace SaaS offer. When running the page in production, we recommend that you improve security by communicating to the SaaS fulfillment APIs only through a different, secured application. This requires the creation of two new applications:

- First, the multitenant landing page application described up to this point, except without the functionality to contact the SaaS fulfillment APIs. This functionality will be offloaded to another application, as described below.
- Second, an application to own the communications with the SaaS fulfillment APIs. This application should be single tenant, only to be used by your organization, and an access control list can be established to limit access to the APIs from only this app.

This enables the solution to work in scenarios that observe the [separation of concerns](/dotnet/architecture/modern-web-apps-azure/architectural-principles#separation-of-concerns) principle. For example, the landing page uses the first registered Azure AD app to sign in the user. After the user is signed-in, the landing page uses the second Azure AD to request an access token to call the SaaS fulfillment API's and call the resolve operation.

## Resolve the marketplace purchase identification token

When the buyer is sent to your landing page, a token is added to the URL parameter. This token is different from both the Azure AD-issued token and the access token used for service-to-service authentication, and is used as an input for the [SaaS fulfillment APIs](./partner-center-portal/pc-saas-fulfillment-api-v2.md#resolve-a-purchased-subscription) resolve call to get the details of the subscription. As with all calls to the SaaS fulfillment APIs, your service-to-service request will be authenticated with an access token that is based on the app's Azure AD Application ID user for service-to-service authentication.

> [!NOTE]
> In most cases, it's preferable to make this call from a second, single-tenant application. See [Use two Azure AD apps to improve security in production](#use-two-azure-ad-apps-to-improve-security-in-production) earlier in this article.

### Request an access token

To authenticate your application with the SaaS fulfillment APIs, you need an access token, which can be generated by calling the Azure AD OAuth endpoint. See [How to get the publisher's authorization token](./partner-center-portal/pc-saas-registration.md#how-to-get-the-publishers-authorization-token).

### Call the resolve endpoint

The SaaS fulfillment APIs implement the [resolve](./partner-center-portal/pc-saas-fulfillment-api-v2.md#resolve-a-purchased-subscription) endpoint that can be called to confirm the validity of the marketplace token and to return information about the subscription.

## Read information from claims encoded in the ID token

As part of the [OpenID Connect](../active-directory/develop/v2-protocols-oidc.md) flow, Azure AD adds an [ID token](../active-directory/develop/id-tokens.md) to the request when the buyer is sent to the landing page. This token contains multiple pieces of basic information that could be useful in the activation process, including the information seen in this table.

| Value | Description |
| ------------ | ------------- |
| aud | Intended audience for this token. In this case, it should match your Application ID and be validated. |
| preferred_username | Primary username of the visiting user. This could be an email address, phone number, or other identifier. |
| email | User's email address. Note that this field may be empty. |
| name | Human-readable value that identifies the subject of the token. In this case, it will be the buyer's name. |
| oid | Identifier in the Microsoft identity system that uniquely identifies the user across applications. Microsoft Graph will return this value as the ID property for a given user account. |
| tid | Identifier that represents the Azure AD tenant the buyer is from. In the case of an MSA identity, this will always be ``9188040d-6c67-4c5b-b112-36a304b66dad``. For more information, see the note in the next section: Use the Microsoft Graph API. |
| sub | Identifier that uniquely identifies the user in this specific application. |
|||

## Use the Microsoft Graph API

The ID token contains basic information to identify the buyer, but your activation process may require additional details—such as the buyer's company—to complete the onboarding process. Use the [Microsoft Graph API](/graph/use-the-api) to request this information to avoid forcing the user to input these details again. The standard **User.Read** permissions include the following information, by default.

| Value | Description |
| ------------ | ------------- |
| displayName | Name displayed in the address book for the user. |
| givenName | First name of the user. |
| jobTitle | User's job title. |
| mail | SMTP address for the user. |
| mobilePhone | Primary cellular telephone number for the user. |
| preferredLanguage | ISO 639-1 code for the user's preferred language. |
| surname | Last name of the user. |
|||

Additional properties—such as the name of the user's company or the user's location (country)—can be selected for inclusion in the request. See [properties for the user resource type](/graph/api/resources/user?view=graph-rest-1.0&preserve-view=true#properties) for more details.

Most apps that are registered with Azure AD grant delegated permissions to read the user's information from their company's Azure AD tenant. Any request to Microsoft Graph for that information must be accompanied by an access token for authentication. Specific steps to generate the access token will depend on the technology stack you're using, but the sample code will contain an example. For more information, see [Get access on behalf of a user](/graph/auth-v2-user).

> [!NOTE]
> Accounts from the MSA tenant (with tenant ID ``9188040d-6c67-4c5b-b112-36a304b66dad``) will not return more information than has already been collected with the ID token. So you can skip this call to the Graph API for these accounts.

## Next steps

- [How to create a SaaS offer in the commercial marketplace](create-new-saas-offer.md)