---
title: Datadog overview
description: Discover Datadog, a monitoring and analytics platform for large-scale applications integrated with Azure for streamlined management and enhanced performance.
ms.topic: overview
ms.date: 03/10/2025
ms.custom:
  - ai-gen-docs-bap
  - ai-gen-desc
  - ai-seo-date:12/03/2024
---

# What is Datadog?

[!INCLUDE [what-is](../includes/what-is.md)]

Microsoft and [Datadog](https://www.datadoghq.com/) developed this service and manage it together.

You can find Datadog in the [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Datadog%2Fmonitors) or get it on [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/datadog1591740804488.dd_liftr_v2?tab=Overview).

Datadog is a monitoring and analytics platform for large-scale applications. It encompasses infrastructure monitoring, application performance monitoring, log management, and user-experience monitoring. Datadog aggregates data across your entire stack with 400+ integrations for troubleshooting, alerting, and graphing. You can use it as a single source for troubleshooting, optimizing performance, and cross-team collaboration.

Datadog's offering in Azure Marketplace enables you to manage Datadog in the Azure console as an integrated service. This availability means you can implement Datadog as a monitoring solution for your cloud workloads through a streamlined workflow. The workflow covers everything from procurement to configuration. The onboarding experience simplifies how you start monitoring the health and performance of your applications, whether they're based entirely in Azure or spread across hybrid or multicloud environments.

You create the Datadog resources through a resource provider named `Microsoft.Datadog`. You can create and manage Datadog organization resources through the [Azure portal](https://portal.azure.com/). Datadog owns and runs the software as a service (SaaS) application including the organization and API keys.

## Capabilities

Datadog provides the following capabilities:

- **Integrated onboarding** - Datadog is an integrated service on Azure. You can create a Datadog resource and manage the integration through the Azure portal.
- **Unified billing** - Datadog costs are reported through Azure monthly bill.
- **Single sign-on to Datadog** - You don't need a separate authentication for the Datadog portal.
- **Log forwarder** - Enables automated forwarding of subscription activity and resource logs to Datadog.
- **Metrics collection** - Automatically send all Azure resource metrics to Datadog.
- **Datadog agent deployment** - Provides a unified management experience of Datadog agents. Install and uninstall Datadog agents as extensions on Virtual Machines and Azure App Services.

## Metrics and logs

There are three types of logs that you can send from Azure to Datadog.

- **Subscription level logs** - Provide insight into the operations on your resources at the [control plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). Updates on service health events are also included. Use the activity log to determine the what, who, and when for any write operations (PUT, POST, DELETE). There's a single activity log for each Azure subscription.

- **Azure resource logs** - Provide insight into operations that were taken on an Azure resource at the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a Key Vault is a data plane operation. Or, making a request to a database is also a data plane operation. The content of resource logs varies by the Azure service and resource type.

- **Microsoft Entra logs** - As an IT administrator, you want to monitor your IT environment. The information about your system's health enables you to assess potential issues and decide how to respond.

The Microsoft Entra admin center gives you access to three activity logs:

- [Sign-in](../../active-directory/reports-monitoring/concept-sign-ins.md) – Information about sign-ins and how your resources are used by your users.
- [Audit](../../active-directory/reports-monitoring/concept-audit-logs.md) – Information about changes applied to your tenant like users and group management or updates applied to your tenant's resources.
- [Provisioning](../../active-directory/reports-monitoring/concept-provisioning-logs.md) – Activities performed by the provisioning service, like the creation of a group in ServiceNow or a user imported from Workday.

The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](/azure/azure-monitor/essentials/resource-logs-categories). To filter the set of Azure resources sending logs to Datadog, use Azure resource tags.

You can request your IT Administrator to route Microsoft Entra logs to Datadog. For more information, see [Microsoft Entra activity logs in Azure Monitor](../../active-directory/reports-monitoring/concept-activity-logs-azure-monitor.md).

Azure charges for the logs sent to Datadog. For more information, see the [pricing of platform logs](https://azure.microsoft.com/pricing/details/monitor/) sent to Azure Marketplace partners.

## Subscribe to Datadog

[!INCLUDE [subscribe](../includes/subscribe.md)] *Datadog*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Datadog links

For more help using the Datadog, see the following links to the [Datadog website](https://www.datadoghq.com/):

- [Azure solution guide](https://www.datadoghq.com/solutions/azure/)
- [Blog announcing the Datadog <> Azure Partnership](https://www.datadoghq.com/blog/azure-datadog-partnership/)
- [Datadog Pricing Page](https://www.datadoghq.com/pricing/)

## Next steps

- [QuickStart: Get started with Datadog](create.md)