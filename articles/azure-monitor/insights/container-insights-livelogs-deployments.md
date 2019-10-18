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

    [!Deployments view in the Azure portal](./media/container-insights-livelogs-deployments/deployment-view-01.png)


The following three views give you a wholistic experience and highlight important information pertaining to viewing a deployment and diagnosing its current state. 