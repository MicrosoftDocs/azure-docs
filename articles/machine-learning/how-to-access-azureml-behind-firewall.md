---
title: Configure inbound and outbound network traffic
titleSuffix: Azure Machine Learning
description: 'How to configure the required inbound and outbound network traffic when using a secure Azure Machine Learning workspace.'
services: machine-learning
ms.service: machine-learning
ms.subservice: enterprise-readiness
ms.topic: how-to
ms.author: jhirono
author: jhirono
ms.reviewer: larryfr
ms.date: 09/06/2022
ms.custom: devx-track-python, ignite-fall-2021, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
---

# Configure inbound and outbound network traffic

In this article, learn about the network communication requirements when securing Azure Machine Learning workspace in a virtual network (VNet). Including how to configure Azure Firewall to control access to your Azure Machine Learning workspace and the public internet. To learn more about securing Azure Machine Learning, see [Enterprise security for Azure Machine Learning](concept-enterprise-security.md).

> [!NOTE]
> The information in this article applies to Azure Machine Learning workspace configured with a private endpoint.

> [!TIP]
> This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:
>
> * [Virtual network overview](how-to-network-security-overview.md)
> * [Secure the workspace resources](how-to-secure-workspace-vnet.md)
> * [Secure the training environment](how-to-secure-training-vnet.md)
> * [Secure the inference environment](how-to-secure-inferencing-vnet.md)
> * [Enable studio functionality](how-to-enable-studio-virtual-network.md)
> * [Use custom DNS](how-to-custom-dns.md)

## Well-known ports

The following are well-known ports used by services listed in this article. If a port range is used in this article and isn't listed in this section, it's specific to the service and may not have published information on what it's used for:


| Port | Description |
| ----- | ----- | 
| 80 | Unsecured web traffic (HTTP) |
| 443 | Secured web traffic (HTTPS) |
| 445 | SMB traffic used to access file shares in Azure File storage |
| 8787 | Used when connecting to RStudio on a compute instance |

## Required public internet access

[!INCLUDE [machine-learning-required-public-internet-access](../../includes/machine-learning-public-internet-access.md)]

## Azure Firewall

> [!IMPORTANT]
> Azure Firewall provides security _for Azure Virtual Network resources_. Some Azure Services, such as Azure Storage Accounts, have their own firewall settings that _apply to the public endpoint for that specific service instance_. The information in this document is specific to Azure Firewall.
> 
> For information on service instance firewall settings, see [Use studio in a virtual network](how-to-enable-studio-virtual-network.md#firewall-settings).

* For __inbound__ traffic to Azure Machine Learning compute cluster and compute instance, use [user-defined routes (UDRs)](../virtual-network/virtual-networks-udr-overview.md) to skip the firewall.

* For __outbound__ traffic, create __network__ and __application__ rules. 

These rule collections are described in more detail in [What are some Azure Firewall concepts](../firewall/firewall-faq.yml#what-are-some-azure-firewall-concepts).

### Inbound configuration

[!INCLUDE [udr info for computes](../../includes/machine-learning-compute-user-defined-routes.md)]

### Outbound configuration

1. Add __Network rules__, allowing traffic __to__ and __from__ the following service tags:

    | Service tag | Protocol | Port |
    | ----- |:-----:|:-----:|
    | AzureActiveDirectory | TCP | 80, 443 |
    | AzureMachineLearning | TCP | 443, 8787, 18881 |
    | AzureResourceManager | TCP | 443 |
    | Storage.region       | TCP | 443 |
    | AzureFrontDoor.FrontEnd</br>* Not needed in Azure China. | TCP | 443 | 
    | AzureContainerRegistry.region  | TCP | 443 |
    | MicrosoftContainerRegistry.region</br>**Note** that this  tag has a dependency on the **AzureFrontDoor.FirstParty** tag | TCP | 443 |
    | AzureKeyVault.region | TCP | 443 |

    > [!TIP]
    > * AzureContainerRegistry.region is only needed for custom Docker images. Including small modifications (such as additional packages) to base images provided by Microsoft.
    > * MicrosoftContainerRegistry.region is only needed if you plan on using the _default Docker images provided by Microsoft_, and _enabling user-managed dependencies_.
    > * AzureKeyVault.region is only needed if your workspace was created with the [hbi_workspace](/python/api/azureml-core/azureml.core.workspace%28class%29#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-) flag enabled.
    > * For entries that contain `region`, replace with the Azure region that you're using. For example, `AzureContainerRegistry.westus`.

1. Add __Application rules__ for the following hosts:

    > [!NOTE]
    > This is not a complete list of the hosts required for all hosts you may need to communicate with, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

    | **Host name** | **Purpose** |
    | ---- | ---- |
    | **graph.windows.net** | Used by Azure Machine Learning compute instance/cluster. |
    | **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
    | **\*.anaconda.org** | Used to get repo data. |
    | **pypi.org** | Used to list dependencies from the default index, if any, and the index isn't overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
    | **cloud.r-project.org** | Used when installing CRAN packages for R development. |
    | **\*pytorch.org** | Used by some examples based on PyTorch. |
    | **\*.tensorflow.org** | Used by some examples based on Tensorflow. |
    | **\*vscode.dev**</br>**\*vscode-unpkg.net**</br>**\*vscode-cdn.net**</br>**\*vscodeexperiments.azureedge.net**</br>**default.exp-tas.com** | Required to access vscode.dev (Visual Studio Code for the Web) |
    | **code.visualstudio.com** | Required to download and install VS Code desktop. This is not required for VS Code Web. |
    | **update.code.visualstudio.com**</br>**\*.vo.msecnd.net** | Used to retrieve VS Code server bits that are installed on the compute instance through a setup script. |
    | **marketplace.visualstudio.com**</br>**vscode.blob.core.windows.net**</br>**\*.gallerycdn.vsassets.io** | Required to download and install VS Code extensions. These enable the remote connection to Compute Instances provided by the Azure ML extension for VS Code, see [Connect to an Azure Machine Learning compute instance in Visual Studio Code](./how-to-set-up-vs-code-remote.md) for more information. |
    | **raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/\*** | Used to retrieve websocket server bits that are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance.|
    | **dc.applicationinsights.azure.com** | Used to collect metrics and diagnostics information when working with Microsoft support. |
    | **dc.applicationinsights.microsoft.com** | Used to collect metrics and diagnostics information when working with Microsoft support. |
    | **dc.services.visualstudio.com** | Used to collect metrics and diagnostics information when working with Microsoft support. | 
    

    For __Protocol:Port__, select use __http, https__.

    For more information on configuring application rules, see [Deploy and configure Azure Firewall](../firewall/tutorial-firewall-deploy-portal.md#configure-an-application-rule).

1. To restrict outbound traffic for models deployed to Azure Kubernetes Service (AKS), see the [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md) and [Deploy ML models to Azure Kubernetes Service](v1/how-to-deploy-azure-kubernetes-service.md#connectivity) articles.

### Kubernetes Compute

[Kubernetes Cluster](./how-to-attach-kubernetes-anywhere.md) running behind an outbound proxy server or firewall needs extra network configuration. Configure the [Azure Arc network requirements](../azure-arc/kubernetes/quickstart-connect-cluster.md?tabs=azure-cli#meet-network-requirements) needed by Azure Arc agents. The following outbound URLs are also required for Azure Machine Learning,

| Outbound Endpoint| Port | Description|Training |Inference |
|--|--|--|--|--|
| __\*.kusto.windows.net__<br>__\*.table.core.windows.net__<br>__\*.queue.core.windows.net__ | https:443 | Required to upload system logs to Kusto. |**&check;**|**&check;**|
| __\*.azurecr.io__ | https:443 | Azure container registry, required to pull docker images used for machine learning workloads.|**&check;**|**&check;**|
| __\*.blob.core.windows.net__ | https:443 | Azure blob storage, required to fetch machine learning project scripts,data or models, and upload job logs/outputs.|**&check;**|**&check;**|
| __\*.workspace.\<region\>.api.azureml.ms__<br>__\<region\>.experiments.azureml.net__<br>__\<region\>.api.azureml.ms__ | https:443 | Azure Machine Learning service API.|**&check;**|**&check;**|
| __pypi.org__ | https:443 | Python package index, to install pip packages used for training job environment initialization.|**&check;**|N/A|
| __archive.ubuntu.com__<br>__security.ubuntu.com__<br>__ppa.launchpad.net__ | http:80 | Required to download the necessary security patches. |**&check;**|N/A|

> [!NOTE]
> `<region>` is the lowcase full spelling of Azure Region, for example, eastus, southeastasia.




## Other firewalls

The guidance in this section is generic, as each firewall has its own terminology and specific configurations. If you have questions, check the documentation for the firewall you're using.

If not configured correctly, the firewall can cause problems using your workspace. There are various host names that are used both by the Azure Machine Learning workspace. The following sections list hosts that are required for Azure Machine Learning.

### Dependencies API

You can also use the Azure Machine Learning REST API to get a list of hosts and ports that you must allow __outbound__ traffic to. To use this API, use the following steps:

1. Get an authentication token. The following command demonstrates using the [Azure CLI](/cli/azure/install-azure-cli) to get an authentication token and subscription ID:

    ```azurecli-interactive
    TOKEN=$(az account get-access-token --query accessToken -o tsv)
    SUBSCRIPTION=$(az account show --query id -o tsv)
    ```

2. Call the API. In the following command, replace the following values:
    * Replace `<region>` with the Azure region your workspace is in. For example, `westus2`.
    * Replace `<resource-group>` with the resource group that contains your workspace.
    * Replace `<workspace-name>` with the name of your workspace.

    ```azurecli-interactive
    az rest --method GET \
        --url "https://<region>.api.azureml.ms/rp/workspaces/subscriptions/$SUBSCRIPTION/resourceGroups/<resource-group>/providers/Microsoft.MachineLearningServices/workspaces/<workspace-name>/outboundNetworkDependenciesEndpoints?api-version=2018-03-01-preview" \
        --header Authorization="Bearer $TOKEN"
    ```

The result of the API call is a JSON document. The following snippet is an excerpt of this document:

```json
{
  "value": [
    {
      "properties": {
        "category": "Azure Active Directory",
        "endpoints": [
          {
            "domainName": "login.microsoftonline.com",
            "endpointDetails": [
              {
                "port": 80
              },
              {
                "port": 443
              }
            ]
          }
        ]
      }
    },
    {
      "properties": {
        "category": "Azure portal",
        "endpoints": [
          {
            "domainName": "management.azure.com",
            "endpointDetails": [
              {
                "port": 443
              }
            ]
          }
        ]
      }
    },
...
```

### Microsoft hosts

The hosts in the following tables are owned by Microsoft, and provide services required for the proper functioning of your workspace. The tables list hosts for the Azure public, Azure Government, and Azure China 21Vianet regions.

> [!IMPORTANT]
> Azure Machine Learning uses Azure Storage Accounts in your subscription and in Microsoft-managed subscriptions. Where applicable, the following terms are used to differentiate between them in this section:
>
> * __Your storage__: The Azure Storage Account(s) in your subscription, which is used to store your data and artifacts such as models, training data, training logs, and Python scripts.>
> * __Microsoft storage__: The Azure Machine Learning compute instance and compute clusters rely on Azure Batch, and must access storage located in a Microsoft subscription. This storage is used only for the management of the compute instances. None of your data is stored here.

**General Azure hosts**

# [Azure public](#tab/public)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ---- | 
| Azure Active Directory | login.microsoftonline.com | TCP | 80, 443 |
| Azure portal | management.azure.com | TCP | 443 |
| Azure Resource Manager | management.azure.com | TCP | 443 |

# [Azure Government](#tab/gov)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ---- |
| Azure Active Directory | login.microsoftonline.us | TCP | 80, 443 |
| Azure portal | management.azure.us | TCP | 443 |
| Azure Resource Manager | management.usgovcloudapi.net | TCP | 443 |

# [Azure China 21Vianet](#tab/china)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Azure Active Directory | login.chinacloudapi.cn | TCP | 80, 443 |
| Azure portal | management.azure.cn | TCP | 443 |
| Azure Resource Manager | management.chinacloudapi.cn | TCP | 443 |

---

**Azure Machine Learning hosts**

> [!IMPORTANT]
> In the following table, replace `<storage>` with the name of the default storage account for your Azure Machine Learning workspace.

# [Azure public](#tab/public)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | ml.azure.com | TCP | 443 |
| API |\*.azureml.ms | TCP | 443 |
| API | \*.azureml.net | TCP | 443 |
| Model management | \*.modelmanagement.azureml.net | TCP | 443 |
| Integrated notebook | \*.notebooks.azure.net | TCP | 443 |
| Integrated notebook | \<storage\>.file.core.windows.net | TCP | 443, 445 |
| Integrated notebook | \<storage\>.dfs.core.windows.net | TCP | 443 |
| Integrated notebook | \<storage\>.blob.core.windows.net | TCP | 443 |
| Integrated notebook | graph.microsoft.com | TCP | 443 |
| Integrated notebook | \*.aznbcontent.net | TCP | 443 |
| AutoML NLP | automlresources-prod.azureedge.net | TCP | 443 |
| AutoML NLP | aka.ms | TCP | 443 |

> [!NOTE]
> AutoML NLP is currently only supported in Azure public regions.

# [Azure Government](#tab/gov)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | ml.azure.us | TCP | 443 |
| API | \*.ml.azure.us | TCP | 443 |
| Model management | \*.modelmanagement.azureml.us | TCP | 443 |
| Integrated notebook | \*.notebooks.usgovcloudapi.net | TCP | 443 |
| Integrated notebook | \<storage\>.file.core.usgovcloudapi.net | TCP | 443, 445 |
| Integrated notebook | \<storage\>.dfs.core.usgovcloudapi.net | TCP | 443 |
| Integrated notebook  | \<storage\>.blob.core.usgovcloudapi.net | TCP | 443 |
| Integrated notebook | graph.microsoft.us | TCP | 443 |
| Integrated notebook | \*.aznbcontent.net | TCP | 443 |

# [Azure China 21Vianet](#tab/china)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | studio.ml.azure.cn | TCP | 443 |
| API | \*.ml.azure.cn | TCP | 443 |
| API | \*.azureml.cn | TCP | 443 |
| Model management | \*.modelmanagement.ml.azure.cn | TCP | 443 |
| Integrated notebook | \*.notebooks.chinacloudapi.cn | TCP | 443 |
| Integrated notebook | \<storage\>.file.core.chinacloudapi.cn | TCP | 443, 445 |
| Integrated notebook | \<storage\>.dfs.core.chinacloudapi.cn | TCP | 443 |
| Integrated notebook | \<storage\>.blob.core.chinacloudapi.cn | TCP | 443 |
| Integrated notebook | graph.chinacloudapi.cn | TCP | 443 |
| Integrated notebook | \*.aznbcontent.net | TCP | 443 |

---

**Azure Machine Learning compute instance and compute cluster hosts**

> [!TIP]
> * The host for __Azure Key Vault__ is only needed if your workspace was created with the [hbi_workspace](/python/api/azureml-core/azureml.core.workspace%28class%29#create-name--auth-none--subscription-id-none--resource-group-none--location-none--create-resource-group-true--sku--basic---friendly-name-none--storage-account-none--key-vault-none--app-insights-none--container-registry-none--cmk-keyvault-none--resource-cmk-uri-none--hbi-workspace-false--default-cpu-compute-target-none--default-gpu-compute-target-none--exist-ok-false--show-output-true-) flag enabled.
> * Ports 8787 and 18881 for __compute instance__ are only needed when your Azure Machine workspace has a private endpoint.
> * In the following table, replace `<storage>` with the name of the default storage account for your Azure Machine Learning workspace.
> * Websocket communication must be allowed to the compute instance. If you block websocket traffic, Jupyter notebooks won't work correctly.

# [Azure public](#tab/public)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | graph.windows.net | TCP | 443 |
| Compute instance | \*.instances.azureml.net | TCP | 443 |
| Compute instance | \*.instances.azureml.ms | TCP | 443, 8787, 18881 |
| Microsoft storage access | \*.blob.core.windows.net | TCP | 443 |
| Microsoft storage access | \*.table.core.windows.net | TCP | 443 |
| Microsoft storage access | \*.queue.core.windows.net | TCP | 443 |
| Your storage account | \<storage\>.file.core.windows.net | TCP | 443, 445 |
| Your storage account | \<storage\>.blob.core.windows.net | TCP | 443 |
| Azure Key Vault | \*.vault.azure.net | TCP | 443 |

# [Azure Government](#tab/gov)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | graph.windows.net | TCP | 443 |
| Compute instance | \*.instances.azureml.us | TCP | 443 |
| Compute instance | \*.instances.azureml.ms | TCP | 443, 8787, 18881 |
| Microsoft storage access | \*.blob.core.usgovcloudapi.net | TCP | 443 |
| Microsoft storage access | \*.table.core.usgovcloudapi.net | TCP | 443 |
| Microsoft storage access | \*.queue.core.usgovcloudapi.net | TCP | 443 |
| Your storage account | \<storage\>.file.core.usgovcloudapi.net | TCP | 443, 445 |
| Your storage account | \<storage\>.blob.core.usgovcloudapi.net | TCP | 443 |
| Azure Key Vault | \*.vault.usgovcloudapi.net | TCP | 443 |

# [Azure China 21Vianet](#tab/china)

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | graph.chinacloudapi.cn | TCP | 443 |
| Compute instance |  \*.instances.azureml.cn | TCP | 443 |
| Compute instance | \*.instances.azureml.ms | TCP | 443, 8787, 18881 |
| Microsoft storage access | \*.blob.core.chinacloudapi.cn | TCP | 443 |
| Microsoft storage access | \*.table.core.chinacloudapi.cn | TCP | 443 |
| Microsoft storage access | \*.queue.core.chinacloudapi.cn | TCP | 443 |
| Your storage account | \<storage\>.file.core.chinacloudapi.cn | TCP | 443, 445 |
| Your storage account | \<storage\>.blob.core.chinacloudapi.cn | TCP | 443 |
| Azure Key Vault | \*.vault.azure.cn | TCP | 443 |

---

**Docker images maintained by by Azure Machine Learning**

| **Required for** | **Hosts** | **Protocol** | **Ports** |
| ----- | ----- | ----- | ----- |
| Microsoft Container Registry | mcr.microsoft.com</br>\*.data.mcr.microsoft.com | TCP | 443 |
| Azure Machine Learning pre-built images | viennaglobal.azurecr.io | TCP | 443 |

> [!TIP]
> * __Azure Container Registry__ is required for any custom Docker image. This includes small modifications (such as additional packages) to base images provided by Microsoft.
> * __Microsoft Container Registry__ is only needed if you plan on using the _default Docker images provided by Microsoft_, and _enabling user-managed dependencies_.
> * If you plan on using federated identity, follow the [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs) article.

Also, use the information in the [inbound configuration](#inbound-configuration) section to add IP addresses for `BatchNodeManagement` and `AzureMachineLearning`.

For information on restricting access to models deployed to AKS, see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

**Monitoring, metrics, and diagnostics**

To support logging of metrics and other monitoring information to Azure Monitor and Application Insights, allow outbound traffic to the following hosts:

> [!NOTE]
> The information logged to these hosts is also used by Microsoft Support to be able to diagnose any problems you run into with your workspace.

* **dc.applicationinsights.azure.com**
* **dc.applicationinsights.microsoft.com**
* **dc.services.visualstudio.com**
* ***.in.applicationinsights.azure.com**

For a list of IP addresses for these hosts, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md).

### Python hosts

The hosts in this section are used to install Python packages, and are required during development, training, and deployment. 

> [!NOTE]
> This is not a complete list of the hosts required for all Python resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
| **anaconda.com**</br>**\*.anaconda.com** | Used to install default packages. |
| **\*.anaconda.org** | Used to get repo data. |
| **pypi.org** | Used to list dependencies from the default index, if any, and the index isn't overwritten by user settings. If the index is overwritten, you must also allow **\*.pythonhosted.org**. |
| **\*pytorch.org** | Used by some examples based on PyTorch. |
| **\*.tensorflow.org** | Used by some examples based on Tensorflow. |

### R hosts

The hosts in this section are used to install R packages, and are required during development, training, and deployment.

> [!NOTE]
> This is not a complete list of the hosts required for all R resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
| **cloud.r-project.org** | Used when installing CRAN packages. |

### Visual Studio Code hosts

The hosts in this section are used to install Visual Studio Code packages to establish a remote connection between Visual Studio Code and compute instances in your Azure Machine Learning workspace.

> [!NOTE]
> This is not a complete list of the hosts required for all Visual Studio Code resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| **Host name** | **Purpose** |
| ---- | ---- |
| **\*vscode.dev**</br>**\*vscode-unpkg.net**</br>**\*vscode-cdn.net**</br>**\*vscodeexperiments.azureedge.net**</br>**default.exp-tas.com** | Required to access vscode.dev (Visual Studio Code for the Web) |
| **code.visualstudio.com** | Required to download and install VS Code desktop. This is not required for VS Code Web. |
| **update.code.visualstudio.com**</br>**\*.vo.msecnd.net** | Used to retrieve VS Code server bits that are installed on the compute instance through a setup script. |
| **marketplace.visualstudio.com**</br>**vscode.blob.core.windows.net**</br>**\*.gallerycdn.vsassets.io** | Required to download and install VS Code extensions. These enable the remote connection to Compute Instances provided by the Azure ML extension for VS Code, see [Connect to an Azure Machine Learning compute instance in Visual Studio Code](./how-to-set-up-vs-code-remote.md) for more information. |
| **raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/\*** |Used to retrieve websocket server bits that are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance. |

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)

For more information on configuring Azure Firewall, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md).
