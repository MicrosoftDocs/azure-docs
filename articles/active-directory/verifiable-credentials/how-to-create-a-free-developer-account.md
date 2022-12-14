---
title: Create a free Azure Active Directory developer tenant
description: This article shows you how to create a developer account.
services: active-directory
author: barclayn
manager: amycolannino
ms.service: decentralized-identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 04/01/2021
ms.author: barclayn
# Customer intent: As a developer, I want to learn how to create a developer Azure Active Directory account so I can participate in the preview with a P2 license. 
---

# Microsoft Entra Verified ID developer information

[!INCLUDE [Verifiable Credentials announcement](../../../includes/verifiable-credentials-brand.md)]

> [!NOTE]
> The requirement of an Azure Active Directory (Azure AD) P2 license was removed in early May 2001. The Azure AD Free tier is now supported. 

## Create an Azure AD tenant for development

 With a free Azure Active Directory account, you can onboard the verifiable credential service and test issuing and verifying verifiable credentials. Create a free account in either of two ways:

- [Join the free Microsoft 365 Developer Program](https://aka.ms/o365devprogram), and get a free sandbox, tools, and other resources (for example, an Azure AD account with P2 licenses, configured users, groups, and mailboxes).
- [Create a new tenant](../develop/quickstart-create-new-tenant.md) and [activate a free trial of Azure AD Premium P1 or P2](https://azure.microsoft.com/trial/get-started-active-directory/) in your new tenant.

If you decide to sign up for the free Microsoft 365 developer program, you need to follow a few easy steps:

1. On the [Join the free Microsoft 365 Developer Program](https://aka.ms/o365devprogram) page, select **Join now**.

1. Sign in with a new Microsoft account or use an existing (work) account.

1. On the sign-up page, select your region, enter a company name, and accept the terms and conditions of the program.

1. Select **Next**.

1. Select **Set up subscription**. Specify the region where you want to create your new tenant, create a username, domain, and enter a password. This creates a new tenant and the first administrator of the tenant.

1. Enter the security information needed to protect the administrator account of your new tenant. This sets up multifactor authentication for the account.


At this point, you've created a tenant with 25 E5 user licenses. The E5 licenses include Azure AD P2 licenses. Optionally, you can add sample data packs with users, groups, mail, and SharePoint to help you test in your development environment. For the verifiable credential issuing service, they're not required.

For your convenience, you could add your own work account as [guest](../external-identities/b2b-quickstart-add-guest-users-portal.md) in the newly created tenant and use that account to administer the tenant. If you want the guest account to be able to manage the verifiable credential service, you need to assign the *Global Administrator* role to that user.

## Next steps

Now that you have a developer account, try our [first tutorial](get-started-verifiable-credentials.md) to learn more about verifiable credentials.