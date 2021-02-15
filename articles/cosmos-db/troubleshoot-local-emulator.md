---
title: Troubleshoot issues when using the Azure Cosmos DB Emulator
description: Learn how to troubleshot service unavailable, certificate, encryption, and versioning issues when using the Azure Cosmos DB Emulator. 
ms.service: cosmos-db
ms.topic: troubleshooting
author: markjbrown
ms.author: mjbrown
ms.date: 09/17/2020
ms.custom: contperf-fy21q1
---

# Troubleshoot issues when using the Azure Cosmos DB Emulator
[!INCLUDE[appliesto-all-apis](includes/appliesto-all-apis.md)]

The Azure Cosmos DB Emulator provides a local environment that emulates the Azure Cosmos DB service for development purposes. Use the tips in this article to help troubleshoot issues you encounter when installing or using the Azure Cosmos DB Emulator. 

If you installed a new version of the emulator and are experiencing errors, ensure you reset your data. You can reset your data by right-clicking the Azure Cosmos DB  Emulator icon on the system tray, and then clicking Reset Data…. If that does not fix the errors, you can uninstall the emulator and any older versions of the emulator if found, remove *C:\Program files\Azure Cosmos DB Emulator* directory and reinstall the emulator. See [Uninstall the local emulator](local-emulator.md#uninstall) for instructions. Alternatively if resetting the data doesn't work, navigate to `%LOCALAPPDATA%\CosmosDBEmulator` location and delete the folder.

## Troubleshoot corrupted windows performance counters

* If the Azure Cosmos DB Emulator crashes, collect the dump files from `%LOCALAPPDATA%\CrashDumps` folder, compress them, and open a support ticket from the [Azure portal](https://portal.azure.com).

* If you experience crashes in `Microsoft.Azure.Cosmos.ComputeServiceStartupEntryPoint.exe`, this might be a symptom where the Performance Counters are in a corrupted state. Usually running the following command from an admin command prompt fixes the issue:

  ```cmd
  lodctr /R
   ```

## Troubleshoot connectivity issues

* If you encounter a connectivity issue, [collect trace files](#trace-files), compress them, and open a support ticket in the [Azure portal](https://portal.azure.com).

* If you receive a **Service Unavailable** message, the emulator might be failing to initialize the network stack. Check to see if you have the Pulse secure client or Juniper networks client installed, as their network filter drivers may cause the problem. Uninstalling third-party network filter drivers typically fixes the issue. Alternatively, start the emulator with /DisableRIO, which will switch the emulator network communication to regular Winsock. 

* If you encounter **"Forbidden","message":"Request is being made with a forbidden encryption in transit protocol or cipher. Check account SSL/TLS minimum allowed protocol setting..."** connectivity issues, this might be caused by global changes in the OS (for example Insider Preview Build 20170) or the browser settings that enable TLS 1.3 as default. Similar error might occur when using the SDK to execute a request against the Cosmos emulator, such as **Microsoft.Azure.Documents.DocumentClientException: Request is being made with a forbidden encryption in transit protocol or cipher. Check account SSL/TLS minimum allowed protocol setting**. This is expected at this time since Cosmos emulator only accepts and works with TLS 1.2 protocol. The recommended work-around is to change the settings and default to TLS 1.2; for instance, in IIS Manager navigate to "Sites" -> "Default Web Sites" and locate the "Site Bindings" for port 8081 and edit them to disable TLS 1.3. Similar operation can be performed for the Web browser via the "Settings" options.

* While the emulator is running, if your computer goes to sleep mode or runs any OS updates, you might see a **Service is currently unavailable** message. Reset the emulator's data, by right-clicking on the icon that appears on the windows notification tray and select **Reset Data**.

## <a id="trace-files"></a>Collect trace files

To collect debugging traces, run the following commands from an administrative command prompt:

1. Navigate to the path where the emulator is installed:

   ```bash
   cd /d "%ProgramFiles%\Azure Cosmos DB Emulator"
   ```

1. Shut down the emulator and watch the system tray to make sure the program has shut down. It may take a minute to complete. You can also select **Exit** in the Azure Cosmos DB Emulator user interface.

   ```bash
   Microsoft.Azure.Cosmos.Emulator.exe /shutdown
   ```

1. Start logging with the following command:

   ```bash
   Microsoft.Azure.Cosmos.Emulator.exe /startwprtraces
   ```

1. Launch the emulator

   ```bash
   Microsoft.Azure.Cosmos.Emulator.exe
   ```

1. Reproduce the problem. If the data explorer is not working, you only need to wait for the browser to open for a few seconds to catch the error.

1. Stop logging with the following command:

   ```bash
   Microsoft.Azure.Cosmos.Emulator.exe /stopwprtraces
   ```
   
1. Navigate to `%ProgramFiles%\Azure Cosmos DB Emulator` path and find the *docdbemulator_000001.etl* file.

1. Open a support ticket in the [Azure portal](https://portal.azure.com) and include the .etl file along with repro steps.

## Next steps

In this article, you've learned how to debug issues with the local emulator. You can now proceed to the next articles:

* [Export the Azure Cosmos DB Emulator certificates for use with Java, Python, and Node.js apps](local-emulator-export-ssl-certificates.md)
* [Use command line parameters and PowerShell commands to control the emulator](emulator-command-line-parameters.md)
