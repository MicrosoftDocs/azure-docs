--- 
title: Azure VMware Solution by CloudSimple - Use Azure AD as identity source on Private Cloud 
description: Describes how to add Azure AD as an identity provider on your CloudSimple Private Cloud to authenticate users accessing CloudSimple from Azure
author: sharaths-cs 
ms.author: b-shsury 
ms.date: 08/15/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# Use Azure AD as an identity provider for vCenter on CloudSimple Private Cloud

You can set up your CloudSimple Private Cloud vCenter to authenticate with Azure Active Directory (Azure AD) for your VMware administrators to access vCenter. After the single sign-on identity source is set up, the **cloudowner** user can add users from the identity source to vCenter.  

You can set up your Active Directory domain and domain controllers in any of the following ways:

* Active Directory domain and domain controllers running on-premises
* Active Directory domain and domain controllers running on Azure as virtual machines in your Azure subscription
* New Active Directory domain and domain controllers running in your CloudSimple Private Cloud
* Azure Active Directory service

This guide explains the tasks required to set up Azure AD as an identity source.  For information on using on-premises Active Directory or Active Directory running in Azure, refer to [Set up vCenter identity sources to use Active Directory](set-vcenter-identity.md) for detailed instructions in setting up the identity source.

## About Azure AD

Azure AD is the Microsoft multi-tenant, cloud based directory and identity management service.  Azure AD provides a scalable, consistent, and reliable authentication mechanism for users to authenticate and access different services on Azure.  It also provides secure LDAP services for any third-party services to use Azure AD as an authentication/identity source.  Azure AD combines core directory services, advanced identity governance, and application access management, which can be used for giving access to your  Private Cloud for users who administer the Private Cloud.

To use Azure AD as an identity source with vCenter, you must set up Azure AD and Azure AD domain services. Follow these instructions:

1. [How to set up Azure AD and Azure AD domain services](#set-up-azure-ad-and-azure-ad-domain-services)
2. [How to set up an identity source on your Private Cloud vCenter](#set-up-an-identity-source-on-your-private-cloud-vcenter)

## Set up Azure AD and Azure AD domain services

Before you get started, you will need access to your Azure subscription with Global Administrator privileges.  The following steps give general guidelines. Details are contained in the Azure documentation.

### Azure AD

> [!NOTE]
> If you already have Azure AD, you can skip this section.

1. Set up Azure AD on your subscription as described in  [Azure AD documentation](../active-directory/fundamentals/get-started-azure-ad.md).
2. Enable Azure Active Directory Premium on your subscription as described in [Sign up for Azure Active Directory Premium](../active-directory/fundamentals/active-directory-get-started-premium.md).
3. Set up a custom domain name and verify the custom domain name as described in [Add a custom domain name to Azure Active Directory](../active-directory/fundamentals/add-custom-domain.md).
    1. Set up a DNS record on your domain registrar with the information provided on Azure.
    2. Set the custom domain name to be the primary domain.

You can optionally configure other Azure AD features.  These are not required for enabling vCenter authentication with Azure AD.

### Azure AD domain services

> [!NOTE]
> This is an important step for enabling Azure AD as an identity source for vCenter.  To avoid any issues, ensure that all steps are performed correctly.

1. Enable Azure AD domain services as described in [Enable Azure Active Directory domain services using the Azure portal](../active-directory-domain-services/active-directory-ds-getting-started.md).
2. Set up the network that will be used by Azure AD domain services as described in [Enable Azure Active Directory Domain Services using the Azure portal](../active-directory-domain-services/active-directory-ds-getting-started-network.md).
3. Configure Administrator Group for managing Azure AD Domain Services as described in [Enable Azure Active Directory Domain Services using the Azure portal](../active-directory-domain-services/active-directory-ds-getting-started-admingroup.md).
4. Update DNS settings for your Azure AD Domain Services as described in [Enable Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-getting-started-dns.md).  If you want to connect to AD over the Internet, set up the DNS record for the public IP address of the Azure AD domain services to the domain name.
5. Enable password hash synchronization for users.  This step enables synchronization of password hashes required for NT LAN Manager (NTLM) and Kerberos authentication to Azure AD Domain Services. After you've set up password hash synchronization, users can sign in to the managed domain with their corporate credentials. See [Enable password hash synchronization to Azure Active Directory Domain Services](../active-directory-domain-services/active-directory-ds-getting-started-password-sync.md).
    1. If cloud-only users are present, they must change their password using <a href="http://myapps.microsoft.com/" target="_blank">Azure AD access panel</a> to ensure password hashes are stored in the format required by NTLM or Kerberos.  Follow instructions in [Enable password hash synchronization to your managed domain for cloud-only user accounts](../active-directory-domain-services/tutorial-create-instance.md#enable-user-accounts-for-azure-ad-ds).  This step must be done for individual users and any new user who is created in your Azure AD directory using the Azure portal or Azure AD PowerShell cmdlets. Users who require access to Azure AD domain services must use the <a href="http://myapps.microsoft.com/" target="_blank">Azure AD access panel</a> and access their profile to change the password.

        > [!NOTE]
        > If your organization has cloud-only user accounts, all users who need to use Azure Active Directory Domain Services must change their passwords. A cloud-only user account is an account that was created in your Azure AD directory using either the Azure portal or Azure AD PowerShell cmdlets. Such user accounts aren't synchronized from an on-premises directory.

    2. If you are synchronizing passwords from your on-premises Active directory, follow the steps in the [Active Directory documentation](../active-directory-domain-services/active-directory-ds-getting-started-password-sync-synced-tenant.md).

6.  Configure secure LDAP on your Azure Active Directory Domain Services as described in [Configure secure LDAP (LDAPS) for an Azure AD Domain Services managed domain](../active-directory-domain-services/tutorial-configure-ldaps.md).
    1. Upload a certificate for use by secure LDAP as described in the Azure topic [obtain a certificate for secure LDAP](../active-directory-domain-services/tutorial-configure-ldaps.md#create-a-certificate-for-secure-ldap).  CloudSimple recommends using a signed certificate issued by a certificate authority to ensure that vCenter can trust the certificate.
    2. Enable secure LDAP as described [Enable secure LDAP (LDAPS) for an Azure AD Domain Services managed domain](../active-directory-domain-services/tutorial-configure-ldaps.md).
    3. Save the public part of the certificate (without the private key) in .cer format for use with vCenter while configuring the identity source.
    4. If Internet access to the Azure AD domain services is required, enable the 'Allow secure access to LDAP over internet' option.
    5. Add the inbound security rule for the Azure AD Domain services NSG for TCP port 636.

## Set up an identity source on your Private Cloud vCenter

1. [Escalate privileges](escalate-private-cloud-privileges.md) for your Private Cloud vCenter.
2. Collect the configuration parameters required for setting up of identity source.

    | **Option** | **Description** |
    |------------|-----------------|
    | **Name** | Name of the identity source. |
    | **Base DN for users** | Base distinguished name for users.  For Azure AD, use: `OU=AADDC Users,DC=<domain>,DC=<domain suffix>`  Example: `OU=AADDC Users,DC=cloudsimplecustomer,DC=com`.|
    | **Domain name** | FQDN of the domain, for example, example.com. Do not provide an IP address in this text box. |
    | **Domain alias** | *(optional)* The domain NetBIOS name. Add the NetBIOS name of the Active Directory domain as an alias of the identity source if you are using SSPI authentications. |
    | **Base DN for groups** | The base distinguished name for groups. For Azure AD, use: `OU=AADDC Users,DC=<domain>,DC=<domain suffix>`  Example: `OU=AADDC Users,DC=cloudsimplecustomer,DC=com`|
    | **Primary Server URL** | Primary domain controller LDAP server for the domain.<br><br>Use the format `ldaps://hostname:port`. The port is typically 636 for LDAPS connections. <br><br>A certificate that establishes trust for the LDAPS endpoint of the Active Directory server is required when you use `ldaps://` in the primary or secondary LDAP URL. |
    | **Secondary server URL** | Address of a secondary domain controller LDAP server that is used for failover. |
    | **Choose certificate** | If you want to use LDAPS with your Active Directory LDAP Server or OpenLDAP Server identity source, a Choose certificate button appears after you type `ldaps://` in the URL text box. A secondary URL is not required. |
    | **Username** | ID of a user in the domain who has a minimum of read-only access to Base DN for users and groups. |
    | **Password** | Password of the user who is specified by Username. |

3. Sign in to your Private Cloud vCenter after the privileges are escalated.
4. Follow the instructions in [Add an identity source on vCenter](set-vcenter-identity.md#add-an-identity-source-on-vcenter) using the values from the previous step to set up Azure Active Directory as an identity source.
5. Add users/groups from Azure AD to vCenter groups as described in the VMware topic [Add Members to a vCenter Single Sign-On Group](https://docs.vmware.com/en/VMware-vSphere/5.5/com.vmware.vsphere.security.doc/GUID-CDEA6F32-7581-4615-8572-E0B44C11D80D.html).

> [!CAUTION]
> New users must be added only to *Cloud-Owner-Group*, *Cloud-Global-Cluster-Admin-Group*, *Cloud-Global-Storage-Admin-Group*, *Cloud-Global-Network-Admin-Group* or, *Cloud-Global-VM-Admin-Group*.  Users added to *Administrators* group will be removed automatically.  Only service accounts must be added to *Administrators* group.

## Next steps

* [Learn about Private Cloud permission model](learn-private-cloud-permissions.md)
