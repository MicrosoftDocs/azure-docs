---
title: "Azure Operator Nexus: Creation of L2 isolation-domain"
description: Learn how create L2 isolation-domain.
author: jaredr80 #Required; your GitHub user alias, with correct capitalization.
ms.author: jaredro #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required;
ms.topic: include #Required; leave this attribute/value as-is.
ms.date: 01/26/2023 #Required; mm/dd/yyyy format.
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
