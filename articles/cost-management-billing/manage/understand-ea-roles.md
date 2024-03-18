---
title: Understand admin roles for Enterprise Agreements (EA) in Azure
description: Learn about Enterprise administrator roles in Azure. You can assign five distinct administrative roles.
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: enterprise
ms.topic: conceptual
ms.date: 02/16/2024
ms.author: banders
---

# Managing Azure Enterprise Agreement roles

> [!NOTE]
> Enterprise administrators have permissions to create new subscriptions under active enrollment accounts. For more information about creating new subscriptions, see [Add a new subscription](direct-ea-administration.md#add-a-subscription).


To help manage your organization's usage and spend, Azure customers with an Enterprise Agreement can assign six distinct administrative roles:

- Enterprise Administrator
- Enterprise Administrator (read only)¹
- EA purchaser
- Department Administrator
- Department Administrator (read only)
- Account Owner²

¹ The Bill-To contact of the EA contract is under this role.

² The Bill-To contact can't be added or changed in the Azure portal. It gets added to the EA enrollment based on the user who is set up as the Bill-To contact on agreement level. To change the Bill-To contact, a request needs to be made through a partner/software advisor to the Regional Operations Center (ROC).

The first enrollment administrator that is set up during the enrollment provisioning determines the authentication type of the Bill-to contact account. When the bill-to contact gets added to the Azure portal as a read-only administrator, they're given Microsoft account authentication.

For example, if the initial authentication type is set to Mixed, the EA is added as a Microsoft account and the Bill-to contact has read-only EA admin privileges. If the EA admin doesn’t approve Microsoft account authorization for an existing Bill-to contact, the EA admin can delete the user in question. Then they can ask the customer to add the user back as a read-only administrator with a Work or School account Only set at enrollment level in the Azure portal.

These roles are specific to managing Azure Enterprise Agreements and are in addition to the built-in roles Azure has to control access to resources. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

## Azure portal for Cost Management and Billing

The Azure portal hierarchy for Cost Management consists of:

- **Azure portal for Cost Management** - an online management portal that helps you manage costs for your Azure EA services. You can do the following tasks.

  - Create an Azure EA hierarchy with departments, accounts, and subscriptions.
  - Reconcile the costs of your consumed services, download usage reports, and view price lists.
  - Create API keys for your enrollment.

- **Departments** help you segment costs into logical groupings. Departments enable you to set a budget or quota at the department level.

- **Accounts** are organizational units in the Azure portal for Cost Management. You can use accounts to manage subscriptions and access reports.

- **Subscriptions** are the smallest unit in the Azure portal for Cost Management. They're containers for Azure services managed by the Account Owner role, also known as the Subscription's service administrator.

The following diagram illustrates simple Azure EA hierarchies.

:::image type="content" border="false" source="./media/understand-ea-roles/ea-hierarchies.png" alt-text="Diagram of simple Azure EA hierarchies.":::

## Enterprise user roles

The following administrative user roles are part of your enterprise enrollment:

- Enterprise administrator
- EA purchaser
- Department administrator
- Account owner
- Service administrator
- Notification contact

Use Cost Management in the [Azure portal](https://portal.azure.com) so you can manage Azure Enterprise Agreement roles.

Direct EA customers can complete all administrative tasks in the Azure portal. You can use the [Azure portal](https://portal.azure.com) to manage billing, costs, and Azure services.

User roles are associated with a user account. To validate user authenticity, each user must have a valid work, school, or Microsoft account. Ensure that each account is associated with an email address to actively monitor it. Enrollment notifications are sent to the email address.

> [!NOTE]
> The Account Owner role is often assigned to a service account that doesn't have an actively monitored email.

When setting up users, you can assign multiple accounts to the enterprise administrator role. An enrollment can have multiple account owners, for example, one per department. Also, you can assign both the enterprise administrator and account owner roles to a single account.

### Enterprise administrator

Users with this role have the highest level of access to the Enrollment. They can:

- Manage accounts and account owners.
- Manage other enterprise administrators.
- Manage department administrators.
- Manage notification contacts.
- Purchase Azure services, including reservations.
- View usage across all accounts.
- View unbilled charges across all accounts.
- Create new subscriptions under active enrollment accounts.
- View and manage all reservation orders and reservations that apply to the Enterprise Agreement.
  - Enterprise administrator (read-only) can view reservation orders and reservations. They can't manage them.

You can have multiple enterprise administrators in an enterprise enrollment. You can grant read-only access to enterprise administrators.

The EA administrator role automatically inherits all access and privilege of the department administrator role. So there’s no need to manually give an EA administrator the department administrator role.

The enterprise administrator role can be assigned to multiple accounts.

### EA purchaser

Users with this role have permissions to purchase Azure services, but aren't allowed to manage accounts. They can:

- Purchase Azure services, including reservations.
- View usage across all accounts.
- View unbilled charges across all accounts.
- View and manage all reservation orders and reservations that apply to the Enterprise Agreement.

The EA purchaser role is currently enabled only for SPN-based access. To learn how to assign the role to a service principal name, see [Assign roles to Azure Enterprise Agreement service principal names](assign-roles-azure-service-principals.md).

### Department administrator

Users with this role can:

- Create and manage departments.
- Create new account owners.
- View usage details for the departments that they manage.
- View costs, if they have the necessary permissions.

You can have multiple department administrators for each enterprise enrollment.

You can grant department administrators read-only access when you edit or create a new department administrator. Set the read-only option to **Yes**.

### Account owner

Users with this role can:

- Create and manage subscriptions.
- Manage service administrators.
- View usage for subscriptions.

Each account requires a unique work, school, or Microsoft account. For more information about Azure portal administrative roles, see [Understand Azure Enterprise Agreement administrative roles in Azure](understand-ea-roles.md).

There can be only one account owner per account. However, there can be multiple accounts in an EA enrollment. Each account has a unique account owner.

For different Microsoft Entra accounts, it can take more than 30 minutes for permission settings to take effect.

### Service administrator

The service administrator role has permissions to manage services in the Azure portal and assign users to the coadministrator role.

### Notification contact

The notification contact receives usage notifications related to the enrollment.

The following sections describe the limitations and capabilities of each role.

## User limit for admin roles

|Role| User limit|
|---|---|
|Enterprise Administrator|Unlimited|
|Enterprise Administrator (read only)|Unlimited|
| EA purchaser assigned to a service principal name (SPN) | Unlimited |
|Department Administrator|Unlimited|
|Department Administrator (read only)|Unlimited|
|Account Owner|1 per account³|

³ Each account requires a unique Microsoft account, or work or school account.

## Organization structure and permissions by role

|Tasks| Enterprise Administrator|Enterprise Administrator (read only)| EA Purchaser | Department Administrator|Department Administrator (read only)|Account Owner| Partner|
|---|---|---|---|---|---|---|---|
|View Enterprise Administrators|✔|✔| ✔|✘|✘|✘|✔|
|Add or remove Enterprise Administrators|✔|✘|✘|✘|✘|✘|✘|
|View Notification Contacts⁴ |✔|✔|✔|✘|✘|✘|✔|
|Add or remove Notification Contacts⁴ |✔|✘|✘|✘|✘|✘|✘|
|Create and manage Departments |✔|✘|✘|✘|✘|✘|✘|
|View Department Administrators|✔|✔|✔|✔|✔|✘|✔|
|Add or remove Department Administrators|✔|✘|✘|✔|✘|✘|✘|
|View Accounts in the enrollment |✔|✔|✔|✔⁵|✔⁵|✘|✔|
|Add Accounts to the enrollment and change Account Owner|✔|✘|✘|✔⁵|✘|✘|✘|
|Purchase reservations|✔|✘⁶|✔|✘|✘|✘|✘|
|Create and manage subscriptions and subscription permissions|✔|✘|✘|✘|✘|✔|✘|

- ⁴ Notification contacts are sent email communications about the Azure Enterprise Agreement.
- ⁵ Task is limited to accounts in your department.
- ⁶ A subscription owner or reservation purchaser can purchase and manage reservations and savings plans within the subscription, and only if permitted by the reservation purchase enabled flag. Enterprise administrators can purchase and manage reservations and savings plans across the billing account. Enterprise administrators (read-only) can view all purchased reservations and savings plans. The reservation purchase enabled flag doesn't affect the EA administrator roles. The Enterprise Admin (read-only) role holder isn't permitted to make purchases. However, if a user with that role also holds either a subscription owner or reservation purchaser permission, the user can purchase reservations and savings plans, regardless of the flag.

## Add a new enterprise administrator

Enterprise administrators have the most privileges when managing an Azure EA enrollment. The initial Azure EA admin was created when the EA agreement was set up. However, you can add or remove new admins at any time. Existing admins create new admins. For more information about adding more enterprise admins, see [Create another enterprise admin on Azure portal](direct-ea-administration.md#add-another-enterprise-administrator). For more information about billing profile roles and tasks, see [Billing profile roles and tasks](understand-mca-roles.md#billing-profile-roles-and-tasks).


## Update account owner state from pending to active

When new Account Owners (AO) are added to an Azure EA enrollment for the first time, their status appears as _pending_. When a new account owner receives the activation welcome email, they can sign in to activate their account.

> [!NOTE]
> If the Account Owner is a service account and doesn't have an email, use an In-Private session to sign in to the Azure portal and navigate to Cost Management to be prompted to accept the activation welcome email.

Once they activate their account, the account status is updated from _pending_ to _active_. The account owner needs to read the `Warning` message and select **Continue**. New users might get prompted to enter their first and last name to create a Commerce Account. If so, they must add the required information to continue and then the account is activated.

> [!NOTE]
> A subscription is associated with one and only one account. The warning message includes details that warn the Account Owner that accepting the offer will move the subscriptions associated with the Account to the new Enrollment.

## Add a department Admin

After an Azure EA admin creates a department, the Azure Enterprise administrator can add department administrators and associate each one to a department. A department administrator can create new accounts. New accounts are needed for Azure EA subscriptions to get created.

Direct EA admins can add department admins in the Azure portal. For more information, see [Create an Azure EA department admin](direct-ea-administration.md#add-a-department-administrator).

## Usage and costs access by role

|Tasks| Enterprise Administrator|Enterprise Administrator (read only)|EA Purchaser|Department Administrator|Department Administrator (read only) |Account Owner| Partner|
|---|---|---|---|---|---|---|---|
|View credit balance including Azure Prepayment|✔|✔|✔|✘|✘|✘|✔|
|View department spending quotas|✔|✔|✔|✘|✘|✘|✔|
|Set department spending quotas|✔|✘|✘|✘|✘|✘|✘|
|View organization's EA price sheet|✔|✔|✔|✘|✘|✘|✔|
|View usage and cost details|✔|✔|✔|✔⁷|✔⁷|✔⁸|✔|
|Manage resources in Azure portal|✘|✘|✘|✘|✘|✔|✘|

- ⁷ Requires that the Enterprise Administrator enables **DA view charges** policy in the Azure portal. The Department Administrator can then see cost details for the department.
- ⁸ Requires that the Enterprise Administrator enables **AO view charges** policy in the Azure portal. The Account Owner can then see cost details for the account.

## See pricing for different user roles

You might see different pricing in the Azure portal depending on your administrative role and how the Enterprise Administrator sets the view charges policies. Enabling Department Administrator and Account Owner Roles to see the charges can be restricted by restricting access to billing information.

To learn how to set these policies, see [Manage access to billing information for Azure](manage-billing-access.md).

The following table shows the relationship between:

- Enterprise Agreement admin roles
- View charges policy
- Azure role in the Azure portal
- Pricing that you see in the Azure portal

The Enterprise Administrator always sees usage details based on the organization's EA pricing. However, the Department Administrator and Account Owner see different pricing views based on the view charge policy and their Azure role. The Department Admin role listed in the following table refers to both Department Admin and Department Admin (read only) roles.

|Enterprise Agreement admin role|View charges policy for role|Azure role|Pricing view|
|---|---|---|---|
|Account Owner OR Department Admin|✔ Enabled|Owner|Organization's EA pricing|
|Account Owner OR Department Admin|✘ Disabled|Owner|No pricing|
|Account Owner OR Department Admin|✔ Enabled |none|No pricing|
|Account Owner OR Department Admin|✘ Disabled |none|No pricing|
|None|Not applicable |Owner|No pricing|

You set the Enterprise admin role and view charges policies in the Azure portal. The Azure role-based-access-control (RBAC) role can be updated with information at [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md).

## Next steps

- [Manage access to billing information for Azure](manage-billing-access.md)
- [Assign Azure roles using the Azure portal](../../role-based-access-control/role-assignments-portal.md)
- Assign [Azure built-in roles](../../role-based-access-control/built-in-roles.md)
