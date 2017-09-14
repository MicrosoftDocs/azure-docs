---
title: Get started Azure Multi-Factor Auth Provider | Microsoft Docs
description: Learn how to create an Azure Multi-Factor Auth Provider.
services: multi-factor-authentication
documentationcenter: ''
author: MicrosoftGuyJFlo
manager: femila

ms.assetid: a7dd5030-7d40-4654-8fbd-88e53ddc1ef5
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 07/28/2017
ms.author: joflore
ms.reviewer: yossib
ms.custom: it-pro
---

# Getting started with an Azure Multi-Factor Authentication Provider
Two-step verification is available by default for global administrators who have Azure Active Directory, and Office 365 users. However, if you wish to take advantage of [advanced features](multi-factor-authentication-whats-next.md) then you should purchase the full version of Azure Multi-Factor Authentication (MFA).

An Azure Multi-Factor Auth Provider is used to take advantage of features provided by the full version of Azure MFA. It is for users who **do not have licenses through Azure MFA, Azure AD Premium, or Enterprise Mobility + Security (EMS)**.  Azure MFA, Azure AD Premium, and EMS include the full version of Azure MFA by default. If you have licenses, then you do not need an Azure Multi-Factor Auth Provider.

An Azure Multi-Factor Auth provider is required to download the SDK.

> [!IMPORTANT]
> To download the SDK, you need to create an Azure Multi-Factor Auth Provider even if you have Azure MFA, AAD Premium, or EMS licenses.  If you create an Azure Multi-Factor Auth Provider for this purpose and already have licenses, be sure to create the Provider with the **Per Enabled User** model. Then, link the Provider to the directory that contains the Azure MFA, Azure AD Premium, or EMS licenses. This configuration ensures that you are only billed if you have more unique users performing two-step verification than the number of licenses you own.

## What is an MFA Provider?

If you don't have licenses for Azure Multi-Factor Authentication, you can create an auth provider to require two-step verification for your users. If you are developing a custom app and want to enable Azure MFA, create an auth provider and [download the SDK](multi-factor-authentication-sdk.md).

There are two types of auth providers, and the distinction is around how your Azure subscription is charged. The per-authentication option calculates the number of authentications performed against your tenant in a month. This option is best if you have a number of users authenticating only occasionally, like if you require MFA for a custom application. The per-user option calculates the number of individuals in your tenant who perform two-step verification in a month. This option is best if you have some users with licenses but need to extend MFA to more users beyond your licensing limits.

## Create an MFA Provider - Public preview

Use the following steps to create an Azure Multi-Factor Authentication Provider in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com) as an administrator. 
2. Select **Azure Active Directory** > **Multi-Factor Authentication**.
3. Select **Providers**.
4. Select **Add**.
5. Fill in the following fields and then select **Add**:
   - **Name** – The name of the Provider.
   - **Usage Model** – Choose one of two options:
      * Per Authentication – purchasing model that charges per authentication. Typically used for scenarios that use Azure Multi-Factor Authentication in a consumer-facing application.
      * Per Enabled User – purchasing model that charges per enabled user. Typically used for employee access to applications such as Office 365. Choose this option if you have some users that are already licensed for Azure MFA.
   - **Subscription** – The Azure subscription that is charged for two-step verification activity through the Provider. 
   - **Directory** – The Azure Active Directory tenant that the Provider is associated with. Be aware of the following:
      * You do not need an Azure AD directory to create a Provider. Leave this box blank if you are only planning to download the Azure Multi-Factor Authentication Server or SDK.
      * The Provider must be associated with an Azure AD directory to take advantage of the advanced features.
      * Only one Provider can be associated with any one Azure AD directory.

## Create an MFA Provider
Use the following steps to create an Azure Multi-Factor Authentication Provider in the classic portal:

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
   1. **Name** – The name of the Provider.
   2. **Usage Model** – Choose one of two options:
      * Per Authentication – purchasing model that charges per authentication. Typically used for scenarios that use Azure Multi-Factor Authentication in a consumer-facing application.
      * Per Enabled User – purchasing model that charges per enabled user. Typically used for employee access to applications such as Office 365. Choose this option if you have some users that are already licensed for Azure MFA.
   3. **Directory** – The Azure Active Directory tenant that the Provider is associated with. Be aware of the following:
      * You do not need an Azure AD directory to create a Provider. Leave this box blank if you are only planning to download the Azure Multi-Factor Authentication Server or SDK.
      * The Provider must be associated with an Azure AD directory to take advantage of the advanced features.
      * Only one Provider can be associated with any one Azure AD directory.  
      ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider5.png)

8. Once you click create, the Multi-Factor Authentication Provider is created and you should see a message stating: **Successfully created Multi-Factor Authentication Provider**. Click **Ok**.  
   
   ![Creating an MFA Provider](./media/multi-factor-authentication-get-started-auth-provider/authprovider6.png)  

## Manage your MFA Provider

You cannot change the usage model (per enabled user or per authentication) after an MFA provider is created. However, you can delete the MFA provider and then create one with a different usage model.

If the current Multi-Factor Auth Provider is associated with an Azure AD directory (also known as an Azure AD tenant), you can safely delete the MFA provider and create one that is linked to the same Azure AD tenant. Alternatively, if you purchased enough MFA, Azure AD Premium, or Enterprise Mobility + Security (EMS) licenses to cover all users that are enabled for MFA, you can delete the MFA provider altogether.

If your MFA provider is not linked to an Azure AD tenant, or you link the new MFA provider to a different Azure AD tenant, user settings and configuration options are not transferred. Also, existing Azure MFA Servers need to be reactivated using activation credentials generated through the new MFA Provider. Reactivating the MFA Servers to link them to the new MFA Provider doesn't impact phone call and text message authentication, but mobile app notifications will stop working for all users until they reactivate the mobile app.

## Next steps

[Download the Multi-Factor Authentication SDK](multi-factor-authentication-sdk.md)

[Configure Multi-Factor Authentication settings](multi-factor-authentication-whats-next.md)
