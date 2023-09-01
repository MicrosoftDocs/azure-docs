---
title: Quickstart - Set up a customer tenant free trial
description: Use our quickstart to set up the customer tenant free trial.
services: active-directory
author: csmulligan
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 05/31/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or IT admin, I want to set up the customer tenant free trial.
---
# Quickstart: Get started with Azure AD for customers (preview)

Get started with Azure AD for customers (Preview) that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in customer configuration features, Azure AD for customers can serve as the identity provider and access management service for your customers. 

In this quickstart, you'll learn how to set up a customer tenant free trial. If you already have an Azure subscription, you can create a tenant with customer configurations in the Microsoft Entra admin center. For more information about how to create a tenant see [Set up a tenant](quickstart-tenant-setup.md). 

Your free trial of a tenant with customer configurations provides you with the opportunity to try new features and build applications and processes during the free trial period. Organization (tenant) admins can invite other users. Each user account can only have one active free trial tenant at a time. The free trial isn't designed for scale testing. Trial tenant will support up to 10K resources, learn more about Azure AD service limits [here](/azure/active-directory/enterprise-users/directory-service-limits-restrictions). During your free trial, you'll have the option to unlock the full set of features by upgrading to [Azure free account](https://azure.microsoft.com/free/).

   > [!NOTE]
   > At the end of the free trial period, your free trial tenant will be disabled and deleted.
    
During the free trial period, you'll have access to all product features with few exceptions. See the following table for comparison: 

|  Features | Azure AD for customers Trial (without credit card) | Azure Active Directory account includes Partners (needs credit card)  | 
|----------|:-----------:|:------------:|
| **Self-service account experiences** (Sign-up, sign-in, and password recovery.)   | :heavy_check_mark: |  :heavy_check_mark:  | 
| **MFA** (With email OTP.)  | :heavy_check_mark: |  :heavy_check_mark:  |  
| **Custom token augmentation** (From external sources.) |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Social identity providers**   |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Identity Protection** (Conditional Access for adaptive risk-based policies.)  | :x: |  :heavy_check_mark:  |
| Default, least-access privileges for CIAM end-users. |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Rich authorization** (Including group and role management.)  |  :heavy_check_mark: |  :heavy_check_mark:  | 
| **Customizable** (Sign-in/sign-up experiences - background, logo, strings.) |  :heavy_check_mark: |  :heavy_check_mark:  |
| Group and User management. |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Cloud-agnostic solution** with multi-language auth SDK support.  |  :heavy_check_mark: |  :heavy_check_mark:  | 

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

## Sign up to your customer tenant free trial

1. Open your browser and visit <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">https://aka.ms/ciam-free-trial</a>.
1. You can sign in to the customer trial tenant using your personal account, and your Microsoft account (MSA) or GitHub account.  
1. You'll notice that a domain name and location have been set for you. The domain name and the data location can't be changed later in the free trial. Select **Change settings** if you would like to adjust them.
1. Select **Continue** and hang on while we set up your trial. It will take a few minutes for the trial to become ready for the next step.

    :::image type="content" source="media/quickstart-trial-setup/setting-up-free-trial.png" alt-text="Screenshot of the loading page while setting up the customer tenant free trial."::: 

## Customize your sign-in experience

You can customize your customer's sign-in and sign-up experience in the Azure AD for customers tenant. Follow the guide that will help you set up the tenant in three easy steps. First you must specify how would you like your customer to sign in. At this step you can choose between two options: **Email and password** or **Email and one-time passcode**. You can configure social accounts later, which would allow your customers to sign in using their [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) account. You can also [define custom attributes](how-to-define-custom-attributes.md) to collect from the user during sign-up.

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

## Explore Azure AD for customers

Follow the articles below to learn more about the configuration the guide created for you or to configure your own apps. You can always come back to the [admin center](https://entra.microsoft.com/) to customize your tenant and explore the full range of configuration options for your tenant.

> [!NOTE]
> The next time you return to your tenant, you might be prompted to set up additional authentication factors for added security of your tenant admin account.

## Next steps
 - [Register an app in CIAM](how-to-register-ciam-app.md)
 - [Customize user experience for your customers](how-to-customize-branding-customers.md)
 - [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
 - See the [Azure AD for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources

