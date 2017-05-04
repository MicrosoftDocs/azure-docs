---
title: Regular expressions in OMS Log Analytics log searches | Microsoft Docs
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
ms.date: 02/21/2017
ms.author: bwren

---
# Using regular expressions to filter log searches in Log Analytics

[Log searches](log-analytics-log-searches.md) allow you to extract information from the Log Analytics repository.  [Filter expressions](log-analytics-search-reference.md#filter-expressions) allow you to filter the results of the search according to specific criteria.  The **RegEx** keyword allows you to specify a regular expression for this filter.  

This article provides details on the regular expression syntax used by Log Analytics.


## RegEx keyword

Use the following syntax to use the **RegEx** keyword in a log search.  You can use the other sections in this article to determine the syntax of the regular expression itself.

	field:Regex("Regular Expression")
	field=Regex("Regular Expression")

For example, to use a regular expression to return alert records with a type of *Warning* or *Error*, you would use the following log search.

	Type=Alert AlertSeverity=RegEx("Warning|Error")

## Partial matches
Note that the regular expression must match the entire text of the property.  Partial matches will not return any records.  For example, if you were trying to return records from a computer named srv01.contoso.com, the following log search would **not** return any records.

	Computer=RegEx("srv..")

This is because only the first part of the name matches the regular expression.  The following two log searches would return records from this computer because they match the entire name.

	Computer=RegEx("srv..@")
	Computer=RegEx("srv...contoso.com")

## Characters
Specify different characters.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| a | One occurrence of the character. | Computer=RegEx("srv01.contoso.com") | srv01.contoso.com |
| . | Any single character. | Computer=RegEx("srv...contoso.com") | srv01.contoso.com<br>srv02.contoso.com<br>srv03.contoso.com |
| a? | Zero or one occurrence of the character. | Computer=RegEx("srv01?.contoso.com") | srv0.contoso.com<br>srv01.contoso.com |
| a* | Zero or more occurrences of the character. | Computer=RegEx("srv01*.contoso.com") | srv0.contoso.com<br>srv01.contoso.com<br>srv011.contoso.com<br>srv0111.contoso.com |
| a+ | One or more occurrences of the character. | Computer=RegEx("srv01+.contoso.com") | srv01.contoso.com<br>srv011.contoso.com<br>srv0111.contoso.com |
| [*abc*] | Match any single character in the brackets | Computer=RegEx("srv0[123].contoso.com") | srv01.contoso.com<br>srv02.contoso.com<br>srv03.contoso.com |
| [*a*-*z*] | Match a single character in the range.  Can include multiple ranges. | Computer=RegEx("srv0[1-3].contoso.com") | srv01.contoso.com<br>srv02.contoso.com<br>srv03.contoso.com |
| [^*abc*] | None of the characters in the brackets | Computer=RegEx("srv0[^123].contoso.com") | srv05.contoso.com<br>srv06.contoso.com<br>srv07.contoso.com |
| [^*a*-*z*] | None of the characters in the range. | Computer=RegEx("srv0[^1-3].contoso.com") | srv05.contoso.com<br>srv06.contoso.com<br>srv07.contoso.com |
| [*n*-*m*] | Match a range of numeric characters. | Computer=RegEx("srv[01-03].contoso.com") | srv01.contoso.com<br>srv02.contoso.com<br>srv03.contoso.com |
| @ | Any string of characters. | Computer=RegEx("srv@.contoso.com") | srv01.contoso.com<br>srv02.contoso.com<br>srv03.contoso.com |


## Multiple occurences of character
Specify multiple occurrences of a particular characters.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| a{n} |  *n* occurrences of the character. | Computer=RegEx("bw-win-sc01{3}.bwren.lab") | bw-win-sc0111.bwren.lab |
| a{n,} |  *n* or more occurrences of the character. | Computer=RegEx("bw-win-sc01{3,}.bwren.lab") | bw-win-sc0111.bwren.lab<br>bw-win-sc01111.bwren.lab<br>bw-win-sc011111.bwren.lab<br>bw-win-sc0111111.bwren.lab |
| a{n,m} |  *n* to *m* occurrences of the character. | Computer=RegEx("bw-win-sc01{3,5}.bwren.lab") | bw-win-sc0111.bwren.lab<br>bw-win-sc01111.bwren.lab<br>bw-win-sc011111.bwren.lab |


## Logical expressions
Select from multiple values.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| &#124; | Logical OR.  Returns result if match on either expression. | Type=Alert AlertSeverity=RegEx("Warning&#124;Error") | Warning<br>Error |
| & | Logical AND.  Returns result if match on both expressions | EventData=regex("(Security.\*&.\*success.\*)") | Security auditing successful |


## Literals
Convert special characters to literal characters.  This includes characters that provide functionality to regular expressions such as ?-\*^\[\]{}\(\)+\|.&.

| Character | Description | Example | Sample Matches |
|:--|:--|:--|:--|
| \\ | Converts a special character to a literal. | Status_CF=\\[Error\\]@<br>Status_CF=Error\\-@ | [Error]File not found.<br>Error-File not found. |


## Next Steps

* Get familiar with [log searches](log-analytics-log-searches.md) to view and analyze data in the Log Analytics repository.
