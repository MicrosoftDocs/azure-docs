---
title: Get started Azure Multi-Factor Auth Provider | Microsoft Docs
description: Learn how to create an Azure Multi-Factor Auth Provider.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila

ms.assetid: a7dd5030-7d40-4654-8fbd-88e53ddc1ef5
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/28/2017
ms.author: kgremban
ms.reviewer: yossib
ms.custom: it-pro
---

# Getting started with an Azure Multi-Factor Auth Provider
Two-step verification is available by default for global administrators who have Azure Active Directory, and Office 365 users. However, if you wish to take advantage of [advanced features](multi-factor-authentication-whats-next.md) then you should purchase the full version of Azure Multi-Factor Authentication (MFA).

An Azure Multi-Factor Auth Provider is used to take advantage of features provided by the full version of Azure MFA. It is for users who **do not have licenses through Azure MFA, Azure AD Premium, or Enterprise Mobility + Security (EMS)**.  Azure MFA, Azure AD Premium, and EMS include the full version of Azure MFA by default. If you have licenses, then you do not need an Azure Multi-Factor Auth Provider.

An Azure Multi-Factor Auth provider is required to download the SDK.

> [!IMPORTANT]
> To download the SDK, create an Azure Multi-Factor Auth Provider even if you have Azure MFA, AAD Premium, or EMS licenses.  If you create an Azure Multi-Factor Auth Provider for this purpose and already have licenses, be sure to create the Provider with the **Per Enabled User** model. Then, link the Provider to the directory that contains the Azure MFA, Azure AD Premium, or EMS licenses. This configuration ensures that you are only billed if you have more unique users performing two-step verification than the number of licenses you own.

## What is an Azure Multi-Factor Auth Provider?

If you don't have licenses for Azure Multi-Factor Authentication, you can create an auth provider to require two-step verification for your users. If you are developing a custom app and want to enable Azure MFA, create an auth provider and [download the SDK](multi-factor-authentication-sdk.md).

There are two types of auth providers, and the distinction is around how your Azure subscription is charged. The per-authentication option calculates the number of authentications performed against your tenant in a month. This option is best if you have a number of users authenticating only occasionally, like if you require MFA for a custom application. The per-user option calculates the number of individuals in your tenant who perform two-step verification in a month. This option is best if you have some users with licenses but need to extend MFA to more users beyond your licensing limits.

## Create a Multi-Factor Auth Provider
Use the following steps to create an Azure Multi-Factor Auth Provider.

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com) as an administrator.
2. On the left, select **Active Directory**.
3. On the Active Directory page, at the top, select **Multi-Factor Authentication Providers**.
   
   ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider1.png)

4. At the bottom, click **New**.
   
   ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider2.png)

5. Under App Services, select **Multi-Factor Auth Provider**
   
   ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider3.png)

6. Select **Quick Create**.
   
   ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider4.png)

7. Fill in the following fields and select **Create**.
   1. **Name** – The name of the Multi-Factor Auth Provider.
   2. **Usage Model** – Choose one of two options:
      * Per Authentication – purchasing model that charges per authentication. Typically used for scenarios that use Azure Multi-Factor Authentication in a consumer-facing application.
      * Per Enabled User – purchasing model that charges per enabled user. Typically used for employee access to applications such as Office 365. Choose this option if you have some users that are already licensed for Azure MFA.
   3. **Directory** – The Azure Active Directory tenant that the Multi-Factor Authentication Provider is associated with. Be aware of the following:
      * You do not need an Azure AD directory to create a Multi-Factor Auth Provider. Leave the box blank if you are only planning to use the Azure Multi-Factor Authentication Server or SDK.
      * The Multi-Factor Auth Provider must be associated with an Azure AD directory to take advantage of the advanced features.
      * Azure AD Connect, AAD Sync, or DirSync are only a requirement if you are synchronizing your on-premises Active Directory environment with an Azure AD directory.  If you only use an Azure AD directory that is not synchronized, then this is not required.
        
        ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider5.png)

8. Once you click create, the Multi-Factor Authentication Provider is created and you should see a message stating: **Successfully created Multi-Factor Authentication Provider**. Click **Ok**.
   
   ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider6.png)  
