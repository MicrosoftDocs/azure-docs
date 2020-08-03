---
title: "Train Anomaly Detection Model: Module reference"
titleSuffix: Azure Machine Learning
description: Learn how to use the Train Anomaly Detection Model module to create a trained anomaly detection model.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 02/22/2020
---

# Train Anomaly Detection Model module

This article describes how to use the Train Anomaly Detection Model module in Azure Machine Learning designer (preview) to create a trained anomaly detection model.

The module takes as input a set of parameters for an anomaly detection model and an unlabeled dataset. It returns a trained anomaly detection model, together with a set of labels for the training data.  

For more information about the anomaly detection algorithms provided in the designer, see [PCA-Based Anomaly Detection](pca-based-anomaly-detection.md).  

## How to configure Train Anomaly Detection Model 

1.  Add the **Train Anomaly Detection Model** module to your pipeline in the designer. You can find this module in the **Anomaly Detection** category.

2. Connect one of the modules designed for anomaly detection, such as [PCA-Based Anomaly Detection](pca-based-anomaly-detection.md).

    Other types of models are not supported. When you run the pipeline, you'll get the error "All models must have the same learner type."  

3.  Configure the anomaly detection module by choosing the label column and setting other parameters specific to the algorithm.  

4.  Attach a training dataset to the right-side input of **Train Anomaly Detection Model**.  

5.  Submit the pipeline.  

## Results

After training is complete:

+ To view the model's parameters, right-click the module and select **Visualize**. 

+ To create predictions, use the [Score Model](score-model.md) module with new input data.

+ To save a snapshot of the trained model, select the module. Then select the **Register dataset** icon under the **Outputs+logs** tab in the right panel.   

 
## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 

See [Exceptions and error codes for the designer (preview)](designer-error-codes.md) for a list of errors specific to the designer modules.
'