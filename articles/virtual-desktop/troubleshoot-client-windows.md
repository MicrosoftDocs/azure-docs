---
title: Troubleshoot the Remote Desktop client for Windows - Azure Virtual Desktop
description: Troubleshoot issues you may experience with the Remote Desktop client for Windows when connecting to Azure Virtual Desktop.
author: dknappettmsft
ms.topic: how-to
ms.date: 11/01/2022
ms.author: daknappe
---

# Troubleshoot the Remote Desktop client for Windows when connecting to Azure Virtual Desktop

This article describes issues you may experience with the [Remote Desktop client for Windows](users/connect-windows.md?toc=%2Fazure%2Fvirtual-desktop%2Ftoc.json) when connecting to Azure Virtual Desktop and how to fix them.

## Access client logs

You might need the client logs when investigating an issue. You can then review the logs  To retrieve the client logs:

1. Ensure no sessions are active and the client process isn't running in the background by right-clicking on the **Remote Desktop** icon in the system tray and selecting **Disconnect all sessions**.
1. Open **File Explorer**.
1. Navigate to the **%temp%\DiagOutputDir\RdClientAutoTrace** folder.

Below you will find different methods used to read the client logs.

#### Event Viewer

1. Navigate to the Start menu, Control Panel, System and Security, and select **view event logs** under "Windows Tools".
1. Once the **Event Viewer** is open, click the Action tab at the top and select **Open Saved Log...**.
1. Navigate to the **%temp%\DiagOutputDir\RdClientAutoTrace** folder and select the log file you want to view.
1. The **Event Viewer** dialog box will open requesting a response to which it will convert etl format to evtx format. Select **Yes**.
1. In the **Open Saved Log** dialog box, you have the options to rename the log file and add a description. Select **Ok**.
1. The **Event Viewer** dialog box will open asking to overwrite the log file. Select **Yes**. This will not overwrite your original etl log file but create a copy in evtx format.

#### Command-line

This method will enable you to convert the log file from etl format to either _csv_ or _xml_ format using the `tracerpt` command. Open the Command Prompt or PowerShell and run the following:

```
tracerpt "<FilePath>.etl" -o "<OutputFilePath>.extension"
```

**CSV example:**

```
tracerpt "C:\Users\admin\AppData\Local\Temp\DiagOutputDir\RdClientAutoTrace\msrdcw_09-07-2022-15-48-44.etl" -o "C:\Users\admin\Desktop\LogFile.csv" -of csv
```

If the `-of csv` parameter is omitted from the command above, it won't properly convert the file.

**XML example:**

```
tracerpt "C:\Users\admin\AppData\Local\Temp\DiagOutputDir\RdClientAutoTrace\msrdcw_09-07-2022-15-48-44.etl" -o "C:\Users\admin\Desktop\LogFile.xml"
```

The `-of xml` parameter is not necessary in this instance as the default output for the conversion is in _xml_ format.
