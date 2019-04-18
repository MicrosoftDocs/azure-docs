---
title: "Classification: Predict credit risk (cost sensitive)"
titleSuffix: Azure Machine Learning service
description: This visual interface sample experiment demonstrates how to use a customized Python script to perform cost-sensitive binary classification. It predicts credit risk based on information provided in a credit application.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: article
author: xiaoharper
ms.author: zhanxia
ms.reviewer: sgilley
ms.date: 05/06/2019
---

# Sample 4 - Classification: Predict credit risk (cost sensitive)

This visual interface sample experiment shows how to use a customized Python script to perform cost-sensitive binary classification. The cost of misclassifying the positive samples is five times the cost of misclassifying the negative samples.

This sample predicts credit risk based on information provided in a credit application, taking into account the misclassification costs.

In this experiment, we compare two different approaches for generating models to solve this problem:

- Training with the original dataset.
- Training with a replicated dataset.

With both approaches, we evaluate the models by using the test dataset with replication to ensure that results are aligned with the cost function. We test two classifiers with both approaches: **Two-Class Support Vector Machine** and **Two-Class Boosted Decision Tree**.

## Prerequisites

[!INCLUDE [aml-ui-prereq](../../../includes/aml-ui-prereq.md)]

4. Select the **Open** button for the Sample 4 experiment:

    ![Open the experiment](media/ui-sample-classification-predict-credit-risk-cost-sensitive/open-sample4.png)

## Related sample

See [Sample 3 - Classification: Credit Risk Prediction (Basic)](sample-classification-predict-churn.md) for a basic experiment that solves the same problem as this experiment, without adjusting for misclassification costs.

## Data

We use the German Credit Card dataset from the UC Irvine repository. This dataset contains 1,000 samples with 20 features and 1 label. Each sample represents a person. The 20 features include numerical and categorical features. See the [UCI website](https://archive.ics.uci.edu/ml/datasets/Statlog+%28German+Credit+Data%29) for more information about the dataset. The last column is the label, which denotes the credit risk and has only two possible values: high credit risk = 2, and low credit risk = 1.

## Experiment summary

The cost of misclassifying a low-risk example as high is 1, and the cost of misclassifying a high-risk example as low is 5. We use an **Execute Python Script** module to account for this misclassification cost.

Here's the graph of the experiment:

![Graph of the experiment](media/ui-sample-classification-predict-credit-risk-cost-sensitive/graph.png)

## Data processing

We start by using the **Metadata Editor** module to add column names to replace the default column names with more meaningful names, obtained from the dataset description on the UCI site. We provide the new column names as comma-separated values in the **New column** name field of the **Metadata Editor**.

Next, we generate the training and test sets used to develop the risk prediction model. We split the original dataset into training and test sets of the same size by using the **Split Data** module. To create sets of equal size, we set the **Fraction of rows in the first output dataset** option to 0.5.

### Generate the new dataset

Because the cost of underestimating risk is high, we set the cost of misclassification like this:

- For high-risk cases misclassified as low risk: 5
- For low-risk cases misclassified as high risk: 1

To reflect this cost function, we generate a new dataset. In the new dataset, each high-risk example is replicated five times, but the number of low-risk examples doesn't change. We split the data into training and test datasets before replication to prevent the same row from being in both sets.

To replicate the high-risk data, we put this Python code into an **Execute Python Script** module:

```
import pandas as pd

def azureml_main(dataframe1 = None, dataframe2 = None):

    df_label_1 = dataframe1[dataframe1.iloc[:, 20] == 1]
    df_label_2 = dataframe1[dataframe1.iloc[:, 20] == 2]

    result = df_label_1.append([df_label_2] * 5, ignore_index=True)
    return result,
```

The **Execute Python Script** module replicates both the training and test datasets.

### Feature engineering

The **Two-Class Support Vector Machine** algorithm requires normalized data. So we use the **Normalize Data** module to normalize the ranges of all numeric features with a `tanh` transformation. A `tanh` transformation converts all numeric features to values within a range of 0 and 1 while preserving the overall distribution of values.

The **Two-Class Support Vector Machine** module handles string features, converting them to categorical features and then to binary features with a value of 0 or 1. So we don't need to normalize these features.

## Models

Because we apply two classifiers, **Two-Class Support Vector Machine** (SVM) and **Two-Class Boosted Decision Tree**, and also use two datasets, we generate a total of four models:

- SVM trained with original data.
- SVM trained with replicated data.
- Boosted Decision Tree trained with original data.
- Boosted Decision Tree trained with replicated data.

We use the standard experimental workflow to create, train, and test the models:

1. Initialize the learning algorithms, using **Two-Class Support Vector Machine** and **Two-Class Boosted Decision Tree**.
1. Use **Train Model** to apply the algorithm to the data and create the actual model.
3. Use **Score Model** to produce scores by using the test examples.

The following diagram shows a portion of this experiment, in which the original and replicated training sets are used to train two different SVM models. **Train Model** is connected to the training set, and **Score Model** is connected to the test set.

![Experiment graph](media/ui-sample-classification-predict-credit-risk-cost-sensitive/score-part.png)


In the evaluation stage of the experiment, we compute the accuracy of each of the four models. For this experiment, we use **Evaluate Model** to compare examples that have the same misclassification cost.

The **Evaluate Model** module can compute the performance metrics for as many as two scored models. So we use one instance of **Evaluate Model** to evaluate the two SVM models and another instance of **Evaluate Model** to evaluate the two Boosted Decision Tree models.

Notice that the replicated test dataset is used as the input for **Score Model**. In other words, the final accuracy scores include the cost for getting the labels wrong.

## Combine multiple results

The **Evaluate Model** module produces a table with a single row that contains various metrics. To create a single set of accuracy results, we first use **Add Rows** to combine the results into a single table. We then use the following Python script in the **Execute Python Script** module to add the model name and training approach for each row in the table of results:

```
import pandas as pd

def azureml_main(dataframe1 = None, dataframe2 = None):

    new_cols = pd.DataFrame(
            columns=["Algorithm","Training"],
            data=[
                ["SVM", "weighted"],
                ["SVM", "unweighted"],
                ["Boosted Decision Tree","weighted"],
                ["Boosted Decision Tree","unweighted"]
            ])

    result = pd.concat([new_cols, dataframe1], axis=1)
    return result,
```


## Results

To view the results of the experiment, you can right-click the Visualize output of the last **Select Columns in Dataset** module.

![Visualize output](media/ui-sample-classification-predict-credit-risk-cost-sensitive/result.png)

The first column lists the machine learning algorithm used to generate the model.
The second column indicates the type of the training set.
The third column contains the cost-sensitive accuracy value.

From these results, you can see that the best accuracy is provided by the model that was created with **Two-Class Support Vector Machine** and trained on the replicated training dataset.

## Clean up resources

[!INCLUDE [aml-ui-cleanup](../../../includes/aml-ui-cleanup.md)]

## Next steps

Explore the other samples available for the visual interface:

- [Sample 1 - Regression: Predict an automobile's price](sample-regression-predict-automobile-price-basic.md)
- [Sample 2 - Regression: Compare algorithms for automobile price prediction](sample-regression-predict-automobile-price-compare-algorithms.md)
- [Sample 3 - Classification: Predict credit risk](sample-classification-predict-credit-risk-basic.md)
- [Sample 5 - Classification: Predict churn](sample-classification-predict-churn.md)
