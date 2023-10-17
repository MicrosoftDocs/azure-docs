---
title: Use on-premises Active Directory Domain Services or Microsoft Entra Domain Services to authorize access to Azure Files over SMB for Linux clients using Kerberos authentication
description: Learn how to enable identity-based Kerberos authentication for Linux clients over Server Message Block (SMB) for Azure Files using on-premises Active Directory Domain Services (AD DS) or Microsoft Entra Domain Services
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 04/18/2023
ms.author: kendownie
---

# Enable Active Directory authentication over SMB for Linux clients accessing Azure Files

For more information on supported options and considerations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md).

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) for Linux virtual machines (VMs) using the Kerberos authentication protocol through the following methods:

- On-premises Windows Active Directory Domain Services (AD DS)
- Microsoft Entra Domain Services

In order to use the first option (AD DS), you must sync your AD DS to Microsoft Entra ID using Microsoft Entra Connect.

> [!Note]
> This article uses Ubuntu for the example steps. Similar configurations will work for RHEL and SLES machines, allowing you to mount Azure file shares using Active Directory.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![Yes, this article applies to standard SMB Azure file shares LRS/ZRS.](../media/icons/yes-icon.png) | ![No, this article doesn't apply to NFS Azure file shares.](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![Yes, this article applies to standard SMB Azure file shares GRS/GZRS.](../media/icons/yes-icon.png) | ![No this article doesn't apply to NFS Azure file shares.](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![Yes, this article applies to premium SMB Azure file shares.](../media/icons/yes-icon.png) | ![No, this article doesn't apply to premium NFS Azure file shares.](../media/icons/no-icon.png) |

## Linux SMB client limitations

You can't use identity-based authentication to mount Azure File shares on Linux clients at boot time using `fstab` entries because the client can't get the Kerberos ticket early enough to mount at boot time. However, you can use an `fstab` entry and specify the `noauto` option. This won't mount the share at boot time, but it will allow a user to conveniently mount the file share after they log in using a simple mount command without all the parameters. You can also use [`autofs`](storage-how-to-use-files-linux.md?tabs=smb311#dynamically-mount-with-autofs) to mount the share upon access.

## Prerequisites

Before you enable AD authentication over SMB for Azure file shares, make sure you've completed the following prerequisites.

- A Linux VM (Ubuntu 18.04+ or an equivalent RHEL or SLES VM) running on Azure. The VM must have at least one network interface on the VNET containing the Microsoft Entra Domain Services, or an on-premises Linux VM with AD DS synced to Microsoft Entra ID.
- Root user or user credentials to a local user account that has full sudo rights (for this guide, localadmin).
- The Linux VM must not have joined any AD domain. If it's already a part of a domain, it needs to first leave that domain before it can join this domain.
- A Microsoft Entra tenant [fully configured](../../active-directory-domain-services/tutorial-create-instance.md), with domain user already set up.

Installing the samba package isn't strictly necessary, but it gives you some useful tools and brings in other packages automatically, such as `samba-common` and `smbclient`. Run the following commands to install it. If you're asked for any input values during installation, leave them blank.

```bash
sudo apt update -y
sudo apt install samba winbind libpam-winbind libnss-winbind krb5-config krb5-user keyutils cifs-utils
```

The `wbinfo` tool is part of the samba suite. It can be useful for authentication and debugging purposes, such as checking if the domain controller is reachable, checking what domain a machine is joined to, and finding information about users.

Make sure that the Linux host keeps the time synchronized with the domain server. Refer to the documentation for your Linux distribution. For some distros, you can do this [using systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/timesyncd.conf.html). Edit `/etc/systemd/timesyncd.conf` with your favorite text editor to include the following:

```plaintext
[Time]
NTP=onpremaadint.com
FallbackNTP=ntp.ubuntu.com
```

Then restart the service:

```bash
sudo systemctl restart systemd-timesyncd.service
```

## Enable AD Kerberos authentication

Follow these steps to enable AD Kerberos authentication. [This Samba documentation](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member) might be helpful as a reference.

### Make sure the domain server is reachable and discoverable

1. Make sure that the DNS servers supplied contain the domain server IP addresses.

```bash
systemd-resolve --status
```

```output
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
          DNS Domain: domain1.contoso.com 
```

2. If the command worked, skip the following steps and proceed to the next section.

3. If it didn't work, make sure that the domain server IP addresses are pinging.

```bash
ping 10.0.2.5
```

```output
PING 10.0.2.5 (10.0.2.5) 56(84) bytes of data.
64 bytes from 10.0.2.5: icmp_seq=1 ttl=128 time=0.898 ms
64 bytes from 10.0.2.5: icmp_seq=2 ttl=128 time=0.946 ms

^C 

--- 10.0.2.5 ping statistics --- 
2 packets transmitted, 2 received, 0% packet loss, time 1002ms
rtt min/avg/max/mdev = 0.898/0.922/0.946/0.024 ms
```

4. If the ping doesn't work, go back to [prerequisites](#prerequisites), and make sure that your VM is on a VNET that has access to the Microsoft Entra tenant.

5. If the IP addresses are pinging but the DNS servers aren't automatically discovered, you can add the DNS servers manually. Edit `/etc/netplan/50-cloud-init.yaml` with your favorite text editor.

```plaintext
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
```

Then apply the changes:

```bash
sudo netplan --debug apply 
```

6. Winbind assumes that the DHCP server keeps the domain DNS records up-to-date. However, this isn't true for Azure DHCP. In order to set up the client to make DDNS updates, use [this guide](../../virtual-network/virtual-networks-name-resolution-ddns.md#linux-clients) to create a network script. Here's a sample script that lives at `/etc/dhcp/dhclient-exit-hooks.d/ddns-update`.

```plaintext
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

<a name='connect-to-azure-ad-ds-and-make-sure-the-services-are-discoverable'></a>

### Connect to Microsoft Entra Domain Services and make sure the services are discoverable

1. Make sure that you're able to ping the domain server by the domain name.

```bash
ping contosodomain.contoso.com
```

```output
PING contosodomain.contoso.com (10.0.2.4) 56(84) bytes of data.
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=1 ttl=128 time=1.41 ms
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=2 ttl=128 time=1.02 ms
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=3 ttl=128 time=0.740 ms
64 bytes from pwe-oqarc11l568.internal.cloudapp.net (10.0.2.4): icmp_seq=4 ttl=128 time=0.925 ms 

^C 

--- contosodomain.contoso.com ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3016ms
rtt min/avg/max/mdev = 0.740/1.026/1.419/0.248 ms 
```

2. Make sure you can discover the Microsoft Entra services on the network.

```bash
nslookup
> set type=SRV
> _ldap._tcp.contosodomain.contoso.com.
```

```output
Server:         127.0.0.53
Address:        127.0.0.53#53

Non-authoritative answer: 

_ldap._tcp.contosodomain.contoso.com service = 0 100 389 pwe-oqarc11l568.contosodomain.contoso.com.
_ldap._tcp.contosodomain.contoso.com service = 0 100 389 hxt4yo--jb9q529.contosodomain.contoso.com. 
```

### Set up hostname and fully qualified domain name (FQDN)

1. Using your text editor, update the `/etc/hosts` file with the final FQDN (after joining the domain) and the alias for the host. The IP address doesn't matter for now because this line will mainly be used to translate short hostname to FQDN. For more details, see [Setting up Samba as a Domain Member](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member).

```plaintext
127.0.0.1       contosovm.contosodomain.contoso.com contosovm
#cmd=sudo vim /etc/hosts   
#then enter this value instead of localhost "ubuntvm.contosodomain.contoso.com UbuntuVM" 
```

2. Now, your hostname should resolve. You can ignore the IP address it resolves to for now. The short hostname should resolve to the FQDN.

```bash
getent hosts contosovm
```

```output
127.0.0.1       contosovm.contosodomain.contoso.com contosovm
```

```bash
dnsdomainname
```

```output
contosodomain.contoso.com
```

```bash
hostname -f
```

```output
contosovm.contosodomain.contoso.com 
```

> [!Note]
> Some distros require you to run the `hostnamectl` command in order for hostname -f to be updated:
> 
> `hostnamectl set-hostname contosovm.contosodomain.contoso.com`

### Set up krb5.conf

1. Configure `/etc/krb5.conf` so that the Kerberos key distribution center (KDC) with the domain server can be contacted for authentication. For more information, see [MIT Kerberos Documentation](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/conf_files/krb5_conf.html). Here's a sample `/etc/krb5.conf` file.

```plaintext
[libdefaults]
        default_realm = CONTOSODOMAIN.CONTOSO.COM
        dns_lookup_realm = false
        dns_lookup_kdc = true
```

### Set up smb.conf

1. Identify the path to `smb.conf`.

```bash
sudo smbd -b | grep "CONFIGFILE"
```

```output
   CONFIGFILE: /etc/samba/smb.conf
```

2. Change the SMB configuration to act as a domain member. For more information, see [Setting up samba as a domain member](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member). Here's a sample `smb.conf` file.

> [!Note]
> This example is for Microsoft Entra Domain Services, for which we recommend setting `backend = rid` when configuring idmap. On-premises AD DS users might prefer to [choose a different idmap backend](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member#Choosing_an_idmap_backend).

```plaintext
[global]
   workgroup = CONTOSODOMAIN
   security = ADS
   realm = CONTOSODOMAIN.CONTOSO.COM

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

   idmap config CONTOSODOMAIN : backend = rid
   idmap config CONTOSODOMAIN : range = 10000-999999

   template shell = /bin/bash
   template homedir = /home/%U 
```

3. Force winbind to reload the changed config file.

```bash
sudo smbcontrol all reload-config
```

### Join the domain

1. Use the `net ads join` command to join the host to the Microsoft Entra Domain Services domain. If the command throws an error, see [Troubleshooting samba domain members](https://wiki.samba.org/index.php/Troubleshooting_Samba_Domain_Members) to resolve the issue.

```bash
sudo net ads join -U contososmbadmin    # user  - garead

Enter contososmbadmin's password:
```

```output
Using short domain name -- CONTOSODOMAIN
Joined 'CONTOSOVM' to dns domain 'contosodomain.contoso.com' 
```

2. Make sure that the DNS record exists for this host on the domain server.

```bash
nslookup contosovm.contosodomain.contoso.com 10.0.2.5
```

```output
Server:         10.0.2.5
Address:        10.0.2.5#53

Name:   contosovm.contosodomain.contoso.com
Address: 10.0.0.8
```

If users will be actively logging into client machines or VMs and accessing the Azure file shares, you need to [set up nsswitch.conf](#set-up-nsswitchconf) and [configure PAM for winbind](#configure-pam-for-winbind). If access will be limited to applications represented by a user account or computer account that need Kerberos authentication to access the file share, then you can skip these steps.

### Set up nsswitch.conf

1. Now that the host is joined to the domain, you need to put winbind libraries in the places to look for when looking for users and groups. Do this by updating the passwd and group entries in `nsswitch.conf`. Use your text editor to edit `/etc/nsswitch.conf` and add the following entries:

```plaintext
passwd:         compat systemd winbind
group:          compat systemd winbind
```

2. Enable the winbind service to start automatically on reboot.

```bash
sudo systemctl enable winbind
```

```output
Synchronizing state of winbind.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable winbind
```

3. Then, restart the service.

```bash
sudo systemctl restart winbind
sudo systemctl status winbind
```

```output
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

Apr 24 09:34:31 contosovm systemd[1]: Starting Samba Winbind Daemon...
Apr 24 09:34:31 contosovm winbindd[27349]: [2020/04/24 09:34:31.724211,  0] ../source3/winbindd/winbindd_cache.c:3170(initialize_winbindd_cache)
Apr 24 09:34:31 contosovm winbindd[27349]:   initialize_winbindd_cache: clearing cache and re-creating with version number 2
Apr 24 09:34:31 contosovm winbindd[27349]: [2020/04/24 09:34:31.725486,  0] ../lib/util/become_daemon.c:124(daemon_ready)
Apr 24 09:34:31 contosovm systemd[1]: Started Samba Winbind Daemon.
Apr 24 09:34:31 contosovm winbindd[27349]:   STATUS=daemon 'winbindd' finished starting up and ready to serve connections 
```

4. Make sure that the domain users and groups are discovered.

```bash
getent passwd contososmbadmin
```

```output
contososmbadmin:*:12604:10513::/home/contososmbadmin:/bin/bash
```

```bash
getent group 'domain users'
```

```output
domain users:x:10513: 
```

If the above doesn't work, check if the domain controller is reachable using the wbinfo tool:

```bash
wbinfo --ping-dc
```

### Configure PAM for winbind

1. You need to place winbind in the authentication stack so that domain users are authenticated through winbind by configuring PAM (Pluggable Authentication Module) for winbind. The second command ensures that the homedir gets created for a domain user upon first login to this system.

```bash
sudo pam-auth-update --enable winbind
sudo pam-auth-update --enable mkhomedir 
```

2. Ensure that the PAM authentication config has the following arguments in `/etc/pam.d/common-auth`:

```bash
grep pam_winbind.so /etc/pam.d/common-auth
```

```output
auth    [success=1 default=ignore]      pam_winbind.so krb5_auth krb5_ccache_type=FILE cached_login try_first_pass 
```

3. You should now be able to log in to this system as the domain user, either through ssh, su, or any other means of authentication.

```bash
su - contososmbadmin
Password:
```

```output
Creating directory '/home/contososmbadmin'.
contososmbadmin@contosovm:~$ pwd
/home/contososmbadmin
contososmbadmin@contosovm:~$ id
uid=12604(contososmbadmin) gid=10513(domain users) groups=10513(domain users),10520(group policy creator owners),10572(denied rodc password replication group),11102(dnsadmins),11104(aad dc administrators),11164(group-readwrite),11165(fileshareallaccess),12604(contososmbadmin) 
```

## Verify configuration

To verify that the client machine is joined to the domain, look up the FQDN of the client on the domain controller and find the DNS entry listed for this particular client. In many cases, `<dnsserver>` is the same as the domain name that the client is joined to.

```bash
nslookup <clientname> <dnsserver>
```

Next, use the `klist` command to view the tickets in the Kerberos cache. There should be an entry beginning with `krbtgt` that looks similar to:

```plaintext
krbtgt/CONTOSODOMAIN.CONTOSO.COM@CONTOSODOMAIN.CONTOSO.COM
```

If you didn't [configure PAM for winbind](#configure-pam-for-winbind), `klist` might not show the ticket entry. In this case, you can manually authenticate the user to get the tickets:

```bash
wbinfo -K contososmbadmin
```

You can also run the command as a part of a script:

```bash
wbinfo -K 'contososmbadmin%SUPERSECRETPASSWORD'
```

## Mount the file share

After you've enabled AD (or Microsoft Entra ID) Kerberos authentication and domain-joined your Linux VM, you can mount the file share.

For detailed mounting instructions, see [Mount the Azure file share on-demand with mount](storage-how-to-use-files-linux.md?tabs=smb311#mount-the-azure-file-share-on-demand-with-mount).

Use the following additional mount option with all access control models to enable Kerberos security: `sec=krb5`

> [!Note]
> This feature only supports a server-enforced access control model using NT ACLs with no mode bits. Linux tools that update NT ACLs are minimal, so update ACLs through Windows. Client-enforced access control (`modefromsid,idsfromsid`) and client-translated access control (`cifsacl`) models aren't currently supported.

### Other mount options

#### Single-user versus multi-user mount

In a single-user mount use case, the mount point is accessed by a single user of the AD domain and isn't shared with other users of the domain. Each file access happens in the context of the user whose krb5 credentials were used to mount the file share. Any user on the local system who accesses the mount point will impersonate that user.

In a multi-user mount use case, there's still a single mount point, but multiple AD users can access that same mount point. In scenarios where multiple users on the same client will access the same share, and the system is configured for Kerberos and mounted with `sec=krb5`, consider using the `multiuser` mount option.

#### File permissions

File permissions matter, especially if both Linux and Windows clients will access the file share. To convert file permissions to DACLs on files, use a default mount option such as **file_mode=<>,dir_mode=<>**. File permissions specified as **file_mode** and **dir_mode** are only enforced within the client. The server enforces access control based on the file's or directory's security descriptor.

#### File ownership

File ownership matters, especially if both Linux and Windows clients will access the file share. Choose one of the following mount options to convert file ownership UID/GID to owner/group SID on file DACL:

- Use a default such as **uid=<>,gid=<>**
- Configure UID/GID mapping via RFC2307 and Active Directory (**nss_winbind** or **nss_sssd**)

#### File attribute cache coherency

Performance is important, even if file attributes aren't always accurate. The default value for **actimeo** is 1 (second), which means that the file attributes are fetched again from the server if the cached attributes are more than 1 second old. Increasing the value to 60 means that attributes are cached for at least 1 minute. For most use cases, we recommend using a value of 30 for this option (**actimeo=30**).

For newer kernels, consider setting the **actimeo** features more granularly. You can use **acdirmax** for directory entry revalidation caching and **acregmax** for caching file metadata, for example **acdirmax=60,acregmax=5**.

## Next steps

For more information on how to mount an SMB file share on Linux, see:

- [Mount SMB Azure file share on Linux](storage-how-to-use-files-linux.md)
