---
title: Capacity Planning
description: Capacity Planning for HDInsight on AKS.
ms.service: hdinsight-aks
ms.topic: concept
ms.date: 09/05/2023
---

# Capacity Planning for HDInsight on AKS Cluster Pools and Clusters

The Virtual Machines used in HDInsight on AKS clusters require the same Quota as Azure VMs. This is unlike the original version of HDInsight, where a dedicated Quota had to be requested for creating HDInsight clusters by selecting ‘Azure HDInsight’ on the Quota selection dropdown (image below). For HDInsight on AKS, customers need to select ‘Compute’ from the Quota selection dropdown in order to request additional capacity for the VMs they intend to use in their clusters. Please find detailed instructions for increasing your quota [here](https://learn.microsoft.com/en-us/azure/quotas/per-vm-quota-requests).

    :::image type="content" source="./media/capacity-planning/capacity-planning.png" alt-text="Screenshot shows Capacity Planning for HDInsight on AKS." border="true" lightbox="./media/capacity-planning/capacity-planning.png":::
