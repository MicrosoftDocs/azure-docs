---
title: Dataset versioning
titleSuffix: Azure Machine Learning
description: Learn how to version machine learning datasets and how versioning works with machine learning pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: mldata
ms.author: samkemp
ms.reviewer: franksolomon
author: samuel100
ms.date: 02/26/2024
ms.topic: how-to
ms.custom: UpdateFrequency5, data4ml, sdkv1
#Customer intent: As a data scientist, I want to version and track datasets so I can use and share them across multiple machine learning experiments.
---

# Version and track Azure Machine Learning datasets

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

In this article, you'll learn how to version and track Azure Machine Learning datasets for reproducibility. Dataset versioning bookmarks specific states of your data, so that you can apply a specific version of the dataset for future experiments.

You might want to version your Azure Machine Learning resources in these typical scenarios:

* When new data becomes available for retraining
* When you apply different data preparation or feature engineering approaches

## Prerequisites

- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/install). This SDK includes the [azureml-datasets](/python/api/azureml-core/azureml.core.dataset) package

- An [Azure Machine Learning workspace](../concept-workspace.md). [Create a new workspace](../quickstart-create-resources.md), or retrieve an existing workspace with this code sample:

    ```Python
    import azureml.core
    from azureml.core import Workspace
    
    ws = Workspace.from_config()
    ```
- An [Azure Machine Learning dataset](how-to-create-register-datasets.md)

## Register and retrieve dataset versions

You can version, reuse, and share a registered dataset across experiments and with your colleagues. You can register multiple datasets under the same name, and retrieve a specific version by name and version number.

### Register a dataset version

This code sample sets the `create_new_version` parameter of the `titanic_ds` dataset to `True`, to register a new version of that dataset. If the workspace has no existing `titanic_ds` dataset registered, the code creates a new dataset with the name `titanic_ds`, and sets its version to 1.

```Python
titanic_ds = titanic_ds.register(workspace = workspace,
                                 name = 'titanic_ds',
                                 description = 'titanic training data',
                                 create_new_version = True)
```

### Retrieve a dataset by name

By default, the `Dataset` class [get_by_name()](/python/api/azureml-core/azureml.core.dataset.dataset#azureml-core-dataset-dataset-get-by-name) method returns the latest version of the dataset registered with the workspace.

This code returns version 1 of the `titanic_ds` dataset.

```Python
from azureml.core import Dataset
# Get a dataset by name and version number
titanic_ds = Dataset.get_by_name(workspace = workspace,
                                 name = 'titanic_ds', 
                                 version = 1)
```

## Versioning best practice

When you create a dataset version, you *don't* create an extra copy of data with the workspace. Since datasets are references to the data in your storage service, you have a single source of truth, managed by your storage service.

>[!IMPORTANT]
> If the data referenced by your dataset is overwritten or deleted, a call to a specific version of the dataset does *not* revert the change.

When you load data from a dataset, the current data content referenced by the dataset is always loaded. If you want to make sure that each dataset version is reproducible, we recommend that you avoid modification of data content referenced by the dataset version. When new data comes in, save new data files into a separate data folder, and then create a new dataset version to include data from that new folder.

This image and sample code show the recommended way to both structure your data folders and create dataset versions that reference those folders:

![Folder structure](./media/how-to-version-track-datasets/folder-image.png)

```Python
from azureml.core import Dataset

# get the default datastore of the workspace
datastore = workspace.get_default_datastore()

# create & register weather_ds version 1 pointing to all files in the folder of week 27
datastore_path1 = [(datastore, 'Weather/week 27')]
dataset1 = Dataset.File.from_files(path=datastore_path1)
dataset1.register(workspace = workspace,
                  name = 'weather_ds',
                  description = 'weather data in week 27',
                  create_new_version = True)

# create & register weather_ds version 2 pointing to all files in the folder of week 27 and 28
datastore_path2 = [(datastore, 'Weather/week 27'), (datastore, 'Weather/week 28')]
dataset2 = Dataset.File.from_files(path = datastore_path2)
dataset2.register(workspace = workspace,
                  name = 'weather_ds',
                  description = 'weather data in week 27, 28',
                  create_new_version = True)

```

## Version an ML pipeline output dataset

You can use a dataset as the input and output of each [ML pipeline](../concept-ml-pipelines.md) step. When you rerun pipelines, the output of each pipeline step is registered as a new dataset version.

Machine Learning pipelines populate the output of each step into a new folder every time the pipeline reruns. The versioned output datasets then become reproducible. For more information, visit [datasets in pipelines](./how-to-create-machine-learning-pipelines.md#steps).

```Python
from azureml.core import Dataset
from azureml.pipeline.steps import PythonScriptStep
from azureml.pipeline.core import Pipeline, PipelineData
from azureml.core. runconfig import CondaDependencies, RunConfiguration

# get input dataset 
input_ds = Dataset.get_by_name(workspace, 'weather_ds')

# register pipeline output as dataset
output_ds = PipelineData('prepared_weather_ds', datastore=datastore).as_dataset()
output_ds = output_ds.register(name='prepared_weather_ds', create_new_version=True)

conda = CondaDependencies.create(
    pip_packages=['azureml-defaults', 'azureml-dataprep[fuse,pandas]'], 
    pin_sdk_version=False)

run_config = RunConfiguration()
run_config.environment.docker.enabled = True
run_config.environment.python.conda_dependencies = conda

# configure pipeline step to use dataset as the input and output
prep_step = PythonScriptStep(script_name="prepare.py",
                             inputs=[input_ds.as_named_input('weather_ds')],
                             outputs=[output_ds],
                             runconfig=run_config,
                             compute_target=compute_target,
                             source_directory=project_folder)
```

## Track data in your experiments

Azure Machine Learning tracks your data throughout your experiment as input and output datasets. In these scenarios, your data is tracked as an **input dataset**:

* As a `DatasetConsumptionConfig` object, through either the `inputs` or `arguments` parameter of your `ScriptRunConfig` object, when submitting the experiment job

* When your script calls certain methods - `get_by_name()` or `get_by_id()` - for example. The name assigned to the dataset at the time you registered that dataset to the workspace is the displayed name

In these scenarios, your data is tracked as an **output dataset**:

* Pass an `OutputFileDatasetConfig` object through either the `outputs` or `arguments` parameter when you submit an experiment job. `OutputFileDatasetConfig` objects can also persist data between pipeline steps. For more information, visit [Move data between ML pipeline steps](how-to-move-data-in-out-of-pipelines.md)
  
* Register a dataset in your script. The name assigned to the dataset when you registered it to the workspace is the name displayed. In this code sample, `training_ds` is the displayed name:

    ```Python
   training_ds = unregistered_ds.register(workspace = workspace,
                                     name = 'training_ds',
                                     description = 'training data'
                                     )
    ```

* Submission of a child job, with an unregistered dataset, in the script. This submission results in an anonymous saved dataset

### Trace datasets in experiment jobs

For each Machine Learning experiment, you can trace the input datasets for the experiment `Job` object. This code sample uses the [`get_details()`](/python/api/azureml-core/azureml.core.run.run#get-details--) method to track the input datasets used with the experiment run:

```Python
# get input datasets
inputs = run.get_details()['inputDatasets']
input_dataset = inputs[0]['dataset']

# list the files referenced by input_dataset
input_dataset.to_path()
```

You can also find the `input_datasets` from experiments with the [Azure Machine Learning studio](https://ml.azure.com).

This screenshot shows where to find the input dataset of an experiment on Azure Machine Learning studio. For this example, start at your **Experiments** pane, and open the **Properties** tab for a specific run of your experiment, `keras-mnist`.

![Input datasets](./media/how-to-version-track-datasets/input-datasets.png)

This code registers models with datasets:

```Python
model = run.register_model(model_name='keras-mlp-mnist',
                           model_path=model_path,
                           datasets =[('training data',train_dataset)])
```

After registration, you can see the list of models registered with the dataset with either Python or the [studio](https://ml.azure.com/).

Thia screenshot is from the **Datasets** pane under **Assets**. Select the dataset, and then select the **Models** tab for a list of the models that are registered with the dataset.

![Input datasets models](./media/how-to-version-track-datasets/dataset-models.png)

## Next steps

* [Train with datasets](how-to-train-with-datasets.md)
* [More sample dataset notebooks](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/work-with-data/)