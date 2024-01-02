---
title: Configure NFSv4.1 ID domain for Azure NetApp Files | Microsoft Docs
description: Learn how to configure NFSv4.1 ID domain for using NFSv4.1 with Azure NetApp Files.
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 07/12/2023
ms.author: anfdocs
---
# Configure NFSv4.1 ID domain for Azure NetApp Files

NFSv4 introduces the concept of an ID authentication domain. Azure NetApp Files uses the entry value `defaultv4iddomain.com` as the authentication domain, and NFS clients use their own configuration to authenticate users that want to access files on those volumes. By default, NFS clients will use the DNS domain name as the NFSv4 ID domain. You can override this setting by using the NFSv4 configuration file named `idmapd.conf`. 

If authentication domain settings on NFS client and Azure NetApp Files do not match, file access may be denied as the NFSv4 user and group mapping may fail. When this happens, the users and groups that do not match properly will squash the user and group configured in the `idmapd.conf` file (generally, nobody:99) and an event will be logged on the client.  

This article explains the default behavior of user/group mapping and how to configure NFS clients correct to authenticate properly and allow access. 

## Default behavior of user/group mapping

The root user mapping can illustrate what happens if there is a mismatch between the Azure NetApp Files and NFS clients. The installation process of an application often requires the use of the root user. Azure NetApp Files can be configured to allow access for `root`. 

In the following directory listing example, the user `root` mounts a volume on a Linux client that uses its default configuration `localdomain` for the ID authentication domain, which is different from Azure NetApp Files’ default configuration of `defaultv4iddomain.com`.

:::image type="content" source="../media/azure-netapp-files/azure-netapp-files-nfsv41-default-behavior-user-group-mapping.png" alt-text="Screenshot of file directory output." lightbox="../media/azure-netapp-files/azure-netapp-files-nfsv41-default-behavior-user-group-mapping.png":::

In the listing of the files in the directory, `file1` shows as being mapped to `nobody`, when it should be owned by the root user. 

There are two ways to adjust the authentication domain on both sides: Azure NetApp Files as NFS server and Linux as NFS clients: 

1. **Central user management**: If you're already using a central user management such as Active Directory Domain Services (AD DS), you can configure their Linux clients to use LDAP and set the domain configured in AD DS as authentication domain. At the server side, you must enable the AD domain service for Azure NetApp Files and create LDAP-enabled volumes. The LDAP-enabled volumes automatically use the domain configured in AD DS as their authentication domain.

    For more information about this process, see [Enable Active Directory Domain Services (AD DS) LDAP authentication for NFS volumes](configure-ldap-extended-groups.md). 

1. **Manually configure the Linux client**: If you are not using a central user management for your Linux clients, you can manually configure the Linux clients to match the default authentication domain of Azure NetApp Files for non-LDAP enabled volumes.  

In this section we’ll focus on how to configure the Linux client and how to change the Azure NetApp Files authentication domain for all non-LDAP enabled volumes. 

## Configure NFSv4.1 ID domain on Azure NetApp Files

You can specify a desired NFSv4.1 ID domain for all non-LDAP volumes using the Azure portal. This setting applies to all non-LDAP volumes across all NetApp accounts in the same subscription and region. It does not affect LDAP-enabled volumes in the same NetApp subscription and region. 

### Register the feature

Azure NetApp Files supports the ability to set the NFSv4.1 ID domain for all non-LDAP volumes in a subscription using the Azure portal. This feature is currently in preview. You need to register the feature before using it for the first time. After registration, the feature is enabled and works in the background.

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

1. Under the Azure NetApp Files subscription, select **NFSv4.1 ID Domain**.
1. Select **Configure**.
1. To use the default domain `defaultv4iddomain.com`, select the box next to **Use Default NFSv4 ID Domain**. To use another domain, uncheck the text box and provide the name of the NFSv4.1 ID domain.

    :::image type="content" source="../media/azure-netapp-files/nfsv4-id-domain.png" alt-text="Screenshot with field to set NFSv4 domain." lightbox="../media/azure-netapp-files/nfsv4-id-domain.png":::

1. Select **Save**.

### Configure NFSv4.1 ID domain in NFS clients

1. Edit the `/etc/idmapd.conf` file on the NFS client.   
    Uncomment the line `#Domain` (that is, remove the `#` from the line), and change the value `localdomain` as follows:

    * If the volume isn't enabled for LDAP, either use the default domain `defaultv4iddomain.com` by specifying `Domain = defaultv4iddomain.com`, or specify the NFSv4.1 ID domain as [configured in Azure NetApp Files](#steps). 
    * If the volume is [enabled for LDAP](configure-ldap-extended-groups.md), set `Domain` to the domain that is configured in the Active Directory Connection on your NetApp account.
        For instance, if `contoso.com` is the configured domain in the NetApp account, then set `Domain = contoso.com`.

    The following examples show the initial configuration of `/etc/idmapd.conf` before changes:

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

    The following example shows updated configuration of *non-LDAP* NFSv4.1 volumes for default domain `defaultv4iddomain.com`:

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
4. Clear the keyring of the NFS `idmapper` (`nfsidmap -c`).
5. Mount the NFS volumes as required.   

    See [Mount a volume for Windows or Linux VMs](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md). 

The following example shows the resulting user/group change: 

![Screenshot that shows an example of the resulting user/group change.](../media/azure-netapp-files/azure-netapp-files-nfsv41-resulting-config.png)

As the example shows, the user/group has now changed from `nobody` to `root`.

## Behavior of other (nonroot) users and groups

Azure NetApp Files supports local users and groups (created locally on the NFS client and represented by user and group IDs) and corresponding ownership and permissions associated with files or folders in NFSv4.1 volumes. However, the service doesn't automatically solve for mapping local users and groups across NFS clients. Users and groups created on one host may or may not exist on another NFS client (or exist with different user and group IDs), and will therefore not map correctly as outlined in the example below.

In the following example, `Host1` has three user accounts (`testuser01`, `testuser02`, `testuser03`): 

![Screenshot that shows that Host1 has three existing test user accounts.](../media/azure-netapp-files/azure-netapp-files-nfsv41-host1-users.png)

On `Host2`, no corresponding user accounts exist, but the same volume is mounted on both hosts:

![Resulting configuration for NFSv4.1](../media/azure-netapp-files/azure-netapp-files-nfsv41-host2-users.png)

To resolve this issue, either create the missing accounts on the NFS client or configure your NFS clients to use the LDAP server that Azure NetApp Files is using for centrally managed UNIX identities. 

## Next steps

* [Mount a volume for Windows or Linux VMs](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md)
* [Configure AD DS LDAP with extended groups for NFS volume access](configure-ldap-extended-groups.md)
