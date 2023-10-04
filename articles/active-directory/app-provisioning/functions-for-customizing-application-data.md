---
title: Reference for writing expressions for attribute mappings in Microsoft Entra Application Provisioning
description: Learn how to use expression mappings to transform attribute values into an acceptable format during automated provisioning of SaaS app objects in Microsoft Entra ID. Includes a reference list of functions.
author: kenwith
manager: amycolannino
ms.service: active-directory
ms.subservice: app-provisioning
ms.workload: identity
ms.topic: reference
ms.date: 09/15/2023
ms.author: kenwith
ms.reviewer: arvinh
---

# Reference for writing expressions for attribute mappings in Microsoft Entra ID

When you configure provisioning to a SaaS application, one of the types of attribute mappings that you can specify is an expression mapping. For these mappings, you must write a script-like expression that allows you to transform your users' data into formats that are more acceptable for the SaaS application.

## Syntax overview

The syntax for Expressions for Attribute Mappings is reminiscent of Visual Basic for Applications (VBA) functions.

* The entire expression must be defined in terms of functions, which consist of a name followed by arguments in parentheses: 
  *FunctionName(`<<argument 1>>`,`<<argument N>>`)*
* You may nest functions within each other. For example:  *FunctionOne(FunctionTwo(`<<argument1>>`))*
* You can pass three different types of arguments into functions:
  
  1. Attributes, which must be enclosed in square brackets. For example: [attributeName]
  2. String constants, which must be enclosed in double quotes. For example: "United States"
  3. Other Functions. For example: FunctionOne(`<<argument1>>`, FunctionTwo(`<<argument2>>`))
* For string constants, if you need a backslash ( \ ) or quotation mark ( " ) in the string, it must be escaped with the backslash ( \ ) symbol. For example: "Company name: \\"Contoso\\""
* The syntax is case-sensitive, which must be considered while typing them as strings in a function vs copy pasting them directly from here. 

## List of Functions

[Append](#append) &nbsp;&nbsp;&nbsp;&nbsp; [AppRoleAssignmentsComplex](#approleassignmentscomplex) &nbsp;&nbsp;&nbsp;&nbsp; [BitAnd](#bitand) &nbsp;&nbsp;&nbsp;&nbsp; [CBool](#cbool) &nbsp;&nbsp;&nbsp;&nbsp; [CDate](#cdate) &nbsp;&nbsp;&nbsp;&nbsp; [Coalesce](#coalesce) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertToBase64](#converttobase64) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertToUTF8Hex](#converttoutf8hex) &nbsp;&nbsp;&nbsp;&nbsp; [Count](#count) &nbsp;&nbsp;&nbsp;&nbsp; [CStr](#cstr) &nbsp;&nbsp;&nbsp;&nbsp; [DateAdd](#dateadd) &nbsp;&nbsp;&nbsp;&nbsp; [DateDiff](#datediff) &nbsp;&nbsp;&nbsp;&nbsp; [DateFromNum](#datefromnum) &nbsp;[FormatDateTime](#formatdatetime) &nbsp;&nbsp;&nbsp;&nbsp; [Guid](#guid) &nbsp;&nbsp;&nbsp;&nbsp; [IgnoreFlowIfNullOrEmpty](#ignoreflowifnullorempty) &nbsp;&nbsp;&nbsp;&nbsp;[IIF](#iif) &nbsp;&nbsp;&nbsp;&nbsp;[InStr](#instr) &nbsp;&nbsp;&nbsp;&nbsp; [IsNull](#isnull) &nbsp;&nbsp;&nbsp;&nbsp; [IsNullOrEmpty](#isnullorempty) &nbsp;&nbsp;&nbsp;&nbsp; [IsPresent](#ispresent) &nbsp;&nbsp;&nbsp;&nbsp; [IsString](#isstring) &nbsp;&nbsp;&nbsp;&nbsp; [Item](#item) &nbsp;&nbsp;&nbsp;&nbsp; [Join](#join) &nbsp;&nbsp;&nbsp;&nbsp; [Left](#left) &nbsp;&nbsp;&nbsp;&nbsp; [Mid](#mid) &nbsp;&nbsp;&nbsp;&nbsp; [NormalizeDiacritics](#normalizediacritics) &nbsp;&nbsp; &nbsp;&nbsp; [Not](#not) &nbsp;&nbsp;&nbsp;&nbsp; [Now](#now) &nbsp;&nbsp;&nbsp;&nbsp; [NumFromDate](#numfromdate) &nbsp;&nbsp;&nbsp;&nbsp; [PCase](#pcase) &nbsp;&nbsp;&nbsp;&nbsp; [RandomString](#randomstring) &nbsp;&nbsp;&nbsp;&nbsp; [Redact](#redact) &nbsp;&nbsp;&nbsp;&nbsp; [RemoveDuplicates](#removeduplicates) &nbsp;&nbsp;&nbsp;&nbsp; [Replace](#replace) &nbsp;&nbsp;&nbsp;&nbsp; [SelectUniqueValue](#selectuniquevalue)&nbsp;&nbsp;&nbsp;&nbsp; [SingleAppRoleAssignment](#singleapproleassignment)&nbsp;&nbsp;&nbsp;&nbsp; [Split](#split)&nbsp;&nbsp;&nbsp;&nbsp;[StripSpaces](#stripspaces) &nbsp;&nbsp;&nbsp;&nbsp; [Switch](#switch)&nbsp;&nbsp;&nbsp;&nbsp; [ToLower](#tolower)&nbsp;&nbsp;&nbsp;&nbsp; [ToUpper](#toupper)&nbsp;&nbsp;&nbsp;&nbsp; [Word](#word)

---
### Append

**Function:** 
Append(source, suffix)

**Description:** 
Takes a source string value and appends the suffix to the end of it.

**Parameters:**

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **suffix** |Required |String |The string that you want to append to the end of the source value. |


#### Append constant suffix to user name
Example: If you're using a Salesforce Sandbox, you might need to append another suffix to all your user names before synchronizing them.

**Expression:** 
`Append([userPrincipalName], ".test")`

**Sample input/output:** 

* **INPUT**: (userPrincipalName): "John.Doe@contoso.com"
* **OUTPUT**:  "John.Doe@contoso.com.test"

---
### AppRoleAssignmentsComplex

**Function:** 
AppRoleAssignmentsComplex([appRoleAssignments])

**Description:** 
Used to provision multiple roles for a user. For detailed usage, see [Tutorial - Customize user provisioning attribute-mappings for SaaS applications in Microsoft Entra ID](customize-application-attributes.md#provisioning-a-role-to-a-scim-app).

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **[appRoleAssignments]** |Required |String |**[appRoleAssignments]** object. |

---
### BitAnd
**Function:** 
BitAnd(value1, value2)

**Description:** 
This function converts both parameters to the binary representation and sets a bit to:

- 0 - if one or both of the corresponding bits in value1 and value2 are 0
- 1 - if both of the corresponding bits are 1.

In other words, it returns 0 in all cases except when the corresponding bits of both parameters are 1.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value1** |Required |Num |Numeric value that should be AND'ed with value2|
| **value2** |Required |Num |Numeric value that should be AND'ed with value1|

**Example:**
`BitAnd(&HF, &HF7)`

11110111 AND 00000111 = 00000111 so `BitAnd` returns 7, the binary value of 00000111.

---
### CBool
**Function:** 
`CBool(Expression)`

**Description:** 
`CBool` returns a boolean based on the evaluated expression. If the expression evaluates to a non-zero value, then `CBool` returns *True*, else it returns *False*.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** |Required | expression | Any valid expression |

**Example:**
`CBool([attribute1] = [attribute2])`                                                                    
Returns True if both attributes have the same value.

---
### CDate
**Function:**  
`CDate(expression)`

**Description:**  
The CDate function returns a UTC DateTime from a string. DateTime isn't a native attribute type but it can be used within date functions such as [FormatDateTime](#formatdatetime) and [DateAdd](#dateadd).

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** |Required | Expression | Any valid string that represents a date/time. For supported formats, refer to [.NET custom date and time format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). |

**Remarks:**  
The returned string is always in UTC and follows the format **M/d/yyyy h:mm:ss tt**.

**Example 1:** <br> 
`CDate([StatusHireDate])`  
**Sample input/output:** 

* **INPUT** (StatusHireDate): "2020-03-16-07:00"
* **OUTPUT**:  "3/16/2020 7:00:00 AM" <-- *Note that UTC equivalent of the above DateTime is returned*

**Example 2:** <br> 
`CDate("2021-06-30+08:00")`  
**Sample input/output:** 

* **INPUT**: "2021-06-30+08:00"
* **OUTPUT**:  "6/29/2021 4:00:00 PM" <-- *Note that UTC equivalent of the above DateTime is returned*

**Example 3:** <br> 
`CDate("2009-06-15T01:45:30-07:00")`  
**Sample input/output:** 

* **INPUT**: "2009-06-15T01:45:30-07:00"
* **OUTPUT**:  "6/15/2009 8:45:30 AM" <-- *Note that UTC equivalent of the above DateTime is returned*

---
### Coalesce
**Function:** 
Coalesce(source1, source2, ..., defaultValue)

**Description:** 
Returns the first source value that isn't NULL. If all arguments are NULL and defaultValue is present, the defaultValue will be returned. If all arguments are NULL and defaultValue isn't present, Coalesce returns NULL.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source1  … sourceN** | Required | String |Required, variable-number of times. Usually name of the attribute from the source object. |
| **defaultValue** | Optional | String | Default value to be used when all source values are NULL. Can be empty string ("").

#### Flow mail value if not NULL, otherwise flow userPrincipalName
Example: You wish to flow the mail attribute if it is present. If it isn't, you wish to flow the value of userPrincipalName instead.

**Expression:** 
`Coalesce([mail],[userPrincipalName])`

**Sample input/output:** 

* **INPUT** (mail): NULL
* **INPUT** (userPrincipalName): "John.Doe@contoso.com"
* **OUTPUT**:  "John.Doe@contoso.com"


---
### ConvertToBase64
**Function:** 
ConvertToBase64(source)

**Description:** 
The ConvertToBase64 function converts a string to a Unicode base64 string.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |String to be converted to base 64|

**Example:**
`ConvertToBase64("Hello world!")`

Returns "SABlAGwAbABvACAAdwBvAHIAbABkACEA"

---
### ConvertToUTF8Hex
**Function:** 
ConvertToUTF8Hex(source)

**Description:** 
The ConvertToUTF8Hex function converts a string to a UTF8 Hex encoded value.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |String to be converted to UTF8 Hex|

**Example:**
`ConvertToUTF8Hex("Hello world!")`

Returns 48656C6C6F20776F726C6421

---
### Count
**Function:** 
Count(attribute)

**Description:** 
The Count function returns the number of elements in a multi-valued attribute

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute** |Required |attribute |Multi-valued attribute that will have elements counted|

---
### CStr
**Function:** 
CStr(value)

**Description:** 
The CStr function converts a value to a string data type.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value** |Required | numeric, reference, or boolean | Can be a numeric value, reference attribute, or Boolean. |

**Example:**
`CStr([dn])`

Returns "cn=Joe,dc=contoso,dc=com"

---
### DateAdd
**Function:**  
`DateAdd(interval, value, dateTime)`

**Description:**  
Returns a date/time string representing a date to which a specified time interval has been added. The returned date is in the format: **M/d/yyyy h:mm:ss tt**.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **interval** |Required | String | Interval of time you want to add. See accepted values below this table. |
| **value** |Required | Number | The number of units you want to add. It can be positive (to get dates in the future) or negative (to get dates in the past). |
| **dateTime** |Required | DateTime | DateTime representing date to which the interval is added. |

When passing a date string as input, use [CDate](#cdate) function to wrap the datetime string. To get system time in UTC, use the [Now](#now) function. 

The **interval** string must have one of the following values: 
 * yyyy Year 
 * m Month
 * d Day
 * ww Week
 * h Hour
 * n Minute
 * s Second

**Example 1: Generate a date value based on incoming StatusHireDate from Workday** <br>
`DateAdd("d", 7, CDate([StatusHireDate]))`

| Example | interval | value | dateTime (value of variable StatusHireDate) | output |
| --- | --- | --- | --- | --- |
| Add 7 days to hire date | "d" | 7 | 2012-03-16-07:00 | 3/23/2012 7:00:00 AM |
| Get a date ten days prior to hire date | "d" | -10 | 2012-03-16-07:00 | 3/6/2012 7:00:00 AM |
| Add two weeks to hire date | "ww" | 2 | 2012-03-16-07:00 | 3/30/2012 7:00:00 AM |
| Add ten months to hire date | "m" | 10 | 2012-03-16-07:00 | 1/16/2013 7:00:00 AM |
| Add two years to hire date | "yyyy" | 2 | 2012-03-16-07:00 | 3/16/2014 7:00:00 AM |

---
### DateDiff
**Function:**  
`DateDiff(interval, date1, date2)`

**Description:**  
This function uses the *interval* parameter to return a number that indicates the difference between the two input dates. It returns 
  * a positive number if date2 > date1, 
  * a negative number if date2 < date1, 
  * 0 if date2 == date1

**Parameters:** 

| Name | Required/Optional | Type | Notes |
| --- | --- | --- | --- |
| **interval** |Required | String | Interval of time to use for calculating the difference. |
| **date1** |Required | DateTime | DateTime representing a valid date. |
| **date2** |Required | DateTime | DateTime representing a valid date. |

When passing a date string as input, use [CDate](#cdate) function to wrap the datetime string. To get system time in UTC, use the [Now](#now) function. 

The **interval** string must have one of the following values: 
 * yyyy Year 
 * m Month
 * d Day
 * ww Week
 * h Hour
 * n Minute
 * s Second

**Example 1: Compare current date with hire date from Workday with different intervals** <br>
`DateDiff("d", Now(), CDate([StatusHireDate]))`

| Example | interval | date1 | date2 | output |
| --- | --- | --- | --- | --- |
| Positive difference in days between two dates | d | 2021-08-18+08:00 | 2021-08-31+08:00 | 13 |
| Negative difference in days between two dates | d | 8/25/2021 5:41:18 PM | 2012-03-16-07:00 | -3449 |
| Difference in weeks between two dates | ww | 8/25/2021 5:41:18 PM | 2012-03-16-07:00 | -493 | 
| Difference in months between two dates | m | 8/25/2021 5:41:18 PM | 2012-03-16-07:00 | -113 | 
| Difference in years between two dates | yyyy | 8/25/2021 5:41:18 PM | 2012-03-16-07:00 | -9 | 
| Difference when both dates are same | d | 2021-08-31+08:00 | 2021-08-31+08:00 | 0 | 
| Difference in hours between two dates | h | 2021-08-24 | 2021-08-25 | 24 | 
| Difference in minutes between two dates | n | 2021-08-24 | 2021-08-25 | 1440 | 
| Difference in seconds between two dates | s | 2021-08-24 | 2021-08-25 | 86400 | 

**Example 2: Combine DateDiff with IIF function to set attribute value** <br>
If an account is Active in Workday, set the *accountEnabled* attribute of the user to True only if hire date is within the next five days. 

```
Switch([Active], , 
  "1", IIF(DateDiff("d", Now(), CDate([StatusHireDate])) > 5, "False", "True"), 
  "0", "False")
```

---

### DateFromNum
**Function:** 
DateFromNum(value)

**Description:** 
The DateFromNum function converts a value in AD's date format to a DateTime type.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value** |Required | Date | AD Date to be converted to DateTime type |

**Example:**
`DateFromNum([lastLogonTimestamp])`

`DateFromNum(129699324000000000)`

Returns a DateTime representing January 1, 2012 at 11:00PM.

---
### FormatDateTime
**Function:** 
FormatDateTime(source, dateTimeStyles, inputFormat, outputFormat)

**Description:** 
Takes a date string from one format and converts it into a different format.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **dateTimeStyles** | Optional | String | Use this parameter to specify the formatting options that customize string parsing for some date and time parsing methods. For supported values, see [DateTimeStyles doc](/dotnet/api/system.globalization.datetimestyles). If left empty, the default value used is DateTimeStyles.RoundtripKind, DateTimeStyles.AllowLeadingWhite, DateTimeStyles.AllowTrailingWhite  |
| **inputFormat** |Required |String |Expected format of the source value. For supported formats, see [.NET custom date and time format strings](/dotnet/standard/base-types/custom-date-and-time-format-strings). |
| **outputFormat** |Required |String |Format of the output date. |



#### Output date as a string in a certain format
Example: You want to send dates to a SaaS application like ServiceNow in a certain format. You can consider using the following expression. 

**Expression:** 

`FormatDateTime([extensionAttribute1], , "yyyyMMddHHmmss.fZ", "yyyy-MM-dd")`

**Sample input/output:**

* **INPUT** (extensionAttribute1): "20150123105347.1Z"
* **OUTPUT**:  "2015-01-23"


---
### Guid
**Function:** 
Guid()

**Description:** 
The function Guid generates a new random GUID

**Example:** <br>
`Guid()`<br>
Sample output: "1088051a-cd4b-4288-84f8-e02042ca72bc"

---
### IgnoreFlowIfNullOrEmpty
**Function:** 
IgnoreFlowIfNullOrEmpty(expression)

**Description:** 
The IgnoreFlowIfNullOrEmpty function instructs the provisioning service to ignore the attribute and drop it from the flow if the enclosed function or attribute is NULL or empty.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** | Required | Expression | Expression to be evaluated |

**Example 1: Don't flow an attribute if it is null** <br>
`IgnoreFlowIfNullOrEmpty([department])` <br>
The above expression will drop the department attribute from the provisioning flow if it is null or empty. <br>

**Example 2: Don't flow an attribute if the expression mapping evaluates to empty string or null** <br>
Let's say the SuccessFactors attribute *prefix* is mapped to the on-premises Active Directory attribute *personalTitle* using the following expression mapping: <br>
`IgnoreFlowIfNullOrEmpty(Switch([prefix], "", "3443", "Dr.", "3444", "Prof.", "3445", "Prof. Dr."))` <br>
The above expression first evaluates the [Switch](#switch) function. If the *prefix* attribute doesn't have any of the values listed within the *Switch* function, then *Switch* will return an empty string and the attribute *personalTitle* will not be included in the provisioning flow to on-premises Active Directory.

---
### IIF
**Function:** 
IIF(condition,valueIfTrue,valueIfFalse)

**Description:** 
The IIF function returns one of a set of possible values based on a specified condition.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **condition** |Required |Variable or Expression |Any value or expression that can be evaluated to true or false. |
| **valueIfTrue** |Required |Variable or String | If the condition evaluates to true, the returned value. |
| **valueIfFalse** |Required |Variable or String |If the condition evaluates to false, the returned value.|

The following comparison operators can be used in the *condition*: 
* Equal to (=) and not equal to (<>)  
* Greater than (>) and greater than equal to (>=) 
* Less than (<) and less than equal to (<=)

**Example:** Set the target attribute value to source country attribute if country="USA", else set target attribute value to source department attribute.
`IIF([country]="USA",[country],[department])`

#### Known limitations and workarounds for IIF function
* The IIF function currently doesn't support AND and OR logical operators. 
* To implement AND logic, use nested IIF statement chained along the *trueValue* path. 
  Example: If country="USA" and state="CA", return value "True", else return "False".
  `IIF([country]="USA",IIF([state]="CA","True","False"),"False")`
* To implement OR logic, use nested IIF statement chained along the *falseValue* path. 
  Example: If country="USA" or state="CA", return value "True", else return "False".
  `IIF([country]="USA","True",IIF([state]="CA","True","False"))`
* If the source attribute used within the IIF function is empty or null, the condition check fails. 
   * Unsupported IIF expression examples: 
     * `IIF([country]="","Other",[country])`
     * `IIF(IsNullOrEmpty([country]),"Other",[country])`
     * `IIF(IsPresent([country]),[country],"Other")`
   * Recommended workaround: Use the [Switch](#switch) function to check for empty/null values. Example: If country attribute is empty, set value "Other". If it is present, pass the country attribute value to target attribute. 
     * `Switch([country],[country],"","Other")` 
<br>   
---
### InStr
**Function:** 
InStr(value1, value2, start, compareType)

**Description:** 
The InStr function finds the first occurrence of a substring in a string

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value1** |Required |String |String to be searched |
| **value2** |Required |String |String to be found |
| **start** |Optional |Integer |Starting position to find the substring|
| **compareType** |Optional |Enum |Can be vbTextCompare or vbBinaryCompare |

**Example:**
`InStr("The quick brown fox","quick")`

Evaluates to 5

`InStr("repEated","e",3,vbBinaryCompare)`

Evaluates to 7

---
### IsNull
**Function:** 
IsNull(Expression)

**Description:** 
If the expression evaluates to Null, then the IsNull function returns true. For an attribute, a Null is expressed by the absence of the attribute.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** |Required |Expression |Expression to be evaluated |

**Example:**
`IsNull([displayName])`

Returns True if the attribute isn't present.

---
### IsNullorEmpty
**Function:** 
IsNullOrEmpty(Expression)

**Description:** 
If the expression is null or an empty string, then the IsNullOrEmpty function returns true. For an attribute, this would evaluate to True if the attribute is absent or is present but is an empty string.
The inverse of this function is named IsPresent.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** |Required |Expression |Expression to be evaluated |

**Example:**
`IsNullOrEmpty([displayName])`

Returns True if the attribute isn't present or is an empty string.

---
### IsPresent
**Function:** 
IsPresent(Expression)

**Description:** 
If the expression evaluates to a string that isn't Null and isn't empty, then the IsPresent function returns true. The inverse of this function is named IsNullOrEmpty.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** |Required |Expression |Expression to be evaluated |

**Example:**
`Switch(IsPresent([directManager]),[directManager], IsPresent([skiplevelManager]),[skiplevelManager], IsPresent([director]),[director])`

---
### IsString
**Function:** 
IsString(Expression)

**Description:** 
If the expression can be evaluated to a string type, then the IsString function evaluates to True.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Expression** |Required |Expression |Expression to be evaluated |

---
### Item
**Function:** 
Item(attribute, index)

**Description:** 
The Item function returns one item from a multi-valued string/attribute.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute** |Required |Attribute |Multi-valued attribute to be searched |
| **index** |Required |Integer | Index to an item in the multi-valued string|

**Example:**
`Item([proxyAddresses], 1)` returns the first item in the multi-valued attribute. Index 0 shouldn't be used. 

---
### Join
**Function:** 
Join(separator, source1, source2, …)

**Description:** 
Join() is similar to Append(), except that it can combine multiple **source** string values into a single string, and each value will be separated by a **separator** string.

If one of the source values is a multi-value attribute, then every value in that attribute will be joined together, separated by the separator value.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **separator** |Required |String |String used to separate source values when they are concatenated into one string. Can be "" if no separator is required. |
| **source1  … sourceN** |Required, variable-number of times |String |String values to be joined together. |

---
### Left
**Function:** 
Left(String, NumChars)

**Description:** 
The Left function returns a specified number of characters from the left of a string. 
If numChars = 0, return empty string.
If numChars < 0, return input string.
If string is null, return empty string.
If string contains fewer characters than the number specified in numChars, a string identical to string (that is, containing all characters in parameter 1) is returned.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **String** |Required |Attribute | The string to return characters from |
| **NumChars** |Required |Integer | A number identifying the number of characters to return from the beginning (left) of string|

**Example:**
`Left("John Doe", 3)`

Returns "Joh".

---
### Mid
**Function:** 
Mid(source, start, length)

**Description:** 
Returns a substring of the source value. A substring is a string that contains only some of the characters from the source string.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute. |
| **start** |Required |Integer |Index in the **source** string where substring should start. First character in the string will have index of 1, second character will have index 2, and so on. |
| **length** |Required |Integer |Length of the substring. If length ends outside the **source** string, function will return substring from **start** index until end of **source** string. |

---
### NormalizeDiacritics
**Function:** 
NormalizeDiacritics(source)

**Description:** 
Requires one string argument. Returns the string, but with any diacritical characters replaced with equivalent non-diacritical characters. Typically used to convert first names and last names containing diacritical characters (accent marks) into legal values that can be used in various user identifiers such as user principal names, SAM account names, and email addresses.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String | Usually a first name or last name attribute. |


| Character with Diacritic  | Normalized character | Character with Diacritic  | Normalized character | 
| --- | --- | --- | --- | 
| ä, à, â, ã, å, á, ą, ă, ā, ā́, ā̀, ā̂, ā̃, ǟ, ā̈, ǡ, a̱, å̄ | a | Ä, À, Â, Ã, Å, Á, Ą, Ă, Ā, Ā́, Ā̀, Ā̂, Ā̃, Ǟ, Ā̈, Ǡ, A̱, Å̄ | A | 
| æ, ǣ | ae | Æ, Ǣ | AE | 
| ç, č, ć, c̄, c̱ | c | Ç, Č, Ć, C̄, C̱ | C | 
| ď, d̄, ḏ | d | Ď, D̄, Ḏ | D | 
| ë, è, é, ê, ę, ě, ė, ē, ḗ, ḕ, ē̂, ē̃, ê̄, e̱, ë̄, e̊̄ | e | Ë, È, É, Ê, Ę, Ě, Ė, Ē, Ḗ, Ḕ, Ē̂, Ē̃, Ê̄, E̱, Ë̄, E̊̄ | E | 
| ğ, ḡ, g̱ | g | Ğ, Ḡ, G̱ | G | 
| ï, î, ì, í, ı, ī, ī́, ī̀, ī̂, ī̃, i̱ | i | Ï, Î, Ì, Í, İ, Ī, Ī́, Ī̀, Ī̂, Ī̃, I̱ | I |  
| ľ, ł, l̄, ḹ, ḻ | l |  Ł, Ľ, L̄, Ḹ, Ḻ | L | 
| ñ, ń, ň, n̄, ṉ | n |  Ñ, Ń, Ň, N̄, Ṉ | N | 
| ö, ò, ő, õ, ô, ó, ō, ṓ, ṑ, ō̂, ō̃, ȫ, ō̈, ǭ, ȭ, ȱ, o̱ | o |  Ö, Ò, Ő, Õ, Ô, Ó, Ō, Ṓ, Ṑ, Ō̂, Ō̃, Ȫ, Ō̈, Ǭ, Ȭ, Ȱ, O̱ | O | 
| ø, ø̄, œ̄  | oe |  Ø, Ø̄, Œ̄ | OE | 
| ř, r̄, ṟ, ṝ | r |  Ř, R̄, Ṟ, Ṝ | R | 
| ß | ss | | | 
| š, ś, ș, ş, s̄, s̱ | s |  Š, Ś, Ș, Ş, S̄, S̱ | S | 
| ť, ț, t̄, ṯ | t | Ť, Ț, T̄, Ṯ | T | 
| ü, ù, û, ú, ů, ű, ū, ū́, ū̀, ū̂, ū̃, u̇̄, ǖ, ṻ, ṳ̄, u̱ | u |  Ü, Ù, Û, Ú, Ů, Ű, Ū, Ū́, Ū̀, Ū̂, Ū̃, U̇̄, Ǖ, Ṻ, Ṳ̄, U̱ | U | 
| ÿ, ý, ȳ, ȳ́, ȳ̀, ȳ̃, y̱ | y | Ÿ, Ý, Ȳ, Ȳ́, Ȳ̀, Ȳ̃, Y̱ | Y | 
| ź, ž, ż, z̄, ẕ | z | Ź, Ž, Ż, Z̄, Ẕ | Z | 


#### Remove diacritics from a string
Example: Replace characters containing accent marks with equivalent characters that don't contain accent marks.

**Expression:** 
NormalizeDiacritics([givenName])

**Sample input/output:** 

* **INPUT** (givenName): "Zoë"
* **OUTPUT**:  "Zoe"


---
### Not
**Function:** 
Not(source)

**Description:** 
Flips the boolean value of the **source**. If **source** value is True, returns False. Otherwise, returns True.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |Boolean String |Expected **source** values are "True" or "False". |

---
### Now
**Function:** 
Now()

**Description:**  
The Now function returns a string representing the current UTC DateTime in the format **M/d/yyyy h:mm:ss tt**.

**Example:**
`Now()` <br>
Example value returned *7/2/2021 3:33:38 PM*

---
### NumFromDate
**Function:** 
NumFromDate(value)

**Description:** 
The NumFromDate function converts a DateTime value to Active Directory format that is required to set attributes like [accountExpires](/windows/win32/adschema/a-accountexpires). Use this function to convert DateTime values received from cloud HR apps like Workday and SuccessFactors to their equivalent AD representation. 

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **value** |Required | String | Date time string in [ISO 8601](https://www.iso.org/iso-8601-date-and-time-format.html) format. If the date variable is in a different format, use [FormatDateTime](#formatdatetime) function to convert the date to ISO 8601 format. |

**Example:**
* Workday example 
  Assuming you want to map the attribute *ContractEndDate* from Workday, which is in the format *2020-12-31-08:00* to *accountExpires* field in AD, here is how you can use this function and change the timezone offset to match your locale. 
  `NumFromDate(Join("", FormatDateTime([ContractEndDate], ,"yyyy-MM-ddzzz", "yyyy-MM-dd"), " 23:59:59-08:00"))`

* SuccessFactors example 
  Assuming you want to map the attribute *endDate* from SuccessFactors, which is in the format *M/d/yyyy hh:mm:ss tt* to *accountExpires* field in AD, here is how you can use this function and change the time zone offset to match your locale.
  `NumFromDate(Join("",FormatDateTime([endDate], ,"M/d/yyyy hh:mm:ss tt","yyyy-MM-dd")," 23:59:59-08:00"))`


---
### PCase
**Function:** 
PCase(source, wordSeparators)

**Description:** 
The PCase function converts the first character of each word in a string to upper case, and all other characters are converted to lower case.

**Parameters:** 

| Name | Required/Optional | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**source** value to convert to proper case. |
| **wordSeparators** |Optional |String |Specify a set of characters that will be used as word separators (example: " ,-'") |

**Remarks:**

* If the *wordSeparators* parameter isn't specified, then PCase internally invokes the .NET function [ToTitleCase](/dotnet/api/system.globalization.textinfo.totitlecase) to convert the *source* string to proper case. The .NET function *ToTitleCase* supports a comprehensive set of the  [Unicode character categories](https://www.unicode.org/reports/tr44/#General_Category_Values) as word separators. 
  * Space character
  * New line character
  * *Control* characters like CRLF
  * *Format* control characters
  * *ConnectorPunctuation* characters like underscore
  * *DashPunctuation* characters like dash and hyphen (including characters such En Dash, Em Dash, double hyphen, etc.)
  * *OpenPunctuation* and *ClosePunctuation* characters that occur in pairs like parenthesis, curly bracket, angle bracket, etc. 
  * *InitialQuotePunctuation* and *FinalQuotePunctuation* characters like single quotes, double quotes and angular quotes. 
  * *OtherPunctuation* characters like exclamation mark, number sign, percent sign, ampersand, asterisk, comma, full stop, colon, semi-colon, etc. 
  * *MathSymbol* characters like plus sign, less-than and greater-than sign, vertical line, tilde, equals sign, etc.
  * *CurrencySymbol* characters like dollar sign, cent sign, pound sign, euro sign, etc. 
  * *ModifierSymbol* characters like macron, accents, arrow heads, etc. 
  * *OtherSymbol* characters like copyright sign, degree sign, registered sign, etc. 
* If the *wordSeparators* parameter is specified, then PCase only uses the characters specified as word separators. 

**Example:**

Let's say you're sourcing the attributes *firstName* and *lastName* from SAP SuccessFactors and in HR both these attributes are in upper-case. Using the PCase function, you can convert the name to proper case as shown below. 

| Expression | Input | Output | Notes |
| --- | --- | --- | --- |
| `PCase([firstName])` | *firstName* = "PABLO GONSALVES (SECOND)" | "Pablo Gonsalves (Second)" | As the *wordSeparators* parameter isn't specified, the *PCase* function uses the default word separators character set. |
| `PCase([lastName]," '-")` | *lastName* = "PINTO-DE'SILVA" | "Pinto-De'Silva" | The *PCase* function uses characters in the *wordSeparators* parameter to identify words and transform them to proper case. |
| `PCase(Join(" ",[firstName],[lastName]))` | *firstName* = GREGORY, *lastName* = "JAMES" | "Gregory James" | You can nest the Join function within PCase. As the *wordSeparators* parameter isn't specified, the *PCase* function uses the default word separators character set.  |


---

### RandomString
**Function:** 
RandomString(Length, MinimumNumbers, MinimumSpecialCharacters, MinimumCapital, MinimumLowerCase, CharactersToAvoid)

**Description:** 
The RandomString function generates a random string based on the conditions specified. Characters allowed can be identified [here](/windows/security/threat-protection/security-policy-settings/password-must-meet-complexity-requirements#reference).

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **Length** |Required |Number |Total length of the random string. This should be greater than or equal to the sum of MinimumNumbers, MinimumSpecialCharacters, and MinimumCapital. 256 characters max.|
| **MinimumNumbers** |Required |Number |Minimum numbers in the random string.|
| **MinimumSpecialCharacters** |Required |Number |Minimum number of special characters.|
| **MinimumCapital** |Required |Number |Minimum number of capital letters in the random string.|
| **MinimumLowerCase** |Required |Number |Minimum number of lower case letters in the random string.|
| **CharactersToAvoid** |Optional |String |Characters to be excluded when generating the random string.|


**Example 1:** - Generate a random string without special character restrictions:
`RandomString(6,3,0,0,3)`
Generates a random string with 6 characters. The string contains 3 numbers and 3 lower case characters (1a73qt).

**Example 2:** - Generate a random string with special character restrictions:
`RandomString(10,2,2,2,1,"?,")`
Generates a random string with 10 characters. The string contains at least 2 numbers, 2 special characters, 2 capital letters, 1 lower case letter and excludes the characters "?" and "," (1@!2BaRg53).

---
### Redact
**Function:** 
Redact()

**Description:** 
The Redact function replaces the attribute value with the string literal "[Redact]" in the provisioning logs. 

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute/value** |Required |String|Specify the attribute or constant / string to redact from the logs.|

**Example 1:** Redact an attribute:
`Redact([userPrincipalName])`
Removes the userPrincipalName from the provisioning logs.

**Example 2:** Redact a string:
`Redact("StringToBeRedacted")`
Removes a constant string from the provisioning logs.

**Example 3:** Redact a random string:
`Redact(RandomString(6,3,0,0,3))`
Removes the random string from the provisioning logs.

---
### RemoveDuplicates
**Function:** 
RemoveDuplicates(attribute)

**Description:** 
The RemoveDuplicates function takes a multi-valued string and make sure each value is unique.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **attribute** |Required |Multi-valued Attribute |Multi-valued attribute that will have duplicates removed|

**Example:**
`RemoveDuplicates([proxyAddresses])`
Returns a sanitized proxyAddress attribute where all duplicate values have been removed.

---
### Replace
**Function:** 
Replace(source, oldValue, regexPattern, regexGroupName, replacementValue, replacementAttributeName, template)

**Description:**
Replaces values within a string in a case-sensitive manner. The function behaves differently depending on the parameters provided:

* When **oldValue** and **replacementValue** are provided:
  
  * Replaces all occurrences of **oldValue** in the **source**  with **replacementValue**
* When **oldValue** and **template** are provided:
  
  * Replaces all occurrences of the **oldValue** in the **template** with the **source** value
* When **regexPattern** and **replacementValue** are provided:

  * The function applies the **regexPattern** to the **source** string and you can use the regex group names to construct the string for **replacementValue**
> [!NOTE] 
> To learn more about regex grouping constructs and named sub-expressions, see [Grouping Constructs in Regular Expressions](/dotnet/standard/base-types/grouping-constructs-in-regular-expressions).
* When **regexPattern**, **regexGroupName**, **replacementValue** are provided:
  
  * The function applies the **regexPattern** to the **source** string and replaces all values matching **regexGroupName** with **replacementValue**
* When **regexPattern**, **regexGroupName**, **replacementAttributeName** are provided:
  
  * If **source** has a value, **source** is returned
  * If **source** has no value, the function applies the **regexPattern** to the **replacementAttributeName** and returns the value matching **regexGroupName**

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the **source** object. |
| **oldValue** |Optional |String |Value to be replaced in **source** or **template**. |
| **regexPattern** |Optional |String |Regex pattern for the value to be replaced in **source**. When **replacementAttributeName** is used, the **regexPattern** is applied to extract a value from **replacementAttributeName**. |
| **regexGroupName** |Optional |String |Name of the group inside **regexPattern**. When named **replacementAttributeName** is used, we will extract the value of the named regex group from the **replacementAttributeName** and return it as the replacement value. |
| **replacementValue** |Optional |String |New value to replace old one with. |
| **replacementAttributeName** |Optional |String |Name of the attribute to be used for replacement value |
| **template** |Optional |String |When **template** value is provided, we will look for **oldValue** inside the template and replace it with **source** value. |

#### Replace characters using a regular expression
**Example 1:** Using **oldValue** and **replacementValue** to replace the entire source string with another string.

Let's say your HR system has an attribute `BusinessTitle`. As part of recent job title changes, your company wants to update anyone with the business title "Product Developer" to "Software Engineer". 
Then in this case, you can use the following expression in your attribute mapping. 

`Replace([BusinessTitle],"Product Developer", , , "Software Engineer", , )`

* **source**: `[BusinessTitle]`
* **oldValue**: "Product Developer"
* **replacementValue**: "Software Engineer"
* **Expression output**: Software Engineer

**Example 2:** Using **oldValue** and **template** to insert the source string into another *templatized* string. 

The parameter **oldValue** is a misnomer in this scenario. It is actually the value that will get replaced.  
Let's say you want to always generate login ID in the format `<username>@contoso.com`. There is a source attribute called **UserID** and you want that value to be used for the `<username>` portion of the login ID. 
Then in this case, you can use the following expression in your attribute mapping. 

`Replace([UserID],"<username>", , , , , "<username>@contoso.com")`

* **source:** `[UserID]` = "jsmith"
* **oldValue:** "`<username>`"
* **template:** "`<username>@contoso.com`"
* **Expression output:** "jsmith@contoso.com"

**Example 3:** Using **regexPattern** and **replacementValue** to extract a portion of the source string and replace it with an empty string or a custom value built using regex patterns or regex group names.
 
Let's say you have a source attribute `telephoneNumber` that has components `country code` and `phone number` separated by a space character. For example, `+91 9998887777`
Then in this case, you can use the following expression in your attribute mapping to extract the 10 digit phone number. 

`Replace([telephoneNumber], , "\\+(?<isdCode>\\d* )(?<phoneNumber>\\d{10})", , "${phoneNumber}", , )`

* **source:** `[telephoneNumber]` = "+91 9998887777"
* **regexPattern:** "`\\+(?<isdCode>\\d* )(?<phoneNumber>\\d{10})`"
* **replacementValue:** "`${phoneNumber}`"
* **Expression output:** 9998887777

You can also use this pattern to remove characters and collapse a string. 
For example, the expression below removes parenthesis, dashes and space characters in the mobile number string and returns only digits. 

`Replace([mobile], , "[()\\s-]+", , "", , )`

* **source:** `[mobile] = "+1 (999) 888-7777"`
* **regexPattern:** "`[()\\s-]+`"
* **replacementValue:** "" (empty string)
* **Expression output:** 19998887777

**Example 4:** Using **regexPattern**, **regexGroupName** and **replacementValue** to extract a portion of the source string and replace it with another literal value or empty string.

Let's say your source system has an attribute AddressLineData with two components street number and street name. As part of a recent move, let's say the street number of the address changed, and you want to update only the street number portion of the address line. 
Then in this case, you can use the following expression in your attribute mapping to extract the street number.

`Replace([AddressLineData], ,"(?<streetNumber>^\\d*)","streetNumber", "888", , )`

* **source:** `[AddressLineData]` = "545 Tremont Street"
* **regexPattern:** "`(?<streetNumber>^\\d*)`"
* **regexGroupName:** "streetNumber"
* **replacementValue:** "888"
* **Expression output:** 888 Tremont Street

Here is another example where the domain suffix from a UPN is replaced with an empty string to generate login ID without domain suffix. 

`Replace([userPrincipalName], , "(?<Suffix>@(.)*)", "Suffix", "", , )`

* **source:** `[userPrincipalName]` = "jsmith@contoso.com"
* **regexPattern:** "`(?<Suffix>@(.)*)`"
* **regexGroupName:** "Suffix"
* **replacementValue:** "" (empty string)
* **Expression output:** jsmith

**Example 5:** Using **regexPattern**, **regexGroupName** and **replacementAttributeName** to handle scenarios when the source attribute is empty or doesn't have a value.

Let's say your source system has an attribute telephoneNumber. If telephoneNumber is empty, you want to extract the 10 digits of the mobile number attribute.
Then in this case, you can use the following expression in your attribute mapping. 

`Replace([telephoneNumber], , "\\+(?<isdCode>\\d* )(?<phoneNumber>\\d{10})", "phoneNumber" , , [mobile], )`

* **source:** `[telephoneNumber]` = "" (empty string)
* **regexPattern:** "`\\+(?<isdCode>\\d* )(?<phoneNumber>\\d{10})`"
* **regexGroupName:** "phoneNumber"
* **replacementAttributeName:** `[mobile]` = "+91 8887779999"
* **Expression output:** 8887779999

**Example 6:** You need to find characters that match a regular expression value and remove them.

`Replace([mailNickname], , "[a-zA-Z_]*", , "", , )`

* **source** \[mailNickname\]
* **oldValue**: "john_doe72"
* **replaceValue**: ""
* **Expression output**: 72

---
### SelectUniqueValue
**Function:** 
SelectUniqueValue(uniqueValueRule1, uniqueValueRule2, uniqueValueRule3, …)

**Description:** 
Requires a minimum of two arguments, which are unique value generation rules defined using expressions. The function evaluates each rule and then checks the value generated for uniqueness in the target app/directory. The first unique value found will be the one returned. If all of the values already exist in the target, the entry will get escrowed, and the reason gets logged in the audit logs. There is no upper bound to the number of arguments that can be provided.


 - This function must be at the top-level and cannot be nested.
 - This function cannot be applied to attributes that have a matching precedence.     
 - This function is only meant to be used for entry creations. When using it with an attribute, set the **Apply Mapping** property to **Only during object creation**.
 - This function is currently only supported for "Workday to Active Directory User Provisioning" and "SuccessFactors to Active Directory User Provisioning". It cannot be used with other provisioning applications. 
 - The LDAP search that *SelectUniqueValue* function performs in on-premises Active Directory doesn't escape special characters like diacritics. If you pass a string like "Jéssica Smith" that contains a special character, you will encounter processing errors. Nest the [NormalizeDiacritics](#normalizediacritics) function as shown in the example below to normalize special characters. 


**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **uniqueValueRule1  … uniqueValueRuleN** |At least 2 are required, no upper bound |String | List of unique value generation rules to evaluate. |

#### Generate unique value for userPrincipalName (UPN) attribute
Example: Based on the user's first name, middle name and last name, you need to generate a value for the UPN attribute and check for its uniqueness in the target AD directory before assigning the value to the UPN attribute.

**Expression:** 

```ad-attr-mapping-expr
    SelectUniqueValue( 
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  [PreferredFirstName], [PreferredLastName]))), "contoso.com"), 
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  Mid([PreferredFirstName], 1, 1), [PreferredLastName]))), "contoso.com"),
        Join("@", NormalizeDiacritics(StripSpaces(Join(".",  Mid([PreferredFirstName], 1, 2), [PreferredLastName]))), "contoso.com")
    )
```

**Sample input/output:**

* **INPUT** (PreferredFirstName): "John"
* **INPUT** (PreferredLastName): "Smith"
* **OUTPUT**: "John.Smith@contoso.com" if UPN value of John.Smith@contoso.com doesn't already exist in the directory
* **OUTPUT**: "J.Smith@contoso.com" if UPN value of John.Smith@contoso.com already exists in the directory
* **OUTPUT**: "Jo.Smith@contoso.com" if the above two UPN values already exist in the directory



---
### SingleAppRoleAssignment
**Function:** 
SingleAppRoleAssignment([appRoleAssignments])

**Description:** 
Returns a single appRoleAssignment from the list of all appRoleAssignments assigned to a user for a given application. This function is required to convert the appRoleAssignments object into a single role name string. The best practice is to ensure only one appRoleAssignment is assigned to one user at a time. This function isn't supported in scenarios where users have multiple app role assignments. 

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **[appRoleAssignments]** |Required |String |**[appRoleAssignments]** object. |

---
### Split
**Function:** 
Split(source, delimiter)

**Description:** 
Splits a string into a multi-valued array, using the specified delimiter character.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**source** value to update. |
| **delimiter** |Required |String |Specifies the character that will be used to split the string (example: ",") |

#### Split a string into a multi-valued array
Example: You need to take a comma-delimited list of strings, and split them into an array that can be plugged into a multi-value attribute like Salesforce's PermissionSets attribute. In this example, a list of permission sets has been populated in extensionAttribute5 in Microsoft Entra ID.

**Expression:** 
Split([extensionAttribute5], ",")

**Sample input/output:** 

* **INPUT** (extensionAttribute5): "PermissionSetOne, PermissionSetTwo"
* **OUTPUT**:  ["PermissionSetOne", "PermissionSetTwo"]


---
### StripSpaces
**Function:** 
StripSpaces(source)

**Description:** 
Removes all space (" ") characters from the source string.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**source** value to update. |

---
### Switch
**Function:** 
Switch(source, defaultValue, key1, value1, key2, value2, …)

**Description:** 
When **source** value matches a **key**, returns **value** for that **key**. If **source** value doesn't match any keys, returns **defaultValue**.  **Key** and **value** parameters must always come in pairs. The function always expects an even number of parameters. The function shouldn't be used for referential attributes such as manager. 

> [!NOTE] 
> Switch function performs a case-sensitive string comparison of the **source** and **key** values. If you'd like to perform a case-insensitive comparison, normalize the **source** string before comparison using a nested ToLower function and ensure that all **key** strings use lowercase. 
> Example: `Switch(ToLower([statusFlag]), "0", "true", "1", "false", "0")`. In this example, the **source** attribute `statusFlag` may have values ("True" / "true" / "TRUE"). However, the Switch function will always convert it to lowercase string "true" before comparison with **key** parameters. 

> [!CAUTION] 
> For the **source** parameter, do not use the nested functions IsPresent, IsNull or IsNullOrEmpty. Instead use a literal empty string as one of the key values.   
> Example: `Switch([statusFlag], "Default Value", "true", "1", "", "0")`. In this example, if the **source** attribute `statusFlag` is empty, the Switch function will return the value 0. 

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |**Source** value to update. |
| **defaultValue** |Optional |String |Default value to be used when source doesn't match any keys. Can be empty string (""). |
| **key** |Required |String |**Key** to compare **source** value with. |
| **value** |Required |String |Replacement value for the **source** matching the key. |

#### Replace a value based on predefined set of options
Example: Define the time zone of the user based on the state code stored in Microsoft Entra ID. 
If the state code doesn't match any of the predefined options, use default value of "Australia/Sydney".

**Expression:** 
`Switch([state], "Australia/Sydney", "NSW", "Australia/Sydney","QLD", "Australia/Brisbane", "SA", "Australia/Adelaide")`

**Sample input/output:**

* **INPUT** (state): "QLD"
* **OUTPUT**: "Australia/Brisbane"


---
### ToLower
**Function:** 
ToLower(source, culture)

**Description:** 
Takes a *source* string value and converts it to lower case using the culture rules that are specified. If there is no *culture* info specified, then it will use Invariant culture.

If you would like to set existing values in the target system to lower case, [update the schema for your target application](./customize-application-attributes.md#editing-the-list-of-supported-attributes) and set the property caseExact to 'true' for the attribute that you're interested in. 

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object |
| **culture** |Optional |String |The format for the culture name based on RFC 4646 is *languagecode2-country/regioncode2*, where *languagecode2* is the two-letter language code and *country/regioncode2* is the two-letter subculture code. Examples include ja-JP for Japanese (Japan) and en-US for English (United States). In cases where a two-letter language code isn't available, a three-letter code derived from ISO 639-2 is used.|

#### Convert generated userPrincipalName (UPN) value to lower case
Example: You would like to generate the UPN value by concatenating the PreferredFirstName and PreferredLastName source fields and converting all characters to lower case. 

`ToLower(Join("@", NormalizeDiacritics(StripSpaces(Join(".",  [PreferredFirstName], [PreferredLastName]))), "contoso.com"))`

**Sample input/output:**

* **INPUT** (PreferredFirstName): "John"
* **INPUT** (PreferredLastName): "Smith"
* **OUTPUT**: "john.smith@contoso.com"


---
### ToUpper
**Function:** 
ToUpper(source, culture)

**Description:** 
Takes a *source* string value and converts it to upper case using the culture rules that are specified. If there is no *culture* info specified, then it will use Invariant culture.

If you would like to set existing values in the target system to upper case, [update the schema for your target application](./customize-application-attributes.md#editing-the-list-of-supported-attributes) and set the property caseExact to 'true' for the attribute that you're interested in. 

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **source** |Required |String |Usually name of the attribute from the source object. |
| **culture** |Optional |String |The format for the culture name based on RFC 4646 is *languagecode2-country/regioncode2*, where *languagecode2* is the two-letter language code and *country/regioncode2* is the two-letter subculture code. Examples include ja-JP for Japanese (Japan) and en-US for English (United States). In cases where a two-letter language code isn't available, a three-letter code derived from ISO 639-2 is used.|

---
### Word
**Function:** 
Word(String,WordNumber,Delimiters)

**Description:** 
The Word function returns a word contained within a string, based on parameters describing the delimiters to use and the word number to return. Each string of characters in string separated by the one of the characters in delimiters are identified as words:

If number < 1, returns empty string.
If string is null, returns empty string.
If string contains less than number words, or string doesn't contain any words identified by delimiters, an empty string is returned.

**Parameters:** 

| Name | Required/ Repeating | Type | Notes |
| --- | --- | --- | --- |
| **String** |Required |Multi-valued Attribute |String to return a word from.|
| **WordNumber** |Required | Integer | Number identifying which word number should return|
| **delimiters** |Required |String| A string representing the delimiter(s) that should be used to identify words|

**Example:**
`Word("The quick brown fox",3," ")`

Returns "brown".

`Word("This,string!has&many separators",3,",!&#")`

Returns "has".

---

## Examples
This section provides more expression function usage examples. 

### Strip known domain name
Strip a known domain name from a user's email to obtain a user name. 
For example, if the domain is "contoso.com", then you could use the following expression:

**Expression:** 
`Replace([mail], "@contoso.com", , ,"", ,)`

**Sample input / output:** 

* **INPUT** (mail): "john.doe@contoso.com"
* **OUTPUT**:  "john.doe"


### Generate user alias by concatenating parts of first and last name
Generate a user alias by taking first three letters of user's first name and first five letters of user's last name.

**Expression:** 
`Append(Mid([givenName], 1, 3), Mid([surname], 1, 5))`

**Sample input/output:** 

* **INPUT** (givenName): "John"
* **INPUT** (surname): "Doe"
* **OUTPUT**:  "JohDoe"

### Add a comma between last name and first name. 
Add a comma between last name and first name. 

**Expression:** 
`Join(", ", "", [surname], [givenName])`

**Sample input/output:** 

* **INPUT** (givenName): "John"
* **INPUT** (surname): "Doe"
* **OUTPUT**:  "Doe, John"


## Related Articles
* [Automate User Provisioning/Deprovisioning to SaaS Apps](../app-provisioning/user-provisioning.md)
* [Customizing Attribute Mappings for User Provisioning](../app-provisioning/customize-application-attributes.md)
* [Scoping Filters for User Provisioning](define-conditional-rules-for-provisioning-user-accounts.md)
* [Using SCIM to enable automatic provisioning of users and groups from Microsoft Entra ID to applications](../app-provisioning/use-scim-to-provision-users-and-groups.md)
* [Account Provisioning Notifications](../app-provisioning/user-provisioning.md)
* [List of Tutorials on How to Integrate SaaS Apps](../saas-apps/tutorial-list.md)
