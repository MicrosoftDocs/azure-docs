---
title: Migrate AWS VMs to Azure with Azure Migrate
description: This article describes options for migrating AWS instances to Azure, and recommends Azure Migrate.
services: site-recovery
ms.service: site-recovery
ms.topic: tutorial
ms.date: 07/27/2019
ms.custom: MVC
ms.author: ankitadutta
author: ankitaduttaMSFT
---
# Migrate Amazon Web Services (AWS) VMs to Azure

This article describes options for migrating Amazon Web Services (AWS) instances to Azure.

> [!NOTE]
> On Linux distributions, only the stock kernels that are part of the distribution minor version release/update are supported. [Learn more](./vmware-physical-azure-support-matrix.md#for-linux).

## Migrate with Azure Migrate

We recommend that you migrate AWS EC2 instances to Azure using the [Azure Migrate](../migrate/migrate-services-overview.md) service. Azure Migrate is purpose-built for server migration. Azure Migrate provides a centralized hub for discovery, assessment and migration of on-premises machines to Azure.

[Learn how](../migrate/tutorial-migrate-aws-virtual-machines.md) to migrate AWS instances with Azure Migrate. 


## Migrate with Site Recovery

Site Recovery should be used for disaster recovery only, and not migration.

If you're already using Azure Site Recovery, and you want to continue using it for AWS migration, follow the same steps that you use to set up [disaster recovery of physical machines](physical-azure-disaster-recovery.md).


> [!NOTE]
> When you run a failover for disaster recovery, as a last step you commit the failover. When you migrate AWS instances, the **Commit** option isn't relevant. Instead, you select the **Complete Migration** option.

## Next steps

> [!div class="nextstepaction"]
> [Review common questions](../migrate/resources-faq.md) about Azure Migrate.