---
title: How to collect a network trace
description: Learn how to get the network trace to help troubleshooting
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 11/08/2021
---

# How to collect a network trace

If you come across an issue, a network trace can sometimes provide much helpful information. This how-to guide shows you the options to collect a network trace.

> [!WARNING]
> A network trace contains the full contents of every message sent by your app. **Never** post raw network traces from production apps to public forums like GitHub.

## Collect a network trace with Fiddler

Fiddler is a powerful tool for collecting HTTP traces. Install it from [telerik.com/fiddler](https://www.telerik.com/fiddler), launch it, and then run your app and reproduce the issue. Fiddler is available for Windows, macOS, and Linux. 

If you connect using HTTPS, there are some extra steps to ensure Fiddler can decrypt the HTTPS traffic. For more information, see the [Fiddler documentation](https://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/DecryptHTTPS).

Once you've collected the trace, you can export the trace by choosing **File** > **Save** > **All Sessions** from the menu bar.

## Collect a network trace with tcpdump (macOS and Linux only)

This method works for all apps.

You can collect raw TCP traces using tcpdump by running the following command from a command shell. You may need to be `root` or prefix the command with `sudo` if you get a permissions error:

```console
tcpdump -i [interface] -w trace.pcap
```

Replace `[interface]` with the network interface you wish to capture on. Usually, this is something like `/dev/eth0` (for your standard Ethernet interface) or `/dev/lo0` (for localhost traffic). For more information, see the `tcpdump` man page on your host system.

```console
man tcpdump
```

## Collect a network trace in the browser (Browser-based apps only)

Most browser Developer Tools have a "Network" tab that allows you to capture network activity between the browser and the server. 

> [!NOTE]
> If the issues you are investigating require multiple requests to reproduce, select the **Preserve Log** option with Microsoft Edge, Google Chrome, and Safari. For Mozilla Firefox select the **Persist Logs** option.

### Microsoft Edge (Chromium)

1. Open the [DevTools](/microsoft-edge/devtools-guide-chromium/)
    * Select `F12` 
    * Select `Ctrl`+`Shift`+`I` \(Windows/Linux\) or `Command`+`Option`+`I` \(macOS\)
    * Select `Settings and more` and then `More Tools > Developer Tools`  
1. Select the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Select the `Export HAR...` in the toolbar to export the trace as a "HAR" file

    :::image type="content" source="./media/howto-troubleshoot-network-trace/edge-export-network-trace.png" alt-text="Collect network trace with Microsoft Edge":::

### Google Chrome

1. Open the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
    * Select `F12` 
    * Select `Ctrl`+`Shift`+`I` \(Windows/Linux\) or `Command`+`Option`+`I` \(macOS\)  
    * Select `Customize and control Google Chrome` and then `More Tools > Developer Tools`
1. Select the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Select the `Export HAR...` in the toolbar to export the trace as a "HAR" file

    :::image type="content" source="./media/howto-troubleshoot-network-trace/chrome-export-network-trace.png" alt-text="Collect network trace with Google Chrome":::

### Mozilla Firefox

1. Open the [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)
    * Select `F12`
    * Select `Ctrl`+`Shift`+`I` \(Windows/Linux\) or `Command`+`Option`+`I` \(macOS\) 
    * Select `Open menu` and then `Web Developer > Toggle Tools`
1. Select the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Right-click anywhere in the list of requests and choose "Save All As HAR"

    :::image type="content" source="./media/howto-troubleshoot-network-trace/firefox-export-network-trace.png" alt-text="Collect network trace with Mozilla Firefox":::

### Safari

1. Open the [Web Development Tools](https://developer.apple.com/safari/tools/)
    * Select `Command`+`Option`+`I`
    * Select `Developer` menu and then select `Show Web Inspector` 
1. Select the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Right-click anywhere in the list of requests and choose "Save All As HAR"
