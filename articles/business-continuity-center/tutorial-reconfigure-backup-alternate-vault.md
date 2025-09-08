---
title: Tutorial - Configure protection for data sources
description: Learn how to configure protection for your data sources which are currently not protected by any solution using Azure Business Continuity Center.
ms.topic: tutorial
ms.date: 08/20/2025
ms.service: azure-business-continuity-center
ms.custom:
  - ignite-2023
  - ignite-2024
author: AbhishekMallick-MS
ms.author: v-mallicka
---

This tutorial describes how to reconfigure backup for data sources in Azure Business Continuity Center. This feature allows you to suspend backup for a data source in a Recovery Services vault and configure backup with a different vault.






> [!NOTE]
> - Recovery Services vault does not allow active multi-protection.
> - The alternate vault has no limitations on redundancy, security settings, or policy retention, including for immutable vaults.
> - Old recovery points remain protected with the original configurations and retention. This capability also applies to immutable vaults.
> - Immutable vaults remain secure when using this feature. You can only stop protection by retaining data, and older recovery points continue to be protected as per the selected retention option.
