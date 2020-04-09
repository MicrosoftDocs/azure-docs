---
title: Debug and troubleshoot ParallelRunStep
titleSuffix: Azure Machine Learning
description: Debug and troubleshoot ParallelRunStep in machine learning pipelines in the Azure Machine Learning SDK for Python. Learn common pitfalls for developing with pipelines, and tips to help you debug your scripts before and during remote execution.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: trbye, jmartens, larryfr, vaidyas
ms.author: trmccorm
author: tmccrmck
ms.date: 01/15/2020
---

# Debug and troubleshoot ParallelRunStep
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to debug and troubleshoot the [ParallelRunStep](https://docs.microsoft.com/python/api/azureml-contrib-pipeline-steps/azureml.contrib.pipeline.steps.parallel_run_step.parallelrunstep?view=azure-ml-py) class from the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

## Testing scripts locally

See the [Testing scripts locally section](how-to-debug-pipelines.md#testing-scripts-locally) for machine learning pipelines. Your ParallelRunStep runs as a step in ML pipelines so the same answer applies to both.

## Debugging scripts from remote context

The transition from debugging a scoring script locally to debugging a scoring script in an actual pipeline can be a difficult leap. For information on finding your logs in the portal, the [machine learning pipelines section on debugging scripts from a remote context](how-to-debug-pipelines.md#debugging-scripts-from-remote-context). The information in that section also applies to a parallel step run.

For example, the log file `70_driver_log.txt` contains information from the controller that launches parallel run step code.

Because of the distributed nature of parallel run jobs, there are logs from several different sources. However, two consolidated files are created that provide high-level information:

- `~/logs/overview.txt`: This file provides a high-level info about the number of mini-batches (also known as tasks) created so far and number of mini-batches processed so far. At this end, it shows the result of the job. If the job failed, it will show the error message and where to start the troubleshooting.

- `~/logs/sys/master.txt`: This file provides the master node (also known as the orchestrator) view of the running job. Includes task creation, progress monitoring, the run result.

Logs generated from entry script using EntryScript.logger and print statements will be found in following files:

- `~/logs/user/<ip_address>/Process-*.txt`: This file contains logs written from entry_script using EntryScript.logger. It also contains print statement (stdout) from entry_script.

When you need a full understanding of how each node executed the score script, look at the individual process logs for each node. The process logs can be found in the `sys/worker` folder, grouped by worker nodes:

- `~/logs/sys/worker/<ip_address>/Process-*.txt`: This file provides detailed info about each mini-batch as it is picked up or completed by a worker. For each mini-batch, this file includes:

    - The IP address and the PID of the worker process. 
    - The total number of items, successfully processed items count, and failed item count.
    - The start time, duration, process time and run method time.

You can also find information on the resource usage of the processes for each worker. This information is in CSV format and is located at `~/logs/sys/perf/<ip_address>/`. For a single node, job files will be available under `~logs/sys/perf`. For example, when checking for resource utilization, look at the following files:

- `Process-*.csv`: Per worker process resource usage. 
- `sys.csv`: Per node log.

### How do I log from my user script from a remote context?
You can get a logger from EntryScript as shown in below sample code to make the logs show up in **logs/user** folder in the portal.

**A sample entry script using the logger:**
```python
from entry_script import EntryScript

def init():
    """ Initialize the node."""
    entry_script = EntryScript()
    logger = entry_script.logger
    logger.debug("This will show up in files under logs/user on the Azure portal.")


def run(mini_batch):
    """ Accept and return the list back."""
    # This class is in singleton pattern and will return same instance as the one in init()
    entry_script = EntryScript()
    logger = entry_script.logger
    logger.debug(f"{__file__}: {mini_batch}.")
    ...

    return mini_batch
```

### How could I pass a side input such as, a file or file(s) containing a lookup table, to all my workers?

Construct a [Dataset](https://docs.microsoft.com/python/api/azureml-core/azureml.core.dataset.dataset?view=azure-ml-py) object containing the side input and register with your workspace. After that you can access it in your inference script (for example, in your init() method) as follows:

```python
from azureml.core.run import Run
from azureml.core.dataset import Dataset

ws = Run.get_context().experiment.workspace
lookup_ds = Dataset.get_by_name(ws, "<registered-name>")
lookup_ds.download(target_path='.', overwrite=True)
```

## Next steps

* See the SDK reference for help with the [azureml-contrib-pipeline-step](https://docs.microsoft.com/python/api/azureml-contrib-pipeline-steps/azureml.contrib.pipeline.steps?view=azure-ml-py) package and the [documentation](https://docs.microsoft.com/python/api/azureml-contrib-pipeline-steps/azureml.contrib.pipeline.steps.parallelrunstep?view=azure-ml-py) for ParallelRunStep class.

* Follow the [advanced tutorial](tutorial-pipeline-batch-scoring-classification.md) on using pipelines with parallel run step.
