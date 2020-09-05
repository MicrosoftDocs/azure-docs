---
title: Develop locally with the Azure Cosmos DB emulator
description: Use the Azure Cosmos DB emulator, you can develop and test your application locally for free, without creating an Azure subscription.
ms.service: cosmos-db
ms.topic: how-to
author: markjbrown
ms.author: mjbrown
ms.date: 09/04/2020
---

## Troubleshooting

Use the following tips to help troubleshoot issues you encounter with the Azure Cosmos Emulator:

- If you installed a new version of the emulator and are experiencing errors, ensure you reset your data. You can reset your data by right-clicking the Azure Cosmos emulator icon on the system tray, and then clicking Reset Data…. If that does not fix the errors, you can uninstall the emulator and any older versions of the emulator if found, remove "C:\Program files\Azure Cosmos DB Emulator" directory and reinstall the emulator. See [Uninstall the local emulator](#uninstall) for instructions.

- If the Azure Cosmos emulator crashes, collect dump files from '%LOCALAPPDATA%\CrashDumps' folder, compress them, and open a support ticket from the [Azure portal](https://portal.azure.com).

- If you experience crashes in `Microsoft.Azure.Cosmos.ComputeServiceStartupEntryPoint.exe`, this might be a symptom where the Performance Counters are in a corrupted state. Usually running the following command from an admin command prompt fixes the issue:

  ```cmd
  lodctr /R
   ```

- If you encounter a connectivity issue, [collect trace files](#trace-files), compress them, and open a support ticket in the [Azure portal](https://portal.azure.com).

- If you receive a **Service Unavailable** message, the emulator might be failing to initialize the network stack. Check to see if you have the Pulse secure client or Juniper networks client installed, as their network filter drivers may cause the problem. Uninstalling third-party network filter drivers typically fixes the issue. Alternatively, start the emulator with /DisableRIO, which will switch the emulator network communication to regular Winsock. 

- If you encounter **"Forbidden","message":"Request is being made with a forbidden encryption in transit protocol or cipher. Check account SSL/TLS minimum allowed protocol setting..."** connectivity issues, this might be caused by global changes in the OS (for example Insider Preview Build 20170) or the browser settings that enable TLS 1.3 as default. Similar error might occur when using the SDK to execute a request against the Cosmos emulator, such as **Microsoft.Azure.Documents.DocumentClientException: Request is being made with a forbidden encryption in transit protocol or cipher. Check account SSL/TLS minimum allowed protocol setting**. This is expected at this time since Cosmos emulator only accepts and works with TLS 1.2 protocol. The recommended work around is to change the settings and default to TLS 1.2; for instance in IIS Manager navigate to "Sites" -> "Default Web Sites" and locate the "Site Bindings" for port 8081 and edit them to disable TLS 1.3. Similar operation can be performed for the Web browser via the "Settings" options.

- While the emulator is running, if your computer goes to sleep mode or runs any OS updates, you might see a **Service is currently unavailable** message. Reset the emulator's data, by right-clicking on the icon that appears on the windows notification tray and select **Reset Data**.

### <a id="trace-files"></a>Collect trace files

To collect debugging traces, run the following commands from an administrative command prompt:

1. `cd /d "%ProgramFiles%\Azure Cosmos DB Emulator"`
2. `Microsoft.Azure.Cosmos.Emulator.exe /shutdown`. Watch the system tray to make sure the program has shut down, it may take a minute. You can also just click **Exit** in the Azure Cosmos emulator user interface.
3. `Microsoft.Azure.Cosmos.Emulator.exe /startwprtraces`
4. `Microsoft.Azure.Cosmos.Emulator.exe`
5. Reproduce the problem. If Data Explorer is not working, you only need to wait for the browser to open for a few seconds to catch the error.
6. `Microsoft.Azure.Cosmos.Emulator.exe /stopwprtraces`
7. Navigate to `%ProgramFiles%\Azure Cosmos DB Emulator` and find the docdbemulator_000001.etl file.
8. Open a support ticket in the [Azure portal](https://portal.azure.com) and include the .etl file along with repro steps.