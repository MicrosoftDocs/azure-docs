---
title: How to configure a managed network for Azure AI
titleSuffix: Azure AI Studio
description: Learn how to configure a managed network for Azure AI
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# How to configure a managed network for Azure AI

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

We have two network isolation aspects. One is the network isolation to access an Azure AI. Another is the network isolation of computing resources in your Azure AI and Azure AI projects such as Compute Instance, Serverless and Managed Online Endpoint. This document explains the latter highlighted in the diagram. You can use Azure AI built-in network isolation to protect your computing resources.

:::image type="content" source="../media/how-to/network/azure-ai-network-outbound.png" alt-text="Diagram of Azure AI network isolation." lightbox="../media/how-to/network/azure-ai-network-outbound.png":::

You need to configure following network isolation configurations.

- Choose network isolation mode. You have two options: allow internet outbound mode or allow only approved outbound mode.
- Create private endpoint outbound rules to your private Azure resources. Note that private Azure AI Services and Azure AI Search are not supported yet. 
- If you use Visual Studio Code integration with allow only approved outbound mode, create FQDN outbound rules described [here](#scenario-use-visual-studio-code).
- If you use HuggingFace models in Models with allow only approved outbound mode, create FQDN outbound rules described [here](#scenario-use-huggingface-models).

## Network isolation architecture and isolation modes

When you enable managed virtual network isolation, a managed virtual network is created for the Azure AI. Managed compute resources you create for the Azure AI automatically use this managed VNet. The managed VNet can use private endpoints for Azure resources that are used by your Azure AI, such as Azure Storage, Azure Key Vault, and Azure Container Registry. 

There are three different configuration modes for outbound traffic from the managed VNet:

| Outbound mode | Description | Scenarios |
| ----- | ----- | ----- |
| Allow internet outbound | Allow all internet outbound traffic from the managed VNet. | You want unrestricted access to machine learning resources on the internet, such as python packages or pretrained models.<sup>1</sup> |
| Allow only approved outbound | Outbound traffic is allowed by specifying service tags. | * You want to minimize the risk of data exfiltration, but you need to prepare all required machine learning artifacts in your private environment.</br>* You want to configure outbound access to an approved list of services, service tags, or FQDNs. |
| Disabled | Inbound and outbound traffic isn't restricted. | You want public inbound and outbound from the Azure AI. |

<sup>1</sup> You can use outbound rules with _allow only approved outbound_ mode to achieve the same result as using allow internet outbound. The differences are:

* Always use private endpoints to access Azure resources. 
* You must add rules for each outbound connection you need to allow.
* Adding FQDN outbound rules increase your costs as this rule type uses Azure Firewall.
* The default rules for _allow only approved outbound_ are designed to minimize the risk of data exfiltration. Any outbound rules you add might increase your risk.

The managed VNet is preconfigured with [required default rules](#list-of-required-rules). It's also configured for private endpoint connections to your Azure AI, Azure AI's default storage, container registry and key vault __if they're configured as private__ or __the Azure AI isolation mode is set to allow only approved outbound__. After choosing the isolation mode, you only need to consider other outbound requirements you might need to add.

The following diagram shows a managed VNet configured to __allow internet outbound__:

:::image type="content" source="../media/how-to/network/internet-outbound.png" alt-text="Diagram of managed VNet isolation configured for internet outbound." lightbox="../media/how-to/network/internet-outbound.png":::

The following diagram shows a managed VNet configured to __allow only approved outbound__:

> [!NOTE]
> In this configuration, the storage, key vault, and container registry used by the Azure AI are flagged as private. Since they are flagged as private, a private endpoint is used to communicate with them.

:::image type="content" source="../media/how-to/network/only-approved-outbound.png" alt-text="Diagram of managed VNet isolation configured for allow only approved outbound." lightbox="../media/how-to/network/only-approved-outbound.png":::

## Configure a managed virtual network to allow internet outbound

> [!TIP]
> The creation of the managed VNet is deferred until a compute resource is created or provisioning is manually started. When allowing automatic creation, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network.

# [Azure CLI](#tab/azure-cli)

Not available in AI CLI, but you can use [Azure Machine Learning CLI](../../machine-learning/how-to-managed-network.md#configure-a-managed-virtual-network-to-allow-internet-outbound). Use your Azure AI name as workspace name in Azure Machine Learning CLI.

# [Python SDK](#tab/python)

Not available.

# [Azure portal](#tab/portal)

* __Create a new Azure AI__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and choose Azure AI from Create a resource menu.
    1. Provide the required information on the __Basics__ tab.
    1. From the __Networking__ tab, select __Private with Internet Outbound__.
    1. To add an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the following information:
    
        * __Rule name__: A name for the rule. The name must be unique for this workspace.
        * __Destination type__: Private Endpoint is the only option when the network isolation is private with internet outbound. Azure AI managed VNet doesn't support creating a private endpoint to all Azure resource types. For a list of supported resources, see the [Private endpoints](#private-endpoints) section.
        * __Subscription__: The subscription that contains the Azure resource you want to add a private endpoint for.
        * __Resource group__: The resource group that contains the Azure resource you want to add a private endpoint for.
        * __Resource type__: The type of the Azure resource.
        * __Resource name__: The name of the Azure resource.
        * __Sub Resource__: The sub resource of the Azure resource type.

        Select __Save__ to save the rule. You can continue using __Add user-defined outbound rules__ to add rules.

    1. Continue creating the workspace as normal.

* __Update an existing workspace__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure AI that you want to enable managed VNet isolation for.
    1. Select __Networking__, then select __Private with Internet Outbound__.

        * To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the same information as used when creating a workspace in the 'Create a new workspace' section.

        * To __delete__ an outbound rule, select __delete__ for the rule.

    1. Select __Save__ at the top of the page to save the changes to the managed VNet.

---

## Configure a managed virtual network to allow only approved outbound

> [!TIP]
> The managed VNet is automatically provisioned when you create a compute resource. When allowing automatic creation, it can take around __30 minutes__ to create the first compute resource as it is also provisioning the network. If you configured FQDN outbound rules, the first FQDN rule adds around __10 minutes__ to the provisioning time.

# [Azure CLI](#tab/azure-cli)

Not available in AI CLI, but you can use [Azure Machine Learning CLI](../../machine-learning/how-to-managed-network.md#configure-a-managed-virtual-network-to-allow-only-approved-outbound). Use your Azure AI name as workspace name in Azure Machine Learning CLI.

# [Python SDK](#tab/python)

Not available.

# [Azure portal](#tab/portal)

* __Create a new Azure AI__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and choose Azure AI from Create a resource menu.
    1. Provide the required information on the __Basics__ tab.
    1. From the __Networking__ tab, select __Private with Approved Outbound__.

    1. To add an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the following information:
    
        * __Rule name__: A name for the rule. The name must be unique for this workspace.
        * __Destination type__: Private Endpoint, Service Tag, or FQDN. Service Tag and FQDN are only available when the network isolation is private with approved outbound.

        If the destination type is __Private Endpoint__, provide the following information:

        * __Subscription__: The subscription that contains the Azure resource you want to add a private endpoint for.
        * __Resource group__: The resource group that contains the Azure resource you want to add a private endpoint for.
        * __Resource type__: The type of the Azure resource.
        * __Resource name__: The name of the Azure resource.
        * __Sub Resource__: The sub resource of the Azure resource type.

        > [!TIP]
        > Azure AI managed VNet doesn't support creating a private endpoint to all Azure resource types. For a list of supported resources, see the [Private endpoints](#private-endpoints) section.

        If the destination type is __Service Tag__, provide the following information:

        * __Service tag__: The service tag to add to the approved outbound rules.
        * __Protocol__: The protocol to allow for the service tag.
        * __Port ranges__: The port ranges to allow for the service tag.

        If the destination type is __FQDN__, provide the following information:

        > [!WARNING]
        > FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

        * __FQDN destination__: The fully qualified domain name to add to the approved outbound rules.

        Select __Save__ to save the rule. You can continue using __Add user-defined outbound rules__ to add rules.

    1. Continue creating the workspace as normal.

* __Update an existing workspace__:

    1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure AI that you want to enable managed VNet isolation for.
    1. Select __Networking__, then select __Private with Approved Outbound__.

        * To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Workspace outbound rules__ sidebar, provide the same information as when creating a workspace in the previous 'Create a new workspace' section.

        * To __delete__ an outbound rule, select __delete__ for the rule.

    1. Select __Save__ at the top of the page to save the changes to the managed VNet.

---


## Manage outbound rules

# [Azure CLI](#tab/azure-cli)

Not available in AI CLI, but you can use [Azure Machine Learning CLI](../../machine-learning/how-to-managed-network.md#manage-outbound-rules). Use your Azure AI name as workspace name in Azure Machine Learning CLI.

# [Python SDK](#tab/python)

Not available.

# [Azure portal](#tab/portal)

1. Sign in to the [Azure portal](https://portal.azure.com), and select the Azure AI that you want to enable managed VNet isolation for.
1. Select __Networking__. The __Azure AI Outbound access__ section allows you to manage outbound rules.

* To _add_ an _outbound rule_, select __Add user-defined outbound rules__ from the __Networking__ tab. From the __Azure AI outbound rules__ sidebar, provide the following information:

* To __enable__ or __disable__ a rule, use the toggle in the __Active__ column.

* To __delete__ an outbound rule, select __delete__ for the rule.

---

## List of required rules

> [!TIP]
> These  rules are automatically added to the managed VNet.

__Private endpoints__:
* When the isolation mode for the managed VNet is `Allow internet outbound`, private endpoint outbound rules are automatically created as required rules from the managed VNet for the Azure AI and associated resources __with public network access disabled__ (Key Vault, Storage Account, Container Registry, Azure AI).
* When the isolation mode for the managed VNet is `Allow only approved outbound`, private endpoint outbound rules are automatically created as required rules from the managed VNet for the Azure AI and associated resources __regardless of public network access mode for those resources__ (Key Vault, Storage Account, Container Registry, Azure AI).

__Outbound__ service tag rules:

* `AzureActiveDirectory`
* `Azure Machine Learning`
* `BatchNodeManagement.region`
* `AzureResourceManager`
* `AzureFrontDoor.firstparty`
* `MicrosoftContainerRegistry`
* `AzureMonitor`

__Inbound__ service tag rules:
* `AzureMachineLearning`

## List of scenario specific outbound rules

### Scenario: Access public machine learning packages

To allow installation of __Python packages for training and deployment__, add outbound _FQDN_ rules to allow traffic to the following host names:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing.For more information, see [Pricing](#pricing).

> [!NOTE]
> This is not a complete list of the hosts required for all Python resources on the internet, only the most commonly used. For example, if you need access to a GitHub repository or other host, you must identify and add the required hosts for that scenario.

| __Host name__ | __Purpose__ |
| ---- | ---- |
| `anaconda.com`<br>`*.anaconda.com` | Used to install default packages. |
| `*.anaconda.org` | Used to get repo data. |
| `pypi.org` | Used to list dependencies from the default index, if any, and the index isn't overwritten by user settings. If the index is overwritten, you must also allow `*.pythonhosted.org`. |
| `pytorch.org`<br>`*.pytorch.org` | Used by some examples based on PyTorch. |
| `*.tensorflow.org` | Used by some examples based on Tensorflow. |

### Scenario: Use Visual Studio Code

If you plan to use __Visual Studio Code__ with Azure AI, add outbound _FQDN_ rules to allow traffic to the following hosts:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

* `*.vscode.dev`
* `vscode.blob.core.windows.net`
* `*.gallerycdn.vsassets.io`
* `raw.githubusercontent.com`
* `*.vscode-unpkg.net`
* `*.vscode-cdn.net`
* `*.vscodeexperiments.azureedge.net`
* `default.exp-tas.com`
* `code.visualstudio.com`
* `update.code.visualstudio.com`
* `*.vo.msecnd.net`
* `marketplace.visualstudio.com`
* `ghcr.io`
* `pkg-containers.githubusercontent.com`
* `github.com`

### Scenario: Use HuggingFace models

If you plan to use __HuggingFace models__ with Azure AI, add outbound _FQDN_ rules to allow traffic to the following hosts:

> [!WARNING]
> FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. For more information, see [Pricing](#pricing).

* docker.io
* *.docker.io
* *.docker.com
* production.cloudflare.docker.com
* cnd.auth0.com
* cdn-lfs.huggingface.co

## Private endpoints

Private endpoints are currently supported for the following Azure services:

* Azure AI
* Azure Machine Learning
* Azure Machine Learning registries
* Azure Storage (all sub resource types)
* Azure Container Registry
* Azure Key Vault
* Azure AI services
* Azure AI Search
* Azure SQL Server
* Azure Data Factory
* Azure Cosmos DB (all sub resource types)
* Azure Event Hubs
* Azure Redis Cache
* Azure Databricks
* Azure Database for MariaDB
* Azure Database for PostgreSQL
* Azure Database for MySQL
* Azure SQL Managed Instance

When you create a private endpoint, you provide the _resource type_ and _subresource_ that the endpoint connects to. Some resources have multiple types and subresources. For more information, see [what is a private endpoint](/azure/private-link/private-endpoint-overview).

When you create a private endpoint for Azure AI dependency resources, such as Azure Storage, Azure Container Registry, and Azure Key Vault, the resource can be in a different Azure subscription. However, the resource must be in the same tenant as the Azure AI.

A private endpoint is automatically created for a connection if the target resource is an Azure resource listed above. A valid target ID is expected for the private endpoint. A valid target ID for the connection can be the ARM ID of a parent resource. The target ID is also expected in the target of the connection or in `metadata.resourceid`. For more on connections, see [How to add a new connection in Azure AI Studio](connections-add.md).

## Pricing

The Azure AI managed VNet feature is free. However, you're charged for the following resources that are used by the managed VNet:

* Azure Private Link - Private endpoints used to secure communications between the managed VNet and Azure resources relies on Azure Private Link. For more information on pricing, see [Azure Private Link pricing](https://azure.microsoft.com/pricing/details/private-link/).
* FQDN outbound rules - FQDN outbound rules are implemented using Azure Firewall. If you use outbound FQDN rules, charges for Azure Firewall are included in your billing. Azure Firewall SKU is standard. Azure Firewall is provisioned per Azure AI.

    > [!IMPORTANT]
    > The firewall isn't created until you add an outbound FQDN rule. If you don't use FQDN rules, you will not be charged for Azure Firewall. For more information on pricing, see [Azure Firewall pricing](https://azure.microsoft.com/pricing/details/azure-firewall/).

## Limitations

* Azure AI services provisioned with Azure AI and Azure AI Search attached with Azure AI should be public.
* The "Add your data" feature in the Azure AI Studio playground doesn't support private storage account.
* Once you enable managed VNet isolation of your Azure AI, you can't disable it.
* Managed VNet uses private endpoint connection to access your private resources. You can't have a private endpoint and a service endpoint at the same time for your Azure resources, such as a storage account. We recommend using private endpoints in all scenarios.
* The managed VNet is deleted when the Azure AI is deleted. 
* Data exfiltration protection is automatically enabled for the only approved outbound mode. If you add other outbound rules, such as to FQDNs, Microsoft can't guarantee that you're protected from data exfiltration to those outbound destinations.
