---
title: 'Tutorial: Enable credits and run Azure Dev/Test offer training scripts'
titleSuffix: Azure Dev/Test offer
description: A step-by-step tutorial for enabling credits and running a training script in your Azure Dev/Test offer subscription.
ms.topic: tutorial
ms.prod: visual-studio-windows
ms.author: jametra
author: jamestramel
ms.date: 10/05/2021
ms.custom: devtestoffer
adobe-target: true
---

# Tutorial: Enable credits in your subscription

This tutorial shows you how to upload and use your own data to train machine learning models in Azure Dev/Test offer. This tutorial is *part 3 of a three-part tutorial series*.  

In [Part 2: Train a model](../../machine-learning/tutorial-1st-experiment-sdk-train.md), you trained a model in the cloud, using sample data from `PyTorch`.  You also downloaded that data through the `torchvision.datasets.CIFAR10` method in the PyTorch API. In this tutorial, you'll use the downloaded data to learn the workflow for working with your own data in Azure Dev/Test offer.

In this tutorial, you:

> [!div class="checklist"]
> * Upload data to Azure.
> * Create a control script.
> * Understand the new Azure DevTest offer concepts (passing parameters, datasets, datastores).
> * Submit and run your training script.
> * View your code output in the cloud.

## Prerequisites

You'll need the data that was downloaded in the previous tutorial.  Make sure you have completed these steps:

1. [Create the training script](../../machine-learning/tutorial-1st-experiment-sdk-train.md#create-training-scripts).  
1. [Test locally](../../machine-learning/tutorial-1st-experiment-sdk-train.md#test-local).

## Adjust the training script

By now you have your training script (get-started/src/train.py) running in Azure Dev/Test offer, and you can monitor the model performance. Let's parameterize the training script by introducing arguments. Using arguments will allow you to easily compare different hyperparameters.

Our training script is currently set to download the CIFAR10 dataset on each run. The following Python code has been adjusted to read the data from a directory.

## <a name="submit-to-cloud"></a> Submit the run to Azure DevTest offer

Select **Save and run script in terminal**  to run the *run-pytorch-data.py* script.  This run will train the model on the compute cluster using the data you uploaded.

This code will print a URL to the experiment in the Azure Dev/Test offer studio. If you go to that link, you'll be able to see your code running.


### <a name="inspect-log"></a> Inspect the log file

In the studio, go to the experiment run (by selecting the previous URL output) followed by **Outputs + logs**. Select the `70_driver_log.txt` file. Scroll down through the log file until you see the following output:

```txt
Processing 'input'.
Processing dataset FileDataset
{
  "source": [
    "('workspaceblobstore', 'datasets/cifar10')"
  ],
  "definition": [
    "GetDatastoreFiles"
  ],
  "registration": {
    "id": "XXXXX",
    "name": null,
    "version": null,
    "workspace": "Workspace.create(name='XXXX', subscription_id='XXXX', resource_group='X')"
  }
}
Mounting input to /tmp/tmp9kituvp3.
Mounted input to /tmp/tmp9kituvp3 as folder.
Exit __enter__ of DatasetContextManager
Entering Run History Context Manager.
Current directory:  /mnt/batch/tasks/shared/LS_root/jobs/dsvm-aml/azureml/tutorial-session-3_1600171983_763c5381/mounts/workspaceblobstore/azureml/tutorial-session-3_1600171983_763c5381
Preparing to call script [ train.py ] with arguments: ['--data_path', '$input', '--learning_rate', '0.003', '--momentum', '0.92']
After variable expansion, calling script [ train.py ] with arguments: ['--data_path', '/tmp/tmp9kituvp3', '--learning_rate', '0.003', '--momentum', '0.92']

Script type = None
===== DATA =====
DATA PATH: /tmp/tmp9kituvp3
LIST FILES IN DATA PATH...
['cifar-10-batches-py', 'cifar-10-python.tar.gz']
```

[!Note:]
Azure Dev/Test offer has mounted Blob Storage to the compute cluster automatically for you. The ``dataset.as_named_input('input').as_mount()`` used in the control script resolves to the mount point.  

## Clean up resources

If you plan to continue now to another tutorial, or to start your own training runs, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, on the left, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.


### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, we saw how to upload data to Azure by using `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using `Dataset`, you were able to mount a directory to the remote run.

Now that you have a model, learn:

> [!div class="nextstepaction"]
> [How to deploy models with Azure Dev/Test offer](../../machine-learning/how-to-deploy-and-where.md).
