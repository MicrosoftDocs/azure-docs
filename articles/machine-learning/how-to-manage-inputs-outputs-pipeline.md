---
title: Manage inputs and outputs of a pipeline
titleSuffix: Azure Machine Learning
description: How to manage inputs and outputs of components and pipeline in Azure Machine Learning.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: zhanxia
author: xiaoharper
ms.reviewer: lagayhar
ms.date:  08/27/2023
ms.topic: how-to
ms.custom: devplatv2, pipeline, devx-track-azurecli
---
# Manage inputs and outputs of component and pipeline


In this article you learn:

> [!div class="checklist"]
> - Overview of inputs and outputs in component and pipeline
> - How to promote component inputs/outputs to pipeline inputs/outputs
> - How to define optional inputs
> - How to customize outputs path
> - How to download outputs
> - How to register outputs as named asset
 
## Overview of inputs & outputs

Azure Machine Learning pipelines support inputs and outputs at both the component and pipeline levels.

At the component level, the inputs and outputs define the interface of a component. The output from one component can be used as an input for another component in the same parent pipeline, allowing for data or models to be passed between components. This interconnectivity forms a graph, illustrating the data flow within the pipeline.

At the pipeline level, inputs and outputs are useful for submitting pipeline jobs with varying data inputs or parameters that control the training logic (for example `learning_rate`). They're especially useful when invoking the pipeline via a REST endpoint. These inputs and outputs enable you to assign different values to the pipeline input or access the output of pipeline jobs through the REST endpoint. To learn more, see  [Creating Jobs and Input Data for Batch Endpoint.](./how-to-access-data-batch-endpoints-jobs.md)

### Types of Inputs and Outputs

The following types are supported as **outputs** of a component or a pipeline.
 
- Data types. Check [data types in Azure Machine Learning](./concept-data.md#data-types) to learn more about data types. 
     - `uri_file`
     - `uri_folder`
     - `mltable`
 
- Model types. Check [log mlflow models](./how-to-log-mlflow-models.md) to learn how to log your trained model as mlflow model. 
     - `mlflow_model`
     - `custom_model`

Using data or model output essentially saves the output in a storage location. In subsequent steps, this location can be mounted, downloaded, or uploaded to the compute target filesystem, enabling the next step to access the file or folder during job execution. It's crucial to save the output in the correct type (either file or folder, as model types are essentially folder) in the component's source code. Following are a few examples showing how to save the output. 

- uri_file:  
- uri_folder: In the nyc_taxi_data_regression example, the [prep component](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression/prep.yml) processes the data from input folder and write processed CSV files to the output folder. 
- mlflow_model: In the nyc_taxi_data_regression example, the [train component](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression/train.yml) has an `mlflow_model` output, in the component source code it saves the trained model using `mlflow.sklearn.save_model`


In addition to above data or model types, **input** can also be following primitive types. 
 - `string`
 - `number`
 - `integer`
 - `boolean`

In the nyc_taxi_data_regression example, [train component](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression/train.yml) has a `number` input named `test_split_ratio`. 

> [!NOTE]
>Primitive types output is not supported. 
 
### Path and mode for data inputs/outputs

For data asset input/output, you must specify a `path` parameter that points to the data location. This table shows the different data locations that Azure Machine Learning pipeline supports, and also shows path parameter examples:

|Location  | Examples  | Input | Output|
|---------|---------|---------|---------|
|A path on your local computer     | `./home/username/data/my_data`         | ✓ | |
|A path on a public http(s) server    |  `https://raw.githubusercontent.com/pandas-dev/pandas/main/doc/data/titanic.csv`    | ✓ | |
|A path on Azure Storage     |   `wasbs://<container_name>@<account_name>.blob.core.windows.net/<path>`<br>`abfss://<file_system>@<account_name>.dfs.core.windows.net/<path>`    | Not suggested because it may need extra identity configuration to read the data. |  |
|A path on an Azure Machine Learning Datastore   |   `azureml://datastores/<data_store_name>/paths/<path>`  | ✓ | ✓ |
|A path to a Data Asset  |  `azureml:<my_data>:<version>`  |✓ | ✓ |

> [!NOTE]
> For input/output on storage, we highly suggest to use Azure Machine Learning datastore path instead of direct Azure Storage path. Datastore path are supported across various job types in pipeline.   

For data input/output, you can choose from various modes (download, mount or upload) to define how the data is accessed in the compute target.
This table shows the possible modes for different type/mode/input/output combinations. 

Type | Input/Output | `upload` | `download` | `ro_mount` | `rw_mount` | `direct` | `eval_download` | `eval_mount` 
------ | ------ | :---: | :---: | :---: | :---: | :---: | :---: | :---:
`uri_folder` | Input  |   | ✓  |  ✓  |   | ✓  |  | 
`uri_file`   | Input |   | ✓  |  ✓  |   | ✓  |  | 
`mltable`   | Input |   | ✓  |  ✓  |   | ✓  | ✓ | ✓
`uri_folder` | Output  | ✓  |   |    | ✓  |   |  | 
`uri_file`   | Output | ✓  |   |    | ✓  |   |  | 
`mltable`   | Output | ✓  |   |    | ✓  | ✓  |  | 

> [!NOTE]
> In most cases, we suggest to use `ro_mount` or `rw_mount` mode. To learn more about mode, see [data asset modes](./how-to-read-write-data-v2.md#modes). 



### Visual representation in Azure Machine Learning studio

The following screenshots provide an example of how inputs and outputs are displayed in a pipeline job in Azure Machine Learning studio. This particular job, named `nyc-taxi-data-regression`, can be found in [azureml-example.](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/pipelines-with-components/nyc_taxi_data_regression) 

In the pipeline job page of studio, the data/model type inputs/output of a component is shown as a small circle in the corresponding component, known as the Input/Output port. These ports represent the data flow in a pipeline. 

The pipeline level output is displayed as a purple box for easy identification.


:::image type="content" source="./media/how-to-manage-pipeline-input-output/input-output-port.png" lightbox="./media/how-to-manage-pipeline-input-output/input-output-port.png" alt-text="Screenshot highlighting the pipeline input and output port.":::

When you hover the mouse on an input/output port, the type is displayed.

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/hover-port.png" lightbox="./media/how-to-manage-pipeline-input-output/hover-port.png" alt-text="Screenshot highlighting the port type when hovering the mouse.":::


The primitive type inputs won't be displayed on the graph. It can be found in the **Settings** tab of the pipeline job overview panel (for pipeline level inputs) or the component panel (for component level inputs). Following screenshot shows the **Settings** tab of a pipeline job, it can be opened by selecting the **Job Overview** link. 

If you want to check inputs for a component, double click on the component to open component panel.

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/job-overview-setting.png" lightbox="./media/how-to-manage-pipeline-input-output/job-overview-setting.png" alt-text="Screenshot highlighting the job overview setting panel.":::


Similarly, when editing a pipeline in designer, you can find the pipeline inputs & outputs in **Pipeline interface** panel, and the component inputs&outputs in the component's panel (trigger by double click on the component). 

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/pipeline-interface.png" lightbox="./media/how-to-manage-pipeline-input-output/pipeline-interface.png" alt-text="Screenshot highlighting the pipeline interface in designer.":::


## How to promote component inputs & outputs to pipeline level

Promoting a component's input/output to pipeline level allows you to overwrite the component's input/output when submitting a pipeline job. It's also useful if you want to trigger the pipeline using REST endpoint. 

Following are examples to promote component inputs/outputs to pipeline level inputs/outputs.

# [Azure CLI](#tab/cli)

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/pipeline.yml" range="1-65" highlight="6-17":::


The full example can be found in [train-score-eval pipeline with registered components](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/pipeline.yml).  This pipeline promotes three inputs and three outputs to pipeline level. Let's take `pipeline_job_training_max_epocs` as example. It's declared under `inputs` section on the root level, which means's its pipeline level input. Under `jobs -> train_job` section, the input named `max_epocs` is referenced as `${{parent.inputs.pipeline_job_training_max_epocs}}`, which indicates the `train_job`'s input `max_epocs` references the pipeline level input `pipeline_job_training_max_epocs`. Similarly, you can promote pipeline output using the same schema. 

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
# The pipeline takes 1 input (pipeline_job_input) and generates 6 outputs as defined in return statement.
# The pipeline outputs are promoted from the child component using schema as <step_name.outputs.output_name>.
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

The end to end notebook example in [azureml-example repo](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/2c_nyc_taxi_data_regression/nyc_taxi_data_regression.ipynb)

---

### Studio

You can promote a component's input to pipeline level input in designer authoring page. Go to the component's setting panel by double clicking the component -> find the input you'd like to promote -> Select the three dots on the right -> Select Add to pipeline input. 

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/promote-pipeline-input.png" lightbox="./media/how-to-manage-pipeline-input-output/promote-pipeline-input.png" alt-text="Screenshot highlighting how to promote to pipeline input in designer.":::


## Optional input

By default, all inputs are required and must be assigned a value (or a default value) each time you submit a pipeline job. However, there may be instances where you need optional inputs. In such cases, you have the flexibility to not assign a value to the input when submitting a pipeline job. 

Optional input can be useful in below two scenarios:

- If you have an optional data/model type input and don't assign a value to it when submitting the pipeline job, there will be a component in the pipeline that lacks a preceding data dependency. In other words, the input port isn't linked to any component or data/model node. This causes the pipeline service to invoke this component directly, instead of waiting for the preceding dependency to be ready.
- Below screenshot provides a clear example of the second scenario. If you set `continue_on_step_failure = True` for the pipeline and have a second node (node2) that uses the output from the first node (node1) as an optional input, node2 will still be executed even if node1 fails. However, if node2 is using required input from node1, it will not be executed if node1 fails.
 
     :::image type="content" source="./media/how-to-manage-pipeline-input-output/continue-on-failure-optional-input.png" lightbox="./media/how-to-manage-pipeline-input-output/continue-on-failure-optional-input.png" alt-text="Screenshot to show the orchestration logic of optional input and continue on failure.":::

Following are examples about how to define optional input.

:::code language="yaml" source="~/azureml-examples-main/cli/assets/component/train.yml" range="1-34" highlight="12-22,31-33":::

When the input is set as `optional = true`, you need use `$[[]]` to embrace the command line with inputs. See highlighted line in above example. 

> [!NOTE]
> Optional output is not supported. 

In the pipeline graph, optional inputs of the Data/Model type are represented by a dotted circle. Optional inputs of primitive types can be located under the **Settings** tab. Unlike required inputs, optional inputs don't have an asterisk next to them, signifying that they aren't mandatory.

 :::image type="content" source="./media/how-to-manage-pipeline-input-output/optional-input.png" lightbox="./media/how-to-manage-pipeline-input-output/optional-input.png" alt-text="Screenshot highlighting the optional input.":::


## How to customize output path

By default, the output of a component will be stored in `azureml://datastores/${{default_datastore}}/paths/${{name}}/${{output_name}}`. The `{default_datastore}` is default datastore customer set for the pipeline. If not set it's workspace blob storage. The `{name}` is the job name, which will be resolved at job execution time. The `{output_name}` is the output name customer defined in the component YAML. 

But you can also customize where to store the output by defining path of an output. Following are example:


# [Azure CLI](#tab/cli)

The `pipeline.yaml` defines a pipeline that has three pipeline level outputs. The full YAML can be found in the [train-score-eval pipeline with registered components example](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/pipelines-with-components/basics/1b_e2e_registered_components/pipeline.yml).
You can use following command to set custom output path for the `pipeline_job_trained_model`output.

```azurecli
# define the custom output path using datastore uri
# add relative path to your blob container after "azureml://datastores/<datastore_name>/paths"
output_path="azureml://datastores/{datastore_name}/paths/{relative_path_of_container}"  

# create job and define path using --outputs.<outputname>
az ml job create -f ./pipeline.yml --set outputs.pipeline_job_trained_model.path=$output_path  

```

# [Python SDK](#tab/python)

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1b_pipeline_with_python_function_components/pipeline_with_python_function_components.ipynb?name=custom-output-path)] 

The end to end notebook example can be found in [Build pipeline with command_component decorated python function notebook](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1b_pipeline_with_python_function_components/pipeline_with_python_function_components.ipynb).

---
 


## How to download the output

You can download a component's output or pipeline output following below example.

### Download pipeline level output

# [Azure CLI](#tab/cli)

```azurecli
# Download all the outputs of the job
az ml job download --all -n <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID>

# Download specific output
az ml job download --output-name <OUTPUT_PORT_NAME> -n <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID>
```
# [Python SDK](#tab/python)

Before we dive in the code, you need a way to reference your workspace. You create `ml_client` for a handle to the workspace. Refer to [Create handle to workspace](./tutorial-explore-data.md#create-handle-to-workspace) to initialize `ml_client`.
 
```python
# Download all the outputs of the job
output = client.jobs.download(name=job.name, download_path=tmp_path, all=True)

# Download specific output
output = client.jobs.download(name=job.name, download_path=tmp_path, output_name=output_port_name)
```
---

### Download child job's output 

When you need to download the output of a child job (a component output that not promotes to pipeline level), you should first list all child job entity of a pipeline job and then use similar code to download the output. 


# [Azure CLI](#tab/cli)

```azurecli
# List all child jobs in the job and print job details in table format
az ml job list --parent-job-name <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID> -o table

# Select needed child job name to download output
az ml job download --all -n <JOB_NAME> -g <RESOURCE_GROUP_NAME> -w <WORKSPACE_NAME> --subscription <SUBSCRIPTION_ID>
```

# [Python SDK](#tab/python)

Before we dive in the code, you need a way to reference your workspace. You create `ml_client` for a handle to the workspace. Refer to [Create handle to workspace](./tutorial-explore-data.md#create-handle-to-workspace) to initialize `ml_client`.

```python
# List all child jobs in the job
child_jobs = client.jobs.list(parent_job_name=job.name)
# Traverse and download all the outputs of child job
for child_job in child_jobs:
    client.jobs.download(name=child_job.name, all=True)
```
---

## How to register output as named asset

You can register output of a component or pipeline as named asset by assigning `name` and `version` to the output. The registered asset can be list in your workspace through studio UI/CLI/SDK and also be referenced in your future jobs.

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

@pipeline()
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
---
 
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

@pipeline()
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
---

## Next steps

- [YAML reference for pipeline job](./reference-yaml-job-pipeline.md)
- [How to debug pipeline failure](./how-to-debug-pipeline-failure.md)
- [Schedule a pipeline job](./how-to-schedule-pipeline-job.md)
- [Deploy a pipeline with batch endpoints(preview)](./how-to-use-batch-pipeline-deployments.md)
