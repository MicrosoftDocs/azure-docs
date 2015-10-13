<properties
	pageTitle="Azure AD Connect sync: Functions Reference | Microsoft Azure"
	description="Reference of declarative provisioning expressions in Azure AD Connect Sync."
	services="active-directory"
	documentationCenter=""
	authors="markusvi"
	manager="StevenPo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/13/2015"
	ms.author="markusvi"/>


# Azure AD Connect Sync: Functions Reference


In Azure Active Directory Sync, functions are used to manipulate an attribute value during synchronization. <br>
The Syntax of the functions is expressed using the following format: <br>
`<output type> FunctionName(<input type> <position name>, ..)`

If a function is overloaded and accepts multiple syntaxes, all valid syntaxes are listed.<br>
The functions are strongly typed and they verify that the type passed in matches the documented type.<br>
An error is thrown if the type does not match.

The types are expressed with the following syntax:

- **bin** – Binary
- **bool** – Boolean
- **dt** – UTC Date/Time
- **enum** – Enumeration of known constants
- **exp** – Expression, which is expected to evaluate to a Boolean
- **mvbin** – Multi Valued Binary
- **mvstr** – Multi Valued Reference
- **num** – Numeric
- **ref** – Single Valued Reference
- **str** – Single Valued String
- **var** – A variant of (almost) any other type
- **void** – doesn’t return a value



## Functions Reference

----------
**Conversion:**

[CBool](#cbool) &nbsp;&nbsp;&nbsp;&nbsp; [CDate](#cdate) &nbsp;&nbsp;&nbsp;&nbsp; [CGuid](#cguid) &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; [ConvertFromBase64](#convertfrombase64) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertToBase64](#converttobase64) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertFromUTF8Hex](#convertfromutf8hex) &nbsp;&nbsp;&nbsp;&nbsp; [ConvertToUTF8Hex](#converttoutf8hex) &nbsp;&nbsp;&nbsp;&nbsp; [CNum](#cnum)  &nbsp;&nbsp;&nbsp;&nbsp; [CRef](#cref) &nbsp;&nbsp;&nbsp;&nbsp; [CStr](#cstr)  &nbsp;&nbsp;&nbsp;&nbsp; [StringFromGuid](#StringFromGuid) &nbsp;&nbsp;&nbsp;&nbsp; [StringFromSid](#stringfromsid)

**Date / Time:**

[DateAdd](#dateadd) &nbsp;&nbsp;&nbsp;&nbsp; [DateFromNum](#datefromnum)  &nbsp;&nbsp;&nbsp;&nbsp; [FormatDateTime](#formatdatetime)  &nbsp;&nbsp;&nbsp;&nbsp; [Now](#now)  &nbsp;&nbsp;&nbsp;&nbsp; [NumFromDate](#numfromdate)

**Directory**

[DNComponent](#dncomponent)  &nbsp;&nbsp;&nbsp;&nbsp; [DNComponentRev](#dncomponentrev) &nbsp;&nbsp;&nbsp;&nbsp; [EscapeDNComponent](#escapedncomponent)

**Insprection:**

[IsBitSet](#isbitset)  &nbsp;&nbsp;&nbsp;&nbsp; [IsDate](#isdate) &nbsp;&nbsp;&nbsp;&nbsp; [IsEmpty](#isempty)
&nbsp;&nbsp;&nbsp;&nbsp; [IsGuid](#isguid) &nbsp;&nbsp;&nbsp;&nbsp; [IsNull](#isnull) &nbsp;&nbsp;&nbsp;&nbsp; [IsNullOrEmpty](#isnullorempty) &nbsp;&nbsp;&nbsp;&nbsp; [IsNumeric](#isnumeric)  &nbsp;&nbsp;&nbsp;&nbsp; [IsPresent](#ispresent) &nbsp;&nbsp;&nbsp;&nbsp; [IsString](#isstring)

**Math:**

[BitAnd](#bitand) &nbsp;&nbsp;&nbsp;&nbsp; [BitOr](#bitor) &nbsp;&nbsp;&nbsp;&nbsp; [RandomNum](#randomnum)

**Multi-valued**

[Contains](#contains) &nbsp;&nbsp;&nbsp;&nbsp; [Count](#count) &nbsp;&nbsp;&nbsp;&nbsp; [Item](#item)   &nbsp;&nbsp;&nbsp;&nbsp; [ItemOrNull](#itemornull) &nbsp;&nbsp;&nbsp;&nbsp; [Join](#join) &nbsp;&nbsp;&nbsp;&nbsp; [RemoveDuplicates](#removeduplicates) &nbsp;&nbsp;&nbsp;&nbsp; [Split](#split)

**Program Flow:**

[Error](#error) &nbsp;&nbsp;&nbsp;&nbsp; [IIF](#iif)  &nbsp;&nbsp;&nbsp;&nbsp; [Switch](#switch)


**Text**

[GUID](#guid) &nbsp;&nbsp;&nbsp;&nbsp; [InStr](#instr) &nbsp;&nbsp;&nbsp;&nbsp; [InStrRev](#instrrev) &nbsp;&nbsp;&nbsp;&nbsp; [LCase](#lcase) &nbsp;&nbsp;&nbsp;&nbsp; [Left](#left) &nbsp;&nbsp;&nbsp;&nbsp; [Len](#len) &nbsp;&nbsp;&nbsp;&nbsp; [LTrim](#ltrim)  &nbsp;&nbsp;&nbsp;&nbsp; [Mid](#mid)  &nbsp;&nbsp;&nbsp;&nbsp; [PadLeft](#padleft) &nbsp;&nbsp;&nbsp;&nbsp; [PadRight](#padright) &nbsp;&nbsp;&nbsp;&nbsp; [PCase](#pcase)   &nbsp;&nbsp;&nbsp;&nbsp; [Replace](#replace) &nbsp;&nbsp;&nbsp;&nbsp; [ReplaceChars](#replacechars) &nbsp;&nbsp;&nbsp;&nbsp; [Right](#right) &nbsp;&nbsp;&nbsp;&nbsp; [RTrim](rtrim) &nbsp;&nbsp;&nbsp;&nbsp; [Trim](#trim) &nbsp;&nbsp;&nbsp;&nbsp; [UCase](#ucase) &nbsp;&nbsp;&nbsp;&nbsp; [Word](#word)

----------
### BitAnd

**Description:**<br>
The BitAnd function sets specified bits on a value.

**Syntax:**<br>
`num BitAnd(num value1, num value2)`

- value1, value2: numeric values which should be AND’ed together

**Remarks:**<br>
This function converts both parameters to the binary representation and sets a bit to:

- 0 - if one or both of the corresponding bits in *mask* and *flag* are 0
- 1 - if both of the corresponding bits are 1.

In other words, it returns 0 in all cases except when the corresponding bits of both parameters are 1.

**Example:**<br>
`BitAnd(&HF, &HF7)`<br>
Returns 7 because hexadecimal “F” AND “F7” evaluate to this value.

----------
### BitOr

**Description:** <br>
The BitOr function sets specified bits on a value.

**Syntax:** <br>
`num BitOr(num value1, num value2)`

- value1, value2: numeric values that should be OR’ed together

**Remarks:** <br>
This function converts both parameters to the binary representation and sets a bit to 1 if one or both of the corresponding bits in mask and flag are 1, and to 0 if both of the corresponding bits are 0. <br>
In other words, it returns 1 in all cases except where the corresponding bits of both parameters are 0.

----------
### CBool

**Description:**<br>
The CBool function returns a Boolean based on the evaluated expression

**Syntax:** <br>
`bool CBool(exp Expression)`

**Remarks:**<br>
If the expression evaluates to a nonzero value then CBool returns True else it returns False.


**Example:**<br>
`CBool([attrib1] = [attrib2])` <br>

Returns True if both attributes have the same value.




----------
### CDate

**Description:**<br>
The CDate function returns a UTC DateTime from a string. DateTime is not a native attribute type in Sync but is used by some functions.

**Syntax:**<br>
`dt CDate(str value)`

- Value: A string with a date, time, and optionally time zone

**Remarks:**<br>
The returned string is always in UTC.

**Example:**<br>
`CDate([employeeStartTime])` <br>
Returns a DateTime based on the employee’s start time

`CDate("2013-01-10 4:00 PM -8")` <br>
Returns a DateTime representing "2013-01-11 12:00 AM"




----------
### CGuid

**Description:**<br>
The CGuid function converts the string representation of a GUID to its binary representation.

**Syntax:**<br>
`bin CGuid(str GUID)GUID`

- A String formatted in this pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}




----------
### Contains

**Description:**<br>
The Contains function finds a string inside a multi-valued attribute

**Syntax:**<br>
`num Contains (mvstring attribute, str search)` - case sensitive<br>
`num Contains (mvstring attribute, str search, enum Casetype)`<br>
`num Contains (mvref attribute, str search)` - case sensitive

- attribute: the multi-valued attribute to search.<br>
- search: string to find in the attribute.<br>
- Casetype: CaseInsensitive or CaseSensitive.<br>

Returns index in the multi-valued attribute where the string was found. 0 is returned if the string is not found.


**Remarks:**<br>
For multi-valued string attributes the search will find substrings in the values.<br>
For reference attributes, the searched string must exactly match the value to be considered a match.

**Example:**<br>
`IIF(Contains([proxyAddresses],”SMTP:”)>0,[proxyAddresses],Error(“No primary SMTP address found.”))`<br>
If the proxyAddresses attribute has a primary email address (indicated by uppercase “SMTP:”) then return the proxyAddress attribute, else return an error.




----------
### ConvertFromBase64

**Description:**<br>
The ConvertFromBase64 function converts the specified base64 encoded value to a regular string.

**Syntax:**<br>
`str ConvertFromBase64(str source)` - assumes Unicode for encoding <br>
`str ConvertFromBase64(str source, enum Encoding)`

- source: Base64 encoded string<br>
- Encoding: Unicode, ASCII, UTF8

**Example**<br>
`ConvertFromBase64("SABlAGwAbABvACAAdwBvAHIAbABkACEA")`<br>
`ConvertFromBase64("SGVsbG8gd29ybGQh", UTF8)`

Both examples return "*Hello world!*"




----------
### ConvertFromUTF8Hex

**Description:**<br>
The ConvertFromUTF8Hex function converts the specified UTF8 Hex encoded value to a string.

**Syntax:**<br>
`str ConvertFromUTF8Hex(str source)`

- source: UTF8 2-byte encoded sting

**Remarks:**<br>
The difference between this function and ConvertFromBase64([],UTF8) in that the result is friendly for the DN attribute.<br>
This format is used by Azure Active Directory as DN.

**Example:**<br>
`ConvertFromUTF8Hex("48656C6C6F20776F726C6421")`<br>
Returns "*Hello world!*"




----------
### ConvertToBase64

**Description:** <br>
The ConvertToBase64 function converts a string to a Unicode base64 string.<br>
Converts the value of an array of integers to its equivalent string representation that is encoded with base-64 digits.

**Syntax:** <br>
`str ConvertToBase64(str source)`

**Example:** <br>
`ConvertToBase64("Hello world!")` <br>
Returns "SABlAGwAbABvACAAdwBvAHIAbABkACEA"




----------
### ConvertToUTF8Hex

**Description:**<br>
The ConvertToUTF8Hex function converts a string to a UTF8 Hex encoded value.

**Syntax:**<br>
`str ConvertToUTF8Hex(str source)`

**Remarks:**<br>
The output format of this function is used by Azure Active Directory as DN attribute format.

**Example:** <br>
`ConvertToUTF8Hex("Hello world!")` <br>
Returns 48656C6C6F20776F726C6421




----------
### Count

**Description:**<br>
The Count function returns the number of elements in a multi-valued attribute

**Syntax:** <br>
`num Count(mvstr attribute)`




----------
### CNum

**Description:** <br>
The CNum function takes a string and returns a numeric data type.

**Syntax:** <br>
`num CNum(str value)`




----------
### CRef

**Description:** <br>
Converts a string to a reference attribute

**Syntax:** <br>
`ref CRef(str value)`

**Example:** <br>
`CRef(“CN=LC Services,CN=Microsoft,CN=lcspool01, CN=Pools,CN=RTC Service,” & %Forest.LDAP%)`




----------
### CStr

**Description:** <br>
The CStr function converts to a string data type.

**Syntax:** <br>
`str CStr(num value)` <br>
`str CStr(ref value)` <br>
`str CStr(bool value)` <br>

- value: Can be a numeric value, reference attribute, or Boolean.

**Example:** <br>
`CStr([dn]) <br>`
Could return “cn=Joe,dc=contoso,dc=com”




----------
### DateAdd

**Description:** <br>
Returns a Date containing a date to which a specified time interval has been added.

**Syntax:** <br>
`dt DateAdd(str interval, num value, dt date)`

- interval: String expression that is the interval of time you want to add. The string must have one of the following values:
 - yyyy Year
 - q Quarter
 - m Month
 - y Day of year
 - d Day
 - w Weekday
 - ww Week
 - h Hour
 - n Minute
 - s Second
- value: The number of units you want to add. It can be positive (to get dates in the future) or negative (to get dates in the past).
- date: DateTime representing date to which the interval is added.

**Example:** <br>
`DateAdd("m", 3, CDate("2001-01-01"))` <br>
Adds 3 months and returns a DateTime representing "2001-04-01”




----------
### DateFromNum

**Description:** <br>
The DateFromNum function converts a value in AD’s date format to a DateTime type.

**Syntax:** <br>
`dt DateFromNum(num value)`

**Example:** <br>
`DateFromNum([lastLogonTimestamp])` <br>
`DateFromNum(129699324000000000)` <br>
Returns a DateTime representing 2012-01-01 23:00:00




----------
### DNComponent

**Description:** <br>
The DNComponent function returns the value of a specified DN component going from left.

**Syntax:** <br>
`str DNComponent(ref dn, num ComponentNumber)`

- dn: the reference attribute to interpret
- ComponentNumber: The component in the DN to return

**Example:** <br>
`DNComponent([dn],1)`  <br>
If dn is “cn=Joe,ou=…, it returns Joe




----------
### DNComponentRev

**Description:** <br>
The DNComponentRev function returns the value of a specified DN component going from right (the end).

**Syntax:** <br>
`str DNComponentRev(ref dn, num ComponentNumber)` <br>
`str DNComponentRev(ref dn, num ComponentNumber, enum Options)`

- dn: the reference attribute to interpret
- ComponentNumber - The component in the DN to return
- Options: DC – Ignore all components with “dc=”

**Example:** <br>
`If dn is “cn=Joe,ou=Atlanta,ou=GA,ou=US, dc=contoso,dc=com” then DNComponentRev([dn],3)` <br>  `DNComponentRev([dn],1,”DC”)` <br>
Both return US.




----------
### Error

**Description:** <br>
The Error function is used to return a custom error.

**Syntax:** <br>
`void Error(str ErrorMessage)`

**Example:** <br>
`IIF(IsPresent([accountName]),[accountName],Error(“AccountName is required”))` <br>
If the attribute accountName is not present, throw an error on the object.




----------
### EscapeDNComponent

**Description:** <br>
The EscapeDNComponent function takes one component of a DN and escapes it so it can be represented in LDAP.

**Syntax:** <br>
`str EscapeDNComponent(str value)`

**Example:** <br>
`EscapeDNComponent(“cn=” & [displayName]) & “,” & %ForestLDAP%` <br>
Makes sure the object can be created in an LDAP directory even if the displayName attribute has characters which must be escaped in LDAP.




----------
### FormatDateTime

**Description:** <br>
The FormatDateTime function is used to format a DateTime to a string with a specified format

**Syntax:** <br>
`str FormatDateTime(dt value, str format)`

- value: a value in the DateTime format <br>
- format: a string representing the format to convert to.

**Remarks:** <br>
The possible values for the format can be found here: [User-Defined Date/Time Formats (Format Function)](http://msdn2.microsoft.com/library/73ctwf33\(VS.90\).aspx)

**Example:** <br>

`FormatDateTime(CDate(“12/25/2007”),”yyyy-mm-dd”)` <br>
Results in “2007-12-25”.

`FormatDateTime(DateFromNum([pwdLastSet]),”yyyyMMddHHmmss.0Z”)` <br>
Can result in “20140905081453.0Z”




----------
### GUID

**Description:** <br>
The function GUID generates a new random GUID

**Syntax:** <br>
`str GUID()`




----------
### IIF

**Description:** <br>  
The IIF function returns one of a set of possible values based on a specified condition.

**Syntax:** <br>
`var IIF(exp condition, var valueIfTrue, var valueIfFalse)`

- condition: any value or expression that can be evaluated to true or false.
- valueIfTrue: a value that will be returned if condition evaluates to true.
- valueIfFalse: a value that will be returned if condition evaluates to false.

**Example:** <br>
`IIF([employeeType]=“Intern”,”t-“&[alias],[alias])` <br>
Returns the alias of a user with “t-“ added to the beginning of it if the user is an intern, else returns the user’s alias as is.




----------
### InStr

**Description:** <br>
The InStr function finds the first occurrence of a substring in a string

**Syntax:** <br>

`num InStr(str stringcheck, str stringmatch)` <br>
`num InStr(str stringcheck, str stringmatch, num start)` <br>
`num InStr(str stringcheck, str stringmatch, num start , enum compare)`

- stringcheck: string to be searched <br>
- stringmatch: string to be found <br>
- start: starting position to find the substring <br>
- compare: vbTextCompare or vbBinaryCompare

**Remarks:** <br>
Returns the position where the substring was found or 0 if not found.

**Example:** <br>
`InStr("The quick brown fox","quick")` <br>
Evalues to 5

`InStr("repEated","e",3,vbBinaryCompare)` <br>
Evaluates to 7




----------
### InStrRev

**Description:** <br>
The InStrRev function finds the last occurrence of a substring in a string

**Syntax:** <br>
`num InstrRev(str stringcheck, str stringmatch)` <br>
`num InstrRev(str stringcheck, str stringmatch, num start)` <br>
`num InstrRev(str stringcheck, str stringmatch, num start, enum compare)`

- stringcheck: string to be searched <br>
- stringmatch: string to be found <br>
- start: starting position to find the substring <br>
- compare: vbTextCompare or vbBinaryCompare

**Remarks:** <br>
Returns the position where the substring was found or 0 if not found.

**Example:** <br>
`InStrRev("abbcdbbbef","bb")` <br>
Returns 7




----------
### IsBitSet

**Description:** <br>
The function IsBitSet Tests if a bit is set or not

**Syntax:** <br>
`bool IsBitSet(num value, num flag)`

- value: a numeric value that is evaluated.flag: a numeric value that has the bit to be evaluated

**Example:** <br>
`IsBitSet(&HF,4)` <br>
Returns True because bit “4” is set in the hexadecimal value “F”




----------
### IsDate

**Description:** <br>
The IsDate function evaluates to True if the expression can be evaluates as a DateTime type.

**Syntax:** <br>
`bool IsDate(var Expression)`

**Remarks:** <br>
Used to determine if CDate() will be successful.




----------
###IsEmpty

**Description:** <br>  
The IsEmpty function evaluates to True if the attribute is present in the CS or MV but evaluates to an empty string.

**Syntax:** <br>
`bool IsEmpty(var Expression)`




----------
###IsGuid

**Description:** <br>
The IsGuid function evaluated to true if the string could be converted to a GUID.

**Syntax:** <br>
`bool IsGuid(str GUID)`

**Remarks:** <br>
A GUID is defined as a string following one of these patterns: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

Used to determine if CGuid() will be successful.

**Example:** <br>
`IIF(IsGuid([strAttribute]),CGuid([strAttribute]),NULL)` <br>
If the StrAttribute has a GUID format, return a binary representation, otherwise return a Null.




----------
###IsNull

**Description:** <br>
The IsNull function returns true if the expression evaluates to Null.

**Syntax:** <br>
`bool IsNull(var Expression)`

**Remarks:** <br>
For an attribute, a Null is expressed by the absence of the attribute.

**Example:** <br>
`IsNull([displayName])` <br>
Returns True if the attribute is not present in the CS or MV.




----------
###IsNullOrEmpty

**Description:** <br>
The IsNullOrEmpty function returns true if the expression is null or an empty string.

**Syntax:** <br>
`bool IsNullOrEmpty(var Expression)`

**Remarks:** <br>
For an attribute, this would evaluate to True if the attribute is absent or is present but is an empty string.<br>
The inverse of this function is named IsPresent.

**Example:** <br>
`IsNull([displayName])` <br>
Returns True if the attribute is not present or is an empty string in the CS or MV.




----------
### IsNumeric

**Description:** <br>
The IsNumeric function returns a Boolean value indicating whether an expression can be evaluated as a number type.

**Syntax:** <br>
`bool IsNumeric(var Expression)`

**Remarks:** <br>
Used to determine if CNum() will be successful to parse the expression.




----------
### IsString

**Description:** <br>
The IsString function evaluates to True if the expression can be evaluated to a string type.

**Syntax:** <br>
`bool IsString(var expression)`

**Remarks:** <br>
Used to determine if CStr() will be successful to parse the expression.




----------
### IsPresent

**Description:** <br>
The IsPresent function returns true if the expression evaluates to a string which is not Null and is not empty.

**Syntax:** <br>
`bool IsPresent(var expression)`

**Remarks:** <br>
The inverse of this function is named IsNullOrEmpty.

**Example:** <br>

`Switch(IsPresent([directManager]),[directManager], IsPresent([skiplevelManager]),[skiplevelManager], IsPresent([director]),[director])`




----------
### Item

**Description:** <br>
The Item function returns one item from a multi-valued string/attribute.

**Syntax:** <br>
`var Item(mvstr attribute, num index)`

- attribute: multi-valued attribute <br>
- index: index to an item in the multi-valued string.

**Remarks:** <br>
The Item function is useful together with the Contains function since the latter function will return the index to an item in the multi-valued attribute.

Throws an error if index is out of bounds.

**Example:** <br>
`Mid(Item([proxyAddress],Contains([proxyAddress], ”SMTP:”)),6)`  <br>
Returns the primary email address.




----------
### ItemOrNull

**Description:** <br>
The ItemOrNull function returns one item from a multi-valued string/attribute.

**Syntax:** <br>
`var ItemOrNull(mvstr attribute, num index)`

- attribute: multi-valued attribute <br>
- index: index to an item in the multi-valued string.

**Remarks:** <br>
The ItemOrNull function is useful together with the Contains function since the latter function will return the index to an item in the multi-valued attribute.

Returns a Null value if index is out of bounds.




----------
### Join

**Description:** <br>
The Join function takes a multi-valued string and returns a single-valued string with specified separator inserted between each item.

**Syntax:** <br>
`str Join(mvstr attribute)` <br>
`str Join(mvstr attribute, str Delimiter)`

- attribute: Multi-valued attribute containing strings to be joined. <br>
- delimiter: Any string, used to separate the substrings in the returned string. If omitted, the space character (" ") is used. If Delimiter is a zero-length string ("") or Nothing, all items in the list are concatenated with no delimiters.

**Remarks**<br>
There is parity between the Join and Split functions. The Join function takes an array of strings and joins them using a delimiter string, to return a single string. The Split function takes a string and separates it at the delimiter, to return an array of strings. However, a key difference is that Join can concatenate strings with any delimiter string, Split can only separate strings using a single character delimiter.

**Example:** <br>
`Join([proxyAddresses],”,”)` <br>
Could return: “SMTP:john.doe@contoso.com,smtp:jd@contoso.com”




----------
### LCase

**Description:** <br>
The LCase function converts all characters in a string to lower case.

**Syntax:** <br>
`str LCase(str value)`

**Example:** <br>
`LCase(“TeSt”)` <br>
Returns “test”.




----------
### Left

**Description:** <br>
The Left function returns a specified number of characters from the left of a string.

**Syntax:** <br>
`str Left(str string, num NumChars)`

- string: the string to return characters from <br>
- NumChars: a number identifying the number of characters to return from the beginning (left) of string

**Remarks:** <br>
A string containing the first numChars characters in string:

- If numChars = 0, return empty string.
- If numChars < 0, return input string.
- If string is null, return empty string.

If string contains fewer characters than the number specified in numChars, a string identical to string (ie. containing all characters in parameter 1) is returned.

**Example:** <br>
`Left(“John Doe”, 3)` <br>
Returns “Joh”.




----------
### Len

**Description:** <br>
The Len function returns number of characters in a string.

**Syntax:** <br>
`num Len(str value)`

**Example:** <br>
`Len(“John Doe”)` <br>
Returns 8




----------
### LTrim

**Description:** <br>
The LTrim function removes leading white spaces from a string.

**Syntax:** <br>
`str LTrim(str value)`

**Example:** <br>
`LTrim(“ Test ”)` <br>
Returns “Test ”




----------
### Mid

**Description:** <br>
The Mid function returns a specified number of characters from a specified position in a string.

**Syntax:** <br>
`str Mid(str string, num start, num NumChars)`

- string: the string to return characters from <br>
- start: a number identifying the starting position in string to return characters from
- NumChars: a number identifying the number of characters to return from position in string


**Remarks:** <br>
Return numChars characters starting from position start in string.<br>
A string containing numChars characters from position start in string:

- If numChars = 0, return empty string.
- If numChars < 0, return input string.
- If start > the length of string, return input string.
- If start <= 0, return input string.
- If string is null, return empty string.

If there are not numChar characters remaining in string from position start, as many characters as can be returned are returned.

**Example:** <br>

`Mid(“John Doe”, 3, 5)` <br>
Returns “hn Do”.

`Mid(“John Doe”, 6, 999)` <br>
Returns “Doe”




----------
### Now

**Description:** <br>
The Now function returns a DateTime specifying the current date and time, according your computer's system date and time.

**Syntax:** <br>
`dt Now()`




----------
### NumFromDate

**Description:** <br>
The NumFromDate function returns a date in AD’s date format.

**Syntax:** <br>
`num NumFromDate(dt value)`


**Example:** <br>
`NumFromDate(CDate("2012-01-01 23:00:00"))` <br>
Returns 129699324000000000




----------
### PadLeft

**Description:** <br>
The PadLeft function left-pads a string to a specified length using a provided padding character.

**Syntax:** <br>
`str PadLeft(str string, num length, str padCharacter)`

- string: the string to pad. <br>
- length: An integer representing the desired length of string. <br>
- padCharacter: A string consisting of a single character to use as the pad character



----------
### Remarks

- If the length of string is less than length, then padCharacter is repeatedly appended to the beginning (left) of string until it has a length equal to length.
- PadCharacter can be a space character, but it cannot be a null value.
- If the length of string is equal to or greater than length, string is returned unchanged.
- If string has a length greater than or equal to length, a string identical to string is returned.
- If the length of string is less than length, then a new string of the desired length is returned containing string padded with a padCharacter.
- If string is null, the function returns an empty string.

**Example:** <br>
`PadLeft(“User”, 10, “0”)` <br>
Returns “000000User”.




----------
### PadRight

**Description:** <br>
The PadRight function right-pads a string to a specified length using a provided padding character.

**Syntax:** <br>
`str PadRight(str string, num length, str padCharacter)`

- string: the string to pad.
- length: An integer representing the desired length of string.
- padCharacter: A string consisting of a single character to use as the pad character

**Remarks:**

- If the length of string is less than length, then padCharacter is repeatedly appended to the end (right) of string until it has a length equal to length.
- padCharacter can be a space character, but it cannot be a null value.
- If the length of string is equal to or greater than length, string is returned unchanged.
- If string has a length greater than or equal to length, a string identical to string is returned.
- If the length of string is less than length, then a new string of the desired length is returned containing string padded with a padCharacter.
- If string is null, the function returns an empty string.


**Example:** <br>
`PadRight(“User”, 10, “0”)` <br>
Returns “User000000”.




----------
### PCase

**Description:** <br>
The PCase function converts the first character of each space delimited word in a string to upper case, and all other characters are converted to lower case.

**Syntax:** <br>
`String PCase(string)`

**Example:** <br>
`PCase(“TEsT”)` <br>
Returns “Test”.




----------
### RandomNum

**Description:** <br>
The RandomNum function returns a random number between a specified interval.

**Syntax:** <br>
`num RandomNum(num start, num end)`

- start: a number identifying the lower limit of the random value to generate <br>
- end: a number identifying the upper limit of the random value to generate

**Example:** <br>
`Random(100,999)` <br>
Returns 734.




----------
### RemoveDuplicates

**Description:** <br>
The RemoveDuplicates function takes a multi-valued string and make sure each value is unique.

**Syntax:** <br>  
`mvstr RemoveDuplicates(mvstr attribute)`

**Example:** <br>
`RemoveDuplicates([proxyAddresses])` <br>
Returns a sanitized proxyAddress attribute where all duplicate values have been removed.




----------
### Replace

**Description:** <br>
The Replace function replaces all occurrences of a string to another string.

**Syntax:** <br>
`str Replace(str string, str OldValue, str NewValue)`

- string: A string to replace values in. <br>
- OldValue: The string to search for and to replace. <br>
- NewValue: The string to replace to.


**Remarks:** <br>
The function recognizes the following special monikers:

- \n – New Line
- \r – Carriage Return
- \t – Tab


**Example:** <br>

`Replace([address],”\r\n”,”, “)` <br>
Replaces CRLF with a comma and space, and could lead to “One Microsoft Way, Redmond, WA, USA”




----------
### ReplaceChars

**Description:** <br>
The ReplaceChars function replaces all occurrences of characters found in the ReplacePattern string.

**Syntax:** <br>
`str ReplaceChars(str string, str ReplacePattern)`

- string: A string to replace characters in.
- ReplacePattern: a string containing a dictionary with characters to replace.

The format is {source1}:{target1},{source2}:{target2},{sourceN},{targetN} where source is the character to find and target the string to replace with.


**Remarks:**

- The function takes each occurrence of defined sources and replaces them with the targets.
- The source must be exactly one (unicode) character.
- The source cannot be empty or longer than one character (parsing error).
- The target can have multiple characters, e.g. ö:oe, β:ss.
- The target can be empty indicating that the character should be removed.
- The source is case sensitive and must be an exact match.
- The , (comma) and : (colon) are reserved characters and cannot be replaced using this function.
- Spaces and other white characters in the ReplacePattern string are ignored.


**Example:** <br>
'%ReplaceString% = ’:,Å:A,Ä:A,Ö:O,å:a,ä:a,ö,o'

`ReplaceChars(”Räksmörgås”,%ReplaceString%)` <br>
Returns Raksmorgas

`ReplaceChars(“O’Neil”,%ReplaceString%)` <br>
Returns “ONeil”, the single tick is defined to be removed.




----------
### Right

**Description:** <br>
The Right function returns a specified number of characters from the right (end) of a string.

**Syntax:** <br>
`str Right(str string, num NumChars)`

- string: the string to return characters from
- NumChars: a number identifying the number of characters to return from the end (right) of string

**Remarks:** <br>
NumChars characters are returned from the last position of string.

A string containing the last numChars characters in string:

- If numChars = 0, return empty string.
- If numChars < 0, return input string.
- If string is null, return empty string.

If string contains fewer characters than the number specified in NumChars, a string identical to string is returned.

**Example:** <br>
`Right(“John Doe”, 3)` <br>
Returns “Doe”.




----------
### RTrim

**Description:** <br>
The RTrim function removes trailing white spaces from a string.

**Syntax:** <br>
`str RTrim(str value)`

**Example:** <br>
`RTrim(“ Test ”)` <br>
Returns “ Test”.




----------
### Split

**Description:** <br>
The Split function takes a string separated with a delimiter and makes it a multi-valued string.


**Syntax:** <br>
`mvstr Split(str value, str delimiter)` <br?
`mvstr Split(str value, str delimiter, num limit)`

- value: the string with a delimiter character to separate.
- delimiter: single character to be used as the delimiter.
- limit: maximum number of values which will be returned.

**Example:** <br>
`Split(“SMTP:john.doe@contoso.com,smtp:jd@contoso.com”,”,”)` <br>
Returns a multi-valued string with 2 elements useful for the proxyAddress attribute




----------
### StringFromGuid

**Description:** <br>
The StringFromGuid function takes a binary GUID and converts it to a string

**Syntax:** <br>
`str StringFromGuid(bin GUID)`




----------
### StringFromSid

**Description:** <br>
The StringFromSid function converts a byte array or a multi-valued byte array containing a security identifier to a string or multi-valued string.

**Syntax:** <br>
`str StringFromSid(bin ObjectSID)` <br>
`mvstr StringFromSid(mvbin ObjectSID)`




----------
### Switch

**Description:** <br>
The Switch function is used to return a single value based on evaluated conditions.

**Syntax:** <br>
`var Switch(exp expr1, var value1[, exp expr2, var value … [, exp expr, var valueN]])`

- expr: Variant expression you want to evaluate.
- value: Value to be returned if the corresponding expression is True.

**Remarks:** <br>
The Switch function argument list consists of pairs of expressions and values. The expressions are evaluated from left to right, and the value associated with the first expression to evaluate to True is returned. If the parts aren't properly paired, a run-time error occurs.

For example, if expr1 is True, Switch returns value1. If expr-1 is False, but expr-2 is True, Switch returns value-2, and so on.

Switch returns a Nothing if:
- None of the expressions are True.
- The first True expression has a corresponding value that is Null.

Switch evaluates all of the expressions, even though it returns only one of them. For this reason, you should watch for undesirable side effects. For example, if the evaluation of any expression results in a division by zero error, an error occurs.

Value can also be the Error function which would return a custom string.

**Example:** <br>
`Switch([city] = "London", "English", [city] = "Rome", "Italian", [city] = "Paris", "French", True, Error(“Unknown city”))` <br>
Returns the language spoken in some major cities, otherwise returns an Error.




----------
### Trim

**Description:** <br>
The Trim function removes leading and trailing white spaces from a string.

**Syntax:** <br>
`str Trim(str value)` <br>
`mvstr Trim(mvstr value)`

**Example:** <br>
`Trim(“ Test ”)` <br>
Returns “Test”.

`Trim([proxyAddresses])` <br>
Removes leading and trailing spaces for each value in the proxyAddress attribute.




----------
### UCase

**Description:** <br>
The UCase function converts all characters in a string to upper case.

**Syntax:** <br>
`str UCase(str string)`

**Example:** <br>
`UCase(“TeSt”)` <br>
Returns “TEST”.




----------
### Word

**Description:** <br>
The Word function returns a word contained within a string, based on parameters describing the delimiters to use and the word number to return.

**Syntax:** <br>
`str Word(str string, num WordNumber, str delimiters)`

- string: the string to return a word from.
- WordNumber: a number identifying which word number should be returned.
- delimiters: a string representing the delimiter(s) that should be used to identify words

**Remarks:** <br>
Each string of characters in string separated by the one of the characters in delimiters are identified as words:

- If number < 1, returns empty string.
- If string is null, returns empty string.

If string contains less than number words, or string does not contain any words identified by delimeters, an empty string is returned.


**Example:** <br>
`Word(“The quick brown fox”,3,” “)` <br>
Returns “brown”

`Word(“This,string!has&many seperators”,3,”,!&#”)` <br>
Would return “has”


## Additional Resources

* [Understanding Declarative Provisioning Expressions](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md)
* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)


<!--Image references-->
