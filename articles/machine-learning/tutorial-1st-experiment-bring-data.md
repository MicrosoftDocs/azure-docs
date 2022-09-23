---
title: "Tutorial: Upload data and train a model (SDK v2)"
titleSuffix: Azure Machine Learning
description: How to upload and use your own data in a remote training job. This is part 3 of a three-part getting-started series.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: tutorial
author: aminsaied
ms.author: amsaied
ms.reviewer: sgilley
ms.date: 07/10/2022
ms.custom: tracking-python, contperf-fy21q3, FY21Q4-aml-seo-hack, contperf-fy21q4, sdkv2
---

# Tutorial: Upload data and train a model (part 3 of 3)

[!INCLUDE [sdk v2](../../includes/machine-learning-sdk-v2.md)]

> [!div class="op_single_selector" title1="Select the version of Azure Machine Learning SDK you are using:"]
> * [v1](v1/tutorial-1st-experiment-bring-data.md)
> * [v2 (preview)](tutorial-1st-experiment-bring-data.md)

This tutorial shows you how to upload and use your own data to train machine learning models in Azure Machine Learning. This tutorial is *part 3 of a three-part tutorial series*.

In [Part 2: Train a model](tutorial-1st-experiment-sdk-train.md), you trained a model in the cloud, using sample data from `PyTorch`. You also downloaded that data through the `torchvision.datasets.CIFAR10` method in the PyTorch API. In this tutorial, you'll use the downloaded data to learn the workflow for working with your own data in Azure Machine Learning.

In this tutorial, you:

> [!div class="checklist"]
>
> * Upload data to Azure.
> * Create a control script.
> * Understand the new Azure Machine Learning concepts (passing parameters, data inputs).
> * Submit and run your training script.
> * View your code output in the cloud.

## Prerequisites

You'll need the data that was downloaded in the previous tutorial. Make sure you have completed these steps:

1. [Create the training script](tutorial-1st-experiment-sdk-train.md#create-training-scripts).
1. [Test locally](tutorial-1st-experiment-sdk-train.md#test-local).

## Adjust the training script

By now you have your training script (get-started/src/train.py) running in Azure Machine Learning, and you can monitor the model performance. Let's parameterize the training script by introducing arguments. Using arguments will allow you to easily compare different hyperparameters.

Our training script is currently set to download the CIFAR10 dataset on each run. The following Python code has been adjusted to read the data from a directory.

> [!NOTE]
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
    import mlflow

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
                    mlflow.log_metric('loss', loss)
                    print(f'epoch={epoch + 1}, batch={i + 1:5}: loss {loss:.2f}')
                    running_loss = 0.0
        print('Finished Training')
   ```

1. **Save** the file. Close the tab if you wish.

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

## <a name="upload"></a> Upload the data to Azure

To run this script in Azure Machine Learning, you need to make your training data available in Azure. Your Azure Machine Learning workspace comes equipped with a _default_ datastore. This is an Azure Blob Storage account where you can store your training data.

> [!NOTE]
> Azure Machine Learning allows you to connect other cloud-based storages that store your data. For more details, see the [data documentation](./concept-data.md).

> [!TIP]
> There is no additional step needed for uploading data, the control script will define and upload the CIFAR10 training data.

## <a name="control-script"></a> Create a control script

As you've done previously, create a new Python control script called *run-pytorch-data.py* in the **get-started** folder:

```python
# run-pytorch-data.py
from azure.ai.ml import MLClient, command, Input
from azure.identity import DefaultAzureCredential
from azure.ai.ml.entities import Environment
from azure.ai.ml import command, Input
from azure.ai.ml.entities import Data
from azure.ai.ml.constants import AssetTypes
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

    # the key here should match the key passed to the command
    my_job_inputs = {
        "data_path": Input(type=AssetTypes.URI_FOLDER, path="./data")
    }

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
        # the parameter will match the training script argument name
        # inputs.data_path key should match the dictionary key
        command="python train.py --data_path ${{inputs.data_path}}",
        inputs=my_job_inputs,
        environment=f"{env_name}@latest",
        compute=computeName,
        display_name="day1-experiment-data",
    )

    returned_job = ml_client.create_or_update(job)
    aml_url = returned_job.studio_url
    print("Monitor your job at", aml_url)
```

> [!TIP]
> If you used a different name when you created your compute cluster, make sure to adjust the name in the code `computeName='cpu-cluster'` as well.

### Understand the code changes

The control script is similar to the one from [part 2 of this series](tutorial-1st-experiment-sdk-train.md), with the following new lines:

:::row:::
   :::column span="":::
      `my_job_inputs = { "data_path": Input(type=AssetTypes.URI_FOLDER, path="./data")}`
   :::column-end:::
   :::column span="2":::
      An [Input](/python/api/azure-ai-ml/azure.ai.ml.input) is used to reference inputs to your job. These can encompass data, either uploaded as part of the job or references to previously registered data assets. URI\*FOLDER tells that the reference points to a folder of data. The data will be mounted by default to the compute for the job.
   :::column-end:::
:::row-end:::
:::row:::
   :::column span="":::
      `command="python train.py --data_path ${{inputs.data_path}}"`
   :::column-end:::
   :::column span="2":::
      `--data_path` matches the argument defined in the updated training script. `${{inputs.data_path}}` passes the input defined by the input dictionary, and the keys must match.
   :::column-end:::
:::row-end:::

## <a name="submit-to-cloud"></a> Submit the job to Azure Machine Learning

Select **Save and run script in terminal** to run the *run-pytorch-data.py* script. This job will train the model on the compute cluster using the data you uploaded.

This code will print a URL to the experiment in the Azure Machine Learning studio. If you go to that link, you'll be able to see your code running.

[!INCLUDE [amlinclude-info](../../includes/machine-learning-py38-ignore.md)]

### <a name="inspect-log"></a> Inspect the log file

In the studio, go to the experiment job (by selecting the previous URL output) followed by **Outputs + logs**. Select the `std_log.txt` file. Scroll down through the log file until you see the following output:

```txt
===== DATA =====
DATA PATH: /mnt/azureml/cr/j/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx/cap/data-capability/wd/INPUT_data_path
LIST FILES IN DATA PATH...
['.amlignore', 'cifar-10-batches-py', 'cifar-10-python.tar.gz']
================
epoch=1, batch= 2000: loss 2.20
epoch=1, batch= 4000: loss 1.90
epoch=1, batch= 6000: loss 1.70
epoch=1, batch= 8000: loss 1.58
epoch=1, batch=10000: loss 1.54
epoch=1, batch=12000: loss 1.48
epoch=2, batch= 2000: loss 1.41
epoch=2, batch= 4000: loss 1.38
epoch=2, batch= 6000: loss 1.33
epoch=2, batch= 8000: loss 1.30
epoch=2, batch=10000: loss 1.29
epoch=2, batch=12000: loss 1.25
Finished Training

```

Notice:

- Azure Machine Learning has mounted Blob Storage to the compute cluster automatically for you, passing the mount point into `--data_path`. Compared to the previous job, there is no on the fly data download.
- The `inputs=my_job_inputs` used in the control script resolves to the mount point.

## Clean up resources

If you plan to continue now to another tutorial, or to start your own training jobs, skip to [Next steps](#next-steps).

### Stop compute instance

If you're not going to use it now, stop the compute instance:

1. In the studio, on the left, select **Compute**.
1. In the top tabs, select **Compute instances**
1. Select the compute instance in the list.
1. On the top toolbar, select **Stop**.

### Delete all resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, we saw how to upload data to Azure by using `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using `Dataset`, you were able to mount a directory to the remote job.

Now that you have a model, learn:

> [!div class="nextstepaction"]
> [How to deploy models with Azure Machine Learning](how-to-deploy-managed-online-endpoints.md).
