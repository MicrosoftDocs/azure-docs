---
title: Azure HPC Cache Security Information
description: Security information for Azure HPC Cache
author: ronhogue
ms.service: hpc-cache
ms.topic: how-to
ms.date: 04/06/2022
ms.author: rohogue
---

# Security information for Azure HPC Cache

This security information applies to Microsoft Azure HPC Cache. It addresses common security questions about the configuration and operation of Azure HPC Cache.

## Access to the HPC Cache service

The HPC Cache Service is only accessible through your private virtual network. Microsoft cannot access your virtual network.

Learn more about [connecting private networks](/security/benchmark/azure/baselines/hpc-cache-security-baseline).

## Network infrastructure requirements

Your network needs a dedicated subnet for the Azure HPC Cache, DNS support so the cache can access storage, and access from the subnet to additional Microsoft Azure infrastructure services like NTP servers and the Azure Queue Storage service.

Learn more about [network infrastructure requirements](hpc-cache-prerequisites.md#network-infrastructure).

## Access to NFS storage

The Azure HPC Cache needs specific NFS configurations like outbound NFS port access to on-premises storage.

Learn more about [configuring your NFS storage](hpc-cache-prerequisites.md#nfs-storage-requirements) to work with Azure HPC Cache.

## Encryption

HPC Cache data is encrypted at rest. Encryption keys may be Azure-managed or customer-managed.

Learn more about [implementing customer-managed keys](customer-keys.md).

HPC Cache only supports AUTH_SYS security for NFSv3 so it’s not possible to encrypt NFS traffic between clients and the cache. If, however, data is traveling over ExpressRoute, you could [tunnel traffic with IPSEC](../virtual-wan/vpn-over-expressroute.md) for in-transit traffic encryption.

## Access policies based on IP address

You can set CIDR blocks to allow the following access control policies: none, read, read/write, and squashed.

Learn more how to [configure access policies](access-policies.md) based on IP addresses.

You can also optionally configure network security groups (NSGs) to control inbound access to the HPC Cache subnet. This restricts which IP addresses are routed to the HPC Cache subnet.

## Next steps

* Review [Azure HPC Cache security baseline](/security/benchmark/azure/baselines/hpc-cache-security-baseline).
