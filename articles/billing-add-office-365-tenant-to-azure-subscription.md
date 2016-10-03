<properties
	pageTitle="Use an Office 365 tenant with an Azure subscription | Microsoft Azure"
	description="Learn how to add an Office 365 directory (tenant) to an Azure subscription to make the association."
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
	ms.date="09/16/2016"
	ms.author="cjiang"/>

# Associate an Office 365 tenant with an Azure subscription
If you acquired both Azure and Office 365 subscriptions separately in the past, and now you want to be able to access the Office 365 tenant from the Azure subscription, it's easy to do so. This article shows you how.

> [AZURE.NOTE] This article doesn’t apply to Enterprise Agreement (EA) customers.

## Quick guidance
To associate your Office 365 tenant with your Azure subscription, use your Azure account to add your Office 365 tenant, and then associate your Azure subscription with the Office 365 tenant.

## Detailed steps
In this scenario, Kelley Wall is a user who has an Azure subscription under the account kelley.wall@outlook.com. Kelley also has an Office 365 subscription under the account kelley.wall@contoso.onmicrosoft.com. Now Kelley wants to access the Office 365 tenant with the Azure subscription.

![Screenshot of Azure Active Directory status](./media/billing-add-office-365-tenant-to-azure-subscription/s31_msa-aad-status.png)

![Screenshot of Office 365 admin center active users](./media/billing-add-office-365-tenant-to-azure-subscription/s32_office-365-user.png)

### Prerequisites
For the association to work properly, the following prerequisites are necessary:

- You need the credentials of the service administrator of the Azure subscription. Co-administrators cannot execute a subset of the steps.
- You need the credentials of a global administrator of the Office 365 tenant.
- The email address of the service administrator must not be contained in the Office 365 tenant.
- The email address of the service administrator must not match that of any global administrator of the Office 365 tenant.
- If you are currently using an email address that is both a Microsoft account and an organizational account, temporarily change the service administrator of your Azure subscription to use another Microsoft account. You can create a new Microsoft account at the [Microsoft account signup page](https://signup.live.com/).


To change your service administrator, follow these steps:

1. Sign in to the [Account Management portal](https://account.windowsazure.com/subscriptions).
2. Select the subscription you want to change.
3. Select **Edit subscription details**.

    ![Screenshot of Azure subscription information, with "Edit subscription details" highlighted](./media/billing-add-office-365-tenant-to-azure-subscription/s33_azure-edit-subscription-details.png)

4. In the **SERVICE ADMINISTRATOR** box, enter the email address of the new service administrator.

    ![Screenshot of "Edit your subscription" dialog box](./media/billing-add-office-365-tenant-to-azure-subscription/s34_change-subscription-service-admin.png)

### Associate the Office 365 tenant with the Azure subscription
To associate the Office 365 tenant with the Azure subscription, follow these steps:

1. 	Sign in to the [Account Management portal](https://account.windowsazure.com/subscriptions) with the service administrator credentials.
2.	In the left pane, select **ACTIVE DIRECTORY**.

	![Screenshot of Active Directory entry](./media/billing-add-office-365-tenant-to-azure-subscription/s35-classic-portal-active-directory-entry.png)

	> [AZURE.NOTE] You should not see the Office 365 tenant. If you see it, skip the next step.

	![Screenshot of the default directory of Azure Active Directory](./media/billing-add-office-365-tenant-to-azure-subscription/s36-aad-tenant-default.png)

3. Add the Office 365 tenant to your Azure subscription.

	a. Select **NEW** > **DIRECTORY** > **CUSTOM CREATE**.

	![Screenshot of Azure Active Directory custom create](./media/billing-add-office-365-tenant-to-azure-subscription/s37-aad-custom-create.png)

	b. On the **Add directory** page, under **DIRECTORY**, select **Use existing directory**. Then select **I am ready to be signed out now**, and select **Complete** ![complete-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s38_complete-icon.png).

	![Screenshot of "Use existing directory"](./media/billing-add-office-365-tenant-to-azure-subscription/s39_add-directory-use-existing.png)

	c. After you are signed out, sign in with the global administrator’s credentials of your Office 365 tenant.

	![Screenshot of Office 365 global administrator sign-in](./media/billing-add-office-365-tenant-to-azure-subscription/s310_sign-in-global-admin-office-365.png)

	d. Select **Continue**.

	![Screenshot of verification](./media/billing-add-office-365-tenant-to-azure-subscription/s311_use-contoso-directory-azure-verify.png)

	e. Select **Sign out now**.

	![Screenshot of sign-out](./media/billing-add-office-365-tenant-to-azure-subscription/s312_use-contoso-directory-azure-confirm-and-sign-out.png)

	f. Sign in to the [Account Management portal](https://account.windowsazure.com/subscriptions) with the service administrator credentials.

	![Screenshot of Azure sign-in](./media/billing-add-office-365-tenant-to-azure-subscription/s313_azure-sign-in-service-admin.png)

	g. You should see your Office 365 tenant in the dashboard.

	![Screenshot of dashboard](./media/billing-add-office-365-tenant-to-azure-subscription/s314_office-365-tenant-appear-in-azure.png)

4. Change the directory associated with the Azure subscription.

	a. Select **Settings**.

	![Screenshot of Azure classic portal settings icon](./media/billing-add-office-365-tenant-to-azure-subscription/s315_azure-classic-portal-settings-icon.png)

	b. Select your Azure subscription, and then select **EDIT DIRECTORY**.
	![Screenshot of Azure subscription edit directory](./media/billing-add-office-365-tenant-to-azure-subscription/s316_azure-subscription-edit-directory.png)

	c. Select **Next** ![next-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s317_next-icon.png).

	![Screenshot of "Change the associated directory"](./media/billing-add-office-365-tenant-to-azure-subscription/s318_azure-change-associated-directory.png)

	> [AZURE.WARNING] You will receive a warning that all co-administrators will be removed.

	![azure-confirm-directory-mapping](./media/billing-add-office-365-tenant-to-azure-subscription/s322_azure-confirm-directory-mapping.png)

	>[AZURE.WARNING] Additionally, all [Role-Based Access Control (RBAC)](./active-directory/role-based-access-control-configure.md) users with Assigned access in the existing resource groups will also be removed. However, the warning you receive only mentions the removal of co-administrators.

	![assigned-users-removed-resource-groups](./media/billing-add-office-365-tenant-to-azure-subscription/s325_assigned-users-removed-resource-groups.png)

	d. Select **Complete** ![complete-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s38_complete-icon.png).

5. Now you can add your Office 365 organizational accounts as co-administrators to the Azure Active Directory tenant.

	a. Select the **ADMINISTRATORS** tab, and then select **ADD**.

	![Screenshot of Azure classic portal settings administrators tab](./media/billing-add-office-365-tenant-to-azure-subscription/s319_azure-classic-portal-settings-administrators.png)

	b. Enter an organizational account of your Office 365 tenant, select the Azure subscription, and then select **Complete** ![complete-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s38_complete-icon.png).

	![Screenshot of Azure add co-administrator dialog box](./media/billing-add-office-365-tenant-to-azure-subscription/s320_azure-add-co-administrator.png)

	c. Go back to the **ADMINISTRATORS** tab. You should see the organizational account displayed as co-administrator.

	![Screenshot of administrators tab](./media/billing-add-office-365-tenant-to-azure-subscription/s321_azure-co-administrator-added.png)

6. Next you can test access with the co-administrator.

	a. Sign out of the Account Management portal.

	b. Open the [Account Management portal](https://account.windowsazure.com/subscriptions) or the [Azure portal](https://portal.azure.com/).

	c. If the Azure sign-in page has a link of **Sign in with your organization account**, select the link. Otherwise, skip this step.

	![Screenshot of Azure sign-in page](./media/billing-add-office-365-tenant-to-azure-subscription/3-sign-in-to-azure.png)

	d. Enter the credentials of the co-administrator, and then select **Sign in**.

	![Screenshot of Azure sign-in page](./media/billing-add-office-365-tenant-to-azure-subscription/s324_azure-sign-in-with-co-admin.png)

## Next steps
Related scenarios include:

- You already have an Office 365 subscription and are ready for an Azure subscription, but you want to use the existing Office 365 user accounts for your Azure subscription.
- You are an Azure subscriber and want to get an Office 365 subscription for the users in your existing Azure Active Directory instance.

To learn how to accomplish these tasks, see [Use your existing Office 365 account with your Azure subscription, or vice versa](billing-use-existing-office-365-account-azure-subscription.md).
