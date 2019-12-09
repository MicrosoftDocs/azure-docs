---
title: Common Issues - Marketplace Images
description: Azure CycleCloud common issue - Marketplace Images
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Marketplace Images

## Possible Error Messages

- `Creating Virtual Machine (User failed validation to purchase resources)`

## Resolution

When using a marketplace image with CycleCloud, the service principal must have appropriate permissions on the subscription to programmatically accept the licensing terms for the image. To resolve this issue, you may either grant the appropriate AAD permission to the service principal or use the Azure portal or CLI to accept the terms with a user with appropriate permissions.

To grant access using the Azure CLI:

```azurecli-interactive
az vm image accept-terms --urn PUBLISHER:OFFER:SKU:VERSION
```

or

```azurecli-interactive
az vm image accept-terms --publisher PUBLISHER --offer OFFER --plan SKU
```

## More Information

For more information, see [Marketplace Terms](https://azure.microsoft.com/support/legal/marketplace-terms/)

