---
title: How to create a free Azure Active Directory developer tenant
description: This article shows you how to create a developer account
services: active-directory
author: barclayn
manager: davba
ms.service: identity
ms.subservice: verifiable-credentials
ms.topic: how-to
ms.date: 04/01/2021
ms.author: barclayn
# Customer intent: As a developer I am looking to create a developer Azure Active Directory account so I can participate in the Preview with a P2 license. 
---

# How to create a free Azure Active Directory developer tenant

> [!IMPORTANT]
> Azure Active Directory Verifiable Credentials is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

> [!NOTE]
> While in Preview a P2 license is required. 

There are two easy ways to create a free Azure Active Directory with a P2 trial license so you can install the Verifiable Credential Issuer service and you can test creating and validating Verifiable Credentials:

- [Join](https://aka.ms/o365devprogram) the free Microsoft 365 Developer Program and get a free sandbox, tools, and other resources like an Azure Active Directory with P2 licenses. Configured Users, Groups, mailboxes etc.
- Create a new [tenant](https://docs.microsoft.com/azure/active-directory/develop/quickstart-create-new-tenant) and activate a [free trial](https://azure.microsoft.com/trial/get-started-active-directory/) of Azure AD Premium P1 or P2 in your new tenant.

If you decide to sign up for the free Microsoft 365 developer program, you need to follow a few easy steps:

1. Click on the **Join Now** button on the screen.

2. Sign in with a new Microsoft Account or use an existing (work) account you already have.

3. On the sign-up page select your region, enter a company name and accept the terms and conditions of the program before you click **Next**.

4. Click on **set up subscription**. Specify the region where you want to create your new tenant, create a username, domain, and enter a password. This will create a new tenant and the first administrator of the tenant.

5. Enter the security information needed to protect the administrator account of your new tenant. This will setup MFA authentication for the account.


At this point, you have created a tenant with 25 E5 user licenses. The E5 licenses include Azure AD P2 licenses. Optionally, you can add sample data packs with users, groups, mail, and SharePoint to help you test in your development environment. For the Verifiable Credential Issuing service, they are not required.

For your convenience, you could add your own work account as [guest](/azure/active-directory/external-identities/b2b-quickstart-add-guest-users-portal) in the newly created tenant and use that account to administer the tenant. If you want the guest account to be able to manage the Verifiable Credential Service you need to assign the role 'Global Administrator' to that user.

## Next steps

Now that you have a developer account you can try our [first tutorial](get-started-verifiable-credentials.md) to learn more about verifiable credentials.
