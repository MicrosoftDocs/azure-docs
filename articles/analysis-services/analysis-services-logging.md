---
title: Diganostic logging for Azure Analysis Services | Microsoft Docs
description: Learn about setting up diagnostic logging for Azure Analysis Services.
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 07/03/2018
ms.author: owend
ms.reviewer: minewiskan

---
# Setup diagnostic logging

An important part of any Analysis Services solution is monitoring how your servers are performing. With [Azure resource diagnostic logs](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md), you can monitor and send logs to [Azure Storage](https://azure.microsoft.com/services/storage/), stream them to [Azure Event Hubs](https://azure.microsoft.com/services/event-hubs/), and export them to [Log Analytics](https://azure.microsoft.com/services/log-analytics/), a service of [Azure](https://www.microsoft.com/cloud-platform/operations-management-suite). 

![Diagnostic logging to Storage, Event Hubs, or Log Analytics](./media/analysis-services-logging/aas-logging-overview.png)


## What's logged?

You can select **Engine**, **Service**, and **Metrics** categories.

### Engine

Selecting **Engine** logs all [xEvents](https://docs.microsoft.com/sql/analysis-services/instances/monitor-analysis-services-with-sql-server-extended-events). You cannot select individual events. 

|XEvent categories |Event name  |
|---------|---------|
|Security Audit    |   Audit Login      |
|Security Audit    |   Audit Logout      |
|Security Audit    |   Audit Server Starts And Stops      |
|Progress Reports     |   Progress Report Begin      |
|Progress Reports     |   Progress Report End      |
|Progress Reports     |   Progress Report Current      |
|Queries     |  Query Begin       |
|Queries     |   Query End      |
|Commands     |  Command Begin       |
|Commands     |  Command End       |
|Errors & Warnings     |   Error      |
|Discover     |   Discover End      |
|Notification     |    Notification     |
|Session     |  Session Initialize       |
|Locks    |  Deadlock       |
|Query Processing     |   VertiPaq SE Query Begin      |
|Query Processing     |   VertiPaq SE Query End      |
|Query Processing     |   VertiPaq SE Query Cache Match      |
|Query Processing     |   Direct Query Begin      |
|Query Processing     |  Direct Query End       |

### Service

|Operation name  |Occurs when  |
|---------|---------|
|ResumeServer     |    Resume a server     |
|SuspendServer    |   Pause a server      |
|DeleteServer     |    Delete a server     |
|RestartServer    |     User restarts a server through SSMS or PowerShell    |
|GetServerLogFiles    |    User exports server log through PowerShell     |
|ExportModel     |   User exports a model in the portal by using Open in Visual Studio     |

### All metrics

The Metrics category logs the same [Server metrics](analysis-services-monitor.md#server-metrics) displayed in Metrics.

## Setup diagnostics logging

### Azure portal

1. In [Azure portal](https://portal.azure.com) > server, click **Diagnostic logs** in the left navigation, and then click **Turn on diagnostics**.

    ![Turn on diagnostic logging for Azure Cosmos DB in the Azure portal](./media/analysis-services-logging/aas-logging-turn-on-diagnostics.png)

2. In **Diagnostic settings**, specify the following options: 

    * **Name**. Enter a name for the logs to create.

    * **Archive to a storage account**. To use this option, you need an existing storage account to connect to. See [Create a storage account](../storage/common/storage-create-storage-account.md). Follow the instructions to create a Resource Manager, general-purpose account, then select your storage account by returning to this page in the portal. It may take a few minutes for newly created storage accounts to appear in the drop-down menu.
    * **Stream to an event hub**. To use this option, you need an existing Event Hub namespace and event hub to connect to. To learn more, see [Create an Event Hubs namespace and an event hub using the Azure portal](../event-hubs/event-hubs-create.md). Then return to this page in the portal to select the Event Hub namespace and policy name.
    * **Send to Log Analytics**. To use this option, either use an existing workspace or create a new Log Analytics workspace by following the steps to [create a new workspace](../log-analytics/log-analytics-quick-collect-azurevm.md#create-a-workspace) in the portal. For more information on viewing your logs in Log Analytics, see [View logs in Log Analytics](#view-in-loganalytics).

    * **Engine**. Select this option to log xEvents. If you're archiving to a storage account, you can select the retention period for the diagnostic logs. Logs are autodeleted after the retention period expires.
    * **Service**. Select this option to log service level events. If you are archiving to a storage account, you can select the retention period for the diagnostic logs. Logs are autodeleted after the retention period expires.
    * **Metrics**. Select this option to store verbose data in [Metrics](analysis-services-monitor.md#server-metrics). If you are archiving to a storage account, you can select the retention period for the diagnostic logs. Logs are autodeleted after the retention period expires.

3. Click **Save**.

    If you receive an error that says "Failed to update diagnostics for \<workspace name>. The subscription \<subscription id> is not registered to use microsoft.insights." follow the [Troubleshoot Azure Diagnostics](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-storage) instructions to register the account, then retry this procedure.

    If you want to change how your diagnostic logs are saved at any point in the future, you can return to this page to modify settings.

### PowerShell

Here are the basic commands to get you going. If you want step-by-step help on setting up logging to a storage account by using PowerShell, see the tutorial later in this article.

To enable metrics and diagnostics logging by using PowerShell, use the following commands:

- To enable storage of diagnostics logs in a storage account, use this command:

   ```powershell
   Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -StorageAccountId [your storage account id] -Enabled $true
   ```

   The storage account ID is the resource ID for the storage account where you want to send the logs.

- To enable streaming of diagnostics logs to an event hub, use this command:

   ```powershell
   Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -ServiceBusRuleId [your service bus rule id] -Enabled $true
   ```

   The Azure Service Bus rule ID is a string with this format:

   ```powershell
   {service bus resource ID}/authorizationrules/{key name}
   ``` 

- To enable sending diagnostics logs to a Log Analytics workspace, use this command:

   ```powershell
   Set-AzureRmDiagnosticSetting -ResourceId [your resource id] -WorkspaceId [resource id of the log analytics workspace] -Enabled $true
   ```

- You can obtain the resource ID of your Log Analytics workspace by using the following command:

   ```powershell
   (Get-AzureRmOperationalInsightsWorkspace).ResourceId
   ```

You can combine these parameters to enable multiple output options.

### REST API

Learn how to [change diagnostics settings by using the Azure Monitor REST API](https://msdn.microsoft.com/library/azure/dn931931.aspx). 

### Resource Manager template

Learn how to [enable diagnostics settings at resource creation by using a Resource Manager template](../monitoring-and-diagnostics/monitoring-enable-diagnostic-logs-using-template.md). 

## Manage your logs

Logs are typically available within a couple hours of setting up logging. It's up to you to manage your logs in your storage account:

* Use standard Azure access control methods to secure your logs by restricting who can access them.
* Delete logs that you no longer want to keep in your storage account.
* Be sure to set a retention period for so old logs are deleted from your storage account.

## View logs in Log Analytics

Metrics and server events are integrated with xEvents in Log Analytics for side-by-side analysis. Log Analytics can also be configured to receive events from other Azure services providing a holistic view of diagnostic logging data across your architecture.

To view your diagnostic data in Log Analytics, open the Log Search page from the left menu or the Management area, as shown below.

![Log Search options in the Azure portal](./media/analysis-services-logging/aas-logging-open-log-search.png)

Now that you've enabled data collection, in **Log Search**, click **All collected data**.

In **Type**, click **AzureDiagnostics**, and then click **Apply**. AzureDiagnostics includes Engine and Service events. Notice a Log Analytics query is created on-the-fly. The EventClass\_s field contains xEvent names, which may look familiar if you've used xEvents for on-premises logging.

Click **EventClass\_s** or one of the event names and Log Analytics continues constructing a query. Be sure to save your queries to reuse later.

Be sure to see Log Analytics, which provides a website with enhanced query, dashboarding, and alerting capabilities on collected data.

### Queries

There are hundreds of queries you can use. Here are a few to get you started.
To learn more about using the new Log Search query language, see [Understanding log searches in Log Analytics](../log-analytics/log-analytics-log-search-new.md). 

* Query return queries submitted to Azure Analysis Services that took over five minutes (300,000 milliseconds) to complete.

    ```
    search * | where ( Type == "AzureDiagnostics" ) | where ( EventClass_s == "QUERY_END" ) | where toint(Duration_s) > 300000
    ```

* Identify scale out replicas.

    ```
    search * | summarize count() by ServerName_s
    ```
    When using scale-out, you can identify read-only replicas because the ServerName\_s field values have the replica instance number appended to the name. The resource field contains the Azure resource name, which matches the server name that the users see. The IsQueryScaleoutReadonlyInstance_s field equals true for replicas.



> [!TIP]
> Have a great Log Analytics query you want to share? If you have a GitHub account, you can add it to this article. Just click **Edit** at the top-right of this page.


## Tutorial - Turn on logging by using PowerShell
In this quick tutorial, you create a storage account in the same subscription and resource group as your Analysis Service server. You then use Set-AzureRmDiagnosticSetting to turn on diagnostics logging, sending output to the new storage account.

### Prerequisites
To complete this tutorial, you must have the following resources:

* An existing Azure Analysis Services server. For instructions on creating a server resource, see [Create a server in Azure portal](analysis-services-create-server.md), or [Create an Azure Analysis Services server by using PowerShell](analysis-services-create-powershell.md).

### </a>Connect to your subscriptions

Start an Azure PowerShell session and sign in to your Azure account with the following command:  

```powershell
Connect-AzureRmAccount
```

In the pop-up browser window, enter your Azure account user name and password. Azure PowerShell gets all the subscriptions that are associated with this account and by default, uses the first one.

If you have multiple subscriptions, you might have to specify a specific one that was used to create your Azure Key Vault. Type the following to see the subscriptions for your account:

```powershell
Get-AzureRmSubscription
```

Then, to specify the subscription that's associated with the Azure Analysis Services account you are logging, type:

```powershell
Set-AzureRmContext -SubscriptionId <subscription ID>
```

> [!NOTE]
> If you have multiple subscriptions associated with your account, it is important to specify the subscription.
>
>

### Create a new storage account for your logs

You can use an existing storage account for your logs, provided it's in the same subscription as your server. For this tutorial you create a new storage account dedicated to Analysis Services logs. To make it easy, you're storing the storage account details in a variable named **sa**.

You also use the same resource group as the one that contains your Analysis Services server. Substitute values for `awsales_resgroup`, `awsaleslogs`, and `West Central US` with your own values:

```powershell
$sa = New-AzureRmStorageAccount -ResourceGroupName awsales_resgroup `
-Name awsaleslogs -Type Standard_LRS -Location 'West Central US'
```

### Identify the server account for your logs

Set the account name to a variable named **account**, where ResourceName is the name of the account.

```powershell
$account = Get-AzureRmResource -ResourceGroupName awsales_resgroup `
-ResourceName awsales -ResourceType "Microsoft.AnalysisServices/servers"
```

### Enable logging

To enable logging, use the Set-AzureRmDiagnosticSetting cmdlet together with the variables for the new storage account, server account, and the category. Run the following command, setting the **-Enabled** flag to **$true**:

```powershell
Set-AzureRmDiagnosticSetting  -ResourceId $account.ResourceId -StorageAccountId $sa.Id -Enabled $true -Categories Engine
```

The output should look something like this:

```powershell
StorageAccountId            : 
/subscriptions/a23279b5-xxxx-xxxx-xxxx-47b7c6d423ea/resourceGroups/awsales_resgroup/providers/Microsoft.Storage/storageAccounts/awsaleslogs
ServiceBusRuleId            :
EventHubAuthorizationRuleId :
Metrics                    
    TimeGrain       : PT1M
    Enabled         : False
    RetentionPolicy
    Enabled : False
    Days    : 0


Logs                       
    Category        : Engine
    Enabled         : True
    RetentionPolicy
    Enabled : False
    Days    : 0


    Category        : Service
    Enabled         : False
    RetentionPolicy
    Enabled : False
    Days    : 0


WorkspaceId                 :
Id                          : /subscriptions/a23279b5-xxxx-xxxx-xxxx-47b7c6d423ea/resourcegroups/awsales_resgroup/providers/microsoft.analysisservic
es/servers/awsales/providers/microsoft.insights/diagnosticSettings/service
Name                        : service
Type                        :
Location                    :
Tags                        :
```

This confirms that logging is now enabled for the server, saving information to the storage account.

You can also set retention policy for your logs so older logs are automatically deleted. For example, set retention policy using **-RetentionEnabled** flag to **$true**, and set **-RetentionInDays** parameter to **90**. Logs older than 90 days are automatically deleted.

```powershell
Set-AzureRmDiagnosticSetting -ResourceId $account.ResourceId`
 -StorageAccountId $sa.Id -Enabled $true -Categories Engine`
  -RetentionEnabled $true -RetentionInDays 90
```

## Next steps

Learn more about [Azure resource diagnostic logging](../monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs.md).

See [Set-AzureRmDiagnosticSetting](https://docs.microsoft.com/powershell/module/azurerm.insights/Set-AzureRmDiagnosticSetting) in PowerShell help.
