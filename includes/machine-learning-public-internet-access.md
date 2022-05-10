---
title: Include file
description: Include file
author: lobrien
ms.service: machine-learning
services: machine-learning
ms.topic: include
ms.date: 11/30/2021
ms.author: larryfr
ms.custom: include file
---

Azure Machine Learning requires both inbound and outbound access to the public internet. The following tables provide an overview of what access is required and what it is for. The __protocol__ for all items is __TCP__. For service tags that end in `.region`, replace `region` with the Azure region that contains your workspace. For example, `Storage.westus`:

| Direction | Ports | Service tag | Purpose |
| ----- |:-----:| ----- | ----- |
| Inbound | 29876-29877 | BatchNodeManagement | Create, update, and delete of Azure Machine Learning compute instance and compute cluster. |
| Inbound | 44224 | AzureMachineLearning | Create, update, and delete of Azure Machine Learning compute instance. |
| Outbound | 443 | AzureMonitor | Used to log monitoring and metrics to App Insights and Azure Monitor. |
| Outbound | 80, 443 | AzureActiveDirectory | Authentication using Azure AD. |
| Outbound | 443 | AzureMachineLearning | Using Azure Machine Learning services. |
| Outbound | 443 | AzureResourceManager | Creation of Azure resources with Azure Machine Learning. |
| Outbound | 443 | Storage.region | Access data stored in the Azure Storage Account for the Azure Batch service. |
| Outbound | 443 | AzureFrontDoor.FrontEnd</br>* Not needed in Azure China. | Global entry point for [Azure Machine Learning studio](https://ml.azure.com). | 
| Outbound | 443 | ContainerRegistry.region | Access docker images provided by Microsoft. |
| Outbound | 443 | MicrosoftContainerRegistry.region | Access docker images provided by Microsoft. Setup of the Azure Machine Learning router for Azure Kubernetes Service. |
| Outbound | 443 | Keyvault.region | Access the key vault for the Azure Batch service. Only needed if your workspace was created with the [hbi_workspace](/python/api/azureml-core/azureml.core.workspace%28class%29#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-) flag enabled. |

> [!TIP]
> If you need the IP addresses instead of service tags, use one of the following options:
> * Download a list from [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519).
> * Use the Azure CLI [az network list-service-tags](/cli/azure/network#az-network-list-service-tags) command.
> * Use the Azure PowerShell [Get-AzNetworkServiceTag](/powershell/module/az.network/get-aznetworkservicetag) command.
> 
> The IP addresses may change periodically.

You may also need to allow __outbound__ traffic to Visual Studio Code and non-Microsoft sites for the installation of packages required by your machine learning project. The following table lists commonly used repositories for machine learning:

| Host name | Purpose |
| ----- | ----- |
| **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
| **\*.anaconda.org** | Used to get repo data. |
| **pypi.org** | Used to list dependencies from the default index, if any, and the index is not overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
| **cloud.r-project.org** | Used when installing CRAN packages for R development. |
| **\*pytorch.org** | Used by some examples based on PyTorch. |
| **\*.tensorflow.org** | Used by some examples based on Tensorflow. |
| **update.code.visualstudio.com**</br></br>**\*.vo.msecnd.net** | Used to retrieve VS Code server bits, which are installed on the compute instance through a setup script.|
| **raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/\*** | Used to retrieve websocket server bits, which are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance.|

When using Azure Kubernetes Service (AKS) with Azure Machine Learning, allow the following traffic to the AKS VNet:

* General inbound/outbound requirements for AKS as described in the [Restrict egress traffic in Azure Kubernetes Service](../articles/aks/limit-egress-traffic.md) article.
* __Outbound__ to mcr.microsoft.com.
* When deploying a model to an AKS cluster, use the guidance in the [Deploy ML models to Azure Kubernetes Service](../articles/machine-learning/how-to-deploy-azure-kubernetes-service.md#connectivity) article.