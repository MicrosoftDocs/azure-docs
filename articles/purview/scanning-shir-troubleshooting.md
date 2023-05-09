---
title: Troubleshoot the self-hosted integration runtime in Microsoft Purview
description: Learn how to troubleshoot self-hosted integration runtime issues in Microsoft Purview. 
author: abandyop
ms.service: purview
ms.subservice: purview-data-map
ms.custom: purview
ms.topic: troubleshooting
ms.date: 04/03/2023
ms.author: arindamba
---

# Troubleshoot Microsoft Purview self-hosted integration runtime (SHIR)

This article explores common troubleshooting methods for self-hosted integration runtime (SHIR) in Microsoft Purview.

The self-hosted integration runtime (SHIR) is also used by Azure Data Factory and Azure Synapse Analytics. Though many of the troubleshooting steps overlap, follow this guide to troubleshoot your SHIR for those products:

- [Troubleshoot SHIR for Azure Data Factory and Azure Synapse Analytics](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md)

## Gather Microsoft Purview specific SHIR self-hosted integration runtime logs

For failed Microsoft Purview activities that are running on a self-hosted IR or shared IR, the service supports viewing and uploading error logs from the [Windows Event Viewer](/shows/inside/event-viewer).

You can look up any errors you see in the error guide below.
To get support and troubleshooting guidance for SHIR issues, you may need to generate an error report ID and [reach out to Microsoft support](https://azure.microsoft.com/support/create-ticket/).

To generate the error report ID for Microsoft Support, follow these instructions:

1. Before starting a scan in the Microsoft Purview governance portal:

    1. Navigate to the machine where the self-hosted integration runtime is installed and open the Windows Event Viewer.
    1. Clear the windows event viewer logs in the **Integration Runtime** section. Right-click on the logs and select the clear logs option.
    1. Navigate back to the Microsoft Purview governance portal and start the scan.
    1. Once the scan shows status **Failed**, navigate back to the SHIR VM, or machine and refresh the event viewer in the **Integration Runtime** section.
    1. The activity logs are displayed for the failed scan run.

    :::image type="content" source="media/scanning-shir-troubleshooting/shir-event-viewer-logs-ir.png" lightbox="media/scanning-shir-troubleshooting/shir-event-viewer-logs-ir.png" alt-text="Screenshot of the logs for the failed scan SHIR activity.":::

1. For further assistance from Microsoft, select **Send Logs**.

   The **Share the self-hosted integration runtime (SHIR) logs with Microsoft** window opens.

    :::image type="content" source="media/scanning-shir-troubleshooting/shir-send-logs-ir.png" lightbox="media/scanning-shir-troubleshooting/shir-send-logs-ir.png" alt-text="Screenshot of the send logs button on the self-hosted integration runtime (SHIR) to upload logs to Microsoft.":::

1. Select which logs you want to send.

    * For a *self-hosted IR*, you can upload logs that are related to the failed activity or all logs on the self-hosted IR node.
    * For a *shared IR*, you can upload only logs that are related to the failed activity.

1. When the logs are uploaded, keep a record of the Report ID for later use if you need further assistance to solve the issue.

    :::image type="content" source="media/scanning-shir-troubleshooting/shir-send-logs-complete.png" lightbox="media/scanning-shir-troubleshooting/shir-send-logs-complete.png" alt-text="Screenshot of the displayed report ID in the upload progress window for the Purview SHIR logs.":::

> [!NOTE]
> Log viewing and uploading requests are executed on all online self-hosted IR instances. If any logs are missing, make sure that all the self-hosted IR instances are online.

## Self-hosted integration runtime SHIR general failure or error

There are lots of common errors, warnings, issues between Purview SHIR and Azure Data Factory or Azure Synapse SHIR. If your SHIR issues aren't resolved at this stage, refer to the [Azure Data Factory ADF or Azure Synapse SHIR troubleshooting guide](../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md)

[!INCLUDE[SHIR](./includes/troubleshoot-shir-include.md)]

## Next Steps

For more help with troubleshooting, try the following resources:

- [Getting started with Microsoft Purview](https://azure.microsoft.com/products/purview/)
- [Create and Manage SHIR Self-hosted integration runtimes in Purview](manage-integration-runtimes.md)
- [Microsoft Purview frequently asked questions](frequently-asked-questions.yml)
