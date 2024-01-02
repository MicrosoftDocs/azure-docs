---
title:  Upgrade model management to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade model management from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: AbeOmor
ms.author: osomorog
ms.date: 12/01/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade model management to SDK v2

This article gives a comparison of scenario(s) in SDK v1 and SDK v2.

## Create model

* SDK v1

    ```python
    import urllib.request
    from azureml.core.model import Model
    
    # Register model
    model = Model.register(ws, model_name="local-file-example", model_path="mlflow-model/model.pkl")
    ```

* SDK v2
    
    ```python
    from azure.ai.ml.entities import Model
    from azure.ai.ml.constants import AssetTypes
    
    file_model = Model(
        path="mlflow-model/model.pkl",
        type=AssetTypes.CUSTOM_MODEL,
        name="local-file-example",
        description="Model created from local file."
    )
    ml_client.models.create_or_update(file_model)
    ```

## Use model in an experiment/job

* SDK v1

    ```python
    model = run.register_model(model_name='run-model-example',
                               model_path='outputs/model/')
    print(model.name, model.id, model.version, sep='\t')
    ```

* SDK v2

    ```python
    from azure.ai.ml.entities import Model
    from azure.ai.ml.constants import AssetTypes
    
    run_model = Model(
        path="azureml://jobs/$RUN_ID/outputs/artifacts/paths/model/",
        name="run-model-example",
        description="Model created from run.",
        type=AssetTypes.CUSTOM_MODEL
    )
    
    ml_client.models.create_or_update(run_model)
    ```

For more information about models, see [Work with models in Azure Machine Learning](how-to-manage-models.md).

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[Model.register](/python/api/azureml-core/azureml.core.model(class)#azureml-core-model-register)|[ml_client.models.create_or_update](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-create-or-update)|
|[run.register_model](/python/api/azureml-core/azureml.core.run.run#azureml-core-run-run-register-model)|[ml_client.models.create_or_update](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-create-or-update)|
|[Model.deploy](/python/api/azureml-core/azureml.core.model(class)#azureml-core-model-deploy)|[ml_client.begin_create_or_update(blue_deployment)](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-begin-create-or-update)|

## Next steps

For more information, see the documentation here:

* [Create a model in v1](v1/how-to-deploy-and-where.md?tabs=python#register-a-model-from-a-local-file)
* [Deploy a model in v1](v1/how-to-deploy-and-where.md?tabs=azcli#workflow-for-deploying-a-model)
* [Create a model in v2](how-to-manage-models.md)
* [Deploy a model in v2](how-to-deploy-online-endpoints.md)

