---
title: Configure a private endpoint (preview)
titleSuffix: Azure Machine Learning
description: 'Use Azure Private Link to securely access your Azure Machine Learning workspace from a virtual network.'
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
ms.custom: how-to
ms.author: aashishb
author: aashishb
ms.reviewer: larryfr
ms.date: 07/28/2020
---

# Configure Azure Private Link for an Azure Machine Learning workspace (preview)

In this document, you learn how to use Azure Private Link with your Azure Machine Learning workspace. 

> [!IMPORTANT]
> Using Azure Private Link with Azure Machine Learning workspace is currently in public preview. This functionality is only available in the **US East** and **US West 2** regions. 
> This preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Private Link enables you to connect to your workspace using a private endpoint. The private endpoint is a set of private IP addresses within your virtual network. You can then limit access to your workspace to only occur over the private IP addresses. Private Link helps reduce the risk of data exfiltration. To learn more about private endpoints, see the [Azure Private Link](/azure/private-link/private-link-overview) article.

> [!IMPORTANT]
> Azure Private Link does not effect Azure control plane (management operations) such as deleting the workspace or managing compute resources. For example, creating, updating, or deleting a compute target. These operations are performed over the public Internet as normal.
>
> Azure Machine Learning compute instances preview is not supported in a workspace where Private Link is enabled.
>
> You may encounter problems trying to access the private endpoint for your workspace if you are using Mozilla Firefox. This problem may be related to DNS over HTTPS in Mozilla. We recommend using Microsoft Edge of Google Chrome as a workaround.

## Create a workspace that uses a private endpoint

> [!IMPORTANT]
> Currently, we only support enabling a private endpoint when creating a new Azure Machine Learning workspace.

The [https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced](https://github.com/Azure/azure-quickstart-templates/tree/master/201-machine-learning-advanced) can be used to create a workspace with a private endpoint.

For information on using this template, including private endpoints, see [Use an Azure Resource Manager template to create a workspace for Azure Machine Learning](how-to-create-workspace-template.md).

## Using a workspace over a private endpoint

Since communication to the workspace is only allowed from the virtual network, any development environments that use the workspace must be members of the virtual network. For example, a virtual machine in the virtual network.

> [!IMPORTANT]
> To avoid temporary disruption of connectivity, Microsoft recommends flushing the DNS cache on machines connecting to the workspace after enabling Private Link. 

For information on Azure Virtual Machines, see the [Virtual Machines documentation](/azure/virtual-machines/).


## Using Azure Storage

To secure the Azure Storage account used by your workspace, put it inside the virtual network.

For information on putting the storage account in the virtual network, see [Use a storage account for your workspace](how-to-enable-virtual-network.md#use-a-storage-account-for-your-workspace).

> [!WARNING]
> Azure Machine Learning does not support using an Azure Storage account that has private link enabled.

## Using Azure Key Vault

To secure the Azure Key Vault used by your workspace, you can either put it inside the virtual network or enable Private Link for it.

For information on putting the key vault in the virtual network, see [Use a key vault instance with your workspace](how-to-enable-virtual-network.md#key-vault-instance).

For information on enabling Private Link for the key vault, see [Integrate Key Vault with Azure Private Link](/azure/key-vault/private-link-service).

## Using Azure Kubernetes Services

To secure the Azure Kubernetes services used by your workspace, put it inside a virtual network. For more information, see [Use Azure Kubernetes Services with your workspace](how-to-enable-virtual-network.md#aksvnet).

Azure Machine Learning now supports using an Azure Kubernetes Service that has private link enabled.
To create a private AKS cluster follow docs [here](https://docs.microsoft.com/azure/aks/private-clusters)

## Azure Container Registry

For information on securing Azure Container Registry inside the virtual network, see [Use Azure Container Registry](how-to-enable-virtual-network.md#azure-container-registry).

> [!IMPORTANT]
> If you are using Private Link for your Azure Machine Learning workspace, and put the Azure Container Registry for your workspace in a virtual network, you must also apply the following Azure Resource Manager template. This template enables your workspace to communicate with ACR over the Private Link.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "keyVaultArmId": {
      "type": "string"
      },
      "workspaceName": {
      "type": "string"
      },
      "containerRegistryArmId": {
      "type": "string"
      },
      "applicationInsightsArmId": {
      "type": "string"
      },
      "storageAccountArmId": {
      "type": "string"
      },
      "location": {
      "type": "string"
      }
  },
  "resources": [
      {
      "type": "Microsoft.MachineLearningServices/workspaces",
      "apiVersion": "2019-11-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "identity": {
          "type": "SystemAssigned"
      },
      "sku": {
          "tier": "enterprise",
          "name": "enterprise"
      },
      "properties": {
          "sharedPrivateLinkResources":
  [{"Name":"Acr","Properties":{"PrivateLinkResourceId":"[concat(parameters('containerRegistryArmId'), '/privateLinkResources/registry')]","GroupId":"registry","RequestMessage":"Approve","Status":"Pending"}}],
          "keyVault": "[parameters('keyVaultArmId')]",
          "containerRegistry": "[parameters('containerRegistryArmId')]",
          "applicationInsights": "[parameters('applicationInsightsArmId')]",
          "storageAccount": "[parameters('storageAccountArmId')]"
      }
      }
  ]
}
```

## Next steps

For more information on securing your Azure Machine Learning workspace, see the [Enterprise security](concept-enterprise-security.md) article.
