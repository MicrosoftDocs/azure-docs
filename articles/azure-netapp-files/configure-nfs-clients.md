---
title: Configure an NFS client for Azure NetApp Files | Microsoft Docs
description: Describes how to configure NFS clients to use with Azure NetApp Files. 
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
ms.date: 09/28/2020
ms.author: b-juche
---
# Configure an NFS client for Azure NetApp Files

The NFS client configuration described in this article is part of the setup when you [configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) or [create a dual-protocol volume](create-volumes-dual-protocol.md). A wide variety of Linux distributions are available to use with Azure NetApp Files. This article describes configurations for two of the more commonly used environments: RHEL 8 and Ubuntu 18.04. 

Regardless of the Linux flavor you use, the following configurations are required:
* Configure an NTP client to avoid issues with time skew.
* Configure DNS entries of the Linux client for name resolution.  
    This configuration includes the “A” (forward) record and the PTR (reverse) record . 
* For domain join, create a computer account in the target Active Directory (which is created during the realm join command). 
    > [!NOTE] 
    > The `$SERVICEACCOUNT` variable used in the commands below should be a user account with permissions or delegation to create a computer account in the targeted Organizational Unit.
* Enable the client to mount NFS volumes and other relevant monitoring tools.

## RHEL 8 configuration 

1. Install packages:   
    `sudo yum -y install realmd sssd adcli samba-common krb5-workstation chrony`

2. Configure the NTP client:  
    RHEL 8 uses `chrony` by default.  Following the configuration guidelines in [Using the Chrony suite to configure NTP](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/using-chrony-to-configure-ntp).

3. Join the Active Directory domain:  
    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou= OU=$YOUROU,DC=$DOMAIN,DC=TLD`

## Ubuntu configuration 
This section describes Ubuntu configuration for the NFS clients.  

### If you are using NFSv4.1 Kerberos encryption 

1. Install packages:  
    `sudo yum -y install realmd packagekit sssd adcli samba-common krb5-workstation chrony`

2. Configure the NTP client.  
    Ubuntu 18.04 uses `chrony` by default.  Following the configuration guidelines in [Ubuntu Bionic: Using chrony to configure NTP](https://ubuntu.com/blog/ubuntu-bionic-using-chrony-to-configure-ntp).

3. Join the Active Directory Domain:  
    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou= OU=$YOUROU,DC=$DOMAIN,DC=TLD`

### If you are using dual protocol  

1. Run the following command to upgrade the installed packages:  
    `sudo apt update && sudo apt install libnss-ldap libpam-ldap ldap-utils nscd`

    Example:   

    `base dc=hariscus,dc=com`
    `uri ldap://10.20.0.4:389/`
    `ldap_version 3`
    `rootbinddn cn=admin,cn=Users,dc=hariscus,dc=com`
    `pam_password ad`
 
2. Run the following command to restart and enable the service:   
    `sudo systemctl restart nscd && sudo systemctl enable nscd`

The following example queries the AD LDAP server from Ubuntu LDAP client for an LDAP user `ldapu1`:   

`root@cbs-k8s-varun4-04:/home/cbs# getent passwd hari1`   
`hari1:*:1237:1237:hari1:/home/hari1:/bin/bash`   

## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)

