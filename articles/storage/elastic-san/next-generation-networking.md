---
title: Azure Elastic SAN Next Generation networking overview
description: Learn how networking works in Azure Elastic SAN Next Generation, including which QoS tiers use Direct Attach or iSCSI connectivity and when network configuration is required.
author: normesta
ms.service: azure-elastic-san
ms.topic: concept-article
ms.date: 11/06/2026
ms.author: normesta
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell
---

# Networking for Elastic SAN Next Generation

Azure Elastic SAN Next Generation offers three QoS tiers. The QoS tier of a volume group determines how clients connect to its volumes, and whether you need to configure networking.

## Connectivity types by QoS tier

| QoS tier | Connectivity type | Network configuration |
|---|---|---|
| Business Critical | Direct Attach | Not required |
| General Purpose – Direct Attach | Direct Attach | Not required |
| General Purpose – iSCSI | iSCSI | Required |

## Direct Attach

Business Critical and General Purpose – Direct Attach volumes attach to VMs the same way Azure managed disks do, and appear to the VM as data disks. Microsoft manages the networking configuration that Direct Attach connectivity requires, so you don't need to configure virtual networks, endpoints, or network rules.

## iSCSI

General Purpose – iSCSI volumes are accessed over the iSCSI protocol. Each client needs an iSCSI initiator, and you configure access to the volume group through an Azure virtual network by using one of the following options:

- **Private endpoints** provide access from a virtual network subnet over a private IP address.
- **Storage service endpoints** provide access from a virtual network subnet. Storage service endpoints also require network rules on the volume group that allow the subnet.

### Plan client bandwidth

Elastic SAN iSCSI traffic uses VM network bandwidth. When you choose a VM for General Purpose – iSCSI volumes:

- Select a VM size with enough network bandwidth for production traffic, VM-to-VM traffic, and storage traffic together.
- Enable Accelerated Networking on supported VM sizes.
- Place clients and the SAN in the same region and availability zone when your workload design allows.

## Next steps

- [Networking for General Purpose iSCSI](elastic-san-networking.md)
- [Configure private endpoints for General Purpose iSCSI](elastic-san-configure-private-endpoints.md)
- [Configure service endpoints for General Purpose iSCSI](elastic-san-configure-service-endpoints.md)

