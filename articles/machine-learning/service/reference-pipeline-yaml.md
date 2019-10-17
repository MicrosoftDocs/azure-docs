---
title: Machine Learning pipeline YAML
titleSuffix: Azure Machine Learning
description: Learn how to define a machine learning pipeline using a YAML file. YAML pipeline definitions are used with the machine learning extension for the Azure CLI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: larryfr
ms.author: sanpil
author: sanpil
ms.date: 10/15/2019
---

# Define machine learning pipelines in YAML

Learn how to define your machine learning pipelines in [YAML](https://yaml.org/). When using the machine learning extension for the Azure CLI, many of the pipeline related commands expect a YAML file that defines the pipeline.

The following table lists what is and is not currently supported when defining a pipeline in YAML:

| Step type | Supported? |
| ----- | :-----: |
| PythonScriptStep | Yes |
| AdlaStep | Yes |
| AzureBatchStep | Yes |
| DatabricksStep | Yes |
| DataTransferStep | Yes |
| AutoMLStep | No |
| HyperDriveStep | No |
| ModuleStep | No |
| MPIStep | No |
| EstimatorStep | No |

## Pipeline definition

A pipeline definition uses the following keys, which correspond to the [Pipelines](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline.pipeline?view=azure-ml-py) class:

| YAML key | Description |
| ----- | ----- |
| `name` | The description of the pipeline. |
| `parameters` | Parameter(s) to the pipeline. |
| `data_reference` | Defines how and where data should be made available in a run. |
| `default_compute` | Default compute target where all steps in the pipeline run. |
| `steps` | The steps used in the pipeline. |

The following YAML is an example pipeline definition:

## Parameters

The `parameters` section uses the following keys, which correspond to the [PipelineParameter](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelineparameter?view=azure-ml-py) class:

| YAML key | Description |
| `type` | The value type of the parameter. Valid types are `string`, `int`, `float`, `bool`, or `datapath`. |
| `default` | The default value. |

Each parameter is named. For example, the following YAML snippet defines three parameters named `NumIterationsParameter`, `DataPathParameter`, and `NodeCountParameter`:

```yaml
pipeline:
    name: SamplePipelineFromYaml
    parameters:
        NumIterationsParameter:
            type: int
            default: 40
        DataPathParameter:
            type: datapath
            default:
                datastore: workspaceblobstore
                path_on_datastore: sample2.txt
        NodeCountParameter:
            type: int
            default: 4
```

## Data reference

The `data_references` section uses the following keys, which correspond to the [DataReference](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py):

| YAML key | Description |
| ----- | ----- |
| `datastore` | The datastore to reference. |
| `path_on_datastore` | The relative path in the backing storage for the data reference. |

Each data reference is contained in a key. For example, the following YAML snippet defines a data reference stored in the key named `employee_data`:

```yaml
pipeline:
    name: SamplePipelineFromYaml
    parameters:
        PipelineParam1:
            type: int
            default: 3
    data_references:
        employee_data:
            datastore: adftestadla
            path_on_datastore: "adla_sample/sample_input.csv"
```

## Steps

Steps define a computational environment, along with the files to run on the environment. The YAML definition represents the following steps:

| YAML key | Description |
| ----- | ----- |
| `adla_step` | Runs a U-SQL script with Azure Data Lake Analytics. Corresponds to the [AdlaStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.adlastep?view=azure-ml-py) class. |
| `azurebatch_step` | Runs jobs using Azure Batch. Corresponds to the [AzureBatchStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.azurebatchstep?view=azure-ml-py) class. |
| `databricks_step` | Adds a Databricks notebook, Python script, or JAR. Corresponds to the [DatabricksStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricksstep?view=azure-ml-py) class. |
| `data_transfer_step` | Transfers data between storage options. Corresponds to the [DataTransferStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.datatransferstep?view=azure-ml-py) class. |
| `python_script_step` | Runs a Python script. Corresponds to the [PythonScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep?view=azure-ml-py) class. |

### ADLA step

| YAML key | Description |
| ----- | ----- |
| `script_name` | The name of the U-SQL script (relative to the `source_directory`). |
| `name` | TBD |
| `compute_target` | TBD |
| `parameters` | [Parameters](#parameters) to the pipeline. |
| `inputs` | TBD |
| `outputs` | TBD |
| `source_directory` | Directory that contains the script, assemblies, etc. |
| `priority` | The priority value to use for the current job. |
| `params` | Dictionary of name-value pairs. |
| `degree_of_parallelism` | The degree of parallelism to use for this job. |
| `runtime_version` | The runtime version of the Data Lake Analytics engine. |
| `allow_reuse` | Determines whether the step should reuse previous results when re-run with the same settings. |

### Azure Batch step

| YAML key | Description |
| ----- | ----- |
| `source_directory` | Directory that contains the module binaries, executable, assemblies, etc. |
| `executable` | Name of the command/executable that will be ran as part of this job. |
| `create_pool` | Boolean flag to indicate whether to create the pool before running the job. |
| `delete_batch_job_after_finish` | Boolean flag to indicate whether to delete the job from the Batch account after it's finished. |
| `delete_batch_pool_after_finish` | Boolean flag to indicate whether to delete the pool after the job finishes. |
| `is_positive_exit_code_failure` | Boolean flag to indicate if the job fails if the task exits with a positive code. |
| `vm_image_urn` | If `create_pool` is `True`, and VM uses `VirtualMachineConfiguration`. |
| `pool_id` | The Id of teh pool where the job will run. |
| `allow_reuse` | Determines whether the step should reuse previous results when re-run with the same settings. |

### Databricks step

| YAML key | Description |
| ----- | ----- |
| `run_name` | The name in Databricks for this run. |
| `source_directory` | Directory that contains the script and other files. |
| `num_workers` | The static number of workers for the Databricks run cluster. |
| `runconfig` | The path to a `.runconfig` file. This file is a YAML representation of the [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py) class. For more information on the structure of this file, see [TBD]. |
| `allow_reuse` | Determines whether the step should reuse previous results when re-run with the same settings. |

### Data transfer step

| YAML key | Description |
| ----- | ----- |
| `source_data_reference` | Input connection that serves as the source of data transfer operations. Supported values are TBD. |
| `destination_data_reference` | Input connection that serves as the destination of data transfer operations. Supported values are TBD. |
| `allow_reuse` | Determines whether the step should reuse previous results when re-run with the same settings. |

### Python script step

| YAML key | Description |
| ----- | ----- |
| `script_name` | The name of the Python script (relative to `source_directory`). |
| `source_directory` | Directory that contains the script, Conda environment, etc. |
| `runconfig` | The path to a `.runconfig` file. This file is a YAML representation of the [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py) class. For more information on the structure of this file, see [TBD]. |
| `allow_reuse` | Determines whether the step should reuse previous results when re-run with the same settings. |
