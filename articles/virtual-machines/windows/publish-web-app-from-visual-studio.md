---
title: Publish a Web App to an Azure VM from Visual Studio
description: Publish an ASP.NET Web Application to an Azure Virtual Machine from Visual Studio
author: ghogen
manager: jillfra
ms.prod: visual-studio-dev15
ms.technology: vs-azure
ms.custom: vs-azure
ms.workload: azure-vs
ms.topic: how-to
ms.date: 11/03/2017
ms.author: ghogen
---
# Publish an ASP.NET Web App to an Azure VM from Visual Studio

This document describes how to publish an ASP.NET web application to an Azure virtual machine (VM) using the **Microsoft Azure Virtual Machines** publishing feature in Visual Studio 2019.  

## Prerequisites
In order to use Visual Studio to publish an ASP.NET project to an Azure VM, the VM must be correctly set up.

- The machine must be configured to run an ASP.NET web application and have WebDeploy installed. For more information, see [Create an ASP.NET VM with WebDeploy](https://github.com/aspnet/Tooling/blob/AspNetVMs/docs/create-asp-net-vm-with-webdeploy.md).

- The VM must have a DNS name configured. For more information, see [Create a fully qualified domain name in the Azure portal for a Windows VM](portal-create-fqdn.md).

## Publish your ASP.NET web app to the Azure VM using Visual Studio
The following section describes how to publish an existing ASP.NET web application to an Azure virtual machine.

1. Open your web app solution in Visual Studio 2019.
2. Right-click the project in Solution Explorer and choose **Publish...**
3. Use the arrow on the right of the page to scroll through the publishing options until you find **Microsoft Azure Virtual Machines**.  

   ![Publish Page - Right arrow]

4. Select the **Microsoft Azure Virtual Machines** icon and select **Publish**.

   ![Publish Page - Microsoft Azure Virtual Machine icon]

5. Choose the appropriate account (with Azure subscription connected to your virtual machine).  
   - If you're signed in to Visual Studio, the account list is populated with all your authenticated accounts.  
   - If you are not signed in, or if the account you need is not listed, choose "Add an account..." and follow the prompts to log in.  
   ![Azure Account Selector]  

6. Select the appropriate VM from the list of Existing Virtual Machines.

   > [!Note]
   > Populating this list can take some time.

   ![Azure VM Selector]

7. Click OK to begin publishing.

8. When prompted for credentials, supply the username and password of a user account on the target VM that is configured with publishing rights. These credentials are typically the admin username and password used when creating the VM.  

   ![WebDeploy Login]

9. Accept the security certificate.

   ![Certificate Error]

10. Watch the Output window to check the progress of the publish operation.

    ![Output Window]

11. If publishing is successful, a browser launches to open the URL of the newly published site.

**Success!**

You have now successfully published your web app to an Azure virtual machine.

## Publish Page Options

After completing the publish wizard, the Publish page is opened in the document well with the new publishing profile selected.

### Re-publish

To publish updates to your web application, select the **Publish** button on the Publish page.  
- If prompted, enter username and password.  
- Publishing begins immediately.

![Publish Page - Publish button]

### Modify publish profile settings

To view and modify the publish profile settings, select **Settings...**.  

![Publish Page - Settings button]

Your settings should look something like this:  

![Publish Settings - Connection page]

#### Save User name and Password
- Avoid providing authentication information every time you publish. To do so, populate the **User name** and **Password** fields, and select the **Save password** box.
- Use the **Validate Connection** button to confirm that you have entered the right information.

#### Deploy to clean web server

- If you want to ensure that the web server has a clean copy of the web application after each upload and that no other files are left from a previous deployment, you can check the **Remove additional files at destination** checkbox in the **Settings** tab.

- Warning: Publishing with this setting deletes all files that exist on the web server (wwwroot directory). Be sure you know the state of the machine before publishing with this option enabled. 

![Publish Settings - Settings page]

## Next steps

### Set up CI/CD for automated deployment to Azure VM

To set up a continuous delivery pipeline with Azure Pipelines, see [Deploy to a Windows Virtual Machine](https://docs.microsoft.com/vsts/build-release/apps/cd/deploy-webdeploy-iis-deploygroups).

[VM Overview - DNS Name]: ../../../includes/media/publish-web-app-from-visual-studio/VMOverviewDNSName.png
[IP Address Config - DNS Name]: ../../../includes/media/publish-web-app-from-visual-studio/IPAddressConfigDNSName.png
[VM Overview - DNS Configured]: ../../../includes/media/publish-web-app-from-visual-studio/VMOverviewDNSConfigured.png
[Publish Page - Right arrow]: ../../../includes/media/publish-web-app-from-visual-studio/PublishPageRightArrow.png
[Publish Page - Microsoft Azure Virtual Machine icon]: ../../../includes/media/publish-web-app-from-visual-studio/PublishPageMicrosoftAzureVirtualMachineIcon.png
[Azure Account Selector]: ../../../includes/media/publish-web-app-from-visual-studio/ChooseVM-SelectAccount.png
[Azure VM Selector]: ../../../includes/media/publish-web-app-from-visual-studio/ChooseVM-SelectVM.png
[WebDeploy Login]: ../../../includes/media/publish-web-app-from-visual-studio/WebDeployLogin.png
[Certificate Error]: ../../../includes/media/publish-web-app-from-visual-studio/CertificateError.png
[Output Window]: ../../../includes/media/publish-web-app-from-visual-studio/OutputWindow.png
[Publish Page - Publish button]: ../../../includes/media/publish-web-app-from-visual-studio/PublishPagePublishButton.png
[Publish Page - Settings button]: ../../../includes/media/publish-web-app-from-visual-studio/PublishPageSettingsButton.png
[Publish Settings - Connection page]: ../../../includes/media/publish-web-app-from-visual-studio/PublishSettingsConnectionPage.png
[Publish Settings - Settings page]: ../../../includes/media/publish-web-app-from-visual-studio/PublishSettingsSettingsPage.png
