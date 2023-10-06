---
title: Customize the company branding
description: Learn how to customize the sign-in and sign-up experiences for your customers.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date:  04/21/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As an it admin, I want to know how can I customize my customers' sign-in experiences, including company branding and languages customizations.
---

# Customize the neutral default authentication experience for the customer tenant (preview)

After creating a new customer tenant, you can customize the appearance of your web-based applications for customers who sign in or sign up, to personalize their end-user experience. In Microsoft Entra ID, the default Microsoft branding will appear in your sign-in pages before you customize any settings. This branding represents the global look and feel that applies across all sign-ins to your tenant. 

Your Microsoft Entra ID for customers tenant supports Microsoft look and feel as a default state for authentication experience. You can [customize the default Microsoft sign-in experience](/azure/active-directory/fundamentals/how-to-customize-branding) with a custom background image or color, favicon, layout, header, and footer. You can also upload a custom CSS. If the custom company branding fails to load for any reason, the sign-in page will revert to the default Microsoft branding.

The customer tenant is unique in that it doesn't have any default branding, but instead has a neutral one. It is neutral, because it doesn't contain any existing Microsoft branding. This neutral default branding can be customized to meet the specific needs of your company. If the custom company branding fails to load for any reason, the sign-in page will revert to this neutral branding. It's also possible to add each custom branding property to the custom sign-in page individually. 

The following list and image outline the elements of the default Microsoft sign-in experience in a Microsoft Entra tenant: 

1. Microsoft background image and color.
2. Microsoft favicon.
3. Microsoft banner logo.
4. Footer as a page layout element.
5. Microsoft footer hyperlinks, for example,  Privacy & cookies, Terms of use and troubleshooting details also known as ellipsis in the right bottom corner of the screen.
6. Microsoft overlay.

   :::image type="content" source="media/how-to-customize-branding-customers/microsoft-branding.png" alt-text="Screenshot of the Microsoft Entra ID default Microsoft branding." lightbox="media/how-to-customize-branding-customers/microsoft-branding.png":::

The following image displays the neutral default branding of the customer tenant:
   :::image type="content" source="media/how-to-customize-branding-customers/ciam-neutral-branding.png" alt-text="Screenshot of the CIAM neutral branding." lightbox="media/how-to-customize-branding-customers/ciam-neutral-branding.png":::

For more information, see [Customize the neutral branding in your customer tenant](how-to-customize-branding-customers.md).

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

## Text customization

You might have different requirements for the information you want to collect during sign-up and sign-in. The customer tenant comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. In the customer tenant, we have two options to add custom text to the sign-up and sign-in experience. The function is available under each user flow during language customization and also under **Company Branding**. Although we have two ways to customize strings, both ways modify the same JSON file. The most recent change made either via **User flows** or via **Company Branding** will always override the previous one.

## Language customization

You can create a personalized sign-in experience for users who sign in using a specific browser language by customizing the branding elements. If you don't make any changes to the elements, the default elements will be displayed.
In the customer tenant you can add a custom language to the sign-in experience under **Company Branding** or to a specific user flow under **User flows**. The language customization is available for a list of languages in the customer tenant. For more information, see [Customize the language of the authentication experience](how-to-customize-languages-customers.md).

## Next steps
- [Customize the user experience for your customers](how-to-customize-branding-customers.md)
- [Customize the language of the authentication experience](how-to-customize-languages-customers.md)
