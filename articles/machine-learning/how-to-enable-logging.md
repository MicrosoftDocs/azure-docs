---
title: Enable logging in Azure Machine Learning
description: Learn how to enable logging in Azure Machine Learning using both the default Python logging package, as well as using SDK-specific functionality.
ms.author: trbye
author: trevorbye
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: how-to
ms.reviewer: trbye
ms.date: 03/05/2020
ms.custom: tracking-python
---

# Enable logging in Azure Machine Learning
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

The Azure Machine Learning Python SDK allows you to enable logging using both the default Python logging package, as well as using SDK-specific functionality both for local logging and logging to your workspace in the portal. Logs provide developers with real-time information about the application state, and can help with diagnosing errors or warnings. In this article, you learn different ways of enabling logging in the following areas:

> [!div class="checklist"]
> * Training models and compute targets
> * Image creation
> * Deployed models
> * Python `logging` settings

[Create an Azure Machine Learning workspace](how-to-manage-workspace.md). Use the [guide](https://docs.microsoft.com/python/api/overview/azure/ml/install?view=azure-ml-py) for more information the SDK.

## Training models and compute target logging

There are multiple ways to enable logging during the model training process, and the examples shown will illustrate common design patterns. You can easily log run-related data to your workspace in the cloud by using the `start_logging` function on the `Experiment` class.

```python
from azureml.core import Experiment

exp = Experiment(workspace=ws, name='test_experiment')
run = exp.start_logging()
run.log("test-val", 10)
```

See the reference documentation for the [Run](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py) class for additional logging functions.

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

automated_ml_config = AutoMLConfig(task='regression',
                                   verbosity=logging.INFO,
                                   X=your_training_features,
                                   y=your_training_labels,
                                   iterations=30,
                                   iteration_timeout_minutes=5,
                                   primary_metric="spearman_correlation")
```

You can also use the `show_output` parameter when creating a persistent compute target. Specify the parameter in the `wait_for_completion` function to enable logging during compute target creation.

```python
from azureml.core.compute import ComputeTarget

compute_target = ComputeTarget.attach(
    workspace=ws, name="example", attach_configuration=config)
compute.wait_for_completion(show_output=True)
```

## Logging for deployed models

To retrieve logs from a previously deployed web service, load the service and use the `get_logs()` function. The logs may contain detailed information about any errors that occurred during deployment.

```python
from azureml.core.webservice import Webservice

# load existing web service
service = Webservice(name="service-name", workspace=ws)
logs = service.get_logs()
```

You can also log custom stack traces for your web service by enabling Application Insights, which allows you to monitor request/response times, failure rates, and exceptions. Call the `update()` function on an existing web service to enable Application Insights.

```python
service.update(enable_app_insights=True)
```

For more information, see [Monitor and collect data from ML web service endpoints](how-to-enable-app-insights.md).

## Python native logging settings

Certain logs in the SDK may contain an error that instructs you to set the logging level to DEBUG. To set the logging level, add the following code to your script.

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Next steps

* [Monitor and collect data from ML web service endpoints](how-to-enable-app-insights.md)
