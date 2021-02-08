---
title: 'Port list for Azure FXT Edge Filer'
description: List of the TCP/UDP ports used by FXT cluster environments
author: ekpgh
ms.author: v-erkel
ms.service: fxt-edge-filer
ms.topic: conceptual
ms.date: 02/08/2021
---

# Required network ports

This list shows TCP/UDP ports required by FXT cluster environments. For more information, contact Microsoft Service and Support.

## API ports

| Direction | Type | Port number | Protocol |
|-----------|------|-------------|----------|
| Inbound   | TCP  | 22          | SSH      |
| Inbound   | TCP  | 443         | HTTPS    |
| Outbound  | TCP  | 80          | HTTP     |
| Outbound  | TCP  | 443         | HTTPS    |

## NFS ports

These ports are used for traffic from the FXT cluster to network attached storage:

| Type    | Port number | Protocol |
|---------|-------------|----------|
| TCP/UDP | 111         | RPCBIND  |
| TCP/UDP | 2049        | NFS      |

Outbound NFS traffic from FXT nodes uses ephemeral ports. Outbound FXT traffic above well-known ports should not be restricted at the transport level.

## SMB ports

| Direction | Type | Port number | Protocol |
|-----------|------|-------------|----------|
| Inbound   | TCP  | 445         | SMB      |
| Inbound   | TCP  | 139         | SMB      |
| Inbound   | UDP  | 137         | NetBIOS  |
| Inbound   | UDP  | 138         | NetBIOS  |
| Outbound  | TCP  | 445         | SMB      |
| Outbound  | TCP  | 139         | SMB      |
| Outbound  | UDP  | 137         | NetBIOS  |

## General Traffic Ports

| Direction | Type    | Port number | Protocol |
|-----------|---------|-------------|----------|
| Outbound  | TCP/UDP | 53          | DNS      |
| Outbound  | TCP/UDP | 389         | LDAP     |
| Outbound  | TCP     | 686         | LDAPS    |
| Outbound  | TCP/UDP | 88          | Kerberos |
| Outbound  | UDP     | 123         | NTP      |
