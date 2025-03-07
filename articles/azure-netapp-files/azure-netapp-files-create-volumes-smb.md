---
title: Create an SMB volume for Azure NetApp Files | Microsoft Docs
description: This article shows you how to create an SMB3 volume in Azure NetApp Files. Learn about requirements for Active Directory connections and Domain Services.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 12/11/2024
ms.author: anfdocs
---
# Create an SMB volume for Azure NetApp Files

Azure NetApp Files supports creating volumes using NFS (NFSv3 or NFSv4.1), SMB3, or dual protocol (NFSv3 and SMB, or NFSv4.1 and SMB). A volume's capacity consumption counts against its pool's provisioned capacity. 

This article shows you how to create an SMB3 volume. For NFS volumes, see [Create an NFS volume](azure-netapp-files-create-volumes.md). For dual-protocol volumes, see [Create a dual-protocol volume](create-volumes-dual-protocol.md).

>[!IMPORTANT]
>Windows Server 2025 currently doesn't work with the Azure NetApp Files SMB protocol. 

## Before you begin 

[!INCLUDE [Delegated subnet permission](includes/create-volume-permission.md)]

* You must have already set up a capacity pool. See [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md).     
* A subnet must be delegated to Azure NetApp Files. See [Delegate a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md).

## Configure Active Directory connections 

Before creating an SMB volume, you need to create an Active Directory connection. If you haven't configured Active Directory connections for Azure NetApp files, follow instructions described in [Create and manage Active Directory connections](create-active-directory-connections.md).

## Add an SMB volume

1. Select the **Volumes** blade from the Capacity Pools blade. 

    ![Navigate to Volumes](./media/shared/azure-netapp-files-navigate-to-volumes.png)

2. Select **+ Add volume** to create a volume.  
    The Create a Volume window appears.

3. In the Create a Volume window, select **Create** and provide information for the following fields under the Basics tab:   
    * **Volume name**      
        Specify the name for the volume that you are creating.   

        Refer to [Naming rules and restrictions for Azure resources](../azure-resource-manager/management/resource-name-rules.md#microsoftnetapp) for naming conventions on volumes. Additionally, you cannot use `default` or `bin` as the volume name.

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

        The VNet you specify must have a subnet delegated to Azure NetApp Files. The Azure NetApp Files service can be accessed only from the same VNet or from a VNet that is in the same region as the volume through VNet peering. You can also access the volume from  your on-premises network through Express Route.   

    * **Subnet**  
        Specify the subnet that you want to use for the volume.  
        The subnet you specify must be delegated to Azure NetApp Files. 
        
        If you haven't delegated a subnet, you can select **Create new** on the Create a Volume page. Then in the Create Subnet page, specify the subnet information, and select **Microsoft.NetApp/volumes** to delegate the subnet for Azure NetApp Files. In each VNet, only one subnet can be delegated to Azure NetApp Files.   
    
        ![Create subnet](./media/shared/azure-netapp-files-create-subnet.png)

    * **Network features**  
        In supported regions, you can specify whether you want to use **Basic** or **Standard** network features for the volume. See [Configure network features for a volume](configure-network-features.md) and [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) for details.

    * **Encryption key source** 
        Select Microsoft Managed Key or Customer Managed Key.  See [Configure customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md) and [Azure NetApp Files double encryption at rest](double-encryption-at-rest.md) to learn more about this field. 

    * **Availability zone**   
        This option lets you deploy the new volume in the logical availability zone that you specify. Select an availability zone where Azure NetApp Files resources are present. For details, see [Manage availability zone volume placement](manage-availability-zone-volume-placement.md).

    * If you want to apply an existing snapshot policy to the volume, select **Show advanced section** to expand it, specify whether you want to hide the snapshot path, and select a snapshot policy in the pull-down menu. 

        For information about creating a snapshot policy, see [Manage snapshot policies](snapshots-manage-policy.md).

        ![Show advanced selection](./media/shared/volume-create-advanced-selection.png)

4. Select **Protocol** and complete the following information:  
    * Select **SMB** as the protocol type for the volume.  

    * Select your **Active Directory** connection from the drop-down list.  
    
    * Specify a unique **share name** for the volume. This share name is used when you create mount targets. The requirements for the share name are as follows:   
        - For volumes not in an availability zone or volumes in the same availability zone, it must be unique within each subnet in the region.  
        - For volumes in availability zones, it must be unique within each availability zone. For more information, see [Manage availability zone volume placement](manage-availability-zone-volume-placement.md#file-path-uniqueness).
        - It can contain only letters, numbers, or dashes (`-`). 
        - The length must not exceed 80 characters.   
    
    * <a name="smb3-encryption"></a>If you want to enable encryption for SMB3, select **Enable SMB3 Protocol Encryption**.   

        This feature enables encryption for in-flight SMB3 data. SMB clients not using SMB3 encryption will not be able to access this volume.  Data at rest is encrypted regardless of this setting.   
        See [SMB encryption](azure-netapp-files-smb-performance.md#smb-encryption) for additional information.

    * <a name="access-based-enumeration"></a> If you want to enable access-based enumeration, select **Enable Access Based Enumeration**.

        Hide directories and files created under a share from users who don't have access permissions to the files or folders under the share. Users are still able to view the share.

    * <a name="non-browsable-share"></a> You can enable the **non-browsable-share feature.**

        Prevent the Windows client from browsing the share. The share doesn't show up in the Windows File Browser or in the list of shares when you run the `net view \\server /all` command.

    * <a name="continuous-availability"></a>If you want to enable Continuous Availability for the SMB volume, select **Enable Continuous Availability**.    
      
        [!INCLUDE [SMB Continuous Availability warning](includes/smb-continuous-availability.md)]

        **Custom applications are not supported with SMB Continuous Availability.**

    :::image type="content" source="./media/azure-netapp-files-create-volumes-smb/azure-netapp-files-protocol-smb.png" alt-text="Screenshot showing the Protocol tab of creating an SMB volume." lightbox="./media/azure-netapp-files-create-volumes-smb/azure-netapp-files-protocol-smb.png":::

5. Select **Review + Create** to review the volume details. Then select **Create** to create the SMB volume.

    The volume you created appears in the Volumes page. 
 
    A volume inherits subscription, resource group, location attributes from its capacity pool. To monitor the volume deployment status, you can use the Notifications tab.

## Control access to an SMB volume  

Access to an SMB volume is managed through permissions. 

### NTFS file and folder permissions  

You can set permissions for a file or folder by using the **Security** tab of the object's properties in the Windows SMB client.
 
![Set file and folder permissions](./media/azure-netapp-files-create-volumes-smb/set-file-folder-permissions.png) 

### Modify SMB share permissions

You can modify SMB share permissions using Microsoft Management Console (MMC).

>[!IMPORTANT]
>Modifying SMB share permissions poses a risk. If the users or groups assigned to the share properties are removed from the Active Directory, or if the permissions for the share become unusable, then the entire share will become inaccessible.

1. To open Computer Management MMC on any Windows server, in the Control Panel, select **Administrative Tools > Computer Management**.
1. Select **Action > Connect to another computer**.
1. In the **Select Computer** dialog box, enter the name of the Azure NetApp Files FQDN or IP address or select **Browse** to locate the storage system.
1. Select **OK** to connect the MMC to the remote server.
1. When the MMC connects to the remote server, in the navigation pane, select **Shared Folders > Shares**.
1. In the display pane that lists the shares, double-click a share to display its properties. In the **Properties** dialog box, modify the properties as needed.

## Next steps  

* [Manage availability zone volume placement for Azure NetApp Files](manage-availability-zone-volume-placement.md)
* [Requirements and considerations for large volumes](large-volumes-requirements-considerations.md)
* [Mount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Enable Continuous Availability on existing SMB volumes](enable-continuous-availability-existing-SMB.md)
* [SMB encryption](azure-netapp-files-smb-performance.md#smb-encryption)
* [Troubleshoot volume errors for Azure NetApp Files](troubleshoot-volumes.md)
* [Learn about virtual network integration for Azure services](../virtual-network/virtual-network-for-azure-services.md)
* [Install a new Active Directory forest using Azure CLI](/windows-server/identity/ad-ds/deploy/virtual-dc/adds-on-azure-vm)
* [Application resilience FAQs for Azure NetApp Files](faq-application-resilience.md)
