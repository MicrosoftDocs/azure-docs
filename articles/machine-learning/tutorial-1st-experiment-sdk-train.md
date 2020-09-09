---
title: "Tutorial: Train your first Azure ML model in Python"
titleSuffix: Azure Machine Learning
description: Part 2 of the Azure ML Get Started series shows how to to train a PyTorch model on the CIFAR 10 dataset.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 09/09/2020
ms.custom: devx-track-python
---

# Tutorial: Train your first ML model

In the [previous tutorial](tutorial-1st-experiment-hello-azure.md), you ran a trivial "Hello world!" script in the cloud using AzureML's Python SDK. This time you take it a step further by submitting a script that will train an ML-model.

This tutorial shows you how to train a PyTorch model on the [CIFAR 10](https://www.cs.toronto.edu/~kriz/cifar.html) dataset. Using this example we will show you how to ensure a consistent behavior between local testing and remote runs.

This example will help you understand how AzureML eases consistent behavior between local debugging and remote runs.

>[!NOTE] 
> The concepts in this article apply to *any* ML Code and not just PyTorch.

This article will demonstrate to you these AzureML concepts:
- [Environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py)
- [Run](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py) 
- [AzureML Metrics](https://docs.microsoft.com/azure/machine-learning/how-to-track-experiments)

Learning these concepts means that by the end of this session, you can:

> [!div class="checklist"]
> * Use Conda to define an AzureML environment.
> * Train a model in the cloud.
> * Log metrics to AzureML.


## Prerequisites

- You have completed the following:
  - Setup on your [local computer](tutorial-1st-experiment-sdk-setup-local.md) or setup to use a [compute instance](tutorial-1st-experiment-sdk-setup-local.md).
  - [Tutorial: Hello Azure](tutorial-1st-experiment-hello-azure.md)
- Familiarity with Python and Machine Learning concepts.
- If using your local computer, a local development environment - a laptop with Python installed and your favorite IDE (for example: VSCode, Pycharm, Jupyter, and so on).

## Create training scripts

First you define the CNN architecture in a `model.py` file. All your training code will go into the `src` subdirectory - including `model.py`.

The code below is taken from [this introductory example](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html) from PyTorch.

```python
# quickstart/src/model.py
import torch.nn as nn
import torch.nn.functional as F


class Net(nn.Module):
    def __init__(self):
        super(Net, self).__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)

    def forward(self, x):
        x = self.pool(F.relu(self.conv1(x)))
        x = self.pool(F.relu(self.conv2(x)))
        x = x.view(-1, 16 * 5 * 5)
        x = F.relu(self.fc1(x))
        x = F.relu(self.fc2(x))
        x = self.fc3(x)
        return x
```

Next you define the training script. This script downloads the CIFAR10 dataset using PyTorch `torchvision.dataset` APIs, sets up the network defined in
`model.py`, and trains it for two epochs using standard SGD and cross-entropy loss.

Create a `train.py` script in the `src` subdirectory:

```python
# quickstart/src/train.py
import torch
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms

from model import Net


# download CIFAR 10 data
trainset = torchvision.datasets.CIFAR10(
    root="./data",
    train=True,
    download=True,
    transform=torchvision.transforms.ToTensor(),
)
trainloader = torch.utils.data.DataLoader(
    trainset, batch_size=4, shuffle=True, num_workers=2
)

if __name__ == "__main__":

    # define convolutional network
    net = Net()

    # set up pytorch loss /  optimizer
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)

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
                print(f"epoch={epoch + 1}, batch={i + 1:5}: loss {loss:.2f}")
                running_loss = 0.0

    print("Finished Training")

```

You now have the directory structure outlined below:

```txt
quickstart
└──.azureml
|  └──config.json
└──src
|  └──hello.py
|  └──model.py
|  └──train.py
└──01-create-workspace.py
└──02-create-compute.py
└──03-run-hello.py
```

## Define a Python Environment

For demonstration purposes, we're going to use a Conda environment (the steps for a pip virtual environment are almost identical).

Create a file called `pytorch-env.yml` in the `.azureml` hidden directory:

```yml
# quickstart/.azureml/pytorch-env.yml
name: pytorch-env
channels:
    - defaults
    - pytorch
dependencies:
    - python=3.6.2
    - pytorch
    - torchvision
```

This environment has all the dependencies that your model and training script require. Notice there's no dependency on the AzureML Python
SDK.

## Test locally

Test your script runs locally using this environment with:

```bash
conda env create -f pytorch-env.yml    # create conda environment
conda activate pytorch-env             # activate conda environment
python src/train.py                    # train model
```

>[!NOTE] 
> If you prefer to use an IDE, you can configure the IDE to use this environment.

## Create the control-plane script

The difference to the control-plane the script below and the one used to submit "hello world" is that you add a couple of extra lines to set the environment.

Create a new python file in the `quickstart` directory called `04-run-pytorch.py`:

```python
# quickstart/04-run-pytorch.py
from azureml.core import Workspace
from azureml.core import Experiment
from azureml.core import Environment
from azureml.core import ScriptRunConfig

if __name__ == "__main__":
    ws = Workspace.from_config()
    experiment = Experiment(workspace=ws, name='quickstart-session-3')
    config = ScriptRunConfig(source_directory='src', script='train.py', compute_target='cpu-cluster')

    # set up pytorch environment
    env = Environment.from_conda_specification(name='pytorch-env', file_path='.azureml/pytorch-env.yml')
    config.run_config.environment = env

    run = experiment.submit(config)

    aml_url = run.get_portal_url()
    print(aml_url)
```

### Understand these two additional lines

1. **`env = Environment.from_conda_specification(name='pytorch-env', file_path='.azureml/pytorch-env.yml')`** AzureML provides the concept of an `Environment` to represent a reproducible, versioned
Python environment for running experiments. It's easy to create an environment from a local Conda or pip environment.
1. **`config.run_config.environment = env`** adds the environment to the ScriptRunConfig.

> [!TIP]
> There are many ways to create AML environments, including [from a pip requirements.txt](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-pip-requirements-name--file-path-),
> or even [from an existing local Conda environment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py#from-existing-conda-environment-name--conda-environment-name-).

## Submit to compute cluster

In case you switched local environments, make sure you switch back to an environment with the AzureML Python SDK installed and run:

```bash
python 04-run-pytorch.py
```

>[!NOTE] 
> The first time you run this script, AzureML will build a new docker image from your PyTorch
environment. The whole run could take 5-10 minutes to complete. You can see the docker build
logs in the AzureML Studio: Follow the link to the ML Studio > Select "Outputs + logs" tab > Select `20_image_build_log.txt`.
This image will be reused in future runs making them run much quicker.

Once your image is built, select `70_driver_log.txt` to see the output of your training script.

```txt
Downloading https://www.cs.toronto.edu/~kriz/cifar-10-python.tar.gz to ./data/cifar-10-python.tar.gz
...
Files already downloaded and verified
epoch=1, batch= 2000: loss 2.19
epoch=1, batch= 4000: loss 1.82
epoch=1, batch= 6000: loss 1.66
epoch=1, batch= 8000: loss 1.58
epoch=1, batch=10000: loss 1.52
epoch=1, batch=12000: loss 1.47
epoch=2, batch= 2000: loss 1.39
epoch=2, batch= 4000: loss 1.38
epoch=2, batch= 6000: loss 1.37
epoch=2, batch= 8000: loss 1.33
epoch=2, batch=10000: loss 1.31
epoch=2, batch=12000: loss 1.27
Finished Training
```

> [!WARNING]
> If you see an error `Your total snapshot size exceeds the limit` it indicates that the
> `data` directory is located in the `source_directory` used in the `ScriptRunConfig`.
> Make sure to move `data` outside of `src`.

### A note on registered environments

Environments can be registered to a workspace with `env.register(ws)`, allowing them to be easily shared, reused, and versioned. Environments make it easy to reproduce previous results and to collaborate with your team.

To register this environment with the workspace:

```python
env.register(ws)
```

AzureML also maintains a collection of curated environments. These environments cover common ML scenarios and are backed by cached Docker images. Cached Docker images make the first remote run faster.

In short, using registered environments can save you time!

To view all environments registered to a workspace:

```python
from azureml.core import Environment
envs = Environment.list(ws)
# returns Dict[str, Environemt] of all environments registered to `ws`
```

Now team member can make use of the `pytorch-env` environment you created:

```python
env = envs['pytorch-env']
```

## Log training metrics

Now that you have a model training in AzureML, start tracking some performance metrics.
The current training script prints metrics to the terminal. AzureML provides a
mechanism for logging metrics with more functionality. By adding a few lines of code, you gain the ability to visualize metrics in the studio and to compare metrics between multiple runs.

### Modify `train.py` to include logging

Modify your `train.py` script to include an additional two lines of code:

```python
# train.py
import torch
import torch.optim as optim
import torchvision
import torchvision.transforms as transforms

from model import Net
from azureml.core import Run


# ADDITIONAL CODE: get AML run from the current context
run = Run.get_context()

# download CIFAR 10 data
trainset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=torchvision.transforms.ToTensor())
trainloader = torch.utils.data.DataLoader(trainset, batch_size=4, shuffle=True, num_workers=2)

if __name__ == "__main__":

    # define convolutional network
    net = Net()

    # set up pytorch loss /  optimizer
    criterion = torch.nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.001, momentum=0.9)

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
                run.log('loss', loss) # ADDITIONAL CODE: log loss metric to AML
                print(f'epoch={epoch + 1}, batch={i + 1:5}: loss {loss:.2f}')
                running_loss = 0.0

    print('Finished Training')
```

### Understanding the additional two lines of code

In `train.py`, you access the run object from _within_ the training script itself using the `Run.get_context()` method and use it to log metrics:

```python
# in train.py
run = Run.get_context()
...
run.log('loss', loss)
```

Metrics in AzureML are:

- Organized by experiment and run so it's easy to keep track of and
compare metrics.
- Equipped with a UI so we can visualize training performance in the studio.
- Designed to scale, so you keep these benefits even as you run hundreds of
experiments.

### Update the conda environment file

The `train.py` script just took a new dependency on `azureml.core`. Update `pytorch-env.yml`
to reflect this change:

```yaml
# quickstart/.azureml/pytorch-env.yml
name: pytorch-env
channels:
    - defaults
    - pytorch
dependencies:
    - python=3.6.2
    - pytorch
    - torchvision
    - pip
    - pip:
        - azureml-sdk
```

### Submit script to AzureML
Submit this script once more:

```bash
python 04-run-pytorch.py
```

This time when you visit the studio, go to the "Metrics" tab where you can now see
live updates on the model training loss!

:::image type="content" source="media/tutorial-1st-experiment-sdk-train/logging-metrics.png" alt-text="Training loss graph in the Metrics tab":::

## Clean up resources

Do not complete this section if you plan on running other Azure Machine Learning tutorials.

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this session, you upgraded from a basic "Hello world!" script to a more realistic
training script that required a specific Python environment to run. You saw how
to take a local Conda environment to the cloud with AzureML Environments. Finally, you
saw how in a few lines of code you can log metrics to AzureML.

In the next session, you'll see how to work with data in AzureML by uploading the CIFAR10
dataset to Azure.

> [!div class="nextstepaction"]
> [Tutorial: Bring your own data](tutorial-1st-experiment-bring-data.md)
