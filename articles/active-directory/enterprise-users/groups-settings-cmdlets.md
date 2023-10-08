---
title: Configure group settings using PowerShell
description: How manage the settings for groups using Microsoft Entra cmdlets
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino
ms.service: active-directory
ms.subservice: enterprise-users
ms.workload: identity
ms.topic: how-to
ms.date: 06/24/2022
ms.author: barclayn
ms.reviewer: krbain
ms.custom: it-pro, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
---
# Microsoft Entra cmdlets for configuring group settings

This article contains instructions for using PowerShell cmdlets to create and update groups in Microsoft Entra ID, part of Microsoft Entra. This content applies only to Microsoft 365 groups (sometimes called unified groups).

> [!IMPORTANT]
> Some settings require a Microsoft Entra ID P1 license. For more information, see the [Template settings](#template-settings) table.

For more information on how to prevent non-administrator users from creating security groups, set `Set-MsolCompanySettings -UsersPermissionToCreateGroupsEnabled $False` as described in [Set-MSOLCompanySettings](/powershell/module/msonline/set-msolcompanysettings).

Microsoft 365 groups settings are configured using a Settings object and a SettingsTemplate object. Initially, you don't see any Settings objects in your directory, because your directory is configured with the default settings. To change the default settings, you must create a new settings object using a settings template. Settings templates are defined by Microsoft. There are several different settings templates. To configure Microsoft 365 group settings for your directory, you use the template named "Group.Unified". To configure Microsoft 365 group settings on a single group, use the template named "Group.Unified.Guest". This template is used to manage guest access to a Microsoft 365 group. 

The cmdlets are part of the Azure Active Directory PowerShell V2 module. For instructions how to download and install the module on your computer, see the article [Azure Active Directory PowerShell Version 2](/powershell/azure/active-directory/overview). You can install the version 2 release of the module from [the PowerShell gallery](https://www.powershellgallery.com/packages/AzureAD/).

>[!Note]
>With the settings in place to restrict the addition of guests to Microsoft 365 Groups, administrators will still add guest users to Microsoft 365 Groups. The setting will restrict non-admin users from adding guest users to Microsoft 365 groups.

## Install PowerShell cmdlets

Be sure to uninstall any older version of the Azure Active Directory PowerShell for Graph module and install [Azure Active Directory PowerShell for Graph - Public Preview Release (later than 2.0.0.137)](https://www.powershellgallery.com/packages/AzureADPreview) before you run the PowerShell commands.

1. Open the Windows PowerShell app as an administrator.
2. Uninstall any previous version of AzureADPreview.
  
   ``` PowerShell
   Uninstall-Module AzureADPreview
   Uninstall-Module azuread
   ```

3. Install the latest version of AzureADPreview.
  
   ``` PowerShell
   Install-Module AzureADPreview
   ```
   
## Create settings at the directory level
These steps create settings at directory level, which apply to all Microsoft 365 groups in the directory. The Get-AzureADDirectorySettingTemplate cmdlet is available only in the [Azure AD PowerShell Preview module for Graph](https://www.powershellgallery.com/packages/AzureADPreview).

1. In the DirectorySettings cmdlets, you must specify the ID of the SettingsTemplate you want to use. If you do not know this ID, this cmdlet returns the list of all settings templates:
  
   ```powershell
   Get-AzureADDirectorySettingTemplate

   ```
   This cmdlet call returns all templates that are available:
  
   ``` PowerShell
   Id                                   DisplayName         Description
   --                                   -----------         -----------
   62375ab9-6b52-47ed-826b-58e47e0e304b Group.Unified       ...
   08d542b9-071f-4e16-94b0-74abb372e3d9 Group.Unified.Guest Settings for a specific Microsoft 365 group
   16933506-8a8d-4f0d-ad58-e1db05a5b929 Company.BuiltIn     Setting templates define the different settings that can be used for the associ...
   4bc7f740-180e-4586-adb6-38b2e9024e6b Application...
   898f1161-d651-43d1-805c-3b0b388a9fc2 Custom Policy       Settings ...
   5cf42378-d67d-4f36-ba46-e8b86229381d Password Rule       Settings ...
   ```
2. To add a usage guideline URL, first you need to get the SettingsTemplate object that defines the usage guideline URL value; that is, the Group.Unified template:
  
   ```powershell
   $TemplateId = (Get-AzureADDirectorySettingTemplate | where { $_.DisplayName -eq "Group.Unified" }).Id
   $Template = Get-AzureADDirectorySettingTemplate | where -Property Id -Value $TemplateId -EQ
   ```
3. Next, create a new settings object based on that template:
  
   ```powershell
   $Setting = $Template.CreateDirectorySetting()
   ```  
4. Then update the settings object with a new value. The two examples below change the usage guideline value and enable sensitivity labels. Set these or any other setting in the template as required:
  
   ```powershell
   $Setting["UsageGuidelinesUrl"] = "https://guideline.example.com"
   $Setting["EnableMIPLabels"] = "True"
   ```  
5. Then apply the setting:
  
   ```powershell
   New-AzureADDirectorySetting -DirectorySetting $Setting
   ```
6. You can read the values using:

   ```powershell
   $Setting.Values
   ```
   
## Update settings at the directory level
To update the value for UsageGuideLinesUrl in the setting template, read the current settings from Microsoft Entra ID, otherwise we could end up overwriting existing settings other than the UsageGuideLinesUrl.

1. Get the current settings from the Group.Unified SettingsTemplate:
   
   ```powershell
   $Setting = Get-AzureADDirectorySetting | ? { $_.DisplayName -eq "Group.Unified"}
   ```  
2. Check the current settings:
   
   ```powershell
   $Setting.Values
   ```
   
   Output:
   ```powershell
    Name                            Value
    ----                            -----
    EnableMIPLabels                 True
    CustomBlockedWordsList
    EnableMSStandardBlockedWords    False
    ClassificationDescriptions
    DefaultClassification
    PrefixSuffixNamingRequirement
    AllowGuestsToBeGroupOwner       False
    AllowGuestsToAccessGroups       True
    GuestUsageGuidelinesUrl
    GroupCreationAllowedGroupId
    AllowToAddGuests                True
    UsageGuidelinesUrl              https://guideline.example.com
    ClassificationList
    EnableGroupCreation             True
    NewUnifiedGroupWritebackDefault True
    ```
3. To remove the value of UsageGuideLinesUrl, edit the URL to be an empty string:
   
   ```powershell
   $Setting["UsageGuidelinesUrl"] = ""
   ```  
4. Save update to the directory:
   
   ```powershell
   Set-AzureADDirectorySetting -Id $Setting.Id -DirectorySetting $Setting
   ```  

## Template settings
Here are the settings defined in the Group.Unified SettingsTemplate. Unless otherwise indicated, these features require a Microsoft Entra ID P1 license. 

| **Setting** | **Description** |
| --- | --- |
|  <ul><li>EnableGroupCreation<li>Type: Boolean<li>Default: True |The flag indicating whether Microsoft 365 group creation is allowed in the directory by non-admin users. This setting does not require a Microsoft Entra ID P1 license.|
|  <ul><li>GroupCreationAllowedGroupId<li>Type: String<li>Default: "" |GUID of the security group for which the members are allowed to create Microsoft 365 groups even when EnableGroupCreation == false. |
|  <ul><li>UsageGuidelinesUrl<li>Type: String<li>Default: "" |A link to the Group Usage Guidelines. |
|  <ul><li>ClassificationDescriptions<li>Type: String<li>Default: "" | A comma-delimited list of classification descriptions. The value of ClassificationDescriptions is only valid in this format:<br>$setting["ClassificationDescriptions"] ="Classification:Description,Classification:Description"<br>where Classification matches an entry in the ClassificationList.<br>This setting does not apply when EnableMIPLabels == True.<br>Character limit for property ClassificationDescriptions is 300, and commas can't be escaped,
|  <ul><li>DefaultClassification<li>Type: String<li>Default: "" | The classification that is to be used as the default classification for a group if none was specified.<br>This setting does not apply when EnableMIPLabels == True.|
|  <ul><li>PrefixSuffixNamingRequirement<li>Type: String<li>Default: "" | String of a maximum length of 64 characters that defines the naming convention configured for Microsoft 365 groups. For more information, see [Enforce a naming policy for Microsoft 365 groups](groups-naming-policy.md). |
| <ul><li>CustomBlockedWordsList<li>Type: String<li>Default: "" | Comma-separated string of phrases that users will not be permitted to use in group names or aliases. For more information, see [Enforce a naming policy for Microsoft 365 groups](groups-naming-policy.md). |
| <ul><li>EnableMSStandardBlockedWords<li>Type: Boolean<li>Default: "False" | Deprecated. Do not use.
|  <ul><li>AllowGuestsToBeGroupOwner<li>Type: Boolean<li>Default: False | Boolean indicating whether or not a guest user can be an owner of groups. |
|  <ul><li>AllowGuestsToAccessGroups<li>Type: Boolean<li>Default: True | Boolean indicating whether or not a guest user can have access to Microsoft 365 groups content.  This setting does not require a Microsoft Entra ID P1 license.|
|  <ul><li>GuestUsageGuidelinesUrl<li>Type: String<li>Default: "" | The URL of a link to the guest usage guidelines. |
|  <ul><li>AllowToAddGuests<li>Type: Boolean<li>Default: True | A boolean indicating whether or not is allowed to add guests to this directory. <br>This setting may be overridden and become read-only if *EnableMIPLabels* is set to *True* and a guest policy is associated with the sensitivity label assigned to the group.<br>If the AllowToAddGuests setting is set to False at the organization level, any AllowToAddGuests setting at the group level is ignored. If you want to enable guest access for only a few groups, you must set AllowToAddGuests to be true at the organization level, and then selectively disable it for specific groups. |
|  <ul><li>ClassificationList<li>Type: String<li>Default: "" | A comma-delimited list of valid classification values that can be applied to Microsoft 365 groups. <br>This setting does not apply when EnableMIPLabels == True.|
|  <ul><li>EnableMIPLabels<li>Type: Boolean<li>Default: "False" |The flag indicating whether sensitivity labels published in Microsoft Purview compliance portal can be applied to Microsoft 365 groups. For more information, see [Assign Sensitivity Labels for Microsoft 365 groups](groups-assign-sensitivity-labels.md). |
|  <ul><li>NewUnifiedGroupWritebackDefault<li>Type: Boolean<li>Default: "True" |The flag that allows an admin to create new Microsoft 365 groups without setting the groupWritebackConfiguration resource type in the request payload. This setting is applicable when group writeback is configured in Microsoft Entra Connect.  "NewUnifiedGroupWritebackDefault" is a global Microfot 365 group setting. Default value is true. Updating the setting value to false will change the default writeback behavior for newly created Microsoft 365 groups, and will not change isEnabled property value for existing Microsoft 365 groups. Group admin will need to explicitly update the group isEnabled property value to change the writeback state for existing Microsoft 365 groups. |

## Example: Configure Guest policy for groups at the directory level
1. Get all the setting templates:
   ```powershell
   Get-AzureADDirectorySettingTemplate
   ```
2. To set guest policy for groups at the directory level, you need Group.Unified template
   ```powershell
   $Template = Get-AzureADDirectorySettingTemplate | where -Property Id -Value "62375ab9-6b52-47ed-826b-58e47e0e304b" -EQ
   ```
3. Next, create a new settings object based on that template:
  
   ```powershell
   $Setting = $template.CreateDirectorySetting()
   ```  
4. Then update AllowToAddGuests setting
   ```powershell
   $Setting["AllowToAddGuests"] = $False
   ```  
5. Then apply the setting:
  
   ```powershell
   Set-AzureADDirectorySetting -Id (Get-AzureADDirectorySetting | where -Property DisplayName -Value "Group.Unified" -EQ).id -DirectorySetting $Setting
   ```
6. You can read the values using:

   ```powershell
   $Setting.Values
   ```   

## Read settings at the directory level

If you know the name of the setting you want to retrieve, you can use the below cmdlet to retrieve the current settings value. In this example, we're retrieving the value for a setting named "UsageGuidelinesUrl." 

   ```powershell
   (Get-AzureADDirectorySetting).Values | Where-Object -Property Name -Value UsageGuidelinesUrl -EQ
   ```
These steps read settings at directory level, which apply to all Office groups in the directory.

1. Read all existing directory settings:
   ```powershell
   Get-AzureADDirectorySetting -All $True
   ```
   This cmdlet returns a list of all directory settings:
   ```powershell
   Id                                   DisplayName   TemplateId                           Values
   --                                   -----------   ----------                           ------
   c391b57d-5783-4c53-9236-cefb5c6ef323 Group.Unified 62375ab9-6b52-47ed-826b-58e47e0e304b {class SettingValue {...
   ```

2. Read all settings for a specific group:
   ```powershell
   Get-AzureADObjectSetting -TargetObjectId ab6a3887-776a-4db7-9da4-ea2b0d63c504 -TargetType Groups
   ```

3. Read all directory settings values of a specific directory settings object, using Settings ID GUID:
   ```powershell
   (Get-AzureADDirectorySetting -Id c391b57d-5783-4c53-9236-cefb5c6ef323).values
   ```
   This cmdlet returns the names and values in this settings object for this specific group:
   ```powershell
   Name                          Value
   ----                          -----
   ClassificationDescriptions
   DefaultClassification
   PrefixSuffixNamingRequirement
   CustomBlockedWordsList        
   AllowGuestsToBeGroupOwner     False 
   AllowGuestsToAccessGroups     True
   GuestUsageGuidelinesUrl
   GroupCreationAllowedGroupId
   AllowToAddGuests              True
   UsageGuidelinesUrl            https://guideline.example.com
   ClassificationList
   EnableGroupCreation           True
   ```

## Remove settings at the directory level
This step removes settings at directory level, which apply to all Office groups in the directory.
   ```powershell
   Remove-AzureADDirectorySetting –Id c391b57d-5783-4c53-9236-cefb5c6ef323c
   ```

## Create settings for a specific group

1. Search for the settings template named "Groups.Unified.Guest"
   ```powershell
   Get-AzureADDirectorySettingTemplate
  
   Id                                   DisplayName            Description
   --                                   -----------            -----------
   62375ab9-6b52-47ed-826b-58e47e0e304b Group.Unified          ...
   08d542b9-071f-4e16-94b0-74abb372e3d9 Group.Unified.Guest    Settings for a specific Microsoft 365 group
   4bc7f740-180e-4586-adb6-38b2e9024e6b Application            ...
   898f1161-d651-43d1-805c-3b0b388a9fc2 Custom Policy Settings ...
   5cf42378-d67d-4f36-ba46-e8b86229381d Password Rule Settings ...
   ```
2. Retrieve the template object for the Groups.Unified.Guest template:
   ```powershell
   $Template1 = Get-AzureADDirectorySettingTemplate | where -Property Id -Value "08d542b9-071f-4e16-94b0-74abb372e3d9" -EQ
   ```
3. Create a new settings object from the template:
   ```powershell
   $SettingCopy = $Template1.CreateDirectorySetting()
   ```

4. Set the setting to the required value:
   ```powershell
   $SettingCopy["AllowToAddGuests"]=$False
   ```
5. Get the ID of the group you want to apply this setting to:
   ```powershell
   $groupID= (Get-AzureADGroup -SearchString "YourGroupName").ObjectId
   ```
6. Create the new setting for the required group in the directory:
   ```powershell
   New-AzureADObjectSetting -TargetType Groups -TargetObjectId $groupID -DirectorySetting $SettingCopy
   ```
7. To verify the settings, run this command:
   ```powershell
   Get-AzureADObjectSetting -TargetObjectId $groupID -TargetType Groups | fl Values
   ```

## Update settings for a specific group
1. Get the ID of the group whose setting you want to update:
   ```powershell
   $groupID= (Get-AzureADGroup -SearchString "YourGroupName").ObjectId
   ```
2. Retrieve the setting of the group:
   ```powershell
   $Setting = Get-AzureADObjectSetting -TargetObjectId $groupID -TargetType Groups
   ```
3. Update the setting of the group as you need, e.g.
   ```powershell
   $Setting["AllowToAddGuests"] = $True
   ```
4. Then get the ID of the setting for this specific group:
   ```powershell
   Get-AzureADObjectSetting -TargetObjectId $groupID -TargetType Groups
   ```
   You will get a response similar to this:
   ```powershell
   Id                                   DisplayName            TemplateId                             Values
   --                                   -----------            -----------                            ----------
   2dbee4ca-c3b6-4f0d-9610-d15569639e1a Group.Unified.Guest    08d542b9-071f-4e16-94b0-74abb372e3d9   {class SettingValue {...
   ```
5. Then you can set the new value for this setting:
   ```powershell
   Set-AzureADObjectSetting -TargetType Groups -TargetObjectId $groupID -Id 2dbee4ca-c3b6-4f0d-9610-d15569639e1a -DirectorySetting $Setting
   ```
6. You can read the value of the setting to make sure it has been updated correctly:
   ```powershell
   Get-AzureADObjectSetting -TargetObjectId $groupID -TargetType Groups | fl Values
   ```

## Cmdlet syntax reference
You can find more Azure Active Directory PowerShell documentation at [Microsoft Entra Cmdlets](/powershell/azure/active-directory/install-adv2).
  
## Manage group settings using Microsoft Graph

To configure and manage group settings using Microsoft Graph, see the [groupSetting resource type](/graph/api/resources/groupsetting?view=graph-rest-1.0&preserve-view=true) and its associated methods.

## Additional reading

* [Managing access to resources with Microsoft Entra groups](../fundamentals/concept-learn-about-groups.md)
* [Integrating your on-premises identities with Microsoft Entra ID](../hybrid/whatis-hybrid-identity.md)
