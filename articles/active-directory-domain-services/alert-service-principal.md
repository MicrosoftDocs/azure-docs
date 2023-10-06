---
title: Resolve service principal alerts in Microsoft Entra Domain Services | Microsoft Docs
description: Learn how to troubleshoot service principal configuration alerts for Microsoft Entra Domain Services
services: active-directory-ds
author: justinha
manager: amycolannino

ms.assetid: f168870c-b43a-4dd6-a13f-5cfadc5edf2c
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.custom: has-azure-ad-ps-ref
ms.topic: troubleshooting
ms.date: 09/15/2023
ms.author: justinha
---
# Known issues: Service principal alerts in Microsoft Entra Domain Services

[Service principals](/azure/active-directory/develop/app-objects-and-service-principals) are applications that the Azure platform uses to manage, update, and maintain a Microsoft Entra Domain Services managed domain. If a service principal is deleted, functionality in the managed domain is impacted.

This article helps you troubleshoot and resolve service principal-related configuration alerts.

## Alert AADDS102: Service principal not found

### Alert message

*A Service Principal required for Microsoft Entra Domain Services to function properly has been deleted from your Microsoft Entra directory. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

If a required service principal is deleted, the Azure platform can't perform automated management tasks. The managed domain may not correctly apply updates or take backups.

### Check for missing service principals

To check which service principal is missing and must be recreated, complete the following steps:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Enterprise applications**. Choose *All applications* from the **Application Type** drop-down menu, then select **Apply**.
1. Search for each of the following application IDs. For Azure Global, search for AppId value `2565bd9d-da50-47d4-8b85-4c97f669dc36`. For other Azure clouds, search for AppId value `6ba9a5d4-8456-4118-b521-9c5ca10cdf84`. If no existing application is found, follow the *Resolution* steps to create the service principal or re-register the namespace.

    | Application ID | Resolution |
    | :--- | :--- |
    | 2565bd9d-da50-47d4-8b85-4c97f669dc36 | [Recreate a missing service principal](#recreate-a-missing-service-principal) |
    | 443155a6-77f3-45e3-882b-22b3a8d431fb | [Re-register the `Microsoft.AAD` namespace](#re-register-the-microsoft-aad-namespace) |
    | abba844e-bc0e-44b0-947a-dc74e5d09022 | [Re-register the `Microsoft.AAD` namespace](#re-register-the-microsoft-aad-namespace) |
    | d87dcbc6-a371-462e-88e3-28ad15ec4e64 | [Re-register the `Microsoft.AAD` namespace](#re-register-the-microsoft-aad-namespace) |

### Recreate a missing Service Principal

If application ID *2565bd9d-da50-47d4-8b85-4c97f669dc36* is missing from your Microsoft Entra directory in Azure Global, use Azure AD PowerShell to complete the following steps. For other Azure clouds, use AppId value *6ba9a5d4-8456-4118-b521-9c5ca10cdf84*. For more information, see [Azure AD PowerShell](/powershell/azure/active-directory/install-adv2).

1. If needed, install the Azure AD PowerShell module and import it as follows:

    ```powershell
    Install-Module AzureAD
    Import-Module AzureAD
    ```

1. Now recreate the service principal using the [New-AzureAdServicePrincipal][New-AzureAdServicePrincipal] cmdlet:

    ```powershell
    New-AzureAdServicePrincipal -AppId "2565bd9d-da50-47d4-8b85-4c97f669dc36"
    ```

The managed domain's health automatically updates itself within two hours and removes the alert.

<a name='re-register-the-microsoft-aad-namespace'></a>

### Re-register the Microsoft Entra namespace

If application ID `443155a6-77f3-45e3-882b-22b3a8d431fb`, `abba844e-bc0e-44b0-947a-dc74e5d09022`, or `d87dcbc6-a371-462e-88e3-28ad15ec4e64` is missing from your Microsoft Entra directory, complete the following steps to re-register the `Microsoft.AAD` resource provider:

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), search for and select **Subscriptions**.
1. Choose the subscription associated with your managed domain.
1. From the left-hand navigation, choose **Resource Providers**.
1. Search for `Microsoft.AAD`, then select **Re-register**.

The managed domain's health automatically updates itself within two hours and removes the alert.

## Alert AADDS105: Password synchronization application is out of date

### Alert message

*The service principal with the application ID "d87dcbc6-a371-462e-88e3-28ad15ec4e64" was deleted and then recreated. The recreation leaves behind inconsistent permissions on Microsoft Entra Domain Services resources needed to service your managed domain. Synchronization of passwords on your managed domain could be affected.*

Domain Services automatically synchronizes user accounts and credentials from Microsoft Entra ID. If there's a problem with the Microsoft Entra application used for this process, credential synchronization between Domain Services and Microsoft Entra ID fails.

### Resolution

To recreate the Microsoft Entra application used for credential synchronization, use Azure AD PowerShell to complete the following steps. For more information, see [install Azure AD PowerShell](/powershell/azure/active-directory/install-adv2).

1. If needed, install the Azure AD PowerShell module and import it as follows:

    ```powershell
    Install-Module AzureAD
    Import-Module AzureAD
    ```

2. Now delete the old application and object using the following PowerShell cmdlets:

    ```powershell
    $app = Get-AzureADApplication -Filter "IdentifierUris eq 'https://sync.aaddc.activedirectory.windowsazure.com'"
    Remove-AzureADApplication -ObjectId $app.ObjectId
    $spObject = Get-AzureADServicePrincipal -Filter "DisplayName eq 'Azure AD Domain Services Sync'"
    Remove-AzureADServicePrincipal -ObjectId $spObject
    ```

After you delete both applications, the Azure platform automatically recreates them and tries to resume password synchronization. The managed domain's health automatically updates itself within two hours and removes the alert.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for additional troubleshooting assistance.

<!-- INTERNAL LINKS -->
[azure-support]: /azure/active-directory/fundamentals/how-to-get-support

<!-- EXTERNAL LINKS -->
[New-AzureAdServicePrincipal]: /powershell/module/azuread/new-azureadserviceprincipal
