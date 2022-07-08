---
title: 'Leverage partner driven integrations to provision accounts into all your applications'
description: Leverage partner driven integrations to provision accounts into all your applications.
services: active-directory
author: billmath
manager: rkarlin
ms.service: active-directory
ms.workload: identity
ms.topic: overview
ms.date: 07/1/2022
ms.subservice: hybrid
ms.author: billmath
ms.collection: M365-identity-device-management
---
# Partner-driven provisioning integrations

The Azure Active Directory Provisioning service allows you to provision users and groups into both [SaaS](.../active-directory/app-provisioning/user-provisioning.md) and [on-premises](.../app-provisioning/on-premises-scim-provisioning.md) applications. There are four integration paths:

**Option 1 - Azure AD Application Gallery:**
Popular 3rd party applications, such as Dropbox, Snowflake, and Workplace by Facebook, are made available for customers through the Azure AD application gallery. New applications can easily be onboaded to the gallery using the [application network portal](.../azuread-dev/howto-app-gallery-listing). 

**Option 2 - Implement a SCIM compliant API for your application:**
If your line-of-business application supports the [SCIM](https://aka.ms/scimoverview) standard, it can easily be integrated with the [Azure AD SCIM client](.../active-directory/app-provisioning/use-scim-to-provision-users-and-groups.md).

<img width="316" alt="Provisioning to a SCIM application" src="https://user-images.githubusercontent.com/36525136/171483159-9470f922-4b89-4ebf-8962-bd05a72f87be.png">

**Option 3 - Leverage Microsoft Graph:**
Many new applications use [Microsoft Graph](https://docs.microsoft.com/graph/overview) to retrieve [users](.../graph/api/resources/user.md), groups and other resources from Azure Active Directory. You can learn more about what scenarios to use [SCIM and Graph](.../active-directory/app-provisioning/scim-graph-scenarios.md) in. 

**Option 4 - Leverage partner-driven connectors:**
In cases where an application does not support SCIM, partners have built gateways between the Azure AD SCIM client and target applications. **This document serves as a place for partners to attest to integrations that are compatible with Azure Active Directory, and for customers to discover these partner-driven integrations.** Note that these gateways are built, maintained, and owned by the third-party vendor. 

<img width="371" alt="Provisioning to a SCIM application via a SCIM gateway" src="https://user-images.githubusercontent.com/36525136/171484637-acc3436c-d99e-4ab4-8ae5-d0eeb07bb650.png">

## Available partner-driven integrations
### Aquera
#### Description
The Aquera Identity Integration Platform as a Service closes the connectivity gaps for real-time identity governance and lifecycle management workflows. The platform offers SCIM gateway services for account provisioning and aggregation, orchestration services for user and password synchronization, and workflow services for the governance of disconnected applications.
#### Contact information
* Company website: https://www.aquera.com/applications.html
* Contact information: https://www.aquera.com/contact-us.html

#### Popular applications supported
3 apps listed below for reference. Catalog contains [200+](https://www.aquera.com/applications.html).
* ADP
* Concur
* Calendly

### IDMWORKS
#### Description
We Are Experts In Identity & Access Management and Data Center Management.
The Azure AD platform is integrated with IDMWORKS IdentityForge (IDF) Gateway for user lifecycle management for Mainframe systems (RACF, Top Secret, ACF2), Midrange system (AS400), Healthcare applications (EPIC/Cerner), Linux/Unix servers, Databases, and dozens of on-prem and cloud applications. IdentityForge provides a central, standardized integration engine and modern identity store that serves as a trusted source for all lifecycle management.
The IDF Gateway for Azure AD provides lifecycle management for import sources and provisioning target systems that are not covered by the Azure AD connector portfolio like Mainframe systems (RACF, Top Secret, ACF2) or Healthcare applications (EPIC/Cerner). The IDF Gateway powers Azure AD identity lifecycle management (LCM) to continuously synchronize user account information from Mainframe/Healthcare sources and to automate the account provisioning lifecycle use cases like create, read (import), update, deactivate, delete user accounts and perform group management.

#### Contact information
* Company website: https://www.idmworks.com/identity-forge
* Contact information: https://www.idmworks.com/contacts/

#### Popular Applications supported

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

#### Applications supported
* Aurion People & Payroll
* Frontier Software chris21
* TechnologyOne HR
* Ascender HCM
* Fusion5 EmpowerHR
* SAP ERP Human Capital Management

## How-to add partner-driven integrations to this document
If you have built a SCIM Gateway and would like to add it to this list, please follow the steps below. 

1. Review the Azure AD SCIM [documentation](.../app-provisioning/use-scim-to-provision-users-and-groups.md) to understand the Azure AD SCIM implementation.
1. Test compatibility between the Azure AD SCIM client and your SCIM gateway.
1. Click the pencil at the top of this document to edit the article
1. Once you are redirected to Github, click the pencil at the top of the article to start making changes
1. Make changes in the article using the Markdown language and create a pull request. Make sure to provide a description for the pull request.  
1. An admin of the repository will review and merge your changes so that others can view them.

## Guidelines
* Add any new partners in alphabetical order.
* Limit your entries to 500 words.
* Ensure that you provide contact information for customers to learn more.
* To avoid duplication, please only include applications that do not already have out of the box provisioning connectors in the [Azure AD application gallery](.../active-directory/saas-apps/tutorial-list.md). 

## Disclaimer
For independent software vendors: The Microsoft Azure Active Directory Application Gallery Terms & Conditions, excluding Sections 2–4, apply to this Partner-Driven Integrations Catalog (https://aka.ms/PartnerDrivenProvisioning, the “Integrations Catalog”). References to the “Gallery” shall be read as the “Integrations Catalog” and references to an “App” shall be read as “Integration”.  

If you do not agree with these terms, you should not submit your Integration for listing in the Integrations Catalog. If you submit an Integration to the Integrations Catalog, you agree that you or the entity you represent (“YOU” or “YOUR”) is bound by these terms. 
 
Microsoft reserves the right to accept or reject your proposed Integration in its sole discretion and reserves the right to determine the manner in which Apps are presented, promoted, or featured in this Integrations Catalog. 
