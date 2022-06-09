---
title: Configure Kubernetes cluster (Preview)
description: Configure and attach an existing Kubernetes in any infrastructure across on-premises and multi-cloud to build, train, and deploy models with seamless Azure ML experience.
titleSuffix: Azure Machine Learning
author: ssalgadodev
ms.author: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 11/23/2021
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Configure Kubernetes cluster for Azure Machine Learning (Preview)

Using Kubernetes with Azure Machine Learning enables you to build, train, and deploy models in any infrastructure on-premises and across multi-cloud. With an AzureML extension deployment on Kubernetes, you can instantly onboard teams of ML professionals with AzureML service capabilities. These services include full machine learning lifecycle and automation with MLOps in hybrid cloud and multi-cloud.

You can easily bring AzureML capabilities to your Kubernetes cluster from cloud or on-premises by deploying AzureML extension.

- For Azure Kubernetes Service (AKS) in Azure, deploy AzureML extension to the AKS directly. For more information, see [Deploy and manage cluster extensions for Azure Kubernetes Service (AKS)](../aks/cluster-extensions.md).
- For Kubernetes clusters on-premises or from other cloud providers, connect the cluster with Azure Arc first, then deploy AzureML extension to Azure Arc-enabled Kubernetes. For more information, see [Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md).

In this article, you can learn about steps to configure and attach an existing Kubernetes cluster anywhere for Azure Machine Learning:
* [Deploy AzureML extension to Kubernetes cluster](#deploy-azureml-extension)
* [Attach a Kubernetes cluster to AzureML workspace](#attach-a-kubernetes-cluster-to-an-azureml-workspace)

## Why use Azure Machine Learning Kubernetes?

AzureML Kubernetes is customer fully configured and managed compute for machine learning. It can be used as both [training compute target](./concept-compute-target.md#train) and [inference compute target](./concept-compute-target.md#deploy). It provides the following benefits:

- Harness existing heterogeneous or homogeneous Kubernetes cluster, with CPUs or GPUs.
- Share the same Kubernetes cluster in multiple AzureML Workspaces across region.
- Use the same Kubernetes cluster for different machine learning purposes, including model training, batch scoring, and real-time inference.
- Secure network communication between the cluster and cloud via Azure Private Link and Private Endpoint.
- Isolate team projects and machine learning workloads with Kubernetes node selector and namespace.
- [Target certain types of compute nodes and CPU/Memory/GPU resource allocation for training and inference workloads](./reference-kubernetes.md#create-and-use-instance-types-for-efficient-compute-resource-usage). 
- [Connect with custom data sources for machine learning workloads using Kubernetes PV and PVC ](./reference-kubernetes.md#azureml-jobs-connect-with-on-premises-data-storage). 

## Prerequisites

* A running Kubernetes cluster in [supported version and region](./reference-kubernetes.md#supported-kubernetes-version-and-region). **We recommend your cluster has a minimum of 4 vCPU cores and 8GB memory, around 2 vCPU cores and 3GB memory will be used by Azure Arc and AzureML extension components**.
* Other than Azure Kubernetes Services (AKS) cluster in Azure, connect your Kubernetes cluster to Azure Arc. Follow instructions in [connect existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).
   
    * If you have an AKS cluster in Azure, **Azure Arc connection is not required and not recommended**.
    
    * If you have Azure RedHat OpenShift Service (ARO) cluster or OpenShift Container Platform (OCP) cluster, follow another prerequisite step [here](./reference-kubernetes.md#prerequisites-for-aro-or-ocp-clusters) before AzureML extension deployment. 
* Cluster running behind an outbound proxy server or firewall needs additional network configurations. Fulfill the [network requirements](./how-to-access-azureml-behind-firewall.md#kubernetes-compute)
* Install or upgrade Azure CLI to version >=2.16.0
* Install the Azure CLI extension ```k8s-extension``` (version>=1.2.3) by running ```az extension add --name k8s-extension```


## What is AzureML extension

AzureML extension consists of a set of system components deployed to your Kubernetes cluster in `azureml` namespace, so you can enable your cluster to run an AzureML workload - model training jobs or model endpoints. You can use an Azure CLI command ```k8s-extension create``` to deploy AzureML extension. General available (GA) version of AzureML extension >= 1.1.1

For a detailed list of AzureML extension system components, see [AzureML extension components](./reference-kubernetes.md#azureml-extension-components).

## Key considerations for AzureML extension deployment

AzureML extension allows you to specify configuration settings needed for different workload support at deployment time. Before AzureML extension deployment, **read following carefully to avoid unnecessary extension deployment errors**:

  * Type of workload to enable for your cluster. ```enableTraining``` and ```enableInference``` config settings are your convenient choices here; `enableTraining` will enable **training** and **batch scoring** workload, `enableInference` will enable **real-time inference** workload. 
  * For inference workload support, it requires ```azureml-fe``` router service to be deployed for routing incoming inference requests to model pod, and you would need to specify ```inferenceRouterServiceType``` config setting for ```azureml-fe```. ```azureml-fe``` can be deployed with one of following ```inferenceRouterServiceType```:
      * Type ```LoadBalancer```. Exposes ```azureml-fe``` externally using a cloud provider's load balancer. To specify this value, ensure that your cluster supports load balancer provisioning. Note most on-premises Kubernetes clusters might not support external load balancer.
      * Type ```NodePort```. Exposes ```azureml-fe``` on each Node's IP at a static port. You'll be able to contact ```azureml-fe```, from outside of cluster, by requesting ```<NodeIP>:<NodePort>```. Using ```NodePort``` also allows you to set up your own load balancing solution and SSL termination for ```azureml-fe```.
      * Type ```ClusterIP```. Exposes ```azureml-fe``` on a cluster-internal IP, and it makes ```azureml-fe``` only reachable from within the cluster. For ```azureml-fe``` to serve inference requests coming outside of cluster, it requires you to set up your own load balancing solution and SSL termination for ```azureml-fe```. 
   * For inference workload support, to ensure high availability of ```azureml-fe``` routing service, AzureML extension deployment by default creates 3 replicas of ```azureml-fe``` for clusters having 3 nodes or more. If your cluster has **less than 3 nodes**, set ```inferenceLoadbalancerHA=False```.
   * For inference workload support, you would also want to consider using **HTTPS** to restrict access to model endpoints and secure the data that clients submit. For this purpose, you would need to specify either ```sslSecret``` config setting or combination of ```sslKeyPemFile``` and ```sslCertPemFile``` config settings. By default, AzureML extension deployment expects **HTTPS** support required, and you would need to provide above config setting. For development or test purposes, **HTTP** support is conveniently supported through config setting ```allowInsecureConnections=True```.

For a complete list of configuration settings available to choose at AzureML deployment time, see [Review AzureML extension config settings](#review-azureml-extension-configuration-settings)

## Deploy AzureML extension
### [CLI](#tab/deploy-extension-with-cli)
To deploy AzureML extension with CLI, use `az k8s-extension create` command passing in values for the mandatory parameters.

We list 4 typical extension deployment scenarios for reference. To deploy extension for your production usage, please carefully read the complete list of [configuration settings](#review-azureml-extension-configuration-settings).

- **Use AKS in Azure for a quick Proof of Concept, both training and inference workloads support**

   Ensure you have fulfilled [prerequisites](#prerequisites). For AzureML extension deployment on AKS, make sure to specify ```managedClusters``` value for ```--cluster-type``` parameter. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer allowInsecureConnections=True inferenceLoadBalancerHA=False --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

- **Use Kubernetes at your lab for a quick Proof of Concept, training workload support only**

   Ensure you have fulfilled [prerequisites](#prerequisites). For AzureML extension deployment on Azure Arc connected cluster, you would need to specify ```connectedClusters``` value for ```--cluster-type``` parameter. Run following simple Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

- **Enable an AKS cluster in Azure for production training and inference workload**
   Ensure you have fulfilled [prerequisites](#prerequisites). For AzureML extension deployment on AKS, make sure to specify ```managedClusters``` value for ```--cluster-type``` parameter. Assuming your cluster has more than 3 nodes, and you will use an Azure public load balancer and HTTPS for inference workload support, run following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer sslCname=<ssl cname> --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```
- **Enable an Azure Arc connected cluster anywhere for production training and inference workload using NVIDIA GPUs**

   Ensure you have fulfilled [prerequisites](#prerequisites). For AzureML extension deployment on Azure Arc connected cluster, make sure to specify ```connectedClusters``` value for ```--cluster-type``` parameter. Assuming your cluster has more than 3 nodes, you will use a NodePort service type and HTTPS for inference workload support, run following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=NodePort sslCname=<ssl cname> installNvidiaDevicePlugin=True installDcgmExporter=True --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

### [Azure portal](#tab/portal)

The UI experience to deploy extension is only available for **Azure Arc-enabled Kubernetes**. If you have an AKS cluster without Azure Arc connected, you need to use CLI to deploy AzureML extension.

1. In the [Azure portal](https://ms.portal.azure.com/#home), navigate to **Kubernetes - Azure Arc** and select your cluster.
1. Select **Extensions** (under **Settings**), and then select **+ Add**.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui.png" alt-text="Screenshot of adding new extension to the Arc-enabled Kubernetes cluster from Azure portal.":::

1. From the list of available extensions, select **Azure Machine Learning extension** to deploy the latest version of the extension.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-extension-list.png" alt-text="Screenshot of selecting AzureML extension from Azure portal.":::

1. Follow the prompts to deploy the extension. You can customize the installation by configuring the installtion in the tab of **Basics**, **Configurations** and **Advanced**.  For a detailed list of AzureML extension configuration settings, see [AzureML extension configuration settings](#review-azureml-extension-configuration-settings).

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-settings.png" alt-text="Screenshot of configuring AzureML extension settings from Azure portal.":::
1. On the **Review + create** tab, select **Create**.
   
   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-create.png" alt-text="Screenshot of deploying new extension to the Arc-enabled Kubernetes cluster from Azure portal.":::

1. After the deployment completes, you are able to see the AzureML extension in **Extension** page.  If the extension installation succeeds, you can see **Installed** for the **Install status**.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-extension-detail.png" alt-text="Screenshot of installed AzureML extensions listing in Azure portal.":::

### Verify AzureML extension deployment

1. Run the following CLI command to check AzureML extension details:

   ```azurecli
   az k8s-extension show --name <extension-name> --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group>
   ```

1. In the response, look for "name" and "provisioningState": "Succeeded". Note it might show "provisioningState": "Pending" for the first few minutes.

1. If the provisioningState shows Succeeded, run the following command on your machine with the kubeconfig file pointed to your cluster to check that all pods under "azureml" namespace are in 'Running' state:

   ```bash
    kubectl get pods -n azureml
   ```

### Manage AzureML extension

Update, list, show and delete an AzureML extension.

- For AKS cluster without Azure Arc connected, refer to  [Usage of AKS extensions](../aks/cluster-extensions.md#usage-of-cluster-extensions).
- For Azure Arc-enabled Kubernetes, refer to [Usage of cluster extensions](../azure-arc/kubernetes/extensions.md#usage-of-cluster-extensions).

---

## Review AzureML extension configuration settings

For AzureML extension deployment configurations, use ```--config``` or ```--config-protected``` to specify list of ```key=value``` pairs. Following is the list of configuration settings available to be used for different AzureML extension deployment scenario ns.

|Configuration Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   |```enableTraining``` |```True``` or ```False```, default ```False```. **Must** be set to ```True``` for AzureML extension deployment with Machine Learning model training support.  |  **&check;**| N/A |  **&check;** |
   | ```enableInference``` |```True``` or ```False```, default ```False```.  **Must** be set to ```True``` for AzureML extension deployment with Machine Learning inference support. |N/A| **&check;** |  **&check;** |
   | ```allowInsecureConnections``` |```True``` or ```False```, default `False`. **Must** be set to ```True``` to use inference HTTP endpoints for development or test purposes. |N/A| Optional |  Optional |
   | ```inferenceRouterServiceType``` |```loadBalancer```, ```nodePort``` or ```clusterIP```.  **Required** if ```enableInference=True```. | N/A| **&check;** |   **&check;** |
   | ```internalLoadBalancerProvider``` | This config is only applicable for Azure Kubernetes Service(AKS) cluster now. Set to ```azure``` to allow the inference router using internal load balancer.  | N/A| Optional |  Optional |
   |```sslSecret```| The name of Kubernetes secret in `azureml` namespace to store `cert.pem` (PEM-encoded SSL cert) and `key.pem` (PEM-encoded SSL key), required for inference  HTTPS endpoint support, when  ``allowInsecureConnections`` is set to False. You can find a sample YAML definition of sslSecret [here](./reference-kubernetes.md#sample-yaml-definition-of-kubernetes-secret-for-tlsssl). Use this config or combination of `sslCertPemFile` and `sslKeyPemFile` protected config settings. |N/A| Optional |  Optional |
   |```sslCname``` |A SSL CName used by inference HTTPS endpoint. **Required** if ```allowInsecureConnections=True```  |  N/A | Optional | Optional|
   | ```inferenceRouterHA``` |```True``` or ```False```, default ```True```. By default, AzureML extension will deploy 3 ingress controller replicas for high availability, which requires at least 3 workers in a cluster. Set to ```False``` if your cluster has fewer than 3 workers, in this case only one ingress controller is deployed. | N/A| Optional |  Optional |
   |```nodeSelector``` | By default, the deployed kubernetes resources are randomly deployed to 1 or more nodes of the cluster, and daemonset resources are deployed to ALL nodes. If you want to restrict the extension deployment to specific nodes with label `key1=value1` and `key2=value2`, use `nodeSelector.key1=value1`, `nodeSelector.key2=value2` correspondingly. | Optional| Optional |  Optional |
   |```installNvidiaDevicePlugin```  | ```True``` or ```False```, default ```False```. [NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin#nvidia-device-plugin-for-kubernetes) is required for ML workloads on NVIDIA GPU hardware. By default, AzureML extension deployment will not install NVIDIA Device Plugin regardless Kubernetes cluster has GPU hardware or not. User can specify this setting to ```True```, to install it, but make sure to fulfill [Prerequisites](https://github.com/NVIDIA/k8s-device-plugin#prerequisites). | Optional |Optional |Optional |
   |```installPromOp```|```True``` or ```False```, default ```True```. AzureML extension needs prometheus operator to manage prometheus. Set to ```False``` to reuse existing prometheus operator. Compatible [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md) helm chart versions are from 9.3.4 to 30.0.1.| Optional| Optional |  Optional |
 |```installVolcano```| ```True``` or ```False```, default ```True```. AzureML extension needs volcano scheduler to schedule the job. Set to ```False``` to reuse existing volcano scheduler. Supported volcano scheduler versions are 1.4, 1.5. | Optional| N/A |  Optional |
 |```installDcgmExporter```  |```True``` or ```False```, default ```False```. Dcgm-exporter can expose GPU metrics for AzureML workloads, which can be monitored in Azure portal. Set ```installDcgmExporter```  to ```True``` to install dcgm-exporter. But if you want to utilize your own dcgm-exporter, refer to [DCGM exporter](https://github.com/Azure/AML-Kubernetes/blob/master/docs/troubleshooting.md#dcgm) |Optional |Optional |Optional |


   |Configuration Protected Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   | ```sslCertPemFile```, ```sslKeyPemFile``` |Path to SSL certificate and key file (PEM-encoded), required for AzureML extension deployment with inference HTTPS endpoint support, when  ``allowInsecureConnections`` is set to False. | N/A| Optional |  Optional |
   
## Attach a Kubernetes cluster to an AzureML workspace

Attach an AKS or Arc-enabled Kubernetes cluster with AzureML extension installed to AzureML workspace. The same cluster can be attached and shared by multiple AzureMl Workspaces across region.

### Prerequisite

Azure Machine Learning workspace defaults to having a system-assigned managed identity to access Azure ML resources. The steps are completed if the system assigned default setting is on. 


Otherwise, if a user-assigned managed identity is specified in Azure Machine Learning workspace creation, the following role assignments need to be granted to the managed identity manually before attaching the compute.

|Azure resource name |Role to be assigned|Description|
|--|--|--|
|Azure Relay|Azure Relay Owner|Only applicable for Arc-enabled Kubernetes cluster. Azure Relay isn't created for AKS cluster without Arc connected.|
|Azure Arc-enabled Kubernetes|Reader|Applicable for both Arc-enabled Kubernetes cluster and AKS cluster.|

Azure Relay resource is created during the extension deployment under the same Resource Group as the Arc-enabled Kubernetes cluster.


### [CLI](#tab/cli)

[!INCLUDE [cli v2](../../includes/machine-learning-cli-v2.md)]

The following commands show how to attach an AKS and Azure Arc-enabled Kubernetes cluster, and use it as a compute target with managed identity enabled.

**AKS**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name k8s-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerService/managedclusters/<cluster-name>" --identity-type SystemAssigned --namespace <Kubernetes namespace to run AzureML workloads> --no-wait
```

**Azure Arc enabled Kubernetes**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name amlarc-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/connectedClusters/<cluster-name>" --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

Set the `--type` argument to `Kubernetes`. Use the `identity_type` argument to enable `SystemAssigned` or `UserAssigned` managed identities.

> [!IMPORTANT]
> `--user-assigned-identities` is only required for `UserAssigned` managed identities. Although you can provide a list of comma-separated user managed identities, only the first one is used when you attach your cluster.

### [Python](#tab/python)

[!INCLUDE [sdk v1](../../includes/machine-learning-sdk-v1.md)]

```python
from azureml.core.compute import KubernetesCompute, ComputeTarget

# Specify a name for your Kubernetes compute
compute_target_name = "<kubernetes compute target name>"

# resource ID of the Arc-enabled Kubernetes cluster
cluster_resource_id = "/subscriptions/<sub ID>/resourceGroups/<RG>/providers/Microsoft.Kubernetes/connectedClusters/<cluster name>"

user_assigned_identity_resouce_id = ['subscriptions/<sub ID>/resourceGroups/<RG>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity name>']

# Specify Kubernetes namespace to run AzureML workloads
ns = "default" 

try:
    compute_target = ComputeTarget(workspace=ws, name=compute_target_name)
    print('Found existing cluster, use it.')
except ComputeTargetException:
    attach_configuration = KubernetesCompute.attach_configuration(resource_id = cluster_resource_id, namespace = ns,  identity_type ='UserAssigned',identity_ids = user_assigned_identity_resouce_id)
    compute_target = ComputeTarget.attach(ws, compute_target_name, attach_configuration)
    compute_target.wait_for_completion(show_output=True)
```
### [Studio](#tab/studio)

Attaching an Azure Arc-enabled Kubernetes cluster makes it available to your workspace for training.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Compute**.
1. Select the **Attached computes** tab.
1. Select **+New > Kubernetes**

   :::image type="content" source="media/how-to-attach-arc-kubernetes/attach-kubernetes-cluster.png" alt-text="Screenshot of settings for Kubernetes cluster to make available in your workspace.":::

1. Enter a compute name and select your Azure Arc-enabled Kubernetes cluster from the dropdown.

    * **(Optional)** Enter Kubernetes namespace, which defaults to `default`. All machine learning workloads will be sent to the specified Kubernetes namespace in the cluster.

    * **(Optional)** Assign system-assigned or user-assigned managed identity. Managed identities eliminate the need for developers to manage credentials. For more information, see [managed identities overview](../active-directory/managed-identities-azure-resources/overview.md) .

    :::image type="content" source="media/how-to-attach-arc-kubernetes/configure-kubernetes-cluster-2.png" alt-text="Screenshot of settings for developer configuration of Kubernetes cluster.":::

1. Select **Attach**

    In the Attached compute tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    :::image type="content" source="media/how-to-attach-arc-kubernetes/provision-resources.png" alt-text="Screenshot of attached settings for configuration of Kubernetes cluster.":::
   
---

## Next steps

- [Create and use instance types for efficient compute resource usage](./reference-kubernetes.md#create-and-use-instance-types-for-efficient-compute-resource-usage)
- [Train models with CLI v2](how-to-train-cli.md)
- [Train models with Python SDK](how-to-set-up-training-targets.md)
- [Deploy model with an online endpoint (CLI v2)](./how-to-deploy-managed-online-endpoints.md)
- [Use batch endpoint for batch scoring (CLI v2)](./how-to-use-batch-endpoint.md)

### Examples

All AzureML examples can be found in [https://github.com/Azure/azureml-examples.git](https://github.com/Azure/azureml-examples).

For any AzureML example, you only need to update the compute target name to your Kubernetes compute target, then you are all done. 
* Explore training job samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/jobs](https://github.com/Azure/azureml-examples/tree/main/cli/jobs)
* Explore model deployment with online endpoint samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes)
* Explore batch endpoint samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch)
* Explore training job samples with SDK v2 -[https://github.com/Azure/azureml-examples/tree/main/sdk/jobs](https://github.com/Azure/azureml-examples/tree/main/sdk/jobs)
* Explore model deployment with online endpoint samples with SDK v2 -[https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints/online/kubernetes](https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints/online/kubernetes)