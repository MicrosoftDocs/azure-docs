---
title: include file
description: include file
author: lobrien
ms.service: machine-learning
services: machine-learning
ms.topic: include
ms.date: 07/21/2021
ms.author: larryfr
ms.custom: include file
---

Azure Machine Learning requires both inbound and outbound access to the public internet. The following tables provide an overview of what access is required and what it is for. The __protocol__ for all items is __TCP__. For service tags that end in `.region`, replace `region` with the Azure region that contains your workspace. For example, `Storage.westus`:

| Direction | Ports | Service tag | Purpose |
| ----- |:-----:| ----- | ----- |
| Inbound | 29876-29877 | BatchNodeManagement | Azure Machine Learning compute instance and compute cluster. |
| Inbound | 44224 | AzureMachineLearning | Azure Machine Learning compute instance. |
| Outbound | * | AzureActiveDirectory | Azure Active Directory authentication. |
| Outbound | 443 | AzureMachineLearning | Azure Machine Learning. |
| Outbound | 443 | AzureResourceManager | Azure Resource Manager. |
| Outbound | 443 | Storage.region | Azure Storage Account. |
| Outbound | 443 | AzureFrontDoor.FrontEnd</br>* Not needed in Azure China. | Azure Front Door. | 
| Outbound | 443 | ContainerRegistry.region | Azure Container Registry. Only needed when using custom Docker images. Including small modifications (such as extra packages) to base images provided by Microsoft. |
| Outbound | 443 | MicrosoftContainerRegistry.region | Only needed if you use Docker images provided by Microsoft and enable user-managed dependencies. |

> [!TIP]
> If you need the IP addresses instead of service tags, use one of the following options:
> * Download a list from [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519).
> * Use the Azure CLI [az network list-service-tags](/cli/azure/network#az_network_list_service_tags) command.
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
| **update.code.visualstudio.com**</br></br>**\*.vo.msecnd.net** | Used to retrieve VS Code server bits which are installed on the compute instance through a setup script.|
| **raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/\*** | Used to retrieve websocket server bits which are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance.|