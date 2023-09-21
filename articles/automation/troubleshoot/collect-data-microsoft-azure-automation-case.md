---
title: Data to collect when opening a case for Microsoft Azure Automation | Microsoft Docs
description: This article describes the information to gather before opening a case for Azure Automation with Microsoft Azure Support.
services: automation
ms.subservice:
ms.topic: troubleshooting
ms.custom: engagement-fy23
ms.date: 10/21/2022
---

# Data to collect when opening a case for Microsoft Azure Automation

This article describes the information that you should gather before you open a case for Azure Automation with Microsoft Azure Support. Even though this information isn't required to open a case. However, it helps the support team to quickly resolve a problem.  
 
> [!NOTE]
> For more information, refer the Knowledge Base article [4034605 - How to capture Azure Automation-scripted diagnostics](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics).


## Data for Update Management issues on Linux

1. Run the following log collection tool, in addition to the details in KB [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics).

      - [OMS Linux Agent Log Collector](https://github.com/Microsoft/OMS-Agent-for-Linux/blob/master/tools/LogCollector/OMS_Linux_Agent_Log_Collector.md)
 
1. Compress the contents of the **/var/opt/microsoft/omsagent/run/automationworker/** folder, and send the compressed file to Azure Support.
 
1. Verify that the ID for the workspace that the Log Analytics agent for Linux reports to is the same as the ID for the workspace being monitored for updates.

## Data for Update Management issues on Windows

1. Collect data for the items listed in [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics).

1. Export the following event logs into the EVTX format:

   * System
   * Application
   * Security
   * Operations Manager
   * Microsoft-SMA/Operational

1. Verify that the ID of the workspace that the agent reports to is the same as the ID for the workspace being monitored by Windows Updates.

## Data for job issues

1. Collect data for the items listed in [4034605](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics).

2. Collect the job ID for the job that has an issue:

   1. In the Azure portal, go to **Automation Accounts**.
   2. Select the Automation account that you are troubleshooting, and note the name.
   3. Select **Jobs**.

      :::image type="content" source="./media/collect-data-microsoft-azure-automation-case/select-jobs.png" alt-text="Screenshot showing to select jobs menu from automation account.":::

   4. Choose the job that you are troubleshooting.
   5. In the Job Summary pane, check for the GUID value in **Job ID**.

      :::image type="content" source="./media/collect-data-microsoft-azure-automation-case/job-summary-job-id.png" alt-text="Screenshot Job ID within Job Summary Pane.":::

3. Collect a sample of the script that you are running.

4. Collect the log files:

   1. In the Azure portal, go to **Automation Accounts**.
   2. Select the Automation account that you are troubleshooting.
   3. Select **Jobs**.
   4. Choose the job that you are troubleshooting.
   5. Select **All Logs**.
      In the pane below, you can collect the data.

       :::image type="content" source="./media/collect-data-microsoft-azure-automation-case/all-logs-data.png" alt-text="Screenshot of Data listed under All Logs.":::
      
## Data for module issues

In addition to the knowledge Base article [4034605 - How to capture Azure Automation-scripted diagnostics](https://support.microsoft.com/help/4034605/how-to-capture-azure-automation-scripted-diagnostics), obtain the following information:

* The steps you followed, so that the problem can be reproduced.
* Screenshots of any error messages.
* Screenshots of the current modules and their version numbers.

## Next steps

* Get answers from Azure experts through [Azure Forums](https://azure.microsoft.com/support/forums/).
* Connect with [@AzureSupport](https://twitter.com/azuresupport), the official Microsoft Azure account for improving customer experience by connecting the Azure community to the right resources: answers, support, and experts.
* File an Azure support incident. Go to the [Azure support site](https://azure.microsoft.com/support/options/) and select **Get Support**.
