---
title: Understanding application consent experiences | Microsoft Docs
description: Learn more about the Azure AD consent experiences to see how you can use it when managing and developing applications on Azure AD
services: active-directory
documentationcenter: ''
author: zachowd
manager: stevebal

ms.assetid: 
ms.service: active-directory
ms.component: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 08/16/2017
ms.author: zachowd

---

# Understanding application consent experiences

This article is to help you learn more about the Azure Active Directory application consent user experience so you can manage and develop applications more effectively.

## Consent and permissions

Consent is the process of a user granting authorization to an application to access protected resources on their behalf. An admin or user can be asked for consent to allow access to their organization/individual data.

The actual user experience of granting consent will differ depending on policies set on the user's tenant, the user's scope of authority (or role), and the type of [permissions](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-permissions) being requested by the client application. This means that application developers and tenant admins have some control over the consent experience. Admins have the flexibility of setting and disabling policies on a tenant or app to control the consent experience in their tenant. Application developers can dictate what types of permissions are being requested and if they want to guide users through the user consent flow or the admin consent flow.

- User consent flow, is when an application developer directs users to the authorization endpoint with the intent to record consent for only the current user.
- Admin consent flow, is when an application developer directs users to the admin consent endpoint with the intent to record consent for the entire tenant. To ensure the admin consent flow works properly application developers must list all permissions in the RequiredResourceAccess property in the application manifest. <!--(link to more information). -->


## Building blocks of the consent prompt
The consent prompt is designed to ensure users have enough information to determine if they trust the client application to access protected resources on their behalf. The building blocks of the consent prompt are shared below. Understanding the building blocks will help users granting consent make a more informed decisions, and it will help developers build better user experiences.

![Building blocks of the consent prompt.](./media/application-consent/consent_prompt.png)

| # | Definition |
| ----- | ----- |
| 1 | Is the identifier that represents the user which the client application is requesting to access protected resources on behalf of. |
| 2 | Is the title of the consent prompt. The title is changes if the users are going through the user or admin consent flow. |
| 3 | Is the app logo, it is provided by the application developer. The goal of this image is to help the user have a visual queue of whether or not this app is the app they intended to access. Keep in mind that ownership of this image isn't validated. |
| 4 | Is the app name, it is provided by the application owner. The goal of this value is to inform users which application is requesting access to their data. The ownership of this app name isn't validated. |
| 5 | Is the publisher domain, it is provided by the application developer. The goal of this value is to provide users with a domain they maybe able to evaluate for trustworthiness. The ownership of this publisher domain is validated. |
| 6 | Are the permissions being requested by the client application. Users should always evaluate the types of permissions being requested to understand what data the client application will be authorized to access on their behalf if they accept. As an application developer it is best to request access to the permissions with the least privilege. |
| 7 | Is the description of the permission, it is provided by the service exposing the permissions. To see the permission descriptions, you must toggle the chevron next to the permission. |
| 8 | Contains the links  to the terms of service and privacy statement of the application. The publisher is responsible for outlining their rules in their terms of service. Additionally, the publisher is responsible for disclosing the way they use and share user data in their privacy statement. If the publisher doesn't provide links to these values for multi-tenant applications, there will be a bolded warning on the consent prompt. |
| 9 | Is the link to where user's can review and remove any non-Microsoft applications that currently have access to their data. |

## Common consent scenarios
Below you can find the consent experiences that a user may see in the common consent scenarios.

1. Individuals accessing an app that directs them to the user consent flow while requiring a permission set that is within their scope of authority.
    1. Admins will have an additional control on the traditional consent prompt that will allow them consent on behalf of the entire tenant. The control will be defaulted to off, so only when admins explicitly checks the box will consent be granted onbehalf of the entire tenant. As of today this check box will only show for the Global Admin role, so Cloud Admin and App Admin will not see this checkbox.

        ![Consent prompt for scenario 1a.](./media/application-consent/consent_prompt_1a.png)
    
    2. Users will see the traditional consent prompt.

        ![Consent prompt for scenario 1b.](./media/application-consent/consent_prompt_1b.png)

1. Individuals accessing an app that requires at least one permission that is outside their scope of authority
    1. Admins will see the same prompt as 1.a shown above.
    2. Users will be blocked from granting consent to the application, and they will be told to ask their admin for access to the app. 
                
        ![Consent prompt for scenario 1b.](./media/application-consent/consent_prompt_2b.png)

1. Individuals that navigate or are directed to the admin consent flow
    1. Admin users will see the admin consent prompt. The title and the permission descriptions changed on this prompt, the changes highlight the fact that accepting this prompt will grant the app access to the requested data on behalf of the entire tenant.
        
        ![Consent prompt for scenario 1b.](./media/application-consent/consent_prompt_3a.png)
        
    1. Non-admin users will see the same screen as 2.b shown above.

## Recommended documents

- Get a step-by-step overview of [how the Azure AD consent framework implements consent](https://docs.microsoft.com/azure/active-directory/develop/active-directory-integrating-applications#overview-of-the-consent-framework).
- For more depth, learn [how a multi-tenant application can use the consent framework](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview#understanding-user-and-admin-consent) to implement "user" and "admin" consent, supporting more advanced multi-tier application patterns.

## Next steps
[AzureAD StackOverflow](http://stackoverflow.com/questions/tagged/azure-active-directory)
