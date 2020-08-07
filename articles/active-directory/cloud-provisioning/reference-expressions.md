---
title: Azure AD Connect cloud provisioning expressions and function reference
description: reference
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 12/02/2019
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---


# Writing expressions for attribute mappings in Azure Active Directory
When you configure cloud provisioning, one of the types of attribute mappings that you can specify is an expression mapping. 

The expression mapping allows you to customize attributes using a script-like expression.  This allows you to transform the on-premises data into an new or different value.  For example, you may want to combine two attributes into a single attribute because this single attribute is used by one of your cloud applications.

The following document will cover the script-like expressions that are used to transform the data.  This is only part of the process.  Next you will need to use this expression and place it in a web request to your tenant.  For more information on that see [Transformations](how-to-transformation.md)

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

## List of functions
| List of functions | Description |
|-----|----|
|[Append](#append)|Takes a source string value and appends the suffix to the end of it.|
|[BitAnd](#bitand)|The BitAnd function sets specified bits on a value.|
|[CBool](#cbool)|The CBool function returns a Boolean based on the evaluated expression|
|[ConvertFromBase64](#convertfrombase64)|The ConvertFromBase64 function converts the specified base64 encoded value to a regular string.|
|[ConvertToBase64](#converttobase64)|The ConvertToBase64 function converts a string to a Unicode base64 string. |
|[ConvertToUTF8Hex](#converttoutf8hex)|The ConvertToUTF8Hex function converts a string to a UTF8 Hex encoded value.|
|[Count](#count)|The Count function returns the number of elements in a multi-valued attribute|
|[Cstr](#cstr)|The CStr function converts to a string data type.|
|[DateFromNum](#datefromnum)|The DateFromNum function converts a value in AD’s date format to a DateTime type.|
|[DNComponent](#dncomponent)|The DNComponent function returns the value of a specified DN component going from left.|
|[Error](#error)|The Error function is used to return a custom error.|
|[FormatDateTime](#formatdatetime) |Takes a date string from one format and converts it into a different format.| 
|[GUID](#guid)|The function Guid generates a new random GUID.|           
|[IIF](#iif)|The IIF function returns one of a set of possible values based on a specified condition.|
|[InStr](#instr)|The InStr function finds the first occurrence of a substring in a string.|
|[IsNull](#isnull)|If the expression evaluates to Null, then the IsNull function returns true.|
|[IsNullOrEmpty](#isnullorempty)|If the expression is null or an empty string, then the IsNullOrEmpty function returns true.|         
|[IsPresent](#ispresent)|If the expression evaluates to a string that is not Null and is not empty, then the IsPresent function returns true.|    
|[IsString](#isstring)|If the expression can be evaluated to a string type, then the IsString function evaluates to True.|
|[Item](#item)|The Item function returns one item from a multi-valued string/attribute.|
|[Join](#join) |Join() is similar to Append(), except that it can combine multiple **source** string values into a single string, and each value will be separated by a **separator** string.| 
|[Left](#left)|The Left function returns a specified number of characters from the left of a string.|
|[Mid](#mid) |Returns a substring of the source value. A substring is a string that contains only some of the characters from the source string.|
|[NormalizeDiacritics](#normalizediacritics)|Requires one string argument. Returns the string, but with any diacritical characters replaced with equivalent non-diacritical characters.|
|[Not](#not) |Flips the boolean value of the **source**. If **source** value is "*True*", returns "*False*". Otherwise, returns "*True*".| 
|[RemoveDuplicates](#removeduplicates)|The RemoveDuplicates function takes a multi-valued string and make sure each value is unique.| 
|[Replace](#replace) |Replaces values within a string. | 
|[SelectUniqueValue](#selectuniquevalue)|Requires a minimum of two arguments, which are unique value generation rules defined using expressions. The function evaluates each rule and then checks the value generated for uniqueness in the target app/directory.| 
|[SingleAppRoleAssignment](#singleapproleassignment)|Returns a single appRoleAssignment from the list of all appRoleAssignments assigned to a user for a given application.| 
|[Split](#split)|Splits a string into a multi-valued array, using the specified delimiter character.|
|[StringFromSID](#stringfromsid)|The StringFromSid function converts a byte array containing a security identifier to a string.| 
|[StripSpaces](#stripspaces) |Removes all space (" ") characters from the source string.| 
|[Switch](#switch)|When **source** value matches a **key**, returns **value** for that **key**. | 
|[ToLower](#tolower)|Takes a *source* string value and converts it to lower case using the culture rules that are specified.| 
|[ToUpper](#toupper)|Takes a *source* string value and converts it to upper case using the culture rules that are specified.|
|[Trim](#trim)|The Trim function removes leading and trailing white spaces from a string.|
|[Word](#word)|The Word function returns a word contained within a string, based on parameters describing the delimiters to use and the word number to return.|

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
**Description:**  
The BitAnd function sets specified bits on a value.

**Syntax:**  
`num BitAnd(num value1, num value2)`

* value1, value2: numeric values that should be AND’ed together

**Remarks:**  
This function converts both parameters to the binary representation and sets a bit to:

* 0 - if one or both of the corresponding bits in *value1* and *value2* are 0
* 1 - if both of the corresponding bits are 1.

In other words, it returns 0 in all cases except when the corresponding bits of both parameters are 1.

**Example:**  
 
 `BitAnd(&HF, &HF7)`</br>
 Returns 7 because hexadecimal "F" AND "F7" evaluate to this value.

---

### CBool
**Description:**  
The CBool function returns a Boolean based on the evaluated expression

**Syntax:**  
`bool CBool(exp Expression)`

**Remarks:**  
If the expression evaluates to a non-zero value, then CBool returns True, else it returns False.

**Example:**  
`CBool([attrib1] = [attrib2])`  

Returns True if both attributes have the same value.

---
### ConvertFromBase64
**Description:**  
The ConvertFromBase64 function converts the specified base64 encoded value to a regular string.

**Syntax:**  
`str ConvertFromBase64(str source)` - assumes Unicode for encoding  
`str ConvertFromBase64(str source, enum Encoding)`

* source: Base64 encoded string  
* Encoding: Unicode, ASCII, UTF8

**Example**  
`ConvertFromBase64("SABlAGwAbABvACAAdwBvAHIAbABkACEA")`  
`ConvertFromBase64("SGVsbG8gd29ybGQh", UTF8)`

Both examples return "*Hello world!*"

---
### ConvertToBase64
**Description:**  
The ConvertToBase64 function converts a string to a Unicode base64 string.  
Converts the value of an array of integers to its equivalent string representation that is encoded with base-64 digits.

**Syntax:**  
`str ConvertToBase64(str source)`

**Example:**  
`ConvertToBase64("Hello world!")`  
Returns "SABlAGwAbABvACAAdwBvAHIAbABkACEA"

---
### ConvertToUTF8Hex
**Description:**  
The ConvertToUTF8Hex function converts a string to a UTF8 Hex encoded value.

**Syntax:**  
`str ConvertToUTF8Hex(str source)`

**Remarks:**  
The output format of this function is used by Azure Active Directory as DN attribute format.

**Example:**  
`ConvertToUTF8Hex("Hello world!")`  
Returns 48656C6C6F20776F726C6421

---
### Count
**Description:**  
The Count function returns the number of elements in a multi-valued attribute

**Syntax:**  
`num Count(mvstr attribute)`

---
### CStr
**Description:**  
The CStr function converts to a string data type.

**Syntax:**  
`str CStr(num value)`  
`str CStr(ref value)`  
`str CStr(bool value)`  

* value: Can be a numeric value, reference attribute, or Boolean.

**Example:**  
`CStr([dn])`  
Could return "cn=Joe,dc=contoso,dc=com"

---
### DateFromNum
**Description:**  
The DateFromNum function converts a value in AD’s date format to a DateTime type.

**Syntax:**  
`dt DateFromNum(num value)`

**Example:**  
`DateFromNum([lastLogonTimestamp])`  
`DateFromNum(129699324000000000)`  
Returns a DateTime representing 2012-01-01 23:00:00

---
### DNComponent
**Description:**  
The DNComponent function returns the value of a specified DN component going from left.

**Syntax:**  
`str DNComponent(ref dn, num ComponentNumber)`

* dn: the reference attribute to interpret
* ComponentNumber: The component in the DN to return

**Example:**  
`DNComponent(CRef([dn]),1)`  
If dn is "cn=Joe,ou=…," it returns Joe

---
### Error
**Description:**  
The Error function is used to return a custom error.

**Syntax:**  
`void Error(str ErrorMessage)`

**Example:**  
`IIF(IsPresent([accountName]),[accountName],Error("AccountName is required"))`  
If the attribute accountName is not present, throw an error on the object.

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
**Description:**  
The function Guid generates a new random GUID

**Syntax:**  
`str Guid()`

---
### IIF
**Description:**  
The IIF function returns one of a set of possible values based on a specified condition.

**Syntax:**  
`var IIF(exp condition, var valueIfTrue, var valueIfFalse)`

* condition: any value or expression that can be evaluated to true or false.
* valueIfTrue: If the condition evaluates to true, the returned value.
* valueIfFalse: If the condition evaluates to false, the returned value.

**Example:**  
`IIF([employeeType]="Intern","t-" & [alias],[alias])`  
 If the user is an intern, returns the alias of a user with "t-" added to the beginning of it, else returns the user’s alias as is.

---
### InStr
**Description:**  
The InStr function finds the first occurrence of a substring in a string

**Syntax:**  

`num InStr(str stringcheck, str stringmatch)`  
`num InStr(str stringcheck, str stringmatch, num start)`  
`num InStr(str stringcheck, str stringmatch, num start , enum compare)`

* stringcheck: string to be searched
* stringmatch: string to be found
* start: starting position to find the substring
* compare: vbTextCompare or vbBinaryCompare

**Remarks:**  
Returns the position where the substring was found or 0 if not found.

**Example:**  
`InStr("The quick brown fox","quick")`  
Evalues to 5

`InStr("repEated","e",3,vbBinaryCompare)`  
Evaluates to 7

---
### IsNull
**Description:**  
If the expression evaluates to Null, then the IsNull function returns true.

**Syntax:**  
`bool IsNull(var Expression)`

**Remarks:**  
For an attribute, a Null is expressed by the absence of the attribute.

**Example:**  
`IsNull([displayName])`  
Returns True if the attribute is not present in the CS or MV.

---
### IsNullOrEmpty
**Description:**  
If the expression is null or an empty string, then the IsNullOrEmpty function returns true.

**Syntax:**  
`bool IsNullOrEmpty(var Expression)`

**Remarks:**  
For an attribute, this would evaluate to True if the attribute is absent or is present but is an empty string.  
The inverse of this function is named IsPresent.

**Example:**  
`IsNullOrEmpty([displayName])`  
Returns True if the attribute is not present or is an empty string in the CS or MV.

---
### IsPresent
**Description:**  
If the expression evaluates to a string that is not Null and is not empty, then the IsPresent function returns true.

**Syntax:**  
`bool IsPresent(var expression)`

**Remarks:**  
The inverse of this function is named IsNullOrEmpty.

**Example:**  
`Switch(IsPresent([directManager]),[directManager], IsPresent([skiplevelManager]),[skiplevelManager], IsPresent([director]),[director])`

---
### Item
**Description:**  
The Item function returns one item from a multi-valued string/attribute.

**Syntax:**  
`var Item(mvstr attribute, num index)`

* attribute: multi-valued attribute
* index: index to an item in the multi-valued string.

**Remarks:**  
The Item function is useful together with the Contains function since the latter function returns the index to an item in the multi-valued attribute.

Throws an error if index is out of bounds.

**Example:**  
`Mid(Item([proxyAddresses],Contains([proxyAddresses], "SMTP:")),6)`  
Returns the primary email address.

---
### IsString
**Description:**  
If the expression can be evaluated to a string type, then the IsString function evaluates to True.

**Syntax:**  
`bool IsString(var expression)`

**Remarks:**  
Used to determine if CStr() can be successful to parse the expression.

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
**Description:**  
The Left function returns a specified number of characters from the left of a string.

**Syntax:**  
`str Left(str string, num NumChars)`

* string: the string to return characters from
* NumChars: a number identifying the number of characters to return from the beginning (left) of string

**Remarks:**  
A string containing the first numChars characters in string:

* If numChars = 0, return empty string.
* If numChars < 0, return input string.
* If string is null, return empty string.

If string contains fewer characters than the number specified in numChars, a string identical to string (that is, containing all characters in parameter 1) is returned.

**Example:**  
`Left("John Doe", 3)`  
Returns `Joh`.

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
### RemoveDuplicates
**Description:**  
The RemoveDuplicates function takes a multi-valued string and make sure each value is unique.

**Syntax:**  
`mvstr RemoveDuplicates(mvstr attribute)`

**Example:**  
`RemoveDuplicates([proxyAddresses])`  
Returns a sanitized proxyAddress attribute where all duplicate values have been removed.

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

> [!NOTE]
> - This is a top-level function, it cannot be nested.
> - This function cannot be applied to attributes that have a matching precedence. 	
> - This function is only meant to be used for entry creations. When using it with an attribute, set the **Apply Mapping** property to **Only during object creation**.
> - This function is currently only supported for "Workday to Active Directory User Provisioning". It cannot be used with other provisioning applications. 


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
  |--- | --- | --- | --- |
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
### StringFromSid
**Description:**  
The StringFromSid function converts a byte array containing a security identifier to a string.

**Syntax:**  
`str StringFromSid(bin ObjectSID)`  

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
   | **source** |Required |String |**Source** value to check. |
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

### Trim
**Description:**  
The Trim function removes leading and trailing white spaces from a string.

**Syntax:**  
`str Trim(str value)`  

**Example:**  
`Trim(" Test ")`  
Returns "Test".

`Trim([proxyAddresses])`  
Removes leading and trailing spaces for each value in the proxyAddress attribute.

---
### Word
**Description:**  
The Word function returns a word contained within a string, based on parameters describing the delimiters to use and the word number to return.

**Syntax:**  
`str Word(str string, num WordNumber, str delimiters)`

* string: the string to return a word from.
* WordNumber: a number identifying which word number should return.
* delimiters: a string representing the delimiter(s) that should be used to identify words

**Remarks:**  
Each string of characters in string separated by the one of the characters in delimiters are identified as words:

* If number < 1, returns empty string.
* If string is null, returns empty string.

If string contains less than number words, or string does not contain any words identified by delimiters, an empty string is returned.

**Example:**  
`Word("The quick brown fox",3," ")`  
Returns "brown"

`Word("This,string!has&many separators",3,",!&#")`  
Would return "has"

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


## Next steps 

- [What is provisioning?](what-is-provisioning.md)
- [What is Azure AD Connect cloud provisioning?](what-is-cloud-provisioning.md)
