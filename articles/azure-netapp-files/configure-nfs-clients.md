---
title: Configure an NFS client for Azure NetApp Files | Microsoft Docs
description: Describes how to configure NFS clients to use with Azure NetApp Files. 
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 05/27/2022
ms.author: anfdocs
---
# Configure an NFS client for Azure NetApp Files

The NFS client configuration described in this article is part of the setup when you [configure NFSv4.1 Kerberos encryption](configure-kerberos-encryption.md) or [create a dual-protocol volume](create-volumes-dual-protocol.md) or [NFSv3/NFSv4.1 with LDAP](configure-ldap-extended-groups.md). A wide variety of Linux distributions are available to use with Azure NetApp Files. This article describes configurations for two of the more commonly used environments: RHEL 8 and Ubuntu 18.04. 

## Requirements and considerations  

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

    RHEL 8 uses chrony by default. Following the configuration guidelines in [Using the `Chrony` suite to configure NTP](https://access.redhat.com/documentation/en-us/red-hat-enterprise-linux/8/guide/6c230de2-39f1-455a-902d-737eea31ad34).

6.	Join the Active Directory domain:  

    `sudo realm join $DOMAIN.NAME -U $SERVICEACCOUNT --computer-ou="OU=$YOUROU"`

    For example: 

    `sudo realm join CONTOSO.COM -U ad_admin --computer-ou="CN=Computers"`
    
    Ensure that `default_realm` is set to the provided realm in `/etc/krb5.conf`.  If not, add it under the `[libdefaults]` section in the file as shown in the following example:
    
    ```
    [libdefaults]
        default_realm = CONTOSO.COM
        default_tkt_enctypes = aes256-cts-hmac-sha1-96
        default_tgs_enctypes = aes256-cts-hmac-sha1-96
        permitted_enctypes = aes256-cts-hmac-sha1-96
    [realms]
        CONTOSO.COM = {
            kdc = dc01.contoso.com
            admin_server = dc01.contoso.com
            master_kdc = dc01.contoso.com
            default_domain = contoso.com
        }
    [domain_realm]
        .contoso.com = CONTOSO.COM
        contoso.com = CONTOSO.COM
    [logging]
        kdc = SYSLOG:INFO
        admin_server = FILE=/var/kadm5.log
    ```

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
    
    In the `[domain/contoso-ldap]` configuration above:
    * `id_provider` is set to `ldap` and not `ad`.
    * The configuration has specified search bases and user and group classes for searches.
    * `ldap_sasl_authid` is the machine account name from `klist -kte`.
    * `use_fully_qualified_names` is set to `false`.  This setting means this configuration is used when a short name is used.
    * `ldap_id_mapping` is NOT specified, which defaults to `false`.

    The `realm join` configuration is generated by the client and looks like this:
 
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
    
    In the `[domain/contoso.com]` configuration above:
    * `id_provider` is set to `ad`.
    * `ldap_id_mapping` is set to `true`. It uses the SSSD generated IDs. Alternately, you can set this value to `false` if you want to use POSIX UIDs for ALL styles of usernames. You can determine the value based on your client configuration. 
    * `use_fully_qualified_names` is `true`. This setting means `user@CONTOSO.COM` will use this configuration.

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

2. Ensure that your `/etc/nsswitch.conf` file has the following `ldap` entries:   
    `passwd:    compat systemd ldap`   
    `group:     compat systemd ldap`

3. Run the following command to restart and enable the service:

    `sudo systemctl restart nscd && sudo systemctl enable nscd`   

The following example queries the AD LDAP server from Ubuntu LDAP client for an LDAP user `‘hari1’`: 

`root@cbs-k8s-varun4-04:/home/cbs# getent passwd hari1`   
`hari1:*:1237:1237:hari1:/home/hari1:/bin/bash`   

## Configure two VMs with the same hostname to access NFSv4.1 volumes 

This section explains how you can configure two VMs that have the same hostname to access Azure NetApp Files NFSv4.1 volumes. This procedure can be useful when you conduct a disaster recovery (DR) test and require a test system with the same hostname as the primary DR system. This procedure is only required when you have the same hostname on two VMs that are accessing the same Azure NetApp Files volumes.  

NFSv4.x requires each client to identify itself to servers with a *unique* string. File open and lock state shared between one client and one server is associated with this identity. To support robust NFSv4.x state recovery and transparent state migration, this identity string must not change across client reboots.

1. Display the `nfs4_unique_id` string on the VM clients by using the following command:
    
    `# systool -v -m nfs | grep -i nfs4_unique`     
    `    nfs4_unique_id      = ""`

    To mount the same volume on an additional VM with the same hostname, for example the DR system, create a `nfs4_unique_id` so it can uniquely identify itself to the Azure NetApp Files NFS service.  This step allows the service to distinguish between the two VMs with the same hostname and enable mounting NFSv4.1 volumes on both VMs.  

    You need to perform this step on the test DR system only. For consistency, you can consider applying a unique setting on each involved virtual machine.

2. On the test DR system, add the following line to the `nfsclient.conf` file, typically located in `/etc/modprobe.d/`:

    `options nfs nfs4_unique_id=uniquenfs4-1`  

    The string `uniquenfs4-1` can be any alphanumeric string, as long as it is unique across the VMs to be connected to the service.

    Check your distribution’s documentation about how to configure NFS client settings.

    Reboot the VM for the change to take effect.

3. On the test DR system, verify that `nfs4_unique_id` has been set after the VM reboot:       

    `# systool -v -m nfs | grep -i nfs4_unique`   
    `   nfs4_unique_id      = "uniquenfs4-1"`   

4. [Mount the NFSv4.1 volume](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) on both VMs as normal.

    Both VMs with the same hostname can now mount and access the NFSv4.1 volume.  

## Next steps  

* [Create an NFS volume for Azure NetApp Files](azure-netapp-files-create-volumes.md)
* [Create a dual-protocol volume for Azure NetApp Files](create-volumes-dual-protocol.md)
* [Mount a volume for Windows or Linux virtual machines](azure-netapp-files-mount-unmount-volumes-for-virtual-machines.md) 
