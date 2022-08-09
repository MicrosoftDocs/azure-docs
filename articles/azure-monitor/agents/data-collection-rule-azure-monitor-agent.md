---
title: Monitor data from virtual machines with Azure Monitor agent
description: Describes how to collect events and performance data from virtual machines using the Azure Monitor agent.
ms.topic: conceptual
ms.date: 06/23/2022
author: guywild
ms.author: guywild
ms.reviewer: shseth

---

# Collect data from virtual machines with the Azure Monitor agent

This article describes how to collect events and performance counters from virtual machines using the Azure Monitor agent. 

To collect data from virtual machines using the Azure Monitor agent, you'll:

1. Create [data collection rules (DCR)](../essentials/data-collection-rule-overview.md) that define which data Azure Monitor agent sends to which destinations.
1. Associate the data collection rule to specific virtual machines.

You can associate virtual machines to multiple data collection rules. This allows you to define each data collection rule to address a particular requirement, and associate the data collection rules to virtual machines based on the specific data you want to collect from each machine.

## Create data collection rule and association

To send data to Log Analytics, create the data collection rule in the **same region** as your Log Analytics workspace. You can still associate the rule to machines in other supported regions.

### [Portal](#tab/portal)

In the **Monitor** menu in the Azure portal, select **Data Collection Rules** from the **Settings** section. Click **Create** to create a new Data Collection Rule and assignment.

[![Screenshot of viewing data collection rules in Azure portal.](media/data-collection-rule-azure-monitor-agent/data-collection-rules-updated.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rules-updated.png#lightbox)

Click **Create** to create a new rule and set of associations. Provide a **Rule name** and specify a **Subscription**, **Resource Group** and **Region**. This specifies where the DCR will be created. The virtual machines and their associations can be in any subscription or resource group in the tenant.
Additionally, choose the appropriate **Platform Type** which specifies the type of resources this rule can apply to. Custom will allow for both Windows and Linux types. This allows for pre-curated creation experiences with options scoped to the selected platform type.

[![Screenshot of Azure portal form to create new data collection rule.](media/data-collection-rule-azure-monitor-agent/data-collection-rule-basics-updated.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rule-basics-updated.png#lightbox)

In the **Resources** tab, add the resources (virtual machines, virtual machine scale sets, Arc for servers) that should have the Data Collection Rule applied. The Azure Monitor Agent will be installed on resources that don't already have it installed, and will enable Azure Managed Identity as well.

> [!IMPORTANT]
> If you need network isolation using private links for collecting data using agents from your resources, then select **Enable Data Collection Endpoints** and select a DCE for each virtual machine. See [Enable network isolation for the Azure Monitor Agent](azure-monitor-agent-data-collection-endpoint.md) for details.


:::image type="content" source="media/data-collection-rule-azure-monitor-agent/data-collection-rule-virtual-machines.png" lightbox="media/data-collection-rule-azure-monitor-agent/data-collection-rule-virtual-machines.png" alt-text="Screenshot for adding virtual machines to data collection rule.":::


On the **Collect and deliver** tab, click **Add data source** to add a data source and destination set. Select a **Data source type**, and the corresponding details to select will be displayed. For performance counters, you can select from a predefined set of objects and their sampling rate. For events, you can select from a set of logs or facilities and the severity level. 

[![Screenshot of Azure portal form to select basic performance counters in a data collection rule.](media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-basic-updated.png#lightbox)


To specify other logs and performance counters from the [currently supported data sources](azure-monitor-agent-overview.md#data-sources-and-destinations) or to filter events using XPath queries, select **Custom**. You can then specify an [XPath ](https://www.w3schools.com/xml/xpath_syntax.asp) for any specific values to collect. See [Sample DCR](data-collection-rule-sample-agent.md) for an example.

[![Screenshot of Azure portal form to select custom performance counters in a data collection rule.](media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rule-data-source-custom-updated.png#lightbox)

On the **Destination** tab, add one or more destinations for the data source. You can select multiple destinations of same of different types, for instance multiple Log Analytics workspaces (i.e. "multi-homing"). Windows event and Syslog data sources can only send to Azure Monitor Logs. Performance counters can send to both Azure Monitor Metrics and Azure Monitor Logs.

[![Screenshot of Azure portal form to add a data source in a data collection rule.](media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rule-destination.png#lightbox)

Click **Add Data Source** and then **Review + create** to review the details of the data collection rule and association with the set of VMs. Click **Create** to create it.

> [!NOTE]
> After the data collection rule and associations have been created, it might take up to 5 minutes for data to be sent to the destinations.

## Create rule and association in Azure portal

You can use the Azure portal to create a data collection rule and associate virtual machines in your subscription to that rule. The Azure Monitor agent will be automatically installed and a managed identity created for any virtual machines that don't already have it installed.

> [!IMPORTANT]
> Creating a data collection rule using the portal also enables System-Assigned managed identity on the target resources, in addition to existing User-Assigned Identities (if any). For existing applications unless they specify the User-Assigned identity in the request, the machine will default to using System-Assigned Identity instead. [Learn More](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md#what-identity-will-imds-default-to-if-dont-specify-the-identity-in-the-request)



> [!NOTE]
> If you wish to send data to Log Analytics, you must create the data collection rule in the **same region** where your Log Analytics workspace resides. The rule can be associated to machines in other supported region(s).


## Limit data collection with custom XPath queries
Since you're charged for any data collected in a Log Analytics workspace, you should collect only the data that you require. Using basic configuration in the Azure portal, you only have limited ability to filter events to collect. For Application and System logs, this is all logs with a particular severity. For Security logs, this is all audit success or all audit failure logs.

To specify additional filters, you must use Custom configuration and specify an XPath that filters out the events you don't. XPath entries are written in the form `LogName!XPathQuery`. For example, you may want to return only events from the Application event log with an event ID of 1035. The XPathQuery for these events would be `*[System[EventID=1035]]`. Since you want to retrieve the events from the Application event log, the XPath would be `Application!*[System[EventID=1035]]`

### Extracting XPath queries from Windows Event Viewer
One of the ways to create XPath queries is to use Windows Event Viewer to extract XPath queries as shown below.  

* In step 5 when pasting over the 'Select Path' parameter value, you must append the log type category followed by '!' and then paste the copied value.

[![Screenshot of steps in Azure portal showing the steps to create an XPath query in the Windows Event Viewer.](media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png#lightbox)

See [XPath 1.0 limitations](/windows/win32/wes/consuming-events#xpath-10-limitations) for a list of limitations in the XPath supported by Windows event log.

> [!TIP]
> You can use the PowerShell cmdlet `Get-WinEvent` with the `FilterXPath` parameter to test the validity of an XPathQuery locally on your machine first. The following script shows an example.
> 
> ```powershell
> $XPath = '*[System[EventID=1035]]'
> Get-WinEvent -LogName 'Application' -FilterXPath $XPath
> ```
>
> - **In the cmdlet above, the value for '-LogName' parameter is the initial part of the XPath query until the '!', while only the rest of the XPath query goes into the $XPath parameter.**
> - If events are returned, the query is valid.
> - If you receive the message *No events were found that match the specified selection criteria.*, the query may be valid, but there are no matching events on the local machine.
> - If you receive the message *The specified query is invalid* , the query syntax is invalid. 

The following table shows examples for filtering events using a custom XPath.

| Description |  XPath |
|:---|:---|
| Collect only System events with Event ID = 4648 |  `System!*[System[EventID=4648]]`
| Collect Security Log events with Event ID = 4648 and a process name of consent.exe | `Security!*[System[(EventID=4648)]] and *[EventData[Data[@Name='ProcessName']='C:\Windows\System32\consent.exe']]` |
| Collect all Critical, Error, Warning, and Information events from the System event log except for Event ID = 6 (Driver loaded) |  `System!*[System[(Level=1 or Level=2 or Level=3) and (EventID != 6)]]` |
| Collect all success and failure Security events except for Event ID 4624 (Successful logon) |  `Security!*[System[(band(Keywords,13510798882111488)) and (EventID != 4624)]]` |


## Create rule and association using REST API

Follow the steps below to create a data collection rule and associations using the REST API.

> [!NOTE]
> If you wish to send data to Log Analytics, you must create the data collection rule in the **same region** where your Log Analytics workspace resides. The rule can be associated to machines in other supported region(s).
### [API](#tab/api)

1. Create a DCR file using the JSON format shown in [Sample DCR](data-collection-rule-sample-agent.md).

2. Create the rule using the [REST API](/rest/api/monitor/datacollectionrules/create#examples).

3. Create an association for each virtual machine to the data collection rule using the [REST API](/rest/api/monitor/datacollectionruleassociations/create#examples).

### [PowerShell](#tab/powershell)

**Data collection rules**

| Action | Command |
|:---|:---|
| Get rule(s) | [Get-AzDataCollectionRule](/powershell/module/az.monitor/get-azdatacollectionrule?view=azps-5.4.0&preserve-view=true) |
| Create a rule | [New-AzDataCollectionRule](/powershell/module/az.monitor/new-azdatacollectionrule?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |
| Update a rule | [Set-AzDataCollectionRule](/powershell/module/az.monitor/set-azdatacollectionrule?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |
| Delete a rule | [Remove-AzDataCollectionRule](/powershell/module/az.monitor/remove-azdatacollectionrule?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |
| Update 'Tags' for a rule | [Update-AzDataCollectionRule](/powershell/module/az.monitor/update-azdatacollectionrule?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |

**Data collection rule associations**

| Action | Command |
|:---|:---|
| Get association(s) | [Get-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/get-azdatacollectionruleassociation?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |
| Create an association | [New-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/new-azdatacollectionruleassociation?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |
| Delete an association | [Remove-AzDataCollectionRuleAssociation](/powershell/module/az.monitor/remove-azdatacollectionruleassociation?view=azps-6.0.0&viewFallbackFrom=azps-5.4.0&preserve-view=true) |

### [Azure CLI](#tab/cli)

This is enabled as part of Azure CLI **monitor-control-service** Extension. [View all commands](/cli/azure/monitor/data-collection/rule)

### [Resource Manager template](#tab/arm)

See [Resource Manager template samples for data collection rules in Azure Monitor](./resource-manager-data-collection-rules.md) for sample templates.

---
## Filter events using XPath queries
Since you're charged for any data you collect in a Log Analytics workspace, collect only the data you need. The basic configuration in the Azure portal provides you with a limited ability to filter out events. 

To specify additional filters, use Custom configuration and specify an XPath that filters out the events you don't need. XPath entries are written in the form `LogName!XPathQuery`. For example, you may want to return only events from the Application event log with an event ID of 1035. The XPathQuery for these events would be `*[System[EventID=1035]]`. Since you want to retrieve the events from the Application event log, the XPath is `Application!*[System[EventID=1035]]`

### Extracting XPath queries from Windows Event Viewer
In Windows, you can use Event Viewer to extract XPath queries as shown below.  

When you paste the XPath query into the field on the **Add data source** screen, (step 5 in the picture below), you must append the log type category followed by '!'.

[![Extract XPath](media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png)](media/data-collection-rule-azure-monitor-agent/data-collection-rule-extract-xpath.png#lightbox)

See [XPath 1.0 limitations](/windows/win32/wes/consuming-events#xpath-10-limitations) for a list of limitations in the XPath supported by Windows event log.

> [!TIP]
> You can use the PowerShell cmdlet `Get-WinEvent` with the `FilterXPath` parameter to test the validity of an XPathQuery locally on your machine first. The following script shows an example.
> 
> ```powershell
> $XPath = '*[System[EventID=1035]]'
> Get-WinEvent -LogName 'Application' -FilterXPath $XPath
> ```
>
> - **In the cmdlet above, the value of the *-LogName* parameter is the initial part of the XPath query until the '!'. The rest of the XPath query goes into the *$XPath* parameter.**
> - If the script returns events, the query is valid.
> - If you receive the message *No events were found that match the specified selection criteria.*, the query may be valid, but there are no matching events on the local machine.
> - If you receive the message *The specified query is invalid* , the query syntax is invalid. 

Examples of filtering events using a custom XPath:

| Description |  XPath |
|:---|:---|
| Collect only System events with Event ID = 4648 |  `System!*[System[EventID=4648]]`
| Collect Security Log events with Event ID = 4648 and a process name of consent.exe | `Security!*[System[(EventID=4648)]] and *[EventData[Data[@Name='ProcessName']='C:\Windows\System32\consent.exe']]` |
| Collect all Critical, Error, Warning, and Information events from the System event log except for Event ID = 6 (Driver loaded) |  `System!*[System[(Level=1 or Level=2 or Level=3) and (EventID != 6)]]` |
| Collect all success and failure Security events except for Event ID 4624 (Successful logon) |  `Security!*[System[(band(Keywords,13510798882111488)) and (EventID != 4624)]]` |

## Next steps

- [Collect text logs using Azure Monitor agent.](data-collection-text-log.md)
- Learn more about the [Azure Monitor Agent](azure-monitor-agent-overview.md).
- Learn more about [data collection rules](../essentials/data-collection-rule-overview.md).
