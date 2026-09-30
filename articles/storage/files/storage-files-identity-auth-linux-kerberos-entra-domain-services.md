---
title: Configure Linux clients for Azure Files with Microsoft Entra Domain Services
description: Learn how to configure Linux clients to use Kerberos authentication for Azure Files with Microsoft Entra Domain Services.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content
ms.topic: how-to
ms.date: 08/31/2026
ms.author: kendownie
# Customer intent: "As a Linux administrator, I want to configure Linux clients to use Microsoft Entra Domain Services authentication for Azure file shares, so that users can access shares with their domain credentials."
---

# Configure Linux clients for Azure Files with Microsoft Entra Domain Services

**Applies to:** :heavy_check_mark: SMB file shares

[Azure Files](storage-files-introduction.md) supports identity-based authentication over Server Message Block (SMB) for Linux virtual machines (VMs) by using the Kerberos authentication protocol with Microsoft Entra Domain Services. This article shows how to join a Linux client to a Microsoft Entra Domain Services managed domain and mount an Azure file share by using Kerberos authentication.

For more information on supported options and considerations, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md).

> [!NOTE]
> Microsoft Entra Kerberos is distinct from Microsoft Entra Domain Services and isn't supported for Linux clients, regardless of Linux distribution or whether identities are hybrid or cloud-only. For identity sources and supported client operating systems, see [Overview of Azure Files identity-based authentication options for SMB access](storage-files-active-directory-overview.md).

> [!NOTE]
> This article uses Ubuntu for the example steps. Similar configurations work for RHEL and SLES clients, allowing you to mount Azure file shares by using Microsoft Entra Domain Services.

## Linux SMB client limitations

You can't use identity-based authentication to mount Azure file shares on Linux clients at boot time by using `fstab` entries. This limitation exists because the client can't get the Kerberos ticket early enough to mount at boot time. You can use an `fstab` entry and specify the `noauto` option to enable a user to mount the file share after sign in by using a simple mount command without all the parameters. You can also use [`autofs`](storage-how-to-use-files-linux.md?tabs=smb311#dynamically-mount-with-autofs) to mount the share upon access.

## Prerequisites

Before you configure a Linux client to use Microsoft Entra Domain Services authentication over SMB for Azure file shares, complete the following prerequisites:

- A Linux VM running Ubuntu 18.04+, or an equivalent RHEL or SLES VM. If the VM runs in Azure, it must have at least one network interface on a virtual network with connectivity to the Microsoft Entra Domain Services managed domain.
- A Microsoft Entra tenant with a [Microsoft Entra Domain Services managed domain deployed and configured](/entra/identity/domain-services/tutorial-create-instance). Ensure that the managed domain is running and that password hash synchronization is enabled.
- An SMB Azure file share in a storage account configured for [Microsoft Entra Domain Services authentication](storage-files-identity-auth-domain-services-enable.md).
- Root user or user credentials to a local user account that has full sudo rights (for this guide, localadmin).
- The Linux VM isn't already joined to another domain. If it is, leave that domain before you join the VM to the managed domain.
- A user account in the managed domain with permission to join computers to the domain. The user must change their Microsoft Entra password after Microsoft Entra Domain Services is enabled so that the required password hashes are generated.

Installing the samba package isn't strictly necessary, but it gives you some useful tools and brings in other packages automatically, such as `samba-common` and `smbclient`. Run the following commands to install it. If you're asked for any input values during installation, leave them blank.

```bash
sudo apt update -y
sudo apt install samba winbind libpam-winbind libnss-winbind krb5-config krb5-user keyutils cifs-utils
```

The `wbinfo` tool is part of the samba suite and is useful for authentication and debugging purposes, such as checking if the domain controller is reachable, checking what domain a machine is joined to, and finding information about users.

Ensure that the Linux host keeps the time synchronized with the managed domain. See the documentation for your Linux distribution. For some distributions, you can do this [using systemd-timesyncd](https://www.freedesktop.org/software/systemd/man/timesyncd.conf.html). Edit `/etc/systemd/timesyncd.conf` to include the following configuration. Replace `ntp.server` with the same Network Time Protocol (NTP) server hostname or IP address that the managed domain uses.

```plaintext
[Time]
NTP=ntp.server
FallbackNTP=ntp.ubuntu.com
```

Then restart the service:

```bash
sudo systemctl restart systemd-timesyncd.service
```

## Enable Kerberos authentication with Microsoft Entra Domain Services

Follow these steps to enable Kerberos authentication with Microsoft Entra Domain Services. For more information about configuring Samba, see [Setting up Samba as a Domain Member](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member).

### Connect to Microsoft Entra Domain Services and discover the services

Configure the virtual network to use the managed domain controller IP addresses as its DNS servers. For more information, see [Update DNS settings for the Azure virtual network](/entra/identity/domain-services/tutorial-create-instance#update-dns-settings-for-the-azure-virtual-network).

Ensure that you can ping the managed domain by using the domain name.

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

Ensure that you can discover the managed domain services on the network.

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

If you can't resolve the managed domain or service records, review the [DNS configuration for Microsoft Entra Domain Services](/entra/identity/domain-services/manage-dns) and verify network connectivity to the managed domain controllers.

### Set up hostname and fully qualified domain name (FQDN)

Using your text editor, update the `/etc/hosts` file with the final FQDN (after joining the domain) and the alias for the host. The IP address doesn't matter for now because this line mainly translates the short hostname to the FQDN. For more information, see [Setting up Samba as a Domain Member](https://wiki.samba.org/index.php/Setting_up_Samba_as_a_Domain_Member).

```plaintext
127.0.0.1       contosovm.contosodomain.contoso.com contosovm
#cmd=sudo vim /etc/hosts
#then enter this value instead of localhost "ubuntuvm.contosodomain.contoso.com UbuntuVM"
```

Now, verify that your hostname resolves correctly by running the following three commands.

Use `getent hosts` to confirm the short hostname resolves to the FQDN. You can ignore the IP address that's returned.

```bash
getent hosts contosovm
```

```output
127.0.0.1       contosovm.contosodomain.contoso.com contosovm
```

Use `dnsdomainname` to confirm the domain name is configured correctly.

```bash
dnsdomainname
```

```output
contosodomain.contoso.com
```

Use `hostname -f` to confirm the full FQDN is resolved.

```bash
hostname -f
```

```output
contosovm.contosodomain.contoso.com
```

> [!NOTE]
> Some Linux distributions require you to run the `hostnamectl` command for `hostname -f` to be updated:
>
> `hostnamectl set-hostname contosovm.contosodomain.contoso.com`

### Set up krb5.conf

Configure `/etc/krb5.conf` so that the Kerberos key distribution center (KDC) in Microsoft Entra Domain Services can be contacted for authentication. For more information, see [MIT Kerberos Documentation](https://web.mit.edu/kerberos/krb5-1.12/doc/admin/conf_files/krb5_conf.html). Here's a sample `/etc/krb5.conf` file.

```plaintext
[libdefaults]
        default_realm = CONTOSODOMAIN.CONTOSO.COM
        dns_lookup_realm = false
        dns_lookup_kdc = true
```

### Set up smb.conf

Identify the path to `smb.conf`.

```bash
sudo smbd -b | grep "CONFIGFILE"
```

```output
   CONFIGFILE: /etc/samba/smb.conf
```

Change the SMB configuration to act as a Microsoft Entra Domain Services domain member. The following example uses the recommended `rid` idmap backend.

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

Force winbind to reload the changed configuration file.

```bash
sudo smbcontrol all reload-config
```

### Join the managed domain

Use the `net ads join` command to join the host to the managed domain. The account must have permission to join computers to the managed domain. If the command returns an error, see [Troubleshooting Samba Domain Members](https://wiki.samba.org/index.php/Troubleshooting_Samba_Domain_Members).

```bash
sudo net ads join -U contososmbadmin

Enter contososmbadmin's password:
```

```output
Using short domain name -- CONTOSODOMAIN
Joined 'CONTOSOVM' to dns domain 'contosodomain.contoso.com'
```

Ensure that the DNS record exists for this host in the managed domain.

```bash
nslookup contosovm.contosodomain.contoso.com 10.0.2.5
```

```output
Server:         10.0.2.5
Address:        10.0.2.5#53

Name:   contosovm.contosodomain.contoso.com
Address: 10.0.0.8
```

### Set up nsswitch.conf

Set up `nsswitch.conf` if users will actively sign in to client machines and access the Azure file shares. If planned access is limited to applications that use a user account or computer account and require Kerberos authentication to access the file share, you can skip this step.

After you join the host to the managed domain, add the `winbind` libraries to the user and group lookup paths. Use your text editor to edit `/etc/nsswitch.conf` and add the following entries:

```plaintext
passwd:         compat systemd winbind
group:          compat systemd winbind
```

Enable the winbind service to start automatically on reboot.

```bash
sudo systemctl enable winbind
```

Restart the service and check its status.

```bash
sudo systemctl restart winbind
sudo systemctl status winbind
```

Make sure that the managed domain users and groups are discovered.

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

If the preceding steps don't work, check whether a managed domain controller is reachable by using the `wbinfo` tool:

```bash
wbinfo --ping-dc
```

### Configure PAM for winbind

If users need to sign in to client machines and access the Azure file shares, configure PAM for winbind. If access is limited to applications that use a user account or computer account and require Kerberos authentication to access the file share, you can skip this step.

Place winbind in the authentication stack so that managed domain users authenticate through winbind. Configure PAM (Pluggable Authentication Module) for winbind. The second command ensures that the system creates the home directory for a domain user when they sign in.

```bash
sudo pam-auth-update --enable winbind
sudo pam-auth-update --enable mkhomedir
```

Verify that the PAM authentication configuration has the correct `pam_winbind.so` arguments in `/etc/pam.d/common-auth`:

```bash
grep pam_winbind.so /etc/pam.d/common-auth
```

```output
auth    [success=1 default=ignore]      pam_winbind.so krb5_auth krb5_ccache_type=FILE cached_login try_first_pass
```

If the command returns no output, rerun `sudo pam-auth-update --enable winbind` to ensure winbind is added to the PAM authentication stack.

You can now sign in to this system as the managed domain user through SSH, `su`, or another authentication method.

```bash
su - contososmbadmin
Password:
```

## Verify Microsoft Entra Domain Services authentication on Linux

To verify that the client machine is joined to the managed domain, look up the FQDN of the client by using a managed domain DNS server and confirm that the DNS entry exists for the client. In many cases, `<dnsserver>` is the same as the managed domain name that the client is joined to.

```bash
nslookup <clientname> <dnsserver>
```

Next, run `klist` to view the tickets in the Kerberos cache:

```bash
klist
```

The output should include an entry beginning with `krbtgt` that looks similar to:

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

After you enable Kerberos authentication and join your Linux VM to the managed domain, you can mount the file share.

Use the following mount option with all access control models to enable Kerberos security: `sec=krb5`. Omit the username and password when you use `sec=krb5`. For example:

```bash
sudo mount -t cifs $SMB_PATH $MNT_PATH -o sec=krb5,cruid=$UID,serverino,nosharesock,actimeo=30,mfsymlinks
```

> [!NOTE]
> This feature only supports a server-enforced access control model that uses NT ACLs without mode bits. Linux tools that update NT ACLs are minimal, so update ACLs through Windows. Client-enforced access control (`modefromsid,idsfromsid`) and client-translated access control (`cifsacl`) models aren't currently supported.

### Additional Azure Files SMB mount options for Linux

#### Single-user versus multi-user mount

In a single-user mount use case, a single user in the managed domain accesses the mount point and doesn't share it with other users in the domain. Each file access happens in the context of the user whose krb5 credentials are used to mount the file share. Any user on the local system who accesses the mount point impersonates that user.

In a multi-user mount use case, there's still a single mount point, but multiple managed domain users can access that same mount point. In scenarios where multiple users on the same client access the same share, and the system is configured for Kerberos and mounted with `sec=krb5`, consider using the `multiuser` mount option.

#### File permissions

File permissions matter, especially if both Linux and Windows clients access the file share. To convert file permissions to DACLs on files, use a default mount option such as **file_mode=<>,dir_mode=<>**. The client only enforces file permissions specified as **file_mode** and **dir_mode**. The server enforces access control based on the file's or directory's security descriptor.

#### File ownership

File ownership matters, especially if both Linux and Windows clients access the file share. Choose one of the following mount options to convert file ownership UID/GID to owner/group SID on file DACL:

- Use a default such as **uid=<>,gid=<>**.
- Configure UID/GID mapping through RFC2307 and Microsoft Entra Domain Services by using **nss_winbind** or **nss_sssd**.

#### File attribute cache coherency

Performance is important, even if file attributes aren't always accurate. The default value for **actimeo** is 1 (second), which means that the file attributes are fetched again from the server if the cached attributes are more than 1 second old. Increasing the value to 60 means that attributes are cached for at least one minute. For most use cases, use a value of 30 for this option (**actimeo=30**).

For newer kernels, consider setting the **actimeo** features more granularly. You can use **acdirmax** for directory entry revalidation caching and **acregmax** for caching file metadata, for example **acdirmax=60,acregmax=5**.

## Next step

To learn how to mount an SMB file share on Linux, see:

- [Mount SMB Azure file share on Linux](storage-how-to-use-files-linux.md)
