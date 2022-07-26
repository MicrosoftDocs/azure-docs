---
title: Configure Kubernetes cluster
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

# Configure Kubernetes cluster for Azure Machine Learning

Azure Machine Learning Kubernetes compute enables you to run training jobs such as AutoML, pipeline, and distributed jobs,  or to deploy models as online endpoint or batch endpoint. Azure ML Kubernetes compute supports two kinds of Kubernetes cluster:
* **[Azure Kubernetes Services](https://azure.microsoft.com/services/kubernetes-service/)** (AKS) cluster in Azure. With your own managed AKS cluster in Azure, you can gain security and controls to meet compliance requirement as well as flexibility to manage teams' ML workload.
* **[Azure Arc-enabled Kubernetes](../azure-arc/kubernetes/overview.md)** (Arc Kubernetes) cluster. With Arc Kubernetes cluster, you can train or deploy models in any infrastructure on-premises, across multi-cloud, or the edge. 


In this article, you can learn about steps to configure an existing Kubernetes cluster for Azure Machine Learning:
* [Deploy AzureML extension to Kubernetes cluster](#deploy-azureml-extension-to-kubernetes-cluster)
* [Attach Kubernetes cluster to Azure ML workspace](#attach-a-kubernetes-cluster-to-an-azure-ml-workspace)
* [Create instance types for efficient compute resource utilization](#create-and-use-instance-types-for-efficient-compute-resource-utilization)

## Prerequisites

* An AKS cluster is up and running in Azure.
* or an Arc Kubernetes cluster is up and running. Follow instructions in [connect existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).
  * if this is Azure RedHat OpenShift Service (ARO) cluster or OpenShift Container Platform (OCP) cluster, please ensure to satisfy additional prerequisite step [here](./reference-kubernetes.md#prerequisites-for-aro-or-ocp-clusters).
* The Kubernetes cluster must have minimum of 4 vCPU cores and 8GB memory.
* Cluster running behind an outbound proxy server or firewall needs additional [network configurations](./how-to-access-azureml-behind-firewall.md#kubernetes-compute)
* Install or upgrade Azure CLI to version 2.24.0 or higher.
* Install or upgrade Azure CLI extension ```k8s-extension``` to version 1.2.3 or higher.

## Limitations

- [Using a service principal with AKS](../aks/kubernetes-service-principal.md) is **not supported** by Azure Machine Learning. The AKS cluster must use a managed identity instead.
- [Disabling local accounts](../aks/managed-aad.md#disable-local-accounts) for AKS is **not supported**  by Azure Machine Learning. When deploying an AKS Cluster, local accounts are enabled by default.
- If your AKS cluster has an [Authorized IP range enabled to access the API server](../aks/api-server-authorized-ip-ranges.md), enable the AzureML control plane IP ranges for the AKS cluster. The AzureML control plane is deployed across paired regions. Without access to the API server, the machine learning pods cannot be deployed. Use the [IP ranges](https://www.microsoft.com/download/confirmation.aspx?id=56519) for both the [paired regions](../availability-zones/cross-region-replication-azure.md) when enabling the IP ranges in an AKS cluster.

## Deploy AzureML extension to Kubernetes cluster

AzureML extension consists of a set of system components deployed to your Kubernetes cluster in `azureml` namespace, so you can enable your cluster to run an Azure ML workload - model training jobs or model endpoints. You can use an Azure CLI command ```k8s-extension create``` to deploy AzureML extension. General available (GA) version of AzureML extension is version 1.1.1 or higher.

For a detailed list of AzureML extension system components, see [AzureML extension components](./reference-kubernetes.md#azureml-extension-components).

### [CLI](#tab/deploy-extension-with-cli)
To deploy AzureML extension with CLI, use `az k8s-extension create` command passing in values for the mandatory parameters.

We list 4 typical extension deployment scenarios for reference. To deploy extension for your production usage, please carefully read the complete list of [configuration settings](#review-azureml-extension-configuration-settings).

- **Use AKS cluster in Azure for a quick proof of concept, to run training jobs or to deploy models as online/batch endpoints**

   For AzureML extension deployment on AKS cluster, make sure to specify ```managedClusters``` value for ```--cluster-type``` parameter. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer allowInsecureConnections=True inferenceLoadBalancerHA=False --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

- **Use Arc Kubernetes cluster outside of Azure for a quick proof of concept, to run training jobs only**

   For AzureML extension deployment on [Arc Kubernetes](../azure-arc/kubernetes/overview.md) cluster, you would need to specify ```connectedClusters``` value for ```--cluster-type``` parameter. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```

- **Enable an AKS cluster in Azure for production training and inference workload**
   For AzureML extension deployment on AKS, make sure to specify ```managedClusters``` value for ```--cluster-type``` parameter. Assuming your cluster has more than 3 nodes, and you will use an Azure public load balancer and HTTPS for inference workload support. Run the following Azure CLI command to deploy AzureML extension:
   ```azurecli
   az k8s-extension create --name <extension-name> --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer sslCname=<ssl cname> --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslKeyPemFile=<file-path-to-cert-KEY> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
   ```
- **Enable an [Arc Kubernetes](../azure-arc/kubernetes/overview.md) cluster anywhere for production training and inference workload using NVIDIA GPUs**

   For AzureML extension deployment on [Arc Kubernetes](../azure-arc/kubernetes/overview.md) cluster, make sure to specify ```connectedClusters``` value for ```--cluster-type``` parameter. Assuming your cluster has more than 3 nodes, you will use a NodePort service type and HTTPS for inference workload support, run following Azure CLI command to deploy AzureML extension:
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

1. After the deployment completes, you are able to see the AzureML extension in **Extension** page.  If the extension installation succeeds, you can see **Installed** for the **Install status**.

   :::image type="content" source="media/how-to-attach-arc-kubernetes/deploy-extension-from-ui-extension-detail.png" alt-text="Screenshot of installed AzureML extensions listing in Azure portal.":::

---

### Key considerations for AzureML extension deployment

AzureML extension deployment allows you to specify configuration settings needed for different workload support. Before AzureML extension deployment, **please read following carefully to avoid unnecessary extension deployment errors**:

  * Type of workload to enable for your cluster. ```enableTraining``` and ```enableInference``` config settings are your convenient choices here; `enableTraining` will enable **training** and **batch scoring** workload, `enableInference` will enable **real-time inference** workload. 
  * For real-time inference support, it requires ```azureml-fe``` router service to be deployed for routing incoming inference requests to model pod, and you would need to specify ```inferenceRouterServiceType``` config setting for ```azureml-fe```. ```azureml-fe``` can be deployed with one of following ```inferenceRouterServiceType```:
      * Type ```LoadBalancer```. Exposes ```azureml-fe``` externally using a cloud provider's load balancer. To specify this value, ensure that your cluster supports load balancer provisioning. Note most on-premises Kubernetes clusters might not support external load balancer.
      * Type ```NodePort```. Exposes ```azureml-fe``` on each Node's IP at a static port. You'll be able to contact ```azureml-fe```, from outside of cluster, by requesting ```<NodeIP>:<NodePort>```. Using ```NodePort``` also allows you to set up your own load balancing solution and SSL termination for ```azureml-fe```.
      * Type ```ClusterIP```. Exposes ```azureml-fe``` on a cluster-internal IP, and it makes ```azureml-fe``` only reachable from within the cluster. For ```azureml-fe``` to serve inference requests coming outside of cluster, it requires you to set up your own load balancing solution and SSL termination for ```azureml-fe```. 
   * For real-time inference support, to ensure high availability of ```azureml-fe``` routing service, AzureML extension deployment by default creates 3 replicas of ```azureml-fe``` for clusters having 3 nodes or more. If your cluster has **less than 3 nodes**, set ```inferenceLoadbalancerHA=False```.
   * For real-time inference support, you would also want to consider using **HTTPS** to restrict access to model endpoints and secure the data that clients submit. For this purpose, you would need to specify either ```sslSecret``` config setting or combination of ```sslKeyPemFile``` and ```sslCertPemFile``` config settings. By default, AzureML extension deployment expects **HTTPS** support required, and you would need to provide above config setting. For development or testing purposes, **HTTP** support is conveniently provided through config setting ```allowInsecureConnections=True```.

For a complete list of configuration settings available to choose at AzureML deployment time, see [Review AzureML extension config settings](#review-azureml-extension-configuration-settings)

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

### Review AzureML extension configuration settings

For AzureML extension deployment configurations, use ```--config``` or ```--config-protected``` to specify list of ```key=value``` pairs. Following is the list of configuration settings available to be used for different AzureML extension deployment scenario ns.

|Configuration Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   |```enableTraining``` |```True``` or ```False```, default ```False```. **Must** be set to ```True``` for AzureML extension deployment with Machine Learning model training and batch scoring support.  |  **&check;**| N/A |  **&check;** |
   | ```enableInference``` |```True``` or ```False```, default ```False```.  **Must** be set to ```True``` for AzureML extension deployment with Machine Learning inference support. |N/A| **&check;** |  **&check;** |
   | ```allowInsecureConnections``` |```True``` or ```False```, default `False`. **Can** be set to ```True``` to use inference HTTP endpoints for development or test purposes. |N/A| Optional |  Optional |
   | ```inferenceRouterServiceType``` |```loadBalancer```, ```nodePort``` or ```clusterIP```.  **Required** if ```enableInference=True```. | N/A| **&check;** |   **&check;** |
   | ```internalLoadBalancerProvider``` | This config is only applicable for Azure Kubernetes Service(AKS) cluster now. Set to ```azure``` to allow the inference router using internal load balancer.  | N/A| Optional |  Optional |
   |```sslSecret```| The name of Kubernetes secret in `azureml` namespace to store `cert.pem` (PEM-encoded SSL cert) and `key.pem` (PEM-encoded SSL key), required for inference  HTTPS endpoint support, when  ``allowInsecureConnections`` is set to False. You can find a sample YAML definition of sslSecret [here](./reference-kubernetes.md#sample-yaml-definition-of-kubernetes-secret-for-tlsssl). Use this config or combination of `sslCertPemFile` and `sslKeyPemFile` protected config settings. |N/A| Optional |  Optional |
   |```sslCname``` |An SSL CName is used by inference HTTPS endpoint. **Required** if ```allowInsecureConnections=False```  |  N/A | Optional | Optional|
   | ```inferenceRouterHA``` |```True``` or ```False```, default ```True```. By default, AzureML extension will deploy 3 inference router replicas for high availability, which requires at least 3 worker nodes in a cluster. Set to ```False``` if your cluster has fewer than 3 worker nodes, in this case only one inference router service is deployed. | N/A| Optional |  Optional |
   |```nodeSelector``` | By default, the deployed kubernetes resources are randomly deployed to 1 or more nodes of the cluster, and daemonset resources are deployed to ALL nodes. If you want to restrict the extension deployment to specific nodes with label `key1=value1` and `key2=value2`, use `nodeSelector.key1=value1`, `nodeSelector.key2=value2` correspondingly. | Optional| Optional |  Optional |
   |```installNvidiaDevicePlugin```  | ```True``` or ```False```, default ```False```. [NVIDIA Device Plugin](https://github.com/NVIDIA/k8s-device-plugin#nvidia-device-plugin-for-kubernetes) is required for ML workloads on NVIDIA GPU hardware. By default, AzureML extension deployment will not install NVIDIA Device Plugin regardless Kubernetes cluster has GPU hardware or not. User can specify this setting to ```True```, to install it, but make sure to fulfill [Prerequisites](https://github.com/NVIDIA/k8s-device-plugin#prerequisites). | Optional |Optional |Optional |
   |```installPromOp```|```True``` or ```False```, default ```True```. AzureML extension needs prometheus operator to manage prometheus. Set to ```False``` to reuse existing prometheus operator. Compatible [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md) helm chart versions are from 9.3.4 to 30.0.1.| Optional| Optional |  Optional |
 |```installVolcano```| ```True``` or ```False```, default ```True```. AzureML extension needs volcano scheduler to schedule the job. Set to ```False``` to reuse existing volcano scheduler. Supported volcano scheduler versions are 1.4, 1.5. | Optional| N/A |  Optional |
 |```installDcgmExporter```  |```True``` or ```False```, default ```False```. Dcgm-exporter can expose GPU metrics for AzureML workloads, which can be monitored in Azure portal. Set ```installDcgmExporter```  to ```True``` to install dcgm-exporter. But if you want to utilize your own dcgm-exporter, refer to [DCGM exporter](https://github.com/Azure/AML-Kubernetes/blob/master/docs/troubleshooting.md#dcgm) |Optional |Optional |Optional |


   |Configuration Protected Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   | ```sslCertPemFile```, ```sslKeyPemFile``` |Path to SSL certificate and key file (PEM-encoded), required for AzureML extension deployment with inference HTTPS endpoint support, when  ``allowInsecureConnections`` is set to False. **Note** PEM file with pass phrase protected is not supported | N/A| Optional |  Optional |
   
## Attach a Kubernetes cluster to an Azure ML workspace

Once AzureML extension is deployed on AKS or Arc Kubernetes cluster, you can attach the Kubernetes cluster to Azure ML workspace and create compute targets for ML professionals to use. Each attach operation creates a compute target in Azure ML workspace, and multiple attach operations on the same cluster will create multiple compute targets in a single Azure ML workspace or multiple Azure ML workspace.

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

**AKS cluster**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --type Kubernetes --name k8s-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ContainerService/managedclusters/<cluster-name>" --identity-type SystemAssigned --namespace <Kubernetes namespace to run AzureML workloads> --no-wait
```

**Arc Kubernetes cluster**

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

Attaching a Kubernetes cluster makes it available to your workspace for training or inferencing.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Compute**.
1. Select the **Attached computes** tab.
1. Select **+New > Kubernetes**

   :::image type="content" source="media/how-to-attach-arc-kubernetes/attach-kubernetes-cluster.png" alt-text="Screenshot of settings for Kubernetes cluster to make available in your workspace.":::

1. Enter a compute name and select your Kubernetes cluster from the dropdown.

    * **(Optional)** Enter Kubernetes namespace, which defaults to `default`. All machine learning workloads will be sent to the specified Kubernetes namespace in the cluster.

    * **(Optional)** Assign system-assigned or user-assigned managed identity. Managed identities eliminate the need for developers to manage credentials. For more information, see [managed identities overview](../active-directory/managed-identities-azure-resources/overview.md) .

    :::image type="content" source="media/how-to-attach-arc-kubernetes/configure-kubernetes-cluster-2.png" alt-text="Screenshot of settings for developer configuration of Kubernetes cluster.":::

1. Select **Attach**

    In the Attached compute tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    :::image type="content" source="media/how-to-attach-arc-kubernetes/provision-resources.png" alt-text="Screenshot of attached settings for configuration of Kubernetes cluster.":::
   
---

## Create and use instance types for efficient compute resource utilization

### What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of
compute nodes for training and inference workloads.  For an Azure VM, an example for an 
instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are represented in a custom resource definition (CRD) that is installed with the AzureML extension. Instance types are represented by two elements in AzureML extension: 
[nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
and [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
In short, a `nodeSelector` lets us specify which node a pod should run on.  The node must have a
corresponding label.  In the `resources` section, we can set the compute resources (CPU, memory and
NVIDIA GPU) for the pod.

### Default instance type

By default, a `defaultinstancetype` with following definition is created when you attach Kuberenetes cluster to AzureML workspace:
- No `nodeSelector` is applied, meaning the pod can get scheduled on any node.
- The workload's pods are assigned default resources with 0.6 cpu cores, 1536Mi memory and 0 GPU:
```yaml
resources:
  requests:
    cpu: "0.6"
    memory: "1536Mi"
  limits:
    cpu: "0.6"
    memory: "1536Mi"
    nvidia.com/gpu: null
```

> [!NOTE] 
> - The default instance type purposefully uses little resources.  To ensure all ML workloads
run with appropriate resources, for example GPU resource, it is highly recommended to create custom instance types.
> - `defaultinstancetype` will not appear as an InstanceType custom resource in the cluster when running the command ```kubectl get instancetype```, but it will appear in all clients (UI, CLI, SDK).
> - `defaultinstancetype` can be overridden with a custom instance type definition having the same name as `defaultinstancetype` (see [Create custom instance types](#create-custom-instance-types) section)

### Create custom instance types

To create a new instance type, create a new custom resource for the instance type CRD.  For example:

```bash
kubectl apply -f my_instance_type.yaml
```

With `my_instance_type.yaml`:
```yaml
apiVersion: amlarc.azureml.com/v1alpha1
kind: InstanceType
metadata:
  name: myinstancetypename
spec:
  nodeSelector:
    mylabel: mylabelvalue
  resources:
    limits:
      cpu: "1"
      nvidia.com/gpu: 1
      memory: "2Gi"
    requests:
      cpu: "700m"
      memory: "1500Mi"
```

The following steps will create an instance type with the labeled behavior:
- Pods will be scheduled only on nodes with label `mylabel: mylabelvalue`.
- Pods will be assigned resource requests of `700m` CPU and `1500Mi` memory.
- Pods will be assigned resource limits of `1` CPU, `2Gi` memory and `1` NVIDIA GPU.

> [!NOTE]
> - NVIDIA GPU resources are only specified in the `limits` section as integer values.  For more information,
  see the Kubernetes [documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins).
> - CPU and memory resources are string values.
> - CPU can be specified in millicores, for example `100m`, or in full numbers, for example `"1"`
  is equivalent to `1000m`.
> - Memory can be specified as a full number + suffix, for example `1024Mi` for 1024 MiB.

It's also possible to create multiple instance types at once:

```bash
kubectl apply -f my_instance_type_list.yaml
```

With `my_instance_type_list.yaml`:
```yaml
apiVersion: amlarc.azureml.com/v1alpha1
kind: InstanceTypeList
items:
  - metadata:
      name: cpusmall
    spec:
      resources:
        requests:
          cpu: "100m"
          memory: "100Mi"
        limits:
          cpu: "1"
          nvidia.com/gpu: 0
          memory: "1Gi"

  - metadata:
      name: defaultinstancetype
    spec:
      resources:
        requests:
          cpu: "1"
          memory: "1Gi" 
        limits:
          cpu: "1"
          nvidia.com/gpu: 0
          memory: "1Gi"
```

The above example creates two instance types: `cpusmall` and `defaultinstancetype`.  This `defaultinstancetype` definition will override the `defaultinstancetype` definition created when Kubernetes cluster was attached to AzureML workspace. 

If a training or inference workload is submitted without an instance type, it uses the `defaultinstancetype`.  To specify a default instance type for a Kubernetes cluster, create an instance type with name `defaultinstancetype`.  It will automatically be recognized as the default.


### Select instance type to submit training job

To select an instance type for a training job using CLI (V2), specify its name as part of the
`resources` properties section in job YAML.  For example:
```yaml
command: python -c "print('Hello world!')"
environment:
  image: library/python:latest
compute: azureml:<compute_target_name>
resources:
  instance_type: <instance_type_name>
```

In the above example, replace `<compute_target_name>` with the name of your Kubernetes compute
target and `<instance_type_name>` with the name of the instance type you wish to select. If there's no `instance_type` property specified, the system will use `defaultinstancetype` to submit job.

### Select instance type to deploy model

To select an instance type for a model deployment using CLI (V2), specify its name for `instance_type` property in deployment YAML.  For example:

```yaml
name: blue
app_insights_enabled: true
endpoint_name: <endpoint name>
model: 
  path: ./model/sklearn_mnist_model.pkl
code_configuration:
  code: ./script/
  scoring_script: score.py
instance_type: <instance type name>
environment: 
  conda_file: file:./model/conda.yml
  image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1
```

In the above example, replace `<instance_type_name>` with the name of the instance type you wish to select. If there's no `instance_type` property specified, the system will use `defaultinstancetype` to deploy model.

## Recommended best practices

**Separation of responsibilities between the IT-operations team and data-science team.** Managing your own Kubernetes compute and infrastructure for ML workload requires Kubernetes admin privilege and expertise, and it is best to be done by IT-operations team so data-science team can focus on ML models for organizational efficiency.
 
**Create and manage instance types for different ML workload scenarios.** Each ML workload uses different amounts of compute resources such as CPU/GPU and memory. Azure ML implements instance type as Kubernetes custom resource definition (CRD) with properties of nodeSelector and resource request/limit. With a carefully curated list of instance types, IT-operations can target ML workload on specific node(s) and manage compute resource utilization efficiently.

**Multiple Azure ML workspaces share the same Kubernetes cluster.** You can attach Kubernetes cluster multiple times to the same Azure ML workspace or different Azure ML workspaces, creating multiple compute targets in one workspace or multiple workspaces. Since many customers organize data science projects around Azure ML workspace, multiple data science projects can now share the same Kubernetes cluster. This significantly reduces ML infrastructure management overheads as well as IT cost saving.

**Team/project workload isolation using Kubernetes namespace.** When you attach Kubernetes cluster to Azure ML workspace, you can specify a Kubernetes namespace for the compute target and all workloads run by the compute target will be placed under the specified namespace.

## Next steps

- [Train models with CLI v2](how-to-train-cli.md)
- [Train models with Python SDK](how-to-set-up-training-targets.md)
- [Deploy model with an online endpoint (CLI v2)](./how-to-deploy-managed-online-endpoints.md)
- [Use batch endpoint for batch scoring (CLI v2)](./how-to-use-batch-endpoint.md)

### Additional resources

- [Kubernetes version and region availability](./reference-kubernetes.md#supported-kubernetes-version-and-region)
- [Work with custom data storage](./reference-kubernetes.md#azureml-jobs-connect-with-custom-data-storage)


### Examples

All AzureML examples can be found in [https://github.com/Azure/azureml-examples.git](https://github.com/Azure/azureml-examples).

For any AzureML example, you only need to update the compute target name to your Kubernetes compute target, then you are all done. 
* Explore training job samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/jobs](https://github.com/Azure/azureml-examples/tree/main/cli/jobs)
* Explore model deployment with online endpoint samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/online/kubernetes)
* Explore batch endpoint samples with CLI v2 - [https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch](https://github.com/Azure/azureml-examples/tree/main/cli/endpoints/batch)
* Explore training job samples with SDK v2 -[https://github.com/Azure/azureml-examples/tree/main/sdk/jobs](https://github.com/Azure/azureml-examples/tree/main/sdk/jobs)
* Explore model deployment with online endpoint samples with SDK v2 -[https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints/online/kubernetes](https://github.com/Azure/azureml-examples/tree/main/sdk/endpoints/online/kubernetes)