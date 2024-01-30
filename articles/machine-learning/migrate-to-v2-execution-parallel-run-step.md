---
title: Upgrade parallel run step to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade parallel run step from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: alainli0928
ms.author: alainli
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade parallel run step to SDK v2

In SDK v2, "Parallel run step" is consolidated into job concept as `parallel job`. Parallel job keeps the same target to empower users to accelerate their job execution by distributing repeated tasks on powerful multi-nodes compute clusters. On top of parallel run step, v2 parallel job provides extra benefits:

- Flexible interface, which allows user to define multiple custom inputs and outputs for your parallel job. You can connect them with other steps to consume or manage their content in your entry script 
- Simplify input schema, which replaces `Dataset` as input by using v2 `data asset` concept. You can easily use your local files or blob directory URI as the inputs to parallel job.
- More powerful features are under developed in v2 parallel job only. For example, resume the failed/canceled parallel job to continue process the failed or unprocessed mini-batches by reusing the successful result to save duplicate effort.

To upgrade your current sdk v1 parallel run step to v2, you'll need to 

- Use `parallel_run_function` to create parallel job by replacing `ParallelRunConfig` and `ParallelRunStep` in v1.
- Upgrade your v1 pipeline to v2. Then invoke your v2 parallel job as a step in your v2 pipeline. See [how to upgrade pipeline from v1 to v2](migrate-to-v2-execution-pipeline.md) for the details about pipeline upgrade.

> Note: User __entry script__ is compatible between v1 parallel run step and v2 parallel job. So you can keep using the same entry_script.py when you upgrade your parallel run job.

This article gives a comparison of scenario(s) in SDK v1 and SDK v2. In the following examples, we'll build a parallel job to predict input data in a pipelines job. You'll see how to build a parallel job, and how to use it in a pipeline job for both SDK v1 and SDK v2.

## Prerequisites

 - Prepare your SDK v2 environment: [Install the Azure Machine Learning SDK v2 for Python](/python/api/overview/azure/ai-ml-readme)
 - Understand the basis of SDK v2 pipeline: [How to create Azure Machine Learning pipeline with Python SDK v2](how-to-create-component-pipeline-python.md)


## Create parallel step
* SDK v1

    ```python
    # Create the configuration to wrap the inference script
    from azureml.pipeline.steps import ParallelRunStep, ParallelRunConfig
    
    parallel_run_config = ParallelRunConfig(
        source_directory=scripts_folder,
        entry_script=script_file,
        mini_batch_size=PipelineParameter(name="batch_size_param", default_value="5"),
        error_threshold=10,
        output_action="append_row",
        append_row_file_name="mnist_outputs.txt",
        environment=batch_env,
        compute_target=compute_target,
        process_count_per_node=PipelineParameter(name="process_count_param", default_value=2),
        node_count=2
    )
    
    # Create the Parallel run step
    parallelrun_step = ParallelRunStep(
        name="predict-digits-mnist",
        parallel_run_config=parallel_run_config,
        inputs=[ input_mnist_ds_consumption ],
        output=output_dir,
        allow_reuse=False
    )
    ```

* SDK v2

    ```python
    # parallel job to process file data
    file_batch_inference = parallel_run_function(
        name="file_batch_score",
        display_name="Batch Score with File Dataset",
        description="parallel component for batch score",
        inputs=dict(
            job_data_path=Input(
                type=AssetTypes.MLTABLE,
                description="The data to be split and scored in parallel",
            )
        ),
        outputs=dict(job_output_path=Output(type=AssetTypes.MLTABLE)),
        input_data="${{inputs.job_data_path}}",
        instance_count=2,
        mini_batch_size="1",
        mini_batch_error_threshold=1,
        max_concurrency_per_instance=1,
        task=RunFunction(
            code="./src",
            entry_script="file_batch_inference.py",
            program_arguments="--job_output_path ${{outputs.job_output_path}}",
            environment="azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:1",
        ),
    )
    ```

## Use parallel step in pipeline

* SDK v1

    ```python
    # Run pipeline with parallel run step
    from azureml.core import Experiment
    
    pipeline = Pipeline(workspace=ws, steps=[parallelrun_step])
    experiment = Experiment(ws, 'digit_identification')
    pipeline_run = experiment.submit(pipeline)
    pipeline_run.wait_for_completion(show_output=True)
    ```

* SDK v2

    ```python
    @pipeline()
    def parallel_in_pipeline(pipeline_job_data_path, pipeline_score_model):
    
        prepare_file_tabular_data = prepare_data(input_data=pipeline_job_data_path)
        # output of file & tabular data should be type MLTable
        prepare_file_tabular_data.outputs.file_output_data.type = AssetTypes.MLTABLE
        prepare_file_tabular_data.outputs.tabular_output_data.type = AssetTypes.MLTABLE
    
        batch_inference_with_file_data = file_batch_inference(
            job_data_path=prepare_file_tabular_data.outputs.file_output_data
        )
        # use eval_mount mode to handle file data
        batch_inference_with_file_data.inputs.job_data_path.mode = (
            InputOutputModes.EVAL_MOUNT
        )
        batch_inference_with_file_data.outputs.job_output_path.type = AssetTypes.MLTABLE
    
        batch_inference_with_tabular_data = tabular_batch_inference(
            job_data_path=prepare_file_tabular_data.outputs.tabular_output_data,
            score_model=pipeline_score_model,
        )
        # use direct mode to handle tabular data
        batch_inference_with_tabular_data.inputs.job_data_path.mode = (
            InputOutputModes.DIRECT
        )
    
        return {
            "pipeline_job_out_file": batch_inference_with_file_data.outputs.job_output_path,
            "pipeline_job_out_tabular": batch_inference_with_tabular_data.outputs.job_output_path,
        }
    
    pipeline_job_data_path = Input(
        path="./dataset/", type=AssetTypes.MLTABLE, mode=InputOutputModes.RO_MOUNT
    )
    pipeline_score_model = Input(
        path="./model/", type=AssetTypes.URI_FOLDER, mode=InputOutputModes.DOWNLOAD
    )
    # create a pipeline
    pipeline_job = parallel_in_pipeline(
        pipeline_job_data_path=pipeline_job_data_path,
        pipeline_score_model=pipeline_score_model,
    )
    pipeline_job.outputs.pipeline_job_out_tabular.type = AssetTypes.URI_FILE
    
    # set pipeline level compute
    pipeline_job.settings.default_compute = "cpu-cluster"
    
    # run pipeline job
    pipeline_job = ml_client.jobs.create_or_update(
        pipeline_job, experiment_name="pipeline_samples"
    )
    ```
    
## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[azureml.pipeline.steps.parallelrunconfig](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallelrunconfig)<br>[azureml.pipeline.steps.parallelrunstep](/python/api/azureml-pipeline-steps/azureml.pipeline.steps.parallelrunstep)|[azure.ai.ml.parallel](/python/api/azure-ai-ml/azure.ai.ml.parallel)|
|[OutputDatasetConfig](/python/api/azureml-core/azureml.data.output_dataset_config.outputdatasetconfig)|[Output](/python/api/azure-ai-ml/azure.ai.ml.output)|
|[dataset as_mount](/python/api/azureml-core/azureml.data.filedataset#azureml-data-filedataset-as-mount)|[Input](/python/api/azure-ai-ml/azure.ai.ml.input)|

## Parallel job configurations and settings mapping

| SDK v1| SDK v2| Description |
|-------|-------|-------------|
|ParallelRunConfig.environment|parallel_run_function.task.environment|Environment that training job will run in. |
|ParallelRunConfig.entry_script|parallel_run_function.task.entry_script |User script that will be run in parallel on multiple nodes. |
|ParallelRunConfig.error_threshold| parallel_run_function.error_threshold |The number of failed mini batches that could be ignored in this parallel job. If the count of failed mini-batch is higher than this threshold, the parallel job will be marked as failed.<br><br>"-1" is the default number, which means to ignore all failed mini-batch during parallel job.|
|ParallelRunConfig.output_action|parallel_run_function.append_row_to |Aggregate all returns from each run of mini-batch and output it into this file. May reference to one of the outputs of parallel job by using the expression ${{outputs.<output_name>}}|
|ParallelRunConfig.node_count|parallel_run_function.instance_count |Optional number of instances or nodes used by the compute target. Defaults to 1.|
|ParallelRunConfig.process_count_per_node|parallel_run_function.max_concurrency_per_instance |The max parallelism that each compute instance has. |
|ParallelRunConfig.mini_batch_size|parallel_run_function.mini_batch_size |Define the size of each mini-batch to split the input.<br><br>If the input_data is a folder or set of files, this number defines the file count for each mini-batch. For example, 10, 100.<br><br>If the input_data is tabular data from `mltable`, this number defines the proximate physical size for each mini-batch. The default unit is Byte and the value could accept string like 100 kb, 100 mb.|
|ParallelRunConfig.source_directory|parallel_run_function.task.code |A local or remote path pointing at source code.|
|ParallelRunConfig.description|parallel_run_function.description |A friendly description of the parallel|
|ParallelRunConfig.logging_level|parallel_run_function.logging_level |A string of the logging level name, which is defined in 'logging'. Possible values are 'WARNING', 'INFO', and 'DEBUG'. (optional, default value is 'INFO'.) This value could be set through PipelineParameter. |
|ParallelRunConfig.run_invocation_timeout|parallel_run_function.retry_settings.timeout |The timeout in seconds for executing custom run() function. If the execution time is higher than this threshold, the mini-batch will be aborted, and marked as a failed mini-batch to trigger retry.|
|ParallelRunConfig.run_max_try|parallel_run_function.retry_settings.max_retries |The number of retries when mini-batch is failed or timeout. If all retries are failed, the mini-batch will be marked as failed to be counted by mini_batch_error_threshold calculation.|
|ParallelRunConfig.append_row_file_name |parallel_run_function.append_row_to | Combined with `append_row_to` setting.|
|ParallelRunConfig.allowed_failed_count|parallel_run_function.mini_batch_error_threshold |The number of failed mini batches that could be ignored in this parallel job. If the count of failed mini-batch is higher than this threshold, the parallel job will be marked as failed.<br><br>"-1" is the default number, which means to ignore all failed mini-batch during parallel job.|
|ParallelRunConfig.allowed_failed_percent|parallel_run_function.task.program_arguments set <br>`--allowed_failed_percent`|Similar to "allowed_failed_count" but this setting uses the percent of failed mini-batches instead of the mini-batch failure count.<br><br>The range of this setting is [0, 100]. "100" is the default number, which means to ignore all failed mini-batch during parallel job.|
|ParallelRunConfig.partition_keys| _Under development._ | |
|ParallelRunConfig.environment_variables|parallel_run_function.environment_variables |A dictionary of environment variables names and values. These environment variables are set on the process where user script is being executed.|
|ParallelRunStep.name|parallel_run_function.name |Name of the parallel job or component created.|
|ParallelRunStep.inputs|parallel_run_function.inputs|A dict of inputs used by this parallel.|
|--|parallel_run_function.input_data| Declare the data to be split and processed with parallel|
|ParallelRunStep.output|parallel_run_function.outputs|The outputs of this parallel job.|
|ParallelRunStep.side_inputs|parallel_run_function.inputs|Defined together with `inputs`.|
|ParallelRunStep.arguments|parallel_run_function.task.program_arguments|The arguments of the parallel task.|
|ParallelRunStep.allow_reuse|parallel_run_function.is_deterministic|Specify whether the parallel will return same output given same input.|

## Next steps

For more information, see the documentation here:

* [Parallel run step SDK v1 examples](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/machine-learning-pipelines/parallel-run)
* [Parallel job SDK v2 examples](https://github.com/Azure/azureml-examples/blob/main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb)
