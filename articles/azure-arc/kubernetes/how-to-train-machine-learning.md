---
title: Train machine learning models (preview)
description: Configure Azure Arc enabled Kubernetes Cluster to train machine learning models with Azure Machine Learning
titleSuffix: Azure Arc
author: luisquintanilla
ms.author: luquinta
ms.service: azure-arc 
ms.date: 05/11/2021
ms.topic: how-to 
---

# Configure cluster for machine learning training (preview)

Learn how to configure an Azure Arc enabled Kubernetes cluster to train machine learning models with Azure Machine Learning

## Prerequisites

- Azure Arc enabled Kubernetes cluster. For more information, see the [Connect an existing Kubernetes cluster to Azure Arc quickstart guide](quickstart-connect-cluster.md)

## How does the integration with Azure Arc enabled Kubernetes work?

Once a Kubernetes cluster is registered in Azure you can view and manage it in the Azure Kubernetes Service portal. 

Azure Arc enabled Kubernetes has a cluster extensions functionality that enables the ability to install various agents including Azure policy, monitoring, machine learning, and many others. Azure Machine Learning requires the use of the cluster extension to deploy the Azure Machine Learning agent on the Kubernetes cluster. Once the Azure Machine Learning extension is installed, you can attach the cluster to an Azure Machine Learning workspace and use it for training. 

## Install Microsoft.AzureML.Kubernetes extension

1. Install the Azure Arc extensions CLI. For more information, see [Kubernetes cluster extensions](extensions.md).
1. Install `Microsoft.AzureML.Kubernetes` extension on your Arc cluster.

    > [!NOTE]
    > Arc cluster and AML workspace must be in the same region.

    ```azurecli
    az k8s-extension create --cluster-type connectedClusters --cluster-name <cluster-name> --resource-group <myRG> --name <compute-name> --extension-type Microsoft.AzureML.Kubernetes --scope cluster --configuration-settings enableTraining=True
    ```

Running this command will create a Service Bus and Relay resource under the same resource group as the Arc cluster.  These resources are used to communicate with the cluster and modifying them will break attached compute targets.

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

- [Attach a Kubernetes cluster to Azure Machine Learning workspace (SDK)](/machine-learning/how-to-attach-compute-targets.md)
- [Attach a Kubernetes cluster to Azure Machine Learning workspace (UI)](/machine-learning/how-to-attach-compute-studio.md)
- [Use a cluster for training](/machine-learning/how-to-set-up-training-targets.md)