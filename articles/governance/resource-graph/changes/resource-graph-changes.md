---
title: Analyze changes to your Azure resources
description: Learn to use the Resource Graph Change Analysis tool to explore and analyze changes in your resources.
author: iancarter-msft
ms.author: iancarter
ms.date: 03/19/2024
ms.topic: conceptual
---

# Analyze changes to your Azure resources

Resources change through the course of daily use, reconfiguration, and even redeployment. While most change is by design, sometimes it can break your application. With the power of Azure Resource Graph, Change Analysis goes beyond standard monitoring solutions, alerting you to live site issues, outages, or component failures and explaining the causes behind them. 

Change Analysis helps you:

- Find when a resource changed due to a [control plane operation](../../../azure-resource-manager/management/control-plane-and-data-plane.md) sent to the Azure Resource Manager URL.
- View property change details.
- Query changes at scale across your subscriptions, management group, or tenant.
 
## Change Analysis architecture

Change Analysis experiences across the Azure portal are powered using the Azure Resource Graph [`Microsoft.ResourceGraph/resources` API](/rest/api/azureresourcegraph/resourcegraph/resources/resources). This section describes what data to expect in Change Analysis experiences.

### Changes in the `resourceChanges` table

Change data is available in the `resourceChanges` table of the `Microsoft.ResourceGraph/resources` API for many of the Azure resources you interact with, including App Services (`Microsoft.Web/sites`) or Virtual Machines (`Microsoft.Compute/virtualMachines`). You can find these resources via:
- The Azure portal's search bar 
- The Azure portal's **All resources** blade. 

Resource providers configure which resource types Azure Resource Graph pulls data from as they are created, updated, and deleted via the Azure Resource Manager control plane. For many resources, the process looks like the following:

1. Azure Resource Graph saves the latest state of a resource in the `resources` table of the `Microsoft.ResourceGraph/resources` API.
1. If a resource is in the `resources` table, Azure Resource Graph calculates the difference between the previous state and latest state. That difference is saved as a `Microsoft.Resources/changes` object in the `resourceChanges` table of the `Microsoft.ResourceGraph/resources` API.
1. Change data is created shortly after resource operations are finished.

[See all known limitations for changes saved in the `resourceChanges` table.](#limitations)

### Changes in other tables

While many resource providers allow Azure Resource Graph to pull the state of some resources, they also may disallow Azure Resource Graph from pulling the state of other resources. For these "disallowed" resource types, no data exists in Change Analysis or the `resourceContainerChanges` and `resourceChanges` tables of the `Microsoft.ResourceGraph/resources` API. 

Currently, some of these changes are stored in the `healthResourceChanges` table.   
[Need: more on this?]

Each resource provider must update their services to push data to Azure Resource Graph when these resources types are created, updated, or deleted via the Azure Resource Manager control plane. For these resource types, you can expect [certain known limitations for changes saved in the `resourceChanges` table.](#limitations)

> [!NOTE]
> **Send feedback for more data**  
>  
> Visit [the Change Analysis (Preview) experience](./view-resource-changes.md) on the Azure portal and submit feedback for data you'd like to see in Change Analysis and the `Microsoft.ResourceGraph/resources` API.

## Cost

You can use Azure Resource Graph Change Analysis at no extra cost. 

## Limitations

Azure Resource Graph Change Analysis currently presents some known limitations.

- **No annotations on change data,** including:
  - Importance levels (noisy, normal, important)
  - Description of a changed property as per the Azure REST API specs
  - Removal of translating the object ID of who/what changed a property to the object's display name in Microsoft Entra
- **No `Microsoft.Web/sites`-specific data,** such as:
  - Configuration changes
  - App Settings changes
  - Environment variables changes
  - File changes
- **Programmatic callers:** Programmatic callers need to use the `Microsoft.ResourceGraph/resources` API, instead of the `Microsoft.ChangeAnalysis/*` APIs 
- **How change data is collected:**
  - `resourceChanges` table:
    - Changes made to a resource's data plane API, such as writing data to a table in a storage account, are not observed by Azure Resource Graph.
    - Resource change data for child resource types are [in a separate table](#changes-in-other-tables). 
  - Changes collected in tables other than `resourceChanges`:
    - Data for these resource types may be delayed.
    - Data for these resource types may be lost and irrecoverable.

## Next steps

> [!div class="nextstepaction"]
> [Get resource changes](../how-to/get-resource-changes.md)