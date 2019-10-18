---
title: View Azure Monitor for containers Live Deployments (preview) | Microsoft Docs
description: This article describes the real-time view of Kubernetes logs, events, and pod metrics without using kubectl in Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
ms.service: azure-monitor
ms.topic: conceptual
ms.date: 10/15/2019
ms.author: magoedte
---

# How to view deployments in real time (preview)

Azure Monitor for containers view Deployments (preview) feature allows you to view the declarative updates for Pods and ReplicaSets in a cluster. You describe a desired state in a Deployment, and the Deployment Controller changes the actual state to the desired state at a controlled rate. You can define Deployments to create new ReplicaSets, or to remove existing Deployments and adopt all their resources with new Deployments. To learn more, review the Kubernetes documentation about [Deployments]](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/). 

To view Deployments, perform the following steps.

1. In the Azure portal, browse to the AKS cluster resource group and select your AKS resource.

2. On the AKS cluster dashboard, under **Monitoring** on the left-hand side, choose **Insights**. 

3. Select the **Deployments (preview)** tab.

    [!Deployments view in the Azure portal](./media/container-insights-livedata-deployments/deployment-view-01.png)

The view shows a list of all the running deployments along with the namespace and other detailed information, emulating execution of the command `kubectl get deployments –all-namespaces`. 

![Deployment properties pane details](./media/container-insights-livedata-deployments/deployment-properties-pane-details.png)

When you select a deployment from the list, a property pane automatically displays on the right side of the page. It shows information related to the selected deployment that you would view if you ran the command `kubectl describe deployment {deploymentName}`. From the pane, you also can view the raw information from the kube-api server by selecting the **Raw** tab.

![Deployment properties pane raw details](./media/container-insights-livedata-deployments/deployment-properties-pane-raw.png)

While you review deployment details, you can see container logs and events in real time. Select the **Show live console** and the Live console pane will appear below the deployments data grid where you can view live log data in a continuous stream. If the fetch status indicator shows a green check mark, which is on the far right of the pane, it means data can be retrieved and it begins streaming to your console.

You can also filter by namespace or cluster level events. To learn more about the Live console, see [View live data with Azure Monitor for containers Live console (preview)](container-insights-livedata-console.md). 

![Deployment Live console events](./media/container-insights-livedata-deployments/deployment-live-console-events.png)

## Next steps