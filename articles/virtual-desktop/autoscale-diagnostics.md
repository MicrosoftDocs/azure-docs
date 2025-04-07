---
title: Set up diagnostics for Autoscale in Azure Virtual Desktop
description: How to set up diagnostic reports for the scaling service in your Azure Virtual Desktop deployment.
author: dknappettmsft
ms.topic: how-to
ms.date: 11/01/2023
ms.author: daknappe
ms.custom: docs_inherited
---
# Set up diagnostics for Autoscale in Azure Virtual Desktop

Diagnostics lets you monitor potential issues and fix them before they interfere with your Autoscale scaling plan.

Currently, you can either send diagnostic logs for Autoscale to an Azure Storage account or consume logs with Microsoft Azure Event Hubs. If you're using an Azure Storage account, make sure it's in the same region as your scaling plan. Learn more about diagnostic settings at [Create diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings). For more information about resource log data ingestion time, see [Log data ingestion time in Azure Monitor](/azure/azure-monitor/logs/data-ingestion-time).

> [!TIP]
> For pooled host pools, we recommend you use Autoscale diagnostic data integrated with Insights in Azure Virtual Desktop, which providing a more comprehensive view of your Autoscale operations. For more information, see [Monitor Autoscale operations with Insights in Azure Virtual Desktop](autoscale-monitor-operations-insights.md).

## Enable diagnostics for scaling plans

To enable diagnostics for your scaling plan:

1. Open the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling plans**, then select the scaling plan you'd like the report to track.

1. Go to **Diagnostic Settings** and select **Add diagnostic setting**.

1. Enter a name for the diagnostic setting.

1. Next, select **Autoscale logs** and choose either **Archive to a storage account** or **Stream to an event hub** depending on where you want to send the report.

1. Select **Save**.

> [!NOTE]
> If you select **Archive to a storage account**, you'll need to [Migrate from diagnostic settings storage retention to Azure Storage lifecycle management](/azure/azure-monitor/essentials/migrate-to-azure-storage-lifecycle-policy).

## Find Autoscale diagnostic logs in Azure Storage

After you've configured your diagnostic settings, you can find the logs by following these instructions:

1. In the Azure portal, go to the storage account you sent the diagnostic logs to.

1. Select **Containers** and open the folder called **insight-logs-autoscaling**.

1. Within the **insight-logs-autoscaling** folder select the subscription, resource group, scaling plan, and date until you see the JSON file. Select the JSON file and download it to your local computer.

1. Finally, open the JSON file in the text editor of your choice.

## View diagnostic logs

Now that you've opened the JSON file, let's do a quick overview of what each piece of the report means:

- The **CorrelationID** is the ID that you need to show when you create a support case.

- **OperationName** is the type of operation running while the issue happened.

- **ResultType** is the result of the operation. This item can show you where issues are if you notice any incomplete results.

- **Message** is the error message that provides information on the incomplete operation. This message can include links to important troubleshooting documentation, so review it carefully.

The following JSON file is an example of what you'll see when you open a report:

```json
{
    "host_Ring": "R0",
    "Level": 4,
    "ActivityId": "c1111111-1111-1111-b111-11111cd1ba1b1",
    "time": "2021-08-31T16:00:46.5246835Z",
    "resourceId": "/SUBSCRIPTIONS/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/RESOURCEGROUPS/TEST/PROVIDERS/MICROSOFT.DESKTOPVIRTUALIZATION/SCALINGPLANS/TESTPLAN",
    "operationName": "HostPoolLoadBalancerTypeUpdated",
    "category": "Autoscale",
    "resultType": "Succeeded",
    "level": "Informational",
    "correlationId": "aaaa0000-bb11-2222-33cc-444444dddddd",
    "properties": {
        "Message": "Host pool's load balancing algorithm updated",
        "HostPoolArmPath": "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourcegroups/test/providers/microsoft.desktopvirtualization/hostpools/testHostPool ",
        "PreviousLoadBalancerType": "BreadthFirst",
        "NewLoadBalancerType": "DepthFirst"
    }
}
```

## Next steps

- Review how to create a scaling plan at [Autoscale for Azure Virtual Desktop session hosts](autoscale-scaling-plan.md).
- [Assign your scaling plan to new or existing host pools](autoscale-new-existing-host-pool.md).
- Learn more about terms used in this article at our [autoscale glossary](autoscale-glossary.md).
- For examples of how autoscale works, see [Autoscale example scenarios](autoscale-scenarios.md).
- View our [autoscale FAQ](autoscale-faq.yml) to answer commonly asked questions.
