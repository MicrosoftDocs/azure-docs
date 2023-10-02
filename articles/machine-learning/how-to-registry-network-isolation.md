---
title: Machine Learning registry network isolation
titleSuffix: Azure Machine Learning
description: Use Azure Machine Learning registry with Azure Virtual Networks
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.custom: build-2023
author: fkriti
ms.author: kritifaujdar
ms.reviewer: larryfr
ms.date: 05/23/2023
ms.topic: how-to
---

# Network isolation with Azure Machine Learning registries

In this article, you learn to secure Azure Machine Learning registry using [Azure Virtual Network](/azure/virtual-network/virtual-networks-overview) and [private endpoints](/azure/private-link/private-endpoint-overview). 

Private endpoints on Azure provide network isolation by enabling Azure services to be accessed through a private IP address within a virtual network (VNet). The VNet secures connections between Azure resources and prevent exposure of sensitive data to the public internet. 

Using network isolation with private endpoints prevents the network traffic from going over the public internet and brings Azure Machine Learning registry service to your Virtual network. All the network traffic happens over [Azure Private Link](/azure/private-link/private-link-overview) when private endpoints are used.  

## Prerequisites

* An [Azure Machine Learning registry](concept-machine-learning-registries-mlops.md). To create one, use the steps in the [How to create and manage registries](how-to-manage-registries.md) article.
* A familiarity with the following articles:
    + [Azure Virtual Networks](/azure/virtual-network/virtual-networks-overview)
    + [IP networking](/azure/virtual-network/ip-services/public-ip-addresses)
    + [Azure Machine Learning workspace with private endpoint](how-to-configure-private-link.md)
    + [Network Security Groups (NSG)](/azure/virtual-network/network-security-groups-overview)
    + [Network firewalls](/azure/firewall/overview)

## Securing Azure Machine Learning registry


> [!NOTE]
> For simplicity, we will be referring to workspace, it's associated resources and the virtual network they are part of as secure workspace configuration. We will explore how to add Azure machine Learning registries as part of the existing configuration.

The following diagram shows a basic network configuration and how the Azure Machine Learning registry fits in. If you're already using Azure Machine Learning workspace and have a secure workspace configuration where all the resources are part of virtual network, you can create a private endpoint from the existing virtual network to Azure Machine Learning registry and it's associated resources (storage and ACR).

If you don't have a secure workspace configuration, you can create it using the [Create a secure workspace in Azure portal](tutorial-create-secure-workspace.md) or [Create a secure workspace with a template](tutorial-create-secure-workspace-template.md) articles.


:::image type="content" source="./media/how-to-registry-network-isolation/basic-network-isolation-registry.png" alt-text="Diagram of registry connected to Virtual network containing workspace and associated resources using private endpoint.":::


## Scenario: workspace configuration is secure and Azure Machine Learning registry is public

This section describes the scenarios and required network configuration if you have a secure workspace configuration but using a public registry. 

### Create assets in registry from local files 

The identity (for example, a Data Scientist's Azure AD user identity) used to create assets in the registry must be assigned the __AzureML Registry User__, __owner__, or __contributor__ role in Azure role-based access control. For more information, see the [Manage access to Azure Machine Learning](how-to-assign-roles.md) article.

### Share assets from workspace to registry 

Due to data exfiltration protection, it isn't possible to share an asset from secure workspace to a public registry if the storage account containing the asset has public access disabled. 

### Use assets from registry in workspace 

Example operations: 
* Submit a job that uses an asset from registry.
* Use a component from registry in a pipeline.
* Use an environment from registry in a component.

Using assets from registry to a secure workspace requires configuring outbound access to the registry. 

### Deploy a model from registry to workspace 

To deploy a model from a registry to a secure managed online endpoint, the deployment must have `egress_public_network_access=disabled` set. Azure Machine Learning creates the necessary private endpoints to the registry during endpoint deployment. For more information, see [Create secure managed online endpoints](how-to-secure-online-endpoint.md). 

__Outbound network configuration to access any Azure Machine Learning registry__ 

| Service tag | Protocol and ports | Purpose |
| ----- | ----- | ----- |
| `AzureMachineLearning` | TCP: 443, 877, 18881</br>UDP: 5831 | Using Azure Machine Learning services. |
| `Storage.<region>` | TCP: 443 | Access data stored in the Azure Storage Account for compute clusters and compute instances. This outbound can be used to exfiltrate data. For more information, see [Data exfiltration protection](how-to-prevent-data-loss-exfiltration.md). |
| `MicrosoftContainerRegistry.<region>` | TCP: 443 | Access Docker images provided by Microsoft. |
| `AzureContainerRegistry.<region>` | TCP: 443 | Access Docker images for environments. |


## Scenario: workspace configuration is secure and Azure Machine Learning registry is connected to virtual networks using private endpoints

This section describes the scenarios and required network configuration if you have a secure workspace configuration with Azure Machine Learning registries connected using private endpoint to a virtual network. 

Azure Machine Learning registry has associated storage/ACR service instances. These service instances can also be connected to the VNet using private endpoints to secure the configuration. For more information, see the [How to create a private endpoint](#how-to-create-a-private-endpoint) section.

### How to find the Azure Storage Account and Azure Container Registry used by your registry

The storage account and ACR used by your Azure Machine Learning registry are created under a managed resource group in your Azure subscription. The name of the managed resource group follows the pattern of `azureml-rg-<name-of-your-registry>_<GUID>`. The GUID is a randomly generated string. For example, if the name of your registry is "contosoreg", the name of the managed resource group would be `azureml-rg-contosoreg_<GUID>`.

In the Azure portal, you can find this resource group by searching for `azureml_rg-<name-of-your-registry>`. All the storage and ACR resources for your registry are available under this resource group.

### Create assets in registry from local files     

 
> [!NOTE]
> Creating an environment asset is not supported in a private registry where associated ACR has public access disabled. As a workaround, you can create an environment in Azure Machine Learning workspace and share it to Azure Machine Learning registry.

Clients need to be connected to the VNet to which the registry is connected with a private endpoint.

### Securely connect to your registry 

To connect to a registry that's secured behind a VNet, use one of the following methods: 

* [Azure VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways) - Connects on-premises networks to the VNet over a private connection. Connection is made over the public internet. There are two types of VPN gateways that you might use: 

    * [Point-to-site](/azure/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal): Each client computer uses a VPN client to connect to the VNet. 

    * [Site-to-site](/azure/vpn-gateway/tutorial-site-to-site-portal): A VPN device connects the VNet to your on-premises network. 

* [ExpressRoute](https://azure.microsoft.com/products/expressroute/) - Connects on-premises networks into the cloud over a private connection. Connection is made using a connectivity provider. 

* [Azure Bastion](/azure/bastion/bastion-overview) - In this scenario, you create an Azure Virtual Machine (sometimes called a jump box) inside the VNet. You then connect to the VM using Azure Bastion. Bastion allows you to connect to the VM using either an RDP or SSH session from your local web browser. You then use the jump box as your development environment. Since it is inside the VNet, it can directly access the registry.  

### Share assets from workspace to registry 
> [!NOTE]
> Currently, sharing an asset from secure workspace to a Azure machine learning registry is not supported if the storage account containing the asset has public access disabled.

Create a private endpoint to the registry, storage and ACR from the VNet of the workspace. If you're trying to connect to multiple registries, create private endpoint for each registry and associated storage and ACRs. For more information, see the [How to create a private endpoint](#how-to-create-a-private-endpoint) section.

### Use assets from registry in workspace 

Example operations: 
* Submit a job that uses an asset from registry.
* Use a component from registry in a pipeline.
* Use an environment from registry in a component.

Create a private endpoint to the registry, storage and ACR from the VNet of the workspace. If you're trying to connect to multiple registries, create private endpoint for each registry and associated storage and ACRs. For more information, see the [How to create a private endpoint](#how-to-create-a-private-endpoint) section.

### Deploy a model from registry to workspace 

To deploy a model from a registry to a secure managed online endpoint, the deployment must have `egress_public_network_access=disabled` set. Azure Machine Learning creates the necessary private endpoints to the registry during endpoint deployment. For more information, see [Create secure managed online endpoints](how-to-secure-online-endpoint.md). 

### How to create a private endpoint

Use the tabs to view instructions to either add a private endpoint to an __existing registry__ or create a __new registry__ that has a private endpoint:

# [Existing registry](#tab/existing)

1. In the [Azure portal](https://portal.azure.com), search for __Private endpoint__, and the select the __Private endpoints__ entry to go to the __Private link center__.
1. On the __Private link center__ overview page, select __+ Create__.
1. Provide the requested information. For the __Region__ field, select the same region as your Azure Virtual Network. Select __Next__.
1. From the __Resource__ tab, when selecting __Resource type__, select `Microsoft.MachineLearningServices/registries`. Set the __Resource__ field to your Azure Machine Learning registry name, then select __Next__.
1. From the __Virtual network__ tab, select the virtual network and subnet for your Azure Machine Learning resources. Select __Next__ to continue.
1. From the __DNS__ tab, leave the default values unless you have specific private DNS integration requirements. Select __Next__ to continue.
1. From the __Review + Create__ tab, select __Create__ to create the private endpoint.
1. If you would like to set public network access to disabled, use the following command. Confirm the storage and ACR has the public network access disabled as well.

    ```azurecli
    az ml registry update --set publicNetworkAccess=Disabled --name <name-of-registry>
    ```


# [New registry](#tab/new)

1. When [creating a new registry](how-to-manage-registries.md) in the Azure portal, select __Disable public access and use private endpoints__ on the __Networking__ tab.
1. Select __Add__ under __Private endpoint__ and provide the required information.
1. Select the __Virtual Network__ and __Subnet__ for your Azure Machine Learning resources.
1. Select the rest of the options, and then select __OK__.
1. Finish the registry creation process. Once creation finishes, the new registry is configured to use a private endpoint to communicate with the VNet.

---

### How to find the Azure Storage Account and Azure Container Registry used by your registry

The storage account and ACR used by your Azure Machine Learning registry are created under a managed resource group in your Azure subscription. The name of the managed resource group follows the pattern of `azureml-rg-<name-of-your-registry>_<GUID>`. The GUID is a randomly generated string. For example, if the name of your registry is "contosoreg", the name of the managed resource group would be `azureml-rg-contosoreg_<GUID>`.

In the Azure portal, you can find this resource group by searching for `azureml_rg-<name-of-your-registry>`. All the storage and ACR resources for your registry are available under this resource group.

### How to create a private endpoint for the Azure Storage Account

To create a private endpoint for the storage account used by your registry, use the following steps:

1. In the [Azure portal](https://portal.azure.com), search for __Private endpoint__, and the select the __Private endpoints__ entry to go to the __Private link center__.
1. On the __Private link center__ overview page, select __+ Create__.
1. Provide the requested information. For the __Region__ field, select the same region as your Azure Virtual Network. Select __Next__.
1. From the __Resource__ tab, when selecting __Resource type__, select `Microsoft.Storage/storageAccounts`. Set the __Resource__ field to the storage account name. Set the __Sub-resource__ to __Blob__, then select __Next__.
1. From the __Virtual network__ tab, select the virtual network and subnet for your Azure Machine Learning resources. Select __Next__ to continue.
1. From the __DNS__ tab, leave the default values unless you have specific private DNS integration requirements. Select __Next__ to continue.
1. From the __Review + Create__ tab, select __Create__ to create the private endpoint.

## Data exfiltration protection

For a user created Azure Machine Learning registry, we recommend using a private endpoint for the registry, managed storage account, and managed ACR.

For a system registry, we recommend creating a Service Endpoint Policy for the Storage account using the `/services/Azure/MachineLearning` alias. For more information, see [Configure data exfiltration prevention](how-to-prevent-data-loss-exfiltration.md).



## How to find the registry's fully qualified domain name

The following examples show how to use the discovery URL to get the fully qualified domain name (FQDN) of your registry. When calling the discovery URL, you must provide an Azure access token in the request header. The following examples show how to get an access token and call the discovery URL:

> [!TIP]
> The format for the discovery URL is `https://<region>.api.azureml.ms/registrymanagement/v1.0/registries/<registry_name>/discovery`, where `<region>` is the region where your registry is located and `<registry_name>` is the name of your registry. To call the URL, make a GET request:
>
> ```rest
>    GET https://<region>.api.azureml.ms/registrymanagement/v1.0/registries/<registry_name>/discovery 
>    ```

* [Azure PowerShell](/powershell/azure/what-is-azure-powershell)

```azurepowershell
$region = "<region>"
$registryName = "<registry_name>"
$accessToken = (az account get-access-token | ConvertFrom-Json).accessToken 
(Invoke-RestMethod -Method Get `
                   -Uri "https://$region.api.azureml.ms/registrymanagement/v1.0/registries/$registryName/discovery" `
                   -Headers @{ Authorization="Bearer $accessToken" }).registryFqdns
```

* __REST API__ 

> [!NOTE]
> For more information on using Azure REST APIs, see the [Azure REST API reference](/rest/api/azure/).

1. Get the Azure access token. You can use the following [Azure CLI](/cli/azure/what-is-azure-cli) command to get a token:

    ```azurecli
    az account get-access-token --query accessToken
    ```

1. Use a REST client such as Postman or Curl to make a GET request to the discovery URL. Use the access token retrieved in the previous step for authorization. In the following example, replace `<region>` with the region where your registry is located and `<registry_name>` with the name of your registry. Replace `<token>` with the access token retrieved in the previous step:

    ```bash
    curl -X GET "https://<region>.api.azureml.ms/registrymanagement/v1.0/registries/<registry_name>/discovery" -H "Authorization: Bearer <token>" -H "Content-Type: application/json"
    ```

## Next steps

Learn how to [Share models, components, and environments across workspaces with registries](how-to-share-models-pipelines-across-workspaces-with-registries.md).
