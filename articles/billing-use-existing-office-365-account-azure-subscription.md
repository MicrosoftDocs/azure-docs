<properties
	pageTitle="Share a single Azure AD tenant across Office 365 and Azure subscriptions | Microsoft Azure"
	description="Learn how to share your Office 365 Azure AD tenant and its users with your Azure subscription, or vice versa"
	services=""
	documentationCenter=""
	authors="JiangChen79"
	manager="mbaldwin"
	editor=""
	tags="billing,top-support-issue"/>

<tags
	ms.service="billing"
	ms.workload="na"
	ms.tgt_pltfrm="ibiza"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/17/2016"
	ms.author="cjiang"/>

# Use an existing Office 365 account with your Azure subscription or vice versa
Scenario: You already have an Office 365 subscription and are ready for an Azure subscription, but you want to use the existing Office 365 user accounts for your Azure subscription. Alternatively, you are an Azure subscriber and want to get an Office 365 subscription for the users in your existing Azure Active Directory. This article shows you how easy it is to achieve both.

> [AZURE.NOTE] This article doesn’t apply to Enterprise Agreement (EA) customers. If you need more help at any point in this article, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.


## Quick guidance

- If you already have an Office 365 subscription and want to sign up for Azure, use the **Sign in with your organizational account** option. Then continue the Azure sign-up process with your Office 365 account. See [detailed steps later in this article](#s1).

- If you already have an Azure subscription and want to get an Office 365 subscription, sign in to Office 365 with your Azure account. Then proceed with the sign-up steps. After you complete the sign-up, the Office 365 subscription is added to the same Azure Active Directory instance that your Azure subscription belongs to. For more information, see the section [detailed steps later in this article](#s2).

>[AZURE.NOTE] To get an Office 365 subscription, the account you use for sign-up must be a member of the Global Admin or Billing Admin directory role in your Azure Active Directory tenant. [Learn how to determine the role in Azure Active Directory](#how-to-know-your-role-in-your-azure-active-directory).

To understand what happens when you add a subscription to an account, see the [background information later in the article](#background-information).

## Detailed steps
<a id="s1"></a>
### Scenario 1: Office 365 users who plan to buy Azure
In this scenario, we assume Kelley Wall is a user who has an Office 365 subscription, and is planning to subscribe to Azure. There are two additional active users, Jane and Tricia. Kelley’s account is admin@contoso.onmicrosoft.com.

![Office 365 user admin center](./media/billing-use-existing-office-365-account-azure-subscription/1-office365-users-admin-center.png)

To sign up for Azure, follow these steps:

1. Sign up for Azure at [Azure.com](https://azure.microsoft.com/). Click **Try for free**. On the next page, click **Start now**.

	![Try Azure for free.](./media/billing-use-existing-office-365-account-azure-subscription/2-azure-signup-try-free.png)

2. Click **Sign in with your organizational account**.

	![Sign in to Azure.](./media/billing-use-existing-office-365-account-azure-subscription/3-sign-in-to-azure.png)

3. Sign in with your Office 365 account. In this case, it is Kelley’s Office 365 account.

	![Sign in with your Office 365 account.](./media/billing-use-existing-office-365-account-azure-subscription/4-sign-in-with-org-account.png)

4. Fill in the information and complete the sign-up process.

	![Fill in information and complete sign-up.](./media/billing-use-existing-office-365-account-azure-subscription/5-azure-sign-up-fill-information.png)

	![Click Start managing my service.](./media/billing-use-existing-office-365-account-azure-subscription/6-azure-start-managing-my-service.png)

Now you're all set. In the Azure portal, you should see the same users appearing. To verify this, follow these steps:

1. Click **Start managing my service** in the screen shown previously.
2. Click **Browse**, and then click **Active Directory**.

	![Click Browse, and then click Active Directory.](./media/billing-use-existing-office-365-account-azure-subscription/7-azure-portal-browse-ad.png)

3. Click **USERS**.

	![The Users tab](./media/billing-use-existing-office-365-account-azure-subscription/8-azure-portal-ad-users-tab.png)

4. All the users, including Kelley, are listed as expected.

	![List of users](./media/billing-use-existing-office-365-account-azure-subscription/9-azure-portal-ad-users.png)

<a id="s2"></a>
### Scenario 2: Azure users who plan to buy Office 365

In this scenario, Kelley Wall is a user who has an Azure subscription under the account admin@contoso.onmicrosoft.com. Kelley wants to subscribe to Office 365 and use the same directory she already has with Azure.

>[AZURE.NOTE] To get an Office 365 subscription, the account you use for sign-in must be a member of the Global Admin or Billing Admin directory role in your Azure Active Directory tenant. [Learn how to know the role in Azure Active Directory](#how-to-know-your-role-in-your-azure-active-directory).

![Azure portal subscription settings](./media/billing-use-existing-office-365-account-azure-subscription/10-azure-portal-settings-subscription.png)

![Azure portal Active Directory users](./media/billing-use-existing-office-365-account-azure-subscription/11-azure-portal-ads-users.png)

To subscribe to Office 365, follow these steps:

1. Go to the [Office 365 product page](https://products.office.com/business), and then select a plan that is suitable for you.
2. After you select the plan, the following page is displayed. Do not fill in the form. Click **Sign in** on the upper-right corner of the page.

	![Office 365 trial page](./media/billing-use-existing-office-365-account-azure-subscription/12-office-365-trial-page.png)

3. Sign in with your account credentials. In this example, it is Kelley’s account.

	![Office 365 sign-in](./media/billing-use-existing-office-365-account-azure-subscription/13-office-365-sign-in.png)

4. Click **Try now**.

	![Confirm your order for Office 365.](./media/billing-use-existing-office-365-account-azure-subscription/14-office-365-confirm-your-order.png)

5. On the order receipt page, click **Continue**.

	![Office 365 order receipt](./media/billing-use-existing-office-365-account-azure-subscription/15-office-365-order-receipt.png)

Now you're all set. In the Office 365 admin center, you should see users from the Contoso directory showing up as active users. To verify this, follow these steps:

1. Open the Office 365 admin center.
2. Expand **USERS**, and then click **Active Users**.

	![Office 365 admin center users](./media/billing-use-existing-office-365-account-azure-subscription/16-office-365-admin-center-users.png)

### How to know your role in your Azure Active Directory

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. Click **Browse**, and then click **Active Directory**.

	![Active Directory in the Azure portal](./media/billing-use-existing-office-365-account-azure-subscription/7-azure-portal-browse-ad.png)

3. Click **USERS**.

	![Azure portal default Active Directory users](./media/billing-use-existing-office-365-account-azure-subscription/17-azure-portal-default-ad-users.png)

4. Click the user. In this example, the user is Kelley Wall.

	Notice the field of **ORGANIZATIONAL ROLE**.

	![Azure portal user identity](./media/billing-use-existing-office-365-account-azure-subscription/18-azure-portal-user-identity.png)

## Background information about Azure and Office 365 subscriptions
Office 365 and Azure use the Azure Active Directory service to manage users and subscriptions. Consider an Azure directory as a container in which you can group users and subscriptions. To use the same user account for your Azure and Office 365 subscriptions, you need to make sure that the subscriptions are created in the same directory. Keep in mind the following points:

- A subscription gets created under a directory, not the other way around.
- Users belong to directories, not the other way around.
- A subscription lands in the directory of the user who creates the subscription. As a result, your Office 365 subscription is tied to the same account as your Azure subscription when you use that account to create the Office 365 subscription.

![Background information](./media/billing-use-existing-office-365-account-azure-subscription/19-background-information.png)

For more information, see [How Azure subscriptions are associated with Azure Active Directory](./active-directory/active-directory-how-subscriptions-associated-directory.md).

>[AZURE.NOTE] Azure subscriptions are owned by individual users in the directory.

>[AZURE.NOTE] Office 365 subscriptions are owned by the directory itself. If users within the directory have the requisite permissions, they can operate on these subscriptions.

## Next steps
If you acquired both your Azure and Office 365 subscriptions separately in the past, and you want to be able to access the Office 365 tenant from the Azure subscription, see [Associate an Office 365 tenant with an Azure subscription](billing-add-office-365-tenant-to-azure-subscription.md).

> [AZURE.NOTE] If you still have questions, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
