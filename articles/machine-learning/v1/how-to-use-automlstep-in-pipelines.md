---
title: Use automated ML in ML pipelines 
titleSuffix: Azure Machine Learning
description: The AutoMLStep allows you to use automated machine learning in your pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: automl
author: manashgoswami 
ms.author: magoswam
ms.reviewer: ssalgado
ms.date: 11/04/2022
ms.topic: how-to
ms.custom: UpdateFrequency5, devx-track-python, automl, sdkv1, event-tier1-build-2022
---

# Use automated ML in an Azure Machine Learning pipeline in Python

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

Azure Machine Learning's automated ML capability helps you discover high-performing models without you reimplementing every possible approach. Combined with Azure Machine Learning pipelines, you can create deployable workflows that can quickly discover the algorithm that works best for your data. This article will show you how to efficiently join a data preparation step to an automated ML step. Automated ML can quickly discover the algorithm that works best for your data, while putting you on the road to MLOps and model lifecycle operationalization with pipelines.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://azure.microsoft.com/free/) today.

* An Azure Machine Learning workspace. See [Create workspace resources](../quickstart-create-resources.md).  

* Familiarity with Azure's [automated machine learning](../concept-automated-ml.md) and [machine learning pipelines](../concept-ml-pipelines.md) facilities and SDK.

## Review automated ML's central classes

Automated ML in a pipeline is represented by an `AutoMLStep` object. The `AutoMLStep` class is a subclass of `PipelineStep`. A graph of `PipelineStep` objects defines a `Pipeline`.

There are several subclasses of `PipelineStep`. In addition to the `AutoMLStep`, this article will show a `PythonScriptStep` for data preparation and another for registering the model.

The preferred way to initially move data _into_ an ML pipeline is with `Dataset` objects. To move data _between_ steps and possible save data output from runs, the preferred way is with [`OutputFileDatasetConfig`](/python/api/azureml-core/azureml.data.outputfiledatasetconfig) and [`OutputTabularDatasetConfig`](/python/api/azureml-core/azureml.data.output_dataset_config.outputtabulardatasetconfig) objects. To be used with `AutoMLStep`, the `PipelineData` object must be transformed into a `PipelineOutputTabularDataset` object. For more information, see [Input and output data from ML pipelines](how-to-move-data-in-out-of-pipelines.md).

The `AutoMLStep` is configured via an `AutoMLConfig` object. `AutoMLConfig` is a flexible class, as discussed in [Configure automated ML experiments in Python](../how-to-configure-auto-train.md#configure-your-experiment-settings). 

A `Pipeline` runs in an `Experiment`. The pipeline `Run` has, for each step, a child `StepRun`. The outputs of the automated ML `StepRun` are the training metrics and highest-performing model.

To make things concrete, this article creates a simple pipeline for a classification task. The task is predicting Titanic survival, but we won't be discussing the data or task except in passing.

## Get started

### Retrieve initial dataset

Often, an ML workflow starts with pre-existing baseline data. This is a good scenario for a registered dataset. Datasets are visible across the workspace, support versioning, and can be interactively explored. There are many ways to create and populate a dataset, as discussed in [Create Azure Machine Learning datasets](how-to-create-register-datasets.md). Since we'll be using the Python SDK to create our pipeline, use the SDK to download baseline data and register it with the name 'titanic_ds'.

```python
from azureml.core import Workspace, Dataset

ws = Workspace.from_config()
if not 'titanic_ds' in ws.datasets.keys() :
    # create a TabularDataset from Titanic training data
    web_paths = ['https://dprepdata.blob.core.windows.net/demo/Titanic.csv',
                 'https://dprepdata.blob.core.windows.net/demo/Titanic2.csv']
    titanic_ds = Dataset.Tabular.from_delimited_files(path=web_paths)

    titanic_ds.register(workspace = ws,
                                     name = 'titanic_ds',
                                     description = 'Titanic baseline data',
                                     create_new_version = True)

titanic_ds = Dataset.get_by_name(ws, 'titanic_ds')
```

The code first logs in to the Azure Machine Learning workspace defined in **config.json** (for an explanation, see [Create a workspace configuration file](how-to-configure-environment.md). If there isn't already a dataset named `'titanic_ds'` registered, then it creates one. The code downloads CSV data from the Web, uses them to instantiate a `TabularDataset` and then registers the dataset with the workspace. Finally, the function `Dataset.get_by_name()` assigns the `Dataset` to `titanic_ds`. 

### Configure your storage and compute target

Additional resources that the pipeline will need are storage and, generally, Azure Machine Learning compute resources. 

```python
from azureml.core import Datastore
from azureml.core.compute import AmlCompute, ComputeTarget

datastore = ws.get_default_datastore()

compute_name = 'cpu-cluster'
if not compute_name in ws.compute_targets :
    print('creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_D2_V2',
                                                                min_nodes=0,
                                                                max_nodes=1)
    compute_target = ComputeTarget.create(ws, compute_name, provisioning_config)

    compute_target.wait_for_completion(
        show_output=True, min_node_count=None, timeout_in_minutes=20)

    # Show the result
    print(compute_target.get_status().serialize())

compute_target = ws.compute_targets[compute_name]
```

> [!NOTE]
> You may choose to use [low-priority VMs](../how-to-manage-optimize-cost.md#low-pri-vm) to run some or all of your workloads. See how to [create a low-priority VM](how-to-create-attach-compute-cluster.md#lower-your-compute-cluster-cost-with-low-priority-vms).

The intermediate data between the data preparation and the automated ML step can be stored in the workspace's default datastore, so we don't need to do more than call `get_default_datastore()` on the `Workspace` object. 

After that, the code checks if the Azure Machine Learning compute target `'cpu-cluster'` already exists. If not, we specify that we want a small CPU-based compute target. If you plan to use automated ML's deep learning features (for instance, text featurization with DNN support) you should choose a compute with strong GPU support, as described in [GPU optimized virtual machine sizes](../../virtual-machines/sizes-gpu.md). 

The code blocks until the target is provisioned and then prints some details of the just-created compute target. Finally, the named compute target is retrieved from the workspace and assigned to `compute_target`. 

### Configure the training run

The runtime context is set by creating and configuring a `RunConfiguration` object. Here we set the compute target.

```python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies

aml_run_config = RunConfiguration()
# Use just-specified compute target ("cpu-cluster")
aml_run_config.target = compute_target

# Specify CondaDependencies obj, add necessary packages
aml_run_config.environment.python.conda_dependencies = CondaDependencies.create(
    conda_packages=['pandas','scikit-learn'], 
    pip_packages=['azureml-sdk[automl]', 'pyarrow'])
```

## Prepare data for automated machine learning

### Write the data preparation code

The baseline Titanic dataset consists of mixed numerical and text data, with some values missing. To prepare it for automated machine learning, the data preparation pipeline step will:

- Fill missing data with either random data or a category corresponding to "Unknown"
- Transform categorical data to integers
- Drop columns that we don't intend to use
- Split the data into training and testing sets
- Write the transformed data to the `OutputFileDatasetConfig` output paths

```python
%%writefile dataprep.py
from azureml.core import Run

import pandas as pd 
import numpy as np 
import argparse

RANDOM_SEED=42

def prepare_age(df):
    # Fill in missing Age values from distribution of present Age values 
    mean = df["Age"].mean()
    std = df["Age"].std()
    is_null = df["Age"].isnull().sum()
    # compute enough (== is_null().sum()) random numbers between the mean, std
    rand_age = np.random.randint(mean - std, mean + std, size = is_null)
    # fill NaN values in Age column with random values generated
    age_slice = df["Age"].copy()
    age_slice[np.isnan(age_slice)] = rand_age
    df["Age"] = age_slice
    df["Age"] = df["Age"].astype(int)
    
    # Quantize age into 5 classes
    df['Age_Group'] = pd.qcut(df['Age'],5, labels=False)
    df.drop(['Age'], axis=1, inplace=True)
    return df

def prepare_fare(df):
    df['Fare'].fillna(0, inplace=True)
    df['Fare_Group'] = pd.qcut(df['Fare'],5,labels=False)
    df.drop(['Fare'], axis=1, inplace=True)
    return df 

def prepare_genders(df):
    genders = {"male": 0, "female": 1, "unknown": 2}
    df['Sex'] = df['Sex'].map(genders)
    df['Sex'].fillna(2, inplace=True)
    df['Sex'] = df['Sex'].astype(int)
    return df

def prepare_embarked(df):
    df['Embarked'].replace('', 'U', inplace=True)
    df['Embarked'].fillna('U', inplace=True)
    ports = {"S": 0, "C": 1, "Q": 2, "U": 3}
    df['Embarked'] = df['Embarked'].map(ports)
    return df
    
parser = argparse.ArgumentParser()
parser.add_argument('--output_path', dest='output_path', required=True)
args = parser.parse_args()
    
titanic_ds = Run.get_context().input_datasets['titanic_ds']
df = titanic_ds.to_pandas_dataframe().drop(['PassengerId', 'Name', 'Ticket', 'Cabin'], axis=1)
df = prepare_embarked(prepare_genders(prepare_fare(prepare_age(df))))

df.to_csv(os.path.join(args.output_path,"prepped_data.csv"))

print(f"Wrote prepped data to {args.output_path}/prepped_data.csv")
```

The above code snippet is a complete, but minimal, example of data preparation for the Titanic data. The snippet starts with a Jupyter "magic command" to output the code to a file. If you aren't using a Jupyter notebook, remove that line and create the file manually.

The various `prepare_` functions in the above snippet modify the relevant column in the input dataset. These functions work on the data once it has been changed into a Pandas `DataFrame` object. In each case, missing data is either filled with representative random data or categorical data indicating "Unknown." Text-based categorical data is mapped to integers. No-longer-needed columns are overwritten or dropped. 

After the code defines the data preparation functions, the code parses the input argument, which is the path to which we want to write our data.  (These values will be determined by `OutputFileDatasetConfig` objects that will be discussed in the next step.) The code retrieves the registered `'titanic_cs'` `Dataset`, converts it to a Pandas `DataFrame`, and calls the various data preparation functions. 

Since the `output_path` is a directory, the call to `to_csv()` specifies the filename `prepped_data.csv`.

### Write the data preparation pipeline step (`PythonScriptStep`)

The data preparation code described above must be associated with a `PythonScripStep` object to be used with a pipeline. The path to which the CSV output is written is generated by a `OutputFileDatasetConfig` object. The resources prepared earlier, such as the `ComputeTarget`, the `RunConfig`, and the `'titanic_ds' Dataset` are used to complete the specification.

```python
from azureml.data import OutputFileDatasetConfig
from azureml.pipeline.steps import PythonScriptStep

prepped_data_path = OutputFileDatasetConfig(name="output_path")

dataprep_step = PythonScriptStep(
    name="dataprep", 
    script_name="dataprep.py", 
    compute_target=compute_target, 
    runconfig=aml_run_config,
    arguments=["--output_path", prepped_data_path],
    inputs=[titanic_ds.as_named_input('titanic_ds')],
    allow_reuse=True
)
```

The `prepped_data_path` object is of type `OutputFileDatasetConfig` which points to a directory.  Notice that it's specified in the `arguments` parameter. If you review the previous step, you'll see that within the data preparation code, the value of the argument `'--output_path'` is the directory path at which the CSV file was written. 

## Train with AutoMLStep

Configuring an automated ML pipeline step is done with the `AutoMLConfig` class. This flexible class is described in [Configure automated ML experiments in Python](../how-to-configure-auto-train.md). Data input and output are the only aspects of configuration that require special attention in an ML pipeline. Input and output for `AutoMLConfig` in pipelines is discussed in detail below. Beyond data, an advantage of ML pipelines is the ability to use different compute targets for different steps. You might choose to use a more powerful `ComputeTarget` only for the automated ML process. Doing so is as straightforward as assigning a more powerful `RunConfiguration` to the `AutoMLConfig` object's `run_configuration` parameter.

### Send data to `AutoMLStep`

In an ML pipeline, the input data must be a `Dataset` object. The highest-performing way is to provide the input data in the form of `OutputTabularDatasetConfig` objects. You create an object of that type with the  `read_delimited_files()` on a `OutputFileDatasetConfig`, such as the `prepped_data_path`, such as the `prepped_data_path` object.

```python
# type(prepped_data) == OutputTabularDatasetConfig
prepped_data = prepped_data_path.read_delimited_files()
```

Another option is to use `Dataset` objects registered in the workspace:

```python
prepped_data = Dataset.get_by_name(ws, 'Data_prepared')
```

Comparing the two techniques:

| Technique | Benefits and drawbacks | 
|-|-|
|`OutputTabularDatasetConfig`| Higher performance | 
|| Natural route from `OutputFileDatasetConfig` | 
|| Data isn't persisted after pipeline run |
||  |
| Registered `Dataset` | Lower performance |
| | Can be generated in many ways | 
| | Data persists and is visible throughout workspace |
| | [Notebook showing registered `Dataset` technique](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/continuous-retraining/auto-ml-continuous-retraining.ipynb)


### Specify automated ML outputs

The outputs of the `AutoMLStep` are the final metric scores of the higher-performing model and that model itself. To use these outputs in further pipeline steps, prepare `OutputFileDatasetConfig` objects to receive them.

```python
from azureml.pipeline.core import TrainingOutput, PipelineData

metrics_data = PipelineData(name='metrics_data',
                            datastore=datastore,
                            pipeline_output_name='metrics_output',
                            training_output=TrainingOutput(type='Metrics'))

model_data = PipelineData(name='best_model_data',
                          datastore=datastore,
                          pipeline_output_name='model_output',
                          training_output=TrainingOutput(type='Model'))
```

The snippet above creates the two `PipelineData` objects for the metrics and model output. Each is named, assigned to the default datastore retrieved earlier, and associated with the particular `type` of `TrainingOutput` from the `AutoMLStep`. Because we assign `pipeline_output_name` on these `PipelineData` objects, their values will be available not just from the individual pipeline step, but from the pipeline as a whole, as will be discussed below in the section "Examine pipeline results." 

### Configure and create the automated ML pipeline step

Once the inputs and outputs are defined, it's time to create the `AutoMLConfig` and `AutoMLStep`. The details of the configuration will depend on your task, as described in [Configure automated ML experiments in Python](../how-to-configure-auto-train.md). For the Titanic survival classification task, the following snippet demonstrates a simple configuration.

```python
from azureml.train.automl import AutoMLConfig
from azureml.pipeline.steps import AutoMLStep

# Change iterations to a reasonable number (50) to get better accuracy
automl_settings = {
    "iteration_timeout_minutes" : 10,
    "iterations" : 2,
    "experiment_timeout_hours" : 0.25,
    "primary_metric" : 'AUC_weighted'
}

automl_config = AutoMLConfig(task = 'classification',
                             path = '.',
                             debug_log = 'automated_ml_errors.log',
                             compute_target = compute_target,
                             run_configuration = aml_run_config,
                             featurization = 'auto',
                             training_data = prepped_data,
                             label_column_name = 'Survived',
                             **automl_settings)

train_step = AutoMLStep(name='AutoML_Classification',
    automl_config=automl_config,
    passthru_automl_config=False,
    outputs=[metrics_data,model_data],
    enable_default_model_output=False,
    enable_default_metrics_output=False,
    allow_reuse=True)
```
The snippet shows an idiom commonly used with `AutoMLConfig`. Arguments that are more fluid (hyperparameter-ish) are specified in a separate dictionary while the values less likely to change are specified directly in the `AutoMLConfig` constructor. In this case, the `automl_settings` specify a brief run: the run will stop after only 2 iterations or 15 minutes, whichever comes first.

The `automl_settings` dictionary is passed to the `AutoMLConfig` constructor as kwargs. The other parameters aren't complex:

- `task` is set to `classification` for this example. Other valid values are `regression` and `forecasting`
- `path` and `debug_log` describe the path to the project and a local file to which debug information will be written 
- `compute_target` is the previously defined `compute_target` that, in this example, is an inexpensive CPU-based machine. If you're using AutoML's Deep Learning facilities, you would want to change the compute target to be GPU-based
- `featurization` is set to `auto`. More details can be found in the [Data Featurization](../how-to-configure-auto-train.md#data-featurization) section of the automated ML configuration document 
- `label_column_name` indicates which column we are interested in predicting 
- `training_data` is set to the `OutputTabularDatasetConfig` objects made from the outputs of the data preparation step 

The `AutoMLStep` itself takes the `AutoMLConfig` and has, as outputs, the `PipelineData` objects created to hold the metrics and model data. 

>[!Important]
> You must set `enable_default_model_output` and `enable_default_metrics_output`  to `True` only if you are using  `AutoMLStepRun`.

In this example, the automated ML process will perform cross-validations on the `training_data`. You can control the number of cross-validations with the `n_cross_validations` argument. If you've already split your training data as part of your data preparation steps, you can set `validation_data` to its own `Dataset`.

You might occasionally see the use `X` for data features and `y` for data labels. This technique is deprecated and you should use `training_data` for input. 

## Register the model generated by automated ML 

The last step in a simple ML pipeline is registering the created model. By adding the model to the workspace's model registry, it will be available in the portal and can be versioned. To register the model, write another `PythonScriptStep` that takes the `model_data` output of the `AutoMLStep`.

### Write the code to register the model

A model is registered in a `Workspace`. You're probably familiar with using `Workspace.from_config()` to log on to your workspace on your local machine, but there's another way to get the workspace from within a running ML pipeline. The `Run.get_context()` retrieves the active `Run`. This `run` object provides access to many important objects, including the `Workspace` used here.

```python
%%writefile register_model.py
from azureml.core.model import Model, Dataset
from azureml.core.run import Run, _OfflineRun
from azureml.core import Workspace
import argparse

parser = argparse.ArgumentParser()
parser.add_argument("--model_name", required=True)
parser.add_argument("--model_path", required=True)
args = parser.parse_args()

print(f"model_name : {args.model_name}")
print(f"model_path: {args.model_path}")

run = Run.get_context()
ws = Workspace.from_config() if type(run) == _OfflineRun else run.experiment.workspace

model = Model.register(workspace=ws,
                       model_path=args.model_path,
                       model_name=args.model_name)

print("Registered version {0} of model {1}".format(model.version, model.name))
```

### Write the PythonScriptStep code


> [!WARNING]
> If you are using the Azure Machine Learning SDK v1, and your workspace is configured for network isolation (VNet), you may receive an error when running this step. For more information, see [HyperdriveStep and AutoMLStep fail with network isolation](how-to-debug-pipelines.md#hyperdrivestep-and-automlstep-fail-with-network-isolation).

The model-registering `PythonScriptStep` uses a `PipelineParameter` for one of its arguments. Pipeline parameters are arguments to pipelines that can be easily set at run-submission time. Once declared, they're passed as normal arguments. 

```python

from azureml.pipeline.core.graph import PipelineParameter

# The model name with which to register the trained model in the workspace.
model_name = PipelineParameter("model_name", default_value="TitanicSurvivalInitial")

register_step = PythonScriptStep(script_name="register_model.py",
                                       name="register_model",
                                       allow_reuse=False,
                                       arguments=["--model_name", model_name, "--model_path", model_data],
                                       inputs=[model_data],
                                       compute_target=compute_target,
                                       runconfig=aml_run_config)
```

## Create and run your automated ML pipeline

Creating and running a pipeline that contains an `AutoMLStep` is no different than a normal pipeline. 

```python
from azureml.pipeline.core import Pipeline
from azureml.core import Experiment

pipeline = Pipeline(ws, [dataprep_step, train_step, register_step])

experiment = Experiment(workspace=ws, name='titanic_automl')

run = experiment.submit(pipeline, show_output=True)
run.wait_for_completion()
```

The code above combines the data preparation, automated ML, and model-registering steps into a `Pipeline` object. It then creates an `Experiment` object. The `Experiment` constructor will retrieve the named experiment if it exists or create it if necessary. It submits the `Pipeline` to the `Experiment`, creating a `Run` object that will asynchronously run the pipeline. The `wait_for_completion()` function blocks until the run completes.

### Examine pipeline results 

Once the `run` completes, you can retrieve `PipelineData` objects that have been assigned a `pipeline_output_name`. You can download the results and load them for further processing.  

```python
metrics_output_port = run.get_pipeline_output('metrics_output')
model_output_port = run.get_pipeline_output('model_output')

metrics_output_port.download('.', show_progress=True)
model_output_port.download('.', show_progress=True)
```

Downloaded files are written to the subdirectory `azureml/{run.id}/`. The metrics file is JSON-formatted and can be converted into a Pandas dataframe for examination.

For local processing, you may need to install relevant packages, such as Pandas, Pickle, the Azure Machine Learning SDK, and so forth. For this example, it's likely that the best model found by automated ML will depend on XGBoost.

```bash
!pip install xgboost==0.90
```

```python
import pandas as pd
import json

metrics_filename = metrics_output._path_on_datastore
# metrics_filename = path to downloaded file
with open(metrics_filename) as f:
   metrics_output_result = f.read()
   
deserialized_metrics_output = json.loads(metrics_output_result)
df = pd.DataFrame(deserialized_metrics_output)
df
```

The code snippet above shows the metrics file being loaded from its location on the Azure datastore. You can also load it from the downloaded file, as shown in the comment. Once you've deserialized it and converted it to a Pandas DataFrame, you can see detailed metrics for each of the iterations of the automated ML step.

The model file can be deserialized into a `Model` object that you can use for inferencing, further metrics analysis, and so forth. 

```python
import pickle

model_filename = model_output._path_on_datastore
# model_filename = path to downloaded file

with open(model_filename, "rb" ) as f:
    best_model = pickle.load(f)

# ... inferencing code not shown ...
```

For more information on loading and working with existing models, see [Use an existing model with Azure Machine Learning](how-to-deploy-and-where.md).

### Download the results of an automated ML run

If you've been following along with the article, you'll have an instantiated `run` object. But you can also retrieve completed `Run` objects from the `Workspace` by way of an `Experiment` object.

The workspace contains a complete record of all your experiments and runs. You can either use the portal to find and download the outputs of experiments or use code. To access the records from a historic run, use Azure Machine Learning to find the ID of the run in which you are interested. With that ID, you can choose the specific `run` by way of the `Workspace` and `Experiment`.

```python
# Retrieved from Azure Machine Learning web UI
run_id = 'aaaaaaaa-bbbb-cccc-dddd-0123456789AB'
experiment = ws.experiments['titanic_automl']
run = next(run for run in ex.get_runs() if run.id == run_id)
```

You would have to change the strings in the above code to the specifics of your historical run. The snippet above assumes that you've assigned `ws` to the relevant `Workspace` with the normal `from_config()`. The experiment of interest is directly retrieved and then the code finds the `Run` of interest by matching the `run.id` value.

Once you have a `Run` object, you can download the metrics and model. 

```python
automl_run = next(r for r in run.get_children() if r.name == 'AutoML_Classification')
outputs = automl_run.get_outputs()
metrics = outputs['default_metrics_AutoML_Classification']
model = outputs['default_model_AutoML_Classification']

metrics.get_port_data_reference().download('.')
model.get_port_data_reference().download('.')
```

Each `Run` object contains `StepRun` objects that contain information about the individual pipeline step run. The `run` is searched for the `StepRun` object for the `AutoMLStep`. The metrics and model are retrieved using their default names, which are available even if you don't pass `PipelineData` objects to the `outputs` parameter of the `AutoMLStep`. 

Finally, the actual metrics and model are downloaded to your local machine, as was discussed in the "Examine pipeline results" section above.

## Next Steps

- Run this Jupyter notebook showing a [complete example of automated ML in a pipeline](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/nyc-taxi-data-regression-model-building/nyc-taxi-data-regression-model-building.ipynb) that uses regression to predict taxi fares
- [Create automated ML experiments without writing code](../how-to-use-automated-ml-for-ml-models.md)
- Explore a variety of [Jupyter notebooks demonstrating automated ML](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning)
- Read about integrating your pipeline in to [End-to-end MLOps](./concept-model-management-and-deployment.md) or investigate the [MLOps GitHub repository](https://github.com/Microsoft/MLOpspython)