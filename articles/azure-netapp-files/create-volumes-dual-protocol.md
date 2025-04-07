---
title: Create a dual-protocol volume for Azure NetApp Files | Microsoft Docs
description: Describes how to create a volume that uses the dual protocol (NFSv3 and SMB, or NFSv4.1 and SMB) with support for LDAP user mapping.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 12/11/2024
ms.author: anfdocs
---
# Create a dual-protocol volume for Azure NetApp Files

Azure NetApp Files supports creating volumes using NFS (NFSv3 or NFSv4.1), SMB3, or dual protocol (NFSv3 and SMB, or NFSv4.1 and SMB). This article shows you how to create a volume that uses dual protocol with support for LDAP user mapping. 

To create NFS volumes, see [Create an NFS volume](azure-netapp-files-create-volumes.md). To create SMB volumes, see [Create an SMB volume](azure-netapp-files-create-volumes-smb.md). 

## Before you begin 

[!INCLUDE [Delegated subnet permission](includes/create-volume-permission.md)]

>[!IMPORTANT]
>Windows Server 2025 currently doesn't work with the Azure NetApp Files SMB protocol. 

* You must have already created a capacity pool.  
    See [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md).   
* A subnet must be delegated to Azure NetApp Files.  
    See [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md).

## Considerations

* Ensure that you meet the [Requirements for Active Directory connections](create-active-directory-connections.md#requirements-for-active-directory-connections). 
* Create a reverse lookup zone on the DNS server and then add a pointer (PTR) record of the AD host machine in that reverse lookup zone. Otherwise, the dual-protocol volume creation fails.
* The **Allow local NFS users with LDAP** option in Active Directory connections intends to provide occasional and temporary access to local users. When this option is enabled, user authentication and lookup from the LDAP server stop working, and the number of group memberships that Azure NetApp Files supports is limited to 16.  As such, you should keep this option *disabled* on Active Directory connections, except for the occasion when a local user needs to access LDAP-enabled volumes. In that case, you should disable this option as soon as local user access is no longer required for the volume. See [Allow local NFS users with LDAP to access a dual-protocol volume](#allow-local-nfs-users-with-ldap-to-access-a-dual-protocol-volume) about managing local user access.
* Ensure that the NFS client is up to date and running the latest updates for the operating system.
* Dual-protocol volumes support both Active Directory Domain Services (AD DS) and Microsoft Entra Domain Services. 
* Dual-protocol volumes do not support the use of LDAP over TLS with [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md). LDAP over TLS is supported with Active Directory Domain Services (AD DS). See [LDAP over TLS considerations](configure-ldap-over-tls.md#considerations).
* The NFS version used by a dual-protocol volume can be NFSv3 or NFSv4.1. The following considerations apply:
    * Dual protocol does not support the Windows ACLS extended attributes `set/get` from NFS clients.
    * NFS clients cannot change permissions for the NTFS security style, and Windows clients cannot change permissions for UNIX-style dual-protocol volumes.   

        The following table describes the security styles and their effects:  
        
        | Security style 	| Clients that can modify permissions 	| Permissions that clients can use 	| Resulting effective security style 	| Clients that can access files 	|
        |-	|-	|-	|-	|-	|
        | `Unix` 	| NFS 	| NFSv3 or NFSv4.1 mode bits 	| UNIX 	| NFS and Windows	|
        | `Ntfs` 	| Windows 	| NTFS ACLs 	| NTFS 	|NFS and Windows|

    * The direction in which the name mapping occurs (Windows to UNIX, or UNIX to Windows) depends on which protocol is used and which security style is applied to a volume. A Windows client always requires a Windows-to-UNIX name mapping. Whether a user is applied to review permissions depends on the security style. Conversely, an NFS client only needs to use a UNIX-to-Windows name mapping if the NTFS security style is in use. 

        The following table describes the name mappings and security styles:  
    
        |     Protocol          |     Security style          |     Name-mapping direction          |     Permissions applied          |
        |-|-|-|-|
        |  SMB  |  `Unix`  |  Windows to UNIX  |  UNIX (mode bits or NFSv4.x ACLs)  |
        |  SMB  |  `Ntfs`  |  Windows to UNIX  |  NTFS ACLs (based on Windows SID accessing share)  |
        |  NFSv3  |  `Unix`  |  None  |  UNIX (mode bits or NFSv4.x ACLs) <br><br>  NFSv4.x ACLs can be applied using an NFSv4.x administrative client and honored by NFSv3 clients.  |
        |  NFS  |  `Ntfs`  |  UNIX to Windows  |  NTFS ACLs (based on mapped Windows user SID)  |

* The LDAP with extended groups feature supports the dual protocol of both [NFSv3 and SMB] and [NFSv4.1 and SMB] with the Unix security style. See [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md) for more information. 

* If you have large topologies, and you use the Unix security style with a dual-protocol volume or LDAP with extended groups, you should use the **LDAP Search Scope** option on the Active Directory Connections page to avoid "access denied" errors on Linux clients for Azure NetApp Files. See [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md#ldap-search-scope) for more information.

* You don't need a server root CA certificate for creating a dual-protocol volume. It is required only if LDAP over TLS is enabled.

* To understand Azure NetApp Files dual protocols and related considerations, see the [Dual Protocols section in Understand NAS protocols in Azure NetApp Files](network-attached-storage-protocols.md#dual-protocols).

## Create a dual-protocol volume

1.	Select the **Volumes** blade from the Capacity Pools blade. Select **+ Add volume** to create a volume. 

    ![Navigate to Volumes](./media/shared/azure-netapp-files-navigate-to-volumes.png) 

2.	In the Create a Volume window, select **Create**, and provide information for the following fields under the Basics tab:   
    * **Volume name**      
        Specify the name for the volume that you are creating.   

        Refer to [Naming rules and restrictions for Azure resources](../azure-resource-manager/management/resource-name-rules.md#microsoftnetapp) for naming conventions on volumes. Additionally, you can't use `default` or `bin` as the volume name.

    * **Capacity pool**  
        Specify the capacity pool where you want the volume to be created.

    * **Quota**  
        Specify the amount of logical storage that is allocated to the volume.  

        The **Available quota** field shows the amount of unused space in the chosen capacity pool that you can use towards creating a new volume. The size of the new volume must not exceed the available quota.  

    * **Large Volume**

        [!INCLUDE [Large volumes warning](includes/large-volumes-notice.md)]

    * **Throughput (MiB/S)**   
        If the volume is created in a manual QoS capacity pool, specify the throughput you want for the volume.   

        If the volume is created in an auto QoS capacity pool, the value displayed in this field is (quota x service level throughput).   

    * **Enable Cool Access**, **Coolness Period**, and **Cool Access Retrieval Policy**      
        These fields configure [Azure NetApp Files storage with cool access](cool-access-introduction.md). For descriptions, see [Manage Azure NetApp Files storage with cool access](manage-cool-access.md). 

    * **Virtual network**  
        Specify the Azure virtual network (VNet) from which you want to access the volume.  

        The VNet you specify must have a subnet delegated to Azure NetApp Files. Azure NetApp Files can be accessed only from the same VNet or from a VNet that is in the same region as the volume through VNet peering. You can also access the volume from  your on-premises network through Express Route.   

    * **Subnet**  
        Specify the subnet that you want to use for the volume.  
        The subnet you specify must be delegated to Azure NetApp Files. 
        
        If you haven't delegated a subnet, you can select **Create new** on the Create a Volume page. Then in the Create Subnet page, specify the subnet information, and select **Microsoft.NetApp/volumes** to delegate the subnet for Azure NetApp Files. In each VNet, only one subnet can be delegated to Azure NetApp Files.   
    
        ![Create subnet](./media/shared/azure-netapp-files-create-subnet.png)

    * **Network features**  
        In supported regions, you can specify whether you want to use **Basic** or **Standard** network features for the volume. See [Configure network features for a volume](configure-network-features.md) and [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) for details.

    * **Encryption key source** 
        You can select `Microsoft Managed Key` or `Customer Managed Key`. See [Configure customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md) and [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md) about using this field. 

    * **Availability zone**   
        This option lets you deploy the new volume in the logical availability zone that you specify. Select an availability zone where Azure NetApp Files resources are present. For details, see [Manage availability zone volume placement](manage-availability-zone-volume-placement.md).

    * If you want to apply an existing snapshot policy to the volume, select **Show advanced section** to expand it, specify whether you want to hide the snapshot path, and select a snapshot policy in the pull-down menu. 

        For information about creating a snapshot policy, see [Manage snapshot policies](snapshots-manage-policy.md).

        ![Show advanced selection](./media/shared/volume-create-advanced-selection.png)

3. Select the **Protocol** tab, and then complete the following actions:  
    * Select **Dual-protocol** as the protocol type for the volume.   

    * Specify the **Active Directory** connection to use.

    * Specify a unique **Volume Path**. This path is used when you create mount targets. The requirements for the path are as follows:  

        - For volumes not in an availability zone or volumes in the same availability zone, the volume path must be unique within each subnet in the region. 
        - For volumes in availability zones, the volume path must be unique within each availability zone. For more information, see [Manage availability zone volume placement](manage-availability-zone-volume-placement.md#file-path-uniqueness).
        - It must start with an alphabetical character.
        - It can contain only letters, numbers, or dashes (`-`). 
        - The length must not exceed 80 characters.
    
    * Specify the **versions** to use for dual protocol: **NFSv4.1 and SMB**, or **NFSv3 and SMB**.

    * Specify the **Security Style** to use: NTFS (default) or UNIX.

    * If you want to enable SMB3 protocol encryption for the dual-protocol volume, select **Enable SMB3 Protocol Encryption**.   

        This feature enables encryption for only in-flight SMB3 data. It does not encrypt NFSv3 in-flight data. SMB clients not using SMB3 encryption aren't able to access this volume. Data at rest is encrypted regardless of this setting. See [SMB encryption](azure-netapp-files-smb-performance.md#smb-encryption) for more information. 

    * If you selected NFSv4.1 and SMB for the dual-protocol volume versions, indicate whether you want to enable **Kerberos** encryption for the volume.

        Additional configurations are required for Kerberos. Follow the instructions in [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md).


    * <a name="access-based-enumeration"></a> If you want to enable access-based enumeration, select **Enable Access Based Enumeration**.

        Access-based enumeration hides directories and files created under a share from users who do not have access permissions. You can still view the share. You can only enable access-based enumeration if the dual-protocol volume uses NTFS security style.

    * <a name="non-browsable-share"></a> You can enable the **non-browsable-share feature.**

        This feature prevents the Windows client from browsing the share. The share does not show up in the Windows File Browser or in the list of shares when you run the `net view \\server /all` command.

    *  Customize **Unix Permissions** as needed to specify change permissions for the mount path. The setting does not apply to the files under the mount path. The default setting is `0770`. This default setting grants read, write, and execute permissions to the owner and the group, but no permissions are granted to other users.     
        Registration requirement and considerations apply for setting **Unix Permissions**. Follow instructions in [Configure Unix permissions and change ownership mode](configure-unix-permissions-change-ownership-mode.md).  

    * Optionally, [configure export policy for the volume](azure-netapp-files-configure-export-policy.md).

    ![Specify dual-protocol](./media/create-volumes-dual-protocol/create-volume-protocol-dual.png)

4. Select **Review + Create** to review the volume details. Then select **Create** to create the volume.

    The volume you created appears in the Volumes page. 
 
    A volume inherits subscription, resource group, location attributes from its capacity pool. To monitor the volume deployment status, you can use the Notifications tab.

## Allow local NFS users with LDAP to access a dual-protocol volume 

The **Allow local NFS users with LDAP** option in Active Directory connections enables local NFS client users not present on the Windows LDAP server to access a dual-protocol volume that has LDAP with extended groups enabled. 

> [!NOTE] 
> Before enabling this option, you should understand the [considerations](#considerations).   
> The **Allow local NFS users with LDAP** option is part of the **LDAP with extended groups** feature and requires registration. See [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md) for details.

1. Select **Active Directory connections**. On an existing Active Directory connection, select the context menu (the three dots `…`) then **Edit**.  

2. On the **Edit Active Directory settings** window that appears, select the **Allow local NFS users with LDAP** option.  

    ![Screenshot that shows the Allow local NFS users with LDAP option](./media/shared/allow-local-nfs-users-with-ldap.png)  

## Manage LDAP POSIX Attributes

You can manage POSIX attributes such as UID, Home Directory, and other values by using the Active Directory Users and Computers MMC snap-in.  The following example shows the Active Directory Attribute Editor: 

![Active Directory Attribute Editor](./media/shared/active-directory-attribute-editor.png) 

You need to set the following attributes for LDAP users and LDAP groups: 
* Required attributes for LDAP users:   
    `uid: Alice`,  
    `uidNumber: 139`,  
    `gidNumber: 555`,  
    `objectClass: user, posixAccount`
* Required attributes for LDAP groups:   
    `objectClass: group, posixGroup`,  
    `gidNumber: 555`
* All users and groups must have unique `uidNumber` and `gidNumber`, respectively. 

The values specified for `objectClass` are separate entries. For example, in Multi-valued String Editor, `objectClass` would have separate values (`user` and `posixAccount`) specified as follows for LDAP users:   

![Screenshot of Multi-valued String Editor that shows multiple values specified for Object Class.](./media/shared/multi-valued-string-editor.png) 

Microsoft Entra Domain Services doesn’t allow you to modify the objectClass POSIX attribute on users and groups created in the organizational AADDC Users OU. As a workaround, you can create a custom OU and create users and groups in the custom OU.

If you are synchronizing the users and groups in your Microsoft Entra tenancy to users and groups in the AADDC Users OU, you can't move users and groups into a custom OU. Users and groups created in the custom OU aren't synchronized to your AD tenancy. For more information, see the [Microsoft Entra Domain Services Custom OU considerations and limitations](../active-directory-domain-services/create-ou.md#custom-ou-considerations-and-limitations).

### Access Active Directory Attribute Editor 

On a Windows system, you can access the Active Directory Attribute Editor as follows:  

1. Select **Start**, navigate to **Windows Administrative Tools**. Then select **Active Directory Users and Computers** to open the Active Directory Users and Computers window.  
2.	Select the domain name that you want to view, and then expand the contents.  
3.	To display the advanced Attribute Editor, enable the **Advanced Features** option in the Active Directory Users Computers **View** menu.   
    ![Screenshot that shows how to access the Attribute Editor Advanced Features menu.](./media/create-volumes-dual-protocol/attribute-editor-advanced-features.png) 
4. Select **Users** on the left pane to see the list of users.
5. Select a particular user to see its **Attribute Editor** tab.
 
## Configure the NFS client 

Follow instructions in [Configure an NFS client for Azure NetApp Files](configure-nfs-clients.md) to configure the NFS client.  

## Next steps  

* [Considerations for Azure NetApp Files dual-protocol volumes](network-attached-storage-protocols.md#considerations-for-azure-netapp-files-dual-protocol-volumes) 
* [Manage availability zone volume placement for Azure NetApp Files](manage-availability-zone-volume-placement.md)
* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md)
* [Configure an NFS client for Azure NetApp Files](configure-nfs-clients.md)
* [Configure Unix permissions and change ownership mode](configure-unix-permissions-change-ownership-mode.md). 
* [Configure AD DS LDAP over TLS for Azure NetApp Files](configure-ldap-over-tls.md)
* [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md)
* [Troubleshoot volume errors for Azure NetApp Files](troubleshoot-volumes.md)
* [Application resilience FAQs for Azure NetApp Files](faq-application-resilience.md)
