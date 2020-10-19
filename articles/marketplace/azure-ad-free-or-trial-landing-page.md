---
title: Build the landing page for your free or trial SaaS offer in the commercial marketplace
description: Learn how to build a landing page for your free or trial SaaS offer.
author: mingshen-ms 
ms.author: mingshen
ms.reviewer: dannyevers 
ms.service: marketplace 
ms.subservice: partnercenter-marketplace-publisher
ms.topic: how-to
ms.date: 09/04/2020
---

# Build the landing page for your free or trial SaaS offer in the commercial marketplace

This article guides you through the process of building a landing page for a free or trial SaaS app that will be sold on the Microsoft commercial marketplace.

## Overview

You can think of the landing page as the “lobby” for your software as a service (SaaS) offer. After the customer chooses to get your app, the commercial marketplace directs them to the landing page to activate and configure their subscription to your SaaS application. When you create a software as a service (SaaS) offer, in Partner Center, you can choose whether or not to [sell through Microsoft](plan-saas-offer.md#listing-options). If you want to only list your offer in the Microsoft commercial marketplace and not sell through Microsoft, you can specify how potential customers can interact with the offer. When you enable the **Get it now (Free)** or **Free trial** listing option, you must specify a landing page URL to which the user can go to access the free subscription or trial.

The purpose of the landing page is simply to receive the user so they can activate the free trial or free subscription. Using Azure Active Directory (Azure AD) and Microsoft Graph, you will enable single sign-on (SSO) for the user and get important details about the user that you can use to activate their free trial or free subscription, including their name, email address, and organization.

Because the information needed to activate the subscription is limited and provided by Azure AD and Microsoft Graph, there should be no need to request information that requires more than basic consent. If you need user details that require additional consent for your application, you should request this information after subscription activation is complete. This enables frictionless subscription activation for the user and decreases the risk of abandonment.

The landing page typically includes the following information and listing options:

- Present the name and details of the free trial or free subscription. For example, specify the usage limits or duration of a trial.
- Present the user's account details, including first and last name, organization, and email.
- Prompt the user to confirm or substitute different account details.
- Guide the user on next steps after activation. For example, receive a welcome email, manage the subscription, get support, or read documentation.

The following sections in this article will guide you through the process of building a landing page:

1. [Create an Azure AD app registration](#create-an-azure-ad-app-registration) for the landing page.
2. [Use a code sample as a starting point](#use-a-code-sample-as-a-starting-point) for your app.
3. [Read information from claims encoded in the ID token](#read-information-from-claims-encoded-in-the-id-token), received from Azure AD after sign in, that was sent with the request.
4. [Use the Microsoft Graph API](#use-the-microsoft-graph-api) to gather additional information, as required.

## Create an Azure AD app registration

The commercial marketplace is fully integrated with Azure AD. Users arrive at the marketplace authenticated with an [Azure AD account or Microsoft account (MSA)](https://docs.microsoft.com/azure/active-directory/fundamentals/active-directory-whatis#terminology). After acquiring a free or free trial subscription through your list-only offer, the user goes from the commercial marketplace to your landing page URL to activate and manage their subscription to your SaaS application. You must let the user sign in to your application with Azure AD SSO. (The landing page URL is specified in the offer’s [Technical configuration](plan-saas-offer.md#technical-information) page.

The first step to using the identity is to make sure your landing page is registered as an Azure AD application. Registering the application lets you use Azure AD to authenticate users and request access to user resources. It can be considered the application’s definition, which lets the service know how to issue tokens to the app based on the app's settings.

### Register a new application using the Azure portal

To get started, follow the instructions for [registering a new application](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app). To let users from other companies visit the app, you must choose **Accounts in any organizational directory (any Azure AD directory—multitenant) and personal Microsoft accounts (like Skype or Xbox)** when asked who can use the application.

If you intend to query the Microsoft Graph API, [configure your new application to access web APIs](https://docs.microsoft.com/azure/active-directory/develop/quickstart-configure-app-access-web-apis). When you select the API permissions for this application, the default of **User.Read** is enough to gather basic information about the user to make the onboarding process smooth and automatic. Do not request any API permissions labeled **needs admin consent**, as this will block all non-administrator users from visiting your landing page.

If you do require elevated permissions as part of your onboarding or provisioning process, consider using the [incremental consent](https://aka.ms/incremental-consent) functionality of Azure AD so that all users sent from the marketplace are able to interact initially with the landing page.

## Use a code sample as a starting point

Microsoft has provided several sample apps that implement a simple website with Azure AD login enabled. After your application is registered in Azure AD, the **Quickstart** blade offers a list of common application types and development stacks (Figure 1). Choose the one that matches your environment and follow the instructions for download and setup.

***Figure 1: Quickstart blade in the Azure portal***

:::image type="content" source="./media/azure-ad-saas/azure-ad-quickstart-blade.png" alt-text="Illustrates the Quickstart blade in the Azure portal.":::

After you download the code and set up your development environment, change the configuration settings in the app to reflect the Application ID, tenant ID, and client secret you recorded in the previous procedure. Note that the exact steps will differ depending on which sample you are using.

## Read information from claims encoded in the ID token

As part of the [OpenID Connect](https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc) flow, Azure AD adds an [ID token](https://docs.microsoft.com/azure/active-directory/develop/id-tokens) to the request when the user is sent to the landing page. This token contains multiple pieces of basic information that could be useful in the activation process, including the information seen in this table.

| Value | Description |
| ------------ | ------------- |
| aud | Intended audience for this token. In this case, it should match your Application ID and be validated. |
| preferred_username | Primary username of the visiting user. This could be an email address, phone number, or other identifier. |
| email | User’s email address. Note that this field may be empty. |
| name | Human-readable value that identifies the subject of the token. In this case, it will be the user’s name. |
| oid | Identifier in the Microsoft identity system that uniquely identifies the user across applications. Microsoft Graph will return this value as the ID property for a given user account. |
| tid | Identifier that represents the Azure AD tenant the user is from. In the case of an MSA identity, this will always be `9188040d-6c67-4c5b-b112-36a304b66dad`. For more information, see the note in the next section: Use Microsoft Graph API. |
| sub | Identifier that uniquely identifies the user in this specific application. |
|||

## Use the Microsoft Graph API

The ID token contains basic information to identify the user, but your activation process may require additional details—such as the user’s company—to complete the onboarding process. Use the [Microsoft Graph API](https://docs.microsoft.com/graph/use-the-api) to request this information to avoid forcing the user to input these details again. The standard **User.Read** permissions include the following information, by default:

| Value | Description |
| ------------ | ------------- |
| displayName | Name displayed in the address book for the user. |
| givenName | First name of the user. |
| jobTitle | User’s job title. |
| mail | SMTP address for the user. |
| mobilePhone | Primary cellular telephone number for the user. |
| preferredLanguage | ISO 639-1 code for the user’s preferred language. |
| surname | Last name of the user. |
|||

Additional properties—such as the name of the user’s company or the user’s location (country)—can be selected for inclusion in the request. For more details, see [Properties for the user resource type](https://docs.microsoft.com/graph/api/resources/user?view=graph-rest-1.0#properties).

Most apps that are registered with Azure AD grant delegated permissions to read the user’s information from their company’s Azure AD tenant. Any request to Microsoft Graph for that information must be accompanied by an access token as authentication. Specific steps to generate the access token will depend on the technology stack you’re using, but the sample code will contain an example. For more information, see [Get access on behalf of a user](https://docs.microsoft.com/graph/auth-v2-user).

> [!NOTE]
> Accounts from the MSA tenant (with tenant ID `9188040d-6c67-4c5b-b112-36a304b66dad`) will not return more information than has already been collected with the ID token. So you can skip this call to the Graph API for these accounts.

## Next steps
- [How to create a SaaS offer in the commercial marketplace](create-new-saas-offer.md)
