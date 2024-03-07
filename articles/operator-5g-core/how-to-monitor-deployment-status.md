---
title: Monitoring the deployment status of Azure Operator 5G Core Preview
description: Monitor the deployment status of your Azure Operator 5G Core Preview and its components
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: how-to #required; leave this attribute/value as-is.
ms.date: 02/21/2024
---

# Monitor the  status of your Azure Operator 5G Core Preview deployment

Azure Operator 5G Core Preview provides network function health check information using the Azure portal. 

## View health check information

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Navigate to the Network Functions Inventory & Health Checks screen. This screen lists all resources, along with the resource group, cluster, resource type and deployment status.

:::image type="content" source="media/how-to-monitor-deployment-status/monitor-deployments.png" alt-text="screenshot displaying the Azure Operator 5G Core health check and network functions inventory. A column listing deployment status indicates the status of each resource deployed.":::

You can also view the status of pods in each cluster.

:::image type="content" source="media/how-to-monitor-deployment-status/monitor-pod-status.png" alt-text="screenshot displaying the Azure Operator 5G Core health check and network functions inventory. A detail shows operational status of pods in a cluster.":::

## Related content

- [Observability and analytics in Azure Operator 5G Core Preview](concept-observability-analytics.md)
- [Perform health and configuration checks post-deployment in Azure Operator 5G Core Preview](how-to-perform-checks-post-deployment.md)