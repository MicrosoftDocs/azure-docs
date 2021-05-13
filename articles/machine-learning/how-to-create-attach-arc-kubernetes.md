---
title:  Arc enabled Kubernetes training (preview)
description: Configure Azure Arc enabled Kubernetes Cluster to train machine learning models with Azure Machine Learning
titleSuffix: Azure Machine Learning
author: luisquintanilla
ms.author: luquinta
ms.service: azure-arc 
ms.date: 05/18/2021
ms.topic: how-to 
---

# Configure Kubernetes cluster for machine learning training (preview)

Learn how to configure an Azure Arc enabled Kubernetes cluster to train machine learning models with Azure Machine Learning

> [!IMPORTANT]
> Attached compute Kubernetes clusters for training are only supported in the following regions: westcentralus, southcentralus, southeastasia, uksouth, westus2, australiaeast, eastus2, westeurope, northeurope, eastus, francecentral.

## Prerequisites

- Azure Arc enabled Kubernetes cluster. For more information, see the [Connect an existing Kubernetes cluster to Azure Arc quickstart guide](/azure-arc/kubernetes/quickstart-connect-cluster.md)

## How does the integration with Azure Arc enabled Kubernetes work?

Once a Kubernetes cluster is registered in Azure you can view and manage it in the Azure Kubernetes Service portal. 

Azure Arc enabled Kubernetes has a cluster extensions functionality that enables the ability to install various agents including Azure policy, monitoring, machine learning, and many others. Azure Machine Learning requires the use of the cluster extension to deploy the Azure Machine Learning agent on the Kubernetes cluster. Once the Azure Machine Learning extension is installed, you can attach the cluster to an Azure Machine Learning workspace and use it for training. 

## Install Microsoft.AzureML.Kubernetes extension

1. Install the Azure Arc extensions CLI. For more information, see [Kubernetes cluster extensions](/azure-arc/kubernetes/extensions.md).
1. Install `Microsoft.AzureML.Kubernetes` extension on your Arc cluster.

    > [!NOTE]
    > Azure Arc enabled Kubernetes clusters and Azure Machine Learning workspaces must be in the same region.

    ```azurecli
    az k8s-extension create --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <myRG> --name <compute-name> --extension-type Microsoft.AzureML.Kubernetes --scope cluster --configuration-settings enableTraining=True
    ```

    Running this command will create a Service Bus and Relay resource under the same resource group as the Arc cluster.  These resources are used to communicate with the cluster and modifying them will break attached compute targets.

   For additional configuration, you can specify the following configuration settings:

   |Configuration Setting Key Name  |Description  |
   |--|--|
   | ```enableTraining``` | Default `False`. Set to `True` to create an extension instance for training machine learning models.  |
   |```relayConnectionString```  | Connection string for Azure Relay resource. Azure Relay resource is required for Kubernetes communication with Azure Machine Learning services in the cloud. The Azure Machine Learning extension creates an Azure Relay resource by default under the same resource group as your Azure Arc connected cluster. The Azure Machine Learning extension uses the provided Azure Relay resource if this configuration setting is set. |
   |```serviceBusConnectionString```  | Connection string for Azure Service Bus resource. Azure Service Bus resource is required for Kubernetes communication with Azure Machine Learning services in the cloud. The Azure Machine Learning extension creates an Azure Service Bus resource by default under the same resource group as your Azure Arc connected cluster. The Azure Machine Learning extension uses the provided Azure Service Bus resource if this configuration setting is set.   |
   |```logAnalyticsWS```  | Default `False`. The Azure Machine Learning extension integrates with Azure LogAnalytics Workspace. Set to `True` to provide log viewing and analysis capability through LogAnalytics Workspace. LogAnalytics Workspace cost may apply.   |
   |```installNvidiaDevicePlugin```  | Default `True`. Nvidia Device Plugin is required for training on Nvidia GPU hardware. The Azure Machine Learning extension installs the Nvidia Device Plugin by default during the Azure Machine Learning instance creation regardless of whether the Kubernetes cluster has GPU hardware or not. Set to `False` if you don't plan on using a GPU for training or Nvidia Device Plugin is already installed.  |
   |```installBlobfuseSysctl```  | Default `True` if "enableTraining=True". Blobfuse 1.3.7 is required for training. Azure Machine Learning installs Blobfuse by default when the extension instance is created. Set this configuration setting to `False` if Blobfuse 1.37 is already installed on your Kubernetes cluster.   |
   |```installBlobfuseFlexvol```  | Default `True` if "enableTraining=True". Blobfuse Flexvolume is required for  training. Azure Machine Learning installs Blobfuse Flexvolume by default to your default path. Set this configuration setting to `False` if Blobfuse Flexvolume is already installed on your Kubernetes cluster.   |
   |```volumePluginDir```  | Host path for Blobfuse Flexvolume to be installed. Applicable only if "enableTraining=True". By default, Azure Machine Learning installs Blobfuse Flexvolume under default path */etc/kubernetes/volumeplugins*. Specify a custom installation location by specifying this configuration setting.```   |


Once the extension is ready, you can inspect it using `kubectl get pods -n azureml`.

## Show properties

You can use the following command to show the properties of the extension including installation state:

```azurecli
az k8s-extension show --sub <sub_id> -g <rg_name> -c <arc_cluster_name> --cluster-type connectedclusters -n azureml-kubernetes-connector
```

## Delete extension

To delete the extension in the cluster, use the following command:

```azurecli
az k8s-extension delete --sub <sub_id> -g <rg_name> -c <arc_cluster_name> --cluster-type connectedclusters -n azureml-kubernetes-connector
```

## Next steps

- [Attach a Kubernetes cluster to Azure Machine Learning workspace (Python SDK)](how-to-attach-compute-targets.md#kubernetes)
- [Attach a Kubernetes cluster to Azure Machine Learning workspace (studio)](how-to-create-attach-compute-studio.md##attached-compute)
- [Configure and submit training runs](how-to-set-up-training-targets.md)