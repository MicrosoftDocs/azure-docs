---
title: AD Authentication without Domain Join Linux VM | Microsoft Docs
description: Learn how to configure AD User authentication on Linux VM without Active Directory Domain Services Join.
services: active-directory-ds
author: DevOpsStyle
manager: francesco.dauri

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: how-to
ms.date: 10/12/2022
ms.author: tommasosacco

---

# AD Authentication without Domain Join Linux VM | Microsoft Docs

Currently Linux distribution can work as member of Active Directory domains, which gives them access to the AD authentication system. To take advantage of AD authentication in some cases, we can avoid the AD join. To let users sign in on Azure Linux VM with Active Directory account you have different choices. One possibility is to Join in Active Directory the VM. Another possibility is to base the authentication flow through LDAP to your Active Directory without Join the VM on AD. This article shows you how to authenticate with AD credential on your Linux system (CentosOS) based on LDAP.

## Prerequisites

To complete the authentication flow we assume, you already have:

* An Active Directory Domain Services already configured.
* A Linux VM (for the test we use CentosOS based machine).
* A network infrastructure that allows communication between Active Directory and the Linux VM
* A dedicated User Account for read AD objects.
* The Linux VM need to have these packages installed:
    - sssd 
    - sssd-tools 
    - sssd-ldap
    - openldap-clients

## AD Configuration

To read Users in your Active Directory Domain Services create a ReadOnlyUser in AD. For create a new user follow the steps below:

1. Connect to your *Domain Controller*.
2. Click *Start*, point to *Administrative Tools*, and then click *Active Directory Users and Computers* to start the Active Directory Users and Computers console.
3. Click the domain name that you created, and then expand the contents.
4. Right-click Users, point to *New*, and then click *User*.
5. Type the first name, last name, and user logon name of the new user, and then click Next. In lab environment we used a user called *ReadOnlyUser*.
6. Type a *new password*, confirm the password, and then click to select one of the following check boxes if needed:
    - Users must change password at next logon (recommended for most user)
    - User cannot change password
    - Password never expires
    - Account is disabled (If you disable the account the authentication will fail)
7. Click *Next*.

Review the information that you provided, and if everything is correct, click Finish.

> [!NOTE]
> For testing purpose we use LDAP over 389 port. In production environment ensure to use a Certificate for the Bind. The test environment for this docs is based on Windows Server 2016 Domain and Forest level on Windows Server 2019 OS.

## Linux VM Configuration

> [!NOTE]
> You must run these command with sudo permission

On your Linux VM, install the following packages: *sssd sssd-tools sssd-ldap openldap-client*:

```console
yum install -y sssd sssd-tools sssd-ldap openldap-clients
```

After the installation check if LDAP search works. In order to check it try an LDAP search following the example below:

```console
ldapsearch -H ldap://<ip-domain-controller>:389 -x \
        -D CN=ReadOnlyUser,CN=Users,DC=cetesting,DC=it -w Read0nlyuserpassword \
        -b CN=Users,DC=<domain>,DC=<extension>
```

If the LDAP query works fine, you will obtain an output with some information like follow:

```console
extended LDIF

LDAPv3
base <CN=Users,DC=cetesting,DC=it> with scope subtree
filter: (objectclass=*)
requesting: ALL

Users, cetesting.it
dn: CN=Users,DC=cetesting,DC=it
objectClass: top
objectClass: container
cn: Users
description: Default container for upgraded user accounts
distinguishedName: CN=Users,DC=cetesting,DC=it
instanceType: 4
whenCreated: 20220913115340.0Z
whenChanged: 20220913115340.0Z
uSNCreated: 5660
uSNChanged: 5660
showInAdvancedViewOnly: FALSE
name: Users
objectGUID:: i9MABLytKUurB2uTe/dOzg==
systemFlags: -1946157056
objectCategory: CN=Container,CN=Schema,CN=Configuration,DC=cetesting,DC=it
isCriticalSystemObject: TRUE
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 16010101000000.0Z
```

> [!NOTE]
> If your obtain an error the password used is wrong. Ensure to use the correct password.

## Create sssd.conf file

Create */etc/sssd/sssd.conf* with a content like the following. Remember to update the *ldap_uri*, *ldap_search_base* and *ldap_default_bind_dn*.

Command for file creation:

```console
vi /etc/sssd/sssd.conf
```

Example sssd.conf:

```bash
[sssd]
config_file_version = 2
domains = default
services = nss, pam
full_name_format = %1$s

[nss]

[pam]

[domain/default]
id_provider = ldap
cache_credentials = True
ldap_uri = ldap://10.1.0.4:389
ldap_search_base = CN=Users,DC=cetesting,DC=it
ldap_schema = AD
ldap_default_bind_dn = CN=ReadOnlyUser,CN=Users,DC=cetesting,DC=it
ldap_default_authtok_type = obfuscated_password
ldap_default_authtok = leave-empty-for-now

# Obtain the CA root certificate for your LDAPS connection.
ldap_tls_cacert = /etc/pki/tls/cacerts.pem

# This setting disables cert verification.
#ldap_tls_reqcert = allow

# Only if the LDAP directory doesn't provide uidNumber and gidNumber attributes
ldap_id_mapping = True

# Consider setting enumerate=False for very large directories
enumerate = True

# Only needed if LDAP doesn't provide homeDirectory and loginShell attributes
fallback_homedir = /home/%u
default_shell = /bin/bash
```

Save the file with *ESC + wq!* command.

## Change permission for sssd.conf and create the obfuscated password

Set the permission to sssd.conf to 600 with the following command:

```console
chmod 600 /etc/sssd/sssd.conf
```

After that create an obfuscated password for the Bind DN account. You must insert the Domain password for ReadOnlyUser:

```console
[root@centos8 ~]sss_obfuscate --domain default
Enter password: Read0nly
Re-enter password: Read0nly
```

The password will be placed automatically in the configuration file.

## Configure the sssd service

Start the sssd service:

```console
service sssd start
```

Now configure the service with the *authconfig* tool:

```console
authconfig --enablesssd --enablesssdauth --enablemkhomedir --updateall
```

At this point restart the service:

```console
systemctl restart sssd
```

## Test the configuration

The final step is to check that the flow works properly. To check this, try logging in with one of your AD users in Active Directory. We tried with a user called *Francesca*. If the configuration is correct, you will get the following result:

```console
[root@centos8 ~]su - Francesca@cetesting.it
Last login: Wed Oct 12 15:13:39 UTC 2022 on pts/0
[Francesca@Centos8 ~]$ exit

```
Now you are ready to use AD authentication on your Linux VM.

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: ../active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: ../active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
