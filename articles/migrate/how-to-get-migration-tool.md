---
title: Migrate machines after assessment with Azure Migrate | Microsoft Docs
description: Describes how to get recommendations for migrating machines after you run an assessment with the Azure Migrate service.
author: rayne-wiselman
ms.service: azure-migrate
ms.topic: article
ms.date: 09/17/2018
ms.author: raynew
---


# Migrate machines after assessment


[Azure Migrate](migrate-overview.md) assesses on-premises machines to check whether they're suitable for migration to Azure, and provides sizing and cost estimations for running the machine in Azure. Currently, Azure Migrate only assesses machines for migration. The migration itself is currently performed using other Azure services.

This article describes how to get suggestions for a migration tool after you've run a migration assessment.

## Migration tool suggestion

To get suggestions regarding migration tools, you need to do a deep discovery of the on-premises environment. The deep discovery is done by installing agents on the on-premises machines.  

1. Create an Azure Migrate project, discover on-premises machines, and create a migration assessment. [Learn more](tutorial-assessment-vmware.md).
2. Download and install the Azure Migrate agents on each on-premises machine for which you want to see a recommended migration method. [Follow this procedure](how-to-create-group-machine-dependencies.md#prepare-for-dependency-visualization) to install the agents.
2. Identify your on-premises machines that are suitable for lift-and-shift migration. These are the VMs that don't require any changes to apps running on them, and can be migrated as is.
3. For lift-and-shift migration, we suggest using Azure Site Recovery. [Learn more](../site-recovery/tutorial-migrate-on-premises-to-azure.md). Alternately, you can use third-party tools that support migration to Azure.
4. If you have on-premises machines that aren't suitable for a lift-and-shift migration, that is, if you want to migrate specific app rather than an entire VM, you can use other migration tools. For example, we suggest the [Azure Database Migration service](https://azure.microsoft.com/campaigns/database-migration/) if you want to migrate on-premises databases such a SQL Server, MySQL, or Oracle to Azure.


## Review suggested migration methods

1. Before you can get a suggested migration method, you need to create an Azure Migrate project, discover on-premises machines, and run a migration assessment. [Learn more](tutorial-assessment-vmware.md).
2. After the assessment is created, view it in the project > **Overview** > **Dashboard**. Click **Assessment Readiness**

    ![Assessment readiness](./media/tutorial-assessment-vmware/assessment-report.png)  

3. In **Suggested Tool**, review the suggestions for tools you can use for migration.

    ![Suggested tool](./media/tutorial-assessment-vmware/assessment-suitability.png)




## Next steps

[Learn more](concepts-assessment-calculation.md) about how assessments are calculated.
