---
title: Analyze changes to your Azure resources (Preview)
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
ms.date: 03/11/2024
ms.topic: conceptual
---

# Analyze changes to your Azure resources (Preview)

[!INCLUDE [preview](../../includes/resource-graph/preview/change-analysis.md)]

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them. 

Change Analysis helps you:

- Find when a resource changed due to a [control plane operation](../../../azure-resource-manager/management/control-plane-and-data-plane.md) sent to the Azure Resource Manager URL.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.
 
## Change Analysis architecture

[Need: More technical background/context about Change Analysis in ARG]

### Proxy vs. tracked resources

Change data can be collected on either proxy or tracked resources. 

#### Proxy resource change data 

Proxy resources prompts Azure Resource Manager to proxy calls to the appropriate resource provider when requested. The appropriate `GET https://management.azure.com/{some_proxy_resource_id}` HTTP request is saved in a JSON response payload for calculation of changes over time. Proxy resource changes require opt-in, extra effort by resource providers, resulting in:
- A different table to query
- No guaranteed SLA
- A limited availability of proxy resource change data

#### Tracked resource change data

Meanwhile, Azure Resource Graph Change Analysis works with their complex and highly scalable set of systems to provide quick and automatic tracked resource changes for many Azure resources. You can use queries provided by Resource Graph to retrieve and review resource change data over time. 

Azure Resource Graph Change Analysis provides change information on tracked resources, which are tracked by Resource Graph via notifications sent from the resource providers (virtual machines, web applications, storage accounts, etc.) to Azure Resource Graph's systems. Azure Resource Graph collects snapshots of all tracked resources, compiled in a JSON payload when you make a `GET https://management.azure.com/{some_resource_id}` HTTP request.

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
