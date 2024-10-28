---
title: References - How to collect verbose log from browsers
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to collect verbose log from browsers.
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# How to collect verbose log from browsers
When an issue originates within the underlying layer, collecting verbose logs in addition to web logs can provide valuable information.

To collect the verbose log from the browser, initiate a web browser session with specific command line arguments. You open your video application within the browser and execute the scenario you're debugging.
Once the scenario is executed, you can close the browser.
During log collection, ensure to keep only the necessary tabs open in the browser.

To collect the verbose log of the Edge browser, open a command line window and execute:

`"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --user-data-dir=C:\edge-debug  --enable-logging --v=0 --vmodule=*/webrtc/*=2,*/libjingle/*=2,*media*=4 --no-sandbox`

For Chrome, replace the executable path in the command with `C:\Program Files\Google\Chrome\Application\chrome.exe`.

Don’t omit the `--user-data-dir` argument. This argument is used to specify where the logs are saved.

This command enables verbose logging and saves the log to chrome\_debug.log.
It's important to have only the necessary pages open in the Edge browser, such as `edge://webrtc-internals` and the application web page.
Keeping only necessary pages open ensure that logs from different web applications don't mix in the same log file.

Log file is located at: `C:\edge-debug\chrome_debug.log`

The verbose log is flushed each time the browser is opened with the specified command line.
Therefore, after closing the browser, you should copy the log and check its file size and modification time to confirm that it contains the verbose log.
