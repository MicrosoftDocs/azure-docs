---
title: Set up and use metrics and diagnostic logs with an Azure IoT hub
description: Learn how to set up and use metrics and diagnostic logs with an Azure IoT hub. This will provide data to analyze to help diagnose problems your hub may be having.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 10/29/2020
ms.author: robinsh
ms.custom: [mvc, mqtt, devx-track-azurecli, devx-track-csharp]
#Customer intent: As a developer, I want to know how to set up and check metrics and diagnostic logs, to help me troubleshoot when there is a problem with an Azure IoT hub. 
---

# Tutorial: Set up and use metrics and diagnostic logs with an IoT hub

You can use Azure Monitor to collect metrics and logs for your IoT hub that can help you monitor the operation of your solution and troubleshoot problems when they occur. In this article, you'll see how to create charts based on metrics, how to create alerts that trigger on metrics, how to send IoT Hub operations and errors to Azure Monitor Logs, and how to check the logs for errors.

This tutorial uses the Azure sample from the [.NET Send telemetry quickstart](quickstart-send-telemetry-dotnet.md) to send messages to the IoT hub. You can always use a device or another sample to send messages, but you may have to modify a few steps accordingly.  

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
>
> * Use Azure CLI to create an IoT hub, register a simulated device, and create a Log Analytics workspace.  
> * Send IoT Hub connections logs and device telemetry logs to Azure Monitor Logs in the Log Analytics workspace.
> * Use metric explorer to view metrics and create charts based on selected metrics and pin it to your dashboard.
> * Create metric alerts so you can be notified by email when important conditions occur.
> * Download and run an app that simulates an IoT device sending messages to the hub.
> * View the alerts when your conditions occur.
> * View the metrics chart on your dashboard.
> * View IoT Hub errors and operations in Azure Monitor Logs.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* You need the .NET Core SDK 2.1 or greater on your development machine. You can download the .NET Core SDK for multiple platforms from [.NET](https://www.microsoft.com/net/download/all).

  You can verify the current version of C# on your development machine using the following command:

  ```cmd/sh
  dotnet --version
  ```

* An email account capable of receiving mail.

* Make sure that port 8883 is open in your firewall. The device sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Set up resources

For this tutorial, you need an IoT hub, a Log Analytics workspace, and a simulated IoT device. These resources can be created using Azure CLI or Azure PowerShell. Use the same resource group and location for all of the resources. Then at the end, you can remove everything in one step by deleting the resource group.

These are the required steps.

1. Create a [resource group](../azure-resource-manager/management/overview.md). 

2. Create an IoT hub.

3. Create a standard V1 storage account with Standard_LRS replication.

4. Create a device identity for the simulated device that sends messages to your hub. Save the key for the testing phase.

### Set up resources using Azure CLI

Copy and paste this script into Cloud Shell. Assuming you are already logged in, it runs the script one line at a time. The new resources are created in the resource group ContosoResources.

The variables that must be globally unique have `$RANDOM` concatenated to them. When the script is run and the variables are set, a random numeric string is generated and concatenated to the end of the fixed string, making it unique.

```azurecli-interactive

# This is the IOT Extension for Azure CLI.
# You only need to install this the first time.
# You need it to create the device identity. 
az extension add --name azure-iot

# Set the values for the resource names that don't have to be globally unique.
# The resources that have to have unique names are named in the script below
#   with a random number concatenated to the name so you can probably just
#   run this script, and it will work with no conflicts.
location=westus
resourceGroup=ContosoResources
iotDeviceName=Contoso-Test-Device
randomValue=$RANDOM

# Create the resource group to be used
#   for all the resources for this tutorial.
az group create --name $resourceGroup \
    --location $location

# The IoT hub name must be globally unique, so add a random number to the end.
iotHubName=ContosoTestHub$randomValue
echo "IoT hub name = " $iotHubName

# Create the IoT hub in the Free tier. Partition count must be 2.
az iot hub create --name $iotHubName \
    --resource-group $resourceGroup \
    --partition-count 2 \
    --sku F1 --location $location

# The Log Analytics workspace name must be globally unique, so add a random number to the end.
workspaceName=contoso-la-workspace$randomValue
echo "Log Analytics workspace name = " $workspaceName


# Create the Log Analytics workspace
az monitor log-analytics workspace create --resource-group $resourceGroup \
    --workspace-name $workspaceName --location $location

# Create the IoT device identity to be used for testing.
az iot hub device-identity create --device-id $iotDeviceName \
    --hub-name $iotHubName

# Retrieve the primary connection string for the device identity, then copy it to
#   Notepad. You need this to run the device simulation during the testing phase.
az iot hub device-identity show-connection-string --device-id $iotDeviceName \
    --hub-name $iotHubName

```

>[!NOTE]
>When creating the device identity, you may get the following error: *No keys found for policy iothubowner of IoT Hub ContosoTestHub*. To fix this error, update the Azure CLI IoT Extension and then run the last two commands in the script again. 
>
>Here is the command to update the extension. Run this command in your Cloud Shell instance.
>
>```cli
>az extension update --name azure-iot
>```

## Collect logs for connection and device telemetry operations

IoT Hub emits resource logs for several categories of operation; however, for you to view these logs you must create a diagnostic setting to send them to a destination. One such destination is Azure Monitor Logs, which are collected in a Log Analytics workspace. IoT Hub resource logs are grouped into different categories. You can select which categories you want sent to Azure Monitor Logs in the diagnostic setting. In this article we'll collect logs for operations and errors that occur having to do with connections and device telemetry. For a full list of the categories supported for IoT Hub, see [IoT Hub resource logs](monitor-iot-hub-reference.md#resource-logs).

To create a diagnostic setting to send IoT Hub logs to Azure Monitor Logs, follow these steps:

1. First, if you're not already on your hub in the portal, select **Resource groups** and select the resource group ContosoResources. Select your IoT hub from the list of resources displayed.

1. Look for the **Monitoring** section in the IoT Hub blade. Select **Diagnostic settings**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/01-diagnostic-settings.png" alt-text="Screenshot that highlights Diagnostic settings in the Monitoring section.":::

1. Now select **Add diagnostic setting**. The **Diagnostics setting** pane is displayed. Give your setting a descriptive name, such as "connections-and-telemetry-to-logs".

1. Under **log**, select **Connections** and **Device Telemetry**.

1. Under **Destination details**, select **Send to Log Analytics**, then use the Log Analytics workspace picker to select the workspace you noted previously. When you're finished, the diagnostic setting should look similar to the following:

   :::image type="content" source="media/tutorial-use-metrics-and-diags/add-diagnostic-setting.png" alt-text="Screenshot showing the final diagnostic log settings.":::

1. Select **Save** to save the settings. Close the Diagnostics settings pane.

## Set up metrics

Now we'll use metrics explorer to create a chart that displays some metrics you want to track. You'll pin this chart to your default dashboard in the Azure portal.

1. On the left pane of your IoT hub, select **Metrics** in the **Monitoring** section.

1. At the top of the screen, select **Last 24 hours (Automatic)**. In the dropdown that appears, select **Last 4 hours** for **Time range**, set **Time granularity** to **1 minute**, and select **Local** for **Show time as**. Select **Apply** to save these settings. The setting should now say **Local Time: Last 4 hours (1 minute)**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/06-metrics-set-time-range.png" alt-text="Screenshot showing the metrics time settings.":::

1. On the chart, there is a partial metric setting displayed scoped to your IoT hub. Leave the **Scope** and **Metric Namespace** values at their defaults. Select the **Metric** setting and type "Telemetry", then select **Telemetry messages sent** from the dropdown. **Aggregation** will be automatically set to **Sum**. Notice that the title of your chart also changes.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/07-metrics-telemetry-messages-sent.png" alt-text="Screenshot showing adding a metric for telemetry messages sent.":::

1. Now select **Add metric** to add another metric to the chart. Under **Metric**, select **Total number of messages used**. **Aggregation** will be automatidally set to **Avg**. Notice again that the title of the chart has changed to include this metric.

   Now your screen shows the minimized metric for *Telemetry messages sent*, plus the new metric for *Total number of messages used*.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/07-metrics-num-messages-used.png" alt-text="Screenshot that highlights the Pin to dashboard button.":::

1. In the upper-right of the chart, select **Pin to dashboard**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/07-metrics-num-messages-used.png" alt-text="Screenshot that highlights the Pin to dashboard button.":::

1. On the **Pin to dashboard** pane, select the **Existing** tab. Select **Private** and then select **Dashboard** from the dropdown to select your default dashboard in Azure portal. Finally, select **Pin** to pin the chart. If you don't pin your chart to a dashboard, your settings are not retained when you exit metric explorer.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/pin-to-dashboard.png" alt-text="Screenshot that shows settings for Pin to dashboard.":::

## Set up metric alerts

Now we'll set up alerts to trigger on two metrics *Telemetry messages sent* and *Total number of messages used*. 

*Telemetry messages sent* is a good metric to monitor to track message throughput and avoid being throttled. For an IoT Hub in the free SKU, the throttling limit is 100 messages/sec. With a single device, we won't be able to achieve that kind of throughput, so instead, we'll set up the alert to trigger if the number of messages exceeds 1000 in a 5 minute period. In production, you could set the signal to a more significant value based on the SKU. tier, and number of units of your IoT hub.

*Total number of messages used* tracks the daily number of messages used. This number resets every day at 0:0:0 UTC. If you exceed your daily quota past a certain threshold, your IoT Hub will no longer be able to receive or send messages. For an IoT Hub in the free SKU, the daily message quota is 8000. We'll set up the alert to trigger if the total number of messages exceeds 50% of the quota. In practice, you would probably set this to a higher value. Again, the quota is dependent on the SKU, tier, and units for your IoT hub.

For more information about throttling and quota limits with IoT Hub, see [Quotas and throttling](iot-hub-devguide-quotas-throttling.md).

1. Go to your IoT hub in the portal.

1. Under **Monitoring**, select **Alerts**. Then select **New alert rule**.  The **Create alert rule** pane opens.

    :::image type="content" source="media/tutorial-use-metrics-and-diags/create-alert-rule-pane.png" alt-text="Screenshot showing the Create alert rule pane.":::

    On the **Create alert rule** pane, there are four sections: **Scope** is already set to your IoT hub, so we'll leave this one alone. **Condition** sets the signal and conditions that will trigger the alert. **Actions** will determine what happens when the alert triggers. Finally **Alert rule details** lets you create a name and a description for the alert.

1. Under **Condition**, select **Select condition**. On the **Configure signal logic** pane, type "telemetry" in the search box and select **Telemetry messages sent**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/configure-signal-logic-telemetry-messages-sent.png" alt-text="Screenshot showing selecting the metric.":::

1. On the **Configure signal logic** pane, set or confirm the following fields (you can ignore the chart):

   **Threshold**:  *Static*.

   **Operator**: *Greater than*.

   **Aggregation type**: *Total*.

   **Threshold value**: 1000.

   **Aggregation granularity (Period)**: *5 minutes*.

   **Frequency of evaluation**: *Every 1 Minute*

    :::image type="content" source="media/tutorial-use-metrics-and-diags/configure-signal-logic-set-conditions.png" alt-text="Screenshot showing alert conditions settings.":::

   These settings set the signal to total the number of messages over a period of 5 minutes. This total will be evaluated every minute, and, if the total for the preceding 5 minutes exceeds 1000 messages, the alert will trigger.

   Select **Done** to save the signal logic.

1. Now set up your action. Back on the **Create alert rule** pane, under **Actions**, select **Select action group**. On the **Select an action group to attach to this alert rule** pane, select **Create action group**.

1. On the **Create action group** pane, give your Action group a name and a display name.

1. Select the **Notifications** tab. For **Notification type**, select **Email/SMS message/Push/Voice** from the dropdown.

1. On the **Email/SMS message/Push/Voice** pane, select email and enter your email address, then select **OK**.

1. Back on the **Notifications** pane, enter a name for the notification. 

1. If you select the **Actions** tab, and then select the **Action type** dropdown, you can see the kinds of actions that you can trigger with an alert. For this article we will only use notifications, so you can ignore these.Select the **Review and Create** tab, verify your settings, and select **Create**.

1. Back on the **Select an action group to attach to this alert rule** pane, select your new action group from the list, then click **Select**.  

1. Now set up another alert for the *Total number of messages used*. This metric is useful if you want to send an alert when the number of messages used is approaching the quota for the IoT hub -- to let you know the hub will soon start rejecting messages.

   On the **View classic alerts** screen, select **Add metric alert (classic)**, then fill in these fields on the **Add rule** pane.

   **Name**: Provide a name for your alert rule, such as *number-of-messages-used*.

   **Description**: Provide a description of your alert, such as *alert when getting close to quota*.

   **Source**: Set this field to *Metrics*.

    **Subscription**, **Resource group**, and **Resource** should be set to the values you selected on the **View classic alerts** screen. 

    Set **Metric** to *Total number of messages used*.

1. Under the chart, fill in the following fields:

   **Condition**: Set to *Greater than*.

   **Threshold**: Set to 1000.

   **Period**: Set this field to *Over the last 5 minutes*. 

   **Notification email recipients**: Put your e-mail address here. 

   Select **OK** to save the rule. 

1. You should now see two alerts in the classic alerts pane: 

   :::image type="content" source="media/tutorial-use-metrics-and-diags/12-alerts-done.png" alt-text="Screenshot showing classic alerts screen with the new alert rules.":::

1. Close the alerts pane.

    With these settings, you will get an alert when the number of messages sent is greater than 400 and when the total number of messages used exceeds NUMBER.

## Run the simulated device app

Earlier in the script setup section, you set up a device to simulate using an IoT device. In this section, you download a .NET console app that simulates a device that sends device-to-cloud messages to an IoT hub.  

Download the solution for the [IoT Device Simulation](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip). This link downloads a repo with several applications in it; the one you are looking for is in iot-hub/Quickstarts/simulated-device/.

1. In a local terminal window, navigate to the root folder of the sample C# project. Then navigate to the **iot-hub\Quickstarts\simulated-device** folder.

1. Open the **SimulatedDevice.cs** file in a text editor of your choice.

    1. Replace the value of the `s_connectionString` variable with the device connection string you made a note of earlier. Save your changes to **SimulatedDevice.cs**.

    1. In the `SendDeviceToCloudMessagesAsync` method, change the `Task.Delay` from 1000 to 1, which reduces the amount of time between sending messages from 1 second to .001 seconds. Shortening this delay increases the number of messages sent. (You will likely not get a message rate of 100 messages per second.)

        ```csharp
        await Task.Delay(1);
        ```

    1. Save your changes to **SimulatedDevice.cs**.

1. In the local terminal window, run the following command to install the required packages for the simulated device application:

    ```cmd/sh
    dotnet restore
    ```

1. In the local terminal window, run the following command to build and run the simulated device application:

    ```cmd/sh
    dotnet run
    ```

    The following screenshot shows the output as the simulated device application sends telemetry to your IoT hub:

    ![Run the simulated device](media/quickstart-send-telemetry-dotnet/simulated-device.png)

Let the application run for at least 10-15 minutes. Ideally, let it run until it stops sending messages (about 20-30 minutes). This will happen when you've exceeded the daily message quota for your IoT hub, and it has stopped receiving any more messages.

### See the metrics in the portal dashboard

1. In the upper-left corner of  Azure portal, open the portal menu, and then select **Dashboard**.

1. Open your metrics from the Dashboard. Change the time values to *Last 30 minutes* with a time granularity of *1 minute*. It shows the telemetry messages sent and the total number of messages used on the chart, with the most recent numbers at the bottom of the chart.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/13-metrics-populated.png" alt-text="Screenshot showing the metrics.":::

### See the alerts

Go back to alerts. (Select **Resource groups**, select *ContosoResources*, then select the hub *ContosoTestHub*.) In the properties page displayed for the hub, select **Alerts**, then **View classic alerts**.

When the number of messages sent exceeds the limit, you start getting e-mail alerts. To see if there are any active alerts, go to your hub and select **Alerts**. It will show you the alerts that are active, and if there are any warnings.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/14-alerts-firing.png" alt-text="Screenshot showing the alerts have fired.":::

Select the alert for telemetry messages. It shows the metric result and a chart with the results. Also, the e-mail sent to warn you of the alert firing looks like this image:

   :::image type="content" source="media/tutorial-use-metrics-and-diags/15-alert-email.png" alt-text="Screenshot of the e-mail showing the alerts have fired.":::

### See the Azure Monitor logs

You set up the connections diagnostic logs to be exported to blob storage. Go to your resource group and select your storage account *contosostoragemon*. Select Blobs, then open container *insights-logs-connections*. Drill down until you get to the current date and select the most recent file. 

   :::image type="content" source="media/tutorial-use-metrics-and-diags/16-diagnostics-logs-list.png" alt-text="Screenshot of drilling down into the storage container to see the diagnostic logs.":::

Select **Download** to download it and open it. You see the logs of the device connecting and disconnecting as it sends messages to the hub. Here a sample:

``` json
{ 
  "time": "2018-12-17T18:11:25Z", 
  "resourceId": 
    "/SUBSCRIPTIONS/your-subscription-id/RESOURCEGROUPS/CONTOSORESOURCES/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/CONTOSOTESTHUB", 
  "operationName": "deviceConnect", 
  "category": "Connections", 
  "level": "Information", 
  "properties": 
      {"deviceId":"Contoso-Test-Device",
       "protocol":"Mqtt",
       "authType":null,
       "maskedIpAddress":"73.162.215.XXX",
       "statusCode":null
       }, 
  "location": "westus"
}
{ 
   "time": "2018-12-17T18:19:25Z", 
   "resourceId": 
     "/SUBSCRIPTIONS/your-subscription-id/RESOURCEGROUPS/CONTOSORESOURCES/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/CONTOSOTESTHUB", 
    "operationName": "deviceDisconnect", 
    "category": "Connections", 
    "level": "Error", 
    "resultType": "404104", 
    "resultDescription": "DeviceConnectionClosedRemotely", 
    "properties": 
        {"deviceId":"Contoso-Test-Device",
         "protocol":"Mqtt",
         "authType":null,
         "maskedIpAddress":"73.162.215.XXX",
         "statusCode":"404"
         }, 
    "location": "westus"
}
```

## Clean up resources

To remove all of the resources you've created in this tutorial, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, the Log Analytics workspace, and the resource group itself. If you have pinned metrics to the dashboard, you will have to remove those manually by clicking on the three dots in the upper right-hand corner of each and selecting **Remove**. Be sure to save your changes after doing this. 

To remove the resource group, use the [az group delete](/cli/azure/group?view=azure-cli-latest#az-group-delete) command.

```azurecli-interactive
az group delete --name $resourceGroup
```

## Next steps

In this tutorial, you learned how to use metrics and diagnostic logs by performing the following tasks:

> [!div class="checklist"]
>
> * Use Azure CLI to create an IoT hub, register a simulated device, and create a Log Analytics workspace.  
> * Send IoT Hub connections logs and device telemetry logs to Azure Monitor Logs in the Log Analytics workspace.
> * Use metric explorer to view metrics and create charts based on selected metrics and pin it to your dashboard.
> * Create metric alerts so you can be notified by email when important conditions occur.
> * Download and run an app that simulates an IoT device sending messages to the hub.
> * View the alerts when your conditions occur.
> * View the metrics chart on your dashboard.
> * View IoT Hub errors and operations in Azure Monitor Logs.

Advance to the next tutorial to learn how to manage the state of an IoT device. 

> [!div class="nextstepaction"]
> [Configure your devices from a back-end service](tutorial-device-twins.md)