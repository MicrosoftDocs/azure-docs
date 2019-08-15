---
title: Create a Windows Virtual Desktop Preview host pool with an Azure Resource Manager template  - Azure
description: How to create a host pool in Windows Virtual Desktop Preview with an Azure Resource Manager template.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 04/05/2019
ms.author: helohr
---
# Create a host pool with an Azure Resource Manager template

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop Preview tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

Follow this section's instructions to create a host pool for a Windows Virtual Desktop tenant with an Azure Resource Manager template provided by Microsoft. This article will tell you how to create a host pool in Windows Virtual Desktop, create a resource group with VMs in an Azure subscription, join those VMs to the AD domain, and register the VMs with Windows Virtual Desktop.

## What you need to run the Azure Resource Manager template

Make sure you know the following things before running the Azure Resource Manager template:

- Where the source of the image you want to use is. Is it from Azure Gallery or is it custom?
- Your domain join credentials.
- Your Windows Virtual Desktop credentials.

When you create a Windows Virtual Desktop host pool with the Azure Resource Manager template, you can create a virtual machine from the Azure gallery, a managed image, or an unmanaged image. To learn more about how to create VM images, see [Prepare a Windows VHD or VHDX to upload to Azure](https://docs.microsoft.com/azure/virtual-machines/windows/prepare-for-upload-vhd-image) and [Create a managed image of a generalized VM in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/capture-image-resource).

## Run the Azure Resource Manager template for provisioning a new host pool

To start, go to [this GitHub URL](https://github.com/Azure/RDS-Templates/tree/master/wvd-templates/Create%20and%20provision%20WVD%20host%20pool).

### Deploy the template to Azure

If you're deploying in an Enterprise subscription, scroll down and select **Deploy to Azure**, then skip ahead fill out the parameters based on your image source.

If you're deploying in a Cloud Solution Provider subscription, follow these steps to deploy to Azure:

1. Scroll down and right-click **Deploy to Azure**, then select **Copy Link Location**.
2. Open a text editor like Notepad and paste the link there.
3. Right after “https://portal.azure.com/” and before the hashtag (#) enter an at sign (@) followed by the tenant domain name. Here's an example of the format you should use: https://portal.azure.com/@Contoso.onmicrosoft.com#create/.
4. Sign in to the Azure portal as a user with Admin/Contributor permissions to the Cloud Solution Provider subscription.
5. Paste the link you copied to the text editor into the address bar.

For guidance about which parameters you should enter for your scenario, see the Windows Virtual Desktop [Readme file](https://github.com/Azure/RDS-Templates/blob/master/wvd-templates/Create%20and%20provision%20WVD%20host%20pool/README.md). The Readme is always updated with the latest changes.

## Assign users to the desktop application group

After the GitHub Azure Resource Manager template completes, assign user access before you start testing the full session desktops on your virtual machines.

First, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) to use in your PowerShell session if you haven't already.

To assign users to the desktop application group, open a PowerShell window and run this cmdlet to sign in to the Windows Virtual Desktop environment:

```powershell
Add-RdsAccount -DeploymentUrl "https://rdbroker.wvd.microsoft.com"
```

After that, add users to the desktop application group with this cmdlet:

```powershell
Add-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group" -UserPrincipalName <userupn>
```

The user’s UPN should match the user’s identity in Azure Active Directory (for example, user1@contoso.com). If you want to add multiple users, you must run this cmdlet for each user.

After you've completed these steps, users added to the desktop application group can sign in to Windows Virtual Desktop with supported Remote Desktop clients and see a resource for a session desktop.

>[!IMPORTANT]
>To help secure your Windows Virtual Desktop environment in Azure, we recommend you don't open inbound port 3389 on your VMs. Windows Virtual Desktop doesn't require an open inbound port 3389 for users to access the host pool's VMs. If you must open port 3389 for troubleshooting purposes, we recommend you use [just-in-time VM access](https://docs.microsoft.com/azure/security-center/security-center-just-in-time).