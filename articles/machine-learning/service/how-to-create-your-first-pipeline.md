---
title: Create and run your first machine learning pipeline - Azure Machine Learning service
description: Create and run a machine learning pipeline with the Azure Machine Learning SDK for Python.  Pipelines are used to create and manage the workflows that stitch together machine learning (ML) phases such as data preparation, model training, model deployment, and inferencing. 
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual
ms.reviewer: sgilley
ms.author: sanpil
author: sanpil
ms.date: 12/04/2018
---

# Create and run a machine learning pipeline using Azure Machine Learning SDK

In this article, you learn how to create, publish, run, and track a [machine learning pipeline](concept-ml-pipelines.md) using the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).  These pipelines help create and manage the workflows that stitch together various machine learning phases. 
Each phase of a pipeline, such as data preparation and model training, can include one or more steps.

The pipelines you create are visible to the members of your Azure Machine Learning service [workspace](how-to-manage-workspace.md). 

Pipelines use remote compute targets for computation and the storage of the intermediate and final data associated with that pipeline.  Pipelines can read and write data to and from supported [Azure storage](https://docs.microsoft.com/azure/storage/) locations.


## Prerequisites

* If you don’t have an Azure subscription, create a [free account](https://aka.ms/AMLfree) before you begin.

* [Configure your development environment](how-to-configure-environment.md) to install the Azure Machine Learning SDK.

* Create an [Azure Machine Learning workspace](how-to-configure-environment.md#workspace) to hold all your pipeline resources. 

 ```python
 ws = Workspace.create(
     name = '<workspace-name>',
     subscription_id = '<subscription-id>',
     resource_group = '<resource-group>',
     location = '<workspace_region>',
     exist_ok = True)
 ```

## Set up machine learning resources

Create the resources required to run a pipeline:

* Set up a datastore used to access the data needed in the pipeline steps.

* Configure a `DataReference` object to point to data that lives in or is accessible in a datastore.

* Set up the [compute targets](concept-azure-machine-learning-architecture.md#compute-target) on which your pipeline steps will run.

### Set up a datastore
A datastore stores the data for the pipeline to access.  Each workspace has a default datastore. You can register additional datastores. 

When you create your workspace, an [Azure file storage](https://docs.microsoft.com/azure/storage/files/storage-files-introduction) and a [blob storage](https://docs.microsoft.com/azure/storage/blobs/storage-blobs-introduction) are attached to the workspace by default.  Azure file storage is the "default datastore" for a workspace, but you can also use blob storage as a datastore.  Learn more about [Azure storage options](https://docs.microsoft.com/azure/storage/common/storage-decide-blobs-files-disks). 

```python
# Default datastore (Azure file storage)
def_data_store = ws.get_default_datastore() 

# The above call is equivalent to this 
def_data_store = Datastore(ws, "workspacefilestore")

# Get blob storage associated with the workspace
def_blob_store = Datastore(ws, "workspaceblobstore")
```

Upload data files or directories to the datastore for them to be accessible from your pipelines.  This example uses the blob storage version of the datastore:

```python
def_blob_store.upload_files(
    ["./data/20news.pkl"],
    target_path="20newsgroups", 
    overwrite=True)
```

A pipeline consists of one or more steps.  A step is a unit run on a compute target.  Steps might consume data sources and produce “intermediate” data. A step can create data such as a model, a directory with model and dependent files, or temporary data.  This data is then available for other steps later in the pipeline.

### Configure data reference

You just created a data source that can be referenced in a pipeline as an input to a step. A data source in a pipeline is represented by a [DataReference](https://docs.microsoft.com/python/api/azureml-core/azureml.data.data_reference.datareference) object. The `DataReference` object points to data that lives in or is accessible from a datastore.

```python
blob_input_data = DataReference(
    datastore=def_blob_store,
    data_reference_name="test_data",
    path_on_datastore="20newsgroups/20news.pkl")
```

Intermediate data (or output of a step) is represented by a [PipelineData](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.pipelinedata?view=azure-ml-py) object. `output_data1` is produced as the output of a step and used as the input of one or more future steps.  `PipelineData` introduces a data dependency between steps and creates an implicit execution order in the pipeline.

```python
output_data1 = PipelineData(
    "output_data1",
    datastore=def_blob_store,
    output_name="output_data1")
```

### Set up compute

In Azure Machine Learning, compute (or compute target) refers to the machines or clusters that will perform the computational steps in your machine learning pipeline. For example, you can create an Azure Machine Learning Compute for running your steps.

```python
compute_name = "aml-compute"
 if compute_name in ws.compute_targets:
    compute_target = ws.compute_targets[compute_name]
    if compute_target and type(compute_target) is AmlCompute:
        print('Found compute target: ' + compute_name)
else:
    print('Creating a new compute target...')
    provisioning_config = AmlCompute.provisioning_configuration(vm_size = vm_size, # NC6 is GPU-enabled
                                                                min_nodes = 1, 
                                                                max_nodes = 4)
     # create the compute target
    compute_target = ComputeTarget.create(ws, compute_name, provisioning_config)
    
    # Can poll for a minimum number of nodes and for a specific timeout. 
    # If no min node count is provided it will use the scale settings for the cluster
    compute_target.wait_for_completion(show_output=True, min_node_count=None, timeout_in_minutes=20)
    
     # For a more detailed view of current cluster status, use the 'status' property    
    print(compute_target.status.serialize())
```

## Construct your pipeline steps

Now you are ready to define a pipeline step. There are many built-in steps available via the Azure Machine Learning SDK. The most basic of these steps is a `PythonScriptStep` that executes a Python script in a specified compute target.

```python
trainStep = PythonScriptStep(
    script_name="train.py",
    arguments=["--input", blob_input_data, "--output", processed_data1],
    inputs=[blob_input_data],
    outputs=[processed_data1],
    compute_target=compute_target,
    source_directory=project_folder
)
```

After you define your steps, you build the pipeline using some or all of those steps.

>[!NOTE]
>No file or data is uploaded to Azure Machine Learning service when you define the steps or build the pipeline.

```python
# list of steps to run
compareModels = [trainStep, extractStep, compareStep]

# Build the pipeline
pipeline1 = Pipeline(workspace=ws, steps=[compareModels])
```

## Submit the pipeline

When you submit the pipeline, the dependencies are checked for each step and a snapshot of the folder specified as the source directory is uploaded to Azure Machine Learning service.  If no source directory is specified, the current local directory is uploaded.

```python
# Submit the pipeline to be run
pipeline_run1 = Experiment(ws, 'Compare_Models_Exp').submit(pipeline1)
```

When you first run a pipeline:

* The project snapshot is downloaded to the compute target from blob storage associated with the workspace.
* A docker image is built corresponding to each step in the pipeline.
* The docker image for each step is downloaded to the compute target from the container registry.
* If a `DataReference` object is specified in a step, the data store is mounted. If mount is not supported, the data is instead copied to the compute target.
* The step runs in the compute target specified in the step definition. 
* Artifacts such as logs, stdout and stderr, metrics, and output specified by the step are created. These artifacts are then uploaded and kept in the user’s default data store.

![run an experiment as a pipeline](./media/how-to-create-your-first-pipeline/run_an_experiment_as_a_pipeline.png)

## Publish a pipeline

You can publish a pipeline to run it with different inputs later. For the REST endpoint of an already published pipeline to accept parameters, the pipeline must be parameterized before publishing. 

1. To create a pipeline parameter, use a [PipelineParameter](https://docs.microsoft.com/python/api/azureml-pipeline-core/azureml.pipeline.core.graph.pipelineparameter?view=azure-ml-py) object with a default value.

 ```python
 pipeline_param = PipelineParameter(
     name="pipeline_arg", 
     default_value=10)
 ```

2. Add this `PipelineParameter` object as a parameter to any of the steps in the pipeline as follows:

 ```python
 compareStep = PythonScriptStep(
     script_name="compare.py",
     arguments=["--comp_data1", comp_data1, "--comp_data2", comp_data2, "--output_data", out_data3, "--param1", pipeline_param],
     inputs=[ comp_data1, comp_data2],
     outputs=[out_data3],    
     target=compute_target, 
     source_directory=project_folder)
 ```

3. Publish this pipeline that will accept a parameter when invoked.

```python
published_pipeline1 = pipeline1.publish(
    name="My_Published_Pipeline", 
    description="My Published Pipeline Description")
```

## Run a published pipeline

All published pipelines have a REST endpoint to invoke the run of the pipeline from external systems such as non-Python clients. This endpoint provides a way for "managed repeatability" in batch scoring and retraining scenarios.

To invoke the run of the preceding pipeline, you need an Azure Active Directory authentication header token as described in [AzureCliAuthentication class](https://docs.microsoft.com/python/api/azureml-core/azureml.core.authentication.azurecliauthentication?view=azure-ml-py)

```python
response = requests.post(published_pipeline1.endpoint, 
    headers=aad_token, 
    json={"ExperimentName": "My_Pipeline",
        "ParameterAssignments": {"pipeline_arg": 20}})
```
## View results

See the list of all your pipelines and their run details:
1. Sign in to the [Azure portal](https://portal.azure.com/).  

1. [View your workspace](how-to-manage-workspace.md#view-a-workspace) to find the list of pipelines.
 ![list of machine learning pipelines](./media/how-to-create-your-first-pipeline/list_of_pipelines.png)
 
1. Select a specific pipeline to see the run results.

## Next steps
- Use [these Jupyter notebooks on GitHub](https://aka.ms/aml-pipeline-readme) to explore machine learning pipelines further.
- Read the SDK reference help for the [azureml-pipelines-core](https://docs.microsoft.com/python/api/azureml-pipeline-core/?view=azure-ml-py) package and the [azureml-pipelines-steps](https://docs.microsoft.com/python/api/azureml-pipeline-steps/?view=azure-ml-py) package.

[!INCLUDE [aml-clone-in-azure-notebook](../../../includes/aml-clone-for-examples.md)]
