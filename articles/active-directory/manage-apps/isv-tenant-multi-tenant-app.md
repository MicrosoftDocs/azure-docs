---
title: Create an Azure Ttnant for a multi-tenant application
description: Guidance for independent software vendors on integrating with Azure Active Directory
services: active-directory
author: baselden
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: how-to
ms.workload: identity
ms.date: 05/22/2019
ms.author: baselden
ms.reviewer: barbaraselden
ms.collection: M365-identity-device-management
#customer intent: As an ISV developer, I need to learn about single-sign on (SSO) so I can create a multi-tenant SaaS app
---

# Create an Azure Tenant for a Multi-Tenant Application  

To provide access to your multi-tenant application you must create an Azure Active Directory tenant to register the application and enable the federation of your customer’s identities. See [Choosing the right federation protocol for your multi-tenant application](\manage-apps\isv-choose-multi-tenant-federation.md). This tenant will allow you to test your application and the federation in an environment that is similar to your customers Azure AD environments.

## Costs of hosting a multi-tenant application

Azure Active Directory is available in three SKUs, Free, Basic, and Premium. [See the detailed feature comparison](https://azure.microsoft.com/en-us/pricing/details/active-directory/)].

You can create your Azure subscription and Azure active directory for free, and use basic features.

## Create your tenant

1. Create your Tenant. See [Set up a dev environment](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-create-new-tenant).

2. Enable and test single sign-on access to your application,

   a. **For OIDC or Oath applications**, [Register your application](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) as a multi-tenant application. ‎Select the Accounts in any organizational directory and personal Microsoft accounts option in Supported Account types

   b. **For SAML- and WS-Fed-based applications**, you [Configure SAML-based Single sign-on](https://docs.microsoft.com/en-us/azure/active-directory/manage-apps/configure-single-sign-on-non-gallery-applications) applications using a generic SAML template in Azure AD.

You can also [convert a single-tenant application to multi-tenant](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant) if necessary.

## Next Steps

[Integrate SSO in your application](active-directory\manage-apps\isv-sso-content.md)
