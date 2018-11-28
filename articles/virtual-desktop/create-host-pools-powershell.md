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
# Create a host pool with PowerShell

Host pools are a collection of one or more identical virtual machines within Windows Virtual Desktop tenant environments. Each host pool can contain an app group that users can interact with as they would on a physical desktop.

This article will teach you how to import the Windows Virtual Desktop service PowerShell module to your local Windows computer. This will allow you to sign in to your Windows Virtual Desktop service through the Windows PowerShell command window or a Windows PowerShell Integrated Scripting Environment (ISE) window.

To set up and use the PowerShell module:

1. Copy the RDPowerShell.zip file and extract it to a folder on your local computer.
2. Open a PowerShell prompt as Administrator.
3. At the PowerShell command shell prompt, enter the following cmdlet:
    
    ```PowerShell
    cd <path-to-folder-where-RDPowerShell.zip-was-extracted>
    Import-module .\Microsoft.RdInfra.RdPowershell.dll
    ```
4. Run the following cmdlet to sign in to the Windows Virtual Desktop environment:
        ```PowerShell
        Add-RdsAccount –DeploymentUrl <Windows Virtual Desktop Broker URL>
        ```
    1. If the Add-RdsAccount cmdlet gives you an error, run the following cmdlet to change the connection protocol TL1.2 for your PowerShell session:
        ```PowerShell
        [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
        ```
5. When prompted for credentials, use the ones assigned to the Remote Desktop Services Owner role.

After setting up your PowerShell client, run the following cmdlets to create a new host pool and registration token and grant a user access to the default desktop app group. Replace the bracketed items with the relevant values.

```PowerShell
New-RdsHostPool -TenantName <tenantname> -Name <hostpoolname>  
New-RdsRegistrationInfo -TenantName <tenantname> -HostPoolName <hostpoolname> -ExpirationHours <number of hours> | Select-Object -ExpandProperty Token > <PathToRegFile>
Add-RdsAppGroupUser -TenantName <tenantname> -HostPoolName <hostpoolname> -AppGroupName “Desktop Application Group” -UserPrincipalName <userupn>
```
 
**New-RdsRegistrationInfo** generates a new registration token that is active for enrolment for the duration of time specified by the -ExpirationHours parameter. If you don’t specify a value, the time will default to 96 hours.

After you run **New-RdsRegistrationInfo** to generate a new Remote Desktop Services registration token, we recommend that you export it to a file. The Select-Object cmdlet is redirected to a file specified by the `<PathToRegFile>` variable.

Creating a new Remote Desktop Services host pool also creates a default app group named “Desktop Application Group." The Add-RdsAppGroupUser cmdlet adds a user to the default app group. Users can’t be assigned to both a remote desktop and remote app group under the same session host pool.

For additional cmdlet details, see the [PowerShell cmdlet table](powershell-cmdlet-table.md).

The result of running all these cmdlets can be validated by running the Get- equivalent for each cmdlet.  

Many of the required cmdlet parameters are positional so that the parameter name is optional, as shown in the following example cmdlets:

```PowerShell
Get-RdsTenant <tenantname> <hostpoolname>
Get-RdsTenant <tenantname> <hostpoolname> 
Get-RdsRegistrationInfo <tenantname> <hostpoolname> | Select-Object -ExpandProperty Token 
Get-RdsAppGroupUser <tenantname> <hostpoolname> "Desktop Application Group"
```
