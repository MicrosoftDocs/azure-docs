---
title: "Azure Operator Nexus: Create an L2 isolation domain"
description: Learn how to create an L2 isolation domain.
author: jaredr80
ms.author: jaredro
ms.service: azure-operator-nexus
ms.topic: include
ms.date: 01/26/2023
---

Create an L2 isolation domain:

```azurecli
  az networkfabric l2domain create --resource-name "<YourL2IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --nf-id "<NetworkFabricResourceId>" \
    --location "<ClusterAzureRegion>" \
    --vlan <YourNetworkVlan> \
    --mtu "<MtuOfThisNetwork>
```

Enable the L2 isolation domain that you created:

```azurecli
  az networkfabric l2domain update-administrative-state \
    --name "<YourL2IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --state Enable
```

Repeat, as needed, to create other L2 isolation domains.
