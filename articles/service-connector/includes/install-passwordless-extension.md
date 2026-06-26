---
author: xfz11
ms.service: service-connector
ms.topic: include
ms.date: 06/17/2026
ms.reviewer: xiaofanzhou
---

Install the latest Service Connector passwordless extension for the Azure CLI:

```azurecli-interactive
az extension add --name serviceconnector-passwordless --upgrade
```

> [!NOTE]
> Check that the `serviceconnector-passwordless` extension version is 2.0.2 or later by running `az version`. If needed, upgrade the Azure CLI first, and then upgrade the extension.
