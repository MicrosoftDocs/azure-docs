---

  title: Azure Active Directory group-based licensing additional scenarios | Microsoft Docs
  description: More scenarios for Azure Active Directory group-based licensing
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

# Azure Active Directory group-based licensing additional scenarios

## Group-based licensing using dynamic groups

Group-based licensing can be used with any security group, which means it can be combined with Azure AD Dynamic Groups. Dynamic Groups execute rules against user object attributes to automatically add and remove users from groups.

For example, you could create multiple dynamic groups, one per each set of products you want to assign to users. Each group contains a rule looking at a specific attribute on a user, describing which set of licenses they should receive. The attribute can be assigned on-premises and synced with Azure AD, or managed directly in the cloud.

When the attribute is specified, user will be added to one or more of these dynamic licensing groups. Licenses will be assigned to the user shortly after that. When the attribute is removed, the user will leave
the groups and licenses will be removed.

### Example

In this example, I have an on-premises identity management solution that decides which users should have access to what Microsoft Online Services. It uses extensionAttribute1 to store a string value representing the licenses the user should have and Azure AD Connect syncs it with Azure AD. I want to distribute Office 365 E5 and EMS licenses to my users. In Azure AD I created two dynamic groups, one for each product – because some users may need one of the products but not the other. I specified the dynamic membership rule and license settings on each group. Here's what they look like:

#### O365 E5 – base services

![O365 E5 base services](media/active-directory-licensing-group-advanced/o365-e5-base-services.png)

#### EMS E5 – licensed users

![O365 E5 licensed users](media/active-directory-licensing-group-advanced/o365-e5-licensed-users.png)

On-premises, I modified one user and set their extensionAttribute1 to the value of `EMS;E5_baseservices;`, because I want them to have both licenses. After the change synced with the cloud, the user was automatically added to both groups and then licenses were assigned.

![Set the user's extensionAttribute1](media/active-directory-licensing-group-advanced/user-set-extensionAttribute1.png)

### Modifying a dynamic group membership rule

Caution is needed when modifying an existing group’s membership rule. When a rule is changed, all users are removed from the group, the rule is evaluated and users are added to the group based on the new conditions.

If the group has licenses assigned all users will have that license removed during the process. Only after the new rule is evaluated and users are added back, new licenses will be applied. This means that users may experience loss of service, or in some cases, loss of data.

We recommend that you do not change the membership rule on a group used for license assignment. Instead, create a new group with the new rule and specify the same license settings as on the original group. Wait until members have been added and licenses have been applied to all users. Only then, you can go ahead and delete the original group. This approach ensures a safe, staged transition to the new membership rule without any loss of access or data for users.


## Multiple groups and multiple licenses

A user can be a member of multiple groups with licenses. Here are some things to consider:

1. Multiple licenses for the same product can overlap and will result in all of the enabled services being applied to the user. For example, we created two licensing groups: *E3 – base services* contains the foundation services that we want to deploy first, to all users; *E3 – extended services* contains additional services (Sway and Planner) that we want to try with some users, while Yammer remains disabled for future deployment. In this example, the user was added to both groups:

  ![view enabled services](media/active-directory-licensing-group-advanced/view-enabled-services.png)

  As a result, they have 7 of the 12 services in the product enabled while consuming only one license for this product.

2. Selecting the *E3* license shows more details, including the information about which groups caused what services to be enabled for the user.

  ![view enabled services by group](media/active-directory-licensing-group-advanced/view-enabled-service-by-group.png)

## Direct licenses coexisting with group licenses

When a user inherits a license from a group, it is not possible to remove or modify that license assignment directly on the user object. Instead, any changes must be made in the group and then propagated by the system to all users.

It is, however, possible to assign the same SKU license directly to the user in addition to the inherited license. This may be used, for example, to enable additional services from the SKU just for one user, without having to affect other users.

Directly assigned licenses can be removed, but that won’t affect the inherited license. Let’s consider the following user who inherits an *Office 365 Enterprise E3* license from a group, which enables a handful of services.

1. Initially, the user inherits the license only from the *E3 – basic services* group. This enables the 4 service plans listed below:

  ![E3 group enabled services](media/active-directory-licensing-group-advanced/e3-group-enabled-services.png)

2. By clicking the **Assign** button we can directly assign an E3 license to the user – in this case we are going to disable all service plans except Yammer Enterprise.

  ![assign license to a user](media/active-directory-licensing-group-advanced/assign-license-to-user.png)

3. As a result, the user still consumes only 1 license of the E3 product, however the direct assignment enables the *Yammer
 Enterprise* service for that user only. You can see in the list which services are enabled by the group membership versus the direct assignment:

  ![inherited versus direct assignment](media/active-directory-licensing-group-advanced/direct-vs-inherited-assignment.png)

4. The following operations are allowed using direct assignment:

  a. *Yammer Enterprise* can be turned off on the user object directly. Notice that the On/Off toggle is enabled as opposed to the other service toggles – this is because this service is enabled directly on the user and thus can be modified.

  b. Additional services can be enabled as well, as part of the directly assigned license.

  c. The **Remove** button can be used to remove the direct license from the user. You can see that the user now only has the inherited group license and only the original services remain enabled.

    ![remove direct assignment](media/active-directory-licensing-group-advanced/remove-direct-license.png)

## Usage location

Some Microsoft services are not available in all locations; before a license can be assigned to a user, the administrator has to specify the “Usage location” property on the user. This can be done under User-&gt;Profile-&gt;Settings section in [the Azure portal](https://portal.azure.com).

When using group license assignment, any users without a usage location specified will inherit the location of the directory. If you have users in different locations, make sure to reflect that correctly in your user objects before adding users to groups with licenses.

## Use PowerShell to see who has inherited and direct licenses

During public preview, PowerShell cannot be used to fully control group license assignments. However, it can be used to discover basic information about user state and if licenses are inherited from a group or assigned directly. The below code sample shows how an admin can produce a basic report about license assignments.

1. Run `connect-msolservice` cmdlet to authenticate and connect to your tenant.

2. `Get-MsolAccountSku` can be used to discover all provisioned SKU licenses in the tenant.

  ![using the Get-Msolaccountsku cmdlet](media/active-directory-licensing-group-advanced/get-msolaccountsku-cmdlet.png)

3. In this example, we want to find out which users have the *EMS* license assigned directly, from a group, or both. We will use a PowerShell script that contains two functions that can answer this question for a user object and a SKU
  ```
  \# Returns TRUE if the user has the license assigned directly

  function UserHasLicenseAssignedDirectly
  {
      Param(\[Microsoft.Online.Administration.User\]\$user, \[string\]\$skuId)

      foreach(\$license in \$user.Licenses)
      {
          \# we look for the specific license SKU in all licenses assigned to the user
          if (\$license.AccountSkuId -ieq \$skuId)
          {
              \# GroupsAssigningLicense contains a collection of IDs of objects assigning the license
              \# This could be a group object or a user object (contrary to what the name suggests)
              \# If the collection is empty, this means the license is assigned directly - this is the case for users who have never been licensed via groups in the past

              if (\$license.GroupsAssigningLicense.Count -eq 0)
              {
                  return \$true
              }
              \# If the collection contains the ID of the user object, this means the license is assigned directly
              \# Note: the license may also be assigned through one or more groups in addition to being assigned directly
              foreach (\$assignmentSource in \$license.GroupsAssigningLicense)
              {
                  if (\$assignmentSource -ieq \$user.ObjectId)
                  {
                      return \$true
                  }

              }
              return \$false
          }
      }
      return \$false
  }
  \# Returns TRUE if the user is inheriting the license from a group
  function UserHasLicenseAssignedFromGroup
  {
      Param(\[Microsoft.Online.Administration.User\]\$user, \[string\]\$skuId)
      foreach(\$license in \$user.Licenses)
      {
          \# we look for the specific license SKU in all licenses assigned to the user
          if (\$license.AccountSkuId -ieq \$skuId)
          {
              \# GroupsAssigningLicense contains a collection of IDs of objects assigning the license
              \# This could be a group object or a user object (contrary to what the name suggests)
              foreach (\$assignmentSource in \$license.GroupsAssigningLicense)
              {
                  \# If the collection contains at least one ID not matching the user ID this means that the license is inherited from a group.
                  \# Note: the license may also be assigned directly in addition to being inherited
                  if (\$assignmentSource -ine \$user.ObjectId)
                  {
                      return \$true
                  }
              }
              return \$false
          }
      }
      return \$false
  }
  ```
4. The rest of the script gets all users and executes these functions on each user and then formats the output into a table.

  ```
  \# the license SKU we are interested in
  \$skuId = "reseller-account:EMS"
  \# find all users that have the SKU license assigned
  Get-MsolUser -All | where {\$\_.isLicensed -eq \$true -and \$\_.Licenses.AccountSKUID -eq \$skuId} | select \`
      ObjectId, \`
      @{Name="SkuId";Expression={\$skuId}}, \`
      @{Name="AssignedDirectly";Expression={(UserHasLicenseAssignedDirectly \$\_ \$skuId)}}, \`
      @{Name="AssignedFromGroup";Expression={(UserHasLicenseAssignedFromGroup \$\_ \$skuId)}}
  ```

5. The output of the complete script appears as the following:

  ![PowerShell script output](media/active-directory-licensing-group-advanced/powershell-script-output.png)

## Limitations and known issues

1. Group-based licensing currently does not support “nested groups” (groups that contain other groups). If you apply a license to a nested group, only the immediate first-level user members of the group will have the licenses applied.

2. Group-based licensing is currently only exposed via [the Azure portal](https://portal.azure.com). At this time, it is not possible to use PowerShell to set or modify licenses on groups.

3. The [Office 365 admin portal](https://portal.office.com ) does not currently support group-based licensing. If a user inherits a license from a group, this license will show up in the Office admin portal as a regular user license. If you try to modify that license (for example, to disable a service in the license, or try to remove the license) the portal will return an error message (because inherited group licenses cannot be modified directly on a user).

  `To assign a license that contains Azure Information Protection Plan 1, you must also assign one of the following service plans: Azure Rights Management.`

4. When a user is removed from a group and loses the license, the service plans from that license (for example, Exchange Online or SharePoint Online) are set to a “suspended” state as opposed to a final disabled state. This is done as a precaution to avoid accidental removal of user data if an admin makes a mistake in group membership management.

  We are going to implement a workflow in which the state of those service plans will eventually be completely disabled for those users. Until that is available, some services may continue to operate for users who were removed from a group and no longer have a license.

5. When licenses are assigned or modified on an extremely large group of users (for example, 100,000 users) the large number of changes generated by Azure AD automation may negatively impact the performance of your directory synchronization between Azure AD and on-premises systems. This could cause delays in directory sync in your environment.

6. License management automation does not automatically react to all types of changes in the environment. For example, you may have run out of licenses and some users are in error state “Not enough licenses.” You can then remove some directly assigned licenses from other users to free up the available seat count. However, the system will not automatically react to this change and fix users in that error state.

  As a workaround to these types of limitations, you can go to the group blade in Azure AD and click the **Reprocess** button. This will process all users in that group and resolve the error states, if possible.

## Next steps

To learn more about other scenarios for license management through group-based licensing, read

* [What is group-based licensing in Azure Active Directory?](active-directory-licensing-whatis-azure-portal.md)
* [Assigning licenses to a group in Azure Active Directory](active-directory-licensing-group-assignment-azure-portal.md)
* [Identifying and resolving license problems for a group in Azure Active Directory](active-directory-licensing-group-problem-resolution-azure-portal.md)
* [How to migrate individual licensed users to group-based licensing in Azure Active Directory](active-directory-licensing-group-migration-azure-portal.md)
