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

Azure Monitor for containers live metrics feature allows you to directly visualize metrics regarding node and pod state in a cluster. It emulates direct access to the kubectl top nodes, kubectl get pods –all-namespaces and kubectl get nodes commands from the Azure Portal user interface for metadata purposes.  The endpoint calls are parsed and visualized into standard Azure Monitoring Metrics charts over time for the duration of the feature utilization. 
The instructions provided here will guide on utilization and limitations of this feature. 