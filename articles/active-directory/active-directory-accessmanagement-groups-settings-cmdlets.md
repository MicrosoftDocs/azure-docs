---
title: Configure group settings using Azure Active Directory cmdlets | Microsoft Docs
description: How manage the settings for groups using Azure Active Directory cmdlets.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: 9f2090e6-3af4-4f07-bbb2-1d18dae89b73
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 04/05/2017
ms.author: curtand

---
# Azure Active Directory cmdlets for configuring group settings

> [!IMPORTANT]
> This content applies only to Unified groups, also known as Office 365 groups. These cmdlets are in Public Preview at this moment.

Office 365 Groups settings are configured using a Settings object and a SettingsTemplate object. Initially, you will not see any Settings objects in your directory. This means your directory is configured with the default settings. To change the default settings, you must create a new settings object using a settings template. Settings templates are defined by Microsoft. There are several different settings templates. To configure group settings for your directory, you will use the template named "Group.Unified". To configure group settings on a single group, use the template named "Group.Unified.Guest". This template is used to manage guest access to a group. 

The cmdlets are part of the Azure Active Directory PowerShell V2 module. For more information about this module and for instructions how to download and install the module on your computer, please refer to [Azure Active Directory PowerShell Version 2](https://docs.microsoft.com/powershell/azuread/). Please note that since these cmdlets are in public preview right now you will need to install the preview release of the module, which can be found [here](https://www.powershellgallery.com/packages/AzureADPreview/2.0.0.85).

## Create settings at the directory level
These steps create settings at directory level, which apply to all Unified groups in the directory.

1. In the DirectorySettings cmdlets you will need to specify the ID of the SettingsTemplate you want to use. If you do not know this ID, this cmdlet returns the list of all settings templates:
  
  ```
  PS C:> Get-AzureADDirectorySettingTemplate
  ```
  This cmdlet call returns all templates that are available:
  
  ```
  Id                                   DisplayName         Description
  --                                   -----------         -----------
  62375ab9-6b52-47ed-826b-58e47e0e304b Group.Unified       ...
  08d542b9-071f-4e16-94b0-74abb372e3d9 Group.Unified.Guest Settings for a specific Unified Group
  16933506-8a8d-4f0d-ad58-e1db05a5b929 Company.BuiltIn     Setting templates define the different settings that can be used for the associ...
  4bc7f740-180e-4586-adb6-38b2e9024e6b Application...
  898f1161-d651-43d1-805c-3b0b388a9fc2 Custom Policy       Settings ...
  5cf42378-d67d-4f36-ba46-e8b86229381d Password Rule       Settings ...
  ```
2. To add a usage guideline URL, first you need to get the SettingsTemplate object that defines the usage guideline URL value; that is, the Group.Unified template:
  
  ```
  $Template = Get-AzureADDirectorySettingTemplate -Id 62375ab9-6b52-47ed-826b-58e47e0e304b
  ```
3. Next, create a new settings object based on that template:
  
  ```
  $Setting = $template.CreateDirectorySetting()
  ```  
4. Then update the usage guideline value:
  
  ```
  $setting["UsageGuidelinesUrl"] = "<https://guideline.com>"
  ```  
5. Finally, apply the settings:
  
  ```
  New-AzureADDirectorySetting -DirectorySetting $settings
  ```

Upon successful completion, the cmdlet returns the ID of the new settings object:
  ```
  Id                                   DisplayName TemplateId                           Values
  --                                   ----------- ----------                           ------
  c391b57d-5783-4c53-9236-cefb5c6ef323             62375ab9-6b52-47ed-826b-58e47e0e304b {class SettingValue {...
  ```
Here are the settings defined in the Group.Unified SettingsTemplate.

| **Setting** | **Description** |
| --- | --- |
|  <ul><li>EnableGroupCreation<li>Type: Boolean<li>Default: True |The flag indicating whether Unified Group creation is allowed in the directory. |
|  <ul><li>GroupCreationAllowedGroupId<li>Type: String<li>Default: “” |GUID of the security group for which the members are allowed to create Unified Groups even when EnableGroupCreation == false. |
|  <ul><li>UsageGuidelinesUrl<li>Type: String<li>Default: “” |A link to the Group Usage Guidelines. |
|  <ul><li>ClassificationDescriptions<li>Type: String<li>Default: “” | A comma-delimited list of classification descriptions. |
|  <ul><li>DefaultClassification<li>Type: String<li>Default: “” | The classification that is to be used as the default classification for a group if none was specified.|
|  <ul><li>PrefixSuffixNamingRequirement<li>Type: String<li>Default: “” |Not implemented yet
|  <ul><li>AllowGuestsToBeGroupOwner<li>Type: Boolean<li>Default: False | Boolean indicating whether or not a guest user can be an owner of groups. |
|  <ul><li>AllowGuestsToAccessGroups<li>Type: Boolean<li>Default: True | Boolean indicating whether or not a guest user can have access to Unified groups' content. |
|  <ul><li>GuestUsageGuidelinesUrl<li>Type: String<li>Default: “” | The url of a link to the guest usage guidelines. |
|  <ul><li>AllowToAddGuests<li>Type: Boolean<li>Default: True | A boolean indicating whether or not is is allowed to add guests to this directory.|
|  <ul><li>ClassificationList<li>Type: String<li>Default: “” |A comma-delimited list of valid classification values that can be applied to Unified Groups. |
|  <ul><li>EnableGroupCreation<li>Type: Boolean<li>Default: True | A boolean indicating whether or not non-admin users can create new Unified groups. |


## Read settings at the directory level
These steps read settings at directory level, which apply to all Office groups in the directory.

1. Read all existing directory settings:
  ```
  Get-AzureADDirectorySetting -All $True
  ```
  This cmdlet returns a list of all directory settings:
  ```
  Id                                   DisplayName   TemplateId                           Values
  --                                   -----------   ----------                           ------
  c391b57d-5783-4c53-9236-cefb5c6ef323 Group.Unified 62375ab9-6b52-47ed-826b-58e47e0e304b {class SettingValue {...
  ```

2. Read all settings for a specific group:
  ```
  Get-AzureADObjectSetting -TargetObjectId ab6a3887-776a-4db7-9da4-ea2b0d63c504 -TargetType Groups
  ```

3. Read all directory settings values of a specific directory settings object, using Settings Id GUID:
  ```
  (Get-AzureADDirectorySetting -Id c391b57d-5783-4c53-9236-cefb5c6ef323).values
  ```
  This cmdlet returns the names and values in this settings object for this specific group:
  ```
  Name                          Value
  ----                          -----
  ClassificationDescriptions
  DefaultClassification
  PrefixSuffixNamingRequirement
  AllowGuestsToBeGroupOwner     False 
  AllowGuestsToAccessGroups     True
  GuestUsageGuidelinesUrl
  GroupCreationAllowedGroupId
  AllowToAddGuests              True
  UsageGuidelinesUrl            <https://guideline.com>
  ClassificationList
  EnableGroupCreation           True
  ```

## Update settings for a specific group

1. Search for the settings template named "Groups.Unified.Guest"
  ```
  Get-AzureADDirectorySettingTemplate
  
  Id                                   DisplayName            Description
  --                                   -----------            -----------
  62375ab9-6b52-47ed-826b-58e47e0e304b Group.Unified          ...
  08d542b9-071f-4e16-94b0-74abb372e3d9 Group.Unified.Guest    Settings for a specific Unified Group
  4bc7f740-180e-4586-adb6-38b2e9024e6b Application            ...
  898f1161-d651-43d1-805c-3b0b388a9fc2 Custom Policy Settings ...
  5cf42378-d67d-4f36-ba46-e8b86229381d Password Rule Settings ...
  ```
2. Retrieve the template object for the Groups.Unified.Guest template:
  ```
  $Template = Get-AzureADDirectorySettingTemplate -Id 08d542b9-071f-4e16-94b0-74abb372e3d9
  ```
3. Create a new settings object from the template:
  ```
  $Setting = $Template.CreateDirectorySetting()
  ```

4. Set the setting to the required value:
  ```
  $Setting["AllowToAddGuests"]=$False
  ```
5. Create the new setting for the required group in the directory:
  ```
  New-AzureADObjectSetting -TargetType Groups -TargetObjectId ab6a3887-776a-4db7-9da4-ea2b0d63c504 -DirectorySetting $Setting
  
  Id                                   DisplayName TemplateId                           Values
  --                                   ----------- ----------                           ------
  25651479-a26e-4181-afce-ce24111b2cb5             08d542b9-071f-4e16-94b0-74abb372e3d9 {class SettingValue {...
  ```

## Update settings at the directory level

These steps update settings at directory level, which apply to all Unified groups in the directory. These examples assume there is already a Settings object in your directory.

1. Find the existing Settings object:
  ```
  Get-AzureADDirectorySetting | Where-object -Property Displayname -Value "Group.Unified" -EQ
  
  Id                                   DisplayName   TemplateId                           Values
  --                                   -----------   ----------                           ------
  c391b57d-5783-4c53-9236-cefb5c6ef323 Group.Unified 62375ab9-6b52-47ed-826b-58e47e0e304b {class SettingValue {...
  
  $setting = Get-AzureADDirectorySetting –Id c391b57d-5783-4c53-9236-cefb5c6ef323
  ```
2. Update the value:
  
  ```
  $Setting["AllowToAddGuests"] = "false"
  ```
3. Update the setting:
  
  ```
  Set-AzureADDirectorySetting -Id c391b57d-5783-4c53-9236-cefb5c6ef323 -DirectorySetting $Setting
  ```

## Remove settings at the directory level
This step removes settings at directory level, which apply to all Office groups in the directory.
  ```
  Remove-AzureADDirectorySetting –Id c391b57d-5783-4c53-9236-cefb5c6ef323c
  ```

## Cmdlet syntax reference
You can find more Azure Active Directory PowerShell documentation at [Azure Active Directory Cmdlets](/powershell/azure/install-adv2?view=azureadps-2.0).

## Additional reading

* [Managing access to resources with Azure Active Directory groups](active-directory-manage-groups.md)
* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
