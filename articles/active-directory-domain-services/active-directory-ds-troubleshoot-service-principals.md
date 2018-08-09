---
title: 'Azure Active Directory Domain Services: Troubleshooting Service Principal configuration| Microsoft Docs'
description: Troubleshooting Service Principal configuration for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager:
editor:

ms.assetid: f168870c-b43a-4dd6-a13f-5cfadc5edf2c
ms.service: active-directory
ms.component: domain-services
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 03/12/2018
ms.author: ergreenl

---
# Troubleshoot invalid Service Principal configuration for your managed domain

This article helps you troubleshoot and resolve service principal-related configuration errors that result in the following alert message:

## Alert AADDS102: Service Principal not found

**Alert message:** *A Service Principal required for Azure AD Domain Services to function properly has been deleted from your Azure AD directory. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

[Service principals](../active-directory/develop/app-objects-and-service-principals.md) are applications that Microsoft uses to manage, update, and maintain your managed domain. If they are deleted, it breaks Microsoft's ability to service your domain.


## Check for missing service principals
Use the following steps to determine which service principals need to be recreated:

1. Navigate to the [Enterprise Applications - All Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps) page in the Azure portal.
2. In the **Show** dropdown, select **All Applications** and click **Apply**.
3. Using the following table, search for each application ID by pasting the ID into the search box and pressing enter. If the search results are empty, you must recreate the service principal by following the steps in the "resolution" column.

| Application ID | Resolution |
| :--- | :--- | :--- |
| 2565bd9d-da50-47d4-8b85-4c97f669dc36 | [Recreate a missing service principal with PowerShell](#recreate-a-missing-service-principal-with-powershell) |
| 443155a6-77f3-45e3-882b-22b3a8d431fb | [Re-register to the Microsoft.AAD namespace](#re-register-to-the-microsoft-aad-namespace-using-the-azure-portal) |
| abba844e-bc0e-44b0-947a-dc74e5d09022  | [Re-register to the Microsoft.AAD namespace](#re-register-to-the-microsoft-aad-namespace-using-the-azure-portal) |
| d87dcbc6-a371-462e-88e3-28ad15ec4e64 | [Service principals that self correct](#service-principals-that-self-correct) |

## Recreate a missing Service Principal with PowerShell
Follow these steps if a service principal with the ID ```2565bd9d-da50-47d4-8b85-4c97f669dc36``` is missing from your Azure AD directory.

**Resolution:**
You need Azure AD PowerShell to complete these steps. For information on installing Azure AD PowerShell, see [this article](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0.).

To address this issue, type the following commands in a PowerShell window:
1. Install the Azure AD PowerShell module and import it.

    ```powershell
    Install-Module AzureAD
    Import-Module AzureAD
    ```

2. Check whether the service principal required for Azure AD Domain Services is missing in your directory by executing the following PowerShell command:

    ```powershell
    Get-AzureAdServicePrincipal -filter "AppId eq '2565bd9d-da50-47d4-8b85-4c97f669dc36'"
    ```

3. Create the service principal by typing the following PowerShell command:

    ```powershell
    New-AzureAdServicePrincipal -AppId "2565bd9d-da50-47d4-8b85-4c97f669dc36"
    ```

4. After you have created the missing service principal, wait two hours and check your managed domain's health.


## Re-register to the Microsoft AAD namespace using the Azure portal
Follow these steps if a service principal with the ID ```443155a6-77f3-45e3-882b-22b3a8d431fb``` or ```abba844e-bc0e-44b0-947a-dc74e5d09022``` is missing from your Azure AD directory.

**Resolution:**
Use the following steps to restore Domain Services on your directory:

1. Navigate to the [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) page in the Azure portal.
2. Choose the subscription from the table that is associated with your managed domain
3. Using the left-hand navigation, choose **Resource Providers**
4. Search for "Microsoft.AAD" in the table and click **Re-register**
5. To ensure the alert is resolved, view the health page for your managed domain in two hours.


## Service Principals that self correct
Follow these steps if a service principal with the ID ```d87dcbc6-a371-462e-88e3-28ad15ec4e64``` is missing from your Azure AD directory.

**Resolution:**
Azure AD Domain Services can detect when this specific service principal is missing, misconfigured, or deleted. The service automatically recreates this service principal. However, you will need to delete the application and object that worked with the deleted application, as when the certification rolls over, the application and object will no longer be able to be modified by the new service principal. This will lead to a new error on your domain. Follow the steps outlined in the [section for AADDS105](#alert-aadds105-password-synchronization-application-is-out-of-date) to prevent this problem. After, check your managed domain's health after two hours to ensure that the new service principal has been recreated.


## Alert AADDS105: Password synchronization application is out of date

**Alert message:** The service principal with the application ID “d87dcbc6-a371-462e-88e3-28ad15ec4e64” was deleted and then recreated. The recreation leaves behind inconsistent permissions on Azure AD Domain Services resources needed to service your managed domain. Synchronization of passwords on your managed domain could be affected.


**Resolution:**
You need Azure AD PowerShell to complete these steps. For information on installing Azure AD PowerShell, see [this article](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2?view=azureadps-2.0.).

To address this issue, type the following commands in a PowerShell window:
1. Install the Azure AD PowerShell module and import it.

    ```powershell
    Install-Module AzureAD
    Import-Module AzureAD
    ```
2. Delete the old application and object using the following PowerShell commands

    ```powershell
    $app = Get-AzureADApplication -Filter "IdentifierUris eq 'https://sync.aaddc.activedirectory.windowsazure.com'"
    Remove-AzureADApplication -ObjectId $app.ObjectId
    $spObject = Get-AzureADServicePrincipal -Filter "DisplayName eq 'Azure AD Domain Services Sync'"
    Remove-AzureADServicePrincipal -ObjectId $app.ObjectId
    ```
3. After you have deleted both, the system will remediate itself and recreate the applications needed for password synchronization. To ensure the alert has been remediated, wait two hours and check your domain's health.


## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
