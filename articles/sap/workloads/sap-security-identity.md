---
title: Secure Azure identity for  SAP Applications 
description: Links collection and guidance Secure Identity for SAP Applications 
services: virtual-machines-windows,virtual-network,storage
author: cgardin
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: tutorial
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.date: 10/07/2025 
ms.author: cgardin
# Customer intent: Identity managed and authentication for SAP 
--- 
 # Identity Management and Authentication for SAP
This article provides a collection of links and general information on Identity Management, Provisioning and Single Sign-on, multifactor authentication & Global Secure Access SNC  

There are too many complex scenarios covering Identity Management, Authentication, and Authorization and it isn't possible to document generalizable scenarios.     
The links in this section are intended to be a starting point for developing the appropriate solution for a specific customer scenario.  
## Identity Management  
It's common to use the approach documented in these two links to Provision, Deprovision, Maintain, and create Workflows for User ID lifecycle – Microsoft Entra for SAP 
- [Identity and Access Management with Microsoft Entra - SAP Community (Part I)](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-i-managing-access/ba-p/13873276)
- [Identity and Access Management with Microsoft Entra - SAP Community (Part II)](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-ii-provisioning-to/ba-p/13990927)
- [Identity and Access Management with Microsoft Entra - SAP Community (Part III)](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-iii-successfactors/ba-p/14233747)

More information about the announcement on the end of life of SAP's on-premises Identity Management solutions and [migration to Microsoft Entra](/entra/id-governance/scenarios/migrate-from-sap-idm)

## Authentication  
It's recommended to use SSO and/or multifactor authentication for all SAP applications. Traditional User and Password for SAP applications isn't recommended. There are three typical options: User and Password (not recommended), Single Sign On (SSO) or SSO + MFA. Different SAP applications on different platforms have many options for Authentication: 

### Web Browser based Clients – SAML or OIDC (OpenID Connect)
[Configure SAP NetWeaver for Single sign-on with Microsoft Entra ID - Microsoft Entra ID | Microsoft Learn](/entra/identity/saas-apps/sap-netweaver-tutorial)
SAML is a well established industry standard but OIDC is a newer solution. This article contains a good comparison between the two technologies [OIDC vs. SAML your hybrid SAP Landscape: What You Need to Know](https://community.sap.com/t5/technology-blog-posts-by-sap/oidc-vs-saml-your-hybrid-sap-landscape-what-you-need-to-know/ba-p/13797204)

### SAPGUI – X.509 or Kerberos Tickets
SAP Secure Login Client - SNC certificate X.509 and Kerberos Tickets are documented here [SNC X.509 Configuration | SAP Help Portal](https://help.sap.com/docs/SAP%20SECURE%20LOGIN%20SERVICE/c35917ca71e941c5a97a11d2c55dcacd/767e439cf7764fcaab165416a00e2a6f.html)     

Additional information is available here 
- [Exploring SAP Secure Login Service for SAP GUI: A Comprehensive Review](https://community.sap.com/t5/technology-blog-posts-by-members/exploring-sap-secure-login-service-for-sap-gui-a-comprehensive-review/ba-p/13573382)
- [SAP GUI MFA with Microsoft Entra (Part I): Integration - SAP Community](https://community.sap.com/t5/technology-blog-posts-by-members/sap-gui-mfa-with-microsoft-entra-part-i-integration-with-sap-secure-login/ba-p/13605383)
- [How to Configure SSO for SAP GUI Including MFA - SAP Community](https://community.sap.com/t5/technology-blog-posts-by-sap/how-to-configure-sso-for-sap-gui-including-mfa/ba-p/14213388)

### Mobile Devices – X509 or SAML 
SAP discontinued Fiori mobile app as of 2022 and now support native browsers.
It's therefore recommended to use SAML or OIDC.  
[Time for a Fresh-Up: Single sign-on for SAP on Mobile Devices](https://www.linkedin.com/pulse/time-fresh-up-single-sign-on-sap-mobile-devices-carsten-olt-qxwxe)


### Microsoft Power Platform and Microsoft AI 
Authentication options for Microsoft Power Platform and Microsoft AI:
- [Principal propagation in a multi-cloud solution between Microsoft Azure and SAP, Part IV: SSO with a Power Virtual Agents Chatbot and On-Premises Data Gateway](https://community.sap.com/t5/technology-blog-posts-by-members/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and/ba-p/13519225)
- [Power Platform + SAP OData - single sign-on - Happy path](https://www.youtube.com/watch?v=NSE--fVLdUg)
- [Power Platform + SAP OData - single sign-on - Step by Step](https://www.youtube.com/watch?v=AcM67FBIEB4)
- [142 - The one with Power Platform and single sign-on (Martin Raepple) | SAP on Azure Video Podcast](https://www.youtube.com/watch?v=PM2vNriPlT0)
- [211 - The one with SSO with SAP API Management and Power Platform (Vinayak Adkoli & Martin Pankraz)](https://www.youtube.com/watch?v=nQplgEHASAI)
- [183 - The one with SAP GUI MFA with Entra ID (Martin Raepple & Christan Cohrs) | SAP on Azure Video](https://www.youtube.com/watch?v=RHuEUUmLPtM)

### Other Client Technologies 
NetWeaver Business Client, Concur, Fiori Mobile App, Business Explorer (BEx), Business Objects, and other non-SAP applications (such as a non-SAP Warehouse Management system) will be added to this documentation later. Some of these technologies are now out of support.  

For more information on how to configure single sign-on from Microsoft Entra ID, see the following documentation and tutorials.  

  > [!NOTE]
  > Note the preferred strategy is to use the SAP Cloud Identity Services (CIS) where possible.  

It's technically possible to integrate SAP SuccessFactors with Entra ID or SAP Cloud Identity Service (CIS). However, the preferred strategy is to use inbound provisioning from SuccessFactors to Microsoft Entra as described in [Configure SuccessFactors for Single sign-on with Microsoft Entra ID - Microsoft Entra ID | Microsoft Learn](/entra/identity/saas-apps/successfactors-tutorial) For outbound provisioning to SuccessFactors, such as assigning a new HR admin role to a user in SuccessFactors, SuccessFactors would be configured as a target system in CIS as described in [SAP SuccessFactors | SAP Help Portal](https://help.sap.com/docs/cloud-identity-services/cloud-identity-services/target-sap-successfactors).

More information on Microsoft Entra SSO services for SAP solutions: 
- [SAP Cloud Identity Services](/entra/identity/saas-apps/sap-hana-cloud-platform-identity-authentication-tutorial)
- [SAP SuccessFactors](/entra/identity/saas-apps/successfactors-tutorial)
- [SAP Analytics Cloud](/entra/identity/saas-apps/sapboc-tutorial)
- [SAP Fiori](/entra/identity/saas-apps/sap-fiori-tutorial)
- [SAP Ariba](/entra/identity/saas-apps/ariba-tutorial)
- [SAP Concur Travel and Expense](/entra/identity/saas-apps/concur-travel-and-expense-tutorial)
- [SAP Business Technology Platform](/entra/identity/saas-apps/sap-hana-cloud-platform-tutorial)
- [SAP Business ByDesign](/entra/identity/saas-apps/sapbusinessbydesign-tutorial)
- [SAP HANA](/entra/identity/saas-apps/saphana-tutorial)
- [SAP Cloud for Customer](/entra/identity/saas-apps/sap-customer-cloud-tutorial)
- [SAP Fieldglass](/entra/identity/saas-apps/fieldglass-tutorial)

Also see the following blog posts and SAP resources:
- SAP GUI MFA with Microsoft Entra [integration with SAP Secure Login Service](https://community.sap.com/t5/technology-blogs-by-members/sap-gui-mfa-with-microsoft-entra-part-i-integration-with-sap-secure-login/ba-p/13605383) and [integration with Microsoft Entra Private Access](https://community.sap.com/t5/technology-blogs-by-members/sap-gui-mfa-with-microsoft-entra-part-ii-integration-with-microsoft-entra/ba-p/13691141)
- [Managing access to SAP BTP](https://community.sap.com/t5/technology-blogs-by-members/identity-and-access-management-with-microsoft-entra-part-i-managing-access/ba-p/13873276)
- [Azure Application Gateway set up of SAML Single Sign On for Public and Internal SAP URLs](https://blogs.sap.com/2020/12/10/sap-on-azure-single-sign-on-configuration-using-saml-and-azure-active-directory-for-public-and-internal-urls/)
- [Single sign on using Microsoft Entra Domain Services and Kerberos](https://blogs.sap.com/2018/08/03/your-sap-on-azure-part-8-single-sign-on-using-azure-ad-domain-services/)

More information on the SAP Cloud Identity Services (CIS) can be found here: 
- Identity Provisioning Service (BTP) and Identity Authentication Service (BTP) [Learning](https://learning.sap.com/learning-journeys/introducing-sap-cloud-identity-services) 
- [Getting Started with SAP Cloud Identity Service - Authentication Admin User](https://community.sap.com/t5/technology-blog-posts-by-sap/getting-started-with-sap-cloud-identity-service-authentication-admin-user/ba-p/13541902)
- [What Is Identity Provisioning? | SAP Help Portal](https://help.sap.com/docs/identity-provisioning/identity-provisioning/what-is-identity-provisioning)
- [Explaining Identity and Access Management on SAP BTP](https://learning.sap.com/courses/operating-sap-business-technology-platform/explaining-identity-and-access-management-on-sap-btp)
- A good summary can be found here [Navigating SAP SSO: Choosing Between SAP single sign-on 3.0 and SAP Secure Login Service for SAP GUI](https://www.linkedin.com/pulse/navigating-sap-sso-choosing-between-single-sign-on-30-carsten-olt-jyrje/?trk=article-ssr-frontend-pulse_little-text-block)
- [Manage access to your SAP applications - Microsoft Entra ID Governance | Microsoft Learn](/entra/id-governance/sap)  

## Automatic Synchronization of Authorization Attributes 
Authorization attributes can be replicated from Microsoft Entra to target SAP applications such as SAP BTP Role Collections. This is discussed in this link [Manage access to your SAP applications - Microsoft Entra ID Governance | Microsoft Learn](/entra/id-governance/sap#bring-identities-from-hr-into-microsoft-entra-id)

  > [!NOTE]
  > Microsoft has released new Microsoft Entra functionality to synchronize both Users and Groups from Microsoft Entra to SAP CIS. This functionality can be added free of charge in the Microsoft Entra admin center. 

The process to set up and synchronize Authorization Roles and Profiles for NetWeaver and S/4 systems is documented in detail [Identity and Access Management with Microsoft Entra - SAP Community (Part III)](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-iii-successfactors/ba-p/14233747). Additional information for BTP applications, SuccessFactors, Ariba, and Fieldglass Authorization attributes will be added to this documentation. 

The diagram here depicts the architecture from an SAP centric point of view:  [SAP IAM integration with SAP Cloud Identity Services | SAP Architecture Center](https://architecture.learning.sap.com/docs/ref-arch/20c6b29b1e).   This diagram shows the concept with reference to Microsoft Entra [Migrate identity management scenarios from SAP IDM to Microsoft Entra | Microsoft Learn](/entra/id-governance/scenarios/migrate-from-sap-idm#overview-of-microsoft-entra-and-its-sap-product-integrations)
The latest diagram showing the new Microsoft Entra functionality allowing synchronization of both Users and Groups to ABAP systems is [shown in this diagram](https://community.sap.com/t5/image/serverpage/image-id/329690iC40448471EB1C535/is-moderation-mode/true/image-dimensions/2000?v=v2&px=-1).  

## Global Secure Access GSA with SAPGUI SNC  
The video embedded in the following blog is recommended for customers wanting to achieve Network Level Security. The outcome is similar to operating a VPN without the overhead of installing and maintaining a full VPN on client devices.  
The GSA client implements an [NDIS 6.0 lightweight filter (LWF) network driver](/windows-hardware/drivers/network/ndis-filter-drivers) to route any traffic to internal and external applications based on centrally defined access rules at the company's Entra ID tenant level.
  - [SAP GUI MFA with Microsoft Entra (Part II): Integration - SAP Community](https://community.sap.com/t5/technology-blog-posts-by-members/sap-gui-mfa-with-microsoft-entra-part-ii-integration-with-microsoft-entra/ba-p/13691141)
  - [219 - The one with SSO to SAP GUI using Global Secure Access (Martin Raepple) | SAP on Azure Video](https://www.youtube.com/watch?v=42dj-lV-MDQ)

## SAP Products Approaching End of Life / Migration
Several SAP security solution products are now end of life. Microsoft and SAP have collaborated to provide a migration path for customers 
- [Migrate identity management scenarios from SAP IDM to Microsoft Entra | Microsoft Learn](/entra/id-governance/scenarios/migrate-from-sap-idm)
SAP IDM 8.0 – End of Life December 2027. Documentation on the migration path can be found here 
- [Update on the SAP Identity Management migration to Microsoft Entra](https://community.sap.com/t5/technology-blog-posts-by-sap/update-on-the-sap-identity-management-migration-to-microsoft-entra/ba-p/13742820)
- [Preparing for SAP Identity Management’s End-of-Maintenance in 2027](https://community.sap.com/t5/technology-blog-posts-by-sap/preparing-for-sap-identity-management-s-end-of-maintenance-in-2027/ba-p/13596101)

SAP SSO Server (Java) – SAP has announced the End of Life December 2027  [SAP GUI MFA with Microsoft Entra (Part I): Integration - SAP Community](https://community.sap.com/t5/technology-blog-posts-by-members/sap-gui-mfa-with-microsoft-entra-part-i-integration-with-sap-secure-login/ba-p/13605383)

## Links 
- Learn more about [Microsoft Entra ID Governance](https://www.microsoft.com/security/business/identity-access/microsoft-entra-id-governance?rtc=1)
- View the [Microsoft Mechanics video](https://www.youtube.com/watch?v=BGE5FUHd-Uc)   
- Walk through the [Interactive Guides](https://mslearn.cloudguides.com/guides/Microsoft%20Entra%20Identity%20Governance)
- Microsoft Entra [Documentation](/entra/id-governance/)
- [1912264 - SAP NetWeaver single sign-on 1.0: Central Note](https://me.sap.com/notes/1912264)
- [2300234 - SAP single sign-on 3.0: Central Note](https://me.sap.com/notes/2300234)
- [single sign-on for SAP GUI | SAP Community](https://pages.community.sap.com/topics/single-sign-on)
- [1848999 - Central Note for CommonCryptoLib 8 (SAPCRYPTOLIB)](https://me.sap.com/notes/1848999/E)
- [510007 - Additional considerations about setting up SSL on Application Server ABAP](https://me.sap.com/notes/510007)
- [Single Sign On for SAP NetWeaver and Azure Active Directory - YouTube](https://www.youtube.com/watch?v=AGCZA8CCIYo) 





 