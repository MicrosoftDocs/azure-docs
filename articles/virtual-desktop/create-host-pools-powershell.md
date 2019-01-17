---
title: Create a Windows Virtual Desktop host pool with PowerShell - Azure
description: How to create a host pool in Windows Virtual Desktop with PowerShell cmdlets.
services: virtual-desktop
author: Heidilohr

ms.service: virtual-desktop
ms.topic: how-to
ms.date: 11/21/2018
ms.author: helohr
---
# Create a host pool with PowerShell (Preview)

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

## Use your PowerShell client to create a host pool

1. Run the following cmdlet to sign in to the Windows Virtual Desktop environment
```powershell
Add-RdsAccount -DeploymentUrl https://rdbroker.wvd.microsoft.com
```

2. Run the following cmdlet to set the context to your tenant group. If you do not have the name of the tenant group, your tenant is most likely in the “Default Tenant Group,” so you can skip this cmdlet.
```powershell
Set-RdsContext -TenantGroupName <tenantgroupname>
```
o	Run the following cmdlet to create a new host pool in your Windows Virtual Desktop tenant.
```powershell
New-RdsHostPool -TenantName <tenantname> -Name <hostpoolname>
```
o	Run the following cmdlet to create a registration token to authorize a session host to join the host pool and save it to a new file on your local computer. You can specify how long the registration token is valid by using the -ExpirationHours parameter.
```powershell
New-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname> -ExpirationHours <number of hours> | Select-Object -ExpandProperty Token > <PathToRegFile>
```
o	Run the following cmdlet to add Azure Active Directory users to the default desktop app group for the host pool.
```powershell
Add-RdsAppGroupUser -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName “Desktop Application Group” -UserPrincipalName <userupn>
```

The **Add-RdsAppGroupUser** cmdlet does not support adding security groups and only adds one user at a time to the app group. If you would like to add multiple users to the app group, re-run the cmdlet with the appropriate user principal names.

## Next steps

Now that you've made a host pool, it's time to populate it with RemoteApps. To learn more about how to manage apps in Windows Virtual Desktop, see the Manage app groups tutorial.

> [!div class="nextstepaction"]
> [Manage app groups tutorial](./manage-app-groups.md)