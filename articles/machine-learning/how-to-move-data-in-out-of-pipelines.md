---
title: 'Moving data in ML pipelines'
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning pipelines ingest data, and how to manage and move data between pipeline steps.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: laobri
author: lobrien
ms.date: 02/26/2021
ms.topic: how-to
ms.custom: contperf-fy20q4, devx-track-python, data4ml
#Customer intent: As a data scientist using Python, I want to get data into my pipeline and flowing between steps.
---

# Moving data into and between ML pipeline steps (Python)

This article provides code for importing, transforming, and moving data between steps in an Azure Machine Learning pipeline. For an overview of how data works in Azure Machine Learning, see [Access data in Azure storage services](how-to-access-data.md). For the benefits and structure of Azure Machine Learning pipelines, see [What are Azure Machine Learning pipelines?](concept-ml-pipelines.md).

This article will show you how to:

- Use `Dataset` objects for pre-existing data
- Access data within your steps
- Split `Dataset` data into subsets, such as training and validation subsets
- Create `OutputFileDatasetConfig` objects to transfer data to the next pipeline step
- Use `OutputFileDatasetConfig` objects as input to pipeline steps
- Create new `Dataset` objects from `OutputFileDatasetConfig` you wish to persist

## Prerequisites

You'll need:

- An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree).

- The [Azure Machine Learning SDK for Python](/python/api/overview/azure/ml/intro), or access to [Azure Machine Learning studio](https://ml.azure.com/).

- An Azure Machine Learning workspace.
  
  Either [create an Azure Machine Learning workspace](how-to-manage-workspace.md) or use an existing one via the Python SDK. Import the `Workspace` and `Datastore` class, and load your subscription information from the file `config.json` using the function `from_config()`. This function looks for the JSON file in the current directory by default, but you can also specify a path parameter to point to the file using `from_config(path="your/file/path")`.

   ```python
   import azureml.core
   from azureml.core import Workspace, Datastore
        
   ws = Workspace.from_config()
   ```

- Some pre-existing data. This article briefly shows the use of an [Azure blob container](../storage/blobs/storage-blobs-overview.md).

- Optional: An existing machine learning pipeline, such as the one described in [Create and run machine learning pipelines with Azure Machine Learning SDK](./how-to-create-machine-learning-pipelines.md).

## Use `Dataset` objects for pre-existing data 

The preferred way to ingest data into a pipeline is to use a [Dataset](/python/api/azureml-core/azureml.core.dataset%28class%29) object. `Dataset` objects represent persistent data available throughout a workspace.

There are many ways to create and register `Dataset` objects. Tabular datasets are for delimited data available in one or more files. File datasets are for binary data (such as images) or for data that you'll parse. The simplest programmatic ways to create `Dataset` objects are to use existing blobs in workspace storage or public URLs:

```python
datastore = Datastore.get(workspace, 'training_data')
iris_dataset = Dataset.Tabular.from_delimited_files(DataPath(datastore, 'iris.csv'))

datastore_path = [
    DataPath(datastore, 'animals/dog/1.jpg'),
    DataPath(datastore, 'animals/dog/2.jpg'),
    DataPath(datastore, 'animals/cat/*.jpg')
]
cats_dogs_dataset = Dataset.File.from_files(path=datastore_path)
```

For more options on creating datasets with different options and from different sources, registering them and reviewing them in the Azure Machine Learning UI, understanding how data size interacts with compute capacity, and versioning them, see [Create Azure Machine Learning datasets](how-to-create-register-datasets.md). 

### Pass datasets to your script

To pass the dataset's path to your script, use the `Dataset` object's `as_named_input()` method. You can either pass the resulting `DatasetConsumptionConfig` object to your script as an argument or, by using the `inputs` argument to your pipeline script, you can retrieve the dataset using `Run.get_context().input_datasets[]`.

Once you've created a named input, you can choose its access mode: `as_mount()` or `as_download()`. If your script processes all the files in your dataset and the disk on your compute resource is large enough for the dataset, the download access mode is the better choice. The download access mode will avoid the overhead of streaming the data at runtime. If your script accesses a subset of the dataset or it's too large for your compute, use the mount access mode. For more information, read [Mount vs. Download](./how-to-train-with-datasets.md#mount-vs-download)

To pass a dataset to your pipeline step:

1. Use `TabularDataset.as_named_input()` or `FileDataset.as_named_input()` (no 's' at end) to create a `DatasetConsumptionConfig` object
1. Use `as_mount()` or `as_download()` to set the access mode
1. Pass the datasets to your pipeline steps using either the `arguments` or the `inputs` argument

The following snippet shows the common pattern of combining these steps within the `PythonScriptStep` constructor: 

```python

train_step = PythonScriptStep(
    name="train_data",
    script_name="train.py",
    compute_target=cluster,
    inputs=[iris_dataset.as_named_input('iris').as_mount()]
)
```

> [!NOTE]
> You would need to replace the values for all these arguments (that is, `"train_data"`, `"train.py"`, `cluster`, and `iris_dataset`) with your own data. 
> The above snippet just shows the form of the call and is not part of a Microsoft sample. 

You can also use methods such as `random_split()` and `take_sample()` to create multiple inputs or reduce the amount of data passed to your pipeline step:

```python
seed = 42 # PRNG seed
smaller_dataset = iris_dataset.take_sample(0.1, seed=seed) # 10%
train, test = smaller_dataset.random_split(percentage=0.8, seed=seed)

train_step = PythonScriptStep(
    name="train_data",
    script_name="train.py",
    compute_target=cluster,
    inputs=[train.as_named_input('train').as_download(), test.as_named_input('test').as_download()]
)
```

### Access datasets within your script

Named inputs to your pipeline step script are available as a dictionary within the `Run` object. Retrieve the active `Run` object using `Run.get_context()` and then retrieve the dictionary of named inputs using `input_datasets`. If you passed the `DatasetConsumptionConfig` object using the `arguments` argument rather than the `inputs` argument, access the data using `ArgParser` code. Both techniques are demonstrated in the following snippet.

```python
# In pipeline definition script:
# Code for demonstration only: It would be very confusing to split datasets between `arguments` and `inputs`
train_step = PythonScriptStep(
    name="train_data",
    script_name="train.py",
    compute_target=cluster,
    arguments=['--training-folder', train.as_named_input('train').as_download()],
    inputs=[test.as_named_input('test').as_download()]
)

# In pipeline script
parser = argparse.ArgumentParser()
parser.add_argument('--training-folder', type=str, dest='train_folder', help='training data folder mounting point')
args = parser.parse_args()
training_data_folder = args.train_folder

testing_data_folder = Run.get_context().input_datasets['test']
```

The passed value will be the path to the dataset file(s).

It's also possible to access a registered `Dataset` directly. Since registered datasets are persistent and shared across a workspace, you can retrieve them directly:

```python
run = Run.get_context()
ws = run.experiment.workspace
ds = Dataset.get_by_name(workspace=ws, name='mnist_opendataset')
```

> [!NOTE]
> The preceding snippets show the form of the calls and are not part of a Microsoft sample. You must replace the various arguments with values from your own project.

## Use `OutputFileDatasetConfig` for intermediate data

While `Dataset` objects represent only persistent data, [`OutputFileDatasetConfig`](/python/api/azureml-core/azureml.data.outputfiledatasetconfig) object(s) can be used for temporary data output from pipeline steps **and** persistent output data. `OutputFileDatasetConfig` supports writing data to blob storage, fileshare, adlsgen1, or adlsgen2. It supports both mount mode and upload mode. In mount mode, files written to the mounted directory are permanently stored when the file is closed. In upload mode, files  written to the output directory are uploaded at the end of the job. If the job fails or is canceled, the output directory will not be uploaded.

 `OutputFileDatasetConfig` object's default behavior is to write to the default datastore of the workspace. Pass your `OutputFileDatasetConfig` objects to your `PythonScriptStep` with the `arguments` parameter.

```python
from azureml.data import OutputFileDatasetConfig
dataprep_output = OutputFileDatasetConfig()
input_dataset = Dataset.get_by_name(workspace, 'raw_data')

dataprep_step = PythonScriptStep(
    name="prep_data",
    script_name="dataprep.py",
    compute_target=cluster,
    arguments=[input_dataset.as_named_input('raw_data').as_mount(), dataprep_output]
    )
```

You may choose to upload the contents of your `OutputFileDatasetConfig` object at the end of a run. In that case, use the `as_upload()` function along with your `OutputFileDatasetConfig` object, and specify whether to overwrite existing files in the destination. 

```python
#get blob datastore already registered with the workspace
blob_store= ws.datastores['my_blob_store']
OutputFileDatasetConfig(name="clean_data", destination=(blob_store, 'outputdataset')).as_upload(overwrite=False)
```

> [!NOTE]
> Concurrent writes to a `OutputFileDatasetConfig` will fail. Do not attempt to use a single `OutputFileDatasetConfig` concurrently. Do not share a single `OutputFileDatasetConfig` in a multiprocessing situation, such as when using distributed training. 

### Use `OutputFileDatasetConfig` as outputs of a training step

Within your pipeline's `PythonScriptStep`, you can retrieve the available output paths using the program's arguments. If this step is the first and will initialize the output data, you must create the directory at the specified path. You can then write whatever files you wish to be contained in the `OutputFileDatasetConfig`.

```python
parser = argparse.ArgumentParser()
parser.add_argument('--output_path', dest='output_path', required=True)
args = parser.parse_args()

# Make directory for file
os.makedirs(os.path.dirname(args.output_path), exist_ok=True)
with open(args.output_path, 'w') as f:
    f.write("Step 1's output")
```

### Read `OutputFileDatasetConfig` as inputs to non-initial steps

After the initial pipeline step writes some data to the `OutputFileDatasetConfig` path and it becomes an output of that initial step, it can be used as an input to a later step. 

In the following code: 

* `step1_output_data` indicates that the output of the PythonScriptStep, `step1` is written to the ADLS Gen 2 datastore, `my_adlsgen2` in upload access mode. Learn more about how to [set up role permissions](how-to-access-data.md#azure-data-lake-storage-generation-2) in order to write data back to ADLS Gen 2 datastores. 

* After `step1` completes and the output is written to the destination indicated by `step1_output_data`, then step2 is ready to use `step1_output_data` as an input. 

```python
# get adls gen 2 datastore already registered with the workspace
datastore = workspace.datastores['my_adlsgen2']
step1_output_data = OutputFileDatasetConfig(name="processed_data", destination=(datastore, "mypath/{run-id}/{output-name}")).as_upload()

step1 = PythonScriptStep(
    name="generate_data",
    script_name="step1.py",
    runconfig = aml_run_config,
    arguments = ["--output_path", step1_output_data]
)

step2 = PythonScriptStep(
    name="read_pipeline_data",
    script_name="step2.py",
    compute_target=compute,
    runconfig = aml_run_config,
    arguments = ["--pd", step1_output_data.as_input()]

)

pipeline = Pipeline(workspace=ws, steps=[step1, step2])
```

## Register `OutputFileDatasetConfig` objects for reuse

If you'd like to make your `OutputFileDatasetConfig` available for longer than the duration of your experiment, register it to your workspace to share and reuse across experiments.

```python
step1_output_ds = step1_output_data.register_on_complete(name='processed_data', 
                                                         description = 'files from step1`)
```

## Delete `OutputFileDatasetConfig` contents when no longer needed

Azure does not automatically delete intermediate data written with `OutputFileDatasetConfig`. To avoid storage charges for large amounts of unneeded data, you should either:

* Programmatically delete intermediate data at the end of a pipeline run, when it is no longer needed
* Use blob storage with a short-term storage policy for intermediate data (see [Optimize costs by automating Azure Blob Storage access tiers](../storage/blobs/storage-lifecycle-management-concepts.md?tabs=azure-portal)) 
* Regularly review and delete no-longer-needed data

For more information, see [Plan and manage costs for Azure Machine Learning](concept-plan-manage-cost.md).

## Next steps

* [Create an Azure machine learning dataset](how-to-create-register-datasets.md)
* [Create and run machine learning pipelines with Azure Machine Learning SDK](./how-to-create-machine-learning-pipelines.md)