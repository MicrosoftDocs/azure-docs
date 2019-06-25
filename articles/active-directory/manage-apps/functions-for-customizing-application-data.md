---
title: Writing Expressions for Attribute Mappings in Azure Active Directory | Microsoft Docs
description: Learn how to use expression mappings to transform attribute values into an acceptable format during automated provisioning of SaaS app objects in Azure Active Directory.
services: active-directory
documentationcenter: ''
author: msmimart
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 01/21/2019
ms.author: mimart

ms.collection: M365-identity-device-management
---
# Writing Expressions for Attribute Mappings in Azure Active Directory
When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. 
 For these, you must write a script-like expression that allows you to transform your users’ data into formats that are more acceptable for the SaaS application.

## Syntax Overview
The syntax for Expressions for Attribute Mappings is reminiscent of Visual Basic for Applications (VBA) functions.

* The entire expression must be defined in terms of functions, which consist of a name followed by arguments in parentheses: <br>
  *FunctionName(`<<argument 1>>`,`<<argument N>>`)*
* You may nest functions within each other. For example: <br> *FunctionOne(FunctionTwo(`<<argument1>>`))*
* You can pass three different types of arguments into functions:
  
  1. Attributes, which must be enclosed in square brackets. For example: [attributeName]
  2. String constants, which must be enclosed in double quotes. For example: "United States"
  3. Other Functions. For example: FunctionOne(`<<argument1>>`, FunctionTwo(`<<argument2>>`))
* For string constants, if you need a backslash ( \ ) or quotation mark ( " ) in the string, it must be escaped with the backslash ( \ ) symbol. For example: "Company name: \\"Contoso\\""

## List of Functions
[Append](#append) &nbsp;&nbsp;&nbsp;&nbsp; [FormatDateTime](#formatdatetime) &nbsp;&nbsp;&nbsp;&nbsp; [Join](#join) &nbsp;&nbsp;&nbsp;&nbsp; [Mid](#mid) &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; [NormalizeDiacritics](#normalizediacritics) [Not](#not) &nbsp;&nbsp;&nbsp;&nbsp; [Replace](#replace) &nbsp;&nbsp;&nbsp;&nbsp; [SelectUniqueValue](#selectuniquevalue)&nbsp;&nbsp;&nbsp;&nbsp; [SingleAppRoleAssignment](#singleapproleassignment)&nbsp;&nbsp;&nbsp;&nbsp; [Split](#split)&nbsp;&nbsp;&nbsp;&nbsp;[StripSpaces](#stripspaces) &nbsp;&nbsp;&nbsp;&nbsp; [Switch](#switch)&nbsp;&nbsp;&nbsp;&nbsp; [ToLower](#tolower)&nbsp;&nbsp;&nbsp;&nbsp; [ToUpper](#toupper)

---
### Append
**Function:**<br> 
Append(source, suffix)

**Description:**<br> 
Takes a source string value and appends the suffix to the end of it.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **suffix** |Required |String |The string that you want to append to the end of the source value. |

---
### FormatDateTime
**Function:**<br> 
FormatDateTime(source, inputFormat, outputFormat)

**Description:**<br> 
Takes a date string from one format and converts it into a different format.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **inputFormat** |Required |String |Expected format of the source value. For supported formats, see [https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx](https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx). |
| **outputFormat** |Required |String |Format of the output date. |

---
### Join
**Function:**<br> 
Join(separator, source1, source2, …)

**Description:**<br> 
Join() is similar to Append(), except that it can combine multiple **source** string values into a single string, and each value will be separated by a **separator** string.

If one of the source values is a multi-value attribute, then every value in that attribute will be joined together, separated by the separator value.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **separator** |Required |String |String used to separate source values when they are concatenated into one string. Can be "" if no separator is required. |
| **source1  … sourceN** |Required, variable-number of times |String |String values to be joined together. |

---
### Mid
**Function:**<br> 
Mid(source, start, length)

**Description:**<br> 
Returns a substring of the source value. A substring is a string that contains only some of the characters from the source string.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute. |
| **start** |Required |integer |Index in the **source** string where substring should start. First character in the string will have index of 1, second character will have index 2, and so on. |
| **length** |Required |integer |Length of the substring. If length ends outside the **source** string, function will return substring from **start** index till end of **source** string. |

---
### NormalizeDiacritics
**Function:**<br> 
NormalizeDiacritics(source)

**Description:**<br> 
Requires one string argument. Returns the string, but with any diacritical characters replaced with equivalent non-diacritical characters. Typically used to convert first names and last names containing diacritical characters (accent marks) into legal values that can be used in various user identifiers such as user principal names, SAM account names, and email addresses.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String | Usually a first name or last name attribute. |

---
### Not
**Function:**<br> 
Not(source)

**Description:**<br> 
Flips the boolean value of the **source**. If **source** value is "*True*", returns "*False*". Otherwise, returns "*True*".

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |Boolean String |Expected **source** values are "True" or "False". |

---
### Replace
**Function:**<br> 
Replace(source, oldValue, regexPattern, regexGroupName, replacementValue, replacementAttributeName, template)

**Description:**<br>
Replaces values within a string. It works differently depending on the parameters provided:

* When **oldValue** and **replacementValue** are provided:
  
  * Replaces all occurrences of oldValue in the source  with replacementValue
* When **oldValue** and **template** are provided:
  
  * Replaces all occurrences of the **oldValue** in the **template** with the **source** value
* When **regexPattern**, **regexGroupName**, **replacementValue** are provided:
  
  * Replaces all values matching oldValueRegexPattern in the source string with replacementValue
* When **regexPattern**, **regexGroupName**, **replacementPropertyName** are provided:
  
  * If **source** has no value, **source** is returned
  * If **source** has a value, uses **regexPattern** and **regexGroupName** to extract replacement value from the property with **replacementPropertyName**. Replacement value is returned as the result

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **oldValue** |Optional |String |Value to be replaced in **source** or **template**. |
| **regexPattern** |Optional |String |Regex pattern for the value to be replaced in **source**. Or, when replacementPropertyName is used, pattern to extract value from replacement property. |
| **regexGroupName** |Optional |String |Name of the group inside **regexPattern**. Only when  replacementPropertyName is used, we will extract value of this group as replacementValue from replacement property. |
| **replacementValue** |Optional |String |New value to replace old one with. |
| **replacementAttributeName** |Optional |String |Name of the attribute to be used for replacement value, when source has no value. |
| **template** |Optional |String |When **template** value is provided, we will look for **oldValue** inside the template and replace it with source value. |

---
### SelectUniqueValue
**Function:**<br> 
SelectUniqueValue(uniqueValueRule1, uniqueValueRule2, uniqueValueRule3, …)

**Description:**<br> 
Requires a minimum of two arguments, which are unique value generation rules defined using expressions. The function evaluates each rule and then checks the value generated for uniqueness in the target app/directory. The first unique value found will be the one returned. If all of the values already exist in the target, the entry will get escrowed and the reason gets logged in the audit logs. There is no upper bound to the number of arguments that can be provided.

> [!NOTE]
>1. This is a top-level function, it cannot be nested.
>2. This function is only meant to be used for entry creations. When using it with an attribute, set the **Apply Mapping** property to **Only during object creation**.


**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **uniqueValueRule1  … uniqueValueRuleN** |At least 2 are required, no upper bound |String | List of unique value generation rules to evaluate. |


---
### SingleAppRoleAssignment
**Function:**<br> 
SingleAppRoleAssignment([appRoleAssignments])

**Description:**<br> 
Returns a single appRoleAssignment from the list of all appRoleAssignments assigned to a user for a given application. This function is required to convert the appRoleAssignments object into a single role name string. Note that the best practice is to ensure only one appRoleAssignment is assigned to one user at a time, and if multiple roles are assigned the role string returned may not be predictable. 

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **[appRoleAssignments]** |Required |String |**[appRoleAssignments]** object. |

---
### Split
**Function:**<br> 
Split(source, delimiter)

**Description:**<br> 
Splits a string into a mulit-valued array, using the specified delimiter character.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**source** value to update. |
| **delimiter** |Required |String |Specifies the character that will be used to split the string (example: ",") |

---
### StripSpaces
**Function:**<br> 
StripSpaces(source)

**Description:**<br> 
Removes all space (" ") characters from the source string.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**source** value to update. |

---
### Switch
**Function:**<br> 
Switch(source, defaultValue, key1, value1, key2, value2, …)

**Description:**<br> 
When **source** value matches a **key**, returns **value** for that **key**. If **source** value doesn't match any keys, returns **defaultValue**.  **Key** and **value** parameters must always come in pairs. The function always expects an even number of parameters.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**Source** value to update. |
| **defaultValue** |Optional |String |Default value to be used when source doesn't match any keys. Can be empty string (""). |
| **key** |Required |String |**Key** to compare **source** value with. |
| **value** |Required |String |Replacement value for the **source** matching the key. |

---
### ToLower
**Function:**<br> 
ToLower(source, culture)

**Description:**<br> 
Takes a *source* string value and converts it to lower case using the culture rules that are specified. If there is no *culture* info specified, then it will use Invariant culture.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object |
| **culture** |Optional |String |The format for the culture name based on RFC 4646 is *languagecode2-country/regioncode2*, where *languagecode2* is the two-letter language code and *country/regioncode2* is the two-letter subculture code. Examples include ja-JP for Japanese (Japan) and en-US for English (United States). In cases where a two-letter language code is not available, a three-letter code derived from ISO 639-2 is used.|

---
### ToUpper
**Function:**<br> 
ToUpper(source, culture)

**Description:**<br> 
Takes a *source* string value and converts it to upper case using the culture rules that are specified. If there is no *culture* info specified, then it will use Invariant culture.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **culture** |Optional |String |The format for the culture name based on RFC 4646 is *languagecode2-country/regioncode2*, where *languagecode2* is the two-letter language code and *country/regioncode2* is the two-letter subculture code. Examples include ja-JP for Japanese (Japan) and en-US for English (United States). In cases where a two-letter language code is not available, a three-letter code derived from ISO 639-2 is used.|

## Examples
### Strip known domain name
You need to strip a known domain name from a user’s email to obtain a user name. <br>
For example, if the domain is "contoso.com", then you could use the following expression:

**Expression:** <br>
`Replace([mail], "@contoso.com", , ,"", ,)`

**Sample input / output:** <br>

* **INPUT** (mail): "john.doe@contoso.com"
* **OUTPUT**:  "john.doe"

### Append constant suffix to user name
If you are using a Salesforce Sandbox, you might need to append an additional suffix to all your user names before synchronizing them.

**Expression:** <br>
`Append([userPrincipalName], ".test")`

**Sample input/output:** <br>

* **INPUT**: (userPrincipalName): "John.Doe@contoso.com"
* **OUTPUT**:  "John.Doe@contoso.com.test"

### Generate user alias by concatenating parts of first and last name
You need to generate a user alias by taking first 3 letters of user's first name and first 5 letters of user's last name.

**Expression:** <br>
`Append(Mid([givenName], 1, 3), Mid([surname], 1, 5))`

**Sample input/output:** <br>

* **INPUT** (givenName): "John"
* **INPUT** (surname): "Doe"
* **OUTPUT**:  "JohDoe"

### Remove diacritics from a string
You need to replace characters containing accent marks with equivalent characters that don't contain accent marks.

**Expression:** <br>
NormalizeDiacritics([givenName])

**Sample input/output:** <br>

* **INPUT** (givenName): "Zoë"
* **OUTPUT**:  "Zoe"

### Split a string into a multi-valued array
You need to take a comma-delimited list of strings, and split them into an array that can be plugged into a multi-value attribute like Salesforce's PermissionSets attribute. In this example, a list of permission sets has been populated in extensionAttribute5 in Azure AD.

**Expression:** <br>
Split([extensionAttribute5], ",")

**Sample input/output:** <br>

* **INPUT** (extensionAttribute5): "PermissionSetOne, PermisionSetTwo"
* **OUTPUT**:  ["PermissionSetOne", "PermissionSetTwo"]

### Output date as a string in a certain format
You want to send dates to a SaaS application in a certain format. <br>
For example, you want to format dates for ServiceNow.

**Expression:** <br>

`FormatDateTime([extensionAttribute1], "yyyyMMddHHmmss.fZ", "yyyy-MM-dd")`

**Sample input/output:**

* **INPUT** (extensionAttribute1): "20150123105347.1Z"
* **OUTPUT**:  "2015-01-23"

### Replace a value based on predefined set of options

You need to define the time zone of the user based on the state code stored in Azure AD. <br>
If the state code doesn't match any of the predefined options, use default value of "Australia/Sydney".

**Expression:** <br>
`Switch([state], "Australia/Sydney", "NSW", "Australia/Sydney","QLD", "Australia/Brisbane", "SA", "Australia/Adelaide")`

**Sample input/output:**

* **INPUT** (state): "QLD"
* **OUTPUT**: "Australia/Brisbane"

### Replace characters using a regular expression
You need to find characters that match a regular expression value and remove them.

**Expression:** <br>

Replace([mailNickname], , "[a-zA-Z_]*", , "", , )

**Sample input/output:**

* **INPUT** (mailNickname: "john_doe72"
* **OUTPUT**: "72"

### Convert generated userPrincipalName (UPN) value to lower case
In the example below, the UPN value is generated by concatenating the PreferredFirstName and PreferredLastName source fields and the ToLower function operates on the generated string to convert all characters to lower case. 

`ToLower(Join("@", NormalizeDiacritics(StripSpaces(Join(".",  [PreferredFirstName], [PreferredLastName]))), "contoso.com"))`

**Sample input/output:**

* **INPUT** (PreferredFirstName): "John"
* **INPUT** (PreferredLastName): "Smith"
* **OUTPUT**: "john.smith@contoso.com"

### Generate unique value for userPrincipalName (UPN) attribute
Based on the user's first name, middle name and last name, you need to generate a value for the UPN attribute and check for its uniqueness in the target AD directory before assigning the value to the UPN attribute.

**Expression:** <br>

    SelectUniqueValue( 
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  [PreferredFirstName], [PreferredLastName]))), "contoso.com"), 
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  Mid([PreferredFirstName], 1, 1), [PreferredLastName]))), "contoso.com")
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  Mid([PreferredFirstName], 1, 2), [PreferredLastName]))), "contoso.com")
    )

**Sample input/output:**

* **INPUT** (PreferredFirstName): "John"
* **INPUT** (PreferredLastName): "Smith"
* **OUTPUT**: "John.Smith@contoso.com" if UPN value of John.Smith@contoso.com doesn't already exist in the directory
* **OUTPUT**: "J.Smith@contoso.com" if UPN value of John.Smith@contoso.com already exists in the directory
* **OUTPUT**: "Jo.Smith@contoso.com" if the above two UPN values already exist in the directory

## Related Articles
* [Automate User Provisioning/Deprovisioning to SaaS Apps](user-provisioning.md)
* [Customizing Attribute Mappings for User Provisioning](customize-application-attributes.md)
* [Scoping Filters for User Provisioning](define-conditional-rules-for-provisioning-user-accounts.md)
* [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](use-scim-to-provision-users-and-groups.md)
* [Account Provisioning Notifications](user-provisioning.md)
* [List of Tutorials on How to Integrate SaaS Apps](../saas-apps/tutorial-list.md)
