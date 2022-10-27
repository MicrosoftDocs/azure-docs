---
title: Onboard to the Azure Orbital Preview
description: Azure Orbital is in preview, to get access an Azure subscription must be onboarded.
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: public-preview
ms.date: 11/16/2021
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Onboard to the Azure Orbital Preview

Azure Orbital is now on preview, to get access an Azure subscription must be onboarded. Without this onboarding process, the Azure Orbital resources won't be available in the portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- A "Preview Access Granted" e-mail from Azure Orbital.

## Submit the Azure Orbital Preview Onboarding Form

1. Access the [Azure Orbital Preview Onboarding Form](https://forms.office.com/r/fk32xNmDyx)
2. Provide the following information:

   - Company name
   - Contact info: name and email
   - Azure Subscription ID

3. Submit the form
4. Await a 'Preview Access Granted' email from Azure Orbital (typically within 72 hours)

## Sign in to Azure

Sign in to the [Azure portal - Orbital Preview](https://aka.ms/orbital/portal).

## Register the Resource Provider

1. In the search box, enter **Subscriptions**. Select **Subscriptions** in the search results
2. In the **Subscriptions** page, select the subscription for access to the Azure Orbital Preview
3. Select **Resource providers** from the left menu bar in the subscription's overview page
4. In the **Filter by name...** search box, enter `Microsoft.Orbital`
5. Select the `Microsoft.Orbital` provider and select **Register** from the top bar of the Resource providers page.

   :::image type="content" source="media/orbital-eos-rp-register.png" alt-text="Register Resource Provider" lightbox="media/orbital-eos-rp-register.png":::

## Next steps

- [Quickstart: Register Spacecraft](register-spacecraft.md)
- [Quickstart: Configure a Contact Profile](contact-profile.md)