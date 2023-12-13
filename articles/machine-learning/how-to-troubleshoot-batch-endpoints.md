---
title: "Troubleshooting batch endpoints"
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and diagnostic errors with batch endpoints jobs
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
author: santiagxf
ms.author: fasantia
ms.date: 10/10/2022
ms.reviewer: mopeakande 
ms.custom: devplatv2
---

# Troubleshooting batch endpoints

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

Learn how to troubleshoot and solve, or work around, common errors you may come across when using [batch endpoints](how-to-use-batch-endpoint.md) for batch scoring. In this article you'll learn:

> [!div class="checklist"]
> * How [logs of a batch scoring job are organized](#understanding-logs-of-a-batch-scoring-job).
> * How to [solve common errors](#common-issues).
> * Identify [not supported scenarios in batch endpoints](#limitations-and-not-supported-scenarios) and their limitations.

## Understanding logs of a batch scoring job

### Get logs

After you invoke a batch endpoint using the Azure CLI or REST, the batch scoring job will run asynchronously. There are two options to get the logs for a batch scoring job.

Option 1: Stream logs to local console

You can run the following command to stream system-generated logs to your console. Only logs in the `azureml-logs` folder will be streamed.

```azurecli
az ml job stream --name <job_name>
```

Option 2: View logs in studio 

To get the link to the run in studio, run: 

```azurecli
az ml job show --name <job_name> --query interaction_endpoints.Studio.endpoint -o tsv
```

1. Open the job in studio using the value returned by the above command. 
1. Choose __batchscoring__
1. Open the __Outputs + logs__ tab 
1. Choose the log(s) you wish to review

### Understand log structure

There are two top-level log folders, `azureml-logs` and `logs`. 

The file `~/azureml-logs/70_driver_log.txt` contains information from the controller that launches the scoring script.  

Because of the distributed nature of batch scoring jobs, there are logs from several different sources. However, two combined files are created that provide high-level information: 

- `~/logs/job_progress_overview.txt`: This file provides high-level information about the number of mini-batches (also known as tasks) created so far and the number of mini-batches processed so far. As the mini-batches end, the log records the results of the job. If the job failed, it shows the error message and where to start the troubleshooting.

- `~/logs/sys/master_role.txt`: This file provides the principal node (also known as the orchestrator) view of the running job. This log provides information on task creation, progress monitoring, the job result.

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

# Initialize Python logger
logger = logging.getLogger(__name__)
logger.setLevel(args.logging_level.upper())
logger.info("Info log statement")
logger.debug("Debug log statement")
```

## Common issues

The following section contains common problems and solutions you may see during batch endpoint development and consumption.

### No module named 'azureml'

__Message logged__: `No module named 'azureml'`.

__Reason__: Azure Machine Learning Batch Deployments require the package `azureml-core` to be installed.

__Solution__: Add `azureml-core` to your conda dependencies file.

### Output already exists

__Reason__: Azure Machine Learning Batch Deployment can't overwrite the `predictions.csv` file generated by the output.

__Solution__: If you're indicated an output location for the predictions, ensure the path leads to a nonexisting file.

### The run() function in the entry script had timeout for [number] times

__Message logged__: `No progress update in [number] seconds. No progress update in this check. Wait [number] seconds since last update.`

__Reason__: Batch Deployments can be configured with a `timeout` value that indicates the amount of time the deployment shall wait for a single batch to be processed. If the execution of the batch takes more than such value, the task is aborted. Tasks that are aborted can be retried up to a maximum of times that can also be configured. If the `timeout` occurs on each retry, then the deployment job fails. These properties can be configured for each deployment.

__Solution__: Increase the `timemout` value of the deployment by updating the deployment. These properties are configured in the parameter `retry_settings`. By default, a `timeout=30` and `retries=3` is configured. When deciding the value of the `timeout`, take into consideration the number of files being processed on each batch and the size of each of those files. You can also decrease them to account for more mini-batches of smaller size and hence quicker to execute. 


### ScriptExecution.StreamAccess.Authentication

__Message logged__: ScriptExecutionException was caused by StreamAccessException. StreamAccessException was caused by AuthenticationException.

__Reason__: The compute cluster where the deployment is running can't mount the storage where the data asset is located. The managed identity of the compute don't have permissions to perform the mount.

__Solutions__: Ensure the identity associated with the compute cluster where your deployment is running has at least has at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only storage account owners can [change your access level via the Azure portal](../storage/blobs/assign-azure-role-data-access.md).

### Dataset initialization failed

__Message logged__: Dataset initialization failed: UserErrorException: Message: Cannot mount Dataset(id='xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', name='None', version=None). Source of the dataset is either not accessible or does not contain any data.

__Reason__: The compute cluster where the deployment is running can't mount the storage where the data asset is located. The managed identity of the compute don't have permissions to perform the mount.

__Solutions__: Ensure the identity associated with the compute cluster where your deployment is running has at least has at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only storage account owners can [change your access level via the Azure portal](../storage/blobs/assign-azure-role-data-access.md).

### Data set node [code] references parameter dataset_param which doesn't have a specified value or a default value

__Message logged__: Data set node [code] references parameter dataset_param which doesn't have a specified value or a default value.

__Reason__: The input data asset provided to the batch endpoint isn't supported.

__Solution__: Ensure you'are providing a data input that is supported for batch endpoints.

### User program failed with Exception: Run failed, please check logs for details

__Message logged__: User program failed with Exception: Run failed, please check logs for details. You can check logs/readme.txt for the layout of logs.

__Reason__: There was an error while running the `init()` or `run()` function of the scoring script.

__Solution__: Go to __Outputs + Logs__ and open the file at `logs > user > error > 10.0.0.X > process000.txt`. You see the error message generated by the `init()` or `run()` method.

### ValueError: No objects to concatenate

__Message logged__: ValueError: No objects to concatenate.

__Reason__: All the files in the generated mini-batch are either corrupted or unsupported file types. Remember that MLflow models support a subset of file types as documented at [Considerations when deploying to batch inference](how-to-mlflow-batch.md?#considerations-when-deploying-to-batch-inference).

__Solution__: Go to the file `logs/usr/stdout/<process-number>/process000.stdout.txt` and look for entries like `ERROR:azureml:Error processing input file`. If the file type isn't supported, please review the list of supported files. You may need to change the file type of the input data or customize the deployment by providing a scoring script as indicated at [Using MLflow models with a scoring script](how-to-mlflow-batch.md?#customizing-mlflow-models-deployments-with-a-scoring-script).

### There is no succeeded mini batch item returned from run()

__Message logged__: There is no succeeded mini batch item returned from run(). Please check 'response: run()' in https://aka.ms/batch-inference-documentation.

__Reason__: The batch endpoint failed to provide data in the expected format to the `run()` method. This may be due to corrupted files being read or incompatibility of the input data with the signature of the model (MLflow).

__Solution__: To understand what may be happening, go to __Outputs + Logs__ and open the file at `logs > user > stdout > 10.0.0.X > process000.stdout.txt`. Look for error entries like `Error processing input file`. You should find there details about why the input file can't be correctly read.

### Audiences in JWT are not allowed

__Context__: When invoking a batch endpoint using its REST APIs.

__Reason__: The access token used to invoke the REST API for the endpoint/deployment is indicating a token that is issued for a different audience/service. Microsoft Entra tokens are issued for specific actions.

__Solution__: When generating an authentication token to be used with the Batch Endpoint REST API, ensure the `resource` parameter is set to `https://ml.azure.com`. Please notice that this resource is different from the resource you need to indicate to manage the endpoint using the REST API. All Azure resources (including batch endpoints) use the resource `https://management.azure.com` for managing them. Ensure you use the right resource URI on each case. Notice that if you want to use the management API and the job invocation API at the same time, you'll need two tokens. For details see: [Authentication on batch endpoints (REST)](how-to-authenticate-batch-endpoint.md?tabs=rest).

## Limitations and not supported scenarios

When designing machine learning solutions that rely on batch endpoints, some configurations and scenarios may not be supported.

The following __workspace__ configurations are __not supported__:

* Workspaces configured with an Azure Container Registries with Quarantine feature enabled.
* Workspaces with customer-managed keys (CMK).

The following __compute__ configurations are __not supported__:

* Azure ARC Kubernetes clusters.
* Granular resource request (memory, vCPU, GPU) for Azure Kubernetes clusters. Only instance count can be requested.

The following __input types__ are __not supported__:

* Tabular datasets (V1).
* Folders and File datasets (V1).
* MLtable (V2).

## Next steps

* [Author scoring scripts for batch deployments](how-to-batch-scoring-script.md).
* [Authentication on batch endpoints](how-to-authenticate-batch-endpoint.md).
* [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md).
