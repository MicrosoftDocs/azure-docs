---
title: Impacted resources support for outages
description: This article details what is communicated to users and where they can view information about their impacted resources.
ms.topic: conceptual
ms.date: 12/16/2022
---

# Impacted Resources for Azure Outages

[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/) helps customers view any health events that impact their Subscriptions and Tenants. The Service Issues blade on Service Health shows any ongoing problems in Azure services that are impacting your resources. You can understand when the issue began, and what services and regions are impacted. Previously, the Potential Impact tab on the Service Issues blade was within the details of an incident. It showed any resources under a customer's Subscriptions that may be impacted by an outage, and their resource health signal to help customers evaluate impact.

**In support of the impacted resource experience, Service Health has enabled a new feature to:**

- Replace “Potential Impact” tab with “Impacted Resources” tab on Service Issues.
- Display resources that are confirmed to be impacted by an outage.
- Display resources that are not confirmed to be impacted by an outage but could be impacted because they fall under a service or region that is confirmed to be impacted by an outage.
- Resource Health status of both confirmed and potential impacted resources showing the availability of the resource.

This article details what is communicated to users and where they can view information about their impacted resources.

>[!Note]
>This feature will be enabled to users in phases. Only selected subscription-level customers will start seeing the experience initially and gradually expand to 100% of subscription customers. In future this capability will be live for tenant level customers.

## Impacted Resources for Outages on the Service Health Portal

The impacted resources tab under Azure portal-> Service Health ->Service Issues will display resources that are Confirmed to be impacted by an outage and resources that could Potentially be impacted by an outage. Below is an example of impacted resources tab for an incident on Service Issues with Confirmed and Potential impact resources.

:::image type="content" source="./media/impacted-resource-outage/ir-portal-crop.PNG" alt-text="Screenshot of Azure Service Health impacted resources information.":::

##### Service Health provides the below information to users whose resources are impacted by an outage:

|Column  |Description |
|---------|---------|
|Resource Name|Name of resource|
|Resource Health|Health status of a resource at that point in time|
|Impact Type|Tells customers if their resource is confirmed to be impacted or potentially impacted|
|Resource Type|Type of resource impacted (.ie Virtual Machines)|
|Resource Group|Resource group which contains the impacted resource|
|Location|Location which contains the impacted resource|
|Subscription ID|Unique ID for the subscription that contains the impacted resource|
|Subscription Name|Subscription name for the subscription which contains the impacted resource|
|Tenant ID|Unique ID for the tenant that contains the impacted resource|

## Resource Name

This will be the resource name of the resource. The resource name will be a clickable link that links to Resource Health page for this resource.

It will be text only if there is no Resource Health signal available for this resource.

## Impact Type

This column will display values “Confirmed vs Potential”

- *Confirmed*: Resource that was confirmed to be impacted by an outage. Customers should check the Summary section to make sure customer action items (if any) are taken to remediate the issue.
- *Potential*: Resource that is not confirmed to be impacted by an outage but could potentially be impacted as it is under a service or region which is impacted by an outage. Customers are advised to look at the resource health and make sure everything is working as planned.

## Resource Health

The health status listed under **[Resource Health](../service-health/resource-health-overview.md)** refers to the status of a given resource at that point in time.

- A health status of available means your resource is healthy but it may have been affected by the service event at a previous point in time.
- A health status of degraded or unavailable (caused by a customer-initiated action or platform-initiated action) means your resource is impacted but could be now healthy and pending a status update.

:::image type="content" source="./media/impacted-resource-outage/rh-cropped.PNG" alt-text="Screenshot of Impacted Resources health status icons and impact type":::


>[!Note]
>Not all resources will show resource health status. This will be shown on resources for which we have a resource health signal available only. The status of resources where the health signal is not available is shown as **“N/A”** and corresponding Resource name value will be text only not a clickable link.

## Filters

Customers can filter on the results using the below filters:

- Impact type: Confirmed or Potential
- Subscription ID: All Subscription IDs the user has access to
- Status: Resource Health status column that shows Available, Unavailable, Degraded, Unknown, N/A

## Export to CSV

The list of impacted resources can be exported to an excel file by clicking on this option.

## Accessing Impacted Resources programmatically via an API

Outage impacted resource information can be retrieved programmatically using the Events API. The API documentation [here](https://learn.microsoft.com/rest/api/resourcehealth/impacted-resources/list-by-subscription-id-and-event-id?tabs=HTTP) provides the details around how customers can access this data. 

## Next Steps
-  See [Introduction to Azure Service Health dashboard](service-health-overview.md) and [Introduction to Azure Resource Health](resource-health-overview.md) to understand more about them.
-  [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
