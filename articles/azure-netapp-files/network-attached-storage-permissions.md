---
title: Understand NAS share permissions in Azure NetApp Files
description: Learn about NAS share permissions options in Azure NetApp Files.   
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

# Understand NAS share permissions in Azure NetApp Files

Azure NetApp Files provides several ways to secure your NAS data. One aspect of that security is permissions. In NAS, permissions can be broken down into two categories: 

* **Share access permissions** limit who can mount a NAS volume. NFS controls share access permissions via IP address or hostname. SMB controls this via user and group access control lists (ACLs). 
* **[File access permissions](network-attached-file-permissions.md)** limit what users and groups can do once a NAS volume is mounted. File access permissions are applied to individual files and folders. 

Azure NetApp Files permissions rely on NAS standards, simplifying the process of security NAS volumes for administrators and end users with familiar methods. 

>[!NOTE]
>If conflicting permissions are listed on share and files, the most restrictive permission is applied. For instance, if a user has read only access at the *share* level and full control at the *file* level, the user receives read access at all levels.

## Share access permissions 

The initial entry point to be secured in a NAS environment is access to the share itself. In most cases, access should be restricted to only the users and groups that need access to the share. With share access permissions, you can lock down who can even mount the share in the first place.  

Since the most restrictive permissions override other permissions, and a share is the main entry point to the volume (with the fewest access controls), share permissions should abide by a funnel logic, where the share allows more access than the underlying files and folders. The funnel logic enacts more granular, restrictive controls. 

:::image type="content" source="../media/azure-netapp-files/shares-pyramid.png" alt-text="Diagram of inverted pyramid of file access hierarchy." lightbox="../media/azure-netapp-files/shares-pyramid.png":::

## NFS export policies 

Volumes in Azure NetApp Files are shared out to NFS clients by exporting a path that is accessible to a client or set of clients. Both NFSv3 and NFSv4.x use the same method to limit access to an NFS share in Azure NetApp Files: export policies. 

An export policy is a container for a set of access rules that are listed in order of desired access. These rules control access to NFS shares by using client IP addresses or subnets. If a client isn't listed in an export policy rule—either allowing or explicitly denying access—then that client is unable to mount the NFS export. Since the rules are read in sequential order, if a more restrictive policy rule is applied to a client (for example, by way of a subnet), then it's read and applied first. Subsequent policy rules that allow more access are ignored. This diagram shows a client that has an IP of 10.10.10.10 getting read-only access to a volume because the subnet 0.0.0.0/0 (every client in every subnet) is set to read-only and is listed first in the policy. 

:::image type="content" source="../media/azure-netapp-files/export-policy-diagram.png" alt-text="Diagram modeling export policy rule hierarchy." lightbox="../media/azure-netapp-files/export-policy-diagram.png":::

### Export policy rule options available in Azure NetApp Files

When creating an Azure NetApp Files volume, there are several options configurable for control of access to NFS volumes.

* **Index**: specifies the order in which an export policy rule is evaluated. If a client falls under multiple rules in the policy, then the first applicable rule applies to the client and subsequent rules are ignored.
* **Allowed clients**: specifies which clients a rule applies to. This value can be a client IP address, a comma-separated list of IP addresses, or a subnet including multiple clients. The hostname and netgroup values aren't supported in Azure NetApp Files.
* **Access**: specifies the level of access allowed to non-root users. For NFS volumes without Kerberos enabled, the options are: Read only, Read & write, or No access. For volumes with Kerberos enabled, the options are: Kerberos 5, Kerberos 5i, or Kerberos 5p.
* **Root access**: specifies how the root user is treated in NFS exports for a given client. If set to "On," the root is root. If set to "Off," the [root is squashed](#root-squashing) to the anonymous user ID 65534. 
* **chown mode**: controls what users can run change ownership commands on the export (chown). If set to "Restricted," only the root user can run chown. If set to "Unrestricted," any user with the proper file/folder permissions can run chown commands.

### Default policy rule in Azure NetApp Files

When creating a new volume, a default policy rule is created. The default policy prevents a scenario where a volume is created without policy rules, which would restrict access for any client attempting access to the export. If there are no rules, there is no access. 

The default rule has the following values:

* Index = 1
* Allowed clients = 0.0.0.0/0 (all clients allowed access)
* Access = Read & write
* Root access = On
* Chown mode = Restricted

These values can be changed at volume creation or after the volume has been created.

### Export policy rules with NFS Kerberos enabled in Azure NetApp Files

[NFS Kerberos](configure-kerberos-encryption.md) can be enabled only on volumes using NFSv4.1 in Azure NetApp Files. Kerberos provides added security by offering different modes of encryption for NFS mounts, depending on the Kerberos type in use.

When Kerberos is enabled, the values for the export policy rules change to allow specification of which Kerberos mode should be allowed. Multiple Kerberos security modes can be enabled in the same rule if you need access to more than one. 

Those security modes include:

* **Kerberos 5**: Only initial authentication is encrypted.
* **Kerberos 5i**: User authentication plus integrity checking.
* **Kerberos 5p**: User authentication, integrity checking and privacy. All packets are encrypted.

Only Kerberos-enabled clients are able to access volumes with export rules specifying Kerberos; no `AUTH_SYS` access is allowed when Kerberos is enabled.

### Root squashing 

There are some scenarios where you want to restrict root access to an Azure NetApp Files volume. Since root has unfettered access to anything in an NFS volume – even when explicitly denying access to root using mode bits or ACLs—the only way to limit root access is to tell the NFS server that root from a specific client is no longer root.

In export policy rules, select "Root access: off" to squash root to a non-root, anonymous user ID of 65534. This means that the root on the specified clients is now user ID 65534 (typically `nfsnobody` on NFS clients) and has access to files and folders based on the ACLs/mode bits specified for that user. For mode bits, the access permissions generally fall under the “Everyone” access rights. Additionally, files written as “root” from clients impacted by root squash rules create files and folders as the `nfsnobody:65534` user. If you require root to be root, set "Root access" to "On."

To learn more about managing export policies, see [Configure export policies for NFS or dual-protocol volumes](azure-netapp-files-configure-export-policy.md).

#### Export policy rule ordering

The order of export policy rules determines how they are applied. The first rule in the list that applies to an NFS client is the rule used for that client. When using CIDR ranges/subnets for export policy rules, an NFS client in that range may receive unwanted access due to the range in which it's included.

Consider the following example:

:::image type="content" source="../media/azure-netapp-files/export-policy-rule-sequence.png" alt-text="Screenshot of two export policy rules." lightbox="../media/azure-netapp-files/export-policy-rule-sequence.png":::

- The first rule in the index includes *all clients* in *all subnets* by way of the default policy rule using 0.0.0.0/0 as the **Allowed clients** entry. That rule allows “Read & Write” access to all clients for that Azure NetApp Files NFSv3 volume.
- The second rule in the index explicitly lists NFS client 10.10.10.10 and is configured to limit access to “Read only,” with no root access (root is squashed).

As it stands, the client 10.10.10.10 receives access due to the first rule in the list. The next rule is never be evaluated for access restrictions, thus 10.10.10.10 get Read & Write access even though “Read only” is desired. Root is also root, rather than [being squashed](#root-squashing).

To fix this and set access to the desired level, the rules can be re-ordered to place the desired client access rule above any subnet/CIDR rules. You can reorder export policy rules in the Azure portal by dragging the rules or using the **Move** commands in the `...` menu in the row for each export policy rule. 

>[!NOTE]
>You can use the [Azure NetApp Files CLI or REST API](azure-netapp-files-sdk-cli.md) only to add or remove export policy rules. 

## SMB shares 

SMB shares enable end users can access SMB or dual-protocol volumes in Azure NetApp Files. Access controls for SMB shares are limited in the Azure NetApp Files control plane to only SMB security options such as access-based enumeration and non-browsable share functionality. These security options are configured during volume creation with the **Edit volume** functionality. 

:::image type="content" source="../media/azure-netapp-files/share-level-permissions.png" alt-text="Screenshot of share-level permissions." lightbox="../media/azure-netapp-files/share-level-permissions.png":::

Share-level permission ACLs are managed through a Windows MMC console rather than through Azure NetApp Files.

### Security-related share properties

Azure NetApp Files offers multiple share properties to enhance security for administrators. 

#### Access-based enumeration 

[Access-based enumeration](azure-netapp-files-create-volumes-smb.md#access-based-enumeration) is an Azure NetApp Files SMB volume feature that limits enumeration of files and folders (that is, listing the contents) in SMB only to users with allowed access on the share. For instance, if a user doesn't have access to read a file or folder in a share with access-based enumeration enabled, then the file or folder doesn't show up in directory listings. In the following example, a user (`smbuser`) doesn't have access to read a folder named “ABE” in an Azure NetApp Files SMB volume. Only `contosoadmin` has access.

:::image type="content" source="../media/azure-netapp-files/access-based-enumeration-properties.png" alt-text="Screenshot of access-based enumeration properties." lightbox="../media/azure-netapp-files/access-based-enumeration-properties.png":::

In the below example, access-based enumeration is disabled, so the user has access to the `ABE` directory of `SMBVolume`.

:::image type="content" source="../media/azure-netapp-files/directory-listing-no-access.png" alt-text="Screenshot of directory without access-bassed enumeration." lightbox="../media/azure-netapp-files/directory-listing-no-access.png":::

In the next example, access-based enumeration is enabled, so the `ABE` directory of `SMBVolume` doesn't display for the user.

:::image type="content" source="../media/azure-netapp-files/directory-listing-access.png" alt-text="Screenshot of directory with two sub-directories." lightbox="../media/azure-netapp-files/directory-listing-access.png":::

The permissions also extend to individual files. In the below example, access-based enumeration is disabled and `ABE-file` displays to the user. 

:::image type="content" source="../media/azure-netapp-files/file-with-access.png" alt-text="Screenshot of directory with two-files." lightbox="../media/azure-netapp-files/file-with-access.png":::

With access-based enumeration enabled, `ABE-file` doesn't display to the user. 

:::image type="content" source="../media/azure-netapp-files/file-no-access.png" alt-text="Screenshot of directory with one file." lightbox="../media/azure-netapp-files/file-no-access.png":::

#### Non-browsable shares

The non-browsable shares feature in Azure NetApp Files limits clients from browsing for an SMB share by hiding the share from view in Windows Explorer or when listing shares in "net view." Only end users that know the absolute paths to the share are able to find the share. 

In the following image, the non-browsable share property isn't enabled for `SMBVolume`, so the volume displays in the listing of the file server (using `\\servername`).

:::image type="content" source="../media/azure-netapp-files/directory-with-smb-volume.png" alt-text="Screenshot of a directory that includes folder SMBVolume." lightbox="../media/azure-netapp-files/directory-with-smb-volume.png":::

With non-browsable shares enabled on `SMBVolume` in Azure NetApp Files, the same view of the file server excludes `SMBVolume`.

In the next image, the share `SMBVolume` has non-browsable shares enabled in Azure NetApp Files. When that is enabled, this is the view of the top level of the file server.

:::image type="content" source="../media/azure-netapp-files/directory-no-smb-volume.png" alt-text="Screenshot of a directory with two sub-directories." lightbox="../media/azure-netapp-files/directory-no-smb-volume.png":::

Even though the volume in the listing cannot be seen, it remains accessible if the user knows the file path. 

:::image type="content" source="../media/azure-netapp-files/smb-volume-file-path.png" alt-text="Screenshot of Windows Explorer with file path highlighted." lightbox="../media/azure-netapp-files/smb-volume-file-path.png":::

#### SMB3 Encryption

SMB3 encryption is an Azure NetApp Files SMB volume feature that enforces encryption over the wire for SMB clients for greater security in NAS environments. The following image shows a screen capture of network traffic when SMB encryption is disabled. Sensitive information—such as file names and file handles—is visible.

:::image type="content" source="../media/azure-netapp-files/packet-capture-encryption.png" alt-text="Screenshot of packet capture with SMB encryption disabled." lightbox="../media/azure-netapp-files/packet-capture-encryption.png":::

When SMB Encryption is enabled, the packets are marked as encrypted, and no sensitive information can be seen. Instead, it’s shown as "Encrypted SMB3 data."

:::image type="content" source="../media/azure-netapp-files/packet-capture-encryption-enabled.png" alt-text="Screenshot of packet capture with SMB encryption enabled." lightbox="../media/azure-netapp-files/packet-capture-encryption-enabled.png":::

#### SMB share ACLs

SMB shares can control access to who can mount and access a share, as well as control access levels to users and groups in an Active Directory domain. The first level of permissions that get evaluated are share access control lists (ACLs). 

SMB share permissions are more basic than file permissions: they only apply read, change or full control. Share permissions can be overridden by file permissions and file permissions can be overridden by share permissions; the most restrictive permission is the one abided by. For instance, if the group “Everyone” is given full control on the share (the default behavior), and specific users have read-only access to a folder via a file-level ACL, then read access is applied to those users. Any other users not listed explicitly in the ACL have full control 

Conversely, if the share permission is set to “Read” for a specific user, but the file-level permission is set to full control for that user, “Read” access is enforced.

In dual-protocol NAS environments, SMB share ACLs only apply to SMB users. NFS clients leverage export policies and rules for share access rules. As such, controlling permissions at the file and folder level is preferred over share-level ACLs, especially for dual=protocol NAS volumes.

To learn how to configure ACLs, see [Manage SMB share ACLs in Azure NetApp Files](manage-smb-share-acls.md).



## Next steps

* [Configure export policy for NFS or dual-protocol volumes](azure-netapp-files-configure-export-policy.md)
* [Understand NAS](network-attached-storage-concept.md)
* [Understand NAS permissions](network-attached-storage-permissions.md)
* [Manage SMB share ACLs in Azure NetApp Files](manage-smb-share-acls.md)
