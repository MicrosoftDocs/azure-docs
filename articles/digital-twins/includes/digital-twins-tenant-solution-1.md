---
author: baanders
description: Include file describing a token solution to the cross-tenant limitation with Azure Digital Twins.
ms.service: azure-digital-twins
ms.topic: include
ms.date: 4/21/2025
ms.author: baanders
---

One way to do this is with the following CLI command, where `<home-tenant-ID>` is the ID of the Microsoft Entra tenant that contains the Azure Digital Twins instance:

```azurecli-interactive
az account get-access-token --tenant <home-tenant-ID> --resource https://digitaltwins.azure.net
```

After this request, the identity receives a token issued for the `https://digitaltwins.azure.net` Microsoft Entra resource, which has a matching tenant ID claim to the Azure Digital Twins instance. Using this token in API requests or with your `Azure.Identity` code should allow the federated identity to access the Azure Digital Twins resource.
