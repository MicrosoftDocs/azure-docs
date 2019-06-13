---
title: Deploy management tool - Azure
description: How to install a user interface tool to manage Windows Virtual Desktop preview resources.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 06/04/2019
ms.author: v-chjenk
---
# Tutorial: Deploy a management tool

The management tool provides a user interface (UI) for managing Microsoft Virtual Desktop Preview resources. In this tutorial, you'll learn how to deploy and connect to the management tool.

>[!NOTE]
>These instructions are for a Windows Virtual Desktop Preview-specific configuration that can be used with your organization's existing processes.

## Important considerations

Since the app requires consent to interact with Windows Virtual Desktop, this tool doesn't support Business-to-Business (B2B) scenarios. Each Azure Active Directory (AAD) tenant's subscription will need its own separate deployment of the management tool.

This management tool is a sample. Microsoft will provide important security and quality updates. The [source code is available in GitHub](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/wvd-management-ux/deploy). Customers and partners are encouraged to customize the tool to fit their business needs.

## What you need to run the Azure Resource Manager template

Before deploying the Azure Resource Manager template, you'll need an Azure Active Directory user account that:

- Has Azure Multi-Factor Authentication (MFA) disabled
- Has permission to create resources in your Azure subscription
- Has permissions to read your Windows Virtual Desktop tenant

## Run the Azure Resource Manager template to provision the management UI

Before you start, ensure the server and client apps have consent by visiting the [Windows Virtual Desktop Consent Page](https://rdweb.wvd.microsoft.com) for the Azure Active Directory (AAD) represented.

Follow these instructions to deploy the Azure Resource Management template:

1. Go to the [GitHub Azure RDS-Templates page](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/wvd-management-ux/deploy).
2. Deploy the template to Azure.
    - If you're deploying in an Enterprise subscription, scroll down and select **Deploy to Azure**. See [Guidance for template parameters](#guidance-for-template-parameters).
    - If you're deploying in a Cloud Solution Provider subscription, follow these instructions to deploy to Azure:
        1. Scroll down and right-click **Deploy to Azure**, then select **Copy Link Location**.
        2. Open a text editor like Notepad and paste the link there.
        3. Right after <https://portal.azure.com/> and before the hashtag (#), enter an at sign (@) followed by the tenant domain name. Here's an example of the format: <https://portal.azure.com/@Contoso.onmicrosoft.com#create/>.
        4. Sign in to the Azure portal as a user with Admin/Contributor permissions to the Cloud Solution Provider subscription.
        5. Paste the link you copied to the text editor into the address bar.

### Guidance for template parameters
Here's how to enter parameters for configuring the tool:

- This is the RD broker URL:  <https://rdbroker.wvd.microsoft.com/>
- This is the resource URL:  <https://mrs-prod.ame.gbl/mrs-RDInfra-prod>
- Use your AAD credentials with MFA disabled to sign in to Azure. See [What you need to run the Azure Resource Manager template](#what-you-need-to-run-the-azure-resource-manager-template).
- Use a unique name for the application that will be registered in your Azure Active Directory for the management tool; for example, Apr3UX.

## Use the management tool

After the GitHub Azure Resource Manager template completes, you'll find a resource group containing two app services along with one app service plan in the Azure portal.

Follow these instructions to launch the tool:

1. Select the Azure App Services resource with the name you provided in the template (for example, Apr3UX) and navigate to the URL associated with it; for example,  <https://rdmimgmtweb-210520190304.azurewebsites.net>.
2. Sign in using your Windows Virtual Desktop credentials.
3. When prompted to choose a Tenant Group, select **Default Tenant Group** from the drop-down list.

> [!NOTE]
> If you have a custom Tenant Group, enter the name manually instead of choosing from the drop-down list.
