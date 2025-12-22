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
- **Metrics collection** - Automatically send all Azure resource metrics to Datadog. For more information, see [Monitor & Observe Azure resources with Azure Native Integrations](../metrics-logs.md).
- **Datadog agent deployment** - Provides a unified management experience of Datadog agents. Install and uninstall Datadog agents as extensions on Virtual Machines and Azure App Services.

## Subscribe to Datadog

[!INCLUDE [subscribe](../includes/subscribe.md)] *Datadog*.

[!INCLUDE [subscribe](../includes/subscribe-from-azure-portal.md)]

## Datadog links

For more help using the Datadog, see the following links to the [Datadog website](https://www.datadoghq.com/):

- [Azure solution guide](https://www.datadoghq.com/solutions/azure/)
- [Blog announcing the Datadog <> Azure Partnership](https://www.datadoghq.com/blog/azure-datadog-partnership/)
- [Datadog Pricing Page](https://www.datadoghq.com/pricing/)

## Next step

> [!div class="nextstepaction"]
> [QuickStart: Get started with Datadog](create.md)