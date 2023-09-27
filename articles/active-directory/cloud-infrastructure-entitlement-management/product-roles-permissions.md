---
title: Microsoft Entra Permissions Management roles and permissions
description: Review roles and the level of permissions assigned in Microsoft Entra Permissions Management.
# customerintent: As a cloud administrator, I want to understand Permissions Management role assignments, so that I can effectively assign the correct permissions to users.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 08/24/2023
ms.author: jfields
---


# Microsoft Entra Permissions Management roles and permissions levels

In Microsoft Azure and Microsoft Entra Permissions Management role assignments grant users permissions to monitor and take action in multicloud environments.

- **Global Administrator**: Manages all aspects of Microsoft Entra Admin Center and Microsoft services that use Microsoft Entra Admin Center identities. 
- **Billing Administrator**: Performs common billing related tasks like updating payment information. 
- **Permissions Management Administrator**: Manages all aspects of Microsoft Entra Permissions Management. 

See [Microsoft Entra built-in roles to learn more.](https://go.microsoft.com/fwlink/?linkid=2247090)

## Enabling Permissions Management
- To activate a trial or purchase a license, you must have *Global Administrator* permissions.

## Onboarding your Amazon Web Service (AWS), Microsoft Entra, or Google Cloud Platform (GCP) environments

- To configure data collection, you must have *Permissions Management Administrator* or *Global Administrator* permissions. 
- A user with *Global Administrator* or *Permissions Management Administrator* role assignments is required for AWS and GCP onboarding.

## Notes on permissions and roles in Permissions Management

- Users can have the following permissions:
    - Admin for all authorization system types
    - Admin for selected authorization system types
    - Fine-grained permissions for all or selected authorization system types
- If a user isn't an admin, they're assigned Microsoft Entra security group-based, fine-grained permissions for all or selected authorization system types:
    - Viewers: View the specified AWS accounts, Azure subscriptions, and GCP projects
    - Controller: Modify Cloud Infrastructure Entitlement Management (CIEM) properties and use the Remediation dashboard.
    - Approvers: Able to approve permission requests
    - Requestors: Request permissions in the specified AWS accounts, Microsoft Entra subscriptions, and GCP projects.

## Permissions Management actions and required roles

Remediation
- To view the **Remediation** tab, you must have *Viewer*, *Controller*, or *Approver* permissions.
- To make changes in the **Remediation** tab, you must have *Controller* or *Approver* permissions.

Autopilot
- To view and make changes in the **Autopilot** tab, you must be a *Permissions Management Administrator*.

Alert
- Any user (admin, nonadmin) can create an alert. 
- Only the user who creates the alert can edit, rename, deactivate, or delete the alert.

Manage users or groups
- Only the owner of a group can add or remove a user from the group.
- Managing users and groups is only done in the Microsoft Entra Admin Center.


## Next steps

For information about managing roles, policies and permissions requests in your organization, see [View roles/policies and requests for permission in the Remediation dashboard](ui-remediation.md).
