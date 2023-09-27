---
title: Microsoft Entra app consent experiences
description: Learn more about the Microsoft Entra consent experiences to see how you can use it when managing and developing applications on Microsoft Entra ID
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.custom: aaddev 
ms.workload: identity
ms.topic: conceptual
ms.date: 11/01/2022
ms.author: jomondi
ms.reviewer: jesakowi, asteen, jawoods
---

# Consent experience for applications in Microsoft Entra ID

In this article, you'll learn about the Microsoft Entra application consent user experience. You'll then be able to intelligently manage applications for your organization and/or develop applications with a more seamless consent experience.

Consent is the process of a user granting authorization to an application to access protected resources on their behalf. An admin or user can be asked for consent to allow access to their organization/individual data.

The actual user experience of granting consent will differ depending on policies set on the user's tenant, the user's scope of authority (or role), and the type of [permissions](./permissions-consent-overview.md) being requested by the client application. This means that application developers and tenant admins have some control over the consent experience. Admins have the flexibility of setting and disabling policies on a tenant or app to control the consent experience in their tenant. Application developers can dictate what types of permissions are being requested and if they want to guide users through the user consent flow or  the admin consent flow.

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
| 5 | Publisher name and verification | The blue "verified" badge means that the app publisher has verified their identity using a Microsoft Partner Network account and has completed the verification process. If the app is publisher verified, the publisher name is displayed.  If the app isn't publisher verified, "Unverified" is displayed instead of a publisher name. For more information, read about [Publisher Verification](publisher-verification-overview.md). Selecting the publisher name displays more app info as available, such as the publisher name, publisher domain, date created, certification details, and reply URLs. |
| 6 |  Microsoft 365 Certification | The Microsoft 365 Certification logo means that an app has been vetted against controls derived from leading industry standard frameworks, and that strong security and compliance practices are in place to protect customer data.  For more information, read about [Microsoft 365 Certification](/microsoft-365-app-certification/docs/enterprise-app-certification-guide).|
| 7 | Publisher information  | Displays whether the application is published by Microsoft. |
| 8 | Permissions | This list contains the permissions being requested by the client application. Users should always evaluate the types of permissions being requested to understand what data the client application will be authorized to access on their behalf if they accept. As an application developer, it's best to request access to the permissions with the least privilege. |
| 9 | Permission description | This value is provided by the service exposing the permissions. To see the permission descriptions, you must toggle the chevron next to the permission. |
| 10 | https://myapps.microsoft.com | This is the link where users can review and remove any non-Microsoft applications that currently have access to their data. |
| 11 | Report it here | This link is used to report a suspicious app if you don't trust the app, if you believe the app is impersonating another app, if you believe the app will misuse your data, or for some other reason. |

## Common scenarios and consent experiences

The following section describes the common scenarios and the expected consent experience for each of them.
### App requires a permission that the user has the right to grant

In this consent scenario, the user accesses an app that requires a permission set that is within the user's scope of authority. The user is directed to the user consent flow.

Admins will see an additional control on the traditional consent prompt that will allow to give consent on behalf of the entire tenant. The control will be defaulted to off, so only when admins explicitly check the box will consent be granted on behalf of the entire tenant. The check box will only show for the Global Administrator role, so Cloud Admin and App Admin won't see this checkbox.

:::image type="content" source="./media/application-consent-experience/consent_prompt_1a.png" alt-text="Consent prompt for scenario 1a":::

Users will see the traditional consent prompt.

:::image type="content" source="./media/application-consent-experience/consent_prompt_1b.png" alt-text="Screenshot that shows the traditional consent prompt.":::

### App requires a permission that the user has no right to grant

In this consent scenario, the user accesses an app that requires at least one permission that is outside the user's scope of authority.

Admins will see an additional control on the traditional consent prompt that will allow them consent on behalf of the entire tenant.

:::image type="content" source="./media/application-consent-experience/consent_prompt_1a.png" alt-text="Consent prompt for scenario 1a":::

Non-admin users will be blocked from granting consent to the application, and they'll be told to ask their admin for access to the app. If admin consent workflow is enabled in the user's tenant, non-admin users are able to submit a request for admin approval from the consent prompt. For more information on admin consent workflow, see [Admin consent workflow](../manage-apps/admin-consent-workflow-overview.md).

:::image type="content" source="./media/application-consent-experience/consent_prompt_2b.png" alt-text="Screenshot of the consent prompt telling the user to ask an admin for access to the app.":::

### User is directed to the admin consent flow

In this consent scenario, the user navigates to or is directed to the admin consent flow.

Admin users will see the admin consent prompt. The title and the permission descriptions changed on this prompt, the changes highlight the fact that accepting this prompt will grant the app access to the requested data on behalf of the entire tenant.

:::image type="content" source="./media/application-consent-experience/consent_prompt_3a.png" alt-text="Consent prompt for scenario 3a":::

Non-admin users will be blocked from granting consent to the application, and they'll be told to ask their admin for access to the app.

:::image type="content" source="./media/application-consent-experience/consent_prompt_2b.png" alt-text="Screenshot of the consent prompt telling the user to ask an admin for access to the app.":::

### Admin consent through the Azure portal

In this scenario, an administrator consents to all of the permissions that an application requests, which can include delegated permissions on behalf of all users in the tenant. The Administrator grants consent through the **API permissions** page of the application registration in the [Azure portal](https://portal.azure.com).

 :::image type="content" source="./media/consent-framework/grant-consent.png" alt-text="Screenshot of explicit admin consent through the Azure portal." lightbox="./media/consent-framework/grant-consent.png":::

All users in that tenant won't see the consent dialog unless the application requires new permissions. To learn which administrator roles can consent to delegated permissions, see [Administrator role permissions in Microsoft Entra ID](../roles/permissions-reference.md).

   > [!IMPORTANT]
   > Granting explicit consent using the **Grant permissions** button is currently required for single-page applications (SPA) that use MSAL.js. Otherwise, the application fails when the access token is requested.

## Common Issues
This section outlines the common issues with the consent experience and possible troubleshooting tips.

- 403 error

  - Is this a [delegated scenario](permissions-consent-overview.md)? What permissions does a user have? 
  - Are necessary permissions added to use the endpoint? 
  - Check the [token](https://jwt.ms/) to see if it has necessary claims to call the endpoint.
  - What permissions have been consented to? Who consented? 

- User is unable to consent

  - Check if tenant admin has disabled user consent for your organization
  - Confirm if the permissions you requesting are admin-restricted permissions.

- User is still blocked even after admin has consented

  - Check if [static permissions](consent-types-developer.md) are configured to be a superset of permissions requested dynamically.
  - Check if user assignment is required for the app.

## Troubleshoot known errors

For troubleshooting steps, see [Unexpected error when performing consent to an application](../manage-apps/application-sign-in-unexpected-user-consent-error.md).
## Next steps

- Get a step-by-step overview of [how the Microsoft Entra consent framework implements consent](./quickstart-register-app.md).
- For more depth, learn [how a multi-tenant application can use the consent framework](./howto-convert-app-to-be-multi-tenant.md) to implement "user" and "admin" consent, supporting more advanced multi-tier application patterns.
- Learn [how to configure the app's publisher domain](howto-configure-publisher-domain.md).
