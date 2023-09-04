---
title: What's new in HDInsight on AKS?
description: An introduction to new concepts in HDInsight on AKS that aren't in HDInsight.
ms.service: hdinsight-aks
ms.topic: concept
ms.date: 08/06/2023
---

# Capacity Planning for HDInsight on AKS Cluster Pools and Clusters

The Virtual Machines used in HDInsight on AKS clusters require the same Quota as Azure VMs. This is unlike the original version of HDInsight, where a dedicated Quota had to be requested for creating HDInsight clusters by selecting ‘Azure HDInsight’ on the Quota selection dropdown (image below). For HDInsight on AKS, customers need to select ‘Compute’ from the Quota selection dropdown in order to request additional capacity for the VMs they intend to use in their clusters. Please find detailed instructions for increasing your quota [here](https://learn.microsoft.com/en-us/azure/quotas/per-vm-quota-requests).

    :::image type="content" source="./media/monitor-with-prometheus-grafana/integration-configure-tab.png" alt-text="Screenshot showing integration configure tab." border="true" lightbox="./media/monitor-with-prometheus-grafana/integration-configure-tab.png":::
