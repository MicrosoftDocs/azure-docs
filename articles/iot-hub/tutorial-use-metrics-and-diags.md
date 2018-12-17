---
title: Set up and use metrics and diagnostics with an IoT hub | Microsoft Docs
description: Set up and use metrics and diagnostics with an IoT hub 
author: robinsh
manager: philmea
ms.service: iot-hub
services: iot-hub
ms.topic: tutorial
ms.date: 12/15/2018
ms.author: robinsh
ms.custom: mvc
#Customer intent: As a developer, I want to know how to set up and check metrics and diagnostics, to help me troubleshoot when there is a problem with an IoT hub. 
---

# Tutorial: Set up and use metrics and diagnostics with an IoT hub

If you have an IoT Hub solution running in production, you want to set up some metrics and enable diagnostics. Then if a problem occurs, you have data to look at that will help you diagnose the problem and fix it more quickly. In this article, you'll see how to enable diagnostics, and how to check the diagnostics for errors. You'll also set up some metrics to watch, and alerts that fire when the metrics hit a certain boundary. For example, you could have an e-mail sent to you when the number of telemetry messages sent exceeds a specific boundary, or when the number of messages used gets close to the quota of messages allowed per day for the IoT Hub. 

An example use case is a gas station where the pumps are IoT devices that send communicate with an IoT hub. Credit cards are validated, and the final transaction is written to a data store. If the IoT devices stop connecting to the hub and sending messages, it is much more difficult to fix if you have no visibility into what's going on.

This tutorial uses the Azure sample from the [IoT Hub Routing](tutorial-routing.md) to send messages to the IoT hub.

In this tutorial, you perform the following tasks:

> [!div class="checklist"]
> * Using Azure CLI, create an IoT hub, a simulated device, and a storage account.  
> * Enable diagnostics. 
> * Enable metrics.
> * Set up alerts for those metrics. 
> * Download and run an app that simulates an IoT device sending messages to the hub. 
> * Run the app until the alerts begin to fire. 
> * View the metrics results and check the diagnostics results. 

## Prerequisites

- An Azure subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Install [Visual Studio](https://www.visualstudio.com/). 

- An Office 365 account to send notification e-mails. 

[!INCLUDE [cloud-shell-try-it.md](../../includes/cloud-shell-try-it.md)]

## Set up resources

For this tutorial, you need an IoT hub, a storage account, and a simulated IoT device. These resources can be created using Azure CLI or Azure PowerShell. Use the same resource group and location for all of the resources. Then at the end, you can remove everything in one step by deleting the resource group.

These are the required steps.

1. Create a [resource group](../azure-resource-manager/resource-group-overview.md). 

2. Create an IoT hub.

3. Create a standard V1 storage account with Standard_LRS replication.

4. Create a device identity for the simulated device that sends messages to your hub. Save the key for the testing phase.

### Set up your resources using Azure CLI

Copy and paste this script into Cloud Shell. Assuming you are already logged in, it runs the script one line at a time. This creates the new resources in the resource group ContosoResources.

The variables that must be globally unique have `$RANDOM` concatenated to them. When the script is run and the variables are set, a random numeric string is generated and concatenated to the end of the fixed string, making it unique.

```azurecli-interactive

# This is the IOT Extension for Azure CLI.
# You only need to install this the first time.
# You need it to create the device identity. 
az extension add --name azure-cli-iot-ext

# Set the values for the resource names that don't have to be globally unique.
# The resources that have to have unique names are named in the script below
#   with a random number concatenated to the name so you can probably just
#   run this script, and it will work with no conflicts.
location=westus
resourceGroup=ContosoResources
iotDeviceName=Contoso-Test-Device 

# Create the resource group to be used
#   for all the resources for this tutorial.
az group create --name $resourceGroup \
    --location $location

# The IoT hub name must be globally unique, so add a random number to the end.
iotHubName=ContosoTestHub$RANDOM
echo "IoT hub name = " $iotHubName

# Create the IoT hub.
az iot hub create --name $iotHubName \
    --resource-group $resourceGroup \
    --sku F1 --location $location

# The storage account name must be globally unique, so add a random number to the end.
storageAccountName=contosostoragemon$RANDOM
echo "Storage account name = " $storageAccountName

# Create the storage account.
az storage account create --name $storageAccountName \
    --resource-group $resourceGroup \
	--location $location \
    --sku Standard_LRS

# this gives an error: No keys found for policy iothubowner of IoT Hub ContosoTestHub  ROBIN
# Create the IoT device identity to be used for testing.
az iot hub device-identity create --device-id $iotDeviceName \
    --hub-name $iotHubName

# THIS DOESN'T WORK BECAUSE THE ONE ABOVE DOESN'T WORK - ROBIN
# Retrieve the information about the device identity, then copy the primary key to
#   Notepad. You need this to run the device simulation during the testing phase.
az iot hub device-identity show --device-id $iotDeviceName \
    --hub-name $iotHubName

```

## Enable diagnostics 

Diagnostics are disabled by default when you create a new IoT hub. In this section, enable the diagnostics for your hub.

1. First, if you're not already on your hub in the portal, click **Resource groups** and click on the resource group Contoso-Resources. [robin - be sure you've talked about that above]. Select the hub from the list of resources displayed. 

2. Look for the **Monitoring** section in the IoT Hub blade. Click **Diagnostic settings**. 

<!-- ./media/tutorial-use-metrics-and-diags/01-diagnostic-settings.png -->

3. Make sure the subscription and resource group are correct. Under **Resource Type**, uncheck **Select All** and check **IoT Hub**. (It re-checks *Select All*, just ignore this.) Under **Resource**, select the hub name. You screen should look like this image:

<!-- ./media/tutorial-use-metrics-and-diags/02-diagnostics-settings-filledin.png -->

4. Now click **Turn on diagnostics**. The Diagnostics Settings screen is displayed. Specify the name of your diagnostics as "diags-hub".

5. Check **Archive to a storage 
account**. Click **Configure** to see the **Select a storage account** screen, select the right one (contosostoragemon), and click **OK** to return to the Diagnostics Settings screen. 

<!-- ./media/tutorial-use-metrics-and-diags/04-diagnostics-settings-select-storage-account.png-->

6. Under **LOG**, check Connections and Device Telemetry, and set the **Retention (days)** to 7 days for each. 

<!-- ./media/tutorial-use-metrics-and-diags/05-diagnostics-settings-done.png  -->

7. Click **Save** to save the settings. 

Later, when you look at the diagnostics logs, you'll see the connect and disconnect diagnostics for the device. 

## Set up metrics 

Now set up some metrics to watch for when messages are sent to the hub. 

1. In the settings pane for the IoT hub, click on the **Metrics** option under the **Monitoring** section.

2. At the top of the screen change **Last 24 hours...** to **Last 24 hours (Automatic - 15 minutes)**. In the dropdown that appears, select **Last 30 minutes** for **Time Range**, and set **Time Granularity** to **1 minute**, local time. Click **Apply** to save these settings. 

3. Click **Add metric**. Select your resource gruop (**ContosoTestHub**). For **Metric Namespace**, select **IoT Hub standard metrics**. Under **Metric**, select **Telemetry messages sent**. Set **Aggregation** to **Sum**.

4. Click **Add metric**. Select your resource group (**ContosoTestHub**). Under **Metric**, select **Total Number of Messages Used**. For **Aggregation**, select **Avg**.  (ROBIN - or should you set Max?)

Click **Pin\ to dashboard** or you'll never see your metrics again. It will pin it to the dashboard of your Azure portal so you can access it again. 
**I already had one pinned to the dashboard, and it didn't save the new one, and the resources for the old one had been deleted, so it didn't work. Can you not have more than one? Or more than one for the same hub? Or what?** ROBIN

## SET UP ALERTS

Go to the hub in the portal. IoT Hub has not been migrated to Azure Alerts yet (product name?); you have to use classic alerts. 

1. Under **Monitoring**, click **Alerts**.

2. Click **View classic alerts**. Click **Add metric alert (classic)** . 

<!-- screenshot of Add Rule blade-->

3. Set up an alert for telemetry messages sent:

   **Name**: Set name for the alert rule.

   **Description**: Fill in a description for your alert rule. 

   **Source**: Set to *Metrics*.

   **Subscription**: select the current subscription.

    **Resource Group**: Select *ContosoResources*.

    **Resource**: Choose your IoT hub, *ContosoTestHub*. 

    **Metric**: Select **Telemetry messages sent**. 

    **Condition**: Set to *Greater than*.

    **Threshold**: Set to 400.

    **Period**: Set this to *Over the last 30 minutes*. 

    On the **Notify via** section, fill in the felds: 

    **Notification email recipients**: Fill in your e-mail address here. 

    You can also set up a webhook here and send the alerts there instead. For example, you could send the results to an Azure Function. You can also send the results to a Logic App.

    Click **OK** to save the rule. 

4. Set up an alert for total messages used. This is useful if you want to send an alert when the number of messages used is approaching the quota for the IoT hub -- to let you know the hub will soon start rejecting messages.

   **Name**: Set name for the alert rule.

   **Description**: Fill in a description for your alert rule. 

   **Source**: Set to *Metrics*.

   **Subscription**: select the current subscription.

    **Resource Group**: Select *ContosoResources*.

    **Resource**: Choose your IoT hub, *ContosoTestHub*. 

    **Metric**: Select **Total number of messages used**. 

    **Condition**: Set to *Greater than*.

    **Threshold**: Set to 1000.

    **Period**: Set this to *Over the last 5 minutes*. 

    On the **Notify via** section, fill in the felds: 

    **Notification email recipients**: Fill in your e-mail address here. 

    Click **OK** to save the rule. 

5. Close the classic alerts pane, and then close the alerts pane. 
    
    With these settings, you will get an alert when the number of messages sent is greater than 400 and when the total number of messages used exceeds NUMBER.

## Run Simulated Device app

Earlier in the script setup section, you set up a device to simulate using an IoT device. In this section, you download a .NET console app that simulates a device that sends device-to-cloud messages to an IoT hub.  

Download the solution for the [IoT Device Simulation](https://github.com/Azure-Samples/azure-iot-samples-csharp/archive/master.zip). This downloads a repo with several applications in it; the solution you are looking for is in iot-hub/Tutorials/Routing/SimulatedDevice/.

Double-click on the solution file (SimulatedDevice.sln) to open the code in Visual Studio, then open Program.cs. Substitute `{iot hub hostname}` with the IoT hub host name. The format of the IoT hub host name is **{iot-hub-name}.azure-devices.net**. For this tutorial, the hub host name is **ContosoTestHub.azure-devices.net**. Next, substitute `{device key}` with the device key you saved earlier when setting up the simulated device. 

   ```csharp
        static string myDeviceId = "contoso-test-device";
        static string iotHubUri = "ContosoTestHub.azure-devices.net";
        // This is the primary key for the device. This is in the portal. 
        // Find your IoT hub in the portal > IoT devices > select your device > copy the key. 
        static string deviceKey = "{your device key here}";
   ```

## Run and test 

In Program.cs, comment out the following line of code, which puts a pause of 1 second in between each message sent. This will increase the number of messages sent. 

```csharp
await Task.Delay(1000);
```

Run the console application. Wait a few minutes (10-15). You can see the messages being sent on the console screen of the application in the console log.

The app sends continuous device-to-cloud message to the IoT hub. The message contains a JSON-serialized object with the device ID, temperature, humidity, and message level, which defaults to `normal`. It randomly assigns a level of `critical` or `storage`.

### See the metrics in the portal.

Open your metrics from the Dashboard. It shows the telemetry messages sent and the total number of messages used on the chart, with the numbers at the bottom of the chart. 

<!-- screenshot -->

### See the alerts

When the number of messages sent exceeds the limit, you start getting e-mail alerts. To see if there are any active alerts, go to your hub and select **Alerts**. It will show you the alerts that are active, and if there are any warnings. 

<!-- screenshot of classic alerts -->

Click on alert-telemetry-messages. It shows the metric result and a chart with the results. The e-mail looks like this:

<!-- screenshot .media/tutorial-use-metrics-and-diags/metric-alert-fired.png -->

It may take up to 30 minutes for the e-mail alerts to come through. (ARE THESE RELIABLE? I'M NOT GETTING THEM FOR TOTAL-MESSAGES-USED.)

### See the diagnostic logs. 

Go to the hub in the portal and click **Logs** under the **Monitoring** section. You can see messages showing the device connecting to and disconnecting from the hub. 

If you are sending it to the storage account, go to the storage account *contosostoragemon* and select Blobs, then open container *insights-logs-connections*. Drill down until you get to the current date and select the most recent file. Download it and open it. You see something like this:

```
{ "time": "2018-12-16T19:01:43Z", 
   "resourceId":   
      "/SUBSCRIPTIONS/<subscription id>/RESOURCEGROUPS/CONTOSORESOURCES/PROVIDERS/MICROSOFT.DEVICES/IOTHUBS/CONTOSOTESTHUB", 
   "operationName": "deviceConnect", 
   "category": "Connections", 
   "level": "Information", 
   "properties": 
      "{"deviceId :"Contoso-Test-Device",
      "protocol":"Mqtt",
      "authType":null,
      "maskedIpAddress":"73.162.215.XXX",
      "statusCode":null}", 
    "location": "westus"}
```

HOW DO I SEE WHAT JOHN SAW, WITH THE CONNECTIONS? I'M SENDING IT TO LOG ANALYTICS, BUT NO IDEA IF I'M DOING THAT RIGHT. 

## Clean up resources 

To remove all of the resources you've created in this tutorial, delete the resource group. This action deletes all resources contained within the group. In this case, it removes the IoT hub, the storage account, and the resource group itself. 

DOES IT REMOVE THE STUFF PINNED TO THE DASHBOARD? I DON'T THINK SO.

To remove the resource group, use the [az group delete](https://docs.microsoft.com/cli/azure/group?view=azure-cli-latest#az-group-delete) command.

```azurecli-interactive
az group delete --name $resourceGroup
```

## Next steps

In this tutorial, you learned how to use metrics and diagnostics by performing the following tasks:

> [!div class="checklist"]
> * Using Azure CLI, create an IoT hub, a simulated device, and a storage account.  
> * Enable diagnostics. 
> * Enable metrics.
> * Set up alerts for those metrics. 
> * Download and run an app that simulates an IoT device sending messages to the hub. 
> * Run the app until the alerts begin to fire. 
> * View the metrics results and check the diagnostics results. 

Advance to the next tutorial to learn how to manage the state of an IoT device. 

> [!div class="nextstepaction"]
[Configure your devices from a back-end service](tutorial-device-twins.md)
