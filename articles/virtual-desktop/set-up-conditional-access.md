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

While this is beneficial in some scenarios, in Enterprise scenarios or personal devices, this could make your deployment less secure. To counteract this, you'll need to make sure the client keeps asking for Azure multi-factor authentication credentials. This article will show you how to enable this feature by opting in to the Conditional Access policy for Windows Virtual Desktop.

>[!NOTE]
>In order to use this procedure and Conditional Access feature, you need to have at least the Enterprise Mobility + Security E5 or Azure Active Directory Premium P2 license.

## Prerequisites

Before you start, make sure you have these things:

- A license for one of these:
  - Enterprise Mobility and Security E5
  - Azure Active Directory Premium P2
- An Azure Active Directory group named 

*Pre-step: Make sure to create one Azure AD group named e.g. WVD – MFA Users and make your users a group member to filter the rule based on AAD group membership.*

**Switch** back to the Azure Portal

**Open** (again) Azure Active Directory

Go to **Enterprise Applications** and search/click on **Windows Virtual Desktop Client**

![](media/b3ea9a297f407546aee226f2c403149e.png)

Click on **Conditional Access**

![](media/27b2b35cca5341adbc2d2178162ce40f.png)

Click on **+ New policy**

![](media/8788d56dca954aa8844baeeee77171b1.png)

**Give** in a **name** for the **Rule** – select the – **WVD – MFA Users** - group that you created earlier.

Click on **Select** followed by **Done**

![](media/3b0b9060dd42f5f1feb0ae9318e0c154.png)

**Open** your **Cloud Apps or actions**.

Make sure to **select both** the Windows Virtual Desktop – and client - **Enterprise Applications.**

**Click** on **Select** and **Done**

![](media/4d310d3500156228aedeaab7c58d0862.png)

**Optional: Whitelist users from MFA enforcement based on (trusted IPs) Named Locations**

There is also the option to create conditions to filter out this rule based on your company's public IP address. The result is that your users (working on trusted locations) can access your Windows Virtual Desktop environment with only the username and password. Once they switch back to another network e.g. from home – Azure MFA will prompt again.

>[!NOTE]
>The following setting will also apply to the Windows Virtual Desktop - HTML5 RDWeb environment (aka.ms/WVDWeb).

![](media/4dd11194626b7eb5f46acc8b0a1e6a3f.png)

Enter in all your (public) IP addresses that you want to whitelist from Azure
MFA enforcement – in the - **trusted ips** - section.

![](media/8b83563ff08dbe60168ee4e741501160.png)

**Switch back to the Rule**

**Select** MFA Trusted IPs

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
