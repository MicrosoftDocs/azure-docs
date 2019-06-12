---
title: Manage app groups for Windows Virtual Desktop Preview  - Azure
description: Describes how to set up Windows Virtual Desktop Preview tenants in Azure Active Directory.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 03/21/2019
ms.author: helohr
---
# Tutorial: Manage app groups for Windows Virtual Desktop Preview

The default app group created for a new Windows Virtual Desktop Preview host pool also publishes the full desktop. In addition, you can create one or more RemoteApp  application groups for the host pool. Follow this tutorial to create a RemoteApp app group and publish individual Start menu apps.

In this tutorial, learn how to:

> [!div class="checklist"]
> * Create a RemoteApp group.
> * Grant access to RemoteApps.

Before you begin, [download and import the Windows Virtual Desktop PowerShell module](https://docs.microsoft.com/powershell/windows-virtual-desktop/overview) the Windows Virtual Desktop module to use in your PowerShell session if you haven't already.

## Create a RemoteApp group

1. Run the following PowerShell cmdlet to create a new empty RemoteApp app group.

   ```powershell
   New-RdsAppGroup <tenantname> <hostpoolname> <appgroupname> -ResourceType "RemoteApp"
   ```

2. (Optional) To verify the app group was created, you can run the following cmdlet to see a list of all app groups for the host pool.

   ```powershell
   Get-RdsAppGroup <tenantname> <hostpoolname>
   ```

3. Run the following cmdlet to get a list of start menu apps on the host pool's virtual machine image. Write down the values for **FilePath**, **IconPath**, **IconIndex**, and other important information for the application you want to publish.

   ```powershell
   Get-RdsStartMenuApp <tenantname> <hostpoolname> <appgroupname>
   ```
   
4. Run the following cmdlet to install the application based on its appalias. appalias becomes visible when you run the output from step 3.

   ```powershell
   New-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname> -Name <remoteappname> -AppAlias <appalias>
   ```

5. (Optional) Run the following cmdlet to publish a new RemoteApp to the application group created in step 1.

   ```powershell
   New-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname> -Name <remoteappname> -Filepath <filepath>  -IconPath <iconpath> -IconIndex <iconindex>
   ```

6. To verify that the app was published, run the following cmdlet.

   ```powershell
   Get-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname>
   ```

7. Repeat steps 1–5 for each application you wish to publish for this app group.
8. Run the following cmdlet to grant users access to the RemoteApps in the app group.

   ```powershell
   Add-RdsAppGroupUser <tenantname> <hostpoolname> <appgroupname> -UserPrincipalName <userupn>
   ```

## Next steps

In this tutorial, you learned how to create app groups, populate it with RemoteApps, and assign users to the app group. To learn more about how to sign in to Windows Virtual Desktop, continue to the Connect to Windows Virtual Desktop How-tos.

- [Connect to the Remote Desktop client on Windows 7 and Windows 10](connect-windows-7-and-10.md)
- [Connect to the Windows Virtual Desktop Preview web client](connect-web.md)
