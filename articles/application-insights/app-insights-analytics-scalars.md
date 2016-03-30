<properties 
	pageTitle="Scalar expressions in Analytics in Application Insights" 
	description="Numbers, strings, dynamic expressions and types in Analytics, 
	             the powerful search tool of Application Insights." 
	services="application-insights" 
    documentationCenter=""
	authors="alancameronwills" 
	manager="douge"/>

<tags 
	ms.service="application-insights" 
	ms.workload="tbd" 
	ms.tgt_pltfrm="ibiza" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="03/30/2016" 
	ms.author="awills"/>

 
# Scalar expressions in Analytics


[Analytics](app-insights-analytics.md) is the powerful search feature of 
[Application Insights](app-insights-overview.md). These pages describe the
 Analytics query lanquage.

[AZURE.INCLUDE [app-insights-analytics-top-index](../../includes/app-insights-analytics-top-index.md)]

---

[ago](#ago) | [arraylength](#arraylength) | [bin](#bin) [countof](#countof) | [dayofweek](#dayofweek) | [extract](#extract) | [extractjson](#extractjson) | [floor](#floor) 
<br/>[getmonth](#getmonth) | [gettype](#gettype) [getyear](#getyear) | [hash](#hash) | [iff](#iff) | [isempty](#isempty) | [isnotempty](#isnotempty) | [isnull](#isnull) | [isnotnull](#isnotnull)
<br/> [now](#now) | [notempty](#notempty) | [notnull](#notnull) | [parsejson](#parsejson)| [rand](#rand) | [range](#range) | [replace](#replace) 
| [itemCount](#itemCount) | [split](#split) | [sqrt](#sqrt) 
<br/>[startofmonth](#startofmonth) | [startofyear](#startofyear) | [strcat](#strcat) | [strlen](#strlen) | [substring](#substring) 
| [tolower](#tolower) | [toupper](#toupper) | [treepath](#treepath)

---



"Scalar" means values like numbers or strings that can occupy a single cell in a table. Scalar expressions are built from scalar functions and operators and evaluate to scalar values. `sqrt(score)/100 > target+2` is a scalar expression.

"Scalar" also includes arrays and composite objects, which can also be stored in a single database cell.

Scalar expressions are distinct from [queries](app-insights-analytics-queries.md), whose results are tables.

## Scalars

[casts](#casts) | [comparisons](#scalar-comparisons)
<br/>
[gettype](#gettype) | [hash](#hash) | [iff](#iff)|  [isnull](#isnull) | [isnotnull](#isnotnull) | [notnull](#notnull)

The supported types are:

| Type      | Additional name(s)   | Equivalent .NET type |
| --------- | -------------------- | -------------------- |
| `bool`    | `boolean`            | `System.Boolean`     |
| `datetime`| `date`               | `System.DateTime`    |
| `dynamic` |                      | `System.Object`      |
| `guid`    | `uuid`, `uniqueid`   | `System.Guid`        |
| `int`     |                      | `System.Int32`       |
| `long`    |                      | `System.Int64`       |
| `double`  | `real`               | `System.Double`      |
| `string`  |                      | `System.String`      |
| `timespan`| `time`               | `System.TimeSpan`    |

### Casts

You can cast from one type to another. In general, if the conversion makes sense, it will work:

    todouble(10), todouble("10.6")
    toint(10.6) == 11
    floor(10.6) == 10
	toint("200")
    todatetime("2016-04-28 13:02")
    totimespan("1.5d"), totimespan("1.12:00:00")
    toguid("00000000-0000-0000-0000-000000000000")
    tostring(42.5)
    todynamic("{a:10, b:20}")

### Scalar comparisons

||
---|---
`<` |Less
`<=`|Less or Equals
`>` |Greater
`>=`|Greater or Equals
`<>`|Not Equals
`!=`|Not Equals 
`in`| Right operand is a (dynamic) array and left operand is equal to one of its elements.
`!in`| Right operand is a (dynamic) array and left operand is not equal to any of its elements.




### gettype

**Returns**

A string representing the underlying storage type of its single argument. This is particularly useful when have values of kind `dynamic`: in this case `gettype()` will reveal how a value is encoded.

**Examples**

|||
---|---
`gettype("a")` |`"string" `
`gettype(111)` |`"long" `
`gettype(1==1)` |`"int8" (*) `
`gettype(now())` |`"datetime" `
`gettype(1s)` |`"timespan" `
`gettype(parsejson('1'))` |`"int" `
`gettype(parsejson(' "abc" '))` |`"string" `
`gettype(parsejson(' {"abc":1} '))` |`"dictionary"` 
`gettype(parsejson(' [1, 2, 3] '))` |`"array"` 
`gettype(123.45)` |`"real" `
`gettype(guid(12e8b78d-55b4-46ae-b068-26d7a0080254))` |`"guid"` 
`gettype(parsejson(''))` |`"null"`



### hash

**Syntax**

    hash(source [, mod])

**Arguments**

* *source*: The source scalar the hash is calculated on.
* *mod*: The modulo value to be applied on the hash result.

**Returns**

The xxhash (long)value of the given scalar, modulo the given mod value (if specified).

**Examples**

```
hash("World")                   // 1846988464401551951
hash("World", 100)              // 51 (1846988464401551951 % 100)
hash(datetime("2015-01-01"))    // 1380966698541616202
```
### iff

The `iff()` function evaluates the first argument (the predicate), and returns either
the value of either the second or third arguments depending on whether the predicate
is `true` or `false`. The second and third arguments must be of the same type.

**Syntax**

    iff(predicate, ifTrue, ifFalse)


**Arguments**

* *predicate:* An expression that evaluates to a `boolean` value.
* *ifTrue:* An expression that gets evaluated and its value returned from the function if *predicate* evaluates to `true`.
* *ifFalse:* An expression that gets evaluated and its value returned from the function if *predicate* evaluates to `false`.

**Returns**

This function returns the value of *ifTrue* if *predicate* evaluates to `true`,
or the value of *ifFalse* otherwise.

**Example**

```
iff(floor(timestamp, 1d)==floor(now(), 1d), "today", "anotherday")
```

<a name="isnull"/></a>
<a name="isnotnull"/></a>
<a name="notnull"/></a>
### isnull, isnotnull, notnull

    isnull(parsejson("")) == true

Takes a single argument and tells whether it is null.

**Syntax**


    isnull([value])


    isnotnull([value])


    notnull([value])  // alias for isnotnull

**Returns**

True or false depending on the whether the value is null or not null.


|x|isnull(x)
|---|---
| "" | false
|"x" | false
|parsejson("")|true
|parsejson("[]")|false
|parsejson("{}")|false

**Example**

    T | where isnotnull(PossiblyNull) | count

Notice that there are other ways of achieving this effect:

    T | summarize count(PossiblyNull)




## Boolean 

### Boolean Literals

	true == 1
    false == 0
    gettype(true) == "int8"
    typeof(bool) == typeof(int8)

### Boolean operators

	and 
    or 

    

## Numbers

[bin](#bin) | [floor](#floor) | [rand](#rand) | [range](#range) | [sqrt](#sqrt) 
| [todouble](#todouble) | [toint](#toint) | [tolong](#tolong)

### Numeric literals

|||
|---|---
|`42`|`long`
|`42.0`|`real`

### Arithmetic operators

|| |
|---|-------------|
| + | Add         |
| - | Subtract    |
| * | Multiply    |
| / | Divide      |
| % | Modulo      |
||
|`<` |Less
|`<=`|Less or Equals
|`>` |Greater
|`>=`|Greater or Equals
|`<>`|Not Equals
|`!=`|Not Equals 




### bin

Rounds values down to an integer multiple of a given bin size. Used a lot in the [`summarize by`](app-insights-analytics-queries.md#summarize-operator) query. If you have a scattered set of values, they will be grouped into a smaller set of specific values.

Alias `floor`.

**Syntax**

     bin(value, roundTo)

**Arguments**

* *value:* A number, date, or timespan. 
* *roundTo:* The "bin size". A number, date or timespan that divides *value*. 

**Returns**

The nearest multiple of *roundTo* below *value*.  
 
    (toint((value/roundTo)-0.5)) * roundTo

**Examples**

Expression | Result
---|---
`bin(4.5, 1)` | `4.0`
`bin(time(16d), 7d)` | `14d`
`bin(datetime(1953-04-15 22:25:07), 1d)`|  `datetime(1953-04-15)`


The following expression calculates a histogram of durations,
with a bucket size of 1 second:

```AIQL

    T | summarize Hits=count() by bin(Duration, 1s)
```

### floor

An alias for [`bin()`](#bin).


### rand

A random number generator.

* `rand()` - a real number between 0.0 and 1.0
* `rand(n)` - an integer between 0 and n-1




### sqrt

The square root function.  

**Syntax**

    sqrt(x)

**Arguments**

* *x:* A real number >= 0.

**Returns**

* A positive number such that `sqrt(x) * sqrt(x) == x`
* `null` if the argument is negative or cannot be converted to a `real` value. 




### toint

    toint(100)        // cast from long
    toint(20.7) == 21 // nearest int from double
    toint(20.4) == 20 // nearest int from double
    toint("  123  ")  // parse string
    toint(a[0])       // cast from dynamic
    toint(b.c)        // cast from dynamic

### tolong

    tolong(20.7) == 21 // conversion from double
    tolong(20.4) == 20 // conversion from double
    tolong("  123  ")  // parse string
    tolong(a[0])       // cast from dynamic
    tolong(b.c)        // cast from dynamic


### todouble

    todouble(20) == 20.0 // conversion from long or int
    todouble(" 12.34 ")  // parse string
    todouble(a[0])       // cast from dynamic
    todouble(b.c)        // cast from dynamic



## Date and time


[ago](#ago) | [dayofweek](#dayofweek) | [getmonth](#getmonth)|  [getyear](#getyear) | [now](#now) | [startofmonth](#startofmonth) | [startofyear](#startofyear) | [todatetime](#todatetime) | [totimespan](#totimespan)

### Date and time literals

|||
---|---
**datetime**|
`datetime("2015-12-31 23:59:59.9")`<br/>`datetime("2015-12-31")`|Times are always in UTC. Omitting the date gives a time today.
`now()`|The current time.
`now(`-*timespan*`)`|`now()-`*timespan*
`ago(`*timespan*`)`|`now()-`*timespan*
**timespan**|
`2d`|2 days
`1.5h`|1.5 hour 
`30m`|30 minutes
`10s`|10 seconds
`0.1s`|0.1 second
`100ms`| 100 millisecond
`10microsecond`|
`1tick`|100ns
`time("15 seconds")`|
`time("2")`| 2 days
`time("0.12:34:56.7")`|`0d+12h+34m+56.7s`

### Date and time expressions

Expression |Result
---|---
`datetime("2015-01-02") - datetime("2015-01-01")`| `1d`
`datetime("2015-01-01") + 1d`| `datetime("2015-01-02")`
`datetime("2015-01-01") - 1d`| `datetime("2014-12-31")`
`2h * 24` | `2d`
`2d` / `2h` | `24`
`datetime("2015-04-15T22:33") % 1d` | `timespan("22:33")`
`bin(datetime("2015-04-15T22:33"), 1d)` | `datetime("2015-04-15T00:00")`
||
`<` |Less
`<=`|Less or Equals
`>` |Greater
`>=`|Greater or Equals
`<>`|Not Equals
`!=`|Not Equals 




### ago

Subtracts the given timespan from the current
UTC clock time. Like `now()`, this function can be used multiple times
in a statement and the UTC clock time being referenced will be the same
for all instantiations.

**Syntax**

    ago(a_timespan)

**Arguments**

* *a_timespan*: Interval to subtract from the current UTC clock time
(`now()`).

**Returns**

    now() - a_timespan

**Example**

All rows with a timestamp in the past hour:

```AIQL

    T | where timestamp > ago(1h)
```



### dayofweek

    dayofweek(datetime("2015-12-14")) == 1d  // Monday

The integer number of days since the preceding Sunday, as a `timespan`.

**Syntax**

    dayofweek(a_date)

**Arguments**

* `a_date`: A `datetime`.

**Returns**

The `timespan` since midnight at the beginning of the preceding Sunday, rounded down to an integer number of days.

**Examples**

```AIQL
dayofweek(1947-11-29 10:00:05)  // time(6.00:00:00), indicating Saturday
dayofweek(1970-05-11)           // time(1.00:00:00), indicating Monday
```

### getmonth

Get the month number (1-12) from a datetime.

**Example**

    ... | extend month = getmonth(datetime(2015-10-12))

    --> month == 10

### getyear

Get the year from a datetime.

**Example**

    ... | extend year = getyear(datetime(2015-10-12))

    --> year == 2015

### now

    now()
    now(-2d)

The current UTC clock time, optionally offset by a given timespan. This function can be used multiple times in a statement and the clock time being referenced will be the same for all instances.

**Syntax**

    now([offset])

**Arguments**

* *offset:* A `timespan`, added to the current UTC clock time. Default: 0.

**Returns**

The current UTC clock time as a `datetime`.

    now() + offset

**Example**

Determines the interval since the event identified by the predicate:

```AIQL
T | where ... | extend Elapsed=now() - timestamp
```

### startofmonth

    startofmonth(date)

The start of the month containing the date.

### startofyear

    startofyear(date)

The start of the year containing the date.


### todatetime

Alias `datetime()`.

     todatetime("2016-03-28")
     todatetime("03/28/2016")
     todatetime("2016-03-28 14:34")
     todatetime("03/28/2016 2:34pm")
     todatetime("2016-03-28T14:34.5Z")
     todatetime(a[0])  // cast a dynamic type
     todatetime(b.c)   // cast a dynamic type

### totimespan

Alias `timespan()`.

    totimespan("21d")
    totimespan("21h")
    totimespan(request.duration)


## String

[countof](#countof) | [extract](#extract) | [extractjson](#extractjson)  | [isempty](#isempty) | [isnotempty](#isnotempty) | [notempty](#notempty) | [replace](#replace) | [split](#split) | [strcat](#strcat) | [strlen](#strlen) | [substring](#substring) | [tolower](#tolower) | [tostring](#tostring) | [toupper](#toupper)


### String Literals

The rules are the same as in JavaScript.

Strings may be enclosed either in single or double quote characters. 

Backslash (`\`) is used to escape characters such as `\t` (tab), `\n` (newline) and instances of the enclosing quote character.

* `'this is a "string" literal in single \' quotes'`
* `"this is a 'string' literal in double \" quotes"`
* `@"C:\backslash\not\escaped\with @ prefix"`

### Obfuscated String Literals

Obfuscated string literals are strings that Analytics will obscure when outputting the string (for example, when tracing). The obfuscation process replaces all obfuscated characters by a start (`*`) character.

To form an obfuscated string literal, prepend `h` or 'H'. For example:

```
h'hello'
h@'world' 
h"hello"
```

### String comparisons

Operator|Description|Case-Sensitive|True example
---|---|---|---
`==`|Equals |Yes| `"aBc" == "aBc"`
`<>`|Not equals|Yes| `"abc" <> "ABC"`
`=~`|Equals |No| `"abc" =~ "ABC"`
`!~`|Not equals |No| `"aBc" !~ "xyz"`
`has`|Right-hand-side (RHS) is a whole term in left-hand-side (LHS)|No| `"North America" has "america"`
`!has`|RHS is not a full term in LHS|No|`"North America" !has "amer"` 
`contains` | RHS occurs as a subsequence of LHS|No| `"FabriKam" contains "BRik"`
`!contains`| RHS does not occur in LHS|No| `"Fabrikam" !contains "xyz"`
`containscs` | RHS occurs as a subsequence of LHS|Yes| `"FabriKam" contains "Kam"`
`!containscs`| RHS does not occur in LHS|Yes| `"Fabrikam" !contains "Kam"`
`startswith`|RHS is an initial subsequence of LHS.|No|`"Fabrikam" startswith "fab"`
`matches regex`|LHS contains a match for RHS|Yes| `"Fabrikam" matches regex "b.*k"`


Use `has` or `in` if you're testing for the presence of a whole lexical term - that is, a symbol or an alphanumeric word bounded by non-alphanumeric characters or start or end of field. `has` performs faster than `contains` or `startswith`. The first of these queries runs faster:

    EventLog | where continent has "North" | count;
	EventLog | where continent contains "nor" | count





### countof

    countof("The cat sat on the mat", "at") == 3
    countof("The cat sat on the mat", @"\b.at\b", "regex") == 3

Counts occurrences of a substring in a string. Plain string matches may overlap; regex matches do not.

**Syntax**

    countof(text, search [, kind])

**Arguments**

* *text:* A string.
* *search:* The plain string or [regular expression](app-insights-analytics-reference.md#regular-expressions) to match inside *text*.
* *kind:* `"normal"|"regex"` Default `normal`. 

**Returns**

The number of times that the search string can be matched in the container. Plain string matches may overlap; regex matches do not.

**Examples**

|||
|---|---
|`countof("aaa", "a")`| 3 
|`countof("aaaa", "aa")`| 3 (not 2!)
|`countof("ababa", "ab", "normal")`| 2
|`countof("ababa", "aba")`| 2
|`countof("ababa", "aba", "regex")`| 1
|`countof("abcabc", "a.c", "regex")`| 2
    



### extract

    extract("x=([0-9.]+)", 1, "hello x=45.6|wo") == "45.6"

Get a match for a [regular expression](app-insights-analytics-reference.md#regular-expressions) from a text string. Optionally, it then converts the extracted substring to the indicated type.

**Syntax**

    extract(regex, captureGroup, text [, typeLiteral])

**Arguments**

* *regex:* A [regular expression](app-insights-analytics-reference.md#regular-expressions).
* *captureGroup:* A positive `int` constant indicating the
capture group to extract. 0 stands for the entire match, 1 for the value matched by the first '('parenthesis')' in the regular expression, 2 or more for subsequent parentheses.
* *text:* A `string` to search.
* *typeLiteral:* An optional type literal (e.g., `typeof(long)`). If provided, the extracted substring is converted to this type. 

**Returns**

If *regex* finds a match in *text*: the substring matched against the indicated capture group *captureGroup*, optionally converted to *typeLiteral*.

If there's no match, or the type conversion fails: `null`. 

**Examples**

The example string `Trace` is searched for a definition for `Duration`. 
The match is converted to `real`, then multiplied it by a time constant (`1s`) so that `Duration` is of type `timespan`. In this example, it is equal to 123.45 seconds:

```AIQL
...
| extend Trace="A=1, B=2, Duration=123.45, ..."
| extend Duration = extract("Duration=([0-9.]+)", 1, Trace, typeof(real)) * time(1s) 
```

This example is equivalent to `substring(Text, 2, 4)`:

```AIQL
extract("^.{2,2}(.{4,4})", 1, Text)
```

<a name="notempty"></a>
<a name="isnotempty"></a>
<a name="isempty"></a>
### isempty, isnotempty, notempty

    isempty("") == true

True if the argument is an empty string or is null.
See also [isnull](#isnull).


**Syntax**

    isempty([value])


    isnotempty([value])


    notempty([value]) // alias of isnotempty

**Returns**

Indicates whether the argument is an empty string or isnull.

|x|isempty(x)
|---|---
| "" | true
|"x" | false
|parsejson("")|true
|parsejson("[]")|false
|parsejson("{}")|false


**Example**


    T | where isempty(fieldName) | count




### replace

Replace all regex matches with another string.

**Syntax**

    replace(regex, rewrite, text)

**Arguments**

* *regex:* The [regular expression](https://github.com/google/re2/wiki/Syntax) to search *text*. It can contain capture groups in '('parentheses')'. 
* *rewrite:* The replacement regex for any match made by *matchingRegex*. Use `\0` to refer to the whole match, `\1` for the first capture group, `\2` and so on for subsequent capture groups.
* *text:* A string.

**Returns**

*text* after replacing all matches of *regex* with evaluations of *rewrite*. Matches do not overlap.

**Example**

This statement:

```AIQL
range x from 1 to 5 step 1
| extend str=strcat('Number is ', tostring(x))
| extend replaced=replace(@'is (\d+)', @'was: \1', str)
```

Has the following results:

| x    | str | replaced|
|---|---|---|
| 1    | Number is 1.000000  | Number was: 1.000000|
| 2    | Number is 2.000000  | Number was: 2.000000|
| 3    | Number is 3.000000  | Number was: 3.000000|
| 4    | Number is 4.000000  | Number was: 4.000000|
| 5    | Number is 5.000000  | Number was: 5.000000|
 



### split

    split("aaa_bbb_ccc", "_") == ["aaa","bbb","ccc"]

Splits a given string according to a given delimiter and returns a string array with the conatined substrings. Optionally, a specific substring can be returned if exists.

**Syntax**

    split(source, delimiter [, requestedIndex])

**Arguments**

* *source*: The source string that will be splitted according to the given delimiter.
* *delimiter*: The delimiter that will be used in order to split the source string.
* *requestedIndex*: An optional zero-based index `int`. If provided, the returned string array will contain the requested substring if exists. 

**Returns**

A string array that contains the substrings of the given source string that are delimited by the given delimiter.

**Examples**

```
split("aa_bb", "_")           // ["aa","bb"]
split("aaa_bbb_ccc", "_", 1)  // ["bbb"]
split("", "_")                // [""]
split("a__b")                 // ["a","","b"]
split("aabbcc", "bb")         // ["aa","cc"]
```




### strcat

    strcat("hello", " ", "world")

Concatenates between 1 and 16 arguments, which must be strings.

### strlen

    strlen("hello") == 5

Length of a string.

### substring

    substring("abcdefg", 1, 2) == "bc"

Extract a substring from a given source string starting from a given index. Optionally, the length of the requested substring can be specified.

**Syntax**

    substring(source, startingIndex [, length])

**Arguments**

* *source:* The source string that the substring will be taken from.
* *startingIndex:* The zero-based starting character position of the requested substring.
* *length:* An optional parameter that can be used to specify the requested number of characters in the substring. 

**Returns**

A substring from the given string. The substring starts at startingIndex (zero-based) character position and continues to the end of the string or length characters if specified.

**Examples**

```
substring("123456", 1)        // 23456
substring("123456", 2, 2)     // 34
substring("ABCD", 0, 2)       // AB
```

### tolower

    tolower("HELLO") == "hello"

Converts a string to lower case.

### toupper

    toupper("hello") == "HELLO"

Converts a string to upper case.



## GUIDs

    guid(00000000-1111-2222-3333-055567f333de)


## Arrays and objects - dynamic types

[literals](#dynamic-literals) | [casting](#casting-dynamic-objects) | [operators](#operators) | [let clauses](#dynamic-objects-in-let-clauses)
<br/>
[arraylength](#arraylength) | [extractjson](#extractjson) | [parsejson](#parsejson) | [range](#range) | [treepath](#treepath) | [todynamic](#todynamic)


Here's the result of a query on an Application Insights exception. The value in `details` is an array.

![](./media/app-insights-analytics-scalars/310.png)

**Indexing:** Index arrays and objects just as in JavaScript:

    exceptions | take 1
    | extend 
        line = details[0].parsedStack[0].line,
        stackdepth = arraylength(details[0].parsedStack)

* But use `arraylength` and other Analytics functions (not ".length"!)

**Casting** In some cases it's necessary to cast an element that you extract from an object, because its type could vary. For example, `summarize...to` needs a specific type:

    exceptions 
    | summarize count() 
      by toint(details[0].parsedStack[0].line)

    exceptions 
    | summarize count() 
      by tostring(details[0].parsedStack[0].assembly)

**Literals** To create an explicit array or property-bag object, write it as a JSON string and cast:

    todynamic('[{"x":"1", "y":"32"}, {"x":"6", "y":"44"}]')


**mvexpand:** To pull apart the properties of an object into separate rows, use mvexpand:

    exceptions | take 1 
    | mvexpand details[0].parsedStack[0]


![](./media/app-insights-analytics-scalars/410.png)


**treepath:** To find all the paths in a complex object:

    exceptions | take 1 | project timestamp, details 
    | extend path = treepath(details) 
    | mvexpand path


![](./media/app-insights-analytics-scalars/420.png)

**buildschema:** To find the minimum schema that admits all values of the expression in the table:

    exceptions | summarize buildschema(details)

Result:

    { "`indexer`":
     {"id":"string",
       "parsedStack":
       { "`indexer`": 
         {  "level":"int",
            "assembly":"string",
            "fileName":"string",
            "method":"string",
            "line":"int"
         }},
      "outerId":"string",
      "message":"string",
      "type":"string",
      "rawStack":"string"
    }}

Notice that `indexer` is used to mark where you should use a numeric index. For this schema, some valid paths would be (assuming these example indexes are in range):

    details[0].parsedStack[2].level
    details[0].message
    arraylength(details)
    arraylength(details[0].parsedStack)



### Array and object literals

To create a dynamic literal, use `parsejson` (alias `todynamic`) with a JSON string argument:

* `parsejson('[43, 21, 65]')` - an array of numbers
* `parsejson('{"name":"Alan", "age":21, "address":{"street":432,"postcode":"JLK32P"}}')` 
* `parsejson('21')` - a single value of dynamic type containing a number
* `parsejson('"21"')` - a single value of dynamic type containing a string

Note that, unlike JavaScript, JSON mandates the use of double-quotes (`"`) around strings. Therefore, it is generally easier to quote a JSON-encoded string literals using single-quotes (`'`).

This example creates a dynamic value and then uses its fields:

```

T
| extend person = parsejson('{"name":"Alan", "age":21, "address":{"street":432,"postcode":"JLK32P"}}')
| extend n = person.name, add = person.address.street
```


<a name="operators"></a>
### Operators and functions over dynamic types

|||
|---|---|
| *value* `in` *array*| True if there is an element of *array* that == *value*<br/>`where City in ('London', 'Paris', 'Rome')`
| *value* `!in` *array*| True if there is no element of *array* that == *value*
|[`arraylength(`array`)`](#arraylength)| Null if it isn't an array
|[`extractjson(`path,object`)`](#extractjson)|Uses path to navigate into object.
|[`parsejson(`source`)`](#parsejson)| Turns a JSON string into a dynamic object.
|[`range(`from,to,step`)`](#range)| An array of values
|[`mvexpand` listColumn](app-insights-analytics-queries.md#mvexpand-operator) | Replicates a row for each value in a list in a specified cell.
|[`summarize buildschema(`column`)`](app-insights-analytics-queries.md#summarize-operator) |Infers the type schema from column content
|[`summarize makelist(`column`)` ](app-insights-analytics-queries.md#summarize-operator)| Flattens groups of rows and puts the values of the column in an array.
|[`summarize makeset(`column`)`](app-insights-analytics-queries.md#summarize-operator) | Flattens groups of rows and puts the values of the column in an array, without duplication.

### Dynamic objects in let clauses


[Let clauses](app-insights-analytics-queries.md#let-clause) store dynamic values as strings, so these two clauses are equivalent, and both need the `parsejson` (or `todynamic`) before being used:

    let list1 = '{"a" : "somevalue"}';
    let list2 = parsejson('{"a" : "somevalue"}');

    T | project parsejson(list1).a, parsejson(list2).a




### arraylength

The number of elements in a dynamic array.

**Syntax**

    arraylength(array)

**Arguments**

* *array:* A `dynamic` value.

**Returns**

The number of elements in *array*, or `null` if *array* is not an array.

**Examples**

```
arraylength(parsejson('[1, 2, 3, "four"]')) == 4
arraylength(parsejson('[8]')) == 1
arraylength(parsejson('[{}]')) == 1
arraylength(parsejson('[]')) == 0
arraylength(parsejson('{}')) == null
arraylength(parsejson('21')) == null
```



### extractjson

    extractjson("$.hosts[1].AvailableMB", EventText, typeof(int))

Get a specified element out of a JSON text using a path expression. Optionally convert the extracted string to a specific type.


**Syntax**

```

    string extractjson(jsonPath, dataSource)​​ 
    resulttype extractjson(jsonPath, dataSource, typeof(resulttype))​​
```


**Returns**

This function performs a JsonPath query into dataSource which contains a valid JSON string, optionally converting that value to another type depending on the third argument.



**Example**

The [bracket] notatation and dot notation are equivalent:

    ... | extend AvailableMB = extractjson("$.hosts[1].AvailableMB", EventText, typeof(int)) | ...

    ... | extend AvailableMD = extractjson("$['hosts'][1]['AvailableMB']", EventText, typeof(int)) | ...

#### JSON Path expressions

|||
|---|---|
|`$`|Root object|
|`@`|Current object|
|`.` or `[ ]` | Child|
|`[ ]`|Array subscript|

*(We don't currently implement wildcards, recursion, union, or slices.)*


**Performance tips**

* Apply where-clauses before using `extractjson()`
* Consider using a regular expression match with [extract](#extract) instead. This can run very much faster, and is effective if the JSON is produced from a template.
* Use `parsejson()` if you need to extract more than one value from the JSON.
* Consider having the JSON parsed at ingestion by declaring the type of the column to be dynamic.



### parsejson

Interprets a `string` as a [JSON value](http://json.org/)) and returns the value as `dynamic`. It is superior to using `extractjson()` when you need to extract more than one element of a JSON compound object.

**Syntax**

    parsejson(json)

**Arguments**

* *json:* A JSON document.

**Returns**

An object of type `dynamic` specified by *json*.

**Example**

In the following example, when `context_custom_metrics` is a `string`
that looks like this: 

```
{"duration":{"value":118.0,"count":5.0,"min":100.0,"max":150.0,"stdDev":0.0,"sampledValue":118.0,"sum":118.0}}
```

then the following fragment retrieves the value of the `duration` slot
in the object, and from that it retrieves two slots, `duration.value` and
 `duration.min` (`118.0` and `110.0`, respectively).

```AIQL
T
| ...
| extend d=parsejson(context_custom_metrics) 
| extend duration_value=d.duration.value, duration_min=d["duration"]["min"]
```



### range

The `range()` function (not to be confused with the `range` operator)
generates a dynamic array holding a series of equally-spaced values.

**Syntax**

    range(start, stop, step)

**Arguments**

* *start:* The value of the first element in the resulting array. 
* *stop:* The value of the last element in the resulting array,
or the least value that is greater than the last element in the resulting
array and within an integer multiple of *step* from *start*.
* *step:* The difference between two consecutive elements of
the array.

**Examples**

The following example returns `[1, 4, 7]`:

```AIQL
range(1, 8, 3)
```

The following example returns an array holding all days
in the year 2015:

```AIQL

    range(datetime(2015-01-01), datetime(2015-12-31), 1d)
```

### todynamic

    todynamic('{"a":"a1", "b":["b1", "b2"]}')

Converts a string to a dynamic value.

### treepath

    treepath(dynamic_object)

Enumerates all the path expressions that identify leaves in a dynamic object. 

**Returns**

An array of path expressions.

**Examples**

    treepath(parsejson('{"a":"b", "c":123}')) 
    =>       ["['a']","['c']"]
    treepath(parsejson('{"prop1":[1,2,3,4], "prop2":"value2"}'))
    =>       ["['prop1']","['prop1'][0]","['prop2']"]
    treepath(parsejson('{"listProperty":[100,200,300,"abcde",{"x":"y"}]}'))
    =>       ["['listProperty']","['listProperty'][0]","['listProperty'][0]['x']"]

Note that "[0]" indicates the presence of an array, but does not specify the index used by a specific path.


## Sampling

### itemCount

When [sampling](app-insights-sampling.md) is in operation, only a fraction of the data generated by the SDK is ingested into the Application Insights portal. The sampling can be applied either in the SDK or on ingestion to the portal endpoint. 

`itemCount` indicates how many events were generated in the SDK for each event that appears in the stream. So for example, if the current sampling rate is 25%, then itemCount == 4. 

When you want to count events, use `sum(itemCount)` instead of `count()` to get an accurate estimate of the actual numbers. For example:

* The number of exceptions that have occurred in the past two hours:

    ![](./media/app-insights-analytics-scalars/510.png)




[AZURE.INCLUDE [app-insights-analytics-footer](../../includes/app-insights-analytics-footer.md)]

