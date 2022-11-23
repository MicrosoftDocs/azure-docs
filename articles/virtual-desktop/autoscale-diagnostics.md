---
title: Set up diagnostics for autoscale in Azure Virtual Desktop
description: How to set up diagnostic reports for the scaling service in your Azure Virtual Desktop deployment.
author: Heidilohr
ms.topic: how-to
ms.date: 04/29/2022
ms.author: helohr
manager: femila
---
# Set up diagnostics for autoscale in Azure Virtual Desktop

Diagnostics lets you monitor potential issues and fix them before they interfere with your autoscale scaling plan.

Currently, you can either send diagnostic logs for autoscale to an Azure Storage account or consume logs with the Events hub. If you're using an Azure Storage account, make sure it's in the same region as your scaling plan. Learn more about diagnostic settings at [Create diagnostic settings](../azure-monitor/essentials/diagnostic-settings.md). For more information about resource log data ingestion time, see [Log data ingestion time in Azure Monitor](../azure-monitor/logs/data-ingestion-time.md).

## Enable diagnostics for scaling plans

To enable diagnostics for your scaling plan:

1. Open the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

2. Select **Scaling plans**, then select the scaling plan you'd like the report to track.

3. Go to **Diagnostic Settings** and select **Add diagnostic setting**.

4. Enter a name for the diagnostic setting.

5. Next, select **Autoscale** and choose either **storage account** or **event hub** depending on where you want to send the report.

6. Select **Save**.

## Set log location in Azure Storage

After you've configured your diagnostic settings, you can find the logs by following these instructions:

1. In the Azure portal, go to the storage group you sent the diagnostic logs to.

2. Select **Containers**. A folder called **insight-logs-autoscaling** should open.

3. Select the **insight-logs-autoscaling folder** and open the log you want to review. Open folders within that folder until you see the JSON file, then select all items in that folder, right-click, and download them to your local computer.

4. Finally, open the JSON file in the text editor of your choice.

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
    "resourceId": "/SUBSCRIPTIONS/AD11111A-1C21-1CF1-A7DE-CB1111E1D111/RESOURCEGROUPS/TEST/PROVIDERS/MICROSOFT.DESKTOPVIRTUALIZATION/SCALINGPLANS/TESTPLAN",
    "operationName": "HostPoolLoadBalancerTypeUpdated",
    "category": "Autoscale",
    "resultType": "Succeeded",
    "level": "Informational",
    "correlationId": "35ec619b-b5d8-5b5f-9242-824aa4d2b878",
    "properties": {
        "Message": "Host pool's load balancing algorithm updated",
        "HostPoolArmPath": "/subscriptions/AD11111A-1C21-1CF1-A7DE-CB1111E1D111/resourcegroups/test/providers/microsoft.desktopvirtualization/hostpools/testHostPool ",
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
