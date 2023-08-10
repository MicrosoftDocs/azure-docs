---

title: Resolve group license assignment problems
description: How to identify and resolve license assignment problems when you're using Azure Active Directory group-based licensing
services: active-directory
keywords: Azure AD licensing
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.topic: how-to
ms.workload: identity
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: sumitp
ms.custom: it-pro
ms.collection: M365-identity-device-management
---

# Identify and resolve license assignment problems for a group in Azure Active Directory

Group-based licensing in Azure Active Directory (Azure AD), part of Microsoft Entra, introduces the concept of users in a licensing error state. In this article, we explain the reasons why users might end up in this state.

When you assign licenses directly to individual users, without using group-based licensing, the assignment operation might fail for reasons that are related to business logic. For example, there might be an insufficient number of licenses or a conflict between two service plans that can't be assigned at the same time. The problem is immediately reported back to you.

When you're using group-based licensing, the same errors can occur, but they happen in the background while the Azure AD service is assigning licenses. For this reason, the errors can't be communicated to you immediately. Instead, they're recorded on the user object and then reported via the administrative portal. The original intent to license the user is never lost, but it's recorded in an error state for future investigation and resolution.

## Find license assignment errors

### To find users in an error state in a group

1. Open the group to its overview page and select **Licenses**. A notification appears if there are any users in an error state.

   ![Group and error notifications message](./media/licensing-groups-resolve-problems/group-error-notification.png)

1. Select the notification to open a list of all affected users. You can select each user individually to see more details.

   ![list of users in group licensing error state](./media/licensing-groups-resolve-problems/list-of-users-with-errors.png)

1. To find all groups that contain at least one error, on the **Azure Active Directory** blade select **Licenses**, and then select **Overview**. An information box is displayed when groups require your attention.

   ![Overview and information about groups in error state](./media/licensing-groups-resolve-problems/group-errors-widget.png)

1. Select the box to see a list of all groups with errors. You can select each group for more details.

   ![Overview and list of groups with errors](./media/licensing-groups-resolve-problems/list-of-groups-with-errors.png)

The following sections give a description of each potential problem and the way to resolve it.

## Not enough licenses

**Problem:** There aren't enough available licenses for one of the products that's specified in the group. You need to either purchase more licenses for the product or free up unused licenses from other users or groups.

To see how many licenses are available, go to **Azure Active Directory** > **Licenses** > **All products**.

To see which users and groups are consuming licenses, select a product. Under **Licensed users**, you see a list of all users who have had licenses assigned directly or via one or more groups. Under **Licensed groups**, you see all groups that have that products assigned.

**PowerShell:** PowerShell cmdlets report this error as _CountViolation_.

## Conflicting service plans

**Problem:** One of the products that's specified in the group contains a service plan that conflicts with another service plan that's already assigned to the user via a different product. Some service plans are configured in a way that they can't be assigned to the same user as another, related service plan.

> [!TIP]
> Exchange Online Plan1 and Plan2 were previously non-duplicable service plans. However, now they are service plans that can be duplicated.
> If you are experiencing conflicts with these service plans, please try reprocessing them.

The decision about how to resolve conflicting product licenses always belongs to the administrator. Azure AD doesn't automatically resolve license conflicts.

**PowerShell:** PowerShell cmdlets report this error as _MutuallyExclusiveViolation_.

## Other products depend on this license

**Problem:** One of the products that's specified in the group contains a service plan that must be enabled for another service plan, in another product, to function. This error occurs when Azure AD attempts to remove the underlying service plan. For example, this can happen when you remove the user from the group.

To solve this problem, you need to make sure that the required plan is still assigned to users through some other method or that the dependent services are disabled for those users. After doing that, you can properly remove the group license from those users.

**PowerShell:** PowerShell cmdlets report this error as _DependencyViolation_.

## Usage location isn't allowed

**Problem:** Some Microsoft services aren't available in all locations because of local laws and regulations. Before you can assign a license to a user, you must specify the **Usage location** property for the user. You can specify the location under the **User** > **Profile** > **Edit** section in the Azure portal.

When Azure AD attempts to assign a group license to a user whose usage location isn't supported, it fails and records an error on the user.

To solve this problem, remove users from unsupported locations from the licensed group. Alternatively, if the current usage location values don't represent the actual user location, you can modify them so that the licenses are correctly assigned next time (if the new location is supported).

**PowerShell:** PowerShell cmdlets report this error as _ProhibitedInUsageLocationViolation_.

> [!NOTE]
> When Azure AD assigns group licenses, any users without a specified usage location inherit the location of the directory. We recommend that administrators set the correct usage location values on users before using group-based licensing to comply with local laws and regulations.

## Duplicate proxy addresses

If you use Exchange Online, some users in your organization might be incorrectly configured with the same proxy address value. When group-based licensing tries to assign a license to such a user, it fails and shows  “Proxy address is already being used”.

> [!TIP]
> To see if there is a duplicate proxy address, execute the following PowerShell cmdlet against Exchange Online:
> ```
> Get-Recipient -Filter "EmailAddresses -eq 'user@contoso.onmicrosoft.com'" | fl Name, RecipientType,Emailaddresses
> ```
> For more information about this problem, see ["Proxy address 
> is already being used" error message in Exchange Online](https://support.microsoft.com/help/3042584/-proxy-address-address-is-already-being-used-error-message-in-exchange-online). The article also includes information on [how to connect to Exchange Online by using remote PowerShell](/powershell/exchange/connect-to-exchange-online-powershell).

After you resolve any proxy address problems for the affected users, make sure to force license processing on the group to make sure that the licenses can now be applied.

## Azure AD Mail and ProxyAddresses attribute change

**Problem:** While updating license assignment on a user or a group, you might see that the Azure AD Mail and ProxyAddresses attribute of some users are changed.

Updating license assignment on a user causes the proxy address calculation to be triggered, which can change user attributes. To understand the exact reason of the change and solve the problem, see this article on [how the proxyAddresses attribute is populated in Azure AD](https://support.microsoft.com/help/3190357/how-the-proxyaddresses-attribute-is-populated-in-azure-ad).

## LicenseAssignmentAttributeConcurrencyException in audit logs

**Problem:** User has LicenseAssignmentAttributeConcurrencyException for license assignment in audit logs.
When group-based licensing tries to process concurrent license assignment of same license to a user, this exception is recorded on the user. This usually happens when a user is a member of more than one group with same assigned license. Azure AD will retry processing the user license and will resolve the issue. There is no action required from the customer to fix this issue.

## More than one product license assigned to a group

You can assign more than one product license to a group. For example, you can assign Office 365 Enterprise E3 and Enterprise Mobility + Security to a group to easily enable all included services for users.

Azure AD attempts to assign all licenses that are specified in the group to each user. If Azure AD can't assign one of the products because of business logic problems, it won't assign the other licenses in the group either. An example is if there aren't enough licenses for all, or if there are conflicts with other services that are enabled on the user.

You can see the users who failed to get assigned and check which products are affected by this problem.

## When a licensed group is deleted

You must remove all licenses assigned to a group before you can delete the group. However, removing licenses from all the users in the group may take time. While removing license assignments from a group, there can be failures if user has a dependent license assigned or if there is a proxy address conflict issue which prohibits the license removal. If a user has a license that is dependent on a license which is being removed due to group deletion, the license assignment to the user is converted from inherited to direct.

For example, consider a group that has Office 365 E3/E5 assigned with a Skype for Business service plan enabled. Also imagine that a few members of the group have Audio Conferencing licenses assigned directly. When the group is deleted, group-based licensing will try to remove Office 365 E3/E5 from all users. Because Audio Conferencing is dependent on Skype for Business, for any users with Audio Conferencing assigned, group-based licensing converts the Office 365 E3/E5 licenses to direct license assignment.

## Manage licenses for products with prerequisites

Some Microsoft Online products you might own are *add-ons*. Add-ons require a prerequisite service plan to be enabled for a user or a group before they can be assigned a license. With group-based licensing, the system requires that both the prerequisite and add-on service plans be present in the same group. This is done to ensure that any users who are added to the group can receive the fully working product. Let's consider the following example:

Microsoft Workplace Analytics is an add-on product. It contains a single service plan with the same name. We can only assign this service plan to a user, or group, when one of the following prerequisites is also assigned:

- Exchange Online (Plan 1)
- Exchange Online (Plan 2)

If we try to assign this product on its own to a group, the portal returns a notification message. If we select the item details, it shows the following error message:

  "License operation failed. Make sure that the group has necessary services before adding or removing a dependent service. **The service Microsoft Workplace Analytics requires Exchange Online (Plan 2) to be enabled as well.**"

To assign this add-on license to a group, we must ensure that the group also contains the prerequisite service plan. For example, we might update an existing group that already contains the full Office 365 E3 product, and then add the add-on product to it.

It is also possible to create a standalone group that contains only the minimum required products to make the add-on work. It can the be used to license only selected users for the add-on product. Based on the previous example, you would assign the following products to the same group:

- Office 365 Enterprise E3 with only the Exchange Online (Plan 2) service plan enabled
- Microsoft Workplace Analytics

From now on, any users added to this group consume one license of the E3 product and one license of the Workplace Analytics product. At the same time, those users can be members of another group that gives them the full E3 product, and they still consume only one license for that product.

> [!TIP]
> You can create multiple groups for each prerequisite service plan. For example, if you use both Office 365 Enterprise E1 and Office 365 Enterprise E3 for your users, you can create two groups to license Microsoft Workplace Analytics: one that uses E1 as a prerequisite and the other that uses E3. This lets you distribute the add-on to E1 and E3 users without consuming additional licenses.

## Force group license processing to resolve errors

Depending on what steps you've taken to resolve the errors, it might be necessary to manually trigger the processing of a group to update the user state.

For example, if you free up some licenses by removing direct license assignments from users, you need to trigger the processing of groups that previously failed to fully license all user members. To reprocess a group, go to the group pane, open **Licenses**, and then select the **Reprocess** button on the toolbar.

## Force user license processing to resolve errors

Depending on what steps you've taken to resolve the errors, it might be necessary to manually trigger the processing of a user to update the users state.

For example, after you resolve duplicate proxy address problem for an affected user, you need to trigger the processing of the user. To reprocess a user, go to the user pane, open **Licenses**, and then select the **Reprocess** button on the toolbar.

## Next steps

To learn more about other scenarios for license management through groups, see the following:

* [What is group-based licensing in Azure Active Directory?](../fundamentals/active-directory-licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Azure Active Directory](./licensing-groups-assign.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](licensing-groups-migrate-users.md)
* [How to migrate users between product licenses using group-based licensing in Azure Active Directory](licensing-groups-change-licenses.md)
* [Azure Active Directory group-based licensing additional scenarios](./licensing-group-advanced.md)
* [PowerShell examples for group-based licensing in Azure Active Directory](licensing-ps-examples.md)
