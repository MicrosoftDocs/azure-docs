---
title: Enable Azure Automation Start/Stop VMs during off-hours
description: This article tells how to enable the Start/Stop VMs during off-hours feature for your Azure VMs.
services: automation
ms.subservice: process-automation
ms.date: 11/29/2022
ms.topic: conceptual
ms.custom: engagement-fy23
---

# Enable Start/Stop VMs during off-hours

> [!NOTE]
>- Start/Stop VM during off-hours, version 1 is going to retire soon by CY23 and is unavailable in the marketplace now. We recommend that you start using [version 2](/articles/azure-functions/start-stop-vms/overview.md), which is now generally available. The new version offers all existing capabilities and provides new features, such as multi-subscription support from a single Start/Stop instance. If you have the version 1 solution already deployed, you can still use the feature, and we will provide support until retirement in CY23. The details on announcement will be shared soon.
>- It is no longer possible to deploy the Start/Stop solution v1.

For more information on version 2, see [Deploy Start/Stop VMs v2 to an Azure subscription](../azure-functions/start-stop-vms/deploy.md)


## Create alerts

Start/Stop VMs during off-hours doesn't include a predefined set of Automation job alerts. Review [Forward job data to Azure Monitor Logs](automation-manage-send-joblogs-log-analytics.md#azure-monitor-log-records) to learn about log data forwarded from the Automation account related to the runbook job results and how to create job failed alerts to support your DevOps or operational processes and procedures.

## Next steps

* To set up the feature, see [Configure Stop/Start VMs during off-hours](automation-solution-vm-management-config.md).
* To resolve feature errors, see [Troubleshoot Start/Stop VMs during off-hours issues](troubleshoot/start-stop-vm.md).