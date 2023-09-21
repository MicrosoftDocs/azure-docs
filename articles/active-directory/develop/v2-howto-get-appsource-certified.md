---
title: Get AppSource certified for Microsoft Entra ID| Microsoft Docs
description: Learn details about how to get your application AppSource certified for Microsoft Entra ID.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 07/23/2020
ms.author: ryanwi
ms.reviewer: jeedes
ms.custom: aaddev
---

# Get AppSource certified for Microsoft Entra ID

[Microsoft AppSource](https://appsource.microsoft.com/) is a destination for business users to discover, try, and manage line-of-business SaaS applications (standalone SaaS and add-on to existing Microsoft SaaS products).

To list a standalone SaaS application on AppSource, your application must accept single sign-on from work accounts from any company or organization that has Microsoft Entra ID. The sign-in process must use the [OpenID Connect](v2-protocols-oidc.md) or [OAuth 2.0](v2-oauth2-auth-code-flow.md) protocols. SAML integration is not accepted for AppSource certification.

## Multi-tenant applications

A *multi-tenant application* is an application that accepts sign-ins from users from any company or organization that have Microsoft Entra ID without requiring a separate instance, configuration, or deployment. AppSource recommends that applications implement multi-tenancy to enable the *single-click* free trial experience.

To enable multi-tenancy on your application, follow these steps:
1. Set `Multi-Tenanted` property to `Yes` on your application registration's information in the [Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade). By default, applications created in the Microsoft Entra admin center are configured as *[single-tenant](#single-tenant-applications)*.
1. Update your code to send requests to the `common` endpoint. To do this, update the endpoint from `https://login.microsoftonline.com/{yourtenant}` to `https://login.microsoftonline.com/common*`.
1. For some platforms, like ASP.NET, you need also to update your code to accept multiple issuers.

For more information about multi-tenancy, see [How to sign in any Microsoft Entra user using the multi-tenant application pattern](howto-convert-app-to-be-multi-tenant.md).

### Single-tenant applications

A *single-tenant application* is an application that only accepts sign-ins from users of a defined Microsoft Entra instance. External users (including work or school accounts from other organizations, or personal accounts) can sign in to a single-tenant application after adding each user as a guest account to the Microsoft Entra instance that the application is registered. 

You can add users as guest accounts to Microsoft Entra ID through the [Microsoft Entra B2B collaboration](../external-identities/what-is-b2b.md) and you can do this [programmatically](../../active-directory-b2c/integrate-with-app-code-samples.md). When using B2B, users can create a self-service portal that does not require an invitation to sign in. For more info, see [Self-service portal for Microsoft Entra B2B collaboration sign-up](../external-identities/self-service-portal.md).

Single-tenant applications can enable the *Contact Me* experience, but if you want to enable the single-click/free trial experience that AppSource recommends, enable multi-tenancy on your application instead.

## AppSource trial experiences

### Free trial (customer-led trial experience)

The customer-led trial is the experience that AppSource recommends as it offers a single-click access to your application. The following example shows what this experience looks like:

1.  A user finds your application in the AppSource web site, then selects **Free trial** option.

    ![Shows Free trial for customer-led trial experience](./media/devhowto-appsource-certified/customer-led-trial-step1.png)

2.  AppSource redirects the user to a URL in your web site. Your web site starts the *single-sign-on* process automatically (on page load).

    ![Shows how user is redirected to a URL in your web site](./media/devhowto-appsource-certified/customer-led-trial-step2.png)

3.  The user is redirected to the Microsoft sign-in page and the user provides credentials to sign in.

    ![Shows the Microsoft sign-in page](./media/devhowto-appsource-certified/customer-led-trial-step3.png)

4. The user gives consent for your application.

    ![Example: Consent page for an application](./media/devhowto-appsource-certified/customer-led-trial-step4.png)

5.  Sign-in completes and the user is redirected back to your web site.  The user starts the free trial.

    ![Shows the experience the user sees when redirected back to your site](./media/devhowto-appsource-certified/customer-led-trial-step5.png)

### Contact me (partner-led trial experience)

You can use the partner trial experience when a manual or a long-term operation needs to happen to provision the user/company--for example, your application needs to provision virtual machines, database instances, or operations that take much time to complete. In this case, after the user selects the **Request Trial** button and fills out a form, AppSource sends you the user's contact information. When you receive this information, you then provision the environment and send the instructions to the user on how to access the trial experience:<br/><br/>

1. A user finds your application in AppSource web site, then selects **Contact Me**.

    ![Shows Contact me for partner-led trial experience](./media/devhowto-appsource-certified/partner-led-trial-step1.png)

2. The user fills out a form with contact information.

    ![Shows an example form with contact info](./media/devhowto-appsource-certified/partner-led-trial-step2.png)

3. You receive the user's information, set up a trial instance, and send the hyperlink to access your application to the user.

    ![Shows placeholder for user information](./media/devhowto-appsource-certified/usercontact.png)

4. The user accesses your application and completes the single sign-on process.

    ![Shows the application sign-in screen](./media/devhowto-appsource-certified/partner-led-trial-step3.png)

5. The user gives consent for your application.

    ![Shows an example consent page for an application](./media/devhowto-appsource-certified/partner-led-trial-step4.png)

6. Sign-in completes and the user is redirected back to your web site. The user starts the free trial.

    ![Shows the experience the user sees when redirected back to your site](./media/devhowto-appsource-certified/customer-led-trial-step5.png)

### More information

For more information about the AppSource trial experience, see [this video](https://aka.ms/trialexperienceforwebapps). 

## Get support

For Microsoft Entra integration, we use [Microsoft Q&A](/answers/topics/azure-active-directory.html) with the community to provide support.

We highly recommend you ask your questions on [Microsoft Q&A](/answers/topics/azure-active-directory.html) first and browse existing issues to see if someone has asked your question before. Make sure that your questions or comments are tagged with [`[azure-active-directory]`](/answers/topics/azure-active-directory.html).

Use the following comments section to provide feedback and help us refine and shape our content.

## Next steps

- For more information on building applications that support Microsoft Entra sign-ins, see [Authentication scenarios for Microsoft Entra ID](authentication-flows-app-scenarios.md).
- For information on how to list your SaaS application in AppSource, go see [AppSource Partner Information](https://appsource.microsoft.com/partners)
