---
title: Create Datadog - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of Datadog.
ms.service: partner-services
ms.topic: quickstart
ms.date: 02/12/2021
author: tfitzmac
ms.author: tomfitz
---

# QuickStart: Get started with Datadog

In this quickstart, you'll use the Azure portal to create an instance of Datadog.

## Pre-requisites 

### Subscription owner

To set up the Azure Datadog integration, you must have **Owner** access on the Azure subscription. Ensure you have the appropriate access before starting the setup.

### Register the Microsoft.Datadog resource provider in your Azure subscription

To start, register the Microsoft.Datadog resource provider in the specific Azure subscription.

Follow the steps outlined here, to register the `Microsoft.Datadog` resource provider in your subscription

### Setup Datadog Single Sign on App

To use the Security Assertion Markup Language (SAML) Single Sign-On (SSO) feature within the Datadog Monitor resource, you must set up an Enterprise App. Use the following steps:

1. Go to [Azure portal](https://portal.azure.com). Select **Azure Active Directory**.
1. In the left pane, select **Enterprise applications**.
1. Select **New Application**.
1. In **Add from the gallery**, search for *Datadog*. Select the search result then select **Add**. 

   :::image type="content" source="media/create/datadogaadappgallery.png" alt-text="Datadog application in the AAD enterprise gallery." border="true":::
 
1. Once the app is created, go to properties from the side panel, and set the **User assignment required?** to **No**, then select **Save**.

   :::image type="content" source="media/create/userassignmentrequired.png" alt-text="Set properties for the Datadog application" border="true":::

1. Go to **Single sign-on** from the side panel. Then select **SAML**.

   :::image type="content" source="media/create/samlsso.png" alt-text="SAML authentication." border="true":::

1. Select **Yes** when prompted to **Save single sign-on settings**.

   :::image type="content" source="media/create/savesso.png" alt-text="Save single-sign on for the Datadog app" border="true":::

1. The setup of the Single Sign on is now complete.

## Find offer

Navigate to [Azure Marketplace](https://azure.microsoft.com/marketplace/) and search for **Datadog**.

In the plan overview screen, select the **Create** button. The **Create new Datadog resource** window opens.
 
:::image type="content" source="media/create/datadogapp.png" alt-text="Datadog application in Azure Marketplace.":::


## Create resource


## Next steps

> [!div class="nextstepaction"]
> [Manage the Confluent Cloud resource](manage.md)
