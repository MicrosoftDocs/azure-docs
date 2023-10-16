---
title: 'Upgrade script run to SDK v2'
titleSuffix: Azure Machine Learning
description: Upgrade how to run a script from SDK v1 to SDK v2
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: balapv
ms.author: balapv
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade script run to SDK v2

In SDK v2, "experiments" and "runs" are consolidated into jobs.

A job has a type. Most jobs are command jobs that run a `command`, like `python main.py`. What runs in a job is agnostic to any programming language, so you can run `bash` scripts, invoke `python` interpreters, run a bunch of `curl` commands, or anything else.

To upgrade, you'll need to change your code for submitting jobs to SDK v2. What you run _within_ the job doesn't need to be upgraded to SDK v2. However, it's recommended to remove any code specific to Azure Machine Learning from your model training scripts. This separation allows for an easier transition between local and cloud and is considered best practice for mature MLOps. In practice, this means removing `azureml.*` lines of code. Model logging and tracking code should be replaced with MLflow. For more details, see [how to use MLflow in v2](how-to-use-mlflow-cli-runs.md).

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.

## Submit a script run

* SDK v1

    ```python
    from azureml.core import Workspace, Experiment, Environment, ScriptRunConfig
    
    # connect to the workspace
    ws = Workspace.from_config()
    
    # define and configure the experiment
    experiment = Experiment(workspace=ws, name='day1-experiment-train')
    config = ScriptRunConfig(source_directory='./src',
                                script='train.py',
                                compute_target='cpu-cluster')
    
    # set up pytorch environment
    env = Environment.from_conda_specification(
        name='pytorch-env',
        file_path='pytorch-env.yml')
    config.run_config.environment = env
    
    run = experiment.submit(config)
    
    aml_url = run.get_portal_url()
    print(aml_url)
    ```

* SDK v2

    ```python
    #import required libraries
    from azure.ai.ml import MLClient, command
    from azure.ai.ml.entities import Environment
    from azure.identity import DefaultAzureCredential
    
    #connect to the workspace
    ml_client = MLClient.from_config(DefaultAzureCredential())
    
    # set up pytorch environment
    env = Environment(
        image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04",
        conda_file="pytorch-env.yml",
        name="pytorch-env"
    )
    
    # define the command
    command_job = command(
        code="./src",
        command="train.py",
        environment=env,
        compute="cpu-cluster",
    )
    
    returned_job = ml_client.jobs.create_or_update(command_job)
    returned_job
    ```

## Mapping of key functionality in v1 and v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[experiment.submit](/python/api/azureml-core/azureml.core.experiment.experiment#azureml-core-experiment-experiment-submit)|[MLCLient.jobs.create_or_update](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-create-or-update)|
|[ScriptRunConfig()](/python/api/azureml-core/azureml.core.scriptrunconfig#constructor)|[command()](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command)|

## Next steps

For more information, see:

* [V1 - Experiment](/python/api/azureml-core/azureml.core.experiment)
* [V2 - Command Job](/python/api/azure-ai-ml/azure.ai.ml#azure-ai-ml-command)
* [Train models with the Azure Machine Learning Python SDK v2](how-to-train-sdk.md)
