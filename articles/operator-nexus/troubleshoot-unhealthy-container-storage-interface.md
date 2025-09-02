---
title: Troubleshoot unhealthy CSI (storage)
description: Troubleshooting Azure Resource Health alerts about unhealthy CSI pods (storage)
author: jensheasby
ms.author: jensheasby
ms.date: 07/21/2025
ms.topic: troubleshooting
ms.service: azure-operator-nexus
---

# Troubleshoot unhealthy CSI pods (storage) - Azure Resource Health

This article provides troubleshooting advice and escalation methods for Operator Nexus clusters that are
reporting unhealthy Container Storage Interface (CSI) pods in Azure Resource Health.

## Symptoms

This alert indicates that there are problems with the CSI pods in the undercloud cluster. These pods are
responsible for control plane operations for volumes in the undercloud. If these pods are unhealthy, workloads
relying on `nexus-volume` storage may fail to come up, or existing workloads may not be able to be migrated.
You may also experience issues provisioning new cloud services networks.

## Troubleshoot

You should raise a support ticket with Microsoft, quoting the text of this troubleshooting guide, and the Azure
resource ID of the affected cluster.
