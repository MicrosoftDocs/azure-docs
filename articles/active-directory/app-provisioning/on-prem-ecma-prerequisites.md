---
title: 'Prerequisites for Azure AD ECMA Connector Host'
description: This article describes the prerequisites and hardware requirements you need for using the Azure AD ECMA Connector Host.
services: active-directory
author: billmath
manager: daveba
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/17/2021
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---

# Prerequisites for the Azure AD ECMA Connector Host
This article provides guidance on the prerequisites that are needed for using the Azure AD ECMA Connector Host.


## On-premises pre-requisites
 - A target system, such as a SQL database, or LDAP directory (excluding AD DS), in which users can be created, updated and deleted.
 - An ECMA 2.0 or later connector for that target system, which supports export, schema retrieval, and optionally full import or delta import operations. If you do not have an ECMA Connector ready during configuration, then you can still validate the end-to-end flow if you have a SQL Server in your environment and use the Generic SQL Connector.
 - A Windows Server 2016 or later computer with an Internet-accessible TCP/IP address, connectivity to the target system, and with outbound connectivity to login.microsoftonline.com (for example, a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy). The server should have at least 3GB of RAM.
 - A domian-joined computer with .NET Framework 4.7.1

## Cloud requirements

 - An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
    [!INCLUDE [active-directory-p1-license.md](../../../includes/active-directory-p1-license.md)]

 - The tenant must be located in Microsoft Azure.
 - Tenants that are deployed in Azure Government, China, or other specialized cloud are not currently available for use in this public preview. 

## Known limitations
The following is a current list of known limitations with  the Azure AD ECMA Connector Host

### AD DS - (user / group writeback from Azure AD, using the on-prem provisioning preview)
   - When a user is managed by Azure AD Connect, the source of authority is on-prem Active Directory. Therefore, user attributes cannot be changed in Azure AD. This preview does not change the source of authority for users managed by Azure AD Connect.
   - Attempting to use Azure AD Connect and the on-prem provisioning to provision groups / users into AD DS can lead to creation of a loop, where Azure AD Connect can overwrite a change that was made by the provisioning service in the cloud. Microsoft is working on a dedicated capability for group / user writeback.  Please upvote the  UserVoice feedback [here](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/16887037-enable-user-writeback-to-on-premise-ad-from-azure) to track the status of the preview. Alternatively, you can use [Microsoft Identity Manager](https://docs.microsoft.com/microsoft-identity-manager/microsoft-identity-manager-2016) for user / group writeback from Azure AD to AD.

### Connectors other than generic LDAP and SQL
   - The Azure AD ECMA Connector Host is officially supported for the generic LDAP (GLDAP) and generic SQL (GSQL) connectors. While it is possible to use other connectors such as the web services connector or custom ECMA connectors, it is **not yet supported**.

### Azure Active Directory
   - On-prem provisioning allows you to take a user already in Azure AD and provision them into a third party application. **It does not allow you to bring a user into the directory from a third party application.** Customers will need to rely on our native HR integrations, Azure AD Connect, MIM, or Microsoft Graph to bring users into the directory.

### Attributes and objects not supported:
   - Multi-valued attributes
   - Reference attributes (e.g. manager).
   - Groups
   - Complex anchors (e.g. ObjectTypeName+UserName).
   - On-premises applications are sometimes not federated with Azure AD and require local passwords. The on-premises provisioning preview **does not support provisioning 1-time passwords or synchronizing passwords** between Azure AD and 3rd party applications.

### SSL certificates
   - The Azure AD ECMA Connector Host currently requires either SSL certificate to be trusted by Azure or the Provisioning Agent to be used. Certificate subject must match the host name the Azure AD ECMA Connector Host is installed on.

### Anchor attributes
   - The Azure AD ECMA Connector Host currently does not support anchor attribute changes (renames) or target systems which require multiple attributes to form an anchor. 

### Attribute discovery and mapping
   - The attributes that the target application supports are discovered and surfaced in the Azure Portal in Attribute Mappings. Newly added attributes will continue to be discovered. However, if an attribute type has changed (e.g. string to boolean), and the attribute is part of the mappings, the type will not change automatically in the Azure Portal. Customers will need to go into advanced settings in mappings and manually update the attribute type.



## Next Steps

- App provisioning](user-provisioning.md)
- On-premises app provisioning architecture(on-prem-app-prov-arch.md)