---
title: Port whitelist for Avere vFXT for Azure
description: List of ports used by the Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---

# Required ports

The ports listed in this section are used for vFXT inbound and outbound communication.

Never expose the vFXT cluster or the cluster controller instance directly to the public internet.

## API

| Inbound: | | |
| --- | ---- | --- |
| TCP | 22  | SSH  |
| TCP | 443 | HTTPS|



| Outbound: |     |       |
|----------|-----|-------|
| TCP      | 443 | HTTPS |

 
## NFS

| Inbound and Outbound  | | |
| --- | --- | ---|
| TCP/UDP | 111  | RPCBIND  |
| TCP/UDP | 2049 | NFS      |
| TCP/UDP | 4045 | NLOCKMGR |
| TCP/UDP | 4046 | MOUNTD   |
| TCP/UDP | 4047 | STATUS   |

