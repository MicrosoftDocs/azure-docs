---
title: "Quickstart: Upload firmware images to Defender for IoT Firmware Analysis using Azure PowerShell"
description: "Learn how to upload firmware images for analysis using Azure PowerShell."
author: karengu0
ms.author: karenguo
ms.topic: quickstart
ms.date: 01/29/2024

---

# Quickstart: Upload firmware images to Defender for IoT Firmware Analysis using Azure PowerShell

This article explains how to use Azure PowerShell to upload firmware images to Defender for IoT Firmware Analysis.

[Defender for IoT Firmware Analysis](/azure/defender-for-iot/device-builders/overview-firmware-analysis) is a tool that analyzes firmware images and provides an understanding of security vulnerabilities in the firmware images.

## Prerequisites

This quickstart assumes a basic understanding of Defender for IoT Firmware Analysis. For more information, see [Firmware analysis for device builders](/azure/defender-for-iot/device-builders/overview-firmware-analysis). For a list of the file systems that are supported, see [Frequently asked Questions about Defender for IoT Firmware Analysis](../../../articles/defender-for-iot/device-builders/defender-iot-firmware-analysis-faq.md#what-types-of-firmware-images-does-defender-for-iot-firmware-analysis-support).

### Prepare your environment for Azure PowerShell

* [Install Azure PowerShell](/powershell/azure/install-azure-powershell) or [Use Azure Cloud Shell](/azure/cloud-shell/get-started/classic).

* Sign in to Azure PowerShell by running the command [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount). Skip this step if you're using Cloud Shell.

* If this is your first use of Defender for IoT Firmware Analysis's Azure PowerShell, install the extension:

    ```powershell
    Find-Module -Name Az.FirmwareAnalysis | Install-Module
    ```

* [Onboard](../../../articles/defender-for-iot/device-builders/tutorial-analyze-firmware.md#onboard-your-subscription-to-use-defender-for-firmware-analysis) your subscription to Defender for IoT Firmware Analysis.

* Run [Set-AzContext](/powershell/module/az.accounts/set-azcontext) to set your subscription to use in the current session. Select the subscription where you would like to upload your firmware images.

## Upload a firmware image to the workspace

1. Create a firmware image to be uploaded. Insert your resource group name, workspace name, and any additional details about your firmware image that you'd like into include in the respective parameters, such as a `Description`, `FileName`, `Vendor`, `Model`, or `Version`.

    ```powershell
    New-AzFirmwareAnalysisFirmware -ResourceGroupName myResourceGroup -WorkspaceName default -Description 'sample description' -FileName file -Vendor vendor -Model model -Version version
    ```

The output of this command includes a `Name` property, which is your firmware ID. **Save this ID for the next command.**

2. Generate a SAS URL that you'll use in the next step to send your firmware image to Azure Storage. Replace `sampleFirmwareID` with the firmware ID that you saved from the previous step. You can store the SAS URL in a variable for easier access for future commands:

    ```powershell
    $sasUrl = New-AzFirmwareAnalysisWorkspaceUploadUrl -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default
    ```

3. Use the following script to upload your firmware image to Azure Storage. Replace '`pathToFile`' with the path to your firmware image on your local machine. Wrap the path in quotation marks.

    ```powershell
    $uri = [System.Uri] $sasURL.Url
    $storageAccountName = $uri.DnsSafeHost.Split(".")[0]
    $container = $uri.LocalPath.Substring(1)
    $containerName, $blob = $container -split '/', 2
    $sasToken = $uri.Query
    $filePath = 'pathToFile'
    $storageContext = New-AzStorageContext -StorageAccountName $storageAccountName -SasToken $sasToken
    Set-AzStorageBlobContent -File $filePath -Container $containerName -Context $storageContext -Blob $blob -Force
    ```

Here's an example workflow from end-to-end of how you could use the Azure PowerShell commands to create and upload a firmware image. Replace the values for the variables set at the beginning to reflect your environment.

```powershell
$filePath='/path/to/image'
$resourceGroup='myResourceGroup'
$workspace='default'

$fileName='file1'
$vendor='vendor1'
$model='model'
$version='test'

$FWID = (New-AzFirmwareAnalysisFirmware -ResourceGroupName $resourceGroup -WorkspaceName $workspace -FileName $fileName -Vendor $vendor -Model $model -Version $version).Name

$sasUrl = New-AzFirmwareAnalysisWorkspaceUploadUrl -FirmwareId $FWID -ResourceGroupName $resourceGroup -WorkspaceName $workspace

$uri = [System.Uri] $sasURL.Url
$storageAccountName = $uri.DnsSafeHost.Split(".")[0]
$container = $uri.LocalPath.Substring(1)
$containerName, $blob = $container -split '/', 2
$sasToken = $uri.Query
$storageContext = New-AzStorageContext -StorageAccountName $storageAccountName -SasToken $sasToken
Set-AzStorageBlobContent -File $filePath -Container $containerName -Context $storageContext -Blob $blob -Force
```

## Retrieve firmware analysis results

To retrieve firmware analysis results, you must make sure that the status of the analysis is "Ready". Replace `sampleFirmwareID` with your firmware ID, `myResourceGroup` with your resource group name, and `default` with your workspace name:

```powershell
Get-AzFirmwareAnalysisFirmware -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default
```

Look for the "status" field to display "Ready", then run the respective commands to retrieve your firmware analysis results.

If you would like to automate the process of checking your analysis's status, you can use the following script to check the resource status periodically until it reaches "Ready". You can set the `$timeoutInSeconds` variable depending on the size of your image - larger images may take longer to analyze, so adjust this variable according to your needs.

```powershell
$ID = Get-AzFirmwareAnalysisFirmware -ResourceGroupName $resourceGroup -WorkspaceName default -FirmwareId $FWID | Select-Object -ExpandProperty Id

Write-Host "Successfully created a firmware image, recognized in Azure by this resource id: $ID."

$timeoutInSeconds = 10800
$startTime = Get-Date

while ($true) {
    $resource = Get-AzResource -ResourceId $ID
    $status = $resource.Properties.Status

    if ($status -eq 'ready') {
        Write-Host "Firmware analysis completed with status: $status"
        break
    }

    $elapsedTime = (Get-Date) - $startTime
    if ($elapsedTime.TotalSeconds -ge $timeoutInSeconds) {
        Write-Host "Timeout reached. Firmware analysis status: $status"
        break
    }

    Start-Sleep -Seconds 10
}
```

### SBOM

The following command retrieves the SBOM in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```powershell
Get-AzFirmwareAnalysisSbomComponent -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default
```

### Weaknesses

The following command retrieves CVEs found in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```powershell
Get-AzFirmwareAnalysisCve -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default 
```

### Binary hardening

The following command retrieves analysis results on binary hardening in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```powershell
Get-AzFirmwareAnalysisBinaryHardening -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default 
```

### Password hashes

The following command retrieves password hashes in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```powershell
Get-AzFirmwareAnalysisPasswordHash -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default 
```

### Certificates

The following command retrieves vulnerable crypto certificates that were found in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```powershell
Get-AzFirmwareAnalysisCryptoCertificate -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default 
```

### Keys

The following command retrieves vulnerable crypto keys that were found in your firmware image. Replace each argument with the appropriate value for your resource group, subscription, workspace name, and firmware ID.

```powershell
Get-AzFirmwareAnalysisCryptoKey -FirmwareId sampleFirmwareID -ResourceGroupName myResourceGroup -WorkspaceName default 
```