---
title: "Train Pytorch Model"
titleSuffix: Azure Machine Learning
description: Learn how to train pytorch model from scratch or finetune it.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 05/26/2020
---

# Train Pytorch Model

This article describes how to use the **Train Pytorch Model** module in Azure Machine Learning designer (preview) to train pytorch models like DenseNet. Training takes place after you define a model and set its parameters, and requires labeled data. 

## How to use Train Pytorch Model 

1. Add [DenseNet](densenet.md) module or [ResNet](resnet.md) to your pipeline draft in the designer.

2. Add the **Train Pytorch Model** module to the pipeline. You can find this module under the **Model Training** category. Expand **Train**, and then drag the **Train Pytorch Model** module into your pipeline.

   > [!NOTE]
   > **Train Pytorch Model** module can only be run on **GPU** type compute, otherwise your pipeline will fail. You can select compute for specific module in the right pane of the module by setting **Use other compute target**.

3.  On the left input, attach an untrained model. Attach the training dataset and validation dataset to the middle and right-hand input of **Train Pytorch Model**.

    For untrained model, it must be a pytorch model like DenseNet; otherwise, a 'InvalidModelDirectoryError' will be thrown.

    For dataset, the training dataset must be a labeled image directory. Refer to **Convert to Image Directory** for how to get a labeled image directory. If not labeled, a 'NotLabeledDatasetError' will be thrown.

    The training dataset and validation dataset have the same label categories, otherwise a InvalidDatasetError will be thrown.

4.  For **Epochs**, specify how many epochs you'd like to train. The whole dataset will be iterated in every epoch, by default 5.

5.  For **Batch size**, specify how many instances to train in a batch, by default 16.

6.  For **Learning rate**, specify a value for the *learning rate*. The learning rate values controls the size of the step that is used in optimizer like sgd each time the model is tested and corrected.

    By making the rate smaller, you test the model more often, with the risk that you might get stuck in a local plateau. By making the step larger, you can converge faster, at the risk of overshooting the true minima. by default 0.001.

7.  For **Random seed**, optionally type an integer value to use as the seed. Using a seed is recommended if you want to ensure reproducibility of the experiment across runs.

8.  For **Patience**, specify how many epochs to early stop training if validation loss does not decrease consecutively. by default 3.

9.  Submit the pipeline. If your dataset has larger size, it will take a while.

## Results

After pipeline run is completed, to use the model for scoring, connect the [Train Pytorch Model](train-pytorch-model.md) to [Score Image Model](score-image-model.md), to predict values for new input examples.

## Technical notes
###  Expected inputs  

| Name               | Type                    | Description                              |
| ------------------ | ----------------------- | ---------------------------------------- |
| Untrained model    | UntrainedModelDirectory | Untrained model, require pytorch         |
| Training dataset   | ImageDirectory          | Training dataset                         |
| Validation dataset | ImageDirectory          | Validation dataset for evaluation every epoch |

###  Module parameters  

| Name          | Range            | Type    | Default | Description                              |
| ------------- | ---------------- | ------- | ------- | ---------------------------------------- |
| Epochs        | >0               | Integer | 5       | Select the column that contains the label or outcome column |
| Batch size    | >0               | Integer | 16      | How many instances to train in a batch   |
| Learning rate | >=double.Epsilon | Float   | 0.001   | The initial learning rate for the Stochastic Gradient Descent optimizer. |
| Random seed   | Any              | Integer | 1       | The seed for the random number generator used by the model. |
| Patience      | >0               | Integer | 3       | How many epochs to early stop training   |

###  Outputs  

| Name          | Type           | Description   |
| ------------- | -------------- | ------------- |
| Trained model | ModelDirectory | Trained model |

## Next steps

See the [set of modules available](module-reference.md) to Azure Machine Learning. 



