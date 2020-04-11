---
title: Example PowerShell scripts
description: Examples that show how to use the front end via PowerShell scripts
author: florianborn71
ms.author: flborn
ms.date: 02/12/2020
ms.topic: sample
---

# Example PowerShell scripts

Azure Remote Rendering provides the following two REST APIs:

- [Conversion REST API](../how-tos/conversion/conversion-rest-api.md)
- [Session REST API](../how-tos/session-rest-api.md)

The [ARR samples repository](https://github.com/Azure/azure-remote-rendering) contains sample scripts in the *Scripts* folder for interacting with the REST APIs of the service. This article describes their usage.

## Prerequisites

To execute the sample scripts, you need a functional setup of [Azure PowerShell](https://docs.microsoft.com/powershell/azure/).

1. Install Azure PowerShell:
    1. Open a PowerShell with admin rights
    1. Run: `Install-Module -Name Az -AllowClobber`

1. If you get errors about running scripts, ensure your [execution policy](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6) is set appropriately:
    1. Open a PowerShell with admin rights
    1. Run: `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`

1. [Prepare an Azure Storage account](../how-tos/conversion/blob-storage.md#prepare-azure-storage-accounts)

1. Log into your subscription containing your Azure Remote Rendering account:
    1. Open a PowerShell
    1. Run: `Connect-AzAccount` and follow the on-screen directions.

> [!NOTE]
> In case your organization has more than one subscription you might need to specify the SubscriptionId and Tenant arguments. Find details in the [Connect-AzAccount documentation](https://docs.microsoft.com/powershell/module/az.accounts/connect-azaccount).

1. Download the *Scripts* folder from the [Azure Remote Rendering GithHub repository](https://github.com/Azure/azure-remote-rendering).

## Configuration file

Next to the `.ps1` files there's an `arrconfig.json` that you need to fill out:

```json
{
    "accountSettings": {
        "arrAccountId": "<fill in the account ID from the Azure Portal>",
        "arrAccountKey": "<fill in the account key from the Azure Portal>",
        "region": "<select from available regions>"
    },
    "renderingSessionSettings": {
        "vmSize": "<select standard or premium>",
        "maxLeaseTime": "<hh:mm:ss>"
    },
  "assetConversionSettings": {
    "resourceGroup": "<resource group which contains the storage account you created, only needed when uploading or generating SAS>",
    "storageAccountName": "<name of the storage account you created>",
    "blobInputContainerName": "<input container inside the storage container>",
    "blobOutputContainerName": "<output container inside the storage container>",
    "localAssetDirectoryPath": "<fill in a path to a local directory containing your asset (and files referenced from it like textures)>",
    "inputFolderPath": "<optional: base folderpath in the input container for asset upload. uses / as dir separator>",
    "inputAssetPath": "<the path to the asset under inputcontainer/inputfolderpath pointing to the input asset e.g. box.fbx>",
    "outputFolderPath": "<optional: base folderpath in the output container - the converted asset and log files will be placed here>",
    "outputAssetFileName": "<optional: filename for the converted asset, this will be placed in the output container under the outputpath>"
  }
}
```

> [!CAUTION]
> Make sure to properly escape backslashes in the LocalAssetDirectoryPath path by using double backslashes: "\\\\" and use forward slashes "/" in all other paths like inputFolderPath and inputAssetPath.

### accountSettings

For `arrAccountId` and `arrAccountKey`, see [Create an Azure Remote Rendering account](../how-tos/create-an-account.md).
For `region` see the [list of available regions](../reference/regions.md).

### renderingSessionSettings

This structure must be filled out if you want to run **RenderingSession.ps1**.

- **vmSize:** Selects the size of the virtual machine. Select *standard* or *premium*. Shut down rendering sessions when you don't need them anymore.
- **maxLeaseTime:** The duration for which you want to lease the VM. It will be shut down when the lease expires. The lease time can be extended later (see below).

### assetConversionSettings

This structure must be filled out if you want to run **Conversion.ps1**.

For details, see [Prepare an Azure Storage account](../how-tos/conversion/blob-storage.md#prepare-azure-storage-accounts).

## Script: RenderingSession.ps1

This script is used to create, query, and stop rendering sessions.

> [!IMPORTANT]
> Make sure you have filled out the *accountSettings* and *renderingSessionSettings* sections in arrconfig.json.

### Create a rendering session

Normal usage with a fully filled out arrconfig.json:

```PowerShell
.\RenderingSession.ps1
```

The script will call the [session management REST API](../how-tos/session-rest-api.md) to spin up a rendering VM with the specified settings. On success, it will retrieve the *sessionId*. Then it will poll the session properties until the session is ready or an error occurred.

To use an **alternative config** file:

```PowerShell
.\RenderingSession.ps1 -ConfigFile D:\arr\myotherconfigFile.json
```

You can **override individual settings** from the config file:

```PowerShell
.\RenderingSession.ps1 -Region <region> -VmSize <vmsize> -MaxLeaseTime <hh:mm:ss>
```

To only **start a session without polling**, you can use:

```PowerShell
.\RenderingSession.ps1 -CreateSession
```

The *sessionId* that the script retrieves must be passed to most other session commands.

### Retrieve session properties

To get a session's properties, run:

```PowerShell
.\RenderingSession.ps1 -GetSessionProperties -Id <sessionID> [-Poll]
```

Use `-Poll` to wait until the session is *ready* or an error occurred.

### List active sessions

```PowerShell
.\RenderingSession.ps1 -GetSessions
```

### Stop a session

```PowerShell
.\RenderingSession.ps1 -StopSession -Id <sessionID>
```

### Change session properties

At the moment, we only support changing the maxLeaseTime of a session.

> [!NOTE]
> The lease time is always counted from the time when the session VM was initially created. So to extend the session lease by another hour, increase *maxLeaseTime* by one hour.

```PowerShell
.\RenderingSession.ps1 -UpdateSession -Id <sessionID> -MaxLeaseTime <hh:mm:ss>
```

## Script: Conversion.ps1

This script is used to convert input models into the Azure Remote Rendering specific runtime format.

> [!IMPORTANT]
> Make sure you have filled out the *accountSettings* and *assetConversionSettings* sections in arrconfig.json.

The script demonstrates the two options to use storage accounts with the service:

- Storage account linked with Azure Remote Rendering Account
- Providing access to storage via Shared Access Signatures (SAS)

### Linked storage account

Once you've fully filled out arrconfig.json and linked a storage account, you can use the following command. Linking your storage account is described at [Create an Account](../how-tos/create-an-account.md#link-storage-accounts).

Using a linked storage account is the preferred way to use the conversion service since there's no need to generate Shared Access Signatures.

```PowerShell
.\Conversion.ps1
```

1. Upload all files contained in the `assetConversionSettings.modelLocation` to the input blob container under the given `inputFolderPath`
1. Call the [model conversion REST API](../how-tos/conversion/conversion-rest-api.md) to kick off the [model conversion](../how-tos/conversion/model-conversion.md)
1. Poll the conversion status until the conversion succeeded or failed
1. Output details of the converted file location (storage account, output container, file path in the container)

### Access to storage via Shared Access Signatures

```PowerShell
.\Conversion.ps1 -UseContainerSas
```

This will:

1. Upload the local file from the `assetConversionSettings.localAssetDirectoryPath` to the input blob container
1. Generate a SAS URI for the input container
1. Generate a SAS URI for the output container
1. Call the [model conversion REST API](../how-tos/conversion/conversion-rest-api.md) to kick off the [model conversion](../how-tos/conversion/model-conversion.md)
1. Poll the conversion status until the conversion succeeded or failed
1. Output details of the converted file location (storage account, output container, file path in the container)
1. Output a SAS URI to the converted model in the output blob container

### Additional command-line options

To use an **alternative config** file:

```PowerShell
.\Conversion.ps1 -ConfigFile D:\arr\myotherconfigFile.json
```

To only **start model conversion without polling**, you can use:

```PowerShell
.\Conversion.ps1 -ConvertAsset
```

You can **override individual settings** from the config file using the following command-line switches:

* **Id:** ConversionId used with GetConversionStatus
* **ArrAccountId:** arrAccountId of accountSettings
* **ArrAccountKey:** override for arrAccountKey of accountSettings
* **Region:** override for region of accountSettings
* **ResourceGroup:** override for resourceGroup of assetConversionSettings
* **StorageAccountName:** override for storageAccountName of assetConversionSettings
* **BlobInputContainerName:** override for blobInputContainer of assetConversionSettings
* **LocalAssetDirectoryPath:** override for localAssetDirectoryPath of assetConversionSettings
* **InputAssetPath:** override for inputAssetPath of assetConversionSettings
* **BlobOutputContainerName:** override for blobOutputContainerName of assetConversionSettings
* **OutputFolderPath:** override for the outputFolderPath of assetConversionSettings
* **OutputAssetFileName:** override for outputAssetFileName of assetConversionSettings

For example you can combine a number of the given options like this:

```PowerShell
.\Conversion.ps1 -LocalAssetDirectoryPath "C:\\models\\box" -InputAssetPath box.fbx -OutputFolderPath another/converted/box -OutputAssetFileName newConversionBox.arrAsset
```

### Run the individual conversion stages

If you want to run individual steps of the process, you can use:

Only upload data from the given LocalAssetDirectoryPath

```PowerShell
.\Conversion.ps1 -Upload
```

Only start the conversion process of a model already uploaded to blob storage (don't run Upload, don't poll the conversion status)
The script will return a *conversionId*.

```PowerShell
.\Conversion.ps1 -ConvertAsset
```

And you can retrieve the conversion status of this conversion using:

```PowerShell
.\Conversion.ps1 -GetConversionStatus -Id <conversionId> [-Poll]
```

Use `-Poll` to wait until conversion is done or an error occurred.

## Next steps

- [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
- [Quickstart: Convert a model for rendering](../quickstarts/convert-model.md)
- [Model conversion](../how-tos/conversion/model-conversion.md)
