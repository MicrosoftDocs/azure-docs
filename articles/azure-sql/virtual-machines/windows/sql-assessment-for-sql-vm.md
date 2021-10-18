---
title: SQL Assessment for SQL Server VMs
description: "Learn how to assess if your SQL Server VM configuration is following best practices." 
author: ebruersan
ms.author: ebrue
ms.service: virtual-machines
ms.topic: how-to 
ms.date: 10/21/2021
---


# SQL Assessment for Azure SQL VM (Preview)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

SQL Assessment provides a mechanism to evaluate the configuration of your Azure SQL VM for best practices. This feature uses [SQL Assessment API](https://docs.microsoft.com/sql/sql-assessment-api/sql-assessment-api-overview) which comes with a [rich ruleset](https://github.com/microsoft/sql-server-samples/blob/master/samples/manage/sql-assessment-api/DefaultRuleset.csv). Once enabled, it will scan your SQL Server instance and databases to provide recommendations on things like indexes, deprecated features, trace flag usage, statistics, etc. By enabling this feature, you will be able to see if your SQL VM follows the recommended best practices right on the same portal page you manage your SQL VM.  
 
Assessment results are uploaded to your [Log Analytics workspace](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace) using [Microsoft Monitoring Agent (MMA)](https://docs.microsoft.com/en-us/azure/azure-monitor/agents/log-analytics-agent). If your VM is configured for Log Analytics usage already, we will use the existing connection. If not, we will install MMA on the VM and connect it to the Log Analytics workspace you specify. 

Assessment run time depends on your environment (number of databases, objects). It might last from a few minutes up to an hour. Similarly, assessment result size also depends on your environment. 

This feature is currently in preview.

## Prerequisites

- SQL Assessment depends on  [SQL Server infrastructure as a service (IaaS) Agent Extension](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-server-iaas-agent-extension-automate-management?tabs=azure-powershell). SQL VM needs to be registered in full mode.
- Assessment results are uploaded to your [Log Analytics workspace](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace). If you don't already have one in the same subscription as your SQL VM, you need to create it prior to enabling SQL Assessment.

## How to enable
You need to enable SQL Assessment in the [Azure portal](https://portal.azure.com).

1. In Azure portal, navigate to your SQL VM resource. IMAGE
2. Use the SQL Assessment (Preview) page of the SQL virtual machines resource to enable this feature. IMAGE
3. Click the Enable SQL Assessment button or the Configuration button. Both will take you to the configuration blade. IMAGE
4. Check the Enable SQL Assessments box. There are two pieces of information you need to provide:
	1. [Log Analytics workspace](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/quick-create-workspace) - Since assessment results are stored in your Log Analytics workspace, you need to provide which workspace to use. 
		1. If the VM is already associated with a Log Analytics workspace (this could be due to other services such as Azure Defender being previously configured or Azure policies defined for your subscription), SQL Assessment will use the existing workspace. 
		2. If the VM is not previously associated with a Log Analytics workspace, you can select one from the dropdown box that shows the list of Log Analytics workspaces in your Azure subscription. If you don't have one created, you will need to navigate to Log Analytics resource and create one before enabling SQL Assessment.
	2. Run schedule - You can run SQL Assessment on demand or automatically on a schedule. If you select to set a schedule you will be able to define your desired frequency by setting these values:
		1. Frequency: weekly or monthly
		2. Day of week
		3. Recurrence: every 1-6 week
		4. Assessment start (local VM time): time of day 

Once you click the Apply button, SQL Assessment and Microsoft Monitoring Agent will be deployed to your VM. 

## How to do an assessment
There are two ways to start an assessment run: on demand and scheduled. 

**On demand assessment run**

Once SQL Assessment is deployed successfully (as indicated under the notifications), you will see the Run assessment button enabled on the main page. Clicking the Run assessment button will start an on demand assessment run for your SQL VM instance and databases.   

**Scheduled assessment run**

If you set a schedule in the configuration blade, an assessment run will automatically be started at the specified date and time.

**Assessment Status**

A list of most recent assessment runs will be shown in Assessment results section on this page. Each row in the list will show the start time of a run and its status: scheduled, running, uploading results, completed, or failed. There are two parts to each run: evaluating your instance and uploading the results to Log Analytics workspace. Status field will cover both parts.


## How to view results
Assessment results are shown in an Azure workbook. You can reach the workbook in three different ways:
1. Click on a completed run in the Assessment results section.
2. Click the View latest successful assessment button. 
3. In the Overview>Notifications section of SQL VM blade, you will see a list of top 10 recommendations. Click View assessment results button to see all results. 
 
Once you are in the workbook, you can use the dropdown to select any of the previously completed runs. You can view the results of a single run using the Results tab or look at historical trends using the Trends tab.

### Results tab

Assessment results are grouped in different categories in the graphs. You can see the list of recommendations for each category by clicking on the graphs or searching for key phrases in the search box. 

Assessments are categorized into high, medium, low, and information based on severity. The best way to work through recommendations is to start with the most severe and go down the list. Sorting by Name in the table will enable you to see recommendations grouped for a particular database or the instance. If you want to look at a certain type of recommendation (e.g., performance), you can use the search box with the tag value or key phrase. You can use the down arrow on the top right corner of the table to export the results to an excel file.

If you click on the passed section of the graph, you can also see which recommendations your system already follows. 
 
You can get detailed information on each recommendation by clicking on the Message field. Details include a longer description of the recommendation as well as a link to further read about it in online documentation. 

Using the tabs (All, New, Resolved), you can look at all the recommendations from this run, new recommendations in this run (delta from the previous run), and resolved recommendations since the previous run. These tabs will help you track progress between runs. Insights tab shows the most recurring issues in this run and also the databases with the most number of issues. These can help you decide where to concentrate your efforts.

### Trends tab

There are three charts here that show the trends over time: all issues, new issues, and resolved issues. These should help you see your progress. The ideal is to have the number of recommendations go down and the number of resolved issues go up. The legend shows the average number of issues for each severity level. If you hover over the bars, you can see individual values for each run. Please note that if there are multiple runs in a single day, only  the latest run is included in these graphs.

## Troubleshooting
#### Deployment failure for Enable or Run Assessment 
Refer to the [deployment history](https://docs.microsoft.com/azure/azure-resource-manager/templates/deployment-history?tabs=azure-portal) of the resource group containing the SQL VM to view the error message associated with the failed action. 
 
#### Assessment result status
**Failed - assessment run failed**
This indicates that the SQL IaaS extension encountered a problem while running assessment. The detailed error message will be available in the extension log inside the VM at C:\WindowsAzure\Logs\Plugins\Microsoft.SqlServer.Management.SqlIaaSAgent\2.0.X.Y where 2.0.X.Y is the latest version folder present.  

**Failed - result upload to Log Analytics workspace failed**
This indicates that the MMA was unable to upload the results in a time-bound manner. Ensure that the MMA extension is [provisioned correctly](https://docs.microsoft.com/azure/azure-monitor/visualize/vmext-troubleshoot) and refer to the [troubleshooting guide](https://docs.microsoft.com/azure/azure-monitor/agents/agent-windows-troubleshoot) for MMA to identify "Custom logs issue" noted in the guide. 

>[!TIP]
>If you have enforced TLS 1.0 or higher in Windows and disabled older SSL protocols as described [here](https://docs.microsoft.com/troubleshoot/windows-server/windows-security/restrict-cryptographic-algorithms-protocols-schannel#schannel-specific-registry-keys), then you must also ensure that .NET Framework is [configured](https://docs.microsoft.com/azure/azure-monitor/agents/agent-windows#configure-agent-to-use-tls-12) to use strong cryptography. 

**Failed - result expired due to Log Analytics workspace data retention**
This indicates that the results are no longer retained in the Log Analytics workspace based on its retention policy. You can [change the retention period](https://docs.microsoft.com/azure/azure-monitor/logs/manage-cost-storage#change-the-data-retention-period) for the workspace

## Next steps
- To install the SQL Server IaaS extension to SQL Server on Azure VMs, see the articles for [Automatic installation](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-agent-extension-automatic-registration-all-vms), [Single VMs](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-single-vm), or [VMs in bulk](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/sql-agent-extension-manually-register-vms-bulk).
- To learn about more capabilities available by the SQL Server IaaS extension to SQL Server on Azure VMs, see [Manage SQL Server VMs by using the Azure portal](https://docs.microsoft.com/en-us/azure/azure-sql/virtual-machines/windows/manage-sql-vm-portal)


