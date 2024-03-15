---
title: Analyze changes to your Azure resources (Preview)
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/15/2024
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

### Proxy vs. tracked resources

In Azure Resource Graph, change data can be collected on either proxy or tracked resources. 

#### Proxy resource change data 

With proxy resources, Azure Resource Manager proxies calls to the appropriate resource provider when requested. The appropriate `GET https://management.azure.com/{some_proxy_resource_id}` HTTP request is saved in a JSON response payload for calculation of changes over time. Azure Resource Manager might not keep track of the resource's state. 

Proxy resource changes require opt-in, extra effort by resource providers, resulting in:
- A different table to query
- No guaranteed SLA
- A limited availability of proxy resource change data

Currently, collecting change data for proxy resources is an opt-in feature. Resource providers must send a special notification to Azure Resource Graph to indicate when a proxy resource is created, updated, or deleted.

#### Tracked resource change data

For tracked resources, Resource Graph works with their complex and highly scalable set of systems to provide quick and automatically tracked resource changes for many Azure resources. You can use queries provided by Resource Graph to retrieve and review resource change data over time. 

Change Analysis notifies Azure Resource Graph when a tracked resource is created, updated, or deleted. Instead of notifying via the `Microsoft.ChangeAnalysis` resource provider, Change Analysis UX sends queries directly to Azure Resource Graph. Azure Resource Graph collects and stores snapshots of all tracked resources, compiled in a JSON payload when a `GET https://management.azure.com/{some_resource_id}` HTTP request is made.

## Cost

You can use Azure Resource Graph Change Analysis at no extra cost. 

## Limitations

Azure Resource Graph Change Analysis currently presents some known limitations.

- Some proxy resource change data is no longer provided 
- No annotations on change data, including:
  - Importance levels (noisy, normal, important)
  - Description of a changed property as per the Azure REST API specs
  - Removal of translating the object ID of who/what changed a property to the object's display name in Microsoft Entra
- No `Microsoft.Web/sites`-specific data, such as:
  - Configuration changes
  - App Settings changes
  - Environment variables changes
  - File changes
- Programmatic callers need to use the `Microsoft.ResourceGraph/resources` API, instead of the `Microsoft.ChangeAnalysis/*` APIs 

## Next steps

> [!div class="nextstepaction"]
> [Change Analysis best practices](./changes-resource-spec.md)
