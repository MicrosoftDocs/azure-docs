---
title: Modify an Active Directory Connection for Azure NetApp Files | Microsoft Docs
description: This article shows you how to modify Active Directory connections for Azure NetApp Files.
author: b-hchen
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: how-to
ms.date: 07/22/2022
ms.author: anfdocs
---

# Modify Active Directory connections for Azure NetApp Files

Once you have [created an Active Directory connection](create-active-directory-connections.md) in Azure NetApp Files, you can modify it. When modifying an Active Directory, not all configurations can be modified.

## Modify Active Directory connections

1. Select **Active Directory connections**. Then, select **Edit** to edit an existing AD connection. 

1. In the **Edit Active Directory** window that appears, modify Active Directory connection configurations as needed. See [Options for Active Directory connections](#options-for-active-directory-connections) for an explanation of what fields can be modified. 

## Options for Active Directory connections

|Field Name |What it is |Can it be modified? |Considerations & Impacts |Effect |
|:-:|:--|:-:|:--|:--|
| Primary DNS | Primary DNS server IP addresses for the Active Directory domain. | Yes | None* | New DNS IP will be used for DNS resolution. |
| Secondary DNS | Secondary DNS server IP addresses for the Active Directory domain. | Yes | None* | New DNS IP will be used for DNS resolution in case primary DNS fails. |
| AD DNS Domain Name | The domain name of your Active Directory Domain Services that you want to join. | No | None | N/A |
| AD Site Name | The site to which the domain controller discovery is limited. | Yes | This should match the site name in Active Directory Sites and Services. See footnote.* | Domain discovery will be limited to the new site name. If not specified, "Default-First-Site-Name" will be used. |
| SMB Server (Computer Account) Prefix | Naming prefix for the machine account in Active Directory that Azure NetApp Files will use for the creation of new accounts. See footnote.* | Yes | Existing volumes need to be mounted again as the mount is changed for SMB shares and NFS Kerberos volumes.* | Renaming the SMB server prefix after you create the Active Directory connection is disruptive. You'll need to remount existing SMB shares and NFS Kerberos volumes after renaming the SMB server prefix as the mount path will change. |
| Organizational Unit Path | The LDAP path for the organizational unit (OU) where SMB server machine accounts will be created. `OU=second level`, `OU=first level`| No | If you are using Azure NetApp Files with Azure Active Directory Domain Services (AADDS), the organizational path is `OU=AADDC Computers` when you configure Active Directory for your NetApp Account. | Machine accounts will be placed under the OU specified. If not specified, the default of `OU=Computers` is used by default. |
| AES Encryption | To take advantage of the strongest security with Kerberos-based communication, you can enable AES-256 and AES-128 encryption on the SMB server. | Yes | If you enable AES encryption, the user credentials used to join Active Directory must have the highest corresponding account option enabled, matching the capabilities enabled for your Active Directory. For example, if your Active Directory has only AES-128 enabled, you must enable the AES-128 account option for the user credentials. If your Active Directory has the AES-256 capability, you must enable the AES-256 account option (which also supports AES-128). If your Active Directory does not have any Kerberos encryption capability, Azure NetApp Files uses DES by default.* | Enable AES encryption for Active Directory Authentication |
| LDAP Signing | This functionality enables secure LDAP lookups between the Azure NetApp Files service and the user-specified Active Directory Domain Services domain controller. | Yes | LDAP signing to Require Signing in group policy* | This provides ways to increase the security for communication between LDAP clients and Active Directory domain controllers. |
| Allow local NFS users with LDAP | If enabled, this option will manage access for local users and LDAP users. | Yes | This option will allow access to local users. It is not recommended and, if enabled, should only be used for a limited time and later disabled. | If enabled, this option will allow access to local users and LDAP users. If access is needed for only LDAP users, this option must be disabled. |
| LDAP over TLS | If enabled, LDAP over TLS will be configured to support secure LDAP communication to active directory. | Yes | None | If LDAP over TLS is enabled and if the server root CA certificate is already present in the database, then LDAP traffic is secured using the CA certificate. If a new certificate is passed in, that certificate will be installed. |
| Server root CA Certificate | When LDAP over SSL/TLS is enabled, the LDAP client is required to have base64-encoded Active Directory Certificate Service's self-signed root CA certificate. | Yes | None* | LDAP traffic secured with new certificate only if LDAP over TLS is enabled |
| Backup policy users | You can include additional accounts that require elevated privileges to the computer account created for use with Azure NetApp Files. See [Create and manage Active Directory connections](create-active-directory-connections.md#create-an-active-directory-connection) for more information. | Yes | None* | The specified accounts will be allowed to change the NTFS permissions at the file or folder level. |
| Administrators | Specify users or groups that will be given administrator privileges on the volume | Yes | None | User account will receive administrator privileges |
| Username | Username of the Active Directory domain administrator | Yes | None* | Credential change to contact DC |
| Password | Password of the Active Directory domain administrator | Yes | None* | Credential change to contact DC |
| Kerberos Realm: AD Server Name | The name of the Active Directory machine. This option is only used when creating a Kerberos volume. | Yes | None* | |
| Kerberos Realm: KDC IP | Specifies the IP address of the Kerberos Distribution Center (KDC) server. KDC in Azure NetApp Files is an Active Directory server | Yes | None | A new KDC IP address will be used |
| Region | The region where the Active Directory credentials are associated | No | None | N/A |
| User DN | User domain name, which overrides the base DN for user lookups Nested userDN can be specified in `OU=subdirectory, OU=directory, DC=domain, DC=com` format.​ | Yes | None* | User search scope gets limited to User DN instead of base DN. |
| Group DN | Group domain name. groupDN overrides the base DN for group lookups. Nested groupDN can be specified in `OU=subdirectory, OU=directory, DC=domain, DC=com` format.​ | Yes | None* | Group search scope gets limited to Group DN instead of base DN. |
| Group Membership Filter | The custom LDAP search filter to be used when looking up group membership from LDAP server.​  `groupMembershipFilter` can be specified with the `(gidNumber=*)` format. | Yes | None* | Group membership filter will be used while querying group membership of a user from LDAP server. |
| Security Privilege Users | You can grant security privilege (`SeSecurityPrivilege`) to users that require elevated privilege to access the Azure NetApp Files volumes. The specified user accounts will be allowed to perform certain actions on Azure NetApp Files SMB shares that require security privilege not assigned by default to domain users. See [Create and manage Active Directory connections](create-active-directory-connections.md#create-an-active-directory-connection) for more information. | Yes | Using this feature is optional and supported only for SQL Server. The domain account used for installing SQL Server must already exist before you add it to the Security privilege users field. When you add the SQL Server installer's account to Security privilege users, the Azure NetApp Files service might validate the account by contacting the domain controller. The command might fail if it cannot contact the domain controller. For more information about `SeSecurityPrivilege` and SQL Server, see [SQL Server installation fails if the Setup account doesn't have certain user rights](/troubleshoot/sql/install/installation-fails-if-remove-user-right).* | Allows non-administrator accounts to use SQL severs on top of ANF volumes.  |

**\*There is no impact on a modified entry only if the modifications are entered correctly. If you enter data incorrectly, users and applications will lose access.**

## Next Steps
* [Understand guidelines for Active Directory Domain Services site design and planning for Azure NetApp Files](understand-guidelines-active-directory-domain-service-site.md)
* [Configure ADDS LDAP with extended groups for NFS](configure-ldap-extended-groups.md)
* [Configure ADDS LDAP over TLS](configure-ldap-over-tls.md)
* [Create and manage Active Directory connections](create-active-directory-connections.md)