---
title: Secure Azure Identity for SAP Applications 
description: This article provides a link collection and guidance about secure identity for SAP applications.
services: virtual-machines-windows,virtual-network,storage
author: cgardin
manager: juergent
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: concept-article
ms.custom: devx-track-azurecli, devx-track-azurepowershell, linux-related-content
ms.date: 10/07/2025 
ms.author: cgardin
# Customer intent: Identity managed and authentication for SAP 
--- 

# Identity management and authentication for SAP

This article provides a collection of links and general information on identity management, provisioning and single sign-on (SSO), multifactor authentication (MFA), Global Secure Access, and secure network connection.

Many complex scenarios cover identity management, authentication, and authorization. It isn't possible to document generalizable scenarios. The links in this article are only a starting point for developing the appropriate solution for a specific customer scenario.

## Identity management

The following SAP Community blog posts document an approach to provision, deprovision, maintain, and create workflows for a user ID lifecycle by using Microsoft Entra:

- [Identity and Access Management with Microsoft Entra, Part I: Managing access to SAP BTP](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-i-managing-access/ba-p/13873276)
- [Identity and Access Management with Microsoft Entra, Part II: Provisioning to BTP and S/4HANA](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-ii-provisioning-to/ba-p/13990927)
- [Identity and Access Management with Microsoft Entra, Part III: SuccessFactors and Role Provisioning](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-iii-successfactors/ba-p/14233747)

For more information about the end of maintenance of SAP's on-premises identity management solutions and the shift to Microsoft Entra, see [Migrate identity management scenarios from SAP IDM to Microsoft Entra](/entra/id-governance/scenarios/migrate-from-sap-idm).

## Authentication

We recommend that you use SSO and/or MFA for all SAP applications. We don't recommend using the traditional username and password for SAP applications. Different SAP applications on different platforms have many options for authentication.

For more information about SSO, see [Configure SAP NetWeaver for single sign-on with Microsoft Entra ID](/entra/identity/saas-apps/sap-netweaver-tutorial).

### Browser-based clients: SAML or OIDC

SAML is a well-established industry standard, but OpenID Connect (OIDC) is a newer solution. This SAP Community blog post contains a good comparison of the two technologies: [OIDC vs. SAML Your Hybrid SAP Landscape: What You Need to Know](https://community.sap.com/t5/technology-blog-posts-by-sap/oidc-vs-saml-your-hybrid-sap-landscape-what-you-need-to-know/ba-p/13797204).

### SAP GUI: X.509 or Kerberos tickets

For the SAP Secure Login Client, information about the Secure Network Communication (SNC) X.509 certificate and Kerberos tickets is documented in the [SAP Help Portal](https://help.sap.com/docs/SAP%20SECURE%20LOGIN%20SERVICE/c35917ca71e941c5a97a11d2c55dcacd/767e439cf7764fcaab165416a00e2a6f.html).

Additional information is available in these SAP Community blog posts:

- [Exploring SAP Secure Login Service for SAP GUI: A Comprehensive Review](https://community.sap.com/t5/technology-blog-posts-by-members/exploring-sap-secure-login-service-for-sap-gui-a-comprehensive-review/ba-p/13573382)
- [SAP GUI MFA with Microsoft Entra (Part I): Integration with SAP Secure Login Service](https://community.sap.com/t5/technology-blog-posts-by-members/sap-gui-mfa-with-microsoft-entra-part-i-integration-with-sap-secure-login/ba-p/13605383)
- [How to Configure SSO for SAP GUI Including MFA](https://community.sap.com/t5/technology-blog-posts-by-sap/how-to-configure-sso-for-sap-gui-including-mfa/ba-p/14213388)

### Mobile devices: X.509 or SAML

SAP discontinued the Fiori mobile app as of 2022 and now supports native browsers. We recommend that you use SAML or OIDC. For more information, see the LinkedIn article [Time for a Fresh-Up: Single Sign-On for SAP on Mobile Devices](https://www.linkedin.com/pulse/time-fresh-up-single-sign-on-sap-mobile-devices-carsten-olt-qxwxe).

### Microsoft Power Platform and Microsoft AI

For information about authentication options for Microsoft Power Platform and Microsoft AI, see these resources:

- [Principal propagation in a multi-cloud solution between Microsoft Azure and SAP, Part IV: SSO with a Power Virtual Agents Chatbot and On-Premises Data Gateway](https://community.sap.com/t5/technology-blog-posts-by-members/principal-propagation-in-a-multi-cloud-solution-between-microsoft-azure-and/ba-p/13519225) (SAP Community blog post)
- [Power Platform + SAP OData - Single Sign-On - Happy path](https://www.youtube.com/watch?v=NSE--fVLdUg) (YouTube video)
- [Power Platform + SAP OData - Single Sign-On - Step by Step](https://www.youtube.com/watch?v=AcM67FBIEB4) (YouTube video)
- [The one with Power Platform and Single Sign-On](https://www.youtube.com/watch?v=PM2vNriPlT0) (YouTube video)
- [The one with SSO with SAP API Management and Power Platform](https://www.youtube.com/watch?v=nQplgEHASAI) (YouTube video)
- [The one with SAP GUI MFA with Entra ID](https://www.youtube.com/watch?v=RHuEUUmLPtM) (YouTube video)

### Other client technologies

For more information on how to configure SSO from Microsoft Entra ID, see the following documentation and tutorials.

This documentation doesn't cover NetWeaver Business Client, Concur, Fiori mobile app, Business Explorer (BEx), BusinessObjects, and non-SAP applications such as warehouse management systems. Some of these technologies are now out of support. We recommend that you use SAP Cloud Identity Services where possible.

It's technically possible to integrate SAP SuccessFactors with Microsoft Entra ID or SAP Cloud Identity Services. However, the preferred strategy is to use inbound provisioning from SuccessFactors to Microsoft Entra, as described in [Configure SuccessFactors for single sign-on with Microsoft Entra ID](/entra/identity/saas-apps/successfactors-tutorial).

For outbound provisioning to SuccessFactors, such as assigning a new HR admin role to a user in SuccessFactors, SuccessFactors is configured as a target system in CIS. For more information, see [SAP SuccessFactors](https://help.sap.com/docs/cloud-identity-services/cloud-identity-services/target-sap-successfactors) in the SAP Help Portal.

Here's more information about how to configure SAP solutions for SSO by using Microsoft Entra ID:

- [SAP Cloud Identity Services](/entra/identity/saas-apps/sap-hana-cloud-platform-identity-authentication-tutorial)
- [SAP Analytics Cloud](/entra/identity/saas-apps/sapboc-tutorial)
- [SAP Fiori](/entra/identity/saas-apps/sap-fiori-tutorial)
- [SAP Ariba](/entra/identity/saas-apps/ariba-tutorial)
- [SAP Concur Travel and Expense](/entra/identity/saas-apps/concur-travel-and-expense-tutorial)
- [SAP Business Technology Platform](/entra/identity/saas-apps/sap-hana-cloud-platform-tutorial)
- [SAP Business ByDesign](/entra/identity/saas-apps/sapbusinessbydesign-tutorial)
- [SAP HANA](/entra/identity/saas-apps/saphana-tutorial)
- [SAP Cloud for Customer](/entra/identity/saas-apps/sap-customer-cloud-tutorial)
- [SAP Fieldglass](/entra/identity/saas-apps/fieldglass-tutorial)

Also see the following SAP blog posts:

- SAP GUI MFA with Microsoft Entra [integration with SAP Secure Login Service](https://community.sap.com/t5/technology-blogs-by-members/sap-gui-mfa-with-microsoft-entra-part-i-integration-with-sap-secure-login/ba-p/13605383) and [integration with Microsoft Entra Private Access](https://community.sap.com/t5/technology-blogs-by-members/sap-gui-mfa-with-microsoft-entra-part-ii-integration-with-microsoft-entra/ba-p/13691141)
- [Managing access to SAP BTP](https://community.sap.com/t5/technology-blogs-by-members/identity-and-access-management-with-microsoft-entra-part-i-managing-access/ba-p/13873276)
- [Azure Application Gateway setup of SAML single sign-on for public and internal SAP URLs](https://blogs.sap.com/2020/12/10/sap-on-azure-single-sign-on-configuration-using-saml-and-azure-active-directory-for-public-and-internal-urls/)
- [Single sign-on using Microsoft Entra Domain Services and Kerberos](https://blogs.sap.com/2018/08/03/your-sap-on-azure-part-8-single-sign-on-using-azure-ad-domain-services/)

You can find more information on SAP Cloud Identity Services in these resources:

- [Introducing SAP Cloud Identity Services](https://learning.sap.com/learning-journeys/introducing-sap-cloud-identity-services) (SAP Learning)
- [Getting Started with SAP Cloud Identity Service - Authentication (Admin User)](https://community.sap.com/t5/technology-blog-posts-by-sap/getting-started-with-sap-cloud-identity-service-authentication-admin-user/ba-p/13541902) (SAP Community blog post)
- [What Is Identity Provisioning?](https://help.sap.com/docs/identity-provisioning/identity-provisioning/what-is-identity-provisioning) (SAP Help Portal)
- [Explaining Identity and Access Management on SAP BTP](https://learning.sap.com/courses/operating-sap-business-technology-platform/explaining-identity-and-access-management-on-sap-btp) (SAP Learning)
- [Navigating SAP SSO: Choosing Between SAP Single Sign-On 3.0 and SAP Secure Login Service for SAP GUI](https://www.linkedin.com/pulse/navigating-sap-sso-choosing-between-single-sign-on-30-carsten-olt-jyrje/?trk=article-ssr-frontend-pulse_little-text-block) (LinkedIn article)
- [Manage access to your SAP applications](/entra/id-governance/sap) (Microsoft Learn)

## Automatic synchronization of authorization attributes

Authorization attributes can be replicated from Microsoft Entra to target SAP applications, such as SAP Business Technology Platform (BTP) role collections. For more information, see [Manage access to your SAP applications](/entra/id-governance/sap#bring-identities-from-hr-into-microsoft-entra-id).

> [!NOTE]
> You can now use Microsoft Entra functionality to synchronize both users and groups from Microsoft Entra to SAP Cloud Identity Services. You can add this functionality free of charge in the Microsoft Entra admin center.

The process to set up and synchronize authorization roles and profiles for NetWeaver and S/4HANA systems is documented in detail in the SAP Community blog post [Identity and Access Management with Microsoft Entra, Part III: SuccessFactors and Role Provisioning](https://community.sap.com/t5/technology-blog-posts-by-members/identity-and-access-management-with-microsoft-entra-part-iii-successfactors/ba-p/14233747).

For helpful diagrams, see these resources:

- Diagram that depicts the architecture from an SAP-centric point of view: [SAP IAM integration with SAP Cloud Identity Services](https://architecture.learning.sap.com/docs/ref-arch/20c6b29b1e) (SAP Architecture Center).
- Diagram that shows the concept with reference to Microsoft Entra: [Migrate identity management scenarios from SAP IDM to Microsoft Entra](/entra/id-governance/scenarios/migrate-from-sap-idm#overview-of-microsoft-entra-and-its-sap-product-integrations) (Microsoft Learn).
- Diagram that shows the new Microsoft Entra functionality that allows synchronization of users and groups to Advanced Business Application Programming (ABAP) systems: [SAP Community image](https://community.sap.com/t5/image/serverpage/image-id/329690iC40448471EB1C535/is-moderation-mode/true/image-dimensions/2000?v=v2&px=-1).

## Global Secure Access with SAP GUI SNC

The Global Secure Access client implements an [NDIS 6.0 lightweight filter (LWF) network driver](/windows-hardware/drivers/network/ndis-filter-drivers) to route any traffic to internal and external applications based on centrally defined access rules at the company's Microsoft Entra ID tenant level.

If you want to achieve network-level security, we recommend the video embedded in the following SAP Community blog post: [SAP GUI MFA with Microsoft Entra (Part II): Integration](https://community.sap.com/t5/technology-blog-posts-by-members/sap-gui-mfa-with-microsoft-entra-part-ii-integration-with-microsoft-entra/ba-p/13691141). The outcome is similar to operating a virtual private network (VPN), without the overhead of installing and maintaining a full VPN on client devices.

For more information about using Global Secure Access with SAP, see the YouTube video [The one with SSO to SAP GUI using Global Secure Access](https://www.youtube.com/watch?v=42dj-lV-MDQ).

## SAP products approaching end of support

Several SAP security solution products reached or are approaching the end of support. Microsoft and SAP collaborated to provide a migration path for customers. For more information, see these resources:

- [Migrate identity management scenarios from SAP IDM to Microsoft Entra](/entra/id-governance/scenarios/migrate-from-sap-idm) (Microsoft Learn)
- [Update on the SAP Identity Management migration to Microsoft Entra](https://community.sap.com/t5/technology-blog-posts-by-sap/update-on-the-sap-identity-management-migration-to-microsoft-entra/ba-p/13742820) (SAP Community blog post)
- [Preparing for SAP Identity Management's End-of-Maintenance in 2027](https://community.sap.com/t5/technology-blog-posts-by-sap/preparing-for-sap-identity-management-s-end-of-maintenance-in-2027/ba-p/13596101) (SAP Community blog post)

SAP announced that SAP SSO Server (Java) is reaching the end of support in December 2027. For more information, see the SAP Community blog post [SAP GUI MFA with Microsoft Entra (Part I): Integration with SAP Secure Login Service](https://community.sap.com/t5/technology-blog-posts-by-members/sap-gui-mfa-with-microsoft-entra-part-i-integration-with-sap-secure-login/ba-p/13605383).

## Related content

- [Microsoft Entra ID Governance webpage](https://www.microsoft.com/security/business/identity-access/microsoft-entra-id-governance?rtc=1)
- [Microsoft Mechanics YouTube video](https://www.youtube.com/watch?v=BGE5FUHd-Uc)
- [Microsoft Entra ID Governance interactive guides](https://mslearn.cloudguides.com/guides/Microsoft%20Entra%20Identity%20Governance)
- [Microsoft Entra ID Governance documentation](/entra/id-governance/)
- [SAP Note 1912264: SAP NetWeaver single sign-on 1.0](https://me.sap.com/notes/1912264)
- [SAP Note 2300234: SAP single sign-on 3.0](https://me.sap.com/notes/2300234)
- [SAP Community: Single Sign-On for SAP GUI](https://pages.community.sap.com/topics/single-sign-on)
- [SAP Note 1848999: Central Note for CommonCryptoLib 8 (SAPCRYPTOLIB)](https://me.sap.com/notes/1848999/E)
- [SAP Note 510007: Additional considerations about setting up SSL on Application Server ABAP](https://me.sap.com/notes/510007)
- [YouTube video about single sign-on for SAP NetWeaver and Microsoft Entra ID (formerly Azure Active Directory)](https://www.youtube.com/watch?v=AGCZA8CCIYo)
