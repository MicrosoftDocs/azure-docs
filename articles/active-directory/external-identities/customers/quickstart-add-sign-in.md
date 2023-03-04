---
title: Quickstart - Customer tenant set-up and sample app
description: Use our quickstart script to set up a CIAM customer tenant, register a sample app, and test a default sign-up user flow.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: overview
ms.date: 03/03/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to
---

# Quickstart: Create a customer tenant and register a sample app

Azure Active Directory (Azure AD) now offers a customer identity access management (CIAM) solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services. With these built-in customer features, Azure AD can serve as the identity provider and access management service for your customer scenarios:

This sample comes with 5 PowerShell scripts and a Bicep file, which automate the creation of the Azure Active Directory tenant, and the configuration of the code for this sample. Once you run them, you can build a sample app and test.

In this article, you run a script to complete the following steps:

- Create a customer tenant.
- Create the app registration with offline_access and open_id permission under admin grant.
- Create a service principal for the app.
- Create a user flow as the default one.
- Create a customized localization branding as the default one.
 
## Prerequisites

- [PowerShell](https://learn.microsoft.com/en-us/powershell/scripting/install/installing-powershell?view=powershell-7.2)
- [PowerShellGet](https://learn.microsoft.com/en-us/powershell/scripting/gallery/installing-psget?view=powershell-7.2)
- [Bicep tool](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/install)
- [Node.js](https://nodejs.org/en/)
- Customer Tenant Creation Scripts<!--(https://github.com/microsoft-entra/ciam-pp2/tree/main/scripts)-->

## Run the creation script

1. Open the [Azure portal](https://portal.azure.com)
1. Navigate to the **Directories +subscriptions page** page.

<!--    ![Screenshot](media/ciam-pp2/quick-start/directories-subscription-filter-icon.png)-->
1. Copy and save the **Directory ID** for your **Default Directory** somewhere for later use.
<!--    ![Screenshot](media/ciam-pp2/quick-start/copy-tenant-id.png)-->
1. Open the [Azure portal](https://portal.azure.com). Search for and navigate to the 'Subscription' page. Copy and save the **Subscription ID** you wish to use somewhere for later use.*
<!--    ![Screenshot](media/ciam-pp2/quick-start/copy-subsription-id.png)-->
1. Open PowerShell.
1. Navigate to the root directory of the downloaded sample.
1. Go to the `Scripts` folder and run the script with the following command.

   ```PowerShell
   cd .\Scripts\
   .\1-authentication.ps1

1. Enter the parameters recorded earlier when prompted *(tenantId - Directory ID ; subscriptionId - Subscription ID)*. During this process, two pop-ups appear asking you to enter your identity information and provide consent for Microsoft Graph for PowerShell on your tenant.

1. After finishing running the creation script, open the [Azure portal](https://portal.azure.com), search for and navigate to the **Directories + subscriptions** page. 

1. Switch to the tenant newly created by the script.

1. Copy the link from the PowerShell interface and paste it into your browser (you must switch to the correct tenant in the previous step for this step to work). Copy **Application (client) ID** and **Directory (tenant) ID** which are used in later steps.

<!--    ![Screenshot](media/ciam-pp2/quick-start/ciam-test-app.png)-->

1. You can now use [JavaScript sample application](https://github.com/Azure-Samples/ms-identity-javascript-tutorial/) to test functionality. 

1. Clone or download the app to your local machine. 

1. Under **ms-identity-javascript-tutorial\1-Authentication\1-sign-in\App**, open **authConfig.js** to replace the **Application (client) ID** and **Directory (tenant) ID**.

<!--    ![Screenshot](media/ciam-pp2/quick-start/sample-update-clientid.png)-->

1. In PowerShell move to the directory where you've cloned / downloaded the sample app and run the following command to start the app.

   ```PowerShell
   cd \1-Authentication\1-sign-in\App
   npm install
   npm start
   ```

1. Open your browser and visit **http://localhost:3000/**. (Recommend using Microsoft Edge private view mode).

1. Select **Sign-in** at the top right corner to start the authentication flow. If you choose **Can't access your account?**, the sign-up flow starts.

1. After filling in your email, one time passcode and new password, you complete the whole sign-up flow. The page shows your newly created information.

1. Select the **Sign-out** at the right-up corner to sign out.

## Next steps
