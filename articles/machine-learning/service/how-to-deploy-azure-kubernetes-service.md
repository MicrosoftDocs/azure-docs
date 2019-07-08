
# Deploy a model to an Azure Kubernetes Service cluster

Learn how to use the Azure Machine Learning service to deploy a model as a web service on Azure Kubernetes Service (AKS). Azure Kubernetes Service is good for high-scale production deployments. It provides fast response time and autoscaling of the deployed service.

> [!IMPORTANT]
> Cluter scaling is not provided through the Azure Machine Learning SDK. For more information on scaling the nodes in an AKS cluster, see [Scale the node count in an AKS cluster](/azure/aks/scale-cluster.md).

You can use an existing AKS cluster or create a new one using the Azure Machine Learning SDK, CLI, or the Azure portal.

## Prerequisites

- An Azure Machine Learning service workspace. For more information, see [Create an Azure Machine Learning service workspace](setup-create-workspace.md).

- A machine learning model registered in your workspace. If you don't have a registered model, see [How and where to deploy models](how-to-deploy-and-where.md).

- The [Azure CLI extension for Machine Learning service](reference-azure-machine-learning-cli.md), [Azure Machine Learning Python SDK](https://aka.ms/aml-sdk), or the [Azure Machine Learning Visual Studio Code extension](how-to-vscode-tools.md).

- The __Python__ code snippets in this article assume that the following variables are set:

    * `ws` - Set to your workspace.
    * `model` - Set to your registered model.
    * `inference_config` - Set to the inference configuration for the model.

    For more information on setting these, see [How and where to deploy models](how-to-deploy-and-where.md).

- The __CLI__ snippets in this article assume that you've created an `inferenceconfig.json` document. For more information on creating this document, see [How and where to deploy models](how-to-deploy-and-where.md).

## Create a new AKS cluster

**Time estimate**: Approximately 20 minutes.

Creating or attaching an AKS cluster is a one time process for your workspace. You can reuse this cluster for multiple deployments. If you delete the cluster or the resource group that contains it, you must create a new cluster the next time you need to deploy. You can have multiple AKS clusters attached to your workspace.

If you want to create an AKS cluster for __development__, __validation__, and __testing__ instead of production, you can specify the __cluster purpose__ to __dev test__.

The following examples demonstrate how to create a new AKS cluster using the SDK and CLI:

**Using the SDK**

```python
from azureml.core.compute import AksCompute, ComputeTarget

# Use the default configuration (you can also provide parameters to customize this).
# For example, to create a dev/test cluster, use:
# prov_config = AksCompute.provisioning_configuration(cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST)
prov_config = AksCompute.provisioning_configuration()

aks_name = 'myaks'
# Create the cluster
aks_target = ComputeTarget.create(workspace = ws,
                                    name = aks_name,
                                    provisioning_configuration = prov_config)

# Wait for the create process to complete
aks_target.wait_for_completion(show_output = True)
```

> [!IMPORTANT]
> For [`provisioning_configuration()`](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py), if you pick custom values for agent_count and vm_size, then you need to make sure agent_count multiplied by vm_size is greater than or equal to 12 virtual CPUs. For example, if you use a vm_size of "Standard_D3_v2", which has 4 virtual CPUs, then you should pick an agent_count of 3 or greater.
>
> The Azure Machine Learning SDK does not provide support scaling an AKS cluster. To scale the nodes in the cluster, use the UI for your AKS cluster in the Azure portal. You can only change the node count, not the VM size of the cluster.

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AksCompute.ClusterPurpose](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute.clusterpurpose?view=azure-ml-py)
* [AksCompute.provisioning_configuration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py#attach-configuration-resource-group-none--cluster-name-none--resource-id-none--cluster-purpose-none-)
* [ComputeTarget.create](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py#create-workspace--name--provisioning-configuration-)
* [ComputeTarget.wait_for_completion](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py#wait-for-completion-show-output-false-)

**Using the CLI**

```azurecli
az ml computetarget create aks -n myaks
```

For more information, see the [az ml computetarget create ask](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/create?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-create-aks) reference.

## Attach an existing AKS cluster

**Time estimate:** Approximately 5 minutes.

If you already have AKS cluster in your Azure subscription, and it is version 1.12.##, you can use it to deploy your image.

> [!WARNING]
> When attaching an AKS cluster to a workspace, you can define how you will use the cluster by setting the `cluster_purpose` parameter.
>
> If you do not set the `cluster_purpose` parameter, or set `cluster_purpose = AksCompute.ClusterPurpose.FAST_PROD`, then the cluster must have at least 12 virtual CPUs available.
>
> If you set `cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST`, then the cluster does not need to have 12 virtual CPUs. However a cluster that is configured for dev/test will not be suitable for production level traffic and may increase inference times.

For more information on creating an AKS cluster using the Azure CLI or portal, see the following articles:

* [Create an AKS cluster (CLI)](https://docs.microsoft.com/cli/azure/aks?toc=%2Fazure%2Faks%2FTOC.json&bc=%2Fazure%2Fbread%2Ftoc.json&view=azure-cli-latest#az-aks-create)
* [Create an AKS cluster (portal)](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal?view=azure-cli-latest)

The following examples demonstrate how to attach an existing AKS 1.12.## cluster to your workspace:

**Using the SDK**

```python
from azureml.core.compute import AksCompute, ComputeTarget
# Set the resource group that contains the AKS cluster and the cluster name
resource_group = 'myresourcegroup'
cluster_name = 'myexistingcluster'

# Attach the cluster to your workgroup. If the cluster has less than 12 virtual CPUs, use the following instead:
# attach_config = AksCompute.attach_configuration(resource_group = resource_group,
#                                         cluster_name = cluster_name,
#                                         cluster_purpose = AksCompute.ClusterPurpose.DEV_TEST)
attach_config = AksCompute.attach_configuration(resource_group = resource_group,
                                         cluster_name = cluster_name)
aks_target = ComputeTarget.attach(ws, 'myaks', attach_config)
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AksCompute.attach_configuration()](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.akscompute?view=azure-ml-py#attach-configuration-resource-group-none--cluster-name-none--resource-id-none--cluster-purpose-none-)
* [AksCompute.ClusterPurpose](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute.clusterpurpose?view=azure-ml-py)
* [AksCompute.attach](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.computetarget?view=azure-ml-py#attach-workspace--name--attach-configuration-)

**Using the CLI**

To attach an existing cluster using the CLI, you need to get the resource ID of the existing cluster. To get this value, use the following command. Replace `myexistingcluster` with the name of your AKS cluster. Replace `myresourcegroup` with the resource group that contains the cluster:

```azurecli
az aks show -n myexistingcluster -g myresourcegroup --query id
```

This command returns a value similar to the following text:

```text
/subscriptions/{GUID}/resourcegroups/{myresourcegroup}/providers/Microsoft.ContainerService/managedClusters/{myexistingcluster}
```

To attach the existing cluster to your workspace, use the following command. Replace `aksresourceid` with the value returned by the previous command. Replace `myresourcegroup` with the resource group that contains your workspace. Replace `myworkspace` with your workspace name.

```azurecli
az ml computetarget attach aks -n myaks -i aksresourceid -g myresourcegroup -w myworkspace
```

For more information, see the [az ml computetarget attach aks](https://docs.microsoft.com/cli/azure/ext/azure-cli-ml/ml/computetarget/attach?view=azure-cli-latest#ext-azure-cli-ml-az-ml-computetarget-attach-aks) reference.

## Deploy to AKS

To deploy a model to Azure Kubernetes Service, create a __deployment configuration__ that describes the compute resources needed. For example, number of cores and memory. You also need an __inference configuration__, which describes the environment needed to host the model and web service. For more information on creating the inference configuration, see [How and where to deploy models](how-to-deploy-and-where.md).

**Using the SDK**

```python
aks_target = AksCompute(ws,"myaks")
# If deploying to a cluster configured for dev/test, ensure that it was created with enough
# cores and memory to handle this deployment configuration. Note that memory is also used by
# things such as dependencies and AML components.
deployment_config = AksWebservice.deploy_configuration(cpu_cores = 1, memory_gb = 1)
service = Model.deploy(ws, "myservice", [model], inference_config, deployment_config, aks_target)
service.wait_for_deployment(show_output = True)
print(service.state)
print(service.get_logs())
```

For more information on the classes, methods, and parameters used in this example, see the following reference documents:

* [AksCompute](https://docs.microsoft.com/python/api/azureml-core/azureml.core.compute.aks.akscompute?view=azure-ml-py)
* [AksWebservice.deploy_configuration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aks.aksservicedeploymentconfiguration?view=azure-ml-py)
* [Model.deploy](https://docs.microsoft.com/python/api/azureml-core/azureml.core.model.model?view=azure-ml-py#deploy-workspace--name--models--inference-config--deployment-config-none--deployment-target-none-)
* [Webservice.wait_for_deployment](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice%28class%29?view=azure-ml-py#wait-for-deployment-show-output-false-)

**Using the CLI**

To deploy using the CLI, use the following command. Replace `myaks` with the name of the AKS compute target. Replace `mymodel:1` with the name and version of the registered model. Replace `myservice` with the name to give this service:

```azurecli-interactive
az ml model deploy -ct myaks -m mymodel:1 -n myservice -ic inferenceconfig.json -dc deploymentconfig.json
```

The entries in the `deploymentconfig.json` document map to the parameters for [AksWebservice.deploy_configuration](https://docs.microsoft.com/python/api/azureml-core/azureml.core.webservice.aks.aksservicedeploymentconfiguration?view=azure-ml-py). The following table describes the mapping between the entities in the JSON document and the parameters for the method:

| JSON entity | Method parameter | Description |
| ----- | ----- | ----- |
| `autoScaler` | NA | Contains configuration elements for autoscale. See the autoscaler table. |
| &emsp;&emsp;`autoscaleEnabled` | `autoscale_enabled` | Whether or not to enable autoscaling for the web service. If `numReplicas` = `0`, `True`; otherwise, `False`. |
| &emsp;&emsp;`minReplicas` | `autoscale_min_replicas` | The minimum number of containers to use when autoscaling this web service. Default, `1`. |
| &emsp;&emsp;`maxReplicas` | `autoscale_max_replicas` | The maximum number of containers to use when autoscaling this web servicee. Default, `10`. |
| &emsp;&emsp;`refreshPeriodInSeconds` | `autoscale_refresh_seconds` | How often the autoscaler attempts to scale this web service. Default, `1`. |
| &emsp;&emsp;`targetUtilization` | `autoscale_target_utilization` | The target utilization (in percent out of 100) that the autoscaler should attempt to maintain for this web service. Default, `70`. |
| `datacollection` | NA | Contains configuration elements for data collection. |
| &emsp;&emsp;`storageEnabled` | `collect_model_data` | Whether or not to enable model data collection for the web service. Default, `False`. |
| `authEnabled` | `auth_enabled` | Whether or not to enable authentication for the web service. Default, `True`. |
| `containerResourceRequirements` | NA | Contains configuration elements for the CPU and memory allocated for the container. |
| &emsp;&emsp;`cpu` | `cpu_cores` | The number of CPU cores to allocate for this web service. Defaults, `0.1` |
| &emsp;&emsp;`memoryInGb` | `memory_gb` | The amount of memory (in GB) to allocate for this web service. Default, `0.5` |
| `appInsightsEnabled` | `enable_app_insights` | Whether or not to enable Application Insights logging for the web service. Default, `False`. |
| `scoringTimeoutMs` | `scoring_timeeout_ms` | A timeout to enforce for scoring calls to the web service. Default, `60000`. |
| `maxConcurrentRequestsPerContainer` | `replica_max_concurrent_requests` | The maximum concurrent requests per node for this web service. Default, `1`. |
| `maxQueueWaitMs` | `max_request_wait_time` | The maximum time a request will stay in thee queue (in milliseconds) before a 503 error is returned. Default, `500`. |
| `numReplicas` | `num_replicas` | The number of containers to allocate for this web service. No default value. If this parameter is not set, the autoscaler is enabled by default. |
| `namespace` | `namespace` | The Kubernetes namespace that the webservice is deployed into. Up to 63 lowercase alphanumeric ('a'-'z', '0'-'9') and hyphen ('-') characters. The first and last characters cannot be hyphens. |

The following JSON is an example deployment configuration for use with the CLI:

```json
{
    "autoScaler":
    {
        "autoscaleEnabled": False,
        "minReplicas":,
        "maxReplicas":,
        "refreshPeriodInSeconds":,
        "targetUtilization":
    },
    "dataCollection": { "storageEnabled" },
    "authEnabled":,
    "containerResourceRequirements
}
```


**Using VS Code**

You can also [deploy to AKS via the VS Code extension](how-to-vscode-tools.md#deploy-and-manage-models), but you'll need to configure AKS clusters in advance.





