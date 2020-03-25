---
title: Set up Azure multi-factor authentication for Windows Virtual Desktop - Azure
description: How to set up Azure multi-factor authentication for increased security in Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/22/2020
ms.author: helohr
manager: lizross
---

# Set up and enforce Azure multi-factor authentication

The Windows client for Windows Virtual Desktop is an excellent option for integrating Windows Virtual Desktop with your local machine. However, when you configure your Windows Virtual Desktop account into the Windows Client.

When you first sign in, the client asks for your username, password, and Azure MFA. After that, the next time you sign in, the client will remember your token from your Azure AD Enterprise Application. When you select **Remember me**, your users can sign in after restarting the client without needing to reenter their credentials.

![A screenshot of the credentials window where you enter your password. A check box labeled "Remember me" is underneath the password field.](media/credentials-window.png)

While this is great for some scenarios, in Enterprise scenarios or personal devices, this could make your deployment less secure. To protect your users, you'll need to make sure the client keeps asking for Azure multi-factor authentication credentials. This article will show you how to enable this feature by opting in to the Conditional Access policy for Windows Virtual Desktop.

## Prerequisites

Before you start, make sure you have these things:

- One of the following licenses:
  - Enterprise Mobility and Security E5
  - Azure Active Directory Premium P2
- Create Azure Active Directory group and make your users group members

## Opt in to the Conditional Access policy

1. Open **Azure Active Directory**.

2. Go to the **All applications** tab. In the "Application type" drop-down menu, select **Enterprise Applications**, then search for **Windows Virtual Desktop Client**.

![A screenshot of the All applications tab. The user entered "windows virtual desktop client" into the search bar, and the app has shown up in the search results.](media/all-applications-search.png)

3. Select **Conditional Access**.

![A screenshot showing the user hovering their mouse cursor over the Conditional Access tab.](media/conditional-access-location.png)

4. Select **+ New policy**.

![A screenshot of the Conditional Access page. The user is hovering their mouse cursor over the new policy button.](media/new-policy-button.png)

5. Enter a name for the rule, then select the name of the group you created in the prerequisites. In the following example, the group's name is "WVD - MFA Users."

![A screenshot of the Users and Groups page. Select and the name of the app being configured are selected.](media/users-and-groups-selection.png)

6. Select **Select**, then select **Done**.

7. Next, open **Cloud Apps or actions**.

8. On the **Select** panel, select both the **Windows Virtual Desktop** and **Windows Virtual Desktop Client** Enterprise applications.

9. Finally, select **Select**, then select **Done**.

![](media/4d310d3500156228aedeaab7c58d0862.png)

## Whitelist users with a filter for trusted locations

Now that you've set up your Selective Access policy, you have the option to create a filter for policy enforcement based on your company's public IP address. With this filter, users working in trusted locations can access your Windows Virtual Desktop environment without multi-factor authentication. However, when they switch to a network outside of a trusted location, they'll get the multi-factor authentication prompt again.

>[!NOTE]
>The following setting also applies to the [Windows Virtual Desktop web client](https://rdweb.wvd.microsoft.com/webclient/index.html).

![A screenshot of the named locations tab. Configure MFA trusted IPs is highlighted in red.](media/configure-mfa-trusted-ips.png)

To set up a filter:

1. In the **Named locations** tab, select **Configure MFA trusted IPs**.
   
2. When the **Multi-factor authentication** page opens, go to the **Trusted IPs** section and enter the public IP addresses that you want to whitelist from Azure MFA enforcement.

![A screenshot of the multi-factor authentication page.](media/mfa-page.png)

3. Go back to the Selective Access rule page.

4. Select **MFA Trusted IPs**.

![A screenshot of the Conditions page. The checkbox named "MFA Trusted IPs" is selected.](media/mfa-trusted-ips.png)

5. Select **Require multi-factor authentication**, then select at least one of the **selected controls**.

6. Select **Select**, then select **Done**.

7. Select **Grant**.

8. Select **Require multi-factor authentication**.
   
   ![A screenshot of the Grant page. "Require multi-factor authentication" is selected.](media/grant-page.png)

    >[!NOTE]
    >If some of your users in your organization run the Windows Client from an Azure AD Domain Joined-compliant computer account that's managed by InTune and don't want to enforce MFA for those users, you should also select **Require device to be marked as compliant**.

9. Select **Session**.

10. Set the **Sign-in frequency** to **Active**, then change its value to **1 Hours**.

    ![A screenshot of the Session page. The session menu shows the sign-in frequency drop down menus have been changed to "1" and "Hours."](media/sign-in-frequency.png)
   
    >[!NOTE]
    >Active sessions in your Windows Virtual Desktop environment will continue to work as you change the policy. However, if you disconnect or sign off, you'll need to provide your credentials again after 60 minutes. As you change the settings, you can extend the timeout period as much as you want (as long as it aligns with your organization's security policy).
    >
    >The default setting is a rolling window of 90 days, which means the client will ask users to sign in again when they try to access a resource after being inactive on their machine for 90 days or longer.


11. Enable the policy.

12. Select **Create** to confirm the policy.

    ![A screenshot of the Create button.](media/create-button.png)

13. You're all done! Feel free to test the policy to make sure your whitelist is working as intended.
