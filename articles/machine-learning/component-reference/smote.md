---
title: "SMOTE"
titleSuffix: Azure Machine Learning
description: Learn how to use the SMOTE component in Azure Machine Learning to increase the number of low-incidence examples in a dataset by using oversampling.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/16/2019
---
# SMOTE

This article describes how to use the SMOTE component in Azure Machine Learning designer to increase the number of underrepresented cases in a dataset that's used for machine learning. SMOTE is a better way of increasing the number of rare cases than simply duplicating existing cases.  

You connect the SMOTE component to a dataset that's *imbalanced*. There are many reasons why a dataset might be imbalanced. For example, the category you're targeting might be rare in the population, or the data might be difficult to collect. Typically, you use SMOTE when the *class* that you want to analyze is underrepresented. 
  
The component returns a dataset that contains the original samples. It also returns a number of synthetic minority samples, depending on the percentage that you specify.  
  
## More about SMOTE

Synthetic Minority Oversampling Technique (SMOTE) is a statistical technique for increasing the number of cases in your dataset in a balanced way. The component works by generating new instances from existing minority cases that you supply as input. This implementation of SMOTE does *not* change the number of majority cases.

The new instances are not just copies of existing minority cases. Instead, the algorithm takes samples of the *feature space* for each target class and its nearest neighbors. The algorithm then generates new examples that combine features of the target case with features of its neighbors. This approach increases the features available to each class and makes the samples more general.
  
SMOTE takes the entire dataset as an input, but it increases the percentage of only the minority cases. For example, suppose you have an imbalanced dataset where just 1 percent of the cases have the target value A (the minority class), and 99 percent of the cases have the value B. To increase the percentage of minority cases to twice the previous percentage, you would enter **200** for **SMOTE percentage** in the component's properties.  
  
## Examples  

We recommend that you try using SMOTE with a small dataset to see how it works. The following example uses the Blood Donation dataset available in Azure Machine Learning designer.
  
If you add the dataset to a pipeline and select **Visualize** on the dataset's output, you can see that of the 748 rows or cases in the dataset, 570 cases (76 percent) are of Class 0, and 178 cases (24 percent) are of Class 1. Although this result isn't terribly imbalanced, Class 1 represents the people who donated blood, so these rows contain the *feature space* that you want to model.
 
To increase the number of cases, you can set the value of **SMOTE percentage**, by using multiples of 100, as follows:

||Class 0|Class 1|total|  
|-|-------------|-------------|-----------|  
|Original dataset<br /><br /> (equivalent to **SMOTE percentage** = **0**)|570<br /><br /> 76%|178<br /><br /> 24%|748|  
|**SMOTE percentage** = **100**|570<br /><br /> 62%|356<br /><br /> 38%|926|  
|**SMOTE percentage** = **200**|570<br /><br /> 52%|534<br /><br /> 48%|1,104|  
|**SMOTE percentage** = **300**|570<br /><br /> 44%|712<br /><br /> 56%|1,282|  
  
> [!WARNING]
> Increasing the number of cases by using SMOTE is not guaranteed to produce more accurate models. Try pipelining with different percentages, different feature sets, and different numbers of nearest neighbors to see how adding cases influences your model.  
  
## How to configure SMOTE
  
1.  Add the SMOTE component to your pipeline. You can find the component under **Data Transformation components**, in the **Manipulation** category.

2. Connect the dataset that you want to boost. If you want to specify the feature space for building the new cases, either by using only specific columns or by excluding some, use the [Select Columns in Dataset](select-columns-in-dataset.md) component. You can then isolate the columns that you want to use before using SMOTE.
  
    Otherwise, creation of new cases through SMOTE is based on *all* the columns that you provide as inputs. At least one column of the feature columns is numeric.
  
3.  Ensure that the column that contains the label, or target class, is selected. SMOTE accepts only binary labels.
  
4.  The SMOTE component automatically identifies the minority class in the label column, and then gets all examples for the minority class. All columns can't have NaN values.
  
5.  In the **SMOTE percentage** option, enter a whole number that indicates the target percentage of minority cases in the output dataset. For example:  
  
    - You enter **0**. The SMOTE component returns exactly the same dataset that you provided as input. It adds no new minority cases. In this dataset, the class proportion has not changed.  
  
    - You enter **100**. The SMOTE component generates new minority cases. It adds the same number of minority cases that were in the original dataset. Because SMOTE does not increase the number of majority cases, the proportion of cases of each class has changed.  
  
    - You enter **200**. The component doubles the percentage of minority cases compared to the original dataset. This *does not* result in having twice as many minority cases as before. Rather, the size of the dataset is increased in such a way that the number of majority cases stays the same. The number of minority cases is increased until it matches the desired percentage value.  
  
    > [!NOTE]
    > Use only multiples of 100 for the SMOTE percentage.

6.  Use the **Number of nearest neighbors** option to determine the size of the feature space that the SMOTE algorithm uses in building new cases. A nearest neighbor is a row of data (a case) that's similar to a target case. The distance between any two cases is measured by combining the weighted vectors of all features.  
  
    + By increasing the number of nearest neighbors, you get features from more cases.
    + By keeping the number of nearest neighbors low, you use features that are more like those in the original sample.  
  
7. Enter a value in the **Random seed** box if you want to ensure the same results over runs of the same pipeline, with the same data. Otherwise, the component generates a random seed based on processor clock values when the pipeline is deployed. The generation of a random seed can cause slightly different results over runs.

8. Submit the pipeline.  
  
   The output of the component is a dataset that contains the original rows plus a number of added rows with minority cases.  

## Technical notes

+ When you're publishing a model that uses the **SMOTE** component, remove **SMOTE** from the predictive pipeline before it's published as a web service. The reason is that SMOTE is intended for improving a model during training, not for scoring. You might get an error if a published predictive pipeline contains the SMOTE component.

+ You can often get better results if you clean missing values or apply other transformations to fix data before you apply SMOTE. 

+ Some researchers have investigated whether SMOTE is effective on high-dimensional or sparse data, such as data used in text classification or genomics datasets. This paper has a good summary of the effects and of the theoretical validity of applying SMOTE in such cases: [Blagus and Lusa: SMOTE for high-dimensional class-imbalanced data](https://bmcbioinformatics.biomedcentral.com/articles/10.1186/1471-2105-14-106).

+ If SMOTE is not effective in your dataset, other approaches that you might consider include:
  + Methods for oversampling the minority cases or undersampling the majority cases.
  + Ensemble techniques that help the learner directly by using clustering, bagging, or adaptive boosting.


## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 
