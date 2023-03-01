---
title: "Network fabric Controller and Cluster Manger creation"
description: Learn the steps for create the Azure Operator Nexus Network fabric Controller and Cluster Manger.
author: JAC0BSMITH
ms.author: jacobsmith
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 02/08/2023 #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Create network fabric controller and cluster manager in an Azure region

You need to create a Network fabric Controller (NFC) and then a (Network Cloud) Cluster Manager (CM)
in your target Azure region. This Azure region will be connected to your on-premise sites.
You'll also need to create an NFC and CM in other Azure regions to be connected to your on-premise sites.

Each NFC is associated with a CM in the same Azure region and your subscription.
The NFC/CM pair lifecycle manages up to 32 Azure Operator Nexus instances deployed in your sites connected to this Azure region.
Each Operator Nexus instance consists of network fabric, compute and storage infrastructure.

## Prerequisites

- Ensure Azure Subscription for Operator Nexus resources has been permitted access to the
  necessary Azure Resource Providers:
  - Microsoft.NetworkCloud
  - Microsoft.ManagedNetworkFabric
  - Microsoft.HybridContainerService
  - Microsoft.HybridNetwork
- Establish [ExpressRoute](/azure/azure/expressroute/expressroute-introduction) connectivity
  from your on-premises network to an Azure Region:
  - ExpressRoute circuit [creation and verification](/azure/azure/expressroute/expressroute-howto-circuit-portal-resource-manager)
    can be performed via the Azure portal
  - In the ExpressRoute blade, ensure Circuit status indicates the status
    of the circuit on the Microsoft side. Provider status indicates if
    the circuit has been provisioned or not provisioned on the
    service-provider side. For an ExpressRoute circuit to be operational,
    Circuit status must be Enabled, and Provider status must be
    Provisioned
- Set up Key Vault to store encryption and security tokens, service principals,
  passwords, certificates, and API keys
- Set up Log Analytics workSpace (LAW) to store logs and analytics data for
  Operator Nexus subcomponents (Fabric, Cluster, etc.)
- Set up Azure Storage account to store Operator Nexus data objects:
  - Azure Storage supports blobs and files accessible from anywhere in the world over HTTP or HTTPS
  - this storage isn't for user/consumer data.

### Install CLI extensions

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

## Create steps

- Step 1: Create Network fabric Controller
- Step 2: Create Cluster Manager

## Step 1: Create a network fabric controller

Operators will sign in to their subscription to create a `Network
Fabric Controller` (NFC) in an Azure region. Bootstrapping
and management of network fabric instances are performed from the NFC.

You'll create a Network fabric Controller (NFC) prior to the first deployment
of an on-premises Operator Nexus instance. Each NFC can manage up to 32 Operator Nexus instances.
For subsequent network fabric deployments, managed by this
Fabric Controller, an NFC won't need to be created. After 32 Operator Nexus instances
have been deployed, another NFC will need to be created.

An NFC manages network fabric of Operator Nexus instances deployed in an Azure region.
You.ll need to create an NFC in every Azure region that you'll deploy
Operator Nexus instances in.

Create the NFC:

```azurecli
az nf controller create \
--resource-group "$NFC_RESOURCE_GROUP" \
--location "$LOCATION"  \
--resource-name "$NFC_RESOURCE_NAME" \
--ipv4-address-space "$NFC_MANAGEMENT_CLUSTER_IPV4" \
--ipv6-address-space "$NFC_MANAGEMENT_CLUSTER_IPV6" \
--infra-er-connections '[{"expressRouteCircuitId": "$INFRA_ER_CIRCUIT1_ID", \
  "expressRouteAuthorizationKey": "$INFRA_ER_CIRCUIT1_AUTH"}]'
--workload-er-connections '[{"expressRouteCircuitId": "$WORKLOAD_ER_CIRCUIT1_ID", \
  "expressRouteAuthorizationKey": "$WORKLOAD_ER_CIRCUIT1_AUTH"}]'
```

### Parameters required for network fabric controller operations

| Parameter name              | Description                                                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFC_RESOURCE_GROUP          | The resource group name                                                                                                                                                                  |
| LOCATION                    | The Azure Region where the NFC will be deployed (for example, `eastus`)                                                                                                                  |
| NFC_RESOURCE_NAME           | Resource Name of the Network fabric Controller                                                                                                                                           |
| NFC_MANAGEMENT_CLUSTER_IPV4 | Optional IPv4 Prefixes for NFC VNet. Can be specified at the time of creation. If unspecified, default value of `10.0.0.0/19` is assigned. The prefix should be at least of length `/19` |
| NFC_MANAGEMENT_CLUSTER_IPV6 | Optional IPv6 Prefixes for NFC `vnet`. Can be specified at the time of creation. If unspecified, undefined. The prefix should be at least of length `/59`                                |
| INFRA_ER_CIRCUIT1_ID        | The name of express route circuit for infrastructure must be of type `Microsoft.Network/expressRouteCircuits/circuitName`                                                                 |
| INFRA_ER_CIRCUIT1_AUTH      | Authorization key for the circuit for infrastructure must be of type `Microsoft.Network/expressRouteCircuits/authorizations`                                                              |
| WORKLOAD_ER_CIRCUIT1_ID     | The name of express route circuit for workloads must be of type `Microsoft.Network/expressRouteCircuits/circuitName`                                                                      |
| WORKLOAD_ER_CIRCUIT1_AUTH   | Authorization key for the circuit for workloads must be of type `Microsoft.Network/expressRouteCircuits/authorizations`                                                                   |


The Network fabric Controller is created within the resource group in your Azure Subscription.

The Network fabric Controller ID will be needed in the next steps to create
the Cluster Manager and Network fabric resources. The v4 and v6 IP address
space is a private large subnet, recommended for `/16` in multi-rack
environments, which is used by the NFC to allocate IP to all devices in all Instances under the NFC and Cluster Manager domain.

### NFC validation

The NFC and a few other hosted resources will be created in the NFC hosted resource groups.
The other resources include:

- ExpressRoute Gateway,
- Infrastructure vnet,
- Tenant vnet,
- Infrastructure Proxy/DNS/NTP VM,
- storage account,
- Key Vault,
- SAW restricted jumpbox VM,
- hosted AKS,
- resources for each cluster, and
- Kubernetes clusters for the controller, infrastructure, and tenant.

View the status of the NFC:

```azurecli
az nf controller show --resource-group "$NFC_RESOURCE_GROUP" --resource-name "$NFC_RESOURCE_NAME"
```

The NFC deployment is complete when the `provisioningState` of the resource shows: `"provisioningState": "Succeeded"`

### NFC logging

NFC created logs can be viewed in:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag on the command-line.
3. Resource provider logs based off subscription or correlation ID in debug

## Step 2: create a cluster manager

A Cluster Manager (CM) represents the control-plane to manage one or more of your
on-premises Operator Nexus  clusters (instances).
The Cluster Manager is served by a User Resource Provider (RP) that
resides in an AKS cluster within your Subscription. The Cluster Manager
is responsible for the lifecycle management of your Operator Nexus Clusters.
The CM will appear in your subscription as a resource.

A Fabric Controller is required before the Cluster Manager can be created.
There's a one-to-one dependency between the Network fabric Controller and
Cluster Manager. You'll need to create a Cluster Manager every time another
NFC is created.

You need to create a CM before the first deployment of an Operator Nexus instance.
You don't need to create a CM for subsequent Operator Nexus on-premises deployments to be managed by
the same Cluster Manager.

Create Cluster Manager:

```azurecli
az networkcloud clustermanager create --name "$CM_RESOURCE_NAME" \
  --location "$LOCATION" --analytics-workspace-id "$LAW_ID" \
  --availability-zones "$AVAILABILITY_ZONES" --fabric-controller-id "$NFC_ID" \
  --managed-resource-group-configuration name="$CM_MRG_RG" \
  --tags $TAG1="$VALUE1" $TAG2="$VALUE2" \
  --resource-group "$CM_RESOURCE_GROUP"

az networkcloud clustermanager wait --created --name "$CM_RESOURCE_NAME" \
  --resource-group "$CM_RESOURCE_GROUP"
```

You can also create a Cluster Manger using ARM template/parameter files in
[ARM Template Editor](https://portal.azure.com/#create/Microsoft.Template):

### Parameters for use in cluster manager operations

| Parameter name     | Description                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| CM_RESOURCE_NAME   | Resource Name of the Network fabric Controller                                      |
| LAW_ID             | Log Analytics Workspace ID for the CM                                               |
| LOCATION           | The Azure Region where the NFC will be deployed (for example, `eastus`)             |
| AVAILABILITY_ZONES | List of targeted availability zones, recommended "1" "2" "3"                        |
| CM_RESOURCE_GROUP  | The resource group name                                                             |
| NFC_ID             | ID for NFC integrated with this Cluster Manager from `az nf controller show` output |
| CM_MRG_RG          | The resource group name for the Cluster Manager managed resource group              |
| TAG/VALUE          | Custom tag/value pairs to pass to Cluster Manager                                   |

The Cluster Manager is created within the resource group in your Azure Subscription.

The CM Custom Location will be needed to create the Cluster.

### CM validation

The CM creation will also create other resources in the CM hosted resource groups.
These other resources include a storage account, Key Vault, AKS cluster,
managed identity, and a custom location.

You can view the status of the CM:

```azurecli
az networkcloud clustermanager show --resource-group "$CM_RESOURCE_GROUP" \
  --name $CM_RESOURCE_NAME"
```

The CM deployment is complete when the `provisioningState` of the resource shows: `"provisioningState": "Succeeded",`

### CM logging

CM create logs can be viewed in:

1. Azure portal Resource/ResourceGroup Activity logs.
2. Azure CLI with `--debug` flag passed on command-line.
3. Resource provider logs based off subscription or correlation ID in debug
