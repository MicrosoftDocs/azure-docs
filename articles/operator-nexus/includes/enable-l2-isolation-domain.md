---
title: "Azure Operator Nexus: Creation of L2 isolation-domain"
description: Learn how create L2 isolation-domain.
author: jaredr80
ms.author: jaredro
ms.service: azure-operator-nexus
ms.topic: include
ms.date: 01/26/2023
---

- Enable the L2 isolation-domain after it's created

```azurecli
  az nf l2domain update-administrative-state \
    --name "<YourL2IsolationDomainName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --state Enable
```

- (Optional) Repeat `create` and `enable` isolation-domain, as needed, to create other L2 isolation-domain(s)
