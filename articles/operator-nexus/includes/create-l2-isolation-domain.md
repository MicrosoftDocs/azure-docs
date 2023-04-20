---
title: "Azure Operator Nexus: Creation of L2 isolation-domain"
description: Learn how create L2 isolation-domain.
author: jaredr80
ms.author: jaredro
ms.service: azure-operator-nexus
ms.topic: include
ms.date: 01/26/2023
---

- Create a L2 isolation-domain

```azurecli
  az nf l2domain create --resource-name "<YourL2IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --nf-id "<NetworkFabricResourceId>" \
    --location "<ClusterAzureRegion>" \
    --vlan-id <YourNetworkVlan> \
    --mtu "<MtuOfThisNetwork>
```
