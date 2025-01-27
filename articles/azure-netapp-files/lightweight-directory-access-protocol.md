---
title: Understand the use of LDAP with Azure NetApp Files | Microsoft Learn
description: This article helps you understand how Azure NetApp Files uses lightweight directory access protocol (LDAP).
services: azure-netapp-files
author: whyistheinternetbroken
ms.service: azure-netapp-files
ms.topic: conceptual
ms.date: 06/05/2024
ms.author: anfdocs
---

# Understand the use of LDAP with Azure NetApp Files

Lightweight directory access protocol (LDAP) is a standard directory access protocol that was developed by an international committee called the Internet Engineering Task Force (IETF). LDAP is intended to provide a general-purpose, network-based directory service that you can use across heterogeneous platforms to locate network objects. 

LDAP models define how to communicate with the LDAP directory store, how to find an object in the directory, how to describe the objects in the store, and the security that is used to access the directory. LDAP allows customization and extension of the objects that are described in the store. Therefore, you can use an LDAP store to store many types of diverse information. Many of the initial LDAP deployments focused on the use of LDAP as a directory store for applications such as email and web applications and to store employee information. Many companies are replacing or have replaced Network Information Service (NIS) with LDAP as a network directory store.

An LDAP server provides UNIX user and group identities for use with NAS volumes. In Azure NetApp Files, Active Directory is the only currently supported LDAP server that can be used. This support includes both Active Directory Domain Services (AD DS) and Microsoft Entra Domain Services.

LDAP requests can be broken down into two main operations.

* **LDAP binds** are logins to the LDAP server from an LDAP client. The bind is used to authenticate to the LDAP server with read-only access to perform LDAP lookups. Azure NetApp Files acts as an LDAP client.   
* **LDAP lookups** are used to query the directory for user and group information, such as names, numeric IDs, home directory paths, login shell paths, group memberships and more.

LDAP can store the following information that is used in dual-protocol NAS access:  

* User names
* Group names
* Numeric user IDs (UIDs) and group IDs (GIDs)
* Home directories
* Login shell
* Netgroups, DNS names, and IP addresses
* Group membership

Currently, Azure NetApp Files only uses LDAP for user and group information – no netgroup or host information.

LDAP offers various benefits for your UNIX users and groups as an identity source.

* **LDAP is future-proof.**  
    As more NFS clients add support for NFSv4.x, NFSv4.x ID domains that contain an up-to-date list of users and groups accessible from clients and storage are needed to ensure optimal security and guaranteed access when access is defined. Having an identity-management server that provides one-to-one name mappings for SMB and NFS users alike greatly simplifies life for storage administrators, not just in the present, but for years to come. 
* **LDAP is scalable.**  
    LDAP servers offer the ability to contain millions of user and group objects, and with Microsoft Active Directory, multiple servers can be used to replicate across multiple sites for both performance and resiliency scale. 
* **LDAP is secure.**  
    LDAP offers security in the form of how a storage system can connect to the LDAP server to make requests for user information. LDAP servers offer the following bind levels:
    * Anonymous (disabled by default in Microsoft Active Directory; not supported in Azure NetApp Files)  
    * Simple password (plain text passwords; not supported in Azure NetApp Files)  
    * [Simple Authentication and Security Layer (SASL)](https://www.iana.org/assignments/sasl-mechanisms/sasl-mechanisms.xhtml#:~:text=The%20Simple%20Authentication%20and%20Security,support%20to%20connection%2Dbased%20protocols.) – Encrypted bind methods including TLS, SSL, Kerberos, and so on. Azure NetApp Files supports LDAP over TLS, LDAP signing (using Kerberos), LDAP over SSL. 
* **LDAP is robust.**  
    NIS, NIS+, and local files offer basic information such UID, GID, password, home directories, and so on. However, LDAP offers those attributes and many more. The additional attributes that LDAP uses makes dual-protocol management much more integrated with LDAP versus NIS. Only LDAP is supported as an external name service for identity management with Azure NetApp Files. 
* **Microsoft Active Directory is built on LDAP.**  
    By default, Microsoft Active Directory uses an LDAP back-end for its user and group entries. However, this LDAP database doesn't contain UNIX style attributes. These attributes are added when the LDAP schema is extended through Identity Management for UNIX (Windows 2003R2 and later), Service for UNIX (Windows 2003 and earlier), or third-party LDAP tools such as *Centrify*. Because Microsoft uses LDAP as a back-end, it makes LDAP the perfect solution for environments that choose to leverage dual-protocol volumes in Azure NetApp Files. 
    > [!NOTE]
    > Azure NetApp Files currently only supports native Microsoft Active Directory for LDAP services.

## LDAP basics in Azure NetApp Files 

The following section discusses the basics of LDAP as it pertains to Azure NetApp Files.

* LDAP information is stored in flat files in an LDAP server and is organized by way of an LDAP schema. You should configure LDAP clients in a way that coordinates their requests and lookups with the schema on the LDAP server.
* LDAP clients initiate queries by way of an LDAP bind, which is essentially a login to the LDAP server using an account that has read access to the LDAP schema. The LDAP bind configuration on the clients is configured to use the security mechanism that is defined by the LDAP server. Sometimes, they are user name and password exchanges in plain text (simple). In other cases, binds are secured through Simple Authentication and Security Layer methods (`sasl`) such as Kerberos or LDAP over TLS. Azure NetApp Files uses the SMB machine account to bind using SASL authentication for the best possible security.
* User and group information that is stored in LDAP is queried by clients by using standard LDAP search requests as defined in [RFC 2307](https://datatracker.ietf.org/doc/html/rfc2307). In addition, newer mechanisms, such as [RFC 2307bis](https://datatracker.ietf.org/doc/html/draft-howard-rfc2307bis-02), allow more streamlined user and group lookups. Azure NetApp Files uses a form of RFC 2307bis for its schema lookups in Windows Active Directory. 
* LDAP servers can store user and group information and netgroup. However, Azure NetApp Files currently can't use netgroup functionality in LDAP on Windows Active Directory.
* LDAP in Azure NetApp Files operates on port 389. This port currently can't be modified to use a custom port, such as port 636 (LDAP over SSL) or port 3268 (Active Directory Global Catalog searches).
* Encrypted LDAP communications can be achieved using [LDAP over TLS](configure-ldap-over-tls.md#considerations) (which operates over port 389) or LDAP signing, both of which can be configured on the Active Directory connection.
* Azure NetApp Files supports LDAP queries that take no longer than 3 seconds to complete. If the LDAP server has many objects, that timeout may be exceeded, and authentication requests can fail. In those cases, consider specifying an [LDAP search scope](https://ldap.com/the-ldap-search-operation/) to filter queries for better performance.
* Azure NetApp Files also supports specifying preferred LDAP servers to help speed up requests. Use this setting if you want to ensure the LDAP server closest to your Azure NetApp Files region is being used.
* If no preferred LDAP server is set, the Active Directory domain name is queried in DNS for LDAP service records to populate the list of LDAP servers available for your region located within that SRV record. You can manually query LDAP service records in DNS from a client using [`nslookup`](/troubleshoot/windows-server/networking/verify-srv-dns-records-have-been-created) or [`dig`](https://www.cyberciti.biz/faq/linux-unix-dig-command-examples-usage-syntax/) commands. 

    For example: 
    ```
    C:\>nslookup
    Default Server:  localhost
    Address:  ::1
    
    > set type=SRV
    > _ldap._tcp.contoso.com.
    
    Server:  localhost
    Address:  ::1
    
    _ldap._tcp.contoso.com   SRV service location:
              priority       = 0
              weight         = 0
              port           = 389
              svr hostname   = oneway.contoso.com
    _ldap._tcp.contoso.com   SRV service location:
              priority       = 0
              weight         = 100
              port           = 389
              svr hostname   = ONEWAY.Contoso.com
    _ldap._tcp.contoso.com   SRV service location:
              priority       = 0
              weight         = 100
              port           = 389
              svr hostname   = oneway.contoso.com
    _ldap._tcp.contoso.com   SRV service location:
              priority       = 0
              weight         = 100
              port           = 389
              svr hostname   = parisi-2019dc.contoso.com
    _ldap._tcp.contoso.com   SRV service location:
              priority       = 0
              weight         = 100
              port           = 389
              svr hostname   = contoso.com
    oneway.contoso.com       internet address = x.x.x.x
    ONEWAY.Contoso.com       internet address = x.x.x.x
    oneway.contoso.com       internet address = x.x.x.x
    parisi-2019dc.contoso.com        internet address = y.y.y.y
    contoso.com      internet address = x.x.x.x
    contoso.com      internet address = y.y.y.y
    ```
* LDAP servers can also be used to perform custom name mapping for users. For more information, see [Custom name mapping using LDAP](#custom-name-mapping-using-ldap). 
* LDAP query timeouts 

    By default, LDAP queries time out if they can't completed in a timely fashion. If an LDAP query fails due to a timeout, the user and/or group lookup will fail and access to the Azure NetApp Files volume may be denied, depending on the permission settings of the volume. Refer to [Create and manage Active Directory connections](create-active-directory-connections.md#ldap-query-timeouts) to understand Azure NetApp Files LDAP query timeout settings.

## Name mapping types

Name mapping rules can be broken down into two main types: *symmetric* and *asymmetric*.

* *Symmetric* name mapping is implicit name mapping between UNIX and Windows users who use the same user name. For example, Windows user `CONTOSO\user1` maps to UNIX user `user1`.  
* *Asymmetric* name mapping is name mapping between UNIX and Windows users who use **different** user names. For example, Windows user `CONTOSO\user1` maps to UNIX user `user2`.

By default, Azure NetApp Files uses symmetric name mapping rules. If asymmetric name mapping rules are required, consider configuring the LDAP user objects to use them.

## Custom name mapping using LDAP

LDAP can be a name mapping resource, if the LDAP schema attributes on the LDAP server have been populated. For example, to map UNIX users to corresponding Windows user names that don't match one-to-one (that is, *asymmetric*), you can specify a different value for `uid` in the user object than what is configured for the Windows user name.

In the following example, a user has a Windows name of `asymmetric` and needs to map to a UNIX identity of `UNIXuser`. To achieve that in Azure NetApp Files, open an instance of the [Active Directory Users and Computers MMC](/troubleshoot/windows-server/system-management-components/remote-server-administration-tools). Then, find the desired user and open the properties box. (Doing so requires [enabling the Attribute Editor](http://directoryadmin.blogspot.com/2019/02/attribute-editor-tab-missing-in-active.html)). Navigate to the Attribute Editor tab and find the UID field, then populate the UID field with the desired UNIX user name `UNIXuser` and click **Add** and **OK** to confirm.

:::image type="content" source="./media/lightweight-directory-access-protocol/asymmetric-properties.png" alt-text="Screenshot that shows the Asymmetric Properties window and Multi-valued String Editor window." lightbox="./media/lightweight-directory-access-protocol/asymmetric-properties.png":::

After this action is done, files written from Windows SMB shares by the Windows user `asymmetric` will be owned by `UNIXuser` from the NFS side.

The following example shows Windows SMB owner `asymmetric`:

:::image type="content" source="./media/lightweight-directory-access-protocol/windows-owner-asymmetric.png" alt-text="Screenshot that shows Windows SMB owner named Asymmetric." lightbox="./media/lightweight-directory-access-protocol/windows-owner-asymmetric.png":::

The following example shows NFS owner `UNIXuser` (mapped from Windows user `asymmetric` using LDAP):

```
root@ubuntu:~# su UNIXuser
UNIXuser@ubuntu:/root$ cd /mnt
UNIXuser@ubuntu:/mnt$ ls -la
total 8
drwxrwxrwx  2 root     root   4096 Jul  3 20:09 .
drwxr-xr-x 21 root     root   4096 Jul  3 20:12 ..
-rwxrwxrwx  1 UNIXuser group1   19 Jul  3 20:10 asymmetric-user-file.txt
```
## Allow local NFS users with LDAP

When a user attempts to access an Azure NetApp Files volume via NFS, the request comes in a numeric ID. By default, Azure NetApp Files supports extended group memberships for NFS users (to go beyond the standard 16 group limit). As a result, Azure NetApp files will attempt to take that numeric ID and look it up in LDAP in an attempt to resolve the group memberships for the user rather than passing the group memberships in an RPC packet. Due to this behavior, if that numeric ID cannot be resolved to a user in LDAP, the lookup will fail and access will be denied – even if the requesting user has permission to access the volume or data structure. The Allow local NFS users with LDAP option in Active Directory connections is intended to disable those LDAP lookups for NFS requests by disabling the extended group functionality. It doesn't provide “local user creation/management” within Azure NetApp Files.

When “Allow local NFS users with LDAP” option is enabled, numeric IDs are passed to Azure NetApp Files and no LDAP lookup is performed. This creates varying behavior for different scenarios, as covered below.

### NFSv3 with UNIX security style volumes

Numeric IDs don't need to be translated to user names. The “Allow local NFS users with LDAP” option will not impact access to the volume but may impact how user/group ownership (name translation) is displayed on the NFS client. For instance, if a numeric ID of 1001 is user1 in LDAP, but is user2 on the NFS client’s local passwd file, the client will display “user2” as the owner of the file when the numeric ID is 1001.

### NFSv4.1 with UNIX security style volumes
Numeric IDs don't need to be translated to user names. By default, NFSv4.1 uses name strings (user@CONTOSO.COM) for its authentication. However, Azure NetApp Files supports the use of numeric IDs with NFSV4.1, which means that NFSv4.1 requests will arrive to the NFS server with a numeric ID. If no numeric ID to user name translation exists in local files or name services like LDAP for the Azure NetApp Files volume, then the numeric is presented to the client. If a numeric ID translates to a user name, then the name string will be used. If the name string doesn't match, the client will squash the name to the anonymous user specified in the client’s idmapd.conf file. Enabling the “Allow local NFS users with LDAP” option will not impact NFSv4.1 access, as it will fall back to standard NFSv3 behavior unless Azure NetApp Files can resolve a numeric ID to a user name in its local NFS user database. Azure NetApp Files has a set of default UNIX users that can be problematic for some clients and squash to a “nobody” user if domain ID strings do not match.
* Local users include: root (0), pcuser (65534), nobody (65535).
* Local groups include: root (0), daemon (1), pcuser (65534), nobody (65535).
  
Most commonly, root may show incorrectly in NFSv4.1 client mounts when the NFSv4.1 domain ID is misconfigured. For more information on the NFSv4.1 ID domain, see [Configuring NFSv4.1 ID domain for Azure NetApp Files](https://www.youtube.com/watch?v=UfaJTYWSVAY). 

NFSv4.1 ACLs can be configured using either a name string or a numeric ID. If numeric IDs are used, no name translation is required. If a name string is used, then name translation would be required for proper ACL resolution. When using NFSv4.1 ACLs, enabling “Allow local NFS users with LDAP” may cause incorrect NFSv4.1 ACL behavior depending on the ACL configuration.

### NFS (v3 and v4.1) with NTFS security style volumes in dual protocol configurations
UNIX security style volumes leverage UNIX style permissions (mode bits and NFSv4.1 ACLs). For those types of volumes, NFS leverages only UNIX-style authentication leveraging a numeric ID or a name string, depending on the scenarios listed above. NTFS security style volumes, however, use NTFS style permissions. These permissions are assigned using Windows users and groups. When an NFS user attempts to access a volume with an NTFS style permission, a UNIX to Windows name mapping must occur to ensure proper access controls. In this scenario, the NFS numeric ID is still passed to the Azure NetApp Files NFS volume, but there is a requirement for the numeric ID to be translated to a UNIX user name so that it can then be mapped to a Windows user name for initial authentication. For instance, if numeric ID 1001 attempts to access an NFS mount with NTFS security style permissions that allow access to Windows user “user1,” then 1001 would need to be resolved in LDAP to the “user1” user name to gain expected access. If no user with the numeric ID of “1001” exists in LDAP, or if LDAP is misconfigured, then the UNIX to Windows name mapping that is attempted will be 1001@contoso.com. In most cases, users with that name do not exist, so authentication fails and access is denied. Similarly, if the numeric ID 1001 resolves to the wrong user name (such as user2) then the NFS request will map to an unexpected Windows user and the permissions for the user will use the “user2” access controls.

Enabling “Allow local NFS users with LDAP” will disable all LDAP translations of numeric IDs to user names, which will effectively break access to NTFS security style volumes. As such, use of this option with NTFS security style volumes is highly discouraged.

## LDAP schemas

LDAP schemas are how LDAP servers organize and collect information. LDAP server schemas generally follow the same standards, but different LDAP server providers might have variations on how schemas are presented. 

When Azure NetApp Files queries LDAP, schemas are used to help speed up name lookups because they enable the use of specific attributes to find information about a user, such as the UID. The schema attributes must exist in the LDAP server for Azure NetApp Files to be able to find the entry. Otherwise, LDAP queries might return no data and authentication requests might fail.

For example, if a UID number (such as root=0) must be queried by Azure NetApp Files, then the schema attribute RFC 2307 `uidNumber Attribute` is used. If no UID number `0` exists in LDAP in the `uidNumber` field, then the lookup request fails.

The schema type currently used by Azure NetApp Files is a form of schema based on RFC 2307bis and can't be modified.

[RFC 2307bis](https://tools.ietf.org/html/draft-howard-rfc2307bis-02) is an extension of RFC 2307 and adds support for `posixGroup`, which enables dynamic lookups for auxiliary groups by using the `uniqueMember` attribute, rather than by using the `memberUid` attribute in the LDAP schema. Instead of using just the name of the user, this attribute contains the full distinguished name (DN) of another object in the LDAP database. Therefore, groups can have other groups as members, which allows nesting of groups. Support for RFC 2307bis also adds support for the object class `groupOfUniqueNames`.

This RFC extension fits nicely into how Microsoft Active Directory manages users and groups through the usual management tools. This is because when you add a Windows user to a group (and if that group has a valid numeric GID) using the standard Windows management methods, LDAP lookups will pull the necessary supplemental group information from the usual Windows attribute and find the numeric GIDs automatically.

## Next steps

* [Configure AD DS LDAP over TLS for Azure NetApp Files](configure-ldap-over-tls.md) 
* [Understand NFS group memberships and supplemental groups](network-file-system-group-memberships.md)
* [Azure NetApp Files NFS FAQ](faq-nfs.md)
* [Azure NetApp Files SMB FAQ](faq-smb.md)
