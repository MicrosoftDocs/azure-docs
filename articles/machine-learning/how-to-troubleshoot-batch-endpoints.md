---
title: Troubleshooting batch endpoints (preview)
titleSuffix: Azure Machine Learning
description: Tips to help you succeed with batch endpoints.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: troubleshooting
ms.custom: troubleshooting
ms.reviewer: laobri
ms.author: tracych
author: tracych
ms.date: 05/05/2021
#Customer intent: As an ML Deployment Pro, I want to figure out why my batch endpoint doesn't run so that I can fix it.

---
# Troubleshooting batch endpoints (preview)

Learn how to troubleshoot and solve, or work around, common errors you may encounter when using [batch endpoints](how-to-use-batch-endpoint.md) for batch scoring.

The following table contains common problems and solutions you may see during batch endpoint development and consumption.

| Problem | Possible solution |
|--|--|
| Code configuration or Environment is missing. | Ensure you provide the scoring script and an environment definition if you are using a non-MLflow model. No-code deployment is supported for the MLflow model only. |
| Failure to update model, code, environment, and compute for an existing batch endpoint. | Please create a new batch endpoint with a new name. Updating these assets for an existing batch endpoint is not yet supported. |
| The resource was not found. | Ensure you use `-t batch` in your CLI command. Without this, the default `online` type is used.|
| Unsupported input data. | Batch endpoint accepts input data in 3 forms: 1) registered data 2) data in the cloud 3) data in local. Ensure you are using the right format. For more, see [Use batch endpoints (preview) for batch scoring](how-to-use-batch-endpoint.md)|

#  Scoring script requirements

If you are using a non-MLflow model, you will need to provide a scoring script. The scoring script must contain two functions:

- `init()`: Use this function for any costly or common preparation for later inference. For example, use it to load the model into a global object. This function will be called only once at beginning of process.
-  `run(mini_batch)`: The function will run for each `mini_batch` instance.
    -  `mini_batch`: Each entry in `mini_batch` will be a file path.
    -  `response`: The `run()` method should return a pandas DataFrame or an array. These returned elements are appended to the common output file. Each returned output element indicates one successful run of input element in the input mini-batch. Make sure that enough data is included in run result to map input to run output result. Run output will be written in output file and is not guaranteed to be in order, so you should use some key in the output to map it to the correct input.

```python
%%writefile digit_identification.py
# Snippets from a sample script.
# Refer to the accompanying digit_identification.py
# (https://github.com/Azure/azureml-examples/blob/cli-preview/cli/endpoints/batch/mnist/code/digit_identification.py)
# for the implementation script.

import os
import numpy as np
import tensorflow as tf
from PIL import Image
from azureml.core import Model


def init():
    global g_tf_sess

    # AZUREML_MODEL_DIR is an environment variable created during deployment
    # It is the path to the model folder (./azureml-models)
    # Please provide your model's folder name if there's one
    model_path = os.path.join(os.environ["AZUREML_MODEL_DIR"], "model")

    # contruct graph to execute
    tf.reset_default_graph()
    saver = tf.train.import_meta_graph(os.path.join(model_path, "mnist-tf.model.meta"))
    g_tf_sess = tf.Session(config=tf.ConfigProto(device_count={"GPU": 0}))
    saver.restore(g_tf_sess, os.path.join(model_path, "mnist-tf.model"))


def run(mini_batch):
    print(f"run method start: {__file__}, run({mini_batch})")
    resultList = []
    in_tensor = g_tf_sess.graph.get_tensor_by_name("network/X:0")
    output = g_tf_sess.graph.get_tensor_by_name("network/output/MatMul:0")

    for image in mini_batch:
        # prepare each image
        data = Image.open(image)
        np_im = np.array(data).reshape((1, 784))
        # perform inference
        inference_result = output.eval(feed_dict={in_tensor: np_im}, session=g_tf_sess)
        # find best probability, and add to result list
        best_result = np.argmax(inference_result)
        resultList.append("{}: {}".format(os.path.basename(image), best_result))

    return resultList
```

## Understanding logs of a batch scoring job

### Get logs

After you invoke a batch endpoint using CLI or REST, the batch scoring job will run offline {>>Q: online? <<}. There are two options to get the logs for a batch scoring job.

Option 1: Stream logs to local console

You can run the following command to stream the logs to your console. Only logs in the `azureml-logs` folder will be streamed.

```bash
az ml job stream -name <job_name>
```

Option 2: View logs in studio 

In studio, choose the **Experiments** asset, and choose the experiment named the same as your endpoint. You can find the logs in the **Outputs + logs** tab of the associated run. 

### Understand log structure

There are two top-level log folders, `azureml-logs` and `logs`. 

The file `~/azureml-logs/70_driver_log.txt` contains information from the controller that launches the scoring script.  

Because of the distributed nature of batch scoring jobs, there are logs from several different sources. However, two consolidated files are created that provide high-level information: 

- `~/logs/job_progress_overview.txt`: This file provides high-level information about the number of mini-batches (also known as tasks) created so far and the number of mini-batches processed so far. As these end, it further shows the results of the job. If the job failed, it will show the error message and where to start the troubleshooting.

- `~/logs/sys/master_role.txt`: This file provides the principal node (also known as the orchestrator) view of the running job. This log provides information on task creation, progress monitoring, the run result.

For a concise understanding of errors in your script there is:

- `~/logs/user/error.txt`: This file will try to summarize the errors in your script.

For more information on errors in your script, there is:

- `~/logs/user/error/`: This file contains full stack traces of exceptions thrown while loading and running the entry script.

When you need a full understanding of how each node executed the score script, look at the individual process logs for each node. The process logs can be found in the `sys/node` folder, grouped by worker nodes:
{>> Q: The only logs I got under logs/ were azureml/ logs. <<}

- `~/logs/sys/node/<ip_address>/<process_name>.txt`: This file provides detailed info about each mini-batch as it's picked up or completed by a worker. For each mini-batch, this file includes:

    - The IP address and the PID of the worker process. 
    - The total number of items, the number of successfully processed items, and the number of failed items.
    - The start time, duration, process time, and run method time.

You can also view the results of periodical checks of the resource usage for each node. The log files and setup files are in this folder:

- `~/logs/perf`: Set `--resource_monitor_interval` to change the checking interval in seconds. The default interval is `600`, which is approximately 10 minutes. To stop the monitoring, set the value to `0`. Each `<ip_address>` folder includes:

    - `os/`: Information about all running processes in the node. One check runs an operating system command and saves the result to a file. On Linux, the command is `ps`. On Windows, it's `tasklist`.
        - `%Y%m%d%H`: The sub folder name is the time to hour.
            - `processes_%M`: The file ends with the minute of the checking time.
    - `node_disk_usage.csv`: Detailed disk usage of the node.
    - `node_resource_usage.csv`: Resource usage overview of the node.
    - `processes_resource_usage.csv`: Resource usage overview of each process.

