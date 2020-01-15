---
title: Capture a browser trace for troubleshooting | Microsoft Docs 
description: Capture network information from a browser trace to help troubleshoot issues with the Azure portal.
services: azure-portal
keywords: 
author: mblythe
ms.author: mblythe
ms.date: 01/09/2020
ms.topic: troubleshooting

ms.service: azure-portal
manager:  mtillman
---

# Capture a browser trace for troubleshooting

If you're troubleshooting an issue with the Azure portal, and you need to contact Microsoft support, we recommend you first capture a browser trace and some additional information. The information you collect can provide important details about the portal at the time the issue occurs. Follow the steps in this article for the developer tools in the browser you use: Google Chrome or Microsoft Edge (Chromium), Microsoft Edge (EdgeHTML), or Apple Safari.

## Google Chrome and Microsoft Edge (Chromium)

Google Chrome and Microsoft Edge (Chromium) are both based on the [Chromium open source project](https://www.chromium.org/Home). The following steps show how to use the developer tools, which are very similar in the two browsers. For more information, see [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools) and [Microsoft Edge (Chromium) Developer Tools](/microsoft-edge/devtools-guide-chromium).

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your sign-in. 

1. Start recording the steps you take in the portal, using [Steps Recorder](https://support.microsoft.com/help/22878/windows-10-record-steps).

1. In the portal, navigate to the step just prior to where the issue occurs.

1. Press F12 or select ![Screenshot of browser settings icon](media/capture-browser-trace/chromium-icon-settings.png) > **More tools** > **Developer tools**.

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro requires going to more than one page:

    1. Select the **Network** tab, then select **Preserve log**.

          ![Screenshot of "Preserve log"](media/capture-browser-trace/chromium-network-preserve-log.png)

    1. Select the **Console** tab, select **Console settings**, then select **Preserve Log**. Select **Console settings** again to close the settings pane.

          ![Screenshot of "Preserve Log"](media/capture-browser-trace/chromium-console-preserve-log.png)

1. Select the **Network** tab, then select **Stop recording network log** and **Clear**.

    ![Screenshot of "Stop recording network log" and "Clear"](media/capture-browser-trace/chromium-stop-clear-session.png)

1. Select **Record network log**, then reproduce the issue in the portal.

    ![Screenshot of "Start profiling session"](media/capture-browser-trace/chromium-start-session.png)

    You will see session output similar to the following image.

    ![Screenshot of browser trace results](media/capture-browser-trace/chromium-browser-trace-results.png)

1. After you have reproduced the unexpected portal behavior, select **Stop recording network log**, then select **Export HAR** and save the file.

    ![Screenshot of "Export HAR"](media/capture-browser-trace/chromium-network-export-har.png)

1. Stop Steps Recorder, and save the file.

1. Back in the browser developer tools pane, select the **Console** tab. Right-click, then select **Save as...**, and save the console output to a text file.

    ![Screenshot of console output](media/capture-browser-trace/chromium-console-select.png)

1. Package the HAR file, console output, and screen recording in a compressed format like .zip, and share that with Microsoft support.

## Microsoft Edge (EdgeHTML)

The following steps show how to use the developer tools in Microsoft Edge (EdgeHTML). For more information, see [Microsoft Edge (EdgeHTML) Developer Tools](/microsoft-edge/devtools-guide).

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your sign-in. 

1. Start recording the steps you take in the portal, using [Steps Recorder](https://support.microsoft.com/help/22878/windows-10-record-steps).

1. In the portal, navigate to the step just prior to where the issue occurs.

1. Press F12 or select ![Screenshot of browser settings icon](media/capture-browser-trace/edge-icon-settings.png) > **More tools** > **Developer tools**.

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro requires going to more than one page:

    1. Select the **Network** tab, then clear the option **Clear entries on navigate**.

          ![Screenshot of "Clear entries on navigate"](media/capture-browser-trace/edge-network-clear-entries.png)

    1. Select the **Console** tab, then select **Preserve Log**.

          ![Screenshot of "Preserve Log"](media/capture-browser-trace/edge-console-preserve-log.png)

1. Select the **Network** tab, then select **Stop profiling session** and **Clear session**.

    ![Screenshot of "Stop profiling session" and "Clear session"](media/capture-browser-trace/edge-stop-clear-session.png)

1. Select **Start profiling session**, then reproduce the issue in the portal.

    ![Screenshot of "Start profiling session"](media/capture-browser-trace/edge-start-session.png)

    You will see session output similar to the following image.

    ![Screenshot of browser trace results](media/capture-browser-trace/edge-browser-trace-results.png)

1. After you have reproduced the unexpected portal behavior, select **Stop profiling session**, then select **Export as HAR** and save the file.

    ![Screenshot of "Export as HAR"](media/capture-browser-trace/edge-network-export-har.png)

1. Stop Steps Recorder, and save the file.

1. Back in the browser developer tools pane, select the **Console** tab, and expand the window. Place your cursor at the start of the console output then drag and select the entire contents of the output. Right-click, then select **Copy**, and save the console output to a text file.

    ![Screenshot of console output](media/capture-browser-trace/edge-console-select.png)

1. Package the HAR file, console output, and screen recording in a compressed format like .zip, and share that with Microsoft support.

## Apple Safari

The following steps show how to use the developer tools in Apple Safari. For more information, see [Safari Developer Tools overview](https://support.apple.com/guide/safari-developer/safari-developer-tools-overview-dev073038698/11.0/mac).

1. Enable the developer tools in Apple Safari:

    1. Select **Safari**, then select **Preferences**.

        ![Screenshot of Safari preferences](media/capture-browser-trace/safari-preferences.png)

    1. Select the **Advanced** tab, then select **Show Develop menu in menu bar**.

        ![Screenshot of Safari advanced preferences](media/capture-browser-trace/safari-show-develop-menu.png)

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your sign-in. 

1. Start recording the steps you take in the portal. For more information, see [How to record the screen on your Mac](https://support.apple.com/HT208721).

1. In the portal, navigate to the step just prior to where the issue occurs.

1. Select **Develop**, then select **Show Web Inspector**.

    ![Screenshot of "Show Web Inspector"](media/capture-browser-trace/safari-show-web-inspector.png)

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro requires going to more than one page:

    1. Select the **Network** tab, then select **Preserve Log**.

          ![Screenshot of "Preserve Log"](media/capture-browser-trace/safari-network-preserve-log.png)

    1. Select the **Console** tab, then select **Preserve Log**.

          ![Screenshot of "Preserve Log"](media/capture-browser-trace/safari-console-preserve-log.png)

1. Select the **Network** tab, then select **Clear Network Items**.

    ![Screenshot of "Clear Network Items"](media/capture-browser-trace/safari-clear-session.png)

1. Reproduce the issue in the portal. You will see session output similar to the following image.

    ![Screenshot of browser trace results](media/capture-browser-trace/safari-browser-trace-results.png)

1. After you have reproduced the unexpected portal behavior, select **Export** and save the file.

    ![Screenshot of "Export"](media/capture-browser-trace/safari-network-export-har.png)

1. Stop the screen recorder, and save the file.

1. Back in the browser developer tools pane, select the **Console** tab, and expand the window. Place your cursor at the start of the console output then drag and select the entire contents of the output. Use Command-C to copy the output and save it to a text file.

    ![Screenshot of console output](media/capture-browser-trace/safari-console-select.png)

1. Package the HAR file, console output, and screen recording in a compressed format like .zip, and share that with Microsoft support.

## Next steps

[Azure portal overview](azure-portal-overview.md)