---
title: 'Tutorial: ML pipelines for training'
titleSuffix: Azure Machine Learning
description: In this tutorial, you build a machine learning pipeline for image classification with SDK v1. Focus on machine learning instead of infrastructure and automation.
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: tutorial
author: lgayhardt
ms.author: lagayhar
ms.date: 01/28/2022
ms.custom: UpdateFrequency5, devx-track-python, sdkv1, event-tier1-build-2022, ignite-2022
---

# Tutorial: Build an Azure Machine Learning pipeline for image classification

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

> [!NOTE]
> For a tutorial that uses SDK v2 to build a pipeline, see [Tutorial: Use ML pipelines for production ML workflows with Python SDK v2 in a Jupyter Notebook](../tutorial-pipeline-python-sdk.md).

In this tutorial, you learn how to build an [Azure Machine Learning pipeline](../concept-ml-pipelines.md) to prepare data and train a machine learning model. Machine learning pipelines optimize your workflow with speed, portability, and reuse, so you can focus on machine learning instead of infrastructure and automation.  

The example trains a small [Keras](https://keras.io/) convolutional neural network to classify images in the [Fashion MNIST](https://github.com/zalandoresearch/fashion-mnist) dataset.

In this tutorial, you complete the following tasks:

> [!div class="checklist"]
> * Configure workspace 
> * Create an Experiment to hold your work
> * Provision a ComputeTarget to do the work
> * Create a Dataset in which to store compressed data
> * Create a pipeline step to prepare the data for training
> * Define a runtime Environment in which to perform training
> * Create a pipeline step to define the neural network and perform the training
> * Compose a Pipeline from the pipeline steps
> * Run the pipeline in the experiment
> * Review the output of the steps and the trained neural network
> * Register the model for further use

If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

## Prerequisites

* Complete [Create resources to get started](../quickstart-create-resources.md) if you don't already have an Azure Machine Learning workspace.
* A Python environment in which you've installed both the `azureml-core` and `azureml-pipeline` packages. This environment is for defining and controlling your Azure Machine Learning resources and is separate from the environment used at runtime for training.

> [!Important]
> Currently, the most recent Python release compatible with `azureml-pipeline` is Python 3.8. If you've difficulty installing the `azureml-pipeline` package, ensure that `python --version` is a compatible release. Consult the documentation of your Python virtual environment manager (`venv`, `conda`, and so on) for instructions.

## Start an interactive Python session

This tutorial uses the Python SDK for Azure Machine Learning to create and control an Azure Machine Learning pipeline. The tutorial assumes that you'll be running the code snippets interactively in either a Python REPL environment or a Jupyter notebook. 

* This tutorial is based on the `image-classification.ipynb` notebook found in the `python-sdk/tutorial/using-pipelines` directory of the [Azure Machine Learning Examples](https://github.com/azure/azureml-examples) repository. The source code for the steps themselves is in the `keras-mnist-fashion` subdirectory.


## Import types

Import all the Azure Machine Learning types that you'll need for this tutorial:

```python
import os
import azureml.core
from azureml.core import (
    Workspace,
    Experiment,
    Dataset,
    Datastore,
    ComputeTarget,
    Environment,
    ScriptRunConfig
)
from azureml.data import OutputFileDatasetConfig
from azureml.core.compute import AmlCompute
from azureml.core.compute_target import ComputeTargetException
from azureml.pipeline.steps import PythonScriptStep
from azureml.pipeline.core import Pipeline

# check core SDK version number
print("Azure Machine Learning SDK Version: ", azureml.core.VERSION)
```

The Azure Machine Learning SDK version should be 1.37 or greater. If it isn't, upgrade with `pip install --upgrade azureml-core`.

## Configure workspace

Create a workspace object from the existing Azure Machine Learning workspace.

```python
workspace = Workspace.from_config()
```

> [!IMPORTANT]
> This code snippet expects the workspace configuration to be saved in the current directory or its parent. For more information on creating a workspace, see [Create workspace resources](../quickstart-create-resources.md). For more information on saving the configuration to file, see [Create a workspace configuration file](how-to-configure-environment.md).

## Create the infrastructure for your pipeline 

Create an `Experiment` object to hold the results of your pipeline runs:

```python
exp = Experiment(workspace=workspace, name="keras-mnist-fashion")
```

Create a `ComputeTarget` that represents the machine resource on which your pipeline will run. The simple neural network used in this tutorial trains in just a few minutes even on a CPU-based machine. If you wish to use a GPU for training, set `use_gpu` to `True`. Provisioning a compute target generally takes about five minutes.

```python
use_gpu = False

# choose a name for your cluster
cluster_name = "gpu-cluster" if use_gpu else "cpu-cluster"

found = False
# Check if this compute target already exists in the workspace.
cts = workspace.compute_targets
if cluster_name in cts and cts[cluster_name].type == "AmlCompute":
    found = True
    print("Found existing compute target.")
    compute_target = cts[cluster_name]
if not found:
    print("Creating a new compute target...")
    compute_config = AmlCompute.provisioning_configuration(
        vm_size= "STANDARD_NC6" if use_gpu else "STANDARD_D2_V2"
        # vm_priority = 'lowpriority', # optional
        max_nodes=4,
    )

    # Create the cluster.
    compute_target = ComputeTarget.create(workspace, cluster_name, compute_config)

    # Can poll for a minimum number of nodes and for a specific timeout.
    # If no min_node_count is provided, it will use the scale settings for the cluster.
    compute_target.wait_for_completion(
        show_output=True, min_node_count=None, timeout_in_minutes=10
    )
# For a more detailed view of current AmlCompute status, use get_status().print(compute_target.get_status().serialize())
```

> [!Note]
> GPU availability depends on the quota of your Azure subscription and upon Azure capacity. See [Manage and increase quotas for resources with Azure Machine Learning](../how-to-manage-quotas.md).

### Create a dataset for the Azure-stored data

Fashion-MNIST is a dataset of fashion images divided into 10 classes. Each image is a 28x28 grayscale image and there are 60,000 training and 10,000 test images. As an image classification problem, Fashion-MNIST is harder than the classic MNIST handwritten digit database. It's distributed in the same compressed binary form as the original [handwritten digit database](http://yann.lecun.com/exdb/mnist/) .

To create a `Dataset` that references the Web-based data, run:

```python
data_urls = ["https://data4mldemo6150520719.blob.core.windows.net/demo/mnist-fashion"]
fashion_ds = Dataset.File.from_files(data_urls)

# list the files referenced by fashion_ds
print(fashion_ds.to_path())
```

This code completes quickly. The underlying data remains in the Azure storage resource specified in the `data_urls` array.

## Create the data-preparation pipeline step

The first step in this pipeline will convert the compressed data files of `fashion_ds` into a dataset in your own workspace consisting of CSV files ready for use in training. Once registered with the workspace, your collaborators can access this data for their own analysis, training, and so on 

```python
datastore = workspace.get_default_datastore()
prepared_fashion_ds = OutputFileDatasetConfig(
    destination=(datastore, "outputdataset/{run-id}")
).register_on_complete(name="prepared_fashion_ds")
```

The above code specifies a dataset that is based on the output of a pipeline step. The underlying processed files will be put in the workspace's default datastore's blob storage at the path specified in `destination`. The dataset will be registered in the workspace with the name `prepared_fashion_ds`. 

### Create the pipeline step's source

The code that you've executed so far has create and controlled Azure resources. Now it's time to write code that does the first step in the domain. 

If you're following along with the example in the [Azure Machine Learning Examples repo](https://github.com/Azure/azureml-examples/tree/v1-archive/v1/python-sdk/tutorials/using-pipelines), the source file is already available as `keras-mnist-fashion/prepare.py`. 

If you're working from scratch, create a subdirectory called `keras-mnist-fashion/`. Create a new file, add the following code to it, and name the file `prepare.py`. 

```python
# prepare.py
# Converts MNIST-formatted files at the passed-in input path to a passed-in output path
import os
import sys

# Conversion routine for MNIST binary format
def convert(imgf, labelf, outf, n):
    f = open(imgf, "rb")
    l = open(labelf, "rb")
    o = open(outf, "w")

    f.read(16)
    l.read(8)
    images = []

    for i in range(n):
        image = [ord(l.read(1))]
        for j in range(28 * 28):
            image.append(ord(f.read(1)))
        images.append(image)

    for image in images:
        o.write(",".join(str(pix) for pix in image) + "\n")
    f.close()
    o.close()
    l.close()

# The MNIST-formatted source
mounted_input_path = sys.argv[1]
# The output directory at which the outputs will be written
mounted_output_path = sys.argv[2]

# Create the output directory
os.makedirs(mounted_output_path, exist_ok=True)

# Convert the training data
convert(
    os.path.join(mounted_input_path, "mnist-fashion/train-images-idx3-ubyte"),
    os.path.join(mounted_input_path, "mnist-fashion/train-labels-idx1-ubyte"),
    os.path.join(mounted_output_path, "mnist_train.csv"),
    60000,
)

# Convert the test data
convert(
    os.path.join(mounted_input_path, "mnist-fashion/t10k-images-idx3-ubyte"),
    os.path.join(mounted_input_path, "mnist-fashion/t10k-labels-idx1-ubyte"),
    os.path.join(mounted_output_path, "mnist_test.csv"),
    10000,
)
```

The code in `prepare.py` takes two command-line arguments: the first is assigned to `mounted_input_path` and the second to `mounted_output_path`. If that subdirectory doesn't exist, the call to `os.makedirs` creates it. Then, the program converts the training and testing data and outputs the comma-separated files to the `mounted_output_path`.

### Specify the pipeline step

Back in the Python environment you're using to specify the pipeline, run this code to create a `PythonScriptStep` for your preparation code:

```python
script_folder = "./keras-mnist-fashion"

prep_step = PythonScriptStep(
    name="prepare step",
    script_name="prepare.py",
    # On the compute target, mount fashion_ds dataset as input, prepared_fashion_ds as output
    arguments=[fashion_ds.as_named_input("fashion_ds").as_mount(), prepared_fashion_ds],
    source_directory=script_folder,
    compute_target=compute_target,
    allow_reuse=True,
)
```

The call to `PythonScriptStep` specifies that, when the pipeline step is run:

* All the files in the `script_folder` directory are uploaded to the `compute_target`
* Among those uploaded source files, the file `prepare.py` will be run
* The `fashion_ds` and `prepared_fashion_ds` datasets will be mounted on the `compute_target` and appear as directories
* The path to the `fashion_ds` files will be the first argument to `prepare.py`. In `prepare.py`, this argument is assigned to `mounted_input_path`
* The path to the `prepared_fashion_ds` will be the second argument to `prepare.py`. In `prepare.py`, this argument is assigned to `mounted_output_path`
* Because `allow_reuse` is `True`, it won't be rerun until its source files or inputs change
* This `PythonScriptStep` will be named `prepare step`

Modularity and reuse are key benefits of pipelines. Azure Machine Learning can automatically determine source code or Dataset changes. The output of a step that isn't affected will be reused without rerunning the steps again if `allow_reuse` is `True`. If a step relies on a data source external to Azure Machine Learning that may change (for instance, a URL that contains sales data), set `allow_reuse` to `False` and the pipeline step will run every time the pipeline is run. 

## Create the training step

Once the data has been converted from the compressed format to CSV files, it can be used for training a convolutional neural network.

### Create the training step's source

With larger pipelines, it's a good practice to put each step's source code in a separate directory (`src/prepare/`, `src/train/`, and so on) but for this tutorial, just use or create the file `train.py` in the same `keras-mnist-fashion/` source directory.

:::code language="python" source="~/azureml-examples-archive/v1/python-sdk/tutorials/using-pipelines/keras-mnist-fashion/train.py" highlight="16-19,84-89,104-119":::

Most of this code should be familiar to ML developers: 

* The data is partitioned into train and validation sets for training, and a separate test subset for final scoring
* The input shape is 28x28x1 (only 1 because the input is grayscale), there will be 256 inputs in a batch, and there are 10 classes
* The number of training epochs will be 10
* The model has three convolutional layers, with max pooling and dropout, followed by a dense layer and softmax head
* The model is fitted for 10 epochs and then evaluated
* The model architecture is written to `outputs/model/model.json` and the weights to `outputs/model/model.h5`

Some of the code, though, is specific to Azure Machine Learning. `run = Run.get_context()` retrieves a [`Run`](/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py&preserve-view=True) object, which contains the current service context. The `train.py` source uses this `run` object to retrieve the input dataset via its name (an alternative to the code in `prepare.py` that retrieved the dataset via the `argv` array of script arguments). 

The `run` object is also used to log the training progress at the end of every epoch and, at the end of training, to log the graph of loss and accuracy over time.

### Create the training pipeline step

The training step has a slightly more complex configuration than the preparation step. The preparation step used only standard Python libraries. More commonly, you'll need to modify the runtime environment in which your source code runs. 

Create a file `conda_dependencies.yml` with the following contents:

```yml
dependencies:
- python=3.7
- pip:
  - azureml-core
  - azureml-dataset-runtime
  - keras==2.4.3
  - tensorflow==2.4.3
  - numpy
  - scikit-learn
  - pandas
  - matplotlib
```

The `Environment` class represents the runtime environment in which a machine learning task runs. Associate the above specification with the training code with:

```python
keras_env = Environment.from_conda_specification(
    name="keras-env", file_path="./conda_dependencies.yml"
)

train_cfg = ScriptRunConfig(
    source_directory=script_folder,
    script="train.py",
    compute_target=compute_target,
    environment=keras_env,
)
```

Creating the training step itself uses code similar to the code used to create the preparation step:

```python
train_step = PythonScriptStep(
    name="train step",
    arguments=[
        prepared_fashion_ds.read_delimited_files().as_input(name="prepared_fashion_ds")
    ],
    source_directory=train_cfg.source_directory,
    script_name=train_cfg.script,
    runconfig=train_cfg.run_config,
)
```

## Create and run the pipeline

Now that you've specified data inputs and outputs and created your pipeline's steps, you can compose them into a pipeline and run it:

```python
pipeline = Pipeline(workspace, steps=[prep_step, train_step])
run = exp.submit(pipeline)
```

The `Pipeline` object you create runs in your `workspace` and is composed of the preparation and training steps you've specified. 

> [!Note]
> This pipeline has a simple dependency graph: the training step relies on the preparation step and the preparation step relies on the `fashion_ds` dataset. Production pipelines will often have much more complex dependencies. Steps may rely on multiple upstream steps, a source code change in an early step may have far-reaching consequences, and so on. Azure Machine Learning tracks these concerns for you. You need only pass in the array of `steps` and Azure Machine Learning takes care of calculating the execution graph.

The call to `submit` the `Experiment` completes quickly, and produces output similar to:

```dotnetcli
Submitted PipelineRun 5968530a-abcd-1234-9cc1-46168951b5eb
Link to Azure Machine Learning Portal: https://ml.azure.com/runs/abc-xyz...
```

You can monitor the pipeline run by opening the link or you can block until it completes by running:

```python
run.wait_for_completion(show_output=True)
```

> [!IMPORTANT]
> The first pipeline run takes roughly *15 minutes*. All dependencies must be downloaded, a Docker image is created, and the Python environment is provisioned and created. Running the pipeline again takes significantly less time because those resources are reused instead of created. However, total run time for the pipeline depends on the workload of your scripts and the processes that are running in each pipeline step.

Once the pipeline completes, you can retrieve the metrics you logged in the training step: 

```python
run.find_step_run("train step")[0].get_metrics()
```

If you're satisfied with the metrics, you can register the model in your workspace:

```python
run.find_step_run("train step")[0].register_model(
    model_name="keras-model",
    model_path="outputs/model/",
    datasets=[("train test data", fashion_ds)],
)
```

## Clean up resources

Don't complete this section if you plan to run other Azure Machine Learning tutorials.

### Stop the compute instance

If you used a compute instance, stop the VM when you aren't using it to reduce cost.

1. In your workspace, select **Compute**.

1. From the list, select the name of the compute instance.

1. Select **Stop**.

1. When you're ready to use the server again, select **Start**.

### Delete everything

If you don't plan to use the resources you created, delete them, so you don't incur any charges:

1. In the Azure portal, in the left menu, select **Resource groups**.
1. In the list of resource groups, select the resource group you created.
1. Select **Delete resource group**.
1. Enter the resource group name. Then, select **Delete**.

You can also keep the resource group but delete a single workspace. Display the workspace properties, and then select **Delete**.

## Next steps

In this tutorial, you used the following types:

* The `Workspace` represents your Azure Machine Learning workspace. It contained:
    * The `Experiment` that contains the results of training runs of your pipeline
    * The `Dataset` that lazily loaded the data held in the Fashion-MNIST datastore
    * The `ComputeTarget` that represents the machine(s) on which the pipeline steps run
    * The `Environment` that is the runtime environment in which the pipeline steps run
    * The `Pipeline` that composes the `PythonScriptStep` steps into a whole
    * The `Model` that you registered after being satisfied with the training process
    
The `Workspace` object contains references to other resources (notebooks, endpoints, and so on) that weren't used in this tutorial. For more, see [What is an Azure Machine Learning workspace?](../concept-workspace.md).

The `OutputFileDatasetConfig` promotes the output of a run to a file-based dataset. For more information on datasets and working with data, see [How to access data](../how-to-access-data.md).

For more on compute targets and environments, see [What are compute targets in Azure Machine Learning?](../concept-compute-target.md) and [What are Azure Machine Learning environments?](../concept-environments.md)

The `ScriptRunConfig` associates a `ComputeTarget` and `Environment` with Python source files. A `PythonScriptStep` takes that `ScriptRunConfig` and defines its inputs and outputs, which in this pipeline was the file dataset built by the `OutputFileDatasetConfig`. 

For more examples of how to build pipelines by using the machine learning SDK, see the [example repository](https://github.com/Azure/azureml-examples).
