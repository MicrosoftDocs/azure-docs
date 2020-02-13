---
title: Example PowerShell scripts
description: Examples that show how to use the front end via PowerShell scripts
author: FlorianBorn71
ms.author: flborn
ms.date: 02/12/2020
ms.topic: article
---

# Example PowerShell scripts

The [Azure Remote Rendering GithHub repository](https://github.com/Azure/azure-remote-rendering) contains sample scripts for interacting with the service. This article describes their usage.

## Prerequisites

To execute the sample scripts, you need a functional setup of [Azure PowerShell](https://docs.microsoft.com/powershell/azure/).

1. Install Azure PowerShell:
    1. Open a PowerShell with admin rights
    1. Run: `Install-Module -Name Az -AllowClobber`

1. If you get errors about running scripts, ensure your [execution policy](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-6) is set appropriately:
    1. Open a PowerShell with admin rights
    1. Run: `Set-ExecutionPolicy -ExecutionPolicy Unrestricted`

1. [Prepare an Azure Storage account](../how-tos/conversion/blob-storage.md#prepare-azure-storage-accounts)

1. Log into your subscription:
    1. Open a PowerShell
    1. Run: `Connect-AzAccount -Subscription "<your azure subscription id>"`

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
    "azureStorageSettings": {
        "azureSubscriptionId": "<fill in your subscription id which contains the storage account you created>",
        "resourceGroup": "<resource group which contains the storage account you created>",
        "storageAccountName": "<name of the storage account you created>",
        "blobInputContainerName": "<input container inside the storage container>",
        "blobOutputContainerName": "<output container inside the storage container>"
    },
    "modelSettings": {
        "modelLocation": "<fill in a path to a model file if you want to upload a file from a local path>"
    }
}
```

### accountSettings

For `arrAccountId` and `arrAccountKey`, see [Create an Azure Remote Rendering account](../how-tos/create-an-account.md).
For `region` see the [list of available regions](../reference/regions.md).

### renderingSessionSettings

This structure must be filled out if you want to run **RenderingSession.ps1**.

* **vmSize:** Selects the size of the virtual machine. Select *standard* or *premium*. Shut down rendering sessions when you don't need them anymore.
* **maxLeaseTime:** The duration for which you want to lease the VM. It will be shut down when the lease expires. The lease time can be extended later (see below).

### azureStorageSettings

This structure must be filled out if you want to run **Conversion.ps1**.

For details, see [Prepare an Azure Storage account](../how-tos/conversion/blob-storage.md#prepare-azure-storage-accounts).

### modelSettings

If you want to run **Conversion.ps1**, you can optionally fill out this structure, or pass the path to the source file as a command-line argument:

```ps1
./Conversion.ps1 -ModelLocation "C:\\models\\box.fbx"
```

> [!CAUTION]
> Make sure to properly escape backslashes in the path by using double backslashes: "\\\\".

## Script: RenderingSession.ps1

This script is used to create, query, and stop rendering sessions.

> [!IMPORTANT]
> Make sure you have filled out the *accountSettings* and *renderingSessionSettings* sections in arrconfig.json.

### Create a rendering session

Normal usage with a fully filled out arrconfig.json:

```ps1
.\RenderingSession.ps1
```

The script will call the [session management REST API](../how-tos/session-rest-api.md) to spin up a rendering VM with the specified settings. On success, it will retrieve the *sessionId*. Then it will poll the session properties until the session is ready or an error occurred.

To use an **alternative config** file:

```ps1
.\RenderingSession.ps1 -ConfigFile D:\arr\myotherconfigFile.json
```

You can **override individual settings** from the config file:

```ps1
.\RenderingSession.ps1 -Region <region> -VmSize <vmsize> -MaxLeaseTime <hh:mm:ss>
```

To only **start a session without polling**, you can use:

```ps1
.\RenderingSession.ps1 -CreateSession
```

The *sessionId* that the script retrieves must be passed to most other session commands.

### Retrieve session properties

To get a session's properties, run:

```ps1
.\RenderingSession.ps1 -GetSessionProperties -Id <sessionID> [-Poll]
```

Use `-Poll` to wait until the session is *ready* or an error occurred.

### List active sessions

```ps1
.\RenderingSession.ps1 -GetSessions
```

### Stop a session

```ps1
.\RenderingSession.ps1 -StopSession -Id <sessionID>
```

### Change session properties

At the moment, we only support changing the maxLeaseTime of a session.

> [!NOTE]
> The lease time is always counted from the time when the session VM was initially created. So to extend the session lease by another hour, increase *maxLeaseTime* by one hour.

```ps1
.\RenderingSession.ps1 -UpdateSession -Id <sessionID> -MaxLeaseTime <hh:mm:ss>
```

## Script: Conversion.ps1

This script is used to convert input models into the Azure Remote Rendering specific runtime format.

> [!IMPORTANT]
> Make sure you have filled out the *accountSettings* and *azureStorageSettings* sections in arrconfig.json.

Normal usage with a fully filled out arrconfig.json:

```ps1
.\Conversion.ps1
```

This will:

1. Upload the local file from the `modelSettings.modelLocation` to the input blob container
1. Generate a SAS URI for the input container
1. Generate a SAS URI for the output container
1. Call the [model conversion REST API](../how-tos/conversion/conversion-rest-api.md) to kick off the [model conversion](../how-tos/conversion/model-conversion.md)
1. Poll the conversion status until the conversion succeeded or failed
1. Output a SAS URI to the converted model in the output blob container

To use an **alternative config** file:

```ps1
.\Conversion.ps1 -ConfigFile D:\arr\myotherconfigFile.json
```

To only **start model conversion without polling**, you can use:

```ps1
.\Conversion.ps1 -ConvertAsset
```

You can **override individual settings** from the config file:

```ps1
.\Conversion.ps1 -ModelLocation D:\tmp\arr\pyramid.fbx
```

If you want to convert a model that is already uploaded to your input container, use the `**-ModelName**` option, instead of `-ModelLocation`. Pass the filename inside the input container as the argument:

```ps1
.\Conversion.ps1 -ConvertAsset -ModelName "mymodel.fbx"
```

The script will return a *conversionId*.

### Retrieve conversion status

```ps1
.\Conversion.ps1 -GetAssetStatus -Id <conversionId> [-Poll]
```

Use `-Poll` to wait until conversion is done or an error occurred.

## Next steps

* [Quickstart: Render a model with Unity](../quickstarts/render-model.md)
* [Quickstart: Convert a model for rendering](../quickstarts/convert-model.md)
* [Model conversion](../how-tos/conversion/model-conversion.md)
