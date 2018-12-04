---
title: Manage app groups for Windows Virtual Desktop - Azure
description: Describes how to set up Windows Virtual Desktop tenants in Azure Active Directory.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: tutorial
ms.date: 10/25/2018
ms.author: helohr
---
# Tutorial: Manage app groups for Windows Virtual Desktop

The default app group that's created automatically for a new host pool publishes the full desktop. You can also create one or more RemoteApp application groups for the host pool. You can create a RemoteApp app group and publish individual start menu apps by following these steps.

1. Run the following PowerShell cmdlet to create a new empty RemoteApp group.

 ```PowerShell
 New-RdsAppGroup <tenantname> <hostpoolname> <appgroupname> -ResourceType “RemoteApp”
 ```
2. (Optional) To verify the application group was created, you can run the following cmdlet to see a list of all application groups for the host pool.

 ```PowerShell
 Get-RdsAppGroup <tenantname> <hostpoolname>
 ```
3. Run the following cmdlet to get a list of start menu apps on the virtual machine image for the host pool. Write down the values for **FilePath**, **IconPath**, **IconIndex**, and other important information for the application you want to publish.

 ```PowerShell
 Get-RdsHostPoolAvailableApp <tenantname> <hostpoolname>
 ```
4. Run the following cmdlet to publish a new RemoteApp to the application group created in step 1.
   
 ```PowerShell
 New-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname> <remoteappname> -Filepath <filepath>  -IconPath <iconpath> -IconIndex <iconindex>
 ```
5. (Optional) Run the following cmdlet to install the application based on appalias.

 ```PowerShell
 New-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname> <remoteappname> -AppAlias <appalias>
 ```

 >[!NOTE]
 >appalias becomes visible when you run the output from step 3.
6. To verify that the app was published, run the following cmdlet.

 ```PowerShell
 Get-RdsRemoteApp <tenantname> <hostpoolname> <appgroupname>
 ```
7. Repeat steps 1–5 for each application you wish to publish for this app group.
8. Run the following cmdlet to authorize access to the RemoteApps in the app group.

 ```PowerShell
 Add-RdsAppGroupUser <tenantname> <hostpoolname> <appgroupname> -UserPrincipalNames <userupn>
 ```