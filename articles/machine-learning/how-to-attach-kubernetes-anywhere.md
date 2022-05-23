---
title: Azure Machine Learning anywhere with Kubernetes (preview)
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

# Azure Machine Learning anywhere with Kubernetes (preview)

Azure Machine Learning anywhere with Kubernetes (AzureML anywhere) enables customers to build, train, and deploy models in any infrastructure on-premises and across multi-cloud using Kubernetes. With an AzureML extension deployment on a Kubernetes cluster, you can instantly onboard teams of ML professionals with AzureML service capabilities. These services include full machine learning lifecycle and automation with MLOps in hybrid cloud and multi-cloud.

In this article, you can learn about steps to configure and attach an existing Kubernetes cluster anywhere for Azure Machine Learning:
* [Deploy AzureML extension to Kubernetes cluster](#deploy-azureml-extension---example-scenarios)
* [Create and use instance types to manage compute resources efficiently](#create-custom-instance-types)

## Prerequisites

1. A running Kubernetes cluster - **We recommend minimum of 4 vCPU cores and 8GB memory, around 2 vCPU cores and 3GB memory will be used by Azure Arc agent and AzureML extension components**.
1. Connect your Kubernetes cluster to Azure Arc. Follow instructions in [connect existing Kubernetes cluster to Azure Arc](../azure-arc/kubernetes/quickstart-connect-cluster.md).
   
      a. if you have Azure RedHat OpenShift Service (ARO) cluster or OpenShift Container Platform (OCP) cluster, follow another prerequisite step [here](#prerequisite-for-azure-arc-enabled-kubernetes) before AzureML extension deployment.
1. If you have an AKS cluster in Azure, register the AKS-ExtensionManager feature flag by using the ```az feature register --namespace "Microsoft.ContainerService" --name "AKS-ExtensionManager``` command. **Azure Arc connection is not required and not recommended**. 
1. Install or upgrade Azure CLI to version >=2.16.0
1. Install the Azure CLI extension ```k8s-extension``` (version>=1.0.0) by running ```az extension add --name k8s-extension```

## What is AzureML extension

AzureML extension consists of a set of system components deployed to your Kubernetes cluster so you can enable your cluster to run an AzureML workload - model training jobs or model endpoints. You can use an Azure CLI command ```k8s-extension create``` to deploy AzureML extension.

For a detailed list of AzureML extension system components, see appendix [AzureML extension components](#appendix-i-azureml-extension-components).

## Key considerations for AzureML extension deployment

AzureML extension allows you to specify configuration settings needed for different workload support at deployment time. Before AzureML extension deployment, **read following carefully to avoid unnecessary extension deployment errors**:

  * Type of workload to enable for your cluster. ```enableTraining``` and ```enableInference``` config settings are your convenient choices here; they will enable training and inference workload respectively. 
  * For inference workload support, it requires ```azureml-fe``` router service to be deployed for routing incoming inference requests to model pod, and you would need to specify ```inferenceRouterServiceType``` config setting for ```azureml-fe```. ```azureml-fe``` can be deployed with one of following ```inferenceRouterServiceType```:
      * Type ```LoadBalancer```. Exposes ```azureml-fe``` externally using a cloud provider's load balancer. To specify this value, ensure that your cluster supports load balancer provisioning. Note most on-premises Kubernetes clusters might not support external load balancer.
      * Type ```NodePort```. Exposes ```azureml-fe``` on each Node's IP at a static port. You'll be able to contact ```azureml-fe```, from outside of cluster, by requesting ```<NodeIP>:<NodePort>```. Using ```NodePort``` also allows you to set up your own load balancing solution and SSL termination for ```azureml-fe```.
      * Type ```ClusterIP```. Exposes ```azureml-fe``` on a cluster-internal IP, and it makes ```azureml-fe``` only reachable from within the cluster. For ```azureml-fe``` to serve inference requests coming outside of cluster, it requires you to set up your own load balancing solution and SSL termination for ```azureml-fe```. 
   * For inference workload support, to ensure high availability of ```azureml-fe``` routing service, AzureML extension deployment by default creates 3 replicas of ```azureml-fe``` for clusters having 3 nodes or more. If your cluster has **less than 3 nodes**, set ```inferenceLoadbalancerHA=False```.
   * For inference workload support, you would also want to consider using **HTTPS** to restrict access to model endpoints and secure the data that clients submit. For this purpose, you would need to specify either ```sslSecret``` config setting or combination of ```sslCertPemFile``` and ```sslCertKeyFile``` config settings. By default, AzureML extension deployment expects **HTTPS** support required, and you would need to provide above config setting. For development or test purposes, **HTTP** support is conveniently supported through config setting ```allowInsecureConnections=True```.

For a complete list of configuration settings available to choose at AzureML deployment time, see appendix [Review AzureML extension config settings](#appendix-ii-review-azureml-deployment-configuration-settings)

## Deploy AzureML extension - example scenarios

### Use AKS in Azure for a quick Proof of Concept, both training and inference workloads support

Ensure you have fulfilled [prerequisites](#prerequisites). For AzureML extension deployment on AKS, make sure to specify ```managedClusters``` value for ```--cluster-type``` parameter. Run the following Azure CLI command to deploy AzureML extension:
```azurecli
   az k8s-extension create --name azureml-extension --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer allowInsecureConnections=True inferenceLoadBalancerHA=False --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
```

### Use Minikube on your desktop for a quick POC, training workload support only

Ensure you have fulfilled [prerequisites](#prerequisites). Since the follow steps would create an Azure Arc connected cluster, you would need to specify ```connectedClusters``` value for ```--cluster-type``` parameter. Run following simple Azure CLI command to deploy AzureML extension:
```azurecli
   az k8s-extension create --name azureml-extension --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
```

### Enable an AKS cluster in Azure for production training and inference workload

Ensure you have fulfilled [prerequisites](#prerequisites). Assuming your cluster has more than 3 nodes, and you will use an Azure public load balancer and HTTPS for inference workload support, run following Azure CLI command to deploy AzureML extension:
```azurecli
   az k8s-extension create --name azureml-extension --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=LoadBalancer --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslCertKeyFile=<file-path-to-cert-KEY> --cluster-type managedClusters --cluster-name <your-AKS-cluster-name> --resource-group <your-RG-name> --scope cluster
```
### Enable an Azure Arc connected cluster anywhere for production training and inference workload

Ensure you have fulfilled [prerequisites](#prerequisites). Assuming your cluster has more than 3 nodes, you will use a NodePort service type and HTTPS for inference workload support, run following Azure CLI command to deploy AzureML extension:
```azurecli
   az k8s-extension create --name azureml-extension --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True enableInference=True inferenceRouterServiceType=NodePort --config-protected sslCertPemFile=<file-path-to-cert-PEM> sslCertKeyFile=<file-path-to-cert-KEY> --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <your-RG-name> --scope cluster
```

### Verify AzureML extension deployment

1. Run the following CLI command to check AzureML extension details:

   ```azurecli
   az k8s-extension show --name arcml-extension --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group>
   ```

1. In the response, look for "name": "azureml-extension" and "provisioningState": "Succeeded". Note it might show "provisioningState": "Pending" for the first few minutes.

1. If the provisioningState shows Succeeded, run the following command on your machine with the kubeconfig file pointed to your cluster to check that all pods under "azureml" namespace are in 'Running' state:

   ```bash
    kubectl get pods -n azureml
   ```

## Attach a Kubernetes cluster to an AzureML workspace

### Prerequisite for Azure Arc enabled Kubernetes

Azure Machine Learning workspace defaults to having a system-assigned managed identity to access Azure ML resources. The steps are completed if the system assigned default setting is on. 


Otherwise, if a user-assigned managed identity is specified in Azure Machine Learning workspace creation, the following role assignments need to be granted to the identity manually before attaching the compute.

|Azure resource name |Role to be assigned|
|--|--|
|Azure Relay|Azure Relay Owner|
|Azure Arc-enabled Kubernetes|Reader|

Azure Relay resources are created under the same Resource Group as the Arc cluster.

### [Studio](#tab/studio)

Attaching an Azure Arc-enabled Kubernetes cluster makes it available to your workspace for training.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Compute**.
1. Select the **Attached computes** tab.
1. Select **+New > Kubernetes (preview)**

   :::image type="content" source="media/how-to-attach-arc-kubernetes/attach-kubernetes-cluster.png" alt-text="Screenshot of settings for Kubernetes cluster to make available in your workspace.":::

1. Enter a compute name and select your Azure Arc-enabled Kubernetes cluster from the dropdown.

    * **(Optional)** Enter Kubernetes namespace, which defaults to `default`. All machine learning workloads will be sent to the specified Kubernetes namespace in the cluster.

    * **(Optional)** Assign system-assigned or user-assigned managed identity. Managed identities eliminate the need for developers to manage credentials. For more information, see [managed identities overview](../active-directory/managed-identities-azure-resources/overview.md) .

    :::image type="content" source="media/how-to-attach-arc-kubernetes/configure-kubernetes-cluster-2.png" alt-text="Screenshot of settings for developer configuration of Kubernetes cluster.":::

1. Select **Attach**

    In the Attached compute tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    :::image type="content" source="media/how-to-attach-arc-kubernetes/provision-resources.png" alt-text="Screenshot of attached settings for configuration of Kubernetes cluster.":::

### [CLI](#tab/cli)

You can attach an AKS or Azure Arc enabled Kubernetes cluster using the Azure Machine Learning 2.0 CLI (preview).

Use the Azure Machine Learning CLI [`attach`](/cli/azure/ml/compute) command and set the `--type` argument to `Kubernetes` to attach your Kubernetes cluster using the Azure Machine Learning 2.0 CLI.

> [!NOTE]
> Compute attach support for AKS or Azure Arc enabled Kubernetes clusters requires a version of the Azure CLI `ml` extension >= 2.0.1a4. For more information, see [Install and set up the CLI (v2)](how-to-configure-cli.md).

The following commands show how to attach an Azure Arc-enabled Kubernetes cluster and use it as a compute target with managed identity enabled.

**AKS**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --name k8s-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/managedclusters/<cluster-name>" --type Kubernetes --identity-type UserAssigned --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

**Azure Arc enabled Kubernetes**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --name amlarc-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/connectedClusters/<cluster-name>" --type kubernetes --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

Use the `identity_type` argument to enable `SystemAssigned` or `UserAssigned` managed identities.

> [!IMPORTANT]
> `--user-assigned-identities` is only required for `UserAssigned` managed identities. Although you can provide a list of comma-separated user managed identities, only the first one is used when you attach your cluster.

---

## Create instance types for efficient compute resource usage

### What are instance types?

Instance types are an Azure Machine Learning concept that allows targeting certain types of
compute nodes for training and inference workloads.  For an Azure VM, an example for an 
instance type is `STANDARD_D2_V3`.

In Kubernetes clusters, instance types are represented in a custom resource definition (CRD) that is installed with the AzureML extension. Instance types are represented by two elements in AzureML extension: 
[nodeSelector](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#nodeselector)
and [resources](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/).
In short, a `nodeSelector` lets us specify which node a pod should run on.  The node must have a
corresponding label.  In the `resources` section, we can set the compute resources (CPU, memory and
Nvidia GPU) for the pod.

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

## Create custom instance types

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
- Pods will be assigned resource limits of `1` CPU, `2Gi` memory and `1` Nvidia GPU.

> [!NOTE]
> - Nvidia GPU resources are only specified in the `limits` section as integer values.  For more information,
  see the Kubernetes [documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/#using-device-plugins).
> - CPU and memory resources are string values.
> - CPU can be specified in millicores, for example `100m`, or in full numbers, for example `"1"`
  is equivalent to `1000m`.
> - Memory can be specified as a full number + suffix, for example `1024Mi` for 1024 MiB.

It is also possible to create multiple instance types at once:

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

The above example creates two instance types: `cpusmall` and `defaultinstancetype`.  Above `defaultinstancetype` definition will override the `defaultinstancetype` definition created when Kubernetes cluster was attached to AzureML workspace. 

If a training or inference workload is submitted without an instance type, it uses the default
instance type.  To specify a default instance type for a Kubernetes cluster, create an instance
type with name `defaultinstancetype`.  It will automatically be recognized as the default.

## Select instance type to submit training job

To select an instance type for a training job using CLI (V2), specify its name as part of the
`resources` properties section in job YAML.  For example:
```yaml
command: python -c "print('Hello world!')"
environment:
  docker:
    image: python
compute: azureml:<compute_target_name>
resources:
  instance_type: <instance_type_name>
```

In the above example, replace `<compute_target_name>` with the name of your Kubernetes compute
target and `<instance_type_name>` with the name of the instance type you wish to select. If there is no `instance_type` property specified, the system will use `defaultinstancetype` to submit job.

## Select instance type to deploy model

To select an instance type for a model deployment using CLI (V2), specify its name for `instance_type` property in deployment YAML.  For example:

```yaml
deployments:
  - name: blue
    app_insights_enabled: true
    model: 
      name: sklearn_mnist_model
      version: 1
      local_path: ./model/sklearn_mnist_model.pkl
    code_configuration:
      code: 
        local_path: ./script/
      scoring_script: score.py
    instance_type: <instance_type_name>
    environment: 
      name: sklearn-mnist-env
      version: 1
      path: .
      conda_file: file:./model/conda.yml
      docker:
        image: mcr.microsoft.com/azureml/openmpi3.1.2-ubuntu18.04:20210727.v1
```

In the above example, replace `<instance_type_name>` with the name of the instance type you wish to select. If there is no `instance_type` property specified, the system will use `defaultinstancetype` to deploy model.

### Appendix I: AzureML extension components

Upon AzureML extension deployment completes, it will create following resources in Azure cloud:

   |Resource name  |Resource type | Description |
   |--|--|--|
   |Azure Service Bus|Azure resource|Used to sync nodes and cluster resource information to Azure Machine Learning services regularly.|
   |Azure Relay|Azure resource|Route traffic between Azure Machine Learning services and the Kubernetes cluster.|

Upon AzureML extension deployment completes, it will create following resources in Kubernetes cluster, depending on each AzureML extension deployment scenario:

   |Resource name  |Resource type |Training |Inference |Training and Inference| Description | Communication with cloud service|
   |--|--|--|--|--|--|--|
   |relayserver|Kubernetes deployment|**&check;**|**&check;**|**&check;**|The entry component to receive and sync the message with cloud.|Receive the request of job creation, model deployment from cloud service; sync the job status with cloud service.|
   |gateway|Kubernetes deployment|**&check;**|**&check;**|**&check;**|The gateway to communicate and send data back and forth.|Send nodes and cluster resource information to cloud services.|
   |aml-operator|Kubernetes deployment|**&check;**|N/A|**&check;**|Manage the lifecycle of training jobs.| Token exchange with cloud token service for authentication and authorization of Azure Container Registry used by training job.|
   |metrics-controller-manager|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Manage the configuration for Prometheus|N/A|
   |{EXTENSION-NAME}-kube-state-metrics|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Export the cluster-related metrics to Prometheus.|N/A|
   |{EXTENSION-NAME}-prometheus-operator|Kubernetes deployment|**&check;**|**&check;**|**&check;**| Provide Kubernetes native deployment and management of Prometheus and related monitoring components.|N/A|
   |amlarc-identity-controller|Kubernetes deployment|N/A|**&check;**|**&check;**|Request and renew Azure Blob/Azure Container Registry token through managed identity.|Token exchange with cloud token service for authentication and authorization of Azure Container Registry and Azure Blob used by inference/model deployment.|
   |amlarc-identity-proxy|Kubernetes deployment|N/A|**&check;**|**&check;**|Request and renew Azure Blob/Azure Container Registry token  through managed identity.|Token exchange with cloud token service for authentication and authorization of Azure Container Registry and Azure Blob used by inference/model deployment.|
   |azureml-fe|Kubernetes deployment|N/A|**&check;**|**&check;**|The front-end component that routes incoming inference requests to deployed services.|azureml-fe service logs are sent to Azure Blob.|
   |inference-operator-controller-manager|Kubernetes deployment|N/A|**&check;**|**&check;**|Manage the lifecycle of inference endpoints. |N/A|
   |cluster-status-reporter|Kubernetes deployment|**&check;**|**&check;**|**&check;**|Gather the cluster information, like cpu/gpu/memory usage, cluster healthiness.|N/A|
   |csi-blob-controller|Kubernetes deployment|**&check;**|N/A|**&check;**|Azure Blob Storage Container Storage Interface(CSI) driver.|N/A|
   |csi-blob-node|Kubernetes daemonset|**&check;**|N/A|**&check;**|Azure Blob Storage Container Storage Interface(CSI) driver.|N/A|
   |fluent-bit|Kubernetes daemonset|**&check;**|**&check;**|**&check;**|Gather the components' system log.| Upload the components' system log to cloud.|
   |k8s-host-device-plugin-daemonset|Kubernetes daemonset|**&check;**|**&check;**|**&check;**|Expose fuse to pods on each node.|N/A|
   |prometheus-prom-prometheus|Kubernetes statefulset|**&check;**|**&check;**|**&check;**|Gather and send job metrics to cloud.|Send job metrics like cpu/gpu/memory utilization to cloud.|
   |volcano-admission|Kubernetes deployment|**&check;**|N/A|**&check;**|Volcano admission webhook.|N/A|
   |volcano-controllers|Kubernetes deployment|**&check;**|N/A|**&check;**|Manage the lifecycle of Azure Machine Learning training job pods.|N/A|
   |volcano-scheduler |Kubernetes deployment|**&check;**|N/A|**&check;**|Used to do in cluster job scheduling.|N/A|

> [!IMPORTANT]
   > * Azure ServiceBus and Azure Relay resources  are under the same resource group as the Arc cluster resource. These resources are used to communicate with the Kubernetes cluster and modifying them will break attached compute targets.
   > * By default, the deployed kubernetes deployment resourses are randomly deployed to 1 or more nodes of the cluster, and daemonset resource are deployed to ALL nodes. If you want to restrict the extension deployment to specific nodes, use `nodeSelector` configuration setting described as below.

> [!NOTE]
   > * **{EXTENSION-NAME}:** is the extension name specified with ```az k8s-extension create --name``` CLI command. 

### Appendix II: Review AzureML deployment configuration settings

For AzureML extension deployment configurations, use ```--config``` or ```--config-protected``` to specify list of ```key=value``` pairs. Following is the list of configuration settings available to be used for different AzureML extension deployment scenario ns.

   |Configuration Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   |```enableTraining``` |```True``` or ```False```, default ```False```. **Must** be set to ```True``` for AzureML extension deployment with Machine Learning model training support.  |  **&check;**| N/A |  **&check;** |
   | ```enableInference``` |```True``` or ```False```, default ```False```.  **Must** be set to ```True``` for AzureML extension deployment with Machine Learning inference support. |N/A| **&check;** |  **&check;** |
   | ```allowInsecureConnections``` |```True``` or ```False```, default False. This **must** be set to ```True``` for AzureML extension deployment with HTTP endpoints support for inference, when ```sslCertPemFile``` and ```sslKeyPemFile``` are not provided. |N/A| Optional |  Optional |
   | ```inferenceRouterServiceType``` |```loadBalancer``` or ```nodePort```.  **Must** be set for ```enableInference=true```. | N/A| **&check;** |   **&check;** |
   | ```internalLoadBalancerProvider``` | This config is only applicable for Azure Kubernetes Service(AKS) cluster now. **Must** be set to ```azure``` to allow the inference router use internal load balancer.  | N/A| Optional |  Optional |
   |```sslSecret```| The Kubernetes secret name under azureml namespace to store `cert.pem` (PEM-encoded SSL cert) and `key.pem` (PEM-encoded SSL key), required for AzureML extension deployment with HTTPS endpoint support for inference, when  ``allowInsecureConnections`` is set to False. Use this config or give static cert and key file path in configuration protected settings. |N/A| Optional |  Optional |
   |```sslCname``` |A SSL CName to use if enabling SSL validation on the cluster.   |  N/A | N/A |  required when using HTTPS endpoint |
   | ```inferenceLoadBalancerHA``` |```True``` or ```False```, default ```True```. By default, AzureML extension will deploy three ingress controller replicas for high availability, which requires at least three workers in a cluster. Set this value to ```False``` if you have fewer than three workers and want to deploy AzureML extension for development and testing only, in this case it will deploy one ingress controller replica only. | N/A| Optional |  Optional |
   |```openshift``` | ```True``` or ```False```, default ```False```. Set to ```True``` if you deploy AzureML extension on ARO or OCP cluster. The deployment process will automatically compile a policy package and load policy package on each node so AzureML services operation can function properly.  | Optional| Optional |  Optional |
   |```nodeSelector``` | Set the node selector so the extension components and the training/inference workloads will only be deployed to the nodes with all specified selectors. Usage: `nodeSelector.key=value`, support multiple selectors. Example: `nodeSelector.node-purpose=worker nodeSelector.node-region=eastus`| Optional| Optional |  Optional |
   |```installNvidiaDevicePlugin```  | ```True``` or ```False```, default ```False```. [Nvidia Device Plugin](https://github.com/NVIDIA/k8s-device-plugin#nvidia-device-plugin-for-kubernetes) is required for ML workloads on Nvidia GPU hardware. By default, AzureML extension deployment will not install Nvidia Device Plugin regardless Kubernetes cluster has GPU hardware or not. User can specify this configuration setting to ```True```, so the extension will install Nvidia Device Plugin, but make sure to have [Prerequisites](https://github.com/NVIDIA/k8s-device-plugin#prerequisites) ready beforehand. | Optional |Optional |Optional |
   |```blobCsiDriverEnabled```| ```True``` or ```False```, default ```True```.  Blob CSI driver is required for ML workloads. User can specify this configuration setting to ```False``` if it was installed already. | Optional |Optional |Optional |
   |```reuseExistingPromOp```|```True``` or ```False```, default ```False```. AzureML extension needs prometheus operator to manage prometheus. Set to ```True``` to reuse existing prometheus operator. Compatible [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/blob/main/charts/kube-prometheus-stack/README.md) helm chart versions are from 9.3.4 to 30.0.1.| Optional| Optional |  Optional |
 |```volcanoScheduler.enable```| ```True``` or ```False```, default ```True```. AzureML extension needs volcano scheduler to schedule the job. Set to ```False``` to reuse existing volcano scheduler. Supported volcano scheduler versions are 1.4, 1.5. | Optional| N/A |  Optional |
 |```logAnalyticsWS```  |```True``` or ```False```, default ```False```. AzureML extension integrates with Azure LogAnalytics Workspace to provide log viewing and analysis capability through LogAalytics Workspace. This setting must be explicitly set to ```True``` if customer wants to use this capability. LogAnalytics Workspace cost may apply.  |N/A |Optional |Optional |
 |```installDcgmExporter```  |```True``` or ```False```, default ```False```. Dcgm-exporter is used to collect GPU metrics for GPU jobs. Specify ```installDcgmExporter``` flag to ```true``` to enable the build-in dcgm-exporter. |N/A |Optional |Optional |

   |Configuration Protected Setting Key Name  |Description  |Training |Inference |Training and Inference
   |--|--|--|--|--|
   | ```sslCertPemFile```, ```sslKeyPemFile``` |Path to SSL certificate and key file (PEM-encoded), required for AzureML extension deployment with HTTPS endpoint support for inference, when  ``allowInsecureConnections`` is set to False. | N/A| Optional |  Optional |
   

## Next steps

- [Train models with CLI (v2)](how-to-train-cli.md)
- [Configure and submit training runs](how-to-set-up-training-targets.md)
- [Tune hyperparameters](how-to-tune-hyperparameters.md)
- [Train a model using Scikit-learn](how-to-train-scikit-learn.md)
- [Train a TensorFlow model](how-to-train-tensorflow.md)
- [Train a PyTorch model](how-to-train-pytorch.md)
- [Train using Azure Machine Learning pipelines](how-to-create-machine-learning-pipelines.md)
- [Train model on-premise with outbound proxy server](../azure-arc/kubernetes/quickstart-connect-cluster.md#connect-using-an-outbound-proxy-server)
