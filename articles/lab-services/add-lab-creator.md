---
title: Assign a lab creator
titleSuffix: Azure Lab Services
description: This article shows how to add a user to the Lab Creator role for a lab plan in Azure Lab Services. Lab creators can create labs within the lab plan.
services: lab-services
ms.service: lab-services
author: ntrogh
ms.author: nicktrog
ms.topic: how-to
ms.date: 07/04/2023
ms.custom: subject-rbac-steps
---

# Add lab creators to a lab plan in Azure Lab Services

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

This article describes how to add users as lab creators to a lab account or lab plan in Azure Lab Services. Users with the Lab Creator role can create labs and manage labs for the lab account or lab plan.

## Prerequisites

- To add lab creators to a lab plan, your Azure account needs to have the [Owner](./concept-lab-services-role-based-access-control.md#owner-role) Azure RBAC role assigned on the resource group. Learn more about the [Azure Lab Services built-in roles](./concept-lab-services-role-based-access-control.md).

<a name='add-azure-ad-user-account-to-lab-creator-role'></a>

## Add Microsoft Entra user account to Lab Creator role

[!INCLUDE [Add Lab Creator role](./includes/lab-services-add-lab-creator.md)]

If you're using a lab account, assign the Lab Creator role on the lab account. 

## Add a guest user as a lab creator

If you need to add an external user as a lab creator, you need to add the external user as a guest account in the Microsoft Entra ID that is linked to your Azure subscription.

The following types of email accounts can be used:

- A Microsoft-domain email account, such as *outlook.com*, *hotmail.com*, *msn.com*, or *live.com*.
- A non-Microsoft email account, such as one provided by Yahoo! or Google. The user needs to [link the account with a Microsoft account](./how-to-manage-labs.md#use-a-non-organizational-account-as-a-lab-creator).
- A GitHub account. The user needs to [link the account with a Microsoft account](./how-to-manage-labs.md#use-a-non-organizational-account-as-a-lab-creator).

To add a guest user as a lab creator:

1. Follow these steps to [add guest users to Microsoft Entra ID](/azure/active-directory/external-identities/b2b-quickstart-add-guest-users-portal).

    If using an email account that's provided by your university’s Microsoft Entra ID, you don't have to add them as a guest account.

1. Follow these steps to [assign the Lab Creator role to the Microsoft Entra user account](#add-azure-ad-user-account-to-lab-creator-role).

> [!IMPORTANT]
> Only lab creators need an account in Microsoft Entra connected to the Azure subscription. For account requirements for lab users see [Access a lab in Azure Lab Services](./how-to-access-lab-virtual-machine.md).

## Next steps

See the following articles:

- [As a lab owner, create and manage labs](how-to-manage-labs.md)
- [As a lab owner, set up and publish templates](how-to-create-manage-template.md)
- [As a lab owner, configure and control usage of a lab](how-to-manage-lab-users.md)
- [As a lab user, access labs](how-to-use-lab.md)
