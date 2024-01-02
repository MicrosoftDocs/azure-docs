---
title: Capture a browser trace for troubleshooting
description: Capture network information from a browser trace to help troubleshoot issues with the Azure portal.
ms.date: 05/01/2023
ms.topic: how-to
---

# Capture a browser trace for troubleshooting

If you're troubleshooting an issue with the Azure portal, and you need to contact Microsoft support, you may want to first capture some additional information. For example, it can be helpful to share a browser trace, a step recording, and console output. This information can provide important details about what exactly is happening in the portal when your issue occurs.

> [!WARNING]
> Browser traces often contain sensitive information and might include authentication tokens linked to your identity. Please remove any sensitive information before sharing traces with others. Microsoft support uses these traces for troubleshooting purposes only.

You can capture this information any [supported browser](azure-portal-supported-browsers-devices.md): Microsoft Edge, Google Chrome, Safari (on Mac), or Firefox. Steps for each browser are shown below.

## Microsoft Edge

The following steps show how to use the developer tools in Microsoft Edge. For more information, see [Microsoft Edge DevTools](/microsoft-edge/devtools-guide-chromium).

> [!NOTE]
> The screenshots below show the DevTools in Focus Mode with a vertical **Activity Bar**. Depending on your settings, your configuration may look different. For more information, see [Simplify DevTools using Focus Mode](/microsoft-edge/devtools-guide-chromium/experimental-features/focus-mode).

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your account.

1. Start recording the steps you take in the portal, using [Steps Recorder](https://support.microsoft.com/windows/record-steps-to-reproduce-a-problem-46582a9b-620f-2e36-00c9-04e25d784e47).

1. In the portal, navigate to the step prior to where the issue occurs.

1. Press F12 to launch Microsoft Edge DevTools. You can also launch the tools from the toolbar menu under **More tools** > **Developer tools**.

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro steps require going to more than one page.

    1. Select the **Console** tab, select **Console settings**, then select **Preserve Log**.

       :::image type="content" source="media/capture-browser-trace/edge-console-preserve-log.png" alt-text="Screenshot that highlights the Preserve log option on the Console tab in Edge.":::

    1. Select the **Network** tab. If that tab isn't visible, click the **More tools** (+) button and select **Network**. Then, from the **Network** tab, select **Preserve log**.

       :::image type="content" source="media/capture-browser-trace/edge-network-preserve-log.png" alt-text="Screenshot that highlights the Preserve log option on the Network tab in Edge.":::

1. On the **Network** tab, select **Stop recording network log** and **Clear**.

    :::image type="content" source="media/capture-browser-trace/edge-stop-clear-session.png" alt-text="Screenshot showing the Stop recording network log and Clear options on the Network tab in Edge.":::

1. Select **Record network log**, then reproduce the issue in the portal.

   :::image type="content" source="media/capture-browser-trace/edge-start-session.png" alt-text="Screenshot showing how to record the network log in Edge.":::

   You'll see session output similar to the following image.

   :::image type="content" source="media/capture-browser-trace/edge-browser-trace-results.png" alt-text="Screenshot showing session output in Edge.":::

1. After you have reproduced the unexpected portal behavior, select **Stop recording network log**, then select **Export HAR** and save the file.

   :::image type="content" source="media/capture-browser-trace/edge-network-export-har.png" alt-text="Screenshot showing how to Export HAR on the Network tab in Edge.":::

1. Stop the Steps Recorder and save the recording.

1. Back in the browser developer tools pane, select the **Console** tab. Right-click one of the messages, then select **Save as...**, and save the console output to a text file.

   :::image type="content" source="media/capture-browser-trace/edge-console-select.png" alt-text="Sccreenshot showing how to save the console output in Edge.":::

1. Package the browser trace HAR file, console output, and screen recording files in a compressed format such as .zip.

1. Share the compressed file with Microsoft support by [using the **File upload** option in your support request](supportability/how-to-manage-azure-support-request.md#upload-files).

## Google Chrome

The following steps show how to use the developer tools in Google Chrome. For more information, see [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools).

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your account.

1. Start recording the steps you take in the portal, using [Steps Recorder](https://support.microsoft.com/windows/record-steps-to-reproduce-a-problem-46582a9b-620f-2e36-00c9-04e25d784e47).

1. In the portal, navigate to the step prior to where the issue occurs.

1. Press F12 to launch the developer tools. You can also launch the tools from the toolbar menu under **More tools** > **Developer tools**.

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro steps require going to more than one page:

   1. Select the **Console** tab, select **Console settings**, then select **Preserve Log**.

      ![Screenshot that highlights the Preserve log option on the Console tab in Chrome.](media/capture-browser-trace/chromium-console-preserve-log.png)

   1. Select the **Network** tab, then select **Preserve log**.

      ![Screenshot that highlights the Preserve log option on the Network tab in Chrome.](media/capture-browser-trace/chromium-network-preserve-log.png)

1. On the **Network** tab, select **Stop recording network log** and **Clear**.

   ![Screenshot of "Stop recording network log" and "Clear" on the Network tab in Chrome.](media/capture-browser-trace/chromium-stop-clear-session.png)

1. Select **Record network log**, then reproduce the issue in the portal.

   ![Screenshot that shows how to record the network log in Chrome.](media/capture-browser-trace/chromium-start-session.png)

    You'll see session output similar to the following image.

    ![Screenshot that shows the session output in Chrome.](media/capture-browser-trace/chromium-browser-trace-results.png)

1. After you have reproduced the unexpected portal behavior, select **Stop recording network log**, then select **Export HAR** and save the file.

   ![Screenshot that shows how to Export HAR on the Network tab in Chrome.](media/capture-browser-trace/chromium-network-export-har.png)

1. Stop the Steps Recorder and save the recording.

1. Back in the browser developer tools pane, select the **Console** tab. Right-click one of the messages, then select **Save as...**, and save the console output to a text file.

    ![Screenshot that shows how to save the console output in Chrome.](media/capture-browser-trace/chromium-console-select.png)

1. Package the browser trace HAR file, console output, and screen recording files in a compressed format such as .zip.

1. Share the compressed file with Microsoft support by [using the **File upload** option in your support request](supportability/how-to-manage-azure-support-request.md#upload-files).

## Safari

The following steps show how to use the developer tools in Apple Safari on Mac. For more information, see [Safari Developer Tools overview](https://support.apple.com/guide/safari-developer/safari-developer-tools-overview-dev073038698/11.0/mac).

1. Enable the developer tools in Safari:

   1. Select **Safari**, then select **Preferences**.

   1. Select the **Advanced** tab, then select **Show Develop menu in menu bar**.

      ![Screenshot of the Safari advanced preferences options.](media/capture-browser-trace/safari-show-develop-menu.png)

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your account.

1. Start recording the steps you take in the portal. For more information, see [How to record the screen on your Mac](https://support.apple.com/HT208721).

1. In the portal, navigate to the step prior to where the issue occurs.

1. Select **Develop**, then select **Show Web Inspector**.

   ![Screenshot of the "Show Web Inspector" command.](media/capture-browser-trace/safari-show-web-inspector.png)

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro steps require going to more than one page:

    1. Select the **Console** tab, then select **Preserve Log**.

       ![Screenshot that shows the Preserve Log on the Console tab.](media/capture-browser-trace/safari-console-preserve-log.png)

    1. Select the **Network** tab, then select **Preserve Log**.

       ![Screenshot that shows the Preserve Log option on the Network tab.](media/capture-browser-trace/safari-network-preserve-log.png)

1. On the **Network** tab, select **Clear Network Items**.

    ![Screenshot of "Clear Network Items" on the Network tab.](media/capture-browser-trace/safari-clear-session.png)

1. Reproduce the issue in the portal. You'll see session output similar to the following image.

    ![Screenshot that shows the output after you've reproduced the issue.](media/capture-browser-trace/safari-browser-trace-results.png)

1. After you have reproduced the unexpected portal behavior, select **Export** and save the file.

    ![Screenshot of the "Export" command on the Network tab.](media/capture-browser-trace/safari-network-export-har.png)

1. Stop the screen recorder, and save the recording.

1. Back in the browser developer tools pane, select the **Console** tab, and expand the window. Place your cursor at the start of the console output then drag and select the entire contents of the output. Use Command-C to copy the output and save it to a text file.

    ![Screenshot that shows where you can view and copy the console output.](media/capture-browser-trace/safari-console-select.png)

1. Package the browser trace HAR file, console output, and screen recording files in a compressed format such as .zip.

1. Share the compressed file with Microsoft support by [using the **File upload** option in your support request](supportability/how-to-manage-azure-support-request.md#upload-files).

## Firefox

The following steps show how to use the developer tools in Firefox. For more information, see [Firefox Developer Tools](https://developer.mozilla.org/docs/Tools).

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your account.

1. Start recording the steps you take in the portal. Use [Steps Recorder](https://support.microsoft.com/windows/record-steps-to-reproduce-a-problem-46582a9b-620f-2e36-00c9-04e25d784e47) on Windows, or see [How to record the screen on your Mac](https://support.apple.com/HT208721).

1. In the portal, navigate to the step prior to where the issue occurs.

1. Press F12 to launch the developer tools. You can also launch the tools from the toolbar menu under **More tools** > **Web developer tools**.

1. By default, the browser keeps trace information only for the page that's currently loaded. Set the following options so the browser keeps all trace information, even if your repro steps require going to more than one page:

    1. Select the **Console** tab, select the **Settings** icon, and then select **Persist Logs**.

       :::image type="content" source="media/capture-browser-trace/firefox-console-persist-logs.png" alt-text="Screenshot of the Console setting for Persist Logs.":::

    1. Select the **Network** tab, select the **Settings** icon, and then select **Persist Logs**.

       :::image type="content" source="media/capture-browser-trace/firefox-network-persist-logs.png" alt-text="Screenshot of the Network setting for Persist Logs.":::

1. On the **Network** tab, select **Clear**.

    ![Screenshot of the "Clear" option on the Network tab.](media/capture-browser-trace/firefox-clear-session.png)

1. Reproduce the issue in the portal. You'll see session output similar to the following image.

    ![Screenshot showing example browser trace results.](media/capture-browser-trace/firefox-browser-trace-results.png)

1. After you have reproduced the unexpected portal behavior, select **Save All As HAR**.

    ![Screenshot of the "Save All As HAR" command on the Network tab.](media/capture-browser-trace/firefox-network-export-har.png)

1. Stop the Steps Recorder on Windows or the screen recording on Mac, and save the recording.

1. Back in the browser developer tools pane, select the **Console** tab. Right-click one of the messages, then select **Save All Messages to File**, and save the console output to a text file.

   :::image type="content" source="media/capture-browser-trace/firefox-console-select.png" alt-text="Screenshot of the Save All Messages to File command on the Console tab.":::

1. Package the browser trace HAR file, console output, and screen recording files in a compressed format such as .zip.

1. Share the compressed file with Microsoft support by [using the **File upload** option in your support request](supportability/how-to-manage-azure-support-request.md#upload-files).

## Next steps

- Read more about the [Azure portal](azure-portal-overview.md).
- Learn how to [open a support request](supportability/how-to-create-azure-support-request.md) in the Azure portal.
- Learn more about [file upload requirements for support requests](supportability/how-to-manage-azure-support-request.md#file-upload-guidelines).
