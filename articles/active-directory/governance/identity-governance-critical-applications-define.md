---
title: Define policies for access to critical applications in your environment| Microsoft Docs
description: Azure Active Directory Identity Governance allows you to balance your organization's need for security and employee productivity with the right processes and visibility.  These features can be used for your existing business critical third party on-premises and cloud-based applications.
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
ms.date: 4/22/2022
ms.author: ajburnle
ms.reviewer: markwahl-msft
ms.collection: M365-identity-device-management
---

# Define policies for access to critical applications in your environment

> [!div class="step-by-step"]
> [« Prepare](identity-governance-critical-applications.md)
> [Integrate the application with Azure AD »](identity-governance-critical-applications-integrate.md)
 

## Define a policy for a critical application

<!-- TODO Could we summarize this section with a table that has 5 columns and a few example values that they fill in? App name, Role name, Access duration, Pre-requisite, Exception management -->

If this is an existing application in your environment, you may already have documented the access policies for who 'should have access' to this application.  If not, you may need to consult with various stakeholders, such as compliance and risk management teams, to ensure that the policies being used to automate access decisions are appropriate for your scenario.

<!-- TODO Add a bold text for each numbered bullet, to describe what the paragraph is about. -->

1. Collect the roles and permissions that the app provides which are to be governed in Azure AD.  Some apps may have only a single role, for example only "User". More complex apps may surface multiple roles to be managed through Azure AD.  These app roles typically make broad constraints on the access a user with that role would have within the app. For example, an app that has an administrator persona might have two roles, "User" and "Administrator".  Other apps may also rely upon group memberships for finer-grained role checks, which can be provided to the app from Azure AD in provisioning or federation protocols.

1. Identify if there are requirements for prerequisite criteria that a user must meet prior to that user having access to an application. For example, under normal circumstances, only full time employees, or those in a particular department or cost center, should be allowed to obtain access to a particular department's application, even as a non-administrator user.  In addition, you may wish to require, in the policy for a user getting access, one or more approvers, to ensure access requests are appropriate and decisions are accountable.  For example, requests for access by an employee could have two stages of approval, first by the requesting user's manager, and second by one of the resource owners responsible for data held in the application.

1. Determine how long a user who has been approved for access, should have access.  Typically, a user might retain access indefinitely, until they are no longer affiliated with the organization. In some situations, access may be tied to particular projects or milestones, so that when the project ends, access is removed automatically.  Or, you may wish to configure quarterly or yearly reviews of everyone's access, so that there is regular oversight that ensures users lose access eventually if it is no longer needed.

1. Determine how exceptions to those criteria should be handled.  For example, an application may typically only be available for designated employees, but an auditor or vendor may need temporary access for a specific project.  In these situations, you may wish to also have a policy for approval that may have different stages.  A vendor who is signed in as a guest user in your Azure AD tenant may not have a manager, so instead their access requests could be approved by a sponsor for their organization, or by a resource owner, or a security officer.

## Next steps

> [!div class="step-by-step"]
> [« Prepare](identity-governance-critical-applications.md)
> [Integrate the application with Azure AD »](identity-governance-critical-applications-integrate.md)

