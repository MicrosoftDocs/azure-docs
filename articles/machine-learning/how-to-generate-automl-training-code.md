---
title: How to generate AutoML model training code 
titleSuffix: Azure Machine Learning AutoML
description: How to generate AutoML model training code and explanation of each stage.
services: machine-learning
author: cesardl
ms.author: cesardl
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.custom:  automl
ms.date: 
---

# How to generate AutoML model's training code <!--This is the heading of the page, above in line 2 is the title that shows up on the browser tab and in search results--> 

In this article, you'll learn how to generate the training code from any AutoML trained model and why you'd want to use it.

## What is AutoML model's code generation

‘AutoML Code Generation’ makes AutoML a ‘White Box’ AutoML solution by allowing the user to select any AutoML trained model (winner or child model) and generate the Python training code that created that specific model. Then, explore, customize, and retrain the model using Python before deploying to Azure ML Endpoints or your selected inference execution environment.

Basically, with this feature AutoML generates Python code showing you how data was preprocessed and how algorithms were used exactly, so not only you can understand what AutoML did, you can also reuse and customize that code for further manual tweaking and tuning.

The generated code consists of two parts:

1. Convenient notebook for running the training code in Azure Machine Learning compute.
1. A .py file containing the model's training code (i.e. Scikit-Learn, LightGBM, Auto-Arima, etc.).

![Add a label](media/how-to-generate-automl-model-training-code/generated-code-illustration.png)

So, for instance, the generated Python code for a selected model would be provided in a Jupyter notebook and .py files that will have Python code using OSS libraries under the covers such as Scikit-Learn, LightGBM, Auto-Arima, Prophet, Pandas DataFrame, etc. implementing the following actions:

1. Featurization and data transformation
1. Scaling
1. Training

At this point, the generated model training code is not really AutoML anymore but it’s just about Python libraries using OSS libraries such as Scikit-Learn algorithms, LightGBM, Auto-Arima, etc. which allows you to customize/tune that code, re-train and deploy.

In the diagram below you can see a high level design illustration explaining the usage flow and what are the code's dependencies.

![Add a label](media/how-to-generate-automl-model-training-code/code-gen-design-illustration.png)


## What can you do with this generated model training code?

There are multiple actions you might want to do with this generated model's training code:

1. *Learn:* Learn what featurization process and hyperparameters is the model’s algorithm using.
2. *Track/version/audit*: Train the model with the generated code and store versioned code to track what specific training code is used by the model to be deployed to production (Usually required by certain auditability regulations and organization’s policies).
3. *Customize*: Customize the training code (i.e. changing hyperparameters applying your ML and algorithms skills/experience) and re-train a new model with your customized/extended code.

## Supported scenarios

The current supported scenarios by AutoML Code Generation are:

- Model data pre-process (Featurization and Scaling)
- Classification models
- Regression models
- Time Series Forecasting models

In later versions, 'AutoML for Images' and NLP based models (both currently in Public Preview) will also support model's code generation.

## Prerequisites

<!-- Which packages need to be installed? For public preview, how will users be able to use this new feature capability? -->

* An Azure Machine Learning workspace. To create the workspace, see [Create an Azure Machine Learning workspace](how-to-manage-workspace.md).

* This article assumes some familiarity with setting up an automated machine learning experiment. Follow the [tutorial](tutorial-auto-train-models.md) or [how-to](how-to-configure-auto-train.md) to see the main automated machine learning experiment design patterns.

* AutoML code generation is only enabled for experiments running on a remote Azure ML compute target such as a training cluster. Code generation is not supported for AutoML local runs.

## Install Azure ML SDK in Conda environment 

When using AutoML via the SDK, you will need to ensure that you call `experiment.submit()` from a Conda environment that contains the latest Azure ML SDK with AutoML so it will trigger properly the code generation in the experiments running on a remote compute target.

### Option A - Use environment from an AML Compute Instance

One option is to run your code (notebook with AML SDK code) in an Azure ML Compute Instance with the latest Azure ML SDK already installed. It should have a ready-to-use Conda environment which should be AutoML CodeGen compatible.


### Option B - Use local Conda environment

The other option is to create a new local Conda environment in your local machine and then install the latest Azure ML SDK.

It's recommended to create a new/clean Conda environment, although you could also install Azure ML SDK with AutoML in an existing Coda environment.

In order to install Azure ML SDK with AutoML follow this instructions:

[How to install AutoML client SDK in Conda environment](https://github.com/Azure/azureml-examples/tree/main/python-sdk/tutorials/automl-with-azureml#setup-using-a-local-conda-environment)


## Enable Code Generation in AutoML SDK configuration

Before submitting your AutoML experiment, you need to set the following flag in AutoMLConfig:

- `enable_code_generation=True`

Thus, your AutoMLConfig class it will look something like the following:

```python
config = AutoMLConfig(
    task="classification",
    training_data=data,
    label_column_name="label",
    compute_target=compute_target,
    enable_code_generation=True
)
```
By enabling code generation, in any AutoML parent run (end to end experiment), AutoML will generate the model's training code for each model trained/created by AutoML. 

You can retrieve the code gen artifacts via the UI (see _Viewing Code Generation from the UI_ in the next section), or by running the following code:

```python
remote_run.download_file("outputs/generated_code/script.py", "script.py")
remote_run.download_file("outputs/generated_code/script_run_notebook.ipynb", "script_run_notebook.ipynb")
```

## Access generated code from Azure ML UI

Once an AutoML child run is completed (one per model), you will be able to view the generated code through the UI by clicking the “View generated code” button which can be viewed from the Models tab in the AutoML parent run page.

![models tab view generate code button](media\how-to-generate-automl-model-training-code/ParentModelsViewGenerateCodeBtn.png)

You can also access to the model's generated code from the  top of the child run page (see second image).

![child run page view generated code button](media\how-to-generate-automl-model-training-code/ChildViewGeneratedCodeBtn.png)

After clicking this button, you will be redirected to the Notebooks portal extension where you can view and run the generated code.

## Understanding the generated code

Let's take a look at an example of code generated from a model by AutoML. 

There are two main files with the generated code:
- **script.py**: This is the model's training code, the interesting code you want to analyze with the featurization steps, specific algorithm used and hyperparameters.

- **script_run_notebook.ipynb**: Notebook with boiler-plate code to run the model's training code (script.py) in Azure ML compute through Azure ML SDK classes such as **ScriptRunConfig**. 

## `script.py`
`script.py` contains the core logic needed to train a model using the previously used hyperparameters.
While intended to be executed in the context of an AzureML script run, with some modifications it can also be run standalone.

The script can roughly be broken down into several different parts: data loading, data preparation, data featurization, preprocessor and model specification,
then training.

### Data loading
The function `get_training_dataset()` loads the previously used dataset. It assumes that the script is run in an AzureML script run under the same workspace
as the original experiment.

```python
def get_training_dataset():
    from azureml.core import Dataset, Workspace, Run
    
    ws = Run.get_context().experiment.workspace
    dataset = Dataset.get_by_id(workspace=ws, id='your_dataset_id')
    return dataset.to_pandas_dataframe()
```

When running as part of a script run, `Run.get_context().experiment.workspace` retrieves the correct workspace. However, if this script is run inside of a 
different workspace or run locally without using `ScriptRunConfig`, [you will need to modify it to specify the appropriate workspace explicitly](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.workspace.workspace?view=azure-ml-py).

Once the workspace has been retrieved, the original dataset is retrieved by its ID. Another dataset can also be specified, either using [`get_by_id()`](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#get-by-id-workspace--id-) if you know
its ID, or [`get_by_name()`](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py#get-by-name-workspace--name--version--latest--) if you know its name.

You can also opt to replace this entire function with your own data loading mechanism; the only constraints are that the return value must be a Pandas dataframe and
that the data must have the same shape as in the original experiment.

### Data preparation
The function `prepare_data()` cleans the data, splits out the feature and sample weight columns and prepares the data for use in training.
```python
def prepare_data(dataframe):
    from azureml.automl.runtime import data_cleaning
    
    label_column_name = 'target'
    
    # extract the features, target and sample weight arrays
    y_train = dataframe[label_column_name].values
    X_train = dataframe.drop([label_column_name], axis=1)
    sample_weights = None
    X_train, y_train, sample_weights = data_cleaning._remove_nan_rows_in_X_y(X_train, y_train, sample_weights, is_timeseries=False, target_column=label_column_name)
    return X_train, y_train, sample_weights
````

Here, the dataframe from the data loading step is passed in. The label column (as well as sample weights, if originally specified) is extracted, then rows containing NaN are dropped from the input data.

If additional data preparation is desired, it can be done in this step.

### Data featurization

The function `generate_data_transformation_config()` specifies the featurization step in the final scikit-learn pipeline. The featurizers used by AutoML
in the original experiment are reproduced here, along with their parameters.

As example of the data transformation that can happen in this function, multiple columns could be transformed with a imputer (i.e. SimpleImputer(), StringCastTransformer(), LabelEncoderTransformer(), etc.).

Note that these transformers are applied depending on each column, so if you have many columns in your dataset (i.e. 50 or 100 columns) you will end up with tens of blocks of code doing the column's data transformations, so the size of this function can be very significant depending on the number of columns in your dataset.

With a classification/regression task, featurizers are  combined with corresponding [`DataFrameMappers`](https://github.com/scikit-learn-contrib/sklearn-pandas) into [`TransformerAndMapper`](https://docs.microsoft.com/en-us/python/api/azureml-automl-runtime/azureml.automl.runtime.featurization.transformer_and_mapper.transformerandmapper?view=azure-ml-py) objects,
and then these combined objects are wrapped in the [`DataTransformer`](https://docs.microsoft.com/en-us/python/api/azureml-automl-runtime/azureml.automl.runtime.featurization.data_transformer.datatransformer?view=azure-ml-py).

If targeting a Time Series Forecasting model, multiple timeseries-aware featurizers are collected into a scikit-learn pipeline, then wrapped in the [`TimeSeriesTransformer`](https://docs.microsoft.com/en-us/python/api/azureml-automl-runtime/azureml.automl.runtime.featurizer.transformer.timeseries.timeseries_transformer.timeseriestransformer?view=azure-ml-py).


### Preprocessor specification

The function `generate_preprocessor_config()`, if present, specifies a preprocessing step to be done after featurization in the final scikit-learn pipeline.

Normally, this preprocessing step only consists of data standardization/normalization using [`sklearn.preprocessing`](https://scikit-learn.org/stable/modules/preprocessing.html).

AutoML only specifies a preprocessing step for non-ensemble classification and regression models.

Here's an example of a generated preprocessor code:

```python
def generate_preprocessor_config():
    from azureml.automl.runtime.shared.model_wrappers import StandardScalerWrapper
    
    preproc = StandardScalerWrapper(
        copy=True,
        with_mean=False,
        with_std=False
    )
    
    return preproc
```

### Algorithm and hyperparameters specification

This is probably the most interesting code for many ML professionals. 

The `generate_algorithm_config()` function specifies the actual algorithm and hyperparameters for traing the model as the last stage of the final scikit-learn pipeline, as in the following example using an XGBoostClassifier algorithm with specific hyperparameters.

```python
def generate_algorithm_config():
    from azureml.automl.runtime.shared.model_wrappers import XGBoostClassifier
    from azureml.automl.runtime.shared.problem_info import ProblemInfo
    
    algorithm = XGBoostClassifier(
        random_state=0,
        n_jobs=-1,
        problem_info=ProblemInfo(
            gpu_training_param_dict={'processing_unit_type': 'cpu'}
        ),
        booster='gbtree',
        colsample_bytree=0.6,
        eta=0.1,
        gamma=10,
        max_depth=7,
        max_leaves=0,
        n_estimators=100,
        objective='reg:logistic',
        reg_alpha=0.20833333333333334,
        reg_lambda=2.0833333333333335,
        subsample=0.8,
        tree_method='auto'
    )
    
    return algorithm
```

In the case of ensemble models, `generate_preprocessor_config_N()` (if needed) and `generate_algorithm_config_N()` will be defined for each learner in the ensemble model,
where `N` represents the placement of each learner in the ensemble model's list. In addition, `generate_algorithm_config_meta()` will be defined in the case of
stack ensemble models for the meta learner.

### Training

Code generation emits `build_model_pipeline()` and `train_model()` for defining the scikit-learn pipeline and for calling `fit()` on it, respectively.

```python
def build_model_pipeline():
    from sklearn.pipeline import Pipeline
    
    pipeline = Pipeline(
        steps=[
               ('dt', generate_data_transformation_config()),
               ('preproc', generate_preprocessor_config()),
               ('model', generate_algorithm_config())
        ]
    )
    
    return pipeline
```

Here, the scikit-learn pipeline includes the featurization step, a preprocessor (if used) and then the algorithm/model.

In the case of timeseries models, the scikit-learn pipeline is wrapped in a `ForecastingPipelineWrapper`; the `ForecastingPipelineWrapper` has some additional logic
needed to properly handle timeseries data depending on the algorithm used.

Once we have the Scikit-Learn pipeline, all that is left is to call `fit()` on it in order to train the model:

```python
def train_model(X, y, sample_weights):
    model_pipeline = build_model_pipeline()
    
    model = model_pipeline.fit(X, y)
    return model
```

The return value from `train_model()` is the model fitted/trained on the input data.

The code that runs all the previous functions is the following:

```python
def main():
    # The following code is for when running this code as part of an AzureML script run.
    from azureml.core import Run
    run = Run.get_context()
    
    df = get_training_dataset()
    X, y, sample_weights = prepare_data(df)
    model = train_model(X, y, sample_weights)
```

Once you have the trained model, you can use it for making predictions such as in the following code:

```python
y_pred = model.predict(X)
```

Finally, the model is serialized and saved as a .pkl file named "model.pkl":

```python
    joblib.dump(model, 'model.pkl')
    run.upload_file('outputs/model.pkl', 'model.pkl')
```

## `script_run_notebook.ipynb`
`script_run_notebook.ipynb` serves as an easy way to execute `script.py` on Azure ML compute.

It is similar to the existing AutoML sample notebooks; however, there are a couple of key differences which are explained below.

### Environment

Normally, when using AutoML, the training environment will be automatically set by the SDK. However, when running a custom script run like the generated code, AutoML is not anymore driving the process so the environment must be specified for the script run to succeed.

Code generation reuses the environment that was used in the original AutoML experiment, if possible; this guarantees that the training script run will not fail due to missing
dependencies and has the side benefit of not needing a Docker image rebuild step, which saves time and compute resources.

If you make changes to `script.py` that require additional dependencies, or you would like to use your own environment, you will need to update the `Create environment`
cell in `script_run_notebook.ipynb` accordingly.

For additional documentation on AzureML environments, see [this page](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.environment.environment?view=azure-ml-py).

### Submitting the experiment

Since the generated code is not driven by AutoML anymore, instead of creating an `AutoMLConfig` and then passing it to `experiment.submit()`, you need to create a [`ScriptRunConfig`](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) and provide the generated code (script.py) to it, like in the following example.

```python
from azureml.core import ScriptRunConfig

src = ScriptRunConfig(source_directory=project_folder, 
                      script='script.py', 
                      compute_target=cpu_cluster, 
                      environment=myenv,
                      docker_runtime_config=docker_config)
 
run = experiment.submit(config=src)
```

All of the parameters in the above snippet are regular dependencies needed to run ScriptRunConfig, such as compute, environment, etc. For further information on how to use ScriptRunConfig, read the article [Configure and submit training runs](https://docs.microsoft.com/en-us/azure/machine-learning/how-to-set-up-training-targets)


### Downloading and loading the serialized trained model in memory

Once you have a trained model, you can save/serialize it to a .pkl file. It is possible that the model will not serialize/deserialize correctly using `pickle.dump()` and `pickle.load()` due to pickle limitations (for example, lambda functions cannot be serialized using pickle). Hence, `joblib.dump()` and `joblib.load()` should be used instead.

The following example is how you download and load in memory a model that was trained in AML compute with ScriptRunConfig. This code could run in the same notebook you used the Azure ML SDK ScriptRunConfig.

```python
import joblib

# Load the fitted model from the script run.

# Note that if training dependencies are not installed on the machine
# this notebook is being run from, this step can fail.
try:
    # Download the model from the run in the Workspace
    run.download_file("outputs/model.pkl", "model.pkl")

    # Load the model into memory
    model = joblib.load("model.pkl")

except ImportError:
    print('Required dependencies are missing; please run pip install azureml-automl-runtime.')
    raise

```

### Making predictions with the model in memory

Finally, you can load test data in a Pandas dataframe and use the model to make predictions, as in the following code.

```python
import os
import numpy as np
import pandas as pd

DATA_DIR = "."
filepath = os.path.join(DATA_DIR, 'porto_seguro_safe_driver_test_dataset.csv')

test_data_df = pd.read_csv(filepath)

print(test_data_df.shape)
test_data_df.head(5)

#test_data_df is a Pandas Dataframe with test data
y_predictions = model.predict(test_data_df)
```

In an Azure ML Compute Instance you should have all the AML AutoML dependencies so you should be able to load the model and predict from any notebook in a Compute Instance recently created.

However, in order to load that model in a notebook in your custom local Conda environment, you need to have installed all the dependencies coming from the environment used when training (AutoML environment).