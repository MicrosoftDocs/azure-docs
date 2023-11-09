---
title: Upgrade pipelines to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade pipelines from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: cloga
ms.author: lochen
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade pipelines to SDK v2

In SDK v2, "pipelines" are consolidated into jobs.

A job has a type. Most jobs are command jobs that run a `command`, like `python main.py`. What runs in a job is agnostic to any programming language, so you can run `bash` scripts, invoke `python` interpreters, run a bunch of `curl` commands, or anything else.

A `pipeline` is another type of job, which defines child jobs that may have input/output relationships, forming a directed acyclic graph (DAG).

To upgrade, you'll need to change your code for defining and submitting the pipelines to SDK v2. What you run _within_ the child job doesn't need to be upgraded to SDK v2. However, it's recommended to remove any code specific to Azure Machine Learning from your model training scripts. This separation allows for an easier transition between local and cloud and is considered best practice for mature MLOps. In practice, this means removing `azureml.*` lines of code. Model logging and tracking code should be replaced with MLflow. For more information, see [how to use MLflow in v2](how-to-use-mlflow-cli-runs.md).

This article gives a comparison of scenario(s) in SDK v1 and SDK v2. In the following examples, we'll build three steps (train, score and evaluate) into a dummy pipeline job. This demonstrates how to build pipeline jobs using SDK v1 and SDK v2, and how to consume data and transfer data between steps.

## Run a pipeline

* SDK v1

    ```python
    # import required libraries
    import os
    import azureml.core
    from azureml.core import (
        Workspace,
        Dataset,
        Datastore,
        ComputeTarget,
        Experiment,
        ScriptRunConfig,
    )
    from azureml.pipeline.steps import PythonScriptStep
    from azureml.pipeline.core import Pipeline
    
    # check core SDK version number
    print("Azure Machine Learning SDK Version: ", azureml.core.VERSION)
    
    # load workspace
    workspace = Workspace.from_config()
    print(
        "Workspace name: " + workspace.name,
        "Azure region: " + workspace.location,
        "Subscription id: " + workspace.subscription_id,
        "Resource group: " + workspace.resource_group,
        sep="\n",
    )
    
    # create an ML experiment
    experiment = Experiment(workspace=workspace, name="train_score_eval_pipeline")
    
    # create a directory
    script_folder = "./src"
    
    # create compute
    from azureml.core.compute import ComputeTarget, AmlCompute
    from azureml.core.compute_target import ComputeTargetException
    
    # Choose a name for your CPU cluster
    amlcompute_cluster_name = "cpu-cluster"
    
    # Verify that cluster does not exist already
    try:
        aml_compute = ComputeTarget(workspace=workspace, name=amlcompute_cluster_name)
        print('Found existing cluster, use it.')
    except ComputeTargetException:
        compute_config = AmlCompute.provisioning_configuration(vm_size='STANDARD_DS12_V2',
                                                               max_nodes=4)
        aml_compute = ComputeTarget.create(ws, amlcompute_cluster_name, compute_config)
    
    aml_compute.wait_for_completion(show_output=True)
    
    # define data set
    data_urls = ["wasbs://demo@dprepdata.blob.core.windows.net/Titanic.csv"]
    input_ds = Dataset.File.from_files(data_urls)
    
    # define steps in pipeline
    from azureml.data import OutputFileDatasetConfig
    model_output = OutputFileDatasetConfig('model_output')
    train_step = PythonScriptStep(
        name="train step",
        script_name="train.py",
        arguments=['--training_data', input_ds.as_named_input('training_data').as_mount() ,'--max_epocs', 5, '--learning_rate', 0.1,'--model_output', model_output],
        source_directory=script_folder,
        compute_target=aml_compute,
        allow_reuse=True,
    )
    
    score_output = OutputFileDatasetConfig('score_output')
    score_step = PythonScriptStep(
        name="score step",
        script_name="score.py",
        arguments=['--model_input',model_output.as_input('model_input'), '--test_data', input_ds.as_named_input('test_data').as_mount(), '--score_output', score_output],
        source_directory=script_folder,
        compute_target=aml_compute,
        allow_reuse=True,
    )
    
    eval_output = OutputFileDatasetConfig('eval_output')
    eval_step = PythonScriptStep(
        name="eval step",
        script_name="eval.py",
        arguments=['--scoring_result',score_output.as_input('scoring_result'), '--eval_output', eval_output],
        source_directory=script_folder,
        compute_target=aml_compute,
        allow_reuse=True,
    )
    
    # built pipeline
    from azureml.pipeline.core import Pipeline
    
    pipeline_steps = [train_step, score_step, eval_step]
    
    pipeline = Pipeline(workspace = workspace, steps=pipeline_steps)
    print("Pipeline is built.")
    
    pipeline_run = experiment.submit(pipeline, regenerate_outputs=False)
    
    print("Pipeline submitted for execution.")
    
    ```

* SDK v2. [Full sample link](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1b_pipeline_with_python_function_components/pipeline_with_python_function_components.ipynb)

    ```python
    # import required libraries
    from azure.identity import DefaultAzureCredential, InteractiveBrowserCredential
    
    from azure.ai.ml import MLClient, Input
    from azure.ai.ml.dsl import pipeline
    
    try:
        credential = DefaultAzureCredential()
        # Check if given credential can get token successfully.
        credential.get_token("https://management.azure.com/.default")
    except Exception as ex:
        # Fall back to InteractiveBrowserCredential in case DefaultAzureCredential not work
        credential = InteractiveBrowserCredential()
    
    # Get a handle to workspace
    ml_client = MLClient.from_config(credential=credential)
    
    # Retrieve an already attached Azure Machine Learning Compute.
    cluster_name = "cpu-cluster"
    print(ml_client.compute.get(cluster_name))
    
    # Import components that are defined with Python function
    with open("src/components.py") as fin:
        print(fin.read())
    
    # You need to install mldesigner package to use command_component decorator.
    # Option 1: install directly
    # !pip install mldesigner
    
    # Option 2: install as an extra dependency of azure-ai-ml
    # !pip install azure-ai-ml[designer]
    
    # import the components as functions
    from src.components import train_model, score_data, eval_model
    
    cluster_name = "cpu-cluster"
    # define a pipeline with component
    @pipeline(default_compute=cluster_name)
    def pipeline_with_python_function_components(input_data, test_data, learning_rate):
        """E2E dummy train-score-eval pipeline with components defined via Python function components"""
    
        # Call component obj as function: apply given inputs & parameters to create a node in pipeline
        train_with_sample_data = train_model(
            training_data=input_data, max_epochs=5, learning_rate=learning_rate
        )
    
        score_with_sample_data = score_data(
            model_input=train_with_sample_data.outputs.model_output, test_data=test_data
        )
    
        eval_with_sample_data = eval_model(
            scoring_result=score_with_sample_data.outputs.score_output
        )
    
        # Return: pipeline outputs
        return {
            "eval_output": eval_with_sample_data.outputs.eval_output,
            "model_output": train_with_sample_data.outputs.model_output,
        }
    
    
    pipeline_job = pipeline_with_python_function_components(
        input_data=Input(
            path="wasbs://demo@dprepdata.blob.core.windows.net/Titanic.csv", type="uri_file"
        ),
        test_data=Input(
            path="wasbs://demo@dprepdata.blob.core.windows.net/Titanic.csv", type="uri_file"
        ),
        learning_rate=0.1,
    )
    
    # submit job to workspace
    pipeline_job = ml_client.jobs.create_or_update(
        pipeline_job, experiment_name="train_score_eval_pipeline"
    )
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[azureml.pipeline.core.Pipeline](/python/api/azureml-pipeline-core/azureml.pipeline.core.pipeline?view=azure-ml-py&preserve-view=true)|[azure.ai.ml.dsl.pipeline](/python/api/azure-ai-ml/azure.ai.ml.dsl#azure-ai-ml-dsl-pipeline)|
|[OutputDatasetConfig](/python/api/azureml-core/azureml.data.output_dataset_config.outputdatasetconfig?view=azure-ml-py&preserve-view=true)|[Output](/python/api/azure-ai-ml/azure.ai.ml.output)|
|[dataset as_mount](/python/api/azureml-core/azureml.data.filedataset?view=azure-ml-py#azureml-data-filedataset-as-mount&preserve-view=true)|[Input](/python/api/azure-ai-ml/azure.ai.ml.input)|

## Step and job/component type mapping

|step in SDK v1| job type in SDK v2| component type in SDK v2|
|--------------|-------------------|-------------------------|
|`adla_step`|None|None|
|`automl_step`|`automl` job|`automl` component|
|`azurebatch_step`| None| None|
|`command_step`| `command` job|`command` component|
|`data_transfer_step`| coming soon | coming soon|
|`databricks_step`| coming soon|coming soon|
|`estimator_step`| command job|`command` component|
|`hyper_drive_step`|`sweep` job| `sweep` component|
|`kusto_step`| None|None|
|`module_step`|None|command component|
|`mpi_step`| command job|command component|
|`parallel_run_step`|`Parallel` job| `Parallel` component|
|`python_script_step`| `command` job|command component|
|`r_script_step`| `command` job|`command` component|
|`synapse_spark_step`| coming soon|coming soon|

## Published pipelines

Once you have a pipeline up and running, you can publish a pipeline so that it runs with different inputs. This was known as __Published Pipelines__. [Batch Endpoint](concept-endpoints-batch.md) proposes a similar yet more powerful way to handle multiple assets running under a durable API which is why the Published pipelines functionality has been moved to [Pipeline component deployments in batch endpoints](concept-endpoints-batch.md#pipeline-component-deployment).

[Batch endpoints](concept-endpoints-batch.md) decouples the interface (endpoint) from the actual implementation (deployment) and allow the user to decide which deployment serves the default implementation of the endpoint. [Pipeline component deployments in batch endpoints](concept-endpoints-batch.md#pipeline-component-deployment) allow users to deploy pipeline components instead of pipelines, which make a better use of reusable assets for those organizations looking to streamline their MLOps practice.

The following table shows a comparison of each of the concepts:

| Concept                                           | SDK v1              | SDK v2                         |
|---------------------------------------------------|---------------------|--------------------------------|
| Pipeline's REST endpoint for invocation           | Pipeline endpoint   | Batch endpoint                 |
| Pipeline's specific version under the endpoint    | Published pipeline  | Pipeline component deployment  |
| Pipeline's arguments on invocation                | Pipeline parameter  | Job inputs                     |
| Job generated from a published pipeline           | Pipeline job        | Batch job                      |

See [Upgrade pipeline endpoints to SDK v2](migrate-to-v2-deploy-pipelines.md) for specific guidance about how to migrate to batch endpoints.

## Related documents

For more information, see the documentation here:

* [steps in SDK v1](/python/api/azureml-pipeline-steps/azureml.pipeline.steps?view=azure-ml-py&preserve-view=true)
* [Create and run machine learning pipelines using components with the Azure Machine Learning SDK v2](how-to-create-component-pipeline-python.md)
* [Build a simple ML pipeline for image classification (SDK v1)](https://github.com/Azure/azureml-examples/blob/v1-archive/v1/python-sdk/tutorials/using-pipelines/image-classification.ipynb)
* [OutputDatasetConfig](/python/api/azureml-core/azureml.data.output_dataset_config.outputdatasetconfig?view=azure-ml-py&preserve-view=true)
* [`mldesigner`](https://pypi.org/project/mldesigner/)
