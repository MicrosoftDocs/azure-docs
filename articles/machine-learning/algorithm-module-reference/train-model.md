---
title:  "Train Model: Module Reference"
titleSuffix: Azure Machine Learning
description: Learn  how to use the **Train Model** module in Azure Machine Learning to train a classification or regression model. 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: xiaoharper
ms.author: zhanxia
ms.date: 10/22/2019
---
# Train Model module

This article describes a module in Azure Machine Learning designer.

Use this module to train a classification or regression model. Training takes place after you have defined a model and set its parameters, and requires tagged data. You can also use **Train Model** to retrain an existing model with new data. 

## How the training process works

In Azure Machine Learning, creating and using a machine learning model is typically a three-step process. 

1. You configure a model, by choosing a particular type of algorithm, and defining its parameters or hyperparameters. Choose any of the following model types: 

    + **Classification** models, based on neural networks, decision trees, and decision forests, and other algorithms.
    + **Regression** models, which can include standard linear regression, or which use other algorithms, including neural networks and Bayesian regression.  

2. Provide a dataset that is labeled, and has data compatible with the algorithm. Connect both the data and the model to **Train Model**.

    What training produces is a specific binary format, the iLearner, that encapsulates the statistical patterns learned from the data. You cannot directly modify or read this format; however, other modules can use this trained model. 
    
    You can also view properties of the model. For more information, see the Results section.

3. After training is completed, use the trained model with one of the [scoring modules](./score-model.md), to make predictions on new data.

## How to use **Train Model**  
  
1.  In Azure Machine Learning, configure a classification model or regression model.
    
2. Add the **Train Model** module to the pipeline.  You can find this module under the **Machine Learning** category. Expand **Train**, and then drag the **Train Model** module into your pipeline.
  
3.  On the left input, attach the untrained mode. Attach the training dataset to the right-hand input of **Train Model**.

    The training dataset must contain a label column. Any rows without labels are ignored.
  
4.  For **Label column**, click **Launch column selector**, and choose a single column that contains outcomes the model can use for training.
  
    - For classification problems, the label column must contain either **categorical** values or **discrete** values. Some examples might be a yes/no rating, a disease classification code or name, or an income group.  If you pick a noncategorical column, the module will return an error during training.
  
    -   For regression problems, the label column must contain **numeric** data that represents the response variable. Ideally the numeric data represents a continuous scale. 
    
    Examples might be a credit risk score, the projected time to failure for a hard drive, or the forecasted number of calls to a call center on a given day or time.  If you do not choose a numeric column, you might get an error.
  
    -   If you do not specify which label column to use, Azure Machine Learning will try to infer which is the appropriate label column, by using the metadata of the dataset. If it picks the wrong column, use the column selector to correct it.
  
    > [!TIP] 
    > If you have trouble using the Column Selector, see the article [Select Columns in Dataset](./select-columns-in-dataset.md) for tips. It describes some common scenarios and tips for using the **WITH RULES** and **BY NAME** options.
  
5.  Run the pipeline. If you have a lot of data, this can take a while.

## <a name="bkmk_results"></a> Results

After the model is trained:


+ To use the model in other pipelines, select the module and select the **Register dataset** icon under the **Outputs** tab in right panel. You can access saved models in the module palette under **Datasets**.

+ To use the model in predicting new values, connect it to the [Score Model](./score-model.md) module, together with new input data.


## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 