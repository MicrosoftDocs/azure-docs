---
title: "Tutorial: Use your own data"
titleSuffix: Azure Machine Learning
description: Part 4 of the Azure Machine Learning get-started series shows how to use your own data in a remote training run.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 09/15/2020
ms.custom: tracking-python
---

# Tutorial: Use your own data (part 4 of 4)

This tutorial shows you how to upload and use your own data to train machine learning models in Azure Machine Learning.

This tutorial is *part 4 of a four-part tutorial series* in which you learn the fundamentals of Azure Machine Learning and complete jobs-based machine learning tasks in Azure. This tutorial builds on the work you completed in [Part 1: Set up](tutorial-1st-experiment-sdk-setup-local.md), [Part 2: Run "Hello World!"](tutorial-1st-experiment-hello-world.md), and [Part 3: Train a model](tutorial-1st-experiment-sdk-train.md).

In [Part 3: Train a model](tutorial-1st-experiment-sdk-train.md), data was downloaded through the inbuilt `torchvision.datasets.CIFAR10` method in the PyTorch API. However, in many cases you'll want to use your own data in a remote training run. This article shows the workflow that you can use to work with your own data in Azure Machine Learning.

In this tutorial, you:

> [!div class="checklist"]
> * Configure a training script to use data in a local directory.
> * Test the training script locally.
> * Upload data to Azure.
> * Create a control script.
> * Understand the new Azure Machine Learning concepts (passing parameters, datasets, datastores).
> * Submit and run your training script.
> * View your code output in the cloud.

## Prerequisites

* Completion of [part 3](tutorial-1st-experiment-sdk-train.md) of the series.
* Introductory knowledge of the Python language and machine learning workflows.
* Local development environment, such as Visual Studio Code, Jupyter, or PyCharm.
* Python (version 3.5 to 3.7).

## Adjust the training script
By now you have your training script (tutorial/src/train.py) running in Azure Machine Learning, and you can monitor the model performance. Let's parameterize the training script by introducing arguments. Using arguments will allow you to easily compare different hyperparameters.

Our training script is now set to download the CIFAR10 dataset on each run. The following Python code has been adjusted to read the data from a directory.

>[!NOTE] 
> The use of `argparse` parameterizes the script.

```python
# tutorial/src/train.py
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
    parser.add_argument('--data_path', type=str, help='Path to the training data')
    parser.add_argument('--learning_rate', type=float, default=0.001, help='Learning rate for SGD')
    parser.add_argument('--momentum', type=float, default=0.9, help='Momentum for SGD')
    args = parser.parse_args()
    
    print("===== DATA =====")
    print("DATA PATH: " + args.data_path)
    print("LIST FILES IN DATA PATH...")
    print(os.listdir(args.data_path))
    print("================")
    
    # prepare DataLoader for CIFAR10 data
    transform = transforms.Compose([transforms.ToTensor(), transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))])
    trainset = torchvision.datasets.CIFAR10(
        root=args.data_path,
        train=True,
        download=False,
        transform=transform,
    )
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=4, shuffle=True, num_workers=2)

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
                run.log('loss', loss) # log loss metric to AML
                print(f'epoch={epoch + 1}, batch={i + 1:5}: loss {loss:.2f}')
                running_loss = 0.0

    print('Finished Training')
```

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

## Test the script locally

Your script now accepts _data path_ as an argument. To start with, test it
locally. Add to your tutorial directory structure a folder called `data`. Your directory structure should look like:

```txt
tutorial
└──.azureml
|  └──config.json
|  └──pytorch-env.yml
└──data
└──src
|  └──hello.py
|  └──model.py
|  └──train.py
└──01-create-workspace.py
└──02-create-compute.py
└──03-run-hello.py
└──04-run-pytorch.py
```

If you didn't run `train.py` locally in the previous tutorial, you won't have the `data/` directory. In this case, run the `torchvision.datasets.CIFAR10` method locally with `download=True` in your `train.py` script.

To run the modified training script locally, call:

```bash
python src/train.py --data_path ./data --learning_rate 0.003 --momentum 0.92
```

You avoid having to download the CIFAR10 dataset by passing in a local path to the data. You can also experiment with different values for _learning rate_ and _momentum_ hyperparameters without having to hard-code them in the training script.

## Upload the data to Azure

To run this script in Azure Machine Learning, you need to make your training data available in Azure. Your Azure Machine Learning workspace comes equipped with a _default_ datastore. This is an Azure Blob Storage account where you can store your training data.

>[!NOTE] 
> Azure Machine Learning allows you to connect other cloud-based datastores that store your data. For more details, see the [datastores documentation](./concept-data.md).  

Create a new Python control script called `05-upload-data.py` in the `tutorial` directory:

```python
# tutorial/05-upload-data.py
from azureml.core import Workspace
ws = Workspace.from_config()
datastore = ws.get_default_datastore()
datastore.upload(src_dir='./data', target_path='datasets/cifar10', overwrite=True)
```

The `target_path` value specifies the path on the datastore where the CIFAR10 data will be uploaded.

>[!TIP] 
> While you're using Azure Machine Learning to upload the data, you can use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload ad hoc files. If you need an ETL tool, you can use [Azure Data Factory](../data-factory/introduction.md) to ingest your data into Azure.

Run the Python file to upload the data. (The upload should be quick, less than 60 seconds.)

```bash
python 05-upload-data.py
```
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

As you've done previously, create a new Python control script called `06-run-pytorch-data.py`:

```python
# tutorial/06-run-pytorch-data.py
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
    env = Environment.from_conda_specification(name='pytorch-env',file_path='.azureml/pytorch-env.yml')
    config.run_config.environment = env

    run = experiment.submit(config)
    aml_url = run.get_portal_url()
    print("Submitted to an Azure Machine Learning compute cluster. Click on the link below")
    print("")
    print(aml_url)
```

### Understand the code changes

The control script is similar to the one from [part 3 of this series](tutorial-1st-experiment-sdk-train.md), with the following new lines:

:::row:::
   :::column span="":::
      `dataset = Dataset.File.from_files( ... )`
   :::column-end:::
   :::column span="2":::
      A [dataset](/python/api/azureml-core/azureml.core.dataset.dataset?preserve-view=true&view=azure-ml-py) is used to reference the data you uploaded to Azure Blob Storage. Datasets are an abstraction layer on top of your data that are designed to improve reliability and trustworthiness.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `config = ScriptRunConfig(...)`
   :::column-end:::
   :::column span="2":::
      [ScriptRunConfig](/python/api/azureml-core/azureml.core.scriptrunconfig?preserve-view=true&view=azure-ml-py) is modified to include a list of arguments that will be passed into `train.py`. The `dataset.as_named_input('input').as_mount()` argument means the specified directory will be _mounted_ to the compute target.
   :::column-end:::
:::row-end:::

## Submit the run to Azure Machine Learning

Now resubmit the run to use the new configuration:

```bash
python 06-run-pytorch-data.py
```

This code will print a URL to the experiment in the Azure Machine Learning studio. If you go to that link, you'll be able to see your code running.

### Inspect the log file

In the studio, go to the experiment run (by selecting the previous URL output) followed by **Outputs + logs**. Select the `70_driver_log.txt` file. You should see the following output:

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

Notice:

- Azure Machine Learning has mounted Blob Storage to the compute cluster automatically for you.
- The ``dataset.as_named_input('input').as_mount()`` used in the control script resolves to the mount point.

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, we saw how to upload data to Azure by using `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using `Dataset`, you were able to mount a directory to the remote run. 

Now that you have a model, learn:

* How to [deploy models with Azure Machine Learning](how-to-deploy-and-where.md).