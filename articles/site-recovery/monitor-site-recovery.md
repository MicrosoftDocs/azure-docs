---
title: Monitor Azure Site Recovery
description: Start here to learn how to monitor Azure Site Recovery.
ms.date: 03/21/2024
ms.custom: horz-monitor
ms.topic: conceptual
ms.author: ankitadutta
author: ankitaduttaMSFT
ms.service: site-recovery
---

# Monitor Azure Site Recovery

[!INCLUDE [horz-monitor-intro](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-intro.md)]

## Built-in monitoring for Azure Site Recovery

An Azure Recovery Services vault supports both Azure Site Recovery and Azure Backup services and features. In the Azure portal, the **Site Recovery** tab of the Recovery Services vault **Overview** page provides a dashboard that shows the following monitoring information:

- Replication health
- Failover health
- Configuration issues
- Recovery plans
- Errors
- Jobs
- Infrastructure view of machines replicating to Azure

For a detailed description of how to monitor Azure Site Recovery in the Azure portal by using the Recovery Services dashboard, see [Monitor in the dashboard](site-recovery-monitor-and-troubleshoot.md#monitor-in-the-dashboard).

Azure Backup Center also provides at-scale monitoring and management capabilities for Azure Site Recovery. For more information, see [About Backup center for Azure Backup and Azure Site Recovery](/azure/backup/backup-center-overview).

### Monitor churn rate

High data change rates (churn) are a common source of replication issues. You can use various tools, including Azure Monitor Logs, to monitor churn patterns on virtual machines. For more information, see [Monitor churn patterns on virtual machines](monitoring-high-churn.md).

[!INCLUDE [horz-monitor-resource-types](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-types.md)]

Azure Site Recovery shares the `Microsoft.RecoveryServices/Vaults` namespace with Azure Backup. For more information, see [Azure Site Recovery monitoring data reference](monitor-site-recovery-reference.md).

[!INCLUDE [horz-monitor-data-storage](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-data-storage.md)]

[!INCLUDE [horz-monitor-platform-metrics](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-platform-metrics.md)]

There are no automatically collected platform metrics for Azure Site Recovery. All the automatically collected metrics for the `Microsoft.RecoveryServices/Vaults` namespace pertain to the Azure Backup service. For information about Azure Backup metrics, see [Monitor the health of your backups using Azure Backup Metrics (preview)](/azure/backup/metrics-overview).

[!INCLUDE [horz-monitor-resource-logs](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-resource-logs.md)]

### Azure Site Recovery resource logs

Using Azure Monitor Logs with Azure Site Recovery is supported for **Azure to Azure** replication and **VMware VM/physical server to Azure** replication.

You can use Azure Monitor Logs to monitor:

- Replication health
- Test failover status
- Site Recovery events
- Recovery point objectives (RPOs) for protected machines
- Disk/data change rates (churn)

For detailed instructions on using diagnostic settings to collect and route Site Recovery logs and events, see [Monitor Site Recovery with Azure Monitor Logs](monitor-log-analytics.md).

To get churn data and upload rate logs for VMware and physical machines, you need to install a Microsoft monitoring agent on the process server. This agent sends the logs of the replicating machines to the workspace.

For instructions, see [Configure Microsoft monitoring agent on the process server to send churn and upload rate logs](monitor-log-analytics.md#configure-microsoft-monitoring-agent-on-the-process-server-to-send-churn-and-upload-rate-logs). For more information about monitoring the process server and the health alerts it generates, see [Monitor the process server](vmware-physical-azure-monitor-process-server.md).

- For more information about the resource logs collected for Site Recovery, see [Common questions about Azure Site Recovery monitoring](monitoring-common-questions.md#azure-monitor-logging).
- For the available resource log categories, associated Log Analytics tables, and logs schemas for Azure Site Recovery, see [Site Recovery monitoring data reference](monitor-site-recovery-reference.md#resource-logs).

[!INCLUDE [horz-monitor-activity-log](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-activity-log.md)]

[!INCLUDE [horz-monitor-analyze-data](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-analyze-data.md)]

[!INCLUDE [horz-monitor-external-tools](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-external-tools.md)]

[!INCLUDE [horz-monitor-kusto-queries](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-kusto-queries.md)]

### Example queries

For example Kusto queries you can use for Site Recovery monitoring, see [Query the logs - examples](monitor-log-analytics.md#query-the-logs---examples).

[!INCLUDE [horz-monitor-alerts](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-alerts.md)]

You can set up alerts for any log entry listed in the [Azure Site Recovery monitoring data reference](monitor-site-recovery-reference.md). For example, you can configure alerts for machine health, test failover status, or Site Recovery job status.

For detailed query examples and scenarios you can use for setting up Site Recovery alerts, see [Set up alerts - examples](monitor-log-analytics.md#set-up-alerts---examples).

### Built-in Azure Monitor alerts for Azure Site Recovery

Azure Site Recovery provides default alerts via Azure Monitor as a preview feature. Once you register this feature, Azure Site Recovery surfaces a default alert via Azure Monitor whenever any of the following critical events occur:

- Enable disaster recovery failure alerts for Azure VM, Hyper-V, and VMware replication.
- Replication health critical alerts for Azure VM, Hyper-V, and VMware replication.
- Azure Site Recovery agent version expiry alerts for Azure VM and Hyper-V replication.
- Azure Site Recovery agent not reachable alerts for Hyper-V replication.
- Failover failure alerts for Azure VM, Hyper-V, and VMware replication.
- Auto certification expiry alerts for Azure VM replication.

For detailed instructions on enabling and configuring these built-in alerts, see [Built-in Azure Monitor alerts for Azure Site Recovery (preview)](site-recovery-monitor-and-troubleshoot.md#built-in-azure-monitor-alerts-for-azure-site-recovery). Also see [Common questions about built-in Azure Monitor alerts for Azure Site Recovery](monitoring-common-questions.md#built-in-azure-monitor-alerts-for-azure-site-recovery).

[!INCLUDE [horz-monitor-advisor-recommendations](~/reusable-content/ce-skilling/azure/includes/azure-monitor/horizontals/horz-monitor-advisor-recommendations.md)]

## Related content

- See [Site Recovery monitoring data reference](monitor-site-recovery-reference.md) for a reference of the metrics, logs, and other important values created for Site Recovery.
- See [Monitoring Azure resources with Azure Monitor](/azure/azure-monitor/essentials/monitor-azure-resource) for general details on monitoring Azure resources.
