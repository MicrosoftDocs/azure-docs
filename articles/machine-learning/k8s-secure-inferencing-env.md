---
title: Secure AKS inferencing environment
description: Learn about what is a secure AKS inferencing environment and how to configure it. 
titleSuffix: Azure Machine Learning
author: ssalgadodev
ms.author: ssalgado
ms.service: machine-learning
ms.subservice: core
ms.date: 07/28/2022
ms.topic: how-to
ms.custom: build-spring-2022, cliv2, sdkv2, event-tier1-build-2022
#customer intent: I would like to have machine learning with all private IP only 
---

# Secure AKS inferencing environment

If you have AKS cluster behind of Vnet, you would need to secure Azure Machine Learning workspace resources and compute environment using the same VNet. In this article, you will learn: 
  * What is a secure AKS inferencing environment
  * How to configure a secure AKS inferencing environment

## What is a secure AKS inferencing environment

Azure Machine Learning AKS inferencing environment consists of workspace, your AKS cluster, and workspace associated resources - Azure Storage, Azure Key Vault, and Azure Container Services(ARC). The following table compares how services access different part of Azure Machine Learning network with or without a Vnet.

| Scenario | Workspace | Associated resources (Storage account, Key Vault, ACR) | AKS cluster |
|-|-|-|-|-|
|**No virtual network**| Public IP | Public IP | Public IP |
|**Public workspace, all other resources in a virtual network** | Public IP | Public IP (service endpoint) <br> **- or -** <br> Private IP (private endpoint) | Private IP  |
|**Secure resources in a virtual network**| Private IP (private endpoint) | Public IP (service endpoint) <br> **- or -** <br> Private IP (private endpoint) | Private IP  | 

In a secure AKS inferencing environment, AKS cluster accesses different part of Azure Machine Learning services with private endpoint only (private IP). The following network diagram shows a secured Azure Machine Learning workspace with a private AKS cluster or default AKS cluster behind of Vnet.

 [![A secure AKS inferencing envrionment: AKS cluster accesses different part of AzureML services with private endpoint, including workspace and its associated resources](./media/how-to-network-security-overview/secure-inferencing-environment.svg)](./media/how-to-network-security-overview/secure-inferencing-environment.svg)

## How to configure a secure AKS inferencing environment

To configure a secure AKS inferencing environment, you must have Vnet information for AKS. [VNet](../virtual-network/quick-create-portal.md) can be created independently or during AKS cluster deployment. There are two options for AKS cluster in a Vnet:
  * Deploy default AKS cluster to your VNet
  * Or create private AKS cluster to your VNet

For default AKS cluster, you can find VNet information under the resource group of `MC_[rg_name][aks_name][region]`. 

After you have VNet information for AKS cluster and if you already have workspace available, use following steps to configure a secure AKS inferencing environment:
  
  * Use your AKS cluster VNet information to add new private endpoints for the Azure Storage Account, Azure Key Vault, and Azure Container Registry used by your workspace. These private endpoints should exist in the same VNnet as AKS cluster. Please check [secure workspace with private endpoint](./how-to-secure-workspace-vnet.md#secure-the-workspace-with-private-endpoint) for details.
  * If you have other storage that is used by your workspace, add a new private endpoint for that storage. The private endpoint should exist in the AKS cluster VNet and have private DNS zone integration enabled.
  * Add a new private endpoint to your workspace. This private endpoint should exist in AKS cluster VNet and have private DNS zone integration enabled.

If you have AKS cluster ready but don't have workspace created yet, you can use AKS clsuter VNet information and follow tutorial [create secure workspace](./tutorial-create-secure-workspace.md) to create a workspace first, and then add a new private endpoint to your workspace as the last step. For all above steps, it is important to ensure that all private endpoints should exist in the same AKS cluster VNet and have private DNS zone integraton enabled.

Special notes for configuring a secure AKS inferencing environment:
  * Please use system-assigned managed identity when creating workspace, as storage account with private endpoint only allows access with system-assigned managed idenity.
  * When attaching AKS cluster to an HBI workspace, please assign a system-assigned managed identity with both `Storage Blob Data Contributor` and `Storage Account Contributor` roles.
  * If you are using default ACR created by workspace, please ensure you have premium SKU for ACR and also enable `Firewall exception` to allow trusted Microsoft services to access ACR.
  * If your workspace is also behind of VNet, follow instruction [securely connect to your workspace](./how-to-secure-workspace-vnet.md#securely-connect-to-your-workspace) to access workspace.
  * For storage account private endpoint, make sure to enable `Allow Azure services on the trusted services list to access this storage account`.

