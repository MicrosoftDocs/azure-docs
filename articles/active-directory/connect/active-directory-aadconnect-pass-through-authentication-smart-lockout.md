---
title: 'Azure AD Connect: Pass-through Authentication - Smart Lockout | Microsoft Docs'
description: This article describes how Azure Active Directory (Azure AD) Pass-through Authentication protects your on-premises accounts from brute force password attacks in the cloud
services: active-directory
keywords: Azure AD Connect Pass-through Authentication, install Active Directory, required components for Azure AD, SSO, Single Sign-on
documentationcenter: ''
author: swkrish
manager: femila
ms.assetid: 9f994aca-6088-40f5-b2cc-c753a4f41da7
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/19/2017
ms.author: billmath
---

# Azure Active Directory Pass-through Authentication: Smart Lockout

## Overview

Azure Active Directory (Azure AD) protects against brute-force password attacks and prevents genuine users from being locked out of their Office 365 and SaaS applications. This capability, called *Smart Lockout*, is supported when you use Pass-through Authentication as your sign in method. Smart Lockout is enabled by default for all tenants and it continuously protects your user accounts.

Smart Lockout keeps track of failed sign-in attempts, and after a certain *lockout threshold*, it starts a *lockout duration*. Smart Lockout rejects any attempts to sign in from the attacker during the lockout duration. If the attack continues, subsequent failed sign-in attempts after the lockout duration ends results in longer lockout durations.

>[!NOTE]
>The default lockout threshold is ten failed attempts, and the default lockout duration is 60 seconds.

Smart Lockout also distinguishes between sign ins from genuine users and sign ins from attackers, and in most cases, locks out only the attackers. This functionality prevents attackers from maliciously locking out genuine users. Smart Lockout uses past sign-in behavior, the users’ devices and browsers, and other signals to distinguish between genuine users and attackers. The algorithms are constantly improved.

Pass-through Authentication forwards password validation requests to your on-premises Active Directory, so you need to prevent attackers from locking out your users’ Active Directory accounts. Active Directory has its own account lockout policies, specifically, [Account lockout threshold](https://technet.microsoft.com/library/hh994574(v=ws.11).aspx) and [Reset account lockout counter after](https://technet.microsoft.com/library/hh994568(v=ws.11).aspx) policies. Configure the Azure AD lockout threshold and lockout duration values appropriately to filter out attacks in the cloud before they reach your on-premises Azure AD.

>[!NOTE]
>The Smart Lockout feature is free and is _on_ by default for all customers. But, if you want to modify Azure AD’s Lockout Threshold and Lockout Duration values by using Graph API, your tenant needs to have at least one Azure AD Premium P2 license. You don't need an Azure AD Premium P2 license _per user_ to get the Smart Lockout feature with Pass-through Authentication.

To ensure that your users’ on-premises Azure AD accounts are well protected, you need to ensure that:

   * Azure AD’s lockout threshold is _less_ than the Active Directory account lockout threshold. Set the values so that Azure AD’s account lockout threshold is at least two or three times longer than the Azure AD’s lockout threshold.
   * Azure AD’s lockout duration that's represented in seconds, is _longer_ than Azure AD’s reset account lockout counter after that's represented in minutes.

>[!IMPORTANT]
>Currently an administrator can't unlock the users' cloud accounts if they have been locked out by the Smart Lockout capability. They must wait for the lockout duration to expire.

## Verify your Azure AD account lockout policies

Use the following instructions to verify your Azure AD account lockout policies:

1.	Open the Group Policy Management tool.
2.	Edit the group policy that's applied to all users, for example, the **Default Domain Policy**.
3.	Browse to **Computer Configuration** > **Policies** > **Windows Settings** > **Security Settings** > **Account Policies** > **Account Lockout Policy**.
4.	Verify your **Account lockout threshold** and **Reset account lockout counter after** values.

![Azure AD account lockout policies](./media/active-directory-aadconnect-pass-through-authentication/pta5.png)

## Use the Graph API to manage your tenant’s Smart Lockout values (requires a Premium license)

>[!IMPORTANT]
>Modifying Azure AD’s lockout threshold and lockout duration values by using Graph API is an Azure AD Premium P2 feature. It also needs you to be a global administrator on your tenant.

You can use [Graph Explorer](https://developer.microsoft.com/graph/graph-explorer) to read, set, and update Azure AD’s Smart Lockout values. You can also do these operations programmatically.

### View Smart Lockout values

Follow these steps to view your tenant’s Smart Lockout values:

1. Sign in to Graph Explorer as a global administrator of your tenant. If prompted, grant access for the requested permissions.
2. Select **Modify permissions**, and then select the **Directory.ReadWrite.All** permission.
3. Configure the Graph API request as follows: Set the version to **BETA**, the request type to **GET**, and the URL to `https://graph.microsoft.com/beta/<your-tenant-domain>/settings`.
4. Select **Run Query** to see your tenant's Smart Lockout values. If you haven't set your tenant's values before, you see an empty set.

### Set Smart Lockout values

Follow these steps to set your tenant’s Smart Lockout values (only required the first time):

1. Sign in to Graph Explorer as a global administrator of your tenant. If prompted, grant access for the requested permissions.
2. Select **Modify permissions**, and then select the **Directory.ReadWrite.All** permission.
3. Configure the Graph API request as follows: Set the version to **BETA**, the request type to **POST**, and the URL to `https://graph.microsoft.com/beta/<your-tenant-domain>/settings`.
4. Copy and paste the following JSON request into the **Request Body** field.
5. Select **Run Query** to set your tenant's Smart Lockout values.

```
{
  "templateId": "5cf42378-d67d-4f36-ba46-e8b86229381d",
  "values": [
    {
      "name": "LockoutDurationInSeconds",
      "value": "300"
    },
    {
      "name": "LockoutThreshold",
      "value": "5"
    },
    {
      "name" : "BannedPasswordList",
      "value": ""
    },
    {
      "name" : "EnableBannedPasswordCheck",
      "value": "false"
    }
  ]
}
```

>[!NOTE]
>If you don't use them, you can leave the **BannedPasswordList** and **EnableBannedPasswordCheck** values as empty (**""**) and **false** respectively.

Verify that you have set your tenant's Smart Lockout values correctly by using the [View Smart Lockout values](#view-smart-lockout-values) steps.

### Update Smart Lockout values

Follow these steps to update your tenant’s Smart Lockout values (if you have already set them before):

1. Sign in to Graph Explorer as a global administrator of your tenant. If prompted, grant access for the requested permissions.
2. Select **Modify permissions**, and then select the **Directory.ReadWrite.All** permission.
3. [Follow these steps to view your tenant's Smart Lockout values](#view-smart-lockout-values). Copy the `id` value (a GUID) of the item with **displayName** as the **PasswordRuleSettings**.
4. Configure the Graph API request as follows: Set the version to **BETA**, the request type to **PATCH**, and the URL to `https://graph.microsoft.com/beta/<your-tenant-domain>/settings/<id>`. Use the GUID from step 3 for the `<id>`.
5. Copy and paste the following JSON request into the **Request Body** field. Change the Smart Lockout values as appropriate.
6. Select **Run Query** to update your tenant's Smart Lockout values.

```
{
  "values": [
    {
      "name": "LockoutDurationInSeconds",
      "value": "30"
    },
    {
      "name": "LockoutThreshold",
      "value": "4"
    },
    {
      "name" : "BannedPasswordList",
      "value": ""
    },
    {
      "name" : "EnableBannedPasswordCheck",
      "value": "false"
    }
  ]
}
```

Verify that you have updated your tenant's Smart Lockout values correctly by using the [View Smart Lockout values](#view-smart-lockout-values) steps.

## Next steps
[**UserVoice**](https://feedback.azure.com/forums/169401-azure-active-directory/category/160611-directory-synchronization-aad-connect): Use the Azure Active Directory Forum to file new feature requests.
