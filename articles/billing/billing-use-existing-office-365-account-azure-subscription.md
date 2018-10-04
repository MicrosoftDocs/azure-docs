---
title: Sign up for Azure with Office 365 account | Microsoft Docs
description: Learn how to create an Azure subscription by using an Office 365 account 
services: ''
documentationcenter: ''
author: JiangChen79
manager: adpick
editor: ''
tags: billing,top-support-issue

ms.assetid: 129cdf7a-2165-483d-83e4-8f11f0fa7f8b
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: conceptual
ms.date: 06/15/2018
ms.author: cwatson

---
# Sign up for an Azure subscription with your Office 365 account
If you have an Office 365 subscription, you can use your Office 365 account to create an Azure subscription. Sign in to the [Azure portal](https://portal.azure.com/) using your Office 365 user name and password. If you want to set up virtual machines or use other Azure services, you must sign up for an Azure subscription. You can share your Azure subscription with others and [use Role-Based Access Control to manage access to your Azure subscription and resources](https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal)

If you already have both an Office 365 account and an Azure subscription, see [Associate an Office 365 tenant to an Azure subscription](billing-add-office-365-tenant-to-azure-subscription.md).

## Get an Azure subscription using your Office 365 account

Save time and avoid account proliferation by signing up for Azure using your Office 365 user name and password. 

1. Sign up at [Azure.com](https://account.azure.com/signup?offer=MS-AZR-0044p&appId=docs). 
2. Sign in by using your Office 365 user name and password. The account you use doesn't need to have administrator permissions. If you have more than one Office 365 account, make sure you use the credentials for the Office 365 account that you want to associate with your Azure subscription. 

   ![Screenshot that shows the sign-in page.](./media/billing-use-existing-office-365-account-azure-subscription/billing-sign-in-with-office-365-account.png)

3. Enter the required information and complete the sign-up process. Some information may not be required if you already have an Office 365 account.

    ![Screenshot that shows the sign-up form.](./media/billing-use-existing-office-365-account-azure-subscription/billing-azure-sign-up-fill-information.png)

- If you need to add other people in your organization to the Azure subscription, see [Get started with access management in the Azure portal](../role-based-access-control/overview.md). 

## <a id="more-about-subs">More about Azure and Office 365 subscriptions</a>
Office 365 and Azure use the Azure AD service to manage users and subscriptions. The Azure directory is like a container in which you can group users and subscriptions. To use the same user accounts for your Azure and Office 365 subscriptions, you need to make sure that the Azure subscriptions are created in the same directory as the Office 365 subscriptions. Keep in mind the following points:

* A subscription gets created under a directory
* Users belong to directories
* A subscription lands in the directory of the user who creates the subscription. So your Office 365 subscription is tied to the same account as your Azure subscription.
* Azure subscriptions are owned by individual users in the directory
* Office 365 subscriptions are owned by the directory itself. Users with the right permissions within the directory can manage these subscriptions.

![Screenshot that shows the relationship of the directory, users, and subscriptions.](./media/billing-use-existing-office-365-account-azure-subscription/19-background-information.png)

For more information, see [How Azure subscriptions are associated with Azure Active Directory](../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly. 
