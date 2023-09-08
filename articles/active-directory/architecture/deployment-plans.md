---
title: Azure Active Directory deployment plans
description: Guidance on Azure Active Directory deployment, such as authentication, devices, hybrid scenarios, governance, and more.
services: active-directory
author: gargisinha
manager: martinco
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 01/17/2023
ms.author: gasinh
ms.custom: "it-pro, seodec18"
ms.collection: M365-identity-device-management
---

# Azure Active Directory deployment plans

Use the following guidance to help deploy Azure Active Directory (Azure AD). Learn about business value, planning considerations, and operational procedures. You can use a browser Print to PDF function to create offline documentation.

## Your stakeholders

When beginning your deployment plans, include your key stakeholders. Identify and document stakeholders, roles, responsibilities. Titles and roles can differ from one organization to another, however the ownership areas are similar.

|Role |Responsibility |
|-|-|
|Sponsor|An enterprise senior leader with authority to approve and/or assign budget and resources. The sponsor is the connection between managers and the executive team.|
|End user|The people for whom the service is implemented. Users can participate in a pilot program.|
|IT Support Manager|Provides input on the supportability of proposed changes |
|Identity architect or Azure Global Administrator|Defines how the change aligns with identity management infrastructure|
|Application business owner |Owns the affected application(s), which might include access management. Provides input on the user experience.
|Security owner|Confirms the change plan meets security requirements|
|Compliance manager|Ensures compliance with corporate, industry, or governmental requirements|

### RACI

RACI is an acronym derived from four key responsibilities: 

* **Responsible** 
* **Accountable**
* **Consulted**
* **Informed**

Use these terms to clarify and define roles and responsibilities in your project, and for other cross-functional or departmental projects and processes.

## Authentication

Use the following list to plan for authentication deployment. 

* **Azure AD multi-factor authentication (MFA)** - Using admin-approved authentication methods, Azure AD MFA helps safeguard access to your data and applications while meeting the demand for a simple sign-in process: 
  * See the video, [How to configure and enforce multi-factor authentication in your tenant](https://www.youtube.com/watch?v=qNndxl7gqVM)
  * See, [Plan an Azure Active Directory Multi-Factor Authentication deployment](../authentication/howto-mfa-getstarted.md) 
* **Conditional Access** - Implement automated access-control decisions for users to access cloud apps, based on conditions: 
  * See, [What is Conditional Access?](../conditional-access/overview.md)
  * See, [Plan a Conditional Access deployment](../conditional-access/plan-conditional-access.md)
* **Azure AD self-service password reset (SSPR)** - Help users reset a password without administrator intervention:
  * See, [Passwordless authentication options for Azure AD](../authentication/concept-authentication-passwordless.md)
  * See, [Plan an Azure Active Directory self-service password reset deployment](../authentication/howto-sspr-deployment.md) 
* **Passwordless authentication** - Implement passwordless authentication using the Microsoft Authenticator app or FIDO2 Security keys:
  * See, [Enable passwordless sign-in with Microsoft Authenticator](../authentication/howto-authentication-passwordless-phone.md)
  * See, [Plan a passwordless authentication deployment in Azure Active Directory](../authentication/howto-authentication-passwordless-deployment.md)

## Applications and devices

Use the following list to help deploy applications and devices.

* **Single sign-on (SSO)** - Enable user access to apps and resources while signing in once, without being required to enter credentials again: 
  * See, [What is SSO in Azure AD?](../manage-apps/what-is-single-sign-on.md)
  * See, [Plan a SSO deployment](../manage-apps/plan-sso-deployment.md)
* **My Apps portal** - A web-based portal to discover and access applications. Enable user productivity with self-service, for instance requesting access to groups, or managing access to resources on behalf of others. 
  * See, [My Apps portal overview](../manage-apps/myapps-overview.md)
* **Devices** - Evaluate device integration methods with Azure AD, choose the implementation plan, and more.
  * See, [Plan your Azure Active Directory device deployment](../devices/plan-device-deployment.md)  

## Hybrid scenarios  

The following list describes features and services for productivity gains in hybrid scenarios.

* **Active Directory Federation Services (AD FS)** - Migrate user authentication from federation to cloud with pass-through authentication or password hash sync:
  *  See, [What is federation with Azure AD?](../hybrid/whatis-fed.md)
  *  See, [Migrate from federation to cloud authentication](../hybrid/migrate-from-federation-to-cloud-authentication.md)
* **Azure AD Application Proxy** - Enable employees to be productive at any place or time, and from a device. Learn about software as a service (SaaS) apps in the cloud and corporate apps on-premises. Azure AD Application Proxy enables access without virtual private networks (VPNs) or demilitarized zones (DMZs):
  * See, [Remote access to on-premises applications through Azure AD Application Proxy](../app-proxy/application-proxy.md)
  * See, [Plan an Azure AD Application Proxy deployment](../app-proxy/application-proxy-deployment-plan.md)
* **Seamless single sign-on (Seamless SSO)** - Use Seamless SSO for user sign-in, on corporate devices connected to a corporate network. Users don't need to enter passwords to sign in to Azure AD, and usually don't need to enter usernames. Authorized users access cloud-based apps without extra on-premises components:
  * See, [Azure Active Directory SSO: Quickstart](../hybrid/how-to-connect-sso-quick-start.md) 
  * See, [Azure Active Directory Seamless SSO: Technical deep dive](../hybrid/how-to-connect-sso-how-it-works.md)

## Users

* **User identities** - Learn about automation to create, maintain, and remove user identities in cloud apps, such as Dropbox, Salesforce, ServiceNow, and more. 
  * See, [Plan an automatic user provisioning deployment in Azure Active Directory](../app-provisioning/plan-auto-user-provisioning.md)
* **Identity governance** - Create identity governance and enhance business processes that rely on identity data. With HR products, such as Workday or Successfactors, manage employee and contingent-staff identity lifecycle with rules. These rules map Joiner-Mover-Leaver processes, such as New Hire, Terminate, Transfer, to IT actions such as Create, Enable, Disable.
  * See, [Plan cloud HR application to Azure Active Directory user provisioning](../app-provisioning/plan-cloud-hr-provision.md) 
* **Azure AD B2B collaboration** - Improve external-user collaboration with secure access to applications: 
  * See, [B2B collaboration overview](../external-identities/what-is-b2b.md)
  * See, [Plan an Azure Active Directory B2B collaboration deployment](secure-external-access-resources.md)

## Identity Governance and reporting

Use the following list to learn about identity governance and reporting. Items in the list refer to Microsoft Entra.

Learn more: [Secure access for a connected world—meet Microsoft Entra](https://www.microsoft.com/en-us/security/blog/?p=114039)

* **Privileged identity management (PIM)** - Manage privileged administrative roles across Azure AD, Azure resources, and other Microsoft Online Services. Use it for just-in-time access, request approval workflows, and fully integrated access reviews to help prevent malicious activities: 
  * See, [Start using Privileged Identity Management](../privileged-identity-management/pim-getting-started.md)
  * See, [Plan a Privileged Identity Management deployment](../privileged-identity-management/pim-deployment-plan.md) 
* **Reporting and monitoring** - Your Azure AD reporting and monitoring solution design has dependencies and constraints: legal, security, operations, environment, and processes. 
  * See, [Azure Active Directory reporting and monitoring deployment dependencies](../reports-monitoring/plan-monitoring-and-reporting.md)
* **Access reviews** - Understand and manage access to resources:
  * See, [What are access reviews?](../governance/access-reviews-overview.md)
  * See, [Plan a Microsoft Entra access reviews deployment](../governance/deploy-access-reviews.md)  
* **Identity governance** - Meet your compliance and risk management objectives for access to critical applications. Learn how to enforce accurate access.
  * See, [Govern access for applications in your environment](../governance/identity-governance-applications-prepare.md)

## Best practices for a pilot

Use pilots to test with a small group, before making a change for larger groups, or everyone. Ensure each use case in your organization is tested.

### Pilot: Phase 1

In your first phase, target IT, usability, and other users who can test and provide feedback. Use this feedback to gain insights on potential issues for support staff, and to develop communications and instructions you send to all users.

### Pilot: Phase 2

Widen the pilot to larger groups of users by using dynamic membership, or by manually adding users to the targeted group(s).

Learn more: [Dynamic membership rules for groups in Azure Active Directory](../enterprise-users/groups-dynamic-membership.md)
