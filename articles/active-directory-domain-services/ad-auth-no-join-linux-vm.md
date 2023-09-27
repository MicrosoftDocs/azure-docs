---
title: Active Directory authentication non domain joined Linux Virtual Machines
description: Active Directory authentication non domain joined Linux Virtual Machines.
services: active-directory-ds
author: DevOpsStyle

ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.custom: devx-track-linux
ms.topic: how-to
ms.date: 01/29/2023
ms.author: tommasosacco
---

# Active Directory authentication non domain joined Linux Virtual Machines

Currently Linux distribution can work as member of Active Directory domains, which gives them access to the AD authentication system. To take advantage of AD authentication in some cases, we can avoid the AD join. To let users sign in on Azure Linux VM with Active Directory account you have different choices. One possibility is to Join in Active Directory the VM. Another possibility is to base the authentication flow through LDAP to your Active Directory without Join the VM on AD. This article shows you how to authenticate with AD credential on your Linux system (CentosOS) based on LDAP.

## Prerequisites

To complete the authentication flow we assume, you already have:

* An Active Directory Domain Services already configured.
* A Linux VM (**for the test we use CentosOS based machine**).
* A network infrastructure that allows communication between Active Directory and the Linux VM.
* A dedicated User Account for read AD objects.
* The Linux VM need to have these packages installed:
    - sssd 
    - sssd-tools 
    - sssd-ldap
    - openldap-clients
* An LDAPS Certificate correctly configured on the Linux VM.
* A CA Certificate correctly imported into Certificate Store of the Linux VM (the path varies depending on the Linux distro).

## Active Directory User Configuration

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
> The lab environment is based on:
> - Windows Server 2016 Domain and Forest Functional Level.
> - Linux client Centos 8.5.

## Linux Virtual Machines Configuration

> [!NOTE]
> You must run these command with sudo permission

On your Linux VM, install the following packages: *sssd sssd-tools sssd-ldap openldap-client*:

```bash
sudo dnf install -y sssd sssd-tools sssd-ldap openldap-clients
```

After the installation check if LDAP search works. In order to check it try an LDAP search following the example below:

```bash
sudo ldapsearch -H ldaps://contoso.com -x \
        -D CN=ReadOnlyUser,CN=Users,DC=contoso,DC=com -w Read0nlyuserpassword \
        -b CN=Users,DC=contoso,DC=com
```

If the LDAP query works fine, you will obtain an output with some information like follow:

```config
extended LDIF

LDAPv3
base <CN=Users,DC=contoso,DC=com> with scope subtree
filter: (objectclass=*)
requesting: ALL

Users, contoso.com
dn: CN=Users,DC=contoso,DC=com
objectClass: top
objectClass: container
cn: Users
description: Default container for upgraded user accounts
distinguishedName: CN=Users,DC=contoso,DC=com
instanceType: 4
whenCreated: 20220913115340.0Z
whenChanged: 20220913115340.0Z
uSNCreated: 5660
uSNChanged: 5660
showInAdvancedViewOnly: FALSE
name: Users
objectGUID:: i9MABLytKUurB2uTe/dOzg==
systemFlags: -1946157056
objectCategory: CN=Container,CN=Schema,CN=Configuration,DC=contoso,DC=com
isCriticalSystemObject: TRUE
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 20220930113600.0Z
dSCorePropagationData: 16010101000000.0Z
```

> [!NOTE]
> If your get and error run the following command:
>
> sudo ldapsearch -H ldaps://contoso.com -x \
>       -D CN=ReadOnlyUser,CN=Users,DC=contoso,DC=com -w Read0nlyuserpassword \
>       -b CN=Users,DC=contoso,DC=com -d 3
>
> Troubleshoot according to the output.

## Create sssd.conf file

Create */etc/sssd/sssd.conf* with a content like the following. Remember to update the *ldap_uri*, *ldap_search_base* and *ldap_default_bind_dn*.

Command for file creation:

```bash
sudo vi /etc/sssd/sssd.conf
```

Example sssd.conf:

```config
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
ldap_uri = ldaps://contoso.com
ldap_search_base = CN=Users,DC=contoso,DC=com
ldap_schema = AD
ldap_default_bind_dn = CN=ReadOnlyUser,CN=Users,DC=contoso,DC=com
ldap_default_authtok_type = obfuscated_password
ldap_default_authtok = generated_password

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
access_provider = permit
sudo_provider = ldap
auth_provider = ldap
autofs_provider = ldap
resolver_provider = ldap

```

Save the file with *ESC + wq!* command.

> [!NOTE]
> If you don't have a valid TLS certificate under */etc/pki/tls/* called *cacerts.pem* the bind doesn't work

## Change permission for sssd.conf and create the obfuscated password

Set the permission to sssd.conf to 600 with the following command:

```bash
sudo chmod 600 /etc/sssd/sssd.conf
```

After that create an obfuscated password for the Bind DN account. You must insert the Domain password for ReadOnlyUser:

```bash
sudo sss_obfuscate --domain default
```

The password will be placed automatically in the configuration file.

## Configure the sssd service

Start the sssd service:

```bash
sudo systemctl start sssd
```

Now configure the service with the *authconfig* tool:

```bash
sudo authconfig --enablesssd --enablesssdauth --enablemkhomedir --updateall
```

At this point restart the service:

```bash
sudo systemctl restart sssd
```

## Test the configuration

The final step is to check that the flow works properly. To check this, try logging in with one of your AD users in Active Directory. We tried with a user called *ADUser*. If the configuration is correct, you will get the following result:

```output
[centosuser@centos8 ~]su - ADUser@contoso.com
Last login: Wed Oct 12 15:13:39 UTC 2022 on pts/0
[ADUser@Centos8 ~]$ exit
```

Now you are ready to use AD authentication on your Linux VM.

<!-- INTERNAL LINKS -->
[create-azure-ad-tenant]: /azure/active-directory/fundamentals/sign-up-organization.md
[associate-azure-ad-tenant]: /azure/active-directory/fundamentals/how-subscriptions-associated-directory.md
[create-azure-ad-ds-instance]: tutorial-create-instance.md
