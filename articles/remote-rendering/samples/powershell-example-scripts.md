---
title: Example PowerShell scripts
description: Examples that show how to use the front end via PowerShell scripts
author: FlorianBorn71
manager: jlyons
services: azure-remote-rendering
titleSuffix: Azure Remote Rendering
ms.author: flborn
ms.date: 12/11/2019
ms.topic: tutorial
ms.service: azure-remote-rendering
---

# Example PowerShell scripts
This guide provides detailed steps on how to use the Remote Rendering Front End via the PowerShell scripts provided in the Scripts folder of this arrclient repository.

We provide two scripts in the Scripts folder of the repository: Conversion.ps1 and RenderingSession.ps1. They use common utilities from ARRUtils.ps1

## Prerequisites 
Prior to invoking the script you need to install the Azure PowerShell module and log into your subscription.


## Install Azure PowerShell

More information about Azure PowerShell can be found at: https://docs.microsoft.com/powershell/azure/ 

In PowerShell with admin rights:

```powershell
PS> Install-Module -Name Az -AllowClobber
```

## Allow PowerShell scripts to be executed
If you get an error about running scripts, ensure your execution policy is set appropriately
Open PowerShell as an admin and run  the command below to allow unrestricted execution. For more details, read [Set-Execution Policy](https://docs.microsoft.com/powershell/module/microsoft.powershell.security/set-executionpolicy?view=powershell-6)

In a PowerShell window:

```powershell
PS> Set-ExecutionPolicy -ExecutionPolicy Unrestricted
```

## Prepare an Azure Storage account 
In order to use the asset conversion service you need to have an Azure subscription and an Azure Storage V2 account. 
In the Azure Storage account, you need to create at least one input blob container and output blob container. 
You can create a storage account and the containers in the Azure portal at: https://portal.azure.com 

## Make sure to be logged into your subscription
If you want to use the asset conversion service and upload files to azure blob storage, you will need to log into your subscription.
In a PowerShell window (does not need admin rights):

```powershell
PS> Connect-AzAccount -Subscription "<your azure subscription id>"
```

This will open a browser window for you to log in to your subscription.

## Fill out the configuration file 
Next to the `.ps1` files in the Scripts directory there is a arrconfig.json that needs to be filled out.

All of the values are strings, so use the "key":"value" notation. 

accountSettings contains values needed for Conversion.ps1 and RenderingSession.ps1

- accountSettings.arrAccountId: fill in the ID for the account you will use. If you don't have an account, [create one](../how-tos/create-an-account.md).
- accountSettings.arrAccountKey: fill in the key for the account you will use.
- accountSettings.region:  The region of ARR service you will use. At the moment, we provide "westus2" and "westeurope". Pick one.

renderingSessionSettings will be used by the RenderingSession.ps1 script
- renderingSessionSettings.vmSize: Selects the size of the VM. Select "standard" or "premium". Be mindful of our resources and shut down rendering sessions when you do not need them anymore
- renderingSessionSettings.maxLeaseTime: the time for which you lease the rendering VM. The VM will be shut down after this time runs out. See the Description of RenderingSession.ps1 how to extend an already running session. 

azureStorageSettings contain values used by the Conversion.ps1 script. Fill it out if you want to upload a model to azure blob storage and convert it by using our model conversion service.

- azureStorageSettings.azureSubscriptionId: Fill in your subscription ID, which contains the storage account you are using
- azureStorageSettings.resourceGroup: Resource group, which contains the storage account you are using
- azureStorageSettings.storageAccountName: Name of the storage account you are using
- azureStorageSettings.blobInputContainerName: Input container inside the storage container - we will copy all files to the model conversion service, and run our model conversion tool 
- azureStorageSettings.blobOutputContainerName: output container inside the storage container - after the model conversion finished we will write the model back to the provided output container

modelSettings is used to select which model you want to convert - it does not need to be filled out if you provide command-line parameters to the Conversion.ps1 script:
- modelSettings.modelLocation: can be also provided to the Conversion.ps1 via the -ModelLocation parameter. Path to the local file on disc. for example: "C:\\\\models\\\\box.fbx". Make sure to properly escape the backslash in the path and use "\\\\"

## Script RenderingSession.ps1
Make sure you have filled out the accountSettings and renderingSessionSettings sections in arrconfig.json next to the RenderingSession.ps1 script.

All commands can be executed in a powershell window:

## Starting a Rendering Session
Normal usage with a fully filled out arrconfig.json: 
```powershell
PS> .\RenderingSession.ps1
```
Will call the REST API to spin up a rendering VM with azure region, size, and lease time specified in arrconfig.json. 
On success, this will retrieve the sessionId. 
Then the script will poll the session properties using the sessionId REST API until the session is ready or an error occurred. 


Using an alternative config file:
```powershell
PS> .\RenderingSession.ps1 -ConfigFile D:\arr\myotherconfigFile.json
```

You can override individual settings from the config file like:
```powershell
PS> .\RenderingSession.ps1 -Region <westeurope or westus2> -VmSize <standard or premium> -MaxLeaseTime <hh:mm:ss>
```
For example: this will override the renderingSessionSettings.vmSize setting in arrconfig.json
```powershell
PS> .\RenderingSession.ps1 -VmSize standard
```
or any combinations of these parameters. 

In order to only start a session without polling, you can use:
```powershell
PS> .\RenderingSession.ps1 -CreateSession
```
This will retrieve a sessionID. 


## Get session properties/status
Once you have a sessionId (from requesting a VM as described above) use:

```powershell
PS> .\RenderingSession.ps1 -GetSessionProperties -Id <sessionID>
```

You can enable polling by using: 
```powershell
PS> .\RenderingSession.ps1 -GetSessionProperties -Id <sessionID> -Poll
```

## Get current sessions
To list the current sessions, use:

```powershell
PS> .\RenderingSession.ps1 -GetSessions
```

## Stop a session
```powershell
PS> .\RenderingSession.ps1 -StopSession -Id <sessionID> 
```

## Change session properties
At the moment, we only support changing the maxLeaseTime of a VM. The lease time will still be counted from the time when the VM was spun up initially. 
```powershell
PS> .\RenderingSession.ps1 -UpdateSession -Id <sessionID> -MaxLeaseTime <hh:mm:ss>
```

## Converting an asset using Conversion.ps1
Make sure you have filled out the accountSettings and azureStorageSettings sections in arrconfig.json next to the Conversion.ps1 script.
Open a PowerShell in the Scripts folder and make sure you are logged into the Azure subscription under which your storage account exists

```powershell
PS> Connect-AzAccount -Subscription "<your azure subscription id>"
```

Then you can use the script as follows using the values given in arrconfig.json
```powershell
PS> .\Conversion.ps1
```
This will: 
- Take the local file from the modelSettings.modelLocation and upload it to the input blob container configured under azureStorageSettings of the config file. 
- Then it will generate a SAS URIs for the input container (so the service can retrieve your files)
- And it will generate a SAS URIs for the output container (so the service can upload the finished model)
- Call the model conversion REST API to kick off the model conversion. This will retrieve a model conversion ID.
- Poll the Conversion Status REST API using the conversion ID from above until it succeeds or an error occurs
- at the end it will output a SAS URI to the model in the output blob container, which can be used in a rendering session via the provided ARR API.

You can point model conversion to an alternate config file by using:
```powershell
PS> .\Conversion.ps1 -ConfigFile D:\arr\myotherconfigFile.json
```

If you only want to start conversion a model without polling:
```powershell
PS> .\Conversion.ps1 -IngestAsset 
```
This will return an ingestion ID. 

You can use this ID to get the conversion status with: 
```powershell
PS> .\Conversion.ps1 -GetAssetStatus -Id <id> [-Poll]
```
Use -Poll to wait until conversion is done or an error occurred

You can override individual parameters of the script:
```powershell
PS> .\Conversion.ps1 -ModelLocation D:\tmp\arr\pyramid.fbx
```

If you want to convert a model, which is already present in your input container: 
```powershell
PS> .\Conversion.ps1 -IngestAsset -ModelName <filename in input container, for example: box.fbx>
```



