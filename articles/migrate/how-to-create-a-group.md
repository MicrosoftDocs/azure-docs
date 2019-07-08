---
title: Group machines for assessment with Azure Migrate | Microsoft Docs
description: Describes how to group machines before you run an assessment with the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 11/28/2018
ms.author: raynew
---



# Group machines for assessment

This article describes how to create a group of machines for assessment by [Azure Migrate](migrate-overview.md). Azure Migrate assesses machines in the group to check whether they're suitable for migration to Azure, and provides sizing and cost estimations for running the machine in Azure. If you know the machines that need be migrated together, you can manually create the group in Azure Migrate using the following method. If you are not very sure about the machines that need to be grouped together, you can use the dependency visualization functionality in Azure Migrate to create groups. [Learn more.](how-to-create-group-machine-dependencies.md)

> [!NOTE]
> The dependency visualization functionality is not available in Azure Government.

## Create a group

1. In the **Overview** of the Azure Migrate project, under Manage, click **Groups** > **+Group**, and specify a group name.
2. Add one or more machines to the group, and click **Create**.
3. You can optionally select to run a new assessment for the group.

    ![Create a group](./media/how-to-create-a-group/create-group.png)

After the group is created, you can modify it by selecting the group on the **Groups** page, and then adding or removing machines.

## Next steps

- Learn how to use [machine dependency mapping](how-to-create-group-machine-dependencies.md) to create high confidence groups.
- [Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
