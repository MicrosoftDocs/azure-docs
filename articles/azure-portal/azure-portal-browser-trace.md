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

If you're troubleshooting an issue with the Azure portal, and you need to contact Microsoft support, we recommend you first capture a browser trace and some additional information. The information you collect can provide important details about the portal at the time the issue occurs. Follow the steps in this article for the brower you use: Microsoft Edge, Google Chrome, or Apple Safari.

## Microsoft Edge

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your sign-in. 

1. Start recording the steps you take in the portal, using [Steps Recorder](https://support.microsoft.com/help/22878/windows-10-record-steps).

1. In the portal, navigate to the step just prior to where the issue occurs.

1. Press F12 or select **More Tools** > **Developer Tools**.

1. Ensure that the trace captures information from all the pages you visit in the portal:

    1. Select the **Network** tab, and clear the option **Clear entries on navigate**.

    1. Select the **Console** tab, and select **SOMELOGTHING**.

1. Select the **Network** tab.

1. Select **Stop profiling session** and **Clear session**.

1. Restart the session, then reproduce the issue in the portal. You will see session output similar to the following image.

1. Stop the session and select **Export as HAR**.

1. Compress the HAR file and send it to support for analysis and troubleshooting.

1. Select the **Console** tab

1. Copy and save


## Scratch

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your sign-in. 

1. (Optional) Start recording the steps you take in the portal, using [Steps Recorder](https://support.microsoft.com/help/22878/windows-10-record-steps).

1. In the portal, navigate to the step just prior to where the issue occurs.

 Ive also seen some teammates ask customer to collect a problem recorder trace which screen grabs their monitor when they click through some repro, so this might be also good to reference or include into workflow, whatever you guys recommend: 


1. Open the developer tools pane:

    - Edge: select **More Tools** > **Developer Tools**.

    - Chrome: select **More tools** > **Developer tools**.

    - Safari: first enable the developer tools by selecting **Preferences** > **Advanced** > **Show Develop menu in menu bar**. Then select **Develop** > **Show Web Inspector**.

1. Select the **Network** tab.

1. To ensure that, select the appropriate option for your browser:

    - Edge: clear the option **Clear entries on navigate**.

    - Chrome: select **Preserve log**.

    - Safari: select ****. 

1. Stop the browser trace session and clear the session.

    - Edge: select **Stop profiling session** and **Clear session**.

    - Chrome: select **Stop recording network log** and **Clear**.

    - Safari: select ****. 

1. Restart the session, then reproduce the issue in the Azure portal. You will see session output similar to the following image.

1. Stop the session and save the trace as a HAR file.

    - Edge: select **Export as HAR**.

    - Chrome: select **Export HAR**.

    - Safari: select ****. 

1. Compress the HAR file and send it to support for analysis and troubleshooting.

1. Console

1. 

## Google Chrome

## Apple Safari

## Next steps