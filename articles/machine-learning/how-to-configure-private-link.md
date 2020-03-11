---
title: Configure Azure Private Link
titleSuffix: Azure Machine Learning
description: 'Use Azure Private Link to securely access your Azure Machine Learning workspace from a virtual network.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 03/13/2020
---

# Configure Azure Private Link for an Azure Machine Learning workspace

By using Azure Private Link, you can connect to your Azure Machine Learning workspace via a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. When Private Link is combined with restricted network security group (NSG) policies, it helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](/azure/private-link/private-link-overview) article.

> [!IMPORTANT]
> Azure Private Link does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal.
>
> Azure Machine Learning compute instances are not supported in a workspace where Private Link is enabled.

## Create a workspace that uses a private endpoint

Currently, we only support enabling a private endpoint when creating a new Azure Machine Learning workspace. To create a new workspace with a private endpoint, use the following Azure Resource Manager template:

```json
template goes here
```

When deploying the template, you must provide the following information:

* Virtual Network name
* Subnet name
* ????

Once the template has been submitted and provisioning completes, the resource group that contains your workspace will contain three new artifact types related to Private Link:

* Private endpoint
* Network interface
* Private DNS zone

The workspace also contains a Azure Virtual Network that can communicate with the workspace over the private endpoint.

### Deploy the template using the Azure portal

1. Follow the steps in [Deploy resources from custom template](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy-portal#deploy-resources-from-custom-template). When you arrive at the __Edit template__ screen, paste in the template from this document.
1. Select __Save__ to use the template. Provide the following information and agree to the listed terms and conditions:

   * Subscription: Select the Azure subscription to use for these resources.
   * Resource group: Select or create a resource group to contain the services.
   * Workspace name: The name to use for the Azure Machine Learning workspace that will be created. The workspace name must be between 3 and 33 characters. It may only contain alphanumeric characters and '-'.
   * Location: Select the location where the resources will be created.

For more information, see [Deploy resources from custom template](../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template).

### Deploy the template using Azure PowerShell

This example assumes that you have saved the template to a file named `azuredeploy.json` in the current directory:

```powershell
New-AzResourceGroup -Name examplegroup -Location "East US"
new-azresourcegroupdeployment -name exampledeployment `
  -resourcegroupname examplegroup -location "East US" `
  -templatefile .\azuredeploy.json -workspaceName "exampleworkspace" -sku "basic"
```

For more information, see [Deploy resources with Resource Manager templates and Azure PowerShell](../azure-resource-manager/templates/deploy-powershell.md) and [Deploy private Resource Manager template with SAS token and Azure PowerShell](../azure-resource-manager/templates/secure-template-with-sas-token.md).

### Deploy the template using the Azure CLI

This example assumes that you have saved the template to a file named `azuredeploy.json` in the current directory:

```azurecli-interactive
az group create --name examplegroup --location "East US"
az group deployment create \
  --name exampledeployment \
  --resource-group examplegroup \
  --template-file azuredeploy.json \
  --parameters workspaceName=exampleworkspace location=eastus sku=basic
```

For more information, see [Deploy resources with Resource Manager templates and Azure CLI](../azure-resource-manager/templates/deploy-cli.md) and [Deploy private Resource Manager template with SAS token and Azure CLI](../azure-resource-manager/templates/secure-template-with-sas-token.md).

## Using a workspace over a private endpoint

Since communication to the workspace is only allowed from the virtual network, any development environments that use the workspace must be members of the virtual network. For example, a virtual machine in the virtual network or a machine connected to the virtual network using a VPN gateway.

For information on Azure Virtual Machines, see the [Virtual Machines documentation](/azure/virtual-machines/).

For information on VPN gateways, see [What is VPN gateway](/azure/vpn-gateway/vpn-gateway-about-vpngateways).

## Using Azure Storage

To secure the Azure Storage account used by your workspace, you can either put it inside the virtual network or enable Private Link for it.

For information on putting the storage account in the virtual network, see [Use a storage account for your workspace](how-to-enable-virtual-network.md#use-a-storage-account-for-your-workspace).

For information on enabling Private Link for the storage account, see [Create a private endpoint for storage](/azure/private-link/create-private-endpoint-storage-portal#create-your-private-endpoint).

## Using Azure Key Vault

To secure the Azure Key Vault used by your workspace, you can either put it inside the virtual network or enable Private Link for it.

For information on putting the key vault in the virtual network, see [Use a key vault instance with your workspace](how-to-enable-virtual-network.md#use-a-key-vault-instance-with-your-workspace).

For information on enabling Private Link for the key vault, see [Integrate Key Vault with Azure Private Link](/azure/key-vault/private-link-service).

## Azure Container Registry

For information on securing Azure Container Registry inside the virtual network, see [Use Azure Container Registry](how-to-enable-virtual-network.md#use-azure-container-registry).

## Next steps

For more information on securing your Azure Machine Learning workspace, see the [Enterprise security](concept-enterprise-security.md) article.
