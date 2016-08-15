<properties
	pageTitle="Azure AD Connect sync: Functions Reference | Microsoft Azure"
	description="Reference of declarative provisioning expressions in Azure AD Connect sync."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="StevenPo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/02/2016"
	ms.author="andkjell;markvi"/>


# Azure AD Connect sync: Functions Reference

In Azure AD Connect, functions are used to manipulate an attribute value during synchronization.  
The Syntax of the functions is expressed using the following format:  
`<output type> FunctionName(<input type> <position name>, ..)`

If a function is overloaded and accepts multiple syntaxes, all valid syntaxes are listed.  
The functions are strongly typed and they verify that the type passed in matches the documented type.  
An error is thrown if the type does not match.

The types are expressed with the following syntax:

- **bin** – Binary
- **bool** – Boolean
- **dt** – UTC Date/Time
- **enum** – Enumeration of known constants
- **exp** – Expression, which is expected to evaluate to a Boolean
- **mvbin** – Multi Valued Binary
- **mvstr** – Multi Valued String
- **mvref** – Multi Valued Reference
- **num** – Numeric
- **ref** – Single Valued Reference
- **str** – Single Valued String
- **var** – A variant of (almost) any other type
- **void** – doesn’t return a value

## Functions Reference

List of functions | | | | |  
--------- | --------- | --------- | --------- | --------- | ---------
**Conversion** |  
[CBool](#cbool) | [CDate](#cdate) | [CGuid](#cguid) | [ConvertFromBase64](#convertfrombase64)
[ConvertToBase64](#converttobase64) | [ConvertFromUTF8Hex](#convertfromutf8hex) | [ConvertToUTF8Hex](#converttoutf8hex) | [CNum](#cnum)
[CRef](#cref) | [CStr](#cstr) | [StringFromGuid](#StringFromGuid) | [StringFromSid](#stringfromsid)
**Date / Time** |  
[DateAdd](#dateadd) | [DateFromNum](#datefromnum) | [FormatDateTime](#formatdatetime) | [Now](#now)
[NumFromDate](#numfromdate) |  
**Directory** |  
[DNComponent](#dncomponent) | [DNComponentRev](#dncomponentrev) | [EscapeDNComponent](#escapedncomponent)
**Evaluation** |  
[IsBitSet](#isbitset) | [IsDate](#isdate) | [IsEmpty](#isempty) | [IsGuid](#isguid)
[IsNull](#isnull) | [IsNullOrEmpty](#isnullorempty) | [IsNumeric](#isnumeric) | [IsPresent](#ispresent) |
[IsString](#isstring) |  
**Math** |  
[BitAnd](#bitand) | [BitOr](#bitor) | [RandomNum](#randomnum)
**Multi-valued** |  
[Contains](#contains) | [Count](#count) | [Item](#item) | [ItemOrNull](#itemornull)
[Join](#join) | [RemoveDuplicates](#removeduplicates) | [Split](#split) |
**Program Flow** |  
[Error](#error) | [IIF](#iif)  | [Switch](#switch)
**Text** |  
[GUID](#guid) | [InStr](#instr) | [InStrRev](#instrrev) | [LCase](#lcase)
[Left](#left) | [Len](#len) | [LTrim](#ltrim) | [Mid](#mid)
[PadLeft](#padleft) | [PadRight](#padright) | [PCase](#pcase) | [Replace](#replace)
[ReplaceChars](#replacechars) | [Right](#right) | [RTrim](#rtrim) | [Trim](#trim)
[UCase](#ucase) | [Word](#word)

----------
### BitAnd

**Description:**  
The BitAnd function sets specified bits on a value.

**Syntax:**  
`num BitAnd(num value1, num value2)`

- value1, value2: numeric values which should be AND’ed together

**Remarks:**  
This function converts both parameters to the binary representation and sets a bit to:

- 0 - if one or both of the corresponding bits in *mask* and *flag* are 0
- 1 - if both of the corresponding bits are 1.

In other words, it returns 0 in all cases except when the corresponding bits of both parameters are 1.

**Example:**  
`BitAnd(&HF, &HF7)`  
Returns 7 because hexadecimal "F" AND "F7" evaluate to this value.

----------
### BitOr

**Description:**  
The BitOr function sets specified bits on a value.

**Syntax:**  
`num BitOr(num value1, num value2)`

- value1, value2: numeric values that should be OR’ed together

**Remarks:**  
This function converts both parameters to the binary representation and sets a bit to 1 if one or both of the corresponding bits in mask and flag are 1, and to 0 if both of the corresponding bits are 0. In other words, it returns 1 in all cases except where the corresponding bits of both parameters are 0.

----------
### CBool

**Description:**  
The CBool function returns a Boolean based on the evaluated expression

**Syntax:**  
`bool CBool(exp Expression)`

**Remarks:**  
If the expression evaluates to a nonzero value then CBool returns True else it returns False.

**Example:**  
`CBool([attrib1] = [attrib2])`  

Returns True if both attributes have the same value.

----------
### CDate

**Description:**  
The CDate function returns a UTC DateTime from a string. DateTime is not a native attribute type in Sync but is used by some functions.

**Syntax:**  
`dt CDate(str value)`

- Value: A string with a date, time, and optionally time zone

**Remarks:**  
The returned string is always in UTC.

**Example:**  
`CDate([employeeStartTime])`  
Returns a DateTime based on the employee’s start time

`CDate("2013-01-10 4:00 PM -8")`  
Returns a DateTime representing "2013-01-11 12:00 AM"

----------
### CGuid

**Description:**  
The CGuid function converts the string representation of a GUID to its binary representation.

**Syntax:**  
`bin CGuid(str GUID)`

- A String formatted in this pattern: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

----------
### Contains

**Description:**  
The Contains function finds a string inside a multi-valued attribute

**Syntax:**  
`num Contains (mvstring attribute, str search)` - case sensitive  
`num Contains (mvstring attribute, str search, enum Casetype)`  
`num Contains (mvref attribute, str search)` - case sensitive

- attribute: the multi-valued attribute to search.<br>
- search: string to find in the attribute.<br>
- Casetype: CaseInsensitive or CaseSensitive.<br>

Returns index in the multi-valued attribute where the string was found. 0 is returned if the string is not found.

**Remarks:**  
For multi-valued string attributes the search will find substrings in the values.  
For reference attributes, the searched string must exactly match the value to be considered a match.

**Example:**  
`IIF(Contains([proxyAddresses],"SMTP:")>0,[proxyAddresses],Error("No primary SMTP address found."))`  
If the proxyAddresses attribute has a primary email address (indicated by uppercase "SMTP:") then return the proxyAddress attribute, else return an error.

----------
### ConvertFromBase64

**Description:**  
The ConvertFromBase64 function converts the specified base64 encoded value to a regular string.

**Syntax:**  
`str ConvertFromBase64(str source)` - assumes Unicode for encoding <br>
`str ConvertFromBase64(str source, enum Encoding)`

- source: Base64 encoded string  
- Encoding: Unicode, ASCII, UTF8

**Example**  
`ConvertFromBase64("SABlAGwAbABvACAAdwBvAHIAbABkACEA")`  
`ConvertFromBase64("SGVsbG8gd29ybGQh", UTF8)`

Both examples return "*Hello world!*"

----------
### ConvertFromUTF8Hex

**Description:**  
The ConvertFromUTF8Hex function converts the specified UTF8 Hex encoded value to a string.

**Syntax:**  
`str ConvertFromUTF8Hex(str source)`

- source: UTF8 2-byte encoded sting

**Remarks:**  
The difference between this function and ConvertFromBase64([],UTF8) in that the result is friendly for the DN attribute.  
This format is used by Azure Active Directory as DN.

**Example:**  
`ConvertFromUTF8Hex("48656C6C6F20776F726C6421")`  
Returns "*Hello world!*"

----------
### ConvertToBase64

**Description:**  
The ConvertToBase64 function converts a string to a Unicode base64 string.  
Converts the value of an array of integers to its equivalent string representation that is encoded with base-64 digits.

**Syntax:**  
`str ConvertToBase64(str source)`

**Example:**  
`ConvertToBase64("Hello world!")`  
Returns "SABlAGwAbABvACAAdwBvAHIAbABkACEA"

----------
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

----------
### Count

**Description:**  
The Count function returns the number of elements in a multi-valued attribute

**Syntax:**  
`num Count(mvstr attribute)`

----------
### CNum

**Description:**  
The CNum function takes a string and returns a numeric data type.

**Syntax:**  
`num CNum(str value)`

----------
### CRef

**Description:**  
Converts a string to a reference attribute

**Syntax:**  
`ref CRef(str value)`

**Example:**  
`CRef("CN=LC Services,CN=Microsoft,CN=lcspool01,CN=Pools,CN=RTC Service," & %Forest.LDAP%)`

----------
### CStr

**Description:**  
The CStr function converts to a string data type.

**Syntax:**  
`str CStr(num value)`  
`str CStr(ref value)`  
`str CStr(bool value)`  

- value: Can be a numeric value, reference attribute, or Boolean.

**Example:**  
`CStr([dn])`  
Could return "cn=Joe,dc=contoso,dc=com"

----------
### DateAdd

**Description:**  
Returns a Date containing a date to which a specified time interval has been added.

**Syntax:**  
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

**Example:**  
`DateAdd("m", 3, CDate("2001-01-01"))`  
Adds 3 months and returns a DateTime representing "2001-04-01".

----------
### DateFromNum

**Description:**  
The DateFromNum function converts a value in AD’s date format to a DateTime type.

**Syntax:**  
`dt DateFromNum(num value)`

**Example:**  
`DateFromNum([lastLogonTimestamp])`  
`DateFromNum(129699324000000000)`  
Returns a DateTime representing 2012-01-01 23:00:00

----------
### DNComponent

**Description:**  
The DNComponent function returns the value of a specified DN component going from left.

**Syntax:**  
`str DNComponent(ref dn, num ComponentNumber)`

- dn: the reference attribute to interpret
- ComponentNumber: The component in the DN to return

**Example:**  
`DNComponent([dn],1)`  
If dn is "cn=Joe,ou=…," it returns Joe

----------
### DNComponentRev

**Description:**  
The DNComponentRev function returns the value of a specified DN component going from right (the end).

**Syntax:**  
`str DNComponentRev(ref dn, num ComponentNumber)`  
`str DNComponentRev(ref dn, num ComponentNumber, enum Options)`

- dn: the reference attribute to interpret
- ComponentNumber - The component in the DN to return
- Options: DC – Ignore all components with "dc="

**Example:**  
If dn is "cn=Joe,ou=Atlanta,ou=GA,ou=US, dc=contoso,dc=com" then  
`DNComponentRev([dn],3)`  
`DNComponentRev([dn],1,"DC")`  
Both return US.

----------
### Error

**Description:**  
The Error function is used to return a custom error.

**Syntax:**  
`void Error(str ErrorMessage)`

**Example:**  
`IIF(IsPresent([accountName]),[accountName],Error("AccountName is required"))`  
If the attribute accountName is not present, throw an error on the object.

----------
### EscapeDNComponent

**Description:**  
The EscapeDNComponent function takes one component of a DN and escapes it so it can be represented in LDAP.

**Syntax:**  
`str EscapeDNComponent(str value)`

**Example:**  
`EscapeDNComponent("cn=" & [displayName]) & "," & %ForestLDAP%)`  
Makes sure the object can be created in an LDAP directory even if the displayName attribute has characters which must be escaped in LDAP.

----------
### FormatDateTime

**Description:**  
The FormatDateTime function is used to format a DateTime to a string with a specified format

**Syntax:**  
`str FormatDateTime(dt value, str format)`

- value: a value in the DateTime format
- format: a string representing the format to convert to.

**Remarks:**  
The possible values for the format can be found here: [User-Defined Date/Time Formats (Format Function)](http://msdn2.microsoft.com/library/73ctwf33\(VS.90\).aspx)

**Example:**  

`FormatDateTime(CDate("12/25/2007"),"yyyy-mm-dd")`  
Results in "2007-12-25".

`FormatDateTime(DateFromNum([pwdLastSet]),"yyyyMMddHHmmss.0Z")`  
Can result in "20140905081453.0Z"

----------
### GUID

**Description:**  
The function GUID generates a new random GUID

**Syntax:**  
`str GUID()`

----------
### IIF

**Description:**  
The IIF function returns one of a set of possible values based on a specified condition.

**Syntax:**  
`var IIF(exp condition, var valueIfTrue, var valueIfFalse)`

- condition: any value or expression that can be evaluated to true or false.
- valueIfTrue: a value that will be returned if condition evaluates to true.
- valueIfFalse: a value that will be returned if condition evaluates to false.

**Example:**  
`IIF([employeeType]="Intern","t-" & [alias],[alias])`  
Returns the alias of a user with "t-" added to the beginning of it if the user is an intern, else returns the user’s alias as is.

----------
### InStr

**Description:**  
The InStr function finds the first occurrence of a substring in a string

**Syntax:**  

`num InStr(str stringcheck, str stringmatch)`  
`num InStr(str stringcheck, str stringmatch, num start)`  
`num InStr(str stringcheck, str stringmatch, num start , enum compare)`

- stringcheck: string to be searched
- stringmatch: string to be found
- start: starting position to find the substring
- compare: vbTextCompare or vbBinaryCompare

**Remarks:**  
Returns the position where the substring was found or 0 if not found.

**Example:**  
`InStr("The quick brown fox","quick")`  
Evalues to 5

`InStr("repEated","e",3,vbBinaryCompare)`  
Evaluates to 7

----------
### InStrRev

**Description:**  
The InStrRev function finds the last occurrence of a substring in a string

**Syntax:**  
`num InstrRev(str stringcheck, str stringmatch)`  
`num InstrRev(str stringcheck, str stringmatch, num start)`  
`num InstrRev(str stringcheck, str stringmatch, num start, enum compare)`

- stringcheck: string to be searched
- stringmatch: string to be found
- start: starting position to find the substring
- compare: vbTextCompare or vbBinaryCompare

**Remarks:**  
Returns the position where the substring was found or 0 if not found.

**Example:**  
`InStrRev("abbcdbbbef","bb")`  
Returns 7

----------
### IsBitSet

**Description:**  
The function IsBitSet Tests if a bit is set or not

**Syntax:**  
`bool IsBitSet(num value, num flag)`

- value: a numeric value that is evaluated.flag: a numeric value that has the bit to be evaluated

**Example:**  
`IsBitSet(&HF,4)`  
Returns True because bit "4" is set in the hexadecimal value "F"

----------
### IsDate

**Description:**  
The IsDate function evaluates to True if the expression can be evaluates as a DateTime type.

**Syntax:**  
`bool IsDate(var Expression)`

**Remarks:**  
Used to determine if CDate() will be successful.

----------
### IsEmpty

**Description:**  
The IsEmpty function evaluates to True if the attribute is present in the CS or MV but evaluates to an empty string.

**Syntax:**  
`bool IsEmpty(var Expression)`

----------
### IsGuid

**Description:**  
The IsGuid function evaluated to true if the string could be converted to a GUID.

**Syntax:**  
`bool IsGuid(str GUID)`

**Remarks:**  
A GUID is defined as a string following one of these patterns: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx or {xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}

Used to determine if CGuid() will be successful.

**Example:**  
`IIF(IsGuid([strAttribute]),CGuid([strAttribute]),NULL)`  
If the StrAttribute has a GUID format, return a binary representation, otherwise return a Null.

----------
### IsNull

**Description:**  
The IsNull function returns true if the expression evaluates to Null.

**Syntax:**  
`bool IsNull(var Expression)`

**Remarks:**  
For an attribute, a Null is expressed by the absence of the attribute.

**Example:**  
`IsNull([displayName])`  
Returns True if the attribute is not present in the CS or MV.

----------
### IsNullOrEmpty

**Description:**  
The IsNullOrEmpty function returns true if the expression is null or an empty string.

**Syntax:**  
`bool IsNullOrEmpty(var Expression)`

**Remarks:**  
For an attribute, this would evaluate to True if the attribute is absent or is present but is an empty string.<br>
The inverse of this function is named IsPresent.

**Example:**  
`IsNullOrEmpty([displayName])`  
Returns True if the attribute is not present or is an empty string in the CS or MV.

----------
### IsNumeric

**Description:**  
The IsNumeric function returns a Boolean value indicating whether an expression can be evaluated as a number type.

**Syntax:**  
`bool IsNumeric(var Expression)`

**Remarks:**  
Used to determine if CNum() will be successful to parse the expression.

----------
### IsString

**Description:**  
The IsString function evaluates to True if the expression can be evaluated to a string type.

**Syntax:**  
`bool IsString(var expression)`

**Remarks:**  
Used to determine if CStr() will be successful to parse the expression.

----------
### IsPresent

**Description:**  
The IsPresent function returns true if the expression evaluates to a string which is not Null and is not empty.

**Syntax:**  
`bool IsPresent(var expression)`

**Remarks:**  
The inverse of this function is named IsNullOrEmpty.

**Example:**  
`Switch(IsPresent([directManager]),[directManager], IsPresent([skiplevelManager]),[skiplevelManager], IsPresent([director]),[director])`

----------
### Item

**Description:**  
The Item function returns one item from a multi-valued string/attribute.

**Syntax:**  
`var Item(mvstr attribute, num index)`

- attribute: multi-valued attribute
- index: index to an item in the multi-valued string.

**Remarks:**  
The Item function is useful together with the Contains function since the latter function will return the index to an item in the multi-valued attribute.

Throws an error if index is out of bounds.

**Example:**  
`Mid(Item([proxyAddress],Contains([proxyAddress], "SMTP:")),6)`  
Returns the primary email address.

----------
### ItemOrNull

**Description:**  
The ItemOrNull function returns one item from a multi-valued string/attribute.

**Syntax:**  
`var ItemOrNull(mvstr attribute, num index)`

- attribute: multi-valued attribute
- index: index to an item in the multi-valued string.

**Remarks:**  
The ItemOrNull function is useful together with the Contains function since the latter function will return the index to an item in the multi-valued attribute.

Returns a Null value if index is out of bounds.

----------
### Join

**Description:**  
The Join function takes a multi-valued string and returns a single-valued string with specified separator inserted between each item.

**Syntax:**  
`str Join(mvstr attribute)`  
`str Join(mvstr attribute, str Delimiter)`

- attribute: Multi-valued attribute containing strings to be joined.
- delimiter: Any string, used to separate the substrings in the returned string. If omitted, the space character (" ") is used. If Delimiter is a zero-length string ("") or Nothing, all items in the list are concatenated with no delimiters.

**Remarks**  
There is parity between the Join and Split functions. The Join function takes an array of strings and joins them using a delimiter string, to return a single string. The Split function takes a string and separates it at the delimiter, to return an array of strings. However, a key difference is that Join can concatenate strings with any delimiter string, Split can only separate strings using a single character delimiter.

**Example:**  
`Join([proxyAddresses],",")`  
Could return: "SMTP:john.doe@contoso.com,smtp:jd@contoso.com"

----------
### LCase

**Description:**  
The LCase function converts all characters in a string to lower case.

**Syntax:**  
`str LCase(str value)`

**Example:**  
`LCase("TeSt")`  
Returns "test".

----------
### Left

**Description:**  
The Left function returns a specified number of characters from the left of a string.

**Syntax:**  
`str Left(str string, num NumChars)`

- string: the string to return characters from
- NumChars: a number identifying the number of characters to return from the beginning (left) of string

**Remarks:**  
A string containing the first numChars characters in string:

- If numChars = 0, return empty string.
- If numChars < 0, return input string.
- If string is null, return empty string.

If string contains fewer characters than the number specified in numChars, a string identical to string (ie. containing all characters in parameter 1) is returned.

**Example:**  
`Left("John Doe", 3)`  
Returns "Joh".

----------
### Len

**Description:**  
The Len function returns number of characters in a string.

**Syntax:**  
`num Len(str value)`

**Example:**  
`Len("John Doe")`  
Returns 8

----------
### LTrim

**Description:**  
The LTrim function removes leading white spaces from a string.

**Syntax:**  
`str LTrim(str value)`

**Example:**  
`LTrim(" Test ")`  
Returns "Test "

----------
### Mid

**Description:**  
The Mid function returns a specified number of characters from a specified position in a string.

**Syntax:**  
`str Mid(str string, num start, num NumChars)`

- string: the string to return characters from
- start: a number identifying the starting position in string to return characters from
- NumChars: a number identifying the number of characters to return from position in string

**Remarks:**  
Return numChars characters starting from position start in string.  
A string containing numChars characters from position start in string:

- If numChars = 0, return empty string.
- If numChars < 0, return input string.
- If start > the length of string, return input string.
- If start <= 0, return input string.
- If string is null, return empty string.

If there are not numChar characters remaining in string from position start, as many characters as can be returned are returned.

**Example:**  
`Mid("John Doe", 3, 5)`  
Returns "hn Do".

`Mid("John Doe", 6, 999)`  
Returns "Doe"

----------
### Now

**Description:**  
The Now function returns a DateTime specifying the current date and time, according your computer's system date and time.

**Syntax:**  
`dt Now()`

----------
### NumFromDate

**Description:**  
The NumFromDate function returns a date in AD’s date format.

**Syntax:**  
`num NumFromDate(dt value)`

**Example:**  
`NumFromDate(CDate("2012-01-01 23:00:00"))`  
Returns 129699324000000000

----------
### PadLeft

**Description:**  
The PadLeft function left-pads a string to a specified length using a provided padding character.

**Syntax:**  
`str PadLeft(str string, num length, str padCharacter)`

- string: the string to pad.
- length: An integer representing the desired length of string.
- padCharacter: A string consisting of a single character to use as the pad character

**Remarks:**

- If the length of string is less than length, then padCharacter is repeatedly appended to the beginning (left) of string until it has a length equal to length.
- PadCharacter can be a space character, but it cannot be a null value.
- If the length of string is equal to or greater than length, string is returned unchanged.
- If string has a length greater than or equal to length, a string identical to string is returned.
- If the length of string is less than length, then a new string of the desired length is returned containing string padded with a padCharacter.
- If string is null, the function returns an empty string.

**Example:**  
`PadLeft("User", 10, "0")`  
Returns "000000User".

----------
### PadRight

**Description:**  
The PadRight function right-pads a string to a specified length using a provided padding character.

**Syntax:**  
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

**Example:**  
`PadRight("User", 10, "0")`  
Returns "User000000".

----------
### PCase

**Description:**  
The PCase function converts the first character of each space delimited word in a string to upper case, and all other characters are converted to lower case.

**Syntax:**  
`String PCase(string)`

**Remarks:**

- This function does not currently provide proper casing to convert a word that is entirely uppercase, such as an acronym.

**Example:**  
`PCase("TEsT")`  
Returns "Test".

`PCase(LCase("TEST"))`  
Returns "Test"

----------
### RandomNum

**Description:**  
The RandomNum function returns a random number between a specified interval.

**Syntax:**  
`num RandomNum(num start, num end)`

- start: a number identifying the lower limit of the random value to generate
- end: a number identifying the upper limit of the random value to generate

**Example:**  
`Random(100,999)`  
Can return 734.

----------
### RemoveDuplicates

**Description:**  
The RemoveDuplicates function takes a multi-valued string and make sure each value is unique.

**Syntax:**  
`mvstr RemoveDuplicates(mvstr attribute)`

**Example:**  
`RemoveDuplicates([proxyAddresses])`  
Returns a sanitized proxyAddress attribute where all duplicate values have been removed.

----------
### Replace

**Description:**  
The Replace function replaces all occurrences of a string to another string.

**Syntax:**  
`str Replace(str string, str OldValue, str NewValue)`

- string: A string to replace values in.
- OldValue: The string to search for and to replace.
- NewValue: The string to replace to.

**Remarks:**  
The function recognizes the following special monikers:

- \n – New Line
- \r – Carriage Return
- \t – Tab

**Example:**  
`Replace([address],"\r\n",", ")`  
Replaces CRLF with a comma and space, and could lead to "One Microsoft Way, Redmond, WA, USA"

----------
### ReplaceChars

**Description:**  
The ReplaceChars function replaces all occurrences of characters found in the ReplacePattern string.

**Syntax:**  
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

**Example:**  
`%ReplaceString% = ’:,Å:A,Ä:A,Ö:O,å:a,ä:a,ö,o`

`ReplaceChars("Räksmörgås",%ReplaceString%)`  
Returns Raksmorgas

`ReplaceChars("O’Neil",%ReplaceString%)`  
Returns "ONeil", the single tick is defined to be removed.

----------
### Right

**Description:**  
The Right function returns a specified number of characters from the right (end) of a string.

**Syntax:**  
`str Right(str string, num NumChars)`

- string: the string to return characters from
- NumChars: a number identifying the number of characters to return from the end (right) of string

**Remarks:**  
NumChars characters are returned from the last position of string.

A string containing the last numChars characters in string:

- If numChars = 0, return empty string.
- If numChars < 0, return input string.
- If string is null, return empty string.

If string contains fewer characters than the number specified in NumChars, a string identical to string is returned.

**Example:**  
`Right("John Doe", 3)`  
Returns "Doe".

----------
### RTrim

**Description:**  
The RTrim function removes trailing white spaces from a string.

**Syntax:**  
`str RTrim(str value)`

**Example:**  
`RTrim(" Test ")`  
Returns " Test".

----------
### Split

**Description:**  
The Split function takes a string separated with a delimiter and makes it a multi-valued string.

**Syntax:**  
`mvstr Split(str value, str delimiter)`  
`mvstr Split(str value, str delimiter, num limit)`

- value: the string with a delimiter character to separate.
- delimiter: single character to be used as the delimiter.
- limit: maximum number of values which will be returned.

**Example:**  
`Split("SMTP:john.doe@contoso.com,smtp:jd@contoso.com",",")`  
Returns a multi-valued string with 2 elements useful for the proxyAddress attribute.

----------
### StringFromGuid

**Description:**  
The StringFromGuid function takes a binary GUID and converts it to a string

**Syntax:**  
`str StringFromGuid(bin GUID)`

----------
### StringFromSid

**Description:**  
The StringFromSid function converts a byte array or a multi-valued byte array containing a security identifier to a string or multi-valued string.

**Syntax:**  
`str StringFromSid(bin ObjectSID)`  
`mvstr StringFromSid(mvbin ObjectSID)`

----------
### Switch

**Description:**  
The Switch function is used to return a single value based on evaluated conditions.

**Syntax:**  
`var Switch(exp expr1, var value1[, exp expr2, var value … [, exp expr, var valueN]])`

- expr: Variant expression you want to evaluate.
- value: Value to be returned if the corresponding expression is True.

**Remarks:**  
The Switch function argument list consists of pairs of expressions and values. The expressions are evaluated from left to right, and the value associated with the first expression to evaluate to True is returned. If the parts aren't properly paired, a run-time error occurs.

For example, if expr1 is True, Switch returns value1. If expr-1 is False, but expr-2 is True, Switch returns value-2, and so on.

Switch returns a Nothing if:

- None of the expressions are True.
- The first True expression has a corresponding value that is Null.

Switch evaluates all of the expressions, even though it returns only one of them. For this reason, you should watch for undesirable side effects. For example, if the evaluation of any expression results in a division by zero error, an error occurs.

Value can also be the Error function which would return a custom string.

**Example:**  
`Switch([city] = "London", "English", [city] = "Rome", "Italian", [city] = "Paris", "French", True, Error("Unknown city"))`  
Returns the language spoken in some major cities, otherwise returns an Error.

----------
### Trim

**Description:**  
The Trim function removes leading and trailing white spaces from a string.

**Syntax:**  
`str Trim(str value)`  
`mvstr Trim(mvstr value)`

**Example:**  
`Trim(" Test ")`  
Returns "Test".

`Trim([proxyAddresses])`  
Removes leading and trailing spaces for each value in the proxyAddress attribute.

----------
### UCase

**Description:**  
The UCase function converts all characters in a string to upper case.

**Syntax:**  
`str UCase(str string)`

**Example:**  
`UCase("TeSt")`  
Returns "TEST".

----------
### Word

**Description:**  
The Word function returns a word contained within a string, based on parameters describing the delimiters to use and the word number to return.

**Syntax:**  
`str Word(str string, num WordNumber, str delimiters)`

- string: the string to return a word from.
- WordNumber: a number identifying which word number should be returned.
- delimiters: a string representing the delimiter(s) that should be used to identify words

**Remarks:**  
Each string of characters in string separated by the one of the characters in delimiters are identified as words:

- If number < 1, returns empty string.
- If string is null, returns empty string.

If string contains less than number words, or string does not contain any words identified by delimeters, an empty string is returned.

**Example:**  
`Word("The quick brown fox",3," ")`  
Returns "brown"

`Word("This,string!has&many separators",3,",!&#")`  
Would return "has"

## Additional Resources

* [Understanding Declarative Provisioning Expressions](active-directory-aadconnectsync-understanding-declarative-provisioning-expressions.md)
* [Azure AD Connect Sync: Customizing Synchronization options](active-directory-aadconnectsync-whatis.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
