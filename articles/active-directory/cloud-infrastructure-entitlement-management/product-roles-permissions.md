---
title: Permissions Management required roles and permissions
description: Review roles and the level of permissions assigned in Microsoft Entra Permissions Management.
services: active-directory
author: jenniferf-skc
manager: amycolannino
ms.service: active-directory 
ms.subservice: ciem
ms.workload: identity
ms.topic: how-to
ms.date: 08/17/2023
ms.author: jfields
---

In Microsoft Entra and Microsoft Entra Permissions Management, assigned roles give users different levels of access to monitor and take action in multicloud environments. Here, review a list of identities assigned to a privileged role and learn more about the level of permissions given to users assigned roles in your organization.

# [Microsoft Entra Admin Center built-in roles](../azure/active-directory/roles/permissions-reference.md)

- **Global Administrator**: Manages all aspects of Entra Admin Center and Microsoft services that use Entra Admin Center identities. 
- **Billing Administrator**: Performs common billing related tasks like updating payment information. 
- **Permissions Management Administrator**: Manages all aspects of Entra Permissions Management. 

# Permissions Management roles and permissions levels

## Enabling Permissions Management
- To activate a trial or purchase license, you must have *Global Administrator* or *Billing Administrator* permissions.

## Onboarding your Amazon Web Service (AWS), Microsoft Entra, or Google Cloud Platform (GCP) environments

- To configure data collection, you must have *Permissions Management Administrator* or *Global Administrator* permissions. 
- A user with the ability to create a new app registration in Azure (needed to facilitate the OIDC connection) will be needed for AWS and GCP onboarding.

## Notes on permissions and roles in Permissions Management

- Users can have the following permissions:
    - Admin for all authorization system types
    - Admin for selected authorization system types
- If a user is not an admin, they are assigned Entra Admin Center security group-based, fine-grained permissions for all or selected authorization system types:
    - Viewers: View only access to scoped cloud accounts. View the specified AWS accounts, Entra subscriptions, and GCP projects
    - Controller: Modify Cloud Infrastructure Entitlement Management (CIEM) properties and use the Remediation dashboard.
    - Approvers: Able to approve permission requests
    - Requestors: Request for permissions in cloud accounts
        - Request permissions in the specified AWS accounts, Entra subscriptions, and GCP projects.

## Permissions Management actions and required roles

Remediation
- To view the Remediation tab, you must have Viewer, Controller, or Approver permissions.
- To make changes in the Remediation tab, you much have Controller or Approver permissions.

Autopilot
- To view and make changes in the Autopilot tab, you must be a Permissions Management Administrator.

Alert
- Any user (admin, non-admin) can create an alert. 
- Only the user who creates the alert can edit, rename, deactivate, or delete the alert.

Manage users or groups
- Only the owner of a group can add or remove a user from the group.
- Managing users and groups is only done in the Entra Admin Center.


# Next steps

- For information about managing roles, policies and permissions requests in your organization, see [View roles/policies and requests for permission in the Remediation dashboard](ui-remediation.md).