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
ms.topic: troubleshooting
ms.date: 01/04/2018
ms.author: genli

---
# Add or change Azure subscription administrators

Azure classic subscription admins and Azure [Role-Based Access Control (RBAC)](../active-directory/role-based-access-control-what-is.md) are two systems for managing access to Azure resources:

* Classic subscription admin roles offer basic access management and include Account Administrator, Service Administrator, and Co-Administrators.
    * When you sign up for a new Azure subscription, your account is set as both the Account Administrator and Service Administrator by default.
    * Co-Administrators can be added after sign up.
* RBAC is a newer system that offers fine-grained access management with many built-in roles, flexibility of scope, and custom roles.
    * However, users with only RBAC roles and no classic subscription admin roles cannot manage Azure classic deployments.

To ensure better control and to simplify access management, we recommend that you use RBAC for all access management needs. If possible, we recommend that you reconfigure existing access policies using RBAC. 

<a name="add-an-admin-for-a-subscription"></a>

## Add an RBAC Owner admin for a subscription in Azure portal 

To add someone as an admin for Azure subscription service administration, give them an RBAC Owner role to the subscription. The Owner role can manage the resources in the subscription that you assigned and doesn't have access privilege to other subscriptions.

1. Visit [**Subscriptions** in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
2. Select the subscription that you want to give access.
3. Select **Access control (IAM)** in the menu.
4. In the **Role** box, select **Owner**. 
5. In the **Assign access to** box, select **Azure AD user, group, or application**. 
6. In the **Select** box, type the email address of the user you want to add as Owner. Select the user, and then select **Save**.

    ![Screenshot that shows the Owner role selected](./media/billing-add-change-azure-subscription-administrator/add-role.png)

This gives the user full access to all resources including the right to delegate access to others. To give access at a different scope, like a resource group, visit the IAM menu for that scope. 

## Add or change Co-administrator

Only an Owner can be added as a Co-administrator. Other users with roles such as Contributor and Reader cannot be added as Co-administrators.

> [!TIP]
> You only need to add the "Owner" account as co-administrator if the user needs to manage Azure classic deployments. We recommend using RBAC for all other purposes.

1. If you haven't already, add someone as an Owner following instructions from above.
2. **Right-click** the Owner user you just added, and then select **Add as co-administrator**. If you do not see the **Add as co-administrator** option, refresh the page or try another Internet browser. 

    ![Screenshot that adds co-administrator](./media/billing-add-change-azure-subscription-administrator/add-coadmin.png)

    To remove the Co-administrator permission, **right-click** the "Co-administrator" user and then select **Remove co-administrator**.

    ![Screenshot that removes co-administrator](./media/billing-add-change-azure-subscription-administrator/remove-coadmin.png)

<a name="change-service-administrator-for-a-subscription"></a>

## Change the Service Administrator for an Azure subscription

Only the Account Administrator can change the Service Administrator for a subscription. By default, when you sign up, the Service Administrator is the same as the Account Administrator. If the Service Administrator is changed to a different user, then the Account Administrator loses access to Azure portal. However, the Account Administrator can always use Account Center to change the Service Administrator back to themselves.

1. Make sure your scenario is supported by checking the [limits for changing Service Administrators](#limits).
1. Sign in to [Account Center](https://account.windowsazure.com/subscriptions) as the Account Administrator.
1. Select a subscription.
1. On the right side, select **Edit subscription details**.

    ![Screenshot showing the Edit subscription button in Account Center](./media/billing-add-change-azure-subscription-administrator/editsub.png)
1. In the **SERVICE ADMINISTRATOR** box, enter the email address of the new Service Administrator.

    ![Screenshot showing the box to change the Service Admin email](./media/billing-add-change-azure-subscription-administrator/changeSA.png)

<a name="limits"></a>

### Limitations for changing Service Administrators

* Each subscription is associated with an Azure AD directory. To find the directory the subscription is associated with, go to [**Subscriptions**](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade), then select a subscription to see the directory.
* If you are signed in with a Work or School account, you can add other accounts in your organization as Service Administrator. For example, abby@contoso.com can add bob@contoso.com as Service Administrator, but can't add john@notcontoso.com unless john@notcontoso.com has presence in the contoso.com directory. Users signed in with Work or School accounts can continue to add Microsoft Account users as Service Administrator.

  | Sign-in Method | Add Microsoft Account user as SA? | Add Work or School account in the same organization as SA? | Add Work or School account in different organization as SA? |
  | --- | --- | --- | --- |
  |  Microsoft Account |Yes |No |No |
  |  Work or School Account |Yes |Yes |No |

## Change the Account Administrator for an Azure subscription

The Account Admin is the user that initially signed up for the Azure subscription, and is responsible as the billing owner of the subscription. To change the Account Administrator of a subscription, see [Transfer ownership of an Azure subscription to another account](billing-subscription-transfer.md).

<a name="check-the-account-administrator-of-the-subscription"></a>

**Not sure who the Account Administrator is?** Follow these steps:

1. Visit [**Subscriptions** in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade).
1. Select the subscription you want to check, and then look under **Settings**.
1. Select **Properties**. The Account Administrator of the subscription is displayed in the **Account Admin** box.  

## Types of classic subscription admins

 Account Administrator, Service Administrator, and Co-administrator are the three kinds of classic subscription administrator roles in Azure. The account that is used to sign up for Azure is automatically set as both the Account Administrator and Service Administrator. Then, additional Co-Administrators can be added. The following table describes exact differences between these three administrative roles. 

> [!TIP]
> For better control and fine-grained access management, we recommend using Azure Role-based Access Control (RBAC), which allows users to be added to multiple roles. To learn more, see [Azure Active Directory Role-based Access Control](../active-directory/role-based-access-control-what-is.md).

| Classic subscription administrator | Limit | Description |
| --- | --- | --- |
| Account Administrator (AA) |1 per Azure account |This is the user who signed up for the Azure subscription, and is authorized to access the [Account Center](https://account.azure.com/Subscriptions) and perform various management tasks. These include being able to create new subscriptions, cancel subscriptions, change the billing for a subscription, and change the Service Administrator. Conceptually, the Account Admin is the billing owner of the subscription. In RBAC, the Account Administrator isn't assigned a role.|
| Service Administrator (SA) |1 per Azure subscription |This role is authorized to manage services in the [Azure portal](https://portal.azure.com). By default, for a new subscription, the Account Administrator is also the Service Administrator. In RBAC, the Owner role is given to the Service Administrator at the subscription scope.|
| Co-administrator (CA) |200 per subscription |This role has the same access privileges as the Service Administrator, but can’t change the association of subscriptions to Azure directories. In RBAC, the Owner role is given to the Co-Administrator at the subscription scope.|

## Learn more about resource access control and Active Directory

* To learn more about how resource access is controlled in Microsoft Azure, see [Understanding resource access in Azure](../active-directory/active-directory-understanding-resource-access.md).
* For more information about Azure Active Directory, see [How Azure subscriptions are associated with Azure Active Directory](../active-directory/active-directory-how-subscriptions-associated-directory.md) and [Assigning administrator roles in Azure Active Directory](../active-directory/active-directory-assign-admin-roles-azure-portal.md).

## Need help? Contact support.

If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.
