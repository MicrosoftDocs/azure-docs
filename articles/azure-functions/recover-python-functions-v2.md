---
title: Troubleshooting V2 Python Azure Function Applications
description: Learn about known issues and workarounds when creating Python function apps using the V2 programming model in Azure functions.

ms.topic: article
ms.date: 10/20/2022
ms.devlang: python
ms.custom: devx-track-python
---

# V2 Programming Model: Known issues and their workarounds

* Multiple Python workers are not supported in V2 at this time. This means that enabling intelligent concurrency and setting `FUNCTIONS_WORKER_PROCESS_COUNT` greater than 1 is not supported for functions developed using the V2 model. 
* [Could not load file or assembly](#troubleshoot-could-not-load-file-or-assembly)
* [Unable to resolve the Azure Storage connection named Storage](#troubleshoot-unable-to-resolve-the-Azure-Storage-connection-named-Storage)
* Facing an issue during deployment? On the Portal, navigate to Settings -> Configuration and ensure that the flag "AzureWebJobsFeatureFlags" is set to "EnableWorkerIndexing". If it is not found, add this flag to the function application.



## Troubleshoot "could not load file or assembly"

If you are facing this error, it may be the case that you are using the V2 programming model. This error is due to a known issue that will be resolved in an upcoming release.

This specific error may ready:

> `DurableTask.Netherite.AzureFunctions: Could not load file or assembly 'Microsoft.Azure.WebJobs.Extensions.DurableTask, Version=2.0.0.0, Culture=neutral, PublicKeyToken=014045d636e89289'.`
> `The system cannot find the file specified.`

The reason this error may be occuring is because of an issue with how the extension bundle was cached. To detect if this is the issue, you can run the command with `--verbose` to see more details. 

> `func host start --verbose`

Upon running the command, if you notice that `Loading startup extension <>` is not followed by `Loaded extension <>` for each extension, it is likely that you are facing a caching issue. 

To resolve this issue, 

1. Find the path of `.azure-functions-core-tools` by running 
```console 
func GetExtensionBundlePath
```

2. Delete the directory `.azure-functions-core-tools`

# [bash](#tab/bash)

```bash
rm -r <insert path>/.azure-functions-core-tools
```

# [PowerShell](#tab/powershell)

```powershell
Remove-Item <insert path>/.azure-functions-core-tools
```

# [Cmd](#tab/cmd)

```cmd
rmdir <insert path>/.azure-functions-core-tools
```

---


## Troubleshoot "unable to resolve the Azure Storage connection named Storage"

This specific error may ready:

> `Microsoft.Azure.WebJobs.Extensions.DurableTask: Unable to resolve the Azure Storage connection named 'Storage'.`
> `Value cannot be null. (Parameter 'provider')`

The reason this error may be occuring is due to the way extensions are loaded from the bundle. To resolve this error, you can do one of the following:
* Use a storage emulator such as [Azurerite](https://learn.microsoft.com/azure/storage/common/storage-use-azurite?tabs=visual-studio). This is a good option if you are not planning to use a storage account in your function application.
* Create a storage account and add a connection string to the AzureWebJobsStorage environment variable in `localsettings.json`. This is a suitable option if are planning to use a storage account trigger or binding with your application, or if you have an existing storage account. To get started, see [Create a storage account](https://learn.microsoft.com/azure/storage/common/storage-account-create?tabs=azure-portal).
