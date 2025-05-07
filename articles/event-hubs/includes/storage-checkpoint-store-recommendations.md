---
title: Storage checkpoint recommendations
description: Provides recommendations when using Azure Blob Storage as a checkpoint store.
author: spelluru
ms.service: azure-event-hubs
ms.topic: include
ms.date: 02/15/2024
ms.author: spelluru
ms.custom: "include file"
---

Follow these recommendations when using Azure Blob Storage as a checkpoint store: 

- Use a separate container for each consumer group. You can use the same storage account, but use one container per each group.
- Don't use the container for anything else, and don't use the storage account for anything else.
- Storage account should be in the same region as the deployed application is located in. If the application is on-premises, try to choose the closest region possible.

On the **Storage account** page in the Azure portal, in the **Blob service** section, ensure that the following settings are disabled. 

- Hierarchical namespace
- Blob soft delete
- Versioning

