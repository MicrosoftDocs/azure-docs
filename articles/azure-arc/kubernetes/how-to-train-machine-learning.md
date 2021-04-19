---
title: Configure cluster for machine learning training (preview)
description: Configure Azure Arc enabled Kubernetes Cluster to train machine learning models with Azure Machine Learning
author: luisquintanilla
ms.author: luquinta
ms.service: azure-arc 
ms.date: 04/19/2020 
ms.topic: how-to 
---

# Configure cluster for machine learning training (preview)

Learn how to configure an Azure Arc enabled Kubernetes cluster to train machine learning models with Azure Machine Learning

## Prerequisites

- Azure Arc enabled Kubernetes cluster. For more information, see the [Connect an existing Kubernetes cluster to Azure Arc quickstart guide](quickstart-connect-cluster.md)

## How does the integration with Azure Arc enabled Kubernetes work?

Once a Kubernetes cluster is registered in Azure (assigned an ARM id to track it as a resource in Azure), one can view those clusters in the AKS portal
Azure Arc enabled Kubernetes has a cluster extensions functionality that enables the ability to install various agents including Azure policy, monitoring, ML, etc.
Azure ML requires the use of the cluster extension to deploy the Azure ML agent on the Arc Kubernetes cluster
Once the above step is complete, one can attach the Kubernetes cluster to the Azure ML workspace

## Install AMLK8s extension using Arc

#### Prerequisite: You need to connect your Kubernetes cluster to Arc before installing the AMlK8s extension.  
1. Follow the guide [here](https://docs.microsoft.com/en-us/azure/azure-arc/kubernetes/quickstart-connect-cluster) to install the correct `connectedk8s` CLI version.  

   Next, install the **preview version of the Arc extensions CLI** as follows:

2. Install the preview version of k8s-extensions CLI extension.  You can find the Python wheel file under `files` from the root of this repository. Download the file to your local machine and set the correct path


```bash
az extension add --source ./k8s_extension-0.1PP.15-py3-none-any.whl
```

3. Install `Microsoft.AzureML.Kubernetes` extension on your Arc cluster:

```bash
az k8s-extension create --sub <sub_id> -g <rg_name> -c <arc_cluster_name> --cluster-type connectedClusters  --extension-type Microsoft.AzureML.Kubernetes -n azureml-kubernetes-connector --release-train preview --config enableTraining=True
```

Running this command will create a Service Bus and Relay resource under the same resource group as the Arc cluster.  These resources are used to communicate with the cluster and modifying them will break attached compute targets.

Once the extension is ready, you can inspect it using `helm list -n azureml` or `kubectl get pods -n azureml`.

4. You can use the following command to show the properties of the extension including installation state:

```bash
az k8s-extension show --sub <sub_id> -g <rg_name> -c <arc_cluster_name> --cluster-type connectedclusters -n azureml-kubernetes-connector
```

5. To delete the extension in the cluster, use the following command:

```bash
az k8s-extension delete --sub <sub_id> -g <rg_name> -c <arc_cluster_name> --cluster-type connectedclusters -n azureml-kubernetes-connector
```

## Next steps

- [Attach a Kubernetes cluster to Azure Machine Learning workspace (SDK)](/machine-learning/how-to-attach-compute-targets)
- [Attach a Kubernetes cluster to Azure Machine Learning workspace (UI)](/machine-learning/how-to-attach-compute-studio)
- [Use a cluster for training](/machine-learning/how-to-set-up-training-targets)