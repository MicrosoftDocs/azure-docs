---
title: Troubleshoot failed volume attachments
description: Troubleshooting Azure Resource Health alerts about failed volume attachments
author: jensheasby
ms.author: jensheasby
ms.date: 07/21/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshoot failed volume attachments - Azure Resource Health

This article provides troubleshooting advice and escalation methods for Operator Nexus clusters that are
reporting failed volume attachments in Azure Resource Health.

## Symptoms

This alert indicates that volumes are failing to attach in the undercloud. Failed volume attachments can lead
to delays in bringing up workloads in the tenant layer, or migrating existing workloads to a new node. A
cluster in degraded state has at least one failed volume attachment - in this case the problem may be limited
to this specific volume, and the impact radius is small. A cluster in unhealthy state has at least one node
where a high percentage of volume attachments are failed, indicating a more serious incident.

## Troubleshooting

This alert may be seen at the same time as the `ControlPlaneStorageConnectivityUnhealthyVIP` alert. In this
case, the lost connectivity on the storage control plane is likely the cause of the failed attachments. You
should follow the [Troubleshooting guide for that issue]. If after resolving that incident, this alert persists,
return to this guide.

If control plane connectivity issues are not the root cause, you should raise a ticket with Microsoft, quoting the
text of this troubleshooting guide, and the Azure resource ID of the affected cluster.

[Troubleshooting guide for that issue]: ./troubleshoot-storage-control-plane-disconnected.md
