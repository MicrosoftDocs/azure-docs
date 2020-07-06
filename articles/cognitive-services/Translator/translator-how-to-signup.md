---
title: Get started - Translator
titleSuffix: Azure Cognitive Services
description: This article will show you how to sign up for the Azure Cognitive Services Translator and get a subscription key.
services: cognitive-services
author: swmachan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: swmachan
---
# How to sign up for Translator

## Sign in to the Azure portal

- Don't have an account? You can create a [free account](https://azure.microsoft.com/free/) to experiment at no charge.
- Already have an account? [Sign in](https://ms.portal.azure.com/)

## Create a subscription for Translator

After you sign in to the portal, you can create a subscription to Translator as follows:

1. Select **+ Create a resource**.
1. In the **Search the Marketplace** search box, enter **Translator** and then select it from the results.
1. Select **Create** to define details for the subscription.
1. From the **Pricing tier** list, select the pricing tier that best fits your needs.
    1. Each subscription has a free tier. The free tier has the same features and functionalities as the paid plans and doesn't expire.
    1. You can have only one free subscription for your account.
1. Select **Create** to finish creating the subscription.

## Authentication key

When you sign up for Translator, you get a personalized access key unique to your subscription. This key is required on each call to the Translator.

1. Retrieve your authentication key by first selecting the appropriate subscription.
1. Select **Keys** in the **Resource Management** section of your subscription's details.
1. Copy either of the keys listed for your subscription.

## Learn, test, and get support

- [Code examples on GitHub](https://github.com/MicrosoftTranslator)
- [Microsoft Translator Support Forum](https://www.aka.ms/TranslatorForum)

Microsoft Translator will generally let your first couple of requests pass before it has verified the subscription account status. If the first few Translator requests succeed then the calls fail, the error response will indicate the problem. Please log the API response so you can see the reason.

## Pricing options

- [Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator-text-api/)

## Customization

Use Custom Translator to customize your translations and create a translation system tuned to your own terminology and style, starting from generic Microsoft Translator neural machine translation systems. [Learn more](customization.md)

## Additional resources

- [Get Started with Azure (3-minute video)](https://azure.microsoft.com/get-started/?b=16.24)
- [How to Pay with an Invoice](https://azure.microsoft.com/pricing/invoicing/)
