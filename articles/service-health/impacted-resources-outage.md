---
title: Resource impact from Azure outages
description: This article details where to find information from Azure Service Health about how Azure outages might affect your resources.
ms.topic: conceptual
ms.date: 12/16/2022
---

# Resource impact from Azure outages

[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/) helps customers view any health events that affect their subscriptions and tenants. In the Azure portal, the **Service Issues** pane in **Service Health** shows any ongoing problems in Azure services that are affecting your resources. You can understand when each problem began, and what services and regions are affected. 

Previously, the **Potential Impact** tab on the **Service Issues** pane appeared in the incident details section. It showed any resources under a subscription that an outage might affect, along with a signal from [Azure Resource Health](../service-health/resource-health-overview.md) to help you evaluate impact.

In support of the experience of viewing affected resources, Service Health has enabled a new feature to:

- Replace the **Potential Impact** tab with an **Impacted Resources** tab on the **Service Issues** pane.
- Display resources that are confirmed to be affected by an outage.
- Display resources that are not confirmed to be affected by an outage but could be affected because they fall under a service or region that's confirmed to be affected.
- Provide the status of both confirmed and potential affected resources to show their availability.

This article details what Service Health communicates and where you can view information about your affected resources.

>[!Note]
>This feature will be rolled out in phases. Initially, only selected subscription-level customers will get the experience. The rollout will gradually expand to 100 percent of subscription customers. It will go live for tenant-level customers in the future.

## View affected resources

In the Azure portal, the **Impacted Resources** tab under **Service Health** > **Service Issues** displays resources that are or might be affected by an outage. The following example of the **Impacted Resources** tab shows an incident with confirmed and potentially affected resources.

:::image type="content" source="./media/impacted-resource-outage/ir-portal-crop.PNG" alt-text="Screenshot of information about affected resources in Azure Service Health.":::

Service Health provides the following information:

|Column  |Description |
|---------|---------|
|**Resource Name**|Name of the resource. This name is a clickable link that goes to the Resource Health page for the resource. If no Resource Health signal is available for the resource, this name is text only.|
|**Resource Health**|Health status of the resource: <br><br>**Available**: Your resource is healthy, but a service event might have affected it at a previous point in time. <br><br>**Degraded** or **Unavailable**: A customer-initiated action or a platform-initiated action might have caused this status. It means your resource was affected but might now be healthy, pending a status update. <br><br>:::image type="content" source="./media/impacted-resource-outage/rh-cropped.PNG" alt-text="Screenshot of health statuses for a resource.":::|
|**Impact Type**|Indication of whether the resource is or might be affected: <br><br>**Confirmed**: The resource is confirmed to be affected by an outage. Check the **Summary** section for any action items that you can take to remediate the problem. <br><br>**Potential**: The resource is not confirmed to be affected, but it could potentially be affected because it's under a service or region that an outage is affecting. Check the **Resource Health** column to make sure that everything is working as planned.|
|**Resource Type**|Type of affected resource (for example, virtual machine).|
|**Resource Group**|Resource group that contains the affected resource.|
|**Location**|Location that contains the affected resource.|
|**Subscription ID**|Unique ID for the subscription that contains the affected resource.|
|**Subscription Name**|Subscription name for the subscription that contains the affected resource.|
|**Tenant ID**|Unique ID for the tenant that contains the affected resource.|

>[!Note]
>Not all resources show a Resource Health status. The status appears only on resources for which a Resource Health signal is available. The status of resources for which a Resource Health signal is not available appears as **N/A**, and the corresponding **Resource Name** value is text instead of a clickable link.

## Filter results

You can adjust the results by using these filters:

- **Impact type**: Select **Confirmed** or **Potential**.
- **Subscription ID**: Show all subscription IDs that the user can access.
- **Status**: Focus on Resource Health status by selecting **Available**, **Unavailable**, **Degraded**, **Unknown**, or **N/A**.

## Export to CSV

To export the list of affected resources to an Excel file, select the **Export to CSV** option.

## Access affected resources programmatically via an API

You can get information about outage-affected resources programmatically by using the Events API. For details on how to access this data, see the [API documentation](/rest/api/resourcehealth/2022-05-01/impacted-resources/list-by-subscription-id-and-event-id?tabs=HTTP). 

## Next steps
-  [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
