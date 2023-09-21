---

title: Update deployed web services
titleSuffix: Azure Machine Learning
description: Learn how to refresh a web service that is already deployed in Azure Machine Learning. You can update settings such as model, environment, and entry script.
ms.service: machine-learning
ms.subservice: inferencing
ms.topic: how-to
ms.author: bozhlin
author: bozhong68
ms.reviewer: larryfr
ms.date: 11/04/2022
ms.custom: UpdateFrequency5, deploy, cliv1, sdkv1, event-tier1-build-2022
---

# Update a deployed web service (v1)

[!INCLUDE [dev v1](../includes/machine-learning-dev-v1.md)]

In this article, you learn how to update a web service that was deployed with Azure Machine Learning.

## Prerequisites

- This article assumes you have already deployed a web service with Azure Machine Learning. If you need to learn how to deploy a web service, [follow these steps](how-to-deploy-and-where.md).
- The code snippets in this article assume that the `ws` variable has already been initialized to your workspace by using the [Workflow()](/python/api/azureml-core/azureml.core.workspace.workspace#constructor) constructor or loading a saved configuration with [Workspace.from_config()](/python/api/azureml-core/azureml.core.workspace.workspace#azureml-core-workspace-workspace-from-config). The following snippet demonstrates how to use the constructor:

    [!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

    ```python
    from azureml.core import Workspace
    ws = Workspace(subscription_id="mysubscriptionid",
                   resource_group="myresourcegroup",
                   workspace_name="myworkspace")
    ```

[!INCLUDE [cli v1 deprecation](../includes/machine-learning-cli-v1-deprecation.md)]

## Update web service

To update a web service, use the `update` method. You can update the web service to use a new model, a new entry script, or new dependencies that can be specified in an inference configuration. For more information, see the documentation for [Webservice.update](/python/api/azureml-core/azureml.core.webservice.webservice.webservice#update--args-).

See [AKS Service Update Method.](/python/api/azureml-core/azureml.core.webservice.akswebservice#update-image-none--autoscale-enabled-none--autoscale-min-replicas-none--autoscale-max-replicas-none--autoscale-refresh-seconds-none--autoscale-target-utilization-none--collect-model-data-none--auth-enabled-none--cpu-cores-none--memory-gb-none--enable-app-insights-none--scoring-timeout-ms-none--replica-max-concurrent-requests-none--max-request-wait-time-none--num-replicas-none--tags-none--properties-none--description-none--models-none--inference-config-none--gpu-cores-none--period-seconds-none--initial-delay-seconds-none--timeout-seconds-none--success-threshold-none--failure-threshold-none--namespace-none--token-auth-enabled-none-)

See [ACI Service Update Method.](/python/api/azureml-core/azureml.core.webservice.aci.aciwebservice#update-image-none--tags-none--properties-none--description-none--auth-enabled-none--ssl-enabled-none--ssl-cert-pem-file-none--ssl-key-pem-file-none--ssl-cname-none--enable-app-insights-none--models-none--inference-config-none-)

> [!IMPORTANT]
> When you create a new version of a model, you must manually update each service that you want to use it.
>
> You can not use the SDK to update a web service published from the Azure Machine Learning designer.

> [!IMPORTANT]
> Azure Kubernetes Service uses [Blobfuse FlexVolume driver](https://github.com/Azure/kubernetes-volume-drivers/blob/master/flexvolume/blobfuse/README.md) for the versions <=1.16 and [Blob CSI driver](https://github.com/kubernetes-sigs/blob-csi-driver/blob/master/README.md) for the versions >=1.17. 
>
> Therefore, it is important to re-deploy or update the web service after cluster upgrade in order to deploy to correct blobfuse method for the cluster version.

> [!NOTE]
> When an operation is already in progress, any new operation on that same web service will respond with 409 conflict error. For example, If create or update web service operation is in progress and if you trigger a new Delete operation it will throw an error.

**Using the SDK**

The following code shows how to use the SDK to update the model, environment, and entry script for a web service:

[!INCLUDE [sdk v1](../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core import Environment
from azureml.core.webservice import Webservice
from azureml.core.model import Model, InferenceConfig

# Register new model.
new_model = Model.register(model_path="outputs/sklearn_mnist_model.pkl",
                           model_name="sklearn_mnist",
                           tags={"key": "0.1"},
                           description="test",
                           workspace=ws)

# Use version 3 of the environment.
deploy_env = Environment.get(workspace=ws,name="myenv",version="3")
inference_config = InferenceConfig(entry_script="score.py",
                                   environment=deploy_env)

service_name = 'myservice'
# Retrieve existing service.
service = Webservice(name=service_name, workspace=ws)



# Update to new model(s).
service.update(models=[new_model], inference_config=inference_config)
service.wait_for_deployment(show_output=True)
print(service.state)
print(service.get_logs())
```

**Using the CLI**

You can also update a web service by using the ML CLI. The following example demonstrates registering a new model and then updating a web service to use the new model:

[!INCLUDE [cli v1](../includes/machine-learning-cli-v1.md)]

```azurecli
az ml model register -n sklearn_mnist  --asset-path outputs/sklearn_mnist_model.pkl  --experiment-name myexperiment --output-metadata-file modelinfo.json
az ml service update -n myservice --model-metadata-file modelinfo.json
```

> [!TIP]
> In this example, a JSON document is used to pass the model information from the registration command into the update command.
>
> To update the service to use a new entry script or environment, create an [inference configuration file](reference-azure-machine-learning-cli.md#inference-configuration-schema) and specify it with the `ic` parameter.

For more information, see the [az ml service update](/cli/azure/ml(v1)/service#az-ml-v1--service-update) documentation.

## Next steps

* [Troubleshoot a failed deployment](how-to-troubleshoot-deployment.md)
* [Create client applications to consume web services](how-to-consume-web-service.md)
* [How to deploy a model using a custom Docker image](../how-to-deploy-custom-container.md)
* [Use TLS to secure a web service through Azure Machine Learning](how-to-secure-web-service.md)
* [Monitor your Azure Machine Learning models with Application Insights](how-to-enable-app-insights.md)
* [Collect data for models in production](how-to-enable-data-collection.md)
* [Create event alerts and triggers for model deployments](../how-to-use-event-grid.md)
