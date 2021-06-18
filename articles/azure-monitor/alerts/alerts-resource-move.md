---
title: How to update alert rules or action rules when their target resource moves to a different Azure region
description: Background and instructions for how to update alert rules or action rules when their target resource moves to a different Azure region. 
author: harelbr
ms.author: harelbr
ms.topic: how-to
ms.custom: subject-moving-resources
ms.date: 02/14/2021
---
# How to update alert rules or action rules when their target resource moves to a different Azure region

This article describes why existing [alert rules](./alerts-overview.md) and [action rules](./alerts-action-rules.md) may be impacted when you move other Azure resources between regions, and how to identify and resolve those issues. Check the main [resource move documentation](../../azure-resource-manager/management/move-resources-overview.md) for additional information on when is resource move between regions useful and a checklist of designing a move process.

## Why the problem exists

Alert rules and action rules reference other Azure resources. Examples include [Azure VMs](../../site-recovery/azure-to-azure-tutorial-migrate.md), [Azure SQL](../../azure-sql/database/move-resources-across-regions.md), and [Azure Storage](../../storage/common/storage-account-move.md). When you move the resources those rules refer to, the rules are likely to stop working correctly because they can't find the resources they reference.

There are two main reasons why your rules might stop working after moving the target resources:

- The scope of your rule is explicitly referring the old resource.
- Your alert rule is based on metrics.

## Rule scope explicitly refers to the old resource

When you move a resource, its resource ID changes in most cases. Behind the scenes, the system replicates the resource into the new region before deleting it from the old region. This process requires that two resources and thus two different resource IDs exist simultaneously for a small period of time. Since resource IDs must be unique, a new ID must be created during the process. 

**How does moving the resource affect existing rules?**

Alert rules and action rules have a scope of resources they apply to. The scope could be an entire subscription, a resource group, or one or more specific resources.
For example, here is a rule with a scope with two resources (two virtual machines):

![Multi resource alert rule](media/alerts-resource-move/multi-resource-alert-rule.png)

If the rule scope explicitly mentions a resource, and that resource has moved and changed its resource ID, then that rule will look for a wrong or non-existent resource and thus fail.

**How to fix the problem?**

Update or recreate the affected rule to point to the new resource. The process to update the scope is found later in this article.

The problem applies to these rule types:

- Activity log alert rules
- Action rules
- Metric alerts – For more information, see the next section [Alert rules based on metrics](#alert-rules-based-on-metrics).

> [!NOTE]
> Log search alert rules and smart detector alert rules are not affected because their scope is either a workspace or Application Insights. Neither of these scopes currently support region moves.

## Alert rules based on metrics

The metrics that Azure resources emit are regional. Whenever a resource moves to a new region, it starts emitting its metrics in that new region. As a result, any alert rules based on metrics need to be updated or recreated so they point to the current metric stream in the correct region.

This explanation applies to both [metric alert rules](alerts-metric-overview.md) and [availability test alert rules](../app/monitor-web-app-availability.md).

If **all** the resources in the scope have moved, you don't need to recreate the rule. You can just update any field of the alert rule, such as the alert rule description, and save it.
If **only some** of the resources in the scope have moved, you need to remove the moved resources from the existing rule and create a new rule that covers only the moved resources.

## Procedures to fix problems

### Identifying rules associated with a moved resource from the Azure portal

- **For alert rules** -
Navigate to Alerts > Manage alert rules > filter by the containing subscription and the moved resource.
> [!NOTE]
> Activity Log alert rules do not support this process. It's not possible to update the scope of an activity log alert rule and have it point to a resource in another subscription. Instead you can create a new rule that will replace the old one.

- **For action rules** - 
Navigate to Alerts > Manage actions > Action rules (preview) > filter by the containing subscription and the moved resource.

### Change scope of a rule from the Azure portal

1. Open the rule that you have identified in the previous step by clicking on it.
2. Under **Resource**, click **Edit** and adjust the scope, as needed.
3. Adjust other properties of the rule as needed.
4. Click **Save**.

![Change alert rule scope](media/alerts-resource-move/change-alert-rule-scope.png)

### Change the scope of a rule using Azure Resource Manager templates

1. Obtain the Azure Resource Manager template of the rule.   To export the template of a rule from the Azure portal:
   1. Navigate to the Resource Groups section in the portal and open the resource group containing the rule.
   2. In the Overview section, check the **Show hidden type** checkbox, and filter by the relevant type of the rule.
   3. Select the relevant rule to view its details.
   4. Under **Settings**, select **Export template**.
2. Modify the template. If needed, split into two rules (relevant for some cases of metric alerts, as noted above).
3. Redeploy the template.

### Change scope of a rule using REST API

1. Get the existing rule ([metric alerts](/rest/api/monitor/metricalerts/get), [activity log alerts](/rest/api/monitor/activitylogalerts/get))
2. Modify the scope ([activity log alerts](/rest/api/monitor/activitylogalerts/update))
3. Redeploy the rule ([metric alerts](/rest/api/monitor/metricalerts/createorupdate), [activity log alerts](/rest/api/monitor/activitylogalerts/createorupdate))

### Change scope of a rule using PowerShell

1. Get the existing rule ([metric alerts](/powershell/module/az.monitor/get-azmetricalertrulev2), [activity log alerts](/powershell/module/az.monitor/get-azactivitylogalert), [action rules](/powershell/module/az.alertsmanagement/get-azactionrule)).
2. Modify the scope. If needed, split into two rules (relevant for some cases of metric alerts, as noted above).
3. Redeploy the rule ([metric alerts](/powershell/module/az.monitor/add-azmetricalertrulev2), [activity log alerts](/powershell/module/az.monitor/enable-azactivitylogalert), [action rules](/powershell/module/az.alertsmanagement/set-azactionrule)).

### Change the scope of a rule using Azure CLI

1.  Get the existing rule ([metric alerts](/cli/azure/monitor/metrics/alert#az_monitor_metrics_alert_show), [activity log alerts](/cli/azure/monitor/activity-log/alert#az_monitor_activity_log-alert_list)).
2.  Update the rule scope directly ([metric alerts](/cli/azure/monitor/metrics/alert#az_monitor_metrics_alert_update), [activity log alerts](/cli/azure/monitor/activity-log/alert/scope))
3.  If needed, split into two rules (relevant for some cases of metric alerts, as noted above).

## Next steps

Learn about fixing other problems with [alert notifications](alerts-troubleshoot.md), [metric alerts](alerts-troubleshoot-metric.md), and [log alerts](alerts-troubleshoot-log.md).