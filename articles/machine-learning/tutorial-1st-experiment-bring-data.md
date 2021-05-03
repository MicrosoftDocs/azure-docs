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
ms.date: 02/11/2021
ms.custom: tracking-python, contperf-fy21q3
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

You'll need the data and an updated version of the pytorch environment created in the previous tutorial.  Make sure you have completed these steps:

1. [Create the training script](tutorial-1st-experiment-sdk-train.md#create-training-scripts)
1. [Create a new Python environment](tutorial-1st-experiment-sdk-train.md#environment)
1. [Test locally](tutorial-1st-experiment-sdk-train.md#test-local)
1. [Update the Conda environment file](tutorial-1st-experiment-sdk-train.md#update-the-conda-environment-file)

## Adjust the training script

By now you have your training script (tutorial/src/train.py) running in Azure Machine Learning, and you can monitor the model performance. Let's parameterize the training script by introducing arguments. Using arguments will allow you to easily compare different hyperparameters.

Our training script is now set to download the CIFAR10 dataset on each run. The following Python code has been adjusted to read the data from a directory.

>[!NOTE] 
> The use of `argparse` parameterizes the script.

:::code language="python" source="~/MachineLearningNotebooks/tutorials/get-started-day1/code/pytorch-cifar10-your-data/train.py":::

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

> [!div class="nextstepaction"]
> [I adjusted the training script](?success=adjust-training-script#test-locally) [I ran into an issue](https://www.research.net/r/7C6W7BQ?issue=adjust-training-script)

## <a name="test-locally"></a> Test the script locally

Your script now accepts _data path_ as an argument. To start with, test it
locally. Add to your tutorial directory structure a folder called `data`. Your directory structure should look like:

:::image type="content" source="media/tutorial-1st-experiment-bring-data/directory-structure.png" alt-text="Directory structure shows .azureml, data, and src sub-directories":::

1. Exit the current environment.

    ```bash
    conda deactivate

1. Now create and activate the new environment.  This will rebuild the pytorch-aml-env with the [updated environment file](tutorial-1st-experiment-sdk-train.md#update-the-conda-environment-file)


    ```bash
    conda env create -f .azureml/pytorch-env.yml    # create the new conda environment with updated dependencies
    ```

    ```bash
    conda activate pytorch-aml-env			# activate new conda environment
    ```

1. Finally, run the modified training script locally.

    ```bash
    python src/train.py --data_path ./data --learning_rate 0.003 --momentum 0.92
    ```

You avoid having to download the CIFAR10 dataset by passing in a local path to the data. You can also experiment with different values for _learning rate_ and _momentum_ hyperparameters without having to hard-code them in the training script.

> [!div class="nextstepaction"]
> [I tested the script locally](?success=test-locally#upload) [I ran into an issue](https://www.research.net/r/7C6W7BQ?issue=test-locally)

## <a name="upload"></a> Upload the data to Azure

To run this script in Azure Machine Learning, you need to make your training data available in Azure. Your Azure Machine Learning workspace comes equipped with a _default_ datastore. This is an Azure Blob Storage account where you can store your training data.

>[!NOTE] 
> Azure Machine Learning allows you to connect other cloud-based datastores that store your data. For more details, see the [datastores documentation](./concept-data.md).  

Create a new Python control script called `05-upload-data.py` in the `tutorial` directory:

:::code language="python" source="~/MachineLearningNotebooks/tutorials/get-started-day1/IDE-users/05-upload-data.py":::

The `target_path` value specifies the path on the datastore where the CIFAR10 data will be uploaded.

>[!TIP] 
> While you're using Azure Machine Learning to upload the data, you can use [Azure Storage Explorer](https://azure.microsoft.com/features/storage-explorer/) to upload ad hoc files. If you need an ETL tool, you can use [Azure Data Factory](../data-factory/introduction.md) to ingest your data into Azure.

In the window that has the activated *tutorial1* conda environment, run the Python file to upload the data. (The upload should be quick, less than 60 seconds.)

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

> [!div class="nextstepaction"]
> [I uploaded the data](?success=upload-data#control-script) [I ran into an issue](https://www.research.net/r/7C6W7BQ?issue=upload-data)

## <a name="control-script"></a> Create a control script

As you've done previously, create a new Python control script called `06-run-pytorch-data.py`:

```python
# 06-run-pytorch-data.py
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
        file_path='./.azureml/pytorch-env.yml'
    )
    config.run_config.environment = env

    run = experiment.submit(config)
    aml_url = run.get_portal_url()
    print("Submitted to compute cluster. Click link below")
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

> [!div class="nextstepaction"]
> [I created the control script](?success=control-script#submit-to-cloud) [I ran into an issue](https://www.research.net/r/7C6W7BQ?issue=control-script)

## <a name="submit-to-cloud"></a> Submit the run to Azure Machine Learning

Now resubmit the run to use the new configuration:

```bash
python 06-run-pytorch-data.py
```

This code will print a URL to the experiment in the Azure Machine Learning studio. If you go to that link, you'll be able to see your code running.

> [!div class="nextstepaction"]
> [I resubmitted the run](?success=submit-to-cloud#inspect-log) [I ran into an issue](https://www.research.net/r/7C6W7BQ?issue=submit-to-cloud)

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

Notice:

- Azure Machine Learning has mounted Blob Storage to the compute cluster automatically for you.
- The ``dataset.as_named_input('input').as_mount()`` used in the control script resolves to the mount point.

> [!div class="nextstepaction"]
> [I inspected the log file](?success=inspect-log#clean-up-resources) [I ran into an issue](https://www.research.net/r/7C6W7BQ?issue=inspect-log)

## Clean up resources

[!INCLUDE [aml-delete-resource-group](../../includes/aml-delete-resource-group.md)]

You can also keep the resource group but delete a single workspace. Display the workspace properties and select **Delete**.

## Next steps

In this tutorial, we saw how to upload data to Azure by using `Datastore`. The datastore served as cloud storage for your workspace, giving you a persistent and flexible place to keep your data.

You saw how to modify your training script to accept a data path via the command line. By using `Dataset`, you were able to mount a directory to the remote run. 

Now that you have a model, learn:

* How to [deploy models with Azure Machine Learning](how-to-deploy-and-where.md).
