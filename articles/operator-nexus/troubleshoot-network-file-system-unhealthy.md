---
title: Troubleshoot unhealthy NFS pods
description: Troubleshooting Azure Resource Health alerts about NFS
author: jensheasby
ms.author: jensheasby
ms.date: 07/21/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshoot unhealthy NFS pods - Azure Resource Health

This article provides troubleshooting advice and escalation methods for Operator Nexus clusters that are
reporting unhealthy Network File System (NFS) pods in Azure Resource Health.

## Symptoms

This alert indicates problems with NFS in the cluster. NFS is responsible for control plane and data plane
operations for `nexus-shared` volumes in the tenant layer. Therefore, if a cluster has unhealthy NFS pods,
existing `nexus-shared` volumes may experience data plane disruption, and new `nexus-shared` volumes may
fail to be created.

## Troubleshoot

You should raise a ticket with Microsoft, quoting the text of this troubleshooting guide, and the Azure
resource ID of the affected cluster.
