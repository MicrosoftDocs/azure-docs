---
title: How to collect a network trace
description: Learn how to get the network trace to help troubleshooting
author: yjin81
ms.author: yajin1
ms.service: azure-web-pubsub
ms.topic: how-to 
ms.date: 03/22/2021
---

# How to collect a network trace

If you encounter an issue, a network trace can sometimes provide a lot of helpful information. This is particularly useful if you're going to file an issue on our issue tracker. This how-to guide shows you the options to collect a network trace.

> [!WARNING]
> A network trace contains the full contents of every message sent by your app. **Never** post raw network traces from production apps to public forums like GitHub.

## Collect a network trace with Fiddler

Fiddler is a very powerful tool for collecting HTTP traces. Install it from [telerik.com/fiddler](https://www.telerik.com/fiddler), launch it, and then run your app and reproduce the issue. Fiddler is available for Windows, macOS and Linux. 

If you connect using HTTPS, there are some extra steps to ensure Fiddler can decrypt the HTTPS traffic. For more details, see the [Fiddler documentation](https://docs.telerik.com/fiddler/Configure-Fiddler/Tasks/DecryptHTTPS).

Once you've collected the trace, you can export the trace by choosing **File** > **Save** > **All Sessions** from the menu bar.

## Collect a network trace with tcpdump (macOS and Linux only)

This method works for all apps.

You can collect raw TCP traces using tcpdump by running the following command from a command shell. You may need to be `root` or prefix the command with `sudo` if you get a permissions error:

```console
tcpdump -i [interface] -w trace.pcap
```

Replace `[interface]` with the network interface you wish to capture on. Usually, this is something like `/dev/eth0` (for your standard Ethernet interface) or `/dev/lo0` (for localhost traffic). For more information, see the `tcpdump` man page on your host system.

## Collect a network trace in the browser (Browser-based apps only)

Most browser Developer Tools have a "Network" tab that allows you to capture network activity between the browser and the server. 

### Microsoft Edge (Chromium)

1. Open the [DevTools](https://docs.microsoft.com/microsoft-edge/devtools-guide-chromium/)
    * Select `F12` 
    * Select `Ctrl`+`Shift`+`I` \(Windows/Linux\) or `Command`+`Option`+`I` \(macOS\)
    * Click `Settings and more` and then select `More Tools > Developer Tools`  
1. Click the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Click the `Export HAR...` in the toolbar to export the trace as a "HAR" file

    :::image type="content" source="./media/web-pubsub-howto-troubleshoot-network-trace/edge-export-network-trace.png" alt-text="Collect network trace with Microsoft Edge":::

### Google Chrome

1. Open the [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools)
    * Select `F12` 
    * Select `Ctrl`+`Shift`+`I` \(Windows/Linux\) or `Command`+`Option`+`I` \(macOS\)  
    * Click `Customize and control Google Chrome` and then select `More Tools > Developer Tools`
1. Click the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Click the `Export HAR...` in the toolbar to export the trace as a "HAR" file

    :::image type="content" source="./media/web-pubsub-howto-troubleshoot-network-trace/chrome-export-network-trace.png" alt-text="Collect network trace with Google Chrome":::

### Mozilla Firefox

1. Open the [Firefox Developer Tools](https://developer.mozilla.org/en-US/docs/Tools)
    * Select `F12`
    * Select `Ctrl`+`Shift`+`I` \(Windows/Linux\) or `Command`+`Option`+`I` \(macOS\) 
    * Click `Open menu` and then select `Web Developer > Toggle Tools`
1. Click the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Right click anywhere in the list of requests and choose "Save All As HAR"

    :::image type="content" source="./media/web-pubsub-howto-troubleshoot-network-trace/firefox-export-network-trace.png" alt-text="Collect network trace with Mozilla Firefox":::

### Safari

1. Open the [Web Development Tools](https://developer.apple.com/safari/tools/)
    * Select `Command`+`Option`+`I`
    * Click `Developer` menu and then select `Show Web Inspector` 
1. Click the `Network` Tab
1. Refresh the page (if needed) and reproduce the problem
1. Right click anywhere in the list of requests and choose "Save All As HAR"