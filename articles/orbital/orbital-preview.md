---
title: Onboard to the Azure Orbital Preview
description: Azure Orbital is a cloud-based Ground Station as a Service that allows you to streamline your operations by ingesting space data directly into Azure.
author: wamota
ms.service: orbital
ms.topic: quickstart
ms.custom: public-preview
ms.date: 11/16/2021
ms.author: wamota
# Customer intent: As a satellite operator, I want to ingest data from my satellite into Azure.
---

# Onboard to the Azure Orbital Preview

Azure Orbital is going into preview and to get access the Azure subscription must be onboarded. Without this onboarding process the Azure Orbital resources won't be found in the Azure portal.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Sign in to Azure

Sign in to the [Azure portal](https://portal.azure.com).

## Register the Resource Provider

1. In the search box, enter **Subscriptions**. Select **Subscriptions** in the search results
2. In the **Subscriptions** page, select the subscription for access to the Azure Orbital Preview
3. Select **Resource providers** from the left menu bar in the subscription's overview page
4. In the **Filter by name...** search box, enter `Microsoft.Orbital`
5. Select the `Microsoft.Orbital` provider and select **Register** from the top bar of the Resource providers page.

## Submit the Azure Orbital Preview Onboarding Form

1. Access the Azure Orbital Preview Onboarding Form
2. Provide the following information:

    1. Company name
    2. Contact info: name and email*
    3. Azure Subscription ID*

3. Submit the form
4. Await a 'Preview Access Granted' email from Azure Orbital (typically within 72 hours)

## Next steps

- [Quickstart: Register Spacecraft](register-spacecraft.md)
- [Quickstart: Configure a Contact Profile](contact-profile.md)