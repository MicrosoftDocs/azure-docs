---
title: Use on-premises Active Directory Domain Services or Azure Active Directory Domain Services to authorize access to Azure Files over SMB for Linux clients using Kerberos authentication
description: Learn how to enable identity-based Kerberos authentication for Linux clients over Server Message Block (SMB) for Azure Files using on-premises Active Directory Domain Services (AD DS) or Azure Active Directory Domain Services (Azure AD DS)
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 09/22/2022
ms.author: kendownie
ms.subservice: files
---

# Enable Active Directory authentication over SMB for Linux clients accessing Azure Files

For more information on all supported options and considerations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md). (Will need to update that doc with this Linux option.)

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) for Linux virtual machines (VMs) using the Kerberos authentication protocol through the following two methods:

- On-premises Active Directory Domain Services (AD DS)
- Azure Active Directory Domain Services (Azure AD DS)

Both of these methods use the Kerberos authentication protocol.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Limitations

Azure Files doesn't currently support using identity-based authentication to mount Azure File shares on Linux clients at boot time using `fstab` entries. 

Only the following client operating systems are currently supported:

- Ubuntu 18.04

## Prerequisites

Before you enable AD authentication over SMB for Azure file shares, make sure you've completed the following prerequisites.

- Linux VM running on Azure with at least one network interface on the VNET containing the Azure AD DS, or an on-premises Linux VM with AD DS synced to Azure AD.
- User credentials to a local user account which has full sudo rights (for this guide, localadmin).
- Winbind should be configured correctly to perform Kerberos authentication with the AD, and collect the Kerberos tickets in the local cred cache. If access control is needed, Winbind should be configured to map Linux UID/GID consistently to corresponding SID on the AD (idmap configure).
- The Linux VM must not have joined any AD domain. If it's already a part of a domain, it needs to first leave that domain before it can join this domain.
- An Azure AD tenant [fully configured](../../active-directory-domain-services/tutorial-create-instance.md), with domain user already set up.

Installing the samba package is not strictly necessary, but it gives you some useful tools like smbd. Use the commands below to install it. During installation, if you're asked for any input values, leave them blank.

```bash
localadmin@lxsmb-canvm15:~$ sudo apt update -y
localadmin@lxsmb-canvm15:~$ sudo apt install samba winbind libpam-winbind libnss-winbind krb5-config krb5-user keyutils cifs-utils
```

Make sure that the Linux host keeps the time synchronized with the domain server. You can do this [using systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/timesyncd.conf.html). A sample configuration is shown below.

```bash
localadmin@lxsmb-canvm15:~$ cat /etc/systemd/timesyncd.conf
[Time]
NTP=onpremaadint.com
FallbackNTP=ntp.ubuntu.com
localadmin@lxsmb-canvm15:~$ sudo systemctl restart systemd-timesyncd.service
```

Does the user need to do anything to enable the feature on their storage account?

## Access control models

Three access control models are available while mounting SMB Azure file shares:

1. **Server enforced access control (default):** Uses NT access control lists (ACLs) for enforcing access control. Linux tools that update NT ACLs are minimalistic, so use accordingly. 

2. **Client enforced access control (modefromsid,idsfromsid)**: File permissions and ownership information is encoded into NT ACLs. This method should be used when all clients accessing the files are Linux machines.

3. **Client translated access control (cifsacl)**: File permissions and ownership information is translated to NT ACLs.

There are known issues with each access control model. We'll need to state this, along with the kernel version where the fix is available, and impact to customers without the fix.

## Enable AD Kerberos authentication (on the client?)

Follow these steps to enable AD Kerberos authentication on Ubuntu-18.04.

### Make sure the domain server is reachable and discoverable

1. Make sure that the DNS servers supplied contain the AAD domain server IP addresses.

```bash
localadmin@lxsmb-canvm15:~$ systemd-resolve --status 

Global 
          DNSSEC NTA: 10.in-addr.arpa
                      16.172.in-addr.arpa
                      168.192.in-addr.arpa
                      17.172.in-addr.arpa
                      18.172.in-addr.arpa
                      19.172.in-addr.arpa
                      20.172.in-addr.arpa
                      21.172.in-addr.arpa
                      22.172.in-addr.arpa
                      23.172.in-addr.arpa
                      24.172.in-addr.arpa
                      25.172.in-addr.arpa
                      26.172.in-addr.arpa
                      27.172.in-addr.arpa
                      28.172.in-addr.arpa
                      29.172.in-addr.arpa
                      30.172.in-addr.arpa
                      31.172.in-addr.arpa
                      corp
                      d.f.ip6.arpa
                      home
                      internal
                      intranet
                      lan
                      local
                      private
                      test 

Link 2 (eth0) 
      Current Scopes: DNS 
       LLMNR setting: yes 
MulticastDNS setting: no 
      DNSSEC setting: no 
    DNSSEC supported: no 
         DNS Servers: 10.0.2.5 
                      10.0.2.4 
                      10.0.0.41
          DNS Domain: reddog.microsoft.com 
```

2. If the above worked, skip the following steps and proceed to the next section.

3. Make sure that the Azure AD domain server IP addresses are pinging.

```bash
localadmin@lxsmb-canvm15:~$ ping 10.0.2.5
PING 10.0.2.5 (10.0.2.5) 56(84) bytes of data.
64 bytes from 10.0.2.5: icmp_seq=1 ttl=128 time=0.898 ms
64 bytes from 10.0.2.5: icmp_seq=2 ttl=128 time=0.946 ms

^C 

--- 10.0.2.5 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 0.898/0.922/0.946/0.024 ms
```

4. If the ping doesn't work, first go back to prerequisites and make sure that your VM is on a VNET that has access to the Azure AD tenant. (or that AD DS is synced to Azure AD with Azure AD Connect?)

5. If the IP addresses are pinging but not automatically discovering the DNS servers, you can add the DNS servers manually.

```bash
localadmin@lxsmb-canvm15:~$ cat /etc/netplan/50-cloud-init.yaml
# This file is generated from information provided by the datasource.  Changes
# to it will not persist across an instance reboot.  To disable cloud-init's
# network configuration capabilities, write a file
# /etc/cloud/cloud.cfg.d/99-disable-network-config.cfg with the following:
# network: {config: disabled}
network:
    ethernets:
        eth0:
            dhcp4: true
            dhcp4-overrides:
                route-metric: 100
            dhcp6: false
            match:
                macaddress: 00:22:48:03:6b:c5
            set-name: eth0
            nameservers:
                addresses: [10.0.2.5, 10.0.2.4]
    version: 2
localadmin@lxsmb-canvm15:~$ sudo netplan --debug apply 
```

### Connect to Azure AD DS and make sure that the services are discoverable

1. Make sure that you're able to ping the domain server by the domain name. 


## Disable AD Kerberos authentication on your storage account?

If you want to use another authentication method, you can disable Azure AD authentication on your storage account by using the Azure portal.

> [!NOTE]
> Disabling this feature means that there will be no Active Directory configuration for file shares in your storage account until you enable one of the other Active Directory sources to reinstate your Active Directory configuration.

## Next steps

For more information, see these resources:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [Enable AD DS authentication to Azure file shares](storage-files-identity-ad-ds-enable.md)
- [FAQ](storage-files-faq.md)
