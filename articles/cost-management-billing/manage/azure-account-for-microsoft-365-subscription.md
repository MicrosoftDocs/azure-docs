---
title: Sign up for Microsoft 365 with Azure account
description: Learn how to create a Microsoft 365 subscription by using an Azure account. You can also associate existing Azure and Microsoft 365 accounts with each other.
author: JiangChen79
ms.reviewer: adwise
tags: billing,top-support-issue
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 08/20/2020
ms.author: banders
---

# Sign up for a Microsoft 365 subscription with your Azure account

If you're Azure subscriber, you can use your Azure account to sign up for a Microsoft 365 subscription. If you're part of an organization that has an Azure subscription, you can create Microsoft 365 subscriptions for users in your existing Azure Active Directory (Azure AD). Sign up for Microsoft 365 using an account that has Global Admin or Billing Admin permissions in your Azure Active Directory tenant. For more information, see [Check my account permissions in Azure AD](#RoleInAzureAD) and [Assigning administrator roles in Azure Active Directory](../../active-directory/users-groups-roles/directory-assign-admin-roles.md).

If you already have both a Microsoft 365 account and an Azure subscription, you can [Associate a Microsoft 365 tenant to an Azure subscription](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## Get a Microsoft 365 subscription by using your Azure account

1. Go to the [Microsoft 365 product page](https://www.microsoft.com/microsoft-365/business/all-business), and select a plan.
2. Click **Sign in** on the upper-right corner of the page.

    ![screenshot of Microsoft 365 trial page](./media/azure-account-for-microsoft-365-subscription/12-office-365-trial-page.png)
3. Sign in with your Azure account credentials. If you're creating a subscription for your organization, use an Azure account that's a member of the Global Admin or Billing Admin directory role in your Azure Active Directory tenant.

    ![Screenshot of Microsoft sign-in](./media/azure-account-for-microsoft-365-subscription/13-office-365-sign-in.png)
4. Click **Try now**.

    ![Screenshot that confirms your order for Microsoft 365.](./media/azure-account-for-microsoft-365-subscription/14-office-365-confirm-your-order.png)
5. On the order receipt page, click **Continue**.

    ![Screenshot of the Microsoft 365 order receipt](./media/azure-account-for-microsoft-365-subscription/15-office-365-order-receipt.png)

Now you're all set. If you created the Microsoft 365 subscription for your organization, use the following steps to check that your Azure AD users are now in Microsoft 365.

1. Open the Microsoft 365 admin center.
2. Expand **USERS**, and then click **Active Users**.

    ![Screenshot of the Microsoft 365 admin center users](./media/azure-account-for-microsoft-365-subscription/16-microsoft-365-admin-center-users.png)

After you sign up, the Microsoft 365 subscription is added to the same Azure Active Directory instance that your Azure subscription belongs to. For more information, see [More about Azure and Microsoft 365 subscriptions](microsoft-365-account-for-azure-subscription.md#more-about-subs) and [How Azure subscriptions are associated with Azure Active Directory](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md).

## <a id="RoleInAzureAD"></a>Check my account permissions in Azure AD
1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **All services**, and then search for **Active Directory**.

    ![Screenshot of Active Directory in the Azure portal](./media/azure-account-for-microsoft-365-subscription/billing-more-services-active-directory.png)
3. Click **Users and groups** > **All users**.
4. Select the user name.

    ![Screenshot that shows the Azure Active Directory users](./media/azure-account-for-microsoft-365-subscription/billing-users-groups.png)

5. Click **Directory role**.

    ![Screenshot that shows the Azure portal directory role](./media/azure-account-for-microsoft-365-subscription/billing-user-directory-role.png)
6.  The role **Global administrator** or **Limited administrator** > **Billing administrator** is required to create a Microsoft 365 subscription for users in your existing Azure Active Directory.

    ![Screenshot that shows Azure portal directory role Billing Admin](./media/azure-account-for-microsoft-365-subscription/billing-directoryrole-limited.png)

## Need help? Contact us.

If you have questions or need help,  [create a support request](https://go.microsoft.com/fwlink/?linkid=2083458).

## Next steps

- [Associate a Microsoft 365 tenant to an Azure subscription](../../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md)
