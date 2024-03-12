---
title: Analyze changes to your Azure resources (Preview)
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
ms.date: 03/11/2024
ms.topic: conceptual
---

# Analyze changes to your Azure resources (Preview)

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them. 

Change Analysis helps you:

- Find when a resource changed due to a [control plane operation](../../../azure-resource-manager/management/control-plane-and-data-plane.md) sent to the Azure Resource Manager URL.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.
 
> [!IMPORTANT]
> Change Analysis is in the process of migrating from [an Azure Monitor service](../../../azure-monitor/change/change-analysis.md) to an Azure Resource Graph service. 

## Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis

Currently in the Azure portal, you'll notice two entries for Change Analysis. 

[Need: screenshot]

1. **Azure Monitor Change Analysis (GA)**

    The [Change Analysis (GA) service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. 
    
    While this service has successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has insurmountable limitations that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds.

1. **Azure Resource Graph Change Analysis (Preview)**

    The Change Analysis (preview) service presented by Resource Graph sets a new direction for all Change Analysis user experiences, directly querying Azure Resource Graph for all resource change data. This experience of Change Analysis provides:
    
    - An onboarding-free experience, giving all subscriptions and resources access to change history
    - Tenant-wide querying, rather than select subscriptions
    - Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
    - More extensive filtering capabilities
    - The ability to export change data to Log Analytics
    - Improved accuracy and relevance of "changed by" change information 

### Proxy vs. tracked resource change data

One of the significant updates to Change Analysis during this migration is the resource change data collected by the service. In Azure Monitor, Change Analysis collects snapshots of "proxy" resources, while Azure Resource Graph Change Analysis collects snapshots of all "tracked" resources.

#### Proxy resource change data 

[The Azure Monitor Change Analysis](../../../azure-monitor/change/change-analysis.md) stores data collected as snapshots about proxy resources. Proxy resources include resources that Azure Resource Graph doesn’t know about, prompting Azure Resource Manager to proxy those calls to the appropriate resource provider when requested. Azure Monitor Change Analysis makes the appropriate `GET https://management.azure.com/{some_proxy_resource_id}` HTTP request and saves the JSON response payload for calculation of changes over time. 

Proxy resource changes require opt-in, extra effor by resource providers, resulting in:
- A different table to query
- No guaranteed SLA
- A limited availability of proxy resource change data

#### Tracked resource change data

Meanwhile, Azure Resource Graph Change Analysis works with their complex and highly scalable set of systems to provide quick and automatic tracked resource changes for many Azure resources. You can use queries provided by Resource Graph to retrieve and review resource change data over time. 

Azure Resource Graph Change Analysis provides change information on tracked resources, which are tracked by Resource Graph via notifications sent from the resource providers (virtual machines, web applications, storage accounts, etc.) to Azure Resource Graph's systems. 
Azure Resource Graph collects snapshots of all tracked resources, compiled in a JSON payload when you make a `GET https://management.azure.com/{some_resource_id}` HTTP request.

## Supported services

[Need: Same as AzMon?]

## Cost

You can use Azure Resource Graph Change Analysis at no extra cost. 

## Limitations

With the transition from Azure Monitor to Azure Resource Graph comes a handful of limitations.

- Some proxy resource change data is no longer provided. 
- No annotations on change data, including:
  - Importance levels (noisy, normal, important)
  - Description of a changed property as per the Azure REST API specs
  - Removal of translating the object ID of who/what changed a property to the object's display name in AAD.
- No `Microsoft.Web/sites`-specific data, such as:
  - Configuration changes
  - App Settings changes
  - Environment variables changes
  - File changes
- Programmatic callers need to use the `Microsoft.ResourceGraph/resources` API, instead of the `Microsoft.ChangeAnalysis/*` APIs 

## To be announced

The Change Analysis team anticipates the following items as they work on the migration during preview.

- Deprecation for the `Microsoft.ChangeAnalysis` resource provider
- Documentation for programmatic replacement of calling `Microsoft.ChangeAnalysis` APIs and how to query across the various tables within the `Microsoft.ResourceGraph/resources` API for tracked and proxy resources.

## Next steps

> [!div class="nextstepaction"]
> [Change Analysis best practices](./changes-resource-spec.md)
