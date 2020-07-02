---
title: Resolve service principal alerts in Azure AD Domain Services | Microsoft Docs
description: Learn how to troubleshoot service principal configuration alerts for Azure Active Directory Domain Services
services: active-directory-ds
author: iainfoulds
manager: daveba

ms.assetid: f168870c-b43a-4dd6-a13f-5cfadc5edf2c
ms.service: active-directory
ms.subservice: domain-services
ms.workload: identity
ms.topic: troubleshooting
ms.date: 09/20/2019
ms.author: iainfou

---
# Known issues: Service principal alerts in Azure Active Directory Domain Services

[Service principals](../active-directory/develop/app-objects-and-service-principals.md) are applications that the Azure platform uses to manage, update, and maintain an Azure Active Directory Domain Services (Azure AD DS) managed domain. If a service principal is deleted, functionality in the managed domain is impacted.

This article helps you troubleshoot and resolve service principal-related configuration alerts.

## Alert AADDS102: Service principal not found

### Alert message

*A Service Principal required for Azure AD Domain Services to function properly has been deleted from your Azure AD directory. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

If a required service principal is deleted, the Azure platform can't perform automated management tasks. The managed domain may not correctly apply updates or take backups.

### Check for missing service principals

To check which service principal is missing and needs to be recreated, complete the following steps:

1. In the Azure portal, select **Azure Active Directory** from the left-hand navigation menu.
1. Select **Enterprise applications**. Choose *All applications* from the **Application Type** drop-down menu, then select **Apply**.
1. Search for each of the application IDs. If no existing application is found, follow the *Resolution* steps to create the service principal or re-register the namespace.

    | Application ID | Resolution |
    | :--- | :--- |
    | 2565bd9d-da50-47d4-8b85-4c97f669dc36 | [Recreate a missing service principal](#recreate-a-missing-service-principal) |
    | 443155a6-77f3-45e3-882b-22b3a8d431fb | [Re-register the Microsoft.AAD namespace](#re-register-the-microsoft-aad-namespace) |
    | abba844e-bc0e-44b0-947a-dc74e5d09022 | [Re-register the Microsoft.AAD namespace](#re-register-the-microsoft-aad-namespace) |
    | d87dcbc6-a371-462e-88e3-28ad15ec4e64 | [Re-register the Microsoft.AAD namespace](#re-register-the-microsoft-aad-namespace) |

### Recreate a missing Service Principal

If application ID *2565bd9d-da50-47d4-8b85-4c97f669dc36* is missing from your Azure AD directory, use Azure AD PowerShell to complete the following steps. For more information, see [install Azure AD PowerShell](/powershell/azure/active-directory/install-adv2).

1. Install the Azure AD PowerShell module and import it as follows:

    ```powershell
    Install-Module AzureAD
    Import-Module AzureAD
    ```

1. Now recreate the service principal using the [New-AzureAdServicePrincipal][New-AzureAdServicePrincipal] cmdlet:

    ```powershell
    New-AzureAdServicePrincipal -AppId "2565bd9d-da50-47d4-8b85-4c97f669dc36"
    ```

The managed domain's health automatically updates itself within two hours and removes the alert.

### Re-register the Microsoft AAD namespace

If application ID *443155a6-77f3-45e3-882b-22b3a8d431fb*, *abba844e-bc0e-44b0-947a-dc74e5d09022*, or *d87dcbc6-a371-462e-88e3-28ad15ec4e64* is missing from your Azure AD directory, complete the following steps to re-register the *Microsoft.AAD* resource provider:

1. In the Azure portal, search for and select **Subscriptions**.
1. Choose the subscription associated with your managed domain.
1. From the left-hand navigation, choose **Resource Providers**.
1. Search for *Microsoft.AAD*, then select **Re-register**.

The managed domain's health automatically updates itself within two hours and removes the alert.

## Alert AADDS105: Password synchronization application is out of date

### Alert message

*The service principal with the application ID “d87dcbc6-a371-462e-88e3-28ad15ec4e64” was deleted and then recreated. The recreation leaves behind inconsistent permissions on Azure AD Domain Services resources needed to service your managed domain. Synchronization of passwords on your managed domain could be affected.*

Azure AD DS automatically synchronizes user accounts and credentials from Azure AD. If there's a problem with the Azure AD application used for this process, credential synchronization between Azure AD DS and Azure AD fails.

### Resolution

To recreate the Azure AD application used for credential synchronization, use Azure AD PowerShell to complete the following steps. For more information, see [install Azure AD PowerShell](/powershell/azure/active-directory/install-adv2).

1. Install the Azure AD PowerShell module and import it as follows:

    ```powershell
    Install-Module AzureAD
    Import-Module AzureAD
    ```

2. Now delete the old application and object using the following PowerShell cmdlets:

    ```powershell
    $app = Get-AzureADApplication -Filter "IdentifierUris eq 'https://sync.aaddc.activedirectory.windowsazure.com'"
    Remove-AzureADApplication -ObjectId $app.ObjectId
    $spObject = Get-AzureADServicePrincipal -Filter "DisplayName eq 'Azure AD Domain Services Sync'"
    Remove-AzureADServicePrincipal -ObjectId $spObject
    ```

After you delete both applications, the Azure platform automatically recreates them and tries to resume password synchronization. The managed domain's health automatically updates itself within two hours and removes the alert.

## Next steps

If you still have issues, [open an Azure support request][azure-support] for additional troubleshooting assistance.

<!-- INTERNAL LINKS -->
[azure-support]: ../active-directory/fundamentals/active-directory-troubleshooting-support-howto.md

<!-- EXTERNAL LINKS -->
[New-AzureAdServicePrincipal]: /powershell/module/AzureAD/New-AzureADServicePrincipal
