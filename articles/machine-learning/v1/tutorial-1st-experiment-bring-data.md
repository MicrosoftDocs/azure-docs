---
title: "Tutorial: Upload data and train a model (SDK v1)"
titleSuffix: Azure Machine Learning
description: How to upload and use your own data in a remote training job, with SDK v1. This is part 3 of a three-part getting-started series.
services: machine-learning
ms.service: machine-learning
ms.subservice: training
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 07/29/2022
ms.custom: UpdateFrequency5, tracking-python, contperf-fy21q3, FY21Q4-aml-seo-hack, contperf-fy21q4, sdkv1, event-tier1-build-2022, ignite-2022
---

# Tutorial: Upload data and train a model (SDK v1, part 3 of 3)

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]


This tutorial shows you how to upload and use your own data to train machine learning models in Azure Machine Learning. This tutorial is *part 3 of a three-part tutorial series*.  

In [Part 2: Train a model](tutorial-1st-experiment-sdk-train.md), you trained a model in the cloud, using sample data from `PyTorch`.  You also downloaded that data through the `torchvision.datasets.CIFAR10` method in the PyTorch API. In this tutorial, you'll use the downloaded data to learn the workflow for working with your own data in Azure Machine Learning.

In this tutorial, you:

> [!div class="checklist"]
> * Upload data to Azure.
> * Create a control script.
> * Understand the new Azure Machine Learning concepts (passing parameters, datasets, datastores).
> * Submit and run your training script.
> * View your code output in the cloud.

## Prerequisites

You'll need the data that was downloaded in the previous tutorial.  Make sure you have completed these steps:

1. [Create the training script](tutorial-1st-experiment-sdk-train.md#create-training-scripts).  
1. [Test locally](tutorial-1st-experiment-sdk-train.md#test-locally).

## Adjust the training script

By now you have your training script (get-started/src/train.py) running in Azure Machine Learning, and you can monitor the model performance. Let's parameterize the training script by introducing arguments. Using arguments will allow you to easily compare different hyperparameters.

Our training script is currently set to download the CIFAR10 dataset on each run. The following Python code has been adjusted to read the data from a directory.

>[!NOTE] 
> The use of `argparse` parameterizes the script.

1. Open *train.py* and replace it with this code:

    ```python
    import os
    import argparse
    import torch
    import torch.optim as optim
    import torchvision
    import torchvision.transforms as transforms
    from model import Net
    from azureml.core import Run
    run = Run.get_context()
    if __name__ == "__main__":
        parser = argparse.ArgumentParser()
        parser.add_argument(
            '--data_path',
            type=str,
            help='Path to the training data'
        )
        parser.add_argument(
            '--learning_rate',
            type=float,
            default=0.001,
            help='Learning rate for SGD'
        )
        parser.add_argument(
            '--momentum',
            type=float,
            default=0.9,
            help='Momentum for SGD'
        )
        args = parser.parse_args()
        print("===== DATA =====")
        print("DATA PATH: " + args.data_path)
        print("LIST FILES IN DATA PATH...")
        print(os.listdir(args.data_path))
        print("================")
        # prepare DataLoader for CIFAR10 data
        transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
        ])
        trainset = torchvision.datasets.CIFAR10(
            root=args.data_path,
            train=True,
            download=False,
            transform=transform,
        )
        trainloader = torch.utils.data.DataLoader(
            trainset,
            batch_size=4,
            shuffle=True,
            num_workers=2
        )
        # define convolutional network
        net = Net()
        # set up pytorch loss /  optimizer
        criterion = torch.nn.CrossEntropyLoss()
        optimizer = optim.SGD(
            net.parameters(),
            lr=args.learning_rate,
            momentum=args.momentum,
        )
        # train the network
        for epoch in range(2):
            running_loss = 0.0
            for i, data in enumerate(trainloader, 0):
                # unpack the data
                inputs, labels = data
                # zero the parameter gradients
                optimizer.zero_grad()
                # forward + backward + optimize
                outputs = net(inputs)
                loss = criterion(outputs, labels)
                loss.backward()
                optimizer.step()
                # print statistics
                running_loss += loss.item()
                if i % 2000 == 1999:
                    loss = running_loss / 2000
                    run.log('loss', loss)  # log loss metric to AML
                    print(f'epoch={epoch + 1}, batch={i + 1:5}: loss {loss:.2f}')
                    running_loss = 0.0
        print('Finished Training')
    ```

1. **Save** the file.  Close the tab if you wish.

### Understanding the code changes

The code in `train.py` has used the `argparse` library to set up `data_path`, `learning_rate`, and `momentum`.

```python
# .... other code
parser = argparse.ArgumentParser()
parser.add_argument('--data_path', type=str, help='Path to the training data')
parser.add_argument('--learning_rate', type=float, default=0.001, help='Learning rate for SGD')
parser.add_argument('--momentum', type=float, default=0.9, help='Momentum for SGD')
args = parser.parse_args()
# ... other code
```

Also, the `train.py` script was adapted to update the optimizer to use the user-defined parameters:

```python
optimizer = optim.SGD(
    net.parameters(),
    lr=args.learning_rate,     # get learning rate from command-line argument
    momentum=args.momentum,    # get momentum from command-line argument
)
```


## Upload the data to Azure

To run this script in Azure Machine Learning, you need to make your training data available in Azure. Your Azure Machine Learning workspace comes equipped with a _default_ datastore. This is an Azure Blob Storage account where you can store your training data.

>[!NOTE] 
> Azure Machine Learning allows you to connect other cloud-based datastores that store your data. For more details, see the [datastores documentation](./concept-data.md).  

1. Create a new Python control script in the **get-started** folder (make sure it is in **get-started**, *not* in the **/src** folder).  Name the script *upload-data.py* and copy this code into the file:
    
    ```python
    # upload-data.py
    from azureml.core import Workspace
    from azureml.core import Dataset
    from azureml.data.datapath import DataPath
    
    ws = Workspace.from_config()
    datastore = ws.get_default_datastore()
    Dataset.File.upload_directory(src_dir='data', 
                                  target=DataPath(datastore, "datasets/cifar10")
                                 )  
    ```

    The `target_path` value specifies the path on the datastore where the CIFAR10 data will be uploaded.

    >[!TIP] 
    > While you're using Azure Machine Learning to upload the data, you can use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload ad hoc files. If you need an ETL tool, you can use [Azure Data Factory](../../data-factory/introduction.md) to ingest your data into Azure.

2. Select **Save and run script in terminal** to run the *upload-data.py* script.

    You should see the following standard output:

    ```txt
    Uploading ./data\cifar-10-batches-py\data_batch_2
    Uploaded ./data\cifar-10-batches-py\data_batch_2, 4 files out of an estimated total of 9
    .
    .
    Uploading ./data\cifar-10-batches-py\data_batch_5
    Uploaded ./data\cifar-10-batches-py\data_batch_5, 9 files out of an estimated total of 9
    Uploaded 9 files
    ```

## Create a control script

As you've done previously, create a new Python control script called *run-pytorch-data.py* in the **get-started** folder:

```python
# run-pytorch-data.py
from azureml.core import Workspace
from azureml.core import Experiment
from azureml.core import Environment
from azureml.core import ScriptRunConfig
from azureml.core import Dataset

if __name__ == "__main__":
    ws = Workspace.from_config()
    datastore = ws.get_default_datastore()
    dataset = Dataset.File.from_files(path=(datastore, 'datasets/cifar10'))

    experiment = Experiment(workspace=ws, name='day1-experiment-data')

    config = ScriptRunConfig(
        source_directory='./src',
        script='train.py',
        compute_target='cpu-cluster',
        arguments=[
            '--data_path', dataset.as_named_input('input').as_mount(),
            '--learning_rate', 0.003,
            '--momentum', 0.92],
    )

    # set up pytorch environment
    env = Environment.from_conda_specification(
        name='pytorch-env',
        file_path='pytorch-env.yml'
    )
    config.run_config.environment = env

    run = experiment.submit(config)
    aml_url = run.get_portal_url()
    print("Submitted to compute cluster. Click link below")
    print("")
    print(aml_url)
```

> [!TIP]
> If you used a different name when you created your compute cluster, make sure to adjust the name in the code `compute_target='cpu-cluster'` as well.

### Understand the code changes

The control script is similar to the one from [part 3 of this series](tutorial-1st-experiment-sdk-train.md), with the following new lines:

:::row:::
   :::column span="":::
      `dataset = Dataset.File.from_files( ... )`
   :::column-end:::
   :::column span="2":::
      A [dataset](/python/api/azureml-core/azureml.core.dataset.dataset) is used to reference the data you uploaded to Azure Blob Storage. Datasets are an abstraction layer on top of your data that are designed to improve reliability and trustworthiness.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `config = ScriptRunConfig(...)`
   :::column-end:::
   :::column span="2":::
      [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig) is modified to include a list of arguments that will be passed into `train.py`. The `dataset.as_named_input('input').as_mount()` argument means the specified directory will be _mounted_ to the compute target.
   :::column-end:::
:::row-end:::

## Submit the run to Azure Machine Learning

Select **Save and run script in terminal**  to run the *run-pytorch-data.py* script.  This run will train the model on the compute cluster using the data you uploaded.

This code will print a URL to the experiment in the Azure Machine Learning studio. If you go to that link, you'll be able to see your code running.

> [!NOTE]
> You may see some warnings starting with *Failure while loading azureml_run_type_providers...*. You can ignore these warnings. Use the link at the bottom of these warnings to view your output.


### Inspect the log file

In the studio, go to the experiment job (by selecting the previous URL output) followed by **Outputs + logs**. Select the `std_log.txt` file. Scroll down through the log file until you see the following output:

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
Entering Job History Context Manager.
Current directory:  /mnt/batch/tasks/shared/LS_root/jobs/dsvm-aml/azureml/tutorial-session-3_1600171983_763c5381/mounts/workspaceblobstore/azureml/tutorial-session-3_1600171983_763c5381
Preparing to call script [ train.py ] with arguments: ['--data_path', '$input', '--learning_rate', '0.003', '--momentum', '0.92']
After variable expansion, calling script [ train.py ] with arguments: ['--data_path', '/tmp/tmp9kituvp3', '--learning_rate', '0.003', '--momentum', '0.92']

Script type = None
===== DATA =====
DATA PATH: /tmp/tmp9kituvp3
LIST FILES IN DATA PATH...
['cifar-10-batches-py', 'cifar-10-python.tar.gz']
```

Notice:

- Azure Machine Learning has mounted Blob Storage to the compute cluster automatically for you.
- The ``dataset.as_named_input('input').as_mount()`` used in the control script resolves to the mount point.


## Clean up resources

If you plan to continue now to another tutorial, or to start your own training jobs, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, on the left, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.


### Delete all resources

[!INCLUDE [aml-delete-resource-group](../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, we saw how to upload data to Azure by using `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using `Dataset`, you were able to mount a directory to the remote job.

Now that you have a model, learn:

> [!div class="nextstepaction"]
> [How to deploy MLflow models](how-to-deploy-mlflow-models.md).
