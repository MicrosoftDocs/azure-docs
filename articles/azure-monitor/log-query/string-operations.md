---
title: Work with strings in Azure Monitor log queries | Microsoft Docs
description: Describes how to edit, compare, search in and perform a variety of other operations on strings in Azure Monitor log queries.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 08/16/2018

---

# Work with strings in Azure Monitor log queries


> [!NOTE]
> You should complete [Get started with Azure Monitor Log Analytics](get-started-portal.md) and [Getting started with Azure Monitor log queries](get-started-queries.md) before completing this tutorial.

[!INCLUDE [log-analytics-demo-environment](../../../includes/log-analytics-demo-environment.md)]

This article describes how to edit, compare, search in and perform a variety of other operations on strings.

Each character in a string has an index number, according to its location. The first character is at index 0, the next character is 1, and so on. Different string functions use index numbers as shown in the following sections. Many of the following examples use the **print** command for to demonstrate string manipulation without using a specific data source.


## Strings and escaping them
String values are wrapped with either with single or double quote characters. Backslash (\\) is used to escape characters to the character following it, such as \t for tab, \n for newline, and \" the quote character itself.

```Kusto
print "this is a 'string' literal in double \" quotes"
```

```Kusto
print 'this is a "string" literal in single \' quotes'
```

To prevent "\\" from acting as an escape character, add "\@" as a prefix to the string:

```Kusto
print @"C:\backslash\not\escaped\with @ prefix"
```


## String comparisons

Operator       |Description                         |Case-Sensitive|Example (yields `true`)
---------------|------------------------------------|--------------|-----------------------
`==`           |Equals                              |Yes           |`"aBc" == "aBc"`
`!=`           |Not equals                          |Yes           |`"abc" != "ABC"`
`=~`           |Equals                              |No            |`"abc" =~ "ABC"`
`!~`           |Not equals                          |No            |`"aBc" !~ "xyz"`
`has`          |Right-hand-side is a whole term in left-hand-side |No|`"North America" has "america"`
`!has`         |Right-hand-side isn't a full term in left-hand-side       |No            |`"North America" !has "amer"` 
`has_cs`       |Right-hand-side is a whole term in left-hand-side |Yes|`"North America" has_cs "America"`
`!has_cs`      |Right-hand-side isn't a full term in left-hand-side       |Yes            |`"North America" !has_cs "amer"` 
`hasprefix`    |Right-hand-side is a term prefix in left-hand-side         |No            |`"North America" hasprefix "ame"`
`!hasprefix`   |Right-hand-side isn't a term prefix in left-hand-side     |No            |`"North America" !hasprefix "mer"` 
`hasprefix_cs`    |Right-hand-side is a term prefix in left-hand-side         |Yes            |`"North America" hasprefix_cs "Ame"`
`!hasprefix_cs`   |Right-hand-side isn't a term prefix in left-hand-side     |Yes            |`"North America" !hasprefix_cs "CA"` 
`hassuffix`    |Right-hand-side is a term suffix in left-hand-side         |No            |`"North America" hassuffix "ica"`
`!hassuffix`   |Right-hand-side isn't a term suffix in left-hand-side     |No            |`"North America" !hassuffix "americ"`
`hassuffix_cs`    |Right-hand-side is a term suffix in left-hand-side         |Yes            |`"North America" hassuffix_cs "ica"`
`!hassuffix_cs`   |Right-hand-side isn't a term suffix in left-hand-side     |Yes            |`"North America" !hassuffix_cs "icA"`
`contains`     |Right-hand-side occurs as a subsequence of left-hand-side  |No            |`"FabriKam" contains "BRik"`
`!contains`    |Right-hand-side doesn't occur in left-hand-side           |No            |`"Fabrikam" !contains "xyz"`
`contains_cs`   |Right-hand-side occurs as a subsequence of left-hand-side  |Yes           |`"FabriKam" contains_cs "Kam"`
`!contains_cs`  |Right-hand-side doesn't occur in left-hand-side           |Yes           |`"Fabrikam" !contains_cs "Kam"`
`startswith`   |Right-hand-side is an initial subsequence of left-hand-side|No            |`"Fabrikam" startswith "fab"`
`!startswith`  |Right-hand-side isn't an initial subsequence of left-hand-side|No        |`"Fabrikam" !startswith "kam"`
`startswith_cs`   |Right-hand-side is an initial subsequence of left-hand-side|Yes            |`"Fabrikam" startswith_cs "Fab"`
`!startswith_cs`  |Right-hand-side isn't an initial subsequence of left-hand-side|Yes        |`"Fabrikam" !startswith_cs "fab"`
`endswith`     |Right-hand-side is a closing subsequence of left-hand-side|No             |`"Fabrikam" endswith "Kam"`
`!endswith`    |Right-hand-side isn't a closing subsequence of left-hand-side|No         |`"Fabrikam" !endswith "brik"`
`endswith_cs`     |Right-hand-side is a closing subsequence of left-hand-side|Yes             |`"Fabrikam" endswith "Kam"`
`!endswith_cs`    |Right-hand-side isn't a closing subsequence of left-hand-side|Yes         |`"Fabrikam" !endswith "brik"`
`matches regex`|left-hand-side contains a match for Right-hand-side        |Yes           |`"Fabrikam" matches regex "b.*k"`
`in`           |Equals to one of the elements       |Yes           |`"abc" in ("123", "345", "abc")`
`!in`          |Not equals to any of the elements   |Yes           |`"bca" !in ("123", "345", "abc")`


## countof

Counts occurrences of a substring in a string. Can match plain strings or use regex. Plain string matches may overlap while regex matches do not.

### Syntax
```
countof(text, search [, kind])
```

### Arguments:
- `text` - The input string 
- `search` - Plain string or regular expression to match inside text.
- `kind` - _normal_ | _regex_ (default: normal).

### Returns

The number of times that the search string can be matched in the container. Plain string matches may overlap while regex matches do not.

### Examples

#### Plain string matches

```Kusto
print countof("The cat sat on the mat", "at");  //result: 3
print countof("aaa", "a");  //result: 3
print countof("aaaa", "aa");  //result: 3 (not 2!)
print countof("ababa", "ab", "normal");  //result: 2
print countof("ababa", "aba");  //result: 2
```

#### Regex matches

```Kusto
print countof("The cat sat on the mat", @"\b.at\b", "regex");  //result: 3
print countof("ababa", "aba", "regex");  //result: 1
print countof("abcabc", "a.c", "regex");  // result: 2
```


## extract

Gets a match for a regular expression from a given string. Optionally also converts the extracted substring to the specified type.

### Syntax

```Kusto
extract(regex, captureGroup, text [, typeLiteral])
```

### Arguments

- `regex` - A regular expression.
- `captureGroup` - A positive integer constant indicating the capture group to extract. 0 for the entire match, 1 for the value matched by the first '('parenthesis')' in the regular expression, 2 or more for subsequent parentheses.
- `text` - A string to search.
- `typeLiteral` - An optional type literal (for example, typeof(long)). If provided, the extracted substring is converted to this type.

### Returns
The substring matched against the indicated capture group captureGroup, optionally converted to typeLiteral.
If there's no match, or the type conversion fails, return null.

### Examples

The following example extracts the last octet of *ComputerIP* from a heartbeat record:
```Kusto
Heartbeat
| where ComputerIP != "" 
| take 1
| project ComputerIP, last_octet=extract("([0-9]*$)", 1, ComputerIP) 
```

The following example extracts the last octet, casts it to a *real* type (number) and calculates the next IP value
```Kusto
Heartbeat
| where ComputerIP != "" 
| take 1
| extend last_octet=extract("([0-9]*$)", 1, ComputerIP, typeof(real)) 
| extend next_ip=(last_octet+1)%255
| project ComputerIP, last_octet, next_ip
```

In the example below, the string *Trace* is searched for a definition of "Duration". The match is cast to *real* and multiplied by a time constant (1 s) *which casts Duration to type timespan*.
```Kusto
let Trace="A=12, B=34, Duration=567, ...";
print Duration = extract("Duration=([0-9.]+)", 1, Trace, typeof(real));  //result: 567
print Duration_seconds =  extract("Duration=([0-9.]+)", 1, Trace, typeof(real)) * time(1s);  //result: 00:09:27
```


## isempty, isnotempty, notempty

- *isempty* returns true if the argument is an empty string or null (see also *isnull*).
- *isnotempty* returns true if the argument isn't an empty string or a null (see also *isnotnull*). alias: *notempty*.

### Syntax

```Kusto
isempty(value)
isnotempty(value)
```

### Examples

```Kusto
print isempty("");  // result: true

print isempty("0");  // result: false

print isempty(0);  // result: false

print isempty(5);  // result: false

Heartbeat | where isnotempty(ComputerIP) | take 1  // return 1 Heartbeat record in which ComputerIP isn't empty
```


## parseurl

Splits a URL into its parts (protocol, host, port, etc.), and returns a dictionary object containing the parts as strings.

### Syntax

```
parseurl(urlstring)
```

### Examples

```Kusto
print parseurl("http://user:pass@contoso.com/icecream/buy.aspx?a=1&b=2#tag")
```

The outcome will be:
```
{
	"Scheme" : "http",
	"Host" : "contoso.com",
	"Port" : "80",
	"Path" : "/icecream/buy.aspx",
	"Username" : "user",
	"Password" : "pass",
	"Query Parameters" : {"a":"1","b":"2"},
	"Fragment" : "tag"
}
```


## replace

Replaces all regex matches with another string. 

### Syntax

```
replace(regex, rewrite, input_text)
```

### Arguments

- `regex` - The regular expression to match by. It can contain capture groups in '('parentheses')'.
- `rewrite` - The replacement regex for any match made by matching regex. Use \0 to refer to the whole match, \1 for the first capture group, \2, and so on for subsequent capture groups.
- `input_text` - The input string to search in.

### Returns
The text after replacing all matches of regex with evaluations of rewrite. Matches don't overlap.

### Examples

```Kusto
SecurityEvent
| take 1
| project Activity 
| extend replaced = replace(@"(\d+) -", @"Activity ID \1: ", Activity) 
```

Can have the following results:

Activity                                        |replaced
------------------------------------------------|----------------------------------------------------------
4663 - An attempt was made to access an object  |Activity ID 4663: An attempt was made to access an object.


## split

Splits a given string according to a specified delimiter, and returns an array of the resulting substrings.

### Syntax
```
split(source, delimiter [, requestedIndex])
```

### Arguments:

- `source` - The string to be split according to the specified delimiter.
- `delimiter` - The delimiter that will be used in order to split the source string.
- `requestedIndex` - An optional zero-based index. If provided, the returned string array will hold only that item (if exists).


### Examples

```Kusto
print split("aaa_bbb_ccc", "_");    // result: ["aaa","bbb","ccc"]
print split("aa_bb", "_");          // result: ["aa","bb"]
print split("aaa_bbb_ccc", "_", 1);	// result: ["bbb"]
print split("", "_");              	// result: [""]
print split("a__b", "_");           // result: ["a","","b"]
print split("aabbcc", "bb");        // result: ["aa","cc"]
```

## strcat

Concatenates string arguments (supports 1-16 arguments).

### Syntax
```
strcat("string1", "string2", "string3")
```

### Examples
```Kusto
print strcat("hello", " ", "world")	// result: "hello world"
```


## strlen

Returns the length of a string.

### Syntax
```
strlen("text_to_evaluate")
```

### Examples
```Kusto
print strlen("hello")	// result: 5
```


## substring

Extracts a substring from a given source string, starting at the specified index. Optionally, the length of the requested substring can be specified.

### Syntax
```
substring(source, startingIndex [, length])
```

### Arguments:

- `source` - The source string that the substring will be taken from.
- `startingIndex` - The zero-based starting character position of the requested substring.
- `length` - An optional parameter that can be used to specify the requested length of the returned substring.

### Examples
```Kusto
print substring("abcdefg", 1, 2);	// result: "bc"
print substring("123456", 1);		// result: "23456"
print substring("123456", 2, 2);	// result: "34"
print substring("ABCD", 0, 2);	// result: "AB"
```


## tolower, toupper

Converts a given string to all lower or upper case.

### Syntax
```
tolower("value")
toupper("value")
```

### Examples
```Kusto
print tolower("HELLO");	// result: "hello"
print toupper("hello");	// result: "HELLO"
```



## Next steps
Continue with the advanced tutorials:
* [Aggregation functions](aggregations.md)
* [Advanced aggregations](advanced-aggregations.md)
* [Charts and diagrams](charts.md)
* [Working with JSON and data structures](json-data-structures.md)
* [Advanced query writing](advanced-query-writing.md)
* [Joins - cross analysis](joins.md)
