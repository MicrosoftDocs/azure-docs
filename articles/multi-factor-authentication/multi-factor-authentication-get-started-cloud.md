---
title: Get started Azure MFA in the cloud | Microsoft Docs
description: This is the Microsoft Azure Multi-Factor authentication page that describes how to get started with Azure MFA in the cloud.
services: multi-factor-authentication
documentationcenter: ''
author: kgremban
manager: femila
editor: yossib

ms.assetid: 6b2e6549-1a26-4666-9c4a-cbe5d64c4e66
ms.service: multi-factor-authentication
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 06/24/2017
ms.author: kgremban

---
# Getting started with Azure Multi-Factor Authentication in the cloud
This article walks through how to get started using Azure Multi-Factor Authentication in the cloud.

> [!NOTE]
> The following documentation provides information on how to enable users using the **Azure Classic Portal**. If you are looking for information on how to set up Azure Multi-Factor Authentication for O365 users, see [Set up multi-factor authentication for Office 365.](https://support.office.com/article/Set-up-multi-factor-authentication-for-Office-365-users-8f0454b2-f51a-4d9c-bcde-2c48e41621c6?ui=en-US&rs=en-US&ad=US)

![MFA in the Cloud](./media/multi-factor-authentication-get-started-cloud/mfa_in_cloud.png)

## Prerequisite
[Sign up for an Azure subscription](https://azure.microsoft.com/pricing/free-trial/) - If you do not already have an Azure subscription, you need to sign-up for one. If you are just starting out and using Azure MFA you can use a trial subscription

## Enable Azure Multi-Factor Authentication
As long as your users have licenses that include Azure Multi-Factor Authentication, there's nothing that you need to do to turn on Azure MFA. You can start requiring two-step verification on an individual user basis. The licenses that enable Azure MFA are:
- Azure Multi-Factor Authentication
- Azure Active Directory Premium
- Enterprise Mobility + Security

If you don't have one of these three licenses, or you don't have enough licenses to cover all of your users, that's ok too. You just have to do an extra step and [Create a Multi-Factor Auth Provider](multi-factor-authentication-get-started-auth-provider.md) in your directory.

## Turn on two-step verification for users

Use one of the procedures listed in [How to require two-step verification for a user or group](multi-factor-authentication-get-started-user-states.md) to start using Azure MFA. You can choose to enforce two-step verification for all sign-ins, or you can create conditional access policies to require two-step verification only when it matters to you.

## Next Steps
Now that you have set up Azure Multi-Factor Authentication in the cloud, you can configure and set up your deployment. See [Configuring Azure Multi-Factor Authentication](multi-factor-authentication-whats-next.md) for more details.

