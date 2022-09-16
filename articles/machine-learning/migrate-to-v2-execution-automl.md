---
title: Migrate AutoML from from SDK v1 to SDK v2
titleSuffix: Azure Machine Learning
description: Migrate AutoML from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: shouryah
ms.author: shoja
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
---

# Migrate AutoML from SDK v1 to SDK v2

In SDK v2, "experiments" and "runs" are consolidated into jobs.

In SDK v1, AutoML was primarily configured and run through the `AutoMLConfig` class. In SDK v2, this class has been converted to an `AutoML` job. Although there are some differences in the configuration options, by and large, naming & functionality has been preserved in V2.

This articles gives a comparison of scenario(s) in SDK v1 and SDK v2.

## Submit AutoML run

* SDK v1: Below is a sample AutoML classification task. For the entire code, check out our [examples repo](https://github.com/azure/azureml-examples/blob/main/python-sdk/tutorials/automl-with-azureml/classification-credit-card-fraud/auto-ml-classification-credit-card-fraud.ipynb).

    ```python
    # Imports
    import logging
    
    from matplotlib import pyplot as plt
    import pandas as pd
    import os
    
    import azureml.core
    from azureml.core.experiment import Experiment
    from azureml.core.workspace import Workspace
    from azureml.core.dataset import Dataset
    from azureml.train.automl import AutoMLConfig
    from azureml.train.automl.run import AutoMLRun
    
    from azureml.widgets import RunDetails
    
    
    # Load tabular dataset
    data = "<url_to_data>"
    dataset = Dataset.Tabular.from_delimited_files(data)
    training_data, validation_data = dataset.random_split(percentage=0.8, seed=223)
    label_column_name = "Class"
    
    # Configure Auto ML settings
    automl_settings = {
        "n_cross_validations": 3,
        "primary_metric": "average_precision_score_weighted",
        "enable_early_stopping": True,
        "max_concurrent_iterations": 2,  
        "experiment_timeout_hours": 0.25,  
        "verbosity": logging.INFO,
    }
    
    # Put together an AutoML job constructor
    automl_config = AutoMLConfig(
        task="classification",
        debug_log="automl_errors.log",
        compute_target=compute_target,
        training_data=training_data,
        label_column_name=label_column_name,
        **automl_settings,
    )
    
    # Submit run
    remote_run = experiment.submit(automl_config, show_output=False)
    
    # Register the best model
    best_run, fitted_model = remote_run.get_output()
    fitted_model
    description = 'My AutoML Model'
    model = run.register_model(description = description, 
                                tags={'area': 'qna'}) # AutoML Run Object
    ```

* SDK v2: Below is a sample AutoML classification task. For the entire code, check out our [examples repo](https://github.com/Azure/azureml-examples/blob/main/sdk/jobs/automl-standalone-jobs/automl-classification-task-bankmarketing/automl-classification-task-bankmarketing-mlflow.ipynb).

    ```python
    # Imports
    from azure.identity import DefaultAzureCredential
    from azure.identity import AzureCliCredential
    from azure.ai.ml import automl, Input, MLClient
    
    from azure.ai.ml.constants import AssetTypes
    from azure.ai.ml.automl import (
        classification,
        ClassificationPrimaryMetrics,
        ClassificationModels,
    )
    
    import mlflow
    from mlflow.tracking.client import MlflowClient
    
    from azure.ai.ml.entities import (
        ManagedOnlineEndpoint,
        ManagedOnlineDeployment,
        Model,
        Environment,
        CodeConfiguration,
        ProbeSettings,
    )
    from azure.ai.ml.constants import ModelType
    
    # Create MLTables for training dataset
    # Note that AutoML Job can also take in tabular data
    my_training_data_input = Input(
        type=AssetTypes.MLTABLE, path="./data/training-mltable-folder"
    )
    
    # Create the AutoML classification job with the related factory-function.
    classification_job = automl.classification(
        compute="<compute_name>",
        experiment_name="<exp_name?",
        training_data=my_training_data_input,
        target_column_name="<name_of_target_column>",
        primary_metric="accuracy",
        n_cross_validations=5,
        enable_model_explainability=True,
        tags={"my_custom_tag": "My custom value"},
    )
    
    # Limits are all optional
    classification_job.set_limits(
        timeout_minutes=600,
        trial_timeout_minutes=20,
        max_trials=5,
        max_concurrent_trials = 4,
        max_cores_per_trial= 1,
        enable_early_termination=True,
    )
    
    # Training properties are optional
    classification_job.set_training(
        blocked_training_algorithms=["LogisticRegression"],
        enable_onnx_compatible_models=True,
    )
    
    # Submit the AutoML job
    job_name = ml_client.jobs.create_or_update(
        classification_job
    )  
    
    print(f"Created job: {returned_job}")
    
    # Set up MLFLow
    MLFLOW_TRACKING_URI = ml_client.workspaces.get(
        name=ml_client.workspace_name
    ).mlflow_tracking_uri
    mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
    mlflow_client = MlflowClient()
    
    # Get the AutoML best run
    mlflow_parent_run = mlflow_client.get_run(job_name)
    best_child_run_id = mlflow_parent_run.data.tags["automl_best_child_run_id"]
    best_run = mlflow_client.get_run(best_child_run_id)
    
    # Register the best model
    model_name = "bankmarketing-model"
    model = Model(
        path=f"azureml://jobs/{best_run.info.run_id}/outputs/artifacts/outputs/model.pkl",
        name=model_name,
        description="my sample mlflow model",
    )
    registered_model = ml_client.models.create_or_update(model)
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[Method/API in SDK v1 (use links to ref docs)](/python/api/azureml-train-automl-client/azureml.train.automl?view=azure-ml-py)|[Method/API in SDK v2 (use links to ref docs)](/python/api/azure-ai-ml/azure.ai.ml.automl?view=azure-python-preview)|

## Next steps

For further details refer to the documentation here:

* [How to train an AutoML model with Python SDKv2](how-to-configure-auto-train.md)

