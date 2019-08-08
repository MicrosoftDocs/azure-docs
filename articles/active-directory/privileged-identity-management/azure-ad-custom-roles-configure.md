---
title: Configure Azure AD custom roles in Privileged Identity Management (PIM)| Microsoft Docs
description: How to configure Azure AD custom roles in Privileged Identity Management (PIM)
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.assetid: 
ms.service: role-based-access-control
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/06/2019
ms.author: curtand
ms.custom: pim 
ms.collection: M365-identity-device-management


#Customer intent: As a dev, devops, or it admin, I want to learn how to activate Azure AD custom roles, so that I can grant access to resources using this new capability.
---

# Configure Azure AD custom roles in Privileged Identity Management

A privileged role administrator can change the role settings that apply to a user when they activate their assignment to a custom role and for other application administrators that are assigning custom roles.

## Open role settings

Follow these steps to open the settings for an Azure AD role.

1. Sign in to [Privileged Identity Management](https://portal.azure.com/?Microsoft_AAD_IAM_enableCustomRoleManagement=true&Microsoft_AAD_IAM_enableCustomRoleAssignment=true&feature.rbacv2roles=true&feature.rbacv2=true&Microsoft_AAD_RegisteredApps=demo#blade/Microsoft_Azure_PIMCommon/CommonMenuBlade/quickStart) in the Azure portal with a user account that is assigned to the Privileged role administrator role.
1. Select **Azure AD custom roles (Preview)**.

    ![Select Azure AD custom roles preview to see eligible role assignments](./media/azure-ad-custom-roles-configure/settings-list.png)

1. Select **Setting** to open the **Settings** page. Select the role for the settings you want to configure.
1. Select **Edit** to open the Role settings pane.

    ![Open the Azure AD custom role to edit settings](./media/azure-ad-custom-roles-configure/edit-settings.png)

There are several settings you can configure.

## Assignment duration

You can choose from two assignment duration options for each assignment type (eligible or active) when you configure settings for a role. These options become the default maximum duration when a member is assigned to the role in PIM.

You can choose one of these *eligible* assignment duration options.

Option | Description
------- | -----------
Allow permanent eligible assignment | Administrators can assign permanent eligible membership.
Expire eligible assignment after | Administrators can require that all eligible assignments have a specified start and end date.

Also, you can choose one of these *active* assignment duration options:

Option | Description
------- | -----------
Allow permanent active assignment | Administrators can assign permanent active membership.
Expire active assignment after | Administrators can require that all active assignments have a specified start and end date.

## Require multi-factor authentication

Privileged Identity Management provides optional enforcement of Azure Multi-Factor Authentication (MFA) for two distinct scenarios.

### Require Multi-Factor Authentication on active assignment

In some cases, you might want to assign a member to a role for a short duration (one day, for example). In this case, they don't need the assigned members to request activation. In this scenario, PIM cannot enforce MFA when the member uses their role assignment, since they are already active in the role from the moment they are assigned.
To ensure that the administrator fulfilling the assignment is who they say they are, you can enforce MFA on active assignment by checking the Require Multi-Factor Authentication on active assignment box.

## Require Multi-Factor Authentication on activation

You can require eligible members of a role to enroll in Multi-Factor Authentication before they can activate. This process ensures that the user who is requesting activation is who they say they are with reasonable certainty. Enforcing this option protects critical roles in situations when the user account might have been compromised.

To require an eligible member to run MFA before activation, check the Require Multi-Factor Authentication on activation box.
For more information, see Multi-factor authentication (MFA) and PIM.

## Activation maximum duration

Use the Activation maximum duration slider to set the maximum time, in hours, that a role stays active before it expires. This value can be between 1 and 24 hours.
Require justification
You can require that members enter a justification on active assignment or when they activate. To require justification, check the Require justification on active assignment box or the Require justification on activation box.

## Require approval to activate

If you want to require approval to activate a role, follow these steps.

1. Check the Require approval to activate check box.
1. Click Select approvers to open the Select a member or group pane.
 
1. Select at least one member or group and then click Select. You can add any combination of members and groups. You must select at least one approver. There are no default approvers.
1. Your selections will appear in the list of selected approvers.
1. Once you have specified all your role settings, click Update to save your changes.

## Next steps

- [License requirements to use PIM](subscription-requirements.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
- [Deploy PIM](pim-deployment-plan.md)
