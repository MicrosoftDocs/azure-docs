---
title: Manage inputs and outputs of a pipeline
titleSuffix: Azure Machine Learning
description: How to manage inputs and outputs of components and pipeline 
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: zhanxia
author: xiaoharper
ms.reviewer: lagayhar
ms.date:  08/27/2023
ms.topic: how-to
ms.custom: devplatv2, pipeline
---
# Manage inputs and outputs of component and pipeline


In this article you learn:

> [!div class="checklist"]
> - Overview of inputs and outputs in component and pipeline
> - How to define optional input
> - How to customize output path
> - How to download output
> - How to register output as named asset
 
## Overview of inputs & outputs

Azure Machine Learning pipelines utilize inputs and outputs at both the component and pipeline levels.

### Component Inputs and Outputs 

The Input and Output parameters from the interface of a pipeline component. The output from one component can be used as an input for another, allowing for data or models to be passed between components. This interconnectivity forms a graph, illustrating the data flow within the pipeline.

### Pipeline level Inputs and Outputs 

At the pipeline level, inputs and outputs are useful for submitting pipeline jobs with varying data inputs or parameters that control the training logic, such as `learning_rate`. They're especially useful when invoking the pipeline via a REST endpoint. These inputs and outputs enable you to assign different values to the pipeline input or access the output of pipeline jobs through the REST endpoint. For more information, see the guide on [Creating Jobs and Input Data for Batch Endpoint.]((./how-to-access-data-batch-endpoints-jobs.md))

### Types of Inputs and Outputs

Inputs could be either of below types:

 - Primitive types: `string`, `number`, `integer`, or `boolean`.

 - Asset types: used for pass data or model between components
     - Data asset types: `uri_file`, `uri_folder`, `mltable`.
     - Model asset types: `mlflow_model`, `custom_model`

Outputs need to be asset types. 

For data asset input/output, you can choose from various modes to define how the data will be consumed in the job. Refer to [data asset modes](./how-to-read-write-data-v2.md#modes) for the possible combinations of modes and input/output type. 

### Visual representation in Azure Machine Learning studio

In the pipeline job page of Studio, the asset type Input/Output of a component is shown as a small circle in the corresponding component, known as the Input/Output port. These ports represent the data flow in a pipeline. 
The pipeline level input/output is displayed as a purple box for easy identification.

The following screenshot provides an example of how inputs and outputs are displayed in a pipeline job in Azure Machine Learning studio. This particular job, named `nyc-taxi-data-regression`, can be found in [azureml-example.](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression) 
 
 :::image type="content" source="./media/how-to-manage-pipeline-input-output/input-output-port.png" lightbox="./media/how-to-manage-pipeline-input-output/input-output-port.png" alt-text="Screenshot highlighting the pipeline input and output port.":::

When you hover the mouse on an input/output port, the type is displayed.

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/hover-port.png" lightbox="./media/how-to-manage-pipeline-input-output/hover-port.png" alt-text="Screenshot highlighting the port type when hovering the mouse.":::

Inputs and outputs can also be found in the **Settings** tab of the right-side panel. When viewing the Job Overview panel, it displays the inputs and outputs at the pipeline level. However, if you're examining a specific component's panel (which can be accessed by double-clicking the component), you'll see the inputs and outputs specific to that component.

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/job-overview-setting.png" lightbox="./media/how-to-manage-pipeline-input-output/job-overview-setting.png" alt-text="Screenshot highlighting the job overview setting panel":::

Similarly, when editing a pipeline in designer, you can find the pipeline inputs & outputs in **Pipeline interface** panel, and the component inputs&outputs in the component's right-side panel. 

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/pipeline-interface.png" lightbox="./media/how-to-manage-pipeline-input-output/pipeline-interface.png" alt-text="Screenshot highlighting the pipeline interface in designer":::


## How to promote input& output to pipeline level

Following is sample code to promote a component input/output to pipeline level input/output.

# [Azure CLI](#tab/cli)

[This](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression/pipeline.yml) is a pipeline yaml example that promotes three outputs to pipeline level outputs. Let's take `pipeline_job_trained_model` as example. It's declared under `outputs` section on root level, which means's its pipeline level output. Under `jobs -> train_job -> outputs` section, the output is referenced as `{{parent.outputs.pipeline_job_trained_model}}`, which indicates the `train_job` output is promoted to pipeline level output. Similarly, you can promote pipeline input using the same schema. 

# [Python SDK](#tab/python)

```python
# import required libraries
from azure.identity import DefaultAzureCredential

from azure.ai.ml import MLClient, Input
from azure.ai.ml.dsl import pipeline
from azure.ai.ml import load_component

# Set your subscription, resource group and workspace name:
subscription_id = "<SUBSCRIPTION_ID>"
resource_group = "<RESOURCE_GROUP>"
workspace = "<AML_WORKSPACE_NAME>"

# connect to the AzureML workspace
ml_client = MLClient(
    DefaultAzureCredential(), subscription_id, resource_group, workspace
)


# define the dirtory that stores the input data 
parent_dir = ""

# Load components
prepare_data = load_component(source=parent_dir + "./prep.yml")
transform_data = load_component(source=parent_dir + "./transform.yml")
train_model = load_component(source=parent_dir + "./train.yml")
predict_result = load_component(source=parent_dir + "./predict.yml")
score_data = load_component(source=parent_dir + "./score.yml")

# Construct pipeline. 
# Below code snippet defines nyc_taxi_data_regression pipeline.
# The pipeline takes 1 input (pipeline_job_input) and generates 6      outputs as defined in return statement.
# The pipeline outputs are promoted from the child component using schema in `step_name.outputs.output_name`.
# for example `prepare_sample_data.outputs.prep_data`.  
@pipeline()
def nyc_taxi_data_regression(pipeline_job_input):
    """NYC taxi data regression example."""
    prepare_sample_data = prepare_data(raw_data=pipeline_job_input)
    transform_sample_data = transform_data(
        clean_data=prepare_sample_data.outputs.prep_data
    )
    train_with_sample_data = train_model(
        training_data=transform_sample_data.outputs.transformed_data
    )
    predict_with_sample_data = predict_result(
        model_input=train_with_sample_data.outputs.model_output,
        test_data=train_with_sample_data.outputs.test_data,
    )
    score_with_sample_data = score_data(
        predictions=predict_with_sample_data.outputs.predictions,
        model=train_with_sample_data.outputs.model_output,
    )
    return {
        "pipeline_job_prepped_data": prepare_sample_data.outputs.prep_data,
        "pipeline_job_transformed_data": transform_sample_data.outputs.transformed_data,
        "pipeline_job_trained_model": train_with_sample_data.outputs.model_output,
        "pipeline_job_test_data": train_with_sample_data.outputs.test_data,
        "pipeline_job_predictions": predict_with_sample_data.outputs.predictions,
        "pipeline_job_score_report": score_with_sample_data.outputs.score_report,
    }

# 
pipeline_job = nyc_taxi_data_regression(
    Input(type="uri_folder", path=parent_dir + "./data/")
)
# demo how to change pipeline output settings
pipeline_job.outputs.pipeline_job_prepped_data.mode = "rw_mount"

# set pipeline level compute
pipeline_job.settings.default_compute = "cpu-cluster"
# set pipeline level datastore
pipeline_job.settings.default_datastore = "workspaceblobstore"

```
The working notebook example in [azureml-example repo](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/2c_nyc_taxi_data_regression/nyc_taxi_data_regression.ipynb)



# [Studio](#tab/azure-studio)

You can promote a component's input to pipeline level input in designer authoring page. Go to the component's setting panel by double click the component -> find the input you'd like to promote -> Click the three dots on the right -> Click Add to pipeline input. 

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/promote-pipeline-input.png" lightbox="./media/how-to-manage-pipeline-input-output/promote-pipeline-input.png" alt-text="Screenshot highlighting how to promote to pipeline input in designer":::


## Optional input

The inputs are required by default, which means you need to assign a value to it (or define a default value) every time when you submit a pipeline job. But there are cases that you may need optional input, which you can skip assign a value to the input when submitting a pipeline job.

Below are examples about how to define optional input.


:::code language="yaml" source="~/azureml-examples/blob/main/cli/assets/component/train.yml" range="1-34" highlight="12-22,31-33":::

When the input is set as `optional = true`, you need use `$[[]]` to embrace the command line with inputs. See highlighted line in above example. 

> [!NOTE]
> Optional output is not supported. 

In the pipeline graph, the Data/Model type optional input renders as dotted circle. the primitive type optional inputs can be found under **Settings** tab, there won't be a red star for optional input, which indicates this input isn't required. 

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/optional-input.png" lightbox="./media/how-to-manage-pipeline-input-output/optional-input.png" alt-text="Screenshot highlighting the optional input":::



## How to customize output path?

By default, the output of a component will be stored in `azureml://datastores/${{default_datastore}}/paths/${{name}}/${{output_name}}`. The `{default_datastore}` is default datastore customer set for the pipeline. If not set it is workspace blob storage. The `{name}` is the job name, which which will be resolved at job execution time. The `{output_name}` is the output name customer defined in the component YAML. 

But you can also customize where to store the output by defining path of an output. Below are example:

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1b_pipeline_with_python_function_components/pipeline_with_python_function_components.ipynb?name=custom-path)]

https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1b_pipeline_with_python_function_components/pipeline_with_python_function_components.ipynb

[to-do] need a CLI example? 
 


## How to download the output?

You can download a component's output or pipeline output following below example.

### Download pipeline output

# [Azure CLI](#tab/cli)

```yaml
# Download all the outputs of the job
az ml job download --all -n <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID>

# Download specific output
az ml job download --output-name <OUTPUT_PORT_NAME> -n <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID>
```
# [Python SDK](#tab/python)

Before we dive in the code, you need a way to reference your workspace. You create `ml_client` for a handle to the workspace. Refer to [this article](./tutorial-explore-data.md#create-handle-to-workspace) to initialize `ml_client`.
 
```python
# Download all the outputs of the job
output = client.jobs.download(name=job.name, download_path=tmp_path, all=True)

# Download specific output
output = client.jobs.download(name=job.name, download_path=tmp_path, output_name=output_port_name)
```

### Download child job's output 

When you need to download the output of a child job (not promote to pipeline level output), you should first list all child job entity of a pipeline job and then use similar code above to download the output. 

Use following instruction to download output of child jobs. 

# [Azure CLI](#tab/cli)

```yaml
# List all child jobs in the job and print job details in table format
az ml job list --parent-job-name <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID> -o table

# Select needed child job name to download output
az ml job download --all -n <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID>
```

# [Python SDK](#tab/python)
```python
# List all child jobs in the job
child_jobs = client.jobs.list(parent_job_name=job.name)
# Traverse and download all the outputs of child job
for child_job in child_jobs:
    client.jobs.download(name=child_job.name, all=True)
```

## How to register output as named asset

You can register output of a component or pipeline as named asset by assigning `name` and `version` to the output. The registered asset can be list in your workspace through Studio UI/CLI/SDK and also be referenced in your following jobs.

### Register pipeline output

# [Azure CLI](#tab/cli)

```yaml
display_name: register_pipeline_output
type: pipeline
jobs:
  node:
    type: command
    inputs:
      component_in_path:
        type: uri_file
        path: https://dprepdata.blob.core.windows.net/demo/Titanic.csv
    component: ../components/helloworld_component.yml
    outputs:
      component_out_path: ${{parent.outputs.component_out_path}}
outputs:
  component_out_path:
    type: mltable
    name: pipeline_output  # Define name and version to register pipeline output
    version: '1'
settings:
  default_compute: azureml:cpu-cluster
```

# [Python SDK](#tab/python)

```python
from azure.ai.ml import dsl, Output

# Load component functions
components_dir = "./components/"
helloworld_component = load_component(source=f"{components_dir}/helloworld_component.yml")

@dsl.pipeline()
def register_pipeline_output():
  # Call component obj as function: apply given inputs & parameters to create a node in pipeline
  node = helloworld_component(component_in_path=Input(
    type='uri_file', path='https://dprepdata.blob.core.windows.net/demo/Titanic.csv'))

  return {
      'component_out_path': node.outputs.component_out_path
  }

pipeline = register_pipeline_output()
# Define name and version to register pipeline output
pipeline.settings.default_compute = "azureml:cpu-cluster"
pipeline.outputs.component_out_path.name = 'pipeline_output'
pipeline.outputs.component_out_path.version = '1'
```
 
### Register a child job's output

# [Azure CLI](#tab/cli)

```yaml
display_name: register_node_output
type: pipeline
jobs:
  node:
    type: command
    component: ../components/helloworld_component.yml
    inputs:
      component_in_path:
        type: uri_file
        path: 'https://dprepdata.blob.core.windows.net/demo/Titanic.csv'
    outputs:
      component_out_path:
        type: uri_folder
        name: 'node_output'  # Define name and version to register a child job's output
        version: '1'
settings:
  default_compute: azureml:cpu-cluster
```

# [Python SDK](#tab/python)

```python
from azure.ai.ml import dsl, Output

# Load component functions
components_dir = "./components/"
helloworld_component = load_component(source=f"{components_dir}/helloworld_component.yml")

@dsl.pipeline()
def register_node_output():
  # Call component obj as function: apply given inputs & parameters to create a node in pipeline
  node = helloworld_component(component_in_path=Input(
    type='uri_file', path='https://dprepdata.blob.core.windows.net/demo/Titanic.csv'))

  # Define name and version to register node output
  node.outputs.component_out_path.name = 'node_output'
  node.outputs.component_out_path.version = '1'

pipeline = register_node_output()
pipeline.settings.default_compute = "azureml:cpu-cluster"
```


