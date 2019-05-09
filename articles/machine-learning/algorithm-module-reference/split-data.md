---
title:  "Split Data: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Split Data module in Azure Machine Learning service to divide a dataset into two distinct sets.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 05/02/2019
ROBOTS: NOINDEX
---
# Split Data module

This article describes a module of the visual interface (preview) for Azure Machine Learning service.

Use this module to divide a dataset into two distinct sets.

This module is particularly useful when you need to separate data into training and testing sets. You can customize the way that data is divided as well. Some options support randomization of data; others are tailored for a certain data type or model type.

## How to configure

> [!TIP]
> Before choosing the splitting mode, read all options to determine the type of split you need.
> If you change the splitting mode, all other options could be reset.

1. Add the **Split Data** module to your experiment in the interface. You can find this module under **Data Transformation**, in the **Sample and Split** category.

2. **Splitting mode**: Choose one of the following modes, depending on the type of data you have, and how you want to divide it. Each splitting mode has different options. Click the following topics for detailed instructions and examples. 

    - **Split Rows**: Use this option if you just want to divide the data into two parts. You can specify the percentage of data to put in each split, but by default, the data is divided 50-50.

        You can also randomize the selection of rows in each group, and use stratified sampling. In stratified sampling, you must select a single column of data for which you want values to be apportioned equally among the two result datasets.  

    - **Regular Expression Split**  Choose this option when you want to divide your dataset by testing a single column for a value.

        For example, if you are analyzing sentiment, you could check for the presence of a particular product name in a text field, and then divide the dataset into rows with the target product name, and those without.

    - **Relative Expression Split**:  Use this option whenever you want to apply a condition to a number column. The number could be a date/time field, a column containing age or dollar amounts, or even a percentage. For example, you might want to divide your data set depending on the cost of the items, group people by age ranges, or separate data by a calendar date.

### Split Rows
1.  Add the [Split Data](./split-data.md) module to your experiment in the interface, and connect the dataset you want to split.
  
2.  For **Splitting mode**, choose **Split rows**. 

3.  **Fraction of rows in the first output dataset**. Use this option to determine how many rows go into the first (left-hand) output. All other rows will go to the second (right-hand) output.

    The ratio represents the percentage of rows sent to the first output dataset, so you must type a decimal number between 0 and 1.
     
     For example, if you type 0.75 as the value, the dataset would be split by using a 75:25 ratio, with 75% of the rows sent to the first output dataset, and 25% sent to the second output dataset.
  
4. Select the **Randomized split** option if you want to randomize selection of data into the two groups. This is the preferred option when creating training and test datasets.

5.  **Random Seed**: Type a non-negative integer value to initialize the pseudorandom sequence of instances to be used. This default seed is used in all modules that generate random numbers. 

     Specifying a seed makes the results generally reproducible. If you need to repeat the results of a split operation, you should specify a seed for the random number generator. Otherwise the random seed is set by default to 0, which means the initial seed value is obtained from the system clock. As a result, the distribution of data might be slightly different each time you perform a split. 

6. **Stratified split**: Set this option to **True** to ensure that the two output datasets contain a representative sample of the values in the *strata column* or *stratification key column*. 

    With stratified sampling, the data is divided such that each output dataset gets roughly the same percentage of each target value. For example, you might want to ensure that your training and testing sets are roughly balanced with regard to the outcome, or with regard ot some other column such as gender.

7. Run the experiment.


## Regular expression split

1.  Add the [Split Data](./split-data.md) module to your experiment, and connect it as input to the dataset you want to split.  
  
2.  For **Splitting mode**, select **Regular expression split**.

3. In the **Regular expression** box, type a valid regular expression. 
  
   The regular expression should follow Python regular expression syntax.


4. Run the experiment.

    Based on the regular expression you provide, the dataset is divided into two sets of rows: rows with values that match the expression and all remaining rows. 

## Relative expression split.

1. Add the [Split Data](./split-data.md) module to your experiment, and connect it as input to the dataset you want to split.
  
2. For **Splitting mode**, select **relative expression split**.
  
3. In the **Relational expression** text box, type an expression that performs a comparison operation, on a single column:


 - Numeric column:
    - The column contains numbers of any numeric data type, including date/time data types.

    - The expression can reference a maximum of one column name.

    - Use the ampersand character (&) for the AND operation and use the pipe character (|) for the OR operation.

    - The following operators are supported: `<`, `>`, `<=`, `>=`, `==`, `!=`

    - You cannot group operations by using `(` and `)`.

 - String column: 
    - The following operators are supported: `==`, `!=`



4. Run the experiment.

    The expression divides the dataset into two sets of rows: rows with values that meet the condition, and all remaining rows.

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 