<properties
	pageTitle="Writing Expressions for Attribute Mappings in Azure Active Directory | Microsoft Azure"
	description="Learn how to use expression mappings to transform attribute values into an acceptable format during automated provisioning of SaaS app objects in Azure Active Directory."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="femila"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/19/2016"
	ms.author="markusvi"/>


# Writing Expressions for Attribute Mappings in Azure Active Directory

When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. 
 For these, you must write a script-like expression that allows you to transform your users’ data into formats that are more acceptable for the SaaS application.





## Syntax Overview

The syntax for Expressions for Attribute Mappings is reminiscent of Visual Basic for Applications (VBA) functions.

- The entire expression must be defined in terms of functions, which consist of a name followed by arguments in parentheses: <br>
*FunctionName(<<argument 1>>,<<argument N>>)*


- You may nest functions within each other. For example: <br> *FunctionOne(FunctionTwo(<<argument1>>))*


- You can pass three different types of arguments into functions:

   1. Attributes, which must be enclosed in square square brackets. For example: [attributeName]

   2. String constants, which must be enclosed in double quotes. For example: "United States"

   3. Other Functions. For example: FunctionOne(<<argument1>>, FunctionTwo(<<argument2>>))


- For string constants, if you need a backslash ( \ ) or quotation mark ( " ) in the string, it must be escaped with the backslash ( \ ) symbol. For example: "Company name: \"Contoso\""



## List of Functions

[Append](#append) &nbsp;&nbsp;&nbsp;&nbsp; [FormatDateTime](#formatdatetime) &nbsp;&nbsp;&nbsp;&nbsp; [Join](#join) &nbsp;&nbsp;&nbsp;&nbsp; [Mid](#mid) &nbsp;&nbsp;&nbsp;&nbsp; [Not](#not) &nbsp;&nbsp;&nbsp;&nbsp; [Replace](#replace) &nbsp;&nbsp;&nbsp;&nbsp; [StripSpaces](#stripspaces) &nbsp;&nbsp;&nbsp;&nbsp; [Switch](#switch)





----------
### Append

**Function:**<br> 
Append(source, suffix)

**Description:**<br> 
Takes a source string value and appends the suffix to the end of it.
 
**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | String | Usually name of the attribute from the source object |
| **suffix** | Required | String | The string that you want to append to the end of the source value. |


----------
### FormatDateTime

**Function:**<br> 
FormatDateTime(source, inputFormat, outputFormat)

**Description:**<br> 
Takes a date string from one format and converts it into a different format.
 
**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | String | Usually name of the attribute from the source object. |
| **inputFormat** | Required | String | Expected format of the source value. For supported formats, see [http://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx](http://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx). |
| **outputFormat** | Required | String | Format of the output date. |



----------
### Join

**Function:**<br> 
Join(separator, source1, source2, …)

**Description:**<br> 
Join() is similar to Append(), except that it can combine multiple **source** string values into a single string, and each value will be separated by a **separator** string.

If one of the source values is a multi-value attribute, then every value in that attribute will be joined together, separated the separator value.

 
**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **separator** | Required | String | String used to separate source values when they are concatenated into one string. Can be "" if no separator is required. |
| **source1  … sourceN ** | Required, variable-number of times | String | String values to be joined together. |



----------
### Mid

**Function:**<br> 
Mid(source, start, length)

**Description:**<br> 
Returns a substring of the source value. A substring is a string that contains only some of the characters from the source string.


**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | String | Usually name of the attribute. |
| **start** | Required | integer | Index in the **source** string where substring should start. First character in the string will have index of 1, second character will have index 2, and so on. |
| **length** | Required | integer | Length of the substring. If length ends outside the **source** string, function will return substring from **start** index till end of **source** string. |




----------
### Not

**Function:**<br> 
Not(source)

**Description:**<br> 
Flips the boolean value of the **source**. If **source** value is "*True*", returns "*False*". Otherwise, returns "*True*".


**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | Boolean String | Expected **source** values are "True" or "False".. |



----------
### Replace

**Function:**<br> 
ObsoleteReplace(source, oldValue, regexPattern, regexGroupName, replacementValue, replacementAttributeName, template)

**Description:**<br>
Replaces values within a string. It works differently depending on the parameters provided:

- When **oldValue** and **replacementValue** are provided:

   - Replaces all occurrences of oldValue in the source  with replacementValue

- When **oldValue** and **template** are provided:

   - Replaces all occurrences of the **oldValue** in the **template** with the **source** value

- When **oldValueRegexPattern**, **oldValueRegexGroupName**, **replacementValue** are provided:

   - Replaces all values matching oldValueRegexPattern in the source string with replacementValue

- When **oldValueRegexPattern**, **oldValueRegexGroupName**, **replacementPropertyName** are provided:

   - If **source** has value, **source** is returned

   - If **source** has no value, uses **oldValueRegexPattern** and **oldValueRegexGroupName** to extract replacement value from the property with **replacementPropertyName**. Replacement value is returned as the result


**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | String | Usually name of the attribute from the source object. |
| **oldValue** | Optional | String | Value to be replaced in **source** or **template**. |
| **regexPattern** | Optional | String | Regex pattern for the value to be replaced in **source**. Or, when replacementPropertyName is used, pattern to extract value from replacement property. |
| **regexGroupName** | Optional | String | Name of the group inside **regexPattern**. Only when  replacementPropertyName is used, we will extract value of this group as replacementValue from replacement property. |
| **replacementValue** | Optional | String | New value to replace old one with. |
| **replacementAttributeName** | Optional | String | Name of the attribute to be used for replacement value, when source has no value. |
| **template** | Optional | String | When **template** value is provided, we will look for **oldValue** inside the template and replace it with source value. |



----------
### StripSpaces

**Function:**<br> 
StripSpaces(source)

**Description:**<br> 
Removes all space (" ") characters from the source string.

**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | String | **source** value to update. |



----------
### Switch

**Function:**<br> 
Switch(source, defaultValue, key1, value1, key2, value2, …)

**Description:**<br> 
When **source** value matches a **key**, returns **value** for that **key**. If **source** value doesn't match any keys, returns **defaultValue**.  **Key** and **value** parameters must always come in pairs. The function always expects an even number of parameters.

**Parameters:**<br> 

|Name| Required/ Repeating | Type | Notes |
|--- | ---                 | ---  | ---   |
| **source** | Required | String | **Source** value to update. |
| **defaultValue** | Optional | String | Default value to be used when source doesn't match any keys. Can be empty string (""). |
| **key** | Required | String | **Key** to compare **source** value with. |
| **value** | Required | String | Replacement value for the **source** matching the key. |



## Examples

### Strip known domain name

You need to strip a known domain name from a user’s email to obtain a user name. <br>
For example, if the domain is "contoso.com", then you could use the following expression:


**Expression:** <br>
`Replace([mail], "@contoso.com", , ,"", ,)`

**Sample input / output:** <br>

- **INPUT** (mail): "john.doe@contoso.com"

- **OUTPUT**:  "john.doe"


### Append constant suffix to user name

If you are using a Salesforce Sandbox, you might need to append an additional suffix to all your user names before synchronizing them.




**Expression:** <br>
`Append([userPrincipalName], ".test"))`

**Sample input/output:** <br>

- **INPUT**: (userPrincipalName): "John.Doe@contoso.com"


- **OUTPUT**:  "John.Doe@contoso.com.test"





### Generate user alias by concatenating parts of first and last name

You need to generate a user alias by taking first 3 letters of user's first name and first 5 letters of user's last name.


**Expression:** <br>
`Append(Mid([givenName], 1, 3), Mid([surname], 1, 5))`

**Sample input/output:** <br>

- **INPUT** (givenName): "John"

- **INPUT** (surname): "Doe"

- **OUTPUT**:  "JohDoe"




### Output date as a string in a certain format

You want to send dates to a SaaS application in a certain format. <br>
For example, you want to format dates for ServiceNow.



**Expression:** <br>

`FormatDateTime([extensionAttribute1], "yyyyMMddHHmmss.fZ", "yyyy-MM-dd")`

**Sample input/output:**

- **INPUT** (extensionAttribute1): "20150123105347.1Z"

- **OUTPUT**:  "2015-01-23"





### Replace a value based on predefined set of options

You need to define the time zone of the user based on the state code stored in Azure AD. <br>
If the state code doesn't match any of the predefined options, use default value of "Australia/Sydney".


**Expression:** <br>

`Switch([state], "Australia/Sydney", "NSW", "Australia/Sydney","QLD", "Australia/Brisbane", "SA", "Australia/Adelaide")`

**Sample input/output:**

- **INPUT** (state): "QLD"

- **OUTPUT**: "Australia/Brisbane"


##Related Articles

- [Article Index for Application Management in Azure Active Directory](active-directory-apps-index.md)
- [Automate User Provisioning/Deprovisioning to SaaS Apps](active-directory-saas-app-provisioning.md)
- [Customizing Attribute Mappings for User Provisioning](active-directory-saas-customizing-attribute-mappings.md)
- [Scoping Filters for User Provisioning](active-directory-saas-scoping-filters.md)
- [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](active-directory-scim-provisioning.md)
- [Account Provisioning Notifications](active-directory-saas-account-provisioning-notifications.md)
- [List of Tutorials on How to Integrate SaaS Apps](active-directory-saas-tutorial-list.md)
