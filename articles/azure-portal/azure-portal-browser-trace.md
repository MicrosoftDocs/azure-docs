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

If you're troubleshooting an issue with the Azure portal, and you need to contact Microsoft support, we recommend you first capture a browser trace and some additional information. The browser trace can provide important details about the network traffic at the time the issue occurs.

Follow the steps in this article to capture a trace and export a _HAR file_ with the trace information. We show the steps in the Microsoft Edge, Google Chrome, and Apple Safari browsers.

1. Sign in to the [Azure portal](https://portal.azure.com). It's important to sign in _before_ you start the trace so that the trace doesn't contain sensitive information related to your sign-in. 

1. In the portal, navigate to the step just prior to where the issue occurs.

1. Press F12 to open the developer tools pane, or open it from a tools menu (More tools > Developer tools). 

1. Select the **Network** tab.

1. To ensure that, select the appropriate option for your browser:

    - For Edge, clear the option **Clear entries on navigate**.

    - For Chrome, select **Preserve log**.

    - For Safari, select ****. 

1. Stop the browser trace session and clear the session.

    - For Edge, select **Stop profiling session** and **Clear session**.

    - For Chrome, select **Stop recording network log** and **Clear**.

    - For Safari, select ****. 

1. Restart the session, then reproduce the issue in the Azure portal. You will see session output similar to the following image.

1. Stop the session and save the trace as a HAR file.

    - For Edge, select **Export as HAR**.

    - For Chrome, select **Export HAR**.

    - For Safari, select ****. 

1. Compress the HAR file and send it to support for analysis and troubleshooting.

1. Console

1. I’ve also seen some teammates ask customer to collect a problem recorder trace which screen grabs their monitor when they click through some repro, so this might be also good to reference or include into workflow, whatever you guys recommend: https://support.microsoft.com/en-us/help/22878/windows-10-record-steps 