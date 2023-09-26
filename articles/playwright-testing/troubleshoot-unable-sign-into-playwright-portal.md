---
title: '[Resolved] Trouble signing into Playwright portal'
description: How to resolve the having trouble signing you into the Playwright portal.
ms.topic: troubleshooting-problem-resolution
ms.date: 09/26/2023
---

# [Resolved] We're having trouble signing you into the Playwright portal

## Symptoms

When using Microsoft Playwright Testing, you try to sign into the Playwright portal and you receive the following error message:

**Sorry, but we're having trouble signing you in.**

## Cause

This issue occurs if the service principal for Microsoft Playwright Testing is disabled for the tenant.

## Resolution

Before you follow these steps, make sure that the following prerequisites are met:

- The steps are performed by a Microsoft 365 global administrator.

To resolve this issue, follow these steps:

1. Open an elevated Windows PowerShell command prompt (run Windows PowerShell as an administrator).
 
1. Install the Microsoft Azure Active Directory Module for Windows PowerShell by running the following cmdlet:

    ```powershell
    Install-Module -Name AzureAD
    ```

1. Connect to Azure AD for your Microsoft 365 subscription by running the following cmdlet:

    ```powershell
    Connect-MsolService
    ```

1. Check the current status of the service principal for Microsoft Playwright Testing by running the following cmdlet:

    ```powershell
    (Get-MsolServicePrincipal -AppPrincipalId b1fd4ebf-2bed-4162-be84-97e0fe523f64).accountenabled
    ```

2. Enable the service principal for Microsoft Playwright Testing by running the following cmdlet:

    ```powershell
    Get-MsolServicePrincipal -AppPrincipalId b1fd4ebf-2bed-4162-be84-97e0fe523f64 | Set-MsolServicePrincipal -AccountEnabled $true
    ```
