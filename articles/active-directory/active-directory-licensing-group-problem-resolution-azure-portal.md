---

  title: Identifying and resolving license problems for a group in Azure Active Directory | Microsoft Docs
  description: How to identify and resolve license assignment problems using Azure Active Directory group-based licensing
  services: active-directory
  keywords: Azure AD licensing
  documentationcenter: ''
  author: curtand
  manager: femila
  editor: ''

  ms.assetid:
  ms.service: active-directory
  ms.devlang: na
  ms.topic: article
  ms.tgt_pltfrm: na
  ms.workload: identity
  ms.date: 02/21/2017
  ms.author: curtand

---

# Identifying and resolving license problems for a group in Azure Active Directory


Group-based licensing in Azure Active Directory (Azure AD) introduces the concept of users in licensing error state. In this article, we explain why users may end up in this state. When licenses are assigned directly to individual users, without the use of group-based licensing, the assignment operation may fail. For example, when the administrator executes the PowerShell cmdlet `Set-MsolUserLicense` on a user, the cmdlet may fail for a number of reasons related to business logic, such as an insufficient number of licenses or a conflict between two service plans that cannot be assigned at the same time. The problem is reported back immediately to the user
executing the command.

When using group-based licensing, the same errors can occur but they will happen in the background when the Azure AD service is assigning licenses; for this reason they cannot be communicated immediately to the administrator. Instead they are recorded on the user object and reported via the administrative portal. The original intent to license the user is never lost, but it may be applied in active state or recorded in error state for future investigation and resolution.

To find users in error state for each group, open the blade for each group, and under **Licenses** there will be a notification displayed if there are
any users in error state. Select the notification to open a view listing all affected users which can be viewed one by one to understand the underlying problem. In this article, we will describe each potential problem and the way to resolve it.

## Not enough licenses

There are not enough available licenses for one of the products specified in the group. You need to either purchase more licenses for the product, or free up unused licenses from other users or groups.

To see how many licenses are available, go to **Azure Active Directory &gt; Licenses &gt; All products**.

To see which users and groups are consuming licenses, click on a product. Under **Licensed users** you will see all users for whom licenses have been assigned directly or via one or more groups. Under **Licensed groups** you will see all groups that have that product assigned.

## Conflicting service plans

One of the products specified in the group contains a service plan that conflicts with another service plan already assigned to the user via a different product. Some service plans are configured in a way so they cannot be assigned to the same user as another related service plan.

Consider the following example: a user has a license for Office 365 Enterprise **E1** assigned directly, with all the plans enabled. The user has been added to a group that has the Office 365 Enterprise **E3** product assigned to it. This product contains service plans that cannot overlap between the E1 and E3, so the group license assignment will fail with the “Conflicting service plans” error. In this example, the conflicting service plans are:

-   SharePoint Online (Plan 2) conflicts with SharePoint Online (Plan 1)

-   Exchange Online (Plan 2) conflicts with Exchange Online (Plan 1)

To solve this conflict, you will need to disable those two plans either on the E1 license directly assigned to the user, or modify the entire group
license assignment and disable the plans in the E3 license. Alternatively, you might decide to remove the E1 license from the user if it is redundant in the context of the E3 license.

The decision how to resolve conflicting product licenses always belongs to the administrator. Azure AD will not automatically resolve license conflicts.

## Other products depend on this license

One of the products specified in the group contains a service plan that must be enabled for another service plan, in another product, to
function. This error occurs when Azure AD attempts to remove the underlying service plan, for example as a result of the user being removed from the group.

## Usage location not allowed

Some Microsoft services are not available in all locations due to local laws and regulations. Before a license can be assigned to a user, the administrator has to specify the “Usage location” property for the user. This can be done under **User &gt; Profile &gt; Settings** section in the Azure portal.

When using group license assignment, any users without a usage location specified will inherit the location of the directory. If you have users in locations where plans are not available, consider modifying the license assignment at the group level to disable the affected plans. Alternatively, you can move those users to a different group whose license assignments do not conflict with the location.

If you have users in different locations, make sure to reflect that correctly in your user
objects before adding users to groups with licenses.

## What happens when there is more than 1 product license on a group?

You can assign more than 1 product license to a group. For example, you could assign Office 365 Enterprise E3 and Enterprise Mobility + Security to a group to easily enable all included services for users.

Azure AD will attempt to assign all licenses specified in the group to each user. If we cannot assign one of the products due to business logic problems (for example, not enough licenses all conflicts with other services enabled on the user) we will not assign the other licenses in the group, either.

You will be able to see the users for whom assignment failed and check which products have been affected by this.

## How to force processing of licenses in a group to resolve errors?

Depending on what steps were taken to resolve errors, it may be necessary to manually trigger processing of a group to update user state.

For example, if you purchased more licenses to cover all users, you will need to trigger processing of groups that previously failed to fully license all user members. To do that, find the group blade, open **Licenses** and select the **Reprocess** button in the toolbar.


## Next steps

To learn more about other scenarios for license management through groups, read

* [Assigning licenses to a group in Azure Active Directory](active-directory-licensing-group-assignment-azure-portal.md)
* [What is group-based licensing in Azure Active Directory?](active-directory-licensing-whatis-azure-portal.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](active-directory-licensing-group-migration-azure-portal.md)
* [Azure Active Directory group-based licensing additional scenarios](active-directory-licensing-group-advanced.md)
