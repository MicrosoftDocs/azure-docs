---
title: Collect Azure service logs and metrics into Log Analytics workspace | Microsoft Docs
description: Configure diagnostics on Azure resources to write logs and metrics to Log Analytics workspace in Azure Monitor.
services: log-analytics
documentationcenter: ''
author: mgoedtel
manager: carmonm
editor: ''
ms.assetid: 84105740-3697-4109-bc59-2452c1131bfe
ms.service: log-analytics
ms.workload: na
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 04/12/2017
ms.author: magoedte
---

# Collect Azure service logs and metrics into Log Analytics workspace in Azure Monitor

There are four different ways of collecting logs and metrics for Azure services:

1. Azure diagnostics direct to Log Analytics workspace in Azure Monitor (*Diagnostics* in the following table)
2. Azure diagnostics to Azure storage to Log Analytics workspace in Azure Monitor (*Storage* in the following table)
3. Connectors for Azure services (*Connectors* in the following table)
4. Scripts to collect and then post data into Log Analytics workspace in Azure Monitor (blanks in the following table and for services that are not listed)


| Service                 | Resource Type                           | Logs        | Metrics     | Solution |
| --- | --- | --- | --- | --- |
| Application gateways    | Microsoft.Network/applicationGateways   | Diagnostics | Diagnostics | [Azure Application Gateway Analytics](../insights/azure-networking-analytics.md#azure-application-gateway-analytics-solution-in-azure-monitor) |
| Application insights    |                                         | Connector   | Connector   | [Application Insights Connector](https://blogs.technet.microsoft.com/msoms/2016/09/26/application-insights-connector-in-oms/) (Preview) |
| Automation accounts     | Microsoft.Automation/AutomationAccounts | Diagnostics |             | [More information](../../automation/automation-manage-send-joblogs-log-analytics.md)|
| Batch accounts          | Microsoft.Batch/batchAccounts           | Diagnostics | Diagnostics | |
| Classic cloud services  |                                         | Storage     |             | [More information](azure-storage-iis-table.md) |
| Cognitive services      | Microsoft.CognitiveServices/accounts    |             | Diagnostics | |
| Data Lake analytics     | Microsoft.DataLakeAnalytics/accounts    | Diagnostics |             | |
| Data Lake store         | Microsoft.DataLakeStore/accounts        | Diagnostics |             | |
| Event Hub namespace     | Microsoft.EventHub/namespaces           | Diagnostics | Diagnostics | |
| IoT Hubs                | Microsoft.Devices/IotHubs               |             | Diagnostics | |
| Key Vault               | Microsoft.KeyVault/vaults               | Diagnostics |             | [KeyVault Analytics](../insights/azure-key-vault.md) |
| Load Balancers          | Microsoft.Network/loadBalancers         | Diagnostics |             |  |
| Logic Apps              | Microsoft.Logic/workflows <br> Microsoft.Logic/integrationAccounts | Diagnostics | Diagnostics | |
| Network Security Groups | Microsoft.Network/networksecuritygroups | Diagnostics |             | [Azure Network Security Group Analytics](../insights/azure-networking-analytics.md#azure-network-security-group-analytics-solution-in-azure-monitor) |
| Recovery vaults         | Microsoft.RecoveryServices/vaults       |             |             | [Azure Recovery Services Analytics (Preview)](https://github.com/krnese/AzureDeploy/blob/master/OMS/MSOMS/Solutions/recoveryservices/)|
| Search services         | Microsoft.Search/searchServices         | Diagnostics | Diagnostics | |
| Service Bus namespace   | Microsoft.ServiceBus/namespaces         | Diagnostics | Diagnostics | [Service Bus Analytics (Preview)](https://github.com/Azure/azure-quickstart-templates/tree/master/oms-servicebus-solution)|
| Service Fabric          |                                         | Storage     |             | [Service Fabric Analytics (Preview)](../../service-fabric/service-fabric-diagnostics-oms-setup.md) |
| SQL (v12)               | Microsoft.Sql/servers/databases <br> Microsoft.Sql/servers/elasticPools |             | Diagnostics | [Azure SQL Analytics (Preview)](../insights/azure-sql.md) |
| Storage                 |                                         |             | Script      | [Azure Storage Analytics (Preview)](https://github.com/Azure/azure-quickstart-templates/tree/master/oms-azure-storage-analytics-solution) |
| Virtual Machines        | Microsoft.Compute/virtualMachines       | Extension   | Extension <br> Diagnostics  | |
| Virtual Machines scale sets | Microsoft.Compute/virtualMachines <br> Microsoft.Compute/virtualMachineScaleSets/virtualMachines |             | Diagnostics | |
| Web Server farms        | Microsoft.Web/serverfarms               |             | Diagnostics | |
| Web Sites               | Microsoft.Web/sites <br> Microsoft.Web/sites/slots |             | Diagnostics | [Azure Web Apps Analytics (Preview)](https://docs.microsoft.com/azure/log-analytics/log-analytics-azure-web-apps-analytics) |


> [!NOTE]
> For monitoring Azure virtual machines (both Linux and Windows), we recommend installing the [Log Analytics VM extension](../../azure-monitor/learn/quick-collect-azurevm.md). The agent provides you with insights collected from within your virtual machines. You can also use the extension for Virtual machine scale sets.
>
>

## Azure diagnostics direct to Log Analytics
Many Azure resources are able to write diagnostic logs and metrics directly to a Log Analytics workspace in Azure Monitor, and this is the preferred way of collecting the data for analysis. When using Azure diagnostics, data is written immediately to the workspace, and there is no need to first write the data to storage.

Azure resources that support [Azure monitor](../../azure-monitor/overview.md) can send their logs and metrics directly to a Log Analytics workspace.

> [!NOTE]
> Sending multi-dimensional metrics to a Log Analytics workpace via diagnostic settings is not currently supported. Metrics with dimensions are exported as flattened single dimensional metrics, aggregated across dimension values.
>
> *For example*: The 'Incoming Messages' metric on an Event Hub can be explored and charted on a per queue level. However, when exported via diagnostic settings the metric is represented as all incoming messages across all queues in the Event Hub.
>
>

* For the details of the available metrics, refer to [supported metrics with Azure Monitor](../../azure-monitor/platform/metrics-supported.md).
* For the details of the available logs, refer to [supported services and schema for diagnostic logs](../../azure-monitor/platform/diagnostic-logs-schema.md).

### Enable diagnostics with PowerShell

[!INCLUDE [updated-for-az](../../../includes/updated-for-az.md)]

The following PowerShell example shows how to use [Set-AzDiagnosticSetting](/powershell/module/Az.Monitor/Set-AzDiagnosticSetting) to enable diagnostics on a network security group. The same approach works for all supported resources - set `$resourceId` to the resource id of the resource you want to enable diagnostics for.

```powershell
$workspaceId = "/subscriptions/d2e37fee-1234-40b2-5678-0b2199de3b50/resourcegroups/oi-default-east-us/providers/microsoft.operationalinsights/workspaces/rollingbaskets"

$resourceId = "/SUBSCRIPTIONS/ec11ca60-1234-491e-5678-0ea07feae25c/RESOURCEGROUPS/DEMO/PROVIDERS/MICROSOFT.NETWORK/NETWORKSECURITYGROUPS/DEMO"

Set-AzDiagnosticSetting -ResourceId $ResourceId  -WorkspaceId $workspaceId -Enabled $true
```

### Enable diagnostics with Resource Manager templates

To enable diagnostics on a resource when it is created, and have the diagnostics sent to your Log Analytics workspace you can use a template similar to the one below. This example is for an Automation account but works for all supported resource types.

```json
        {
            "type": "Microsoft.Automation/automationAccounts/providers/diagnosticSettings",
            "name": "[concat(parameters('omsAutomationAccountName'), '/', 'Microsoft.Insights/service')]",
            "apiVersion": "2015-07-01",
            "dependsOn": [
                "[concat('Microsoft.Automation/automationAccounts/', parameters('omsAutomationAccountName'))]",
                "[concat('Microsoft.OperationalInsights/workspaces/', parameters('omsWorkspaceName'))]"
            ],
            "properties": {
                "workspaceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('omsWorkspaceName'))]",
                "logs": [
                    {
                        "category": "JobLogs",
                        "enabled": true
                    },
                    {
                        "category": "JobStreams",
                        "enabled": true
                    }
                ]
            }
        }
```

[!INCLUDE [log-analytics-troubleshoot-azure-diagnostics](../../../includes/log-analytics-troubleshoot-azure-diagnostics.md)]

## Azure diagnostics to storage then to Log Analytics

For collecting logs from within some resources, it is possible to send the logs to Azure storage and then configure the Log Analytics workspace to read the logs from storage.

Azure Monitor can use this approach to collect diagnostics from Azure storage for the following resources and logs:

| Resource | Logs |
| --- | --- |
| Service Fabric |ETWEvent <br> Operational Event <br> Reliable Actor Event <br> Reliable Service Event |
| Virtual Machines |Linux Syslog <br> Windows Event <br> IIS Log <br> Windows ETWEvent |
| Web Roles <br> Worker Roles |Linux Syslog <br> Windows Event <br> IIS Log <br> Windows ETWEvent |

> [!NOTE]
> You are charged normal Azure data rates for storage and transactions when you send diagnostics to a storage account and for when the Log Analytics workspace reads the data from your storage account.
>
>

See [Use blob storage for IIS and table storage for events](azure-storage-iis-table.md) to learn more about how Azure Monitor can collect these logs.

## Connectors for Azure services

There is a connector for Application Insights, which allows data collected by Application Insights to be sent to a Log Analytics workspace.

Learn more about the [Application Insights connector](https://blogs.technet.microsoft.com/msoms/2016/09/26/application-insights-connector-in-oms/).

## Scripts to collect and post data to Log Analytics workspace

For Azure services that do not provide a direct way to send logs and metrics to a Log Analytics workspace you can use an Azure Automation script to collect the log and metrics. The script can then send the data to the workspace using the [data collector API](../../azure-monitor/platform/data-collector-api.md)

The Azure template gallery has [examples of using Azure Automation](https://azure.microsoft.com/resources/templates/?term=OMS) to collect data from services and send it to Azure Monitor.

## Next steps

* [Use blob storage for IIS and table storage for events](azure-storage-iis-table.md) to read the logs for Azure services that write diagnostics to table storage or IIS logs written to blob storage.
* [Enable Solutions](../../azure-monitor/insights/solutions.md) to provide insight into the data.
* [Use search queries](../../azure-monitor/log-query/log-query-overview.md) to analyze the data.
