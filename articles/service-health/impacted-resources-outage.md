---
title: Resource impact from Azure outages
description: This article details where to find information from Azure Service Health about how Azure outages might affect your resources.
ms.topic: conceptual
ms.date: 12/16/2022
---

# Resource impact from Azure outages

[Azure Service Health](https://azure.microsoft.com/get-started/azure-portal/service-health/) helps customers view any health events that affect their subscriptions and tenants. In the Azure portal, the **Service Issues** pane in **Service Health** shows any ongoing problems in Azure services that are affecting your resources. You can understand when each problem began, and what services and regions are impacted. 

Previously, the **Potential Impact** tab on the **Service Issues** pane appeared in the incident details section. It showed any resources under a subscription that an outage might affect, along with a signal from [Azure Resource Health](../service-health/resource-health-overview.md) to help you evaluate impact.

In support of the experience of viewing impacted resources, Service Health has enabled a new feature to:

- Replace the **Potential Impact** tab with an **Impacted Resources** tab on the **Service Issues** pane.
- Display resources that are confirmed to be impacted by an outage.
- Display resources that are not confirmed to be impacted by an outage but could be impacted because they fall under a service or region that's confirmed to be impacted.
- Provide the status of both confirmed and potential impacted resources to show their availability.

This article details what Service Health communicates and where you can view information about your impacted resources.

>[!Note]
>This feature will be rolled out in phases. Initially, only selected subscription-level customers will get the experience. The rollout will gradually expand to 100 percent of subscription and tenant-level users.

## View impacted resources

In the Azure portal, the **Impacted Resources** tab under **Service Health** > **Service Issues** displays resources that are or might be impacted by an outage. Service Health provides the below information to users whose resources are impacted by an outage:

|Column  |Description |
|---------|---------|
|**Resource Name**|Name of the resource. This name is a clickable link that goes to the Resource Health page for the resource. If no Resource Health signal is available for the resource, this name is text only.|
|**Resource Health**|Health status of the resource: <br><br>**Available**: Your resource is healthy, but a service event might have impacted it at a previous point in time. <br><br>**Degraded** or **Unavailable**: A customer-initiated action or a platform-initiated action might have caused this status. It means your resource was impacted but might now be healthy, pending a status update. <br><br>:::image type="content" source="./media/impacted-resource-outage/rh-cropped.PNG" alt-text="Screenshot of health statuses for a resource.":::|
|**Impact Type**|Indication of whether the resource is or might be impacted: <br><br>**Confirmed**: The resource is confirmed to be impacted by an outage. Check the **Summary** section for any action items that you can take to remediate the problem. <br><br>**Potential**: The resource is not confirmed to be impacted, but it could potentially be impacted because it's under a service or region that an outage is affecting. Check the **Resource Health** column to make sure that everything is working as planned.|
|**Resource Type**|Type of impacted resource (for example, virtual machine).|
|**Resource Group**|Resource group that contains the impacted resource.|
|**Location**|Location that contains the impacted resource.|
|**Subscription ID**|Unique ID for the subscription that contains the impacted resource.|
|**Subscription Name**|Subscription name for the subscription that contains the impacted resource.|

The following is an example of outage **Impacted Resources** from the subscription and tenant scope.

:::image type="content" source="./media/impacted-resource-outage/ir-portal-crop.PNG" alt-text="Screenshot of information about subscription impacted resources in Azure Service Health.":::

>[!Note]
>Not all resources in subscription scope will show a Resource Health status. The status appears only on resources for which a Resource Health signal is available. The status of resources for which a Resource Health signal is not available appears as **N/A**, and the corresponding **Resource Name** value is text instead of a clickable link.

:::image type="content" source="./media/impacted-resource-outage/ir-tenant.PNG" alt-text="Screenshot of information about tenant impacted resources in Azure Service Health.":::

>[!Note]
>Resource Health status, tenant name, and tenant ID are not included at the tenant level scope. The corresponding **Resource Name** value is text only instead of a clickable link.

## Filter results

You can adjust the results by using these filters:

- **Impact type**: Select **Confirmed** or **Potential**.
- **Subscription ID**: Show all subscription IDs that the user can access.
- **Status**: Focus on Resource Health status by selecting **Available**, **Unavailable**, **Degraded**, **Unknown**, or **N/A**.

## Export to CSV

To export the list of impacted resources to an Excel file, select the **Export to CSV** option.

## Access impacted resources programmatically via an API

You can get information about outage-impacted resources programmatically by using the Events API. For details on how to access this data, see the [API documentation](/rest/api/resourcehealth/2022-10-01/impacted-resources).

## Next steps
-  [Introduction to the Azure Service Health dashboard](service-health-overview.md)
- [Introduction to Azure Resource Health](resource-health-overview.md)
- [Frequently asked questions about Azure Resource Health](resource-health-faq.yml)
