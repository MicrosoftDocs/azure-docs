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
# Quickstart: Get started with Microsoft Entra ID for customers (preview)

Get started with Microsoft Entra ID for customers (Preview) that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in customer configuration features, Microsoft Entra ID for customers can serve as the identity provider and access management service for your customers. 

In this quickstart, you'll learn how to set up a customer tenant free trial. If you already have an Azure subscription, you can create a tenant with customer configurations in the Microsoft Entra admin center. For more information about how to create a tenant see [Set up a tenant](quickstart-tenant-setup.md). 

Your free trial of a tenant with customer configurations provides you with the opportunity to try new features and build applications and processes during the free trial period. Organization (tenant) admins can invite other users. Each user account can only have one active free trial tenant at a time. The free trial isn't designed for scale testing. Trial tenant will support up to 10K resources, learn more about Microsoft Entra service limits [here](../../enterprise-users/directory-service-limits-restrictions.md). During your free trial, you'll have the option to unlock the full set of features by upgrading to [Azure free account](https://azure.microsoft.com/free/).

   > [!NOTE]
   > At the end of the free trial period, your free trial tenant will be disabled and deleted.
    
During the free trial period, you'll have access to all product features with few exceptions. See the following table for comparison: 

|  Features | Microsoft Entra ID for customers Trial (without credit card) | Microsoft Entra account includes Partners (needs credit card)  | 
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

## Get started guide

Once your customer tenant free trial is ready, the next step is to personalize your customer's sign-in and sign-up experience, set up a user in your tenant, and configure a sample app. The get started guide will walk you through all of these steps in just a few minutes. For more information about the next steps see the [get started guide](quickstart-get-started-guide.md) article. 
