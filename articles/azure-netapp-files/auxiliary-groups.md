---
title: Understand auxiliary/supplemental groups with NFS in Azure NetApp Files
description: Learn about auxiliary/supplemental groups with NFS in Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 11/13/2023
ms.author: anfdocs
---

# Understand auxiliary/supplemental groups with NFS in Azure NetApp Files

NFS has a specific limitation for the maximum number of auxiliary GIDs (secondary groups) that can be honored in a single NFS request. The maximum for [AUTH_SYS/AUTH_UNIX](http://tools.ietf.org/html/rfc5531) is 16. For AUTH_GSS (Kerberos), the maximum is 32. This is a known protocol limitation of NFS. 

Azure NetApp Files provides the ability to increase the maximum number of auxiliary groups to 1,024. This is performed by avoiding truncation of the group list in the NFS packet by prefetching the requesting user’s group from a name service, such as LDAP.

## How it works 

The options to extend the group limitation work the same way the `-manage-gids` option for other NFS servers works. Rather than dumping the entire list of auxiliary GIDs a user belongs to, the option looks up the GID on the file or folder and returns that value instead.

The [command reference for `mountd`](http://man.he.net/man8/mountd) notes:

```bash
-g or --manage-gids 

Accept requests from the kernel to  map  user  id  numbers  into lists  of group  id  numbers for use in access control.  An NFS request will normally except when using Kerberos or other cryptographic  authentication)  contains  a  user-id  and  a list of group-ids.  Due to a limitation in the NFS protocol, at most  16 groups ids can be listed.  If you use the -g flag, then the list of group ids received from the client will be replaced by a list of  group ids determined by an appropriate lookup on the server.
```

When an access request is made, only 16 GIDs are passed in the RPC portion of the packet.

:::image type="content" source="../media/azure-netapp-files/packet-output.png" alt-text="Output of RPC packet with 16 GIDs." lightbox="../media/azure-netapp-files/packet-output.png":::

Any GID beyond the limit of 16 is dropped by the protocol. Extended GIDs in Azure NetApp Files can only be used with external name services such as LDAP.

## Potential performance impacts 

Extended groups have a minimal performance penalty, generally in the low single digit percentages. Higher metadata NFS workloads would likely have more effect, particularly on the system’s caches. Performance can also be affected by the speed and workload of the name service servers. Overloaded name service servers are slower to respond, causing delays in prefetching the GID. For best results, use multiple name service servers to handle large numbers of requests.

## “Allow local users with LDAP” option

When a user attempts to access an Azure NetApp Files volume via NFS, the request comes in a numeric ID. By default, Azure NetApp Files supports extended group memberships for NFS users (to go beyond the standard 16 group limit to 1,024). As a result, Azure NetApp files attempts to look up the numeric ID in LDAP in an attempt to resolve the group memberships for the user rather than passing the group memberships in an RPC packet.

Due to that behavior, if that numeric ID can't be resolved to a user in LDAP, the lookup fails and access is denied, even if the requesting user has permission to access the volume or data structure.

The [Allow local NFS users with LDAP option](configure-ldap-extended-groups.md) in Active Directory connections is intended to disable those LDAP lookups for NFS requests by disabling the extended group functionality. It doesn't provide “local user creation/management” within Azure NetApp Files.

For more information about the option, including how it behaves with different volume security styles in Azure NetApp files, see [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md).

## Next steps

* [Understand the use of LDAP with Azure NetApp Files](lightweight-directory-access-protocol.md)
* [Allow local NFS users with LDAP option](configure-ldap-extended-groups.md)