---
title: Quickstart - Get started guide
description: Use our quickstart guide to customize your tenant in just a few steps.
services: active-directory
author: csmulligan
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 09/26/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or IT admin, I want to personalize the customer tenant.
---
# Quickstart: Get started with our guide to run a sample app and sign in your users (preview)

In this quickstart, we'll guide you through customizing the look and feel of your apps in the  customer tenant, setting up a user and configuring a sample app in only a few minutes. With these built-in customer configuration features, Microsoft Entra ID for customers can serve as the identity provider and access management service for your customers.

## Prerequisites

- External ID for customers tenant. If you don't already have one, <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">sign up for a free trial</a> or [create a tenant with customer configurations in the Microsoft Entra admin center](quickstart-tenant-setup.md). 

## Customize your sign-in experience

When you set up a customer tenant free trial, the guide will start automatically as part of the configuration of your new customer tenant. If you created your customer tenant with an Azure subscription, you can start the guide manually by following the steps below.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com). 
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 
1. Browse to **Home** > **Go to Microsoft Entra ID** 
1. On the **Get started** tab, select **Start the guide**.

    :::image type="content" source="media/how-to-create-customer-tenant-portal/guide-link.png" alt-text="Screenshot that shows how to start the guide.":::

You can customize your customer's sign-in and sign-up experience in the External ID for customers tenant. Follow the guide that will help you set up the tenant in three easy steps. First you must specify how would you like your customer to sign in. At this step you can choose between two options: **Email and password** or **Email and one-time passcode**. You can configure social accounts later, which would allow your customers to sign in using their [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) account. You can also [define custom attributes](how-to-define-custom-attributes.md) to collect from the user during sign-up.

If you prefer, you can add your company logo, change the background color or adjust the sign-in layout. These optional changes will apply to the look and feel of all your apps in this tenant with customer configurations. After you have the created tenant, additional branding options are available. You can [customize the default branding](how-to-customize-branding-customers.md) and [add languages](how-to-customize-languages-customers.md). Once you're finished with the customization, select **Continue**.

:::image type="content" source="media/quickstart-trial-setup/customize-branding-in-trial-wizard.png" alt-text="Screenshot of customizing the sign-in experience in the guide.":::

## Try out the sign-up experience and create your first user

1. The guide will configure your tenant with the options you have selected. Once the configuration is complete, the button will change its text from **Setting up...** to **Run it now**.
1. Select  the **Run it now** button. A new browser tab will open with the sign-in page for your tenant that can be used to create and sign in users. 
1. Select **No account? Create one** to create a new user in the tenant.
1. Add your new user's email address and select **Next**. Don't use the same email you used to create your trial.
1. Complete the sign-up steps on the screen. Typically, once the user has signed in, they're redirected back to your app. However, since you haven’t set up an app at this step, you'll be redirected to JWT.ms instead, where you can view the contents of the token issued during the sign-in process.
1. Go back to the guide tab. At this stage, you can either exit the guide and go to the admin center to explore the full range of configuration options for your tenant. Or you can **Continue** and set up a sample app. We recommend setting up the sample app, so that you can use it to test any further configuration changes you make

    :::image type="content" source="media/quickstart-trial-setup/successful-trial-setup.png" alt-text="Screenshot that shows the successful creation of the sign-up experience.":::

## Set up a sample app

The get started guide will automatically configure sample apps for the below app types and languages:

- Single Page Application (SPA): JavaScript, React, Angular
- Web app: Node.js (Express), ASP.NET Core

Follow the steps below, to download and run the sample app.

1. Proceed to set up the sample app by selecting the app type.
1. Select your language and **Download sample app** on your machine.
1. Follow the instructions to install and run the app. Sign into the sample app.

    :::image type="content" source="media/quickstart-trial-setup/sample-app-setup.png" alt-text="Screenshot of the sample app setup.":::

1. You've completed the process of creating a trial tenant, configuring the sign-in experience, creating your first user, and setting up a sample app. Select **Continue** to go to the summary page, where you can either go to the admin center or you can restart the guide to choose different options.

<a name='explore-azure-ad-for-customers'></a>

## Explore Microsoft Entra ID for customers

Follow the articles below to learn more about the configuration the guide created for you or to configure your own apps. You can always come back to the [admin center](https://entra.microsoft.com/) to customize your tenant and explore the full range of configuration options for your tenant.

> [!NOTE]
> The next time you return to your tenant, you might be prompted to set up additional authentication factors for added security of your tenant admin account.

## Next steps
 - [Register an app in CIAM](how-to-register-ciam-app.md) 
 - [Customize user experience for your customers](how-to-customize-branding-customers.md)
 - [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
 - See the [External ID for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources
