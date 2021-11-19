---
title: Azure Arc-enabled machine learning (preview)
description: Configure Azure Kubernetes Service and Azure Arc-enabled Kubernetes clusters to train and inference machine learning models in Azure Machine Learning
titleSuffix: Azure Machine Learning
author: luisquintanilla
ms.author: luquinta
ms.service: machine-learning
ms.subservice: core
ms.date: 11/17/2021
ms.topic: how-to
ms.custom: ignite-fall-2021
---

# Configure Kubernetes clusters for machine learning (preview)

Learn how to configure Azure Kubernetes Service (AKS) and Azure Arc-enabled Kubernetes clusters for training and inferencing machine learning workloads.

## What is Azure Arc-enabled machine learning?

Azure Arc enables you to run Azure services in any Kubernetes environment, whether it’s on-premises, multicloud, or at the edge.

Azure Arc-enabled machine learning lets you configure and use Azure Kubernetes Service or Azure Arc-enabled Kubernetes clusters to train, inference, and manage machine learning models in Azure Machine Learning.

## Machine Learning on Azure Kubernetes Service

To use Azure Kubernetes Service clusters for Azure Machine Learning training and inference workloads, you don't have to connect them to Azure Arc.

You have to configure inbound and outbound network traffic. For more information, see [Configure inbound and outbound network traffic (AKS)](how-to-access-azureml-behind-firewall.md#azure-kubernetes-services-1).

To deploy the Azure Machine Learning extension on Azure Kubernetes Service clusters, see the [Deploy Azure Machine Learning extension](#deploy-azure-machine-learning-extension) section.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription [create a free account](https://azure.microsoft.com/free) before you begin.
* Azure Arc-enabled Kubernetes cluster. For more information, see the [Connect an existing Kubernetes cluster to Azure Arc quickstart guide](../azure-arc/kubernetes/quickstart-connect-cluster.md).

    > [!NOTE]
    > For AKS clusters, connecting them to Azure Arc is **optional**.

* Fulfill [Azure Arc network requirements](../azure-arc/kubernetes/quickstart-connect-cluster.md?tabs=azure-cli#meet-network-requirements)

    > [!IMPORTANT]
    > Clusters running behind an outbound proxy server or firewall need additional network configurations.
    >
    > For more information, see [Configure inbound and outbound network traffic (Azure Arc-enabled Kubernetes)](how-to-access-azureml-behind-firewall.md#arc-kubernetes).

* Fulfill [Azure Arc-enabled Kubernetes cluster extensions prerequisites](../azure-arc/kubernetes/extensions.md#prerequisites).
  * Azure CLI version >= 2.24.0
  * Azure CLI k8s-extension extension version >= 1.0.0

* An Azure Machine Learning workspace. [Create a workspace](how-to-manage-workspace.md?tabs=python) before you begin if you don't have one already.
  * Azure Machine Learning Python SDK version >= 1.30
* Log into Azure using the Azure CLI

    ```azurecli
    az login
    az account set --subscription <your-subscription-id>
    ```  

* **Azure RedHat OpenShift Service (ARO) and OpenShift Container Platform (OCP) only**

    * An ARO or OCP Kubernetes cluster is up and running. For more information, see [Create ARO Kubernetes cluster](../openshift/tutorial-create-cluster.md) and [Create OCP Kubernetes cluster](https://docs.openshift.com/container-platform/4.6/installing/installing_platform_agnostic/installing-platform-agnostic.html)
    * Grant privileged access to AzureML service accounts.

        Run `oc edit scc privileged` and add the following 

        * ```system:serviceaccount:azure-arc:azure-arc-kube-aad-proxy-sa```
        * ```system:serviceaccount:azureml:{EXTENSION NAME}-kube-state-metrics``` **(Note:** ```{EXTENSION NAME}``` **here must match with the extension name used in** ```az k8s-extension create --name``` **step)**
        * ```system:serviceaccount:azureml:cluster-status-reporter```
        * ```system:serviceaccount:azureml:prom-admission```
        * ```system:serviceaccount:azureml:default```
        * ```system:serviceaccount:azureml:prom-operator```
        * ```system:serviceaccount:azureml:csi-blob-node-sa```
        * ```system:serviceaccount:azureml:csi-blob-controller-sa```
        * ```system:serviceaccount:azureml:load-amlarc-selinux-policy-sa```
        * ```system:serviceaccount:azureml:azureml-fe```
        * ```system:serviceaccount:azureml:prom-prometheus```

## Deploy Azure Machine Learning extension

Azure Arc-enabled Kubernetes has a cluster extension functionality that enables you to install various agents including Azure Policy definitions, monitoring, machine learning, and many others. Azure Machine Learning requires the use of the *Microsoft.AzureML.Kubernetes* cluster extension to deploy the Azure Machine Learning agent on the Kubernetes cluster. Once the Azure Machine Learning extension is installed, you can attach the cluster to an Azure Machine Learning workspace and use it for the following scenarios:

* [Training](#training)
* [Real-time inferencing only](#inferencing)
* [Training and inferencing](#training-inferencing)

> [!TIP]
> Train only clusters also support batch inferencing as part of Azure Machine Learning Pipelines.

Use the `k8s-extension` Azure CLI extension [`create`](/cli/azure/k8s-extension?view=azure-cli-latest&preserve-view=true) command to deploy the Azure Machine Learning extension to your Azure Arc-enabled Kubernetes cluster.

> [!IMPORTANT]
> Set the `--cluster-type` parameter to `managedClusters` to deploy the Azure Machine Learning extension to AKS clusters.

The following is the list of configuration settings available to be used for different Azure Machine Learning extension deployment scenarios.

You can use ```--config``` or ```--config-protected``` to specify list of key-value pairs for Azure Machine Learning deployment configurations.

> [!TIP]
> Set the `openshift` parameter to `True` to deploy the Azure Machine Learning extension to ARO and OCP Kubernetes clusters.

| Configuration Setting Key Name  | Description  | Training | Inference | Training and Inference |
|---|---|---|---|---|
| ```enableTraining``` | Default `False`. Set to `True` to create an extension instance for training machine learning models. |  **&check;** | N/A |  **&check;** |
|```logAnalyticsWS```  | Default `False`. The Azure Machine Learning extension integrates with Azure LogAnalytics Workspace. Set to `True` to provide log viewing and analysis capability through LogAnalytics Workspace. LogAnalytics Workspace cost may apply. | Optional | Optional | Optional |
|```installNvidiaDevicePlugin```  | Default `True`. Nvidia Device Plugin is required for training and inferencing on Nvidia GPU hardware. The Azure Machine Learning extension installs the Nvidia Device Plugin by default during the Azure Machine Learning instance creation regardless of whether the Kubernetes cluster has GPU hardware or not. Set to `False` if you don't plan on using a GPU or Nvidia Device Plugin is already installed.  | Optional |Optional | Optional |
| ```enableInference``` | Default `False`.  Set to `True`  to create an extension instance for inferencing machine learning models. | N/A | **&check;** |  **&check;** |
| ```allowInsecureConnections``` | Default `False`. Set to `True` for Azure Machine Learning extension deployment with HTTP endpoint support for inference, when ```sslCertPemFile``` and ```sslKeyPemFile``` are not provided. | N/A | Optional |  Optional |
| ```sslCertPemFile``` & ```ssKeyPMFile``` | Path to SSL certificate and key file (PEM-encoded). Required for AzureML extension deployment with HTTPS endpoint support for inference. | N/A | Optional |  Optional |
| ```privateEndpointNodeport``` | Default `False`.  Set to `True` for Azure Machine Learning extension deployment with machine learning inference private endpoint support using NodePort. | N/A | Optional |  Optional |
| ```privateEndpointILB``` | Default `False`.  Set to `True` for Azure Machine Learning extension deployment with Machine Learning inference private endpoints support using serviceType internal load balancer | N/A| Optional |  Optional |
| ```inferenceLoadBalancerHA``` | Default `True`. By default, the Azure Machine Learning extension deploys multiple ingress controller replicas for high availability. Set to `False` if you have limited cluster resources or want to deploy Azure Machine Learning extension for development and testing only. Not using a high-availability load-balancer deploys only one ingress controller replica. | N/A | Optional |  Optional |
|```openshift``` | Default `False`. Set to `True` for Azure Machine Learning extension deployment on ARO or OCP cluster. The deployment process  automatically compiles a policy package and load policy package on each node so Azure Machine Learning services operation can function properly. | Optional | Optional |  Optional |

> [!WARNING]
> If Nvidia Device Plugin, is already installed in your cluster, reinstalling them may result in an extension installation error. Set `installNvidiaDevicePlugin` to `False` to prevent deployment errors.

### Deploy extension for training workloads <a id="training"></a>

Use the following Azure CLI command to deploy the Azure Machine Learning extension and enable training workloads on your Kubernetes cluster:

```azurecli
az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --config enableTraining=True --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group> --scope cluster
```

### Deploy extension for real-time inferencing workloads <a id="inferencing"></a>

Depending your network setup, Kubernetes distribution variant, and where your Kubernetes cluster is hosted (on-premises or the cloud), choose one of following options to deploy the Azure Machine Learning extension and enable inferencing workloads on your Kubernetes cluster.

#### Public endpoints support with public load balancer

* **HTTPS**

    ```azurecli
    az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --config enableInference=True --config-protected sslCertPemFile=<path-to-the-SSL-cert-PEM-ile> sslKeyPemFile=<path-to-the-SSL-key-PEM-file> --resource-group <resource-group> --scope cluster
    ```

* **HTTP**

    > [!WARNING]
    > Public HTTP endpoints support with public load balancer is the least secure way of deploying the Azure Machine Learning extension for real-time inferencing scenarios and is therefore **NOT** recommended.

    ```azurecli
    az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name>  --configuration-settings enableInference=True allowInsecureConnections=True --resource-group <resource-group> --scope cluster
    ```

#### Private endpoints support with internal load balancer

* **HTTPS**

    ```azurecli
    az k8s-extension create --name amlarc-compute --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --config enableInference=True privateEndpointILB=True --config-protected sslCertPemFile=<path-to-the-SSL-cert-PEM-ile> sslKeyPemFile=<path-to-the-SSL-key-PEM-file> --resource-group <resource-group> --scope cluster
    ```

* **HTTP**

   ```azurecli
   az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --config enableInference=True privateEndpointILB=True allowInsecureConnections=True --resource-group <resource-group> --scope cluster
   ```

#### Endpoints support with NodePort

Using a NodePort gives you the freedom to set up your own load balancing solution, to configure environments that are not fully supported by Kubernetes, or even to expose one or more nodes' IPs directly.

When you deploy with NodePort service, the scoring url (or swagger url) will be replaced with one of Node IP (e.g. ```http://<NodeIP><NodePort>/<scoring_path>```) and remain unchanged even if the Node is unavailable. But you can replace it with any other Node IP.

* **HTTPS**

    ```azurecli
    az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group> --scope cluster --config enableInference=True privateEndpointNodeport=True --config-protected sslCertPemFile=<path-to-the-SSL-cert-PEM-ile> sslKeyPemFile=<path-to-the-SSL-key-PEM-file>
    ```

* **HTTP**

   ```azurecli
   az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --config enableInference=True privateEndpointNodeport=True allowInsecureConnections=Ture --resource-group <resource-group> --scope cluster
   ```

### Deploy extension for training and inferencing workloads <a id="training-inferencing"></a>

Use the following Azure CLI command to deploy the Azure Machine Learning extension and enable cluster real-time inferencing, batch-inferencing, and training workloads on your Kubernetes cluster.

```azurecli
az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --config enableTraining=True enableInference=True --config-protected sslCertPemFile=<path-to-the-SSL-cert-PEM-ile> sslKeyPemFile=<path-to-the-SSL-key-PEM-file>--resource-group <resource-group> --scope cluster
```

## Resources created during deployment

Once the Azure Machine Learning extension is deployed, the following resources are created in Azure as well as your Kubernetes cluster, depending on the workloads you run on your cluster.

|Resource name  |Resource type |Training |Inference |Training and Inference|
|---|---|---|---|---|
|Azure ServiceBus|Azure resource|**&check;**|**&check;**|**&check;**|
|Azure Relay|Azure resource|**&check;**|**&check;**|**&check;**|
|{EXTENSION-NAME}|Azure resource|**&check;**|**&check;**|**&check;**|
|aml-operator|Kubernetes deployment|**&check;**|N/A|**&check;**|
|{EXTENSION-NAME}-kube-state-metrics|Kubernetes deployment|**&check;**|**&check;**|**&check;**|
|{EXTENSION-NAME}-prometheus-operator|Kubernetes deployment|**&check;**|**&check;**|**&check;**|
|amlarc-identity-controller|Kubernetes deployment|N/A|**&check;**|**&check;**|
|amlarc-identity-proxy|Kubernetes deployment|N/A|**&check;**|**&check;**|
|azureml-fe|Kubernetes deployment|N/A|**&check;**|**&check;**|
|inference-operator-controller-manager|Kubernetes deployment|N/A|**&check;**|**&check;**|
|metrics-controller-manager|Kubernetes deployment|**&check;**|**&check;**|**&check;**|
|relayserver|Kubernetes deployment|**&check;**|**&check;**|**&check;**|
|cluster-status-reporter|Kubernetes deployment|**&check;**|**&check;**|**&check;**|
|nfd-master|Kubernetes deployment|**&check;**|N/A|**&check;**|
|gateway|Kubernetes deployment|**&check;**|**&check;**|**&check;**|
|csi-blob-controller|Kubernetes deployment|**&check;**|N/A|**&check;**|
|csi-blob-node|Kubernetes daemonset|**&check;**|N/A|**&check;**|
|fluent-bit|Kubernetes daemonset|**&check;**|**&check;**|**&check;**|
|k8s-host-device-plugin-daemonset|Kubernetes daemonset|**&check;**|**&check;**|**&check;**|
|nfd-worker|Kubernetes daemonset|**&check;**|N/A|**&check;**|
|prometheus-prom-prometheus|Kubernetes statefulset|**&check;**|**&check;**|**&check;**|
|frameworkcontroller|Kubernetes statefulset|**&check;**|N/A|**&check;**|

> [!IMPORTANT]
> Azure ServiceBus and Azure Relay resources are under the same resource group as the Arc cluster resource. These resources are used to communicate with the Kubernetes cluster and modifying them will break attached compute targets.

> [!NOTE]
> **{EXTENSION-NAME}** is the extension name specified by the ```az k8s-extension create --name``` Azure CLI command.

## Verify your AzureML extension deployment

```azurecli
az k8s-extension show --name arcml-extension --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group>
```

In the response, look for `"extensionType": "arcml-extension"` and `"installState": "Installed"`. Note it might show `"installState": "Pending"` for the first few minutes.

When the `installState` shows **Installed**, run the following command on your machine with the kubeconfig file pointed to your cluster to check that all pods under *azureml* namespace are in *Running* state:

```bash
kubectl get pods -n azureml
```

## Attach Arc Cluster

### [Studio](#tab/studio)

Attaching an Azure Arc-enabled Kubernetes cluster makes it available to your workspace for training.

1. Navigate to [Azure Machine Learning studio](https://ml.azure.com).
1. Under **Manage**, select **Compute**.
1. Select the **Attached computes** tab.
1. Select **+New > Kubernetes (preview)**

   ![Attach Kubernetes cluster](./media/how-to-attach-arc-kubernetes/attach-kubernetes-cluster.png)

1. Enter a compute name and select your Azure Arc-enabled Kubernetes cluster from the dropdown.

    * **(Optional)** Enter Kubernetes namespace, which defaults to `default`. All machine learning workloads will be sent to the specified kubernetes namespace in the cluster.

    * **(Optional)** Assign system-assigned or user-assigned managed identity. Managed identities eliminate the need for developers to manage credentials. See the [managed identities overview](../active-directory/managed-identities-azure-resources/overview.md) for more information.

    ![Configure Kubernetes cluster](./media/how-to-attach-arc-kubernetes/configure-kubernetes-cluster-2.png)

1. Select **Attach**

    In the Attached compute tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    ![Provision resources](./media/how-to-attach-arc-kubernetes/provision-resources.png)

### [Python SDK](#tab/sdk)

You can use the Azure Machine Learning Python SDK to attach Azure Arc-enabled Kubernetes clusters as compute targets using the [`attach_configuration`](/python/api/azureml-core/azureml.core.compute.kubernetescompute.kubernetescompute?view=azure-ml-py&preserve-view=true) method.

The following Python code shows how to attach an Azure Arc-enabled Kubernetes cluster and use it as a compute target with managed identity enabled.

Managed identities eliminate the need for developers to manage credentials. See the [managed identities overview](../active-directory/managed-identities-azure-resources/overview.md) for more information.

```python
from azureml.core.compute import KubernetesCompute
from azureml.core.compute import ComputeTarget
from azureml.core.workspace import Workspace
import os

ws = Workspace.from_config()

# Specify a name for your Kubernetes compute
amlarc_compute_name = "<COMPUTE_CLUSTER_NAME>"

# resource ID for the Kubernetes cluster and user-managed identity
resource_id = "/subscriptions/<sub ID>/resourceGroups/<RG>/providers/Microsoft.Kubernetes/connectedClusters/<cluster name>"

user_assigned_identity_resouce_id = ['subscriptions/<sub ID>/resourceGroups/<RG>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity name>']

ns = "default" 

if amlarc_compute_name in ws.compute_targets:
    amlarc_compute = ws.compute_targets[amlarc_compute_name]
    if amlarc_compute and type(amlarc_compute) is KubernetesCompute:
        print("found compute target: " + amlarc_compute_name)
else:
   print("creating new compute target...")


# assign user-assigned managed identity
amlarc_attach_configuration = KubernetesCompute.attach_configuration(resource_id = resource_id, namespace = ns,  identity_type ='UserAssigned',identity_ids = user_assigned_identity_resouce_id) 

# assign system-assigned managed identity
# amlarc_attach_configuration = KubernetesCompute.attach_configuration(resource_id = resource_id, namespace = ns,  identity_type ='SystemAssigned') 

amlarc_compute = ComputeTarget.attach(ws, amlarc_compute_name, amlarc_attach_configuration)
amlarc_compute.wait_for_completion(show_output=True)

# get detailed compute description containing managed identity principle ID, used for permission access. 
print(amlarc_compute.get_status().serialize())
```

Use the `identity_type` parameter to enable `SystemAssigned` or `UserAssigned` managed identities.

### [CLI](#tab/cli)

You can attach an AKS or Azure Arc enabled Kubernetes cluster using the Azure Machine Learning 2.0 CLI (preview).

Use the Azure Machine Learning CLI [`attach`](/cli/azure/ml/compute?view=azure-cli-latest&preserve-view=true) command and set the `--type` argument to `kubernetes` to attach your Kubernetes cluster using the Azure Machine Learning 2.0 CLI.

> [!NOTE]
> Compute attach support for AKS or Azure Arc enabled Kubernetes clusters requires a version of the Azure CLI `ml` extension >= 2.0.1a4. For more information, see [Install and set up the CLI (v2)](how-to-configure-cli.md).

The following commands show how to attach an Azure Arc-enabled Kubernetes cluster and use it as a compute target with managed identity enabled.

**AKS**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --name amlarc-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/managedclusters/<cluster-name>" --type kubernetes --identity-type UserAssigned --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

**Azure Arc enabled Kubernetes**

```azurecli
az ml compute attach --resource-group <resource-group-name> --workspace-name <workspace-name> --name amlarc-compute --resource-id "/subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.Kubernetes/connectedClusters/<cluster-name>" --type kubernetes --user-assigned-identities "subscriptions/<subscription-id>/resourceGroups/<resource-group-name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<identity-name>" --no-wait
```

Use the `identity_type` argument to enable `SystemAssigned` or `UserAssigned` managed identities.

> [!IMPORTANT]
> `--user-assigned-identities` is only required for `UserAssigned` managed identities. Although you can provide a list of comma-separated user managed identities, only the first one is used when you attach your cluster.

---

## Next steps

- [Create and select different instance types for training and inferencing workloads](how-to-kubernetes-instance-type.md)
- [Train models with CLI (v2)](how-to-train-cli.md)
- [Configure and submit training runs](how-to-set-up-training-targets.md)
- [Tune hyperparameters](how-to-tune-hyperparameters.md)
- [Train a model using Scikit-learn](how-to-train-scikit-learn.md)
- [Train a TensorFlow model](how-to-train-tensorflow.md)
- [Train a PyTorch model](how-to-train-pytorch.md)
- [Train using Azure Machine Learning pipelines](how-to-create-machine-learning-pipelines.md)
- [Train model on-premise with outbound proxy server](../azure-arc/kubernetes/quickstart-connect-cluster.md#4a-connect-using-an-outbound-proxy-server)