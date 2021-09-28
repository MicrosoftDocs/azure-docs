---
title: Configure authentication for models deployed as web services
titleSuffix: Azure Machine Learning
description: Learn how to configure authentication for machine learning models deployed to web services in Azure Machine Learning.
services: machine-learning
author: cjgronlund
ms.author: cgronlun
ms.reviewer: larryfr
ms.service: machine-learning
ms.subservice: core
ms.date: 11/06/2020
ms.topic: how-to

---

# Configure authentication for models deployed as web services

Azure Machine Learning allows you to deploy your trained machine learning models as web services. In this article, learn how to configure authentication for these deployments.

The model deployments created by Azure Machine Learning can be configured to use one of two authentication methods:

* **key-based**: A static key is used to authenticate to the web service.
* **token-based**: A temporary token must be obtained from the Azure Machine Learning workspace (using Azure Active Directory) and used to authenticate to the web service. This token expires after a period of time, and must be refreshed to continue working with the web service.

    > [!NOTE]
    > Token-based authentication is only available when deploying to Azure Kubernetes Service.

## Key-based authentication

Web-services deployed on Azure Kubernetes Service (AKS) have key-based auth *enabled* by default.

Azure Container Instances (ACI) deployed services have key-based auth *disabled* by default, but you can enable it by setting `auth_enabled=True`when creating the ACI web-service. The following code is an example of creating an ACI deployment configuration with key-based auth enabled.

```python
from azureml.core.webservice import AciWebservice

aci_config = AciWebservice.deploy_configuration(cpu_cores = 1,
                                                memory_gb = 1,
                                                auth_enabled=True)
```

Then you can use the custom ACI configuration in deployment using the `Model` class.

```python
from azureml.core.model import Model, InferenceConfig


inference_config = InferenceConfig(entry_script="score.py",
                                   environment=myenv)
aci_service = Model.deploy(workspace=ws,
                       name="aci_service_sample",
                       models=[model],
                       inference_config=inference_config,
                       deployment_config=aci_config)
aci_service.wait_for_deployment(True)
```

To fetch the auth keys, use `aci_service.get_keys()`. To regenerate a key, use the `regen_key()` function and pass either **Primary** or **Secondary**.

```python
aci_service.regen_key("Primary")
# or
aci_service.regen_key("Secondary")
```

## Token-based authentication

When you enable token authentication for a web service, users must present an Azure Machine Learning JSON Web Token to the web service to access it. The token expires after a specified time-frame and needs to be refreshed to continue making calls.

* Token authentication is **disabled by default** when you deploy to Azure Kubernetes Service.
* Token authentication **isn't supported** when you deploy to Azure Container Instances.
* Token authentication **can't be used at the same time as key-based authentication**.

To control token authentication, use the `token_auth_enabled` parameter when you create or update a deployment:

```python
from azureml.core.webservice import AksWebservice
from azureml.core.model import Model, InferenceConfig

# Create the config
aks_config = AksWebservice.deploy_configuration()

#  Enable token auth and disable (key) auth on the webservice
aks_config = AksWebservice.deploy_configuration(token_auth_enabled=True, auth_enabled=False)

aks_service_name ='aks-service-1'

# deploy the model
aks_service = Model.deploy(workspace=ws,
                           name=aks_service_name,
                           models=[model],
                           inference_config=inference_config,
                           deployment_config=aks_config,
                           deployment_target=aks_target)

aks_service.wait_for_deployment(show_output = True)
```

If token authentication is enabled, you can use the `get_token` method to retrieve a JSON Web Token (JWT) and that token's expiration time:

> [!TIP]
> If you use a service principal to get the token, and want it to have the minimum required access to retrieve a token, assign it to the **reader** role for the workspace.

```python
token, refresh_by = aks_service.get_token()
print(token)
```

> [!IMPORTANT]
> You'll need to request a new token after the token's `refresh_by` time. If you need to refresh tokens outside of the Python SDK, one option is to use the REST API with service-principal authentication to periodically make the `service.get_token()` call, as discussed previously.
>
> We strongly recommend that you create your Azure Machine Learning workspace in the same region as your Azure Kubernetes Service cluster.
>
> To authenticate with a token, the web service will make a call to the region in which your Azure Machine Learning workspace is created. If your workspace region is unavailable, you won't be able to fetch a token for your web service, even if your cluster is in a different region from your workspace. The result is that Azure AD Authentication is unavailable until your workspace region is available again.
>
> Also, the greater the distance between your cluster's region and your workspace region, the longer it will take to fetch a token.

## Next steps

For more information on authenticating to a deployed model, see [Create a client for a model deployed as a web service](how-to-consume-web-service.md).