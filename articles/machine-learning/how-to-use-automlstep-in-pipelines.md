---
title: Use automated ML in ML pipelines 
titleSuffix: Azure Machine Learning
description: The AutoMLStep allows you to use automated machine learning in your pipelines.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.author: laobri
author: lobrien
manager: cgronlun
ms.date: 04/28/2020
ms.custom: tracking-python

---

# Use automated ML in an Azure Machine Learning pipeline in Python
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

Azure Machine Learning's automated ML capability helps you discover high-performing models without you reimplementing every possible approach. Combined with Azure Machine Learning pipelines, you can create deployable workflows that can quickly discover the algorithm that works best for your data. This article will show you how to efficiently join a data preparation step to an automated ML step. Automated ML can quickly discover the algorithm that works best for your data, while putting you on the road to MLOps and model lifecycle operationalization with pipelines.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a free account before you begin. Try the [free or paid version of Azure Machine Learning](https://aka.ms/AMLFree) today.

* An Azure Machine Learning workspace. See [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).  

* Basic familiarity with Azure's [automated machine learning](concept-automated-ml.md) and [machine learning pipelines](concept-ml-pipelines.md) facilities and SDK.

## Review automated ML's central classes

Automated ML in a pipeline is represented by an `AutoMLStep` object. The `AutoMLStep` class is a subclass of `PipelineStep`. A graph of `PipelineStep` objects defines a `Pipeline`.

There are several subclasses of `PipelineStep`. In addition to the `AutoMLStep`, this article will show a `PythonScriptStep` for data preparation and another for registering the model.

The preferred way to initially move data _into_ an ML pipeline is with `Dataset` objects. To move data _between_ steps, the preferred way is with `PipelineData` objects. To be used with `AutoMLStep`, the `PipelineData` object must be transformed into a `PipelineOutputTabularDataset` object. For more information, see [Input and output data from ML pipelines](how-to-move-data-in-out-of-pipelines.md).

The `AutoMLStep` is configured via an `AutoMLConfig` object. `AutoMLConfig` is a flexible class, as discussed in [Configure automated ML experiments in Python](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#configure-your-experiment-settings). 

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

The code first logs in to the Azure Machine Learning workspace defined in **config.json** (for an explanation, see [Tutorial: Get started creating your first ML experiment with the Python SDK](tutorial-1st-experiment-sdk-setup.md)). If there isn't already a dataset named `'titanic_ds'` registered, then it creates one. The code downloads CSV data from the Web, uses them to instantiate a `TabularDataset` and then registers the dataset with the workspace. Finally, the function `Dataset.get_by_name()` assigns the `Dataset` to `titanic_ds`. 

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

The intermediate data between the data preparation and the automated ML step can be stored in the workspace's default datastore, so we don't need to do more than call `get_default_datastore()` on the `Workspace` object. 

After that, the code checks if the AML compute target `'cpu-cluster'` already exists. If not, we specify that we want a small CPU-based compute target. If you plan to use automated ML's deep learning features (for instance, text featurization with DNN support) you should choose a compute with strong GPU support, as described in [GPU optimized virtual machine sizes](https://docs.microsoft.com/azure/virtual-machines/sizes-gpu). 

The code blocks until the target is provisioned and then prints some details of the just-created compute target. Finally, the named compute target is retrieved from the workspace and assigned to `compute_target`. 

### Configure the training run

The next step is making sure that the remote training run has all the dependencies that are required by the training steps. Dependencies and the runtime context are set by creating and configuring a `RunConfiguration` object. 

```python
from azureml.core.runconfig import RunConfiguration
from azureml.core.conda_dependencies import CondaDependencies
from azureml.core import Environment 

aml_run_config = RunConfiguration()
# Use just-specified compute target ("cpu-cluster")
aml_run_config.target = compute_target

USE_CURATED_ENV = True
if USE_CURATED_ENV :
    curated_environment = Environment.get(workspace=ws, name="AzureML-Tutorial")
    aml_run_config.environment = curated_environment
else:
    aml_run_config.environment.python.user_managed_dependencies = False
    
    # Add some packages relied on by data prep step
    aml_run_config.environment.python.conda_dependencies = CondaDependencies.create(
        conda_packages=['pandas','scikit-learn'], 
        pip_packages=['azureml-sdk[automl,explain]', 'azureml-dataprep[fuse,pandas]'], 
        pin_sdk_version=False)
```

The code above shows two options for handling dependencies. As presented, with `USE_CURATED_ENV = True`, the configuration is based on a curated environment. Curated environments are "prebaked" with common inter-dependent libraries and can be significantly faster to bring online. Curated environments have prebuilt Docker images in the [Microsoft Container Registry](https://hub.docker.com/publishers/microsoftowner). The path taken if you change `USE_CURATED_ENV` to `False` shows the pattern for explicitly setting your dependencies. In that scenario, a new custom Docker image will be created and registered in an Azure Container Registry within your resource group (see [Introduction to private Docker container registries in Azure](https://docs.microsoft.com/azure/container-registry/container-registry-intro)). Building and registering this image can take quite a few minutes. 

## Prepare data for automated machine learning

### Write the data preparation code

The baseline Titanic dataset consists of mixed numerical and text data, with some values missing. To prepare it for automated machine learning, the data preparation pipeline step will:

- Fill missing data with either random data or a category corresponding to "Unknown"
- Transform categorical data to integers
- Drop columns that we don't intend to use
- Split the data into training and testing sets
- Write the transformed data to the `PipelineData` output paths

```python
%%writefile dataprep.py
from azureml.core import Run

import pandas as pd 
import numpy as np 
import pyarrow as pa
import pyarrow.parquet as pq
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

os.makedirs(os.path.dirname(args.output_path), exist_ok=True)
pq.write_table(pa.Table.from_pandas(df), args.output_path)

print(f"Wrote test to {args.output_path} and train to {args.output_path}")
```

The above code snippet is a complete, but minimal, example of data preparation for the Titanic data. The snippet starts with a Jupyter "magic command" to output the code to a file. If you aren't using a Jupyter notebook, remove that line and create the file manually.

The various `prepare_` functions in the above snippet modify the relevant column in the input dataset. These functions work on the data once it has been changed into a Pandas `DataFrame` object. In each case, missing data is either filled with representative random data or categorical data indicating "Unknown." Text-based categorical data is mapped to integers. No-longer-needed columns are overwritten or dropped. 

After the code defines the data preparation functions, the code parses the input argument, which is the path to which we want to write our data. (These values will be determined by `PipelineData` objects that will be discussed in the next step.) The code retrieves the registered `'titanic_cs'` `Dataset`, converts it to a Pandas `DataFrame`, and calls the various data preparation functions. 

Since the `output_path` is fully qualified, the function `os.makedirs()` is used to prepare the directory structure. At this point, you could use `DataFrame.to_csv()` to write the output data, but Parquet files are  more efficient. This efficiency would probably be irrelevant with such a small dataset, but using the **PyArrow** package's `from_pandas()` and `write_table()` functions are only a few more keystrokes than `to_csv()`.

Parquet files are natively supported by the automated ML step discussed below, so no special processing is required to consume them. 

### Write the data preparation pipeline step (`PythonScriptStep`)

The data preparation code described above must be associated with a `PythonScripStep` object to be used with a pipeline. The path to which the Parquet data-preparation output is written is generated by a `PipelineData` object. The resources prepared earlier, such as the `ComputeTarget`, the `RunConfig`, and the `'titanic_ds' Dataset` are used to complete the specification.

```python
from azureml.pipeline.core import PipelineData
from azureml.pipeline.steps import PythonScriptStep

prepped_data_path = PipelineData("titanic_train", datastore).as_dataset()
prepped_data_path = PipelineData("titanic_train", datastore).as_dataset()

dataprep_step = PythonScriptStep(
    name="dataprep", 
    script_name="dataprep.py", 
    compute_target=compute_target, 
    runconfig=aml_run_config,
    arguments=["--output_path", prepped_data_path],
    inputs=[titanic_ds.as_named_input("titanic_ds")],
    outputs=[prepped_data_path],
    allow_reuse=True
)
```

The `prepped_data_path` object is of type `PipelineOutputFileDataset`. Notice that it's specified in both the `arguments` and `outputs` arguments. If you review the previous step, you'll see that within the data preparation code, the value of the argument `'--output_path'` is the file path to which the Parquet file was written. 

## Train with AutoMLStep

Configuring an automated ML pipeline step is done with the `AutoMLConfig` class. This flexible class is described in [Configure automated ML experiments in Python](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train). Data input and output are the only aspects of configuration that require special attention in an ML pipeline. Input and output for `AutoMLConfig` in pipelines is discussed in detail below. Beyond data, an advantage of ML pipelines is the ability to use different compute targets for different steps. You might choose to use a more powerful `ComputeTarget` only for the automated ML process. Doing so is as straightforward as assigning a more powerful `RunConfiguration` to the `AutoMLConfig` object's `run_configuration` parameter.

### Send data to `AutoMLStep`

In an ML pipeline, the input data must be a `Dataset` object. The highest-performing way is to provide the input data in the form of `PipelineOutputTabularDataset` objects. You create an object of that type with the `parse_parquet_files()` or `parse_delimited_files()` on a `PipelineOutputFileDataset`, such as the `prepped_data_path` object.

```python
# type(prepped_data_path) == PipelineOutputFileDataset
# type(prepped_data) == PipelineOutputTabularDataset
prepped_data = prepped_data_path.parse_parquet_files(file_extension=None)
```

The snippet above creates a high-performing `PipelineOutputTabularDataset` from the `PipelineOutputFileDataset` output of the data preparation step.

Another option is to use `Dataset` objects registered in the workspace:

```python
prepped_data = Dataset.get_by_name(ws, 'Data_prepared')
```

Comparing the two techniques:

| Technique |  | 
|-|-|
|`PipelineOutputTabularDataset`| Higher performance | 
|| Natural route from `PipelineData` | 
|| Data isn't persisted after pipeline run |
|| [Notebook showing `PipelineOutputTabularDataset` technique](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/nyc-taxi-data-regression-model-building/nyc-taxi-data-regression-model-building.ipynb) |
| Registered `Dataset` | Lower performance |
| | Can be generated in many ways | 
| | Data persists and is visible throughout workspace |
| | [Notebook showing registered `Dataset` technique](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/automated-machine-learning/continuous-retraining/auto-ml-continuous-retraining.ipynb)

### Specify automated ML outputs

The outputs of the `AutoMLStep` are the final metric scores of the higher-performing model and that model itself. To use these outputs in further pipeline steps, prepare `PipelineData` objects to receive them.

```python
from azureml.pipeline.core import TrainingOutput

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

Once the inputs and outputs are defined, it's time to create the `AutoMLConfig` and `AutoMLStep`. The details of the configuration will depend on your task, as described in [Configure automated ML experiments in Python](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train). For the Titanic survival classification task, the following snippet demonstrates a simple configuration.

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
    allow_reuse=True)
```
The snippet shows an idiom commonly used with `AutoMLConfig`. Arguments that are more fluid (hyperparameter-ish) are specified in a separate dictionary while the values less likely to change are specified directly in the `AutoMLConfig` constructor. In this case, the `automl_settings` specify a brief run: the run will stop after only 2 iterations or 15 minutes, whichever comes first.

The `automl_settings` dictionary is passed to the `AutoMLConfig` constructor as kwargs. The other parameters aren't complex:

- `task` is set to `classification` for this example. Other valid values are `regression` and `forecasting`
- `path` and `debug_log` describe the path to the project and a local file to which debug information will be written 
- `compute_target` is the previously defined `compute_target` that, in this example, is an inexpensive CPU-based machine. If you're using AutoML's Deep Learning facilities, you would want to change the compute target to be GPU-based
- `featurization` is set to `auto`. More details can be found in the [Data Featurization](https://docs.microsoft.com/azure/machine-learning/how-to-configure-auto-train#data-featurization) section of the automated ML configuration document 
- `training_data` is set to the `PipelineOutputTabularDataset` objects made from the outputs of the data preparation step 
- `label_column_name` indicates which column we are interested in predicting 

The `AutoMLStep` itself takes the `AutoMLConfig` and has, as outputs, the `PipelineData` objects created to hold the metrics and model data. 

>[!Important]
> You must set `passthru_automl_config` to `False` if your `AutoMLStep` is using `PipelineOutputTabularDataset` objects for input.

In this example, the automated ML process will perform cross-validations on the `training_data`. You can control the number of cross-validations with the `n_cross_validations` argument. If you've already split your training data as part of your data preparation steps, you can set `validation_data` to its own `Dataset`.

You might occasionally see the use `X` for data features and `y` for data labels. This technique is deprecated and you should use `training_data` for input. 

## Register the model generated by automated ML 

The last step in a basic ML pipeline is registering the created model. By adding the model to the workspace's model registry, it will be available in the portal and can be versioned. To register the model, write another `PythonScriptStep` that takes the `model_data` output of the `AutoMLStep`.

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

For local processing, you may need to install relevant packages, such as Pandas, Pickle, the AzureML SDK, and so forth. For this example, it's likely that the best model found by automated ML will depend on XGBoost.

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

For more information on loading and working with existing models, see [Use an existing model with Azure Machine Learning](how-to-deploy-existing-model.md).

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
- [Create automated ML experiments without writing code](how-to-use-automated-ml-for-ml-models.md)
- Explore a variety of [Jupyter notebooks demonstrating automated ML](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/automated-machine-learning)
- Read about integrating your pipeline in to [End-to-end MLOps](https://docs.microsoft.com/azure/machine-learning/concept-model-management-and-deployment#automate-the-ml-lifecycle) or investigate the [MLOps GitHub repository](https://github.com/Microsoft/MLOpspython) 
