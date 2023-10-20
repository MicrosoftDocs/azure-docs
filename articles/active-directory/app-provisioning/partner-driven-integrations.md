---
title: 'Use partner driven integrations to provision accounts into all your applications'
description: Use partner driven integrations to provision accounts into all your applications.
services: active-directory
author: billmath
manager: amycolannino
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 08/25/2023
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Partner-driven provisioning integrations

The Microsoft Entra provisioning service allows you to provision users and groups into both [SaaS](user-provisioning.md) and [on-premises](on-premises-scim-provisioning.md) applications. There are four integration paths:

**Option 1 - Microsoft Entra Application Gallery:**
Popular third party applications, such as Dropbox, Snowflake, and Workplace by Facebook, are made available for customers through the Microsoft Entra application gallery. New applications can easily be onboarded to the gallery using the [application network portal](../manage-apps/v2-howto-app-gallery-listing.md). 

**Option 2 - Implement a SCIM compliant API for your application:**
If your line-of-business application supports the [SCIM](https://aka.ms/scimoverview) standard, it can easily be integrated with the [Microsoft Entra SCIM client](use-scim-to-provision-users-and-groups.md).

   [![Diagram showing implementation of a SCIM compliant API for your application.](media/partner-driven-integrations/scim-compliant-api-1.png)](media/partner-driven-integrations/scim-compliant-api-1.png#lightbox)

**Option 3 - Use Microsoft Graph:**
Many new applications use Microsoft Graph to retrieve users, groups and other resources from Microsoft Entra ID. You can learn more about what scenarios to use [SCIM and Graph](scim-graph-scenarios.md) in. 

**Option 4 - Use partner-driven connectors:**
In cases where an application doesn't support SCIM, partners have built [custom ECMA connectors](on-premises-custom-connector.md) and SCIM gateways to integrate Microsoft Entra ID with numerous applications. **This document serves as a place for partners to attest to integrations that are compatible with Microsoft Entra ID, and for customers to discover these partner-driven integrations.** Custom ECMA connectors and SCIM gateways are built, maintained, and owned by the third-party vendor. 


   [![Diagram showing gateways between the Microsoft Entra SCIM client and target applications.](media/partner-driven-integrations/partner-driven-connectors-1.png)](media/partner-driven-integrations/partner-driven-connectors-1.png#lightbox)

## Available partner-driven integrations
The descriptions and lists of applications below are provided by the partners themselves. You can use the lists of applications supported to identify a partner that you may want to contact and learn more about.  

### IDMWORKS
#### Description
We Are Experts In Identity & Access Management and Data Center Management.
The Microsoft Entra platform integrates with IDMWORKS IdentityForge (IDF) Gateway for user lifecycle management for Mainframe systems (RACF, Top Secret, ACF2), Midrange system (AS400), Healthcare applications (EPIC/Cerner), Linux/Unix servers, Databases, and dozens of on-premises and cloud applications. IdentityForge provides a central, standardized integration engine and modern identity store that serves as a trusted source for all lifecycle management.
The IDF Gateway for Microsoft Entra ID provides lifecycle management for import sources and provisioning target systems that are not covered by the Microsoft Entra connector portfolio like Mainframe systems (RACF, Top Secret, ACF2) or Healthcare applications (EPIC/Cerner). The IDF Gateway powers Microsoft Entra identity lifecycle management (LCM) to continuously synchronize user account information from Mainframe/Healthcare sources and to automate the account provisioning lifecycle use cases like create, read (import), update, deactivate, delete user accounts and perform group management.

#### Contact information
* Company website: https://www.idmworks.com/identity-forge
* Contact information: https://www.idmworks.com/contacts/

#### Popular applications supported

Leading provider of Mainframe, Healthcare and ERP integrations.  More can be found at https://www.idmworks.com/identity-forge/

* IBM RACF
* CA Top Secret
* CA ACF2
* IBM i (AS/400)
* HP NonStop
* EPIC
* SAP ECC

### UNIFY Solutions
#### Description

UNIFY Solutions is the leading provider of Identity, Access, Security and Governance solutions.

#### Contact information
* Company website: https://unifysolutions.net/identity/unifyconnect
* Contact information: https://unifysolutions.net/contact/

#### Popular applications supported
* Aurion People & Payroll
* Frontier Software chris21
* TechnologyOne HR
* Ascender HCM
* Fusion5 EmpowerHR
* SAP ERP Human Capital Management

## How-to add partner-driven integrations to this document
If you have built a SCIM Gateway and would like to add it to this list, follow the steps below. 

1. Review the Microsoft Entra SCIM [documentation](use-scim-to-provision-users-and-groups.md) to understand the Microsoft Entra SCIM implementation.
1. Test compatibility between the Microsoft Entra SCIM client and your SCIM gateway.
1. Click the pencil at the top of this document to edit the article
1. Once you're redirected to GitHub, click the pencil at the top of the article to start making changes
1. Make changes in the article using the Markdown language and create a pull request. Make sure to provide a description for the pull request.  
1. An admin of the repository will review and merge your changes so that others can view them.

## Guidelines
* Add any new partners in alphabetical order.
* Limit your entries to 500 words.
* Ensure that you provide contact information for customers to learn more.
* To avoid duplication, only include applications that don't already have out of the box provisioning connectors in the [Microsoft Entra application gallery](../saas-apps/tutorial-list.md). 

## Disclaimer
For independent software vendors: The Microsoft Entra Application Gallery Terms & Conditions, excluding Sections 2–4, apply to this Partner-Driven Integrations Catalog (the “Integrations Catalog”). References to the “Gallery” shall be read as the “Integrations Catalog” and references to an “App” shall be read as “Integration”.  

If you don't agree with these terms, you shouldn't submit your Integration for listing in the Integrations Catalog. If you submit an Integration to the Integrations Catalog, you agree that you or the entity you represent (“YOU” or “YOUR”) is bound by these terms. 
 
Microsoft reserves the right to accept or reject your proposed Integration in its sole discretion and reserves the right to determine the manner in which Apps are presented, promoted, or featured in this Integrations Catalog. 
