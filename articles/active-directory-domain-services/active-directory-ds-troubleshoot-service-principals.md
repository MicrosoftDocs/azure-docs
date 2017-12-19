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
ms.date: 12/18/2017
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Service Principal Configuration

To service, manage, and update your domain, Microsoft uses various [Service Principals](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects) to communicate with your tenant. If one is misconfigured or deleted, it can cause a disruption in your service.

Below is a picture of an example alert you would experience if a Service Principal was missing or misconfigured:



In order to correctly resolve this error, use the ID (boxed in red above) to select the correct set of resolution steps.


| ID Number | Solution |
| :-------- | :------- |
| 2565bd9d-da50-47d4-8b85-4c97f669dc36, id2, id3 | [Recreating a Missing Service Principal with PowerShell](#recreating-a-missing-service-principal-with-powershell) |
| id4, id5, id6 | [Enabling a Misconfigured Service Principal with the Portal](#Enabling a Misconfigured Service Principal with the Portal) |
| id7, id8, id9 | [Service Principals that Self Correct](#Service Principals that Self Correct) |




## Recreating a Missing Service Principal with PowerShell

*For IDs: 2565bd9d-da50-47d4-8b85-4c97f669dc36, id2, and id3*

You need Azure AD PowerShell to complete these steps. For information on installing Azure AD PowerShell, see [this article](https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-adv2?view=azureadps-2.0.).

To address this issue, type the following commands in a PowerShell window:
1. Install-Module AzureAD
2. Import-Module AzureAD
3. Check whether the service principal required for Azure AD Domain Services is missing in your tenant by executing the following PowerShell command:

    `Get-AzureAdServicePrincipal -filter "AppId eq '%YOUR_APPLICATION_ID_HERE%'"`
4. Create the service principal by typing the following PowerShell command:

     `New-AzureAdServicePrincipal -AppId "%YOUR_APPLICATION_ID_HERE%"`
5. After you have created the missing Service Principal, wait two hours and check your domain's health.

## Enabling a Misconfigured Service Principal with the Portal

*For IDs: id7 and id8*

Use the following steps to restore Domain Services on your tenant:

1. Navigate to the [Enterprise applications - All applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps/menuId/) page in the Azure portal.

2. In the All Applications list, filter the applications to show *Microsoft Applications* using the Show filter. Click **Apply**.

3. Search for the application with your application ID from the alert and click on the row to take you to that application's overview.

4. Click **Properties**.

5. Check to see if you have disabled the toggle that says "Enable for users to sign-in?."

6. Re-enable the application by toggling to "Yes."

7. After you have created the missing Service Principal, wait two hours and check your domain's health.


## Service Principals that Self Correct

*For IDs: id4, id5, and id6*

Microsoft can identify when specific Service Principals are missing, misconfigured, or deleted. To remedy the service quickly, Microsoft will recreate the Service Principals itself. Check your domain's health after two hours to ensure that the principal has been recreated.

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
