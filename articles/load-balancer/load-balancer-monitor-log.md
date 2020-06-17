---
title: Monitor operations, events, and counters for public Basic Load Balancer
titleSuffix: Azure Load Balancer
description: Learn how to enable alert events, and probe health status logging for public Basic Load Balancer
services: load-balancer
documentationcenter: na
author: asudbring
ms.service: load-balancer
ms.devlang: na
ms.topic: article
ms.custom: seodec18
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/05/2020
ms.author: allensu
---

# Azure Monitor logs for public Basic Load Balancer

You can use different types of logs in Azure to manage and troubleshoot Basic Load Balancers. Some of these logs can be accessed through the portal. Logs can be streamed to an event hub or a Log Analytics workspace. All logs can be extracted from Azure blob storage, and viewed in different tools, such as Excel and Power BI.  You can learn more about the different types of logs from the list below.

* **Activity logs:** You can use [View activity logs to monitor actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit) to view all activity being submitted to your Azure subscription(s), and their status. Activity logs are enabled by default, and can be viewed in the Azure portal.
* **Alert event logs:** You can use this log to view alerts raised by the load balancer. The status for the load balancer is collected every five minutes. This log is only written if a load balancer alert event is raised.
* **Health probe logs:** You can use this log to view problems detected by your health probe, such as the number of instances in your backend-pool that are not receiving requests from the load balancer because of health probe failures. This log is written to when there is a change in the health probe status.

> [!IMPORTANT]
> Azure Monitor logs currently works only for public Basic load balancers. Logs are only available for resources deployed in the Resource Manager deployment model. You cannot use logs for resources in the classic deployment model. For more information about the deployment models, see [Understanding Resource Manager deployment and classic deployment](../azure-resource-manager/management/deployment-models.md).

## Enable logging

Activity logging is automatically enabled for every Resource Manager resource. Enable event and health probe logging to start collecting the data available through those logs. Use the following steps to enable logging.

Sign in to the [Azure portal](https://portal.azure.com). If you don't already have a load balancer, [create a load balancer](https://docs.microsoft.com/azure/load-balancer/quickstart-create-basic-load-balancer-portal) before you continue.

1. In the portal, click **Resource groups**.
2. Select **\<resource-group-name>** where your load balancer is.
3. Select your load balancer.
4. Select **Monitoring** > **Diagnostic settings**.
5. In the **Diagnostics settings** pane, under **Diagnostics settings**, select **+ Add diagnostic setting**.
6. In the **Diagnostics settings** creation pane, enter **myLBDiagnostics** in the **Name** field.
7. You have three options for the **Diagnostics settings**.  You can choose one, two or all three and configure each for your requirements:
   * **Archive to a storage account**
   * **Stream to an event hub**
   * **Send to Log Analytics**

    ### Archive to a storage account
    You'll need a storage account already created for this process.  To create a storage account, see [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal)

    1. Select the checkbox next to **Archive to a storage account**.
    2. Select **Configure** to open the **Select a storage account** pane.
    3. Select the **Subscription** where your storage account was created in the pull-down box.
    4. Select the name of your storage account under **Storage account** in the pull-down box.
    5. Select OK.

    ### Stream to an event hub
    You'll need an event hub already created for this process.  To create an event hub, see [Quickstart: Create an event hub using Azure portal](https://docs.microsoft.com/azure/event-hubs/event-hubs-create)

    1. Select the checkbox next to **Stream to an event hub**
    2. Select **Configure** to open the **Select event hub** pane.
    3. Select the **Subscription** where your event hub was created in the pull-down box.
    4. **Select event hub namespace** in the pull-down box.
    5. **Select event hub policy name** in the pull-down box.
    6. Select OK.

    ### Send to Log Analytics
    You'll need to already have a log analytics workspace created and configured for this process.  To create a Log Analytics workspace, see [Create a Log Analytics workspace in the Azure portal](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace)

    1. Select the checkbox next to **Send to Log Analytics**.
    2. Select the **Subscription** where your Log Analytics workspace is in the pull-down box.
    3. Select the **Log Analytics Workspace** in the pull-down box.


8. Beneath the **LOG** section in the **Diagnostics settings** pane, select the check box next to both:
   * **LoadBalancerAlertEvent**
   * **LoadBalancerProbeHealthStatus**

9.  Beneath the **METRIC** section in the **Diagnostics settings** pane, select the check box next to:
   * **AllMetrics**

11. Verify everything looks correct and click **Save** at the top of the create **Diagnostic settings** pane.

## Activity log

The activity log is generated by default. The logs are preserved for 90 days in Azure's Event Logs store. Learn more about these logs by reading the [View activity logs to monitor actions on resources](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-audit) article.

## Archive to storage account logs

### Alert event log

This log is only generated if you've enabled it on a per load balancer basis. The events are logged in JSON format and stored in the storage account you specified when you enabled the logging. The following example is of an event.

```json
{
    "time": "2016-01-26T10:37:46.6024215Z",
    "systemId": "32077926-b9c4-42fb-94c1-762e528b5b27",
    "category": "LoadBalancerAlertEvent",
    "resourceId": "/SUBSCRIPTIONS/XXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXXXXXXX/RESOURCEGROUPS/RG7/PROVIDERS/MICROSOFT.NETWORK/LOADBALANCERS/WWEBLB",
    "operationName": "LoadBalancerProbeHealthStatus",
    "properties": {
        "eventName": "Resource Limits Hit",
        "eventDescription": "Ports exhausted",
        "eventProperties": {
            "public ip address": "40.117.227.32"
        }
    }
}
```

The JSON output shows the *eventname* property, which will describe the reason for the load balancer created an alert. In this case, the alert generated was because of TCP port exhaustion caused by source IP NAT limits (SNAT).

### Health probe log

This log is only generated if you've enabled it on a per load balancer basis as detailed above. The data is stored in the storage account you specified when you enabled the logging. A container named 'insights-logs-loadbalancerprobehealthstatus' is created and the following data is logged:

```json
{
    "records":[
    {
        "time": "2016-01-26T10:37:46.6024215Z",
        "systemId": "32077926-b9c4-42fb-94c1-762e528b5b27",
        "category": "LoadBalancerProbeHealthStatus",
        "resourceId": "/SUBSCRIPTIONS/XXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX/RESOURCEGROUPS/RG7/PROVIDERS/MICROSOFT.NETWORK/LOADBALANCERS/WWEBLB",
        "operationName": "LoadBalancerProbeHealthStatus",
        "properties": {
            "publicIpAddress": "40.83.190.158",
            "port": "81",
            "totalDipCount": 2,
            "dipDownCount": 1,
            "healthPercentage": 50.000000
        }
    },
    {
        "time": "2016-01-26T10:37:46.6024215Z",
        "systemId": "32077926-b9c4-42fb-94c1-762e528b5b27",
        "category": "LoadBalancerProbeHealthStatus",
        "resourceId": "/SUBSCRIPTIONS/XXXXXXXXXXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXX/RESOURCEGROUPS/RG7/PROVIDERS/MICROSOFT.NETWORK/LOADBALANCERS/WWEBLB",
        "operationName": "LoadBalancerProbeHealthStatus",
        "properties": {
            "publicIpAddress": "40.83.190.158",
            "port": "81",
            "totalDipCount": 2,
            "dipDownCount": 0,
            "healthPercentage": 100.000000
        }
    }]
}
```

The JSON output shows in the properties field the basic information for the probe health status. The *dipDownCount* property shows the total number of instances on the back-end, which are not receiving network traffic because of failed probe responses.

### View and analyze the activity log

You can view and analyze activity log data using any of the following methods:

* **Azure tools:** Retrieve information from the activity log through Azure PowerShell, the Azure Command Line Interface (CLI), the Azure REST API, or the Azure portal. Step-by-step instructions for each method are detailed in the [Audit operations with Resource Manager](../azure-resource-manager/management/view-activity-logs.md) article.
* **Power BI:** If you don't already have a [Power BI](https:// .microsoft.com/pricing) account, you can try it for free. Using the [Azure Audit Logs content pack for Power BI](https:// .microsoft.com/documentation/ -content-pack-azure-audit-logs), you can analyze your data with pre-configured dashboards, or you can customize views to suit your requirements.

### View and analyze the health probe and event log

Connect to your storage account and retrieve the JSON log entries for event and health probe logs. Once you download the JSON files, you can convert them to CSV and view in Excel, Power BI, or any other data visualization tool.

> [!TIP]
> If you are familiar with Visual Studio and basic concepts of changing values for constants and variables in C#, you can use the [log converter tools](https://github.com/Azure-Samples/networking-dotnet-log-converter) available from GitHub.

## Stream to an event hub
When diagnostic information is streamed to an event hub, it can be used for centralized log analysis in a third-party SIEM tool with Azure Monitor Integration. For more information, see [Stream Azure monitoring data to an event hub](../azure-monitor/platform/stream-monitoring-data-event-hubs.md#partner-tools-with-azure-monitor-integration)

## Send to Log Analytics
Resources in Azure can have their diagnostic information sent directly to a Log Analytics workspace where complex queries can be run against the information for troubleshooting and analysis.  For more information, see [Collect Azure resource logs in Log Analytics workspace in Azure Monitor](https://docs.microsoft.com/azure/azure-monitor/platform/resource-logs-collect-workspace)

## Next steps

[Understand load balancer probes](load-balancer-custom-probe-overview.md)
