---
title: Use on-premises Active Directory Domain Services or Azure Active Directory Domain Services to authorize access to Azure Files over SMB for domain-joined Linux clients using Kerberos authentication
description: Learn how to enable identity-based Kerberos authentication for domain-joined Linux clients over Server Message Block (SMB) for Azure Files using on-premises Active Directory Domain Services (AD DS) or Azure Active Directory Domain Services (Azure AD DS)
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 09/22/2022
ms.author: kendownie
ms.subservice: files
---

# Enable Active Directory authentication over SMB for Linux clients accessing Azure Files

For more information on all supported options and considerations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md). (Will need to update that doc with this Linux option.)

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) for domain-joined Linux virtual machines (VMs) using the Kerberos authentication protocol through the following two methods:

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

Azure Files doesn't currently support mounting Azure File shares on Linux clients at boot time using `fstab` entries. Only the following client operating systems are currently supported:

- Ubuntu 18.04

## Access control models

Three access control models are available while mounting SMB Azure file shares:

1. Server enforced access control (default): Uses NT access control lists (ACLs) for enforcing access control. Linux tools that update NT ACLs are minimalistic, so use accordingly. 

2. Client enforced access control (modefromsid,idsfromsid): File permissions and ownership information is encoded into NT ACLs. This method should be used when all clients accessing the files are Linux machines.

3. Client translated access control (cifsacl): File permissions and ownership information is translated to NT ACLs.

There are known issues with each access control model. We'll need to state this, along with the kernel version where the fix is available, and impact to customers without the fix.

## Prerequisites

Before you enable AD authentication over SMB for Azure file shares, make sure you've completed the following prerequisites.

- Ubuntu-18.04 VM running on Azure cloud, with at least one network interface on the VNET containing the Azure AD DS.
- User credentials to a local user account which has full sudo rights (for this guide, localadmin).
- Winbind should be set up and configured properly.
- The Linux VM must not have joined any AD domain. If it's already a part of a domain, the host needs to first leave that domain before it can join this domain.
- An Azure AD tenant fully configured, with domain user already set up.


https://docs.microsoft.com/en-us/azure/active-directory-domain-services/tutorial-create-instance

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

## Enable AD Kerberos authentication (on the client?)

Follow these steps to enable AD Kerberos authentication on Ubuntu-18.04.

1. Make sure that the domain server is reachable and discoverable.


## Disable AD Kerberos authentication on your storage account?

If you want to use another authentication method, you can disable Azure AD authentication on your storage account by using the Azure portal.

> [!NOTE]
> Disabling this feature means that there will be no Active Directory configuration for file shares in your storage account until you enable one of the other Active Directory sources to reinstate your Active Directory configuration.

## Next steps

For more information, see these resources:

- [Overview of Azure Files identity-based authentication support for SMB access](storage-files-active-directory-overview.md)
- [Enable AD DS authentication to Azure file shares](storage-files-identity-ad-ds-enable.md)
- [FAQ](storage-files-faq.md)
