---
title: Monitor Kubernetes Online Endpoint inference server logs 
titleSuffix: Azure Machine Learning
description: Learn how to monitor inference server logs of Kubernetes online endpoint 
services: machine-learning
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
author: zetiaatgithub
ms.author: zetia
ms.reviewer: 
ms.custom: devplatv2, ignite-fall-2021, event-tier1-build-2022, ignite-2022
ms.date: 09/26/2023
---

# Monitor Kubernetes Online Endpoint inference server logs

[!INCLUDE [dev v2](includes/machine-learning-dev-v2.md)]


To diagnose online issues and monitor Azure Machine Learning model inference server metrics, we usually need to collect model inference server logs. 


## AKS cluster

In AKS cluster, you can use the built-in ability to collect container logs. Follow the steps to collect inference server logs in AKS:

1. Go to the AKS portal and select **Logs** tab

    :::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/aks-portal-monitor-logs.png" alt-text="Diagram illustrating how to configure Azure monitor in AKS." lightbox="./media/how-to-attach-kubernetes-to-workspace/aks-portal-monitor-logs.png":::

1. Click **Configure Monitoring** to enable Azure Monitor for your AKS. In the **Advanced Settings** section, you can specify an existing **Log Analytics** or create a new one for collecting logs.

    :::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/aks-portal-config-az-monitor.png" alt-text="Diagram illustrating how to configure container insight in AKS monitor." lightbox="./media/how-to-attach-kubernetes-to-workspace/aks-portal-config-az-monitor.png":::

1. After about 1 hour for it to take effect, you can query inference server logs from **AKS** or **Log Analytics** portal.

    :::image type="content" source="./media/how-to-attach-kubernetes-to-workspace/aks-portal-query-inference-server-logs.png" alt-text="Example of query run in AKS monitor." lightbox="./media/how-to-attach-kubernetes-to-workspace/aks-portal-query-inference-server-logs.png":::

1. Query example:
    ```
        let starttime = ago(1d);
        ContainerLogV2
        | where TimeGenerated > starttime
        | where PodName has "blue-sklearn-mnist"
        | where ContainerName has "inference-server"
        | project TimeGenerated, PodNamespace, PodName, ContainerName, LogMessage
        | limit 100
    ```

## Azure Arc enabled cluster

In Arc Kubernetes cluster, you can reference the [Azure Monitor](../azure-monitor/index.yml) document to upload logs to **Log Analytics** from your cluster by utilizing **Azure Monitor Agent**
