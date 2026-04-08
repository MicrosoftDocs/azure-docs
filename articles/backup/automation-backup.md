---
title: Automation in Azure Backup
description: Provides a summary of automation capabilities offered by Azure Backup.
ms.topic: how-to
ms.date: 01/30/2026
ms.service: azure-backup
ms.custom: engagement-fy23
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: As a backup administrator, I want to automate backup configuration and monitoring tasks, so that I can efficiently manage and protect a large and diverse set of workloads while minimizing human error.
---

# Automate Azure Backup operations for efficient datasource protection

Efficient automation is essential as the Azure environment grows to include a wide range of workloads. Automating key backup tasks, such as configuring protection for new resources, monitoring backup health, and responding to issues, help you consistently meet your backup objectives while minimizing manual effort and errors.

Azure Backup supports automation for most backup operations through various programmatic methods. This article outlines the automation tools available in Azure Backup and provides practical examples of end-to-end automation scenarios commonly used in large-scale enterprise deployments.

## Automation methods offered by Azure Backup

To access Azure Backup functionality, you can use the following standard automation methods supported by Azure:

- PowerShell
- CLI
- REST API
- Python SDK
- Go SDK
- Terraform
- Ansible
- ARM templates
- Bicep

You can also use Azure Backup associated with other Azure services, such as Logic Apps, Runbooks, Action Groups, and Azure Resource Graph to set up end-to-end automation workflows.

For more information about various scenarios that automation clients support and the corresponding document references, see the [supported automation solutions for Azure Backup](backup-support-automation.md).

## Common Azure Backup automation scenarios

This section provides a few common automation use cases that you might encounter as a backup admin. It also provides guidance for getting started.

### Configure backups

As a backup admin, you need to deal with new infrastructure getting added periodically, and ensure they're protected as per the agreed requirements. The automation clients, such as PowerShell/CLI, help to fetch all Virtual Machine (VM) details, check the backup status of each of them, and then take appropriate action for unprotected VMs.

However, this operation must be performant at-scale. Also, you need to schedule them periodically and monitor each run. To ease the automation operations, Azure Backup now uses Azure Policy and provides [built-in backup specific Azure Policies](backup-center-govern-environment.md#azure-policies-for-backup) to govern the backup estate.

Once you assign an Azure Policy to a scope, all VMs that meet your criteria are backed-up automatically, and newer VMs are scanned and protected periodically by the Azure Policy. You can also view a compliance report via [Resiliency](../resiliency/resiliency-overview.md) that provides visibility into noncompliant resources.

[Learn more about built-in Azure Policies for backup](backup-azure-auto-enable-backup.md).

The following video illustrates how Azure Policy works for backup:  <br><br>

> [!VIDEO https://learn.microsoft.com/shows/IT-Ops-Talk/Configure-backups-at-scale-using-Azure-Policy/player]

### Export backup-operational data

You might need to extract the backup-operational data for your entire estate and periodically import it to your monitoring systems/dashboards. At large scale, the data should be retrieved fast (while you query huge records). You might need to query across resources, subscriptions, and tenants. You might also need flexibility to query data using different clients (Azure portal/PowerShell/CLI/any SDK/REST API). Additionally, you might need flexibility in output format (table vs Array) as well.

Azure Resource Graph (ARG) allows you to perform these operations and query at scale. Azure Backup uses ARG as an optimized way to fetch required data with minimal queries (one query for one scenario). For example, a single query can fetch all failed jobs across all vaults in all subscriptions and in all tenants. Also, the queries are Azure role-based access control compliant.

See the [sample ARG queries](query-backups-using-azure-resource-graph.md#sample-queries).

### Automate responses/actions

The automation of responses for transient Backup job failures helps you ensure that you have the right number of reliable backups to restore from. This process also helps to avoid unintentional breaches in your [Recovery Point Objective (RPO)](azure-backup-glossary.md#recovery-point-objective-rpo).

You can set up a workflow to retry Backup jobs using a combination of Azure Automation Runbooks, PowerShell, and ARG. This workflow helps in scenarios where Backup jobs fail due to transient error or planned/unplanned outage.

For more information on how to set up this runbook, see [Automatic retry of failed Backup jobs](/azure/architecture/framework/resiliency/auto-retry).

The following video provides an end-to-end walk-through of the scenario: <br><br>

   > [!VIDEO https://learn.microsoft.com/shows/IT-Ops-Talk/Automatically-retry-failed-backup-jobs-using-Azure-Resource-Graph-and-Azure-Automation-Runbooks/player]

## Related content

- [Support matrix for automation in Azure Backup](backup-support-automation.md).
- [Azure Quickstart Templates](https://github.com/Azure/azure-quickstart-templates).
- [Terraform Samples](https://github.com/hashicorp/terraform-provider-azurerm/tree/main/examples).
- [Ansible Samples](https://docs.ansible.com/ansible/latest/collections/azure/azcollection/azure_rm_backupazurevm_module.html#examples).
