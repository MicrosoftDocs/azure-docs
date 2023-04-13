---
title: "Azure Operator Nexus: Before you start Network Fabric Controller and Cluster Manger creation"
description: Prepare for create the Azure Operator Nexus Network Fabric Controller and Cluster Manger.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/03/2023
ms.custom: template-how-to
---

# Operator Nexus Azure resources prerequisites

To get started with Operator Nexus, you need to create a Network Fabric Controller (NFC) and then a Cluster Manager (CM)
in your target Azure region.

Each NFC is associated with a CM in the same Azure region and your subscription.
The NFC/CM pair lifecycle manages up to 32 Azure Operator Nexus instances deployed in your sites connected to this Azure region.

You'll need to complete the prerequisites before you can deploy the Operator Nexus first NFC and CM pair.
In subsequent deployments of Operator Nexus, you can skip to creating the NFC and CM.

## Resource Provider Registration

- Ensure Azure Subscription for Operator Nexus resources has been permitted access to the
  necessary Azure Resource Providers:
  - Microsoft.NetworkCloud
  - Microsoft.ManagedNetworkFabric
  - Microsoft.HybridContainerService
  - Microsoft.HybridNetwork
  - Microsoft.Storage 
  - Microsoft.Keyvault 
  - Microsoft.Network 
  - Microsoft.ExtendedLocation 
  - Microsoft.HybridCompute 
  - Microsoft.HybridConnectivity 
  - Microsoft.HybridContainerService 
  - Microsoft.Insights 
  - Microsoft.Kubernetes 
  - Microsoft.KubernetesConfiguration 
  - Microsoft.OperationalInsights 
  - Microsoft.OperationsManagement
  - Microsoft.ResourceConnector 
  - Microsoft.Resources

## Dependant Azure resources setup
- Establish [ExpressRoute](/azure/expressroute/expressroute-introduction) connectivity
  from your on-premises network to an Azure Region:
  - ExpressRoute circuit [creation and verification](/azure/expressroute/expressroute-howto-circuit-portal-resource-manager)
    can be performed via the Azure portal
  - In the ExpressRoute blade, ensure Circuit status indicates the status
    of the circuit on the Microsoft side. Provider status indicates if
    the circuit has been provisioned or not provisioned on the
    service-provider side. For an ExpressRoute circuit to be operational,
    Circuit status must be Enabled, and Provider status must be
    Provisioned
- Set up Azure Key Vault to store encryption and security tokens, service principals,
  passwords, certificates, and API keys
- Set up Log Analytics WorkSpace (LAW) to store logs and analytics data for
  Operator Nexus subcomponents (Network Fabric, Cluster, etc.)
- Set up Azure Storage account to store Operator Nexus data objects:
  - Azure Storage supports blobs and files accessible from anywhere in the world over HTTP or HTTPS
  - this storage isn't for user/consumer data.

## Install CLI Extensions and sign-in to your Azure subscription

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

### Azure subscription sign-in

```azurecli
  az login
  az account set --subscription $SUBSCRIPTION_ID
  az account show
```

>[!NOTE]
>The account must have permissions to read/write/publish in the subscription

## Create steps

- Step 1: [Create Network Fabric Controller](./howto-configure-network-fabric-controller.md)
- Step 2: [Create Cluster Manager](./howto-cluster-manager.md)
- 
