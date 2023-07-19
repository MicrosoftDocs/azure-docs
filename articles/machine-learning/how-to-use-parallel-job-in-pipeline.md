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
ms.reviewer: lagayhar
ms.date: 03/13/2023
ms.custom: devx-track-python, sdkv2, cliv2, event-tier1-build-2022
---

# How to use parallel job in pipeline (V2)

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Parallel job lets users accelerate their job execution by distributing repeated tasks on powerful multi-nodes compute clusters. For example, take the scenario where you're running an object detection model on large set of images. With Azure Machine Learning Parallel job, you can easily distribute your images to run custom code in parallel on a specific compute cluster. Parallelization could significantly reduce the time cost. Also by using Azure Machine Learning parallel job you can simplify and automate your process to make it more efficient.

## Prerequisite

Azure Machine Learning parallel job can only be used as one of steps in a pipeline job. Thus, it's important to be familiar with using pipelines. To learn more about Azure Machine Learning pipelines, see the following articles.

- Understand what is a [Azure Machine Learning pipeline](concept-ml-pipelines.md)
- Understand how to use Azure Machine Learning pipeline with [CLI v2](how-to-create-component-pipelines-cli.md) and [SDK v2](how-to-create-component-pipeline-python.md).

## Why are parallel jobs needed?

In the real world, ML engineers always have scale requirements on their training or inferencing tasks. For example, when a data scientist provides a single script to train a sales prediction model, ML engineers need to apply this training task to each individual store. During this scale out process, some challenges are:

- Delay pressure caused by long execution time.
- Manual intervention to handle unexpected issues to keep the task proceeding.

The core value of Azure Machine Learning parallel job is to split a single serial task into mini-batches and dispatch those mini-batches to multiple computes to execute in parallel. By using parallel jobs, we can:

 - Significantly reduce end-to-end execution time.
 - Use Azure Machine Learning parallel job's automatic error handling settings.

You should consider using Azure Machine Learning Parallel job if:

 - You plan to train many models on top of your partitioned data.
 - You want to accelerate your large scale batch inferencing task.

## Prepare for parallel job

Unlike other types of jobs, a parallel job requires preparation. Follow the next sections to prepare for creating your parallel job.

### Declare the inputs to be distributed and data division setting

Parallel job requires only one **major input data** to be split and processed with parallel. The major input data can be either tabular data or a set of files. Different input types can have a different data division method.

The following table illustrates the relation between input data and data division method:

| Data format | Azure Machine Learning input type | Azure Machine Learning input mode | Data division method |
|: ---------- |: ------------- |: ------------- |: --------------- |
| File list | `mltable` or<br>`uri_folder` | ro_mount or<br>download | By size (number of files)<br>By partitions |
| Tabular data | `mltable` | direct | By size (estimated physical size)<br>By partitions |

You can declare your major input data with `input_data` attribute in parallel job YAML or Python SDK. And you can bind it with one of your defined `inputs` of your parallel job by using `${{inputs.<input name>}}`. Then you need to define the data division method for your major input by filling different attribute:

| Data division method | Attribute name | Attribute type | Job example |
|: ---------- |: ------------- |: ------------- |: --------------- |
| By size | mini_batch_size | string | [Iris batch prediction](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/parallel/2a_iris_batch_prediction) |
| By partitions | partition_keys | list of string | [Orange juice sales prediction](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/parallel/1a_oj_sales_prediction) |


# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" range="14-41" highlight="5-8,18-19":::

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

Declare `job_data_path` as one of the inputs. Bind it to `input_data` attribute.

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=parallel-job-for-file-data)]

---

Once you have the data division setting defined, you can configure how many resources for your parallelization by filling two attributes below:

| Attribute name | Type | Description | Default value |
|:-|--|:-|--|
| `instance_count` | integer | The number of nodes to use for the job. | 1 |
| `max_concurrency_per_instance` | integer | The number of processors on each node. | For a GPU compute, the default value is 1.<br> For a CPU compute, the default value is the number of cores. |

These two attributes work together with your specified compute cluster.

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/how-distributed-data-works-in-parallel-job.png" alt-text="Diagram showing how distributed data works in parallel job." lightbox ="./media/how-to-use-parallel-job-in-pipeline/how-distributed-data-works-in-parallel-job.png":::

Sample code to set two attributes:

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" range="14-41" highlight="20-22":::


# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=parallel-job-for-file-data)]
---

> [!NOTE]
> If you use tabular `mltable` as your major input data, you need to have the MLTABLE specification file with `transformations - read_delimited` section filled under your specific path. For more examples, see [Create a mltable data asset](how-to-create-register-data-assets.md#create-a-mltable-data-asset)

### Implement predefined functions in entry script

Entry script is a single Python file where user needs to implement three predefined functions with custom code. Azure Machine Learning parallel job follows the diagram below to execute them in each processor.

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/how-entry-script-works-in-parallel-job.png" alt-text="Diagram showing how entry script works in parallel job." lightbox ="./media/how-to-use-parallel-job-in-pipeline/how-entry-script-works-in-parallel-job.png":::

| Function name | Required | Description | Input | Return |
| :------------ | -------- | :---------- | :---- | :----- |
| Init() | Y | Use this function for common preparation before starting to run mini-batches. For example, use it to load the model into a global object. | -- | -- |
| Run(mini_batch) | Y | Implement main execution logic for mini_batches. | mini_batch: <br>Pandas dataframe if input data is a tabular data.<br> List of file path if input data is a directory. | Dataframe, List, or Tuple. |
| Shutdown() | N | Optional function to do custom cleans up before returning the compute back to pool. | -- | -- |

Check the following entry script examples to get more details:

- [Image identification for a list of image files](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/parallel-run/Code/digit_identification.py)
- [Iris classification for a tabular iris data](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/parallel-run/Code/iris_score.py)

Once you have entry script ready, you can set following two attributes to use it in your parallel job:

| Attribute name | Type | Description | Default value |
|: ------------- | ---- |: ---------- | ------------- |
| `code` | string | Local path to the source code directory to be uploaded and used for the job. | |
| `entry_script` | string | The Python file that contains the implementation of pre-defined parallel functions. | |

Sample code to set two attributes:

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" range="14-61" highlight="32-33":::

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=parallel-job-for-file-data)]
---

> [!IMPORTANT]
> Run(mini_batch) function requires a return of either a dataframe, list, or tuple item. Parallel job will use the count of that return to measure the success items under that mini-batch. Ideally mini-batch count should be equal to the return list count if all items have well processed in this mini-batch.

> [!IMPORTANT]
> If you want to parse arguments in Init() or Run(mini_batch) function, use "parse_known_args" instead of "parse_args" for avoiding exceptions. See the [iris_score](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/machine-learning-pipelines/parallel-run/Code/iris_score.py) example for entry script with argument parser.

> [!IMPORTANT]
> If you use `mltable` as your major input data, you need to install 'mltable' library into your environment. See the line 9 of this [conda file](https://github.com/Azure/azureml-examples/blob/main/cli/jobs/parallel/1a_oj_sales_prediction/src/parallel_train/conda.yaml) example.

### Consider automation settings

Azure Machine Learning parallel job exposes numerous settings to automatically control the job without manual intervention. See the following table for the details.

| Key | Type | Description | Allowed values | Default value | Set in attribute | Set in program arguments |
|--|--|--|--|--|--|--|
| mini batch error threshold | integer | Define the number of failed **mini batches** that could be ignored in this parallel job. If the count of failed mini-batch is higher than this threshold, the parallel job will be marked as failed.<br><br>Mini-batch is marked as failed if:<br>- the count of return from run() is less than mini-batch input count.<br>- catch exceptions in custom run() code.<br><br>"-1" is the default number, which means to ignore all failed mini-batch during parallel job. | [-1, int.max] | -1 | mini_batch_error_threshold | N/A |
| mini batch max retries | integer | Define the number of retries when mini-batch is failed or timeout. If all retries are failed, the mini-batch will be marked as failed to be counted by `mini_batch_error_threshold` calculation. | [0, int.max] | 2 | retry_settings.max_retries | N/A |
| mini batch timeout | integer | Define the timeout in seconds for executing custom run() function. If the execution time is higher than this threshold, the mini-batch will be aborted, and marked as a failed mini-batch to trigger retry. | (0, 259200] | 60 | retry_settings.timeout | N/A |
| item error threshold | integer | The threshold of failed **items**. Failed items are counted by the number gap between inputs and returns from each mini-batch. If the sum of failed items is higher than this threshold, the parallel job will be marked as failed.<br><br>Note: "-1" is the default number, which means to ignore all failures during parallel job. | [-1, int.max] | -1 | N/A | --error_threshold |
| allowed failed percent | integer | Similar to `mini_batch_error_threshold` but uses the percent of failed mini-batches instead of the count. | [0, 100] | 100 | N/A | --allowed_failed_percent |
| overhead timeout | integer | The timeout in second for initialization of each mini-batch. For example, load mini-batch data and pass it to run() function. | (0, 259200] | 600 | N/A | --task_overhead_timeout |
| progress update timeout | integer | The timeout in second for monitoring the progress of mini-batch execution. If no progress updates receive within this timeout setting, the parallel job will be marked as failed. | (0, 259200] | Dynamically calculated by other settings. | N/A | --progress_update_timeout |
| first task creation timeout | integer | The timeout in second for monitoring the time between the job start to the run of first mini-batch. | (0, 259200] | 600 | N/A | --first_task_creation_timeout |
| logging level | string | Define which level of logs will be dumped to user log files. | INFO, WARNING, or DEBUG | INFO | logging_level | N/A |
| append row to | string | Aggregate all returns from each run of mini-batch and output it into this file. May reference to one of the outputs of parallel job by using the expression ${{outputs.<output_name>}} |  |  | task.append_row_to | N/A |
| copy logs to parent | string | Boolean option to whether copy the job progress, overview, and logs to the parent pipeline job. | True or False | False | N/A | --copy_logs_to_parent |
| resource monitor interval | integer | The time interval in seconds to dump node resource usage(for example, cpu, memory) to log folder under "logs/sys/perf" path.<br><br>Note: Frequent dump resource logs will slightly slow down the execution speed of your mini-batch. Set this value to "0" to stop dumping resource usage. | [0, int.max] | 600 | N/A | --resource_monitor_interval |

Sample code to update these settings:

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" range="14-61" highlight="24-28,41-48":::

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=parallel-job-for-tabular-data)]
---

## Create parallel job in pipeline

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

You can create your parallel job inline with your pipeline job:
:::code language="yaml" source="~/azureml-examples-main/cli/jobs/pipelines/iris-batch-prediction-using-parallel/pipeline.yml" highlight="14-61":::

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

First, you need to import the required libraries, initiate your ml_client with proper credential, and create/retrieve your computes:

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=required-library)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=credential)]

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=workspace)]

Then implement your parallel job by filling `parallel_run_function`:

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=parallel-job-for-tabular-data)]

Finally use your parallel job as a step in your pipeline and bind its inputs/outputs with other steps:

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=build-pipeline)]

---

## Submit pipeline job and check parallel step in Studio UI

# [Azure CLI](#tab/cliv2)

[!INCLUDE [cli v2](includes/machine-learning-cli-v2.md)]

You can submit your pipeline job with parallel step by using the CLI command:

```azurecli
az ml job create --file pipeline.yml
```

# [Python](#tab/python)

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]

You can submit your pipeline job with parallel step by using `jobs.create_or_update` function of ml_client:

[!notebook-python[] (~/azureml-examples-main/sdk/python/jobs/pipelines/1g_pipeline_with_parallel_nodes/pipeline_with_parallel_nodes.ipynb?name=submit-pipeline)]

---

Once you submit your pipeline job, the SDK or CLI widget will give you a web URL link to the Studio UI. The link will guide you to the pipeline graph view by default. Double select the parallel step to open the right panel of your parallel job.

To check the settings of your parallel job, navigate to **Parameters** tab, expand **Run settings**, and check **Parallel** section:

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-settings.png" alt-text="Screenshot of Azure Machine Learning studio on the jobs tab showing the parallel job settings." lightbox ="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-settings.png":::

To debug the failure of your parallel job, navigate to **Outputs + Logs** tab, expand **logs** folder from output directories on the left, and check **job_result.txt** to understand why the parallel job is failed. For more detail about logging structure of parallel job, see the **readme.txt** under the same folder.

:::image type="content" source="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-result.png" alt-text="Screenshot of Azure Machine Learning studio on the jobs tab showing the parallel job results." lightbox ="./media/how-to-use-parallel-job-in-pipeline/screenshot-for-parallel-job-result.png":::

## Parallel job in pipeline examples

- [Azure CLI + YAML example repository](https://github.com/Azure/azureml-examples/tree/main/cli/jobs/parallel)
- [SDK example repository](https://github.com/Azure/azureml-examples/tree/main/sdk/python/jobs/parallel)

## Next steps

- For the detailed yaml schema of parallel job, see the [YAML reference for parallel job](reference-yaml-job-parallel.md).
- For how to onboard your data into MLTABLE, see [Create a mltable data asset](how-to-create-register-data-assets.md#create-a-mltable-data-asset).
- For how to regularly trigger your pipeline, see [how to schedule pipeline](how-to-schedule-pipeline-job.md).
