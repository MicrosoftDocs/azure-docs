---
title: Upgrade local runs to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade local runs from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
ms.author: balapv
author: balapv
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade local runs to SDK v2

Local runs are similar in both V1 and V2. Use the "local" string when setting the compute target in either version.

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.

### Submit a local run

* SDK v1

    ```python
    from azureml.core import Workspace, Experiment, Environment, ScriptRunConfig
    
    # connect to the workspace
    ws = Workspace.from_config()
    
    # define and configure the experiment
    experiment = Experiment(workspace=ws, name='day1-experiment-train')
    config = ScriptRunConfig(source_directory='./src',
                                script='train.py',
                                compute_target='local')
    
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
        image='mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04',
        conda_file='pytorch-env.yml',
        name='pytorch-env'
    )
    
    # define the command
    command_job = command(
        code='./src',
        command='train.py',
        environment=env,
        compute='local',
    )
    
    returned_job = ml_client.jobs.create_or_update(command_job)
    returned_job
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[experiment.submit](/python/api/azureml-core/azureml.core.experiment.experiment#azureml-core-experiment-experiment-submit)|[MLCLient.jobs.create_or_update](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-create-or-update)|

## Next steps

* [Train models with Azure Machine Learning](concept-train-machine-learning-model.md)
