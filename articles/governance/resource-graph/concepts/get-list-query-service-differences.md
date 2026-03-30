---
title: Differences between ARG GET/LIST API and ARG Query service
description: How is Azure Resource Graph (ARG) GET/LIST API is different than Azure Resource Graph Query service 
ms.date: 12/2/2025
ms.topic: reference
ms.custom: devx-track-csharp
---

# Differences between Azure Resource Graph (ARG) GET/LIST API and ARG Query service

Azure Resource Graph (ARG) provides a unified, aggregated data store that consolidates resource information from all Resource Providers. This lets you query and retrieve resource details efficiently, with lower latency and substantially higher throttling quotas compared to traditional Azure Resource Manager APIs. ARG is powerful when you need to understand the state of resources at scale—across multiple subscriptions, resource groups, or large environments. 

The ARG GET/LIST API extends this value even further. As a new capability within the ARG ecosystem, it delivers even higher throttling quotas specifically for point GET and LIST calls, making it ideal for services that frequently perform targeted resource lookups. 

Below is a comparison table outlining how ARG Query and ARG GET/LIST API differ, and how each caters to specific scenarios—helping you decide which solution best fits your workload:

| | ARG Query API | ARG GET/LIST API |
|----|-----|-----|
|**Solution description** | Use Azure Resource Graph query API for querying resources and Azure inventory. ARG query supports many resource types that are part of a table in Resource Graph. See the full list of [resource types tables](/azure/governance/resource-graph/reference/supported-tables-resources). |Use Azure Resource Graph GET/LIST API for querying resources and Azure inventory. The ARG GET/LIST API is currently supported only for resources in the [resources](/azure/governance/resource-graph/reference/supported-tables-resources#resources) and [computeresources](/azure/governance/resource-graph/reference/supported-tables-resources#computeresources) tables. |
| **Supported clients** | Querying experience is available through [ARG Explorer in the Azure portal](/azure/governance/resource-graph/first-query-portal), Azure PowerShell, AzureCLI, SDKs, REST API etc. | The current experience is available through supported Azure REST APIs and certain SDKs. |
| **API** | POST /resources: [Run Azure Resource Graph query using REST API - Azure Resource Graph Microsoft Learn](/azure/governance/resource-graph/first-query-rest-api?tabs=powershell#review-the-rest-api-syntax) | ARG GET/LIST API uses the existing control plane GET APIs appending the flag `useResourceGraph=true` to the APIs that seamlessly routes the call to the ARG GET/LIST backend. |
| **Ideal for scenarios** | ARG Query API is a tenant level API that is meant for bulk lookups where you have a requirement to join across multiple tenants, subscriptions, resource group, MG etc., for complex analytical scenarios. Example: “Show me all resources across subscriptions”  | ARG GET/LIST API serves as a Lookup source for the entire Azure GET & LIST API path against a single subscription or resource group meant for high concurrency, high throughput and low complexity kind of scenarios. Example: “List all VMs under a specific subscription”  | 
| **Throttling quota** | Generally lower than ARG GE/LIST API. A user can send at most 15 queries within every 5-second window 1. However this is a soft limit and is subject to change based on users calling pattern.  | Aligns with the Azure Resource Manager limits, currently set upto 4k per minute, user, and subscription. It’s a soft limit and can be raised based on scenario.  |
| **Consistency level** | Bounded Staleness consistency level, which means data is indexed in ARG with a certain latency. | Bounded Staleness consistency level, which means data is indexed in ARG with a certain latency.|
|**Product lifecycle stage** | Generally available | Generally available |
| **Pricing**| Free | Free |