---
title: SQL Assessment
description: "Identify performance issues and assess that your SQL Server VM is configured to follow best practices by using the SQL Assessments feature in the Azure portal."
author: ebruersan
ms.author: ebrue
ms.service: virtual-machines
ms.topic: how-to
ms.date: 11/02/2021
ms.reviewer: mathoma
ms.custom: ignite-fall-2021
---


# SQL Assessment for SQL Server on Azure VMs (Preview)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

The SQL Assessment feature of the Azure portal identifies possible performance issues and evaluates that your SQL Server on Azure Virtual Machines (VMs) is configured to follow best practices using the [rich ruleset](https://github.com/microsoft/sql-server-samples/blob/master/samples/manage/sql-assessment-api/DefaultRuleset.csv) provided by the [SQL Assessment API](/sql/sql-assessment-api/sql-assessment-api-overview). 

The SQL Assessment feature is currently in preview.

To learn more, watch this video on [SQL Assessment](/shows/Data-Exposed/?WT.mc_id=dataexposed-c9-niner):
<iframe src="https://aka.ms/docs/player?id=13b2bf63-485c-4ec2-ab14-a1217734ad9f" width="640" height="370" style="border: 0; max-width: 100%; min-width: 100%;"></iframe>



## Overview

Once the SQL Assessment feature is enabled, your SQL Server instance and databases are scanned to provide recommendations for things like indexes, deprecated features, enabled or missing trace flags, statistics, etc. Recommendations are surfaced to the [SQL VM management page](manage-sql-vm-portal.md) of the [Azure portal](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines). 


Assessment results are uploaded to your [Log Analytics workspace](../../../azure-monitor/logs/quick-create-workspace.md) using [Microsoft Monitoring Agent (MMA)](../../../azure-monitor/agents/log-analytics-agent.md). If your VM is already configured to use Log Analytics, the SQL Assessment feature uses the existing connection.  Otherwise, the MMA extension is installed to the SQL Server VM and connected to the specified Log Analytics workspace.

Assessment run time depends on your environment (number of databases, objects, and so on), with a duration from a few minutes, up to an hour. Similarly, the size of the assessment result also depends on your environment. Assessment runs against your instance and all databases on that instance.

## Prerequisites

To use the SQL Assessment feature, you must have the following prerequisites: 

- Your SQL Server VM must be registered with the [SQL Server IaaS extension in full mode](sql-agent-extension-manually-register-single-vm.md#full-mode). 
- A [Log Analytics workspace](../../../azure-monitor/logs/quick-create-workspace.md) in the same subscription as your SQL Server VM to upload assessment results to. 
- SQL Server needs to be 2012 or higher version.


## Enable

To enable SQL Assessments, follow these steps: 

1. Sign into the [Azure portal](https://portal.azure.com) and go to your [SQL Server VM resource](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines). 
1. Select **SQL Assessments** under **Settings**. 
1. Select **Enable SQL Assessments** or **Configuration** to navigate to the **Configuration** page. 
1. Check the **Enable SQL Assessments** box and provide the following:
    1. The [Log Analytics workspace](../../../azure-monitor/logs/quick-create-workspace.md) that assessments will be uploaded to. If the SQL Server VM has not been associated with a workspace previously, then choose an existing workspace in the subscription from the drop-down. Otherwise, the previously-associated workspace is already populated.  
    1. The **Run schedule**. You can choose to run assessments on demand, or automatically on a schedule. If you choose a schedule, then provide the frequency (weekly or monthly), day of week, recurrence (every 1-6 weeks), and the time of day your assessments should start (local to VM time). 
1. Select **Apply** to save your changes and deploy the Microsoft Monitoring Agent to your SQL Server VM if it's not deployed already. An Azure portal notification will tell you once the SQL Assessment feature is ready for your SQL Server VM. 
    

## Assess SQL Server VM

Assessments run:
- On a schedule
- On demand

### Run scheduled assessment

If you set a schedule in the configuration blade, an assessment runs automatically at the specified date and time. Choose **Configuration** to modify your assessment schedule. Once you provide a new schedule, the previous schedule is overwritten.  

### Run on demand assessment

After the SQL Assessment feature is enabled for your SQL Server VM, it's possible to run an assessment on demand. To do so, select **Run assessment** from the SQL Assessment blade of the [Azure portal SQL Server VM resource](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) page.


## View results

The **Assessments results** section of the **SQL Assessments** page shows a list of the most recent assessment runs. Each row displays the start time of a run and the status - scheduled, running, uploading results, completed, or failed. Each assessment run has two parts: evaluates your instance, and uploads the results to your Log Analytics workspace. The status field covers both parts. Assessment results are shown in Azure workbooks. 

Access the assessment results Azure workbook in three ways: 
- Select the **View latest successful assessment button** on the **SQL Assessments** page.
- Choose a completed run from the **Assessment results** section of the **SQL Assessments** page. 
- Select **View assessment results** from the **Top 10 recommendations** surfaced on the **Overview** page of your SQL VM resource page. 

Once you have the workbook open, you can use the drop-down to select previous runs. You can view the results of a single run using the **Results** page or review historical trends using the **Trends** page.

### Results page

The **Results** page organizes the recommendations using tabs for *All, new, resolved*. Use these tabs to view all recommendations from the current run, all the new recommendations (the delta from previous runs), or resolved recommendations from previous runs. Tabs help you track progress between runs. The *Insights* tab identifies the most recurring issues and the databases with the most issues. Use these to decide where to concentrate your efforts. 

The graph groups assessment results in different categories of severity - high, medium, and low. Select each category to see the list of recommendations, or search for key phrases in the search box. It's best to start with the most severe recommendations and go down the list.

Sort by **Name** in the table to view recommendations grouped by a particular database or instance. Use the search box to view certain types of recommendations based on the tag value or key phrase, such as performance. Use the down arrow at the top-right of the table to expert results to an excel file. 

The **passed** section of the graph identifies recommendations your system already follows. 

View detailed information for each recommendation by selecting the **Message** field, such as a long description, and relevant online resources. 
 
### Trends page

There are three charts on the **Trends** page to show changes over time: all issues, new issues, and resolved issues. The charts help you see your progress. Ideally, the number of recommendations should go down while the number of resolved issues goes up. The legend shows the average number of issues for each severity level. Hover over the bars to see the individual vales for each run. 

If there are multiple runs in a single day, only the latest run is included in the graphs on the **Trends** page. 

## Known Issues

You may encounter some of the following known issues when using SQL assessments. 

### Configuration error for Enable Assessment

If your virtual machine is already associated with a Log Analytics workspace that you don't have access to or that is in another subscription, you will see an error in the configuration blade. For the former, you can either obtain permissions for that workspace or switch your VM to a different Log Analytics workspace by following [these instructions](../../../azure-monitor/agents/agent-manage.md) to remove Microsoft Monitoring Agent. We are working on enabling the scenario where the Log Analytics workspace is in another subscription.

### Deployment failure for Enable or Run Assessment 

Refer to the [deployment history](../../../azure-resource-manager/templates/deployment-history.md) of the resource group containing the SQL VM to view the error message associated with the failed action. 
 
### Failed assessments 

If the assessment or uploading the results failed for some reason, the status of that run will indicate the failure. Clicking on the status will open a context pane where you can see the details about the failure and possible ways to remediate the issue.

>[!TIP]
>If you have enforced TLS 1.0 or higher in Windows and disabled older SSL protocols as described [here](/troubleshoot/windows-server/windows-security/restrict-cryptographic-algorithms-protocols-schannel#schannel-specific-registry-keys), then you must also ensure that .NET Framework is [configured](../../../azure-monitor/agents/agent-windows.md#configure-agent-to-use-tls-12) to use strong cryptography. 

## Next steps

- To register your SQL Server VM with the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](sql-agent-extension-automatic-registration-all-vms.md), [Single VMs](sql-agent-extension-manually-register-single-vm.md), or [VMs in bulk](sql-agent-extension-manually-register-vms-bulk.md).
- To learn about more capabilities available by the SQL Server IaaS extension to SQL Server on Azure VMs, see [Manage SQL Server VMs by using the Azure portal](manage-sql-vm-portal.md)
