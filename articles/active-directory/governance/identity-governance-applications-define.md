---
title: Define policies for governing access to applications in your environment| - Azure AD
description: Azure Active Directory Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  You can define policies for how users should obtain access to your business critical applications integrated with Azure AD.
services: active-directory
documentationcenter: ''
author: ajburnle
manager: karenhoran
editor: markwahl-msft
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.subservice: compliance
ms.date: 5/9/2022
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Define policies for governing access to applications in your environment

> [!div class="step-by-step"]
> [« Govern access for applications in your environment](identity-governance-applications-prepare.md)
> [Integrate the application with Azure AD »](identity-governance-applications-integrate.md)
 
Once you have identified one or more applications for which access is to be governed from Azure AD, write down the organization's policies for determining which users should have access, and any other constraints that the system should provide.

## Collect application role definitions

Organizations with compliance requirements or risk management plans will have sensitive or business-critical applications.  If this application is an existing application in your environment, you may already have documented the access policies for who 'should have access' to this application.  If not, you may need to consult with various stakeholders, such as compliance and risk management teams, to ensure that the policies being used to automate access decisions are appropriate for your scenario.

1. First, collect the roles and permissions that the application provides, which are to be governed in Azure AD.  Some apps may have only a single role, for example only "User". More complex apps may surface multiple roles to be managed through Azure AD.  These application roles typically make broad constraints on the access a user with that role would have within the app. For example, an application that has an administrator persona might have two roles, "User" and "Administrator".  Other apps may also rely upon group memberships or claims for finer-grained role checks, which can be provided to the application from Azure AD in provisioning or federation protocols.  Finally, there may be roles that don't surface in Azure AD - perhaps the application doesn't permit defining the administrators in Azure AD, instead relying upon its own authorization rules to identify administrators.
   > [!Note] 
   > If you're using an application from the Azure AD application gallery that supports provisioning, then Azure AD may automatically update the application manifest with the application's roles automatically, once provisioning is configured.


## Define the organization's policy for access to the application

In this section, you'll write down the organizational policies you plan to have expressed for the application. You may wish to record this list in a spreadsheet, for example

|Role|Prerequisite for access|Approvers|Default duration of access|Separation of duties constraints|Conditional access policies|
|:--|-|-|-|-|-|
|*Western Sales*|Member of sales team|user's manager|Yearly review|Cannot have *Eastern Sales* access|MFA and registered device required for access|
|*Western Sales*|Any employee outside of sales|head of Sales department|90 days|N/A|MFA and registered device required for access|
|*Western Sales*|Non-employee sales rep|head of Sales department|30 days|N/A|MFA required for access|
|*Eastern Sales*|Member of sales team|user's manager|Yearly review|Cannot have *Western Sales* access|MFA and registered device required for access|
|*Eastern Sales*|Any employee outside of sales|head of Sales department|90 days|N/A|MFA and registered device required for access|
|*Eastern Sales*|Non-employee sales rep|head of Sales department|30 days|N/A|MFA required for access|

1. Identify if there are requirements for prerequisite criteria that a user must meet prior to that user having access to an application. For example, under normal circumstances, only full time employees, or those in a particular department or cost center, should be allowed to obtain access to a particular department's application, even as a non-administrator user.  In addition, you may wish to require, in the entitlement management policy for a user from some other department getting access, one or more additional approvers. While having multiple stages of approval may slow the overall process of a user gaining access, these ensure access requests are appropriate and decisions are accountable.  For example, requests for access by an employee could have two stages of approval, first by the requesting user's manager, and second by one of the resource owners responsible for data held in the application.

1. Determine how long a user who has been approved for access, should have access.  Typically, a user might retain access indefinitely, until they are no longer affiliated with the organization. In some situations, access may be tied to particular projects or milestones, so that when the project ends, access is removed automatically.  Or, you may wish to configure quarterly or yearly reviews of everyone's access, so that there is regular oversight. These processes can ensure users lose access eventually when access is no longer needed, even if there is no pre-determined project end date.

1. Determine if there are separation of duties constraints. For example, you may have an application with two roles - **Western Sales** and **Eastern Sales** - and want to ensure that a user can only have one sales territory at a time.  Include a list of any pairs of roles that are incompatible for your application, such that if a user got one role, they should not be allowed to request the second role.

1. Select the appropriate conditional access policy for access to the application. We recommend that you analyze your apps and group them into applications that have the same resource requirements for the same users. If this is the first  application you're integrating with Azure AD for identity governance, you may need to create a new conditional access policy to express constraints such as requirements for Multi-factor Authentication (MFA) or location-based access. See [plan a conditional access deployment](../conditional-access/plan-conditional-access.md) for more considerations on how to define a conditional access policy.

1. Determine how exceptions to your criteria should be handled.  For example, an application may typically only be available for designated employees, but an auditor or vendor may need temporary access for a specific project. Or, an employee who is traveling may require access from a location that is normally blocked as your organization has no presence in that location.   In these situations, you may wish to also have an entitlement management policy for approval that may have different stages, or a different time limit, or a different approver.  A vendor who is signed in as a guest user in your Azure AD tenant may not have a manager, so instead their access requests could be approved by a sponsor for their organization, or by a resource owner, or a security officer.

1. Determine if users are to be required to agree to [a terms of use](../conditional-access/require-tou.md).

As the organizational policy for who should have access is being reviewed by the stakeholders, then you can begin integrating the application with Azure AD. That way at a later step you'll be ready to deploy the organization-approved policies for access in Azure AD identity governance.

## Next steps

> [!div class="step-by-step"]
> [« Govern access for applications in your environment](identity-governance-applications-prepare.md)
> [Integrate the application with Azure AD »](identity-governance-applications-integrate.md)

