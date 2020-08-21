---
title: Special Parsing for Parameters
description: Read about special parsing for parameters. Azure CycleCloud is able to resolve parameter values and perform logical evaluation of functions.
author: mvrequa
ms.date: 03/10/2020
ms.author: mirequa
---

# CycleCloud Cluster Template File Parsing

CycleCloud is able to resolve parameter values and perform logical evaluation of functions.

## Parameter Types

CycleCloud handles several basic types of parameters. In most cases, it will handle them as expected:

```ini
Attribute = foo      # string
Attribute = 1        # integer
Attribute = 1.1      # double
Attribute = false    # boolean
Attribute = foo, bar # string[]
```

To be more explicit, string values can be surrounded by double quotes (for example, `Attribute = "foo"`). This may be useful in the case where a value looks like a number but should be interpreted as a string (version numbers, for example). Boolean values can be set to the bare tokens `true` or `false` (case-insensitive). Comma-separated values are interpreted as lists, and elements are in turn interpreted using the same rules as above.

## Parameter Value Evaluation

CycleCloud directly interprets parameter values which use the `$` or `${}` notation.

```ini
MyAttribute = $MyParameter
MyAttribute2 = ${MyParameter2}
MyAttributeList = $Param1, $Param2
```

## Functions using Parameters

The CycleCloud template parser is able to perform math and do ternary logic analysis as seen below.

```ini
MaxCoreCount = ${HyperthreadedCoreCount/2}
SubnetId = ${ifThenElse($Autoscale, $BurstSubnet, $FixedSubnet)}
JetpackPlatform = ${imageselect == "windows" ? "windows" : "centos-7"}
```

## Available operators:

| Operator | Definition |
| -------- | ---------- |
| -, +, /, * | arithmetic |
| <, <=, >=, > | comparators |
| ==, != | equality evaluators |
| &&, \|\| | compound boolean operators |

## Special ClusterName Variable

One variable always provided is `${ClusterName}`. This is evaluated to the name of the CycleCloud cluster.

```ini
EmailAddress = ${strcat("myuser", "@", ClusterName)}
ResourceId = ${ClusterName}-00-resource
```
