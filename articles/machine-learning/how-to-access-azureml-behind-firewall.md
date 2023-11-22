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
ms.date: 04/14/2023
ms.custom: ignite-fall-2021, devx-track-azurecli, event-tier1-build-2022
ms.devlang: azurecli
monikerRange: 'azureml-api-2 || azureml-api-1'
---

# Configure inbound and outbound network traffic

Azure Machine Learning requires access to servers and services on the public internet. When implementing network isolation, you need to understand what access is required and how to enable it.

> [!NOTE]
> The information in this article applies to Azure Machine Learning workspace configured to use an _Azure Virtual Network_. When using a _managed virtual network_, the required inbound and outbound configuration for the workspace is automatically applied. For more information, see [Azure Machine Learning managed virtual network](how-to-managed-network.md).

## Common terms and information

The following terms and information are used throughout this article:

* __Azure service tags__: A service tag is an easy way to specify the IP ranges used by an Azure service. For example, the `AzureMachineLearning` tag represents the IP addresses used by the Azure Machine Learning service.

    > [!IMPORTANT]
    > Azure service tags are only supported by some Azure services. For a list of service tags supported with network security groups and Azure Firewall, see the [Virtual network service tags](../virtual-network/service-tags-overview.md) article.
    > 
    > If you are using a non-Azure solution such as a 3rd party firewall, download a list of [Azure IP Ranges and Service Tags](https://www.microsoft.com/download/details.aspx?id=56519). Extract the file and search for the service tag within the file. The IP addresses may change periodically.

* __Region__: Some service tags allow you to specify an Azure region. This limits access to the service IP addresses in a specific region, usually the one that your service is in. In this article, when you see `<region>`, substitute your Azure region instead. For example, `BatchNodeManagement.<region>` would be `BatchNodeManagement.uswest` if your Azure Machine Learning workspace is in the US West region.

* __Azure Batch__: Azure Machine Learning compute clusters and compute instances rely on a back-end Azure Batch instance. This back-end service is hosted in a Microsoft subscription.

* __Ports__: The following ports are used in this article. If a port range isn't listed in this table, it's specific to the service and may not have any published information on what it's used for:

    | Port | Description |
    | ----- | ----- | 
    | 80 | Unsecured web traffic (HTTP) |
    | 443 | Secured web traffic (HTTPS) |
    | 445 | SMB traffic used to access file shares in Azure File storage |
    | 8787 | Used when connecting to RStudio on a compute instance |
    | 18881 | Used to connect to the language server to enable IntelliSense for notebooks on a compute instance. |

* __Protocol__: Unless noted otherwise, all network traffic mentioned in this article uses __TCP__.

## Basic configuration

This configuration makes the following assumptions:

* You're using docker images provided by a container registry that you provide, and won't be using images provided by Microsoft.
* You're using a private Python package repository, and won't be accessing public package repositories such as `pypi.org`, `*.anaconda.com`, or `*.anaconda.org`.
* The private endpoints can communicate directly with each other within the VNet. For example, all services have a private endpoint in the same VNet:
    * Azure Machine Learning workspace
    * Azure Storage Account (blob, file, table, queue)

__Inbound traffic__

| Source | Source<br>ports | Destination | Destination<b>ports| Purpose |
| ----- |:-----:| ----- |:-----:| ----- |
| `AzureMachineLearning` | Any | `VirtualNetwork` | 44224 | Inbound to compute instance/cluster. __Only needed if the instance/cluster is configured to use a public IP address__. |

> [!TIP]
> A network security group (NSG) is created by default for this traffic. For more information, see [Default security rules](../virtual-network/network-security-groups-overview.md#inbound).

__Outbound traffic__

| Service tag(s) | Ports | Purpose |
| ----- |:-----:| ----- |
| `AzureActiveDirectory` | 80, 443 | Authentication using Microsoft Entra ID. |
| `AzureMachineLearning` | 443, 8787, 18881<br>UDP: 5831 | Using Azure Machine Learning services. |
| `BatchNodeManagement.<region>` | 443 | Communication Azure Batch. |
| `AzureResourceManager` | 443 | Creation of Azure resources with Azure Machine Learning. |
| `Storage.<region>` | 443 | Access data stored in the Azure Storage Account for compute cluster and compute instance. This outbound can be used to exfiltrate data. For more information, see [Data exfiltration protection](how-to-prevent-data-loss-exfiltration.md). |
| `AzureFrontDoor.FrontEnd`</br>* Not needed in Microsoft Azure operated by 21Vianet. | 443 | Global entry point for [Azure Machine Learning studio](https://ml.azure.com). Store images and environments for AutoML. |
| `MicrosoftContainerRegistry.<region>` | 443 | Access docker images provided by Microsoft. |
| `Frontdoor.FirstParty` | 443 | Access docker images provided by Microsoft. |
| `AzureMonitor` | 443 | Used to log monitoring and metrics to Azure Monitor. Only needed if you haven't [secured Azure Monitor](how-to-secure-workspace-vnet.md#secure-azure-monitor-and-application-insights) for the workspace. </br>* This outbound is also used to log information for support incidents. |

> [!IMPORTANT]
> If a compute instance or compute cluster is configured for no public IP, by default it can't access the internet. If it *can* still send outbound traffic to the internet, it is because of Azure [default outbound access](../virtual-network/ip-services/default-outbound-access.md#when-is-default-outbound-access-provided) and you have an NSG that allows outbound to the internet. We **don't recocmmend** using the default outbound access. If you need outbound access to the internet, we recommend using one of the following options instead of the default outbound access:
> 
> * __Azure Virtual Network NAT with a public IP__: For more information on using Virtual Network Nat, see the [Virtual Network NAT](../virtual-network/nat-gateway/nat-overview.md) documentation.
> * __User-defined route and firewall__: Create a user-defined route in the subnet that contains the compute. The __Next hop__ for the route should reference the private IP address of the firewall, with an address prefix of 0.0.0.0/0.
>
> For more information, see the [Default outbound access in Azure](../virtual-network/ip-services/default-outbound-access.md) article.

### Recommended configuration for training and deploying models

__Outbound traffic__

| Service tag(s) | Ports | Purpose |
| ----- |:-----:| ----- |
| `MicrosoftContainerRegistry.<region>` and `AzureFrontDoor.FirstParty` | 443 | Allows use of Docker images that Microsoft provides for training and inference. Also sets up the Azure Machine Learning router for Azure Kubernetes Service. |

__To allow installation of Python packages for training and deployment__, allow __outbound__ traffic to the following host names:

[!INCLUDE [recommended outbound](includes/recommended-network-outbound.md)]

## Scenario: Install RStudio on compute instance

To allow installation of RStudio on a compute instance, the firewall needs to allow outbound access to the sites to pull the Docker image from. Add the following Application rule to your Azure Firewall policy: 

* __Name__: AllowRStudioInstall 
* __Source Type__: IP Address 
* __Source IP Addresses__: The IP address range of the subnet where you will create the compute instance. For example, `172.16.0.0/24`. 
* __Destination Type__: FQDN 
* __Target FQDN__: `ghcr.io`, `pkg-containers.githubusercontent.com` 
* __Protocol__: `Https:443`
 
To allow the installation of R packages, allow __outbound__ traffic to `cloud.r-project.org`. This host is used for installing CRAN packages.

> [!NOTE]
> If you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

## Scenario: Using compute cluster or compute instance with a public IP

[!INCLUDE [udr info for computes](includes/machine-learning-compute-user-defined-routes.md)]

## Scenario: Firewall between Azure Machine Learning and Azure Storage endpoints

You must also allow __outbound__ access to `Storage.<region>` on __port 445__.

## Scenario: Workspace created with the `hbi_workspace` flag enabled

You must also allow __outbound__ access to `Keyvault.<region>`. This outbound traffic is used to access the key vault instance for the back-end Azure Batch service.

For more information on the `hbi_workspace` flag, see the [data encryption](concept-data-encryption.md) article.

## Scenario: Use Kubernetes compute

[Kubernetes Cluster](./how-to-attach-kubernetes-anywhere.md) running behind an outbound proxy server or firewall needs extra egress network configuration. 

* For Kubernetes with Azure Arc connection, configure the [Azure Arc network requirements](../azure-arc/kubernetes/network-requirements.md) needed by Azure Arc agents. 
* For AKS cluster without Azure Arc connection, configure the [AKS extension network requirements](../aks/outbound-rules-control-egress.md#cluster-extensions). 

Besides above requirements, the following outbound URLs are also required for Azure Machine Learning,

| Outbound Endpoint| Port | Description|Training |Inference |
|-----|-----|-----|:-----:|:-----:|
| `*.kusto.windows.net`<br>`*.table.core.windows.net`<br>`*.queue.core.windows.net` | 443 | Required to upload system logs to Kusto. |__&check;__|__&check;__|
| `<your ACR name>.azurecr.io`<br>`<your ACR name>.<region>.data.azurecr.io` | 443 | Azure container registry, required to pull docker images used for machine learning workloads.|__&check;__|__&check;__|
| `<your storage account name>.blob.core.windows.net` | 443 | Azure blob storage, required to fetch machine learning project scripts, data or models, and upload job logs/outputs.|__&check;__|__&check;__|
| `<your workspace ID>.workspace.<region>.api.azureml.ms`<br>`<region>.experiments.azureml.net`<br>`<region>.api.azureml.ms` | 443 | Azure Machine Learning service API.|__&check;__|__&check;__|
| `pypi.org` | 443 | Python package index, to install pip packages used for training job environment initialization.|__&check;__|N/A|
| `archive.ubuntu.com`<br>`security.ubuntu.com`<br>`ppa.launchpad.net` | 80 | Required to download the necessary security patches. |__&check;__|N/A|

> [!NOTE]
> * Replace `<your workspace workspace ID>` with your workspace ID. The ID can be found in Azure portal - your Machine Learning resource page - Properties - Workspace ID.
> * Replace `<your storage account>` with the storage account name.
> * Replace `<your ACR name>` with the name of the Azure Container Registry for your workspace.
> * Replace `<region>` with the region of your workspace.

### In-cluster communication requirements

To install the Azure Machine Learning extension on Kubernetes compute, all Azure Machine Learning related components are deployed in a `azureml` namespace. The following in-cluster communication is needed to ensure the ML workloads work well in the AKS cluster.
- The components in  `azureml` namespace should be able to communicate with Kubernetes API server.
- The components in  `azureml` namespace should be able to communicate with each other.
- The components in  `azureml` namespace should be able to communicate with `kube-dns` and `konnectivity-agent` in `kube-system` namespace.
- If the cluster is used for real-time inferencing, `azureml-fe-xxx` PODs should be able to communicate with the deployed model PODs on 5001 port in other namespace. `azureml-fe-xxx` PODs should open 11001, 12001, 12101, 12201, 20000, 8000, 8001, 9001 ports for internal communication.
- If the cluster is used for real-time inferencing, the deployed model PODs should be able to communicate with `amlarc-identity-proxy-xxx` PODs on 9999 port.


## Scenario: Visual Studio Code

The hosts in this section are used to install Visual Studio Code packages to establish a remote connection between Visual Studio Code and compute instances in your Azure Machine Learning workspace.

> [!NOTE]
> This is not a complete list of the hosts required for all Visual Studio Code resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| __Host name__ | __Purpose__ |
| ---- | ---- |
| `*.vscode.dev`<br>`*.vscode-unpkg.net`<br>`*.vscode-cdn.net`<br>`*.vscodeexperiments.azureedge.net`<br>`default.exp-tas.com` | Required to access vscode.dev (Visual Studio Code for the Web) |
| `code.visualstudio.com` | Required to download and install VS Code desktop. This host isn't required for VS Code Web. |
| `update.code.visualstudio.com`<br>`*.vo.msecnd.net` | Used to retrieve VS Code server bits that are installed on the compute instance through a setup script. |
| `marketplace.visualstudio.com`<br>`vscode.blob.core.windows.net`<br>`*.gallerycdn.vsassets.io` | Required to download and install VS Code extensions. These hosts enable the remote connection to compute instances using the Azure Machine Learning extension for VS Code. For more information, see [Connect to an Azure Machine Learning compute instance in Visual Studio Code](./how-to-set-up-vs-code-remote.md) |
| `raw.githubusercontent.com/microsoft/vscode-tools-for-ai/master/azureml_remote_websocket_server/*` | Used to retrieve websocket server bits that are installed on the compute instance. The websocket server is used to transmit requests from Visual Studio Code client (desktop application) to Visual Studio Code server running on the compute instance. |

## Scenario: Third party firewall or Azure Firewall without service tags

The guidance in this section is generic, as each firewall has its own terminology and specific configurations. If you have questions, check the documentation for the firewall you're using.

> [!TIP]
> If you're using __Azure Firewall__, and want to use the FQDNs listed in this section instead of using service tags, use the following guidance:
> * FQDNs that use HTTP/S ports (80 and 443) should be configured as __application rules__.
> * FQDNs that use other ports should be configured as __network rules__.
> 
> For more information, see [Differences in application rules vs. network rules](/azure/firewall/fqdn-filtering-network-rules#differences-in-application-rules-vs-network-rules).

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

The hosts in the following tables are owned by Microsoft, and provide services required for the proper functioning of your workspace. The tables list hosts for the Azure public, Azure Government, and Microsoft Azure operated by 21Vianet regions.

> [!IMPORTANT]
> Azure Machine Learning uses Azure Storage Accounts in your subscription and in Microsoft-managed subscriptions. Where applicable, the following terms are used to differentiate between them in this section:
>
> * __Your storage__: The Azure Storage Account(s) in your subscription, which is used to store your data and artifacts such as models, training data, training logs, and Python scripts.>
> * __Microsoft storage__: The Azure Machine Learning compute instance and compute clusters rely on Azure Batch, and must access storage located in a Microsoft subscription. This storage is used only for the management of the compute instances. None of your data is stored here.

__General Azure hosts__

# [Azure public](#tab/public)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ---- | 
| Microsoft Entra ID | `login.microsoftonline.com` | TCP | 80, 443 |
| Azure portal | `management.azure.com` | TCP | 443 |
| Azure Resource Manager | `management.azure.com` | TCP | 443 |

# [Azure Government](#tab/gov)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ---- |
| Microsoft Entra ID | `login.microsoftonline.us` | TCP | 80, 443 |
| Azure portal | `management.azure.us` | TCP | 443 |
| Azure Resource Manager | `management.usgovcloudapi.net` | TCP | 443 |

# [Microsoft Azure operated by 21Vianet](#tab/china)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Microsoft Entra ID | `login.chinacloudapi.cn` | TCP | 80, 443 |
| Azure portal | `management.azure.cn` | TCP | 443 |
| Azure Resource Manager | `management.chinacloudapi.cn` | TCP | 443 |

---

__Azure Machine Learning hosts__

> [!IMPORTANT]
> In the following table, replace `<storage>` with the name of the default storage account for your Azure Machine Learning workspace. Replace `<region>` with the region of your workspace.

# [Azure public](#tab/public)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | `ml.azure.com` | TCP | 443 |
| API | `*.azureml.ms` | TCP | 443 |
| API | `*.azureml.net` | TCP | 443 |
| Model management | `*.modelmanagement.azureml.net` | TCP | 443 |
| Integrated notebook | `*.notebooks.azure.net` | TCP | 443 |
| Integrated notebook | `<storage>.file.core.windows.net` | TCP | 443, 445 |
| Integrated notebook | `<storage>.dfs.core.windows.net` | TCP | 443 |
| Integrated notebook | `<storage>.blob.core.windows.net` | TCP | 443 |
| Integrated notebook | `graph.microsoft.com` | TCP | 443 |
| Integrated notebook | `*.aznbcontent.net` | TCP | 443 |
| AutoML NLP, Vision | `automlresources-prod.azureedge.net` | TCP | 443 |
| AutoML NLP, Vision | `aka.ms` | TCP | 443 |

> [!NOTE]
> AutoML NLP, Vision are currently only supported in Azure public regions.

# [Azure Government](#tab/gov)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | `ml.azure.us` | TCP | 443 |
| API | `*.ml.azure.us` | TCP | 443 |
| Model management | `*.modelmanagement.azureml.us` | TCP | 443 |
| Integrated notebook | `*.notebooks.usgovcloudapi.net` | TCP | 443 |
| Integrated notebook | `<storage>.file.core.usgovcloudapi.net` | TCP | 443, 445 |
| Integrated notebook | `<storage>.dfs.core.usgovcloudapi.net` | TCP | 443 |
| Integrated notebook  | `<storage>.blob.core.usgovcloudapi.net` | TCP | 443 |
| Integrated notebook | `graph.microsoft.us` | TCP | 443 |
| Integrated notebook | `*.aznbcontent.net` | TCP | 443 |

# [Microsoft Azure operated by 21Vianet](#tab/china)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Azure Machine Learning studio | `studio.ml.azure.cn` | TCP | 443 |
| API | `*.ml.azure.cn` | TCP | 443 |
| API | `*.azureml.cn` | TCP | 443 |
| Model management | `*.modelmanagement.ml.azure.cn` | TCP | 443 |
| Integrated notebook | `*.notebooks.chinacloudapi.cn` | TCP | 443 |
| Integrated notebook | `<storage>.file.core.chinacloudapi.cn` | TCP | 443, 445 |
| Integrated notebook | `<storage>.dfs.core.chinacloudapi.cn` | TCP | 443 |
| Integrated notebook | `<storage>.blob.core.chinacloudapi.cn` | TCP | 443 |
| Integrated notebook | `graph.chinacloudapi.cn` | TCP | 443 |
| Integrated notebook | `*.aznbcontent.net` | TCP | 443 |

---

__Azure Machine Learning compute instance and compute cluster hosts__

> [!TIP]
> * The host for __Azure Key Vault__ is only needed if your workspace was created with the [hbi_workspace](/python/api/azure-ai-ml/azure.ai.ml.entities.workspace) flag enabled.
> * Ports 8787 and 18881 for __compute instance__ are only needed when your Azure Machine workspace has a private endpoint.
> * In the following table, replace `<storage>` with the name of the default storage account for your Azure Machine Learning workspace.
> * In the following table, replace `<region>` with the Azure region that contains your Azure Machine Learning workspace.
> * Websocket communication must be allowed to the compute instance. If you block websocket traffic, Jupyter notebooks won't work correctly.

# [Azure public](#tab/public)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | `graph.windows.net` | TCP | 443 |
| Compute instance | `*.instances.azureml.net` | TCP | 443 |
| Compute instance | `*.instances.azureml.ms` | TCP | 443, 8787, 18881 |
| Compute instance | `<region>.tundra.azureml.ms` | UDP | 5831 |
| Compute instance | `*.<region>.batch.azure.com` | ANY | 443 |
| Compute instance | `*.<region>.service.batch.azure.com` | ANY | 443 | 
| Microsoft storage access | `*.blob.core.windows.net` | TCP | 443 |
| Microsoft storage access | `*.table.core.windows.net` | TCP | 443 |
| Microsoft storage access | `*.queue.core.windows.net` | TCP | 443 |
| Your storage account | `<storage>.file.core.windows.net` | TCP | 443, 445 |
| Your storage account | `<storage>.blob.core.windows.net` | TCP | 443 |
| Azure Key Vault | \*.vault.azure.net | TCP | 443 |

# [Azure Government](#tab/gov)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | `graph.windows.net` | TCP | 443 |
| Compute instance | `*.instances.azureml.us` | TCP | 443 |
| Compute instance | `*.instances.azureml.ms` | TCP | 443, 8787, 18881 |
| Compute instance | `<region>.tundra.azureml.us` | UDP | 5831 |
| Microsoft storage access | `*.blob.core.usgovcloudapi.net` | TCP | 443 |
| Microsoft storage access | `*.table.core.usgovcloudapi.net` | TCP | 443 |
| Microsoft storage access | `*.queue.core.usgovcloudapi.net` | TCP | 443 |
| Your storage account | `<storage>.file.core.usgovcloudapi.net` | TCP | 443, 445 |
| Your storage account | `<storage>.blob.core.usgovcloudapi.net` | TCP | 443 |
| Azure Key Vault | `*.vault.usgovcloudapi.net` | TCP | 443 |

# [Microsoft Azure operated by 21Vianet](#tab/china)

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Compute cluster/instance | `graph.chinacloudapi.cn` | TCP | 443 |
| Compute instance |  `*.instances.azureml.cn` | TCP | 443 |
| Compute instance | `*.instances.azureml.ms` | TCP | 443, 8787, 18881 |
| Compute instance | `<region>.tundra.azureml.cn` | UDP | 5831 |
| Microsoft storage access | `*.blob.core.chinacloudapi.cn` | TCP | 443 |
| Microsoft storage access | `*.table.core.chinacloudapi.cn` | TCP | 443 |
| Microsoft storage access | `*.queue.core.chinacloudapi.cn` | TCP | 443 |
| Your storage account | `<storage>.file.core.chinacloudapi.cn` | TCP | 443, 445 |
| Your storage account | `<storage>.blob.core.chinacloudapi.cn` | TCP | 443 |
| Azure Key Vault | `*.vault.azure.cn` | TCP | 443 |

---

__Docker images maintained by Azure Machine Learning__

| __Required for__ | __Hosts__ | __Protocol__ | __Ports__ |
| ----- | ----- | ----- | ----- |
| Microsoft Container Registry | mcr.microsoft.com</br>\*.data.mcr.microsoft.com | TCP | 443 |

> [!TIP]
> * __Azure Container Registry__ is required for any custom Docker image. This includes small modifications (such as additional packages) to base images provided by Microsoft. It is also required by the internal training job submission process of Azure Machine Learning.
> * __Microsoft Container Registry__ is only needed if you plan on using the _default Docker images provided by Microsoft_, and _enabling user-managed dependencies_.
> * If you plan on using federated identity, follow the [Best practices for securing Active Directory Federation Services](/windows-server/identity/ad-fs/deployment/best-practices-securing-ad-fs) article.

Also, use the information in the [compute with public IP](#scenario-using-compute-cluster-or-compute-instance-with-a-public-ip) section to add IP addresses for `BatchNodeManagement` and `AzureMachineLearning`.

For information on restricting access to models deployed to AKS, see [Restrict egress traffic in Azure Kubernetes Service](../aks/limit-egress-traffic.md).

__Monitoring, metrics, and diagnostics__

:::moniker range="azureml-api-2"
If you haven't [secured Azure Monitor](how-to-secure-workspace-vnet.md#secure-azure-monitor-and-application-insights) for the workspace, you must allow outbound traffic to the following hosts:
:::moniker-end
:::moniker range="azureml-api-1"
If you haven't [secured Azure Monitor](./v1/how-to-secure-workspace-vnet.md#secure-azure-monitor-and-application-insights) for the workspace, you must allow outbound traffic to the following hosts:
:::moniker-end

> [!NOTE]
> The information logged to these hosts is also used by Microsoft Support to be able to diagnose any problems you run into with your workspace.

* `dc.applicationinsights.azure.com`
* `dc.applicationinsights.microsoft.com`
* `dc.services.visualstudio.com`
* `*.in.applicationinsights.azure.com`

For a list of IP addresses for these hosts, see [IP addresses used by Azure Monitor](../azure-monitor/app/ip-addresses.md).

## Next steps

This article is part of a series on securing an Azure Machine Learning workflow. See the other articles in this series:

* [Virtual network overview](how-to-network-security-overview.md)
:::moniker range="azureml-api-2"
* [Secure the workspace resources](how-to-secure-workspace-vnet.md)
* [Secure the training environment](how-to-secure-training-vnet.md)
* [Secure the inference environment](how-to-secure-inferencing-vnet.md)
:::moniker-end
:::moniker range="azureml-api-1"
* [Secure the workspace resources](./v1/how-to-secure-workspace-vnet.md)
* [Secure the training environment](./v1/how-to-secure-training-vnet.md)
* [Secure the inference environment](./v1/how-to-secure-inferencing-vnet.md)
:::moniker-end
* [Enable studio functionality](how-to-enable-studio-virtual-network.md)
* [Use custom DNS](how-to-custom-dns.md)

For more information on configuring Azure Firewall, see [Tutorial: Deploy and configure Azure Firewall using the Azure portal](../firewall/tutorial-firewall-deploy-portal.md).
