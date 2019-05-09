---
title: Fix dynamic membership problems for groups - Azure Active Directory | Microsoft Docs
description: Troubleshooting tips for dynamic membership for groups in Azure AD.
services: active-directory
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.subservice: users-groups-roles
ms.topic: article
ms.date: 01/31/2019
ms.author: curtand
ms.reviewer: krbain
ms.custom: it-pro

ms.collection: M365-identity-device-management
---
# Troubleshoot and resolve groups issues

## Troubleshooting group creation issues

**I disabled security group creation in the Azure portal but groups can still be created via Powershell**
The **User can create security groups in Azure portals** setting in the Azure portal controls whether or not non-admin users can create security groups in the Access panel or the Azure portal. It does not control security group creation via Powershell.

To disable group creation for non-admin users in Powershell:
1. Verify that non-admin users are allowed to create groups:
   

   ```powershell
   Get-MsolCompanyInformation | Format-List UsersPermissionToCreateGroupsEnabled
   ```

  
2. If it returns `UsersPermissionToCreateGroupsEnabled : True`, then non-admin users can create groups. To disable this feature:
  

   ``` 
   Set-MsolCompanySettings -UsersPermissionToCreateGroupsEnabled $False
   ```

<br/>**I received a max groups allowed error when trying to create a Dynamic Group in Powershell**<br/>
If you receive a message in Powershell indicating _Dynamic group policies max allowed groups count reached_, this means you have reached the max limit for Dynamic groups in your tenant. The max number of Dynamic groups per tenant is 5,000.

To create any new Dynamic groups, you'll first need to delete some existing Dynamic groups. There's no way to increase the limit.

## Troubleshooting dynamic memberships for groups

**I configured a rule on a group but no memberships get updated in the group**<br/>
1. Verify the values for user or device attributes in the rule. Ensure there are users that satisfy the rule. 
For devices, check the device properties to ensure any synced attributes contain the expected values.<br/>
2. Check the membership processing status to confirm if it is complete. You can check the [membership processing status](groups-create-rule.md#check-processing-status-for-a-rule) and the last updated date on the **Overview** page for the group.

If everything looks good, please allow some time for the group to populate. Depending on the size of your tenant, the group may take up to 24 hours for populating for the first time or after a rule change.

**I configured a rule, but now the existing members of the rule are removed**<br/>This is expected behavior. Existing members of the group are removed when a rule is enabled or changed. The users returned from evaluation of the rule are added as members to the group.

**I don’t see membership changes instantly when I add or change a rule, why not?**<br/>Dedicated membership evaluation is done periodically in an asynchronous background process. How long the process takes is determined by the number of users in your directory and the size of the group created as a result of the rule. Typically, directories with small numbers of users will see the group membership changes in less than a few minutes. Directories with a large number of users can take 30 minutes or longer to populate.

**How can I force the group to be processed now?**<br/>
Currently, there is no way to automatically trigger the group to be processed on demand. However, you can manually trigger the reprocessing by updating the membership rule to add a whitespace at the end.  

**I encountered a rule processing error**<br/>The following table lists common dynamic membership rule errors and how to correct them.

| Rule parser error | Error usage | Corrected usage |
| --- | --- | --- |
| Error: Attribute not supported. |(user.invalidProperty -eq "Value") |(user.department -eq "value")<br/><br/>Make sure the attribute is on the [supported properties list](groups-dynamic-membership.md#supported-properties). |
| Error: Operator is not supported on attribute. |(user.accountEnabled -contains true) |(user.accountEnabled -eq true)<br/><br/>The operator used is not supported for the property type (in this example, -contains cannot be used on type boolean). Use the correct operators for the property type. |
| Error: Query compilation error. | 1. (user.department -eq "Sales") (user.department -eq "Marketing")<br>2.  (user.userPrincipalName -match "*@domain.ext") | 1. Missing operator. Use -and or -or two join predicates<br>(user.department -eq "Sales") -or (user.department -eq "Marketing")<br>2. Error in regular expression used with -match<br>(user.userPrincipalName -match ".*@domain.ext")<br>or alternatively: (user.userPrincipalName -match "@domain.ext$") |

## Next steps

These articles provide additional information on Azure Active Directory.

* [Managing access to resources with Azure Active Directory groups](../fundamentals/active-directory-manage-groups.md)
* [Application Management in Azure Active Directory](../manage-apps/what-is-application-management.md)
* [What is Azure Active Directory?](../fundamentals/active-directory-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](../hybrid/whatis-hybrid-identity.md)