---
title: 'Prerequisites for ECMA Connector Host'
description: This article describes the prerequisites and hardware requirements you need for using the ECMA connect host.
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

# Prerequisites for the ECMA connector host
This article provides guidance on how to choose and use Azure Active Directory (Azure AD) Connect cloud sync as your identity solution.


## On-premises pre-requisites
 - A target system, such as a SQL database, or LDAP directory (excluding AD DS), in which users can be created, updated and deleted.
- An ECMA 2.0 or later connector for that target system, which supports export, schema retrieval, and optionally full import or delta import operations. If you do not have an ECMA Connector ready during configuration, then you can still validate the end-to-end flow if you have a SQL Server in your environment and use the Generic SQL Connector.
- A Windows Server 2016 or later computer with an Internet-accessible TCP/IP address, connectivity to the target system, and with outbound connectivity to login.microsoftonline.com (for example, a Windows Server 2016 virtual machine hosted in Azure IaaS or behind a proxy). The server should have at least 3GB of RAM.
- A domian-joined computer with .NET Framework 4.7.1

## Cloud requirements

- An Azure AD tenant with Azure AD Premium P1 or Premium P2 (or EMS E3 or E5). 
- The tenant must be located in 
- Tenants that are deployed in Azure Government, China, or other specialized cloud are not currently available for use in this public preview. 

## Known limitations

1. The following applications and directories are not yet supported
   1. **AD DS** (user / group writeback from Azure AD, using the on-prem provisioning preview)
      1. When a user is managed by Azure AD connect, the source of authority is on-prem AD. Therefore, user attributes cannot be changed in Azure AD. This preview does not change the source of authority for users managed by Azure AD Connect.
      1. Attempting to use Azure AD Connect and the on-prem provisioning to provision groups / users into AD DS can lead to creation of a loop, where Azure AD Connect can overwrite a change was made by the provisioning service in the cloud. Microsoft is working on a dedicated capability for group / user writeback. Please upvote the  UserVoice feedback [here](https://feedback.azure.com/forums/169401-azure-active-directory/suggestions/16887037-enable-user-writeback-to-on-premise-ad-from-azure) to track the status of the preview. Alternatively, you can use Microsoft Identity Manager for user / group writeback from Azure AD to AD. 

   1. Connectors other than generic LDAP and SQL
      1. The ECMA host is officially supported for the GLDAP and GSQL connectors. While it is possible to use other connectors such as the web services connector or custom ECMA connectors, it is not yet supported. We plan to support for all ECMA2 connectors, but have not yet announced support for connectors other than GSQL and GLDAP. 

   1. Azure Active Directory 
      1. On-prem provisioning allows you to take a user already in Azure AD and provision them into a third party application. It does not allow you to bring a user into the directory from a third party application. Customers will need to rely on our native HR integrations, Azure AD Connect, MIM, or Microsoft Graph to bring users into the directory.  

1. The following attributes and objects not yet supported:
   1. Multi-valued attributes
   1. Reference attributes (e.g. manager).
   1. Groups 
   1. Complex anchors (e.g. ObjectTypeName+UserName).
   1. On-premises applications are sometimes not federated with Azure AD and require local passwords. The on-premises provisioning preview **does not support provisioning 1-time   passwords or synchronizing passwords** between Azure AD and 3rd party applications. For security reasons, Microsoft is working to eliminate passwords and help customers transition to a passwordless environment.

1. The ECMA Host currently requires either SSL certificate to be trusted by Azure or the Provisioning Agent to be used. Certificate subject must match the host name ECMA Connector Host is installed on.

1. The ECMA Host currently does not support anchor attribute changes (renames) or target systems which require multiple attributes to form an anchor. Rename operations are not yet possible.

1. The attributes that the target application supports are discovered and surfaced in the Azure Portal in Attribute Mappings. Newly added attributes will continue to be discovered. However, if an attribute type has changed (e.g. string to boolean), and the attribute is part of the mappings, the type will not change automatically in the Azure Portal. Customers will need to go into advanced settings in mappings and manually update the attribute type. 

Note: as described in the Microsoft Online Services terms, located at [http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&amp;DocumentTypeId=46](http://www.microsoftvolumelicensing.com/DocumentSearch.aspx?Mode=3&amp;DocumentTypeId=46), previews may employ lesser or different privacy and security measures than those typically present in the Online Services. Unless otherwise noted, Previews are not included in the SLA for the corresponding Online Service, and Customer should not use Previews to process Personal Data or other data that is subject to legal or regulatory compliance requirements.  In particular, the following terms in the section (&quot;Data Protection Terms&quot;) of the Online Services terms do not apply to Previews:  Processing of Personal Data; GDPR, Data Security, and HIPAA Business Associate.

## Next Steps

- App provisioning](user-provisioning.md)
- On-premises app provisioning architecture(on-prem-app-prov-arch.md)