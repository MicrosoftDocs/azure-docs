---
title: "Train Pytorch Model"
titleSuffix: Azure Machine Learning
description: Use the Train Pytorch Models module in Azure Machine Learning designer to train models from scratch, or fine-tune existing models.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

author: likebupt
ms.author: keli19
ms.date: 03/19/2021
---

# Train Pytorch Model

This article describes how to use the **Train Pytorch Model** module in Azure Machine Learning designer to train pytorch models like DenseNet. Training takes place after you define a model and set its parameters, and requires labeled data. 

Currently, **Train Pytorch Model** module supports both single node and distributed training.

## How to use Train Pytorch Model 

1. Add [DenseNet](densenet.md) module or [ResNet](resnet.md) to your pipeline draft in the designer.

2. Add the **Train Pytorch Model** module to the pipeline. You can find this module under the **Model Training** category. Expand **Train**, and then drag the **Train Pytorch Model** module into your pipeline.

   > [!NOTE]
   > **Train Pytorch Model** module is better run on **GPU** type compute for large dataset, otherwise your pipeline will fail. You can select compute for specific module in the right pane of the module by setting **Use other compute target**.

3.  On the left input, attach an untrained model. Attach the training dataset and validation dataset to the middle and right-hand input of **Train Pytorch Model**.

    For untrained model, it must be a pytorch model like DenseNet; otherwise, a 'InvalidModelDirectoryError' will be thrown.

    For dataset, the training dataset must be a labeled image directory. Refer to **Convert to Image Directory** for how to get a labeled image directory. If not labeled, a 'NotLabeledDatasetError' will be thrown.

    The training dataset and validation dataset have the same label categories, otherwise a InvalidDatasetError will be thrown.

4.  For **Epochs**, specify how many epochs you'd like to train. The whole dataset will be iterated in every epoch, by default 5.

5.  For **Batch size**, specify how many instances to train in a batch, by default 16.

6.  For **Learning rate**, specify a value for the *learning rate*. Learning rate controls the size of the step that is used in optimizer like sgd each time the model is tested and corrected.

    By making the rate smaller, you test the model more often, with the risk that you might get stuck in a local plateau. By making the step larger, you can converge faster, at the risk of overshooting the true minima. by default 0.001.

7.  For **Random seed**, optionally type an integer value to use as the seed. Using a seed is recommended if you want to ensure reproducibility of the experiment across runs.

8.  For **Patience**, specify how many epochs to early stop training if validation loss does not decrease consecutively. by default 3.

9.  Submit the pipeline. If your dataset has larger size, it will take a while and GPU compute are recommended.

## Distributed training

In distributed training the workload to train a model is split up and shared among multiple mini processors, called worker nodes. These worker nodes work in parallel to speed up model training. Currently the designer support distributed training for **Train Pytorch Model** module.

### How to enable distributed training

To enable distributed training for **Train Pytorch Model** module, you can set in **Run settings** in the right pane of the module. Only **[AML Compute cluster](https://docs.microsoft.com/azure/machine-learning/how-to-create-attach-compute-cluster?tabs=python)** is supported for distributed training.

1. Select the module and open the right panel. Expand the **Run settings** section.

    ![Screenshot showing how to set distributed training in runsetting](./media/module/distributed-training-runsetting.png)

1. Make sure you have select AML compute for the compute target.

1. In **Resource layout** section, you need to set the following values:

    - **Node count** : Number of nodes in the compute target used for training. It should be **less than or equal to** the **Maximum number of nodes** your compute cluster. By default it is 1, which means single node job.

    - **Process count per node**: Number of processes triggered per node. It should be **less than or equal to** the **Processing Unit** of your compute. By default it is 1, which means single node job.

    You can check the **Maximum number of nodes** and **Processing Unit** of your compute by clicking the compute name into the compute detail page.

    ![Screenshot showing how to check compute cluster](./media/module/compute-cluster-node.png)

You can learn more about distributed training in Azure Machine Learning [here](https://docs.microsoft.com/azure/machine-learning/concept-distributed-training).

### Troubleshooting for distributed training

If you enable distributed training for this module, there will be driver logs for each process. `70_driver_log_0` is for master process. You can check driver logs for error details of each process under **Outputs+logs** tab in the right pane.

![Screenshot showing driver log](./media/module/distributed-training-error-driver-log.png) 

If the module enabled distributed training fails without any `70_driver` logs, you can check `70_mpi_log` for error details.

The following example shows a common error, which is **Process count per node** is larger than **Processing Unit** of the compute.

![Screenshot showing mpi log](./media/module/distributed-training-error-mpi-log.png)

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



