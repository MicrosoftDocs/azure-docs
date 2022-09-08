---
title: How to use parallel job in pipeline 
titleSuffix: Azure Machine Learning
description: How to use parallel job in Azure Machine Learning pipeline using CLI v2 and Python SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: how-to
author: alainli
ms.author: alainli
ms.date: 08/29/2022
ms.custom: devx-track-python, sdkv2, cliv2, event-tier1-build-2022
---

# How to use parallel job in pipeline (V2) (preview)

Parallel job targets to empower users to accelerate their job execution by distributing repeated tasks on powerful multi-nodes compute clusters. For example, run object detection model on large set of images. With Azure ML Parallel job, you can easily distribute your images to run custom code in parallel on specific compute cluster. Parallelization could significantly reduce the time cost, and Azure ML parallel job make your whole process with simplification, automation and efficiency。

## Prerequisite

With the latest release, Azure ML parallel job could only be used as one of steps in pipeline job. Thus, the following pipeline documentations are required to understand before use parallel job.
1. Understand what is a [Azure Machine Learning pipeline](concept-ml-pipelines.md)
2. Understand how to use Azure ML pipeline with [CLI v2](how-to-create-component-pipelines-cli.md) and [SDK v2](how-to-create-component-pipeline-python.md).

## Why are parallel jobs needed?
In the real world, ML engineers always have scale requirement on their training or inferencing tasks. For example, when data scientist provides a single script to train sales prediction model, ML engineers need to apply this training task to each individual store. During this scale out process, some challenges are surfaced such as:
 - Delay pressure causes by long execution time.
 - Manual intervention to handle unexpected issues to keep the task proceeding.

The core value of Azure ML parallel job is to split a single serial task into mini-batches, and dispatch those mini-batches to multiple computes to execute in parallel. Though this way, you can have:
 - Significantly reduce end-to-end execution time.
 - Free your hands by using Azure ML parallel job automatic error handling settings.

You should consider using Azure ML Parallel job if:
 - You plan to train many models on top of your partitioned data.
 - You want to accelerate your large scale batch inferencing task.

## How to create parallel job in pipeline?
This section explains how to create and use parallel job in Azure Machine Learning pipeline by using CLI v2 and Python SDK. Both approaches provide the equivalent capability and orient to different preference. You can follow the steps to create parallel job with example of each approach:

- [Prepare for parallel job](#prepare-for-parallel-job)
    - Declare the inputs to be distributed and partition setting
    - Implement predefined functions in entry script
    - Properly set automation settings
- [Create parallel job in pipeline](#create-parallel-job-in-pipeline)
- [Submit pipeline job and check parallel step on Azure ML studio UI](#submit-pipeline-job-and-check-parallel-step-on-azure-ml-studio-ui)

### Prepare for parallel job
Unlike other type of job, you need follow the steps below to do some preparation before creating your parallel job in pipeline.

#### Declare the inputs to be distributed and partition setting
Parallel job request to have only one **major input data** to be split and processed with parallel. The major input data could be either a tabular data or set of files. And different input type could have different partition method. The following table illustrates the relation between input data and partition setting:
| Data format | AML input type | AML input mode | Partition method |
|: ---------- |: ------------- |: ------------- |: --------------- |
| File list | mltable or<br>uri_folder | ro_mount or<br>download | By size (number of files) or<br> *By key-value (coming in later release)*
| Tabular data | mltable | direct | By size (estimated physical size) or<br> *By line count (coming in later release) or<br> By key-value (coming in later release)*

You can declare your major input data with `input_data` attribute in parallel job yaml or python sdk. And if you partition your data **by size**, set numbers to `mini_batch_siz` attribute to define the size of mini-batch.
# [Azure CLI](#tab/cliv2)
:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" range="29-41" highlight="33,38,41":::

# [Python](#tab/python)
<pre lang="python">
    file_batch_inference = parallel_run_function(
        name="file_batch_score",
        inputs=dict(
            <mark><b>job_data_path</b>=Input(</mark>
                <mark>type=AssetTypes.MLTABLE,</mark>
                <mark>description="The data to be split and scored in parallel",</mark>
            <mark>)</mark>
        ),
        outputs=dict(job_output_path=Output(type=AssetTypes.MLTABLE)),
        <mark>input_data="${{inputs.<b>job_data_path</b>}}",</mark>
        task=RunFunction(
            code="./src",
            entry_script="file_batch_inference.py",
            program_arguments="--job_output_path ${{outputs.job_output_path}}",
            environment="azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:1",
        ),
)
</pre>

---

Once you have partition setting defined, you can configure parallel setting by using two attributes below:
| Attribute name | Type | Description | Default value |
|: ------------- | ---- |: ---------- | ------------- |
| `instance_count` | integer | The number of nodes to use for the job. | 1 |
| `max_concurrency_per_instance` | integer| The number of processors on each node.|For a GPU compute, the default value is 1.<br>For a CPU compute, the default value is the number of cores.|

These two attributes work together with your specified compute cluster as diagram below:

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/how-distributed-data-works-in-parallel-job.png" alt-text="Diagram for how distributed data works in parallel job." lightbox ="./media/how-to-use-parallel-job-in-pipeline/how-distributed-data-works-in-parallel-job.png":::

Sample code to set two attributes:
# [Azure CLI](#tab/cliv2)
<pre>
    batch_prediction:
        type: parallel
        compute: azureml:cpu-cluster
        inputs:
        input_data: 
            type: mltable
            path: ./neural-iris-mltable
            mode: direct
        score_model: 
            type: uri_folder
            path: ./iris-model
            mode: download
        outputs:
        job_output_file:
            type: uri_file
            mode: rw_mount

        mini_batch_size: "500kb"
        mini_batch_error_threshold: 5
        logging_level: "DEBUG"
        input_data: ${{inputs.input_data}}
        <mark>max_concurrency_per_instance: 3</mark>
        <mark>resources:</mark>
            <mark>instance_count: 2</mark>
</pre>

# [Python](#tab/python)
<pre lang="python">
    file_batch_inference = parallel_run_function(
        name="file_batch_score",
        inputs=dict(
            job_data_path=Input(
                type=AssetTypes.MLTABLE,
                description="The data to be split and scored in parallel",
            )
        ),
        outputs=dict(job_output_path=Output(type=AssetTypes.MLTABLE)),
        input_data="${{inputs.<b>job_data_path</b>}}",
        <mark>instance_count=2,</mark>
        <mark>max_concurrency_per_instance=3,</mark>
        task=RunFunction(
            code="./src",
            entry_script="file_batch_inference.py",
            program_arguments="--job_output_path ${{outputs.job_output_path}}",
            environment="azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:1",
        ),
)
</pre>

> Note: If you use tabular mltable as your major input data, you need have mltable specification file with `transformations - read_delimited` section filled under your specific path. See more example from this document: [Create data assets - create a mltable data](how-to-create-register-data-assets.md#create-a-mltable-data-asset)

#### Implement predefined functions in entry script
Entry script is a single python file where user needs to implement three predefined functions with custom code. Azure ML parallel job follows the diagram below to execute them in each processor.

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/how-entry-script-works-in-parallel-job.png" alt-text="Diagram for how entry script works in parallel job." lightbox ="./media/how-to-use-parallel-job-in-pipeline/how-entry-script-works-in-parallel-job.png":::

| Function name | Required | Description | Input | Return |
| :------------ | -------- | :---------- | :---- | :----- |
| Init() | Y | Use this function for common preparation before starting to run mini-batches. For example, use it to load the model into a global object. | -- | -- |
| Run(mini_batch) | Y | Implement main execution logic for mini_batches. | mini_batch: <br>Pandas dataframe if input data is a tabular data.<br> List of file path if input data is a directory. | Dataframe, List, or Tuple. |
| Shutdown() | N | Optional function to do custom cleans up before returning the compute back to pool. | -- | -- |

Once you have entry script ready, you can set following two attributes to use it in your parallel job:
| Attribute name | Type | Description | Default value |
|: ------------- | ---- |: ---------- | ------------- |
| `code` | string | Local path to the source code directory to be uploaded and used for the job. | |
| `entry_script` | string | The python file that contains the implementation of pre-defined parallel functions. | |

Sample code to set two attributes:
# [Azure CLI](#tab/cliv2)

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" range="28-58" highlight="49,50":::

# [Python](#tab/python)
<pre lang="python">
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
            <mark>code="./src",</mark>
            <mark>entry_script="file_batch_inference.py",</mark>
            program_arguments="--job_output_path ${{outputs.job_output_path}}",
            environment="azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:1",
        ),
)
)
</pre>

---

> [!IMPORTANT]
> Run(mini_batch) function requires a return of either a dataframe, list, or tuple item. Parallel job will use the count of that return to measure the success items under that mini-batch. Ideally mini-batch count should be equal to the return list count if all items have well processed in this mini-batch.

> [!IMPORTANT]
> If you want to parse arguments in Init() or Run(mini_batch) function, use "parse_known_args" instead of "parse_args" for avoiding exceptions. See this example for entry script with argument parser: [iris_score](#https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/parallel-run/Code/iris_score.py) 

#### Consider automation settings
Azure ML parallel job exposes numerous settings to automatically control the job without manual intervention. See the following table for the details.

| Key | Type | Description | Allowed values | Default value | Set in attribute | Set in program arguments |
| --- | ---- | ----------- | -------------- | ------------- | ---------------- | ------------------------ |
| mini batch error threshold | integer | Define the number of failed **mini batches** that could be ignored in this parallel job. If the count of failed mini-batch is higher than this threshold, the parallel job will be marked as failed.<br><br>Mini-batch is marked as failed if:<br>- the count of return from run() is less than mini-batch input count.<br>- catch exceptions in custom run() code.<br><br>"-1" is the default number, which means to ignore all failed mini-batch during parallel job. | [-1, int.max] | -1 | mini_batch_error_threshold | N/A |
| mini batch max retries | integer | Define the number of retries when mini-batch is failed or timeout. If all retries are failed, the mini-batch will be marked as failed to be counted by `mini_batch_error_threshold` calculation. | [0, int.max] | 2 | retry_settings.max_retries | N/A |
| mini batch timeout | integer | Define the timeout in seconds for executing custom run() function. If the execution time is higher than this threshold, the mini-batch will be aborted, and marked as a failed mini-batch to trigger retry. | (0, 259200] | 60 | retry_settings.timeout | N/A |
| item error threshold | integer | The threshold of failed **items**. Failed items are counted by the number gap between inputs and returns from each mini-batch. If the sum of failed items is higher than this threshold, the parallel job will be marked as failed.<br><br>Note: "-1" is the default number, which means to ignore all failures during parallel job. | [-1, int.max] | -1 | N/A | --error_threshold |
| allowed failed percent | integer | Similar to `mini_batch_error_threshold` but uses the percent of failed mini-batches instead of the count. | [0, 100] | 100 | N/A | --allowed_failed_percent |
| overhead timeout | integer | The timeout in second for initialization of each mini-batch. For example, load mini-batch data and pass it to run() function. | (0, 259200] | 600 | N/A | --task_overhead_timeout |
| progress update timeout | integer | The timeout in second for monitoring the progress of mini-batch execution. If no progress updates receive within this timeout setting, the parallel job will be marked as failed. | (0, 259200] | Dynamically calculated by other settings. | N/A | --progress_update_timeout |
| first task creation timeout | integer | The timeout in second for monitoring the time between the job start to the run of first mini-batch. | (0, 259200] | 600 | N/A | --first_task_creation_timeout |
| logging level | string | Define which level of logs will be dumped to user log files. | INFO, WARNING, or DEBUG | INFO | logging_level | N/A |
| append row to | string | Aggregate all returns from each run of mini-batch and output it into this file. May reference to one of the outputs of parallel job by using the expression ${{outputs.<output_name>}} | | | task.append_row_to | N/A |
| copy logs to parent | string | Boolean option to whether copy the job progress, overview, and logs to the parent pipeline job. | True or False | False | N/A | --copy_logs_to_parent |
| resource monitor interval | integer | The time interval in seconds to dump node resource usage(for example, cpu, memory) to log folder under "logs/sys/perf" path.<br><br>Note: Frequent dump resource logs will slightly slow down the execution speed of your mini-batch. Set this value to "0" to stop dumping resource usage. | [0, int.max] | 600 | N/A | --resource_monitor_interval |

Sample code to update these settings:
# [Azure CLI](#tab/cliv2)
<pre>
    batch_prediction:
        type: parallel
        compute: azureml:cpu-cluster
        inputs:
        input_data: 
            type: mltable
            path: ./neural-iris-mltable
            mode: direct
        score_model: 
            type: uri_folder
            path: ./iris-model
            mode: download
        outputs:
        job_output_file:
            type: uri_file
            mode: rw_mount

        mini_batch_size: "500kb"
        <mark>mini_batch_error_threshold: 5</mark>
        <mark>logging_level: "DEBUG"</mark>
        input_data: ${{inputs.input_data}}
        max_concurrency_per_instance: 2
        resources:
            instance_count: 1
        retry_settings:
            <mark>max_retries: 2</mark>
            <mark>timeout: 60</mark>

        task:
            type: run_function
            code: "./script"
            entry_script: iris_prediction.py
            environment:
                name: "prs-env"
                version: 1
                image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04
                conda_file: ./environment/environment_parallel.yml
            program_arguments: >-
                --model ${{inputs.score_model}}
                <mark>--error_threshold 5</mark>
                <mark>--allowed_failed_percent 30</mark>
                <mark>--task_overhead_timeout 1200</mark>
                <mark>--progress_update_timeout 600</mark>
                <mark>--first_task_creation_timeout 600</mark>
                <mark>--copy_logs_to_parent True</mark>
                <mark>--resource_monitor_interva 20</mark>
            <mark>append_row_to: ${{outputs.job_output_file}}</mark>
</pre>

# [Python](#tab/python)
<pre lang="python">
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
        <mark>mini_batch_error_threshold=1,</mark>
        <mark>retry_settings=dict(max_retries=2, timeout=60),</mark>
        <mark>logging_level="DEBUG",</mark>
        max_concurrency_per_instance=1,
        task=RunFunction(
            code="./src",
            entry_script="file_batch_inference.py",
            program_arguments="--job_output_path ${{outputs.job_output_path}} "\
                              <mark>"--error_threshold 5 "\</mark>
                              <mark>"--allowed_failed_percent 30 "\</mark>
                              <mark>"--task_overhead_timeout 1200 "\</mark>
                              <mark>"--progress_update_timeout 600 "\</mark>
                              <mark>"--first_task_creation_timeout 600 "\</mark>
                              <mark>"--copy_logs_to_parent True "\</mark>
                              <mark>"--resource_monitor_interva 20 "\,</mark>
            environment="azureml:AzureML-sklearn-0.24-ubuntu18.04-py37-cpu:1",
            <mark>append_row_to="${{outputs.job_output_path}}",</mark>
        ),
</pre>


### Create parallel job in pipeline
# [Azure CLI](#tab/cliv2)
You can create your parallel job inline with your pipeline job:
:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" highlight="29-58":::

# [Python](#tab/python)
First, you need to import the required libraries, initiate your ml_client with proper credential, and create/retrieve your computes:

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=import-the-required-libraries)]
[!notebook-python[] (~/azureml-examples-main/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=configure-credential)]
[!notebook-python[] (~/azureml-examples-main/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=get-a-handle-to-the-workspace)]

Then implement your parallel job by filling `parallel_run_function`:

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=define-components)]

Finally use your parallel job as a step in your pipeline and bind its inputs/outputs with other steps:
[!notebook-python[] (~/azureml-examples-main/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=build-pipeline)]

---

### Submit pipeline job and check parallel step in Studio UI
# [Azure CLI](#tab/cliv2)
You can submit your pipeline job with parallel step by using the CLI command:
```azurecli
az ml job create --file pipeline.yml
```

# [Python](#tab/python)
You can submit your pipeline job with parallel step by using `jobs.create_or_update` function of ml_client:

[!notebook-python[] (~/azureml-examples-main/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=submit-pipeline-job)]

---

Once you submit your pipeline job, the SDK or CLI widget will give you a web URL link to Studio UI. The link will guide you to the pipeline graph view by default. Double select the parallel step to open the right panel of your parallel job. 

To check the settings of your parallel job, navigate to **Parameters** tab, expand **Run settings**, and check **Parallel** section:

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-settings.png" alt-text="Screenshot for parallel job setting." lightbox ="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-settings.png":::

To debug the failure of your parallel job, navigate to **Outputs + Logs** tab, expand **logs** folder from output directories on the left, and check **job_result.txt** to understand why the parallel job is failed. For more detail about logging structure of parallel job, refer to **readme.txt** under the same folder.

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-result.png" alt-text="Screenshot for parallel job result." lightbox ="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-result.png":::

## Parallel job in pipeline examples
- CLI + Yaml:
    - [Iris prediction using parallel](https://github.com/Azure/azureml-examples/tree/sdk-preview/cli/jobs/pipelines/iris-batch-prediction-using-parallel) (tabular input)
    - [mnist identification using parallel](https://github.com/Azure/azureml-examples/tree/sdk-preview/cli/jobs/pipelines/mnist-batch-identification-using-parallel) (file list input)
- SDK:
    - [Pipeline with parallel run function](https://github.com/Azure/azureml-examples/blob/sdk-preview/sdk/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb)

## Next steps

- For the detailed yaml schema of parallel job, refer to this [link](reference-yaml-job-parallel.md)
- For how to onboard your data into mltable, refer to [Create data assets - create a mltable data](how-to-create-register-data-assets.md#create-a-mltable-data-asset)
- For how to regularly trigger your pipeline, refer to [how to schedule pipeline](how-to-schedule-pipeline-job.md)
