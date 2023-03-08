---
title: Custom branding for CIAM authentication
description: Learn how to customize your customers' sign-in and sign-up experiences.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 03/08/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to know how can I customize my  customers' sign-in experiences, including company branding and languages customizations.
---
<!--   The content is copied from https://github.com/csmulligan/entra-previews/blob/PP3/docs/PP3_Customize%20CIAM%20neutral%20branding.md. For now the text  is used as a placeholder in the release branch, until further notice. -->

# Customize the neutral default authentication experience for the CIAM tenant

After creating a new customer tenant, you can customize the end-user experience. Create a custom look and feel for users signing in to your web-based apps by configuring **Company branding** settings for your tenant. 

## Comparing the default sign-in experiences between the CIAM tenant and the Azure AD tenant.

The default sign-in experience is the global look and feel that applies across all sign-ins to your tenant. The default branding experiences between the CIAM tenant and the default Azure AD tenant are distinct.

Your Azure AD tenant supports Microsoft look and feel as a default state for authentication experience. You can [customize the default Microsoft sign-in experience](/azure/active-directory/fundamentals/how-to-customize-branding) with a custom background image or color, favicon, layout, header, and footer. You can also upload a custom CSS. If the custom company branding fails to load for any reason, the sign-in page will revert to the default Microsoft branding.

Microsoft provides a neutral branding as the default for the CIAM tenant, which can be customized to meet the specific needs of your company. The default branding for the CIAM tenant is neutral and doesn't include any existing Microsoft branding. If the custom company branding fails to load for any reason, the sign-in page will revert to this neutral branding. It's also possible to add each custom branding property to the custom sign-in page individually.

## Next steps
- [Customize the user experience for your customers](how-to-customize-branding-customers)