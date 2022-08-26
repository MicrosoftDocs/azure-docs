---
title: Configure Azure Active Directory B2C with WhoIAM Rampart
titleSuffix: Azure AD B2C
description: Learn how to integrate Azure AD B2C authentication with WhoIAM Rampart
services: active-directory-b2c
author: gargi-sinha
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 06/20/2022
ms.author: gasinh
ms.reviewer: kengaderdus
ms.subservice: B2C
---

# Configure WhoIAM Rampart with Azure Active Directory B2C

In this sample tutorial, you'll learn how to integrate Azure Active Directory B2C (Azure AD B2C) authentication with Rampart by WhoIAM. Rampart provides features for a fully integrated helpdesk and invitation-gated user registration experience. It allows support specialists to perform tasks like resetting passwords and multi-factor authentication without using Azure. It also enables apps and role-based access control (RBAC) for end-users of Azure AD B2C.


## Prerequisites

To get started, you'll need:

- An Azure AD subscription. If you don't have one, get a [free account](https://azure.microsoft.com/free/)

- An [Azure AD B2C tenant](tutorial-create-tenant.md) linked to your Azure subscription.

- An Azure DevOps Server instance

- A [SendGrid account](https://sendgrid.com/)

- A WhoIAM [trial account](https://www.whoiam.ai/contact-us/)

## Scenario description

WhoIAM Rampart is built entirely in Azure and runs in your Azure environment. The following components comprise the Rampart solution with Azure AD B2C:

- **An Azure AD tenant**: Your Azure AD B2C tenant stores your users and manages who has access (and at what scope) to Rampart itself.

- **Custom B2C policies**: To integrate with Rampart.

- **A resource group**: It hosts Rampart functionality.

:::image type="content" source="media/partner-whoiam/whoiam-rampart-integration-scenario.png" alt-text="Diagram showing the WhoIAM Rampart integration scenario for Azure AD B2C." loc-scope="azure-active-directory-b2c" border="false" lightbox="media/partner-whoiam/whoiam-rampart-integration-scenario.png":::

## Step 1 - Onboard with Rampart

Contact [WhoIAM](https://www.whoiam.ai/contact-us/) to start the onboarding process. Automated templates will deploy all necessary Azure resources, and they'll configure your DevOps instance with the required code and configuration according to your needs.

## Step 2 - Configure and integrate Rampart with Azure AD B2C

The tight integration of this solution with Azure AD B2C requires custom policies. WhoIAM provides these policies and assists with integrating them with your applications or existing policies, or both.

Follow the steps mentioned in [Authorization policy execution](https://docs.gatekeeper.whoiamdemos.com/#/setup-guide?id=authorization-policy-execution) for details on the custom policies provided by WhoIAM. 

## Step 3 - Test the solution

The image shows an example of how WhoIAM Rampart displays a list of app registrations in your Azure AD B2C tenant. WhoIAM validates the implementation by testing all features and health check status endpoints.

:::image type="content" source="media/partner-whoiam/whoiam-rampart-app-registration.png" alt-text="Screenshot showing the WhoIAM Rampart list of user-created applications in the Azure AD B2C tenant." loc-scope="azure-active-directory-b2c":::

The applications screen should display a list of all user-created applications in your Azure AD B2C tenant.

Likewise, the user's screen should display a list of all users in your Azure AD B2C directory and user management functions such as invitations, approvals, and RBAC management.

:::image type="content" source="media/partner-whoiam/whoiam-rampart-user-list.png" alt-text="Screenshot showing the WhoIAM Rampart user list in the Azure AD B2C tenant." loc-scope="azure-active-directory-b2c":::

## Next steps

For more information, review the following articles:

- [WhoIAM Rampart documentation](https://docs.gatekeeper.whoiamdemos.com/#/setup-guide?id=authorization-policy-execution)

- [Custom policies in Azure AD B2C overview](custom-policy-overview.md)


- [Get started with custom policies in Azure AD B2C](tutorial-create-user-flows.md?pivots=b2c-custom-policy)

