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

The Windows client for Windows Virtual Desktop is an excellent option for integrating Windows Virtual Desktop with your local machine. However, when you configure your Windows Virtual Desktop account into the Windows Client. When you first sign in, the client asks for your username, password, and Azure MFA. After that, the next time you sign in, the client will remember your token from your Azure AD Enterprise Application. When you select **Remember me**, your users can sign in after restarting the client without needing to reenter their credentials.

![](media/7ea383c402a58cd8ae4363c07cc57de0.png)

While this is great for some scenarios, in Enterprise scenarios or personal devices, this could make your deployment less secure. To protect your users, you'll need to make sure the client keeps asking for Azure multi-factor authentication credentials. This article will show you how to enable this feature by opting in to the Conditional Access policy for Windows Virtual Desktop.

## Prerequisites

Before you start, make sure you have these things:

- One of the following licenses:
  - Enterprise Mobility and Security E5
  - Azure Active Directory Premium P2
- Create Azure Active Directory group and make your users group members

## Opt in to the Conditional Access policy

1. Open **Azure Active Directory**.

2. Go to **Enterprise Applications** > **Windows Virtual Desktop Client**.

![](media/b3ea9a297f407546aee226f2c403149e.png)

3. Select **Conditional Access**.

![](media/27b2b35cca5341adbc2d2178162ce40f.png)

4. Select **+ New policy**.

![](media/8788d56dca954aa8844baeeee77171b1.png)

5. Enter a name for the rule, then select the name of the group you created in the prerequisites. In the following example, the group's name is "WVD - MFA Users."

6. Select **Select**, then select **Done**.

![](media/3b0b9060dd42f5f1feb0ae9318e0c154.png)

7. Next, open **Cloud Apps or actions**.

8. On the **Select** panel, select both the **Windows Virtual Desktop** and **Windows Virtual Desktop Client** Enterprise applications.

9. Finally, select **Select**, then select **Done**.

![](media/4d310d3500156228aedeaab7c58d0862.png)

## Whitelist users with a filter for trusted locations

After you set up your Selective Access policy, you have the option to create a filter for policy enforcement based on your company's public IP address. With this filter, users working in trusted locations can access your Windows Virtual Desktop environment without multi-factor authentication. However, when they switch to a network outside of a trusted location, they'll get the multi-factor authentication prompt again.

>[!NOTE]
>The following setting also applies to the [Windows Virtual Desktop web client](https://rdweb.wvd.microsoft.com/webclient/index.html).

![](media/4dd11194626b7eb5f46acc8b0a1e6a3f.png)

To set up a filter:

1. Enter the public IP addresses that you want to whitelist from Azure MFA enforcement – in the - **trusted ips** - section.

![](media/8b83563ff08dbe60168ee4e741501160.png)

2. Go back to the Selective Access rule page.

3. Select **MFA Trusted IPs**.

![](media/ce3bf9e0d17320dee52caacddf12e368.png)

**Select** (at least) – Require multi-factor authentication – and – **require one** of the **selected controls**.

Click on **Select** and **Done**

Click on **Grant**

**Active** the **Require multi-factor authentication** setting

>[!NOTE]
>If some of your users in your organization run the Windows Client from a Azure AD Domain Joined (AADJ) compliant computer account (Intune managed) and don't want to enforce MFA for those users – please activate then as well the – Require device to be marked as compliant – to avoid this for AADJ compliant devices.

![](media/551af8389868bb190d5eb65fb4babf22.png)

Click on **Session**

**Activate** the **Sign-in frequency** setting – set it on - **1 Hours.**

>[!NOTE]
>Active sessions to your Windows Virtual Desktop environment will continue to work. However, if you disconnect or logoff – you will need to provide MFA again after 60 minutes. You can set it to 1 day to extent this time-out. It's what you prefer – and what aligns with your security policy!*

*The default setting is a rolling window of 90 days, i.e. users will be asked to re-authenticate on the first attempt to access a resource after being inactive on their machine for 90 days or longer.*

![](media/4ebd37ff1ecb8445dc3d2532632cfdeb.png)

**Enable** the Policy

**Confirm** the settings – click on **Create**

![](media/fe7c51d65332e67ef26e2507826a4588.png)

The **Conditional Access** rule **is created** – let's test the rule!

![](media/770e9f35e4d7d75f39f248dc72fe185a.png)
