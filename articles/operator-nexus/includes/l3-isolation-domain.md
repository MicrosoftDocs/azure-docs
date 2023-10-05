---
title: "Azure Operator Nexus: Create an L3 isolation domain"
description: Learn how to create an L3 isolation domain.
author: jaredr80
ms.author: jaredro
ms.service: azure-operator-nexus
ms.topic: include
ms.date: 01/26/2023
---

Create an L3 isolation domain:

```azurecli
  az networkfabric l3domain create \
    --resource-name "<YourL3IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --nf-id "<NetworkFabricResourceId >" \
    --location "<ClusterAzureRegion>"
```

Create an `internalnetwork` resource for every VLAN or subnet that you need to include in your L3 isolation domain.

> [!NOTE]
> The following example uses the minimal configuration for creating a valid internal network. It doesn't show optional parameters.

```azurecli
  az networkfabric internalnetwork create \
    --resource-name "<L3IsolationDomainInternalNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --l3-isolation-domain-name "<YourL3IsolationDomainName>" \
    --vlan-id <YourNetworkVlan> \
    --mtu <MtuOfThisNetwork> \
    --connected-ipv4-subnets '[{prefix="<YourSubnetCIDR> \
        "gateway="<YourGatewayIp>}]'
    --bgp-configuration '{"fabric-asn" <FabricAsNumber>, \
        "defaultRouteOriginate":<boolean>, "peerASN": <PeerAsNumber>, \
        "ipv4NeighborAddress":[{"address": "<YourSubetInfoHere> "}]}'
```

Repeat, as needed, for any other `internalnetwork` resources that you have to add to this L3 isolation domain.

Enable the L3 isolation domain after you've created all `internalnetwork` resources.

```azurecli
  az networkfabric l3domain update-admin-state \
    --resource-name "<YourL3IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --state Enable
```

Repeat to create more L3 isolation domains.
