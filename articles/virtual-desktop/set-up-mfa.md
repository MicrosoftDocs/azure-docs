---
title: Set up Azure Multi-Factor Authentication for Windows Virtual Desktop - Azure
description: How to set up Azure Multi-Factor Authentication for increased security in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/30/2020
ms.author: helohr
manager: lizross
---
# Enable Azure Multi-Factor Authentication for Windows Virtual Desktop

The Windows client for Windows Virtual Desktop is an excellent option for integrating Windows Virtual Desktop with your local machine. However, when you configure your Windows Virtual Desktop account into the Windows Client, there are certain measures you'll need to take to keep yourself and your users safe.

When you first sign in, the client asks for your username, password, and Azure MFA. After that, the next time you sign in, the client will remember your token from your Azure Active Directory (AD) Enterprise Application. When you select **Remember me**, your users can sign in after restarting the client without needing to reenter their credentials.

While remembering credentials is convenient, it can also make deployments on Enterprise scenarios or personal devices less secure. To protect your users, you'll need to make sure the client keeps asking for Azure Multi-Factor Authentication (MFA) credentials. This article will show you how to configure the Conditional Access policy for Windows Virtual Desktop to enable this setting.

## Prerequisites

Here's what you'll need to get started:

- Assign users a license that includes Azure Active Directory Premium P1 or P2.
- An Azure Active Directory group with your users assigned as group members.
- Enable Azure MFA for all your users. For more information about how to do that, see [How to require two-step verification for a user](../active-directory/authentication/howto-mfa-userstates.md#view-the-status-for-a-user).

> [!NOTE]
> The following setting also applies to the [Windows Virtual Desktop web client](https://rdweb.wvd.microsoft.com/webclient/index.html).

## Create a Conditional Access policy

This section will show you how to create a Conditional Access policy that requires multi-factor authentication when connecting to Windows Virtual Desktop.

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
2. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
3. Select **New policy**.
4. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
5. Under **Assignments**, select **Users and groups**.
   - Under **Include**, select **Select users and groups** > **Users and groups** > Choose the group created in the prerequisites stage.
   - Select **Done**.
6. Under **Cloud apps or actions** > **Include**, select **Select apps**.
   - Choose **Windows Virtual Desktop** (App ID 9cdead84-a844-4324-93f2-b2e6bb768d07), then **Select**, and then then **Done**.
   
     ![A screenshot of the Cloud apps or actions page. The Windows Virtual Desktop and Windows Virtual Desktop Client apps are highlighted in red.](media/cloud-apps-enterprise.png)

     >[!NOTE]
     >To find the App ID of the app you want to select, go to **Enterprise Applications** and select **Microsoft Applications** from the application type drop-down menu.

7. Under **Access controls** > **Grant**, select **Grant access**, **Require multi-factor authentication**, and then **Select**.
8. Under **Access controls** > **Session**, select **Sign-in frequency**, set the value to **1** and the unit to **Hours**, and then select **Select**.
9. Confirm your settings and set **Enable policy** to **On**.
10. Select **Create** to enable your policy.

## Next steps

- [Learn more about Conditional Access policies](../active-directory/conditional-access/concept-conditional-access-policies.md)

- [Learn more about user sign in frequency](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency)
