---
title: How to prepare an update to be imported into Azure Device Update for IoT Hub | Microsoft Docs
description: How-To guide for preparing to import a new update into Azure Device Update for IoT Hub.
author: andrewbrownmsft
ms.author: andbrown
ms.date: 1/28/2022
ms.topic: how-to
ms.service: iot-hub-device-update
---

# Prepare an update to import into Device Update for IoT Hub

Learn how to obtain a new update and prepare the update for importing into Device Update for IoT Hub.

## Prerequisites

* [Access to an IoT Hub with Device Update for IoT Hub enabled](create-device-update-account.md).
* An IoT device (or simulator) [provisioned for Device Update](device-update-agent-provisioning.md) within IoT Hub.
* [PowerShell 5](/powershell/scripting/install/installing-powershell) or later (includes Linux, macOS, and Windows installs)
* Supported browsers:
  * [Microsoft Edge](https://www.microsoft.com/edge)
  * Google Chrome

## Obtain an update for your devices

Now that you've set up Device Update and provisioned your devices, you'll need the update file(s) that you'll be deploying to those devices.

* If you’ve purchased devices from an Original Equipment Manufacturer (OEM) or solution integrator, that organization will most likely provide update files for you, without you needing to create the updates. Contact the OEM or solution integrator to find out how they make updates available.

* If your organization already creates software for the devices you use, that same group will be the ones to create the updates for that software.

When creating an update to be deployed using Device Update for IoT Hub, start with either the [image-based or package-based approach](understand-device-update.md#support-for-a-wide-range-of-update-artifacts) depending on your scenario.

## Create a basic Device Update import manifest

Once you have your update files, create an import manifest to describe the update. If you haven't already done so, be sure to familiarize yourself with the basic [import concepts](import-concepts.md). While it is possible to author an import manifest JSON manually using a text editor, this guide will use PowerShell as example.

> [!TIP]
> Try the [image-based](device-update-raspberry-pi.md), [package-based](device-update-ubuntu-agent.md), or [proxy update](device-update-howto-proxy-updates.md) tutorials if you haven't already done so. You can also just view sample import manifest files from those tutorials for reference.

1. Install the [Azure Command-Line Interface (CLI)](https://learn.microsoft.com/cli/azure/) if you haven't already done so.

2. Run the following commands after replacing the following sample parameter values with your own: **Provider, Name, Version, Compatibility Properties, Update Handler and associated properties, and file(s)**. See [Import schema and API information](import-schema.md) for details on what values you can use for each item. _In particular, be aware that the same exact set of compatibility properties cannot be used with more than one Provider and Name combination._

    ```azurecli
    az iot device-update update init v5
    `--update-provider <replace with your Provider> --update-name <replace with your update Name> --update-version <replace with your update Version> `
    `--compat manufacturer=<replace with the value your device will report> model=<replace with the value your device will report> `
    `--step handler=<replace with your chosen handler, such as microsoft/script:1, microsoft/swupdate:1, or microsoft/apt:1> properties=<replace with any desired handler properties (JSON-formatted), such as '{"installedCriteria": "1.0"}'> `
    `--file path=<replace with path(s) to your update file(s), including the full file name> `
    ```

Once you've created your import manifest and saved it as a JSON file, if you're ready to import your update, you can scroll to the Next steps link at the bottom of this page.

## Create an advanced Device Update import manifest for a proxy update

If your update is more complex, such as a [proxy update](device-update-proxy-updates.md), you may need to create multiple import manifests. You can use the same Azure CLI approach from the previous section to create both a _parent_ import manifest and some number of _child_ import manifests for complex updates. Run the following Azure CLI commands after replacing the sample parameter values with your own. See [Import schema and API information](import-schema.md) for details on what values you can use. In this example, there are three updates to be deployed to the device.

  ```powershell
    Import-Module $PSScriptRoot/AduUpdate.psm1 -ErrorAction Stop
    
    # We will use arbitrary files as update payload files.
    $childFile = "$env:TEMP/childFile.bin.txt"
    $parentFile = "$env:TEMP/parentFile.bin.txt"
    "This is a child update payload file." | Out-File $childFile -Force -Encoding utf8
    "This is a parent update payload file." | Out-File $parentFile -Force -Encoding utf8
    
    # ------------------------------
    # Create a child update
    # ------------------------------
    Write-Host 'Preparing child update ...'
    
    $microphoneUpdateId = New-AduUpdateId -Provider Contoso -Name Microphone -Version $UpdateVersion
    $microphoneCompat = New-AduUpdateCompatibility -Manufacturer Contoso -Model Microphone
    $microphoneInstallStep = New-AduInstallationStep -Handler 'microsoft/swupdate:1' -Files $childFile
    $microphoneUpdate = New-AduImportManifest -UpdateId $microphoneUpdateId `
                                                 -IsDeployable $false `
                                                 -Compatibility $microphoneCompat `
                                                 -InstallationSteps $microphoneInstallStep `
                                                 -ErrorAction Stop -Verbose:$VerbosePreference
    
    # ------------------------------
    # Create another child update
    # ------------------------------
    Write-Host 'Preparing another child update ...'
    
    $speakerUpdateId = New-AduUpdateId -Provider Contoso -Name Speaker -Version $UpdateVersion
    $speakerCompat = New-AduUpdateCompatibility -Manufacturer Contoso -Model Speaker
    $speakerInstallStep = New-AduInstallationStep -Handler 'microsoft/swupdate:1' -Files $childFile
    $speakerUpdate = New-AduImportManifest -UpdateId $speakerUpdateId `
                                              -IsDeployable $false `
                                              -Compatibility $speakerCompat `
                                              -InstallationSteps $speakerInstallStep `
                                              -ErrorAction Stop -Verbose:$VerbosePreference
    
    # ------------------------------------------------------------
    # Create the parent update which parents the child update above
    # ------------------------------------------------------------
    Write-Host 'Preparing parent update ...'
    
    $parentUpdateId = New-AduUpdateId -Provider Contoso -Name Toaster -Version $UpdateVersion
    $parentCompat = New-AduUpdateCompatibility -Manufacturer Contoso -Model Toaster
    $parentSteps = @()
    $parentSteps += New-AduInstallationStep -Handler 'microsoft/script:1' -Files $parentFile -HandlerProperties @{ 'arguments'='--pre'} -Description 'Pre-install script'
    $parentSteps += New-AduInstallationStep -UpdateId $microphoneUpdateId -Description 'Microphone Firmware'
    $parentSteps += New-AduInstallationStep -UpdateId $speakerUpdateId -Description 'Speaker Firmware'
    $parentSteps += New-AduInstallationStep -Handler 'microsoft/script:1' -Files $parentFile -HandlerProperties @{ 'arguments'='--post'} -Description 'Post-install script'
    
    $parentUpdate = New-AduImportManifest -UpdateId $parentUpdateId `
                                          -Compatibility $parentCompat `
                                          -InstallationSteps $parentSteps `
                                          -ErrorAction Stop -Verbose:$VerbosePreference
    
    # ------------------------------------------------------------
    # Write all to files
    # ------------------------------------------------------------
    Write-Host 'Saving manifest and update files ...'
    
    New-Item $Path -ItemType Directory -Force | Out-Null
    
    $microphoneUpdate | Out-File "$Path/$($microphoneUpdateId.Provider).$($microphoneUpdateId.Name).$($microphoneUpdateId.Version).importmanifest.json" -Encoding utf8
    $speakerUpdate | Out-File "$Path/$($speakerUpdateId.Provider).$($speakerUpdateId.Name).$($speakerUpdateId.Version).importmanifest.json" -Encoding utf8
    $parentUpdate | Out-File "$Path/$($parentUpdateId.Provider).$($parentUpdateId.Name).$($parentUpdateId.Version).importmanifest.json" -Encoding utf8
    
    Copy-Item $parentFile -Destination $Path -Force
    Copy-Item $childFile -Destination $Path -Force
    
    Write-Host "Import manifest JSON files saved to $Path" -ForegroundColor Green
    
    Remove-Item $childFile -Force -ErrorAction SilentlyContinue | Out-Null
    Remove-Item $parentFile -Force -ErrorAction SilentlyContinue | Out-Null
  ```

## Next steps

* [Import an update](import-update.md)
* [Learn about import concepts](import-concepts.md)
