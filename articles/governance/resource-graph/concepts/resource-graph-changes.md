---
title: Analyze changes to your Azure resources (Preview)
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
ms.date: 03/11/2024
ms.topic: conceptual
---

# Analyze changes to your Azure resources (Preview)

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them. 

Change Analysis helps you:

- Find when changes were detected on an Azure Resource Manager property.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.

## Change Analysis architecture

[Need: Some tech here. See current Change Analysis overview section for inspiration.]

## Azure Monitor Change Analysis vs. Azure Resource Graph Change Analysis

Currently in the Azure portal, you'll notice two entries for Change Analysis. 

[Need: screenshot]

While this could be confusing, Change Analysis is migrating from an Azure Monitor service to an Azure Resource Graph service. You can expect the following differences:

### 1. Azure Monitor Change Analysis (GA)

Currently, the [Change Analysis (GA) service presented by Azure Monitor](../../../azure-monitor/change/change-analysis.md) requires you to query a resource provider, called `Microsoft.ChangeAnalysis`, which provides a simple API that abstracts resource change data from the Azure Resource Graph. 

While this service has successfully helped thousands of Azure customers, the `Microsoft.ChangeAnalysis` resource provider has insurmountable limitations that prevent it from servicing the needs and scale of all Azure customers across all public and sovereign clouds.

### 2. Azure Resource Graph Change Analysis (Preview)

The Change Analysis (preview) service presented by Resource Graph sets a new direction for all Change Analysis user experiences and queries, directly querying Azure Resource Graph for all resource change data. This experience of Change Analysis provides:

- An onboarding-free experience, giving all subscriptions and resources access to change history
- Tenant-wide querying, rather than select subscriptions
- Change history summaries aggregated into cards at the top of the new Resource Graph Change Analysis blade
- More extensive filtering capabilities
- The ability to export change data to Log Analytics
- Improved accuracy and relevance of "changed by" change information 

## Supported services

[Need: Same as AzMon?]

## Cost

[Need: Relevant?]

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

- Deprecation for the `Microsoft.ChangeAnalysis` resource provider
- Documentation for programmatic replacement of calling `Microsoft.ChangeAnalysis` APIs and how to query across the various tables within the `Microsoft.ResourceGraph/resources` API for tracked and proxy resources.


## Next steps

> [!div class="nextstepaction"]
> [Change Analysis best practices](./changes-resource-spec.md)
