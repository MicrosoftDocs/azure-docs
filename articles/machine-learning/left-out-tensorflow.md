---
title: REMOVED from TensorFlow 
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning enables you to scale out a TensorFlow training job using elastic cloud compute resources.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.author: minxia
author: mx-iao
ms.date: 09/28/2020
ms.topic: how-to

# Customer intent: As a TensorFlow developer, I need to combine open-source with a cloud platform to train, evaluate, and deploy my deep learning models at scale. 
---
# REMOVED from TensorFlow 

This content was removed from the [Train TensorFlow models at scale with Azure Machine Learning](azure-docs-sdg/articles/machine-learning/how-to-train-tensorflow.md) article.  Is there anything here that should be moved to the new [Distributed training with Azure Machine Learning](azure-docs-sdg/articles/machine-learning/concept-distributed-training.md)?

### Horovod
[Horovod](https://github.com/uber/horovod) is an open-source, all reduce framework for distributed training developed by Uber. It offers an easy path to writing distributed TensorFlow code for training.

Your training code will have to be instrumented with Horovod for distributed training. For more information using Horovod with TensorFlow, refer to Horovod documentation:

For more information on using Horovod with TensorFlow, refer to Horovod documentation:

* [Horovod with TensorFlow](https://github.com/horovod/horovod/blob/master/docs/tensorflow.rst)
* [Horovod with TensorFlow's Keras API](https://github.com/horovod/horovod/blob/master/docs/keras.rst)

Additionally, make sure your training environment includes the **horovod** package. If you are using a TensorFlow curated environment, horovod is already included as one of the dependencies. If you are using your own environment, make sure the horovod dependency is included, for example:

```yaml
channels:
- conda-forge
dependencies:
- python=3.6.2
- pip:
  - azureml-defaults
  - tensorflow-gpu==2.2.0
  - horovod==0.19.5
```

In order to execute a distributed job using MPI/Horovod on Azure ML, you must specify an [MpiConfiguration](/python/api/azureml-core/azureml.core.runconfig.mpiconfiguration) to the `distributed_job_config` parameter of the ScriptRunConfig constructor. The below code will configure a 2-node distributed job running one process per node. If you would also like to run multiple processes per node (i.e. if your cluster SKU has multiple GPUs), additionally specify the `process_count_per_node` parameter in MpiConfiguration (the default is `1`).

```python
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import MpiConfiguration

src = ScriptRunConfig(source_directory=project_folder,
                      script='tf_horovod_word2vec.py',
                      arguments=['--input_data', dataset.as_mount()],
                      compute_target=compute_target,
                      environment=tf_env,
                      distributed_job_config=MpiConfiguration(node_count=2))
```

For a full tutorial on running distributed TensorFlow with Horovod on Azure ML, see [Distributed TensorFlow with Horovod](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/ml-frameworks/tensorflow/distributed-tensorflow-with-horovod).

### tf.distribute

If you are using [native distributed TensorFlow](https://www.tensorflow.org/guide/distributed_training) in your training code, e.g. TensorFlow 2.x's `tf.distribute.Strategy` API, you can also launch the distributed job via Azure ML. 

To do so, specify a [TensorflowConfiguration](/python/api/azureml-core/azureml.core.runconfig.tensorflowconfiguration) to the `distributed_job_config` parameter of the ScriptRunConfig constructor. If you are using `tf.distribute.experimental.MultiWorkerMirroredStrategy`, specify the `worker_count` in the TensorflowConfiguration corresponding to the number of nodes for your training job.

```python
import os
from azureml.core import ScriptRunConfig
from azureml.core.runconfig import TensorflowConfiguration

distr_config = TensorflowConfiguration(worker_count=2, parameter_server_count=0)

model_path = os.path.join("./outputs", "keras-model")

src = ScriptRunConfig(source_directory=source_dir,
                      script='train.py',
                      arguments=["--epochs", 30, "--model-dir", model_path],
                      compute_target=compute_target,
                      environment=tf_env,
                      distributed_job_config=distr_config)
```

In TensorFlow, the `TF_CONFIG` environment variable is required for training on multiple machines. Azure ML will configure and set the `TF_CONFIG` variable appropriately for each worker before executing your training script. You can access `TF_CONFIG` from your training script if you need to via `os.environ['TF_CONFIG']`.

Example structure of `TF_CONFIG` set on a chief worker node:
```JSON
TF_CONFIG='{
    "cluster": {
        "worker": ["host0:2222", "host1:2222"]
    },
    "task": {"type": "worker", "index": 0},
    "environment": "cloud"
}'
```

If your training script uses the parameter server strategy for distributed training, i.e. for legacy TensorFlow 1.x, you will also need to specify the number of parameter servers to use in the job, e.g. `distr_config = TensorflowConfiguration(worker_count=2, parameter_server_count=1)`.
