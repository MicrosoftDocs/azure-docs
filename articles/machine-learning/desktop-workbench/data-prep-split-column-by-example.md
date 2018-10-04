---
title: Split Column by Example Transformation using Azure Machine Learning Workbench
description: The reference document for the 'Split Column by Example' transform
services: machine-learning
author: ranvijaykumar
ms.author: ranku
manager: mwinkle
ms.reviewer: jmartens, jasonwhowell, mldocs
ms.service: machine-learning
ms.component: core
ms.workload: data-services
ms.custom: mvc, reference
ms.topic: article
ms.date: 09/14/2017

ROBOTS: NOINDEX
---

# Split column by example transformation

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


This transform predictively splits the content of a column on meaningful boundaries without requiring user input. The Split algorithm selects the boundaries after analyzing the content of the column. These boundaries could be defined by
* A fixed delimiter,
* Multiple, arbitrary delimiters appearing in particular contexts, or,
* Data patterns or certain entity types

Users can also control the splitting behavior in the Advanced mode where they can specify the delimiters or by provide examples of desired splitting.

In theory, Split operations can also be performed in the Workbench using a series of *Derive Column by Example* transforms. However, if there are several columns, deriving each of those individually even using by-example approach can be very time consuming. Predictive split enables easy splitting without the user needing to provide examples for each of the columns. 

## How to perform this transformation

1. Select the column that you want to split. 
2. Select **Split Column by Example** from the **Transforms** menu. Or, Right-click on the header of the selected column and select **Split Column by Example** from the context menu. The Transform Editor opens and new columns are added next to the selected column. At this point, the Workbench analyzes the input column, determines split boundaries, and synthesizes a program to split the column as displayed in the grid. The synthesized program is executed against all the rows in the column. Delimiters, if any, are excluded from the final result.
3. You can click on the **Advanced mode** for finer control over the split transformation. 
4. Review the output and Click **OK** to accept the transform. 

The transform aims to produce the same number of resultant columns for all the rows. If any row cannot be split on the determined boundaries, it produces *null* for all the columns by default. This behavior can be changed in the **Advanced Mode**.

### Transform editor: advanced mode
**Advanced Mode** provides a richer experience for Splitting columns. 

Selecting **Keep Delimiter Columns** includes the Delimiters in the final result. Delimiters are excluded by default.

Specifying **Delimiters** overrides the automatic delimiter selection logic. Multiple delimiters, one in each line, can be specified as **Delimiters**. All those characters are used as delimiters to split the column.

Sometimes, splitting a value on determined boundaries produces different number of columns than the majority of others. In those cases, **Fill Direction** is used to decide the order in which the columns should be filled.

Clicking on **Show suggested examples** displays the representative rows for which user should provide an example of split. User can click on the **Up** arrow to the right of the suggested row to promote the row as an example. 

User can **Delete Column** or **Insert new Columns** by Right-clicking on the header of the **Examples Table**.

User can Copy and Paste values from one Cell to another in order to provide an example of split.

User can switch between the **Basic Mode** and the **Advanced Mode** by clicking the links in the Transform Editor.

### Transform editor: Send Feedback

Clicking on the **Send feedback** link opens the **Feedback** dialog with the comments box prepopulated with the parameter selections and the examples user has provided. User should review the content of the comments box and provide more details to help us understand the issue. If the user does not want to share data with Microsoft, user should delete the prepopulated example data before clicking the **Send Feedback** button. 


### Editing an existing transformation

A user can edit an existing **Split Column By Example** transform by selecting **Edit** option of the Transformation Step. Clicking on **Edit** opens the Transform Editor in **Advanced Mode**, and all the examples that were provided during creation of the transform are shown.

## Examples of splitting on a fixed, single-character delimiter

It is common for data fields to be separated by a single fixed delimiter such as a comma in a CSV format. The Split transform attempts to infer these delimiters automatically. For example, in the following scenario it automatically infers the "." as a delimiter.

### Splitting IP addresses

The values in the first column are predictively split into four columns.

|IP|IP_1|IP_2|IP_3|IP_4|
|:-----|:-----|:-----|:-----|:-----|
|192.168.0.102|192|168|0|102|
|192.138.0.101|192|138|0|101|
|192.168.0.102|192|168|0|102|
|192.158.1.202|192|158|1|202|
|192.168.0.102|192|168|0|102|
|192.169.1.102|192|169|1|102|

## Examples of splitting on multiple delimiters within particular contexts

The user's data may include many different delimiters separating different fields. Moreover, only some occurrences of a delimiting string may be a delimiter but not all. For example, in the following case the set of delimiters required is "-", "," and ":" to produce the desired output. However, not every occurrence of the ":" should be a split point, since we do not want to split the time but keep it in a single column. The Split transform infers delimiters within the contexts in which they occur in the input data rather than any possible occurrence of the delimiter. The transform is also aware of common data types such as dates and times.   

### Splitting store opening timings

The values in the following *Timings* column get predictively split into nine columns shown in the table under it.

|Timings|
|:-----|
|Monday - Friday: 7:00 am - 6:00 pm,Saturday: 9:00 am - 5:00 pm,Sunday: Closed|
|Monday - Friday: 9:00 am - 6:00 pm,Saturday: 4:00 am - 4:00 pm,Sunday: Closed|
|Monday - Friday: 8:30 am - 7:00 pm,Saturday: 3:00 am - 2:30 pm,Sunday: Closed|
|Monday - Friday: 8:00 am - 6:00 pm,Saturday: 2:00 am - 3:00 pm,Sunday: Closed|
|Monday - Friday: 4:00 am - 7:00 pm,Saturday: 9:00 am - 4:00 pm,Sunday: Closed|
|Monday - Friday: 8:30 am - 4:30 pm,Saturday: 9:00 am - 5:00 pm,Sunday: Closed|
|Monday - Friday: 5:30 am - 6:30 pm,Saturday: 5:00 am - 4:00 pm,Sunday: Closed|
|Monday - Friday: 8:30 am - 8:30 pm,Saturday: 6:00 am - 5:00 pm,Sunday: Closed|
|Monday - Friday: 8:00 am - 9:00 pm,Saturday: 9:00 am - 8:00 pm,Sunday: Closed|
|Monday - Friday: 10:00 am - 9:30 pm,Saturday: 9:30 am - 3:00 pm,Sunday: Closed|

|Timings_1|Timings_2|Timings_3|Timings_4|Timings_5|Timings_6|Timings_7|Timings_8|Timings_9|
|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|
|Monday|Friday|7:00 am|6:00 pm|Saturday|9:00 am|5:00 pm|Sunday|Closed|
|Monday|Friday|9:00 am|6:00 pm|Saturday|4:00 am|4:00 pm|Sunday|Closed|
|Monday|Friday|8:30 am|7:00 pm|Saturday|3:00 am|2:30 pm|Sunday|Closed|
|Monday|Friday|8:00 am|6:00 pm|Saturday|2:00 am|3:00 pm|Sunday|Closed|
|Monday|Friday|4:00 am|7:00 pm|Saturday|9:00 am|4:00 pm|Sunday|Closed|
|Monday|Friday|8:30 am|4:30 pm|Saturday|9:00 am|5:00 pm|Sunday|Closed|
|Monday|Friday|5:30 am|6:30 pm|Saturday|5:00 am|4:00 pm|Sunday|Closed|
|Monday|Friday|8:30 am|8:30 pm|Saturday|6:00 am|5:00 pm|Sunday|Closed|
|Monday|Friday|8:00 am|9:00 pm|Saturday|9:00 am|8:00 pm|Sunday|Closed|
|Monday|Friday|10:00 am|9:30 pm|Saturday|9:30 am|3:00 pm|Sunday|Closed|

### Splitting IIS log

Here is another example of multiple arbitrary delimiters. This example also includes a contextual delimiter "/", which must not be split inside the URLs or file paths. It is tedious to perform this splitting using many *Derive Column by Example* transforms and giving examples for each field. Using the Split transform we can perform the predictive splitting without giving any examples.

|logtext|
|:-----|
|192.128.138.20 - - [16/Oct/2016 16:22:33 -0200] "GET /images/picture.gif HTTP/1.1" 234 343 www.yahoo.com "http://www.example.com/" "Mozilla/4.0 (compatible; MSIE 4)" "-"|
|10.128.72.213 - - [17/Oct/2016 12:43:12 +0300] "GET /news/stuff.html HTTP/1.1" 200 6233 www.aol.com "http://www.sample.com/" "Mozilla/5.0 (MSIE)" "-"|
|192.165.71.165 - - [12/Nov/2016 14:22:44 -0500] "GET /sample.ico HTTP/1.1" 342 7342 www.facebook.com "-" "Mozilla/5.0 (Windows; U; Windows NT 5.1; rv:1.7.3)" "-"|
|10.166.64.165 - - [23/Nov/2016 01:52:45 -0800] "GET /style.css HTTP/1.1" 200 2552 www.google.com "http://www.test.com/index.html" "Mozilla/5.0 (Windows)" "-"|
|192.167.1.193 - - [16/Jan/2017 22:34:56 +0200] "GET /js/ads.js HTTP/1.1" 200 23462 www.microsoft.com "http://www.illustration.com/index.html" "Mozilla/5.0 (Windows)" "-"|
|192.147.76.193 - - [28/Jan/2017 26:36:16 +0800] "GET /search.php HTTP/1.1" 400 1777 www.bing.com "-" "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)" "-"|
|192.166.64.165 - - [23/Mar/2017 01:55:25 -0800] "GET /style.css HTTP/1.1" 200 2552 www.google.com "http://www.test.com/index.html" "Mozilla/5.0 (Windows)" "-"|
|11.167.1.193 - - [16/Apr/2017 11:34:36 +0200] "GET /js/ads.js HTTP/1.1" 200 23462 www.microsoft.com "http://www.illustration.com/index.html" "Mozilla/5.0 (Windows)" "-"|

Gets split into:

|logtext_1|logtext_2|logtext_3|logtext_4|logtext_5|logtext_6|logtext_7|logtext_8|logtext_9|logtext_10|logtext_11|logtext_12|logtext_13|logtext_14|logtext_15|
|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|:-----|
|192.128.138.20|16/Oct/2016|16:22:33|-0200|GET|images/picture.gif|HTTP|1.1|234|343|www.yahoo.com|http://www.example.com/|Mozilla|4.0|compatible; MSIE 4|
|10.128.72.213|17/Oct/2016|12:43:12|+0300|GET|news/stuff.html|HTTP|1.1|200|6233|www.aol.com|http://www.sample.com/|Mozilla|5.0|MSIE|
|192.165.71.165|12/Nov/2016|14:22:44|-0500|GET|sample.ico|HTTP|1.1|342|7342|www.facebook.com|-|Mozilla|5.0|Windows; U; Windows NT 5.1; rv:1.7.3|
|10.166.64.165|23/Nov/2016|01:52:45|-0800|GET|style.css|HTTP|1.1|200|2552|www.google.com|http://www.test.com/index.html|Mozilla|5.0|Windows|
|192.167.1.193|16/Jan/2017|22:34:56|+0200|GET|js/ads.js|HTTP|1.1|200|23462|www.microsoft.com|http://www.illustration.com/index.html|Mozilla|5.0|Windows|
|192.147.76.193|28/Jan/2017|26:36:16|+0800|GET|search.php|HTTP|1.1|400|1777|www.bing.com|-|Mozilla|4.0|compatible; MSIE 6.0; Windows NT 5.1|
|192.166.64.165|23/Mar/2017|01:55:25|-0800|GET|style.css|HTTP|1.1|200|2552|www.google.com|http://www.test.com/index.html|Mozilla|5.0|Windows|
|11.167.1.193|16/Apr/2017|11:34:36|+0200|GET|js/ads.js|HTTP|1.1|200|23462|www.microsoft.com|http://www.illustration.com/index.html|Mozilla|5.0|Windows|

## Examples of splitting without delimiters
In some cases, there are no actual delimiters, and data fields may occur contiguously next to each other. In this case, the Split transform automatically detects patterns in the data to infer probably split points. For example, in the following scenario we want to separate the amount from the currency type, and Split automatically infers the boundary between the numeric and non-numeric data as the split point.

### Splitting amount with currency symbol

|Amount|Amount_1|Amount_2|
|:-----|:-----|:-----|
|\$14|$|14|
|£9|£|9|
|\$34|$|34|
|€ 18|€ |18|
|\$42|$|42|
|\$7|$|7|
|£42|£|42|
|\$16|$|16|
|€ 16|€ |16|
|\$15|$|15|
|\$16|$|16|
|€ 64|€ |64|

In the following example, we would like to separate the weight values from the units of measure. Again the Split inference detects the meaningful boundary automatically and prefers it over other possible delimiters such as the "." character. 

### Splitting weights with units

|Weight|Weight_1|Weight_2|
|:-----|:-----|:-----|
|2.27KG|2.27|KG|
|1L|1|L|
|2.5KG|2.5|KG|
|2KG|2|KG|
|1.7KGA|1.7|KGA|
|3KG|3|KG|
|2KG|2|KG|
|125G|125|G|
|500G|500|G|
|1.5KGA|1.5|KGA|

## Technical notes

The Split transform feature is based on the **Predictive Program Synthesis** technique. In this technique, data transformation programs are learned automatically based on the input data. The programs are synthesized in a domain-specific language. The DSL is based on delimiters and fields that occur in particular regular expression contexts. More information about this technology can be found in a [recent publication on this topic](https://www.microsoft.com/research/publication/automated-data-extraction-using-predictive-program-synthesis/). 
