---
title: Use on-premises Active Directory Domain Services or Azure Active Directory Domain Services to authorize access to Azure Files over SMB for Linux clients using Kerberos authentication
description: Learn how to enable identity-based Kerberos authentication for Linux clients over Server Message Block (SMB) for Azure Files using on-premises Active Directory Domain Services (AD DS) or Azure Active Directory Domain Services (Azure AD DS)
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 01/23/2023
ms.author: kendownie
ms.subservice: files
---

# Enable Active Directory authentication over SMB for Linux clients accessing Azure Files

For more information on all supported options and considerations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md). (Will need to update that doc with this Linux option.)

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) for Linux virtual machines (VMs) using the Kerberos authentication protocol through the following two methods:

- On-premises Windows Active Directory Domain Services (AD DS)
- Azure Active Directory Domain Services (Azure AD DS)

In order to use the first option, you must sync your AD DS to Azure Active Directory (Azure AD) using Azure AD Connect.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |

## Limitations

Azure Files doesn't currently support using identity-based authentication to mount Azure File shares on Linux clients at boot time using `fstab` entries. This is because the client can't get the Kerberos ticket early enough to mount at boot time. However, you can use an `fstab` entry and specify the `noauto` option. This won't mount the share at boot time, but it will allow a user to conveniently mount the file share after they log in using a simple mount command without all the parameters. You can also use the `autofs` package to mount the share as it is accessed.

## Prerequisites

Before you enable AD authentication over SMB for Azure file shares, make sure you've completed the following prerequisites.

- An Linux VM (Ubuntu 18.04+ or an equivalent Red Hat or SuSE VM) running on Azure with at least one network interface on the VNET containing the Azure AD DS, or an on-premises Linux VM with AD DS synced to Azure AD.
- Root user or user credentials to a local user account that has full sudo rights (for this guide, localadmin).
- The Linux VM must not have joined any AD domain. If it's already a part of a domain, it needs to first leave that domain before it can join this domain.
- An Azure AD tenant [fully configured](../../active-directory-domain-services/tutorial-create-instance.md), with domain user already set up.

Installing the samba package isn't strictly necessary, but it gives you some useful tools and brings in other packages automatically, such as `samba-common` and `smbclient`. Use the commands below to install it. If you're asked for any input values during installation, leave them blank.

```bash
localadmin@lxsmb-canvm15:~$ sudo apt update -y
localadmin@lxsmb-canvm15:~$ sudo apt install samba winbind libpam-winbind libnss-winbind krb5-config krb5-user keyutils cifs-utils
```

The wbinfo tool is part of the samba suite and can be useful for authentication and debugging purposes, such as checking if the domain controller is reachable, checking what domain a machine is joined to, and finding information about users.

Make sure that the Linux host keeps the time synchronized with the domain server. Refer to the documentation for your Linux distribution. For some distros, you can do this [using systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/timesyncd.conf.html). A sample configuration is shown below.

```bash
localadmin@lxsmb-canvm15:~$ cat /etc/systemd/timesyncd.conf
[Time]
NTP=onpremaadint.com
FallbackNTP=ntp.ubuntu.com
localadmin@lxsmb-canvm15:~$ sudo systemctl restart systemd-timesyncd.service
```

## Enable AD Kerberos authentication

Follow these steps to enable AD Kerberos authentication. [This Samba documentation](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member) might be helpful as a reference.

### Make sure the domain server is reachable and discoverable

1. Make sure that the DNS servers supplied contain the domain server IP addresses.

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

3. If it didn't work, make sure that the domain server IP addresses are pinging.

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

4. If the ping doesn't work, first go back to [prerequisites](#prerequisites), and make sure that your VM is on a VNET that has access to the Azure AD tenant.

5. If the IP addresses are pinging but the DNS servers aren't automatically discovered, you can add the DNS servers manually.

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

6. Winbind assumes that the DHCP server keeps the domain DNS records up-to-date. However, this isn't true for Azure DHCP. In order to set up the client to make DDNS updates, use [this guide](../../virtual-network/virtual-networks-name-resolution-ddns.md#linux-clients) to create a network script. A sample script is shown below.

```bash
localadmin@lxsmb-canvm17:~$ cat /etc/dhcp/dhclient-exit-hooks.d/ddns-update
#!/bin/sh 

# only execute on the primary nic
if [ "$interface" != "eth0" ]
then
    return
fi 

# When you have a new IP, perform nsupdate
if [ "$reason" = BOUND ] || [ "$reason" = RENEW ] ||
   [ "$reason" = REBIND ] || [ "$reason" = REBOOT ]
then
   host=`hostname -f`
   nsupdatecmds=/var/tmp/nsupdatecmds
     echo "update delete $host a" > $nsupdatecmds
     echo "update add $host 3600 a $new_ip_address" >> $nsupdatecmds
     echo "send" >> $nsupdatecmds

     nsupdate $nsupdatecmds
fi 
```

### Connect to Azure AD DS and make sure the services are discoverable

1. Make sure that you're able to ping the domain server by the domain name.

```bash
localadmin@lxsmb-canvm15:~$ ping aadintcanary.onmicrosoft.com
PING aadintcanary.onmicrosoft.com (10.0.2.4) 56(84) bytes of data.
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=1 ttl=128 time=1.41 ms
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=2 ttl=128 time=1.02 ms
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=3 ttl=128 time=0.740 ms
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=4 ttl=128 time=0.925 ms 

^C 

--- aadintcanary.onmicrosoft.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3016ms
rtt min/avg/max/mdev = 0.740/1.026/1.419/0.248 ms 
```

2. Make sure you can discover the Azure AD services on the network.

```bash
localadmin@lxsmb-canvm15:~$ nslookup
> set type=SRV
> _ldap._tcp.aadintcanary.onmicrosoft.com.
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer: 

_ldap._tcp.aadintcanary.onmicrosoft.com service = 0 100 389 pwe-oqarc11l568.aadintcanary.onmicrosoft.com.
_ldap._tcp.aadintcanary.onmicrosoft.com service = 0 100 389 hxt4yo--jb9q529.aadintcanary.onmicrosoft.com. 
```

### Set up hostname and fully qualified domain name (FQDN)

1. Update the `/etc/hosts` file with the final FQDN (after joining the domain) and the alias for the host. The IP address doesn't matter much for now as this line will mainly be used to translate short hostname to FQDN.

```bash
127.0.0.1       lxsmb-canvm15.aadintcanary.onmicrosoft.com lxsmb-canvm15
#cmd=sudo vim /etc/hosts   
#then enter this value instead of localhost "ubuntvm.aadintcanary.onmicrosoft.com UbuntuVM" 
```

2. Now, your hostname should resolve. You can ignore the IP address it resolves to for now. The short hostname should resolve to the FQDN.

```bash
localadmin@lxsmb-canvm15:~$ getent hosts lxsmb-canvm15
127.0.0.1       lxsmb-canvm15.aadintcanary.onmicrosoft.com lxsmb-canvm15
localadmin@lxsmb-canvm15:~$ dnsdomainname
aadintcanary.onmicrosoft.com
localadmin@lxsmb-canvm15:~$ hostname -f
lxsmb-canvm15.aadintcanary.onmicrosoft.com 
```

### Set up krb5.conf

1. Configure krb5.conf so that the KDC with the domain server can be contacted for authentication. For more information, see [MIT Kerberos Documentation](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/conf_files/krb5_conf.html). A sample `krb5.conf `is shown below.

```bash
#sudo vim /etc/krb5.conf 

localadmin@lxsmb-canvm15:~$ cat /etc/krb5.conf
[libdefaults]
        default_realm = AADINTCANARY.ONMICROSOFT.COM
        dns_lookup_realm = false
        dns_lookup_kdc = true
```

### Set up smb.conf

1. Identify the path to `smb.conf`.

```bash
localadmin@lxsmb-canvm15:~$ sudo smbd -b | grep "CONFIGFILE"
   CONFIGFILE: /etc/samba/smb.conf
```

2. Change the SMB configuration to act as a domain member. For more information, see [Setting up samba as a domain member](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member). A sample `smb.conf` is shown below.

```bash
localadmin@lxsmb-canvm15:~$ cat /etc/samba/smb.conf
[global]
   workgroup = AADINTCANARY
   security = ADS
   realm = AADINTCANARY.ONMICROSOFT.COM

   winbind refresh tickets = Yes
   vfs objects = acl_xattr
   map acl inherit = Yes
   store dos attributes = Yes

   dedicated keytab file = /etc/krb5.keytab
   kerberos method = secrets and keytab

   winbind use default domain = Yes 

   load printers = No
   printing = bsd
   printcap name = /dev/null
   disable spoolss = Yes

   log file = /var/log/samba/log.%m
   log level = 1

   idmap config * : backend = tdb
   idmap config * : range = 3000-7999

   idmap config AADINTCANARY : backend = rid
   idmap config AADINTCANARY : range = 10000-999999

   template shell = /bin/bash
   template homedir = /home/%U 
```

3. Force winbind to reload the changed config file.

```bash
localadmin@lxsmb-canvm15:~$ sudo smbcontrol all reload-config
```

### Join the domain

1. Use the "net ads join" command to join the host to Azure AD DS domain. If the command throws an error, see [Troubleshooting samba domain members](https://wiki.samba.org/index.php/Troubleshooting_Samba_Domain_Members) to resolve the issue.

```bash
localadmin@lxsmb-canvm15:~$ sudo net ads join -U lxsmbadmin    # user  - garead

Enter lxsmbadmin's password:
Using short domain name -- AADINTCANARY
Joined 'LXSMB-CANVM15' to dns domain 'aadintcanary.onmicrosoft.com' 
```

2. Make sure that the DNS record has been created for this host on the domain server.

```bash
localadmin@lxsmb-canvm15:~$ nslookup lxsmb-canvm15.aadintcanary.onmicrosoft.com 10.0.2.5
Server:         10.0.2.5
Address:        10.0.2.5#53

Name:   lxsmb-canvm15.aadintcanary.onmicrosoft.com
Address: 10.0.0.8
```

If users will be actively logging into client machines or VMs and accessing the Azure file shares, you'll need to [set up nsswitch.conf](#set-up-nsswitchconf) and [configure PAM for winbind](#configure-pam-for-winbind). If access will be limited to applications represented by a user account or computer account that need Kerberos authentication to access the file share, then you can skip these steps.

### Set up nsswitch.conf

1. Now that the host is joined to the domain, you'll need to put winbind libraries in the places to look for when looking for users and groups. Do this by updating the passwd and group entries in `nsswitch.conf`. Run the command `sudo vim /etc/nsswitch.conf` and add the following entries to `nsswitch.conf`:

```bash
passwd:         compat systemd winbind
group:          compat systemd winbind
```

2. Enable the winbind service to be automatically started on reboot, and then restart the service.

```bash
localadmin@lxsmb-canvm15:~$ sudo systemctl enable winbind
Synchronizing state of winbind.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable winbind
localadmin@lxsmb-canvm15:~$ sudo systemctl restart winbind
localadmin@lxsmb-canvm15:~$ sudo systemctl status winbind
winbind.service - Samba Winbind Daemon
   Loaded: loaded (/lib/systemd/system/winbind.service; enabled; vendor preset: enabled)
   Active: active (running) since Fri 2020-04-24 09:34:31 UTC; 10s ago
     Docs: man:winbindd(8)
           man:samba(7)
           man:smb.conf(5)
 Main PID: 27349 (winbindd)
   Status: "winbindd: ready to serve connections..."
    Tasks: 2 (limit: 4915)
   CGroup: /system.slice/winbind.service
           ├─27349 /usr/sbin/winbindd --foreground --no-process-group
           └─27351 /usr/sbin/winbindd --foreground --no-process-group

Apr 24 09:34:31 lxsmb-canvm15 systemd[1]: Starting Samba Winbind Daemon...
Apr 24 09:34:31 lxsmb-canvm15 winbindd[27349]: [2020/04/24 09:34:31.724211,  0] ../source3/winbindd/winbindd_cache.c:3170(initialize_winbindd_cache)
Apr 24 09:34:31 lxsmb-canvm15 winbindd[27349]:   initialize_winbindd_cache: clearing cache and re-creating with version number 2
Apr 24 09:34:31 lxsmb-canvm15 winbindd[27349]: [2020/04/24 09:34:31.725486,  0] ../lib/util/become_daemon.c:124(daemon_ready)
Apr 24 09:34:31 lxsmb-canvm15 systemd[1]: Started Samba Winbind Daemon.
Apr 24 09:34:31 lxsmb-canvm15 winbindd[27349]:   STATUS=daemon 'winbindd' finished starting up and ready to serve connections 
```

3. Make sure that the domain users and groups are discovered.

```bash
localadmin@lxsmb-canvm15:~$ getent passwd lxsmbadmin
lxsmbadmin:*:12604:10513::/home/lxsmbadmin:/bin/bash
localadmin@lxsmb-canvm15:~$ getent group 'domain users'
domain users:x:10513: 
```

If the above doesn't work, check if the domain controller is reachable using the wbinfo tool:

```bash
localadmin@lxsmb-canvm15:~$ wbinfo --ping-dc
```

### Configure PAM for winbind

1. You'll need to place winbind in the authentication stack so that domain users are authenticated through winbind by configuring PAM (Pluggable Authentication Module) for winbind. The second command below ensures that the homedir gets created for a domain user on first login to this system.

```bash
localadmin@lxsmb-canvm15:~$ sudo pam-auth-update --enable winbind
localadmin@lxsmb-canvm15:~$ sudo pam-auth-update --enable mkhomedir 
```

2. Ensure that the PAM authentication config has the following arguments in `/etc/pam.d/common-auth`:

```bash
localadmin@lxsmb-canvm15:~$ grep pam_winbind.so /etc/pam.d/common-auth
auth    [success=1 default=ignore]      pam_winbind.so krb5_auth krb5_ccache_type=FILE cached_login try_first_pass 
```

3. At this point, you should be able to log in as the domain user to this system, either through ssh, su, or any other means of authentication.

```bash
localadmin@lxsmb-canvm15:~$ su - lxsmbadmin
Password:
Creating directory '/home/lxsmbadmin'.
lxsmbadmin@lxsmb-canvm15:~$ pwd
/home/lxsmbadmin
lxsmbadmin@lxsmb-canvm15:~$ id
uid=12604(lxsmbadmin) gid=10513(domain users) groups=10513(domain users),10520(group policy creator owners),10572(denied rodc password replication group),11102(dnsadmins),11104(aad dc administrators),11164(group-readwrite),11165(fileshareallaccess),12604(lxsmbadmin) 
```

## Mount the file share

After you've enabled AD (or Azure AD) Kerberos authentication and domain-joined your Linux VM, you'll need to mount the file share. The mount options differ somewhat depending on the [access control model](#access-control-models) you're using. These mount options are specific to Linux clients connecting to an Azure file share. Your scenario could span multiple use cases, in which case you can merge the mount options.

The following are base mount options for all access control models: serverino,nosharesock,cache=strict,mfsymlinks

### Mount options for server enforced access control (default)

If your environment is mostly Windows and you're enforcing access control using NT ACLs, use the following mount options.

#### Security mode (sec=krb5)

In this use case, the mount point is accessed by a single user of the AD domain and isn't shared with other users of the domain.

Each file access happens in the context of the user whose krb5 credentials were used to mount the file share. Any user on the local system who accesses the mount point will impersonate that user.

> [!Note]
> In scenarios where multiple users on the same client will be accessing the same share, and the system is configured for Kerberos and mounted with `sec=krb5`, consider using the `multiuser` mount option.

#### File permissions

File permissions matter, as the file share will be accessed by Linux and Windows clients.

Choose one of the following three mount options to convert file permissions to DACLs on files:

- Use a default, such as **file_mode=<>,dir_mode=<>**
- Specify **cifsacl,noperm** so permissions are visible to Linux apps and can be set, but are only enforced on the server (you can also use **cifsacl** if you want them to be enforced on both client and server)
- Have client-enforced permissions that are opaque to the server (usually **modefromsid,idsfromsid** would both be set)

When using **noperm**, permission checking is only done on the server. Otherwise, permission checking is done on both the client with the mode bits and the server with the ACL.

#### File ownership

File ownership matters, as the file share will be accessed by Linux and Windows clients.

Choose one of the following three mount options to convert file ownership UID/GID to owner/group SID on file DACL.

- Use a default such as **uid=<>,gid=<>**
- Configure UID/GID mapping via RFC2307 and Active Directory (**nss_winbind** or **nss_sssd**)
- Have client UID/GID that are opaque to the server (**idsfromsid**)

#### File attribute cache coherency

Performance is important, even if file attributes aren't always accurate. The default value for **actimeo** is 1 (second), which means that the file attributes are fetched again from the server if the cached attributes are more than 1 second old. Increasing the value to 60 means that attributes are cached for at least 1 minute. For most use cases, we recommend using a value of 30 for this option (**actimeo=30**).

For newer kernels, consider setting the actimeo features more granularly, using **acdirmax** for directory entry revalidation caching and **acregmax** for caching file metadata, for example **acdirmax=60,acregmax=5**.

## Access control models

Three access control models are available for mounting SMB Azure file shares:

1. **Server enforced access control using NT ACLs (default):** Uses NT access control lists (ACLs) to enforce access control. This is the recommended option, unless your environment is predominantly Linux. Linux tools that update NT ACLs are minimal, so update ACLs through Windows. Use this access control model only with NT ACLs (no mode bits).

2. **Client enforced access control (modefromsid,idsfromsid)**: Use this access control model if your environment is exclusively Linux. There's no interoperability with Windows, and Windows isn't able to read the permissions that are encoded into ACLs. Recommended only for advanced Linux users. Not recommended for multi-user scenarios.

3. **Client translated access control (cifsacl)**: Use this access control model if your environment is mixed Linux and Windows. Mode bits permissions and ownership information are stored in NT ACLs, so both Windows and Linux clients can use this model. However, Windows and Linux clients using the same file share isn't recommended, as some Linux features aren't supported.

## Next steps

For more information on how to mount an SMB file share, see:

- [Mount SMB Azure file share on Linux](storage-how-to-use-files-linux.md)
