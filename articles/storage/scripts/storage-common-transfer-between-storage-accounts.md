---
title: Azure PowerShell Script Sample - Migrate blobs across storage accounts using AzCopy on Windows | Microsoft Docs
description: Using AzCopy, copies the contents of one Azure Storage Account to another.
services: storage
documentationcenter: na
author: roygara
manager: jeconnoc


ms.assetid:
ms.custom: mvc
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: azurecli
ms.topic: sample
ms.date: 12/27/2017
ms.author: v-rogara
---

# Migrate blobs across storage accounts using AzCopy on Windows

This script takes in a source storage account name and key, a target storage account name and key, and the full filepath of the AzCopy.exe (if it is not installed at the default directory). Then the script copies the blob objects from the source storage account to the target storage account.

This is done by making use of the Get-AzureStorageContainer command, which lists all the containers in a storage account. It then issues AzCopy commands to copy each container from the source storage account to the destination storage account. If any failures occur the script will retry $retryTimes (default is 3, and can be modified with the -RetryTimes parameter). If failure is experienced for each time it retries the user can re-run the script with the -LastSuccessContainerName parameter and provide the name of the last successfully copied container. The script will then continue copying containers from that point.

[!INCLUDE [sample-powershell-install](../../../includes/sample-powershell-install-no-ssh.md)]

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

This sample also requires the [latest version of AzCopy on Windows](http://aka.ms/downloadazcopy). The default install directory is `C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\`

The following are examples of the input for this script:

If AzCopy is installed at the default directory:
```PowerShell
srcStorageAccountName: ExampleSourceStorageAccountName
srcStorageAccountKey: ExampleSourceStorageAccountKey
DestStorageAccountName: ExampleTargetStorageAccountName
DestStorageAccountKey: ExampleTargetStorageAccountKey
```

If AzCopy is not installed at the default directory:

```Powershell
srcStorageAccountName: ExampleSourceStorageAccountName
srcStorageAccountKey: ExampleSourceStorageAccountKey
DestStorageAccountName: ExampleTargetStorageAccountName
DestStorageAccountKey: ExampleTargetStorageAccountKey
AzCopyPath: C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe
```

## Sample script

```Powershell
# Run the script in a new open Powershell window, which has not run other cmdlets, or AzCopy performance could suffer .
# Need install Azure PowerShell before runing the script: https://github.com/Azure/azure-powershell/releases
# Need install AzCopy before runing the script: https://docs.microsoft.com/en-us/azure/storage/common/storage-use-azcopy
# Do not modify the Source or Destination accounts while the copy is running

 param (
    [Parameter(Mandatory = $true, 
    HelpMessage= "Source Storage account name.")]
    [ValidatePattern("^[a-z0-9`]{3,24}$")]
    [String]$srcStorageAccountName,

    [Parameter(Mandatory = $true, 
    HelpMessage= "Source Storage account key.")]
    [String]$srcStorageAccountKey,
    
    [Parameter(Mandatory = $true, 
    HelpMessage= "Destination Storage account name.")]
    [ValidatePattern("^[a-z0-9`]{3,24}$")]
    [String]$DestStorageAccountName,

    [Parameter(Mandatory = $true, 
    HelpMessage= "Destination Storage account key.")]
    [String]$DestStorageAccountKey,

    [Parameter(Mandatory = $false, 
    HelpMessage= "Input the full filePath of the AzCopy.exe, e.g.: C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe")]
    [String]$AzCopyPath = "C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe",

    [Parameter(Mandatory = $false, 
    HelpMessage='Sets the number of retries in an event of failure. Set to 0 for no retry, set -1 for infinite retry.')]
    [Int32]$RetryTimes = 3,

    [Parameter(Mandatory = $false, 
    ValueFromPipeline = $true, 
    HelpMessage='Used for resume operation. When provided, the script will copy containers that are alphabetically after $LastSuccessContainerName')]
    [String]$LastSuccessContainerName = $nullz
 )

 if( (Get-Item $AzCopyPath).Exists)
 {

    $FileItemVersion = (Get-Item $AzCopyPath).VersionInfo
    $FilePath = ("{0}.{1}.{2}.{3}" -f  $FileItemVersion.FileMajorPart,  $FileItemVersion.FileMinorPart,  $FileItemVersion.FileBuildPart,  $FileItemVersion.FilePrivatePart)

    if([version] $FilePath -lt "7.0.0.2")
    {
        $AzCopyPath = Read-Host "Input the full filePath of the AzCopy.exe, e.g.: C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe"
    }
 }
 elseIf( (Get-Item $AzCopyPath).Exists -eq $false)
 {
    $AzCopyPath = Read-Host "Input the full filePath of the AzCopy.exe, e.g.: C:\Program Files (x86)\Microsoft SDKs\Azure\AzCopy\AzCopy.exe"
 }

# Create and check Storage context
$Error.Clear()
$srcCtx = New-AzureStorageContext -StorageAccountName $srcStorageAccountName -StorageAccountKey $srcStorageAccountKey
if ($srcCtx -eq $null)
{
    Write-Error "Script could not create source Storage Context, possibly due to invalid StorageAccountName or StorageAccount Key terminating: $Error[0]";
    return;
}
$destCtx = New-AzureStorageContext -StorageAccountName $destStorageAccountName -StorageAccountKey $destStorageAccountKey
if ($destCtx -eq $null)
{
    Write-Error "Script could not create destination storage context, possibly due to invalid StorageAccountName or StorageAccount Key terminating: $Error[0]";
    return;
}

#Check Source and Destination Storage account Connection
$Error.Clear()
$Containers = Get-AzureStorageContainer -MaxCount 1 -Context $srcCtx
if ($Error.Count -gt 0)
{
    Write-Error "Script failed to connect to source Storage account, terminating: $Error[0]";
    return;
}
$Containers = Get-AzureStorageContainer -MaxCount 1 -Context $destCtx
if ($Error.Count -gt 0)
{
    Write-Error "Script failed to connect to destination Storage account, terminating: $Error[0]";
    return;
}

#Check AzCopy Path
if((Test-Path $AzCopyPath) -eq $false)
{
    Write-Error "Script is terminating since the provided AzCopyPath does not exist: $AzCopyPath ";
    return;
}

$OutputLastSuccessContainer = $LastSuccessContainerName;
$HasReachedLastSuccessContainer = $false;

if ($LastSuccessContainerName -eq $null -or $LastSuccessContainerName -eq "")
{
    $HasReachedLastSuccessContainer = $true;
}

# For list container
$MaxReturn = 250
$Token = $Null

do{
    # List source containers
    $retry = 1
    $Error.Clear()
    $srcContainers = Get-AzureStorageContainer -MaxCount $MaxReturn -ContinuationToken $Token -Context $srcCtx

    # If list container fail, retry it
    while(($Error.Count -gt 0) -and ($RetryTimes -eq -1 -or $retry -le $retryTimes))
    {
        Write-Host "Retry List containers $retry"
        $Error.Clear()
        $srcContainers = Get-AzureStorageContainer -MaxCount $MaxReturn -ContinuationToken $Token -Context $srcCtx
        $retry++
    }

    # If list container fail after retry, break script
    if ($Error.Count -gt 0){
        Write-Error "Terminating the script since listing source containers failed: $Error[0]";
        $CopyContainerFail = $true
        break;
    }
    $Token = $srcContainers[$srcContainers.Count -1].ContinuationToken;

    # Transfer containers one by one
    $CopyContainerFail = $false
    foreach ($container in $srcContainers)
    {
        if (!$HasReachedLastSuccessContainer)
        {
            if ($container.Name -eq $LastSuccessContainerName)
            {
                $HasReachedLastSuccessContainer = $true;
            }
            Write-Host "Skipping container copy: $($container.Name)"
            Continue;
        }

        Write-Host "Start copying container: $($container.Name)"
        $retry = 1

        # Get AzCopy command for transfer one container
        $destContainer = $destCtx.StorageAccount.CreateCloudBlobClient().GetContainerReference($container.Name)
        $azCopyCmd = [string]::Format("""{0}"" /source:{1} /dest:{2} /sourcekey:""{3}"" /destkey:""{4}"" /snapshot /y /s",$AzCopyPath, $container.CloudBlobContainer.Uri.AbsoluteUri, $destContainer.Uri.AbsoluteUri, $srcStorageAccountKey, $DestStorageAccountKey)
    
        # Execute the AzCopy command first time
        Write-Host "$azCopyCmd"
        $result = cmd /c $azCopyCmd
        foreach($s in $result)
        {
            Write-Host $s 
        }

        # If transfer failed, retry it
        while(($LASTEXITCODE -ne 0) -and ($RetryTimes -eq -1 -or $retry -le $retryTimes))
        {
            Write-Host "Retry $retry : $azCopyCmd"
            $result = cmd /c $azCopyCmd
            foreach($s in $result)
            {
                Write-Host $s 
            }
            $retry++
        }

        # If tranfer failed after retry, print error
        if ($LASTEXITCODE -ne 0){
            Write-Error "Container copy failed: $($container.Name)";
            $CopyContainerFail = $true
            break;
        }
        else
        {
            Write-Host "Finished copying container: $($container.Name)"
            Write-Host ""
            $OutputLastSuccessContainer = $container.Name
        }
    }
    if($CopyContainerFail)
    {
        break;
    }
}
While ($Token -ne $Null)

# Summary the copy result
if ($CopyContainerFail)
{
    if(($OutputLastSuccessContainer -ne $null) -and ($OutputLastSuccessContainer -ne ""))
    {
        Write-Warning "To resume, rerun the script and append the parameter: ""-LastSuccessContainer $OutputLastSuccessContainer"""
        return $OutputLastSuccessContainer
    }
    else
    {
        Write-Warning "To resume, rerun the script."
        return $null
    }
}
else
{
    Write-Host "All Containers copied successfully."
    return ""
}
```

## Script explanation

This script uses the following commands to copy data from one storage account to another. Each item in the table links to command-specific documentation.

| Command | Notes |
|---|---|
| [Get-AzureStorageContainer](/powershell/module/azure.storage/Get-AzureStorageContainer) | Returns the containers associated with this Storage account. |
| [New-AzureStorageContext](/powershell/module/azure.storage/New-AzureStorageContext) | Creates an Azure Storage context. |

## Next steps

For more information on the Azure PowerShell module, see [Azure PowerShell documentation](/powershell/azure/overview).

Additional storage PowerShell script samples can be found in [PowerShell samples for Azure Blob storage](../blobs/storage-samples-blobs-powershell.md).
