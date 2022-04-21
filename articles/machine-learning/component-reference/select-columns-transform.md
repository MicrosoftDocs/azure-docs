---
title: "Select Columns Transform: Component reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Select Columns Transform component in Azure Machine Learning designer to perform a select transformation.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 10/10/2020
---
# Select Columns Transform

This article describes how to use the Select Columns Transform component in Azure Machine Learning designer. The purpose of the Select Columns Transform component is to ensure that a predictable, consistent set of columns is used in downstream machine learning operations.

This component is helpful for tasks such as scoring, which require specific columns. Changes in the available columns might break the pipeline or change the results.

You use Select Columns Transform to create and save a set of columns. Then, use the [Apply Transformation](apply-transformation.md) component to apply those selections to new data.

## How to use Select Columns Transform

This scenario assumes that you want to use feature selection to generate a dynamic set of columns that will be used for training a model. To ensure that column selections are the same for the scoring process, you use the Select Columns Transform component to capture the column selections and apply them elsewhere in the pipeline.

1. Add an input dataset to your pipeline in the designer.

2. Add an instance of [Filter Based Feature Selection](filter-based-feature-selection.md).

3. Connect the components and configure the feature selection component to automatically find a number of best features in the input dataset.

4. Add an instance of [Train Model](train-model.md) and use the output of [Filter Based Feature Selection](filter-based-feature-selection.md) as the input for training.

    > [!IMPORTANT]
    > Because feature importance is based on the values in the column, you can't know in advance which columns might be available for input to [Train Model](train-model.md).  
5. Attach an instance of the Select Columns Transform component. 

    This step generates a column selection as a transformation that can be saved or applied to other datasets. This step ensures that the columns identified in feature selection are saved for other components to reuse.

6. Add the [Score Model](score-model.md) component. 

   *Do not connect the input dataset.* Instead, add the [Apply Transformation](apply-transformation.md) component, and connect the output of the feature selection transformation.

   The pipeline structure should be like following:

   > [!div class="mx-imgBorder"]
   > ![Sample pipeline](media/module/filter-based-feature-selection-score.png)

   > [!IMPORTANT]
   > You can't expect to apply [Filter Based Feature Selection](filter-based-feature-selection.md) to the scoring dataset and get the same results. Because feature selection is based on values, it might choose a different set of columns, which would cause the scoring operation to fail.
    
7. Submit the pipeline.

This process of saving and then applying a column selection ensures that the same data schema is available for training and scoring.


## Next steps

See the [set of components available](component-reference.md) to Azure Machine Learning. 
