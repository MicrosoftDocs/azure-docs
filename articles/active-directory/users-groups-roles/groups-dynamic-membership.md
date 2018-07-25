---
title: Attribute-based dynamic group membership rules in Azure Active Directory | Microsoft Docs
description: How to create advanced rules for dynamic group membership including supported expression rule operators and parameters.
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman
editor: ''

ms.service: active-directory
ms.workload: identity
ms.component: users-groups-roles
ms.topic: article
ms.date: 07/24/2018
ms.author: curtand
ms.reviewer: krbain

ms.custom: it-pro
---

# Create dynamic groups with attribute-based membership in Azure Active Directory

In Azure Active Directory (Azure AD), you can create complex attribute-based rules to enable dynamic memberships for groups. This article details the attributes and syntax to create dynamic membership rules for users or devices. You can set up a rule for dynamic membership on security groups or Office 365 groups.

When any attributes of a user or device change, the system evaluates all dynamic group rules in a directory to see if the change would trigger any group adds or removes. If a user or device satisfies a rule on a group, they are added as a member of that group. If they no longer satisfy the rule, they are removed.

> [!NOTE]
> This feature requires an Azure AD Premium P1 license for each unique user that is a member of one or more dynamic groups. You don't have to assign licenses to users for them to be members of dynamic groups, but you must have the minimum number of licenses in the tenant to cover all such users. For example, if you had a total of 1,000 unique users in all dynamic groups in your tenant, you would need at least 1,000 licenses for Azure AD Premium P1 to meet the license requirement.
>
> You can create a dynamic group for devices or for users, but you can't create a rule that contains both users and devices.
> 
> At the moment, it is not possible to create a device group based on the owning user's attributes. Device membership rules can only reference immediate attributes of device objects in the directory.

## To create an advanced rule

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that is a global administrator or a user account administrator.
2. Select **Users and groups**.
3. Select **All groups**, and select **New group**.

   ![Add new group](./media/groups-dynamic-membership/new-group-creation.png)

4. On the **Group** blade, enter a name and description for the new group. Select a **Membership type** of either **Dynamic User** or **Dynamic Device**, depending on whether you want to create a rule for users or devices, and then select **Add dynamic query**. You can use the rule builder to build a simple rule, or write an advanced rule yourself. This article contains more information about available user and device attributes as well as examples of advanced rules.

   ![Add dynamic membership rule](./media/groups-dynamic-membership/add-dynamic-group-rule.png)

5. After creating the rule, select **Add query** at the bottom of the blade.
6. Select **Create** on the **Group** blade to create the group.

> [!TIP]
> Group creation fails if the rule you entered was incorrectly formed or not valid. A notification is displayed in the upper-right hand corner of the portal, containing an explanation of why the rule could not be processed. Read it carefully to understand how you need to adjust the rule to make it valid.

## Status of the dynamic rule

You can see the membership processing status and the last updated date on the Overview page for your dynamic group.
  
  ![dynamic group status display](./media/groups-dynamic-membership/group-status.png)


The following status messages can be shown for **Membership processing** status:

* **Evaluating**:  The group change has been received and the updates are being evaluated.
* **Processing**: Updates are being processed.
* **Update complete**: Processing has completed and all applicable updates have been made.
* **Processing error**: An error was encountered while evaluating the membership rule and processing could not be completed.
* **Update paused**: Dynamic membership rule updates have been paused by the administrator. MembershipRuleProcessingState is set to “Paused”.

The following status messages can be shown for **Membership last updated** status:

* &lt;**Date and time**&gt;: The last time the membership was updated.
* **In Progress**: Updates are currently in progress.
* **Unknown**: The last update time cannot be retrieved. It may be due to the group being newly created.

If an error occurs while processing the membership rule for a specific group, an alert is shown on the top of the **Overview page** for the group. If no pending dynamic membership updates can be processed for all the groups within the tenant for more then 24 hours, an alert is shown on the top of **All groups**.

![processing error message](./media/groups-dynamic-membership/processing-error.png)

## Constructing the body of an advanced rule

The advanced rule that you can create for the dynamic memberships for groups is essentially a binary expression that consists of three parts and results in a true or false outcome. The three parts are:

* Left parameter
* Binary operator
* Right constant

A complete advanced rule looks similar to this: (leftParameter binaryOperator "RightConstant"), where the opening and closing parenthesis are optional for the entire binary expression, double quotes are optional as well, only required for the right constant when it is string, and the syntax for the left parameter is user.property. An advanced rule can consist of more than one binary expressions separated by the -and, -or, and -not logical operators.

The following are examples of a properly constructed advanced rule:
```
(user.department -eq "Sales") -or (user.department -eq "Marketing")
(user.department -eq "Sales") -and -not (user.jobTitle -contains "SDE")
```
For the complete list of supported parameters and expression rule operators, see sections below. For the attributes used for device rules, see [Using attributes to create rules for device objects](#using-attributes-to-create-rules-for-device-objects).

The total length of the body of your advanced rule cannot exceed 2048 characters.

> [!NOTE]
> String and regex operations are not case sensitive. You can also perform Null checks, using *null* as a constant, for example, user.department -eq *null*.
> Strings containing quotes " should be escaped using 'character, for example, user.department -eq \`"Sales".

## Supported expression rule operators

The following table lists all the supported expression rule operators and their syntax to be used in the body of the advanced rule:

| Operator | Syntax |
| --- | --- |
| Not Equals |-ne |
| Equals |-eq |
| Not Starts With |-notStartsWith |
| Starts With |-startsWith |
| Not Contains |-notContains |
| Contains |-contains |
| Not Match |-notMatch |
| Match |-match |
| In | -in |
| Not In | -notIn |

## Operator precedence

All Operators are listed below per precedence from lower to higher. Operators on same line are in equal precedence:

````
-any -all
-or
-and
-not
-eq -ne -startsWith -notStartsWith -contains -notContains -match –notMatch -in -notIn
````

All operators can be used with or without the hyphen prefix. Parentheses are needed only when precedence does not meet your requirements.
For example:

```
   user.department –eq "Marketing" –and user.country –eq "US"
```

is equivalent to:

```
   (user.department –eq "Marketing") –and (user.country –eq "US")
```

## Using the -In and -notIn operators

If you want to compare the value of a user attribute against a number of different values you can use the -In or -notIn operators. Here is an example using the -In operator:
```
   user.department -In ["50001","50002","50003",“50005”,“50006”,“50007”,“50008”,“50016”,“50020”,“50024”,“50038”,“50039”,“51100”]
```
Note the use of the "[" and "]" at the beginning and end of the list of values. This condition evaluates to True of the value of user.department equals one of the values in the list.


## Query error remediation

The following table lists common errors and how to correct them

| Query Parse Error | Error Usage | Corrected Usage |
| --- | --- | --- |
| Error: Attribute not supported. |(user.invalidProperty -eq "Value") |(user.department -eq "value")<br/><br/>Make sure the attribute is on the [supported properties list](#supported-properties). |
| Error: Operator is not supported on attribute. |(user.accountEnabled -contains true) |(user.accountEnabled -eq true)<br/><br/>The operator used is not supported for the property type (in this example, -contains cannot be used on type boolean). Use the correct operators for the property type. |
| Error: Query compilation error. |1. (user.department -eq "Sales") (user.department -eq "Marketing")<br/><br/>2. (user.userPrincipalName -match "*@domain.ext") |1. Missing operator. Use -and or -or two join predicates<br/><br/>(user.department -eq "Sales") -or (user.department -eq "Marketing")<br/><br/>2.Error in regular expression used with -match<br/><br/>(user.userPrincipalName -match ".*@domain.ext"), alternatively: (user.userPrincipalName -match "\@domain.ext$")|

## Supported properties

The following are all the user properties that you can use in your advanced rule:

### Properties of type boolean

Allowed operators

* -eq
* -ne

| Properties | Allowed values | Usage |
| --- | --- | --- |
| accountEnabled |true false |user.accountEnabled -eq true |
| dirSyncEnabled |true false |user.dirSyncEnabled -eq true |

### Properties of type string

Allowed operators

* -eq
* -ne
* -notStartsWith
* -StartsWith
* -contains
* -notContains
* -match
* -notMatch
* -in
* -notIn

| Properties | Allowed values | Usage |
| --- | --- | --- |
| city |Any string value or *null* |(user.city -eq "value") |
| country |Any string value or *null* |(user.country -eq "value") |
| companyName | Any string value or *null* | (user.companyName -eq "value") |
| department |Any string value or *null* |(user.department -eq "value") |
| displayName |Any string value |(user.displayName -eq "value") |
| employeeId |Any string value |(user.employeeId -eq "value")<br>(user.employeeId -ne *null*) |
| facsimileTelephoneNumber |Any string value or *null* |(user.facsimileTelephoneNumber -eq "value") |
| givenName |Any string value or *null* |(user.givenName -eq "value") |
| jobTitle |Any string value or *null* |(user.jobTitle -eq "value") |
| mail |Any string value or *null* (SMTP address of the user) |(user.mail -eq "value") |
| mailNickName |Any string value (mail alias of the user) |(user.mailNickName -eq "value") |
| mobile |Any string value or *null* |(user.mobile -eq "value") |
| objectId |GUID of the user object |(user.objectId -eq "11111111-1111-1111-1111-111111111111") |
| onPremisesSecurityIdentifier | On-premises security identifier (SID) for users who were synchronized from on-premises to the cloud. |(user.onPremisesSecurityIdentifier -eq "S-1-1-11-1111111111-1111111111-1111111111-1111111") |
| passwordPolicies |None DisableStrongPassword DisablePasswordExpiration DisablePasswordExpiration, DisableStrongPassword |(user.passwordPolicies -eq "DisableStrongPassword") |
| physicalDeliveryOfficeName |Any string value or *null* |(user.physicalDeliveryOfficeName -eq "value") |
| postalCode |Any string value or *null* |(user.postalCode -eq "value") |
| preferredLanguage |ISO 639-1 code |(user.preferredLanguage -eq "en-US") |
| sipProxyAddress |Any string value or *null* |(user.sipProxyAddress -eq "value") |
| state |Any string value or *null* |(user.state -eq "value") |
| streetAddress |Any string value or *null* |(user.streetAddress -eq "value") |
| surname |Any string value or *null* |(user.surname -eq "value") |
| telephoneNumber |Any string value or *null* |(user.telephoneNumber -eq "value") |
| usageLocation |Two lettered country code |(user.usageLocation -eq "US") |
| userPrincipalName |Any string value |(user.userPrincipalName -eq "alias@domain") |
| userType |member guest *null* |(user.userType -eq "Member") |

### Properties of type string collection

Allowed operators

* -contains
* -notContains

| Properties | Allowed values | Usage |
| --- | --- | --- |
| otherMails |Any string value |(user.otherMails -contains "alias@domain") |
| proxyAddresses |SMTP: alias@domain smtp: alias@domain |(user.proxyAddresses -contains "SMTP: alias@domain") |

## Multi-value properties

Allowed operators

* -any (satisfied when at least one item in the collection matches the condition)
* -all (satisfied when all items in the collection match the condition)

| Properties | Values | Usage |
| --- | --- | --- |
| assignedPlans |Each object in the collection exposes the following string properties: capabilityStatus, service, servicePlanId |user.assignedPlans -any (assignedPlan.servicePlanId -eq "efb87545-963c-4e0d-99df-69c6916d9eb0" -and assignedPlan.capabilityStatus -eq "Enabled") |
| proxyAddresses| SMTP: alias@domain smtp: alias@domain | (user.proxyAddresses -any (\_ -contains "contoso")) |

Multi-value properties are collections of objects of the same type. You can use -any and -all operators to apply a condition to one or all of the items in the collection, respectively. For example:

assignedPlans is a multi-value property that lists all service plans assigned to the user. The below expression will select users who have the Exchange Online (Plan 2) service plan that is also in Enabled state:

```
user.assignedPlans -any (assignedPlan.servicePlanId -eq "efb87545-963c-4e0d-99df-69c6916d9eb0" -and assignedPlan.capabilityStatus -eq "Enabled")
```

(The GUID identifier identifies the Exchange Online (Plan 2) service plan.)

> [!NOTE]
> This is useful if you want to identify all users for whom an Office 365 (or other Microsoft Online Service) capability has been enabled, for example to target them with a certain set of policies.

The following expression selects all users who have any service plan that is associated with the Intune service (identified by service name "SCO"):
```
user.assignedPlans -any (assignedPlan.service -eq "SCO" -and assignedPlan.capabilityStatus -eq "Enabled")
```

### Using the underscore (\_) syntax

The underscore (\_) syntax matches occurrences of a specific value in one of the multivalued string collection properties to add users or devices to a dynamic group. It is used with the -any or -all operators.

Here's an example of using the underscore (\_) in a rule to add members based on user.proxyAddress (it works the same for user.otherMails). This rule adds any user with proxy address that contains "contoso" to the group.

```
(user.proxyAddresses -any (_ -contains "contoso"))
```

## Use of Null values

To specify a null value in a rule, you can use the *null* value. Be careful not to use quotes around the word *null* - if you do, it will be interpreted as a literal string value. The -not operator can't be used as a comparative operator for null. If you use it, you get an error whether you use null or $null. Instead, use -eq or -ne. The correct way to reference the null value is as follows:
```
   user.mail –ne $null
```

## Extension attributes and custom attributes
Extension attributes and custom attributes are supported in dynamic membership rules.

Extension attributes are synced from on-premises Window Server AD and take the format of "ExtensionAttributeX", where X equals 1 - 15.
An example of a rule that uses an extension attribute would be

```
(user.extensionAttribute15 -eq "Marketing")
```

Custom Attributes are synced from on-premises Windows Server AD or from a connected SaaS application and the format of "user.extension_[GUID]\__[Attribute]", where [GUID] is the unique identifier in AAD for the application that created the attribute in Azure AD and [Attribute] is the name of the attribute as it was created. An example of a rule that uses a custom attribute is

```
user.extension_c272a57b722d4eb29bfe327874ae79cb__OfficeNumber  
```

The custom attribute name can be found in the directory by querying a user's attribute using Graph Explorer and searching for the attribute name.

## "Direct Reports" Rule
You can create a group containing all direct reports of a manager. When the manager's direct reports change in the future, the group's membership will be adjusted automatically.

> [!NOTE]
> 1. For the rule to work, make sure the **Manager ID** property is set correctly on users in your tenant. You can check the current value for a user on their **Profile tab**.
> 2. This rule only supports **direct** reports. It is currently not possible to create a group for a nested hierarchy; for example, a group that includes direct reports and their reports.
> 3. This rule cannot be combined with any other advanced rules.

**To configure the group**

1. Follow steps 1-5 from section [To create the advanced rule](#to-create-the-advanced-rule), and select a **Membership type** of **Dynamic User**.
2. On the **Dynamic membership rules** blade, enter the rule with the following syntax:

    *Direct Reports for "{objectID_of_manager}"*

    An example of a valid rule:
```
                    Direct Reports for "62e19b97-8b3d-4d4a-a106-4ce66896a863"
```
    where “62e19b97-8b3d-4d4a-a106-4ce66896a863” is the objectID of the manager. The object ID can be found on manager's **Profile tab**.
3. After saving the rule, all users with the specified Manager ID value will be added to the group.

## Using attributes to create rules for device objects
You can also create a rule that selects device objects for membership in a group. The following device attributes can be used.

 Device attribute  | Values | Example
 ----- | ----- | ----------------
 accountEnabled | true false | (device.accountEnabled -eq true)
 displayName | any string value |(device.displayName -eq "Rob Iphone”)
 deviceOSType | any string value | (device.deviceOSType -eq "iPad") -or (device.deviceOSType -eq "iPhone")
 deviceOSVersion | any string value | (device.OSVersion -eq "9.1")
 deviceCategory | a valid device category name | (device.deviceCategory -eq "BYOD")
 deviceManufacturer | any string value | (device.deviceManufacturer -eq "Samsung")
 deviceModel | any string value | (device.deviceModel -eq "iPad Air")
 deviceOwnership | Personal, Company, Unknown | (device.deviceOwnership -eq "Company")
 domainName | any string value | (device.domainName -eq "contoso.com")
 enrollmentProfileName | Apple Device Enrollment Profile or Windows Autopilot profile name | (device.enrollmentProfileName -eq "DEP iPhones")
 isRooted | true false | (device.isRooted -eq true)
 managementType | MDM (for mobile devices)<br>PC (for computers managed by the Intune PC agent) | (device.managementType -eq "MDM")
 organizationalUnit | any string value matching the name of the organizational unit set by an on-premises Active Directory | (device.organizationalUnit -eq "US PCs")
 deviceId | a valid Azure AD device ID | (device.deviceId -eq "d4fe7726-5966-431c-b3b8-cddc8fdb717d")
 objectId | a valid Azure AD object ID |  (device.objectId -eq 76ad43c9-32c5-45e8-a272-7b58b58f596d")



## Changing dynamic membership to static, and vice versa
It is possible to change how membership is managed in a group. This is useful when you want to keep the same group name and ID in the system, so any existing references to the group are still valid; creating a new group would require updating those references.

We've updated the Azure AD Admin center to add support this functionality. Now, customers can convert existing groups from dynamic membership to assigned membership and vice-versa either via Azure AD Admin center or PowerShell cmdlets as shown below.

> [!WARNING]
> When changing an existing static group to a dynamic group, all existing members will be removed from the group, and then the membership rule will be processed to add new members. If the group is used to control access to apps or resources, the original members may lose access until the membership rule is fully processed.
>
> We recommend that you test the new membership rule beforehand to make sure that the new membership in the group is as expected.

### Using Azure AD admin center to change membership management on a group 

1. Sign in to the [Azure AD admin center](https://aad.portal.azure.com) with an account that is a global administrator or a user account administrator in your tenant.
2. Select **Groups**.
3. From the **All groups** list, open the group that you want to change.
4. Select **Properties**.
5. On the **Properties** page for the group, select a **Membership type** of either Assigned (static), Dynamic User, or Dynamic Device, depending on your desired membership type. For dynamic membership, you can use the rule builder to select options for a simple rule or write an advanced rule yourself. 

The following steps are an example of changing a group from static to dynamic membership for a group of users. 

1. On the **Properties** page for your selected group, select a **Membership type** of **Dynamic User**, then select Yes on the dialog explaining the changes to the group membership to continue. 
  
   ![select membership type of dynamic user](./media/groups-dynamic-membership/select-group-to-convert.png)
  
2. Select **Add dynamic query**, and then provide the rule.
  
   ![enter the rule](./media/groups-dynamic-membership/enter-rule.png)
  
3. After creating the rule, select **Add query** at the bottom of the page.
4. Select **Save** on the **Properties** page for the group to save your changes. The **Membership type** of the group is immediately updated in the group list.

> [!TIP]
> Group conversion might fail if the advanced rule you entered was incorrect. A notification is displayed in the upper-right hand corner of the portal that it contains an explanation of why the rule can't be accepted by the system. Read it carefully to understand how you can adjust the rule to make it valid.

### Using PowerShell to change membership management on a group

> [!NOTE]
> To change dynamic group properties you will need to use cmdlets from **the preview version of** [Azure AD PowerShell Version 2](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0). You can install the preview from the [PowerShell Gallery](https://www.powershellgallery.com/packages/AzureADPreview).

Here is an example of functions that switch membership management on an existing group. In this example, care is taken to correctly manipulate the GroupTypes property and preserve any values that are unrelated to dynamic membership.

```
#The moniker for dynamic groups as used in the GroupTypes property of a group object
$dynamicGroupTypeString = "DynamicMembership"

function ConvertDynamicGroupToStatic
{
    Param([string]$groupId)

    #existing group types
    [System.Collections.ArrayList]$groupTypes = (Get-AzureAdMsGroup -Id $groupId).GroupTypes

    if($groupTypes -eq $null -or !$groupTypes.Contains($dynamicGroupTypeString))
    {
        throw "This group is already a static group. Aborting conversion.";
    }


    #remove the type for dynamic groups, but keep the other type values
    $groupTypes.Remove($dynamicGroupTypeString)

    #modify the group properties to make it a static group: i) change GroupTypes to remove the dynamic type, ii) pause execution of the current rule
    Set-AzureAdMsGroup -Id $groupId -GroupTypes $groupTypes.ToArray() -MembershipRuleProcessingState "Paused"
}

function ConvertStaticGroupToDynamic
{
    Param([string]$groupId, [string]$dynamicMembershipRule)

    #existing group types
    [System.Collections.ArrayList]$groupTypes = (Get-AzureAdMsGroup -Id $groupId).GroupTypes

    if($groupTypes -ne $null -and $groupTypes.Contains($dynamicGroupTypeString))
    {
        throw "This group is already a dynamic group. Aborting conversion.";
    }
    #add the dynamic group type to existing types
    $groupTypes.Add($dynamicGroupTypeString)

    #modify the group properties to make it a static group: i) change GroupTypes to add the dynamic type, ii) start execution of the rule, iii) set the rule
    Set-AzureAdMsGroup -Id $groupId -GroupTypes $groupTypes.ToArray() -MembershipRuleProcessingState "On" -MembershipRule $dynamicMembershipRule
}
```
To make a group static:
```
ConvertDynamicGroupToStatic "a58913b2-eee4-44f9-beb2-e381c375058f"
```
To make a group dynamic:
```
ConvertStaticGroupToDynamic "a58913b2-eee4-44f9-beb2-e381c375058f" "user.displayName -startsWith ""Peter"""
```
## Next steps
These articles provide additional information on groups in Azure Active Directory.

* [See existing groups](../fundamentals/active-directory-groups-view-azure-portal.md)
* [Create a new group and adding members](../fundamentals/active-directory-groups-create-azure-portal.md)
* [Manage settings of a group](../fundamentals/active-directory-groups-settings-azure-portal.md)
* [Manage memberships of a group](../fundamentals/active-directory-groups-membership-azure-portal.md)
* [Manage dynamic rules for users in a group](groups-dynamic-membership.md)
