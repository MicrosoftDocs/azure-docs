---
title: Deploy Windows 7 virtual machine Windows Virtual Desktop - Azure
description: How to configure and deploy a Windows 7 virtual machine on Windows Virtual Desktop.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 03/30/2020
ms.author: helohr
manager: lizross
---
# Deploy a Windows 7 virtual machine on Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to the Fall 2019 release that doesn't support Azure Resource Manager Windows Virtual Desktop objects.

The process to deploy a Windows 7 virtual machine (VM) on Windows Virtual Desktop is slightly different than for VMs running later versions of Windows. This guide will tell you how to deploy Windows 7.

## Prerequisites

Before you start, follow the instructions in [Create a host pool with PowerShell](create-host-pools-powershell-2019.md) to create a host pool. After that, follow the instructions in [Create host pools in Azure Marketplace](create-host-pools-azure-marketplace-2019.md#optional-assign-additional-users-to-the-desktop-application-group) to assign one or more users to the desktop application group.

## Configure a Windows 7 virtual machine

Once you've done the prerequisites, you're ready to configure your Windows 7 VM for deployment on Windows Virtual Desktop.

To set up a Windows 7 VM on Windows Virtual Desktop:

1. Sign in to the Azure portal and either search for the Windows 7 Enterprise image or upload your own customized Windows 7 Enterprise (x64) image.  
2. Deploy one or multiple virtual machines with Windows 7 Enterprise as its host operating system. Make sure the virtual machines allow Remote Desktop Protocol (RDP) (the TCP/3389 port).
3. Connect to the Windows 7 Enterprise host using the RDP and authenticate with the credentials you defined while configuring your deployment. 
4. Add the account you used while connecting to the host with RDP to the "Remote Desktop User" group. If you don't do this, you might not be able to connect to the VM after you join it to your Active Directory domain.
5. Go to Windows Update on your VM.
6. Install all Windows Updates in the Important category.
7. Install all Windows Updates in the Optional category (excluding language packs). This installs the Remote Desktop Protocol 8.0 update ([KB2592687](https://www.microsoft.com/download/details.aspx?id=35387)) that you need to complete these instructions.
8. Open the Local Group Policy Editor and navigate to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.
9. Enable the Remote Desktop Protocol 8.0 policy.
10. Join this VM to your Active Directory domain.
11. Restart the virtual machine by running the following command:
    
     ```cmd
     shutdown /r /t 0
     ```
    
12. Follow the instructions [here](/powershell/module/windowsvirtualdesktop/export-rdsregistrationinfo/) to get a registration token.
13. [Download the Windows Virtual Desktop Agent for Windows 7](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE3JZCm).
14. [Download the Windows Virtual Desktop Agent Manager for Windows 7](https://query.prod.cms.rt.microsoft.com/cms/api/am/binary/RE3K2e3).
15. Open the Windows Virtual Desktop Agent installer and follow the instructions. When prompted, give the registration key you created in step 12.
16. Open the Windows Virtual Desktop Agent Manager and follow the instructions.
17. Optionally, block the TCP/3389 port to remove direct Remote Desktop Protocol access to the VM.
18. Optionally, confirm that your .NET framework is at least version 4.7.2. This is especially important if you're creating a custom image.

## Next steps

Your Windows Virtual Desktop deployment is now ready to use. [Download the latest version of the Windows Virtual Desktop client](https://aka.ms/wvd/clients/windows) to get started.

For a list of known issues and troubleshooting instructions for Windows 7 on Windows Virtual Desktop, see our troubleshooting article at [Troubleshoot Windows 7 virtual machines in Windows Virtual Desktop](troubleshoot-windows-7-vm.md).
