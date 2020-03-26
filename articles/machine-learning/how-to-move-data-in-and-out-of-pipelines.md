---
title: 'Input and Output Data from ML Pipelines'
titleSuffix: Azure Machine Learning
description:Prepare, consume, and generate data in Azure Machine Learning pipelines
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: laobri
author: lobrien
ms.date: 11/06/2019
---

# Input and Output Data from ML Pipelines

[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

tk Do SEO keyword search to refine meta-title, meta-desc, H1 and 1st para tk 
Azure Machine Learning pipelines allow you to create flexible, efficient, and modular ML solutions. Making data flow into, out from, and between pipeline steps is central to developing pipelines. For an overview of how data works in Azure Machine Learning, see [Data in Machine Learning](tk). This article will show you how to: 

- Use `Dataset` objects for pre-existing data
- Access data within your steps
- Move between `Dataset` representations and Pandas and Apache Spark representations
- Split `Dataset` data into subsets, such as training and validation subsets
- Create a `PipelineData` object to transfer data to the next pipeline step 

## Prerequisites 

tk 

## Use `Dataset` objects for pre-existing data 

The preferred way to ingest data into a pipeline is to use a `Dataset` object. `Dataset` objects represent persistent data available throughout a workspace. 

There are many ways to create and register `Dataset` objects. The simplest programmatic way is to use existing blobs in workspace storage:

```python
datastore = Datastore.get(workspace, 'training_data')
iris_dataset = Dataset.Tabular.from_delimited_files(DataPath(datastore, 'iris.csv'))

cats_dogs_dataset = Dataset.File.from_files(
    paths='https://download.microsoft.com/download/3/E/1/3E1C3F21-ECDB-4869-8368-6DEBA77B919F/kagglecatsanddogs_3367a.zip',
    archive_options=ArchiveOptions(archive_type=ArchiveType.ZIP, entry_glob='**/*.jpg')
)
```

For more options on creating datasets with different options and from different sources, registering them and reviewing them in the Azure Machine Learning UI, understanding how data size interacts with compute capacity, and versioning them, see [Create Azure Machine Learning datasets](how-to-create-register-datasets.md).

### Pass a dataset to your script

To pass the dataset's path to your script, use use `as_named_input(str)`. You can either pass the resulting `DatasetConsumptionConfig` object to your script as an argument or, by using the `inputs` argument to your pipeline script, you can retrieve the dataset using `Run.get_context().input_datasets[str]`. 

Once you've created a named input, you can choose its access mode: `as_mount()` or `as_download()`. If your script processes all the files in your dataset and the disk on your compute resource is large enough for the dataset, the download access mode will avoid runtime streaming overhead. If your script accesses a subset of the dataset or it's simply too large for your compute, use the mount access mode. For more information, read [Mount vs. Download](https://docs.microsoft.com/azure/machine-learning/how-to-train-with-datasets#mount-vs-download)

To pass a dataset to your pipeline step:

1. Use `TabularDataset.as_named_inputs()` or `FileDataset.as_named_input()` (no 's' at end)to create a `DatasetConsumptionConfig` object
1. Use `as_mount()` or `as_download()` to set the access mode
1. Pass the datasets to your pipeline steps using either the `arguments` or the `inputs` argument

The following snippet shows the common pattern of combining these steps within the `PythonScriptStep` constructor: 

```python

train_step = PythonScriptStep(
    name="train_data", 
    script_name="train.py", 
    compute_target=cluster, 
    inputs=[iris_dataset.as_named_inputs('iris').as_mount()]
)
```

In addition, you can use methods such as `random_split()` and `take_sample()` to create multiple inputs or reduce the amount of data passed to your pipeline step:

```python
seed = 42 # PRNG seed
smaller_dataset = iris_dataset.take_sample(0.1, seed=seed) # 10% 
train, test = smaller_dataset.random_split(percentage=0.8, seed=seed)

train_step = PythonScriptStep(
    name="train_data", 
    script_name="train.py", 
    compute_target=cluster, 
    inputs=[train.as_named_inputs('train').as_download(), test.as_named_inputs('test').as_download()]
)
```

### Access a dataset within your script

Named inputs to your pipeline step script are available as a dictionary within the `Run` object. Retrieve the active `Run` object using `Run.get_context()` and then retrieve the dictionary of named inputs using `input_datasets`. If you passed the `DatasetConsumptionConfig` object using the `arguments` argument rather than the `inputs` argument, access the data using `ArgParser` code. Both techniques are demonstrated in the following snippet.

```python
# In pipeline definition script:
# Code for demonstration only: No good reason to use both `arguments` and `inputs`
train_step = PythonScriptStep(
    name="train_data",
    script_name="train.py",
    compute_target=cluster,
    arguments=['--training-folder', train.as_named_inputs('train').as_download()]
    inputs=[test.as_named_inputs('test').as_download()]
)

# In pipeline script
parser = argparse.ArgumentParser()
parser.add_argument('--training-folder', type=str, dest='train_folder', help='training data folder mounting point')
args = parser.parse_args()
training_data_folder = args.train_folder 

testing_data_folder = Run.get_context().input_datasets['test']
```

The passed value will be the path to the dataset file(s). 

It is also possible to access a registered `Dataset` directly. Since registered datasets are persistent and shared across a workspace, you can retrieve them directly:

```python
run = Run.get_context()
ws = run.experiment.workspace
ds = Dataset.get_by_name(workspace=ws, name='mnist_opendataset')
```

## Use `PipelineData` for intermediate data

While `Dataset` objects represent persistent data, `PipelineData` objects are used for temporary data that is output from pipeline steps. Because the lifespan of a `PipelineData` object is longer than a single pipeline step, you define them in the pipeline definition script. When you create a `PipelineData` object, you must provide a name and a datastore to which the data will listen. Pass your `PipelineData` object(s) to your `PythonScriptStep` using _both_ the `arguments` and the `outputs` arguments: 

```python
default_datastore = workspace.get_default_datastore()
dataprep_output = PipelineData("clean_data", datastore=default_datastore)

dataprep_step = PythonScriptStep(
    name="prep_data",
    script_name="dataprep.py",
    compute_target=cluster,
    arguments=["--output-path", dataprep_output]
    inputs=[Dataset.get_by_name(workspace, 'raw_data')],
    outputs=[dataprep_output]
)
```
tk mount vs upload tk


### Use `PipelineData` as an output of a training step 

Within your pipeline's `PythonScriptStep`, you can retrieve the available output paths using the program's arguments. If this is the first step and will initialize the output data, you must create the directory at the specified path. You can then write whatever files you wish to be contained in the `PipelineData`. 

```python
parser = argparse.ArgumentParser()
parser.add_argument('--output_path', dest='output_path', required=True)
args = parser.parse_args()

# Make directory for file
os.makedirs(os.path.dirname(args.output_path), exist_ok=True)
with open(args.output_path, 'w') as f: 
    f.write("Step 1's output")
```

