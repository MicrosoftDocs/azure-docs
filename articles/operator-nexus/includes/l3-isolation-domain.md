---
title: "Azure Operator Nexus: Creation of L3 isolation-domain"
description: Learn how create L3 isolation-domain.
author: jwheeler60 #Required; your GitHub user alias, with correct capitalization.
ms.author: johnwheeler #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required;
ms.topic: include #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
---

- Create a L3 isolation-domain

```azurecli
  az nf l3domain create \
    --resource-name "<YourL3IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --nf-id "<NetworkFabricResourceId >" \
    --location "<ClusterAzureRegion>"
```

- Create an `internalnetwork` resource for every VLAN/subnet that you need to include in your L3 isolation-domain

L3 isolation-domain, you'll need to create an `internalnetwork` resource

> [!NOTE]
> The following example uses the minimal configuration you will need to create a valid internal network.
> The optional parameters are not shown.

```azurecli
  az nf internalnetwork create \
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

- (Optional) Repeat, as needed, for any other `internalnetwork(s)` that have to be added to this L3 isolation-domain
- Enable the L3 isolation-domain after all `internalnetworks` have been created

```azurecli
  az nf l3domain update-admin-state \
    --resource-name "<YourL3IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --state Enable
```

- Repeat to create more L3 isolation-domain(s).
