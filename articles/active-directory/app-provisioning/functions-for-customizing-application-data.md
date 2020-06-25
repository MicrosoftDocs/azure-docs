---
title: Write expressions for attribute mappings in Azure Active Directory
description: Learn how to use expression mappings to transform attribute values into an acceptable format during automated provisioning of SaaS app objects in Azure Active Directory.
services: active-directory
author: kenwith
manager: celestedg
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: how-to
ms.date: 02/05/2020
ms.author: kenwith
---

# How-to: Write expressions for attribute mappings in Azure AD

When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. For these, you must write a script-like expression that allows you to transform your users’ data into formats that are more acceptable for the SaaS application.

## Syntax overview

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

[Append](#append) &nbsp;&nbsp;&nbsp;&nbsp; [BitAnd](#bitand) &nbsp;&nbsp;&nbsp;&nbsp; [CBool](#cbool) &nbsp;&nbsp;&nbsp;&nbsp; [Coalesce](#coalesce) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertToBase64](#converttobase64) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertToUTF8Hex](#converttoutf8hex) &nbsp;&nbsp;&nbsp;&nbsp; [Count](#count) &nbsp;&nbsp;&nbsp;&nbsp; [CStr](#cstr) &nbsp;&nbsp;&nbsp;&nbsp; [DateFromNum](#datefromnum) &nbsp;[FormatDateTime](#formatdatetime) &nbsp;&nbsp;&nbsp;&nbsp; [Guid](#guid) &nbsp;&nbsp;&nbsp;&nbsp; [IIF](#iif) &nbsp;&nbsp;&nbsp;&nbsp;[InStr](#instr) &nbsp;&nbsp;&nbsp;&nbsp; [IsNull](#isnull) &nbsp;&nbsp;&nbsp;&nbsp; [IsNullOrEmpty](#isnullorempty) &nbsp;&nbsp;&nbsp;&nbsp; [IsPresent](#ispresent) &nbsp;&nbsp;&nbsp;&nbsp; [IsString](#isstring) &nbsp;&nbsp;&nbsp;&nbsp; [Item](#item) &nbsp;&nbsp;&nbsp;&nbsp; [Join](#join) &nbsp;&nbsp;&nbsp;&nbsp; [Left](#left) &nbsp;&nbsp;&nbsp;&nbsp; [Mid](#mid) &nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; [NormalizeDiacritics](#normalizediacritics) [Not](#not) &nbsp;&nbsp;&nbsp;&nbsp; [RemoveDuplicates](#removeduplicates) &nbsp;&nbsp;&nbsp;&nbsp; [Replace](#replace) &nbsp;&nbsp;&nbsp;&nbsp; [SelectUniqueValue](#selectuniquevalue)&nbsp;&nbsp;&nbsp;&nbsp; [SingleAppRoleAssignment](#singleapproleassignment)&nbsp;&nbsp;&nbsp;&nbsp; [Split](#split)&nbsp;&nbsp;&nbsp;&nbsp;[StripSpaces](#stripspaces) &nbsp;&nbsp;&nbsp;&nbsp; [Switch](#switch)&nbsp;&nbsp;&nbsp;&nbsp; [ToLower](#tolower)&nbsp;&nbsp;&nbsp;&nbsp; [ToUpper](#toupper)&nbsp;&nbsp;&nbsp;&nbsp; [Word](#word)

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
### BitAnd
**Function:**<br> 
BitAnd(value1, value2)

**Description:**<br> 
This function converts both parameters to the binary representation and sets a bit to:

0 - if one or both of the corresponding bits in value1 and value2 are 0                                                  
1 - if both of the corresponding bits are 1.                                    

In other words, it returns 0 in all cases except when the corresponding bits of both parameters are 1.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value1** |Required |num |Numeric value that should be AND’ed with value2|
| **value2** |Required |num |Numeric value that should be AND’ed with value1|

**Example:**<br>
BitAnd(&HF, &HF7)                                                                                
11110111 AND 00000111 = 00000111 so BitAnd returns 7, the binary value of 00000111

---
### CBool
**Function:**<br> 
CBool(Expression)

**Description:**<br> 
CBool returns a boolean based on the evaluated expression. If the expression evaluates to a non-zero value, then CBool returns True, else it returns False..

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **expression** |Required | expression | Any valid expression |

**Example:**<br>
CBool([attribute1] = [attribute2])                                                                    
Returns True if both attributes have the same value.

---
### Coalesce
**Function:**<br> 
Coalesce(source1, source2, ..., defaultValue)

**Description:**<br> 
Returns the first source value that is not NULL. If all arguments are NULL and defaultValue is present, the defaultValue will be returned. If all arguments are NULL and defaultValue is not present, Coalesce returns NULL.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source1  … sourceN** | Required | String |Required, variable-number of times. Usually name of the attribute from the source object. |
| **defaultValue** | Optional | String | Default value to be used when all source values are NULL. Can be empty string ("").

---
### ConvertToBase64
**Function:**<br> 
ConvertToBase64(source)

**Description:**<br> 
The ConvertToBase64 function converts a string to a Unicode base64 string.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |String to be converted to base 64|

**Example:**<br>
ConvertToBase64("Hello world!")                                                                                                        
Returns "SABlAGwAbABvACAAdwBvAHIAbABkACEA"

---
### ConvertToUTF8Hex
**Function:**<br> 
ConvertToUTF8Hex(source)

**Description:**<br> 
The ConvertToUTF8Hex function converts a string to a UTF8 Hex encoded value.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |String to be converted to UTF8 Hex|

**Example:**<br>
ConvertToUTF8Hex("Hello world!")                                                                                                         
Returns 48656C6C6F20776F726C6421

---
### Count
**Function:**<br> 
Count(attribute)

**Description:**<br> 
The Count function returns the number of elements in a multi-valued attribute

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute** |Required |attribute |Multi-valued attribute that will have elements counted|

---
### CStr
**Function:**<br> 
CStr(value)

**Description:**<br> 
The CStr function converts a value to a string data type.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value** |Required | numeric, reference or boolean | Can be a numeric value, reference attribute, or Boolean. |

**Example:**<br>
CStr([dn])                                                            
Returns "cn=Joe,dc=contoso,dc=com"

---
### DateFromNum
**Function:**<br> 
DateFromNum(value)

**Description:**<br> 
The DateFromNum function converts a value in AD’s date format to a DateTime type.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value** |Required | Date | AD Date to be converted to DateTime type |

**Example:**<br>
DateFromNum([lastLogonTimestamp])                                                                                                   
DateFromNum(129699324000000000)                                                            
Returns a DateTime representing 2012-01-01 23:00:00

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
### Guid
**Function:**<br> 
Guid()

**Description:**<br> 
The function Guid generates a new random GUID

---
### IIF
**Function:**<br> 
IIF(condition,valueIfTrue,valueIfFalse)

**Description:**<br> 
The IIF function returns one of a set of possible values based on a specified condition.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **condition** |Required |Variable or Expression |Any value or expression that can be evaluated to true or false. |
| **valueIfTrue** |Required |Variable or String | If the condition evaluates to true, the returned value. |
| **valueIfFalse** |Required |Variable or String |If the condition evaluates to false, the returned value.|

**Example:**<br>
IIF([country]="USA",[country],[department])

---
### InStr
**Function:**<br> 
InStr(value1,value2,start,compareType)

**Description:**<br> 
The InStr function finds the first occurrence of a substring in a string

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value1** |Required |String |String to be searched |
| **value2** |Required |String |String to be found |
| **start** |Optional |Integer |Starting position to find the substring|
| **compareType** |Optional |Enum |Can be vbTextCompare or vbBinaryCompare |

**Example:**<br>
InStr("The quick brown fox","quick")                                                                             
Evalues to 5

InStr("repEated","e",3,vbBinaryCompare)                                                                                  
Evaluates to 7

---
### IsNull
**Function:**<br> 
IsNull(Expression)

**Description:**<br> 
If the expression evaluates to Null, then the IsNull function returns true. For an attribute, a Null is expressed by the absence of the attribute.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **expression** |Required |expression |Expression to be evaluated |

**Example:**<br>
IsNull([displayName])                                                                                                
Returns True if the attribute is not present

---
### IsNullorEmpty
**Function:**<br> 
IsNullOrEmpty(Expression)

**Description:**<br> 
If the expression is null or an empty string, then the IsNullOrEmpty function returns true. For an attribute, this would evaluate to True if the attribute is absent or is present but is an empty string.
The inverse of this function is named IsPresent.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **expression** |Required |expression |Expression to be evaluated |

**Example:**<br>
IsNullOrEmpty([displayName])                                               
Returns True if the attribute is not present or is an empty string

---
### IsPresent
**Function:**<br> 
IsPresent(Expression)

**Description:**<br> 
If the expression evaluates to a string that is not Null and is not empty, then the IsPresent function returns true. The inverse of this function is named IsNullOrEmpty.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **expression** |Required |expression |Expression to be evaluated |

**Example:**<br>
Switch(IsPresent([directManager]),[directManager], IsPresent([skiplevelManager]),[skiplevelManager], IsPresent([director]),[director])

---
### IsString
**Function:**<br> 
IsString(Expression)

**Description:**<br> 
If the expression can be evaluated to a string type, then the IsString function evaluates to True.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **expression** |Required |expression |Expression to be evaluated |

---
### Item
**Function:**<br> 
Item(attribute, index)

**Description:**<br> 
The Item function returns one item from a multi-valued string/attribute.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute** |Required |Attribute |Multi-valued attribute to be searched |
| **index** |Required |Integer | Index to an item in the multi-valued string|

**Example:**<br>
Item([proxyAddresses], 1)

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
### Left
**Function:**<br> 
Left(String,NumChars)

**Description:**<br> 
The Left function returns a specified number of characters from the left of a string. 
If numChars = 0, return empty string.
If numChars < 0, return input string.
If string is null, return empty string.
If string contains fewer characters than the number specified in numChars, a string identical to string (that is, containing all characters in parameter 1) is returned.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **String** |Required |Attribute | The string to return characters from |
| **NumChars** |Required |Integer | A number identifying the number of characters to return from the beginning (left) of string|

**Example:**<br>
Left("John Doe", 3)                                                            
Returns "Joh"

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
### NumFromDate
**Function:**<br> 
NumFromDate(value)

**Description:**<br> 
The NumFromDate function converts a DateTime value to Active Directory format that is required to set attributes like [accountExpires](https://docs.microsoft.com/windows/win32/adschema/a-accountexpires). Use this function to convert DateTime values received from cloud HR apps like Workday and SuccessFactors to their equivalent AD representation. 

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value** |Required | String | Date time string in the supported format. For supported formats, see https://msdn.microsoft.com/library/8kb3ddd4%28v=vs.110%29.aspx. |

**Example:**<br>
* Workday example <br>
  Assuming you want to map the attribute *ContractEndDate* from Workday which is in the format *2020-12-31-08:00* to *accountExpires* field in AD, here is how you can use this function and change the timezone offset to match your locale. 
  `NumFromDate(Join("", FormatDateTime([ContractEndDate], "yyyy-MM-ddzzz", "yyyy-MM-dd"), "T23:59:59-08:00"))`

* SuccessFactors example <br>
  Assuming you want to map the attribute *endDate* from SuccessFactors which is in the format *M/d/yyyy hh:mm:ss tt* to *accountExpires* field in AD, here is how you can use this function and change the time zone offset to match your locale.
  `NumFromDate(Join("",FormatDateTime([endDate],"M/d/yyyy hh:mm:ss tt","yyyy-MM-dd"),"T23:59:59-08:00"))`


---
### RemoveDuplicates
**Function:**<br> 
RemoveDuplicates(attribute)

**Description:**<br> 
The RemoveDuplicates function takes a multi-valued string and make sure each value is unique.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute** |Required |Multi-valued Attribute |Multi-valued attribute that will have duplicates removed|

**Example:**<br>
RemoveDuplicates([proxyAddresses])                                                                                                       
Returns a sanitized proxyAddress attribute where all duplicate values have been removed

---
### Replace
**Function:**<br> 
Replace(source, oldValue, regexPattern, regexGroupName, replacementValue, replacementAttributeName, template)

**Description:**<br>
Replaces values within a string. It works differently depending on the parameters provided:

* When **oldValue** and **replacementValue** are provided:
  
  * Replaces all occurrences of **oldValue** in the **source**  with **replacementValue**
* When **oldValue** and **template** are provided:
  
  * Replaces all occurrences of the **oldValue** in the **template** with the **source** value
* When **regexPattern** and **replacementValue** are provided:

  * The function applies the **regexPattern** to the **source** string and you can use the regex group names to construct the string for **replacementValue**
* When **regexPattern**, **regexGroupName**, **replacementValue** are provided:
  
  * The function applies the **regexPattern** to the **source** string and replaces all values matching **regexGroupName** with **replacementValue**
* When **regexPattern**, **regexGroupName**, **replacementAttributeName** are provided:
  
  * If **source** has no value, **source** is returned
  * If **source** has a value, the function applies the **regexPattern** to the **source** string and replaces all values matching **regexGroupName** with the value associated with **replacementAttributeName**

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the **source** object. |
| **oldValue** |Optional |String |Value to be replaced in **source** or **template**. |
| **regexPattern** |Optional |String |Regex pattern for the value to be replaced in **source**. Or, when **replacementPropertyName** is used, pattern to extract value from **replacementPropertyName**. |
| **regexGroupName** |Optional |String |Name of the group inside **regexPattern**. Only when  **replacementPropertyName** is used, we will extract value of this group as **replacementValue** from **replacementPropertyName**. |
| **replacementValue** |Optional |String |New value to replace old one with. |
| **replacementAttributeName** |Optional |String |Name of the attribute to be used for replacement value |
| **template** |Optional |String |When **template** value is provided, we will look for **oldValue** inside the template and replace it with **source** value. |

---
### SelectUniqueValue
**Function:**<br> 
SelectUniqueValue(uniqueValueRule1, uniqueValueRule2, uniqueValueRule3, …)

**Description:**<br> 
Requires a minimum of two arguments, which are unique value generation rules defined using expressions. The function evaluates each rule and then checks the value generated for uniqueness in the target app/directory. The first unique value found will be the one returned. If all of the values already exist in the target, the entry will get escrowed and the reason gets logged in the audit logs. There is no upper bound to the number of arguments that can be provided.


 - This is a top-level function, it cannot be nested.
 - This function cannot be applied to attributes that have a matching precedence. 	
 - This function is only meant to be used for entry creations. When using it with an attribute, set the **Apply Mapping** property to **Only during object creation**.
 - This function is currently only supported for "Workday to Active Directory User Provisioning". It cannot be used with other provisioning applications. 


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
Splits a string into a multi-valued array, using the specified delimiter character.

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
When **source** value matches a **key**, returns **value** for that **key**. If **source** value doesn't match any keys, returns **defaultValue**.  **Key** and **value** parameters must always come in pairs. The function always expects an even number of parameters. The function should not be used for referential attributes such as manager. 

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

---
### Word
**Function:**<br> 
Word(String,WordNumber,Delimiters)

**Description:**<br> 
The Word function returns a word contained within a string, based on parameters describing the delimiters to use and the word number to return. Each string of characters in string separated by the one of the characters in delimiters are identified as words:

If number < 1, returns empty string.
If string is null, returns empty string.
If string contains less than number words, or string does not contain any words identified by delimiters, an empty string is returned.

**Parameters:**<br> 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **String** |Required |Multi-valued Attribute |String to return a word from.|
| **WordNumber** |Required | Integer | Number identifying which word number should return|
| **delimiters** |Required |String| A string representing the delimiter(s) that should be used to identify words|

**Example:**<br>
Word("The quick brown fox",3," ")                                                                                       
Returns "brown"

Word("This,string!has&many separators",3,",!&#")                                                                       
Returns "has"

---

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
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  Mid([PreferredFirstName], 1, 1), [PreferredLastName]))), "contoso.com"),
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  Mid([PreferredFirstName], 1, 2), [PreferredLastName]))), "contoso.com")
    )

**Sample input/output:**

* **INPUT** (PreferredFirstName): "John"
* **INPUT** (PreferredLastName): "Smith"
* **OUTPUT**: "John.Smith@contoso.com" if UPN value of John.Smith@contoso.com doesn't already exist in the directory
* **OUTPUT**: "J.Smith@contoso.com" if UPN value of John.Smith@contoso.com already exists in the directory
* **OUTPUT**: "Jo.Smith@contoso.com" if the above two UPN values already exist in the directory

### Flow mail value if not NULL, otherwise flow userPrincipalName
You wish to flow the mail attribute if it is present. If it is not, you wish to flow the value of userPrincipalName instead.

**Expression:** <br>
`Coalesce([mail],[userPrincipalName])`

**Sample input/output:** <br>

* **INPUT** (mail): NULL
* **INPUT** (userPrincipalName): "John.Doe@contoso.com"
* **OUTPUT**:  "John.Doe@contoso.com"

## Related Articles
* [Automate User Provisioning/Deprovisioning to SaaS Apps](../app-provisioning/user-provisioning.md)
* [Customizing Attribute Mappings for User Provisioning](../app-provisioning/customize-application-attributes.md)
* [Scoping Filters for User Provisioning](define-conditional-rules-for-provisioning-user-accounts.md)
* [Using SCIM to enable automatic provisioning of users and groups from Azure Active Directory to applications](../app-provisioning/use-scim-to-provision-users-and-groups.md)
* [Account Provisioning Notifications](../app-provisioning/user-provisioning.md)
* [List of Tutorials on How to Integrate SaaS Apps](../saas-apps/tutorial-list.md)
