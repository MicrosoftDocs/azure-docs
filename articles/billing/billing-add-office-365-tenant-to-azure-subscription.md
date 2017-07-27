---
title: Use an Office 365 tenant with an Azure subscription | Microsoft Docs
description: Learn how to add an Office 365 directory (tenant) to an Azure subscription.
services: ''
documentationcenter: ''
author: JiangChen79
manager: jlian
editor: ''
tags: billing,top-support-issue

ms.assetid: cc9c57c6-7bfd-4dea-9027-c75ef3737589
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: ibiza
ms.devlang: na
ms.topic: article
ms.date: 06/13/2017
ms.author: cjiang

---
# Associate an Office 365 tenant to an Azure subscription
Link your separate Azure and Office 365 subscriptions so that you can access the Office 365 tenant from your Azure subscription. To link your subscriptions, sign in to Azure with the Azure service administrator account, add a directory, and add the Office 365 organizational accounts to the Azure Active Directory tenant.

If you want an Office 365 subscription for users in your Azure Active Directory instance or you have an Office 365 account but not an Azure account, see [Sign up for Azure with Office 365 account](billing-use-existing-office-365-account-azure-subscription.md). 

## Before you begin
* You must have the credentials of the Azure subscription service administrator. Co-administrator accounts can't do some of the steps in this article. To change your service administrator, see [How to add or change Azure administrator roles](billing-add-change-azure-subscription-administrator.md#change-service-administrator-for-a-subscription).
* You must have the credentials of a global administrator of the Office 365 tenant.
* The email address of the service administrator must not be in the Office 365 tenant.
* The email address of the service administrator must not match that of any global administrator of the Office 365 tenant.
* If you use an email address that is both a Microsoft account and an organizational account, temporarily change the service administrator of your Azure subscription to use another Microsoft account. You can create a Microsoft account at the [Microsoft account signup page](https://signup.live.com/).

## Link Office 365 tenant to Azure subscription
To associate the Office 365 tenant to the Azure subscription, follow these steps:

### Step 1: Add Office 365 tenant to your Azure subscription

1. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with the service administrator credentials.

    ![Screenshot of Azure sign-in](./media/billing-add-office-365-tenant-to-azure-subscription/s313_azure-sign-in-service-admin.png)

2. In the left pane, select **ACTIVE DIRECTORY**. You shouldn't see the Office 365 tenant. If you see it, skip to [Step 2: Change the directory associated with the Azure subscription](#Step2).
   
   ![Screenshot of Active Directory entry](./media/billing-add-office-365-tenant-to-azure-subscription/s35-classic-portal-active-directory-entry.png)

3. Select **NEW** > **DIRECTORY** > **CUSTOM CREATE**.
   
    ![Screenshot of Azure Active Directory custom create](./media/billing-add-office-365-tenant-to-azure-subscription/s37-aad-custom-create.png)
   
4. On the **Add directory** page, under **DIRECTORY**, select **Use existing directory**. Then select **I am ready to be signed out now**, and select **Complete** ![complete-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s38_complete-icon.png).
   
    ![Screenshot of "Use existing directory"](./media/billing-add-office-365-tenant-to-azure-subscription/s39_add-directory-use-existing.png)
   
5. After you are signed out, sign in with the global administrator’s credentials of your Office 365 tenant.
   
    ![Screenshot of Office 365 global administrator sign-in](./media/billing-add-office-365-tenant-to-azure-subscription/s310_sign-in-global-admin-office-365.png)
   
6. Select **Continue**.
   
    ![Screenshot of verification](./media/billing-add-office-365-tenant-to-azure-subscription/s311_use-contoso-directory-azure-verify.png)
   
7. Select **Sign out now**.
   
    ![Screenshot of sign-out](./media/billing-add-office-365-tenant-to-azure-subscription/s312_use-contoso-directory-azure-confirm-and-sign-out.png)
   
8. Sign in to the [Azure classic portal](https://manage.windowsazure.com/) with the service administrator credentials.
   
    ![Screenshot of Azure sign-in](./media/billing-add-office-365-tenant-to-azure-subscription/s313_azure-sign-in-service-admin.png)
   
9. You should see your Office 365 tenant in the dashboard.
   
    ![Screenshot of dashboard](./media/billing-add-office-365-tenant-to-azure-subscription/s314_office-365-tenant-appear-in-azure.png)

### <a name="Step2"></a>Step 2: Change the directory associated with the Azure subscription
   
1. Select **Settings**.
   
    ![Screenshot of Azure classic portal settings icon](./media/billing-add-office-365-tenant-to-azure-subscription/s315_azure-classic-portal-settings-icon.png)
   
2. Select your Azure subscription, and then select **EDIT DIRECTORY**.

    ![Screenshot of Azure subscription edit directory](./media/billing-add-office-365-tenant-to-azure-subscription/s316_azure-subscription-edit-directory.png)
   
3. Select **Next** ![Next icon](./media/billing-add-office-365-tenant-to-azure-subscription/s317_next-icon.png).
   
    ![Screenshot of "Change the associated directory"](./media/billing-add-office-365-tenant-to-azure-subscription/s318_azure-change-associated-directory.png)
   
4. Review the affected accounts. All co-administrators and [Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-configure.md) users with assigned access in the existing resource groups are removed. The warning you receive only mentions the removal of co-administrators.
      
    ![Screenshot that shows the co-administrator accounts to be removed.](./media/billing-add-office-365-tenant-to-azure-subscription/s322_azure-confirm-directory-mapping.png)
   
    ![Screenshot that shows an example user account to be removed.](./media/billing-add-office-365-tenant-to-azure-subscription/s325_assigned-users-removed-resource-groups.png)
   
5. Select **Complete** ![complete-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s38_complete-icon.png).

### Step 3: Add your Office 365 organizational accounts as co-administrators to the Azure Active Directory tenant
   
1. Select the **ADMINISTRATORS** tab, and then select **ADD**.
   
    ![Screenshot of Azure classic portal settings administrators tab](./media/billing-add-office-365-tenant-to-azure-subscription/s319_azure-classic-portal-settings-administrators.png)
   
2. Enter an organizational account of your Office 365 tenant, select the Azure subscription, and then select **Complete** ![complete-icon](./media/billing-add-office-365-tenant-to-azure-subscription/s38_complete-icon.png).
   
    ![Screenshot of Azure add co-administrator dialog box](./media/billing-add-office-365-tenant-to-azure-subscription/s320_azure-add-co-administrator.png)
   
3. Go back to the **ADMINISTRATORS** tab. You should see the organizational account displayed as co-administrator.
   
    ![Screenshot of administrators tab](./media/billing-add-office-365-tenant-to-azure-subscription/s321_azure-co-administrator-added.png)
4.  Test access to Azure with the co-administrator account.
   
    a. Sign out of the Azure classic portal.
   
    b. Open the [Azure portal](https://portal.azure.com/).
   
    c. Enter the credentials of the co-administrator, and then select **Sign in**.
   
    ![Screenshot of Azure sign-in page](./media/billing-add-office-365-tenant-to-azure-subscription/s324_azure-sign-in-with-co-admin.png)

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.


