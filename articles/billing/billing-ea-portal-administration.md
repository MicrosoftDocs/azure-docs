---
title: Azure EA portal administration
description: This article explains the common tasks that an administrator accomplishes in the Azure EA portal.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 09/09/2019
ms.topic: conceptual
ms.service: billing
manager: boalcsva
---

# Azure EA portal administration

This article explains the common tasks that an administrator accomplishes in the Azure EA portal (https://ea.azure.com). The Azure EA portal is an online management portal that helps customers manage the cost of their Azure EA services. For introductory information about the Azure EA portal, see the [Get started with the Azure EA portal](billing-ea-portal-get-started.md) article.

## Add a new enterprise administrator

Enterprise administrators have the most privileges when managing an Azure EA enrollment. The initial Azure EA admin was created when the EA agreement was set up. However, you can add or remove new admins at any time. New admins are only added by existing admins. For more information about adding  additional enterprise admins, see [To Add a department admin](billing-ea-portal-get-started.md#to-add-a-department-admin). For more information about billing profile roles and tasks, see [Billing profile roles and tasks](billing-understand-mca-roles.md#billing-profile-roles-and-tasks).

## Update user state from Pending to Active

When new Account Owners (AO) are added to an Azure EA enrollment for the first time, their status appears as _pending_. When a new account owner receives the activation welcome email, they can sign in to activate their account. When they activate their account, the account status is updated from _pending_ to _active_. New users might get prompted enter their first and last name to create a Commerce Account. If so, they must add the required information to proceed and then the account is activated.

## Add a department Admin

After an Azure EA admin creates a department, the Azure Enterprise administrator can add department administrators and associate each one to a department. A department administrator can create new accounts. New accounts are needed for Azure EA subscriptions to get created.

For more information about adding a department, see Create an Azure EA department.

## Enterprise user roles

The Azure EA portal helps you to administer your Azure EA costs and usage. There are three main roles in the Azure EA portal:

- EA admin
- Department administrator
- Account owner

Each role has a different level of access and authority.

For more information about user roles, see Enterprise user roles.

## Add an Azure EA account

The Azure EA account is an organizational unit in the Azure EA portal that's used to administer subscriptions and it's also used for reporting. To access and use Azure services, you need to create an account or have one created for you.

For more information about Azure accounts, see Add an account.

## Transfer an enterprise account to a new enrollment

Keep the following points in mind when you transfer an enterprise account to a new enrollment:

- Only the accounts specified in the request are transferred. If all accounts are chosen, then they are all transferred.
- The source enrollment retains its status as active or extended. You can continue using the enrollment until it expires.

### Effective transfer date

The effective transfer date can be a date on or after the start date of the enrollment that you want transfer to. The enrollment that you're transferring to is the _target enrollment_. After the account transfer, all usage information in the account before the effective transfer date stays in the enrollment you're transferring from. The enrollment that you're transferring from is the _source enrollment_.  The source enrollment usage is charged against monetary commitment or as overage. Usage that occurs after the effective transfer date is transferred to the new enrollment and charged accordingly.

You can backdate an account transfer as far back as the start date of the target enrollment. Or, as far as the source enrollment effective start date.

### Monetary commitment

Monetary commitment isn't transferrable between enrollments. Monetary commitment balances are tied contractually to the enrollment where it was ordered. Monetary commitment isn't transferred as part of the account or enrollment transfer process.

### Services affected

There's no downtime during the account transfer. It can be completed on the same day of your request if all required information is provided.

### Prerequisites

When you request an account transfer, provide the following information:


- Account name and account owner ID of account to transfer
- For the source enrollment, the enrollment number and account to transfer
- For the target enrollment, the enrollment number to transfer to
- For the account transfer effective date, it can be a date on or after the start date of the target enrollment

Other points to keep in mind before an account transfer:

- Approval from an EA Administrator is required for the target and source enrollment
  - In some cases, Microsoft might request additional approval from an EA administrator of the source enrollment
- If an account transfer doesn't meet your requirements, consider an enrollment transfer.
- The account transfer transfers all services, subscriptions, accounts, departments, and the entire enrollment structure, including all EA department administrators.
- The account transfer sets the source enrollment status to _Transferred_. The transferred account is available for historic usage reporting purposes only.
- You can't add roles or subscriptions to an enrollment with transferred status. The status prevents additional usage against the enrollment.
- Any remaining monetary commitment balance in the source agreement is lost, including future terms.


## Transfer an enterprise enrollment to a new enrollment

When you request to transfer an entire enterprise enrollment to an enrollment, the following actions occur:

- All Azure services, subscriptions, accounts, departments, and the entire enrollment structure, including all EA department administrators, are transferred.
- The enrollment status is set to _Transferred_. The transferred enrollment is available for historic usage reporting purposes only.
- You can't add roles or subscriptions to a transferred enrollment. Transferred status prevents additional usage against the enrollment.
- Any remaining monetary commitment balance in the agreement is lost, including future terms.

### Effective transfer date

The effective transfer day can be a date on or after the start date of the enrollment that you want transfer to the target enrollment.

The source enrollment usage is charged against monetary commitment or as overage. Usage that occurs after the effective transfer date is transferred to the new enrollment and charged accordingly.

### Effective transfer date in the past

You can backdate an account transfer as far back as the start date of the target enrollment. Or, as far as the effective start date of the source enrollment.

### Monetary commitment

Monetary commitment isn't transferrable between enrollments. Monetary commitment balances are tied contractually to the enrollment where it was ordered. Monetary commitment isn't transferred as part of the account or enrollment transfer process.

### Services affected

There's no downtime during the account transfer. It can be completed on the same day of your request if all requisite information is provided.

### Prerequisites

When you request an enrollment transfer, provide the following information:

- For the source enrollment, the enrollment number and account to transfer
- For the target enrollment, the enrollment number to transfer to
- For the enrollment transfer effective date, it can be a date on or after the start date of the target enrollment. The chosen date can't impact usage for any overage invoice already issued.

Other points to keep in mind before an enrollment transfer:

- Approval from an EA Administrator is required for the target and source enrollment
  - In some cases, Microsoft might request additional approval from an EA administrator of the source enrollment
- If an enrollment transfer doesn't meet your requirements, consider an account transfer.
- Only the accounts that you specify are transferred. You can request to transfer all of your accounts.
- The source enrollment retains its status as active/extended. You can continue using the enrollment until it expires.

## Change account owner

The Azure EA portal can transfer subscriptions from one account owner to another. For more information, see [Change account owner](billing-ea-portal-get-started.md#change-account-owner).

## Subscription transfer effects

When an Azure subscription is transferred to an account in the same Azure Active Directory tenant, then all users, groups, and service principals that had [role-based access control (RBAC)](../role-based-access-control/overview.md) to manage resources retain their access.

To view users with RBAC access to the subscription:

1. In the Azure portal, open **Subscriptions**.
2. Select the subscription you want to view, and then select **Access control (IAM)**.
3. Select **Role assignments**. The role assignments page lists all users who have RBAC access to the subscription.

If the subscription is transferred to an account in a different Azure AD tenant, then all users, groups, and service principals that had [RBAC](../role-based-access-control/overview.md) to manage resources _lose_ their access. Although RBAC access is not present, access to the subscription might be available through security mechanisms, including:

- Management certificates that grant the user admin rights to subscription resources. For more information, see [Create and Upload a Management Certificate for Azure](../cloud-services/cloud-services-certs-create.md).
- Access keys for services like Storage. For more information, see [Azure storage account overview](../storage/common/storage-account-overview.md).
- Remote Access credentials for services like Azure Virtual Machines.

If the recipient needs to restrict access to their Azure resources, they should consider updating any secrets associated with the service. Most resources are be updated by using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. On the Hub menu, select **All resources**.
3. Select the resource.
4. On the resource page, click **Settings** to view and update existing secrets.



## Close an Azure enterprise enrollment

If you want to close your Azure EA enrollment, you can:

- Cancel all your subscriptions associated to your Azure EA on Azure portal.
- Contact your customer software advisor or partner or and ask them to close your Azure Enterprise Agreement.

## Update notification settings

Enterprise Administrators are automatically enrolled to receive usage notifications associated to their enrollment. Each Enterprise Administrator can change the interval of the individual notifications or can turn them off completely.

Notification contacts are shown in the Azure EA portal in the **Notification Contact** section. Managing your notification contacts makes sure that the right people in your organization get Azure EA notifications.

To View current notifications settings:

1. In the Azure EA portal, navigate to **Manage** > **Notification Contact**.
2. Email Address – The email address associated with the Enterprise Administrator's Microsoft Account, Work, or School Account that receives the notifications.
3. Unbilled Balance Notification Frequency – The frequency that notifications are set to send to each individual Enterprise Administrator.

To add a contact:

1. Click **+Add Contact**.
2. Enter the email address and then confirm it.
3. Click **Save**.

The new notification contact is displayed in the **Notification Contact** section. To change the notification frequency, select the notification contact and click the pencil symbol to the right of the selected row. Set the frequency to **daily**, **weekly**, **monthly**, or **none**.

You can suppress _approaching coverage period end date_ and _disable and de-provision date approaching_ lifecycle notifications. Disabling lifecycle notifications suppresses notifications about the coverage period and agreement end date.

## Manage partner notifications

Partner Administrators can manage the frequency that they receive usage notifications for their enrollments. They automatically receive weekly notifications of their unbilled balance. They can change the frequency of individual notifications to monthly, weekly, daily, or turn them off completely.

If a notification isn't received by a user, verify that the user's notification settings are correct with the following steps.

1. Sign in to the Azure EA portal as a Partner Administrator.
2. Click **Manage** and then click the **Partner** tab.
3. View the list of administrators under the **Administrator** section.
4. To edit notification preferences, hover over the appropriate administrator and click the pencil symbol.
5. Up the notification frequency and lifecycle notifications as needed.
6. Add a contact, if needed and click **Add**.
7. Click **Save**.

![Example showing Add Contact to add a ](./media/billing-ea-portal-administration/create-ea-manage-partner-notification.png)

## Azure Sponsorship offer
The Azure Sponsorship offer is a limited sponsored Microsoft Azure account. It is available by e-mail invitation only to limited customers selected by Microsoft. If you're entitled to the Microsoft Azure Sponsorship offer, you'll receive an e-mail invitation to your account ID.
For more information, see:

- Sponsorship offer overview - https://azure.microsoft.com/en-us/offers/ms-azr-0143p/
- Sponsorship balance portal - https://www.microsoftazuresponsorships.com/balance  
- Sponsorship external FAQ - https://azuresponsorships-staging.azurewebsites.net/faq
- Support request for Sponsorship Activation -  http://aka.ms/azrsponsorship

## Next steps
- Read about how [virtual machine reservations](billing-ea-portal-vm-reservations.md) can help save you money.
- If you need help with troubleshooting Azure EA portal issues, see [Troubleshoot Azure EA portal access](billing-ea-portal-troubleshoot.md).
