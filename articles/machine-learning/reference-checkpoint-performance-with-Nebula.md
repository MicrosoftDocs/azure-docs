---
title: Optimize Checkpoint Performance for Large Model Training Jobs with Nebula
titleSuffix: Azure Machine Learning
description: Learn how Nebula can save time, resources, and money for large model training applications
services: machine-learning
ms.service: machine-learning
ms.subservice: ----
ms.topic: reference
ms.custom: ----, ----, ----

author: ziqiwang
ms.author: ziqiwang
ms.date: 02/16/2023
ms.reviewer: franksolomon
---

# Large-model Checkpoint Optimization Matters

--> CORRECT INCLUDE(S) TBD

Learn how to boost checkpoint speed and shrink checkpoint cost for large Azure ML training models.

## Overview

The Azure Container for PyTorch (ACPT) now offers **Nebula**, a fast, disk-less, model-aware checkpointing method. Nebula offers simple, high-speed checkpointing for large model training jobs. It levers the latest distributed computing technologies to boost checkpoint speeds hundreds to thousands of times faster compared to conventional checkpointing methods. Nebula can reduce checkpoint operation time from hours to seconds. In some cases, checkpoint time can shrink by 95% to as much as 99.5%.

The Nebula API also offers a simple way to monitor and view checkpointing lifecycles. This API supports various model types, and ensures checkpoint consistency and reliability.  

In this document, you'll learn how to use Nebula with ACPT on Azure ML, to quickly checkpoint your model training jobs. Additionally, you'll learn how to view and manage Nebula checkpoint data. You'll also learn how to resume the model training jobs from the last available checkpoint if Azure ML suffers interruption, failure, or termination.

## Why checkpoint optimization for large model training matters

Machine learning models have become more complex because of the format and growing size of data. Training these complex models can become challenging because of GPU memory capacity limits and lengthy training times. As a result, training complex models on large datasets usually involves distributed training. However, distributed architectures often enough have faults and node failures. These faults and node failures become increasingly painful as the machine learning model node counts increase.

Checkpointing can help deal with these problems. Checkpoint periodically snapshots the complete model state at a given time. After a failure, the system can use that snapshot to rebuild the model in its state at the time of the snapshot. The training process can then resume at a given epoch.

However, systems need heavy resources to save checkpoints. Research shows that on average, checkpointing-related overheads can take up to 12% of total training time, and sometimes as much as 43% [1]. Additionally, when training large models, like GPT-3, systems often save TB-scale checkpoints in a synchronized way. In these cases, serialization stops the training process for a long time - 1 to 2 hours, maybe more for mounted storage.

When large model training operations experience failures and terminations, data scientists and researchers can restore the training process from a previously saved checkpoint. Unfortunately, the process between the checkpoint and the termination itself is wasted, because the computation must re-execute operations to cover the unsaved, intermediate results.

To summarize, large model checkpoint management involves heavy job recover time and storage overheads.

    :::image type="content" source="media/quickstart-spark-jobs/checkpoint-time-flow-diagram.png" lightbox="media/reference-checkpoint-performance-with-Nebula/checkpoint-time-flow-diagram.png" alt-text="Screenshot that shows the time waste of duplicated data training.":::

## Nebula to the Rescue

Nebula reduces checkpoint save and process recovery times, to reduce training GPU hour demands. In turn, this reduction helps shrinks large-scale model training time demands. We can expect Nebula to increase large model training process resilience and stability after a training process failure. Instead of a recovery process that restarts from the very beginning - the time when nodes experience failures - Nebula allows for a recovery from a more recent checkpoint. The recovery reduces both E2E training time, and AzureML GPU time resource demands when nodes fail.

Nebula can

* **Boost checkpoint speeds as much as 1000 times** with a simple API that asynchronously works with your training process. Nebula can reduce checkpoint times from hours to seconds - a potential reduction of 95% to 99.5%.

    :::image type="content" source="media/quickstart-spark-jobs/nebula-checkpoint-time-savings.png" lightbox="media/reference-checkpoint-performance-with-Nebula/nebula-checkpoint-time-savings.png" alt-text="Screenshot that shows the time savings benefit of Nebula.":::

* **Shrink end-to-end training time and computation costs**. Nebula can help you complete large-scale model training jobs faster and cheaper by reducing checkpoint and recovery time demands.

* **Reduce large model training costs** through checkpoint overhead reduction, and reduction of GPU hours wasted on job recovery. Nebula allows more frequent checkpoint saves, with zero effect on your training process or training accuracy. You can resume your training from the latest checkpoint if the training process suffers an interruption, and you'll save time and money.

* **Provide a more stable and resilient experience** training large models on Azure Machine Learning. Nebula avoids data loss and resource waste due to interruptions, which can improve the reliability and performance of your training process.

* **Easily manage your checkpoints** with a Python package that helps list, get, save and load your checkpoints. To show the checkpointing lifecycle, Nebula also provides more comprehensive logs on Azure Machine Learning studio. You can choose to save your checkpoints to a local or remote storage location

  - Azure Blob Storage
  - Azure Data Lake Storage
  - NFS

and access them at any time with a few lines of code.

  **LARGER IMG_3 VERSION NEEDED**

    :::image type="content" source="media/quickstart-spark-jobs/IMG_3.png" lightbox="media/reference-checkpoint-performance-with-Nebula/IMG_3.png" alt-text="LARGER IMG_3 VERSION NEEDED":::

  **LARGER IMG_4 VERSION NEEDED**

    :::image type="content" source="media/quickstart-spark-jobs/IMG_4.png" lightbox="media/reference-checkpoint-performance-with-Nebula/IMG_4.png" alt-text="LARGER IMG_3 VERSION NEEDED":::


  **LARGER IMG_5 VERSION NEEDED**

    :::image type="content" source="media/quickstart-spark-jobs/IMG_5.png" lightbox="media/reference-checkpoint-performance-with-Nebula/IMG_5.png" alt-text="LARGER IMG_5 VERSION NEEDED":::

Nebula offers full compatibility with any distributed training framework that supports PyTorch, and any compute target that supports ACPT. Nebula is designed to work with different distributed training strategies. You can use Nebula with PyTorch, PyTorch Lightning, DeepSpeed, and more. You can also use it with different Azure Machine Learning compute target, such as AmlCompute or AKS.

## Prerequisites

* An Azure subscription and an Azure ML workspace. See [Create workspace resources](./quickstart-create-resources.md) for more information about workspace resource creation

* An Azure ML compute target
  - VM
  - cluster
  - instance

  See [Manage training & deploy computes](./how-to-create-attach-compute-studio.md) to learn more about compute target creation

* The required dependency included in an ACPT-curated (Azure Container for Pytorch) environment. See [Curated environments](./resource-curated-environments#azure-container-for-pytorch-acpt-preview) to obtain the ACPT image. Learn how to use the curated environment [here](./how-to-use-environments.md)

* An Azure ML script run configuration file, which defines the
- source directory
- the entry script
- environment
- compute target
for your model training job. To create a compute target, see [this resource](./how-to-set-up-training-targets.md)

## Next steps

To save checkpoints with Nebula, you must modify your training scripts in two ways. That's it:

* Initialize Nebula

    At the initialization phase, specify the variables that determine the checkpoint save location and frequency. A distributed trainer - like DeepSpeed - makes this process easier.

* Call the save APIs to save the checkpoints

    Similar to the way that the PyTorch `torch.save()` API works, Nebula provides checkpoint save APIs that you can use in your training scripts.

You don't need to modify other steps to train your large model on Azure Machine Learning Platform. You only need to use the [Azure Container PyTorch (ACPT) curated environment](./how-to-manage-environments-v2?tabs=cli#curated-environments)


## Examples

* Example 1 - natively use PyTorch

  To enable full Nebula compatibility with PyTorch-based training scripts, modify a few lines in your training script.

  First, import the required `torch_nebula` package:

  ```python
    # Import the Nebula package for fast-checkpointing 
    import torch_nebula as tn
  ```

  To initialize Nebula, call the `tn.init()` function in `main()`, as shown here:

  ```python  
    # Initialize Nebula with variables that helps Nebula to know where and how often to save your checkpoints
    persistent_storage_path="/tmp/test",
    tn.init(persistent_storage_path, persistent_time_interval=2)
  ```

  After initialization, replace the original `torch.save()` statement to save your checkpoint with Nebula:

  ```python
  checkpoint = tn.Checkpoint()
  checkpoint.save(<'CKPT_NAME'>, model)
  ```

  You can use other APIs to handle checkpoint management

  - list all checkpoints
  - get latest checkpoints

  ```python
  # Managing checkpoints
  ## List all checkpoints
  ckpts = tn.list_checkpoints()
  ## Get Latest checkpoint path
  latest_ckpt_path = tn.get_latest_checkpoint_path("checkpoint", persisted_storage_path)
  ```

* Example 2 - use DeepSpeed

  A training script based on DeepSpeed (>=0.7.3) can lever Nebula if you enable Nebula in your `ds_config.json` configuration file, as shown:

  ```python
  "nebula": {
        "enabled": true,
        "persistent_storage_path": "<YOUR STORAGE PATH>",
        "persistent_time_interval": 100,
        "num_of_version_in_retention": 2,
        "enable_nebula_load": true
    }
  ```

  This JSON snippets function works like the `torch_nebula.init()` function.

  Initialization with ds_config.json file configuration enables Nebula, so you can save checkpoints. The original DeepSpeed saving method `model_engine.save_checkpoint()` automatically uses Nebula, which avoids the need for code modification.

* Example 3 - PyTorch Lightning

  There are two easy ways to enable Nebula for a PyTorch (>=0.15.0) training script.

  If you use `ModelCheckpoint` to conditionally save your checkpoints, you can use `NebulaCallback` instead of `ModelCheckpoint` for initialization.

  ```python
  # import Nebula package
  import torch_nebula as tn
  
  # define NebulaCallback
  config_params = dict()
  config_params["persistent_storage_path"] = "<YOUR STORAGE PATH>"
  config_params["persistent_time_interval"] = 10
  
  nebula_checkpoint_callback = tn.NebulaCallback(
     ****, # Original ModelCheckpoint params
     config_params=config_params, # customize the config of init nebula
  )
  ```

  Next, add `tn.NebulaCheckpointIO()` as a plugin to your `Trainer`, and modify the `trainer.save_checkpoint()` storage parameters as shown:

  ```python
  # import Nebula package
  import torch_nebula as tn
  
  # initialize Nebula
  tn.init(persistent_storage_path=<YOUR STORAGE PATH>) 
  
  trainer = Trainer(plugins=[tn.NebulaCheckpointIO()])  # add NebulaCheckpointIO as a plugin
  
  # Saving checkpoints
  storage_options = {}
  storage_options['is_best'] = True
  storage_options['persist_path'] = "/tmp/tier3/checkpoint"
  
  trainer.save_checkpoint("example.ckpt",
    storage_options=storage_options, # customize the config of Nebula saving checkpoint
  )




  ```



adding tn.NebulaCheckpointIO() in your Trainer as a plugin enables Nebula to save and load checkpoints.





If the training script is based on DeepSpeed (>=0.7.3), you can enjoy Nebula by enabling Nebula in your configuration file ds_config.json as follows as an example:

## Why MLflow?

MLflow, with over 13 million monthly downloads, has become the standard platform for end-to-end MLOps, enabling teams of all sizes to track, share, package and deploy any model for batch or real-time inference. Because of MLflow integration, your training code can avoid any specific code related to Azure Machine Learning, achieving true portability and seamless integration with other open-source platforms.

## Prepare for migrating to MLflow

To use MLflow tracking, you must install the `mlflow` and `azureml-mlflow` Python packages. All Azure Machine Learning environments have these packages already available for you but you must include them if creating your own environment.

```bash
pip install mlflow azureml-mlflow
```

> [!TIP]
> You can use the [`mlflow-skinny`](https://github.com/mlflow/mlflow/blob/master/README_SKINNY.rst) which is a lightweight MLflow package without SQL storage, server, UI, or data science dependencies. This is recommended for users who primarily need the tracking and logging capabilities without importing the full suite of MLflow features including deployments.

## Connect to your workspace

Azure Machine Learning allows users to perform tracking in training jobs running on your workspace or running remotely (tracking experiments running outside Azure Machine Learning). For remote tracking, you must indicate the workspace to which you want to connect to MLflow.

# [Azure Machine Learning compute](#tab/aml)

You already connected to your workspace when running on Azure Machine Learning compute.

# [Remote compute](#tab/remote)

**Configure tracking URI**

[!INCLUDE [configure-mlflow-tracking](../../includes/machine-learning-mlflow-configure-tracking.md)]

**Configure authentication**

Once you configure the tracking, you must configure the way that the authentication to the associated workspace happens. By default, the Azure Machine Learning plugin opens the default browser, and prompts for credentials, to handle interactive authentication. See [Configure MLflow for Azure Machine Learning: Configure authentication](how-to-use-mlflow-configure-tracking.md#configure-authentication) for more ways to configure authentication for MLflow in Azure Machine Learning workspaces.

[!INCLUDE [configure-mlflow-auth](../../includes/machine-learning-mlflow-configure-auth.md)]

---

## Experiments and runs

__SDK v1__

```python
from azureml.core import Experiment

# create an AzureML experiment and start a run
experiment = Experiment(ws, "create-experiment-sdk-v1")
azureml_run = experiment.start_logging()
```

__SDK v2 with MLflow__

```python
# Set the MLflow experiment and start a run
mlflow.set_experiment("logging-with-mlflow")
mlflow_run = mlflow.start_run()
```

## Logging API comparison

### Log an integer or float metric

__SDK v1__

```python
azureml_run.log("sample_int_metric", 1)
```

__SDK v2 with MLflow__

```python
mlflow.log_metric("sample_int_metric", 1)
```

### Log a boolean metric

__SDK v1__

```python
azureml_run.log("sample_boolean_metric", True)
```

__SDK v2 with MLflow__

```python
mlflow.log_metric("sample_boolean_metric", 1)
```

### Log a string metric

__SDK v1__

```python
azureml_run.log("sample_string_metric", "a_metric")
```

__SDK v2 with MLflow__

```python
mlflow.log_text("sample_string_text", "string.txt")
```

* The string logs as an _artifact_, not as a metric. In Azure Machine Learning studio, the value displays in the __Outputs + logs__ tab.

### Log an image to a PNG or JPEG file

__SDK v1__

```python
azureml_run.log_image("sample_image", path="Azure.png")
```

__SDK v2 with MLflow__

```python
mlflow.log_artifact("Azure.png")
```

The image logs as an artifact, and appears in the Azure Machine Learning studio __Images__ tab.

### Log a matplotlib.pyplot

__SDK v1__

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3])
azureml_run.log_image("sample_pyplot", plot=plt)
```

__SDK v2 with MLflow__

```python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3])
fig, ax = plt.subplots()
ax.plot([0, 1], [2, 3])
mlflow.log_figure(fig, "sample_pyplot.png")
```

* The image logs as an artifact, and appears in the Azure Machine Learning studio __Images__ tab.
* The `mlflow.log_figure` method is __experimental__.


### Log a list of metrics

__SDK v1__

```python
list_to_log = [1, 2, 3, 2, 1, 2, 3, 2, 1]
azureml_run.log_list('sample_list', list_to_log)
```

__SDK v2 with MLflow__

```python
list_to_log = [1, 2, 3, 2, 1, 2, 3, 2, 1]
from mlflow.entities import Metric
from mlflow.tracking import MlflowClient
import time

metrics = [Metric(key="sample_list", value=val, timestamp=int(time.time() * 1000), step=0) for val in list_to_log]
MlflowClient().log_batch(mlflow_run.info.run_id, metrics=metrics)
```
* Metrics appear in the __metrics__ tab in Azure Machine Learning studio.
* Text values are not supported.

### Log a row of metrics

__SDK v1__

```python
azureml_run.log_row("sample_table", col1=5, col2=10)
```

__SDK v2 with MLflow__

```python
metrics = {"sample_table.col1": 5, "sample_table.col2": 10}
mlflow.log_metrics(metrics)
```

* Metrics don't render as a table in Azure Machine Learning studio.
* Text values are not supported.
* Logged as an _artifact_, not as a metric.

### Log a table

__SDK v1__

```python
table = {
"col1" : [1, 2, 3],
"col2" : [4, 5, 6]
}
azureml_run.log_table("table", table)
```

__SDK v2 with MLflow__

```python
# Add a metric for each column prefixed by metric name. Similar to log_row
row1 = {"table.col1": 5, "table.col2": 10}
# To be done for each row in the table
mlflow.log_metrics(row1)

# Using mlflow.log_artifact
import json

with open("table.json", 'w') as f:
json.dump(table, f)
mlflow.log_artifact("table.json")
```

* Logs metrics for each column.
* Metrics don't render as a table in Azure Machine Learning studio.
* Text values are not supported.
* Logged as an _artifact_, not as a metric.

### Log an accuracy table

__SDK v1__

```python
ACCURACY_TABLE = '{"schema_type": "accuracy_table", "schema_version": "v1", "data": {"probability_tables": ' +\
        '[[[114311, 385689, 0, 0], [0, 0, 385689, 114311]], [[67998, 432002, 0, 0], [0, 0, ' + \
        '432002, 67998]]], "percentile_tables": [[[114311, 385689, 0, 0], [1, 0, 385689, ' + \
        '114310]], [[67998, 432002, 0, 0], [1, 0, 432002, 67997]]], "class_labels": ["0", "1"], ' + \
        '"probability_thresholds": [0.52], "percentile_thresholds": [0.09]}}'

azureml_run.log_accuracy_table('v1_accuracy_table', ACCURACY_TABLE)
```

__SDK v2 with MLflow__

```python
ACCURACY_TABLE = '{"schema_type": "accuracy_table", "schema_version": "v1", "data": {"probability_tables": ' +\
        '[[[114311, 385689, 0, 0], [0, 0, 385689, 114311]], [[67998, 432002, 0, 0], [0, 0, ' + \
        '432002, 67998]]], "percentile_tables": [[[114311, 385689, 0, 0], [1, 0, 385689, ' + \
        '114310]], [[67998, 432002, 0, 0], [1, 0, 432002, 67997]]], "class_labels": ["0", "1"], ' + \
        '"probability_thresholds": [0.52], "percentile_thresholds": [0.09]}}'

mlflow.log_dict(ACCURACY_TABLE, 'mlflow_accuracy_table.json')
```

* Metrics don't render as an accuracy table in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

### Log a confusion matrix

__SDK v1__

```python
CONF_MATRIX = '{"schema_type": "confusion_matrix", "schema_version": "v1", "data": {"class_labels": ' + \
    '["0", "1", "2", "3"], "matrix": [[3, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0], [0, 0, 0, 1]]}}'

azureml_run.log_confusion_matrix('v1_confusion_matrix', json.loads(CONF_MATRIX))
```

__SDK v2 with MLflow__

```python
CONF_MATRIX = '{"schema_type": "confusion_matrix", "schema_version": "v1", "data": {"class_labels": ' + \
    '["0", "1", "2", "3"], "matrix": [[3, 0, 1, 0], [0, 1, 0, 1], [0, 0, 1, 0], [0, 0, 0, 1]]}}'

mlflow.log_dict(CONF_MATRIX, 'mlflow_confusion_matrix.json')
```

* Metrics don't render as a confusion matrix in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

### Log predictions

__SDK v1__

```python
PREDICTIONS = '{"schema_type": "predictions", "schema_version": "v1", "data": {"bin_averages": [0.25,' + \
    ' 0.75], "bin_errors": [0.013, 0.042], "bin_counts": [56, 34], "bin_edges": [0.0, 0.5, 1.0]}}'

azureml_run.log_predictions('test_predictions', json.loads(PREDICTIONS))
```

__SDK v2 with MLflow__

```python
PREDICTIONS = '{"schema_type": "predictions", "schema_version": "v1", "data": {"bin_averages": [0.25,' + \
    ' 0.75], "bin_errors": [0.013, 0.042], "bin_counts": [56, 34], "bin_edges": [0.0, 0.5, 1.0]}}'

mlflow.log_dict(PREDICTIONS, 'mlflow_predictions.json')
```

* Metrics don't render as a confusion matrix in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

### Log residuals

__SDK v1__

```python
RESIDUALS = '{"schema_type": "residuals", "schema_version": "v1", "data": {"bin_edges": [100, 200, 300], ' + \
'"bin_counts": [0.88, 20, 30, 50.99]}}'

azureml_run.log_residuals('test_residuals', json.loads(RESIDUALS))
```

__SDK v2 with MLflow__

```python
RESIDUALS = '{"schema_type": "residuals", "schema_version": "v1", "data": {"bin_edges": [100, 200, 300], ' + \
'"bin_counts": [0.88, 20, 30, 50.99]}}'

mlflow.log_dict(RESIDUALS, 'mlflow_residuals.json')
```

* Metrics don't render as a confusion matrix in Azure Machine Learning studio.
* Logged as an _artifact_, not as a metric.
* The `mlflow.log_dict` method is _experimental_.

## View run info and data

You can access run information using the MLflow run object's `data` and `info` properties. For more information, see [mlflow.entities.Run](https://mlflow.org/docs/latest/python_api/mlflow.entities.html#mlflow.entities.Run) reference.

The following example shows how to retrieve a finished run:

```python
from mlflow.tracking import MlflowClient

# Use MlFlow to retrieve the run that was just completed
client = MlflowClient()
finished_mlflow_run = MlflowClient().get_run(mlflow_run.info.run_id)
```

The following example shows how to view the `metrics`, `tags`, and `params`:

```python
metrics = finished_mlflow_run.data.metrics
tags = finished_mlflow_run.data.tags
params = finished_mlflow_run.data.params
```

> [!NOTE]
> The `metrics` will only have the most recently logged value for a given metric. For example, if you log in order a value of `1`, then `2`, `3`, and finally `4` to a metric named `sample_metric`, only `4` will be present in the `metrics` dictionary. To get all metrics logged for a specific named metric, use [MlFlowClient.get_metric_history](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.get_metric_history):
>
> ```python
> with mlflow.start_run() as multiple_metrics_run:
>     mlflow.log_metric("sample_metric", 1)
>     mlflow.log_metric("sample_metric", 2)
>     mlflow.log_metric("sample_metric", 3)
>     mlflow.log_metric("sample_metric", 4)
> 
> print(client.get_run(multiple_metrics_run.info.run_id).data.metrics)
> print(client.get_metric_history(multiple_metrics_run.info.run_id, "sample_metric"))
> ```
> 
> For more information, see the [MlFlowClient](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient) reference.

The `info` field provides general information about the run, such as start time, run ID, experiment ID, etc.:

```python
run_start_time = finished_mlflow_run.info.start_time
run_experiment_id = finished_mlflow_run.info.experiment_id
run_id = finished_mlflow_run.info.run_id
```

## View run artifacts

To view the artifacts of a run, use [MlFlowClient.list_artifacts](https://mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.list_artifacts):

```python
client.list_artifacts(finished_mlflow_run.info.run_id)
```

To download an artifact, use [MlFlowClient.download_artifacts](https://www.mlflow.org/docs/latest/python_api/mlflow.tracking.html#mlflow.tracking.MlflowClient.download_artifacts):

```python
client.download_artifacts(finished_mlflow_run.info.run_id, "Azure.png")
```
## Next steps

* [Track ML experiments and models with MLflow](how-to-use-mlflow-cli-runs.md)
* [Log and view metrics](how-to-log-view-metrics.md)
