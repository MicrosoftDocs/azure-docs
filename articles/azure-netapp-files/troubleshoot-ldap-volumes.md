---
title: Troubleshoot LDAP volume issues for Azure NetApp Files | Microsoft Docs
description: Describes resolutions to error conditions that you might have when configuring LDAP volumes for Azure NetApp Files. 
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
ms.date: 03/23/2021
ms.author: b-juche
---
# Troubleshoot LDAP volume issues

This article describes resolutions to error conditions you might have when configuring LDAP volumes.

## Errors and resolutions for LDAP volumes

|     Error conditions    |     Resolutions    |
|-|-|
| Error when creating an SMB volume with ldapEnabled as true: <br> `Error Message: ldapEnabled option is only supported with NFS protocol volume. ` | You cannot create an SMB volume with LDAP enabled. <br> Create SMB volumes with LDAP disabled. |
| Error when updating the ldapEnabled parameter value for an existing volume: <br> `Error Message: ldapEnabled parameter is not allowed to update` |  You cannot modify the LDAP option setting after creating a volume. <br> Do not update the LDAP option setting on a created volume. See [Configure ADDS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md) for details. |
| Error when creating an LDAP-enabled NFS volume: <br> `Could not query DNS server` <br> `Sample error message:` <br> `"log": time="2020-10-21 05:04:04.300" level=info msg=Res method=GET url=/v2/Volumes/070d0d72-d82c-c893-8ce3-17894e56cea3  x-correlation-id=9bb9e9fe-abb6-4eb5-a1e4-9e5fbb838813 x-request-id=c8032cb4-2453-05a9-6d61-31ca4a922d85 xresp="200:  {\"created\":\"2020-10-21T05:02:55.000Z\",\"lifeCycleState\":\"error\",\"lifeCycleStateDetails\":\"Error when creating - Could not query DNS server. Verify that the network configuration is correct and that DNS servers are available.\",\"name\":\"smb1\",\"ownerId\ \":\"8c925a51-b913-11e9-b0de-9af5941b8ed0\",\"region\":\"westus2stage\",\"volumeId\":\"070d0d72-d82c-c893-8ce3-` |  This error occurs because DNS is unreachable. <br> <ul><li> Check if you have configured the correct site (site scoping) for Azure NetApp Files. </li><li> The reason that DNS is unreachable might be an incorrect DNS IP address or networking issues. Check the DNS IP address entered in the AD connection to make sure that it is correct. </li><li> Make sure that the AD and the volume are in the same region and the same VNet. If they are in different VNets, ensure that VNet peering is established between the two VNets.</li></ul> |
| Error when creating volume from a snapshot: <br> `Aggregate does not exist` | Azure NetApp Files doesn’t support provisioning a new, LDAP-enabled volume from a snapshot that belongs to an LDAP-disabled volume. <br> Try creating new an LDAP-disabled volume from the given snapshot. |

## Next steps  

* [Configure LDAP with extended groups for NFS](configure-ldap-extended-groups.md)
* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create a dual-protocol (NFSv3 and SMB) volume for Azure NetApp Files](create-volumes-dual-protocol.md)