---
title: Machine Learning pipeline YAML
titleSuffix: Azure Machine Learning
description: Learn how to define a machine learning pipeline using a YAML file. YAML pipeline definitions are used with the machine learning extension for the Azure CLI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual

ms.reviewer: larryfr
ms.author: 
author: 
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

A pipeline definition requires the following keys, which correspond to the [Pipelines](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline.pipeline?view=azure-ml-py) class:

| YAML key | Description |
| ----- | ----- |
| `name` | The description of the pipeline. |
| `parameters` | Parameter(s) to the pipeline. |
| `data_reference` | Defines how and where data should be made available in a run. |
| `default_compute` | Default compute target where all steps in the pipeline run. |
| `steps` | The steps used in the pipeline. |

The following YAML is an example pipeline definition:

## Parameters

The `parameters` section uses the following keys, which correspond to the [PipelineParameter](https://docs.microsoft.com/en-us/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelineparameter?view=azure-ml-py) class:

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

The `data_references` section uses the following keys, which correspond to the [DataReference](https://docs.microsoft.com/en-us/python/api/azureml-core/azureml.data.data_reference.datareference?view=azure-ml-py):

| YAML key | Description |
| ----- | ----- |
| `datastore` | The datastore to reference. |
| `path_on_datastore` | The relative path in the backing storage for the data reference. |

Each data reference is named. For example, the following YAML snippet defines a data reference named `employee_data`:

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