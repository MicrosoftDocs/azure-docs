---
title: Troubleshooting batch endpoints (preview)
titleSuffix: Azure Machine Learning
description: Tips to help you succeed with batch endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting
ms.custom: troubleshooting, devplatv2
ms.reviewer: laobri
ms.author: tracych
author: tracych
ms.date: 05/05/2021
#Customer intent: As an ML Deployment Pro, I want to figure out why my batch endpoint doesn't run so that I can fix it.

---
# Troubleshooting batch endpoints (preview)

Learn how to troubleshoot and solve, or work around, common errors you may come across when using [batch endpoints](how-to-use-batch-endpoint.md) (preview) for batch scoring.

 [!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

The following table contains common problems and solutions you may see during batch endpoint development and consumption.

| Problem | Possible solution |
|--|--|
| Code configuration or Environment is missing. | Ensure you provide the scoring script and an environment definition if you're using a non-MLflow model. No-code deployment is supported for the MLflow model only. For more, see [Track ML models with MLflow and Azure Machine Learning](how-to-use-mlflow.md)|
| Failure to update model, code, environment, and compute for an existing batch endpoint. | Create a new batch endpoint with a new name. Updating these assets for an existing batch endpoint isn't yet supported. |
| The resource wasn't found. | Ensure you use `--type batch` in your CLI command. If this argument isn't specified, the default `online` type is used.|
| Unsupported input data. | Batch endpoint accepts input data in three forms: 1) registered data 2) data in the cloud 3) data in local. Ensure you're using the right format. For more, see [Use batch endpoints (preview) for batch scoring](how-to-use-batch-endpoint.md)|
| The provided endpoint name exists or is being deleted. | Create a new batch endpoint with a new name. The command `endpoint delete` marks the endpoint for deletion. The same name cannot be reused to create a new endpoint in the same region. |
| Output already exists. | If you configure your own output location, ensure you provide a new output for each endpoint invocation. |

##  Scoring script requirements

If you're using a non-MLflow model, you'll need to provide a scoring script. The scoring script must contain two functions:

- `init()`: Use this function for any costly or common preparation for later inference. For example, use it to load the model into a global object. This function will be called once at the beginning of the process.
-  `run(mini_batch)`: This function will run for each `mini_batch` instance.
    -  `mini_batch`: The `mini_batch` value is a list of file paths.
    -  `response`: The `run()` method should return a pandas DataFrame or an array. These returned elements are appended to the common output file. Each returned output element indicates one successful run of an input element in the input mini-batch. Make sure that enough data is included in the run result to map a single input to the run output result. Run output will be written in the output file but isn't guaranteed to be in order, so you should use some key in the output to map it to the correct input.

:::code language="python" source="~/azureml-examples-cli-preview/cli/endpoints/batch/mnist/code/digit_identification.py" :::

## Understanding logs of a batch scoring job

### Get logs

After you invoke a batch endpoint using the Azure CLI or REST, the batch scoring job will run asynchronously. There are two options to get the logs for a batch scoring job.

Option 1: Stream logs to local console

You can run the following command to stream system-generated logs to your console. Only logs in the `azureml-logs` folder will be streamed.

```bash
az ml job stream -name <job_name>
```

Option 2: View logs in studio 

To get the link to the run in studio, run: 

```azurecli
az ml job show --name <job_name> --query interaction_endpoints.Studio.endpoint -o tsv
```

1. Open the job in studio using the value returned by the above command. 
1. Choose **batchscoring**
1. Open the **Outputs + logs** tab 
1. Choose the log(s) you wish to review

### Understand log structure

There are two top-level log folders, `azureml-logs` and `logs`. 

The file `~/azureml-logs/70_driver_log.txt` contains information from the controller that launches the scoring script.  

Because of the distributed nature of batch scoring jobs, there are logs from several different sources. However, two combined files are created that provide high-level information: 

- `~/logs/job_progress_overview.txt`: This file provides high-level information about the number of mini-batches (also known as tasks) created so far and the number of mini-batches processed so far. As the mini-batches end, the log records the results of the job. If the job failed, it will show the error message and where to start the troubleshooting.

- `~/logs/sys/master_role.txt`: This file provides the principal node (also known as the orchestrator) view of the running job. This log provides information on task creation, progress monitoring, the run result.

For a concise understanding of errors in your script there is:

- `~/logs/user/error.txt`: This file will try to summarize the errors in your script.

For more information on errors in your script, there is:

- `~/logs/user/error/`: This file contains full stack traces of exceptions thrown while loading and running the entry script.

When you need a full understanding of how each node executed the score script, look at the individual process logs for each node. The process logs can be found in the `sys/node` folder, grouped by worker nodes:

- `~/logs/sys/node/<ip_address>/<process_name>.txt`: This file provides detailed info about each mini-batch as it's picked up or completed by a worker. For each mini-batch, this file includes:

    - The IP address and the PID of the worker process. 
    - The total number of items, the number of successfully processed items, and the number of failed items.
    - The start time, duration, process time, and run method time.

You can also view the results of periodic checks of the resource usage for each node. The log files and setup files are in this folder:

- `~/logs/perf`: Set `--resource_monitor_interval` to change the checking interval in seconds. The default interval is `600`, which is approximately 10 minutes. To stop the monitoring, set the value to `0`. Each `<ip_address>` folder includes:

    - `os/`: Information about all running processes in the node. One check runs an operating system command and saves the result to a file. On Linux, the command is `ps`.
        - `%Y%m%d%H`: The sub folder name is the time to hour.
            - `processes_%M`: The file ends with the minute of the checking time.
    - `node_disk_usage.csv`: Detailed disk usage of the node.
    - `node_resource_usage.csv`: Resource usage overview of the node.
    - `processes_resource_usage.csv`: Resource usage overview of each process.

### How to log in scoring script

You can use Python logging in your scoring script. Logs are stored in `logs/user/stdout/<node_id>/processNNN.stdout.txt`. 

```python
import argparse
import logging

# Get logging_level
arg_parser = argparse.ArgumentParser(description="Argument parser.")
arg_parser.add_argument("--logging_level", type=str, help="logging level")
args, unknown_args = arg_parser.parse_known_args()
print(args.logging_level)

# Initialize python logger
logger = logging.getLogger(__name__)
logger.setLevel(args.logging_level.upper())
logger.info("Info log statement")
logger.debug("Debug log statement")
```