---
title:  Azure Arc-enabled machine learning (preview)
description: Configure Azure Arc-enabled Kubernetes cluster to train and inference machine learning models in Azure Machine Learning
titleSuffix: Azure Machine Learning
author: luisquintanilla
ms.author: luquinta
ms.service: machine-learning
ms.subservice: mlops
ms.date: 10/21/2021
ms.topic: how-to 
---

# Configure Azure Arc-enabled machine learning (preview)

Learn how to configure Azure Arc-enabled machine learning for training and inferencing.

## What is Azure Arc-enabled machine learning?

Azure Arc enables you to run Azure services in any Kubernetes environment, whether it’s on-premises, multicloud, or at the edge.

Azure Arc-enabled machine learning lets you to configure and use an Azure Arc-enabled Kubernetes clusters to train, inference, and manage machine learning models in Azure Machine Learning.

<!-- Azure Arc-enabled machine learning supports the following training scenarios:

* Train models with CLI (v2)
  * Distributed training
  * Hyperparameter sweeping
* Train models with Azure Machine Learning Python SDK
  * Hyperparameter tuning
* Build and use machine learning pipelines
* Train model on-premise with outbound proxy server
* Train model on-premise with NFS datastore -->

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription [create a free account](https://azure.microsoft.com/free) before you begin.
* Azure Arc-enabled Kubernetes cluster. For more information, see the [Connect an existing Kubernetes cluster to Azure Arc quickstart guide](../azure-arc/kubernetes/quickstart-connect-cluster.md).

    > [!NOTE]
    > For Azure Kubernetes Service (AKS) clusters, connecting them to Azure Arc is **optional**.

* Fulfill [Azure Arc-enabled Kubernetes cluster extensions prerequisites](../azure-arc/kubernetes/extensions.md#prerequisites).
  * Azure CLI version >= 2.24.0
  * Azure CLI k8s-extension extension version >= 0.4.3
* An Azure Machine Learning workspace. [Create a workspace](how-to-manage-workspace.md?tabs=python) before you begin if you don't have one already.
  * Azure Machine Learning Python SDK version >= 1.30
* Log into Azure using the Azure CLI

    ```azurecli
    az login
    az account set --subscription <your-subscription-id>
    ```  

## Deploy Azure Machine Learning extension

Azure Arc-enabled Kubernetes has a cluster extension functionality that enables you to install various agents including Azure Policy definitions, monitoring, machine learning, and many others. Azure Machine Learning requires the use of the *Microsoft.AzureML.Kubernetes* cluster extension to deploy the Azure Machine Learning agent on the Kubernetes cluster. Once the Azure Machine Learning extension is installed, you can attach the cluster to an Azure Machine Learning workspace and use it for the following scenarios:

* [Training](#training)
* [Real-time inferencing only](#inferencing)
* [Training and inferencing](#training-inferencing)

> [!NOTE]
> Train only clusters also support batch inferencing as part of Azure Machine Learning Pipelines.

Use the `k8s-extension` Azure CLI extension [`create`](/cli/azure/k8s-extension?view=azure-cli-latest) command to deploy the Azure Machine Learning extension to your Azure Arc-enabled Kubernetes cluster.

You can use ```--config``` or ```--config-protected``` to specify list of key=value pairs for AuzreML deployment configurations. Following is the list of configuration settings available to be used for different AzureML extension deployment scenarios.

|Configuration Setting Key Name  |Description  |Training |Inference |Training and Inference |
|---|---|---|---|---|
|```enableTraining``` |```True``` or ```False```, default ```False```. **Must** be set to ```True``` for AzureML extension deployment with Machine Learning model training support.  |  **&check;**| N/A |  **&check;** |
|```logAnalyticsWS```  |```True``` or ```False```, default ```False```. AzureML extension integrates with Azure LogAnalytics Workspace to provide log viewing and analysis capability through LogAalytics Workspace. This setting must be explicitly set to ```True``` if customer wants to leverage this capability. LogAnalytics Workspace cost may apply.  |Optional |Optional |Optional |
|```installNvidiaDevicePlugin```  | ```True``` or ```False```, default ```True```. Nvidia Device Plugin is required for ML inference on Nvidia GPU hardware. By default, AzureML extension deployment will install Nvidia Device Plugin regardless Kubernetes cluster has GPU hardware or not. User can specify this configuration setting to False if Nvidia Device Plugin installation is not required (either it is installed already or there is no plan to use GPU for workload).``` | Optional |Optional |Optional |
| ```enableInference``` |```True``` or ```False```, default ```False```.  **Must** be set to ```True``` for AzureML extension deployment with Machine Learning inference support. |N/A| **&check;** |  **&check;** |
| ```allowInsecureConnections``` |```True``` or ```False```, default False. This **must** be set to ```True``` for AzureML extension deployment with HTTP endpoints support for inference, when ```sslCertPemFile``` and ```sslKeyPemFile``` are not provided. |N/A| Optional |  Optional |
| ```sslCertPemFile```, ```ssKeyPMFile``` |Path to SSL certificate and key file (PEM-encoded), required for AzureML extension deployment with HTTPS endpoint support for inference. | N/A| Optional |  Optional |
| ```privateEndpointNodeport``` |```True``` or ```False```, default ```False```.  **Must** be set to ```True``` for AzureML deployment with Machine Learning inference private endpoints support using serviceType nodePort. | N/A| Optional |  Optional |
| ```privateEndpointILB``` |```True``` or ```False```, default ```False```.  **Must** be set to ```True``` for AzureML extension deployment with Machine Learning inference private endpoints support using serviceType internal load balancer | N/A| Optional |  Optional |
| ```inferenceLoadBalancerHA``` |```True``` or ```False```, default ```True```. By default, AzureML extension will deploy multiple ingress controller replicas for high availability. Set this to ```False``` if you have limited cluster resource and want to deploy AzureML extension for development and testing only, in this case it will deploy one ingress controller replica only. | N/A| Optional |  Optional |
|```openshift``` | ```True``` or ```False```, default ```False```. Set to ```True``` if you deploy AzureML extension on ARO or OCP cluster.The deployment process will automatically compile a policy package and load policy package on each node so AzureML services operation can function properly.  | Optional| Optional |  Optional |

### Deploy extension for training workloads <a id="training"></a>



### Deploy extension for real-time inferencing workloads <a id="inferencing"></a>

Depending your network setup, Kubernetes distribution variant, and where your Kubernetes cluster is hosted (on-premises or the cloud), you can choose one of following options to deploy AzureML extension.

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

When you deploy with NodePort service, the scoring url (or swagger url) will be responsed with one of Node IP (e.g. ```http://<NodeIP><NodePort>/<scoring_path>```) and remain unchanged even if the Node is unavailable. But you can replace it with any other Node IP.

* **HTTPS**

    ```azurecli
    az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group> --scope cluster --config enableInference=True privateEndpointNodeport=True --config-protected sslCertPemFile=<path-to-the-SSL-cert-PEM-ile> sslKeyPemFile=<path-to-the-SSL-key-PEM-file>
    ```

* **HTTP**

   ```azurecli
   az k8s-extension create --name arcml-extension --extension-type Microsoft.AzureML.Kubernetes --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --config enableInference=True privateEndpointNodeport=True allowInsecureConnections=Ture --resource-group <resource-group> --scope cluster
   ```

### Deploy extension for training and inferencing workloads <a id="training-inferencing"></a>

<!-- 1. Deploy Azure Machine Learning extension

    ```azurecli
    az k8s-extension create --name amlarc-compute --extension-type Microsoft.AzureML.Kubernetes --configuration-settings enableTraining=True  --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group> --scope cluster
    ```

    >[!IMPORTANT]
    > To enabled Azure Arc-enabled cluster for training, `enableTraining` must be set to **True**. Running this command creates an Azure Service Bus and Azure Relay resource under the same resource group as the Arc cluster. These resources are used to communicate with the cluster. Modifying them will break attached clusters used as training compute targets.

    You can also configure the following settings when you deploy the Azure Machine Learning extension for model training:

    |Configuration Setting Key Name  |Description  |
    |--|--|
    | ```enableTraining``` | Default `False`. Set to `True` to create an extension instance for training machine learning models.  |
    |```logAnalyticsWS```  | Default `False`. The Azure Machine Learning extension integrates with Azure LogAnalytics Workspace. Set to `True` to provide log viewing and analysis capability through LogAnalytics Workspace. LogAnalytics Workspace cost may apply.   |
    |```installNvidiaDevicePlugin```  | Default `True`. Nvidia Device Plugin is required for training on Nvidia GPU hardware. The Azure Machine Learning extension installs the Nvidia Device Plugin by default during the Azure Machine Learning instance creation regardless of whether the Kubernetes cluster has GPU hardware or not. Set to `False` if you don't plan on using a GPU for training or Nvidia Device Plugin is already installed.  |
    |```installBlobfuseSysctl```  | Default `True` if "enableTraining=True". Blobfuse 1.3.7 is required for training. Azure Machine Learning installs Blobfuse by default when the extension instance is created. Set this configuration setting to `False` if Blobfuse 1.37 is already installed on your Kubernetes cluster.   |
    |```installBlobfuseFlexvol```  | Default `True` if "enableTraining=True". Blobfuse Flexvolume is required for  training. Azure Machine Learning installs Blobfuse Flexvolume by default to your default path. Set this configuration setting to `False` if Blobfuse Flexvolume is already installed on your Kubernetes cluster.   |
    |```volumePluginDir```  | Host path for Blobfuse Flexvolume to be installed. Applicable only if "enableTraining=True". By default, Azure Machine Learning installs Blobfuse Flexvolume under default path */etc/kubernetes/volumeplugins*. Specify a custom installation location by specifying this configuration setting.```   |

    > [!WARNING]
    > If Nvidia Device Plugin, Blobfuse, and Blobfuse Flexvolume are already installed in your cluster, reinstalling them may result in an extension installation error. Set `installNvidiaDevicePlugin`, `installBlobfuseSysctl`, and `installBlobfuseFlexvol` to `False` to prevent installation errors. -->

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
|gateway|Kubernetes deployment|**&check;**|N/A|**&check;**|
|csi-blob-controller|Kubernetes deployment|**&check;**|N/A|**&check;**|

> [!IMPORTANT]
> Azure ServiceBus and Azure Relay resources  are under the same resource group as the Arc cluster resource. These resources are used to communicate with the Kubernetes cluster and modifying them will break attached compute targets.

> [!NOTE]
> **{EXTENSION-NAME}** is the extension name specified by the ```az k8s-extension create --name``` Azure CLI command.

## Verify your AzureML extension deployment

```azurecli
az k8s-extension show --name amlarc-compute --cluster-type connectedClusters --cluster-name <your-connected-cluster-name> --resource-group <resource-group>
```

In the response, look for `"extensionType": "amlarc-compute"` and `"installState": "Installed"`. Note it might show `"installState": "Pending"` for the first few minutes.

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

   ![Configure Kubernetes cluster](./media/how-to-attach-arc-kubernetes/configure-kubernetes-cluster.png)

1. (Optional) For advanced scenarios, browse and upload a configuration file.

   ![Upload configuration file](./media/how-to-attach-arc-kubernetes/upload-configuration-file.png)

1. Select **Attach**

    In the Attached compute tab, the initial state of your cluster is *Creating*. When the cluster is successfully attached, the state changes to *Succeeded*. Otherwise, the state changes to *Failed*.

    ![Provision resources](./media/how-to-attach-arc-kubernetes/provision-resources.png)

#### Advanced attach scenario

Use a JSON configuration file to configure advanced compute target capabilities on Azure Arc-enabled Kubernetes clusters.

The following is an example configuration file:

```json
{
   "namespace": "amlarc-testing",
   "defaultInstanceType": "gpu_instance",
   "instanceTypes": {
      "gpu_instance": {
         "nodeSelector": {
            "accelerator": "nvidia-tesla-k80"
         },
         "resources": {
            "requests": {
               "cpu": "2",
               "memory": "16Gi",
               "nvidia.com/gpu": "1"
            },
            "limits": {
               "cpu": "2",
               "memory": "16Gi",
               "nvidia.com/gpu": "1"
            }
         }
      },
      "big_cpu_sku": {
         "nodeSelector": {
            "VMSizes": "VM-64vCPU-256GB"
         },
         "resources": {
            "requests": {
               "cpu": "4",
               "memory": "16Gi",
               "nvidia.com/gpu": "0"
            },
            "limits": {
               "cpu": "4",
               "memory": "16Gi",
               "nvidia.com/gpu": "0"
            }
         }
      }
   }
}
```

The following custom compute target properties can be configured using a configuration file:

* `namespace` - Defaults to `default` namespace. This is the namespace where jobs and pods run under. Note that when setting a namespace other than the default, the namespace must already exist. Creating namespaces requires cluster administrator privileges.

* `defaultInstanceType` - The type of instance where training jobs run on by default. Required `defaultInstanceType` if `instanceTypes` property is specified. The value of `defaultInstanceType` must be one of values defined in the `instanceTypes` property.

    > [!IMPORTANT]
    > Currently, only job submissions using computer target name are supported. Therefore, the configuration will always default to defaultInstanceType.

* `instanceTypes` - List of instance types used for training jobs. Each instance type is defined by `nodeSelector` and `resources requests/limits` properties:

  * `nodeSelector` - One or more node labels used to identify nodes in a cluster. Cluster administrator privileges are needed to create labels for cluster nodes. If this property is specified, training jobs are scheduled to run on nodes with the specified node labels. You can use `nodeSelector` to target a subset of nodes for training workload placement. This can be useful in scenarios where a cluster has different SKUs, or different types of nodes such as CPU or GPU nodes. For example, you could create node labels for all GPU nodes and define an `instanceType` for the GPU node pool. Doing so targets the GPU node pool exclusively when scheduling training jobs. 

  * `resources requests/limits` - Specifies resources requests and limits a training job pod to run. Defaults to 1 CPU and 4GB of of memory.

    >[!IMPORTANT]
    > By default, a cluster resource is deployed with 1 CPU and 4 GB of memory. If a cluster is configured with lower resources, the job run will fail. To ensure successful job completion, we recommend to always specify resources requests/limits according to training job needs. The following is an example default configuration file:
    >
    > ```json
    > {
    >    "namespace": "default",
    >    "defaultInstanceType": "defaultInstanceType",
    >    "instanceTypes": {
    >       "defaultInstanceType": {
    >          "nodeSelector": null,
    >          "resources": {
    >             "requests": {
    >                "cpu": "1",
    >                "memory": "4Gi",
    >                "nvidia.com/gpu": "0"
    >             },
    >             "limits": {
    >                "cpu": "1",
    >                "memory": "4Gi",
    >                "nvidia.com/gpu": "0"
    >             }
    >          }
    >       }
    >    }
    > }
    > ```

### [Python SDK](#tab/sdk)

The following Python code shows how to attach an Azure Arc-enabled Kubernetes cluster and use it as a compute target for training:

```python
from azureml.core.compute import KubernetesCompute
from azureml.core.compute import ComputeTarget
import os

ws = Workspace.from_config()

# choose a name for your Azure Arc-enabled Kubernetes compute
amlarc_compute_name = os.environ.get("AML_COMPUTE_CLUSTER_NAME", "amlarc-compute")

# resource ID for your Azure Arc-enabled Kubernetes cluster
resource_id = "/subscriptions/123/resourceGroups/rg/providers/Microsoft.Kubernetes/connectedClusters/amlarc-cluster"

if amlarc_compute_name in ws.compute_targets:
    amlarc_compute = ws.compute_targets[amlarc_compute_name]
    if amlarc_compute and type(amlarc_compute) is KubernetesCompute:
        print("found compute target: " + amlarc_compute_name)
else:
    print("creating new compute target...")

    amlarc_attach_configuration = KubernetesCompute.attach_configuration(resource_id) 
    amlarc_compute = ComputeTarget.attach(ws, amlarc_compute_name, amlarc_attach_configuration)

 
    amlarc_compute.wait_for_completion(show_output=True)
    
     # For a more detailed view of current KubernetesCompute status, use get_status()
    print(amlarc_compute.get_status().serialize())
```

#### Advanced attach scenario

The following code shows how to configure advanced compute target properties like namespace, nodeSelector, or resources requests/limits:

```python
from azureml.core.compute import KubernetesCompute
from azureml.core.compute import ComputeTarget
import os

ws = Workspace.from_config()

# choose a name for your Azure Arc-enabled Kubernetes compute
amlarc_compute_name = os.environ.get("AML_COMPUTE_CLUSTER_NAME", "amlarc-compute")

# resource ID for your Azure Arc-enabled Kubernetes cluster
resource_id = "/subscriptions/123/resourceGroups/rg/providers/Microsoft.Kubernetes/connectedClusters/amlarc-cluster"

if amlarc_compute_name in ws.compute_targets:
   amlarc_compute = ws.compute_targets[amlarc_compute_name]
   if amlarc_compute and type(amlarc_compute) is KubernetesCompute:
      print("found compute target: " + amlarc_compute_name)
else:
   print("creating new compute target...")
   ns = "amlarc-testing"
    
   instance_types = {
      "gpu_instance": {
         "nodeSelector": {
            "accelerator": "nvidia-tesla-k80"
         },
         "resources": {
            "requests": {
               "cpu": "2",
               "memory": "16Gi",
               "nvidia.com/gpu": "1"
            },
            "limits": {
               "cpu": "2",
               "memory": "16Gi",
               "nvidia.com/gpu": "1"
            }
        }
      },
      "big_cpu_sku": {
         "nodeSelector": {
            "VMSizes": "VM-64vCPU-256GB"
         }
      }
   }

   amlarc_attach_configuration = KubernetesCompute.attach_configuration(resource_id = resource_id, namespace = ns, default_instance_type="gpu_instance", instance_types = instance_types)
 
   amlarc_compute = ComputeTarget.attach(ws, amlarc_compute_name, amlarc_attach_configuration)

 
   amlarc_compute.wait_for_completion(show_output=True)
    
   # For a more detailed view of current KubernetesCompute status, use get_status()
   print(amlarc_compute.get_status().serialize())
```

### [CLI](#tab/cli)

Enter information about CLI here

---

## Next steps

- [Train models with CLI (v2)](how-to-train-cli.md)
- [Configure and submit training runs](how-to-set-up-training-targets.md)
- [Tune hyperparameters](how-to-tune-hyperparameters.md)
- [Train a model using Scikit-learn](how-to-train-scikit-learn.md)
- [Train a TensorFlow model](how-to-train-tensorflow.md)
- [Train a PyTorch model](how-to-train-pytorch.md)
- [Train using Azure Machine Learning pipelines](how-to-create-machine-learning-pipelines.md)
- [Train model on-premise with outbound proxy server](../azure-arc/kubernetes/quickstart-connect-cluster.md#4a-connect-using-an-outbound-proxy-server)
