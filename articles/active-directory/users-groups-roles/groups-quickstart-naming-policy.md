---
title: Add naming policy for Office 365 groups in Azure Active Directory | Microsoft Docs
description: Explains how to add new users or delete existing users in Azure Active Directory
services: active-directory
documentationcenter: ''
author: curtand
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.date: 08/08/2018
ms.author: curtand
ms.reviewer: kairaz.contractor
ms.custom: it-pro

#As an Azure AD identity administrator, I want to enforce naming policy on self-service groups, to help me sort and search in my tenant’s user-created groups. 
---
# Quickstart: Naming policy for groups in Azure Active Directory

In this quickstart, you will set up naming policy in your Azure Active Directory (Azure AD) tenant for user-created Office 365 groups, to help you sort and search your tenant’s groups. For example, you could use the naming policy to:

* Communicate the function of a group, membership, geographic region, or who created the group.
* Help categorize groups in the address book.
* Block specific words from being used in group names and aliases.

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Install PowerShell cmdlets

Be sure to uninstall any older version of the Azure Active Directory PowerShell for Graph Module for Windows PowerShell and install [Azure Active Directory PowerShell for Graph - Public Preview Release 2.0.0.137](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.137) before you run the PowerShell commands. 

1. Open the Windows PowerShell app as an administrator.
2. Uninstall any previous version of AzureADPreview.
  
  ````
  Uninstall-Module AzureADPreview
  ````
3. Install the latest version of AzureADPreview.
  
  ````
  Install-Module AzureADPreview
  ````
If you are prompted about accessing an untrusted repository, type **Y**. It might take few minutes for the new module to install.

## Set up naming policy

### Step 1: Sign in using PowerShell cmdlets

1. Open the Windows PowerShell app. You don't need elevated privileges.

2. Run the following commands to prepare to run the cmdlets.
  
  ````
  Import-Module AzureADPreview
  Connect-AzureAD
  ````
  In the **Sign in to your Account** screen that opens, enter your admin account and password to connect you to your service, and select **Sign in**.

3. Follow the steps in [Azure Active Directory cmdlets for configuring group settings](groups-settings-cmdlets.md) to create group settings for this tenant.

### Step 2: View the current settings

1. View the current naming policy settings.
  
  ````
  $Setting = Get-AzureADDirectorySetting -Id (Get-AzureADDirectorySetting | where -Property DisplayName -Value "Group.Unified" -EQ).id
  ````
  
2. Display the current group settings.
  
  ````
  $Setting.Values
  ````
  
### Step 3: Set the naming policy and any custom blocked words

1. Set the group name prefixes and suffixes in Azure AD PowerShell.
  
  ````
  $Setting["PrefixSuffixNamingRequirement"] =“GRP_[GroupName]_[Department]"
  ````
  
2. Set the custom blocked words that you want to restrict. The following example illustrates how you can add your own custom words.
  
  ````
  $Setting["CustomBlockedWordsList"]=“Payroll,CEO,HR"
  ````
  
3. Save the settings for the new policy to be effective, such as in the following example.
  
  ````
  Set-AzureADDirectorySetting -Id (Get-AzureADDirectorySetting | where -Property DisplayName -Value "Group.Unified" -EQ).id -DirectorySetting $Setting
  ````
  
That's it. You've set your naming policy and added your custom blocked words.

## Clean up resources

1. Set the group name prefixes and suffixes in Azure AD PowerShell.
  
  ````
  $Setting["PrefixSuffixNamingRequirement"] =""
  ````
  
2. Set the custom blocked words that you want to restrict. The following example illustrates how you can add your own custom words.
  
  ````
  $Setting["CustomBlockedWordsList"]=""
  ````
  
3. Save the settings for the new policy to be effective, such as in the following example.
  
  ````
  Set-AzureADDirectorySetting -Id (Get-AzureADDirectorySetting | where -Property DisplayName -Value "Group.Unified" -EQ).id -DirectorySetting $Setting
  ````

## Next steps

In this quickstart, you’ve learned how to use PowerShell cmdlets to set the naming policy for your Azure AD tenant.

For more information about technical constraints, adding a list of custom blocked words, or the end user experiences across Office 365 apps, advance to the next article to learn more about naming policy details.
> [!div class="nextstepaction"]
> [Naming policy all details](groups-naming-policy.md)