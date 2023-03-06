---
title: Quickstart - Customer tenant set-up and sample app
description: Use our quickstart script to set up a CIAM customer tenant, register a sample app, and test a default sign-up user flow.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: quickstart
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Quickstart: Use a script to add sign-in to a sample app

Azure Active Directory (Azure AD) now offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in customer features, Azure AD can serve as the identity provider and access management service for your customer scenarios:

This sample comes with 5 PowerShell scripts and a Bicep file, which automate the creation of the Azure Active Directory tenant, and the configuration of the code for this sample. Once you run them, you can build a sample app and test.

In this article, you run a script to complete the following steps:

- Create a customer tenant
- Create the app registration with offline_access and open_id permission under admin grant
- Create a service principal for the app
- Create a default sign-in flow
- Create default branding and language customizations
## Prerequisites

- [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2)
- [PowerShellGet](https://learn.microsoft.com/en-us/powershell/scripting/gallery/installing-psget?view=powershell-7.2)
- [Bicep tool](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install)
- [Node.js](https://nodejs.org/en/)
- [Customer Tenant Creation Script](https://aka.ms/ciam-create-tenant-script)

## Run the customer tenant creation script

1. Sign in to your organization's [Azure portal](https://portal.azure.com).

1. From the Azure portal menu, select **Azure Active Directory**.

1. Select the **Directories + subscriptions** filter :::image type="icon" source="./media/portal-directory-subscription-filter.png" border="false"::: in the top menu to view the **Directories + Subscriptions** page.

1. Copy and save the **Directory ID** for your **Default Directory** for later use.

1. Navigate to the [Subscriptions page in Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade). Find your subscription and copy the **Subscription ID** for later use.

1. Open PowerShell.

1. Navigate to the root directory of the script you downloaded.

1. Go to the `Scripts` folder and run the script with the following command.

   ```PowerShell
   cd .\Scripts\
   .\1-authentication.ps1

1. When prompted, enter the Directory (tenant) ID and Subscription ID values you recorded earlier. During this process, two pop-ups appear asking you to enter your identity information and provide consent for Microsoft Graph for PowerShell on your tenant.

1. After script finishes running, go to the [Azure portal](https://portal.azure.com), the **Directories + subscriptions** filter :::image type="icon" source="./media/portal-directory-subscription-filter.png" border="false"::: in the top menu to view the **Directories + Subscriptions** page.

1. Switch to the new customer tenant.

1. Copy the link from the PowerShell interface and paste it into your browser (you must switch to the correct tenant in the previous step for this step to work)

1. Copy the **Application (client) ID** and **Directory (tenant) ID** for use in later steps.

## Test the sign-in flow

Now that you've created a customer tenant, you can use a sample JavaScript application to test the sign-in flow.

1. Clone or download the [JavaScript sample application](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/) to your local machine.

1. Under **ms-identity-javascript-tutorial\1-Authentication\1-sign-in\App**, open **authConfig.js** and replace the **Application (client) ID** and **Directory (tenant) ID** with the values you copied earlier.

1. In PowerShell, change to the directory where you've downloaded the sample app. Run the following command to start the app:

   ```PowerShell
   cd \1-Authentication\1-sign-in\App
   npm install
   npm start
   ```

1. Open your browser in private mode and go to **http://localhost:3000/**.

1. In the top right corner of the page, select **Sign-in** to start the authentication flow.

1. Choose **Can't access your account?** to start the sign-up flow.

1. Follow the flow to enter your email, retrieve and enter the one-time passcode, and create new password. After you complete the sign-up steps, the page shows your newly created information.

1. Select **Sign-out** in the upper right corner of the page to sign out.

## Next steps
