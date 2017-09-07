# Overview
## [Monitoring tools across Azure](monitoring-overview.md)
## [Azure Monitor](monitoring-overview-azure-monitor.md)
# Quickstarts

# Tutorials

# Samples
## [PowerShell samples](insights-powershell-samples.md)
## [Azure CLI 1.0 samples](insights-cli-samples.md)
## [Code samples](https://azure.microsoft.com/en-us/resources/samples/?service=monitor)

# Concepts
## [Sources of monitoring data](monitoring-data-sources.md)
## [Metrics](monitoring-overview-metrics.md)
## [Alerts](monitoring-overview-alerts.md)
## [Autoscale](monitoring-overview-autoscale.md)
## [Activity log](monitoring-overview-activity-logs.md)
## [Action groups](monitoring-action-groups.md)
## [Diagnostic logs](monitoring-overview-of-diagnostic-logs.md)
## [Roles permissions and security](monitoring-roles-permissions-security.md)
## [Azure Diagnostics Eextension](azure-diagnostics.md)
## [Partner integrations](monitoring-partners.md)


# How-to guides
## Get Started
### [Walkthrough of Azure Monitor](monitoring-get-started.md)
### [Walkthrough of autoscale](monitoring-autoscale-get-started.md)
## [Videos](https://azure.microsoft.com/resources/videos/index/?services=monitor) 
## Use alerts
### [Configure alerts in Azure portal](insights-alerts-portal.md)
### [Configure alerts with CLI](insights-alerts-command-line-interface.md)
### [Configure alerts with PowerShell](insights-alerts-powershell.md)
### [Have a metric alert call a webhook](insights-webhooks-alerts.md)
### [Create a metric alert with a Resource Manager template](monitoring-enable-alerts-using-template.md)
## Use autoscale
### [Best Practices](insights-autoscale-best-practices.md)
### [Common metrics](insights-autoscale-common-metrics.md)
### [Common patterns](monitoring-autoscale-common-scale-patterns.md)
### [Autoscale using a custom metric](monitoring-autoscale-scale-by-custom-metric.md)
### [Autoscale VM Scale sets using Resource Manager templates](insights-advanced-autoscale-virtual-machine-scale-sets.md)
### [Automatically scale machines in a VM Scale set](../virtual-machine-scale-sets/virtual-machine-scale-sets-windows-autoscale.md?toc=%2fazure%2fmonitoring-and-diagnostics%2ftoc.json)
### [Configure webhooks and email notifications on autoscale](insights-autoscale-to-webhook-email.md)
## Use the activity log
### [View events in activity log](../azure-resource-manager/resource-group-audit.md?toc=%2fazure%2fmonitoring-and-diagnostics%2ftoc.json)
### [Configure alerts on an activity log event](monitoring-activity-log-alerts.md)
### [Archive activity log](monitoring-archive-activity-log.md)
### [Stream activity log to Event Hubs](monitoring-stream-activity-logs-event-hubs.md)
### [Audit operations with Resource Manager](../azure-resource-manager/resource-group-audit.md?toc=%2fazure%2fmonitoring-and-diagnostics%2ftoc.json)
### [Create activity log alerts with Resource Manager](monitoring-create-activity-log-alerts-with-resource-manager-template.md)
### [Migrate to Activity Log alerts](monitoring-migrate-management-alerts.md)
## Use service notifications
### [View service notifications](monitoring-service-notifications.md)
### [Configure alerts on service notifications](monitoring-activity-log-alerts-on-service-notifications.md)
## Use action groups
### [Learn about webhook schema](monitoring-activity-log-alerts-webhook.md)
### [SMS Alert behavior](monitoring-sms-alert-behavior.md)
### [Alert Rate limiting](monitoring-alerts-rate-limiting.md)
### [Create action groups with Resource Manager](monitoring-create-action-group-with-resource-manager-template.md)
## Use diagnostic logs
### [Archive](monitoring-archive-diagnostic-logs.md)
### [Stream to Event Hubs](monitoring-stream-diagnostic-logs-to-event-hubs.md)
### [Enable Diagnostic settings using Resource Manager templates](monitoring-enable-diagnostic-logs-using-template.md)
## Use the REST API
### [Walkthrough using REST API](monitoring-rest-api-walkthrough.md)
## Use Azure Diagnostics extension
### [Send to Application Insights](azure-diagnostics-configure-application-insights.md)
### [Send to Event Hubs](azure-diagnostics-streaming-event-hubs.md)
### [Troubleshooting](azure-diagnostics-troubleshooting.md)

# Reference
## [Metrics supported](monitoring-supported-metrics.md)
## [Activity log event schema](monitoring-activity-log-schema.md)
## [PowerShell](/powershell/module/azurerm.insights)
## [.NET](https://msdn.microsoft.com/library/azure/dn802153)
## [REST](/rest/api/monitor/)

## [Diagnostic logs services, categories, and schemas](monitoring-diagnostic-logs-schema.md)


# Resources
## [Azure Roadmap](https://azure.microsoft.com/roadmap/?category=monitoring-management)
## [Pricing calculator](https://azure.microsoft.com/pricing/calculator/)
## [Quickstart templates](https://azure.microsoft.com/en-us/resources/templates/?resourceType=Microsoft.Insights)



•	How-to guides – there’s some major inconsistency in terms of capitalization here. I think unless it’s a proper service name it should be lower case (eg “Use service notifications” “Use action groups” “Send to Application Insights”)
•	I’d reorder the reference material like this:
o	Metrics supported
o	Activity Log schema
o	Diagnostic logs services/schema
o	Diagnostic extension schema
o	PowerShell
o	REST
o	.NET




