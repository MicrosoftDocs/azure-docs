---
title: Scale out worker roles in App Services - Azure Stack  | Microsoft Docs
description: Detailed guidance for scaling Azure Stack App Services
services: azure-stack
documentationcenter: ''
author: kathm
manager: slinehan
editor: anwestg

ms.assetid: 3cbe87bd-8ae2-47dc-a367-51e67ed4b3c0
ms.service: azure-stack
ms.workload: app-service
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 4/6/2017
ms.author: kathm

---
# App Service on Azure Stack: Adding more worker roles 

This document provides instructions about how to scale App Service on Azure Stack worker roles. It contains steps for creating additional worker roles to support applications of any size.

> [!NOTE]
> If your Azure Stack POC Environment does not have more than 96-GB RAM you may have difficulties adding additional capacity.

App Service on Azure Stack, by default, supports free and shared worker tiers. To add other worker tiers, you need to add more worker roles.

If you are not sure what was deployed with the default App Service on Azure Stack installation, you can review additional information in the [App Service on Azure Stack overview](azure-stack-app-service-overview.md).

There are two ways to add additional capacity to App Service on Azure Stack:
1.  [Add additional workers directly from with within the App Service Resource Provider Admin](#Add-additional-workers-directly-from-within-the-App-Service-Resource-Provider-Admin).
2.  [Create additional VMs manually and add them to the App Service Resource Provider](#Create-additional-VMs-manually-and-add-them-to-the-App-Service-Resource-Provider).

## Add additional workers directly within the App Service Resource Provider Admin.

1.  Log in to the Azure Stack portal as the service administrator;
2.  Browse to **Resource Providers** and select the **App Service Resource Provider Admin**. ![Azure Stack Resource Providers][1]
3.  Click **Roles**.  Here you see the breakdown of all App Service roles deployed.
4.  Click the option **New Role Instance** ![Add new role instance][2]
5.  In the **New Role Instance** blade:
    1. Choose how many additional **role instances** you would like to add.  In the preview, there is a maximum of 10.
    2. Select the **role type**.  In this preview, this option is limited to Web Worker.
    3. Select the **worker tier** you would like to deploy this worker into, default choices are Small, Medium, Large, or Shared.  If, you have created your own worker tiers, your worker tiers will also be available for selection.
    4. Click **OK** to deploy the additional workers
6.  App Service on Azure Stack will now add the additional VMs, configure them, install all the required software and mark them as ready when this process is complete.  This process can take approximately 80 minutes.
7.  You can monitor the progress of the readiness of the new workers by viewing the workers in the **roles** blade.

>[!NOTE]
>  In this preview, the integrated New Role Instance flow is limited to Worker Roles and deploy VMs of size A1 only.  We will be expanding this capability in a future release.

## Manually adding additional capacity to App Service on Azure Stack.

The following steps are required to add additional roles:

1. [Create a new virtual machine](#step-1-create-a-new-vm-to-support-the-new-instance-size)
2. [Configure the virtual machine](#step-2-configure-the-virtual-machine)
3. [Configure the web worker role in the Azure Stack portal](#step-3-configure-the-web-worker-role-in-the-azure-stack-portal)
4. [Configure app service plans](#step-4-configure-app-service-plans)

## Step 1: Create a new VM to support the new instance size
Create a virtual machine as described in [this article](azure-stack-provision-vm.md), ensuring that the following selections are made:

* User name and password: Provide the same user name and password you provided when you installed App Service on Azure Stack.
* Subscription: Use the default provider subscription.
* Resource group: Choose **AppService-LOCAL**.

> [!NOTE]
> Store the virtual machines for worker roles in the same resource group as App Service on Azure Stack is deployed to. (This is recommended for this release.)
> 
> 

## Step 2: Configure the Virtual Machine
Once the deployment has completed, the following configuration is required to support the web worker role:

1. Browse to the **AppService-LOCAL** resource group in the portal and select the new machine you created in Step 1.
2. Click connect in the VM blade to download the remote desktop profile.  Open the profile to open a remote desktop session to your VM.
3. Log in to the VM using the username and password you specified in Step 1.
4. Open PowerShell by clicking the **Start** button and typing PowerShell. Right-click **PowerShell.exe**, and select **Run
   as administrator** to open PowerShell in administrator mode.
5. Copy and paste each of the following commands (one at a time) into the PowerShell window, and press enter:
   
   ```netsh advfirewall firewall set rule group="File and Printer Sharing" new enable=Yes```
   ```netsh advfirewall firewall set rule group="Windows Management Instrumentation (WMI)" new enable=yes```
   ```reg add HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\system /v LocalAccountTokenFilterPolicy /t REG\_DWORD /d 1 /f```
   
6. Close your remote desktop session.
7. Restart the VM from the portal.

> [!NOTE]
> These are minimum requirements for App Service on Azure Stack. They are the default settings of the Windows 2012 R2 image included with Azure Stack. The instructions have been provided for future reference, and for those using a different image.
> 
> 

## Step 3: Configure the worker role in the Azure Stack portal
1. Open the portal as the service administrator on **ClientVM**.
2. Navigate to **Resource Providers** &gt; **App Service Resource Provider Admin**.![App Service Resource Provider Admin][3]
3. In the settings blade, click **Roles**.![App Service Resource Provider Roles][4]
4. Click **Add Role Instance**.
5. In the textbox for **Server Name** enter the **IP Address** of the server you created earlier (in Section 1).
6. Select the **Role Type** you would like to add - Controller, Management Server, Front End, Web Worker, Publisher, or File Server.  In this instance, select Web Worker.
7. Click the **Tier** you would like to deploy the new instance to (small, medium, large, or shared).  If you have created your own worker tiers these will also be available for selection.
8. Click **OK.**
9. Go back to the **Roles** view
10. Click the row corresponding to the Role Type and Worker Tier combination you assigned your VM to.
11. Look for the Server Name you just added. Review the status column, and wait to move to the next step until the status
    is "Ready." This can take approximately 80 minutes. ![App Service Resource Provider Role Ready][5]

## Step 4: Configure app service plans

1. Sign in to the portal on the ClientVM.
2. Navigate to **New** &gt; **Web and Mobile**.
3. Select the type of application you would like to deploy.
4. Provide the information for the application, and then select **AppService Plan / Location**.
    1. Click **Create New**.
    2. Create your plan, selecting the corresponding pricing tier for the plan.

> [!NOTE]
> You can create multiple plans while on this blade. Before you deploy, however, ensure you have selected the appropriate plan.
> 
> 

The following shows an example of the multiple pricing tiers available by default.  You notice that if there are no available workers for a particular worker tier, the option to choose the corresponding pricing tier is unavailable.![App Service on Azure Stack Default Pricing Tiers][6]

<!--Image references-->
[1]: ./media/azure-stack-app-service-add-worker-roles/azure-stack-resource-providers.png
[2]: ./media/azure-stack-app-service-add-worker-roles/app-service-new-role-instance.png
[3]: ./media/azure-stack-app-service-add-worker-roles/app-service-resource-provider-admin.png
[4]: ./media/azure-stack-app-service-add-worker-roles/app-service-resource-provider-roles.png
[5]: ./media/azure-stack-app-service-add-worker-roles/app-service-resource-provider-role-ready.png
[6]: ./media/azure-stack-app-service-add-worker-roles/app-service-resource-provider-pricing-tier.png
