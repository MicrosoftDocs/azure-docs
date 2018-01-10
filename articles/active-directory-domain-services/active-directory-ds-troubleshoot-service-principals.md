---
title: 'Azure Active Directory Domain Services: Troubleshooting Service Principal Configuration| Microsoft Docs'
description: Troubleshooting Service Principal Configuration for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager:
editor:

ms.assetid: f168870c-b43a-4dd6-a13f-5cfadc5edf2c
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/10/2018
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Service Principal Configuration

To service, manage, and update your domain, Microsoft uses various [Service Principals](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects) to communicate with your tenant. If one is misconfigured or deleted, it can cause a disruption in your service.

## AADDS102: Service principal not found

**Message:** *A Service Principal required for Azure AD Domain Services to function properly has been deleted from your Azure AD tenant. This configuration impacts Microsoft's ability to monitor, manage, patch, and synchronize your managed domain.*

Service principals are applications that Microsoft uses to manage, update, and maintain your managed domain. If they are deleted, it breaks Microsoft's ability to service your domain. Use the preceding steps to determine which service principals need to be recreated.

1. Navigate to the [Enterprise Applications - All Applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps) page in the Azure portal.
2. Using the Show dropdown, select **All Applications** and click **Apply**.
3. Using the preceding table, search for each application ID by pasting the ID into the search box and pressing enter. If the search results are empty, you must recreate the service principal by following the steps in the "resolution" column. 

| Application ID | Resolution |
| :--- | :--- | :--- |
| 2565bd9d-da50-47d4-8b85-4c97f669dc36 | [Recreating a Missing Service Principal with PowerShell](#recreating-a-missing-service-principal-with-powershell) |
| 443155a6-77f3-45e3-882b-22b3a8d431fb | [Re-register to the Microsoft.AAD namespace](#Re-register-to-the-Microsoft.AAD-namespace-using-the-Azure-portal) |
| abba844e-bc0e-44b0-947a-dc74e5d09022  | [Re-register to the Microsoft.AAD namespace](#Re-register-to-the-Microsoft.AAD-namespace-using-the-Azure-portal) |
| d87dcbc6-a371-462e-88e3-28ad15ec4e64 | [Service Principals that Self Correct](#Service Principals that Self Correct) |

### Recreating a Missing Service Principal with PowerShell

*For IDs: 2565bd9d-da50-47d4-8b85-4c97f669dc36*

You need Azure AD PowerShell to complete these steps. For information on installing Azure AD PowerShell, see [this article](https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-adv2?view=azureadps-2.0.).

To address this issue, type the following commands in a PowerShell window:
1. Install-Module AzureAD
2. Import-Module AzureAD
3. Check whether the service principal required for Azure AD Domain Services is missing in your tenant by executing the following PowerShell command:

    `Get-AzureAdServicePrincipal -filter "AppId eq '%YOUR_APPLICATION_ID_HERE%'"`
4. Create the service principal by typing the following PowerShell command:

     `New-AzureAdServicePrincipal -AppId "%YOUR_APPLICATION_ID_HERE%"`
5. After you have created the missing Service Principal, wait two hours and check your domain's health.


### Re-register to the Microsoft.AAD namespace using the Azure portal

*For IDs: 443155a6-77f3-45e3-882b-22b3a8d431fb and abba844e-bc0e-44b0-947a-dc74e5d09022*


Use the following steps to restore Domain Services on your tenant:

1. Navigate to the [Subscriptions](https://portal.azure.com/#blade/Microsoft_Azure_Billing/SubscriptionsBlade) page in the Azure portal.
2. Choose the subscription from the table that is associated with your managed domain
3. Using the left-hand navigation, choose **Resource Providers**
4. Search for "Microsoft.AAD" in the table and click **Re-register**
5. Check your health blade in two hours to see if this has resolved your alert


### Service Principals that self correct

*For IDs: d87dcbc6-a371-462e-88e3-28ad15ec4e64*

Microsoft can identify when specific Service Principals are missing, misconfigured, or deleted. To remedy the service quickly, Microsoft will recreate the Service Principals itself. Check your domain's health after two hours to ensure that the principal has been recreated.

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
