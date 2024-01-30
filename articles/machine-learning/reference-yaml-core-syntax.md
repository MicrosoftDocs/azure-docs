---
title: 'CLI (v2) core YAML syntax'
titleSuffix: Azure Machine Learning
description: Overview CLI (v2) core YAML syntax.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.custom: cliv2, event-tier1-build-2022

author: balapv
ms.author: balapv
ms.date: 11/16/2022
ms.reviewer: larryfr
---

# CLI (v2) core YAML syntax

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

Every Azure Machine Learning entity has a schematized YAML representation. You can create a new entity from a YAML configuration file with a `.yml` or `.yaml` extension.

This article provides an overview of core syntax concepts you will encounter while configuring these YAML files.



## Referencing an Azure Machine Learning entity

Azure Machine Learning provides a reference syntax (consisting of a shorthand and longhand format) for referencing an existing Azure Machine Learning entity when configuring a YAML file. For example, you can reference an existing registered environment in your workspace to use as the environment for a job.

### Referencing an Azure Machine Learning asset

There are two options for referencing an Azure Machine Learning asset (environments, models, data, and components):
* Reference an explicit version of an asset:
  * Shorthand syntax: `azureml:<asset_name>:<asset_version>`
  * Longhand syntax, which includes the Azure Resource Manager (ARM) resource ID of the asset:
  ```
  azureml:/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>/environments/<environment-name>/versions/<environment-version>
  ```
* Reference the latest version of an asset:

  In some scenarios you may want to reference the latest version of an asset without having to explicitly look up and specify the actual version string itself. The latest    version is defined as the latest (also known as most recently) created version of an asset under a given name. 

  You can reference the latest version using the following syntax: `azureml:<asset_name>@latest`. Azure Machine Learning will resolve the reference to an explicit asset version in the workspace.

### Reference an Azure Machine Learning resource

To reference an Azure Machine Learning resource (such as compute), you can use either of the following syntaxes:
* Shorthand syntax: `azureml:<resource_name>`
* Longhand syntax, which includes the ARM resource ID of the resource:
```
azureml:/subscriptions/<subscription-id>/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>/computes/<compute-name>
```

## Azure Machine Learning data reference URI

Azure Machine Learning offers a convenience data reference URI format to point to data in an Azure storage service. This can be used for scenarios where you need to specify a cloud storage location in your YAML file, such as creating an Azure Machine Learning model from file(s) in storage, or pointing to data to pass as input to a job.

To use this data URI format, the storage service you want to reference must first be registered as a datastore in your workspace. Azure Machine Learning will handle the data access using the credentials you provided during datastore creation.

The format consists of a datastore in the current workspace and the path on the datastore to the file or folder you want to point to:

```
azureml://datastores/<datastore-name>/paths/<path-on-datastore>/
```

For example:

* `azureml://datastores/workspaceblobstore/paths/example-data/`
* `azureml://datastores/workspaceblobstore/paths/example-data/iris.csv`

In addition to the Azure Machine Learning data reference URI, Azure Machine Learning also supports the following direct storage URI protocols: `https`, `wasbs`, `abfss`, and `adl`, as well as public `http` and `https` URIs.

## Expression syntax for configuring Azure Machine Learning jobs and components

v2 job and component YAML files allow for the use of expressions to bind to contexts for different scenarios. The essential use case is using an expression for a value that might not be known at the time of authoring the configuration, but must be resolved at runtime.

Use the following syntax to tell Azure Machine Learning to evaluate an expression rather than treat it as a string:

`${{ <expression> }}`

The supported scenarios are covered below.

### Parameterizing the `command` with the `inputs` and `outputs` contexts of a job

You can specify literal values, URI paths, and registered Azure Machine Learning data assets as inputs to a job. The `command` can then be parameterized with references to those input(s) using the `${{inputs.<input_name>}}` syntax. References to literal inputs will get resolved to the literal value at runtime, while references to data inputs will get resolved to the download path or mount path (depending on the `mode` specified).

Likewise, outputs to the job can also be referenced in the `command`. For each named output specified in the `outputs` dictionary, Azure Machine Learning will system-generate an output location on the default datastore where you can write files to. The output location for each named output is based on the following templatized path: `<default-datastore>/azureml/<job-name>/<output_name>/`. Parameterizing the `command` with the `${{outputs.<output_name>}}` syntax will resolve that reference to the system-generated path, so that your script can write files to that location from the job.

In the example below for a command job YAML file, the `command` is parameterized with two inputs, a literal input and a data input, and one output. At runtime, the `${{inputs.learning_rate}}` expression will resolve to `0.01`, and the `${{inputs.iris}}` expression will resolve to the download path of the `iris.csv` file. `${{outputs.model_dir}}` will resolve to the mount path of the system-generated output location corresponding to the `model_dir` output.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/commandJob.schema.json
code: ./src
command: python train.py --lr ${{inputs.learning_rate}} --training-data ${{inputs.iris}} --model-dir ${{outputs.model_dir}}
environment: azureml:AzureML-Minimal@latest
compute: azureml:cpu-cluster
inputs:
  learning_rate: 0.01
  iris:
    type: uri_file
    path: https://azuremlexamples.blob.core.windows.net/datasets/iris.csv
    mode: download
outputs:
  model_dir:
```

### Parameterizing the `command` with the `search_space` context of a sweep job

You will also use this expression syntax when performing hyperparameter tuning via a sweep job, since the actual values of the hyperparameters are not known during job authoring time. When you run a sweep job, Azure Machine Learning will select hyperparameter values for each trial based on the `search_space`. In order to access those values in your training script, you must pass them in via the script's command-line arguments. To do so, use the `${{search_space.<hyperparameter>}}` syntax in the `trial.command`.

In the example below for a sweep job YAML file, the `${{search_space.learning_rate}}` and `${{search_space.boosting}}` references in `trial.command` will resolve to the actual hyperparameter values selected for each trial when the trial job is submitted for execution.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/sweepJob.schema.json
type: sweep
sampling_algorithm:
  type: random
search_space:
  learning_rate:
    type: uniform
    min_value: 0.01
    max_value: 0.9
  boosting:
    type: choice
    values: ["gbdt", "dart"]
objective:
  goal: minimize
  primary_metric: test-multi_logloss
trial:
  code: ./src
  command: >-
    python train.py 
    --training-data ${{inputs.iris}}
    --lr ${{search_space.learning_rate}}
    --boosting ${{search_space.boosting}}
  environment: azureml:AzureML-Minimal@latest
inputs:
  iris:
    type: uri_file
    path: https://azuremlexamples.blob.core.windows.net/datasets/iris.csv
    mode: download
compute: azureml:cpu-cluster
```

### Binding inputs and outputs between steps in a pipeline job

Expressions are also used for binding inputs and outputs between steps in a pipeline job. For example, you can bind the input of one job (job B) in a pipeline to the output of another job (job A). This usage will signal to Azure Machine Learning the dependency flow of the pipeline graph, and job B will get executed after job A, since the output of job A is required as an input for job B.

For a pipeline job YAML file, the `inputs` and `outputs` sections of each child job are evaluated within the parent context (the top-level pipeline job). The `command`, on the other hand, will resolve to the current context (the child job).

There are two ways to bind inputs and outputs in a pipeline job:

**Bind to the top-level inputs and outputs of the pipeline job**

You can bind the inputs or outputs of a child job (a pipeline step) to the inputs/outputs of the top-level parent pipeline job using the following syntax: `${{parent.inputs.<input_name>}}` or `${{parent.outputs.<output_name>}}`. This reference resolves to the `parent` context; hence the top-level inputs/outputs. 

In the example below, the input (`raw_data`) of the first `prep` step is bound to the top-level pipeline input via `${{parent.inputs.input_data}}`. The output (`model_dir`) of the final `train` step is bound to the top-level pipeline job output via `${{parent.outputs.trained_model}}`.

**Bind to the inputs and outputs of another child job (step)**

To bind the inputs/outputs of one step to the inputs/outputs of another step, use the following syntax: `${{parent.jobs.<step_name>.inputs.<input_name>}}` or `${{parent.jobs.<step_name>.outputs.<outputs_name>}}`. Again, this reference resolves to the parent context, so the expression must start with `parent.jobs.<step_name>`.

In the example below, the input (`training_data`) of the `train` step is bound to the output (`clean_data`) of the `prep` step via `${{parent.jobs.prep.outputs.clean_data}}`. The prepared data from the `prep` step will be used as the training data for the `train` step.

On the other hand, the context references within the `command` properties will resolve to the current context. For example, the `${{inputs.raw_data}}` reference in the `prep` step's `command` will resolve to the inputs of the current context, which is the `prep` child job. The lookup will be done on `prep.inputs`, so an input named `raw_data` must be defined there.

```yaml
$schema: https://azuremlschemas.azureedge.net/latest/pipelineJob.schema.json
type: pipeline
inputs:
  input_data: 
    type: uri_folder
    path: https://azuremlexamples.blob.core.windows.net/datasets/cifar10/
outputs:
  trained_model:
jobs:
  prep:
    type: command
    inputs:
      raw_data: ${{parent.inputs.input_data}}
    outputs:
      clean_data:
    code: src/prep
    environment: azureml:AzureML-Minimal@latest
    command: >-
      python prep.py 
      --raw-data ${{inputs.raw_data}} 
      --prep-data ${{outputs.clean_data}}
    compute: azureml:cpu-cluster
  train:
    type: command
    inputs: 
      training_data: ${{parent.jobs.prep.outputs.clean_data}}
      num_epochs: 1000
    outputs:
      model_dir: ${{parent.outputs.trained_model}}
    code: src/train
    environment: azureml:AzureML-Minimal@latest
    command: >-
      python train.py 
      --epochs ${{inputs.num_epochs}}
      --training-data ${{inputs.training_data}} 
      --model-output ${{outputs.model_dir}}
    compute: azureml:gpu-cluster
```

### Parameterizing the `command` with the `inputs` and `outputs` contexts of a component

Similar to the `command` for a job, the `command` for a component can also be parameterized with references to the `inputs` and `outputs` contexts. In this case the reference is to the component's inputs and outputs. When the component is run in a job, Azure Machine Learning will resolve those references to the job runtime input and output values specified for the respective component inputs and outputs. Below is an example of using the context syntax for a command component YAML specification.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/component/train.yml":::

#### Define optional inputs in command line
When the input is set as `optional = true`, you need use `$[[]]` to embrace the command line with inputs. For example `$[[--input1 ${{inputs.input1}}]`. The command line at runtime may have different inputs.
- If you are using only the required `training_data` and `model_output` parameters, the command line will look like:

```cli
python train.py --training_data some_input_path --learning_rate 0.01 --learning_rate_schedule time-based --model_output some_output_path
```

If no value is specified at runtime, `learning_rate` and `learning_rate_schedule` will use the default value.

- If all inputs/outputs provide values during runtime, the command line will look like:
```cli
python train.py --training_data some_input_path --max_epocs 10 --learning_rate 0.01 --learning_rate_schedule time-based --model_output some_output_path
```

### Output path expressions

The following expressions can be used in the output path of your job:

[!INCLUDE [output path expressions](includes/output-path-expressions.md)]

## Next steps

* [Install and use the CLI (v2)](how-to-configure-cli.md)
* [Train models with the CLI (v2)](how-to-train-model.md)
* [CLI (v2) YAML schemas](reference-yaml-overview.md)
