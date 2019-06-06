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

The management tool provides a user interface (UI) for managing Microsoft Virtual Desktop Preview resources. In this tutorial, you'll learn how to deploy and use the management tool.

This tutorial assumes:

- You've already created a virtual machine (VM). If not, see [Prepare and customize a master VHD image](set-up-customize-master-image.md#create-a-vm).
- You have elevated access on the VM, whether it's provisioned in Azure or Hyper-V Manager. If not, see [Elevate access to manage all Azure subscription and management groups](https://docs.microsoft.com/azure/role-based-access-control/elevate-access-global-admin).

>[!NOTE]
>These instructions are for a Windows Virtual Desktop Preview-specific configuration that can be used with your organization's existing processes.

## Important considerations

Since consent is required for the app to interact with Windows Virtual Desktop, this tool does not support Business-to-Business (B2B) scenarios. Each Azure Active Directory (AAD) tenant requires a separate deployment of this UI in their subscription.

This management tool is a sample. Microsoft will provide important security and quality updates. The source code is available in GitHub. Customers and partners are encouraged to customize the tool to fit their business needs.

## What you need to run the Azure Resource Manager template

Here's what you need before deploying the Azure Resource Manager template:

- AAD credentials without Azure Multi-Factor Authentication (MFA) enabled
- Permission for the AAD credentials to create resources in your Azure subscription.
- Your Windows Virtual Desktop credentials

## Run the Azure Resource Manager template to provision the management UI

Before you start, ensure the server and client apps have consent by visiting [Windows Virtual Desktop Consent Page](https://rdweb.wvd.microsoft.com) for the AAD represented.

Use the following instructions to install the Azure Resource Management template.

1. Go to the [GitHub Azure RDS-Templates page](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/wvd-management-ux/deploy).
2. Deploy the template to Azure.
    - If you're deploying in an Enterprise subscription, scroll down and select **Deploy to Azure**. See [Guidance for template parameters](#guidance-for-template-parameters).
    - If you're deploying in a Cloud Solution Provider subscription, follow these instructions to deploy to Azure:
        1. Scroll down and right-click **Deploy to Azure**, then select **Copy Link Location**.
        2. Open a text editor like Notepad and paste the link there.
        3. Right after “https://portal.azure.com/” and before the hashtag (#) enter an at sign (@) followed by the tenant domain name. Here's an example of the format: https://portal.azure.com/@Contoso.onmicrosoft.com#create/.
        4. Sign in to the Azure portal as a user with Admin/Contributor permissions to the Cloud Solution Provider subscription.
        5. Paste the link you copied to the text editor into the address bar.

### Guidance for template parameters
Below is guidance for parameters you'll enter while configuring the tool.

- Here's an example of an RD broker URL: https://rdbroker.wvd.microsoft.com/
- Here's an example  of a resource URL: https://mrs-prod.ame.gbl/mrs-RDInfra-prod
- Use AAD credentials with MFA disabled for Azure Login ID and password.
- Use a unique name for the app; for example, Apr3UX.

## Using the management tool

After the GitHub Azure Resource Manager template completes, you'll find a resource group containing two app services along with one app service plan on the Azure portal.

Use the following instructions to launch the tool.

1. Select appservice with the name you provided in the template (for example, Apr3UX) and navigate to the URL associated with it; for example,  https://rdmimgmtweb-210520190304.azurewebsites.net.
2. Sign in using your Windows Virtual Desktop credentials.
3. When prompted to choose a Tenant Group, select **Default Tenant Group** from the drop-down list.

Note: If you have a custom Tenant Group, enter the name manually instead of choosing from the drop-down list.

## Next steps

In this tutorial, you learned how to deploy the management tool. To learn how to manage app groups using PowerShell, see the Manage app groups tutorial for Windows Virtual Desktop Preview.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)
