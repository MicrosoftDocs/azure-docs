---
title: Troubleshoot batch endpoints
titleSuffix: Azure Machine Learning
description: Learn how to troubleshoot and diagnose errors with batch endpoints jobs, including examining logs for scoring jobs and solution steps for common issues.
services: machine-learning
ms.service: azure-machine-learning
ms.subservice: inferencing
ms.topic: troubleshooting-general
author: msakande
ms.author: mopeakande
ms.date: 07/29/2024
ms.reviewer: cacrest
ms.custom: devplatv2

#customer intent: As a developer, I want to troubleshoot Azure Machine Learning batch endpoints jobs, so I can examine logs, diagnose errors, and resolve issues.
---

# Troubleshoot batch endpoints

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

This article provides guidance for troubleshooting common errors when using [batch endpoints](how-to-use-batch-model-deployments.md) for batch scoring in Azure Machine Learning. The following sections describe how to analyze batch scoring logs to identify possible issues and unsupported scenarios. You can also review recommended solutions to resolve common errors.

## Get logs for batch scoring jobs

After you invoke a batch endpoint by using the Azure CLI or the REST API, the batch scoring job runs asynchronously. There are two options to get the logs for a batch scoring job:

- **Option 1**: Stream job logs to a local console. Only logs in the _azureml-logs_ folder are streamed.

   Run the following command to stream system-generated logs to your console. Replace the `<job_name>` parameter with the name of your batch scoring job:

   ```azurecli
   az ml job stream --name <job_name>
   ```

- **Option 2**: View job logs in Azure Machine Learning studio.

   Run the following command to get the job link to use in the studio. Replace the `<job_name>` parameter with the name of your batch scoring job:

   ```azurecli
   az ml job show --name <job_name> --query services.Studio.endpoint -o tsv
   ```

   1. Open the job link in the studio.
   
   1. In the graph of the job, select the **batchscoring** step.

   1. On the **Outputs + logs** tab, select one or more logs to review.

## Review log files

Azure Machine Learning provides several types of log files and other data files that you can use to help troubleshoot your batch scoring job. 

The two top-level folders for batch scoring logs are _azureml-logs_ and _logs_. Information from the controller that launches the scoring script is stored in the  _~/azureml-logs/70\_driver\_log.txt_ file.

### Examine high-level information

The distributed nature of batch scoring jobs results in logs from different sources, but two combined files provide high-level information:

| File | Description |
| --- | --- |
| **~/logs/job_progress_overview.txt** | Provides high-level information about the current number of mini-batches (also known as _tasks_) created and the current number of processed mini-batches. As processing for mini-batches comes to an end, the log records the results of the job. If the job fails, the log shows the error message and where to start the troubleshooting. |
| **~/logs/sys/master_role.txt** | Provides the principal node (also known as the _orchestrator_) view of the running job. This log includes information about the task creation, progress monitoring, and the job result. |

### Examine stack trace data for errors

Other files provide information about possible errors in your script:

| File | Description |
| --- | --- |
| **~/logs/user/error.txt** | Provides a summary of errors in your script. |
| **~/logs/user/error/\*** | Provides the full stack traces of exceptions thrown while loading and running the entry script. |

### Examine process logs per node

For a complete understanding of how each node executes your score script, examine the individual process logs for each node. The process logs are stored in the _~/logs/sys/node_ folder and grouped by worker nodes.

The folder contains an _\<ip\_address>/_ subfolder that contains a _\<process\_name>.txt_ file with detailed info about each mini-batch. The folder contents updates when a worker selects or completes the mini-batch. For each mini-batch, the log file includes:

- The IP address and the process ID (PID) of the worker process. 
- The total number of items, the number of successfully processed items, and the number of failed items.
- The start time, duration, process time, and run method time.

### Examine periodic checks per node

You can also view the results of periodic checks of the resource usage for each node. The log files and setup files are stored in the _~/logs/perf_ folder.

Use the `--resource_monitor_interval` parameter to change the check interval in seconds:

- **Use default**: The default interval is 600 seconds (approximately 10 minutes).
- **Stop checks**: Set the value to 0 to stop running checks on the node.

The folder contains an _\<ip\_address>/_ subfolder about each mini-batch. The folder contents updates when a worker selects or completes the mini-batch. For each mini-batch, the folder includes the following items:

| File or Folder | Description |
| --- | --- |
| **os/** | Stores information about all running processes in the node. One check runs an operating system command and saves the result to a file. On Linux, the command is `ps`. The folder contains the following items: <br> - **%Y%m%d%H**: Subfolder that contains one or more process check files. The subfolder name is the creation date and time of the check (Year, Month, Day, Hour). <br> **processes_%M**: File within the subfolder. The file shows details about the process check. The file name ends with the check time (Minute) relative to the check creation time. |
| **node_disk_usage.csv** | Shows the detailed disk usage of the node. |
| **node_resource_usage.csv** | Supplies the resource usage overview of the node. |
| **processes_resource_usage.csv** | Provides a resource usage overview of each process. |

## Add logging to scoring script

You can use Python logging in your scoring script. These logs are stored in the _logs/user/stdout/\<node\_id>/process\<number>.stdout.txt_ file. 

The following code demonstrates how to add logging in your script:

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

## Resolve common errors

The following sections describe common errors that can occur during batch endpoint development and consumption, and steps for resolution.

### No module named azureml

Azure Machine Learning batch deployment requires the **azureml-core** package in the installation.

**Message logged**: "No module named `azureml`."

**Reason**: The `azureml-core` package appears to be missing in the installation.

**Solution**: Add the `azureml-core` package to your conda dependencies file.

### No output in predictions file

Batch deployment expects an empty folder to store the _predictions.csv_ file. When the deployment encounters an existing file in the specified folder, the process doesn't replace the file contents with the new output or create a new file with the results.

**Message logged**: No specific logged message.

**Reason**: Batch deployment can't overwrite an existing _predictions.csv_ file.

**Solution**: If the process specifies an output folder location for the predictions, ensure the folder doesn't contain an existing _predictions.csv_ file.

### Batch process times out

Batch deployment uses a `timeout` value to determine how long deployment should wait for each batch process to complete. When execution of a batch exceeds the specified timeout, batch deployment aborts the process. 

Aborted processes are retried up to the maximum number of attempts specified in the `max_retries` value. If the timeout error occurs on each retry attempt, the deployment job fails. 

You can configure the `timeout` and `max_retries` properties for each deployment with the `retry_settings` parameter.

**Message logged**: "No progress update in [number] seconds. No progress update in this check. Wait [number] seconds since last update."

**Reason**: Batch execution exceeds the specified timeout and maximum number of retry attempts. This action corresponds to failure of the `run()` function in the entry script.

**Solution**: Increase the `timeout` value for your deployment. By default, the `timeout` value is 30 and the `max_retries` value is 3. To determine a suitable `timeout` value for your deployment, consider the number of files to process on each batch and the file sizes. You can decrease the number of files to process and generate mini-batches of smaller size. This approach results in faster execution. 

### Exception in ScriptExecution.StreamAccess.Authentication

For batch deployment to succeed, the managed identity for the compute cluster must have permission to mount the data asset storage. When the managed identity has insufficient permissions, the script causes an exception. This failure can also cause the [data asset storage to not mount](#dataset-initialization-failed-cant-mount-dataset).

**Message logged**: "ScriptExecutionException was caused by StreamAccessException. StreamAccessException was caused by AuthenticationException."

**Reason**: The compute cluster where the deployment is running can't mount the storage where the data asset is located. The managed identity of the compute doesn't have permissions to perform the mount.

**Solution**: Ensure the managed identity associated with the compute cluster where your deployment is running has at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only Azure Storage account owners can [change the access level in the Azure portal](../storage/blobs/assign-azure-role-data-access.md).

### Dataset initialization failed, can't mount dataset

The batch deployment process requires mounted storage for the data asset. When the storage doesn't mount, the dataset can't be initialized.

**Message logged**: "Dataset initialization failed: UserErrorException: Message: Can't mount Dataset(ID='xxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', name='None', version=None). Source of the dataset is either not accessible or doesn't contain any data."

**Reason**: The compute cluster where the deployment is running can't mount the storage where the data asset is located. The managed identity of the compute doesn't have permissions to perform the mount.

**Solution**: Ensure the managed identity associated with the compute cluster where your deployment is running has at least [Storage Blob Data Reader](../role-based-access-control/built-in-roles.md#storage-blob-data-reader) access to the storage account. Only Azure Storage account owners can [change the access level in the Azure portal](../storage/blobs/assign-azure-role-data-access.md).

### dataset_param doesn't have specified value or default value

During batch deployment, the data set node references the `dataset_param` parameter. For the deployment to proceed, the parameter must have an assigned value or a specified default value.

**Message logged**: "Data set node [code] references parameter `dataset_param`, which doesn't have a specified value or a default value."

**Reason**: The input data asset provided to the batch endpoint isn't supported.

**Solution**: Ensure the deployment script provides a data input supported for batch endpoints.

### User program fails, run fails

During script execution for batch deployment, if the `init()` or `run()` function encounters an error, the user program or run can fail. You can review the error details in a generated log file.

**Message logged**: "User program failed with Exception: Run failed. Please check logs for details. You can check logs/readme.txt for the layout of logs."

**Reason**: The `init()` or `run()` function produces an error during execution of the scoring script.

**Solution**: Follow these steps to locate details about the function failures:

   1. In Azure Machine Learning studio, go to the failed batch deployment job run, and select the **Outputs + logs** tab.
   
   1. Open the file **logs** > **user** > **error** > **<node_identifier>** > **process\<number>.txt**.
   
   1. Locate the error message generated by the `init()` or `run()` function.

### ValueError: No objects to concatenate

For batch deployment to succeed, each file in a mini-batch must be valid and implement a supported file type. Keep in mind that MLflow models support only a subset of file types. For more information, see [Considerations when deploying to batch inference](how-to-mlflow-batch.md#review-considerations-for-batch-inference).

**Message logged**: "ValueError: No objects to concatenate."

**Reason**: All files in the generated mini-batch are either corrupted or unsupported file types. 

**Solution**: Follow these steps to locate details about the failed files:

   1. In Azure Machine Learning studio, go to the failed batch deployment job run, and select the **Outputs + logs** tab.
   
   1. Open the file **logs** > **user** > **stdout** > **<node_identifier>** > **process\<number>.txt**.
   
   1. Look for entries that describe the file input failure, such as "ERROR:azureml:Error processing input file."
   
   If the file type isn't supported, review the list of supported files. You might need to change the file type of the input data, or customize the deployment by providing a scoring script. For more information, see [Using MLflow models with a scoring script](how-to-mlflow-batch.md#customize-model-deployment-with-scoring-script).

### No succeeded mini-batch

The batch deployment process requires batch endpoints to provide data in the format expected by the `run()` function. If input files are corrupted files or incompatible with the model signature, the `run()` function fails to return a successful mini-batch.

**Message logged**: "No succeeded mini batch item returned from run(). Please check 'response: run()' in `https://aka.ms/batch-inference-documentation`."

**Reason**: The batch endpoint failed to provide data in the expected format to the `run()` function. This issue can result from corrupted files being read or incompatibility of the input data with the signature of the model (MLflow).

**Solution**: Follow these steps to locate details about the failed mini-batch:

   1. In Azure Machine Learning studio, go to the failed batch deployment job run, and select the **Outputs + logs** tab.
   
   1. Open the file **logs** > **user** > **stdout** > **<node_identifier>** > **process\<number>.txt**.
   
   1. Look for entries that describe the input file failure for the mini-batch, such as "Error processing input file." The details should describe why the input file can't be correctly read.

### Audience or service not allowed

Microsoft Entra tokens are issued for specific actions that identify the allowed users (audience), service, and resources. The authentication token for the Batch Endpoint REST API must set the `resource` parameter to `https://ml.azure.com`.

**Message logged**: No specific logged message.

**Reason**: You attempt to invoke the REST API for the batch endpoint and deployment with a token issued for a different audience or service.

**Solution**: Follow these steps to resolve this authentication issue:

   1. When you generate an authentication token for the Batch Endpoint REST API, set the `resource` parameter to `https://ml.azure.com`.
   
      Notice that this resource is different from the resource you use to manage the endpoint from the REST API. All Azure resources (including batch endpoints) use the resource `https://management.azure.com` for management.
      
   1. When you invoke the REST API for a batch endpoint and deployment, be careful to use the token issued for the Batch Endpoint REST API and not a token issued for a different audience or service. In each case, confirm you're using the correct resource URI.

   If you want to use the management API and the job invocation API at the same time, you need two tokens. For more information, see [Authentication on batch endpoints (REST)](how-to-authenticate-batch-endpoint.md?tabs=rest).

### No valid deployments to route

For batch deployment to succeed, the batch endpoint must have at least one valid deployment route. The standard method is to define the default batch deployment by using the `defaults.deployment_name` parameter.

**Message logged**: "No valid deployments to route to. Please check that the endpoint has at least one deployment with positive weight values or use a deployment specific header to route."

**Reason**: The default batch deployment isn't set correctly.

**Solution**: Use one of the following methods to resolve the routing issue:

   - Confirm the `defaults.deployment_name` parameter defines the correct default batch deployment. For more information, see [Update the default batch deployment](how-to-use-batch-model-deployments.md?tabs=cli&#update-the-default-batch-deployment).
   
   - Define the route with a deployment-specific header.

## Limitations and unsupported scenarios

When you design machine learning deployment solutions that rely on batch endpoints, keep in mind that some configurations and scenarios aren't supported. The following sections identify unsupported workspaces and compute resources, and invalid types for input files.

### Unsupported workspace configurations

The following workspace configurations aren't supported for batch deployment:

- Workspaces configured with an Azure Container Registries with Quarantine feature enabled
- Workspaces with customer-managed keys

### Unsupported compute configurations

The following compute configurations aren't supported for batch deployment:

- Azure ARC Kubernetes clusters
- Granular resource request (memory, vCPU, GPU) for Azure Kubernetes clusters (only instance count can be requested)

### Unsupported input file types

The following input file types aren't supported for batch deployment:

- Tabular datasets (V1)
- Folders and File datasets (V1)
- MLtable (V2)

## Related content

- [Author scoring scripts for batch deployments](how-to-batch-scoring-script.md)
- [Authorization on batch endpoints](how-to-authenticate-batch-endpoint.md)
- [Network isolation in batch endpoints](how-to-secure-batch-endpoint.md)
