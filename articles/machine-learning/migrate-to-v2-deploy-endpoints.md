---
title: Upgrade deployment endpoints to SDK v2
titleSuffix: Azure Machine Learning
description: Upgrade deployment endpoints from v1 to v2 of Azure Machine Learning SDK
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: dem108
ms.author: sehan
ms.date: 09/16/2022
ms.reviewer: sgilley
ms.custom: migration
monikerRange: 'azureml-api-1 || azureml-api-2'
---

# Upgrade deployment endpoints to SDK v2

With SDK/CLI v1, you can deploy models on ACI or AKS as web services. Your existing v1 model deployments and web services will continue to function as they are, but Using SDK/CLI v1 to deploy models on ACI or AKS as web services is now considered as **legacy**. For new model deployments, we recommend upgrading to v2. 

In v2, we offer [managed endpoints or Kubernetes endpoints](./concept-endpoints.md?view=azureml-api-2&preserve-view=true). For a comparison of v1 and v2, see [Endpoints and deployment](./how-to-migrate-from-v1.md#endpoint-and-deployment-endpoint-and-web-service-in-v1).

There are several deployment funnels such as managed online endpoints, [kubernetes online endpoints](how-to-attach-kubernetes-anywhere.md) (including Azure Kubernetes Services and Arc-enabled Kubernetes) in v2, and Azure Container Instances (ACI) and Kubernetes Services (AKS) webservices in v1. In this article, we'll focus on the comparison of deploying to ACI webservices (v1) and managed online endpoints (v2).


Examples in this article show how to:

* Deploy your model to Azure
* Score using the endpoint
* Delete the webservice/endpoint

## Create inference resources

* SDK v1
    1. Configure a model, an environment, and a scoring script:
        ```python
        # configure a model. example for registering a model 
        from azureml.core.model import Model
        model = Model.register(ws, model_name="bidaf_onnx", model_path="./model.onnx")
        
        # configure an environment
        from azureml.core import Environment
        env = Environment(name='myenv')
        python_packages = ['nltk', 'numpy', 'onnxruntime']
        for package in python_packages:
            env.python.conda_dependencies.add_pip_package(package)
        
        # configure an inference configuration with a scoring script
        from azureml.core.model import InferenceConfig
        inference_config = InferenceConfig(
            environment=env,
            source_directory="./source_dir",
            entry_script="./score.py",
        )
        ```

    1. Configure and deploy an **ACI webservice**:
        ```python
        from azureml.core.webservice import AciWebservice
        
        # defince compute resources for ACI
        deployment_config = AciWebservice.deploy_configuration(
            cpu_cores=0.5, memory_gb=1, auth_enabled=True
        )
        
        # define an ACI webservice
        service = Model.deploy(
            ws,
            "myservice",
            [model],
            inference_config,
            deployment_config,
            overwrite=True,
        )
        
        # create the service 
        service.wait_for_deployment(show_output=True)
        ```

For more information on registering models, see [Register a model from a local file](v1/how-to-deploy-and-where.md?tabs=python#register-a-model-from-a-local-file).

* SDK v2

    1. Configure a model, an environment, and a scoring script:
        ```python
        from azure.ai.ml.entities import Model
        # configure a model
        model = Model(path="../model-1/model/sklearn_regression_model.pkl")
        
        # configure an environment
        from azure.ai.ml.entities import Environment
        env = Environment(
            conda_file="../model-1/environment/conda.yml",
            image="mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1",
        )
        
        # configure an inference configuration with a scoring script
        from azure.ai.ml.entities import CodeConfiguration
        code_config = CodeConfiguration(
                code="../model-1/onlinescoring", scoring_script="score.py"
            )
        ```

    1. Configure and create an **online endpoint**:
        ```python
        import datetime
        from azure.ai.ml.entities import ManagedOnlineEndpoint
        
        # create a unique endpoint name with current datetime to avoid conflicts
        online_endpoint_name = "endpoint-" + datetime.datetime.now().strftime("%m%d%H%M%f")
        
        # define an online endpoint
        endpoint = ManagedOnlineEndpoint(
            name=online_endpoint_name,
            description="this is a sample online endpoint",
            auth_mode="key",
            tags={"foo": "bar"},
        )
        
        # create the endpoint:
        ml_client.begin_create_or_update(endpoint)
        ```
    
    1. Configure and create an **online deployment**:
        ```python
        from azure.ai.ml.entities import ManagedOnlineDeployment
        
        # define a deployment
        blue_deployment = ManagedOnlineDeployment(
            name="blue",
            endpoint_name=online_endpoint_name,
            model=model,
            environment=env,
            code_configuration=code_config,
            instance_type="Standard_F2s_v2",
            instance_count=1,
        )
        
        # create the deployment:
        ml_client.begin_create_or_update(blue_deployment)
        
        # blue deployment takes 100 traffic
        endpoint.traffic = {"blue": 100}
        ml_client.begin_create_or_update(endpoint)
        ```

For more information on concepts for endpoints and deployments, see [What are online endpoints?](concept-endpoints-online.md)


## Submit a request

* SDK v1

    ```python
    import json
    data = {
        "query": "What color is the fox",
        "context": "The quick brown fox jumped over the lazy dog.",
    }
    data = json.dumps(data)
    predictions = service.run(input_data=data)
    print(predictions)
    ```

* SDK v2

    ```python
    # test the endpoint (the request will route to blue deployment as set above)
    ml_client.online_endpoints.invoke(
        endpoint_name=online_endpoint_name,
        request_file="../model-1/sample-request.json",
    )
    
    # test the specific (blue) deployment
    ml_client.online_endpoints.invoke(
        endpoint_name=online_endpoint_name,
        deployment_name="blue",
        request_file="../model-1/sample-request.json",
    )
    ```

## Delete resources

* SDK v1

    ```python
    service.delete()
    ```

* SDK v2

    ```python
    ml_client.online_endpoints.begin_delete(name=online_endpoint_name)
    ```

## Mapping of key functionality in SDK v1 and SDK v2

|Functionality in SDK v1|Rough mapping in SDK v2|
|-|-|
|[azureml.core.model.Model class](/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py&preserve-view=true)|[azure.ai.ml.entities.Model class](/python/api/azure-ai-ml/azure.ai.ml.entities.model)|
|[azureml.core.Environment class](/python/api/azureml-core/azureml.core.environment%28class%29?view=azure-ml-py&preserve-view=true)|[azure.ai.ml.entities.Environment class](/python/api/azure-ai-ml/azure.ai.ml.entities.environment)|
|[azureml.core.model.InferenceConfig class](/python/api/azureml-core/azureml.core.model.inferenceconfig?view=azure-ml-py&preserve-view=true)|[azure.ai.ml.entities.CodeConfiguration class](/python/api/azure-ai-ml/azure.ai.ml.entities.codeconfiguration)|
|[azureml.core.webservice.AciWebservice class](/python/api/azureml-core/azureml.core.webservice.aciwebservice?view=azure-ml-py&preserve-view=true#azureml-core-webservice-aciwebservice-deploy-configuration)|[azure.ai.ml.entities.OnlineDeployment class](/python/api/azure-ai-ml/azure.ai.ml.entities.onlinedeployment?view=azure-python-&preserve-view=true) (and [azure.ai.ml.entities.ManagedOnlineEndpoint class](/en-us/python/api/azure-ai-ml/azure.ai.ml.entities.managedonlineendpoint))|
|[Model.deploy](/python/api/azureml-core/azureml.core.model(class)?view=azure-ml-py&preserve-view=true#azureml-core-model-deploy) or [Webservice.deploy](/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py&preserve-view=true#azureml-core-webservice-deploy) |[ml_client.begin_create_or_update(online_deployment)](/python/api/azure-ai-ml/azure.ai.ml.mlclient#azure-ai-ml-mlclient-begin-create-or-update)|
[Webservice.run](/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py&preserve-view=true#azureml-core-webservice-run)|[ml_client.online_endpoints.invoke](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-invoke)|
[Webservice.delete](/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py&preserve-view=true#azureml-core-webservice-delete)|[ml_client.online_endpoints.delete](/python/api/azure-ai-ml/azure.ai.ml.operations.onlineendpointoperations#azure-ai-ml-operations-onlineendpointoperations-begin-delete)|

## Related documents

For more information, see

v2 docs:
* [What are endpoints?](concept-endpoints.md)
* [Deploy machine learning models to managed online endpoint using Python SDK v2](how-to-deploy-managed-online-endpoint-sdk-v2.md)

v1 docs:
* [MLOps: ML model management v1](v1/concept-model-management-and-deployment.md)
* [Deploy machine learning models](v1/how-to-deploy-and-where.md?tabs=python.md)
