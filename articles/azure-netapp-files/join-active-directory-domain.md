---
title: Join a Linux VM to a Microsoft Entra Domain | Microsoft Docs
description: Describes how to join a Linux VM to a Microsoft Entra Domain
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 12/20/2022
ms.author: anfdocs
---

# Join a Linux VM to a Microsoft Entra Domain

Joining a Linux virtual machine (VM) to an [Microsoft Entra Domain Services](../active-directory-domain-services/overview.md) managed domain enables users to sign into to VMs with one set of credentials. Once joined, the user accounts and credentials can be used to sign in, access, and manage servers. 

Refer to [Understand guidelines for Active Directory Domain Services site design and planning](understand-guidelines-active-directory-domain-service-site.md) to learn more about using Active Directory in Azure NetApp Files. 

## Steps

1. Configure `/etc/resolv.conf` with the proper DNS server.  

    For example:  

    `[root@reddoc cbs]# cat /etc/resolv.conf`   
    `search contoso.com`   
    `nameserver 10.6.1.4(private IP)`   

2. Add the NFS client record in the DNS server for the DNS forward and reverse lookup zone.

3. To verify DNS, use the following commands from the NFS client:   

    `# nslookup [hostname/FQDN of NFS client(s)]`   
    `# nslookup [IP address of NFS client(s)]`

4. Install packages:   

    `yum update`   
    `sudo yum -y install realmd sssd adcli samba-common krb5-workstation chrony nfs-utils`

5.	Configure the NTP client.  

    RHEL 8 uses chrony by default. Following the configuration guidelines in [Using the `Chrony` suite to configure NTP](https://access.redhat.com/documentation/en-us/red-hat-enterprise-linux/8/guide/6c230de2-39f1-455a-902d-737eea31ad34).

6.	Join the Active Directory domain:  

    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou="OU=$YOUROU"`

    For example: 

    `sudo realm join CONTOSO.COM -U ad_admin --computer-ou="CN=Computers"`

## Next steps

* [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
* [Modify an Active Directory Connection](modify-active-directory-connections.md)
* [Configure access control lists for NFSv4.1 volumes](configure-access-control-lists.md)
