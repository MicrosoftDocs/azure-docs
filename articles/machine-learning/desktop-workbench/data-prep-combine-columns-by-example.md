---
title: Combine Columns by Example Transformation using Azure Machine Learning Workbench
description: The reference document for the 'Combine Columns by Example' transform
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

# Combine columns by example transformation

[!INCLUDE [workbench-deprecated](../../../includes/aml-deprecating-preview-2017.md)] 


This transformation allows user to add a new column by combining values from multiple columns. User can specify a separator or provide examples of combined values to perform this transform. When the user provides examples of combination, the transformation is handled by the same **By-Example** engine that is used in the **Derive Column by Example** transform.

## How to perform this transformation

To perform this transform, follow these steps:
1. Select two or more columns that you want to combine into one column. 
2. Select **Combine Columns by Example** from the **Transforms** menu. Or, Right click on the header of any of the selected columns and select **Combine Columns by Example** from the context menu. The Transform Editor opens, and a new column is added next to the right most selected column. The new column contains the combined values separated by a default separator. Selected columns can be identified by the checkboxes at the column headers. Addition and removal of columns from the selection can be done using the checkboxes.
3. You can update the combined value in the newly created column. The updated value is used as an example to learn the transform.
4. Click **OK** to accept the transform.

### Transform editor: Advanced mode

Advanced Mode provides a richer experience for Combining columns. 

Selecting **Separator** under **Combine Columns by** enables user to specify Strings in the **Separator** text box. Tab out from the **Separator** text box to preview the results in the data gird. Press **OK** to commit the transform.

Selecting **Examples** under **Combine Columns by** enables user to provide examples of combined values. To promote a row as an example, double-click on the rows in the grid. Type in the expected output in the text box against the promoted row. Tab out from the **Separator** text box to preview the results in the data gird. Press **OK** to commit the transform. 

User can switch between the **Basic Mode** and the **Advanced Mode** by clicking the links in the Transform Editor.

### Transform editor: Send Feedback

Clicking on the **Send feedback** link opens the **Feedback** dialog with the comments box prepopulated with the examples user has provided. User should review the content of the comments box and provide more details to help us understand the issue. If the user does not want to share data with Microsoft, user should delete the prepopulated example data before clicking the **Send Feedback** button. 

### Editing existing transformation

A user can edit an existing **Combine Column By Example** transform by selecting **Edit** option of the Transformation Step. Clicking on **Edit** opens the Transform Editor in **Basic Mode**. User can enter the **Advanced Mode** by clicking on the link in the header. All the examples that were provided during creation of the transform are shown there.

## Example using separators

A comma followed by a space is used as a separator in this example to combine the *Street*, *City*, *State*, and *ZIP* columns.

|Street|City|State|ZIP|Column|
|:----|:----|:----|:----|:----|
|16011 N.E. 36th Way|REDMOND|WA|98052|16011 N.E. 36th Way, REDMOND, WA, 98052|
|16021 N.E. 36th Way|REDMOND|WA|98052|16021 N.E. 36th Way, REDMOND, WA, 98052|
|16031 N.E. 36th Way|REDMOND|WA|98052|16031 N.E. 36th Way, REDMOND, WA, 98052|
|16041 N.E. 36th Way|REDMOND|WA|98052|16041 N.E. 36th Way, REDMOND, WA, 98052|
|16051 N.E. 36th Way|REDMOND|WA|98052|16051 N.E. 36th Way, REDMOND, WA, 98052|
|16061 N.E. 36th Way|REDMOND|WA|98052|16061 N.E. 36th Way, REDMOND, WA, 98052|
|3460 157th Avenue NE|REDMOND|WA|98052|3460 157th Avenue NE, REDMOND, WA, 98052|
|3350 157th Ave N.E.|REDMOND|WA|98052|3350 157th Ave N.E., REDMOND, WA, 98052|
|3240 157th Avenue N.E.|REDMOND|WA|98052|3240 157th Avenue N.E., REDMOND, WA, 98052|

## Example using By example

The value in **bold** was provided as an example.

|Date|Month|Year|Hour|Minute|Second|Combined Column|
|:----|:----|:----|:----|:----|:----|:----|
|13|Oct|2016|15|01|23|**13-Oct-2016 15:01:23 PDT**|
|16|Oct|2016|16|22|33|16-Oct-2016 15:01:33 PDT|
|17|Oct|2016|12|43|12|17-Oct-2016 15:01:12 PDT|
|12|Nov|2016|14|22|44|12-Nov-2016 15:01:44 PDT|
|23|Nov|2016|01|52|45|23-Nov-2016 15:01:45 PDT|
|16|Jan|2017|22|34|56|16-Jan-2016 15:01:56 PDT|
|23|Mar|2017|01|55|25|23-Mar-2016 15:01:25 PDT|
|16|Apr|2017|11|34|36|16-Apr-2016 15:01:36 PDT|

