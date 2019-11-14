---
title: "Filter Based Feature Selection: Module Reference"
titleSuffix: Azure Machine Learning service
description: Learn how to use the Filter Based Feature Selection module in Azure Machine Learning service to identify the features in a dataset with the greatest predictive power.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2019
---
# Filter Based Feature Selection

This article describes how to use the [Filter Based Feature Selection](filter-based-feature-selection.md) module in Azure Machine Learning designer (preview), to identify the columns in your input dataset that have the greatest predictive power. 

In general, *feature selection* refers to the process of applying statistical tests to inputs, given a specified output, to determine which columns are more predictive of the output. The [Filter Based Feature Selection](filter-based-feature-selection.md) module provides multiple feature selection algorithms to choose from, including correlation methods such as Pearson correlation and chi-squared values. 

When you use the [Filter Based Feature Selection](filter-based-feature-selection.md) module, you provide a dataset, identify the column that contains the label or dependent variable, and then specify a single method to use in measuring feature importance.

The module outputs a dataset that contains the best feature columns, as ranked by predictive power. It also outputs the names of the features and their scores from the selected metric.  

### What is filter-based feature selection and why use it?  

This module for feature selection is called "filter-based" because you use the selected metric to identify irrelevant attributes, and filter out redundant columns from your model.  You choose a single statistical measure that suits your data, and the module calculates a score for each feature column. The columns are returned ranked by their feature scores. 

By choosing the right features, you can potentially improve the accuracy and efficiency of classification. 

You typically use only the columns with the best scores to build your predictive model. Columns with poor feature selection scores can be left in the dataset and ignored when you build a model.  

### How to choose a feature selection metric

The **Filter-Based Feature Selection** provides a variety of metrics for assessing the information value in each column.  This section provides a general description of each metric, and how it is applied. Additional requirements for using each metric are stated in the [Technical Notes](#technical-notes) section and in the [instructions](#how-to-configure-filter-based-feature-selection) for configuring each module.

-   **Pearson Correlation**  

     Pearson’s correlation statistic, or Pearson’s correlation coefficient, is also known in statistical models as the `r` value. For any two variables, it returns a value that indicates the strength of the correlation

     Pearson's correlation coefficient is computed by taking the covariance of two variables and dividing by the product of their standard deviations. The coefficient is not affected by changes of scale in the two variables.  

-   **Chi Squared**  

     The two-way chi-squared test is a statistical method that measures how close expected values are to actual results. The method assumes that variables are random and drawn from an adequate sample of independent variables. The resulting chi-squared statistic indicates how far results are from the expected (random) result.  


> [!TIP]
> If you need a different option for custom feature selection method, use the [Execute R Script](execute-r-script.md) module. 
##  How to configure Filter-Based Feature Selection

You choose a standard statistical metric, and the module computes the correlation between a pair of columns: the label column and a feature column

1.  Add the **Filter-Based Feature Selection** module to your pipeline. You can find it in the **Feature Selection** category in the designer.

2. Connect an input dataset that contains at least two columns that are potential features.  

    To ensure that a column should be analyzed and a feature score generated, use the [Edit Metadata](edit-metadata.md) module to set the **IsFeature** attribute. 

    > [!IMPORTANT]
    > Ensure that the columns you are providing as input are potential features. For example, a column that contains a single value has no information value.
    >
    > If you know there are columns that would make bad features, you can remove them from the column selection. You could also use the [Edit Metadata](edit-metadata.md) module to flag them as **Categorical**. 
3.  For **Feature scoring method**, choose one of the following established statistical methods to use in calculating scores.  

    | Method              | Requirements                             |
    | ------------------- | ---------------------------------------- |
    | Pearson Correlation | Label can be text or numeric. Features must be numeric. |
    Chi Squared| Labels and features can be text or numeric. Use this method for computing feature importance for two categorical columns.|

    > [!TIP]
    > If you change the selected metric, all other selections will be reset, so be sure to set this option first!)
4.  Select the **Operate on feature columns only** option to generate a score only for those columns that have been previously marked as features. 

    If you deselect this option, the module will create a score for any column that otherwise meets the criteria, up to the number of columns specified in **Number of desired features**.  

5.  For **Target column**, click **Launch column selector** to choose the label column either by name or by its index (indexes are one-based).  

     A label column is required for all methods that involve statistical correlation. The module returns a design-time error if you choose no label column or multiple label columns. 

6.  For **Number of desired features**, type the number of feature columns you want returned as a result.  

     - The minimum number of features you can specify is 1, but we recommend that you increase this value.  

     - If the specified number of desired features is greater than the number of columns in the dataset, then all features are returned, even those with zero scores.  

    - If you specify fewer result columns than there are feature columns, the features are ranked by descending score, and only the top features are returned. 

7.  Run the pipeline, or select the [Filter Based Feature Selection](filter-based-feature-selection.md) module and then click **Run selected**.


## Results

After processing is complete:

+ To see a complete list of the feature columns that were analyzed, and their scores, right-click the module, select **Features**, and click **Visualize**.  

+ To view the dataset that is generated based on your feature selection criteria, right-click the module, select **Dataset**, and click **Visualize**. 

If the dataset contains fewer columns than you expected, check the module settings, and the data types of the columns provided as input. For example, if you set **Number of desired features** to 1, the output dataset contains just two columns: the label column, and the most highly ranked feature column.


##  Technical notes  

### Implementation details

If you use Pearson Correlation on a numeric feature and a categorical label, the feature score is calculated as follows:  

1.  For each level in the categorical column, compute the conditional mean of numeric column.  

2.  Correlate the column of conditional means with the numeric column.  

### Requirements  

-   A feature selection score cannot be generated for any column that is designated as a **label** or as a **score** column.  

-   If you attempt to use a scoring method with a column of a data type not supported by the method, either the module will raise an error, or a zero score will be assigned to the column.  

-   If a column contains logical (true/false) values, they are processed as True = 1 and False = 0.  

-   A column cannot be a feature if it has been designated as a **Label** or a **Score**.  

### How missing values are handled  

-   You cannot specify as a target (label) column any column that has all missing values.  

-   If a column contains missing values, they are ignored when computing the score for the column.  

-   If a column designated as a feature column has all missing values, a zero score is assigned.   


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning service. 

