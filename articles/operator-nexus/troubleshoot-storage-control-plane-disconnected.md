---
title: Troubleshooting storage control plane connectitivy issues.
description: Troubleshooting Azure Resource Health alerts about control plane connectivity issues.
author: jensheasby
ms.author: jensheasby
ms.date: 07/21/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshooting control plane connectivity issues - Azure Resource Health

This article provides troubleshooting advice and escalation methods for Operator Nexus clusters which are
reporting issues with control plane connectivity in Azure Resource Health.

## Symptoms

This alert indicates that there are issues connecting to the storage control plane from the cluster. The two
categories of alert have different symptoms:

- If the cluster is marked as degraded, this means there has been a loss of redundancy to the storage control
  plane. This means that one of the controllers is experiencing connectivity issues. The cluster will continue
  to function, but this issue should be quickly fixed to restore redundancy to the system.
- If the cluster is marked as unhealthy, this means the storage control plane is completely unreachable from
  the cluster. New workloads which depend on `nexus-volume` volumes will not come up, and existing workloads
  which rely on `nexus-volume` volumes will not be able to be migrated to a new node. Additonally, new cloud
  services networks cannot be created.

## Troubleshooting

The cluster may be marked as degraded during a storage appliance upgrade, since these upgrades take controllers
offline one by one. The cluster should return to healthy status after the upgrade is complete.

If an upgrade is not the root cause, you should check if there are any issues with the management switches in
the aggregator rack. Follow these steps to check for issues:

1. Start on the cluster (Operator Nexus) resource overview page. Click the link to the network fabric resource.
   :::image type="content" source="media/navigate-network-fabric-portal.png" alt-text="Screenshot of a cluster resource, with the network fabric link highlighted." lightbox="media/navigate-network-fabric-portal.png":::
2. Go to `Infrastructue->Devices`, and search for the aggregator rack management switches. Ensure they are succesfully
   provisioned and enabled.
   :::image type="content" source="media/navigate-mgmt-switch-portal.png" alt-text="Screenshot of the Infrastructure tab of a network fabric resource." lightbox="media/snavigate-mgmt-switch-portal.png":::
3. Click on a management switch, and go to the `Monitoring->Metrics` tab. Select `Interface Out Pkts`, then apply splitting
   on the `Interface Name` dimension.
   :::image type="content" source="media/interface-out-pkts.png" alt-text="Screenshot of a metric showing the outward packets of a management switch." lightbox="media/interface-out-pkts.png":::
4. Check for any interfaces where the packets has suddenly dropped to zero. If you find any, you should reseat any affected
   cables.
5. Repeat the check for the second management switch.

If upgrade or management switch problems are not the root cause, you should raise a ticket with Microsoft, quoting
the text of this troubleshooting guide.
