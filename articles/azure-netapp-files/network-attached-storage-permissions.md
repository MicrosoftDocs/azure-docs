---
title: Understand NAS permissions in Azure NetApp Files | Microsoft Docs
description: Learn about NAS permissions options in Azure NetApp Files.   
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
ms.date: 10/19/2023
ms.author: anfdocs
---

# Understand NAS permissions in Azure NetApp Files

Azure NetApp Files provides several ways to secure your NAS data. One aspect of that security is permissions. In NAS, permissions can be broken down into two categories: 

* **Share access permissions** limit who can mount a NAS volume. NFS controls this via IP address or hostname. SMB controls this via user and group ACLs. 
* **File access permissions** limit what users and groups can do once a NAS volume is mounted. File access permissions are applied to individual files and folders. 

Azure NetApp Files permissions rely on NAS standards, simplifying the process of security NAS volumes for administrators and end users with familiar methods. 

>[!NOTE]
>If conflicting permissions are listed on share and files, the most restrictive permission is applied. For instance, if a user has read only access at the *share* level and full control at the *file* level, the user receives read access at all levels.

## Share access permissions 

The initial entry point to be secured in a NAS environment is access to the share itself. In most cases, access should be restricted to shares to only the users and groups that need access to the share. With share access permissions, you can lock down who can even mount the share in the first place.  

Since the most restrictive permissions override other permissions, and a share is the main entry point to the volume (with the fewest amount of access controls), share permissions should use a "funnel" format where the share allows more access than the underlying files and folders. The funnel format enacts more granular, restrictive controls. 

:::image type="content" source="../media/azure-netapp-files/shares-pyramid.png" alt-text="Diagram of inverted pyramid of file access hierarchy." lightbox="../media/azure-netapp-files/shares-pyramid.png":::

## NFS export policies 

Volumes in Azure NetApp Files are shared out to NFS clients by exporting a path that is accessible to a client or set of clients. Both NFSv3 and NFSv4.x use the same method to limit access to an NFS share in Azure NetApp Files: export policies. 

An export policy is a container for a set of access rules that are listed in order of desired access. These rules control access to NFS shares by using client IP addresses or subnets. If a client is not listed in an export policy rule--either allowing or explicitly denying access--then that client is unable to mount the NFS export. Since the rules are read in sequential order, if a more restrictive policy rules is applied to a client (for example, by way of a subnet), then it will be read and applied first. Subsequent policy rules that allow more access will be ignored. This diagram shows a client that has an IP of 10.10.10.10 getting read-only access to a volume because the subnet 0.0.0.0/0 (every client in every subnet) is set to read-only and is listed first in the policy. 


:::image type="content" source="../media/azure-netapp-files/export-policy-diagram.png" alt-text="Diagram modeling export policy rule hierarchy." lightbox="../media/azure-netapp-files/export-policy-diagram.png":::

### Export policy rule options available in Azure NetApp Files

When creating an Azure NetApp Files volume, there are several options configurable for control of access to NFS volumes.

* **Index**: The order in which an export policy rule will be evaluated. If a client falls under multiple rules in the policy, then the first applicable rule will apply to the client and subsequent rules will be ignored.
* **Allowed clients**: Specifies which clients a rule applies to. This value can be a client IP address, a comma-separated list of IP addresses, or a subnet including multiple clients. The hostname and netgroup values are not supported in Azure NetApp Files.
* **Access**: Specifies the level of access allowed to non-root users. For NFS volumes without Kerberos enabled, the options are: Read only, Read & write, or No access. For volumes with Kerberos enabled, the options are: Kerberos 5, Kerberos 5i, or Kerberos 5p.
* **Root access**: Specifies how the root user is treated in NFS exports for a given client. If set to "On," the root is root. If set to "Off," the [root is squashed](../hpc-cache/access-policies.md#root-squash) to the anonymous user ID 65534. 
* **chown mode**: This controls what users can run change ownership commands on the export (chown). If set to "Restricted," only the root user can run chown. If set to "Unrestricted," any user with the proper file/folder permissions can run chown commands.

### Default policy rule in Azure NetApp Files

When creating a new volume, a default policy rule is created. The default policy prevents a scenario where a volume is created without policy rules, which would restrict access for any client attempting access to the export. (No rules means no access).

The default rule has the following values:

* Index = 1
* Allowed clients = 0.0.0.0/0 (all clients allowed access)
* Access = Read & write
* Root access = On
* Chown mode = Restricted

These values can be changed at volume creation or after the volume has been created.


