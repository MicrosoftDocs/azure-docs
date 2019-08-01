---
title: Create and publish single sign-on documentation for your application
description: Guidance for independent software vendors on integrating with Azure Active Directory
services: active-directory
author: barbaraselden
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/22/2019
ms.author: baselden
ms.reviewer: jeeds
ms.collection: M365-identity-device-management
#customer intent: As an ISV developer, I need to learn about single-sign on (SSO) so I can create a multi-tenant SaaS app
---

# Create and publish single sign-on documentation for your application   

## Documentation on your site

Ease of adoption is a significant factor in enterprise software decisions. Clear easy-to-follow documentation supports your customers in their adoption journey and reduces support costs. Working with thousands of software vendors, Microsoft has seen what works.

We recommend that your documentation on your site at a minimum include the following items.

* Introduction to your SSO functionality

  * Protocols supported

  * Version and SKU

  * Supported Identity Providers list with documentation links

* Licensing information for your application

* Role-based access control for configuring SSO

* SSO Configuration Steps

  * UI configuration elements for SAML with expected values from the provider

  * Service provider information to be passed to identity providers

* If OIDC/OAuth

  * List of permissions required for consent with business justifications

* Testing steps for pilot users

* Troubleshooting information, including error codes and messages

* Support mechanisms for customers

## Documentation on the Microsoft Site

When you list your application with the Azure Active Directory Application Gallery, which also publishes your application in the Azure Marketplace, Microsoft will generate documentation for our mutual customers explaining the step-by-step process. You can see an example [here](https://aka.ms/appstutorial). This documentation is created based on your submission to the gallery, and you can easily update it if you make changes to your application using your GitHub account.

## Next Steps

[List your application in the Azure AD Application Gallery](https://microsoft.sharepoint.com/teams/apponboarding/Apps/SitePages/Default.aspx)