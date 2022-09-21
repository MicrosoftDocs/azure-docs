---
title: "Tutorial: Train a first Python machine learning model (SDK v2)"
titleSuffix: Azure Machine Learning
description: How to train a machine learning model in Azure Machine Learning. This is part 2 of a three-part getting-started series.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 07/10/2022
ms.custom: devx-track-python, contperf-fy21q3, FY21Q4-aml-seo-hack, contperf-fy21q, sdkv2
---

# Tutorial: Train your first machine learning model (part 2 of 3)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](v1/tutorial-1st-experiment-sdk-train.md)
> * [v2 (preview)](tutorial-1st-experiment-sdk-train.md)

This tutorial shows you how to train a machine learning model in Azure Machine Learning. This tutorial is _part 2 of a three-part tutorial series_.

In [Part 1: Run "Hello world!"](tutorial-1st-experiment-hello-world.md) of the series, you learned how to use a control script to run a job in the cloud.

In this tutorial, you take the next step by submitting a script that trains a machine learning model. This example will help you understand how Azure Machine Learning eases consistent behavior between local debugging and remote runs.

In this tutorial, you:

> [!div class="checklist"]
> * Create a training script.
> * Use Conda to define an Azure Machine Learning environment.
> * Create a control script.
> * Understand Azure Machine Learning classes (`Environment`, `Run`, `Metrics`).
> * Submit and run your training script.
> * View your code output in the cloud.
> * Log metrics to Azure Machine Learning.
> * View your metrics in the cloud.

## Prerequisites

- Completion of [part 1](tutorial-1st-experiment-hello-world.md) of the series.

## Create training scripts

First you define the neural network architecture in a *model.py* file. All your training code will go into the `src` subdirectory, including *model.py*.

The training code is taken from [this introductory example](https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html) from PyTorch. Note that the Azure Machine Learning concepts apply to any machine learning code, not just PyTorch.

1. Create a *model.py* file in the **src** subfolder. Copy this code into the file:

    ```python
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

1. On the toolbar, select **Save** to save the file. Close the tab if you wish.

1. Next, define the training script, also in the **src** subfolder. This script downloads the CIFAR10 dataset by using PyTorch `torchvision.dataset` APIs, sets up the network defined in *model.py*, and trains it for two epochs by using standard SGD and cross-entropy loss.

    Create a *train.py* script in the **src** subfolder:

    ```python
    import torch
    import torch.optim as optim
    import torchvision
    import torchvision.transforms as transforms
    
    from model import Net
    
    # download CIFAR 10 data
    trainset = torchvision.datasets.CIFAR10(
        root="../data",
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

1. You now have the following folder structure:

    :::image type="content" source="media/tutorial-1st-experiment-sdk-train/directory-structure.png" alt-text="Directory structure shows train.py in src subdirectory":::

## <a name="test-local"></a> Test locally

Select **Save and run script in terminal** to run the *train.py* script directly on the compute instance.

After the script completes, select **Refresh** above the file folders. You'll see the new data folder called **get-started/data** Expand this folder to view the downloaded data.

:::image type="content" source="media/tutorial-1st-experiment-hello-world/directory-with-data.png" alt-text="Screenshot of folders shows new data folder created by running the file locally.":::

## Create a Python environment

Azure Machine Learning provides the concept of an [environment](/python/api/azureml-core/azureml.core.environment.environment) to represent a reproducible, versioned Python environment for running experiments. It's easy to create an environment from a local Conda or pip environment.

First you'll create a file with the package dependencies.

1. Create a new file in the **get-started** folder called `pytorch-env.yml`:

    ```yml
    name: pytorch-env
    channels:
        - defaults
        - pytorch
    dependencies:
        - python=3.8.5
        - pytorch
        - torchvision
    ```
1. On the toolbar, select **Save** to save the file.  Close the tab if you wish.

## <a name="create-local"></a> Create the control script

The difference between the following control script and the one that you used to submit "Hello world!" is that you add a couple of extra lines to set the environment.

Create a new Python file in the **get-started** folder called `run-pytorch.py`:

```python
# run-pytorch.py
from azure.ai.ml import MLClient, command, Input
from azure.identity import DefaultAzureCredential
from azure.ai.ml.entities import Environment
from azureml.core import Workspace

if __name__ == "__main__":
    # get details of the current Azure ML workspace
    ws = Workspace.from_config()

    # default authentication flow for Azure applications
    default_azure_credential = DefaultAzureCredential()
    subscription_id = ws.subscription_id
    resource_group = ws.resource_group
    workspace = ws.name

    # client class to interact with Azure ML services and resources, e.g. workspaces, jobs, models and so on.
    ml_client = MLClient(
        default_azure_credential,
        subscription_id,
        resource_group,
        workspace)

    env_name = "pytorch-env"
    env_docker_image = Environment(
        image="pytorch/pytorch:latest",
        name=env_name,
        conda_file="pytorch-env.yml",
    )
    ml_client.environments.create_or_update(env_docker_image)

    # target name of compute where job will be executed
    computeName="cpu-cluster"
    job = command(
        code="./src",
        command="python train.py",
        environment=f"{env_name}@latest",
        compute=computeName,
        display_name="day1-experiment-train",
    )

    returned_job = ml_client.create_or_update(job)
    aml_url = returned_job.studio_url
    print("Monitor your job at", aml_url)
```

> [!TIP]
> If you used a different name when you created your compute cluster, make sure to adjust the name in the code `computeName='cpu-cluster'` as well.

### Understand the code changes

:::row:::
   :::column span="":::
      `env_docker_image = ...`
   :::column-end:::
   :::column span="2":::
      Creates the custom environment against the pytorch base image, with additional conda file to install.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `environment=f"{env_name}@latest"`
   :::column-end:::
   :::column span="2":::
      Adds the environment to [command](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command).
   :::column-end:::
:::row-end:::

## <a name="submit"></a> Submit the job to Azure Machine Learning

1. Select **Save and run script in terminal** to run the *run-pytorch.py* script.

1. You'll see a link in the terminal window that opens. Select the link to view the job.

   [!INCLUDE [amlinclude-info](../../includes/machine-learning-py38-ignore.md)]

### View the output

1. In the page that opens, you'll see the job status. The first time you run this script, Azure Machine Learning will build a new Docker image from your PyTorch environment. The whole job might take around 10 minutes to complete. This image will be reused in future jobs to make them job much quicker.
1. You can see view Docker build logs in the Azure Machine Learning studio. Select the **Outputs + logs** tab, and then select **20_image_build_log.txt**.
1. When the status of the job is **Completed**, select **Output + logs**.
1. Select **std_log.txt** to view the output of your job.

```txt
Downloading https://www.cs.toronto.edu/~kriz/cifar-10-python.tar.gz to ../data/cifar-10-python.tar.gz
Extracting ../data/cifar-10-python.tar.gz to ../data
epoch=1, batch= 2000: loss 2.30
epoch=1, batch= 4000: loss 2.17
epoch=1, batch= 6000: loss 1.99
epoch=1, batch= 8000: loss 1.87
epoch=1, batch=10000: loss 1.72
epoch=1, batch=12000: loss 1.63
epoch=2, batch= 2000: loss 1.54
epoch=2, batch= 4000: loss 1.53
epoch=2, batch= 6000: loss 1.50
epoch=2, batch= 8000: loss 1.46
epoch=2, batch=10000: loss 1.44
epoch=2, batch=12000: loss 1.41
Finished Training

```

If you see an error `Your total snapshot size exceeds the limit`, the **data** folder is located in the `source_directory` value used in `ScriptRunConfig`.

Select the **...** at the end of the folder, then select **Move** to move **data** to the **get-started** folder.

## <a name="log"></a> Log training metrics

Now that you have a model training script in Azure Machine Learning, let's start tracking some performance metrics.

The current training script prints metrics to the terminal. Azure Machine Learning supports logging and tracking experiments using [MLflow tracking](https://www.mlflow.org/docs/latest/tracking.html). By adding a few lines of code, you gain the ability to visualize metrics in the studio and to compare metrics between multiple jobs.

### Modify *train.py* to include logging

1. Modify your *train.py* script to include two more lines of code:

    ```python
    import torch
    import torch.optim as optim
    import torchvision
    import torchvision.transforms as transforms
    from model import Net
    import mlflow


    # ADDITIONAL CODE: OPTIONAL: turn on autolog
    # mlflow.autolog()

    # download CIFAR 10 data
    trainset = torchvision.datasets.CIFAR10(
        root='./data',
        train=True,
        download=True,
        transform=torchvision.transforms.ToTensor()
    )
    trainloader = torch.utils.data.DataLoader(
        trainset,
        batch_size=4,
        shuffle=True,
        num_workers=2
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
                    # ADDITIONAL CODE: log loss metric to AML
                    mlflow.log_metric('loss', loss)
                    print(f'epoch={epoch + 1}, batch={i + 1:5}: loss {loss:.2f}')
                    running_loss = 0.0
        print('Finished Training')
    ```

2. **Save** this file, then close the tab if you wish.

#### Understand the additional two lines of code

```python
# ADDITIONAL CODE: OPTIONAL: turn on autolog
mlflow.autolog()
```

With Azure Machine Learning and MLFlow, users can log metrics, model parameters and model artifacts automatically when training a model.

```python
# ADDITIONAL CODE: log loss metric to AML
mlflow.log_metric('loss', loss)
```

You can log individual metrics as well.

Metrics in Azure Machine Learning are:

- Organized by experiment and job, so it's easy to keep track of and compare metrics.
- Equipped with a UI so you can visualize training performance in the studio.
- Designed to scale, so you keep these benefits even as you run hundreds of experiments.

### Update the Conda environment file

The `train.py` script just took a new dependency on `azureml.core`. Update `pytorch-env.yml` to reflect this change:

```yml
name: pytorch-env
channels:
    - defaults
    - pytorch
dependencies:
    - python=3.8.5
    - pytorch
    - torchvision
    - pip
    - pip:
        - mlflow
        - azureml-mlflow
```

Make sure you save this file before you submit the job.

### <a name="submit-again"></a> Submit the job to Azure Machine Learning

Select the tab for the *run-pytorch.py* script, then select **Save and run script in terminal** to re-run the *run-pytorch.py* script. Make sure you've saved your changes to `pytorch-env.yml` first.

This time when you visit the studio, go to the **Metrics** tab where you can now see live updates on the model training loss! It may take 1 to 2 minutes before the training begins.

:::image type="content" source="media/tutorial-1st-experiment-sdk-train/logging-metrics.png" alt-text="Training loss graph on the Metrics tab.":::

## Next steps

In this session, you upgraded from a basic "Hello world!" script to a more realistic training script that required a specific Python environment to run. You saw how to use curated Azure Machine Learning environments. Finally, you saw how in a few lines of code you can log metrics to Azure Machine Learning.

There are other ways to create Azure Machine Learning environments, including [from a pip requirements.txt](/python/api/azureml-core/azureml.core.environment.environment#from-pip-requirements-name--file-path-) file or [from an existing local Conda environment](/python/api/azureml-core/azureml.core.environment.environment#from-existing-conda-environment-name--conda-environment-name-).

In the next session, you'll see how to work with data in Azure Machine Learning by uploading the CIFAR10 dataset to Azure.

> [!div class="nextstepaction"]
> [Tutorial: Bring your own data](tutorial-1st-experiment-bring-data.md)

> [!NOTE]
> If you want to finish the tutorial series here and not progress to the next step, remember to [clean up your resources](tutorial-1st-experiment-bring-data.md#clean-up-resources).
