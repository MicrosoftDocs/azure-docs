---
title: Disable converged registration for Azure AD SSPR and MFA (Public preview)
description: Disable Azure AD Multi-Factor Authentication and self-service password reset registration (Public preview)

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: conceptual
ms.date: 08/02/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: sahenry, michmcla

---
# Disable Azure AD converged registration (Public preview)

When a user registers their phone number and/or mobile app in the new converged experience, our service stamps a set of flags (StrongAuthenticationMethods) for those methods on that user. This functionality allows the user to perform Azure Multi-Factor Authentication (MFA) with those methods whenever MFA is required.

The methods that users register through the new experience have the StrongAuthenticationMethods property set. This behavior will also occur once public preview is available. If an admin enables the preview, users register through the new experience, and then the admin disables the preview, users may unknowingly be registered for MFA also.

If a user who has completed converged registration navigates to the current SSPR registration page, at [https://aka.ms/ssprsetup](https://aka.ms/ssprsetup), they will be prompted to perform MFA before they can access that page. This step is an expected behavior from a technical standpoint, but for users who were previously registered for SSPR only, this step is a new behavior. Although this extra step does improve the user’s security posture by providing an additional level of security, admins may want to roll back their users so that they are no longer capable of performing MFA.  

## How to roll back users

If you as an administrator want to reset a user's MFA settings, we have created a PowerShell script that will clear the StrongAuthenticationMethods property for a user’s mobile app and/or phone number. Running this script for your users means that they will need to re-register for MFA if needed. We recommend testing rollback with one or two users before rolling back all the affected users.

The steps that follow will help you roll back a user or group of users:

### Pre-requisites

1. You will need to install the appropriate Azure AD PowerShell modules. In a PowerShell window, run these commands to install the modules:

   ```powershell
   Install-Module -Name MSOnline
   Import-Module MSOnline
   ```

1. Save the list of affected user object ID/IDs to your machine as a text file with one ID per line. Make note of the location of the file.
1. Save the following script to your machine and make note of the location of the script:

```powershell
<# 
//********************************************************
//*                                                      *
//*   Copyright (C) Microsoft. All rights reserved.      *
//*                                                      *
//********************************************************
#>

param($path)

# Define Remediation Fn
function RemediateUser {

    param  
    (
        $ObjectId
    )

    $user = Get-MsolUser -ObjectId $ObjectId

    Write-Host "Checking if user is eligible for rollback: UPN: "  $user.UserPrincipalName  " ObjectId: "  $user.ObjectId -ForegroundColor Yellow

    $hasMfaRelyingParty = $false
    foreach($p in $user.StrongAuthenticationRequirements)
    {
        if ($p.RelyingParty -eq "*")
        {
            $hasMfaRelyingParty = $true
            Write-Host "User was enabled for per-user MFA." -ForegroundColor Yellow
        }
    }

    if ($user.StrongAuthenticationMethods.Count -gt 0 -and -not $hasMfaRelyingParty)
    {
        Write-Host $user.UserPrincipalName " is eligible for rollback" -ForegroundColor Yellow
        Write-Host "Rolling back user ..." -ForegroundColor Yellow
        Reset-MsolStrongAuthenticationMethodByUpn -UserPrincipalName $user.UserPrincipalName
        Write-Host "Successfully rolled back user " $user.UserPrincipalName -ForegroundColor Green
    }
    else
    {
        Write-Host $user.UserPrincipalName " is not eligible for rollback. No action required."
    }

    Write-Host ""
    Start-Sleep -Milliseconds 750
}

# Connect
Import-Module MSOnline
Connect-MsolService

foreach($line in Get-Content $path)
{
    RemediateUser -ObjectId $line
}
```

### Rollback

In a PowerShell window, run the following command after updating the highlighted locations. Enter global administrator credentials when prompted. The script will output the outcome of each user update operation.

`<script location> -path <user file location>`

## Disable preview experience

To disable the preview experience for your users, complete the following steps:

1. Sign in to the Azure portal as a global administrator or user administrator.
2. Browse to **Azure Active Directory**, **User settings**, **Manage settings for access panel preview features**.
3. Under **Users can use preview features for registering and managing security info**, set the selector to **None** and click **Save**.

Users will no longer be prompted to register using the preview experience.

## Next steps

[Learn more about the public preview of converged registration for self-service password reset and Azure Multi-Factor Authentication](concept-registration-mfa-sspr-converged.md)