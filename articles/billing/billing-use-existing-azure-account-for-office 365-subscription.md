---
title: Sign up for Office 365 with Azure account | Microsoft Docs
description: Learn how to create an Office 365 subscription by using an Azure account 
services: ''
documentationcenter: ''
author: JiangChen79
manager: vikdesai
editor: ''
tags: billing,top-support-issue

ms.assetid: 
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 04/03/2017
ms.author: cjiang

---
# Sign up for an Office 365 subscription with your Azure account
If you're Azure subscriber, use your Azure account to sign up for an Office 365 subscription. If you're part of an organization that has an Azure subscription, you can create an Office 365 subscription for users in your existing Azure Active Directory (Azure AD). Sign up to Office 365 using an account that's a member of the Global Admin or Billing Admin directory role in your Azure Active Directory tenant. For more information, see [Check my account permissions in Azure AD](#RoleInAzureAD) and [Assigning administrator roles in Azure Active Directory](../active-directory/active-directory-assign-admin-roles.md).

If you already have both an Office 365 account and an Azure subscription, see [Associate an Office 365 tenant to an Azure subscription](billing-add-office-365-tenant-to-azure-subscription.md).

This article doesn’t apply to Enterprise Agreement (EA) customers. 

## Get an Office 365 subscription by using your Azure account

1. Go to the [Office 365 product page](https://products.office.com/business), and select a plan.
2. Click **Sign in** on the upper-right corner of the page.

    ![Office 365 trial page](./media/billing-use-existing-office-365-account-azure-subscription/12-office-365-trial-page.png)
3. Sign in with your Azure account credentials. If you're creating a subscription for your organization, use an Azure account that's a member of the Global Admin or Billing Admin directory role in your Azure Active Directory tenant.

    ![Office 365 sign-in](./media/billing-use-existing-office-365-account-azure-subscription/13-office-365-sign-in.png)
4. Click **Try now**.

    ![Confirm your order for Office 365.](./media/billing-use-existing-office-365-account-azure-subscription/14-office-365-confirm-your-order.png)
5. On the order receipt page, click **Continue**.

    ![Office 365 order receipt](./media/billing-use-existing-office-365-account-azure-subscription/15-office-365-order-receipt.png)

Now you're all set. 
If you created the Office 365 subscription for your organization, use the following steps to check that your Azure AD users are now in Office 365.

1. Open the Office 365 admin center.
2. Expand **USERS**, and then click **Active Users**.

    ![Office 365 admin center users](./media/billing-use-existing-office-365-account-azure-subscription/16-office-365-admin-center-users.png)

After you sign up, the Office 365 subscription is added to the same Azure Active Directory instance that your Azure subscription belongs to. For more information, see [More about Azure and Office 365 subscriptions](billing-use-existing-office-365-account-azure-subscription.md#MoreAboutSubs) and [How Azure subscriptions are associated with Azure Active Directory](../active-directory/active-directory-how-subscriptions-associated-directory.md).

## <a id="RoleInAzureAD"></a>Check my account permissions in Azure AD
1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **Browse**, and then click **Active Directory**.

    ![Active Directory in the Azure portal](./media/billing-use-existing-office-365-account-azure-subscription/7-azure-portal-browse-ad.png)
3. Click **USERS**.

    ![Azure portal default Active Directory users](./media/billing-use-existing-office-365-account-azure-subscription/17-azure-portal-default-ad-users.png)
4. Click the account name. 
5. The account's **ORGANIZATIONAL ROLE** must be **Global Admin** or **Billing Admin** to get an Office 365 subscription for users in your existing Azure Active Directory.
  
    ![Azure portal user identity](./media/billing-use-existing-office-365-account-azure-subscription/18-azure-portal-user-identity.png)


## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly. 