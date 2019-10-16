--
title: Azure Monitor for containers live metrics (preview) | Microsoft Docs
description: This article describes the real-time view of metrics without using kubectl with Azure Monitor for containers.
services: azure-monitor
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: 
ms.assetid: 
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/15/2019
ms.author: magoedte
---

# How to view metrics in real time (preview)

Azure Monitor for containers live metrics (preview) feature allows you to directly visualize metrics about node and pod state in a cluster. It emulates direct access to the `kubectl top nodes`, `kubectl get pods –all-namespaces` and `kubectl get nodes` commands to call, parse, and visualize the data in performance charts  

This article helps you understand utilization and limitations of this feature. 

>[!NOTE]
>AKS clusters enabled as [private clusters](https://azure.microsoft.com/updates/aks-private-cluster/) are not supported with this feature. This feature relies on directly accessing the Kubernetes API through a proxy server from your browser. Enabling networking security to block the Kubernetes API from this proxy will block this traffic. 

>[!NOTE]
>This feature is available in all Azure regions, including Azure China. It is currently not available in Azure US Government.

For help setting up or troubleshooting the live metrics and data feature, review our [setup guide](container-insights-livelogs-setup.md).

## How it Works 

The live metrics and data feature directly access the Kubernetes API. Additional information can be found [here](container-insights-livelogs-setup.md). 

Live metrics feature performs a polling operation against the metrics endpoints (including `/api/v1/nodes`, `/apis/metrics.k8s.io/v1beta1/nodes` and `/api/v1/pods`), which is five seconds by default.  This data is cached in your browser and charted in the performance charts included in Azure Monitor for containers. Each subsequent poll will be charted into a rolling five-minute visualization window. 

The polling interval is configured from the **Set interval** drop down allowing you to set polling for new data every 1, 5, 15 and 30 seconds. 

>[!IMPORTANT]
>We don't support for shorter polling intervals is not yet complete so we do not recommend utilizing 1 second poll intervals for long periods of time.  These requests may impact the availability and throttling of the Kubernetes API on your cluster. 
Important: No data is stored permanently during operation of this feature.  All information captured during this session will immediately be lost when you close your browser or navigate away from the feature.  Data will only remain present for visualization inside the five minute window; any metrics older than five minutes old will also be permanently lost. 
Important: The charts can not be pinned to a dashboard in live mode.   