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

# Tutorial: Bring your own data

In the previous [Tutorial: Train a model in the cloud](tutorial-1st-experiment-sdk-train.md) article, the CIFAR10 data was downloaded using the inbuilt `torchvision.datasets.CIFAR10` method in the PyTorch API. However, in many cases you are going to want to use your own data in a remote training run. This article focuses on the workflow you can leverage such that you can work with your own data in Azure Machine Learning. 

This article begins by uploading to Azure the CIFAR10 data followed by using that data in a remote training run. Along the way, you see how to add command-line arguments to your training script.

By the end of this article you would have a better understanding of:

- Best practices for working with cloud data in Azure Machine Learning
- Working with command-line arguments

The Azure Machine Learning concepts covered in this article are:

> [!div class="checklist"]
> - [ScriptRunConfig](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py): Passing script arguments.
> - [Datastore](https://docs.microsoft.com/python/api/azureml-core/azureml.core.datastore.datastore?view=azure-ml-py)
> - [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py)

## Prerequisites

- You have completed:
  - Setup on your [local computer](tutorial-1st-experiment-sdk-setup-local.md) or setup to use a [compute instance](tutorial-1st-experiment-sdk-setup-local.md)
  - [Tutorial: Hello Azure](tutorial-1st-experiment-hello-world.md)
  - [Tutorial: Train your first ML model](tutorial-1st-experiment-sdk-train.md)
- Familiarity with Python and Machine Learning concepts
- A local development environment - a laptop with Python installed and your favorite IDE (for example: VSCode, Pycharm, Jupyter, and so on).

## Adjust the training script

By now you have your training script (`quickstart/src/train.py`) running in Azure Machine Learning, and can monitor the model performance. Let's _parametrize_ the training script by introducing
arguments. Using arguments will allow you to easily compare different hyperparmeters.

Presently our training script is set to download the CIFAR10 dataset on each run. The python code below has been adjusted to read the data from a directory.

>[!NOTE] 
> The use of `argparse` to parametize the script.

```python
# quickstart/src/train.py
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
locally. Add to your quickstart directory structure a folder called `data`. Your directory structure should look like:

```txt
quickstart
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

If you did not run  locally, you won't have the `data/` directory. In this case, run the `torchvision.datasets.CIFAR10` method locally with
`download=True` in your `train.py` script.

To run the modified training script locally, we can call:

```bash
python src/train.py --data_path './data' --learning_rate 0.003 --momentum 0.92
```

You avoid having to download the CIFAR10 dataset by passing in a local path to the
data. Also you can experiment with different values for _learning rate_ and
_momentum_ hyperparameters without having to hard-code them in the training script.

## Upload the data to Azure

In order to run this script in Azure Machine Learning, we need to make your training data available in Azure. Your Azure Machine Learning workspace comes equipped with a _default_ **Datastore** - an Azure Blob storage account - that you can use to store your training data.

>[!NOTE] 
> Azure Machine Learning allows you to connect other cloud-based datastores that store your data. For more details, see [datastores documentation](./concept-data.md).  

Create a new (control-plane) python script called `05-upload-data.py` in the `quickstart` directory:

```python
# quickstart/05-upload-data.py
from azureml.core import Workspace
ws = Workspace.from_config()
datastore = ws.get_default_datastore()
datastore.upload(src_dir='./data', target_path='datasets/cifar10', overwrite=True)
```

The `target_path` specifies the path on the datastore where the CIFAR10 data will be uploaded.

>[!TIP] 
> Whilst you are using Azure Machine Learning to upload the data, you can use other methods such as `azcopy`, Azure Storage Explorer or Azure Data Factory to ingest your data into Azure.

Run the Python file to upload the data (Note: The run should be quick, less than 15 seconds.)

```bash
python 05-upload-data.py
```

To check the upload was successful:

1. Visit the [Azure portal](https://ms.portal.azure.com/)
1. Select your resource group.
1. Select your storage account. In your storage account, there is a container called "azureml-blobstore-GUID". You should find the CIFAR10 data uploaded to
the target path.

## Create a control-plane python script

Now let's see how to reference this data in a remote run, by getting the datastore associated to the workspace.

Putting it all together our `run.py` script looks like this:

```python
# run.py
from azureml.core import Workspace
from azureml.core import Experiment
from azureml.core import Environment
from azureml.core import ScriptRunConfig
from azureml.core import Dataset

if __name__ == "__main__":
    ws = Workspace.get(
        name="<workspace-name>",
        resource_group="<resource-group>",
        subscription_id="<subscription-id>",
    )
    
    datastore = ws.get_default_datastore()
    dataset = Dataset.File.from_files(path=(datastore, 'datasets/cifar10'))

    experiment = Experiment(workspace=ws, name='quickstart-session-3')

    config = ScriptRunConfig(
        source_directory='.',
        script='train.py',
        arguments=[
            '--dataset', data_path.as_mount(),
            '--learning_rate', 0.003,
            '--momentum', 0.92],
        )
    config.run_config.target = 'cpu-target'
    
    # set up pytorch environment
    env = Environment.from_conda_specification(
        name='pytorch-env',
        file_path='pytorch-env.yml',
    )
    config.run_config.environment = env

    run = experiment.submit(config)

    aml_url = run.get_portal_url()
    print(aml_url)
```

```python
datastore = ws.get_default_datastore()
```

### Understanding the code changes

To use this in AML, we create a **Dataset**:

```python
from azureml.core import Dataset
dataset = Dataset.File.from_files(path=(datastore, 'datasets/cifar10'))
```

A Dataset is a reference to data in a Datastore or behind public web urls.
They make it easy to use cloud data in AML.

> [!NOTE]
> Datasets are an abstraction layer on top of your data that are designed
> to improve reliability and trustworthiness. For example, they introduce
> the concept of versioned data making it easy to keep track of your data
> as it evolves over time.
> 
> For more on datasets, see our [documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py).

We can use this `Dataset` to create a reference to the CIFAR10 data as
an argument in the ScriptRunConfig:

```python
config = ScriptRunConfig(
    source_directory='.',
    script='train.py',
    arguments=[
        '--data_path', dataset.as_mount(),
        '--learning_rate', 0.003,
        '--momentum', 0.92]
    )
```

> [!NOTE]
> Notice that we specified `dataset.as_mount()`. This means that the directory
> specified will be _mounted_ to the compute target. Alternatively we could have
> the compute target download the data by declaring `.as_download()`.

## Submit run to Azure Machine Learning

Now resubmit the run to use the new configuration:

```bash
python run.py
```

## Clean up resources

Do not complete this section if you plan on running other Azure Machine Learning tutorials.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this session, we saw how to upload data to Azure using a `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using a `Dataset` you were able to mount a directory to the remote run. Using a `Dataset` also made it possible to alternate between local and cloud data.

Continue to other tutorials to learn how to:
- [Deploy your model](tutorial-deploy-models-with-aml.md) with Azure Machine Learning.
- Develop [automated machine learning](tutorial-auto-train-models.md) experiments.