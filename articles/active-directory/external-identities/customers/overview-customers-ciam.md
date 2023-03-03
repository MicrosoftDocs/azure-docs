---
title: Overview - Customer identity access management (CIAM)
description: Learn about customer identity access management (CIAM), a solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: overview
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about identity solutions for customer-facing apps
---

# What is customer identity access management (CIAM)?

Azure Active Directory (Azure AD) offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in CIAM features, Azure AD can serve as the identity provider and access management service for your customer scenarios:

- **Azure AD customer (CIAM) tenant** – Create a tenant specifically for your customer-facing apps and services. Register your customer-facing apps in this tenant, and manage customer identities and access in the dedicated directory.
- **User flows** – Configure sign-up and sign-in user flows that are tailored to your needs. When a customer signs up for your app or service, an account with email + password is created for them in your customer tenant. You can determine the user attributes you want to collect during the sign-up process.
- **Company branding** – Customize the look and feel of your sign-up and sign-in experiences, including both the default experience and the experience for specific browser languages.

In the Azure portal, you can create an Azure AD customer (CIAM) tenant where you’ll manage customer identities and customer access to your application.

> [!IMPORTANT]
> Customer identity and access management (CIAM) is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
