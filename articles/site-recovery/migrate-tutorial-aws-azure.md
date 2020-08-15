---
title: Migrate AWS VMs to Azure with the Azure Site Recovery service | Microsoft Docs
description: This article describes how to migrate Windows VMs running in Amazon Web Services (AWS) to Azure using Azure Site Recovery.
services: site-recovery
author: rayne-wiselman
manager: carmonm
ms.service: site-recovery
ms.topic: tutorial
ms.date: 07/27/2019
ms.author: raynew
ms.custom: MVC

---
# Migrate Amazon Web Services (AWS) VMs to Azure

This article describes options for migrating Amazon Web Services (AWS) instances to Azure.

## Migrate with Azure Migrate

We recommend that you migrate AWS instances to Azure using the [Azure Migrate](../migrate/migrate-services-overview.md) service. Azure Migrate provides a centralized hub for assessment and migration of on-premises machines to Azure, using Azure Migrate, other Azure services, and third-party tools.

[Learn how](../migrate/tutorial-migrate-aws-virtual-machines.md) to migrate AWS instances with Azure Migrate. 


## Migrate with Site Recovery

Site Recovery should be used for disaster recovery only, and not migration.

If you're already using Azure Site Recovery, and you want to continue using it for AWS migration, follow the same steps that you use to set up [disaster recovery of physical machines](physical-azure-disaster-recovery.md).


> [!NOTE]
> When you run a failover for disaster recovery, as a last step you commit the failover. When you migrate AWS instances, the **Commit** option isn't relevant. Instead, you select the **Complete Migration** option. 

## Next steps

> [!div class="nextstepaction"]
> [Review common questions](../migrate/resources-faq.md) about Azure Migrate.
