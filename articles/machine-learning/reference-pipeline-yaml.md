---
title: Machine Learning pipeline YAML
titleSuffix: Azure Machine Learning
description: Learn how to define a machine learning pipeline using a YAML file. YAML pipeline definitions are used with the machine learning extension for the Azure CLI.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference

ms.reviewer: larryfr
ms.author: sanpil
author: sanpil
ms.date: 11/11/2019
ms.custom: tracking-python
---

# Define machine learning pipelines in YAML

Learn how to define your machine learning pipelines in [YAML](https://yaml.org/). When using the machine learning extension for the Azure CLI, many of the pipeline-related commands expect a YAML file that defines the pipeline.

The following table lists what is and is not currently supported when defining a pipeline in YAML:

| Step type | Supported? |
| ----- | :-----: |
| PythonScriptStep | Yes |
| ParallelRunStep | Yes |
| AdlaStep | Yes |
| AzureBatchStep | Yes |
| DatabricksStep | Yes |
| DataTransferStep | Yes |
| AutoMLStep | No |
| HyperDriveStep | No |
| ModuleStep | Yes |
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

## Parameters

The `parameters` section uses the following keys, which correspond to the [PipelineParameter](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelineparameter?view=azure-ml-py) class:

| YAML key | Description |
| ---- | ---- |
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

Steps define a computational environment, along with the files to run on the environment. To define the type of a step, use the `type` key:

| Step type | Description |
| ----- | ----- |
| `AdlaStep` | Runs a U-SQL script with Azure Data Lake Analytics. Corresponds to the [AdlaStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.adlastep?view=azure-ml-py) class. |
| `AzureBatchStep` | Runs jobs using Azure Batch. Corresponds to the [AzureBatchStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.azurebatchstep?view=azure-ml-py) class. |
| `DatabricsStep` | Adds a Databricks notebook, Python script, or JAR. Corresponds to the [DatabricksStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.databricksstep?view=azure-ml-py) class. |
| `DataTransferStep` | Transfers data between storage options. Corresponds to the [DataTransferStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.datatransferstep?view=azure-ml-py) class. |
| `PythonScriptStep` | Runs a Python script. Corresponds to the [PythonScriptStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.python_script_step.pythonscriptstep?view=azure-ml-py) class. |
| `ParallelRunStep` | Runs a Python script to process large amounts of data asynchronously and in parallel. Corresponds to the [ParallelRunStep](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallel_run_step.parallelrunstep?view=azure-ml-py) class. |

### ADLA step

| YAML key | Description |
| ----- | ----- |
| `script_name` | The name of the U-SQL script (relative to the `source_directory`). |
| `compute_target` | The Azure Data Lake compute target to use for this step. |
| `parameters` | [Parameters](#parameters) to the pipeline. |
| `inputs` | Inputs can be [InputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.inputportbinding?view=azure-ml-py), [DataReference](#data-reference), [PortDataReference](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.portdatareference?view=azure-ml-py), [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py), [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py), [DatasetDefinition](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_definition.datasetdefinition?view=azure-ml-py), or [PipelineDataset](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedataset?view=azure-ml-py). |
| `outputs` | Outputs can be either [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) or [OutputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.outputportbinding?view=azure-ml-py). |
| `source_directory` | Directory that contains the script, assemblies, etc. |
| `priority` | The priority value to use for the current job. |
| `params` | Dictionary of name-value pairs. |
| `degree_of_parallelism` | The degree of parallelism to use for this job. |
| `runtime_version` | The runtime version of the Data Lake Analytics engine. |
| `allow_reuse` | Determines whether the step should reuse previous results when run again with the same settings. |

The following example contains an ADLA Step definition:

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
    default_compute: adlacomp
    steps:
        Step1:
            runconfig: "D:\\Yaml\\default_runconfig.yml"
            parameters:
                NUM_ITERATIONS_2:
                    source: PipelineParam1
                NUM_ITERATIONS_1: 7
            type: "AdlaStep"
            name: "MyAdlaStep"
            script_name: "sample_script.usql"
            source_directory: "D:\\scripts\\Adla"
            inputs:
                employee_data:
                    source: employee_data
            outputs:
                OutputData:
                    destination: Output4
                    datastore: adftestadla
                    bind_mode: mount
```

### Azure Batch step

| YAML key | Description |
| ----- | ----- |
| `compute_target` | The Azure Batch compute target to use for this step. |
| `inputs` | Inputs can be [InputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.inputportbinding?view=azure-ml-py), [DataReference](#data-reference), [PortDataReference](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.portdatareference?view=azure-ml-py), [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py), [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py), [DatasetDefinition](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_definition.datasetdefinition?view=azure-ml-py), or [PipelineDataset](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedataset?view=azure-ml-py). |
| `outputs` | Outputs can be either [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) or [OutputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.outputportbinding?view=azure-ml-py). |
| `source_directory` | Directory that contains the module binaries, executable, assemblies, etc. |
| `executable` | Name of the command/executable that will be ran as part of this job. |
| `create_pool` | Boolean flag to indicate whether to create the pool before running the job. |
| `delete_batch_job_after_finish` | Boolean flag to indicate whether to delete the job from the Batch account after it's finished. |
| `delete_batch_pool_after_finish` | Boolean flag to indicate whether to delete the pool after the job finishes. |
| `is_positive_exit_code_failure` | Boolean flag to indicate if the job fails if the task exits with a positive code. |
| `vm_image_urn` | If `create_pool` is `True`, and VM uses `VirtualMachineConfiguration`. |
| `pool_id` | The ID of the pool where the job will run. |
| `allow_reuse` | Determines whether the step should reuse previous results when run again  with the same settings. |

The following example contains an Azure Batch step definition:

```yaml
pipeline:
    name: SamplePipelineFromYaml
    parameters:
        PipelineParam1:
            type: int
            default: 3
    data_references:
        input:
            datastore: workspaceblobstore
            path_on_datastore: "input.txt"
    default_compute: testbatch
    steps:
        Step1:
            runconfig: "D:\\Yaml\\default_runconfig.yml"
            parameters:
                NUM_ITERATIONS_2:
                    source: PipelineParam1
                NUM_ITERATIONS_1: 7
            type: "AzureBatchStep"
            name: "MyAzureBatchStep"
            pool_id: "MyPoolName"
            create_pool: true
            executable: "azurebatch.cmd"
            source_directory: "D:\\scripts\\AureBatch"
            allow_reuse: false
            inputs:
                input:
                    source: input
            outputs:
                output:
                    destination: output
                    datastore: workspaceblobstore
```

### Databricks step

| YAML key | Description |
| ----- | ----- |
| `compute_target` | The Azure Databricks compute target to use for this step. |
| `inputs` | Inputs can be [InputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.inputportbinding?view=azure-ml-py), [DataReference](#data-reference), [PortDataReference](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.portdatareference?view=azure-ml-py), [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py), [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py), [DatasetDefinition](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_definition.datasetdefinition?view=azure-ml-py), or [PipelineDataset](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedataset?view=azure-ml-py). |
| `outputs` | Outputs can be either [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) or [OutputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.outputportbinding?view=azure-ml-py). |
| `run_name` | The name in Databricks for this run. |
| `source_directory` | Directory that contains the script and other files. |
| `num_workers` | The static number of workers for the Databricks run cluster. |
| `runconfig` | The path to a `.runconfig` file. This file is a YAML representation of the [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py) class. For more information on the structure of this file, see [runconfigschema.json](https://github.com/microsoft/MLOps/blob/b4bdcf8c369d188e83f40be8b748b49821f71cf2/infra-as-code/runconfigschema.json). |
| `allow_reuse` | Determines whether the step should reuse previous results when run again with the same settings. |

The following example contains a Databricks step:

```yaml
pipeline:
    name: SamplePipelineFromYaml
    parameters:
        PipelineParam1:
            type: int
            default: 3
    data_references:
        adls_test_data:
            datastore: adftestadla
            path_on_datastore: "testdata"
        blob_test_data:
            datastore: workspaceblobstore
            path_on_datastore: "dbtest"
    default_compute: mydatabricks
    steps:
        Step1:
            runconfig: "D:\\Yaml\\default_runconfig.yml"
            parameters:
                NUM_ITERATIONS_2:
                    source: PipelineParam1
                NUM_ITERATIONS_1: 7
            type: "DatabricksStep"
            name: "MyDatabrickStep"
            run_name: "DatabricksRun"
            python_script_name: "train-db-local.py"
            source_directory: "D:\\scripts\\Databricks"
            num_workers: 1
            allow_reuse: true
            inputs:
                blob_test_data:
                    source: blob_test_data
            outputs:
                OutputData:
                    destination: Output4
                    datastore: workspaceblobstore
                    bind_mode: mount
```

### Data transfer step

| YAML key | Description |
| ----- | ----- |
| `compute_target` | The Azure Data Factory compute target to use for this step. |
| `source_data_reference` | Input connection that serves as the source of data transfer operations. Supported values are [InputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.inputportbinding?view=azure-ml-py), [DataReference](#data-reference), [PortDataReference](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.portdatareference?view=azure-ml-py), [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py), [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py), [DatasetDefinition](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_definition.datasetdefinition?view=azure-ml-py), or [PipelineDataset](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedataset?view=azure-ml-py). |
| `destination_data_reference` | Input connection that serves as the destination of data transfer operations. Supported values are [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) and [OutputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.outputportbinding?view=azure-ml-py). |
| `allow_reuse` | Determines whether the step should reuse previous results when run again with the same settings. |

The following example contains a data transfer step:

```yaml
pipeline:
    name: SamplePipelineFromYaml
    parameters:
        PipelineParam1:
            type: int
            default: 3
    data_references:
        adls_test_data:
            datastore: adftestadla
            path_on_datastore: "testdata"
        blob_test_data:
            datastore: workspaceblobstore
            path_on_datastore: "testdata"
    default_compute: adftest
    steps:
        Step1:
            runconfig: "D:\\Yaml\\default_runconfig.yml"
            parameters:
                NUM_ITERATIONS_2:
                    source: PipelineParam1
                NUM_ITERATIONS_1: 7
            type: "DataTransferStep"
            name: "MyDataTransferStep"
            adla_compute_name: adftest
            source_data_reference:
                adls_test_data:
                    source: adls_test_data
            destination_data_reference:
                blob_test_data:
                    source: blob_test_data
```

### Python script step

| YAML key | Description |
| ----- | ----- |
| `inputs` | Inputs can be [InputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.inputportbinding?view=azure-ml-py), [DataReference](#data-reference), [PortDataReference](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.portdatareference?view=azure-ml-py), [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py), [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py), [DatasetDefinition](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_definition.datasetdefinition?view=azure-ml-py), or [PipelineDataset](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedataset?view=azure-ml-py). |
| `outputs` | Outputs can be either [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) or [OutputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.outputportbinding?view=azure-ml-py). |
| `script_name` | The name of the Python script (relative to `source_directory`). |
| `source_directory` | Directory that contains the script, Conda environment, etc. |
| `runconfig` | The path to a `.runconfig` file. This file is a YAML representation of the [RunConfiguration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.runconfiguration?view=azure-ml-py) class. For more information on the structure of this file, see [runconfig.json](https://github.com/microsoft/MLOps/blob/b4bdcf8c369d188e83f40be8b748b49821f71cf2/infra-as-code/runconfigschema.json). |
| `allow_reuse` | Determines whether the step should reuse previous results when run again with the same settings. |

The following example contains a Python script step:

```yaml
pipeline:
    name: SamplePipelineFromYaml
    parameters:
        PipelineParam1:
            type: int
            default: 3
    data_references:
        DataReference1:
            datastore: workspaceblobstore
            path_on_datastore: testfolder/sample.txt
    default_compute: cpu-cluster
    steps:
        Step1:
            runconfig: "D:\\Yaml\\default_runconfig.yml"
            parameters:
                NUM_ITERATIONS_2:
                    source: PipelineParam1
                NUM_ITERATIONS_1: 7
            type: "PythonScriptStep"
            name: "MyPythonScriptStep"
            script_name: "train.py"
            allow_reuse: True
            source_directory: "D:\\scripts\\PythonScript"
            inputs:
                InputData:
                    source: DataReference1
            outputs:
                OutputData:
                    destination: Output4
                    datastore: workspaceblobstore
                    bind_mode: mount
```

### Parallel run step

| YAML key | Description |
| ----- | ----- |
| `inputs` | Inputs can be [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset%28class%29?view=azure-ml-py), [DatasetDefinition](https://docs.microsoft.com/python/api/azureml-core/azureml.data.dataset_definition.datasetdefinition?view=azure-ml-py), or [PipelineDataset](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedataset?view=azure-ml-py). |
| `outputs` | Outputs can be either [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) or [OutputPortBinding](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.outputportbinding?view=azure-ml-py). |
| `script_name` | The name of the Python script (relative to `source_directory`). |
| `source_directory` | Directory that contains the script, Conda environment, etc. |
| `parallel_run_config` | The path to a `parallel_run_config.yml` file. This file is a YAML representation of the [ParallelRunConfig](https://docs.microsoft.com/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallelrunconfig?view=azure-ml-py) class. |
| `allow_reuse` | Determines whether the step should reuse previous results when run again with the same settings. |

The following example contains a Parallel run step:

```yaml
pipeline:
    description: SamplePipelineFromYaml
    default_compute: cpu-cluster
    data_references:
        MyMinistInput:
            dataset_name: mnist_sample_data
    parameters:
        PipelineParamTimeout:
            type: int
            default: 600
    steps:        
        Step1:
            parallel_run_config: "yaml/parallel_run_config.yml"
            type: "ParallelRunStep"
            name: "parallel-run-step-1"
            allow_reuse: True
            arguments:
            - "--progress_update_timeout"
            - parameter:timeout_parameter
            - "--side_input"
            - side_input:SideInputData
            parameters:
                timeout_parameter:
                    source: PipelineParamTimeout
            inputs:
                InputData:
                    source: MyMinistInput
            side_inputs:
                SideInputData:
                    source: Output4
                    bind_mode: mount
            outputs:
                OutputDataStep2:
                    destination: Output5
                    datastore: workspaceblobstore
                    bind_mode: mount
```

### Pipeline with multiple steps 

| YAML key | Description |
| ----- | ----- |
| `steps` | Sequence of one or more PipelineStep definitions. Note that the `destination` keys of one step's `outputs` become the `source` keys to the `inputs` of the next step.| 

```yaml
pipeline:
    name: SamplePipelineFromYAML
    description: Sample multistep YAML pipeline
    data_references:
        TitanicDS:
            dataset_name: 'titanic_ds'
            bind_mode: download
    default_compute: cpu-cluster
    steps:
        Dataprep:
            type: "PythonScriptStep"
            name: "DataPrep Step"
            compute: cpu-cluster
            runconfig: ".\\default_runconfig.yml"
            script_name: "prep.py"
            arguments:
            - '--train_path'
            - output:train_path
            - '--test_path'
            - output:test_path
            allow_reuse: True
            inputs:
                titanic_ds:
                    source: TitanicDS
                    bind_mode: download
            outputs:
                train_path:
                    destination: train_csv
                    datastore: workspaceblobstore
                test_path:
                    destination: test_csv
        Training:
            type: "PythonScriptStep"
            name: "Training Step"
            compute: cpu-cluster
            runconfig: ".\\default_runconfig.yml"
            script_name: "train.py"
            arguments:
            - "--train_path"
            - input:train_path
            - "--test_path"
            - input:test_path
            inputs:
                train_path:
                    source: train_csv
                    bind_mode: download
                test_path:
                    source: test_csv
                    bind_mode: download

```

## Schedules

When defining the schedule for a pipeline, it can be either datastore-triggered or recurring based on a time interval. The following are the keys used to define a schedule:

| YAML key | Description |
| ----- | ----- |
| `description` | A description of the schedule. |
| `recurrence` | Contains recurrence settings, if the schedule is recurring. |
| `pipeline_parameters` | Any parameters that are required by the pipeline. |
| `wait_for_provisioning` | Whether to wait for provisioning of the schedule to complete. |
| `wait_timeout` | The number of seconds to wait before timing out. |
| `datastore_name` | The datastore to monitor for modified/added blobs. |
| `polling_interval` | How long, in minutes, between polling for modified/added blobs. Default value: 5 minutes. Only supported for datastore schedules. |
| `data_path_parameter_name` | The name of the data path pipeline parameter to set with the changed blob path. Only supported for datastore schedules. |
| `continue_on_step_failure` | Whether to continue execution of other steps in the submitted PipelineRun if a step fails. If provided, will override the `continue_on_step_failure` setting of the pipeline.
| `path_on_datastore` | Optional. The path on the datastore to monitor for modified/added blobs. The path is under the container for the datastore, so the actual path the schedule monitors is container/`path_on_datastore`. If none, the datastore container is monitored. Additions/modifications made in a subfolder of the `path_on_datastore` are not monitored. Only supported for datastore schedules. |

The following example contains the definition for a datastore-triggered schedule:

```yaml
Schedule: 
      description: "Test create with datastore" 
      recurrence: ~ 
      pipeline_parameters: {} 
      wait_for_provisioning: True 
      wait_timeout: 3600 
      datastore_name: "workspaceblobstore" 
      polling_interval: 5 
      data_path_parameter_name: "input_data" 
      continue_on_step_failure: None 
      path_on_datastore: "file/path" 
```

When defining a **recurring schedule**, use the following keys under `recurrence`:

| YAML key | Description |
| ----- | ----- |
| `frequency` | How often the schedule recurs. Valid values are `"Minute"`, `"Hour"`, `"Day"`, `"Week"`, or `"Month"`. |
| `interval` | How often the schedule fires. The integer value is the number of time units to wait until the schedule fires again. |
| `start_time` | The start time for the schedule. The string format of the value is `YYYY-MM-DDThh:mm:ss`. If no start time is provided, the first workload is run instantly and future workloads are run based on the schedule. If the start time is in the past, the first workload is run at the next calculated run time. |
| `time_zone` | The time zone for the start time. If no time zone is provided, UTC is used. |
| `hours` | If `frequency` is `"Day"` or `"Week"`, you can specify one or more integers from 0 to 23, separated by commas, as the hours of the day when the pipeline should run. Only `time_of_day` or `hours` and `minutes` can be used. |
| `minutes` | If `frequency` is `"Day"` or `"Week"`, you can specify one or more integers from 0 to 59, separated by commas, as the minutes of the hour when the pipeline should run. Only `time_of_day` or `hours` and `minutes` can be used. |
| `time_of_day` | If `frequency` is `"Day"` or `"Week"`, you can specify a time of day for the schedule to run. The string format of the value is `hh:mm`. Only `time_of_day` or `hours` and `minutes` can be used. |
| `week_days` | If `frequency` is `"Week"`, you can specify one or more days, separated by commas, when the schedule should run. Valid values are `"Monday"`, `"Tuesday"`, `"Wednesday"`, `"Thursday"`, `"Friday"`, `"Saturday"`, and `"Sunday"`. |

The following example contains the definition for a recurring schedule:

```yaml
Schedule: 
    description: "Test create with recurrence" 
    recurrence: 
        frequency: Week # Can be "Minute", "Hour", "Day", "Week", or "Month". 
        interval: 1 # how often fires 
        start_time: 2019-06-07T10:50:00 
        time_zone: UTC 
        hours: 
        - 1 
        minutes: 
        - 0 
        time_of_day: null 
        week_days: 
        - Friday 
    pipeline_parameters: 
        'a': 1 
    wait_for_provisioning: True 
    wait_timeout: 3600 
    datastore_name: ~ 
    polling_interval: ~ 
    data_path_parameter_name: ~ 
    continue_on_step_failure: None 
    path_on_datastore: ~ 
```

## Next steps

Learn how to [use the CLI extension for Azure Machine Learning](reference-azure-machine-learning-cli.md).
