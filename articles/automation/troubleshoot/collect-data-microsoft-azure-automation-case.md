---
title: Data to collect when you open a case for Microsoft Azure Automation| Microsoft Docs
description: This article describes some of the basic information that you should gather before you open a case for Azure Automation with Microsoft Azure Support.
services: virtual-machines-windows, azure-resource-manager
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
tags: top-support-issue, azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: na
ms.tgt_pltfrm: vm-windows

ms.topic: troubleshooting
ms.date: 09/23/2019
ms.author: v-miegge
---

# Data to collect when you open a case for Microsoft Azure Automation

This article describes some of the basic information that you should gather before you open a case for Azure Automation with Microsoft Azure Support. This information is not required to open the case. However, it can help Microsoft resolve your problem more quickly. Also, you may be asked for this data by the support engineer after you open the case.

## Collect more information

Before you open a case for Microsoft Azure Automation Support, we recommend that you collect the following information.

### Basic data collection

Collect the data described in the following Knowledge Base article:

* [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics) How to capture Azure Automation-scripted diagnostics

## Collect data depending on issue
 
### For issues that affect Update Management on Linux

1. In addition to the items that are listed in KB [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics), run the following log collection tool:

   [OMS Linux Agent Log Collector](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/tools/LogCollector/OMS_Linux_Agent_Log_Collector.md)
 
2. Compress the contents of the following folder, then send the compressed file to Azure Support:

   ``/var/opt/microsoft/omsagent/run/automationworker/``
 
3. Verify that the workspace ID the OMS Linux Agent is reporting to, is the same as the workspace being monitored for updates.

### For issues that affect Update Management on Windows

In addition to the items that are listed in [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics), do the following:

1. Export the following event logs into the EVTX format:

   * System
   * Application
   * Security
   * Operations Manager
   * Microsoft-SMA/Operational

2. Verify that the workspace ID the agent is reporting to, is the same as the workspace being monitored by Windows Updates.

### For issues that affect a job

In addition to the items that are listed in [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics), collect the following information:

1. Collect the **JobID** number (for the job that is experiencing an issue):

   1. At the Azure portal, go to the **Automation Accounts** blade.
   2. Select the **Automation Account** that you are troubleshooting.
   3. Select **Jobs**.
   4. Select the job that you are troubleshooting.
   5. Under **Job Summary**, look for a **Job ID** (GUID).

   ![Job ID within Job Summary Pane](media/collect-data-microsoft-azure-automation-case/job-summary-job-id.png)

2. Collect the account name:

   1. At the Azure portal, go to the **Automation Accounts** blade.
   2. Get the name of the **Automation Account** that you're troubleshooting.

3. Collect sample of the script that you are running.

4. Collect the log files:

   1. At the Azure portal, go to the **Automation Accounts** blade.
   2. Select the **Automation Account** that you are troubleshooting.
   3. Select **Jobs**.
   4. Select the job that you are troubleshooting.
   5. Select **All Logs**.
   6. On the resulting blade, collect the data.

   ![Data listed under All Logs](media/collect-data-microsoft-azure-automation-case/all-logs-data.png)

### For issues that affect modules

In addition to the items under "Basic data collection", gather the following information:

* The steps you followed so that the problem can be reproduced.
* A screenshot of any error messages.
* A screenshot of the current modules and their version numbers.

## Next steps

If you need more help at any point in this article, contact the Azure experts on [the MSDN Azure and Stack Overflow forums](https://azure.microsoft.com/support/forums/).

Alternatively, file an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
