---
title: Log ML experiments & metrics
titleSuffix: Azure Machine Learning
description: Monitor your Azure ML experiments and monitor run metrics to enhance the model creation process. Add logging to your training script using run.log, Run.start_logging, or ScriptRunConfig.
services: machine-learning
author: likebupt
ms.author: keli19
ms.reviewer: peterlu
ms.service: machine-learning
ms.subservice: core
ms.date: 07/30/2020
ms.topic: conceptual
ms.custom: how-to
---

# Enable logging in Azure ML training runs
[!INCLUDE [applies-to-skus](../../includes/aml-applies-to-basic-enterprise-sku.md)]

The Azure Machine Learning Python SDK lets you log real-time information using both the default Python logging package and SDK-specific functionality. You can log locally and send logs to your workspace in the portal.

Logs can help you diagnose errors and warnings, or track performance metrics like parameters and model performance. In this article, you learn how to enable logging in the following scenarios:

> [!div class="checklist"]
> * Interactive training sessions
> * Submitting training jobs using ScriptRunConfig
> * Python native `logging` settings
> * Logging from additional sources


> [!TIP]
> This article shows you how to monitor the model training process. If you're interested in monitoring resource usage and events from Azure Machine learning, such as quotas, completed training runs, or completed model deployments, see [Monitoring Azure Machine Learning](monitor-azure-machine-learning.md).

## Data types

You can log multiple data types including scalar values, lists, tables, images, directories, and more. For more information, and Python code examples for different data types, see the [Run class reference page](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py).

## Interactive logging session

Interactive logging sessions are typically used in notebook environments. The method [Experiment.start_logging()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.experiment(class)?view=azure-ml-py#start-logging--args----kwargs-) starts an interactive logging session. Any metrics logged during the session are added to the run record in the experiment. The method [run.complete()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#complete--set-status-true-) ends the sessions and marks the run as completed.

## ScriptRunConfig logs

In this section, you learn how to add logging code inside of ScriptConfig runs. You can use the [**ScriptRunConfig**](https://docs.microsoft.com/python/api/azureml-core/azureml.core.scriptrunconfig?view=azure-ml-py) class to encapsulate scripts and environments for repeatable runs. You can also use this option to show a visual Jupyter Notebooks widget for monitoring.

This example performs a parameter sweep over alpha values and captures the results using the [run.log()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.run(class)?view=azure-ml-py#log-name--value--description----) method.

1. Create a training script that includes the logging logic, `train.py`.

    ```python
    from sklearn.datasets import load_diabetes
    from sklearn.linear_model import Ridge
    from sklearn.metrics import mean_squared_error
    from sklearn.model_selection import train_test_split
    from azureml.core.run import Run
    import os
    import numpy as np
    import mylib
    # sklearn.externals.joblib is removed in 0.23
    try:
        from sklearn.externals import joblib
    except ImportError:
        import joblib
    
    os.makedirs('./outputs', exist_ok=True)
    
    X, y = load_diabetes(return_X_y=True)
    
    run = Run.get_context()
    
    X_train, X_test, y_train, y_test = train_test_split(X, y,
                                                        test_size=0.2,
                                                        random_state=0)
    data = {"train": {"X": X_train, "y": y_train},
            "test": {"X": X_test, "y": y_test}}
    
    # list of numbers from 0.0 to 1.0 with a 0.05 interval
    alphas = mylib.get_alphas()
    
    for alpha in alphas:
        # Use Ridge algorithm to create a regression model
        reg = Ridge(alpha=alpha)
        reg.fit(data["train"]["X"], data["train"]["y"])
    
        preds = reg.predict(data["test"]["X"])
        mse = mean_squared_error(preds, data["test"]["y"])
        run.log('alpha', alpha)
        run.log('mse', mse)
    
        model_file_name = 'ridge_{0:.2f}.pkl'.format(alpha)
        # save model in the outputs folder so it automatically get uploaded
        with open(model_file_name, "wb") as file:
            joblib.dump(value=reg, filename=os.path.join('./outputs/',
                                                         model_file_name))
    
        print('alpha is {0:.2f}, and mse is {1:0.2f}'.format(alpha, mse))
      
    ```


1. Submit the ```train.py``` script to run in a user-managed environment. The entire script folder is submitted for training.

    ```python
     from azureml.core import ScriptRunConfig
    
    src = ScriptRunConfig(source_directory='./', script='train.py')
    src.run_config.environment = user_managed_env
    
    run = exp.submit(src)
     ```

    The `show_output` parameter turns on verbose logging, which lets you see details from the training process as well as information about any remote resources or compute targets. Use the following code to turn on verbose logging when you submit the experiment.

1. You can also use the same parameter in the `wait_for_completion` function on the resulting run.

    ```python
    run.wait_for_completion(show_output=True)
    ```


## Native Python logging

Some logs in the SDK may contain an error that instructs you to set the logging level to DEBUG. To set the logging level, add the following code to your script.

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Additional logging sources

Azure Machine Learning can also log information from other sources during training, such as automated machine learning runs, or Docker containers that run the jobs. These logs aren't documented, but if you encounter problems and contact Microsoft support, they may be able to use these logs during troubleshooting.

For information on logging metrics in Azure Machine Learning designer (preview), see [How to log metrics in the designer (preview)](how-to-track-designer-experiments.md)

## Example notebooks

The following notebook demonstrates concepts in this article:

* [how-to-use-azureml/track-and-monitor-experiments/logging-api](https://github.com/Azure/MachineLearningNotebooks/blob/master/how-to-use-azureml/track-and-monitor-experiments/logging-api)

[!INCLUDE [aml-clone-in-azure-notebook](../../includes/aml-clone-for-examples.md)]

## Next steps

See these articles to learn more on how to use Azure Machine Learning:

* Learn how to [log metrics in Azure Machine Learning designer (preview)](how-to-track-designer-experiments.md).

* See an example of how to register the best model and deploy it in the tutorial, [Train an image classification model with Azure Machine Learning](tutorial-train-models-with-aml.md).
