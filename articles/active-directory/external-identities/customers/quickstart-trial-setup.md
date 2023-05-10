---
title: Quickstart - Set up a customer tenant free trial
description: Use our quickstart to set up the customer tenant free trial.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 05/03/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to set up the customer tenant free trial.
---
# Quickstart: Get started with Azure AD for customers (Preview)

Get started with Active Directory (Azure AD) for customers (Preview) that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in customer tenant features, Azure AD can serve as the identity provider and access management service for your customers.

This article gives you an overview how to set up your customer tenant free trial. The free trial gives you a 30 day access to all product features with few exceptions. See the following table for comparison:

|  Features | Azure Active Directory for customers trial (without credit card) | Azure Active Directory account includes Partners (needs credit card)  | 
|----------|:-----------:|:------------:|
| **User limits** | Up-to 10K |  Up-to 300 K  | 
| **Self-service account experiences** (Sign-up, sign-in, and password recovery.)   | :heavy_check_mark: |  :heavy_check_mark:  | 
| **MFA** (With email OTP.)  | :heavy_check_mark: |  :heavy_check_mark:  |  
| **Custom token augmentation** (From external sources.) |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Social identity providers**   |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Identity Protection** (Conditional access for adaptive risk-based policies.)  | :x: |  :heavy_check_mark:  |
| Default, least-access privileges for CIAM end-users. |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Rich authorization** (Including group and role management.)  |  :heavy_check_mark: |  :heavy_check_mark:  | 
| **Customizable** (Sign-in/sign-up experiences - background, logo, strings.) |  :heavy_check_mark: |  :heavy_check_mark:  |
| Group and User management. |  :heavy_check_mark: |  :heavy_check_mark:  |
| **Cloud-agnostic solution** with multi-language auth SDK support.  |  :heavy_check_mark: |  :heavy_check_mark:  | 

## Sign up to your customer tenant free trial

1. Open your browser and visit [https://aka.ms/ciam-free-trial](https://aka.ms/ciam-free-trial).
1. You can sign in to the customer trial tenant using your personal account, and your Microsoft account (MSA) or GitHub account.  
1. You'll notice that a domain name and location have been set for you. The domain name and the data location can't be changed later in the free trial. Select **Change settings** if you would like to adjust them.
1. Select **Continue** and hang on while we set up your trial. It will take a few minutes for the trial to become ready for the next step.

    :::image type="content" source="media/quickstart-trial-setup/setting-up-free-trial.png" alt-text="Screenshot of the loading page while setting up the customer tenant free trial."::: 

## Customize your sign-in experience

You can customize your customer's sign-in and sign-up experience in the Azure AD for customers tenant. First you have to specify how would you like your customer to sign in. At this step you can choose between two options: **Email and password** or **Email and one-time passcode**. You can configure social accounts later, which would allow your customers to sign in using their [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md) account.

If you prefer, you can add your company logo, change the background color or adjust the sign-in layout. These optional changes will apply to the look and feel of all your apps in this customer tenant. There are more branding options available, once you have the customer tenant created. You can [customize the default branding](how-to-customize-branding-customers.md), [add languages](how-to-customize-languages-customers.md), and even [define custom attributes](how-to-define-custom-attributes.md). Once you're finished with the customization, select **Continue**.

:::image type="content" source="media/quickstart-trial-setup/customize-branding-in-trial-wizard.png" alt-text="Screenshot of customizing the sign-in experience in the guide.":::

## Try out the sign-up experience and create your first user

1. Select the **Run it now** button. You see a progress bar first to show it's loading, and then a new tab opens with the sign-in experience. 
1. After the configuration is finished, a live sign-in box will appear in a new browser tab that can be used to create and sign in users. Select **No account? Create one** to create a new user in the new customer tenant.
1. Add your new user's email address and select **Next**.
1. Create a password and select **Next**. Typically, once the user has signed in, they're redirected back to your app. However, in the customer tenant free trial, you'll be redirected to JWT.ms at this step, where you can view the contents of the token issued during the sign-in process.
1. Go back to the guide tab. At this stage, you can either exit the guide and go to the admin center and  explore the full range of configuration options for your tenant. Or you can **Continue** by setting up a sample app. We recommend setting up the sample app and run it, to see the sign-in experience with your latest configuration changes before exiting the guide. This way, you can ensure that everything is working as expected.

    :::image type="content" source="media/quickstart-trial-setup/successful-trial-setup.png" alt-text="Screenshot that shows the successful creation of the sign-up experience.":::

## Set up a sample app

The Get started guide has pre-configured apps for the below app types and languages:

- ASP.NET, Web app, and Web API
- Vanilla JS, React JS, Angular JS

Follow the steps below, to download and run the sample app.

1. Proceed to set up the sample app by selecting the app type.
1. Select your language and **Download sample app** on your machine.
1. Follow the instructions to install and run the app. Sign into the sample app.

    :::image type="content" source="media/quickstart-trial-setup/sample-app-setup.png" alt-text="Screenshot of the sample app setup.":::

1. You've completed the process of creating a trial tenant, configuring the sign-in experience, creating your first user, and setting up a sample app. Select **Continue** to go the admin center or you can restart the guide.

## Explore Azure AD for customers

To register and configure an app in your customer tenant, follow the guide on the screen. To learn more about app configuration steps, follow the [Register an app in CIAM](how-to-register-ciam-app.md) article. You can always come back to the [admin center](https://entra.microsoft.com/) to customize your tenant and explore the full range of configuration options for your tenant. 

## Next steps
 - [Register an app in CIAM](how-to-register-ciam-app.md)
 - [Customize user experience for your customers](how-to-customize-branding-customers.md)
 - [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)
