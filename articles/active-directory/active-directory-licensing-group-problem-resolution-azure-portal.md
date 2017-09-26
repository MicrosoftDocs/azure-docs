---

  title: Resolve license problems for a group in Azure Active Directory | Microsoft Docs
  description: How to identify and resolve license assignment problems when you're using Azure Active Directory group-based licensing
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
  ms.date: 06/05/2017
  ms.author: curtand

  ms.custom: H1Hack27Feb2017

---

# Identify and resolve license assignment problems for a group in Azure Active Directory

Group-based licensing in Azure Active Directory (Azure AD) introduces the concept of users in a licensing error state. In this article, we explain the reasons why users might end up in this state.

When you assign licenses directly to individual users, without using group-based licensing, the assignment operation might fail. For example, when you execute the PowerShell cmdlet `Set-MsolUserLicense` on a user, the cmdlet can fail for a number of reasons that are related to business logic. For example, there might be an insufficient number of licenses or a conflict between two service plans that can't be assigned at the same time. The problem is immediately reported back to you.

When you're using group-based licensing, the same errors can occur, but they happen in the background when the Azure AD service is assigning licenses. For this reason, the errors can't be communicated to you immediately. Instead, they're recorded on the user object and then reported via the administrative portal. Note that the original intent to license the user is never lost, but it's recorded in an error state for future investigation and resolution.

## How to find license assignment errors

1. To find users in an error state in a specific group, open the blade for the group. Under **Licenses**, there will be a notification displayed if there are any users in an error state.

![Group, error notification](media/active-directory-licensing-group-problem-resolution-azure-portal/group-error-notification.png)

2. Click the notification to open a list of all affected users. You can click on each user individually to see more details.

![Group, list of users in error state](media/active-directory-licensing-group-problem-resolution-azure-portal/list-of-users-with-errors.png)

3. To find all groups that contain at least one error, on the **Azure Active Directory** blade select **Licenses** and then **Overview**. An info box is displayed when some groups require your attention.

![Overview, information about groups in error state](media/active-directory-licensing-group-problem-resolution-azure-portal/group-errors-widget.png)

4. Click on the box to see a list of all groups with errors. You can click each group for more details.

![Overview, list of groups with errors](media/active-directory-licensing-group-problem-resolution-azure-portal/list-of-groups-with-errors.png)


Below is a description of each potential problem and the way to resolve it.

## Not enough licenses

**Problem:** There aren't enough available licenses for one of the products that's specified in the group. You need to either purchase more licenses for the product, or free up unused licenses from other users or groups.

To see how many licenses are available, go to **Azure Active Directory** > **Licenses** > **All products**.

To see which users and groups are consuming licenses, click a product. Under **Licensed users**, you'll see all users who've had licenses assigned directly or via one or more groups. Under **Licensed groups**, you'll see all groups that have that product assigned.

**PowerShell:** PowerShell cmdlets report this error as _CountViolation_.

## Conflicting service plans

**Problem:** One of the products that's specified in the group contains a service plan that conflicts with another service plan that's already assigned to the user via a different product. Some service plans are configured in a way that they can't be assigned to the same user as another related service plan.

Consider the following example. A user has a license for Office 365 Enterprise **E1** assigned directly, with all the plans enabled. The user has been added to a group that has the Office 365 Enterprise **E3** product assigned to it. This product contains service plans that can't overlap with the plans included in E1, so the group license assignment will fail with the “Conflicting service plans” error. In this example, the conflicting service plans are:

-   SharePoint Online (Plan 2) conflicts with SharePoint Online (Plan 1).
-   Exchange Online (Plan 2) conflicts with Exchange Online (Plan 1).

To solve this conflict, you need to disable those two plans either on the E1 license that's directly assigned to the user. Or, you need to modify the entire group license assignment and disable the plans in the E3 license. Alternatively, you might decide to remove the E1 license from the user if it's redundant in the context of the E3 license.

The decision about how to resolve conflicting product licenses always belongs to the administrator. Azure AD doesn't automatically resolve license conflicts.

**PowerShell:** PowerShell cmdlets report this error as _MutuallyExclusiveViolation_.

## Other products depend on this license

**Problem:** One of the products that's specified in the group contains a service plan that must be enabled for another service plan, in another product, to
function. This error occurs when Azure AD attempts to remove the underlying service plan. For example, this can happen as a result of the user being removed from the group.

To solve this problem, you'll need to make sure that the required plan is still assigned to users through some other method, or that the dependent services are disabled for those users. After doing that, you can properly remove the group license from those users.

**PowerShell:** PowerShell cmdlets report this error as _DependencyViolation_.

## Usage location isn't allowed

**Problem:** Some Microsoft services aren't available in all locations because of local laws and regulations. Before you can assign a license to a user, you have to specify the “Usage location” property for the user. You can do this under the **User** > **Profile** > **Settings** section in the Azure portal.

When Azure AD attempts to assign a group license to a user whose usage location isn't supported, it will fail and record this error on the user.

To solve this problem, remove users from nonsupported locations from the licensed group. Alternatively, if the current usage location values don't represent the actual user location, you can modify them so that the licenses are correctly assigned next time (if the new location is supported).

**PowerShell:** PowerShell cmdlets report this error as _ProhibitedInUsageLocationViolation_.

> [!NOTE]
> When Azure AD assigns group licenses, any users without a usage location specified inherit the location of the directory. We recommend that administrators set the correct usage location values on users before using group-based licensing to comply with local laws and regulations.

## What happens when there's more than one product license on a group?

You can assign more than one product license to a group. For example, you can assign Office 365 Enterprise E3 and Enterprise Mobility + Security to a group to easily enable all included services for users.

Azure AD attempts to assign all licenses that are specified in the group to each user. If Azure AD can't assign one of the products because of business logic problems (for example, if there aren't enough licenses for all, or if there are conflicts with other services that are enabled on the user), it won't assign the other licenses in the group either.

You'll be able to see the users who failed to get assigned failed and check which products have been affected by this.

## How to manage licenses for products with prerequisites?

Some Microsoft Online products that you acquire are "add-ons" - they require a prerequisite service plan to be enabled for a user, or a group, before they can be assigned. With group-based licensing, the system requires that both the prerequisite and add-on service plans be present on the group, to ensure that any users who are added to the group can received a valid service plan assignment. Let's consider the following example:

*Microsoft Workplace Analytics* is an add-on product. It contains a single service plan with the same name and Id of WORKPLACE_ANALYTICS. This service plan can only be assigned to a user, or group, when one of the following prerequisites are also assigned:
- *Exchange Online (Plan 1)* (Id: EXCHANGE_S_STANDARD)
- or, *Exchange Online (Plan 2)* (Id: EXCHANGE_S_ENTERPRISE).

If we try to assign this product on its own to a group, the portal will return an error - clicking on the error notification shows the following details:

![Group, prerequisite missing](media/active-directory-licensing-group-problem-resolution-azure-portal/group-prerequisite-required.png)

Clicking on the details shows the following error message:

*License operation failed. Make sure that the group has necessary services before adding or removing a dependent service. **The service Microsoft Workplace Analytics requires Exchange Online (Plan 2) to be enabled as well.***

In order to assign this add-on license to a group, we have to ensure that the group also contains the pre-requisite service plan. We could update an existing group that already contains the full *Office 365 E3* product with Exchange Online present.

It is possible to create a standalone group that contains only the minimum required products to make the add-on work - it can be used to license only the selected users for the add-on product. In this example we have assigned the following products to the same group:
- *Office 365 Enterprise E3*, with only the *Exchange Online (Plan 2)* service plan enabled
- *Microsoft Workplace Analytics*

![Group, prerequisite included](media/active-directory-licensing-group-problem-resolution-azure-portal/group-addon-with-prerequisite.png)

The resulting assignment is valid and was applied to the group. From now on, any users added to this group will consume 1 license of the E3 product and one license of the Workplace Analytics product. At the same time those users can be members of another group that gives them the full E3 product and they will still consume only one license for that product.

> [!TIP]
> You can create multiple groups, for each prerequisite service plan. For example, if you use both *Office 365 Enterprise **E1*** and *Office 365 Enterprise **E3*** for your users, you could create two groups to license *Microsoft Workplace Analytics*; one using E1 as a prerequisite and the other using E3. This will allow you to distribute the add-on to E1 and E3 users without consuming additional licenses.

## License assignment fails silently for a user due to duplicate proxy addresses in Exchange Online

If you are using Exchange Online, some users in your tenant may be incorrectly configured with the same proxy address value. When group-based licensing tries to assign a license to such a user, it will fail and will not record an error (unlike in the other error cases described above) - this is a limitation in the preview version of this feature and we are going to address it before *General Availability*.

> [!TIP]
> If you notice that some users did not receive a license and there is no error recorded on those users, first check if they have duplicate proxy address.
> This can be done by executing the following PowerShell cmdlet against Exchange Online:
```
Run Get-Recipient | where {$_.EmailAddresses -match "user@contoso.onmicrosoft.com"} | fL Name, RecipientType,emailaddresses
```
> [This article](https://support.microsoft.com/help/3042584/-proxy-address-address-is-already-being-used-error-message-in-exchange-online) contains more details about this problem, including information on [how to connect to Exchange Online using remote PowerShell](https://technet.microsoft.com/library/jj984289.aspx).

After proxy address problems have been resolved for the affected users, make sure to force license processing on the group to make sure licenses can now be applied again.

## How do you force license processing in a group to resolve errors?

Depending on what steps you've taken to resolve errors, it might be necessary to manually trigger processing of a group to update the user state.

For example, if you freed up some licenses by removing direct license assignments from users, you'll need to trigger processing of groups that previously failed to fully license all user members. To do that, find the group blade, open **Licenses**, and select the **Reprocess** button in the toolbar.

## Next steps

To learn more about other scenarios for license management through groups, see the following:

* [Assigning licenses to a group in Azure Active Directory](active-directory-licensing-group-assignment-azure-portal.md)
* [What is group-based licensing in Azure Active Directory?](active-directory-licensing-whatis-azure-portal.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](active-directory-licensing-group-migration-azure-portal.md)
* [Azure Active Directory group-based licensing additional scenarios](active-directory-licensing-group-advanced.md)
