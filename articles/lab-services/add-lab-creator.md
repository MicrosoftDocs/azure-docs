---
title: Add a user as a lab creator in Azure Lab Services
description: This article shows how to add a user to the Lab Creator role for a lab plan in Azure Lab Services. The lab creators can create labs within this lab plan. 
ms.topic: how-to
ms.date: 11/19/2021
ms.custom: subject-rbac-steps
---

# Add lab creators to a lab plan in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article shows you how to add users as lab creators to a lab account or lab plan in Azure Lab Services. These users then can create labs and manage those labs.

## Prerequisites

- To add lab creators to a lab plan, your Azure account needs to have the [Owner](./concept-lab-services-role-based-access-control.md#owner-role) Azure RBAC role assigned on the resource group. Learn more about the [Azure Lab Services built-in roles](./reliability-in-azure-lab-services.md).

## Add Azure AD user account to Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

If you're using a lab account, assign the Lab Creator role on the lab account. 

## Add a guest user as a lab creator

You might need to add an external user as a lab creator. If that is the case, you'll need to add them as a guest account on the Azure AD attached to the subscription. The following types of email accounts might be used:

- A Microsoft email account, such as `@outlook.com`, `@hotmail.com`, `@msn.com`, or `@live.com`.
- A non-Microsoft email account, such as one provided by Yahoo or Google. However, these types of accounts must be linked with a Microsoft account.
- A GitHub account. This account must be linked with a Microsoft account.

For instructions to add someone as a guest account in Azure AD, see [Quickstart: Add guest users in the Azure portal - Azure AD](../active-directory/external-identities/b2b-quickstart-add-guest-users-portal.md).  If using an email account that's provided by your university’s Azure AD, you don't have to add them as a guest account.

Once the user has an Azure AD account, [add the Azure AD user account to Lab Creator role](#add-azure-ad-user-account-to-lab-creator-role).

> [!IMPORTANT]
> Only lab creators need an account in Azure AD connected to the subscription.  For account requirements for students see [Tutorial: Access a lab in Azure Lab Services](tutorial-connect-lab-virtual-machine.md).

### Using a non-Microsoft email account

Educators can use non-Microsoft email accounts to register and sign in to a lab.  However, the sign-in to the Lab Services portal requires that educators first create a Microsoft account that's linked to their non-Microsoft email address.

Many educators might already have a Microsoft account linked to their non-Microsoft email addresses. For example, educators already have a Microsoft account if they have used their email address with Microsoft’s other products or services, such as Office, Skype, OneDrive, or Windows.  

When educators sign in to the Lab Services portal, they are prompted for their email address and password. If the educator attempts to sign in with a non-Microsoft account that does not have a Microsoft account linked, the educator will receive the following error message:

![Error message](./media/how-to-configure-student-usage/cant-find-account.png)

To sign up for a Microsoft account, educators should go to [https://signup.live.com](https://signup.live.com).  

### Using a GitHub Account

Educators can also use an existing GitHub account to register and sign in to a  lab. If the educator already has a Microsoft account linked to their GitHub account, then they can sign in and provide their password as shown in the previous section. If they have not yet linked their GitHub account to a Microsoft account, they should select **Sign-in options**:

![Sign-in options link](./media/how-to-configure-student-usage/signin-options.png)

On the **Sign-in options** page, select **Sign in with GitHub**.

![Sign in with GitHub link](./media/how-to-configure-student-usage/signin-github.png)

Finally, they are prompted to create a Microsoft account that's linked to their GitHub account. It happens automatically when the educator selects **Next**.  The educator is then immediately signed in and connected to the lab.

## Next steps

See the following articles:

- [As a lab owner, create and manage labs](how-to-manage-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-configure-student-usage.md)
- [As a lab user, access labs](how-to-use-lab.md)
