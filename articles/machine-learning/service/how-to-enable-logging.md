---
title: Enable logging in Azure Machine Learning service
titleSuffix: Azure Machine Learning service
description: Learn how to perform single-node and distributed training of traditional machine learning and deep learning models using Azure Machine Learning services Estimator class
ms.author: trbye
author: trevorbye
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.reviewer: trbye
ms.date: 02/06/2019
---

# Enable logging in Azure Machine Learning service

The Azure Machine Learning Python SDK allows you to enable logging using both the default Python logging package, as well as using SDK-specific functionality both for local logging and logging to your workspace in the portal. Logs provide developers with real-time information about the application state, and can help with diagnosing errors or warnings. In this article, you learn different ways of enabling logging in the following areas:

> [!div class="checklist"]
> * Training models
> * Compute targets
> * Image creation
> * Deployed models
> * Python `logging` settings

Use the [guide](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) to install the SDK, and [get started](https://docs.microsoft.com/azure/machine-learning/service/quickstart-create-workspace-with-python) with the SDK to create a workspace in the Azure Portal.

## Training models logging

There are multiple ways to enable logging during the model training process, and the examples shown will illustrate common design patterns. You can easily log run-related data to your workspace in the cloud by using the `start_logging` function on the `Experiment` class.

```python
from azureml.core import Experiment

exp = Experiment(workspace=ws, name='test_experiment')
run = exp.start_logging()
run.log("test-val", 10)
```

See the reference [documentation](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py) for the `Run` class for additional logging functions.

To enable local logging of application state during training progress, use the `show_output` parameter. Enabling verbose logging allows you to see details from the training process as well as information about any remote resources or compute targets. Use the following code to enable logging upon experiment submission.

```python
from azureml.core import Experiment

experiment = Experiment(ws, experiment_name)
run = experiment.submit(config=run_config_object, show_output=True)
```

You can also use the same parameter in the `wait_for_completion` function on the resulting run.

```python
run.wait_for_completion(show_output=True)
```

The SDK also supports using the default python logging package in certain scenarios for training. The following example enables a logging level of `INFO` in an `AutoMLConfig` object.

```python
from azureml.train.automl import AutoMLConfig
import logging

automated_ml_config = AutoMLConfig(task = 'regression',
                                   verbosity=logging.INFO,
                                   X=your_training_features,
                                   y=your_training_labels,
                                   iterations=30,
                                   iteration_timeout_minutes=5,
                                   primary_metric="spearman_correlation")
```

## Compute target logging