---
title: Monitor online endpoints
titleSuffix: Azure Machine Learning
description: Monitor online endpoints and create alerts with Application Insights.
services: machine-learning
ms.service: machine-learning
ms.author: larryfr
author: blackmist
ms.subservice: mlops
ms.date: 06/01/2022
ms.topic: conceptual
ms.custom: how-to, devplatv2, event-tier1-build-2022
---

# Monitor online endpoints

In this article, you learn how to monitor [Azure Machine Learning online endpoints](concept-endpoints.md). Use Application Insights to view metrics and create alerts to stay up to date with your online endpoints.

In this article you learn how to:

> [!div class="checklist"]
> * View metrics for your online endpoint
> * Create a dashboard for your metrics
> * Create a metric alert

## Prerequisites

- Deploy an Azure Machine Learning online endpoint.
- You must have at least [Reader access](../role-based-access-control/role-assignments-portal.md) on the endpoint.

## View metrics

Use the following steps to view metrics for an online endpoint or deployment:
1. Go to the [Azure portal](https://portal.azure.com).
1. Navigate to the online endpoint or deployment resource.

    online endpoints and deployments are Azure Resource Manager (ARM) resources that can be found by going to their owning resource group. Look for the resource types **Machine Learning online endpoint** and **Machine Learning online deployment**.

1. In the left-hand column, select **Metrics**.

## Available metrics

Depending on the resource that you select, the metrics that you see will be different. Metrics are scoped differently for online endpoints and online deployments.

### Metrics at endpoint scope

- Request Latency
- Request Latency P50 (Request latency at the 50th percentile)
- Request Latency P90 (Request latency at the 90th percentile)
- Request Latency P95 (Request latency at the 95th percentile)
- Requests per minute
- New connections per second
- Active connection count
- Network bytes

Split on the following dimensions:

- Deployment
- Status Code
- Status Code Class

#### Bandwidth throttling

Bandwidth will be throttled if the limits are exceeded for _managed_ online endpoints (see managed online endpoints section in [Manage and increase quotas for resources with Azure Machine Learning](how-to-manage-quotas.md#azure-machine-learning-managed-online-endpoints)). To determine if requests are throttled:
- Monitor the "Network bytes" metric
- The response trailers will have the fields: `ms-azureml-bandwidth-request-delay-ms` and `ms-azureml-bandwidth-response-delay-ms`. The values of the fields are the delays, in milliseconds, of the bandwidth throttling.

### Metrics at deployment scope

- CPU Utilization Percentage
- Deployment Capacity (the number of instances of the requested instance type)
- Disk Utilization
- GPU Memory Utilization (only applicable to GPU instances)
- GPU Utilization (only applicable to GPU instances)
- Memory Utilization Percentage

Split on the following dimension:

- InstanceId

## Create a dashboard

You can create custom dashboards to visualize data from multiple sources in the Azure portal, including the metrics for your online endpoint. For more information, see [Create custom KPI dashboards using Application Insights](../azure-monitor/app/tutorial-app-dashboards.md#add-custom-metric-chart).
    
## Create an alert

You can also create custom alerts to notify you of important status updates to your online endpoint:

1. At the top right of the metrics page, select **New alert rule**.

    :::image type="content" source="./media/how-to-monitor-online-endpoints/online-endpoints-new-alert-rule.png" alt-text="Monitoring online endpoints: screenshot showing 'New alert rule' button surrounded by a red box":::

1. Select a condition name to specify when your alert should be triggered.

    :::image type="content" source="./media/how-to-monitor-online-endpoints/online-endpoints-configure-signal-logic.png" alt-text="Monitoring online endpoints: screenshot showing 'Configure signal logic' button surrounded by a red box":::

1. Select **Add action groups** > **Create action groups** to specify what should happen when your alert is triggered.

1. Choose **Create alert rule** to finish creating your alert.


## Next steps

* Learn how to [view costs for your deployed endpoint](./how-to-view-online-endpoints-costs.md).
* Read more about [metrics explorer](../azure-monitor/essentials/metrics-charts.md).
