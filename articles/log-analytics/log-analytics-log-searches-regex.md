---
title: Regular expressions in Log Analytics log searches | Microsoft Docs
description: You can use the RegEx keyword in Log Analytics log searches to the filter the results according to a regular expression.  This article provides the syntax for these expressions with several examples.
services: log-analytics
documentationcenter: ''
author: bwren
manager: carmonm
editor: ''

ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 02/10/2017
ms.author: bwren


# Using regular expressions to filter log searches in Log Analytics

[Log searches](log-analytics-log-searches.md) allow you to extract information from the Log Analytics repository.  [Filter expressions](log-analytics-search-reference.md#filter-expression) allow you to filter the results of the search according to specific criteria.  The **RegEx** keyword allows you to specify a regular expression for this filter.  

This article provides details on the regular expression syntax used by Log Analytics.


## RegEx keyword

Use the following syntax to use the **RegEx** keyword in a log search.  You can use the other sections in this article to determine the syntax of the regular expression itself. 

	field:Regex("Regular Expression")
	field=Regex("Regular Expression")

For example, to use a regular expression to return alert records with a type of *Warning* or *Error*, you would use the following log search. 

	Type=Alert AlertSeverity=RegEx("Warning|Error")

## Characters
Specify different characters.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| a | One occurrence of the character. | Computer=RegEx("bw-win-sc01.bwren.lab") | bw-win-sc01.bwren.lab |
| . | Any single character. | Computer=RegEx("bw-win-sc...bwren.lab") | bw-win-sc01.bwren.lab<br>bw-win-sc02.bwren.lab<br>bw-win-sc03.bwren.lab |
| a? | Zero or one occurrence of the character. | Computer=RegEx("bw-win-sc01?.bwren.lab") | bw-win-sc0.bwren.lab<br>bw-win-sc01.bwren.lab |
| a* | Zero or more occurrences of the character. | Computer=RegEx("bw-win-sc01*.bwren.lab") | bw-win-sc0.bwren.lab<br>bw-win-sc01.bwren.lab<br>bw-win-sc011.bwren.lab<br>bw-win-sc0111.bwren.lab |
| a+ | One or more occurrences of the character. | Computer=RegEx("bw-win-sc01*.bwren.lab") | bw-win-sc01.bwren.lab<br>bw-win-sc011.bwren.lab<br>bw-win-sc0111.bwren.lab |
| [*abc*] | Match any single character in the brackets | Computer=RegEx("bw-win-sc0[123].bwren.lab") | bw-win-sc01.bwren.lab<br>bw-win-sc02.bwren.lab<br>bw-win-sc03.bwren.lab |
| [*a*-*z*] | Match a single character in the range.  Can include multiple ranges. | Computer=RegEx("bw-win-sc0[1-3].bwren.lab") | bw-win-sc01.bwren.lab<br>bw-win-sc02.bwren.lab<br>bw-win-sc03.bwren.lab |
| [^*abc*] | None of the characters in the brackets | Computer=RegEx("bw-win-sc0[^123].bwren.lab") | bw-win-sc05.bwren.lab<br>bw-win-sc06.bwren.lab<br>bw-win-sc07.bwren.lab |
| [^*a*-*z*] | None of the characters in the range. | Computer=RegEx("bw-win-sc0[^1-3].bwren.lab") | bw-win-sc05.bwren.lab<br>bw-win-sc06.bwren.lab<br>bw-win-sc07.bwren.lab |
| @ | Any string of characters. | Computer=RegEx("bw-win-sc@.bwren.lab") | bw-win-sc01.bwren.lab<br>bw-win-sc02.bwren.lab<br>bw-win-sc03.bwren.lab |


## Multiple occurences of character
Specify multiple occurrences of a particular characters.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| a{n} |  *n* occurrences of the character. | Computer=RegEx("bw-win-sc01{3}.bwren.lab") | bw-win-sc0111.bwren.lab |
| a{n,} |  *n* or more occurrences of the character. | Computer=RegEx("bw-win-sc01{3,}.bwren.lab") | bw-win-sc0111.bwren.lab<br>bw-win-sc01111.bwren.lab<br>bw-win-sc011111.bwren.lab<br>bw-win-sc0111111.bwren.lab |
| a{n,m} |  *n* to *m* occurrences of the character. | Computer=RegEx("bw-win-sc01{3,5}.bwren.lab") | bw-win-sc0111.bwren.lab<br>bw-win-sc01111.bwren.lab<br>bw-win-sc011111.bwren.lab |


## Logical expressions
Select from multiple values.

| Character | Description | Example |
|:--|:--|:--|
| &#124; | Logical OR.  Returns result if match on either expression. | Type=Alert AlertSeverity=RegEx("Warning&#124;Error") |
| & | Logical AND.  Returns result if match on both expressions |  |


## Literals
Convert special characters.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| \\ | Converts a special character to a literal. | Status_CF=\\[Error\\]@ | [Error]File not found. |


## Unknown

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| # | The empty language. | | |
| ( ) | Empty string. | | |
| <n-m> | Numeric interval. | | |

## Next Steps

* Get familiar with [log searches](log-analytics-log-searches.md) to view and analyze data in the Log Analytics repository.
