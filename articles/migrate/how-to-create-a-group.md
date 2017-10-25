---
title: Create a group for assessment with Azure Migrate | Microsoft Docs
description: Describes how to create a group before you run an assessment with the Azure Migrate service.
services: migrate
documentationcenter: ''
author: rayne-wiselman
manager: carmonm
editor: ''

ms.assetid: 5c279804-aa30-4946-a222-6b77c7aac508
ms.service: migrate
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage-backup-recovery
ms.date: 09/25/2017
ms.author: raynew
---

# Create a group for assessment

This article describes how to create a group of machines for assessment by [Azure Migrate](migrate-overview.md). Azure Migrate assesses each machine in the group to check whether it's suitable for migration to Azure, and provides sizing and cost estimations for running the machine in Azure.


## Create a group

1. In the **Dashboard** of the Azure Migrate project, click **Groups** > **+Group**, and specify a group name.
2. Add one or more machines to the group, and click **Create**. 
3. Select **Create a new assessment automatically for this group**, to run an assessment immediately.

    ![Create a group](./media/how-to-create-a-group/create-group.png)

After the group is created, you can select it on the **Groups** page, and modify it by adding and removing machines.

## Next steps

- Learn how to create more detailed groups using [machine dependency mapping](how-to-create-group-machine-dependencies.md).
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
