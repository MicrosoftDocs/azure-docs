---
title: Use additional context in Microsoft Authenticator notifications (Preview) - Azure Active Directory
description: Learn how to use additional context in MFA notifications
ms.service: active-directory
ms.subservice: authentication
ms.topic: conceptual
ms.date: 07/18/2022
ms.author: justinha
author: mjsantani
ms.collection: M365-identity-device-management

# Customer intent: As an identity administrator, I want to encourage users to use the Microsoft Authenticator app in Azure AD to improve and secure user sign-in events.
---
# How to use additional context in Microsoft Authenticator app notifications (Preview) - Authentication Methods Policy

This topic covers how to improve the security of user sign-in by adding the application and location in Microsoft Authenticator app push notifications.  

## Prerequisites

Your organization will need to enable Authenticator app push notifications for some users or groups by using the Azure AD portal. The new Authentication Methods Policy API will soon be ready as another configuration option.

>[!NOTE]
>Additional context can be targeted to only a single group, which can be dynamic or nested. On-premises synchronized security groups and cloud-only security groups are supported for the Authentication Method Policy.

## Passwordless phone sign-in and multifactor authentication 

When a user receives a Passwordless phone sign-in or MFA push notification in the Authenticator app, they'll see the name of the application that requests the approval and the location based on the IP address where the sign-in originated from.

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/location.png" alt-text="Screenshot of additional context in the MFA push notification.":::

The additional context can be combined with [number matching](how-to-mfa-number-match.md) to further improve sign-in security. 

:::image type="content" border="false" source="./media/howto-authentication-passwordless-phone/location-with-number-match.png" alt-text="Screenshot of additional context with number matching in the MFA push notification.":::


## Enable additional context in the portal

To enable additional context in the Azure AD portal, complete the following steps:

1. In the Azure AD portal, click **Security** > **Authentication methods** > **Microsoft Authenticator**.
1. Select the target users, click the three dots on the right, and click **Configure**.
1. Select the **Authentication mode**, and then for **Show additional context in notifications (Preview)**, click **Enable**, and then click **Done**.


## Known issues

Additional context is not supported for Network Policy Server (NPS). 

## Next steps

[Authentication methods in Azure Active Directory - Microsoft Authenticator app](concept-authentication-authenticator-app.md)

