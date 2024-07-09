---
title: "Azure Operator Nexus: Before you start Network Fabric Controller and Cluster Manger creation"
description: Prepare for create the Azure Operator Nexus Network Fabric Controller and Cluster Manger.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 09/07/2023
ms.custom: template-how-to
---

# Operator Nexus Azure resources prerequisites

To get started with Operator Nexus, you need to create a Network Fabric Controller (NFC) and then a Cluster Manager (CM)
in your target Azure region.

Each NFC is associated with a CM in the same Azure region and your subscription.

You need to complete the prerequisites before you can deploy the first Operator Nexus NFC and CM pair.
In subsequent deployments of Operator Nexus, you'll only need to create the NFC and CM after reaching the [quota](./reference-limits-and-quotas.md#network-fabric) of supported Operator Nexus instances.

## Resource Provider Registration

- Permit access to the necessary Azure Resource Providers for the Azure Subscription for Operator Nexus resources:
  - az provider register --namespace Microsoft.NetworkCloud
  - az provider register --namespace Microsoft.ManagedNetworkFabric
  - az provider register --namespace Microsoft.Compute
  - az provider register --namespace Microsoft.ContainerService
  - az provider register --namespace Microsoft.ExtendedLocation
  - az provider register --namespace Microsoft.HybridCompute
  - az provider register --namespace Microsoft.HybridConnectivity
  - az provider register --namespace Microsoft.HybridContainerService
  - az provider register --namespace Microsoft.HybridNetwork
  - az provider register --namespace Microsoft.Insights
  - az provider register --namespace Microsoft.Keyvault
  - az provider register --namespace Microsoft.Kubernetes
  - az provider register --namespace Microsoft.KubernetesConfiguration
  - az provider register --namespace Microsoft.ManagedIdentity
  - az provider register --namespace Microsoft.Network
  - az provider register --namespace Microsoft.OperationalInsights
  - az provider register --namespace Microsoft.OperationsManagement
  - az provider register --namespace Microsoft.ResourceConnector
  - az provider register --namespace Microsoft.Resources
  - az provider register --namespace Microsoft.Storage

## Dependent Azure resources setup

- Establish [ExpressRoute](/azure/expressroute/expressroute-introduction) connectivity
  from your on-premises network to an Azure Region:
  - ExpressRoute circuit [creation and verification](/azure/expressroute/expressroute-howto-circuit-portal-resource-manager)
    can be performed via the Azure portal
  - In the ExpressRoute blade, ensure Circuit status indicates the status
    of the circuit on the Microsoft side. Provider status indicates if
    the circuit is provisioned or not provisioned on the
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
>Your account must have permissions to read/write/publish in the subscription

## Create steps

- Step 1: [Create Network Fabric Controller](./howto-configure-network-fabric-controller.md)
- Step 2: [Create Cluster Manager](./howto-cluster-manager.md)
