---
title: Tutorial - Protect Azure Elastic SAN volume with operational backup by using the Azure portal
description: Learn how to protect Azure Elastic SAN volume with operational backup using Azure Backup in the Azure portal.
ms.topic: tutorial
ms.date: 09/17/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As an IT administrator, I want to configure backup for Azure Elastic SAN volumes, so that I can protect storage resources."
---

# Tutorial: Protect Azure Elastic SAN volume with operational backup by using the Azure portal

Azure Backup provides operational backup for Azure Elastic SAN volumes through an Azure Backup vault. You can configure backup schedules, retain recovery points, and restore data to a new volume when needed. 

This tutorial describes how to protect Azure Elastic SAN volumes with operational backup by using Azure Backup via Azure portal.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Verify prerequisites for Elastic SAN backup.
> - Configure operational backup.
> - Run an on-demand backup.
> - Track backup jobs.

## Prerequisites

Before you protect an Azure Elastic SAN volume with operational backup by using the Azure portal, ensure that you meet the following prerequisites:

- Use an existing Elastic SAN volume, or [create a new one](/azure/storage/elastic-san/elastic-san-create?tabs=azure-portal).
- Check if the Elastic SAN volume is present in a [supported region](azure-elastic-san-backup-support-matrix.md#supported-regions).
- Verify if the Elastic SAN volume size is **16 TB or less**.
- Use an existing vault in the subscription that's the same as the Elastic SAN volume, or [create a new one](create-manage-backup-vault.md#create-backup-vault).
- Use an Elastic SAN backup policy. To create one, see [Quickstart: Create an operational backup policy for Azure Elastic SAN volume](azure-elastic-san-backup-quickstart.md?pivots=client-portal).

For supported scenarios and limitations of Azure Elastic SAN volume operational backup, see the [support matrix](azure-elastic-san-backup-support-matrix.md).

[!INCLUDE [Configure Azure Elastic SAN backup](../../includes/azure-elastic-san-configure-backup.md)]

[!INCLUDE [Run an on-demand backup for Azure Elastic SAN](../../includes/azure-elastic-san-run-on-demand-backup.md)]

## Track backup jobs for Azure Elastic SAN volumes

To view Azure Elastic SAN volume operational backup jobs, follow these steps:

1. Go to **Resiliency**, and select **Monitoring + Reporting** > **Jobs**.
1. On the **Jobs** pane, filter **Datasource type** by **Elastic SAN volumes**.

## Next steps

- [Restore Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-restore.md).
- [Manage Azure Elastic SAN volume backup by using the Azure portal or Azure CLI](azure-elastic-san-backup-manage.md).
