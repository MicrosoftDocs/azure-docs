---
title: Monitoring Alert and Reports FAQ
description: In this article, discover answers to common questions about the Azure Backup Monitoring Alert and Azure Backup reports.
ms.reviewer: srinathv
ms.topic: conceptual
ms.date: 07/08/2019
---

# Azure Backup Monitoring Alert - FAQ

This article answers common questions about Azure Backup monitoring and reporting.

## Configure Azure Backup reports

### How do I check if reporting data has started flowing into a Log Analytics (LA) Workspace?

Navigate to the LA Workspace you have configured, navigate to the **Logs** menu item, and run the query CoreAzureBackup | take 1. If you see a record being returned, it means data has started flowing into the workspace. The initial data push may take up to 24 hours.

### What is the frequency of data push to an LA Workspace?

The diagnostic data from the vault is pumped to the Log Analytics workspace with some lag. Every event arrives at the Log Analytics workspace 20 to 30 minutes after it's pushed from the Recovery Services vault. Here are further details about the lag:

* Across all solutions, the backup service's built-in alerts are pushed as soon as they're created. So they usually appear in the Log Analytics workspace after 20 to 30 minutes.
* Across all solutions, on-demand backup jobs and restore jobs are pushed as soon as they finish.
* For all solutions except SQL backup, scheduled backup jobs are pushed as soon as they finish.
* For SQL backup, because log backups can occur every 15 minutes, information for all the completed scheduled backup jobs, including logs, is batched and pushed every 6 hours.
* Across all solutions, other information such as the backup item, policy, recovery points, storage, and so on, is pushed at least once per day.
* A change in the backup configuration (such as changing policy or editing policy) triggers a push of all related backup information.

### How long can I retain reporting data?

After you create an LA Workspace, you can choose to retain data for a maximum of 2 years. By default, an LA Workspace retains data for 31 days.

### Will I see all my data in reports after I configure the LA Workspace?

 All the data generated after you configure diagnostics settings is pushed to the LA Workspace and is available in reports. In-progress jobs aren't pushed for reporting. After the job finishes or fails, it is sent to reports.

### Can I view reports across vaults and subscriptions?

Yes, you can view reports across vaults and subscriptions as well as regions. Your data may reside in a single LA Workspace or a group of LA Workspaces.

### Can I view reports across tenants?

If you are an [Azure Lighthouse](https://azure.microsoft.com/services/azure-lighthouse/) user with delegated access to your customers' subscriptions or LA Workspaces, you can use Backup Reports to view data across all your tenants.

### How long does it take for the Azure backup agent job status to reflect in the portal?

The Azure portal can take up to 15 mins to reflect the Azure backup agent job status.

### When a backup job fails, how long does it take to raise an alert?

An alert is raised within 20 mins of the Azure backup failure.

### Is there a case where an email won’t be sent if notifications are configured?

Yes. In the following situations, notifications are not sent.

* If notifications are configured hourly, and an alert is raised and resolved within the hour
* When a job is canceled
* If a second backup job fails because the original backup job is in progress

## Recovery Services Vault

### How long does it take for the Azure backup agent job status to reflect in the portal?

The Azure portal can take up to 15 mins to reflect the Azure backup agent job status.

### When a backup job fails, how long does it take to raise an alert?

An alert is raised within 20 mins of the Azure backup failure.

### Is there a case where an email won’t be sent if notifications are configured?

Yes. In the following situations, notifications are not sent:

* If notifications are configured hourly, and an alert is raised and resolved within the hour
* When a job is canceled
* If a second backup job fails because the original backup job is in progress

## Next steps

Read the other FAQs:

* [Common questions](backup-azure-vm-backup-faq.md) about Azure VM backups.
* [Common questions](backup-azure-file-folder-backup-faq.md) about the Azure Backup agent
