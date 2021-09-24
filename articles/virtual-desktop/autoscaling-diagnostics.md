Set-up diagnostic for Autoscale
===============================

Limitations
-----------

In preview you can choose to select to send the logs to either an Azure Storage Account or use Event hubs to consume logs. Later in preview we are planning to enable Log Analytics for monitoring and troubleshooting scaling plans. Learn more about diagnostic settings
[here](../azure-monitor/essentials/diagnostic-settings.md). For resource log data ingestion time see this [Azure Monitor document](../azure-monitor/logs/data-ingestion-time.md).

When setting up an Azure Storage Account ensure it matches the region for the
scaling plan. To enable diagnostics:

- Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

- Select **Scaling Plans** and select a scaling plan in your list

- Navigate to **Diagnostic Settings** and select “add diagnostic setting”.

- Provide a name for the diagnostic setting.

- Next select **Autoscaling** and choose either storage account or event hub.

- Save when done.

Logs location using Azure Storage
---------------------------------

After you complete configuring diagnostics settings in scaling plan you will be able to find those logs using the following steps.

- Navigate to the Storage Group you configured diagnostics to send logs to.

- Select containers and will see folder called insight-logs-autoscaling

![Graphical user interface, application Description automatically generated](media/a1b43719aa6d9117b7e60a2a21c7d4ca.png)

- Select the insight-logs-autoscaling folder and navigate to the log you want to see. You will have to select several times till you reach the final folder and see the JSON file as in the example below. Right select the row to download the log file.

![Graphical user interface, text, application, email Description automatically generated](media/e472cf84eba5dd1c56b1d9565fbfe045.png)

- Open .json file in desired text editor

Viewing Diagnostics logs
------------------------

Logs are stored in a json format. In this documentation we would like to give an overview on the pieces of the log.

1. **CorrelationID**: Provide this ID to support for further troubleshooting when opening a support case.

2. **OperationName**: provides information on type of operation that has been executed.

3. **ResultType**: result of the operation. In case of a failed operation, you want to review the message.

4. **Message**: Contains the error message that provides information on the failed operation. Please review carefully for links to documentation that help to troubleshoot or mitigate the situation. If you are starting to build alerting based on the logs note those those are still under development and might change. We will keep you updated.

```json
{
    "host_Ring": "R0",
    "Level": 4,
    "ActivityId": "c1111111-1111-1111-b111-11111cd1ba1b1",
    "time": "2021-08-31T16:00:46.5246835Z",
    "resourceId": "/SUBSCRIPTIONS/AD11111A-1C21-1CF1-A7DE-CB1111E1D111/RESOURCEGROUPS/TEST/PROVIDERS/MICROSOFT.DESKTOPVIRTUALIZATION/SCALINGPLANS/TESTPLAN",
    "operationName": "HostPoolLoadBalancerTypeUpdated",
    "category": "Autoscaling",
    "resultType": "Succeeded",
    "level": "Informational",
    "correlationId": "35ec619b-b5d8-5b5f-9242-824aa4d2b878",
    "properties": {
        "Message": "Host pool's load balancing algorithm updated",
        "HostPoolArmPath": "/subscriptions/AD11111A-1C21-1CF1-A7DE-CB1111E1D111/resourcegroups/test/providers/microsoft.desktopvirtualization/hostpools/testHostPool ",
        "PreviousLoadBalancerType": "BreadthFirst",
        "NewLoadBalancerType": "DepthFirst"
    }
}. L
```