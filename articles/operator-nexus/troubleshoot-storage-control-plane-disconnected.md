---
title: Troubleshoot storage control plane connectivity issues.
description: Troubleshooting Azure Resource Health alerts about control plane connectivity issues.
author: jensheasby
ms.author: jensheasby
ms.date: 07/21/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshoot control plane connectivity issues - Azure Resource Health

This article provides troubleshooting advice and escalation methods for Operator Nexus clusters that are
reporting issues with control plane connectivity in Azure Resource Health.

## Symptoms

This alert indicates that there are issues connecting to the storage control plane from the cluster. The two
categories of alert have different symptoms:

- A degraded cluster has lost redundancy to the storage control plane. This means that one of the controllers
  is experiencing connectivity issues. The cluster continues to function, but this issue should be quickly
  fixed to restore redundancy to the system.
- An unhealthy cluster is unable to reach the storage control plane. New workloads that depend on `nexus-volume`
  volumes cannot come up, and existing workloads that rely on `nexus-volume` volumes cannot be migrated to a
  new node. Additionally, new cloud services networks cannot be created.

## Troubleshoot

The cluster may be marked as degraded during a storage appliance upgrade, since these upgrades take controllers
offline one by one. The cluster should return to healthy status after the upgrade is complete.

If an upgrade is not the root cause, you should check if there are any issues with the management switches in
the aggregator rack, by following these steps:

1. Start on the cluster (Operator Nexus) resource overview page. Click the link to the network fabric resource.
   :::image type="content" source="media/navigate-network-fabric-portal.png" alt-text="Screenshot of a cluster resource, with the network fabric link highlighted." lightbox="media/navigate-network-fabric-portal.png":::
2. Go to `Infrastructure->Network Devices`, and search for the aggregator rack management switches. Ensure they are successfully
   provisioned and enabled.
   :::image type="content" source="media/navigate-mgmt-switch-portal.png" alt-text="Screenshot of the Infrastructure tab of a network fabric resource." lightbox="media/navigate-mgmt-switch-portal.png":::
3. Click on a management switch, and go to the `Monitoring->Metrics` tab. Select `Interface Out Pkts`, then apply splitting
   on the `Interface Name` dimension.
   :::image type="content" source="media/interface-out-packets.png" alt-text="Screenshot of a metric showing the outward packets of a management switch." lightbox="media/interface-out-packets.png":::
4. Check for any interfaces where the number of packets suddenly dropped to zero. If you find any, you should reseat
   any affected cables.
5. Repeat the check for the second management switch.

If upgrade or management switch problems are not the root cause, you should raise a ticket with Microsoft, quoting
the text of this troubleshooting guide.
