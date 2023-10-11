---
title: '[Resolved] Trouble signing into Playwright portal'
description: 'How to resolve the issue with signing into the Playwright portal, which results in error code AADSTS7000112.'
ms.topic: troubleshooting-problem-resolution
ms.date: 10/04/2023
---

# [Resolved] AADSTS7000112: Application 'b1fd4ebf-2bed-4162-be84-97e0fe523f64'(PlaywrightServiceAADLogin) is disabled.

## Symptoms

When using Microsoft Playwright Testing, you fail to sign into the Playwright portal. You receive the following error message:

**AADSTS7000112: Application 'b1fd4ebf-2bed-4162-be84-97e0fe523f64'(PlaywrightServiceAADLogin) is disabled.**

## Cause

This issue occurs if the service principal for Microsoft Playwright Testing is disabled for the tenant.

## Resolution

To resolve this issue, you need to enable the service principal for Microsoft Playwright Testing for the tenant. 

> [!IMPORTANT]
> To enable the service principal, you need to be a tenant admin.

Follow these steps to enable the Microsoft Playwright Testing service principal:

1. Open an elevated Windows PowerShell command prompt (run Windows PowerShell as an administrator).
 
1. Install the Microsoft Azure Active Directory module for Windows PowerShell by running the following cmdlet:

    ```powershell
    Install-Module MSOnline
    ```

1. Connect to Microsoft Entra ID for your Microsoft 365 subscription by running the following cmdlet:

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
