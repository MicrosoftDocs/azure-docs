---
title: Add a new Azure Stack tenant account in Azure Active Directory | Microsoft Docs
description: After deploying Microsoft Azure Stack POC, you’ll need to create at least one tenant user account so you can explore the tenant portal.
services: azure-stack
documentationcenter: ''
author: heathl17
manager: byronr
editor: ''

ms.assetid: a75d5c88-5b9e-4e9a-a6e3-48bbfa7069a7
ms.service: azure-stack
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 07/10/2017
ms.author: helaw

---
# Add a new Azure Stack tenant account in Azure Active Directory
After [deploying the Azure Stack Development Kit](azure-stack-run-powershell-script.md), you'll need a tenant user account so you can explore the tenant portal and test your offers and plans. You can create a tenant account by [using the Azure portal](#create-an-azure-stack-tenant-account-using-the-azure-portal) or by [using PowerShell](#create-an-azure-stack-tenant-account-using-powershell).

## Create an Azure Stack tenant account using the Azure portal
You must have an Azure subscription to use the Azure portal.

1. Log in to [Azure](http://manage.windowsazure.com).
2. In Microsoft Azure left navigation bar, click **Active Directory**.
3. In the directory list, click the directory that you want to use for Azure Stack, or create a new one.
4. On this directory page, click **Users**.
5. Click **Add user**.
6. In the **Add user** wizard, in the **Type of user** list, choose **New user in your organization**.
7. In the **User name** box, type a name for the user.
8. In the **@** box, choose the appropriate entry.
9. Click the next arrow.
10. In the **User profile** page of the wizard, type a **First name**, **Last name**, and **Display name**.
11. In the **Role** list, choose **User**.
12. Click the next arrow.
13. On the **Get temporary password** page, click **Create**.
14. Copy the **New password**.
15. Log in to Microsoft Azure with the new account. Change the password when prompted.
16. Log in to `https://portal.local.azurestack.external` with the new account to see the tenant portal.

## Create an Azure Stack tenant account using PowerShell
If you don't have an Azure subscription, you can't use the Azure portal to add a tenant user account. In this case, you can use the Azure Active Directory Module for Windows PowerShell instead.

> [!NOTE]
> If you are using Microsoft Account (Live ID) to deploy Azure Stack Development Kit, you can't use AAD PowerShell to create tenant account. 
> 
> 

1. Install the [Microsoft Online Services Sign-In Assistant for IT Professionals RTW](https://www.microsoft.com/en-us/download/details.aspx?id=41950).
2. Install the [Azure Active Directory Module for Windows PowerShell (64-bit version)](http://go.microsoft.com/fwlink/p/?linkid=236297) and open it.
3. Run the following cmdlets:

    ```powershell
    # Provide the AAD credential you use to deploy Azure Stack Development Kit

            $msolcred = get-credential

    # Add a tenant account "Tenant Admin <username>@<yourdomainname>" with the initial password "<password>".

            connect-msolservice -credential $msolcred
            $user = new-msoluser -DisplayName "Tenant Admin" -UserPrincipalName <username>@<yourdomainname> -Password <password>
            Add-MsolRoleMember -RoleName "Company Administrator" -RoleMemberType User -RoleMemberObjectId $user.ObjectId

    ```

1. Sign in to Microsoft Azure with the new account. Change the password when prompted.
2. Sign in to `https://portal.local.azurestack.external` with the new account to see the tenant portal.

