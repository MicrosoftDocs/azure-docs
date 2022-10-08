---
title: 'Tutorial: View and configure Azure DDoS Protection diagnostic logging'
description: Learn how to configure reports and flow logs.
services: ddos-protection
documentationcenter: na
author: AbdullahBell
ms.service: ddos-protection
ms.topic: article
ms.tgt_pltfrm: na
ms.custom: ignite-2022
ms.workload: infrastructure-services
ms.date: 10/12/2022
ms.author: abell
---

# Tutorial: View and configure Azure DDoS Protection diagnostic logging

Azure DDoS Protection provides detailed attack insights and visualization with DDoS Attack Analytics. Customers protecting their virtual networks against DDoS attacks have detailed visibility into attack traffic and actions taken to mitigate the attack via attack mitigation reports & mitigation flow logs. Rich telemetry is exposed via Azure Monitor including detailed metrics during the duration of a DDoS attack. Alerting can be configured for any of the Azure Monitor metrics exposed by DDoS Protection. Logging can be further integrated with [Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-ddos-protection), Splunk (Azure Event Hubs), OMS Log Analytics, and Azure Storage for advanced analysis via the Azure Monitor Diagnostics interface.

The following diagnostic logs are available for Azure DDoS Protection:

- **DDoSProtectionNotifications**: Notifications will notify you anytime a public IP resource is under attack, and when attack mitigation is over.
- **DDoSMitigationFlowLogs**: Attack mitigation flow logs allow you to review the dropped traffic, forwarded traffic and other interesting data-points during an active DDoS attack in near-real time. You can ingest the constant stream of this data into Microsoft Sentinel or to your third-party SIEM systems via event hub for near-real time monitoring, take potential actions and address the need of your defense operations.
- **DDoSMitigationReports**: Attack mitigation reports use the Netflow protocol data, which is aggregated to provide detailed information about the attack on your resource. Anytime a public IP resource is under attack, the report generation will start as soon as the mitigation starts. There will be an incremental report generated every 5 mins and a post-mitigation report for the whole mitigation period. This is to ensure that in an event the DDoS attack continues for a longer duration of time, you'll be able to view the most current snapshot of mitigation report every 5 minutes and a complete summary once the attack mitigation is over.
- **AllMetrics**: Provides all possible metrics available during the duration of a DDoS attack.

In this tutorial, you'll learn how to:

> [!div class="checklist"]
> * Configure Azure DDoS Protection diagnostic logs, including notifications, mitigation reports and mitigation flow logs. 
> * Enable diagnostic logging on all public IPs in a defined scope.
> * View log data in workbooks.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.
- Before you can complete the steps in this tutorial, you must first create a [Azure DDoS protection plan](manage-ddos-protection.md). DDoS Network Protection must be enabled on a virtual network or DDoS IP Protection must be enabled on a public IP address.  
- DDoS monitors public IP addresses assigned to resources within a virtual network. If you don't have any resources with public IP addresses in the virtual network, you must first create a resource with a public IP address. You can monitor the public IP address of all resources deployed through Resource Manager (not classic) listed in [Virtual network for Azure services](../virtual-network/virtual-network-for-azure-services.md#services-that-can-be-deployed-into-a-virtual-network) (including Azure Load Balancers where the backend virtual machines are in the virtual network), except for Azure App Service Environments. To continue with this tutorial, you can quickly create a [Windows](../virtual-machines/windows/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) or [Linux](../virtual-machines/linux/quick-create-portal.md?toc=%2fazure%2fvirtual-network%2ftoc.json) virtual machine.

## Configure Azure DDoS Protection diagnostic logs

If you want to automatically enable diagnostic logging on all public IPs within an environment, skip to [Enable diagnostic logging on all public IPs](#enable-diagnostic-logging-on-all-public-ips).

1. Select **All services** on the top, left of the portal.
1. Enter *Monitor* in the **Filter** box. When **Monitor** appears in the results, select it.
1. Under **Settings**, select **Diagnostic Settings**.
1. Select the **Subscription** and **Resource group** that contain the public IP address you want to log.
1. Select **Public IP Address** for **Resource type**, then select the specific public IP address you want to enable logs for.
1. Select **Add diagnostic setting**. Under **Category Details**, select as many of the following options you require, and then select **Save**.

    :::image type="content" source="./media/ddos-attack-telemetry/ddos-diagnostic-settings.png" alt-text="Screenshot of DDoS diagnostic settings." lightbox="./media/ddos-attack-telemetry/ddos-diagnostic-settings.png":::

    
1. Under **Destination details**, select as many of the following options as you require:

    - **Archive to a storage account**: Data is written to an Azure Storage account. To learn more about this option, see [Archive resource logs](../azure-monitor/essentials/resource-logs.md?toc=%2fazure%2fvirtual-network%2ftoc.json#send-to-azure-storage).
    - **Stream to an event hub**: Allows a log receiver to pick up logs using Azure Event Hubs. Event hubs enable integration with Splunk or other SIEM systems. To learn more about this option, see [Stream resource logs to an event hub](../azure-monitor/essentials/resource-logs.md?toc=%2fazure%2fvirtual-network%2ftoc.json#send-to-azure-event-hubs).
    - **Send to Log Analytics**: Writes logs to the Azure Monitor service. To learn more about this option, see [Collect logs for use in Azure Monitor logs](../azure-monitor/essentials/resource-logs.md?toc=%2fazure%2fvirtual-network%2ftoc.json#send-to-log-analytics-workspace).

### Query Azure DDOS Protection logs in log analytics workspace

#### DDoSProtectionNotifications logs

1. Under the **Log analytics workspaces** blade, select your log analytics workspace.

1. Under **General**, select on **Logs**

1. In Query explorer, type in the following Kusto Query and change the time range to Custom and change the time range to last three months. Then hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSProtectionNotifications"
    ```

1. To view **DDoSMitigationFlowLogs** change the query to the following and keep the same time range and hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSMitigationFlowLogs"
    ```

1. To view **DDoSMitigationReports** change the query to the following and keep the same time range and hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSMitigationReports"
    ```

### Log schemas

The following table lists the field names and descriptions:

# [DDoSProtectionNotifications](#tab/DDoSProtectionNotifications)

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the notification was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For notifications, this will be `DDoSProtectionNotifications`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For notifications, this will be `DDoSProtectionNotifications`.  |
| **Message** | Details of the attack. |
| **Type** | Type of notification. Possible values include `MitigationStarted`. `MitigationStopped`. |
| **PublicIpAddress** | Your public IP address. |

# [DDoSMitigationFlowLogs](#tab/DDoSMitigationFlowLogs)

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the flow log was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For flow logs, this will be `DDoSMitigationFlowLogs`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For flow logs, this will be `DDoSMitigationFlowLogs`. |
| **Message** | Details of the attack. |
| **SourcePublicIpAddress** | The public IP address of the client generating traffic to your public IP address. |
| **SourcePort** | Port number ranging from 0 to 65535. |
| **DestPublicIpAddress** | Your public IP address. |
| **DestPort** | Port number ranging from 0 to 65535. |
| **Protocol** | Type of protocol. Possible values include `tcp`, `udp`, `other`.|

# [DDoSMitigationReports](#tab/DDoSMitigationReports)

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the report was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For notifications, this will be `DDoSMitigationReports`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For mitigation reports, this will be `DDoSMitigationReports`. |
| **ReportType** | Possible values include `Incremental`, `PostMitigation`.|
| **MitigationPeriodStart** | The date and time in UTC when the mitigation started.  |
| **MitigationPeriodEnd** | The date and time in UTC when the mitigation ended. |
| **IPAddress** | Your public IP address. |
| **AttackVectors** |  Breakdown of attack types. Keys include `TCP SYN flood`, `TCP flood`, `UDP flood`, `UDP reflection`, `Other packet flood`.|
| **TrafficOverview** |  Breakdown of attack traffic. Keys include `Total packets`, `Total packets dropped`, `Total TCP packets`, `Total TCP packets dropped`, `Total UDP packets`, `Total UDP packets dropped`, `Total Other packets`, `Total Other packets dropped`. |
| **Protocols** | Breakdown of protocols involved. Keys include `TCP`, `UDP`, `Other`. |
| **DropReasons** | Breakdown of reasons for dropped packets. Keys include `Protocol violation invalid TCP syn`, `Protocol violation invalid TCP`, `Protocol violation invalid UDP`, `UDP reflection`, `TCP rate limit exceeded`, `UDP rate limit exceeded`, `Destination limit exceeded`, `Other packet flood`, `Rate limit exceeded`, `Packet was forwarded to service`. |
| **TopSourceCountries** | Breakdown of top 10 source countries of incoming traffic. |
| **TopSourceCountriesForDroppedPackets** | Breakdown of top 10 source countries of attack traffic that is/was mitigated. |
| **TopSourceASNs** | Breakdown of top 10 source autonomous system numbers (ASN) of the incoming traffic.  |
| **SourceContinents** | Breakdown of the source continents of incoming traffic. |
***

## Enable diagnostic logging on all public IPs

This [built-in policy](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2F752154a7-1e0f-45c6-a880-ac75a7e4f648) automatically enables diagnostic logging on all public IP logs in a defined scope. See [Azure Policy built-in definitions for Azure DDoS Protection](policy-reference.md) for full list of built-in policies.

## View log data in workbooks

### Microsoft Sentinel data connector

You can connect logs to Microsoft Sentinel, view and analyze your data in workbooks, create custom alerts, and incorporate it into investigation processes. To connect to Microsoft Sentinel, see [Connect to Microsoft Sentinel](../sentinel/data-connectors-reference.md#azure-ddos-protection).


:::image type="content" source="./media/ddos-attack-telemetry/azure-sentinel-ddos.png" alt-text="Screenshot of Microsoft Sentinel DDoS Connector." lightbox="./media/ddos-attack-telemetry/azure-sentinel-ddos.png":::

### Azure DDoS Protection workbook

You can use [this Azure Resource Manager (ARM) template](https://aka.ms/ddosworkbook) to deploy an attack analytics workbook. This workbook allows you to visualize attack data across several filterable panels to easily understand what’s at stake.

[![Deploy to Azure](../media/template-deployments/deploy-to-azure.svg)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2FAzure-Network-Security%2Fmaster%2FAzure%20DDoS%20Protection%2FWorkbook%20-%20Azure%20DDOS%20monitor%20workbook%2FAzureDDoSWorkbook_ARM.json)


:::image type="content" source="./media/ddos-attack-telemetry/ddos-attack-analytics-workbook.png" alt-text="Screenshot of Azure DDoS Protection Workbook." lightbox="./media/ddos-attack-telemetry/ddos-attack-analytics-workbook.png":::

## Validate and test

To simulate a DDoS attack to validate your logs, see [Test with simulation partners](test-through-simulations.md).

## Next steps

In this tutorial, you learned how to:

- Configure Azure DDoS Protection diagnostic logs, including notifications, mitigation reports and mitigation flow logs.
- Enable diagnostic logging on all public IPs in a defined scope.
- View log data in workbooks.

To learn how to configure attack alerts, continue to the next tutorial.

> [!div class="nextstepaction"]
> [View and configure DDoS protection alerts](alerts.md)
