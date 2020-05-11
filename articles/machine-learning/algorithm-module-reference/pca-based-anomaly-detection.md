---
title: "PCA-Based Anomaly Detection: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the PCA-Based Anomaly Detection module to create an anomaly detection model based on Principal Component Analysis (PCA).
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/22/2020
---

# PCA-Based Anomaly Detection

This article describes how to use the **PCA-Based Anomaly Detection** module in Azure Machine Learning designer (preview), to create an anomaly detection model based on Principal Component Analysis (PCA).

This module helps you build a model in scenarios where it is easy to obtain training data from one class, such as valid transactions, but difficult to obtain sufficient samples of the targeted anomalies. 

For example, to detect fraudulent transactions, very often you don't have enough examples of fraud to train on, but have many examples of good transactions. The **PCA-Based Anomaly Detection** module solves the problem by analyzing available features to determine what constitutes a "normal" class, and applying distance metrics to identify cases that represent anomalies. This lets you train a model using existing imbalanced data.

## More about Principal Component Analysis

*Principal Component Analysis*, which is frequently abbreviated to PCA, is an established technique in machine learning. PCA is frequently used in exploratory data analysis because it reveals the inner structure of the data and explains the variance in the data.

PCA works by analyzing data that contains multiple variables. It looks for correlations among the variables and determines the combination of values that best captures differences in outcomes. These combined feature values are used to create a more compact feature space called the *principal components*.

For anomaly detection, each new input is analyzed, and the anomaly detection algorithm computes its projection on the eigenvectors, together with a normalized reconstruction error. The normalized error is used as the anomaly score. The higher the error, the more anomalous the instance is.

For more information about how PCA works, and about the implementation for anomaly detection, see these papers:

- [A randomized algorithm for principal component analysis](https://arxiv.org/abs/0809.2274). Rokhlin, Szlan, and Tygert

- [Finding Structure with Randomness: Probabilistic Algorithms for Constructing Approximate Matrix Decompositions](http://users.cms.caltech.edu/~jtropp/papers/HMT11-Finding-Structure-SIREV.pdf) (PDF download). Halko, Martinsson, and Tropp.

## How to configure PCA Anomaly Detection

1. Add the **PCA-Based Anomaly Detection** module to your pipeline in the designer. You can find this module in the **Anomaly Detection** category.

2. In the right panel of the **PCA-Based Anomaly Detection** module, click the **Training mode** option, and indicate whether you want to train the model using a specific set of parameters, or use a parameter sweep to find the best parameters.

    - **Single Parameter**:  Select this option if you know how you want to configure the model, and provide a specific set of values as arguments.

3. **Number of components to use in PCA**: Specify the number of output features, or components, that you want to output.

    The decision of how many components to include is an important part of experiment design using PCA. General guidance is that you should not include the same number of PCA components as there are variables. Instead, you should start with some smaller number of components and increase them until some criteria is met.

    The best results are obtained when the number of output components is **less than** the number of feature columns available in the dataset.

4. Specify the amount of oversampling to perform during randomized PCA training. In anomaly detection problems, imbalanced data makes it difficult to apply standard PCA techniques. By specifying some amount of oversampling, you can increase the number of target instances.

    If you specify 1, no oversampling is performed. If you specify any value higher than 1, additional samples are generated to use in training the model.

    There are two options, depending on whether you are using a parameter sweep or not:

    - **Oversampling parameter for randomized PCA**: Type a single whole number that represents the ratio of oversampling of the minority class over the normal class. (Available when using the **Single parameter** training method.)

    > [!NOTE]
    > You cannot view the oversampled data set. For more information of how oversampling is used with PCA, see [Technical notes](#technical-notes).

5. **Enable input feature mean normalization**:   Select this option to normalize all input features to a mean of zero. Normalization or scaling to zero is generally recommended for PCA, because the goal of PCA is to maximize variance among variables.

     This option is selected by default. Deselect this option if values have already been normalized using a different method or scale.

6. Connect a tagged training dataset, and one of the  training modules:

    - If you set the **Create trainer mode** option to **Single Parameter**, use the [Train Anomaly Detection Model](train-anomaly-detection-model.md) module.

7. Submit the pipeline.

## Results

When training is complete, you can either save the trained model, or connect it to the [Score Model](score-model.md) module to predict anomaly scores.

Evaluating the results of an anomaly detection model requires some additional steps:

1. Ensure that a score column is available in both datasets

    If you try to evaluate an anomaly detection model and get the error, "There is no score column in scored dataset to compare", it means you are using a typical evaluation dataset that contains a label column but no probability scores. You need to choose a dataset that matches the schema output for anomaly detection models, which includes a **Scored Labels** and **Scored Probabilities** column.

2. Ensure that label columns are marked

    Sometimes the metadata associated with the label column is removed in the pipeline graph. If this happens, when you use the [Evaluate Model](evaluate-model.md) module to compare the results of two anomaly detection models, you might get the error, "There is no label column in scored dataset", or "There is no label column in scored dataset to compare".

    You can avoid this error by adding the [Edit Metadata](edit-metadata.md) module before the [Evaluate Model](evaluate-model.md) module. Use the column selector to choose the class column, and in the **Fields** dropdown list, select **Label**.

3. Use [Execute Python Script](execute-python-script.md) to adjust label column categories as 1(positive, normal) and 0(negative, abnormal).

    ````
    label_column_name = 'XXX'
    anomaly_label_category = YY
    dataframe1[label_column_name] = dataframe1[label_column_name].apply(lambda x: 0 if x == anomaly_label_category else 1)
    ````

    ​
## Technical notes

This algorithm uses PCA to approximate the subspace containing the normal class. The subspace is spanned by eigenvectors associated with the top eigenvalues of the data covariance matrix. For each new input, the anomaly detector first computes its projection on the eigenvectors, and then computes the normalized reconstruction error. This error is the anomaly score. The higher the error, the more anomalous the instance. For details on how the normal space is computed, see Wikipedia: [Principal Component Analysis](https://wikipedia.org/wiki/Principal_component_analysis) 


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 

See [Exceptions and error codes for the designer (preview)](designer-error-codes.md) for a list of errors specific to the designer modules.''