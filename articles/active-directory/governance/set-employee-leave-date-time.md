---
title: Set employeeLeaveDateTime for leaver workflows
description: Explains how to manually set employeeLeaveDateTime for leaver workflows using PowerShell. 
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.topic: how-to 
ms.date: 09/07/2022
ms.custom: template-how-to 
---



# Set employeeLeaveDateTime for leaver workflows

When creating leaver workflows, it's required to set the date and time for when a user leaves. This parameter, employeeLeaveDateTime, is used to trigger the leaver workflow to run. Unlike other parameters, which can be synchronized using HR inbound Provisioning, Azure AD Connect sync, or Azure AD Connect Cloud sync, you must currently manually set the employeeLeaveDateTime for each user you want to process a leaver workflow for.

To set the employeeLeaveDateTime for a user using PowerShell enter the following information:

 ```powershell
 Connect-MgGraph -Scopes "User.ReadWrite.All","User-LifeCycleInfo.ReadWrite.All"

 Select-MgProfile -Name "beta"

 $URI = "https://graph.microsoft.com/beta/users/528492ea-779a-4b59-b9a3-b3773ef6da6d"
 $Body = '{"employeeLeaveDateTime": "<Leave date>"}'
 Invoke-MgGraphRequest -Method PATCH -Uri $URI -Body $Body
 ```

This is an example of a user who will leave on September 30, 2022 at 23:59.

 ```powershell
    Connect-MgGraph -Scopes "User.ReadWrite.All","User-LifeCycleInfo.ReadWrite.All"

    Select-MgProfile -Name "beta"

    $URI = "https://graph.microsoft.com/beta/users/528492ea-779a-4b59-b9a3-b3773ef6da6d"
    $Body = '{"employeeHireDate": "<Hire date>","employeeLeaveDateTime": "2022-09-30T23:59:59Z"}'
    Invoke-MgGraphRequest -Method PATCH -Uri $URI -Body $Body
``` 


## Next steps

- [How to synchronize attributes for Lifecycle workflows](how-to-lifecycle-workflow-sync-attributes.md)
- [Lifecycle Workflows templates](lifecycle-workflow-templates.md)
