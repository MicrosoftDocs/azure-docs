---
title: Use additional context in Microsoft Authenticator notifications (Preview) - Azure Active Directory
description: Learn how to use additional context in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 08/02/2022
ms.author: justinha
author: mjsantani
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use additional context in Microsoft Authenticator app notifications (Preview) - Authentication Methods Policy

This topic covers how to improve the security of user sign-in by adding the application name and geographic location of the sign-in to Microsoft Authenticator push and passwordless notifications. The schema for the API to enable application name and geographic location is currently being updated. **While the API is updated over the next two weeks, you should only use the Azure AD portal to enable application name and geographic location.** 

## Prerequisites

Your organization will need to enable Microsoft Authenticator push notifications for some users or groups by using the Azure AD portal. The new Authentication Methods Policy API will soon be ready as another configuration option.

>[!NOTE]
>Additional context can be targeted to only a single group, which can be dynamic or nested. On-premises synchronized security groups and cloud-only security groups are supported for the Authentication Method Policy.

## Passwordless phone sign-in and multifactor authentication 

When a user receives a passwordless phone sign-in or MFA push notification in the Authenticator app, they'll see the name of the application that requests the approval and the location based on the IP address where the sign-in originated from.

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/location.png" alt-text="Screenshot of additional context in the MFA push notification.":::

The additional context can be combined with [number matching](how-to-mfa-number-match.md) to further improve sign-in security. 

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/location-with-number-match.png" alt-text="Screenshot of additional context with number matching in the MFA push notification.":::

## Enable additional context

To enable application name or geographic location, complete the following steps:

1. In the Azure AD portal, click **Security** > **Authentication methods** > **Microsoft Authenticator**.
1. On the **Basics** tab, click **Yes** and **All users** to enable the policy for everyone, and change **Authentication mode** to **Any**. 
   
   Only users who are enabled for Microsoft Authenticator here can be included in the policy to show the application name or geographic location of the sign-in, or excluded from it. Users who aren't enabled for Microsoft Authenticator can't see application name or geographic location.

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/enable-settings-additional-context.png" alt-text="Screenshot of how to enable Microsoft Authenticator settings for Any authentication mode.":::

1. On the **Configure** tab, for **Show application name in push and passwordless notifications (Preview)**, change **Status** to **Enabled**, choose who to include or exclude from the policy, and click **Save**. 

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/enable-app-name.png" alt-text="Screenshot of how to enable application name.":::

   Then do the same for **Show geographic location in push and passwordless notifications (Preview)**.

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/enable-geolocation.png" alt-text="Screenshot of how to enable geographic location.":::

   You can configure application name and geographic location separately. For example, the following policy enables application name and geographic location for all users but excludes the Operations group from seeing geographic location. 

   :::image type="content" border="true" source="./media/how-to-mfa-additional-context/exclude.png" alt-text="Screenshot of how to enable application name and geographic location separately.":::

## Known issues

Additional context is not supported for Network Policy Server (NPS) or Active Directory Federation Services (AD FS). 

## Next steps

[Authentication methods in Azure Active Directory - Microsoft Authenticator app](concept-authentication-authenticator-app.md)

