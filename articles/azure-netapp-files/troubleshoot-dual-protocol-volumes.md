---
title: Troubleshoot dual-protocol volumes for Azure NetApp Files | Microsoft Docs
description: Describes error messages and resolutions that can help you troubleshoot dual-protocol issues for Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: troubleshooting
ms.date: 10/01/2020
ms.author: b-juche
---
# Troubleshoot dual-protocol volumes

This article describes resolutions to error conditions you might have when creating or managing dual-protocol volumes.

## Error conditions and resolutions

|     Error conditions    |     Resolution    |
|-|-|
| Dual-protocol volume creation fails with the error `This Active Directory has no Server root CA Certificate`.    |     If this error occurs when you are creating a dual-protocol volume, make sure that the root CA certificate is uploaded in your NetApp account.    |
| Dual-protocol volume creation fails with the error `Failed to validate LDAP configuration, try again after correcting LDAP configuration`.    |  Consider the following resolutions:   <ul><li>Make sure that the required root certificate is added when you join Active Directory (AD) to the NetApp account. See [Upload Active Directory Certificate Authority public root certificate](create-volumes-dual-protocol.md#upload-active-directory-certificate-authority-public-root-certificate).   </li><li>The pointer (PTR) record of the AD host machine might be missing on the DNS server. You need to create a reverse lookup zone on the DNS server, and then add a PTR record of the AD host machine in that reverse lookup zone. <br> For example, assume that the IP address of the AD machine is `1.1.1.1`, the hostname of the AD machine (as found by using the `hostname` command) is `AD1`, and the domain name is `myDomain.com`.  The PTR record added to the reverse lookup zone should be `1.1.1.1` -> `AD1.myDomain.com`. </li></ul>  |
| Dual-protocol volume creation fails with the error `Failed to create the Active Directory machine account \\\"TESTAD-C8DD\\\". Reason: Kerberos Error: Pre-authentication information was invalid Details: Error: Machine account creation procedure failed\\n [ 434] Loaded the preliminary configuration.\\n [ 537] Successfully connected to ip 1.1.1.1, port 88 using TCP\\n**[ 950] FAILURE`. | 	This error indicates that the AD password is incorrect when Active Directory is joined to the NetApp account. Update the AD connection with the correct password and try again. |
| Dual-protocol volume creation fails with the error `Could not query DNS server. Verify that the network configuration is correct and that DNS servers are available`. | 	This error indicates that DNS is not reachable. The reason might be because DNS IP is incorrect, or there is a networking issue. Check the DNS IP entered in AD connection and make sure that the IP is correct. <br> Also, make sure that the AD and the volume are in same region and in same VNet. If they are in different VNETs, ensure that VNet peering is established between the two VNets.|
| Permission is denied error when mounting a dual-protocol volume. | A dual-protocol volume supports both the NFS and SMB protocols.  When you try to access the mounted volume on the UNIX system, the system attempts to map the UNIX user you use to a Windows user. If no mapping is found, the “Permission denied” error occurs. <br> This situation applies also when you use the ‘root’ user for the access. <br> To avoid the “Permission denied” issue, make sure that Windows Active Directory includes `pcuser` before you access the mount point. If you add `pcuser` after encountering the “Permission denied” issue, wait 24 hours for the cache entry to clear before trying the access again. |

## Next steps  

* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
* [Configure an NFS client for Azure NetApp Files](configure-nfs-clients.md)
