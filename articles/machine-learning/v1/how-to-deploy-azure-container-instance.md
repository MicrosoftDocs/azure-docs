---
title: How to deploy models to Azure Container Instances with CLI (v1)
titleSuffix: Azure Machine Learning
description: 'Use CLI (v1) to deploy your Azure Machine Learning models as a web service using Azure Container Instances.'
services: machine-learning
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.custom: UpdateFrequency5, deploy, cliv1, sdkv1
ms.author: bozhlin
author: bozhong68
ms.reviewer: larryfr
ms.date: 11/04/2022
---

# Deploy a model to Azure Container Instances with CLI (v1)

[!INCLUDE [deploy-v1](../includes/machine-learning-deploy-v1.md)]

Learn how to use Azure Machine Learning to deploy a model as a web service on Azure Container Instances (ACI). Use Azure Container Instances if you:

- prefer not to manage your own Kubernetes cluster
- Are OK with having only a single replica of your service, which may impact uptime

For information on quota and region availability for ACI, see [Quotas and region availability for Azure Container Instances](../../container-instances/container-instances-quotas.md) article.

> [!IMPORTANT]
> It is highly advised to debug locally before deploying to the web service, for more information see [Debug Locally](how-to-troubleshoot-deployment-local.md)
>
> You can also refer to Azure Machine Learning - [Deploy to Local Notebook](https://github.com/Azure/MachineLearningNotebooks/tree/master/how-to-use-azureml/deployment/deploy-to-local)

## Prerequisites

- An Azure Machine Learning workspace. For more information, see [Create an Azure Machine Learning workspace](../how-to-manage-workspace.md).

- A machine learning model registered in your workspace. If you don't have a registered model, see [How and where to deploy models](how-to-deploy-and-where.md).

- The [Azure CLI extension (v1) for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](/python/api/overview/azure/ml/intro), or the [Azure Machine Learning Visual Studio Code extension](../how-to-setup-vs-code.md).

    [!INCLUDE [cli v1 deprecation](../includes/machine-learning-cli-v1-deprecation.md)]

- The __Python__ code snippets in this article assume that the following variables are set:

    * `ws` - Set to your workspace.
    * `model` - Set to your registered model.
    * `inference_config` - Set to the inference configuration for the model.

    For more information on setting these variables, see [How and where to deploy models](how-to-deploy-and-where.md).

- The __CLI__ snippets in this article assume that you've created an `inferenceconfig.json` document. For more information on creating this document, see [How and where to deploy models](how-to-deploy-and-where.md).

## Limitations

When your Azure Machine Learning workspace is configured with a private endpoint, deploying to Azure Container Instances in a VNet is not supported. Instead, consider using a [Managed online endpoint with network isolation](../how-to-secure-online-endpoint.md).

## Deploy to ACI

To deploy a model to Azure Container Instances, create a __deployment configuration__ that describes the compute resources needed. For example, number of cores and memory. You also need an __inference configuration__, which describes the environment needed to host the model and web service. For more information on creating the inference configuration, see [How and where to deploy models](how-to-deploy-and-where.md).

> [!NOTE]
> * ACI is suitable only for small models that are under 1 GB in size. 
> * We recommend using single-node AKS to dev-test larger models.
> * The number of models to be deployed is limited to 1,000 models per deployment (per container). 

### Using the SDK

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core.webservice import AciWebservice, Webservice
from azureml.core.model import Model

deployment_config = AciWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
service = Model.deploy(ws, "aciservice", [model], inference_config, deployment_config)
service.wait_for_deployment(show_output = True)
print(service.state)
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AciWebservice.deploy_configuration](/python/api/azureml-core/azureml.core.webservice.aciwebservice#deploy-configuration-cpu-cores-none--memory-gb-none--tags-none--properties-none--description-none--location-none--auth-enabled-none--ssl-enabled-none--enable-app-insights-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--dns-name-label-none--primary-key-none--secondary-key-none--collect-model-data-none--cmk-vault-base-url-none--cmk-key-name-none--cmk-key-version-none-)
* [Model.deploy](/python/api/azureml-core/azureml.core.model.model#deploy-workspace--name--models--inference-config-none--deployment-config-none--deployment-target-none--overwrite-false-)
* [Webservice.wait_for_deployment](/python/api/azureml-core/azureml.core.webservice%28class%29#wait-for-deployment-show-output-false-)

### Using the Azure CLI

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

To deploy using the CLI, use the following command. Replace `mymodel:1` with the name and version of the registered model. Replace `myservice` with the name to give this service:

```azurecli-interactive
az ml model deploy -n myservice -m mymodel:1 --ic inferenceconfig.json --dc deploymentconfig.json
```

The entries in the `deploymentconfig.json` document map to the parameters for [AciWebservice.deploy_configuration](/python/api/azureml-core/azureml.core.webservice.aci.aciservicedeploymentconfiguration). The following table describes the mapping between the entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `computeType` | NA | The compute target. For ACI, the value must be `ACI`. |
| `containerResourceRequirements` | NA | Container for the CPU and memory entities. |
| &emsp;&emsp;`cpu` | `cpu_cores` | The number of CPU cores to allocate. Defaults, `0.1` |
| &emsp;&emsp;`memoryInGB` | `memory_gb` | The amount of memory (in GB) to allocate for this web service. Default, `0.5` |
| `location` | `location` | The Azure region to deploy this Webservice to. If not specified the Workspace location will be used. More details on available regions can be found here: [ACI Regions](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=container-instances) |
| `authEnabled` | `auth_enabled` | Whether to enable auth for this Webservice. Defaults to False |
| `sslEnabled` | `ssl_enabled` | Whether to enable SSL for this Webservice. Defaults to False. |
| `appInsightsEnabled` | `enable_app_insights` | Whether to enable AppInsights for this Webservice. Defaults to False |
| `sslCertificate` | `ssl_cert_pem_file` | The cert file needed if SSL is enabled |
| `sslKey` | `ssl_key_pem_file` | The key file needed if SSL is enabled |
| `cname` | `ssl_cname` | The cname for if SSL is enabled |
| `dnsNameLabel` | `dns_name_label` | The dns name label for the scoring endpoint. If not specified a unique dns name label will be generated for the scoring endpoint. |

The following JSON is an example deployment configuration for use with the CLI:

```json
{
    "computeType": "aci",
    "containerResourceRequirements":
    {
        "cpu": 0.5,
        "memoryInGB": 1.0
    },
    "authEnabled": true,
    "sslEnabled": false,
    "appInsightsEnabled": false
}
```

For more information, see the [az ml model deploy](/cli/azure/ml/model#az-ml-model-deploy) reference. 

## Using VS Code

See [how to manage resources in VS Code](../how-to-manage-resources-vscode.md).

> [!IMPORTANT]
> You don't need to create an ACI container to test in advance. ACI containers are created as needed.

> [!IMPORTANT]
> We append hashed workspace id to all underlying ACI resources which are created, all ACI names from same workspace will have same suffix. The Azure Machine Learning service name would still be the same customer provided "service_name" and all the user facing Azure Machine Learning SDK APIs do not need any change. We do not give any guarantees on the names of underlying resources being created.

## Next steps

* [How to deploy a model using a custom Docker image](../how-to-deploy-custom-container.md)
* [Deployment troubleshooting](how-to-troubleshoot-deployment.md)
* [Update the web service](how-to-deploy-update-web-service.md)
* [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)
* [Consume a ML Model deployed as a web service](how-to-consume-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](../how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
