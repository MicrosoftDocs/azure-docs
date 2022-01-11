---
title:  "Split Data: Component reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Split Data component in Azure Machine Learning to divide a dataset into two distinct sets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/22/2019
---
# Split Data component

This article describes a component in Azure Machine Learning designer.

Use the Split Data component to divide a dataset into two distinct sets.

This component is useful when you need to separate data into training and testing sets. You can also customize the way that data is divided. Some options support randomization of data. Others are tailored for a certain data type or model type.

## Configure the component

> [!TIP]
> Before you choose the splitting mode, read all options to determine the type of split you need.
> If you change the splitting mode, all other options might be reset.

1. Add the **Split Data** component to your pipeline in the designer. You can find this component under **Data Transformation**, in the **Sample and Split** category.

1. **Splitting mode**: Choose one of the following modes, depending on the type of data you have and how you want to divide it. Each splitting mode has different options.

   - **Split Rows**: Use this option if you just want to divide the data into two parts. You can specify the percentage of data to put in each split. By default, the data is divided 50/50.

     You can also randomize the selection of rows in each group, and use stratified sampling. In stratified sampling, you must select a single column of data for which you want values to be apportioned equally among the two result datasets.  

   - **Regular Expression Split**: Choose this option when you want to divide your dataset by testing a single column for a value.

     For example, if you're analyzing sentiment, you can check for the presence of a particular product name in a text field. You can then divide the dataset into rows with the target product name and rows  without the target product name.

   - **Relative Expression Split**: Use this option whenever you want to apply a condition to a number column. The number can be a date/time field, a column that contains age or dollar amounts, or even a percentage. For example, you might want to divide your dataset based on the cost of the items, group people by age ranges, or separate data by a calendar date.

### Split rows

1. Add the [Split Data](./split-data.md) component to your pipeline in the designer, and connect the dataset that you want to split.
  
1. For **Splitting mode**, select **Split Rows**. 

1. **Fraction of rows in the first output dataset**: Use this option to determine how many rows will go into the first (left side) output. All other rows will go into the second (right side) output.

   The ratio represents the percentage of rows sent to the first output dataset, so you must enter a decimal number between 0 and 1.
     
   For example, if you enter **0.75** as the value, the dataset will be split 75/25. In this split, 75 percent of the rows will be sent to the first output dataset. The remaining 25 percent will be sent to the second output dataset.
  
1. Select the **Randomized split** option if you want to randomize selection of data into the two groups. This is the preferred option when you're creating training and test datasets.

1. **Random Seed**: This parameter will be ignored if **Randomized split** is set to false. Otherwise enter a non-negative integer value to start the pseudorandom sequence of instances to be used. This default seed is used in all components that generate random numbers. 

   Specifying a seed makes the results reproducible. If you need to repeat the results of a split operation, you should specify the same seed number for the random number generator. 

1. **Stratified split**: Set this option to **True** to ensure that the two output datasets contain a representative sample of the values in the *strata column* or *stratification key column*. 

   With stratified sampling, the data is divided such that each output dataset gets roughly the same percentage of each target value. For example, you might want to ensure that your training and testing sets are roughly balanced with regard to the outcome or to some other column (such as gender).

1. Submit the pipeline.


## Select a regular expression

1. Add the [Split Data](./split-data.md) component to your pipeline, and connect it as input to the dataset that you want to split.  
  
1. For **Splitting mode**, select **Regular expression split**.

1. In the **Regular expression** box, enter a valid regular expression. 
  
   The regular expression should follow Python syntax for regular expressions.

1. Submit the pipeline.

   Based on the regular expression that you provide, the dataset is divided into two sets of rows: rows with values that match the expression and all remaining rows. 

The following examples demonstrate how to divide a dataset by using the **Regular expression** option. 

### Single whole word 

This example puts into the first dataset all rows that contain the text `Gryphon` in the column `Text`. It puts other rows into the second output of **Split Data**.

```text
    \"Text" Gryphon  
```

### Substring

This example looks for the specified string in any position within the second column of the dataset. The position is denoted here by the index value of 1. The match is case-sensitive.

```text
(\1) ^[a-f]
```

The first result dataset contains all rows where the index column begins with one of these characters: `a`, `b`, `c`, `d`, `e`, `f`. All other rows are directed to the second output.

## Select a relative expression

1. Add the [Split Data](./split-data.md) component to your pipeline, and connect it as input to the dataset that you want to split.
  
1. For **Splitting mode**, select **Relative Expression**.
  
1. In the **Relational expression** box, enter an expression that performs a comparison operation on a single column.

   For **Numeric column**:
   - The column contains numbers of any numeric data type, including date and time data types.
   - The expression can reference a maximum of one column name.
   - Use the ampersand character, `&`, for the AND operation. Use the pipe character, `|`, for the OR operation.
   - The following operators are supported: `<`, `>`, `<=`, `>=`, `==`, `!=`.
   - You can't group operations by using `(` and `)`.
   
   For **String column**:
   - The following operators are supported: `==`, `!=`.

1. Submit the pipeline.

   The expression divides the dataset into two sets of rows: rows with values that meet the condition, and all remaining rows.

The following examples demonstrate how to divide a dataset by using the **Relative Expression** option in the **Split Data** component.  

### Calendar year

A common scenario is to divide a dataset by years. The following expression selects all rows where the values in the column `Year` are greater than `2010`.

```text
\"Year" > 2010
```

The date expression must account for all date parts that are included in the data column. The format of dates in the data column must be consistent. 

For example, in a date column that uses the format `mmddyyyy`, the expression should be something like this:

```text
\"Date" > 1/1/2010
```

### Column index

The following expression demonstrates how you can use the column index to select all rows in the first column of the dataset that contain values less than or equal to 30, but not equal to 20.

```text
(\0)<=30 & !=20
```


## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 
