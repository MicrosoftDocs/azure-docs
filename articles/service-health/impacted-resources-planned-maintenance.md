---
title: Resource impact from Azure planned maintenance events
description: This article details where to find information from Azure Service Health about how Azure Planned Maintenance impact your resources.
ms.topic: conceptual
ms.date: 9/29/2023
---

# Resource impact from Azure planned maintenance

In support of the experience for viewing Impacted Resources, Service Health has enabled a new feature to:

- Display resources that are impacted by a planned maintenance event.
- Provide impacted resources information for planned maintenance via the Service Health Portal. 

This article details what is communicated to users and where they can view information about their impacted resources.

>[!Note]
>This feature will be rolled out in phases. Initially, impacted resources will only be shown for **SQL resources with advance customer notifications and rebootful updates for compute resources.** Planned maintenance impacted resources coverage will be expanded to other resource types and scenarios in the future.

## Viewing Impacted Resources for Planned Maintenance Events on the Service Health Portal 

In the Azure portal, the **Impacted Resources** tab under **Service Health** > **Planned Maintenance** displays resources that are affected by a planned maintenance event. The following example of the Impacted Resources tab shows a planned maintenance event with impacted resources.

:::image type="content" source="./media/impacted-resource-maintenance/grid-image.PNG" alt-text="Screenshot of planned maintenance impacted resources in Azure Service Health.":::

Service Health provides the information below   on resources impacted by a planned maintenance event:

|Fields  |Description |
|---------|---------|
|**Resource Name**|Name of the resource impacted by the planned maintenance event|
|**Resource Type**|Type of resource impacted by the planned maintenance event|
|**Resource Group**|Resource group which contains the impacted resource|
|**Region**|Region which contains the impacted resource|
|**Subscription ID**|Unique ID for the subscription that contains the impacted resource|
|**Action(*)**|Link to the apply update page during Self-Service window (only for rebootful updates on compute resources)|
|**Self-serve Maintenance Due Date(*)**|Due date for Self-Service window during which the update can be applied by the user (only for rebootful updates on compute resources)|

>[!Note]
>Fields with an asterisk * are optional fields that are available depending on the resource type.



## Filters

Customers can filter on the results using the below filters
- Region
- Subscription ID: All Subscription IDs the user has access to 
- Resource Type: All Resource types under the users subscriptions

:::image type="content" source="./media/impacted-resource-maintenance/details-filters.PNG" alt-text="Screenshot of filters used to sort impacted resources.":::

## Export to CSV

The list of impacted resources can be exported to an excel file by clicking on this option.

:::image type="content" source="./media/impacted-resource-maintenance/details-csv.PNG" alt-text="Screenshot of export to csv button.":::

## Next steps
- [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
