---
title: Troubleshoot SHIR self-hosted integration runtime
titleSuffix: Microsoft Purview, Azure Data Factory & Azure Synapse
description: Learn how to troubleshoot self-hosted integration runtime issues in Microsoft Purview. 
author: abandyop
ms.service: purview
ms.subservice: integration-runtime
ms.custom: purview
ms.topic: troubleshooting
ms.date: 04/01/2023
ms.author: arindamba
---

# Troubleshoot Microsoft Purview SHIR self-hosted integration runtime

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article explores common troubleshooting methods for self-hosted integration runtime (SHIR) in Microsoft Purview, Azure Data Factory and Synapse workspaces.

## Gather self-hosted IR logs

For failed activities that are running on a self-hosted IR or a shared IR, the service supports viewing and uploading error logs from the [Windows Event Viewer](https://learn.microsoft.com/shows/inside/event-viewer).
To get support for SHIR issues, you may need to generate an error report and send it across to Microsoft . To generate the error report ID, follow the instructions here, and then enter the report ID to search for related known issues.

1. Before starting the scan: 
- Clear the windows event viewer logs in the "Integration Runtime" section. Right-click on the logs and select clear logs option.
- Then, start the scan on Purview portal.
- Once the scan shows status "Failed" on Purview portal, navigate back to the SHIR VM or machine and refresh the event viewer in the "Integration Runtime" section.
- The activity logs are displayed for the failed activity run.
    
    :::image type="content" source="..media/self-hosted-integration-runtime-troubleshoot-guide/send-logs.png" alt-text="Screenshot of the activity logs for the failed activity."::: 
    
1. For further assistance from Microsoft, select **Send Logs**.
 
   The **Share the self-hosted integration runtime (IR) logs with Microsoft** window opens.

    :::image type="content" source="media/self-hosted-integration-runtime-troubleshoot-guide/choose-logs.png" alt-text="Screenshot of the &quot;Share the self-hosted integration runtime (IR) logs with Microsoft&quot; window.":::

1. Select which logs you want to send. 
    * For a *self-hosted IR*, you can upload logs that are related to the failed activity or all logs on the self-hosted IR node. 
    * For a *shared IR*, you can upload only logs that are related to the failed activity.

1. When the logs are uploaded, keep a record of the Report ID for later use if you need further assistance to solve the issue.

    :::image type="content" source="media/self-hosted-integration-runtime-troubleshoot-guide/upload-logs.png" alt-text="Screenshot of the displayed report ID in the upload progress window for the IR logs.":::

> [!NOTE]
> Log viewing and uploading requests are executed on all online self-hosted IR instances. If any logs are missing, make sure that all the self-hosted IR instances are online. 


## Self-hosted integration runtime SHIR general failure or error

There are lots of common errors, warnings, issues between Purview SHIR and Azure Data Factory or Azure Synapse SHIR.

If your SHIR issues are not resolved, refer to the [Azure Data Factory ADF or Azure Synapse SHIR troubleshooting guide](../../data-factory/self-hosted-integration-runtime-troubleshoot-guide.md)

## Next steps

For more help with troubleshooting, try the following resources:

*  [Getting started with Microsoft Purview](https://azure.microsoft.com/products/purview/)
*  [Create and Manage SHIR Self-hosted integration runtimes in Purview](manage-integration-runtimes.md)
*  [Stack overflow forum for Microsoft Purview](https://stackoverflow.com/questions/tagged/azure-purview)
*  [Twitter information about Microsoft Purview](https://twitter.com/hashtag/Purview)
*  [Microsoft Purview Troubleshooting](frequently-asked-questions.md)


