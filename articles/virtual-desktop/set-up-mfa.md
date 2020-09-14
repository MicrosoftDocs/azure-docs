---
title: Set up Azure Multi-Factor Authentication for Windows Virtual Desktop - Azure
description: How to set up Azure Multi-Factor Authentication for increased security in Windows Virtual Desktop.
author: Heidilohr
ms.topic: how-to
ms.date: 08/27/2020
ms.author: helohr
manager: lizross
---
# Enable Azure Multi-Factor Authentication for Windows Virtual Desktop

>[!IMPORTANT]
> If you're visiting this page from the Windows Virtual Desktop (classic) documentation, make sure to [return to the Windows Virtual Desktop (classic) documentation](./virtual-desktop-fall-2019/tenant-setup-azure-active-directory.md) once you're finished.

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

Here's how to create a Conditional Access policy that requires multi-factor authentication when connecting to Windows Virtual Desktop:

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
2. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
3. Select **New policy**.
4. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
5. Under **Assignments**, select **Users and groups**.
6. Under **Include**, select **Select users and groups** > **Users and groups** > Choose the group you created in the [prerequisites](#prerequisites) stage.
7. Select **Done**.
8. Under **Cloud apps or actions** > **Include**, select **Select apps**.
9. Select one of the following apps based on which version of Windows Virtual Desktop you're using.
   - If you're using Windows Virtual Desktop (classic), choose this app:
       - **Windows Virtual Desktop** (App ID 5a0aa725-4958-4b0c-80a9-34562e23f3b7)
   - If you're using Windows Virtual Desktop, choose this app instead:
       -  **Windows Virtual Desktop** (App ID 9cdead84-a844-4324-93f2-b2e6bb768d07)

   >[!IMPORTANT]
   > Don't select the app called Windows Virtual Desktop Azure Resource Manager Provider (50e95039-b200-4007-bc97-8d5790743a63). This app is only used for retrieving the user feed and shouldn't have MFA.

10. Go to **Conditions** > **Client apps**, then select where you want to apply the policy to:
    
    - Select **Browser** if you want the policy to apply to the web client.
    - Select **Mobile apps and desktop clients** if you want to apply the policy to other clients.
    - Select both check boxes if you want to apply the policy to all clients.
   
    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Client apps page. The user has selected the mobile apps and desktop clients check box.](media/select-apply.png)

11. Once you've selected your app, choose **Select**, and then select **Done**.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the Cloud apps or actions page. The Windows Virtual Desktop and Windows Virtual Desktop Client apps are highlighted in red.](media/cloud-apps-enterprise.png)

    >[!NOTE]
    >To find the App ID of the app you want to select, go to **Enterprise Applications** and select **Microsoft Applications** from the application type drop-down menu.

12. Under **Access controls** > **Grant**, select **Grant access**, **Require multi-factor authentication**, and then **Select**.
13. Under **Access controls** > **Session**, select **Sign-in frequency**, set the value to **1** and the unit to **Hours**, and then select **Select**.
14. Confirm your settings and set **Enable policy** to **On**.
15. Select **Create** to enable your policy.

## Next steps

- [Learn more about Conditional Access policies](../active-directory/conditional-access/concept-conditional-access-policies.md)

- [Learn more about user sign in frequency](../active-directory/conditional-access/howto-conditional-access-session-lifetime.md#user-sign-in-frequency)
