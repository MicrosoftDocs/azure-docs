---
title: 
description: 
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: conceptual
ms.date: 02/16/2023

ms.author: joflore
author: MicrosoftGuyJFlo
manager: 
ms.reviewer: 

ms.collection: M365-identity-device-management
---
# Conditional Access: Token binding (preview)

Token binding attempts to reduce attacks using token theft by ensuring a token is usable only from the intended device. When an attacker is able to steal a token, by hijacking or replay, they can impersonate their victim. Token theft is thought to be a relatively rare event, but the damage from it can be significant. Token binding creates a cryptographically secure tie between the token and the device (client secret) it was issued to. Without the client secret, the bound token can't be used. 

When a user registers a Windows 10 device in Azure AD, their primary identity is bound to the device. This means that any issued sign-in token is tied to the device and cannot be stolen or replayed. These sign-in tokens are specifically the session cookies in Edge and most Microsoft product refresh tokens. 

The preview allows organizations to create a Conditional Access policy to require token binding for sign-in tokens. 

With this preview, we are giving you the ability to create a Conditional Access policy to require token binding for sign-in tokens for specific services. We support token binding for sign-in tokens in Conditional Access for Exchange online and SharePoint 

Scenario for preview
Heavily regulated customers like finserv and gov 

People who have access to sensitive info like Executives and IT staff who are likely targets of attack

Start with these users as part of a deployment

The following steps will help create a Conditional Access policy to require all users do multifactor authentication.

1. Sign in to the **Azure portal** as a Conditional Access Administrator, Security Administrator, or Global Administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users or workload identities**.
   1. Under **Include**, select the users or groups who will be testing this policy.
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
1. Under **Cloud apps or actions** > **Include**, select **Select apps**.
   1. Under **Select**, select the following applications that are supported by the preview:
       1. Office 365 Exchange Online
       1. Office 365 SharePoint Online
    1. Choose **Select**.
1. Under **Conditions**:
    1. Under **Device platforms**:
       1. Set **Configure** to **Yes**.
       1. **Include** > **Select device platforms** > **Windows**.
       1. Select **Done**.
    1. Under **Client apps**:
       1. Set **Configure** to **Yes**.
       1. Under Modern authentication clients only select **Mobile apps and desktop clients**. Leave other items unchecked.
       1. Select **Done**.
1. Under **Access controls** > **Session**, select **Require token binding for sign-in sessions** and select **Select**.
1. Confirm your settings and set **Enable policy** to **Report-only**.
1. Select **Create** to create to enable your policy.

After confirming your settings using [report-only mode](howto-conditional-access-insights-reporting.md), an administrator can move the **Enable policy** toggle from **Report-only** to **On**.


<!--- With the token binding in Conditional Access private preview, we are giving you the ability to create a Conditional Access policy to require token binding for sign-in tokens. Enabling such a policy means Azure AD will no longerissue an unbound session cookie. For phase 1, requiring token binding for sign-in tokens in Conditional Access is only supported for Office 365and web applications using Edge or Chrome + extension. For phase 2,we will also support Office 365 native clients. Enabling a policy that includes web applicationsbeing accessed onother browsers than Edge or Chrome + Windows 10 account extension,may cause users to not be able to authenticate to those applications. --->