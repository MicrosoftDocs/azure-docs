---
title: Enable Guest RDMA (Preview) on Azure Boost VMs
description: Learn how to enable Guest RDMA on Azure Boost VMs, including Linux requirements, ARM template setup, supported VM sizes, and live migration guidance.
ms.date: 11/16/2026
author: mengxiwuu
ms.author: mengxiwu
ms.reviewer: mengxiwu
ms.topic: overview
ms.service: azure-virtual-network
---

# What is Remote direct memory access (RDMA)?

Remote direct memory access (RDMA) is a networking technology that enables direct memory access between machines without involving the CPU or operating system kernel. Instead of passing data through the traditional TCP/IP stack, RDMA offloads data movement to the network interface card (NIC), allowing applications to read or write remote memory directly.

## Enabling RDMA in guest VMs

To enable Guest RDMA, create VMs using the following guidelines:

- **Recommended Linux distribution:** Ubuntu 24.04 LTS
- **Required user-space packages:** `rdma-core` version 50.0-2ubuntu0.2 or later
- **Supported kernel:** 6.8.0-1044-azure or later. Use 6.17 if available.

### ARM template enablement

To enable Guest RDMA, add these settings to each NIC resource that requires Guest RDMA:

```json
{
  "type": "Microsoft.Network/networkInterfaces",
  "apiVersion": "2026-07-01",
  "properties": {
    "enableAcceleratedNetworking": true,
    "enableGuestRdma": true
  }
}
```

## Supported VM sizes

Supported VM sizes include Azure Boost VM sizes built on Intel's 5th Generation Xeon® Platinum 8573C (Emerald Rapids) processor and AMD's 5th Generation EPYC™ 9005 processor. These sizes include general-purpose, memory-optimized, compute-optimized, storage-optimized, network-optimized, and remote storage-optimized families.

| CPU | Family | Series |
|---|---|---|
| Intel | General purpose | Dlsv6, Dldsv6, Dsv6, Ddsv6 |
| Intel | Memory optimized | Esv6, Edsv6 |
| Intel | Storage optimized | Lsv4 |
| Intel | Network optimized | Dnlsv6, Dnldsv6, Dnsv6, Dndsv6, Ensv6, Endsv6 |
| Intel | Remote storage optimized | Ebsv6, Ebdsv6 |
| Intel | Compute optimized | FXmsv2, FXmdsv2 |
| AMD | General purpose | Dalsv7, Daldsv7, Dasv7, Dadsv7 |
| AMD | Memory optimized | Easv7, Eadsv7 |
| AMD | Compute optimized | Falsv7, Faldsv7 |
| AMD | Storage optimized | Lasv5, Laosv5 |

## Live migration

During platform updates or predicted hardware failures, Azure might live migrate VMs. For Guest RDMA VMs, this migration can temporarily disrupt RDMA connections. Use Azure [Scheduled Events](/azure/virtual-machines/scheduled-events-overview) to detect upcoming live migrations and automate RDMA connection teardown and reconnection before and after the migration.

