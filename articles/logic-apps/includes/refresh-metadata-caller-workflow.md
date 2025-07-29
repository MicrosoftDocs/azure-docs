---
ms.suite: integration
ms.service: azure-logic-apps
services: logic-apps
author: ecfan
ms.author: estfan
ms.reviewer: azla
ms.date: 03/18/2025
ms.topic: include
---

  So, if you have another workflow that calls the deleted workflow, you must resave the caller workflow to refresh the metadata for the recreated workflow. That way, the caller gets the correct information for the recreated workflow. Otherwise, calls to the recreated workflow fail with an **`Unauthorized`** error. This behavior also applies to workflows that use artifacts in integration accounts and workflows that call Azure functions.
