---
title: Quickstart - Explore a free trial
description: Use our quickstart to explore the free customer tenant.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 03/22/2023
ms.author: cmulligan
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to explore the free customer trial. 
---
# Quickstart: Explore your free customer trial

Get started with our customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in CIAM features, Azure AD can serve as the identity provider and access management service for your customers. 

There are three primary steps you have to complete to set up your customer tenant:
- Configure and register your apps
- Create a custom look and feel for your customers when signing in to your apps
- Set up sign-up and sign-in user flows for your customers

This article gives you an overview where to find these main functions in an Azure AD customer tenant. 

## Prerequisites
- If you haven't already created your own Azure AD customer tenant, create one now. We highly recommend utilizing the new free customer tenant wizard. This wizard does a quick setup for you by creating a trial tenant and a default user flow. It also lets you do some customization of the sign-in look and feel, and lets you see what the sign-in would look like to a customer signing up for the app. You can stop there, or you can select a sample app and try out the sign-in flow.   

   :::image type="content" source="media/quickstart-explore-free-customer-trial/ciam-wizard.png" alt-text="Screenshot of the customer tenant creation wizard." :::

Alternatively you can also set up your customer tenant by following the steps in the [Create a customer tenant](quickstart-customer-tenant-portal.md) article. 

## Switch to your customer tenant

To start using your new Azure AD for customer tenant, you need to switch to the directory that contains the tenant.

1. Sign in to the Azure portal.
1. To make sure you're using the directory that contains your Azure AD for customers tenant, select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**. 
1. In the Azure portal, search for and select **Azure Active Directory**. 

   :::image type="content" source="media/quickstart-explore-free-customer-trial/explore-customer-trial.png" alt-text="Screenshot of the free customer trial start page." :::

5. Switch to the **Overview** tab to find basic information about your customer tenant. 

   :::image type="content" source="media/quickstart-explore-free-customer-trial/customer-tenant-overview.png" alt-text="Screenshot of the customer tenant overview page." :::

## Configure apps

Before your applications can interact with Azure AD, they must be registered in your customer tenant.

1. Sign in to the Azure portal and switch to your customer tenant. 
1. To configure apps, go to the **Azure Active Directory** > **Home** page and select **Configure apps**. Or under **Manage**, select **App registrations** > **New registration**.

To learn more about app configuration steps, follow the [Register an app in CIAM](how-to-register-ciam-app.md) article.

## Customize branding

After creating a new customer tenant, you can customize the end-user experience. Create a custom look and feel for users signing in to your web-based apps by configuring **Company branding** settings for your tenant. With these settings, you can add your own background images, colors, company logos, and text to customize the sign-in experiences across your apps.  

1. Sign in to the Azure portal and switch to your customer tenant. 
1. To customize the user experience, go to the **Azure Active Directory** > **Home** page and select **Customize branding**. 
1. Under **Default sign-in experience**, select **Edit**. Or go to Azure **Active Directory** > **Company branding**.

The sign-in experience process is grouped into sections. At the end of each section, select the **Review + save** button to review what you have selected and submit your changes or the **Next** button to move to the next section. 

   :::image type="content" source="media/quickstart-explore-free-customer-trial/customize-branding.png" alt-text="Screenshot of the company branding page." :::

To learn more about app customizable branding, follow the [Customize user experience for your customers](how-to-customize-branding-customers.md) article.

## Set up or edit user flows

A user flow creates a sign-up and sign-in experience for your customers through the application you want to share. The user flow can be associated with one or more of your applications. First you'll enable self-service sign-up for your tenant and federate with the identity providers you want to allow external users to use for sign-in. Then you'll create and customize the sign-up user flow and assign your applications to it. 

1. Sign in to the Azure portal and switch to your customer tenant. 
1. To edit user flows, go to the **Azure Active Directory** > **Home** page and select **Edit user flows**. Or select **External Identities** > **User flows**. 

To learn more about how to create a sign-up and sign-in user flow for customers, follow the  [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)  article.

## Next steps
 - [Register an app in CIAM](how-to-register-ciam-app.md)
 - [Customize user experience for your customers](how-to-customize-branding-customers.md)
 - [Create a sign-up and sign-in user flow](how-to-user-flow-sign-up-sign-in-customers.md)