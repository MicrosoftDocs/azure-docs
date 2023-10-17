---
title: What is Privileged Identity Management?
description: Provides an overview of Microsoft Entra Privileged Identity Management (PIM).
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
editor: ''
ms.service: active-directory
ms.workload: identity
ms.subservice: pim
ms.topic: overview
ms.date: 09/12/2023
ms.author: barclayn
ms.reviewer: ilyal
ms.custom: pim,azuread-video-2020,contperf-fy21q3-portal, content-engagement
ms.collection: M365-identity-device-management
---

# What is Microsoft Entra Privileged Identity Management?

 Privileged Identity Management (PIM) is a service in Microsoft Entra ID that enables you to manage, control, and monitor access to important resources in your organization. These resources include resources in Microsoft Entra ID, Azure, and other Microsoft Online Services such as Microsoft 365 or Microsoft Intune. The following video explains important PIM concepts and features.
<br><br>

> [!VIDEO https://www.youtube.com/embed/f-0K7mRUPpQ]

## Reasons to use

Organizations want to minimize the number of people who have access to secure information or resources, because that reduces the chance of

- a malicious actor getting access
- an authorized user inadvertently impacting a sensitive resource

However, users still need to carry out privileged operations in Microsoft Entra ID, Azure, Microsoft 365, or SaaS apps. Organizations can give users just-in-time privileged access to Azure and Microsoft Entra resources and can oversee what those users are doing with their privileged access.

## License requirements

[!INCLUDE [entra-id-license-pim.md](../../../includes/entra-id-license-pim.md)]


## What does it do?

Privileged Identity Management provides time-based and approval-based role activation to mitigate the risks of excessive, unnecessary, or misused access permissions on resources that you care about. Here are some of the key features of Privileged Identity Management:

- Provide **just-in-time** privileged access to Microsoft Entra ID and Azure resources
- Assign **time-bound** access to resources using start and end dates
- Require **approval** to activate privileged roles
- Enforce **multi-factor authentication** to activate any role
- Use **justification** to understand why users activate
- Get **notifications** when privileged roles are activated
- Conduct **access reviews** to ensure users still need roles
- Download **audit history** for internal or external audit
- Prevents removal of the **last active Global Administrator** and **Privileged Role Administrator** role assignments

## What can I do with it?

Once you set up Privileged Identity Management, you'll see **Tasks**, **Manage**, and **Activity** options in the left navigation menu. As an administrator, you can choose between options such as managing **Microsoft Entra roles**, managing **Azure resource** roles, or PIM for Groups. When you choose what you want to manage, you see the appropriate set of options for that option.

![Screenshot of Privileged Identity Management in the Azure portal.](./media/pim-configure/pim-quickstart.png)

## Who can do what?

For Microsoft Entra roles in Privileged Identity Management, only a user who is in the Privileged Role Administrator or Global Administrator role can manage assignments for other administrators. Global Administrators, Security Administrators, Global Readers, and Security Readers can also view assignments to Microsoft Entra roles in Privileged Identity Management.

For Azure resource roles in Privileged Identity Management, only a subscription administrator, a resource Owner, or a resource User Access administrator can manage assignments for other administrators. Users who are Privileged Role Administrators, Security Administrators, or Security Readers don't by default have access to view assignments to Azure resource roles in Privileged Identity Management.

## Terminology

To better understand Privileged Identity Management and its documentation, you should review the following terms.

| Term or concept | Role assignment category | Description |
| --- | --- | --- |
| eligible | Type | A role assignment that requires a user to perform one or more actions to use the role. If a user has been made eligible for a role, that means they can activate the role when they need to perform privileged tasks. There's no difference in the access given to someone with a permanent versus an eligible role assignment. The only difference is that some people don't need that access all the time. |
| active | Type | A role assignment that doesn't require a user to perform any action to use the role. Users assigned as active have the privileges assigned to the role. |
| activate |  | The process of performing one or more actions to use a role that a user is eligible for. Actions might include performing a multi-factor authentication (MFA) check, providing a business justification, or requesting approval from designated approvers. |
| assigned | State | A user that has an active role assignment. |
| activated | State | A user that has an eligible role assignment, performed the actions to activate the role, and is now active. Once activated, the user can use the role for a preconfigured period of time before they need to activate again. |
| permanent eligible | Duration | A role assignment where a user is always eligible to activate the role. |
| permanent active | Duration | A role assignment where a user can always use the role without performing any actions. |
| time-bound eligible | Duration | A role assignment where a user is eligible to activate the role only within start and end dates. |
| time-bound active | Duration | A role assignment where a user can use the role only within start and end dates. |
| just-in-time (JIT) access |  | A model in which users receive temporary permissions to perform privileged tasks, which prevents malicious or unauthorized users from gaining access after the permissions have expired. Access is granted only when users need it. |
| principle of least privilege access |  | A recommended security practice in which every user is provided with only the minimum privileges needed to accomplish the tasks they're authorized to perform. This practice minimizes the number of Global Administrators and instead uses specific administrator roles for certain scenarios. |

## Role assignment overview

The PIM role assignments give you a secure way to grant access to resources in your organization. This section describes the assignment process. It includes assign roles to members, activate assignments, approve or deny requests, extend and renew assignments. 

PIM keeps you informed by sending you and other participants [email notifications](pim-email-notifications.md). These emails might also include links to relevant tasks, such activating, approve or deny a request.

The following screenshot shows an email message sent by PIM. The email informs Patti that Alex updated a role assignment for Emily.

![Screenshot shows an email message sent by Privileged Identity Management.](./media/pim-configure/pim-email.png)

### Assign

The assignment process starts by assigning roles to members. To grant access to a resource, the administrator assigns roles to users, groups, service principals, or managed identities. The assignment includes the following data:

- The members or owners to assign the role.
- The scope of the assignment. The scope limits the assigned role to a particular set of resources.
- The type of the assignment
  - **Eligible** assignments require the member of the role to perform an action to use the role. Actions might include  activation, or requesting approval from designated approvers.
  - **Active** assignments don't require the member to perform any action to use the role. Members assigned as active have the privileges assigned to the role.
- The duration of the assignment, using start and end dates or permanent. For eligible assignments, the members can activate or requesting approval during the start and end dates. For active assignments, the members can use the assign role during this period of time.

The following screenshot shows how administrator assigns a role to members.

![Screenshot of Privileged Identity Management role assignment.](./media/pim-configure/role-assignment.png)


For more information, check out the following articles: [Assign Microsoft Entra roles](pim-how-to-add-role-to-user.md), [Assign Azure resource roles](pim-resource-roles-assign-roles.md), and [Assign eligibility for a PIM for Groups](groups-assign-member-owner.md)

### Activate

If users have been made eligible for a role, then they must activate the role assignment before using the role. To activate the role, users select specific activation duration within the maximum (configured by administrators), and the reason for the activation request.

The following screenshot shows how members activate their role to a limited time.

![Screenshot of Privileged Identity Management role activation.](./media/pim-configure/role-activation.png)

If the role requires [approval](pim-resource-roles-approval-workflow.md) to activate, a notification appears in the upper right corner of the user's browser informing them the request is pending approval. If an approval isn't required, the member can start using the role.

For more information, check out the following articles: [Activate Microsoft Entra roles](pim-how-to-activate-role.md), [Activate my Azure resource roles](pim-resource-roles-activate-your-roles.md), and [Activate my PIM for Groups roles](groups-activate-roles.md)

### Approve or deny

Delegated approvers receive email notifications when a role request is pending their approval. Approvers can view, approve or deny these pending requests in PIM. After the request has been approved, the member can start using the role. For example, if a user or a group was assigned with Contribution role to a resource group, they are able to manage that particular resource group.

For more information, check out the following articles: [Approve or deny requests for Microsoft Entra roles](./pim-approval-workflow.md), [Approve or deny requests for Azure resource roles](pim-resource-roles-approval-workflow.md), and [Approve activation requests for PIM for Groups](groups-approval-workflow.md)

### Extend and renew assignments

After administrators set up time-bound owner or member assignments, the first question you might ask is what happens if an assignment expires? In this new version, we provide two options for this scenario:

- **Extend** – When a role assignment nears expiration, the user can use Privileged Identity Management to request an extension for the role assignment
- **Renew** – When a role assignment has already expired, the user can use Privileged Identity Management to request a renewal for the role assignment

Both user-initiated actions require an approval from a Global Administrator or Privileged Role Administrator. Admins don't need to be in the business of managing assignment expirations. You can just wait for the extension or renewal requests to arrive for simple approval or denial.

For more information, check out the following articles: [Extend or renew Microsoft Entra role assignments](pim-how-to-renew-extend.md), [Extend or renew Azure resource role assignments](pim-resource-roles-renew-extend.md), and [Extend or renew PIM for Groups assignments](groups-renew-extend.md)

## Scenarios

Privileged Identity Management supports the following scenarios:

### Privileged Role Administrator permissions

- Enable approval for specific roles
- Specify approver users or groups to approve requests
- View request and approval history for all privileged roles

### Approver permissions

- View pending approvals (requests)
- Approve or reject requests for role elevation (single and bulk)
- Provide justification for my approval or rejection

### Eligible role user permissions

- Request activation of a role that requires approval
- View the status of your request to activate
- Complete your task in Microsoft Entra ID if activation was approved

<a name='managing-privileged-access-azure-ad-groups-preview'></a>

## Managing privileged access Microsoft Entra groups (preview)

In Privileged Identity Management (PIM), you can now assign eligibility for membership or ownership of PIM for Groups. Starting with this preview, you can assign Microsoft Entra built-in roles to cloud groups and use PIM to manage group member and owner eligibility and activation. For more information about role-assignable groups in Microsoft Entra ID, see [Use Microsoft Entra groups to manage role assignments](../roles/groups-concept.md).

>[!Important]
> To assign a PIM for Groups to a role for administrative access to Exchange, Security & Compliance Center, or SharePoint, use the Azure portal **Roles and Administrators** experience and not in the PIM for Groups experience to make the user or group eligible for activation into the group.

### Different just-in-time policies for each group

Some organizations use tools like Microsoft Entra business-to-business (B2B) collaboration to invite their partners as guests to their Microsoft Entra organization. Instead of a single just-in-time policy for all assignments to a privileged role, you can create two different PIM for Groups with their own policies. You can enforce less strict requirements for your trusted employees, and stricter requirements like approval workflow for your partners when they request activation into their assigned group.

### Activate multiple role assignments in one request

With the PIM for Groups preview, you can give workload-specific administrators quick access to multiple roles with a single just-in-time request. For example, your Tier 3 Office Admins might need just-in-time access to the Exchange Admin, Office Apps Admin, Teams Admin, and Search Admin roles to thoroughly investigate incidents daily. Before today it would require four consecutive requests, which are a process that takes some time. Instead, you can create a role assignable group called “Tier 3 Office Admins”, assign it to each of the four roles previously mentioned (or any Microsoft Entra built-in roles) and enable it for Privileged Access in the group’s Activity section. Once enabled for privileged access, you can configure the just-in-time settings for members of the group and assign your admins and owners as eligible. When an admin elevates into the group, they become members of all four Microsoft Entra roles.

## Invite guest users and assign Azure resource roles in Privileged Identity Management

Microsoft Entra guest users are part of the business-to-business (B2B) collaboration capabilities within Microsoft Entra ID so that you can manage external guest users and vendors as guests in Microsoft Entra ID. For example, you can use these Privileged Identity Management features for Azure identity tasks with guests such as assigning access to specific Azure resources, specifying assignment duration and end date, or requiring two-step verification on active assignment or activation. For more information on how to invite a guest to your organization and manage their access, see [Add B2B collaboration users in the Azure portal](../external-identities/add-users-administrator.md).

### When would you invite guests?

Here are a couple examples of when you might invite guests to your organization:

- Allow an external self-employed vendor that only has an email account to access your Azure resources for a project.
- Allow an external partner in a large organization that uses on-premises Active Directory Federation Services to access your expense application.
- Allow support engineers not in your organization (such as Microsoft support) to temporarily access your Azure resource to troubleshoot issues.

### How does collaboration using B2B guests work?

When you use B2B collaboration, you can invite an external user to your organization as a guest. The guest can be managed as a user in your organization, but a guest has to be authenticated in their home organization and not in your Microsoft Entra organization. This means that if the guest no longer has access to their home organization, they also lose access to your organization. For example, if the guest leaves their organization, they automatically lose access to any resources you shared with them in Microsoft Entra ID without you having to do anything. For more information about B2B collaboration, see [What is guest user access in Microsoft Entra B2B?](../external-identities/what-is-b2b.md).

![Diagram showing how a guest user is authenticated in their home directory](./media/pim-configure/b2b-external-user.png)

## Next steps

- [License requirements to use Privileged Identity Management](../governance/licensing-fundamentals.md)
- [Securing privileged access for hybrid and cloud deployments in Microsoft Entra ID](../roles/security-planning.md?toc=/azure/active-directory/privileged-identity-management/toc.json)
- [Deploy Privileged Identity Management](pim-deployment-plan.md)
