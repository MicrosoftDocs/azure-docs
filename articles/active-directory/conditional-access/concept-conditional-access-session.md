---
title: Session controls in Conditional Access policy
description: What are session controls in an Azure AD Conditional Access policy

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 03/28/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: amycolannino
ms.reviewer: calebb, vmahtani, ripull

ms.collection: M365-identity-device-management
---
# Conditional Access: Session

Within a Conditional Access policy, an administrator can make use of session controls to enable limited experiences within specific cloud applications.

![Conditional Access policy with a grant control requiring multifactor authentication](./media/concept-conditional-access-session/conditional-access-session.png)

## Application enforced restrictions

Organizations can use this control to require Azure AD to pass device information to the selected cloud apps. The device information allows cloud apps to know if a connection is from a compliant or domain-joined device and update the session experience. This control only supports Office 365, SharePoint Online, and Exchange Online as selected cloud apps. When selected, the cloud app uses the device information to provide users with a limited or full experience. Limited when the device isn't managed or compliant and full when the device is managed and compliant.

For more information on the use and configuration of app-enforced restrictions, see the following articles:

- [Enabling limited access with SharePoint Online](/sharepoint/control-access-from-unmanaged-devices)
- [Enabling limited access with Exchange Online](/microsoft-365/security/office-365-security/secure-email-recommended-policies?view=o365-worldwide#limit-access-to-exchange-online-from-outlook-on-the-web&preserve-view=true)

## Conditional Access application control

Conditional Access App Control uses a reverse proxy architecture and is uniquely integrated with Azure AD Conditional Access. Azure AD Conditional Access allows you to enforce access controls on your organization’s apps based on certain conditions. The conditions define what user or group of users, cloud apps, and locations and networks a Conditional Access policy applies to. After you’ve determined the conditions, you can route users to [Microsoft Defender for Cloud Apps](/cloud-app-security/what-is-cloud-app-security) where you can protect data with Conditional Access App Control by applying access and session controls.

Conditional Access App Control enables user app access and sessions to be monitored and controlled in real time based on access and session policies. Access and session policies are used within the Defender for Cloud Apps portal to refine filters and set actions to take. With the access and session policies, you can:

- Prevent data exfiltration: You can block the download, cut, copy, and print of sensitive documents on, for example, unmanaged devices.
- Protect on download: Instead of blocking the download of sensitive documents, you can require documents to be labeled and protected with Azure Information Protection. This action ensures the document is protected and user access is restricted in a potentially risky session.
- Prevent upload of unlabeled files: Before a sensitive file is uploaded, distributed, and used, it’s important to make sure that the file has the right label and protection. You can ensure that unlabeled files with sensitive content are blocked from being uploaded until the user classifies the content.
- Monitor user sessions for compliance (Preview): Risky users are monitored when they sign into apps and their actions are logged from within the session. You can investigate and analyze user behavior to understand where, and under what conditions, session policies should be applied in the future.
- Block access (Preview): You can granularly block access for specific apps and users depending on several risk factors. For example, you can block them if they're using client certificates as a form of device management.
- Block custom activities: Some apps have unique scenarios that carry risk, for example, sending messages with sensitive content in apps like Microsoft Teams or Slack. In these kinds of scenarios, you can scan messages for sensitive content and block them in real time.

For more information, see the article [Deploy Conditional Access App Control for featured apps](/cloud-app-security/proxy-deployment-aad).

## Sign-in frequency

Sign-in frequency defines the time period before a user is asked to sign in again when attempting to access a resource. Administrators can select a period of time (hours or days) or choose to require reauthentication every time.

Sign-in frequency setting works with apps that have implemented OAUTH2 or OIDC protocols according to the standards. Most Microsoft native apps for Windows, Mac, and Mobile including the following web applications follow the setting.

- Word, Excel, PowerPoint Online
- OneNote Online
- Office.com
- Microsoft 365 Admin portal
- Exchange Online
- SharePoint and OneDrive
- Teams web client
- Dynamics CRM Online
- Azure portal

For more information, see the article [Configure authentication session management with Conditional Access](howto-conditional-access-session-lifetime.md#user-sign-in-frequency).

## Persistent browser session

A persistent browser session allows users to remain signed in after closing and reopening their browser window.

For more information, see the article [Configure authentication session management with Conditional Access](howto-conditional-access-session-lifetime.md#persistence-of-browsing-sessions).

## Customize continuous access evaluation

[Continuous access evaluation](concept-continuous-access-evaluation.md) is auto enabled as part of an organization's Conditional Access policies. For organizations who wish to disable continuous access evaluation, this configuration is now an option within the session control within Conditional Access. Continuous access evaluation policies can be scoped to all users or specific users and groups. Admins can make the following selection while creating a new policy or while editing an existing Conditional Access policy.

- **Disable** only work when **All cloud apps** are selected, no conditions are selected, and **Disable** is selected under **Session** > **Customize continuous access evaluation** in a Conditional Access policy. You can choose to disable all users or specific users and groups.

:::image type="content" source="media/concept-conditional-access-session/continuous-access-evaluation-session-controls.png" alt-text="CAE Settings in a new Conditional Access policy in the Azure portal." lightbox="media/concept-conditional-access-session/continuous-access-evaluation-session-controls.png":::

## Disable resilience defaults

During an outage, Azure AD extends access to existing sessions while enforcing Conditional Access policies.

If resilience defaults are disabled, access is denied once existing sessions expire. For more information, see the article [Conditional Access: Resilience defaults](resilience-defaults.md).

## Require token protection for sign-in sessions (preview)

Token protection (sometimes referred to as token binding in the industry) attempts to reduce attacks using token theft by ensuring a token is usable only from the intended device. When an attacker is able to steal a token, by hijacking or replay, they can impersonate their victim until the token expires or is revoked. Token theft is thought to be a relatively rare event, but the damage from it can be significant.

The preview works for specific scenarios only. For more information, see the article [Conditional Access: Token protection (preview)](concept-token-protection.md).

## Next steps

- [Conditional Access common policies](concept-conditional-access-policy-common.md)

- [Report-only mode](concept-conditional-access-report-only.md)
