---
title: Configure NFSv4.1 domain for Azure NetApp Files | Microsoft Docs
description: Describes how to configure NFSv4.1 domain for using NFSv4.1 with Azure NetApp Files.
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 02/21/2023
ms.author: anfdocs
---
# Configure NFSv4.1 domain for Azure NetApp Files

NFSv4 introduces the concept of an authentication domain. Azure NetApp Files currently supports root-only user mapping from the service to the NFS client. To use the NFSv4.1 functionality with Azure NetApp Files, you need to update the NFS client.

## Default behavior of user/group mapping

Root mapping defaults to the `nobody` user because the NFSv4 domain is set to `localdomain` by default. When you mount an Azure NetApp Files NFSv4.1 volume as root, you'll see file permissions as follows:  

![Default behavior of user/group mapping for NFSv4.1](../media/azure-netapp-files/azure-netapp-files-nfsv41-default-behavior-user-group-mapping.png)

As the above example shows, the user for `file1` should be `root`, but it maps to `nobody` by default. This article shows you how to set the `file1` user to `root` by changing the `idmap Domain` setting to `defaultv4iddomain.com`.  

## Configure NFSv4.1 domain for server

Using the Azure portal, you can update the account settings to set NFSv4.1 ID domain on all non-LDAP volumes. Modifying the value will update all volumes in that subscription and region. 

### Register the feature

Azure NetApp Files now supports the ability to set the NFSv4.1 domain for all non-LDAP volumes in a subscription using the Azure portal. This feature is currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background.

1.  Register the feature

    ```azurepowershell-interactive
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFNFSV4IDDomain
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell-interactive
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFNFSV4IDDomain
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

### Steps

1. Under the Azure NetApp Files subscription, select **NFSv4 ID Domain**.
1. Select **Configure.**
1. To use the default domain, select the box next to **Use Default NFSv4 ID Domain**. To use another domain, uncheck the text box and provide the name of the NFSv4.1 ID domain.
  :::image type="content" source="../media/azure-netapp-files/nfsv4-id-domain.png" alt-text="Screenshot with field to set NFSv4 domain." lightbox="../media/azure-netapp-files/nfsv4-id-domain.png":::

1. Select **Save**.

<!-- 
#### Edit the NFSv4 domain

1. Under the Azure NetApp Files subscription, select **NFSv4 ID Domain**.
1. Choose the domain name you want to edit. Select the the three dots `...` next to the name and choose **Edit.**
 :::image type="content" source="../media/azure-netapp-files/nfsv4-edit-domain.png" alt-text="Screenshot with field to set NFSv4 domain." lightbox="../media/azure-netapp-files/nfsv4-edit-domain.png":::
1. Check or uncheck the box next to **Use Default NFSv4 ID Domain**. In the text box, provide the name of the NFSv4 domain.
  :::image type="content" source="../media/azure-netapp-files/nfsv4-id-domain.png" alt-text="Screenshot with field to set NFSv4 domain." lightbox="../media/azure-netapp-files/nfsv4-id-domain.png":::
1. Select **Save**.
-->

### Set NFSv4.1 domain for client

1. Edit the `/etc/idmapd.conf` file on the NFS client.   
    Uncomment the line `#Domain` (that is, remove the `#` from the line), and change the value `localdomain` as follows:

    * If the volume isn’t enabled for LDAP, set `Domain = defaultv4iddomain.com`.
    * If the volume is [enabled for LDAP](configure-ldap-extended-groups.md), set `Domain` to the domain that is configured in the Active Directory Connection on your NetApp account.
        For instance, if `contoso.com` is the configured domain in the NetApp account, then set `Domain = contoso.com`.

    The following examples illustrate the initial configuration of `/etc/idmapd.conf` before changes:

    ```
    [General]
    Verbosity = O 
    Pipefs—Directory = /run/rpc_pipefs 
    # set your own domain here, if it differs from FQDN minus hostname 
    # Domain = localdomain 
     
    [Mapping] 
    Nobody-User = nobody 
    Nobody-Group = nogroup 
    ```

    The following example shows updated configuration of *non-LDAP* NFSv4.1 volumes:

    ```
    [General]
    Verbosity = O 
    Pipefs—Directory = /run/rpc_pipefs 
    # set your own domain here, if it differs from FQDN minus hostname 
    Domain = defaultv4iddomain.com 
 
    [Mapping] 
    Nobody-User = nobody 
    Nobody-Group = nogroup 
    ```

    The following example shows updated configuration of *LDAP-enabled* NFSv4.1 volumes. In this example, `contoso.com` is the configured domain in the NetApp account:

    ```
    [General]
    Verbosity = O 
    Pipefs—Directory = /run/rpc_pipefs 
    # set your own domain here, if it differs from FQDN minus hostname 
    Domain = contoso.com
    
    [Mapping] 
    Nobody-User = nobody 
    Nobody-Group = nogroup 
    ```

2. Unmount any currently mounted NFS volumes.
3. Update the `/etc/idmapd.conf` file.
4. Restart the `rpcbind` service on your host (`service rpcbind restart`), or reboot the host.
5. Mount the NFS volumes as required.   

    See [Mount a volume for Windows or Linux VMs](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md). 

The following example shows the resulting user/group change: 

![Screenshot that shows an example of the resulting user/group change.](../media/azure-netapp-files/azure-netapp-files-nfsv41-resulting-config.png)

As the example shows, the user/group has now changed from `nobody` to `root`.

## Behavior of other (non-root) users and groups

Azure NetApp Files supports local users (users created locally on a host) who have permissions associated with files or folders in NFSv4.1 volumes. However, the service does not currently support mapping the users/groups across multiple nodes. Therefore, users created on one host do not map by default to users created on another host. 

In the following example, `Host1` has three existing test user accounts (`testuser01`, `testuser02`, `testuser03`): 

![Screenshot that shows that Host1 has three existing test user accounts.](../media/azure-netapp-files/azure-netapp-files-nfsv41-host1-users.png)

On `Host2`, note that the test user accounts have not been created, but the same volume is mounted on both hosts:

![Resulting configuration for NFSv4.1](../media/azure-netapp-files/azure-netapp-files-nfsv41-host2-users.png)

## Next steps

* [Mount a volume for Windows or Linux VMs](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md)

