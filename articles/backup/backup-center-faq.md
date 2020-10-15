---
title: Backup Center - FAQ
description: This article answers frequently asked questions about Backup Center
ms.topic: conceptual
ms.date: 09/08/2020
---

# Backup Center - Frequently asked questions

## Management

### Can Backup Center be used across tenants?

Yes, if you're using [Azure Lighthouse](https://docs.microsoft.com/azure/lighthouse/overview) and have delegated access to subscriptions across different tenants, you can use Backup Center as a single pane of glass to manage backups across tenants.

### Can Backup Center be used to manage both Recovery Services vaults and Backup vaults?

Yes, Backup Center can manage both [Recovery Services vaults](https://docs.microsoft.com/azure/backup/backup-azure-recovery-services-vault-overview) and [Backup vaults](backup-vault-overview.md).

### Is there a delay before data surfaces in Backup Center?

Backup Center is aimed at providing real-time information. There may be a few seconds lag between the time an entity shows up in an individual vault screen, and the time the same entity shows up in Backup Center.

## Configuration

### Do I need to configure anything to see data in Backup Center?

No. Backup Center comes ready out of the box. However, to view [Backup Reports](https://docs.microsoft.com/azure/backup/configure-reports) under Backup Center, you need to configure reporting for your vaults.

### Do I need to have any special permissions to use Backup Center?

Backup Center as such doesn't need any new permissions. As long as you have the right level of Azure RBAC access for the resources you're managing, you can use Backup Center for these resources. For example, to view information about your backups, you'll need **Reader** access to your vaults. To configure backup and perform other backup-related actions, you'll need **Backup Contributor** or **Backup Operator** roles. Learn more about [Azure roles for Azure Backup](https://docs.microsoft.com/azure/backup/backup-rbac-rs-vault).

## Pricing

### Do I need to pay anything extra to use Backup Explorer?

Currently, there are no additional costs (apart from your backup costs) to use Backup Center. However, if you're using [Backup Reports](https://docs.microsoft.com/azure/backup/configure-reports) under Backup Center, there's a [cost involved](https://azure.microsoft.com/pricing/details/monitor/) in using Azure Monitor Logs for Backup Reports.

## Next steps

Read the other FAQs:

* [Common questions about Recovery Services vaults](https://docs.microsoft.com/azure/backup/backup-azure-backup-faq)
* [Common questions about Azure VM backups](https://docs.microsoft.com/azure/backup/backup-azure-vm-backup-faq)
