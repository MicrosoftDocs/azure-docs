---
title: 'Port list for Azure FXT Edge Filer'
description: List of the TCP/UDP ports used by FXT cluster environments
author: femila
ms.author: femila
ms.service: fxt-edge-filer
ms.topic: conceptual
ms.date: 05/26/2021
---

# Required network ports

This list shows TCP/UDP ports required by FXT cluster environments. Configure any firewalls you use to make sure these ports are accessible.

Your system's specific requirements will vary depending on what kind of back-end storage you use.

For more information, contact Microsoft Service and Support.

## API ports

| Direction | Type | Port number | Protocol |
|-----------|------|-------------|----------|
| Inbound   | TCP  | 22          | SSH      |
| Outbound  | TCP  | 80          | HTTP     |
| Inbound & outbound  | TCP  | 443         | HTTPS    |

## NFS ports

Inbound NFS ports:

| Type    | Port number | Service  |
|---------|-------------|----------|
| TCP/UDP | 111         | RPCBIND  |
| TCP/UDP | 2049        | NFS      |
| TCP/UDP | 4045        | NLOCKMGR |
| TCP/UDP | 4046        | MOUNTD   |
| TCP/UDP | 4047        | STATUS   |

Outbound NFS ports:

| Type    | Port number | Service  |
|---------|-------------|----------|
| TCP/UDP | 111         | RPCBIND  |
| TCP/UDP | 2049        | NFS      |

Outbound NFS port traffic varies depending on the kind of storage used as a core filer. (Some systems do not use port 2049, though it is common enough to be listed here. All clusters need access on port 111.) Check the documentation for your storage systems or use the query technique described below in [Additional port requirements](#additional-port-requirements).

Some outbound NFS traffic from FXT nodes uses ephemeral ports. Outbound FXT traffic above well-known ports should not be restricted at the transport level.

## SMB ports

| Direction | Type | Port number | Protocol |
|-----------|------|-------------|----------|
| Inbound & outbound  | UDP  | 137         | NetBIOS  |
| Inbound   | UDP  | 138         | NetBIOS  |
| Inbound & outbound  | TCP  | 139         | SMB      |
| Inbound & outbound  | TCP  | 445         | SMB      |

<!--| Outbound  | UDP  | 137         | NetBIOS  | 
| Outbound  | TCP  | 139         | SMB      |
| Outbound  | TCP  | 445         | SMB      |
-->

## General traffic ports

| Direction | Type    | Port number | Protocol |
|-----------|---------|-------------|----------|
| Outbound  | TCP/UDP | 53          | DNS      |
| Outbound  | TCP/UDP | 88          | Kerberos |
| Outbound  | UDP     | 123         | NTP      |
| Outbound  | TCP/UDP | 389         | LDAP     |
| Outbound  | TCP     | 686         | LDAPS    |

## Additional port requirements

Your core filers might require access on additional ports. This requirement varies depending on the type of storage used.

You can use the `rpcinfo` command to learn which ports are used by a particular server. Issue this command from a client system that is not firewalled:

`rpcinfo -p <server_IP_address>`

## Next steps

* Learn how to [add storage](add-storage.md) to the Azure FXT Edge Filer cluster
* [Contact support](support-ticket.md) to learn more about port configuration
