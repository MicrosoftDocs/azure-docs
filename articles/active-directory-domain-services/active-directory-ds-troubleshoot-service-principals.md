---
title: 'Azure Active Directory Domain Services: Troubleshooting Service Principal Configuration| Microsoft Docs'
description: Troubleshooting Service Principal Configuration for Azure AD Domain Services
services: active-directory-ds
documentationcenter: ''
author: eringreenlee
manager: mahesh-unnikrishnan
editor:

ms.assetid:
ms.service: active-directory-ds
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date:
ms.author: ergreenl

---
# Azure AD Domain Services - Troubleshooting Service Principal Configuration

To service, manage, and update your domain, Microsoft uses various [Service Principals](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-application-objects) to communicate with your tenant. If one is misconfigured or deleted, it can cause a disruption in your service. To troubleshoot when a Service Principal is deleted, choose the ID  in the preceding table that matches your Service Principal's ID.

| ID Number | Solution |
| :-------- | :------- |
| id1 | [Recreating a Missing Service Principal with PowerShell](#Recreating a Missing Service Principal with PowerShell) |
| id2 | [Enabling a Misconfigured Service Principal with the Portal](#Enabling a Misconfigured Service Principal with the Portal) |
| id3 | [Service Principals that Self Correct](#Service Principals that Self Correct) |




## Recreating a Missing Service Principal with PowerShell

*For IDs: id1, id2, and id3*

You need Azure AD PowerShell to complete these steps. For information on installing Azure AD PowerShell, see [this article](https://docs.microsoft.com/en-us/powershell/azure/active-directory/install-adv2?view=azureadps-2.0.).

To address this issue, type the following commands in a PowerShell window:
1. Install-Module AzureAD
2. Import-Module AzureAD
3. Check whether the service principal required for Azure AD Domain Services is missing in your tenant by executing the following PowerShell command:

    `Get-AzureAdServicePrincipal -filter "AppId eq '2565bd9d-da50-47d4-8b85-4c97f669dc36'"`

4. Create the service principal by typing the following PowerShell command:

     `New-AzureAdServicePrincipal -AppId "2565bd9d-da50-47d4-8b85-4c97f669dc36"`

After you have created the missing Service Principal, check your domain's health.

>[AZURE_NOTE] NOTE: Your domain's health is checked around every hour. You will need to wait until the next check to view your changes.

## Enabling a Misconfigured Service Principal with the Portal

*For IDs: id7 and id8*

Use the following steps to restore Domain Services on your tenant:

1. Travel and login to the Azure Portal (https://portal.azure.com)

2. Click on **Azure Active Directory** in the left-hand navigation

3. Click on **Enterprise Application** in the Azure Active Directory navigation.

4. Navigate to **All Applications** using the navigation panel.

5. In the All Applications list, filter the applications to show *Microsoft Applications* using the Show filter. Click **Apply**.

6. Search for the application with the ID xxxxxxxxxxxx and click on the row to take you to that application's overview.

7. Click **Properties**.

8. Check to see if you have disabled the toggle that says "Enable for users to sign-in?."

5. Re-enable the application by toggling to "Yes."

6. Re-enable Azure AD Domain Services.



## Service Principals that Self Correct

*For IDs: id4, id5, and id6*

Microsoft can identify when specific Service Principals are missing, misconfigured, or deleted. To remedy the service quickly, Microsoft will recreate the Service Principals itself.

## Contact Us
Contact the Azure Active Directory Domain Services product team to [share feedback or for support](active-directory-ds-contact-us.md).
