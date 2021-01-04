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
ms.date: 11/09/2020
ms.author: b-juche
---
# Configure an NFS client for Azure NetApp Files

The NFS client configuration described in this article is part of the setup when you [configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) or [create a dual-protocol volume](create-volumes-dual-protocol.md). A wide variety of Linux distributions are available to use with Azure NetApp Files. This article describes configurations for two of the more commonly used environments: RHEL 8 and Ubuntu 18.04. 

Regardless of the Linux flavor you use, the following configurations are required:
* Configure an NTP client to avoid issues with time skew.
* Configure DNS entries of the Linux client for name resolution.  
    This configuration must include the “A” (forward) record and the PTR (reverse) record . 
* For domain join, create a computer account for the Linux client in the target Active Directory (which is created during the realm join command). 
    > [!NOTE] 
    > The `$SERVICEACCOUNT` variable used in the commands below should be a user account with permissions or delegation to create a computer account in the targeted Organizational Unit.

## RHEL 8 configuration 

This section describes RHEL configurations required for NFSv4.1 Kerberos encryption and dual protocol.  

The examples in this section use the following domain name and IP address:  

* Domain name: `contoso.com`
* Private IP: `10.6.1.4`

### <a name="rhel8_nfsv41_kerberos"></a>RHEL 8 configuration if you are using NFSv4.1 Kerberos encryption

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

    RHEL 8 uses chrony by default. Following the configuration guidelines in [Using the `Chrony` suite to configure NTP](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/configuring_basic_system_settings/using-chrony-to-configure-ntp).

6.	Join the Active Directory domain:  

    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou="OU=$YOUROU"`

    For example: 

    `sudo realm join CONTOSO.COM -U ad_admin --computer-ou="CN=Computers"`
    
    Ensure that `default_realm` is set to the provided realm in `/etc/krb5.conf`.  If not, add it under the `[libdefaults]` section in the file as shown in the following example:
    
    `default_realm = CONTOSO.COM`

7. Restart all NFS services:  
 
    `systemctl start nfs-*`   
    `systemctl restart rpc-gssd.service`

    The restart prevents the error condition `“mount.nfs: an incorrect mount option was specified”` during Kerberos mount.

8. Run the `kinit` command with the user account to get tickets: 
 
    `sudo kinit $SERVICEACCOUNT@DOMAIN`  

    For example:   

    `sudo kinit ad_admin@CONTOSO.COM`


### RHEL 8 configuration if you are using dual protocol

The following steps are optional. You need to perform the steps only if you use user mapping at the NFS client: 

1. Complete all steps described in the [RHEL 8 configuration if you are using NFSv4.1 Kerberos encryption](#rhel8_nfsv41_kerberos) section.   

2. Add a static DNS record in your /etc/hosts file to use fully qualified domain name (FQDN) for your AD, instead of using the IP address in SSSD configuration file:  

    `cat /etc/hosts`   
    `10.6.1.4 winad2016.contoso.com`

3. Add an extra section for domains to resolve identifiers from AD LDAP server:    

    `[root@reddoc cbs]# cat /etc/sssd/sssd.conf`   
    `[sssd]`   
    `domains = contoso.com, contoso-ldap (new entry added for LDAP as id_provider)`   
    `config_file_version = 2`   
    `services = nss, pam, ssh, sudo (ensure nss is present in this list)`   
 
    `[domain/contoso-ldap] (Copy the following lines. Modify as per your domain name.)`   
    `auth_provider = krb5`   
    `chpass_provider = krb5`   
    `id_provider = ldap`   
    `ldap_search_base = dc=contoso,dc=com(your domain)`   
    `ldap_schema = rfc2307bis`   
    `ldap_sasl_mech = GSSAPI`   
    `ldap_user_object_class = user`   
    `ldap_group_object_class = group`   
    `ldap_user_home_directory = unixHomeDirectory`   
    `ldap_user_principal = userPrincipalName`   
    `ldap_account_expire_policy = ad`   
    `ldap_force_upper_case_realm = true`   
    `ldap_user_search_base = cn=Users,dc=contoso,dc=com (based on your domain)`   
    `ldap_group_search_base = cn=Users,dc=contoso,dc=com (based on your domain)`   
    `ldap_sasl_authid = REDDOC$ (ensure $ at the end you can get this from “klist -kte” command)`   
    `krb5_server = winad2016.contoso.com (same as AD address which is added in /etc/hosts)`   
    `krb5_realm = CONTOSO.COM (domain name in caps)`   
    `krb5_kpasswd = winad2016.contoso.com (same as AD address which is added in /etc/hosts)`   
    `use_fully_qualified_names = false`   
 
    `[domain/contoso.com]  (Do not edit or remove any of the following information. This information is automatically generated during the realm join process.)`   
    `ad_domain = contoso.com`   
    `krb5_realm = CONTOSO.COM`   
    `realmd_tags = manages-system joined-with-adcli`   
    `cache_credentials = True`   
    `id_provider = ad`   
    `krb5_store_password_if_offline = True`   
    `default_shell = /bin/bash`   
    `ldap_id_mapping = True`   
    `use_fully_qualified_names = True`   
    `fallback_homedir = /home/%u@%d`   
    `access_provider = ad`   

4. Ensure your `/etc/nsswitch.conf` has the `sss` entry:   

    `cat /etc/nsswitch.conf`   
    `passwd: sss files systemd`   
    `group: sss files systemd`   
    `netgroup: sss files`   

5. Restart the `sssd` service and clear cache:   

    `service sssd stop`   
    `rm -f /var/lib/sss/db/*`   
    `service sssd start`   
 
6. Test to ensure that your client is integrated with the LDAP server:   

    `[root@red81 cbs]# id ldapuser1`   
    `uid=1234(ldapuser1) gid=1111(ldapgroup1) groups=1111(ldapgroup1)`   

## Ubuntu configuration   

This section describes Ubuntu configurations required for NFSv4.1 Kerberos encryption and dual protocol. 

The examples in this section use the following domain name and IP address:  

* Domain name: `contoso.com`
* Private IP: `10.6.1.4`

1. Configure `/etc/resolv.conf` with the proper DNS server:

    `root@ubuntu-rak:/home/cbs# cat /etc/resolv.conf`   
    `search contoso.com`   
    `nameserver <private IP address of DNS server>`   

2. Add NFS client record in the DNS server for the DNS forward and reverse lookup zone.
 
    To verify DNS, use the following commands from the NFS client:

    `# nslookup [hostname/FQDN of NFS client(s)]`   
    `# nslookup [IP address of NFS client(s)]`   

3. Install packages:
 
    `apt-get update`   
    `apt-get install -y realmd packagekit sssd adcli samba-common chrony krb5-user nfs-common`
    
    When prompted, input `$DOMAIN.NAME` (using uppercase, for example, `CONTOSO.COM`) as the default Kerberos realm.

4. Restart the service `rpc-gssd.service`: 

    `sudo systemctl start rpc-gssd.service`

5. Ubuntu 18.04 uses chrony by default. Following the configuration guidelines in [Ubuntu Bionic: Using chrony to configure NTP](https://ubuntu.com/blog/ubuntu-bionic-using-chrony-to-configure-ntp).

6. Join the Active Directory domain:   
 
    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou="OU=$YOUROU"`
 
    For example:    
    `sudo realm join CONTOSO.COM -U ad_admin --computer-ou="CN=Computers"`

7. Perform `kinit` with the user to get tickets: 
 
    `sudo kinit $SERVICEACCOUNT`   
 
    For example:    
    `sudo kinit ad_admin`  

### Ubuntu configuration if you are using dual protocol  

The following steps are optional.  You need to perform the steps only if you want to use user mapping at the NFS client:  

1. Run the following command to upgrade the installed packages:   
    `sudo apt update && sudo apt install libnss-ldap libpam-ldap ldap-utils nscd`

    The following example uses sample values. When the command prompts you for input, you should provide input based on your environment. 

    `base dc=contoso,dc=com uri ldap://10.20.0.4:389/ ldap_version 3 rootbinddn cn=admin,cn=Users,dc=contoso,dc=com pam_password ad`   

2. Run the following command to restart and enable the service:

    `sudo systemctl restart nscd && sudo systemctl enable nscd`   

The following example queries the AD LDAP server from Ubuntu LDAP client for an LDAP user `‘hari1’`: 

`root@cbs-k8s-varun4-04:/home/cbs# getent passwd hari1`   
`hari1:*:1237:1237:hari1:/home/hari1:/bin/bash`   


## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)

