---
title: "Tutorial: Bring your own data"
titleSuffix: Azure Machine Learning
description: Part 4 of the Azure ML Get Started series shows how to use your own data in a remote training run.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 09/09/2020
ms.custom: tracking-python
---

# Tutorial: Bring your own data (Part 4 of 4)

In the previous Tutorial: Train a model in the cloud article, the CIFAR10 data was downloaded using the inbuilt `torchvision.datasets.CIFAR10` method in the PyTorch API. However, in many cases you are going to want to use your own data in a remote training run. This article focuses on the workflow you can leverage such that you can work with your own data in Azure Machine Learning.

This tutorial begins by uploading to Azure the CIFAR10 data followed by using that data in a remote training run. Along the way, you see how to add command-line arguments to your training script.

By the end of this tutorial you would have a better understanding of:

> [!div class="checklist"]
> * Best practices for working with cloud data in Azure Machine Learning
> * Working with command-line arguments

The Azure Machine Learning concepts covered in this Tutorial are:

> [!div class="checklist"]
> * ScriptRunConfig: Passing script arguments.
> * Datastore
> * Dataset

## Prerequisites

You have completed:

* Setup on your local computer or setup to use a compute instance
    * Tutorial: Hello Azure
    * Tutorial: Train a model in the cloud
* Familiarity with Python and Machine Learning concepts
* A local development environment - a laptop with Python installed and your favorite IDE (for example: VSCode, Pycharm, Jupyter, and so on).

## Adjust the training script
By now you have your training script (tutorial/src/train.py) running in Azure Machine Learning, and can monitor the model performance. Let's parametrize the training script by introducing arguments. Using arguments will allow you to easily compare different hyperparmeters.

Presently our training script is set to download the CIFAR10 dataset on each run. The python code below has been adjusted to read the data from a directory.

>[!NOTE] 
> The use of `argparse` to parametize the script.

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

The code used in `train.py` has leveraged the `argparse` library to set up the `data_path`, `learning_rate`, and `momentum`.

```python
# .... other code
parser = argparse.ArgumentParser()
parser.add_argument('--data_path', type=str, help='Path to the training data')
parser.add_argument('--learning_rate', type=float, default=0.001, help='Learning rate for SGD')
parser.add_argument('--momentum', type=float, default=0.9, help='Momentum for SGD')
args = parser.parse_args()
# ... other code
```

Also the `train.py` script was adapted to update the optimizer to use the user-defined parameters:

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

If you did not run `train.py` locally in the previous tutorial, you won't have the `data/` directory. In this case, run the `torchvision.datasets.CIFAR10` method locally with
`download=True` in your `train.py` script.

To run the modified training script locally, call:

```bash
python src/train.py --data_path ./data --learning_rate 0.003 --momentum 0.92
```

You avoid having to download the CIFAR10 dataset by passing in a local path to the
data. Also you can experiment with different values for _learning rate_ and
_momentum_ hyperparameters without having to hard-code them in the training script.

## Upload the data to Azure

In order to run this script in Azure Machine Learning, you need to make your training data available in Azure. Your Azure Machine Learning workspace comes equipped with a _default_ **Datastore** - an Azure Blob storage account - that you can use to store your training data.

>[!NOTE] 
> Azure Machine Learning allows you to connect other cloud-based datastores that store your data. For more details, see [datastores documentation](./concept-data.md).  

Create a new Python control script called `05-upload-data.py` in the `tutorial` directory:

```python
# tutorial/05-upload-data.py
from azureml.core import Workspace
ws = Workspace.from_config()
datastore = ws.get_default_datastore()
datastore.upload(src_dir='./data', target_path='datasets/cifar10', overwrite=True)
```

The `target_path` specifies the path on the datastore where the CIFAR10 data will be uploaded.

>[!TIP] 
> Whilst you are using Azure Machine Learning to upload the data, you can use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload ad-hoc files. If you need an ETL tool, [Azure Data Factory](https://docs.microsoft.com/azure/data-factory/introduction) can be used to ingest your data into Azure.

Run the Python file to upload the data (Note: The upload should be quick, less than 60 seconds.)

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

As you have done previously, create a new Python control script called `06-run-pytorch-data.py`:

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

    experiment = Experiment(workspace=ws, name='tutorial-session-3')

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

- **`dataset = Dataset.File.from_files(path=(datastore, 'datasets/cifar10'))`**: A Dataset is used to reference the data you uploaded to the Azure Blob Store. Datasets are an abstraction layer on top of your data that are designed to improve reliability and trustworthiness.
- **`config = ScriptRunConfig(...)`**: We modified the `ScriptRunConfig` to include a list of arguments that will be passed into `train.py`. We also specified `dataset.as_named_input('input').as_mount()`, which means the directory specified will be _mounted_ to the compute target.

## Submit run to Azure Machine Learning

Now resubmit the run to use the new configuration:

```bash
python 06-run-pytorch-data.py
```

This will print a URL to the Experiment in Azure Machine Learning Studio. If you navigate to that link you will be able to see your code running.

### Inspect the 70_driver_log log file


In the Azure Machine Learning studio navigate to the experiment run (by clicking the URL output from the above cell) followed by **Outputs + logs**. Click on the 70_driver_log.txt file - you should see the following output:

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

1. Azure Machine Learning has mounted the blob store to the compute cluster automatically for you.
2. The ``dataset.as_named_input('input').as_mount()`` used in the control script resolves to the mount point

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, we saw how to upload data to Azure using a `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using a `Dataset` you were able to mount a directory to the remote run. 

In this session, you saw how to upload data to Azure using a `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

- The Azure Machine Learning VS Code Extension: This makes it easier to submit remote runs, and also interact with Azure Machine Learning. For example, you can upload data, create experiments, etc.

> [!div class="nextstepaction"]
> [Tutorial: Clean up Resources](tutorial-1st-experiment-cleanup.md)
