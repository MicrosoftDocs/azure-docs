---
title: What is Azure AD Privileged Identity Management? | Microsoft Docs
description: Provides an overview of Azure Active Directory Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''
ms.service: active-directory
ms.workload: identity
ms.component: pim
ms.topic: overview
ms.date: 03/07/2018
ms.author: rolyon
ms.custom: pim 
---
# What is Azure AD Privileged Identity Management?

With Azure Active Directory (Azure AD) Privileged Identity Management, you can manage, control, and monitor access within your organization. This includes access to resources in Azure AD, Azure resources, and other Microsoft Online Services like Office 365 or Microsoft Intune.

> [!NOTE]
> When you enable Privileged Identity Management for your tenant, a valid Azure AD Premium P2 or Enterprise Mobility + Security E5 paid  or trial license is required for each user that interacts with or receives a benefit from the service. Examples include users/users in a group who are:
>
>- Assigned to the Privileged Role Administrator role 
>- Assigned as eligible to other directory roles manageable through PIM 
>- Able to approve/reject requests in PIM 
>- Assigned to an Azure resource role with Just in time or Direct (Time based) assignments  
>- Assigned to an access review
>
>For more information, see [Azure Active Directory editions](../fundamentals/active-directory-whatis.md).

Organizations want to minimize the number of people who have access to secure information or resources, because that reduces the chance of a malicious user getting that access, or an authorized user inadvertently impacting a sensitive resource.  However, users still need to carry out privileged operations in Azure AD, Azure, Office 365, or SaaS apps. Organizations can give users privileged access to Azure resources like Subscriptions, and Azure AD. There is a need for oversight for what those users are doing with their admin privileges. Azure AD Privileged Identity Management helps to mitigate the risk of excessive, unnecessary or misused access rights.

Azure AD Privileged Identity Management helps your organization:

- See which users are assigned privileged roles to manage Azure resources, as well as which users are assigned administrative roles in Azure AD
- Enable on-demand, "just in time" administrative access to Microsoft Online Services like Office 365 and Intune, and to Azure resources of subscriptions, resource groups, and individual resources such as Virtual Machines 
- See a history of administrator activation, including what changes administrators made to Azure resources
- Get alerts about changes in administrator assignments
- Require approval to activate Azure AD privileged admin roles
- Review membership of administrative roles and require users to provide a justification for continued membership

In Azure AD, Azure AD Privileged Identity Management can manage the users assigned to the built-in Azure AD organizational roles, such as Global Administrator. In Azure, Azure AD Privileged Identity Management can manage the users and groups assigned via Azure RBAC roles, including Owner or Contributor.

## Just in time administrator access

Historically, you could assign a user to an admin role through the Azure portal, other Microsoft Online Services portals, or the Azure AD cmdlets in Windows PowerShell. As a result, that user becomes a **permanent admin**, always active in the assigned role. Azure AD Privileged Identity Management introduces the concept of an **eligible admin**. Eligible admins should be users that need privileged access now and then, but not all-day, every day. The role is inactive until the user needs access, then they complete an activation process and become an active admin for a predetermined amount of time. More and more organizations are choosing to use this approach for reducing or eliminating “standing admin access” to privileged roles.


## Terminology

*Eligible role user* – An eligible role user is a user within your organization
that’s been assigned to an Azure AD role as eligible (role requires activation).

*Delegated approver* – A delegated approver is one or multiple individuals or
groups within your Azure AD responsible for approving requests to activate roles.

## Scenarios

Privileged Identity Management supports the following scenarios:

**As a Privileged Role Administrator you can:**

- Enable approval for specific roles
- Specify approver users and/or groups to approve requests
- View request and approval history for all privileged roles

**As a designated approver, you can:**

- View pending approvals (requests)
- Approve or reject requests for role elevation (single and/or bulk)
- Provide justification for my approval/rejection 

**As an eligible role user you can:**

- Request activation of a role that requires approval
- View the status of your request to activate
- Complete your task in Azure AD if activation was approved

## Enable Privileged Identity Management for your directory

You can start using Azure AD Privileged Identity Management in the [Azure portal](https://portal.azure.com/).

> [!NOTE]
> You must be a global administrator with an organizational account (for example, @yourdomain.com), not a Microsoft account (for example, @outlook.com), to enable Azure AD Privileged Identity Management for a directory.

1. Sign in to the [Azure portal](https://portal.azure.com/) as a global administrator of your directory.
2. If your organization has more than one directory, select your username in the upper right-hand corner of the Azure portal. Select the directory where you will use Azure AD Privileged Identity Management.
3. Select **All services** and use the Filter textbox to search for **Azure AD Privileged Identity Management**.
4. Check **Pin to dashboard** and then click **Create**. The Privileged Identity Management application opens.

If you're the first person to use Azure AD Privileged Identity Management in your directory and you navigate to Azure AD directory roles,  and you navigate to Azure AD directory roles,  a [security wizard](pim-security-wizard.md) walks you through the initial assignment experience. After that you automatically become the first **Security administrator** and **Privileged role administrator** of the directory.

For Azure AD roles, only a user who is in the Privileged Role Administrator role can manage assignments for other administrators in Azure AD PIM. You can [give other users the ability to manage directory roles in PIM](pim-how-to-give-access-to-pim.md). Global Administrators, Security Administrators and Security Readers can view assignments to Azure AD roles in Azure AD PIM.
For Azure RBAC roles, only a subscription administrator, a resource owner, or a resource user access administrator can manage assignments for other administrators in Azure AD PIM.  Users who are Privileged Role Administrators, Security Administrators or Security Readers do not by default have access to view assignments to Azure RBAC roles in Azure AD PIM.

## Privileged Identity Management Overview (Entry Point)

Azure AD Privileged Identity Management supports administration of Azure AD directory roles, and roles for Azure resources. The function of roles for Azure resources differ from administrative roles in Azure AD. Azure resource roles provide granular permissions for the resource at which they are assigned, and all subordinate resources in the resource hierarchy (known as inheritance). [Learn more about RBAC, resource hierarchy and inheritance](../../role-based-access-control/role-assignments-portal.md). PIM for both Azure AD directory roles, and Azure resources can be administered by accessing the appropriate link under the Manage section of the PIM Overview entry point left navigation menu.

PIM provides convenient access to activate roles, view pending activations/requests, pending approvals (for Azure AD directory roles), and reviews pending your response from the Tasks section of the left navigation menu.

When accessing any of the Tasks menu items from the Overview entry point, the resulting view contains results for both Azure AD directory roles and Azure resource roles.

![Quick start](./media/pim-configure/quick-start.png)

My roles contain a list of active and eligible role assignments for Azure AD directory roles, and Azure resource roles. [Learn more about activating eligible role assignments](pim-how-to-activate-role.md).

Activating roles for Azure resources introduces a new experience that allows eligible members of a role to schedule activation for a future date/time and select a specific activation duration within the maximum allowed by administrators.

![](./media/pim-configure/activations.png)

In the event a scheduled activation is no longer required, users can cancel their pending request by navigating to pending requests from the left navigation menu and clicking the Cancel button in-line with that request.

![Pending requests](./media/pim-configure/pending-requests.png)

## Privileged Identity Management admin dashboard

Azure AD Privileged Identity Manager provides an admin dashboard that gives you important information such as:

* Alerts that point out opportunities to improve security
* The number of users who are assigned to each privileged role  
* The number of eligible and permanent admins
* A graph of privileged role activations in your directory
* The number of Just-In-Time, Time-bound, and Permanent assignments for Azure resource roles
* Users and groups with new role assignments in the last 30 days (Azure resource roles)


![PIM dashboard - screenshot](./media/pim-configure/PIM_Admin_Overview.png)

## Privileged role management

With Azure AD Privileged Identity Management, you can manage the administrators by adding or removing permanent or eligible administrators to each role for Azure AD directory roles. With PIM for Azure resources, Owners, User Access Administrators, and Global Administrators that enable management of Subscriptions in their tenant can assign users or groups to Azure resource roles as eligible (Just-In-Time access), or Time-bound (activation not required) access with a start and end date/time, or permanent (if enabled in the role settings).

![PIM add/remove administrators - screenshot](./media/pim-configure/PIM_AddRemove.png)

## Configure the role activation settings

Using the [role settings](pim-how-to-change-default-settings.md) you can configure the eligible role activation properties for Azure AD directory roles including:

* The duration of the role activation period
* The role activation notification
* The information a user needs to provide during the role activation process
* Service ticket or incident number
* [Approval workflow requirements](./azure-ad-pim-approval-workflow.md)

![PIM settings - administrator activation - screenshot](./media/pim-configure/PIM_Settings_w_Approval_Disabled.png)

Note that in the image, the buttons for **Multi-Factor Authentication** are disabled. For certain, highly privileged roles, we require MFA for heightened protection.

Role settings for Azure resource roles allow administrators to configure Just-In-Time and Direct assignment settings including:

- The ability to assign user or groups to roles without an end date/time (permanent assignment)
- The default duration of an assignment (when not permanent)
- The maximum activation duration (when an eligible role member activates)
- The information a user needs to provide during the role activation (Just-In-Time assignments) or the assignment process (direct assignments)

![](./media/pim-configure/role-settings-details.png)

## Role activation

To [activate a role](pim-how-to-activate-role.md), an eligible admin requests a time-bound "activation" for the role. The activation can be requested using the **Activate my role** option in Azure AD Privileged Identity Management.

An admin who wants to activate a role needs to initialize Azure AD Privileged Identity Management in the Azure portal.

Role activation is customizable. In the PIM settings, you can determine the length of the activation and what information the admin needs to provide to activate the role.

![PIM administrator request role activation - screenshot](./media/pim-configure/PIM_RequestActivation.png)

## Review role activity

There are two ways to track how your employees and admins are using privileged roles. The first option is using [Directory Roles audit history](pim-how-to-use-audit-log.md). The audit history logs track changes in privileged role assignments, role activation history, and changes to settings for Azure resource roles. 

![PIM activation history - screenshot](./media/pim-configure/PIM_ActivationHistory.png)

The second option is to set up regular [access reviews](pim-how-to-start-security-review.md). These access reviews can be performed by and assigned reviewer (like a team manager) or the employees can review themselves. This is the best way to monitor who still requires access, and who no longer does.

## Azure AD PIM at subscription expiration

A tenant must have an Azure AD Premium P2 (or EMS E5) trial or paid subscription in their tenant before using Azure AD PIM.  Furthermore, licenses must be assigned to the administrators of the tenant.  Specifically, licenses must be assigned to administrators in Azure AD roles managed through Azure AD PIM, administrators in Azure RBAC roles managed through Azure AD PIM, and any non-administrator users who perform access reviews.
If your organization does not renew Azure AD Premium P2 or your trial expires, the Azure AD PIM features will no longer be available in your tenant, eligible role assignments will be removed and users will no longer be able to activate roles. You can read more in the  [Azure AD PIM subscription requirements](./subscription-requirements.md)

## Next steps

- [Subscription requirements to use PIM](subscription-requirements.md)
- [Azure AD directory roles you can manage in PIM](pim-roles.md)
- [Securing privileged access for hybrid and cloud deployments in Azure AD](../users-groups-roles/directory-admin-roles-secure.md?toc=%2fazure%2factive-directory%2fprivileged-identity-management%2ftoc.json)
