---
title: Find and delete lab resources
description: Learn about finding and deleting Azure Lab Services lab resources.
ms.topic: how-to
ms.date: 12/05/2024

# customer intent: As an Azure Lab Services customer, I want to understand how to find and delete lab resources, as well as determine which version of Azure Lab Services is deployed whether lab accounts (older version) or lab plans (newer version).
---

# Find and delete lab resources

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

There are two versions of Azure Lab Services. Labs created from lab accounts use the older version, while labs created from lab plans use the newer version. This guide explains how to review lab resources, determine lab version, and delete unused resources.

## Review labs
A lab inventory can be found in the Azure portal under [Labs - Microsoft Azure](https://ms.portal.azure.com/#browse/Microsoft.LabServices%2Flabs). 
* Browse and manage deployed lab resources
* Review each lab's region, OS, and number of lab VMs in use 

Additional lab configurations or queries across multiple subscriptions can be surfaced with [Azure Resource Graph Explorer](/azure/governance/resource-graph/overview). These attributes help optimize resources, plan for service retirement, and transition to a preferred lab solution.

* **Name** - Identifies lab name
* **Location** - Indicates the deployed region, which can affect compliance requirements and latency
* **State** - Shows the lab template status e.g. published, helping to track lab development stage
* **labPlanId** - Determine the lab version, with an empty value indicating a lab account-based lab
* **osType** - Specifies the operating system (Windows or Linux), important for software compatibility and licensing
* **Capacity** - Indicates the number of lab VMs, useful for resource allocation and scaling decisions
* **SKU** - Shows the compute option associated with the lab VM size, impacting performance and cost
* **Image** - Identifies whether an Azure Compute Gallery (ID) or Azure Marketplace (publisher) image was used, which affects image updates and opportunity for reuse  
* **Network** - Surfaces a custom network configuration for labs with advanced networking
* **createdAt** - Provides the resource creation timestamp, useful for tracking the age and lifecycle of the lab
* **lastModifiedAt** - Shows the most recent modification timestamp, helping to determine recent activity
* **lastModifiedBy** - Indicates the user or application that most recently modified the resource, important for auditing and accountability

In the Azure portal at [Labs - Microsoft Azure](https://ms.portal.azure.com/#browse/Microsoft.LabServices%2Flabs), select 'Open query' and replace existing query with:

```kusto
resources
| where type == 'microsoft.labservices/labs' or type== 'microsoft.labservices/labaccounts/labs' and isnotempty(systemData)
| extend sku = properties.virtualMachineProfile.sku.name
| extend image = tostring(properties.virtualMachineProfile.imageReference)
| extend network = tostring(properties.networkProfile)
| extend state = tostring(properties.state)
| extend labPlanId = tostring(properties.labPlanId)
| extend osType = tostring(properties.virtualMachineProfile.osType)
| extend capacity1 = properties.virtualMachineProfile.sku.capacity
| extend capacity = case(isnull(capacity1), "0 machines", capacity1 == 1, "1 machine", strcat(tostring(capacity1), " machines"))
| extend lastModifiedAt = tostring(systemData.lastModifiedAt)
| extend lastModifiedBy = tostring(systemData.lastModifiedBy)
| extend createdAt = tostring(systemData.createdAt)
| project id, subscriptionId, resourceGroup, location, state, labPlanId, osType, capacity, sku, image, network, createdAt, lastModifiedAt, lastModifiedBy, tags

```


## Find lab version
There are two versions of Azure Lab Services. Lab accounts are the older version, while lab plans are the newer version with enhanced feature. Use lab plans for improved student experience and supportability. [Review all labs together](find-delete-lab-resources.md#review-labs) or follow these steps to identify which lab version is currently deployed.

* [Find lab accounts](how-to-manage-lab-accounts.md#view-lab-accounts): In the [Azure portal](https://portal.azure.com/) search box, enter lab account, and then select Lab accounts.  Labs created from lab accounts use the older version. 

* [Find lab plans](how-to-manage-lab-plans.md#view-lab-plans): In the [Azure portal](https://portal.azure.com/) search box, enter lab plan, and then select Lab plans.  Labs created from lab plans use the newer version. 

## Delete unused lab resources
Regularly review and delete unused lab resources to free up cores, reduce the security surface area, prevent incurring cost from unexpected access, and formally offboard. 

* [Delete a lab account](how-to-manage-lab-accounts.md#delete-a-lab-account)  
* [Delete a lab created from a lab account](manage-labs-1.md#delete-a-lab-in-a-lab-account)
* [Delete a lab plan](how-to-manage-lab-plans.md#delete-a-lab-plan)
* [Delete a lab created from a lab plan](manage-labs.md#delete-a-lab)  
