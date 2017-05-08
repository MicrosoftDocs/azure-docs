---
title: Using attributes to create advanced rules| Microsoft Docs
description: How-to's to create advanced rules for a group including supported expression rule operators and parameters.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: 04813a42-d40a-48d6-ae96-15b7e5025884
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/08/2017
ms.author: curtand

---
# Using attributes to create advanced rules
The Azure classic portal provides you with the ability to create advanced rules to enable more complex attribute-based dynamic memberships for Azure Active Directory (Azure AD) groups.  

When any attributes of a user change, the system evaluates all dynamic group rules in a directory to see if the attribute change of the user would trigger any group adds or removes. If a user satisfies a rule on a group, they are added as a member to that group. If they no longer satisfy the rule of a group they are a member of, they are removed as a members from that group.

> [!NOTE]
> You can set up a rule for dynamic membership on security groups or Office 365 groups. Nested group memberships aren't currently supported for group-based assignment to applications.
>
> Dynamic memberships for groups require an Azure AD Premium license to be assigned to
>
> * The administrator who manages the rule on a group
> * All members of the group
>
> Please also not that although you can create a dynamic group for devices or users, you cannot create a rule that selects both user and device objects. 

## To create the advanced rule
1. In the [Azure classic portal](https://manage.windowsazure.com), select **Active Directory**, and then open your organization’s directory.
2. Select the **Groups** tab, and then open the group you want to edit.
3. Select the **Configure** tab, select the **Advanced rule** option, and then enter the advanced rule into the text box.

## Constructing the body of an advanced rule
The advanced rule that you can create for the dynamic memberships for groups is essentially a binary expression that consists of three parts and results in a true or false outcome. The three parts are:

* Left parameter
* Binary operator
* Right constant

A complete advanced rule looks similar to this: (leftParameter binaryOperator "RightConstant"), where the opening and closing parenthesis are required for the entire binary expression, double quotes are required for the right constant, and the syntax for the left parameter is user.property. An advanced rule can consist of more than one binary expressions separated by the -and, -or, and -not logical operators.
The following are examples of a properly constructed advanced rule:

* (user.department -eq "Sales") -or (user.department -eq "Marketing")
* (user.department -eq "Sales") -and -not (user.jobTitle -contains "SDE")

For the complete list of supported parameters and expression rule operators, see sections below.

Note that the property must be prefixed with the correct object type: user or device.
The below rule will fail the validation:
mail –ne null

The correct rule would be:

user.mail –ne null

The total length of the body of your advanced rule cannot exceed 2048 characters.

> [!NOTE]
> String and regex operations are case insensitive.
> Strings containing quotes " should be escaped using 'character, for example, user.department -eq \`"Sales".
> Only use quotes for string type values, and only use English quotes.
>
>

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

## Operator precedence

All Operators are listed below per precedence from lower to higher, operator in same line are in equal precedence
-any -all
-or
-and
-not
-eq -ne -startsWith -notStartsWith -contains -notContains -match –notMatch

All operators can be used with or without hyphen prefix.

Note that parenthesis are not always needed, you only need to add parenthesis when precedence does not meet your requirements
For example:

   user.department –eq "Marketing" –and user.country –eq "US"

is equivalent to:

   (user.department –eq "Marketing") –and (user.country –eq "US")

## Query error remediation
The following table lists potential errors and how to correct them if they occur

| Query Parse Error | Error Usage | Corrected Usage |
| --- | --- | --- |
| Error: Attribute not supported. |(user.invalidProperty -eq "Value") |(user.department -eq "value")<br/>Property should match one from the [supported properties list](#supported-properties). |
| Error: Operator is not supported on attribute. |(user.accountEnabled -contains true) |(user.accountEnabled -eq true)<br/>Property is of type boolean. Use the supported operators (-eq or -ne) on boolean type from the above list. |
| Error: Query compilation error. |(user.department -eq "Sales") -and (user.department -eq "Marketing")(user.userPrincipalName -match "*@domain.ext") |(user.department -eq "Sales") -and (user.department -eq "Marketing")<br/>Logical operator should match one from the supported properties list above.(user.userPrincipalName -match ".*@domain.ext")or(user.userPrincipalName -match "@domain.ext$")Error in regular expression. |
| Error: Binary expression is not in right format. |(user.department –eq “Sales”) (user.department -eq "Sales")(user.department-eq"Sales") |(user.accountEnabled -eq true) -and (user.userPrincipalName -contains "alias@domain")<br/>Query has multiple errors. Parenthesis not in right place. |
| Error: Unknown error occurred during setting up dynamic memberships. |(user.accountEnabled -eq "True" AND user.userPrincipalName -contains "alias@domain") |(user.accountEnabled -eq true) -and (user.userPrincipalName -contains "alias@domain")<br/>Query has multiple errors. Parenthesis not in right place. |

## Supported properties
The following are all the user properties that you can use in your advanced rule:

### Properties of type boolean
Allowed operators

* -eq
* -ne

| Properties | Allowed values | Usage |
| --- | --- | --- |
| accountEnabled |true false |user.accountEnabled -eq true) |
| dirSyncEnabled |true false null |(user.dirSyncEnabled -eq true) |

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

| Properties | Allowed values | Usage |
| --- | --- | --- |
| city |Any string value or $null |(user.city -eq "value") |
| country |Any string value or $null |(user.country -eq "value") |
| department |Any string value or $null |(user.department -eq "value") |
| displayName |Any string value |(user.displayName -eq "value") |
| facsimileTelephoneNumber |Any string value or $null |(user.facsimileTelephoneNumber -eq "value") |
| givenName |Any string value or $null |(user.givenName -eq "value") |
| jobTitle |Any string value or $null |(user.jobTitle -eq "value") |
| mail |Any string value or $null (SMTP address of the user) |(user.mail -eq "value") |
| mailNickName |Any string value (mail alias of the user) |(user.mailNickName -eq "value") |
| mobile |Any string value or $null |(user.mobile -eq "value") |
| objectId |GUID of the user object |(user.objectId -eq "1111111-1111-1111-1111-111111111111") |
| passwordPolicies |None DisableStrongPassword DisablePasswordExpiration DisablePasswordExpiration, DisableStrongPassword |(user.passwordPolicies -eq "DisableStrongPassword") |
| physicalDeliveryOfficeName |Any string value or $null |(user.physicalDeliveryOfficeName -eq "value") |
| postalCode |Any string value or $null |(user.postalCode -eq "value") |
| preferredLanguage |ISO 639-1 code |(user.preferredLanguage -eq "en-US") |
| sipProxyAddress |Any string value or $null |(user.sipProxyAddress -eq "value") |
| state |Any string value or $null |(user.state -eq "value") |
| streetAddress |Any string value or $null |(user.streetAddress -eq "value") |
| surname |Any string value or $null |(user.surname -eq "value") |
| telephoneNumber |Any string value or $null |(user.telephoneNumber -eq "value") |
| usageLocation |Two lettered country code |(user.usageLocation -eq "US") |
| userPrincipalName |Any string value |(user.userPrincipalName -eq "alias@domain") |
| userType |member guest $null |(user.userType -eq "Member") |

### Properties of type string collection
Allowed operators

* -contains
* -notContains

| Poperties | Allowed values | Usage |
| --- | --- | --- |
| otherMails |Any string value |(user.otherMails -contains "alias@domain") |
| proxyAddresses |SMTP: alias@domain smtp: alias@domain |(user.proxyAddresses -contains "SMTP: alias@domain") |

## Use of Null values

To specify a null value in a rule, you can use "null" or $null. Example:

   user.mail –ne null
is equivalent to
   user.mail –ne $null

## Extension attributes and custom attributes
Extension attributes and custom attributes are supported in dynamic membership rules.

Extension attributes are synced from on premise Window Server AD and take the format of "ExtensionAttributeX", where X equals 1 - 15.
An example of a rule that uses an extension attribute would be

(user.extensionAttribute15 -eq "Marketing")

Custom Attributes are synced from on premise Windows Server AD or from a connected SaaS application and the the format of "user.extension_[GUID]\__[Attribute]", where [GUID] is the unique identifier in AAD for the application that created the attribute in AAD and [Attribute] is the name of the attribute as it was created.
An example of a rule that uses a custom attribute is

user.extension_c272a57b722d4eb29bfe327874ae79cb__OfficeNumber  

The custom attribute name can be found in the directory by querying a user's attribute using Graph Explorer and searching for the attribute name.

## Support for multi-value properties

To include a multi-value property in a rule, use the "-any" operator, as in

  user.assignedPlans -any assignedPlan.service -startsWith "SCO"

## Direct Reports Rule
You can populate members in a group based on the manager attribute of a user.

**To configure a group as a “Manager” group**

1. In the Azure classic portal, click **Active Directory**, and then click the name of your organization’s directory.
2. Select the **Groups** tab, and then open the group you want to edit.
3. Select the **Configure** tab, and then select **ADVANCED RULE**.
4. Type the rule with the following syntax:

    Direct Reports for *Direct Reports for {obectID_of_manager}*. An example of a valid rule for Direct Reports is

                    Direct Reports for "62e19b97-8b3d-4d4a-a106-4ce66896a863”

    where “62e19b97-8b3d-4d4a-a106-4ce66896a863” is the objectID of the manager. The object ID can be found in the Azure AD on the **Profile tab** of the user page for the user who is the manager.
5. When saving this rule, all users that satisfy the rule will be joined as members of the group. It can take some minutes for the group to initially populate.

## Using attributes to create rules for device objects
You can also create a rule that selects device objects for membership in a group. The following device attributes can be used:

| Properties | Allowed values | Usage |
| --- | --- | --- |
| displayName |any string value |(device.displayName -eq "Rob Iphone”) |
| deviceOSType |any string value |(device.deviceOSType -eq "IOS") |
| deviceOSVersion |any string value |(device.OSVersion -eq "9.1") |
| isDirSynced |true false null |(device.isDirSynced -eq true) |
| isManaged |true false null |(device.isManaged -eq false) |
| isCompliant |true false null |(device.isCompliant -eq true) |
| deviceCategory |any string value |(device.deviceCategory -eq "") |
| deviceManufacturer |any string value |(device.deviceManufacturer -eq "Microsoft") |
| deviceModel |any string value |(device.deviceModel -eq "IPhone 7+") |
| deviceOwnership |any string value |(device.deviceOwnership -eq "") |
| domainName |any string value |(device.domainName -eq "contoso.com") |
| enrollmentProfileName |any string value |(device.enrollmentProfileName -eq "") |
| isRooted |true false null |(device.isRooted -eq true) |
| managementType |any string value |(device.managementType -eq "") |
| organizationalUnit |any string value |(device.organizationalUnit -eq "") |
| deviceId |a valid deviceId |(device.deviceId -eq "d4fe7726-5966-431c-b3b8-cddc8fdb717d" |

> [!NOTE]
> These device rules cannot be created using the "simple rule" dropdown in the Azure classic portal.
>
>

## Next steps
These articles provide additional information on Azure Active Directory.

* [Troubleshooting dynamic memberships for groups](active-directory-accessmanagement-troubleshooting.md)
* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [Azure Active Directory cmdlets for configuring group settings](active-directory-accessmanagement-groups-settings-cmdlets.md)
* [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
