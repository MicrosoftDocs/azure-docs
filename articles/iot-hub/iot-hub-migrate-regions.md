---
title: Migrate IoT hub across Azure regions
description: This article provides information about migrating your Azure IoT Hub resource from one Azure region to another.
author: jlian
ms.service: iot-hub
services: iot-hub
ms.topic: conceptual
ms.date: 06/10/2019
ms.author: jlian
---

# Migrate or move IoT Hub from one Azure region to another

To migrate IoT Hub across Azure regions, re-create the IoT Hub and use the export/import device identities function. The migration isn't seamless, and doesn't transfer telemetry messages, C2D commands, and job-related information (schedules and history). You must also reconfigure your devices and back-end applications to start using the new connection strings.

## Step 1: Migrate the IoT hub

IoT Hub doesn't support cloning natively, so you must re-create the IoT hub in the target region. 

1. Use the Azure Resource Manager feature to [export a resource group as a template](../azure-resource-manager/manage-resource-groups-portal.md#export-resource-groups-to-templates). Configured routes and other IoT hub settings are included in the exported metadata. 
1. In the exported JSON file, change the `location` property of the IoT hub to your target region.
1. [Redeploy the template](../azure-resource-manager/resource-group-template-deploy-portal.md). 

You might find it easier to re-create the IoT hub in the Azure portal by looking at the details in the exported JSON.

## Step 2: Migrate device identities

To migrate device identities:

1. From the original IoT hub, use the [ExportDevices](iot-hub-bulk-identity-mgmt.md) Resource Manager API to export all device identities (including the keys), device twins, and module twins to a storage container. You can use a storage container in either the source or the target Azure region. Make sure that the generated shared access signature (SAS) URI has sufficient permissions.
1. Run the [ImportDevices](iot-hub-bulk-identity-mgmt.md) Resource Manager API to import all device identities from the storage container to the new IoT hub created in Step 1.
1. Reconfigure your devices and back-end services to start using the new connection strings from the new IoT hub. 

> [!NOTE]
> If you're migrating the resources across cloud types, the root certificate authority may be different in the source and the target region. Account for this when you reconfigure your devices and back-end applications that interact with the IoT Hub instance.

### Example PowerShell script for migrating devices from one IoT Hub to another 

```powershell
# Script to export IoT Hub device identities from one IoT hub to another
# Prerequisites: two IoT hubs - fill out details in the Input section
# This script creates a new storage container in the same resource group as the IoT Hub for exporting

# Input 

$sourceSubscription = "<enter subscription ID>"
$sourceResourceGroup = "<enter resource group name>"
$sourceIotHubName = "<enter iot hub name>"

$targetSubscription = "<enter subscription ID>"
$targetResourceGroup = "<enter resource group name>"
$targetIotHubName = "<enter iot hub name>"

$deviceIdentitiesStorageAccountName = "<enter a new storage account name>"
$deviceIdentitiesStorageContainerName = "iot-export-container"
$storageAccountLocation = "westus"

# Source IoT Hub

Select-AzureRmSubscription $sourceSubscription

Write-Host "Creating a new storage account in the same resource group as the IoT Hub to export to..."
$storageAccount = New-AzureRmStorageAccount -ResourceGroupName $sourceResourceGroup -Name $deviceIdentitiesStorageAccountName -Location $storageAccountLocation -SkuName "Standard_LRS"
$storageContainer = New-AzureStorageContainer -Context $storageAccount.Context -Name $deviceIdentitiesStorageContainerName
$SASUri = New-AzureStorageContainerSASToken -Name $deviceIdentitiesStorageContainerName -Permission rwdl -FullUri -Context $storageAccount.Context

Write-Host "Exporting device identities to storage account"
$iotExportJob = New-AzureRmIotHubExportDevices -ResourceGroupName $sourceResourceGroup -Name $sourceIotHubName -ExportBlobContainerUri $SASUri -ExcludeKeys:$False

Write-Host "Checking to see if the export is done..."
DO {
    $iotExportJob = Get-AzureRmIotHubJob -ResourceGroupName $sourceResourceGroup -Name $sourceIotHubName -JobId $iotExportJob.JobId
    Start-Sleep -s 1
} While ($iotExportJob.Status -ne "Complete")

$iotExportJob
Write-Host "The export is finished"

# Target IoT Hub

Select-AzureRmSubscription $targetSubscription

Write-Host "Importing device identities from storage..."
$iotImportJob = New-AzureRmIotHubImportDevices -ResourceGroupName $targetResourceGroup -Name $targetIotHubName -InputBlobContainerUri $SASUri -OutputBlobContainerUri $SASUri

Write-Host "Checking to see if the import is done..."
DO {
    $iotImportJob = Get-AzureRmIotHubJob -ResourceGroupName $targetResourceGroup -Name $targetIotHubName -JobId $iotImportJob.JobId
    Start-Sleep -s 1
} While ($iotImportJob.Status -ne "Complete")

$iotImportJob
Write-Host "The import is finished"
```