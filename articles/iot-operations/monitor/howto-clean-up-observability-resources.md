---
title: Clean up observability resources
description: How to clean up shared and data collection observability resources from an existing installation in Azure IoT Operations.
author: kgremban
ms.author: kgremban
ms.topic: how-to
ms.date: 02/27/2024

# CustomerIntent: As an IT admin or operator, I want to be able to clean up and remove
# observability resources installed on my cluster, without removing the cluster. 
---

# Clean up observability resources
This article shows how to clean up the observability resources in your cluster without removing the cluster itself. 

## Delete resources

To uninstall the observability resources, complete the following steps.

1. Navigate to the resource group where you installed the shared resources, and delete the following resources:

    - Azure Monitor Workspace
    - Azure Managed Grafana
    - Log Analytics Workspace
    - Container Insights Solution

    For a resource group with a single cluster connected, the following screenshot shows what the list of resources looks like:
    
    :::image type="content" source="media/howto-clean-up-observability-resources/shared-resource-delete.png" alt-text="Screenshot that lists a set of shared resources."  lightbox="media/howto-clean-up-observability-resources/shared-resource-delete-expanded.png":::

1. Navigate to the resource group where your cluster is located (if different from the resource group for the previous resources). Delete the following resources: 

    - The data collection endpoint
    - The two data collection rules (one ends with "logsDataCollectionRule" and the other ends with "metricsDataCollectionRule")
    - The two recording rule groups (one ends with "KubernetesRecordingRuleGroup" and the other ends with "NodeRecordingRuleGroup")

    > [!NOTE]  
    > You might need to run the delete more than once for all resources to be successfully deleted. 

## Delete the configuration from your cluster

Finally, you can remove the configuration that was installed on your cluster. To do that, run the following command:

```bash
kubectl delete -f ama-metrics-prometheus-config.yaml
```

## Related content

- [Get started: configure observability](howto-configure-observability.md)
- [How to configure observability manually](howto-configure-observability-manual.md)