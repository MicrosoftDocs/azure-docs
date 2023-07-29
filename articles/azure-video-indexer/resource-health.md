---
title: Diagnose Video Indexer resource issues with Azure Resource Health
description: Learn how to diagnose Video Indexer resource issues with Azure Resource Health.
ms.topic: how-to
ms.date: 05/12/2023
---

# Diagnose Video Indexer resource issues with Azure Resource Health 

[Azure Resource Health](../service-health/resource-health-overview.md) can help you diagnose and get support for service problems that affect your Azure AI Video Indexer resources. Resource health is updated every 1-2 minutes and reports the current and past health of your resources. For additional details on how health is assessed, review the [full list of resource types and health checks](../service-health/resource-health-checks-resource-types.md#microsoftnetworkapplicationgateways) in Azure Resource Health. 

## Get started 

To open Resource Health for your Video Indexer resource: 

1. Sign in to the Azure portal. 
1. Browse to your Video Indexer account. 
1. On the resource menu in the left pane, in the Support and Troubleshooting section, select Resource health. 

The health status is displayed as one of the following statuses: 

### Available 

An **Available** status means the service hasn't detected any events that affect the health of the resource. You see the **Recently resolved** notification in cases where the resource has recovered from unplanned downtime during the last 24 hours. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/resource-health/available-status.png" alt-text="Diagram of Azure AI Video Indexer resource health." :::

### Unavailable 

An Unavailable status means the service has detected an ongoing platform or non-platform event that affects the health of the resource. 

#### Platform events 

Platform events are triggered by multiple components of the Azure infrastructure. They include both scheduled actions (for example, planned maintenance) and unexpected incidents (for example, an unplanned host reboot). 

Resource Health provides additional details on the event and the recovery process. It also enables you to contact support even if you don't have an active Microsoft support agreement. 

### Unknown 

The Unknown health status indicates Resource Health hasn't received information about the resource for more than 10 minutes. Although this status isn't a definitive indication of the state of the resource, it can be an important data point for troubleshooting. 

If the resource is running as expected, the status of the resource will change to **Available** after a few minutes. 

If you experience problems with the resource, the **Unknown** health status might mean that an event in the platform is affecting the resource. 

### Degraded 

The Degraded health status indicates your Video Indexer resource has detected a loss in performance, although it's still available for usage. 

## Next steps

- [Configuring Resource Health alerts](../service-health/resource-health-alert-arm-template-guide.md) 
- [Monitor Video Indexer](monitor-video-indexer.md) 

 

