---
title: Debug and troubleshoot ParallelRunStep
titleSuffix: Azure Machine Learning
description: Debug and troubleshoot machine learning pipelines in the Azure Machine Learning SDK for Python. Learn common pitfalls for developing with pipelines, and tips to help you debug your scripts before and during remote execution.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: ms.topic: conceptual
ms.reviewer: trbye, jmartens, larryfr, vaidyas
ms.author: trmccorm
author: trmccorm
ms.date: 11/21/2019
---

# Debug and troubleshoot using ParallelRun
[!INCLUDE [applies-to-skus](../../../includes/aml-applies-to-basic-enterprise-sku.md)]

In this article, you learn how to debug and troubleshoot the [ParallelRunStep](https://docs.microsoft.com/en-us/python/api/azureml-contrib-pipeline-steps/azureml.contrib.pipeline.steps.parallel_run_step.parallelrunstep?view=azure-ml-py) class from the [Azure Machine Learning SDK](https://docs.microsoft.com/python/api/overview/azure/ml/intro?view=azure-ml-py).

## Testing scripts locally

Please see the [Testing scripts locally section](how-to-debug-pipelines#testing-scripts-locally) for ML pipelines. Your ParallelRunStep runs as a step in ML pipelines so the same answer applies to both.

## Debugging scripts from remote context

The transition from debugging a scoring script locally to debugging a scoring script in an actual pipeline can be be a difficult leap. For finding your logs in the portal please read the [ML pipelines section on debugging scripts from a remote context](how-to-debug-pipelines#debugging-scripts-from-remote-context) because everything in that section will apply to a batch inference run.

For example, the log file `70_driver_log.txt` will also contains: 

* All printed statements during your script's execution
* The stack trace for the script 

Because of the distributed nature of running a Batch inference job, there will be logs from several different sources. To help with this process we've created two consolidated files which should help debug problems at a glance:

**~/logs/overview.txt**: This file provides a high-level info about the number of mini-batches (aka tasks) created so far and number of mini-batches processed so far. At this end, it shows the result of the job. If the job failed, it will show the error message and where to start the troubleshooting.

**~/logs/master.txt**: This file provides the master node (AKA the orchestrator) view of the running job. Includes task creation, progress monitoring, the run's result.

For times where you need a full understanding of how each node executed your score script, we recommend looking at the individual process logs for each node. In the `worker` folder we've given full access to each processes' logs, grouped by worker nodes. The logs will look like this:

**~/logs/worker/<ip_address>/Process-*.txt**: This provides much more detailed info about each mini-batch as it is picked up by a worker or completed by a worker. For each mini-batch, this includes:

- The IP address and the PID of the worker process 
- The total number of items as well as the number of successfully-processed items 
- The start and the end time in terms of wall clock times (start1 and end1) 
- The start and the end time in terms of processor time spent (start2 and end2) 

Additionally, we've supplied information pertaining to the resource usage of each workers' processes which can be found in CSV format in `~/logs/performance/<ip_address>/` folder for easy consumption. Our advice to check resource utilization is to:

- Check per worker process resource usage file named process_resource_monitor_<ip>_<pid>.csv 
- Check per node log at sys_resource_monitor_<ip>.csv

### How do I log from my user script from a remote context?
You can set up a logger with the below steps to make the logs show up in **logs/users** folder in the portal:
1. Save the first code section below into file entry_script_helper.py and put the file in same folder as your entry script. This class gets the path inside AmlCompute. For local test, you can change `get_working_dir()` to return a local folder.
2. Config a logger in your `init()` method and then use it. The second code section below is an example. 

**entry_script_helper.py:**
```python
"""
This module provides helper features for entry script.
This file should be in Python search paths or in the same folder as the entry script.
"""
import os
import socket
import logging
import time
from multiprocessing import current_process
from azureml.core import Run


class EntryScriptHelper:
    """ A helper to provide common features for entry script."""

    LOG_CONFIGED = False

    def get_logger(self, name="EntryScript"):
        """ Return a logger.
            The logger will write to the 'users' folder and show up in azure portal.
        """
        return logging.getLogger(name)

    def config(self, name="EntryScript", level="INFO"):
        """ Config a logger. This should be called in init() in score module.
            Config the logger one time if not configed.
            The logger will write to the 'users' folder and show up in azure portal.
        """
        logger = logging.getLogger(name)

        formatter = logging.Formatter(
            "%(asctime)s|%(name)s|%(levelname)s|%(process)d|%(thread)d|%(funcName)s()|%(message)s"
        )
        formatter.converter = time.gmtime

        logger.setLevel(level)

        handler = logging.FileHandler(self.get_log_file_path())
        handler.setLevel(level)
        handler.setFormatter(formatter)
        logger.addHandler(handler)

        return logger

    def get_log_file_path(self):
        """ Get the log file path for users.
            Each process has its own log file, so there is not race issue among multiple processes.
        """
        ip_address = socket.gethostbyname(socket.gethostname())
        log_dir = os.path.join(self.get_log_dir(), "user", ip_address)
        os.makedirs(log_dir, exist_ok=True)
        return os.path.join(log_dir, f"{current_process().name}.txt")

    def get_log_dir(self):
        """ Return the folder for logs.
            Files and folders in it will be uploaded and show up in run detail page in the azure portal.
        """
        log_dir = os.path.join(self.get_working_dir(), "logs")
        os.makedirs(log_dir, exist_ok=True)
        return log_dir

    def get_working_dir(self):
        """ Return the working directory."""
        return os.path.join(os.environ.get("AZ_BATCHAI_INPUT_AZUREML", ""), self.get_run().id)

    def get_temp_dir(self):
        """ Return local temp directory."""
        local_temp_dir = os.path.join(
            os.environ.get("AZ_BATCHAI_JOB_TEMP", ""), "azureml-bi", str(os.getpid())
        )
        os.makedirs(local_temp_dir, exist_ok=True)
        return local_temp_dir

    def get_run(self):
        """ Return the Run from the context."""
        return Run.get_context(allow_offline=False)

```

**A sample entry script using the logger:**
```python
"""
This is a sample scoring module.

This module provides a sample which passes the input back without any change.
"""
import os
import logging
from entry_script_helper import EntryScriptHelper

LOG_NAME = "score_file_list"


def init():
    """ Init """
    EntryScriptHelper().config(LOG_NAME)
    logger = logging.getLogger(LOG_NAME)
    output_folder = os.path.join(os.environ.get("AZ_BATCHAI_INPUT_AZUREML", ""), "temp/output")
    logger.info(f"{__file__}.output_folder:{output_folder}")
    logger.info("init()")
    os.makedirs(output_folder, exist_ok=True)


def run(mini_batch):
    """ Accept and return the list back."""
    logger = logging.getLogger(LOG_NAME)
    logger.info(f"{__file__}, run({mini_batch})")

    output_folder = os.path.join(os.environ.get("AZ_BATCHAI_INPUT_AZUREML", ""), "temp/output")
    for file_name in mini_batch:
        with open(file_name, "r") as file:
            lines = file.readlines()
        base_name = os.path.basename(file_name)
        name = os.path.join(output_folder, base_name)
        logger.info(f"{__file__}: {name}")
        with open(name, "w") as file:
            file.write(f"ouput file {name} from {__file__}:\n")
            for line in lines:
                file.write(line)

    return mini_batch
```

## Next steps

* See the SDK reference for help with the [azureml-contrib-pipeline-step](https://docs.microsoft.com/en-us/python/api/azureml-contrib-pipeline-steps/azureml.contrib.pipeline.steps?view=azure-ml-py) package and the [documentation](https://docs.microsoft.com/en-us/python/api/azureml-contrib-pipeline-steps/azureml.contrib.pipeline.steps.parallelrunstep?view=azure-ml-py) for ParallelRunStep class.

* Follow the [advanced tutorial](tutorial-pipeline-batch-scoring-classification.md) on using pipelines for batch scoring.
