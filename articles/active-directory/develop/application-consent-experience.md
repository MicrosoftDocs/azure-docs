---
title: Azure AD app consent experiences
description: Learn more about the Azure AD consent experiences to see how you can use it when managing and developing applications on Azure AD
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.topic: conceptual
ms.date: 04/18/2022
ms.author: ryanwi
ms.reviewer: jesakowi, asteen
---

# Understanding Azure AD application consent experiences

Learn more about the Azure Active Directory (Azure AD) application consent user experience. So you can intelligently manage applications for your organization and/or develop applications with a more seamless consent experience.

## Consent and permissions

Consent is the process of a user granting authorization to an application to access protected resources on their behalf. An admin or user can be asked for consent to allow access to their organization/individual data.

The actual user experience of granting consent will differ depending on policies set on the user's tenant, the user's scope of authority (or role), and the type of [permissions](v2-permissions-and-consent.md) being requested by the client application. This means that application developers and tenant admins have some control over the consent experience. Admins have the flexibility of setting and disabling policies on a tenant or app to control the consent experience in their tenant. Application developers can dictate what types of permissions are being requested and if they want to guide users through the user consent flow or  the admin consent flow.

- **User consent flow** is when an application developer directs users to the authorization endpoint with the intent to record consent for only the current user.
- **Admin consent flow** is when an application developer directs users to the admin consent endpoint with the intent to record consent for the entire tenant. To ensure the admin consent flow works properly, application developers must list all permissions in the `RequiredResourceAccess` property in the application manifest. For more info, see [Application manifest](./reference-app-manifest.md).

## Building blocks of the consent prompt

The consent prompt is designed to ensure users have enough information to determine if they trust the client application to access protected resources on their behalf. Understanding the building blocks will help users granting consent make more informed decisions and it will help developers build better user experiences.

The following diagram and table provide information about the building blocks of the consent prompt.

:::image type="content" source="./media/application-consent-experience/consent_prompt.png" alt-text="Building blocks of the consent prompt":::

| # | Component | Purpose |
| ----- | ----- | ----- |
| 1 | User identifier | This identifier represents the user that the client application is requesting to access protected resources on behalf of. |
| 2 | Title | The title changes based on whether the users are going through the user or admin consent flow. In user consent flow, the title will be “Permissions requested” while in the admin consent flow the title will have an additional line “Accept for your organization”. |
| 3 | App logo | This image should help users have a visual cue of whether this app is the app they intended to access. This image is provided by application developers and the ownership of this image isn't validated. |
| 4 | App name | This value should inform users which application is requesting access to their data. Note this name is provided by the developers and the ownership of this app name isn't validated.|
| 5 | Publisher name and verification | The blue "verified" badge means that the app publisher has verified their identity using a Microsoft Partner Network account and has completed the verification process. If the app is publisher verified, the publisher name is displayed.  If the app is not publisher verified, "Unverified" is displayed instead of a publisher name. For more information, read about [Publisher Verification](publisher-verification-overview.md). Selecting the publisher name displays more app info as available, such as the publisher name, publisher domain, date created, certification details, and reply URLs. |
| 6 |  Microsoft 365 Certification | The Microsoft 365 Certification logo means that an app has been vetted against controls derived from leading industry standard frameworks, and that strong security and compliance practices are in place to protect customer data.  For more information, read about [Microsoft 365 Certification](/microsoft-365-app-certification/docs/enterprise-app-certification-guide).|
| 7 | Publisher information  | Displays whether the application is published by Microsoft. |
| 8 | Permissions | This list contains the permissions being requested by the client application. Users should always evaluate the types of permissions being requested to understand what data the client application will be authorized to access on their behalf if they accept. As an application developer it is best to request access, to the permissions with the least privilege. |
| 9 | Permission description | This value is provided by the service exposing the permissions. To see the permission descriptions, you must toggle the chevron next to the permission. |
| 10 | https://myapps.microsoft.com | This is the link where users can review and remove any non-Microsoft applications that currently have access to their data. |
| 11 | Report it here | This link is used to report a suspicious app if you don't trust the app, if you believe the app is impersonating another app, if you believe the app will misuse your data, or for some other reason. |

## App requires a permission within the user's scope of authority

A common consent scenario is that the user accesses an app which requires a permission set that is within the user's scope of authority. The user is directed to the user consent flow.

Admins will see an additional control on the traditional consent prompt that will allow them consent on behalf of the entire tenant. The control will be defaulted to off, so only when admins explicitly check the box will consent be granted on behalf of the entire tenant. As of today, this check box will only show for the Global Admin role, so Cloud Admin and App Admin will not see this checkbox.

:::image type="content" source="./media/application-consent-experience/consent_prompt_1a.png" alt-text="Consent prompt for scenario 1a":::

Users will see the traditional consent prompt.

:::image type="content" source="./media/application-consent-experience/consent_prompt_1b.png" alt-text="Screenshot that shows the traditional consent prompt.":::

## App requires a permission outside of the user's scope of authority

Another common consent scenario is that the user accesses an app which requires at least one permission that is outside the user's scope of authority.

Admins will see an additional control on the traditional consent prompt that will allow them consent on behalf of the entire tenant.

:::image type="content" source="./media/application-consent-experience/consent_prompt_1a.png" alt-text="Consent prompt for scenario 1a":::

Non-admin users will be blocked from granting consent to the application, and they will be told to ask their admin for access to the app.

:::image type="content" source="./media/application-consent-experience/consent_prompt_2b.png" alt-text="Screenshot of the consent prompt telling the user to ask an admin for access to the app.":::

## User is directed to the admin consent flow

Another common scenario is when the user navigates to or is directed to the admin consent flow.

Admin users will see the admin consent prompt. The title and the permission descriptions changed on this prompt, the changes highlight the fact that accepting this prompt will grant the app access to the requested data on behalf of the entire tenant.

:::image type="content" source="./media/application-consent-experience/consent_prompt_3a.png" alt-text="Consent prompt for scenario 3a":::

Non-admin users will be blocked from granting consent to the application, and they will be told to ask their admin for access to the app.

:::image type="content" source="./media/application-consent-experience/consent_prompt_2b.png" alt-text="Screenshot of the consent prompt telling the user to ask an admin for access to the app.":::

## Next steps

- Get a step-by-step overview of [how the Azure AD consent framework implements consent](./quickstart-register-app.md).
- For more depth, learn [how a multi-tenant application can use the consent framework](./howto-convert-app-to-be-multi-tenant.md) to implement "user" and "admin" consent, supporting more advanced multi-tier application patterns.
- Learn [how to configure the app's publisher domain](howto-configure-publisher-domain.md).