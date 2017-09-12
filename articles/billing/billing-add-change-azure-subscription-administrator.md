---
title: Add or change Azure admin subscription roles | Microsoft Docs
description: Describes how to add or change Azure Co-Administrator, Service Administrator and Account Administrator
services: ''
documentationcenter: ''
author: genlin
manager: jlian
editor: ''
tags: billing

ms.assetid: 13a72d76-e043-4212-bcac-a35f4a27ee26
ms.service: billing
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/12/2017
ms.author: genli

---
# Add or change Azure administrator roles that manage the subscription or services

You can change the Azure administrator that manages your Azure subscription or manages the Azure services used in your subscription. To view Azure billing information and manage subscriptions, you must sign in to the [Account Center](https://account.windowsazure.com/Home/Index) as the Account Administrator. 

<a name="add-an-admin-for-a-subscription"></a>

## Add an RBAC Owner admin for a subscription in Azure portal 

To add someone as an admin for a subscription in the Azure portal, we recommend giving them an [RBAC](../active-directory/role-based-access-control-configure.md) Owner role. The Owner role can manage the resources in the subscription that you assigned and doesn't have access privilege to other subscriptions. The Owners you add through the [Azure portal](https://portal.azure.com) can't manage resource in the [Azure classic portal](https://manage.windowsazure.com).

1. Sign in to the [Subscriptions view in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1. Select the subscription that you want the admin to access.
1. Select **Access control (IAM)** in the menu.
1. Select **Add** > **Role** > **Owner**. Type the email address of the user you want to add as Owner, select the user, and then select **Save**.

    ![Screenshot that shows the Owner role selected](./media/billing-add-change-azure-subscription-administrator/add-role.png)

### Add or change Co-administrator

Only an Owner can be added as a Co-administrator. Other users with roles such as Contributor and Reader cannot be added as Co-administrators.

1. If you haven't already, add someone as an Owner following instructions from above.
2. **Right-click** the Owner user you just added, and then select **Add as co-administrator**. If you cannot see the **Add as co-administrator** option, fresh the page or try another Internet browser. 

     ![Screenshot that adds co-administrator](./media/billing-add-change-azure-subscription-administrator/add-coadmin.png)

    >[!TIP]
    >You need to add the "Owner" account as co-administrator if the user needs to manage the Azure services in [Azure classic portal](https://manage.windowsazure.com/).

    To remove the Co-administrator permission, **right-click** the "Co-administrator" user and then select **Remove co-administrator**.

    ![Screenshot that removes co-administrator](./media/billing-add-change-azure-subscription-administrator/remove-coadmin.png)

<a name="change-service-administrator-for-a-subscription"></a>

## Change the Service Administrator for an Azure subscription

Only the Account Administrator can change the Service Administrator for a subscription. By default, when you sign up, the Service Administrator is the same as the Account Administrator.

1. Make sure your scenario is supported by checking the [limits for changing Service Administrators](#limits).
1. Sign in to [Account Center](https://account.windowsazure.com/subscriptions) as the Account Administrator.
1. Select a subscription.
1. On the right side, select **Edit subscription details**.

    ![Screenshot showing the Edit subscription button in Account Center](./media/billing-add-change-azure-subscription-administrator/editsub.png)
1. In the **SERVICE ADMINISTRATOR** box, enter the email address of the new Service Administrator.

    ![Screenshot showing the box to change the Service Admin email](./media/billing-add-change-azure-subscription-administrator/changeSA.png)

<a name="limits"></a>

### Limitations for changing Service Administrators

* Each subscription is associated with an Azure AD directory. To find the directory the subscription is associated with, go to the [Azure classic portal](https://manage.windowsazure.com/), select **Settings** > **Subscriptions**. Check the subscription ID to find the directory.
* If you are signed in with a Work or School account, you can add other accounts in your organization as Service Administrator. For example, abby@contoso.com can add bob@contoso.com as Service Administrator, but can't add john@notcontoso.com unless john@notcontoso.com has presence in the contoso.com directory. Users signed in with Work or School accounts can continue to add Microsoft Account users as Service Administrator.

  | Sign-in Method | Add Microsoft Account user as SA? | Add Work or School account in the same organization as SA? | Add Work or School account in different organization as SA? |
  | --- | --- | --- | --- |
  |  Microsoft Account |Yes |No |No |
  |  Work or School Account |Yes |Yes |No |

## Change the Account Administrator for an Azure subscription

To change the Account Administrator of a subscription, see [Transfer ownership of an Azure subscription to another account](billing-subscription-transfer.md).

<a name="check-the-account-administrator-of-the-subscription"></a>

**Not sure who the Account Administrator is?** Follow these steps:

1. Sign in to the [Subscriptions view in the Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1. Select the subscription you want to check, and then look under **Settings**.
1. Select **Properties**. The account administrator of the subscription is displayed in the **Account Admin** box.  

## Types of Azure admin accounts

 Account Administrator, Service Administrator, and Co-administrator are the three kinds of administrator roles in Microsoft Azure. The following table describes the difference between these three administrative roles.

| Administrative role | Limit | Description |
| --- | --- | --- |
| Account Administrator (AA) |1 per Azure account |This is the person who signed up for or bought Azure subscriptions, and is authorized to access the [Account Center](https://account.windowsazure.com/Home/Index) and perform various management tasks. These include being able to create subscriptions, cancel subscriptions, change the billing for a subscription, and change the Service Administrator. |
| Service Administrator (SA) |1 per Azure subscription |This role is authorized to manage services in the [Azure portal](https://portal.azure.com). By default, for a new subscription, the Account Administrator is also the Service Administrator. |
| Co-administrator (CA) in the [Azure classic portal](https://manage.windowsazure.com) |200 per subscription |This role has the same access privileges as the Service Administrator, but can’t change the association of subscriptions to Azure directories. |

Azure Active Directory Role-based Access Control (RBAC) allows users to be added to multiple roles. For more information, see [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-configure.md).


## Learn more about resource access control and Active Directory

* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../active-directory/active-directory-understanding-resource-access.md).
* For more information about Azure Active Directory, see [How Azure subscriptions are associated with Azure Active Directory](../active-directory/active-directory-how-subscriptions-associated-directory.md) and [Assigning administrator roles in Azure Active Directory](../active-directory/active-directory-assign-admin-roles.md).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
