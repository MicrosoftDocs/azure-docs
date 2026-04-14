---
title: Azure Native Integrations monitoring overview
description: "Overview of metrics and logs for Azure Native Integrations and key operational considerations."
ms.topic: overview
ms.date: 12/01/2025
ai-usage: ai-assisted

#customer intent: As a cloud operator, I want to understand what telemetry partner integrations collect so that I can plan monitoring and governance.

---

# Monitor & Observe Azure resources with Azure Native Integrations

Monitoring and observability are essential for managing modern cloud environments. Azure integrates with leading partner solutions to provide comprehensive metrics and logs collection. These integrations enable centralized visibility, actionable insights, and streamlined troubleshooting across your Azure resources. 

## Metrics

Quantitative data that reflects the performance and health of your Azure resources.

For metrics, the system automatically creates a system managed identity and assigns it the Monitoring Reader role, which is required for data collection. If you remove this identity or role assignment, metric collection stops.

You can enable your partner resource to collect metrics for all Azure resources within any linked subscriptions. Optionally, you can limit metric collection for Azure Virtual Machines and App Service plans by attaching Azure tags to your resources.

For metrics, the system automatically creates a system managed identity and associates it with the resource on Azure. The setup process provides the Monitoring Reader role to the system managed identity. This role gives the partner service the ability to pull metrics for resources in your subscription from Azure Monitor.

> [!WARNING]
> If you remove the system managed identity or the Monitoring Reader role assignment, the partner can't collect metrics from your Azure resources.

### Tag rules for sending metrics

Virtual machines, Virtual Machine Scale Sets, and App Service plans with include tags send metrics to the partner.

If there's a conflict between inclusion and exclusion rules, exclusion takes priority. You can't limit metric collection for other resource types.

For example, if you configure a tag rule in which only virtual machines, Virtual Machine Scale Sets, and App Service plans tagged with True are included, only resources with this tag send metrics to the partner. All other virtual machines, Virtual Machine Scale Sets, and App Service plans are excluded from metrics collection.

## Logs

Logs provide detailed records of activity and events within your Azure environment. These logs provide valuable insights for monitoring, troubleshooting, and auditing. With Azure Native Integrations, you can collect and forward various types of logs from your Azure resources directly to the partner service based on configurable tag-based rules. For a complete list of supported log categories, see [Supported Resource log categories for Azure Monitor](/azure/azure-monitor/reference/logs-index).

The inclusion and exclusion tags determine which logs for all defined sources are sent to partner resources. By default, you collect logs for all resources.

The tag rules match the tags that are available on Azure resources in your subscription. If you select Include and add tags that match resources for your subscription, they're in scope for monitoring. By default, platform resource logs are enabled.

### Tag rules for sending logs

- Azure resources with include tags send logs.
- Azure resources with exclude tags don't send logs.

If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

### Azure activity logs

Azure activity logs, or subscription-level logs, capture operations performed at the [control plane](/azure/azure-resource-manager/management/control-plane-and-data-plane) of your Azure subscription. These logs provide a comprehensive record of management events, such as resource creation, modification, and deletion, and service health notifications. By analyzing subscription-level logs, you can answer important questions like who made changes, what actions (PUT, POST, DELETE) were taken, and when they occurred. This information is essential for auditing, governance, and understanding overall activity within your Azure environment. It helps you maintain security, track changes, and ensure compliance across your cloud resources. There's a single activity log for each Azure subscription.

### Azure resource logs

Azure resource logs capture detailed operations performed at the [data plane](/azure/azure-resource-manager/management/control-plane-and-data-plane) of individual Azure resources. These logs record interactions that are specific to each resource. For example, reading data from a storage account, querying a database, or accessing secrets in Azure Key Vault. The content and structure of resource logs vary depending on the Azure service and resource type. By collecting and analyzing resource logs, you gain deeper visibility into application behavior and can troubleshoot issues at the resource level and monitor how your services are being used. This level of insight is valuable for performance optimization, security monitoring, and ensuring the reliability of your Azure workloads.

### Microsoft Entra Logs

Microsoft Entra logs provide detailed insights into identity and access management activities within your Azure environment. These logs help you monitor user sign-ins, authentication attempts, and changes to users, groups, or roles. This monitoring enables you to track access patterns, detect suspicious activity, and maintain compliance with security policies.
The Microsoft Entra admin center offers three main types of activity logs:

- [Sign-in logs](/entra/identity/monitoring-health/concept-sign-ins): Track user sign-ins and resource usage.
- [Audit logs](/entra/identity/monitoring-health/concept-audit-logs): Record changes to your tenant, such as user and group management or updates to resources.
- [Provisioning logs](/entra/identity/monitoring-health/concept-provisioning-logs): Capture activities performed by the provisioning service, like creating groups in external systems or importing users.

For instructions on how to send Microsoft Entra ID logs to a partner, see [Integrate Microsoft Entra logs with Azure Monitor logs](/entra/identity/monitoring-health/howto-integrate-activity-logs-with-azure-monitor-logs).


## Enabling and managing integration

Each service provides step-by-step instructions for setup and management:

- [QuickStart: Get started with Datadog](datadog/create.md)
- [Quickstart: Get started with Dynatrace](dynatrace/create.md)
- [QuickStart: Get started with Elastic](elastic/create.md)
- [Quickstart: Get started with New Relic](new-relic/create.md)