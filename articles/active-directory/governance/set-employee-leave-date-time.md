---
title: Set employeeLeaveDateTime
description: Explains how to manually set employeeLeaveDateTime. 
author: owinfreyATL
ms.author: owinfrey
ms.service: active-directory
ms.topic: how-to 
ms.date: 09/07/2022
ms.custom: template-how-to 
---

# Set employeeLeaveDateTime

This article describes how to manually set the employeeLeaveDateTime attribute for a user. This attribute can be set as a trigger for leaver workflows created using Lifecycle Workflows.

## Required permission and roles

To set the employeeLeaveDateTime attribute, you must make sure the correct delegated roles and application permissions are set. They are as follows:

### Delegated

In delegated scenarios, the signed-in user needs the Global Administrator role to update the employeeLeaveDateTime attribute. One of the following delegated permissions is also required:
- User-LifeCycleInfo.ReadWrite.All
- Directory.AccessAsUser.All

### Application

Updating the employeeLeaveDateTime requires the User-LifeCycleInfo.ReadWrite.All application permission.

## Set employeeLeaveDateTime via PowerShell
To set the employeeLeaveDateTime for a user using PowerShell enter the following information:

 ```powershell    
    Connect-MgGraph -Scopes "User-LifeCycleInfo.ReadWrite.All"
    Select-MgProfile -Name "beta"

    $UserId = "<Object ID of the user>"
    $employeeLeaveDateTime = "<Leave date>"
    
    $Body = '{"employeeLeaveDateTime": "' + $employeeLeaveDateTime + '"}'
    Update-MgUser -UserId $UserId -BodyParameter $Body

    $User = Get-MgUser -UserId $UserId -Property employeeLeaveDateTime
    $User.AdditionalProperties
 ```

 This script is an example of a user who will leave on September 30, 2022 at 23:59.

 ```powershell
    Connect-MgGraph -Scopes "User-LifeCycleInfo.ReadWrite.All"
    Select-MgProfile -Name "beta"

    $UserId = "528492ea-779a-4b59-b9a3-b3773ef6da6d"
    $employeeLeaveDateTime = "2022-09-30T23:59:59Z"
    
    $Body = '{"employeeLeaveDateTime": "' + $employeeLeaveDateTime + '"}'
    Update-MgUser -UserId $UserId -BodyParameter $Body

    $User = Get-MgUser -UserId $UserId -Property employeeLeaveDateTime
    $User.AdditionalProperties
``` 


## Next steps

- [How to synchronize attributes for Lifecycle workflows](how-to-lifecycle-workflow-sync-attributes.md)
- [Lifecycle Workflows templates](lifecycle-workflow-templates.md)
