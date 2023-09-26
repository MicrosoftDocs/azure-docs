---
title: Monitor OnlineEndpoint inference server log
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning Kubernetes compute enable Azure Machine Learning across different infrastructures in cloud and on-premises
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: bozhong68
ms.author: bozhlin
ms.reviewer: ssalgado
ms.custom: devplatv2, ignite-fall-2021, event-tier1-build-2022, ignite-2022
ms.date: 09/26/2023
#Customer intent: As part of ML Professionals focusing on ML infratrasture setup using self-managed compute, I want to understand what Kubernetes compute target is and why do I need it.
---

# Monitor OnlineEndpoint inference server log

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]

To diagnose online issues and monitor inference server metrics, we usually need to collect inference server logs. In AKS cluster, you can leverage the built-in ability to collect container logs. In Arc Kubernetes cluster, you can reference the [Azure Monitor](../azure-monitor/index.yml) document to upload logs to Azure Monitor from your cluster.


Follow the steps below to collect inference server logs in AKS:

1. Go to the AKS portal and select **Logs** tab

    :::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/aks-portal-monitor-logs.png" alt-text="Diagram illustrating how to enable log minitor in AKS." lightbox="./media/how-to-attach-kubernetes-to-workspace/aks-portal-monitor-logs.png":::

1. Click **Configure Monitoring** to enable Azure Monitor for your AKS. In the **Advcanced Settings** section, you can specify an existing **Log Analytics** or create a new one for collecting logs.

    :::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/aks-portal-config-azmonitor.png" alt-text="Diagram illustrating how to enable log minitor in AKS." lightbox="./media/how-to-attach-kubernetes-to-workspace/aks-portal-config-azmonitor.png":::

1. After about 1 hour for it to take effect, you can query inference server logs from **AKS** or **Log Analytics** portal.

    :::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/aks-portal-query-inference-server-logs.png" alt-text="Diagram illustrating how to enable log minitor in AKS." lightbox="./media/how-to-attach-kubernetes-to-workspace/aks-portal-query-inference-server-logs.png":::