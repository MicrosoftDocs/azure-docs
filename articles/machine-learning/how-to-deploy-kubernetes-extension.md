---
title: Deploy AzureML extension on Kubernetes cluster
description: Learn about the AzureML extension, available configuration settings and different deployment scenarios, and verify and managed AzureML extension
titleSuffix: Azure Machine Learning
author: bozhong68
ms.author: bozhlin
ms.reviewer: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 08/31/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
---

# Deploy AzureML extension on AKS or Arc Kubernetes cluster

To enable your AKS or Arc Kubernetes cluster to run training jobs or inference workloads, you must first deploy the AzureML extension on an AKS or Arc Kubernetes cluster. The AzureML extension is built on the [cluster extension for AKS](../aks/cluster-extensions.md) and [cluster extension or Arc Kubernetes](../azure-arc/kubernetes/conceptual-extensions.md), and its lifecycle can be managed easily with Azure CLI [k8s-extension](/cli/azure/k8s-extension).

In this article, you can learn:
> [!div class="checklist"]
> * Prerequisites
> * Limitations
> * Review AzureML extension config settings 
> * AzureML extension deployment scenarios
> * Verify AzureML extension deployment
> * Review AzureML extension components
> * Manage AzureML extension

## Prerequisites

* An AKS cluster is up and running in Azure.
  * If you have not previously used cluster extensions, you need to [register the KubernetesConfiguration service provider](../aks/dapr.md#register-the-kubernetesconfiguration-service-provider).
* Or an Arc Kubernetes cluster is up and running. Follow instructions in [connect existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).
  * If the cluster is an Azure RedHat OpenShift Service (ARO) cluster or OpenShift Container Platform (OCP) cluster, you must satisfy other prerequisite steps as documented in the [Reference for configuring Kuberenetes cluster](./reference-kubernetes.md#prerequisites-for-aro-or-ocp-clusters) article.
* The Kubernetes cluster must have minimum of 4 vCPU cores and 8-GB memory.
* Cluster running behind an outbound proxy server or firewall needs extra [network configurations](./how-to-access-azureml-behind-firewall.md#kubernetes-compute)
* Install or upgrade Azure CLI to version 2.24.0 or higher.
* Install or upgrade Azure CLI extension `k8s-extension` to version 1.2.3 or higher.
  

## Limitations

- [Using a service principal with AKS](../aks/kubernetes-service-principal.md) is **not supported** by Azure Machine Learning. The AKS cluster must use a **system-assigned managed identity** instead.
- [Disabling local accounts](../aks/managed-aad.md#disable-local-accounts) for AKS is **not supported**  by Azure Machine Learning. When the AKS Cluster is deployed, local accounts are enabled by default.
- If your AKS cluster has an [Authorized IP range enabled to access the API server](../aks/api-server-authorized-ip-ranges.md), enable the AzureML control plane IP ranges for the AKS cluster. The AzureML control plane is deployed across paired regions. Without access to the API server, the machine learning pods can't be deployed. Use the [IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=56519) for both the [paired regions](../availability-zones/cross-region-replication-azure.md) when enabling the IP ranges in an AKS cluster.
- If you've previously followed the steps from [AzureML AKS v1 document](./v1/how-to-create-attach-kubernetes.md) to create or attach your AKS as inference cluster, use the following link to [clean up the legacy azureml-fe related resources](./v1/how-to-create-attach-kubernetes.md#delete-azureml-fe-related-resources) before you continue the next step. 

## Review AzureML extension configuration settings

You can use AzureML CLI command `k8s-extension create` to deploy AzureML extension. CLI `k8s-extension create` allows you to specify a set of configuration settings in `key=value` format using `--config` or `--config-protected` parameter. Following is the list of available configuration settings to be specified during AzureML extension deployment.

|Configuration Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   |`enableTraining` |`True` or `False`, default `False`. **Must** be set to `True` for AzureML extension deployment with Machine Learning model training and batch scoring support.  |  **&check;**| N/A |  **&check;** |
   | `enableInference` |`True` or `False`, default `False`.  **Must** be set to `True` for AzureML extension deployment with Machine Learning inference support. |N/A| **&check;** |  **&check;** |
   | `allowInsecureConnections` |`True` or `False`, default `False`. **Can** be set to `True` to use inference HTTP endpoints for development or test purposes. |N/A| Optional |  Optional |
   | `inferenceRouterServiceType` |`loadBalancer`, `nodePort` or `clusterIP`.  **Required** if `enableInference=True`. | N/A| **&check;** |   **&check;** |
   | `internalLoadBalancerProvider` | This config is only applicable for Azure Kubernetes Service(AKS) cluster now. Set to `azure` to allow the inference router using internal load balancer.  | N/A| Optional |  Optional |
   |`sslSecret`| The name of Kubernetes secret in `azureml` namespace to store `cert.pem` (PEM-encoded TLS/SSL cert) and `key.pem` (PEM-encoded TLS/SSL key), required for inference  HTTPS endpoint support, when  ``allowInsecureConnections`` is set to False. You can find a sample YAML definition of sslSecret [here](./reference-kubernetes.md#sample-yaml-definition-of-kubernetes-secret-for-tlsssl). Use this config or combination of `sslCertPemFile` and `sslKeyPemFile` protected config settings. |N/A| Optional |  Optional |
   |`sslCname` |An TLS/SSL CName is used by inference HTTPS endpoint. **Required** if `allowInsecureConnections=False`  |  N/A | Optional | Optional|
   | `inferenceRouterHA` |`True` or `False`, default `True`. By default, AzureML extension will deploy three inference router replicas for high availability, which requires at least three worker nodes in a cluster. Set to `False` if your cluster has fewer than three worker nodes, in this case only one inference router service is deployed. | N/A| Optional |  Optional |
   |`nodeSelector` | By default, the deployed kubernetes resources are randomly deployed to one or more nodes of the cluster, and daemonset resources are deployed to ALL nodes. If you want to restrict the extension deployment to specific nodes with label `key1=value1` and `key2=value2`, use `nodeSelector.key1=value1`, `nodeSelector.key2=value2` correspondingly. | Optional| Optional |  Optional |
   |`installNvidiaDevicePlugin`  | `True` or `False`, default `False`. [NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin#nvidia-device-plugin-for-kubernetes) is required for ML workloads on NVIDIA GPU hardware. By default, AzureML extension deployment won't install NVIDIA Device Plugin regardless Kubernetes cluster has GPU hardware or not. User can specify this setting to `True`, to install it, but make sure to fulfill [Prerequisites](https://github.com/NVIDIA/k8s-device-plugin#prerequisites). | Optional |Optional |Optional |
   |`installPromOp`|`True` or `False`, default `True`. AzureML extension needs prometheus operator to manage prometheus. Set to `False` to reuse the existing prometheus operator. For more information about reusing the existing  prometheus operator, refer to [reusing the prometheus operator](./how-to-troubleshoot-kubernetes-extension.md#prometheus-operator)| Optional| Optional |  Optional |
   |`installVolcano`| `True` or `False`, default `True`. AzureML extension needs volcano scheduler to schedule the job. Set to `False` to reuse existing volcano scheduler. For more information about reusing the existing volcano scheduler, refer to [reusing volcano scheduler](./how-to-troubleshoot-kubernetes-extension.md#volcano-scheduler)   | Optional| N/A |  Optional |
   |`installDcgmExporter`  |`True` or `False`, default `False`. Dcgm-exporter can expose GPU metrics for AzureML workloads, which can be monitored in Azure portal. Set `installDcgmExporter`  to `True` to install dcgm-exporter. But if you want to utilize your own dcgm-exporter, refer to [DCGM exporter](./how-to-troubleshoot-kubernetes-extension.md#dcgm-exporter) |Optional |Optional |Optional |


   |Configuration Protected Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   | `sslCertPemFile`, `sslKeyPemFile` |Path to TLS/SSL certificate and key file (PEM-encoded), required for AzureML extension deployment with inference HTTPS endpoint support, when  ``allowInsecureConnections`` is set to False. **Note** PEM file with pass phrase protected isn't supported | N/A| Optional |  Optional |

As you can see from above configuration settings table, the combinations of different configuration settings allow you to deploy AzureML extension for different ML workload scenarios:

  * For training job and batch inference workload, specify `enableTraining=True`
  * For inference workload only, specify `enableInference=True`
  * For all kinds of ML workload, specify both `enableTraining=True` and `enableInference=True`

If you plan to deploy AzureML extension for real-time inference workload and want to specify `enableInference=True`, pay attention to following configuration settings related to real-time inference workload:

  * `azureml-fe` router service is required for real-time inference support and you need to specify `inferenceRouterServiceType` config setting for `azureml-fe`. `azureml-fe` can be deployed with one of following `inferenceRouterServiceType`:
      * Type `LoadBalancer`. Exposes `azureml-fe` externally using a cloud provider's load balancer. To specify this value, ensure that your cluster supports load balancer provisioning. Note most on-premises Kubernetes clusters might not support external load balancer.
      * Type `NodePort`. Exposes `azureml-fe` on each Node's IP at a static port. You'll be able to contact `azureml-fe`, from outside of cluster, by requesting `<NodeIP>:<NodePort>`. Using `NodePort` also allows you to set up your own load balancing solution and TLS/SSL termination for `azureml-fe`.
      * Type `ClusterIP`. Exposes `azureml-fe` on a cluster-internal IP, and it makes `azureml-fe` only reachable from within the cluster. For `azureml-fe` to serve inference requests coming outside of cluster, it requires you to set up your own load balancing solution and TLS/SSL termination for `azureml-fe`. 
   * To ensure high availability of `azureml-fe` routing service, AzureML extension deployment by default creates three replicas of `azureml-fe` for clusters having three nodes or more. If your cluster has **less than 3 nodes**, set `inferenceLoadbalancerHA=False`.
   * You also want to consider using **HTTPS** to restrict access to model endpoints and secure the data that clients submit. For this purpose, you would need to specify either `sslSecret` config setting or combination of `sslKeyPemFile` and `sslCertPemFile` config-protected settings. 
   * By default, AzureML extension deployment expects config settings for **HTTPS** support. For development or testing purposes, **HTTP** support is conveniently provided through config setting `allowInsecureConnections=True`.

## AzureML extension deployment - CLI examples and Azure portal

### [Azure CLI](#tab/deploy-extension-with-cli)
To deploy AzureML extension with CLI, use `az k8s-extension create` command passing in values for the mandatory parameters.

We list four typical extension deployment scenarios for reference. To deploy extension for your production usage, carefully read the complete list of [configuration settings](#review-azureml-extension-configuration-settings).

- **Use AKS cluster in Azure for a quick proof of concept to run all kinds of ML workload, i.e., to run training jobs or to deploy models as online/batch endpoints**

   For AzureML extension deployment on AKS cluster, make sure to specify `managedClusters` value for `--cluster-type` parameter. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer allowInsecureConnections=True inferenceLoadBalancerHA=False --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

- **Use Arc Kubernetes cluster outside of Azure for a quick proof of concept, to run training jobs only**

   For AzureML extension deployment on [Arc Kubernetes](../azure-arc/kubernetes/overview.md) cluster, you would need to specify `connectedClusters` value for `--cluster-type` parameter. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

- **Enable an AKS cluster in Azure for production training and inference workload**
   For AzureML extension deployment on AKS, make sure to specify `managedClusters` value for `--cluster-type` parameter. Assuming your cluster has more than three nodes, and you'll use an Azure public load balancer and HTTPS for inference workload support. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer sslCname=<ssl cname> --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```
- **Enable an [Arc Kubernetes](../azure-arc/kubernetes/overview.md) cluster anywhere for production training and inference workload using NVIDIA GPUs**

   For AzureML extension deployment on [Arc Kubernetes](../azure-arc/kubernetes/overview.md) cluster, make sure to specify `connectedClusters` value for `--cluster-type` parameter. Assuming your cluster has more than three nodes, you'll use a NodePort service type and HTTPS for inference workload support, run following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=NodePort sslCname=<ssl cname> installNvidiaDevicePlugin=True installDcgmExporter=True --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

### [Azure portal](#tab/portal)

The UI experience to deploy extension is only available for **[Arc Kubernetes](../azure-arc/kubernetes/overview.md)**. If you have an AKS cluster without Azure Arc connection, you need to use CLI to deploy AzureML extension.

1. In the [Azure portal](https://portal.azure.com/#home), navigate to **Kubernetes - Azure Arc** and select your cluster.
1. Select **Extensions** (under **Settings**), and then select **+ Add**.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui.png" alt-text="Screenshot of adding new extension to the Arc-enabled Kubernetes cluster from Azure portal.":::

1. From the list of available extensions, select **Azure Machine Learning extension** to deploy the latest version of the extension.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-extension-list.png" alt-text="Screenshot of selecting AzureML extension from Azure portal.":::

1. Follow the prompts to deploy the extension. You can customize the installation by configuring the installation in the tab of **Basics**, **Configurations** and **Advanced**.  For a detailed list of AzureML extension configuration settings, see [AzureML extension configuration settings](#review-azureml-extension-configuration-settings).

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-settings.png" alt-text="Screenshot of configuring AzureML extension settings from Azure portal.":::
1. On the **Review + create** tab, select **Create**.
   
   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-create.png" alt-text="Screenshot of deploying new extension to the Arc-enabled Kubernetes cluster from Azure portal.":::

1. After the deployment completes, you're able to see the AzureML extension in **Extension** page.  If the extension installation succeeds, you can see **Installed** for the **Install status**.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-extension-detail.png" alt-text="Screenshot of installed AzureML extensions listing in Azure portal.":::

---

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

## Review AzureML extension component

Upon AzureML extension deployment completes, you can use `kubectl get deployments -n azureml` to see list of resources created in the cluster. It usually consists a subset of following resources per configuration settings specified. 

   |Resource name  |Resource type |Training |Inference |Training and Inference| Description | Communication with cloud|
   |--|--|--|--|--|--|--|
   |relayserver|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Relayserver is only created for Arc Kubernetes cluster, and **not** in AKS cluster. Relayserver works with Azure Relay to communicate with the cloud services.|Receive the request of job creation, model deployment from cloud service; sync the job status with cloud service.|
   |gateway|Kubernetes deployment|**&check;**|**&check;**|**&check;**|The gateway is used to communicate and send data back and forth.|Send nodes and cluster resource information to cloud services.|
   |aml-operator|Kubernetes deployment|**&check;**|N/A|**&check;**|Manage the lifecycle of training jobs.| Token exchange with the cloud token service for authentication and authorization of Azure Container Registry.|
   |metrics-controller-manager|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Manage the configuration for Prometheus|N/A|
   |{EXTENSION-NAME}-kube-state-metrics|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Export the cluster-related metrics to Prometheus.|N/A|
   |{EXTENSION-NAME}-prometheus-operator|Kubernetes deployment|Optional|Optional|Optional| Provide Kubernetes native deployment and management of Prometheus and related monitoring components.|N/A|
   |amlarc-identity-controller|Kubernetes deployment|N/A|**&check;**|**&check;**|Request and renew Azure Blob/Azure Container Registry token through managed identity.|Token exchange with the cloud token service for authentication and authorization of Azure Container  Registry and Azure Blob used by inference/model deployment.|
   |amlarc-identity-proxy|Kubernetes deployment|N/A|**&check;**|**&check;**|Request and renew Azure Blob/Azure Container Registry token  through managed identity.|Token exchange with the cloud token service for authentication and authorization of Azure Container  Registry and Azure Blob used by inference/model deployment.|
   |azureml-fe-v2|Kubernetes deployment|N/A|**&check;**|**&check;**|The front-end component that routes incoming inference requests to deployed services.|Send service logs to Azure Blob.|
   |inference-operator-controller-manager|Kubernetes deployment|N/A|**&check;**|**&check;**|Manage the lifecycle of inference endpoints. |N/A|
   |volcano-admission|Kubernetes deployment|Optional|N/A|Optional|Volcano admission webhook.|N/A|
   |volcano-controllers|Kubernetes deployment|Optional|N/A|Optional|Manage the lifecycle of Azure Machine Learning training job pods.|N/A|
   |volcano-scheduler |Kubernetes deployment|Optional|N/A|Optional|Used to perform in-cluster job scheduling.|N/A|
   |fluent-bit|Kubernetes daemonset|**&check;**|**&check;**|**&check;**|Gather the components' system log.| Upload the components' system log to cloud.|
   |{EXTENSION-NAME}-dcgm-exporter|Kubernetes daemonset|Optional|Optional|Optional|dcgm-exporter exposes GPU metrics for Prometheus.|N/A|
   |nvidia-device-plugin-daemonset|Kubernetes daemonset|Optional|Optional|Optional|nvidia-device-plugin-daemonset exposes GPUs on each node of your cluster| N/A|
   |prometheus-prom-prometheus|Kubernetes statefulset|**&check;**|**&check;**|**&check;**|Gather and send job metrics to cloud.|Send job metrics like cpu/gpu/memory utilization to cloud.|

> [!IMPORTANT]
   > * Azure Relay resource  is under the same resource group as the Arc cluster resource. It is used to communicate with the Kubernetes cluster and modifying them will break attached compute targets.
   > * By default, the kubernetes deployment resources are randomly deployed to 1 or more nodes of the cluster, and daemonset resources are deployed to ALL nodes. If you want to restrict the extension deployment to specific nodes, use `nodeSelector` configuration setting described as below.

> [!NOTE]
   > * **{EXTENSION-NAME}:** is the extension name specified with `az k8s-extension create --name` CLI command. 


### Manage AzureML extension

Update, list, show and delete an AzureML extension.

- For AKS cluster without Azure Arc connected, refer to  [Usage of AKS extensions](../aks/cluster-extensions.md#usage-of-cluster-extensions).
- For Azure Arc-enabled Kubernetes, refer to [Usage of cluster extensions](../azure-arc/kubernetes/extensions.md#usage-of-cluster-extensions).


## Next steps

- [Step 2: Attach Kubernetes cluster to workspace](how-to-attach-kubernetes-to-workspace.md)
- [Create and manage instance types](./how-to-manage-kubernetes-instance-types.md)
- [AzureML inference router and connectivity requirements](./how-to-kubernetes-inference-routing-azureml-fe.md)
- [Secure AKS inferencing environment](./how-to-secure-kubernetes-inferencing-environment.md)
