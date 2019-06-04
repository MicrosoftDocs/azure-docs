---
title: Deploy a tool to manage resources - Azure
description: How to install a tool to manage Windows Virtual Desktop preview resources.
services: virtual-desktop
author: ChJenk

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 06/04/2019
ms.author: v-chjenk
---
# Deploy a tool to manage resources

This article tells you how to... 

Follow this section's instructions to deploy a management UI tool for a Windows Virtual Desktop provided by Microsoft.  

This article assumes you've already created a virtual machine (VM). If not, see [Prepare and customize a master VHD image](set-up-customize-master-image.md#create-a-vm)

This article also assumes you have elevated access on the VM, whether it's provisioned in Azure or Hyper-V Manager. If not, see [Elevate access to manage all Azure subscription and management groups](https://docs.microsoft.com/azure/role-based-access-control/elevate-access-global-admin).

>[!NOTE]
>These instructions are for a Windows Virtual Desktop Preview-specific configuration that can be used with your organization's existing processes.

## What you need to run the Azure Resource Manager template

Make sure you have the following information before running the Azure Resource Manager template:

- AAD credentials without MFA enabled
- Permission for the AAD credentials to create resources in your Azure subscription.
- Your Windows Virtual Desktop credentials
- 

## Run the Azure Resource Manager template to provision the management UI

Before you start, ensure that the server and client apps have consent by visiting [Windows Virtual Desktop Consent Page](https://rdweb.wvd.microsoft.com) for the AAD represented.

Us the following instructions to install the Azure Resource Management template.

1. Go to the [GitHub Azure RDS-Templates page](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/wvd-management-ux/deploy).
2. Deploy the template to Azure.

If you're deploying in an Enterprise subscription, scroll down and select Deploy to Azure, then skip ahead fill out the parameters.

If you're deploying in a Cloud Solution Provider subscription, follow these steps to deploy to Azure: 

1. Scroll down and right-click Deploy to Azure, then select Copy Link Location.
2. Open a text editor like Notepad and paste the link there. 
3. Right after “https://portal.azure.com/” and before the hashtag (#) enter an at sign (@) followed by the tenant domain name. Here's an example of the format you should use: https://portal.azure.com/@Contoso.onmicrosoft.com#create/.
4. Sign into the Azure portal as a user with Admin/Contributor permissions to the Cloud Solution Provider subscription. 
5. Paste the link you copied to the text editor into the address bar.

Here is the guidance on the parameters you should enter:

- RD Broker URL: https://rdbroker.wvd.microsoft.com/
- Resource URL: https://mrs-prod.ame.gbl/mrs-RDInfra-prod
- Azure Login ID/ password – AAD credentials without MFA enabled
- Unique name for the app (e.g. Apr3UX)

## Using the Management UI

After the GitHub Azure Resource Manager template completes, on the Azure portal, you will find the resource group containing 2 app services along with 1 app service plan.

Use the followign instructions to launch the UI.

1. Select appservice with the name you provided in the template (e.g. Apr3UX) and navigate to the URL associated with it (e.g. https://rdmimgmtweb-210520190304.azurewebsites.net).
2. Sign in using the Your Windows Virtual Desktop credentials.
3. When prompted to select a Tenant Group, choose “Default Tenant Group” from the drop-down list. 

Note: If you have a custom Tenant Group, enter the name manually instead of choosing from the drop-down list.  

Important

Since consent is required for the app to interact with Windows Virtual Desktop, this tool does not support Business-to-Business (B2B) scenarios. Each AAD tenant requires a separate deployment of this UI in their subscription.

This is sample UI and Microsoft will provide important security and quality updates. The source code is available in Github. Customers and partners are encouraged to customize the UI to suit business needs.

## Next steps


