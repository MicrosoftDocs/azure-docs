---

  title: Azure Active Directory group-based licensing additional scenarios | Microsoft Docs
  description: More scenarios for Azure Active Directory group-based licensing
  services: active-directory
  keywords: Azure AD licensing
  documentationcenter: ''
  author: curtand
  manager: mtillman
  editor: 'piotrci'

  ms.service: active-directory
  ms.topic: article
  ms.workload: identity
  ms.component: users-groups-roles
  ms.date: 06/02/2017
  ms.author: curtand

  ms.custom: H1Hack27Feb2017

---

# Scenarios, limitations, and known issues using groups to manage licensing in Azure Active Directory

Use the following information and examples to gain a more advanced understanding of Azure Active Directory (Azure AD) group-based licensing.

## Usage location

Some Microsoft services are not available in all locations. Before a license can be assigned to a user, the administrator has to specify the **Usage location** property on the user. In [the Azure portal](https://portal.azure.com), you can specify in **User** &gt; **Profile** &gt; **Settings**.

For group license assignment, any users without a usage location specified will inherit the location of the directory. If you have users in multiple locations, make sure to reflect that correctly in your user objects before adding users to groups with licenses.

> [!NOTE]
> Group license assignment will never modify an existing usage location value on a user. We recommend that you always set usage location as part of your user creation flow in Azure AD (e.g. via AAD Connect configuration) - that will ensure the result of license assignment is always correct, and users do not receive services in locations that are not allowed.

## Use group-based licensing with dynamic groups

You can use group-based licensing with any security group, which means it can be combined with Azure AD dynamic groups. Dynamic groups run rules against user object attributes to automatically add and remove users from groups.

For example, you can create a dynamic group for some set of products you want to assign to users. Each group is populated by a rule adding users by their attributes, and each group is assigned the licenses that you want them to receive. You can assign the attribute on-premises and sync it with Azure AD, or you can manage the attribute directly in the cloud.

Licenses are assigned to the user shortly after they are added to the group. When the attribute is changed, the user leaves the groups and the licenses are removed.

### Example

Consider the example of an on-premises identity management solution that decides which users should have access to Microsoft web services. It uses **extensionAttribute1** to store a string value representing the licenses the user should have. Azure AD Connect syncs it with Azure AD.

Users might need one license but not another, or might need both. Here's an example, in which you are distributing Office 365 Enterprise E5 and Enterprise Mobility + Security (EMS) licenses to users in groups:

#### Office 365 Enterprise E5: base services

![Screenshot of Office 365 Enterprise E5 base services](./media/licensing-group-advanced/o365-e5-base-services.png)

#### Enterprise Mobility + Security: licensed users

![Screenshot of Enterprise Mobility + Security licensed users](./media/licensing-group-advanced/o365-e5-licensed-users.png)

For this example, modify one user and set their extensionAttribute1 to the value of `EMS;E5_baseservices;` if you want the user to have both licenses. You can make this modification on-premises. After the change syncs with the cloud, the user is automatically added to both groups, and licenses are assigned.

![Screenshot showing how to set the user's extensionAttribute1](./media/licensing-group-advanced/user-set-extensionAttribute1.png)

> [!WARNING]
> Use caution when modifying an existing group’s membership rule. When a rule is changed, the membership of the group will be re-evaluated and users who no longer match the new rule will be removed (users who still match the new rule will not be affected during this process). Those users will have their licenses removed during the process which may result in loss of service, or in some cases, loss of data.

> If you have a large dynamic group you depend on for license assignment, consider validating any major changes on a smaller test group before applying them to the main group.

## Multiple groups and multiple licenses

A user can be a member of multiple groups with licenses. Here are some things to consider:

- Multiple licenses for the same product can overlap, and they result in all enabled services being applied to the user. The following example shows two licensing groups: *E3 base services* contains the foundation services to deploy first, to all users. And *E3 extended services* contains additional services (Sway and Planner) to deploy only to some users. In this example, the user was added to both groups:

  ![Screenshot of enabled services](./media/licensing-group-advanced/view-enabled-services.png)

  As a result, the user has 7 of the 12 services in the product enabled, while using only one license for this product.

- Selecting the *E3* license shows more details, including information about which groups caused what services to be enabled for the user.

  ![Screenshot of enabled services by group](./media/licensing-group-advanced/view-enabled-service-by-group.png)

## Direct licenses coexist with group licenses

When a user inherits a license from a group, you can't directly remove or modify that license assignment in the user's properties. Changes must be made in the group and then propagated to all users.

It is possible, however, to assign the same product license directly to the user, in addition to the inherited license. You can enable additional services from the product just for one user, without affecting other users.

Directly assigned licenses can be removed, and don’t affect inherited licenses. Consider the user who inherits an Office 365 Enterprise E3 license from a group.

1. Initially, the user inherits the license only from the *E3 basic services* group, which enables four service plans, as shown:

  ![Screenshot of E3 group enabled services](./media/licensing-group-advanced/e3-group-enabled-services.png)

2. You can select **Assign** to directly assign an E3 license to the user. In this case, you are going to disable all service plans except Yammer Enterprise:

  ![Screenshot of how to assign a license directly to a user](./media/licensing-group-advanced/assign-license-to-user.png)

3. As a result, the user still uses only one license of the E3 product. But the direct assignment enables the Yammer Enterprise service for that user only. You can see which services are enabled by the group membership versus the direct assignment:

  ![Screenshot of inherited versus direct assignment](./media/licensing-group-advanced/direct-vs-inherited-assignment.png)

4. When you use direct assignment, the following operations are allowed:

  - Yammer Enterprise can be turned off on the user object directly. The **On/Off** toggle in the illustration was enabled for this service, as opposed to the other service toggles. Because the service is enabled directly on the user, it can be modified.
  - Additional services can be enabled as well, as part of the directly assigned license.
  - The **Remove** button can be used to remove the direct license from the user. You can see that the user now only has the inherited group license and only the original services remain enabled:

    ![Screenshot showing how to remove direct assignment](./media/licensing-group-advanced/remove-direct-license.png)

## Managing new services added to products
When Microsoft adds a new service to a product, it will be enabled by default in all groups to which you have assigned the product license. Users in your tenant who are subscribed to notifications about product changes will receive emails ahead of time notifying them about the upcoming service additions.

As an administrator, you can review all groups affected by the change and take action, such as disabling the new service in each group. For example, if you created groups targeting only specific services for deployment, you can revisit those groups and make sure that any newly added services are disabled.

Here is an example of what this process may look like:

1. Originally, you assigned the *Office 365 Enterprise E5* product to several groups. One of those groups, called *O365 E5 - Exchange only* was designed to enable only the *Exchange Online (Plan 2)* service for its members.

2. You received a notification from Microsoft that the E5 product will be extended with a new service - *Microsoft Stream*. When the service becomes available in your tenant, you can do the following:

3. Go to the [**Azure Active Directory > Licenses > All products**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/LicensesMenuBlade/Products) blade and select *Office 365 Enterprise E5*, then select **Licensed Groups** to view a list of all groups with that product.

4. Click on the group you want to review (in this case, *O365 E5 - Exchange only*). This will open the **Licenses** tab. Clicking on the E5 license will open a blade listing all enabled services.
> [!NOTE]
> The *Microsoft Stream* service has been automatically added and enabled in this group, in addition to the *Exchange Online* service:

  ![Screenshot of new service added to a group license](./media/licensing-group-advanced/manage-new-services.png)

5. If you want to disable the new service in this group, click the **On/Off** toggle next to the service and click the **Save** button to confirm the change. Azure AD will now process all users in the group to apply the change; any new users added to the group will not have the *Microsoft Stream* service enabled.

  > [!NOTE]
  > Users may still have the service enabled through some other license assignment (another group they are members of or a direct license assignment).

6. If needed, perform the same steps for other groups with this product assigned.

## Use PowerShell to see who has inherited and direct licenses
You can use a PowerShell script to check if users have a license assigned directly or inherited from a group.

1. Run the `connect-msolservice` cmdlet to authenticate and connect to your tenant.

2. `Get-MsolAccountSku` can be used to discover all provisioned product licenses in the tenant.

  ![Screenshot of the Get-Msolaccountsku cmdlet](./media/licensing-group-advanced/get-msolaccountsku-cmdlet.png)

3. Use the *AccountSkuId* value for the license you are interested in with [this PowerShell script](licensing-ps-examples.md#check-if-user-license-is-assigned-directly-or-inherited-from-a-group). This will produce a list of users who have this license with the information about how the license is assigned.

## Use Audit logs to monitor group-based licensing activity

You can use [Azure AD audit logs](../reports-monitoring/concept-audit-logs.md#audit-logs) to see all activity related to group-based licensing, including:
- who changed licenses on groups
- when the system started processing a group license change, and when it finished
- what license changes were made to a user as a result of a group license assignment.

>[!NOTE]
> Audit logs are available on most blades in the Azure Active Directory section of the portal. Depending on where you access them, filters may be pre-applied to only show activity relevant to the context of the blade. If you are not seeing the results you expect, examine [the filtering options](../reports-monitoring/concept-audit-logs.md#filtering-audit-logs) or access the unfiltered audit logs under [**Azure Active Directory > Activity > Audit logs**](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/Audit).

### Find out who modified a group license

1. Set the **Activity** filter to *Set group license* and click **Apply**.
2. The results include all cases of licenses being set or modified on groups.
>[!TIP]
> You can also type the name of the group in the *Target* filter to scope the results.

3. Click an item in the list view to see the details of what has changed. Under *Modified Properties* both old and new values for the license assignment are listed.

Here is an example of recent group license changes, with details:

![Screenshot group license changes](./media/licensing-group-advanced/audit-group-license-change.png)

### Find out when group changes started and finished processing

When a license changes on a group, Azure AD will start applying the changes to all users.

1. To see when groups started processing, set the **Activity** filter to *Start applying group based license to users*. Note that the actor for the operation is *Microsoft Azure AD Group-Based Licensing* - a system account that is used to execute all group license changes.
>[!TIP]
> Click an item in the list to see the *Modified Properties* field - it shows the license changes that were picked up for processing. This is useful if you made multiple changes to a group and you are not sure which one was processed.

2. Similarly, to see when groups finished processing, use the filter value *Finish applying group based license to users*.
>[!TIP]
> In this case, the *Modified Properties* field contains a summary of the results - this is useful to quickly check if processing resulted in any errors. Sample output:
> ```
Modified Properties
...
Name : Result
Old Value : []
New Value : [Users successfully assigned licenses: 6, Users for whom license assignment failed: 0.];
> ```

3. To see the complete log for how a group was processed, including all user changes, set the following filters:
  - **Initiated By (Actor)**: "Microsoft Azure AD Group-Based Licensing"
  - **Date Range** (optional): custom range for when you know a specific group started and finished processing

This sample output shows the start of processing, all resulting user changes, and the finish of processing.

![Screenshot group license changes](./media/licensing-group-advanced/audit-group-processing-log.png)

>[!TIP]
> Clicking items related to *Change user license* will show details for license changes applied to each individual user.

## Deleting a group with an assigned license

It is not possible to delete a group with an active license assigned. An administrator could delete a group not realizing that it will cause licenses to be removed from users - for this reason we require any licenses to be removed from the group first, before it can be deleted.

When trying to delete a group in the Azure portal you may see an error notification like this:
![Screenshot group deletion failed](./media/licensing-group-advanced/groupdeletionfailed.png)

Go to the **Licenses** tab on the group and see if there are any licenses assigned. If yes, remove those licenses and try to delete the group again.

You may see similar errors when trying to delete the group through PowerShell or Graph API. If you are using a group synced from on-premises, Azure AD Connect may also report errors if it is failing to delete the group in Azure AD. In all such cases, make sure to check if there are any licenses assigned to the group, and remove them first.

## Limitations and known issues

If you use group-based licensing, it's a good idea to familiarize yourself with the following list of limitations and known issues.

- Group-based licensing currently does not support groups that contain other groups (nested groups). If you apply a license to a nested group, only the immediate first-level user members of the group have the licenses applied.

- The feature can only be used with security groups. Office groups are currently not supported and you will not be able to use them in the license assignment process.

- The [Office 365 admin portal](https://portal.office.com ) does not currently support group-based licensing. If a user inherits a license from a group, this license appears in the Office admin portal as a regular user license. If you try to modify that license or try to remove the license, the portal returns an error message. Inherited group licenses cannot be modified directly on a user.

- When a user is removed from a group and loses the license, the service plans from that license (for example, SharePoint Online) are set to a **Suspended** state. The service plans are not set to a final, disabled state. This precaution can avoid accidental removal of user data, if an admin makes a mistake in group membership management.

- When licenses are assigned or modified for a large group (for example, 100,000 users), it could impact performance. Specifically, the volume of changes generated by Azure AD automation might negatively impact the performance of your directory synchronization between Azure AD and on-premises systems.

- In certain high load situations, license processing may be delayed and changes such as adding/removing a group license, or adding/removing users from group, may take a long time to be processed. If you see your changes take more than 24 hours to process, please [open a support ticket](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/supportRequest) to allow us to investigate. We will improve performance characteristics of this feature before it reaches *General Availability*.

- License management automation does not automatically react to all types of changes in the environment. For example, you might have run out of licenses, causing some users to be in an error state. To free up the available seat count, you can remove some directly assigned licenses from other users. However, the system does not automatically react to this change and fix users in that error state.

  As a workaround to these types of limitations, you can go to the **Group** blade in Azure AD, and click **Reprocess**. This command processes all users in that group and resolves the error states, if possible.

- Group-based licensing does not record errors when a license could not be assigned to a user due to a duplicate proxy address configuration in Exchange Online; such users are skipped during license assignment. For more information about how to identify and solve this problem, see [this section](licensing-groups-resolve-problems.md#license-assignment-fails-silently-for-a-user-due-to-duplicate-proxy-addresses-in-exchange-online).

## Next steps

To learn more about other scenarios for license management through group-based licensing, see:

* [What is group-based licensing in Azure Active Directory?](../fundamentals/active-directory-licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Azure Active Directory](licensing-groups-assign.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](licensing-groups-resolve-problems.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](licensing-groups-migrate-users.md)
