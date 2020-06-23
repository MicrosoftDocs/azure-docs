---
title: Create a Log Analytics workspace in the Azure Portal
description: Learn how to create a Log Analytics workspace to enable management solutions and data collection from your cloud and on-premises environments in the Azure portal.
ms.subservice: logs
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 05/26/2020

---

# Send Azure Activity log to Log Analytics workspace using Azure portal
The Activity log is a platform log in Azure that provides insight into subscription-level events. This includes such information as when a resource is modified or when a virtual machine is started. You can view the Activity log in the Azure portal or retrieve entries with PowerShell and CLI. This quickstart shows how to create a Log Analytics workspace and a diagnostic setting to send the Activity log to Azure Monitor Logs where you can analyze it using log queries.

## Prerequisites
[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)] 

## Sign in to Azure portal
Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com). 



## Create a Log Analytics workspace
In the Azure portal, search for and then select **Log Analytics workspaces**. 

![Azure portal](media/quick-create-workspace/azure-portal-01.png)
  
Click **Add**, and then provide values choices for the **Resource group**, workspace **Name**, and **Location**. The workspace name must be unique across all Azure subscriptions.

![Create workspace](media/quick-collect-activity-log/create-workspace.png)

Click **Review + create** to review the settings and then **Create** to create the workspace. This will select a default pricing tier of **Pay-as-you-go** which will not incur any changes until you start collecting a sufficient amount of data. There is no charge for collecting the Activity log.


## Create diagnostic setting
In the Azure portal, search for and then select **Monitor**. 

![Azure portal](media/quick-collect-activity-log/azure-portal-monitor.png)

Select **Activity log**. You should see recent events for the current subscription. Click **Diagnostic settings** to create a new diagnostic setting for the subscription.

![Activity log](media/quick-collect-activity-log/activity-log.png)

Click **Add diagnostic setting** to create a new setting. 

Type in a name such as *Send Activity log to workspace*. Select each of the categories. Select **Send to Log Analytics** as the only destination and then specify the workspace that you just created. Click **Save** to create the diagnostic setting and then close the page.


## Retrieve data with a log query
Only new Activity log entries will be sent to the Log Analytics workspace, so perform some actions in your subscription that will be logged such as starting or stopping a virtual machine or creating or modifying another resource.

Select **Logs** in the **Azure Monitor** menu. Close the **Example Queries** page. If the scope isn't set to the workspace you just created, then click **Select scope** and locate it.

![Log Analytics scope](media/quick-collect-activity-log/log-analytics-scope.png)

In the query window, type the following query and click **Run**. This will return all records in the *AzureActivity* table which contains all the records sent from the Activity log.

![Query](media/quick-collect-activity-log/activity-log.png)

Expand one of the records to view its detailed properties


All events written to the Activity log will now be written to the 


## Next steps
Now that you have a workspace available, you can configure collection of monitoring telemetry, run log searches to analyze that data, and add a management solution to provide additional data and analytic insights. 
