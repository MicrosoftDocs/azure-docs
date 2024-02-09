---
title: Cleanup observability resources
titleSuffix: Azure IoT Operations
description: Configure observability features manually in Azure IoT Operations to monitor the health of your solution.
author: timlt
ms.author: timlt
ms.topic: how-to
ms.date: 02/04/2024

# CustomerIntent: As an IT admin or operator, I want to be able to monitor and visualize data
# on the health of my industrial assets and edge environment.
---

# Cleanup Resources

To uninstall the observability resources, navigate to the resource group where you installed the shared resources and delete the following resources:

- Azure Monitor Workspace
- Azure Managed Grafana
- Log Analytics Workspace
- Container Insights Solution

For a resource group with a single cluster connected, the following screenshot shows what the list of resources looks like:

:::image type="content" source="media/howto-configure-observability/shared-resource-delete.png" alt-text="Screenshot that lists shared resources."  lightbox="media/howto-configure-observability/shared-resource-delete-expanded.png":::

Next, navigate to the resource group where your cluster is located (if different from the resource group for the previous resources). Find the data collection endpoint, the two data collection rules (one ending with "logsDataCollectionRule" and the other ending with "metricsDataCollectionRule") and recording rule groups (ending in "KubernetesRecordingRuleGroup" and
"NodeRecordingRuleGroup"). Delete these five resources to complete the cleanup without removing the cluster itself.

> [!NOTE]  
> You might need to run the delete more than once for all resources to be successfully deleted. 

For a typical cluster resource group, the following screenshot shows what the list of resources looks like.  The resources to delete are selected. 

:::image type="content" source="media/howto-configure-observability/cluster-resource-delete.png" alt-text="Screenshot that lists shared resources to delete."  lightbox="media/howto-configure-observability/cluster-resource-delete-expanded.png":::

Finally, you can remove the configuration that was installed on your cluster. To do that, run the following command:

```bash
kubectl delete -f ama-metrics-prometheus-config.yaml
```