---
title: Convert an NFS volume between NFSv3 and NFSv4.1 with Azure NetApp Files | Microsoft Docs
description: Describes how to convert an NFS volume between NFSv3 and NFSv4.1. 
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
ms.topic: how-to
ms.date: 10/20/2021
ms.author: b-juche
---
# Convert an NFS volume between NFSv3 and NFSv4.1

You might have an existing Azure NetApp Files NFS volume mounted by using the NFSv3 version, but you want to change the protocol version to NFSv4.1 to take advantage of NFSv4.1 features. 
 
Azure NetApp Files provides a feature that enables you to convert an NFS volume from version NFSv3 to version NFSv4.1. The feature also enables you to convert an NFS volume from NFSv4.1 back to NFSv3 if needed. You can do so without losing access to the data or needing to create a new volume and copy the data. This feature preserves the data and converts the volume export policies as part of the operation. As such, after the clients are prepared for the protocol change, they can remount the volume and access the data. 

This article explains how to convert an NFS volume between NFSv3 and NFSv4.1.   

> [!IMPORTANT]
> A protocol change is a change of your production environment.  It needs to be prepared and tested properly. 
> 
> The conversion involves application downtime where clients are not able to access the volume in conversion. You need to plan for the following activities:  
>    * Before conversion,  you need to unmount the volume from all clients. This operation might require shutdown of your applications that access the volume. 
>    * After successful volume conversion, you need to reconfigure each of the clients that access the volume before you can remount the volume. 

## Considerations

* You cannot convert an NFSv4.1 volume with Kerberos enabled to NFSv3. 
* You cannot change the NFS version of a dual-protocol volume. 
* You cannot convert a single-protocol NFS volume to a dual-protocol volume, or the other way around. 
* You cannot convert a source or destination volume in a cross-region replication relationship. 

## Register the feature 

The feature to convert an NFS volume between NFSv3 and NFSv4.1 is currently in preview. If you are using this feature for the first time, register the feature before using it. 

1.  Register the feature:

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFProtocolTypeNFSConversion
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFProtocolTypeNFSConversion
    ```
You can also use [Azure CLI commands](/cli/azure/feature?preserve-view=true&view=azure-cli-latest) `az feature register` and `az feature show` to register the feature and display the registration status. 

## Convert from NFSv3 to NFSv4.1

In this example, you have an NFSv3 volume, but you want to use NFSv4.1 features. You are not using an LDAP integration or plan to use Kerberos for NFSv4.1.  

This section shows you how to convert the NFSv3 volume to NFSv4.1. 

1. Before converting the volume, unmount it in preparation. See [Mount or unmount a volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md).  

    Example:   
    `sudo umount /path/to/vol1`

2. Convert the NFS version:

    1. In the Azure portal, navigate to the NFS volume that you want to convert.
    2. Click **Edit**.
    3. In the Edit window that appears, select **NSFv4.1** in the **Protocol type** pulldown.  
    
    ![screenshot that shows the Edit menu with the Protocol Type field](../media/azure-netapp-files/edit-protocol-type.png)   
    
3. Wait for the conversion operation to complete. Then remount the volume. See [Mount or unmount a volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md). 

4. Run `mount –v` and locate your volume in the list. Verify in the output that the version shows `nfsvers=4.1`. 

    Example:   
    `mount -v | grep /path/to/vol1`  
    `vol1:/path/to/vol1 on /path type nfs (rw,intr,tcp,`**`nfsvers=4.1,`**`rsize=16384,wsize=16384,addr=192.168.1.1)`


## Convert from NFSv4.1 to NFSv3

In this example, you have an existing NFSv4.1 volume that you want to convert to NFSv3.  

> [!NOTE]
> In this case, the conversion will result in all NFSv4.1 features such as access control lists (ACLs) and file locking becoming unavailable. 

This section shows you how to convert the NFSv4.1 volume to NFSv3.

1. Before converting the volume, unmount it in preparation. See [Mount or unmount a volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md).  

    Example:   
    `sudo umount /path/to/vol1`

2. Convert the NFS version:

    1. In the Azure portal, navigate to the NFS volume that you want to convert.
    2. Click **Edit**.
    3. In the Edit window that appears, select **NSFv3** in the **Protocol type** pulldown.  
    
    ![screenshot that shows the Edit menu with the Protocol Type field](../media/azure-netapp-files/edit-protocol-type.png)   
    
3. Wait for the conversion operation to complete. Then remount the volume. See [Mount or unmount a volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md). 

4. Run `mount –v` and locate your volume in the list. Verify in the output that the version shows `nfsvers=3`. 

    Example:   
    `mount -v | grep /path/to/vol1`  
    `vol1:/path/to/vol1 on /path type nfs (rw,intr,tcp,`**`nfsvers=3,`**`rsize=16384,wsize=16384,addr=192.168.1.1)`

## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Mount or unmount a volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
