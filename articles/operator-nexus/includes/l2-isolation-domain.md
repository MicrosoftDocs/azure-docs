---
title: "Azure Operator Nexus: Creation of L2 isolation-domain"
description: Learn how create L2 isolation-domain.
author: jwheeler60 #Required; your GitHub user alias, with correct capitalization.
ms.author: johnwheeler #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required;
ms.topic: include #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
---

- Create a L2 isolation-domain

```azurecli
  az nf l2domain create --resource-name "<YourL2IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --nf-id "<NetworkFabricResourceId>" \
    --location "<ClusterAzureRegion>" \
    --vlan <YourNetworkVlan> \
    --mtu "<MtuOfThisNetwork>
```

- Enable the L2 isolation-domain after it's created

```azurecli
  az managednetworkfabric l2isolationdomain update-administrative-state \
    --name "<YourL2IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --state Enable
```

- (Optional) Repeat, as needed, to create other L2 isolation-domain(s)
