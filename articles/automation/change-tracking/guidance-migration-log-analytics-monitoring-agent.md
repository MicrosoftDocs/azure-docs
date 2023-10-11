---
title: Migration guidance from Change Tracking and Analytics using Log Analytics to Azure Monitoring Agent
description: An overview on how to migrate from Change Tracking and Analytics using Log Analytics to Azure Monitoring Agent.
author: snehasudhirG
services: automation
ms.subservice: change-inventory-management
ms.topic: conceptual
ms.date: 09/14/2023
ms.author: sudhirsneha
---

# Migration guidance from Change Tracking and Analytics using Log Analytics to Change Tracking and Analytics using Azure Monitoring Agent

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: Azure Arc-enabled servers.

This article provides guidance to move from Change Tracking and Inventory using Log Analytics version of the Azure Monitoring Agent version.

## Prerequisites

- Ensure to have the Windows PowerShell console installed. Follow the steps to [install Windows PowerShell](https://learn.microsoft.com/powershell/scripting/windows-powershell/install/installing-windows-powershell?view=powershell-7.3).
- We recommend that you use PowerShell version 7.1.3 or higher.
- Obtain Read access for the specified workspace resources.
- Ensure that you have `Az.Accounts` and `Az.OperationalInsights` modules installed. The `Az.PowerShell` module is used to pull workspace agent configuration information.
- Ensure to have the Azure credentials to run `Connect-AzAccount` and `Select Az-Context` that set the context for the script to run.


## Limitations

Currently, the following aren't supported:
- For File Content changes-based settings, you have to migrate manually from LA version to AMA version of Change Tracking & Inventory. Follow the guidance listed in [Track file contents](manage-change-tracking.md#track-file-contents).
- Alerts that you configure using the Log Analytics Workspace must be [manually configured](configure-alerts.md).

## Migration guidance

Follow these steps to migrate using scripts.

1. Install the script to run to conduct migrations.
1. Ensure that the new workspace resource ID is different to the one with which it's associated to in the Change Tracking and Inventory using the LA version.
1. Migrate settings for the following data types:
    - Windows Services
    - Linux Files
    - Windows Files
    - Windows Registry
    - Linux Daemons
1. Generate and associates a new DCR to transfer the settings to the Change Tracking and Inventory using AMA.


## Onboarding to Change tracking and inventory using Azure Monitoring Agent

#### [Using Azure portal - for single VM](#tab/ct-single-vm)

1.	Sign in to the [Azure portal](https://portal.azure.com) and select your virtual machine
1. Under **Operations** ,  select **Change tracking**.
1. Select **Configure with AMA** and in the **Configure with Azure monitor agent**,  provide the **Log analytics workspace** and select **Migrate** to initiate the deployment.

:::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-vm-inline.png" alt-text="Screenshot of onboarding a single VM to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-single-vm-expanded.png":::

> [!NOTE]
> You can select up to 100 VMs to migrate to the new version.

#### [Using Azure portal - at scale](#tab/ct-at-scale)

1. Sign in to [Azure portal](https://portal.azure.com) and select your Automation account.
1. Under **Configuration Management**, select **Change tracking** and then select **Configure with AMA**.

   :::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/onboarding-at-scale-inline.png" alt-text="Screenshot of onboarding at scale to Change tracking and inventory using Azure monitoring agent." lightbox="media/guidance-migration-log-analytics-monitoring-agent/onboarding-at-scale-expanded.png":::

1. On the **Onboarding to Change Tracking with Azure Monitoring** page, you can view your automation account and list of machines that are currently on Log Analytics and ready to be onboarded to Azure Monitoring Agent
1. On the **Assess virtual machines** tab, select the machines and then select **Next**.
1. On **Assign workspace** tab, assign a new Log Analytics workspace ID. And select **Next**.
1. On **Review** tab, you can review the machines that are being onboarded and the new workspace.
1. Select  **Migrate** to initiate the deployment.

After a successful migration, select **Switch to CT&I with AMA** to compare both the LA and AMA experience.

:::image type="content" source="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-inline.png" alt-text="Screenshot switching between log analytics and azure monitoring agent after a successful migration." lightbox="media/guidance-migration-log-analytics-monitoring-agent/switch-versions-expanded.png":::

> [!NOTE] 
> You can migrate up to 150 VMs at scale. We recommend that after you onboard and assess your virtual machines on the new version, you may then uninstall the LA version and currently, we don’t support the migration of File Content.

#### [Using Azure policy](#tab/ct-policy)

Use the following script to onboard at scale:

```azurepowershell-interactive
[Monday 2:30 PM] Swati Devgan
Param(
    [Parameter(Mandatory = $True)]
    [string]$InputWorkspaceResourceId,
 
    [Parameter(Mandatory = $True)]
    [string]$OutputWorkspaceResourceId,
 
    [Parameter(Mandatory = $True)]
    [string]$OutputDCRName,
 
    [Parameter(Mandatory = $True)]
    [string]$OutputDCRLocation,
 
    [Parameter(Mandatory = $True)]
    [string]$OutputDCRTemplateFolderPath
)
#check if input workspaceID and output workspaceID are identical or not
if ($InputWorkspaceResourceId -eq $OutputWorkspaceResourceId) {
    Write-Host "The operation failed because the InputWorkspaceResourceId and the OutputWorkspaceResourceId are identical. Please specify a different OutputWorkspaceResourceId and try again. This is necessary to avoid overwriting the original data and to ensure data integrity." -ForegroundColor red
    throw "Terminating since above conditions were not met."
}
# token access function
function GetAccessToken {
    try {
        Connect-AzAccount -ErrorAction Stop
        $accessToken = (Get-AzAccessToken -ErrorAction Stop).Token
        return $accessToken
    }
    catch {
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor red
        exit
    }
  
}
#function to find pathtype(absolute or relative)
function TestPathType {
    param (
        [string]$Path
    )
    if ([System.IO.Path]::IsPathRooted($Path)) {
        return "Absolute Path"
    }
    else {
        return "Relative Path"
    }
}
# 1 parse and migrate windows tracking services
function GetWindowsTrackingServices {
    $ctv1FileResponse = Invoke-RestMethod "https://management.azure.com$($InputWorkspaceResourceId)/datasources?`$filter=kind+eq+%27ChangeTrackingServices%27&api-version=2015-11-01-preview"-Method Get -Headers $headers -UseBasicParsing -ContentType "application/json"
    # check if collectionTimeInterval is greater than 600 or not. if not make it 600(10 minutes)
    $cvtv1CollectionTimeInterval = if ($ctv1FileResponse.value.properties.CollectionTimeInterval -gt 600) { $ctv1FileResponse.value.properties.CollectionTimeInterval } else { 600 }
    $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.servicesSettings.serviceCollectionFrequency = $cvtv1CollectionTimeInterval
}
# 2 parse and migrate windows file settings
function GetWindowsFileSetting {
    $ctv1FileResponse = Invoke-RestMethod "https://management.azure.com$($InputWorkspaceResourceId)/datasources?`$filter=kind+eq+%27ChangeTrackingCustomPath%27&api-version=2015-11-01-preview"-Method Get -Headers $headers -UseBasicParsing -ContentType "application/json"
    $fileSettingObjectList = New-Object System.Collections.ArrayList
    foreach ($object in $ctv1FileResponse.value) {
        foreach ($objectProperties in $object.Properties) {
            $ctv2SettingObject = [PSCustomObject]@{
                name                  = $object.name
                enabled               = if ($objectProperties.enabled -eq "true") { $true } else { $false }
                description           = ""
                path                  = $objectProperties.path
                recurse               = if ($objectProperties.recurse -eq "true") { $true } else { $false }
                maxContentsReturnable = if ($objectProperties.maxContentsReturnable -eq 0) { 5000000 } else { $objectProperties.maxContentsReturnable }
                maxOutputSize         = if ($objectProperties.maxOutputSize -eq 0) { 500000 } else { $objectProperties.maxOutputSize }
                checksum              = $objectProperties.checksum
                pathType              = $objectProperties.pathType
                groupTag              = $objectProperties.groupTag
            }
            $fileSettingObjectList.Add($ctv2SettingObject) > $null
        }
    }
    $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.fileSettings.fileinfo = $fileSettingObjectList
}
# 3 parse and migrate windows registory settings
function GetWindowsRegistorySettings {
    $ctv1RegistryResponse = Invoke-RestMethod "https://management.azure.com$($InputWorkspaceResourceId)/datasources?`$filter=kind+eq+%27ChangeTrackingDefaultRegistry%27&api-version=2015-11-01-preview"-Method Get -Headers $headers -UseBasicParsing -ContentType "application/json"
    $registrySettingsObjectList = New-Object System.Collections.ArrayList
    foreach ($object in $ctv1RegistryResponse.value) {
        foreach ($objectProperties in $object.Properties) {
            $ctv2SettingObject = [PSCustomObject]@{
                name        = $object.name
                groupTag    = if ($objectProperties.groupTag -eq "") { "Recommended" }else { $objectProperties.groupTag }
                enabled     = if ($objectProperties.enabled -eq "true") { $true }else { $false }
                recurse     = if ($objectProperties.recurse -eq "true") { $true } else { $false }
                description = ""
                keyName     = $objectProperties.keyName
                valueName   = $objectProperties.valueName
            }
            $registrySettingsObjectList.Add($ctv2SettingObject) > $null
        }
    }
    $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.registrySettingsObjectList.registryInfo = $registrySettingsObjectList
}
# 4 parse and migrate linux file settings
function GetLinuxFileSettings {
    $ctv1LinuxFileResponse = Invoke-RestMethod "https://management.azure.com$($InputWorkspaceResourceId)/datasources?`$filter=kind+eq+%27ChangeTrackingLinuxPath%27&api-version=2015-11-01-preview"-Method Get -Headers $headers -UseBasicParsing -ContentType "application/json"
    $fileSettingObjectList = New-Object System.Collections.ArrayList
    foreach ($object in $ctv1LinuxFileResponse.value) {
        foreach ($objectProperties in $object.Properties) {
            $ctv2SettingObject = [PSCustomObject]@{
                name                  = $object.name
                enabled               = if ($objectProperties.enabled -eq "true") { $true } else { $false }
                destinationPath       = $objectProperties.destinationPath
                useSudo               = if ($objectProperties.useSudo -eq "true") { $true } else { $false }
                recurse               = if ($objectProperties.recurse -eq "true") { $true } else { $false }
                maxContentsReturnable = if ($objectProperties.maxContentsReturnable -eq 0) { 5000000 } else { $objectProperties.maxContentsReturnable }
                pathType              = $objectProperties.pathType
                type                  = $objectProperties.type
                links                 = $objectProperties.links
                maxOutputSize         = if ($objectProperties.maxOutputSize -eq 0) { 5 } else { $objectProperties.maxOutputSize }
                groupTag              = $objectProperties.groupTag
            }
            $fileSettingObjectList.Add($ctv2SettingObject) > $null
        }
    }
    $ctv2JsonObject.resources[0].properties.dataSources.extensions[1].extensionSettings.fileSettings.fileinfo = $fileSettingObjectList
}
# 5 parse and migrate global settings
function GetDataTypeConfiguration {
    $ctv1DatatypeConfigurationResponse = Invoke-RestMethod "https://management.azure.com$($InputWorkspaceResourceId)/datasources?`$filter=kind+eq+%27ChangeTrackingDataTypeConfiguration%27&api-version=2015-11-01-preview"-Method Get -Headers $headers -UseBasicParsing -ContentType "application/json"
    foreach ($object in $ctv1DatatypeConfigurationResponse.value) {
        if ($object.properties.DataTypeId -eq "Daemons") {
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[1].extensionSettings.enableServices = if ($object.Enabled -eq "false") { $false } else { $true }
        }
        if ($object.properties.DataTypeId -eq "Files") {
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[1].extensionSettings.enableFiles = if ($object.Enabled -eq "false") { $false } else { $true }
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.enableFiles = if ($object.Enabled -eq "false") { $false } else { $true }
        }
        if ($object.properties.DataTypeId -eq "Inventory") {
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[1].extensionSettings.enableInventory = if ($object.Enabled -eq "false") { $false } else { $true }
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.enableInventory = if ($object.Enabled -eq "false") { $false } else { $true }
        }
        if ($object.properties.DataTypeId -eq "Software") {
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[1].extensionSettings.enableSoftware = if ($object.Enabled -eq "false") { $false } else { $true }
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.enableSoftware = if ($object.Enabled -eq "false") { $false } else { $true }
        }
        if ($object.properties.DataTypeId -eq "Registry") {
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.enableRegistry = if ($object.Enabled -eq "false") { $false } else { $true }
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[1].extensionSettings.enableRegistry = $false
        }
        if ($object.properties.DataTypeId -eq "WindowsServices") {
            $ctv2JsonObject.resources[0].properties.dataSources.extensions[0].extensionSettings.enableServices = if ($object.Enabled -eq "false") { $false } else { $true }
        }
    }
}
#function to generate DCR arm template
function GetDcrArmTemplate {
    param (
        [Parameter(Mandatory = $true)][string] $paramDCRName,
        [Parameter(Mandatory = $true)][string] $paramWorkspaceId,
        [Parameter(Mandatory = $true)][string] $paramWorkspaceLocation
    )
    $schema = "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#"
    $contentVersion = "1.0.0.0"
    $dcrTemplate =
    [ordered]@{
        schema         = "$schema"
        contentVersion = "$contentVersion"
        parameters     = [ordered]@{
            dataCollectionRuleName = [ordered]@{
                type         = "string"
                metadata     = [ordered]@{
                    description = "Specifies the name of the data collection rule to create."
                }
                defaultValue = "$paramDCRName"
            }
            workspaceResourceId    = [ordered]@{
                type         = "string"
                metadata     = [ordered]@{
                    description = "Specifies the Azure resource ID of the Log Analytics workspace to use to store change tracking data."
                }
                defaultValue = "$paramWorkspaceId"
            }
            workspaceLocation      = [ordered]@{
                type         = "string"
                metadata     = [ordered]@{
                    description = "Specifies location of log analytic workspace"
                }
                defaultValue = "$paramWorkspaceLocation"
            }
        }
 
        resources      = @(
            [ordered]@{
                type       = "Microsoft.Insights/dataCollectionRules"
                apiVersion = "2021-04-01"
                name       = "[parameters('dataCollectionRuleName')]"
                location   = "[parameters('workspaceLocation')]"
                properties = [ordered]@{
                    description  = "Data collection rule for CT."
                    dataSources  = [ordered]@{
                        extensions = @(
                            [ordered]@{
                                streams           = @(
                                    "Microsoft-ConfigurationChange",
                                    "Microsoft-ConfigurationChangeV2",
                                    "Microsoft-ConfigurationData"
                                )
                                extensionName     = "ChangeTracking-Windows"
                                extensionSettings = [ordered]@{
                                    enableFiles                = $true
                                    enableSoftware             = $true
                                    enableRegistry             = $true
                                    enableServices             = $true
                                    enableInventory            = $true
                                    registrySettingsObjectList = [ordered]@{
                                        registryCollectionFrequency = 3000
                                        registryInfo                = @()
                                    }
                                    fileSettings               = [ordered]@{
                                        fileCollectionFrequency = 2700
                                        fileinfo                = @()
                                    }
                                    softwareSettings           = [ordered]@{
                                        softwareCollectionFrequency = 1800
                                    }
                                    inventorySettings          = [ordered]@{
                                        inventoryCollectionFrequency = 36000
                                    }
                                    servicesSettings           = [ordered]@{
                                        serviceCollectionFrequency = 1800
                                    }
                                }
                                name              = "CTDataSource-Windows"
                            },
                            [ordered]@{
                                streams           = @(
                                    "Microsoft-ConfigurationChange",
                                    "Microsoft-ConfigurationChangeV2",
                                    "Microsoft-ConfigurationData"
                                )
                                extensionName     = "ChangeTracking-Linux"
                                extensionSettings = [ordered]@{
                                    enableFiles       = $true
                                    enableSoftware    = $true
                                    enableRegistry    = $false
                                    enableServices    = $true
                                    enableInventory   = $true
                                    fileSettings      = [ordered]@{
                                        fileCollectionFrequency = 900
                                        fileInfo                = @()
                                    }
                                    softwareSettings  = [ordered]@{
                                        softwareCollectionFrequency = 300
                                    }
                                    inventorySettings = [ordered]@{
                                        inventoryCollectionFrequency = 36000
                                    }
                                    servicesSettings  = [ordered]@{
                                        serviceCollectionFrequency = 300
                                    }
                                }
                                name              = "CTDataSource-Linux"
                            }
                        )
                    }
                    destinations = [ordered]@{
                        logAnalytics = @(
                            [ordered]@{
                                workspaceResourceId = "[parameters('workspaceResourceId')]"
                                name                = "Microsoft-CT-Dest"
                            }
                        )
                    }
                    dataFlows    = @(
                        [ordered]@{
                            streams      = @(
                                "Microsoft-ConfigurationChange",
                                "Microsoft-ConfigurationChangeV2",
                                "Microsoft-ConfigurationData"
                            )
                            destinations = @(
                                "Microsoft-CT-Dest"
                            )
                        }
                    )
                }
            }
        )
    }
    $generatedDcr = New-Object -TypeName PSObject -Property $dcrTemplate
    return $generatedDcr
}
 
#start of script
Write-Host "SIGN IN TO YOUR ACCOUNT" -BackgroundColor white
 
# getting token
$token = GetAccessToken
$headers = @{
    Authorization = "Bearer " + $token[-1]
}
 
# creating DCR arm template pscustom object
$ctv2JsonObject = GetDcrArmTemplate -paramDCRName $OutputDCRName -paramWorkspaceId $OutputWorkspaceResourceId -paramWorkspaceLocation $OutputDCRLocation
 
#parsing and migrating settings from LA workspace to DCR
GetWindowsRegistorySettings
GetWindowsFileSetting
GetWindowsTrackingServices
GetLinuxFileSettings
GetDataTypeConfiguration
 
# Convert the custom object to JSON
$dcrJson = ConvertTo-Json -InputObject $ctv2JsonObject -Depth 32
 
# Save the JSON content to a file at a given path
Set-Content -Path "${OutputDCRTemplateFolderPath}/output.json" -Value $dcrJson
 
#get pathtype(absolute or relative)
$pathtype = TestPathType -Path $OutputDCRTemplateFolderPath
 
# End of script
Write-Host "`nSuccess!" -ForegroundColor green
Write-Output "Check your output folder! ($($pathtype):  $($OutputDCRTemplateFolderPath))"
 
```
---

## Parameters

**Parameter** | **Required** | **Description** |
--- | --- | --- | 
`InputWorkspaceResourceId`| Yes | Resource ID of the workspace associated to Change Tracking & Inventory with Log Analytics. |
`OutputWorkspaceResourceId`| Yes | Resource ID of the workspace associated to Change Tracking & Inventory with Azure Monitoring Agent. |
`OutputDCRName`| Yes | Custom name of the new DCR created. |
`OutputDCRLocation`| Yes | Azure location of the output workspace ID. |
`OutputDCRTemplateFolderPath`| Yes | Folder path where DCR templates are created. | 

## Disable Change tracking using Log Analytics

After you enable management of your virtual machines using Azure Automation Change Tracking and Inventory using Azure Monitoring Agent, you may decide to stop using it and remove the configuration from the account and linked Log Analytics workspace. [Learn more](remove-feature.md).
 
## Next steps
-  To enable from the Azure portal, see [Enable Change Tracking and Inventory from the Azure portal](../change-tracking/enable-vms-monitoring-agent.md).

