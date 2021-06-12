---
title: Tutorial - Set up and use metrics and logs with an Azure IoT hub
description: Tutorial - Learn how to set up and use metrics and logs with an Azure IoT hub. This will provide data to analyze to help diagnose problems your hub may be having.
author: robinsh
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 10/29/2020
ms.author: robinsh
ms.custom: [mvc, mqtt, devx-track-azurecli, devx-track-csharp]
#Customer intent: As a developer, I want to know how to set up and check metrics and logs, to help me troubleshoot when there is a problem with an Azure IoT hub. 
# 4.17/2021 Updated this to "guide the new alerts experience" at request of John Lian. 1577857. They added metrics
# as a supported signal, and fixed connected Device Count and Total Device Count.
# "IoT Hub supports the new Azure Metric metric alerts.
---

# Tutorial: Set up and use metrics and logs with an IoT hub

You can use Azure Monitor to collect metrics and logs for your IoT hub that can help you monitor the operation of your solution and troubleshoot problems when they occur. In this article, you'll see how to create charts based on metrics, how to create alerts that trigger on metrics, how to send IoT Hub operations and errors to Azure Monitor Logs, and how to check the logs for errors.

This tutorial uses the Azure sample from the [.NET Send telemetry quickstart](quickstart-send-telemetry-dotnet.md) to send messages to the IoT hub. You can always use a device or another sample to send messages, but you may have to modify a few steps accordingly.

Some familiarity with Azure Monitor concepts might be helpful before you begin this tutorial. To learn more, see [Monitor IoT Hub](monitor-iot-hub.md). To learn more about the metrics and resource logs emitted by IoT Hub, see [Monitoring data reference](monitor-iot-hub-reference.md).

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
>
> * Use Azure CLI to create an IoT hub, register a simulated device, and create a Log Analytics workspace.  
> * Send IoT Hub connections and device telemetry resource logs to Azure Monitor Logs in the Log Analytics workspace.
> * Use metric explorer to create a chart based on selected metrics and pin it to your dashboard.
> * Create metric alerts so you can be notified by email when important conditions occur.
> * Download and run an app that simulates an IoT device sending messages to the IoT hub.
> * View the alerts when your conditions occur.
> * View the metrics chart on your dashboard.
> * View IoT Hub errors and operations in Azure Monitor Logs.

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- You need the .NET Core SDK 2.1 or greater on your development machine. You can download the .NET Core SDK for multiple platforms from [.NET](https://dotnet.microsoft.com/download).

  You can verify the current version of C# on your development machine using the following command:

  ```cmd/sh
  dotnet --version
  ```

- An email account capable of receiving mail.

- Make sure that port 8883 is open in your firewall. The device sample in this tutorial uses MQTT protocol, which communicates over port 8883. This port may be blocked in some corporate and educational network environments. For more information and ways to work around this issue, see [Connecting to IoT Hub (MQTT)](iot-hub-mqtt-support.md#connecting-to-iot-hub).

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Set up resources

For this tutorial, you need an IoT hub, a Log Analytics workspace, and a simulated IoT device. These resources can be created using Azure CLI or Azure PowerShell. Use the same resource group and location for all of the resources. Then, when you've finished the tutorial, you can remove everything in one step by deleting the resource group.

Here are the required steps.

1. Create a [resource group](../azure-resource-manager/management/overview.md).

2. Create an IoT hub.

3. Create a Log Analytics workspace.

4. Register a device identity for the simulated device that sends messages to your IoT hub. Save the device connection string to use to configure the simulated device.

### Set up resources using Azure CLI

Copy and paste this script into Cloud Shell. Assuming you are already logged in, it runs the script one line at a time. Some of the commands may take some time to execute. The new resources are created in the resource group *ContosoResources*.

The name for some resources must be unique across Azure. The script generates a random value with the `$RANDOM` function and stores it in a variable. For these resources, the script appends this random value to a base name for the resource, making the resource name unique.

Only one free IoT hub is permitted per subscription. If you already have a free IoT hub in your subscription, either delete it before running the script or modify the script to use your free IoT hub or an IoT Hub that uses the standard or basic tier.

The script prints the name of the IoT hub, the name of the Log Analytics workspace, and the connection string for the device it registers. Be sure to note these down as you'll need them later in this article.

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

## Collect logs for connections and device telemetry

IoT Hub emits resource logs for several categories of operation; however, for you to view these logs you must create a diagnostic setting to send them to a destination. One such destination is Azure Monitor Logs, which are collected in a Log Analytics workspace. IoT Hub resource logs are grouped into different categories. You can select which categories you want sent to Azure Monitor Logs in the diagnostic setting. In this article, we'll collect logs for operations and errors that occur having to do with connections and device telemetry. For a full list of the categories supported for IoT Hub, see [IoT Hub resource logs](monitor-iot-hub-reference.md#resource-logs).

To create a diagnostic setting to send IoT Hub resource logs to Azure Monitor Logs, follow these steps:

1. First, if you're not already on your hub in the portal, select **Resource groups** and select the resource group ContosoResources. Select your IoT hub from the list of resources displayed.

1. Look for the **Monitoring** section in the IoT Hub blade. Select **Diagnostic settings**. Then select **Add diagnostic setting**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/open-diagnostic-settings.png" alt-text="Screenshot that highlights Diagnostic settings in the Monitoring section.":::

1. On the **Diagnostics setting** pane, give your setting a descriptive name, such as "Send connections and telemetry to logs".

1. Under **Category details**, select **Connections** and **Device Telemetry**.

1. Under **Destination details**, select **Send to Log Analytics**, then use the Log Analytics workspace picker to select the workspace you noted previously. When you're finished, the diagnostic setting should look similar to the following screenshot:

   :::image type="content" source="media/tutorial-use-metrics-and-diags/add-diagnostic-setting.png" alt-text="Screenshot showing the final diagnostic log settings.":::

1. Select **Save** to save the settings. Close the **Diagnostics setting** pane. You can see your new setting in the list of diagnostic settings.

## Set up metrics

Now we'll use metrics explorer to create a chart that displays metrics you want to track. You'll pin this chart to your default dashboard in the Azure portal.

1. On the left pane of your IoT hub, select **Metrics** in the **Monitoring** section.

1. At the top of the screen, select **Last 24 hours (Automatic)**. In the dropdown that appears, select **Last 4 hours** for **Time range**, set **Time granularity** to **1 minute**, and select **Local** for **Show time as**. Select **Apply** to save these settings. The setting should now say **Local Time: Last 4 hours (1 minute)**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/metrics-select-time-range.png" alt-text="Screenshot showing the metrics time settings.":::

1. On the chart, there is a partial metric setting displayed scoped to your IoT hub. Leave the **Scope** and **Metric Namespace** values at their defaults. Select the **Metric** setting and type "Telemetry", then select **Telemetry messages sent** from the dropdown. **Aggregation** will be automatically set to **Sum**. Notice that the title of your chart also changes.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/metrics-telemetry-messages-sent.png" alt-text="Screenshot that shows adding Telemetry messages sent metric to chart.":::

1. Now select **Add metric** to add another metric to the chart. Under **Metric**, select **Total number of messages used**. **Aggregation** will be automatically set to **Avg**. Notice again that the title of the chart has changed to include this metric.

   Now your screen shows the minimized metric for *Telemetry messages sent*, plus the new metric for *Total number of messages used*.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/metrics-total-number-of-messages-used.png" alt-text="Screenshot that shows adding Total number of messages used metric to chart.":::

1. In the upper right of the chart, select **Pin to dashboard**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/metrics-total-number-of-messages-used-pin.png" alt-text="Screenshot that highlights the Pin to dashboard button.":::

1. On the **Pin to dashboard** pane, select the **Existing** tab. Select **Private** and then select **Dashboard** from the Dashboard dropdown. Finally, select **Pin** to pin the chart to your default dashboard in Azure portal. If you don't pin your chart to a dashboard, your settings are not retained when you exit metric explorer.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/pin-to-dashboard.png" alt-text="Screenshot that shows settings for Pin to dashboard.":::

## Set up metric alerts

Now we'll set up alerts to trigger on two metrics *Telemetry messages sent* and *Total number of messages used*.

*Telemetry messages sent* is a good metric to monitor to track message throughput and avoid being throttled. For an IoT Hub in the free tier, the throttling limit is 100 messages/sec. With a single device, we won't be able to achieve that kind of throughput, so instead, we'll set up the alert to trigger if the number of messages exceeds 1000 in a 5-minute period. In production, you can set the signal to a more significant value based on the tier, edition, and number of units of your IoT hub.

*Total number of messages used* tracks the daily number of messages used. This metric resets every day at 00:00 UTC. If you exceed your daily quota past a certain threshold, your IoT Hub will no longer accept messages. For an IoT Hub in the free tier, the daily message quota is 8000. We'll set up the alert to trigger if the total number of messages exceeds 4000, 50% of the quota. In practice, you'd probably set this percentage to a higher value. The daily quota value is dependent on the tier, edition, and number of units of your IoT hub.

For more information about quota and throttling limits with IoT Hub, see [Quotas and throttling](iot-hub-devguide-quotas-throttling.md).

To set up metric alerts:

1. Go to your IoT hub in Azure portal.

1. Under **Monitoring**, select **Alerts**. Then select **New alert rule**.  The **Create alert rule** pane opens.

    :::image type="content" source="media/tutorial-use-metrics-and-diags/create-alert-rule-pane.png" alt-text="Screenshot showing the Create alert rule pane.":::

    On the **Create alert rule** pane, there are four sections:

    * **Scope** is already set to your IoT hub, so we'll leave this section alone.
    * **Condition** sets the signal and conditions that will trigger the alert.
    * **Actions** configures what happens when the alert triggers.
    * **Alert rule details** lets you set a name and a description for the alert.

1. First configure the condition that the alert will trigger on.

    1. Under **Condition**, select **Add condition**. On the **Configure signal logic** pane, type "telemetry" in the search box and select **Telemetry messages sent**.

       :::image type="content" source="media/tutorial-use-metrics-and-diags/configure-signal-logic-telemetry-messages-sent.png" alt-text="Screenshot showing selecting the metric.":::

    1. On the **Configure signal logic** pane, set or confirm the following fields under **Alert logic** (you can ignore the chart):

       **Threshold**:  *Static*.

       **Operator**: *Greater than*.

       **Aggregation type**: *Total*.

       **Threshold value**: 1000.

       **Aggregation granularity (Period)**: *5 minutes*.

       **Frequency of evaluation**: *Every 1 Minute*

        :::image type="content" source="media/tutorial-use-metrics-and-diags/configure-signal-logic-set-conditions.png" alt-text="Screenshot showing alert conditions settings.":::

       These settings set the signal to total the number of messages over a period of 5 minutes. This total will be evaluated every minute, and, if the total for the preceding 5 minutes exceeds 1000 messages, the alert will trigger.

       Select **Done** to save the signal logic.

1. Now configure the action for the alert.

    1. Back on the **Create alert rule** pane, under **Actions**, select **Add action groups**. On the **Select an action group to attach to this alert rule** pane, select **Create action group**.

    1. Under the **Basics** tab on the **Create action group** pane, give your action group a name and a display name.

        :::image type="content" source="media/tutorial-use-metrics-and-diags/create-action-group-basics.png" alt-text="Screenshot showing Basics tab of Create action group pane.":::

    1. Select the **Notifications** tab. For **Notification type**, select **Email/SMS message/Push/Voice** from the dropdown. The **Email/SMS message/Push/Voice** pane opens.

    1. On the **Email/SMS message/Push/Voice** pane, select email and enter your email address, then select **OK**.

        :::image type="content" source="media/tutorial-use-metrics-and-diags/set-email-address.png" alt-text="Screenshot showing email address setting.":::

    1. Back on the **Notifications** pane, enter a name for the notification.

        :::image type="content" source="media/tutorial-use-metrics-and-diags/create-action-group-notification-complete.png" alt-text="Screenshot showing completed notifications pane.":::

    1. (Optional) If you select the **Actions** tab, and then select the **Action type** dropdown, you can see the kinds of actions that you can trigger with an alert. For this article, we'll only use notifications, so you can ignore the settings under this tab.

        :::image type="content" source="media/tutorial-use-metrics-and-diags/action-types.png" alt-text="Screenshot showing action types available on the Actions pane.":::

    1. Select the **Review and Create** tab, verify your settings, and select **Create**.

        :::image type="content" source="media/tutorial-use-metrics-and-diags/create-action-group-review-and-create.png" alt-text="Screenshot showing Review and Create pane.":::

    1. Back on the **Create alert rule** pane, notice that your new action group has been added to the actions for the alert.  

1. Finally configure the alert rule details and save the alert rule.

    1. On the **Create alert rule** pane, under Alert rule details, enter a name and a description for your alert; for example, "Alert if more than 1000 messages over 5 minutes". Make sure that **Enable alert rule upon creation** is checked. Your completed alert rule will look similar to this screenshot.

        :::image type="content" source="media/tutorial-use-metrics-and-diags/create-alert-rule-final.png" alt-text="Screenshot showing completed Create alert rule pane.":::

    1. Select **Create alert rule** to save your new rule.

1. Now set up another alert for the *Total number of messages used*. This metric is useful if you want to send an alert when the number of messages used is approaching the daily quota for the IoT hub, at which point, the IoT hub will start rejecting messages. Follow the steps you did before, with the following differences.

    * For the signal on the **Configure signal logic** pane,  select **Total number of messages used**.

    * On the **Configure signal logic** pane, set or confirm the following fields (you can ignore the chart):

       **Threshold**:  *Static*.

       **Operator**: *Greater than*.

       **Aggregation type**: *Maximum*.

       **Threshold value**: 4000.

       **Aggregation granularity (Period)**: *1 minute*.

       **Frequency of evaluation**: *Every 1 Minute*

       These settings set the signal to fire when the number of messages reaches 4000. The metric is evaluated every minute.

    * When you specify the action for your alert rule, just select the action group you created previously.

    * For the alert details, choose a different name and description than you did previously.

1. Select **Alerts**, under **Monitoring** on the left pane of your IoT hub. Now select **Manage alert rules** on the menu at the top of the **Alerts** pane. The **Rules** pane opens. You should now see your two alerts:

   :::image type="content" source="media/tutorial-use-metrics-and-diags/rules-management.png" alt-text="Screenshot showing the Rules pane with the new alert rules.":::

1. Close the **Rules** pane.

With these settings, an alert will trigger and you'll get an email notification when more than 1000 messages are sent within a 5-minute time span and also when the total number of messages used exceeds 4000 (50% of the daily quota for an IoT hub in the free tier).

## Run the simulated device app

In the [Set up resources](#set-up-resources) section, you registered a device identity to use to simulate using an IoT device. In this section, you download a .NET console app that simulates a device that sends device-to-cloud messages to an IoT Hub, configure it to send these messages to your IoT hub, and then run it.

> [!IMPORTANT]
>
> Alerts can take up to 10 minutes to be fully configured and enabled by IoT Hub. Wait at least 10 minutes between the time you configure your last alert and running the simulated device app.

Download the solution for the [IoT Device Simulation](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip). This link downloads a repo with several applications in it; the one you are looking for is in iot-hub/Quickstarts/simulated-device/.

1. In a local terminal window, navigate to the root folder of the solution. Then navigate to the **iot-hub\Quickstarts\simulated-device** folder.

1. Open the **SimulatedDevice.cs** file in a text editor of your choice.

    1. Replace the value of the `s_connectionString` variable with the device connection string you noted when you ran the script to set up resources.

    1. In the `SendDeviceToCloudMessagesAsync` method, change the `Task.Delay` from 1000 to 1, which reduces the amount of time between sending messages from 1 second to 0.001 seconds. Shortening this delay increases the number of messages sent. (You will likely not get a message rate of 100 messages per second.)

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

    :::image type="content" source="media/tutorial-use-metrics-and-diags/simulated-device-output.png" alt-text="Screenshot showing simulated device output.":::

Let the application run for at least 10-15 minutes. Ideally, let it run until it stops sending messages (about 20-30 minutes). This will happen when you've exceeded the daily message quota for your IoT hub, and it has stopped accepting any more messages.

> [!NOTE]
> If you leave the device app running for an extended period after it stops sending messages, you may get an exception. You can safely ignore this exception and close the app window.

## View metrics chart on your dashboard

1. In the upper-left corner of Azure portal, open the portal menu, and then select **Dashboard**.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/select-dashboard.png" alt-text="Screenshot how to select your dashboard.":::

1. Find the chart you pinned earlier and click anywhere on the tile outside of the chart data to expand it. It shows the telemetry messages sent and the total number of messages used on the chart. The most recent numbers appear at the bottom of the chart. You can move the cursor in the chart to see the metric values for specific times. You can also change the time value and granularity at the top of the chart to narrow down or expand the data to a time period of interest.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/metrics-on-dashboard-last-hour.png" alt-text="Screenshot showing the metrics chart.":::

   In this scenario, the simulated device's message throughput isn't large enough to cause IoT Hub to throttle its messages. In a scenario that actually involves throttling, you may see telemetry messages sent exceed the throttle limit for your IoT hub for a limited time. This is to accommodate burst traffic. For details, see [traffic shaping](iot-hub-devguide-quotas-throttling.md#traffic-shaping).

## View the alerts

When the number of messages sent exceeds the limits you set in your alert rules, you start getting e-mail alerts.

To see if there are any active alerts, select **Alerts** under **Monitoring** on the left pane of your IoT hub. The **Alerts** pane shows the number of alerts that have fired sorted by severity for the specified time range.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/view-alerts.png" alt-text="Screenshot showing the alerts summary.":::

Select the row for severity Sev 3. The **All Alerts** pane opens and lists the Sev 3 alerts that have fired.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/view-all-alerts.png" alt-text="Screenshot showing the All Alerts pane.":::

Select one of the alerts to see the alert details.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/view-individual-alert.png" alt-text="Screenshot showing alert details.":::

Check your inbox for emails from Microsoft Azure. The subject line will describe the alert that was triggered. For example, *Azure: Activated Severity: 3 Alert if more than 1000 messages over 5 minutes*. The body will look similar to the following image:

   :::image type="content" source="media/tutorial-use-metrics-and-diags/alert-mail.png" alt-text="Screenshot of the e-mail showing the alerts have fired.":::

## View Azure Monitor Logs

In the [Collect logs for connections and device telemetry](#collect-logs-for-connections-and-device-telemetry) section, you created a diagnostic setting to send resource logs emitted by your IoT hub for connection and device telemetry operations to Azure Monitor Logs. In this section, you'll run a Kusto query against Azure Monitor Logs to observe any errors that occurred.

1. Under **Monitoring** in the left pane of your IoT hub in Azure portal, select **Logs**. Close the initial **Queries** window if it opens.

1. On the New Query pane, select the **Queries** tab and then expand **IoT Hub** to see the list of default queries.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/new-query-pane.png" alt-text="Screenshot of IoT Hub default queries.":::

1. Select the *Error summary* query. The query appears in the Query editor pane. Select **Run** in the editor pane and observe the query results. Expand one of the rows to see details.

   :::image type="content" source="media/tutorial-use-metrics-and-diags/logs-errors.png" alt-text="Screenshot of the logs returned by the Errors summary query.":::

   > [!NOTE]
   > If you don't see any errors, try running the *Recently connected devices* query. This should return a row for the simulated device.

## Clean up resources

To remove all of the resources you've created in this tutorial, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, the Log Analytics workspace, and the resource group itself. If you have pinned metrics charts to the dashboard, you'll have to remove them manually by clicking on the three dots in the upper right-hand corner of each chart and selecting **Remove**. Be sure to save your changes after doing deleting the charts.

To remove the resource group, use the [az group delete](/cli/azure/group#az_group_delete) command.

```azurecli-interactive
az group delete --name ContosoResources
```

## Next steps

In this tutorial, you learned how to use IoT Hub metrics and logs by performing the following tasks:

> [!div class="checklist"]
>
> * Use Azure CLI to create an IoT hub, register a simulated device, and create a Log Analytics workspace.  
> * Send IoT Hub connections and device telemetry resource logs to Azure Monitor Logs in the Log Analytics workspace.
> * Use metric explorer to create a chart based on selected metrics and pin it to your dashboard.
> * Create metric alerts so you can be notified by email when important conditions occur.
> * Download and run an app that simulates an IoT device sending messages to the IoT hub.
> * View the alerts when your conditions occur.
> * View the metrics chart on your dashboard.
> * View IoT Hub errors and operations in Azure Monitor Logs.

Advance to the next tutorial to learn how to manage the state of an IoT device. 

> [!div class="nextstepaction"]
> [Configure your devices from a back-end service](tutorial-device-twins.md)