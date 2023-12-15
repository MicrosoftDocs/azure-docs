---
title: Extend Azure IoT Central by using custom rules
description: Configure an IoT Central application to send notifications when a device stops sending telemetry by using Azure Stream Analytics, Azure Functions, and SendGrid.
author: dominicbetts 
ms.author: dobett 
ms.date: 11/27/2023
ms.topic: how-to
ms.service: iot-central
services: iot-central
ms.custom: mvc, devx-track-csharp, devx-track-azurecli
# Solution developer
---

# Extend Azure IoT Central with custom rules using Stream Analytics, Azure Functions, and SendGrid

This how-to guide shows you how to extend your IoT Central application with custom rules and notifications. The example shows sending a notification to an operator when a device stops sending telemetry. The solution uses an [Azure Stream Analytics](../../stream-analytics/index.yml) query to detect when a device stops sending telemetry. The Stream Analytics job uses [Azure Functions](../../azure-functions/index.yml) to send notification emails using [SendGrid](https://sendgrid.com/docs/for-developers/partners/microsoft-azure/).

This how-to guide shows you how to extend IoT Central beyond what it can already do with the built-in rules and actions.

In this how-to guide, you learn how to:

* Stream telemetry from an IoT Central application using *continuous data export*.
* Create a Stream Analytics query that detects when a device stops sending data.
* Send an email notification using the Azure Functions and SendGrid services.

## Prerequisites

To complete the steps in this how-to guide, you need an active Azure subscription.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create the Azure resources

Run the following script to create the Azure resources you need to configure this scenario. Run this script in a bash environment such as the Azure Cloud Shell:

> [!NOTE]
> The `az login` command is necessary even in the Cloud Shell.

```azurecli
SUFFIX=$RANDOM

# Event Hubs namespace name
EHNS=detect-stopped-devices-ehns-$SUFFIX

# IoT Central app name
CA=detect-stopped-devices-app-$SUFFIX

# Storage account
STOR=dtsstorage$SUFFIX

# Function App
FUNC=detect-stopped-devices-function-$SUFFIX

# ASA 
ASA=detect-stopped-devices-asa-$SUFFIX

# Other variables
RG=DetectStoppedDevices
EH=centralexport
LOCATION=eastus
DESTID=ehdest01
EXPID=telexp01

# Sign in
az login

# Create the Azure resources
az group create -n $RG --location $LOCATION

# Create IoT Central app
az iot central app create --name $CA --resource-group $RG \
   --template "iotc-condition" \
   --subdomain $CA \
   --display-name "In-store analytics - Condition Monitoring (custom rules scenario)"

# Configure managed identity for IoT Central app
az iot central app identity assign --name $CA --resource-group $RG --system-assigned
PI=$(az iot central app identity show --name $CA --resource-group $RG --query "principalId" --output tsv)

# Create Event Hubs
az eventhubs namespace create --name $EHNS --resource-group $RG --location $LOCATION
az eventhubs eventhub create --name $EH --resource-group $RG --namespace-name $EHNS

# Create Function App
az storage account create --name $STOR --location $LOCATION --resource-group $RG --sku Standard_LRS
az functionapp create --name $FUNC --storage-account $STOR --consumption-plan-location $LOCATION \
  --functions-version 4 --resource-group $RG

# Create Azure Stream Analytics
az stream-analytics job create --job-name $ASA --resource-group $RG --location $LOCATION

# Create the IoT Central data export
az role assignment create --assignee $PI --role "Azure Event Hubs Data Sender" --resource-group $RG
az iot central export destination create --app-id $CA --dest-id $DESTID \
  --type eventhubs@v1 --name "Event Hubs destination" --authorization "{
    \"eventHubName\": \"$EH\",
    \"hostName\": \"$EHNS.servicebus.windows.net\",
    \"type\": \"systemAssignedManagedIdentity\"
  }"

az iot central export create --app-id $CA --export-id $EXPID --enabled false \
  --display-name "All telemetry" --source telemetry --destinations "[
    {
      \"id\": \"$DESTID\"
    }
  ]"

echo "Event Hubs hostname: $EHNS.servicebus.windows.net"
echo "Event hub: $EH"
echo "IoT Central app: $CA.azureiotcentral.com"
echo "Function App hostname: $FUNC.azurewebsites.net"
echo "Stream Analytics job: $ASA"
echo "Resource group: $RG"
```

Make a note of the values output at the end of the script, you use them later in the set-up process.

The script creates:

* A resource group called `DetectStoppedDevices` that contains all the resources.
* An Event Hubs namespace with an event hub called `centralexport`.
* An IoT Central application with two simulated thermostat devices. Telemetry from the two devices is exported to the `centralexport` event hub. This IoT Central data export definition is currently disabled.
* An Azure Stream Analytics job.
* An Azure Function App.

### SendGrid account and API Keys

If you don't have a SendGrid account, create a [free account](https://app.sendgrid.com/) before you begin.

1. From the SendGrid Dashboard, select **Settings** on the left menu, select **Settings > API Keys**.
1. Select **Create API Key**.
1. Name the new API key **AzureFunctionAccess**.
1. Select **Create & View**.

:::image type="content" source="media/howto-create-custom-rules/sendgrid-api-keys.png" alt-text="Screenshot that shows how to create a SendGrid API key." lightbox="media/howto-create-custom-rules/sendgrid-api-keys.png":::

Make a note of the generated API key, you use it later.

Create a **Single Sender Verification** in your SendGrid account for the email address you'll use as the **From** address.

## Define the function

This solution uses an Azure Functions app to send an email notification when the Stream Analytics job detects a stopped device. To create your function app:

1. In the Azure portal, navigate to the **Function App** instance in the **DetectStoppedDevices** resource group.
1. Select **Functions**, then **+ Create** to create a new function.
1. Select **HTTP Trigger** as the function template.
1. Select **Create**.

:::image type="content" source="media/howto-create-custom-rules/add-function.png" alt-text="Screenshot of the Azure portal that shows how to create an HTTP trigger function." lightbox="media/howto-create-custom-rules/add-function.png":::

### Edit code for HTTP Trigger

The portal creates a default function called **HttpTrigger1**. Select **Code + Test**:

:::image type="content" source="media/howto-create-custom-rules/default-function.png" alt-text="Screenshot that shows the default function code." lightbox="media/howto-create-custom-rules/default-function.png":::

1. Replace the C# code with the following code:

    ```csharp
    #r "Newtonsoft.Json"
    #r "SendGrid"
    using System;
    using SendGrid.Helpers.Mail;
    using Microsoft.Azure.WebJobs.Host;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Primitives;
    using Newtonsoft.Json;

    public static SendGridMessage Run(HttpRequest req, ILogger log)
    {
        string requestBody = new StreamReader(req.Body).ReadToEnd();
        log.LogInformation(requestBody);
        var notifications = JsonConvert.DeserializeObject<IList<Notification>>(requestBody);

        SendGridMessage message = new SendGridMessage();
        message.Subject = "Contoso device notification";

        var content = "The following device(s) have stopped sending telemetry:<br/><br/><table><tr><th>Device ID</th><th>Time</th></tr>";
        foreach(var notification in notifications) {
            log.LogInformation($"No message received - Device: {notification.deviceid}, Time: {notification.time}");
            content += $"<tr><td>{notification.deviceid}</td><td>{notification.time}</td></tr>";
        }
        content += "</table>";
        message.AddContent("text/html", content);  

        return message;
    }

    public class Notification
    {
        public string deviceid { get; set; }
        public string time { get; set; }
    }
    ```

1. Select **Save** to save the function.

### Configure function to use SendGrid

To send emails with SendGrid, you need to configure the bindings for your function as follows:

1. Select **Integration**.
1. Select **HTTP ($return)**.
1. Select **Delete.**
1. Select **+ Add output**.
1. Select **SendGrid** as the binding type.
1. For the **SendGrid API Key App Setting**, select **New**.
1. Enter the *Name* and *Value* of your SendGrid API key. If you followed the previous instructions, the name of your SendGrid API key is **AzureFunctionAccess**.
1. Add the following information:

    | Setting | Value |
    | ------- | ----- |
    | Message parameter name | $return |
    | To address | Enter your To Address |
    | From address | Enter your SendGrid verified single sender email address |
    | Message subject | Device stopped |
    | Message text | The device connected to IoT Central has stopped sending telemetry. |

1. Select **Save**.

:::image type="content" source="media/howto-create-custom-rules/add-output.png" alt-text="Screenshot of the SendGrid output configuration." lightbox="media/howto-create-custom-rules/add-output.png":::

### Test the function works

To test the function in the portal, first make the **Logs** panel is visible on the **Code + Test** page. Then select **Test/Run**. Use the following JSON as the **Request body**:

```json
[{"deviceid":"test-device-1","time":"2019-05-02T14:23:39.527Z"},{"deviceid":"test-device-2","time":"2019-05-02T14:23:50.717Z"},{"deviceid":"test-device-3","time":"2019-05-02T14:24:28.919Z"}]
```

The function log messages appear in the **Logs** panel:

:::image type="content" source="media/howto-create-custom-rules/function-app-logs.png" alt-text="Screenshot that shows the function log output." lightbox="media/howto-create-custom-rules/function-app-logs.png":::

After a few minutes, the **To** email address receives an email with the following content:

```txt
The following device(s) have stopped sending telemetry:

Device ID    Time
test-device-1    2019-05-02T14:23:39.527Z
test-device-2    2019-05-02T14:23:50.717Z
test-device-3    2019-05-02T14:24:28.919Z
```

## Add Stream Analytics query

This solution uses a Stream Analytics query to detect when a device stops sending telemetry for more than 180 seconds. The query uses the telemetry from the event hub as its input. The job sends the  query results to the function app. In this section, you configure the Stream Analytics job:

1. In the Azure portal, navigate to your Stream Analytics job in the **DetectStoppedDevices** resource group. Under **Jobs topology**, select **Inputs**, select **+ Add stream input**, and then select **Event Hub**.
1. Use the information in the following table to configure the input using the event hub you created previously, then select **Save**:

    | Setting | Value |
    | ------- | ----- |
    | Input alias | *centraltelemetry* |
    | Subscription | Your subscription |
    | Event Hubs namespace | Your Event Hubs namespace. The name starts with **detect-stopped-devices-ehns-**. |
    | Event hub name | Use existing - **centralexport** |
    | Event hub consumer group | Use existing - **$default** |

1. Under **Jobs topology**, select **Outputs**, select **+ Add**, and then select **Azure Function**.
1. Use the information in the following table to configure the output, then select **Save**:

    | Setting | Value |
    | ------- | ----- |
    | Output alias | *emailnotification* |
    | Subscription | Your subscription |
    | Function app | Your Function app. The name starts with **detect-stopped-devices-function-**. |
    | Function  | HttpTrigger1 |

1. Under **Jobs topology**, select **Query** and replace the existing query with the following SQL:

    ```sql
    with
    LeftSide as
    (
        SELECT
        -- Get the device ID
        deviceId as deviceid1, 
        EventEnqueuedUtcTime AS time1
        FROM
        -- Use the event enqueued time for time-based operations
        [centraltelemetry] TIMESTAMP BY EventEnqueuedUtcTime
    ),
    RightSide as
    (
        SELECT
        -- Get the device ID
        deviceId as deviceid2, 
        EventEnqueuedUtcTime AS time2
        FROM
        -- Use the event enqueued time for time-based operations
        [centraltelemetry] TIMESTAMP BY EventEnqueuedUtcTime
    )

    SELECT
        LeftSide.deviceid1 as deviceid,
        LeftSide.time1 as time
    INTO
        [emailnotification]
    FROM
        LeftSide
        LEFT OUTER JOIN
        RightSide 
        ON
        LeftSide.deviceid1=RightSide.deviceid2 AND DATEDIFF(second,LeftSide,RightSide) BETWEEN 1 AND 180
        where
        -- Find records where a device didn't send a message for 180 seconds
        RightSide.deviceid2 is NULL
    ```

1. Select **Save**.
1. To start the Stream Analytics job, select **Overview**, then **Start**, then **Now**, and then **Start**:

:::image type="content" source="media/howto-create-custom-rules/stream-analytics.png" alt-text="Screenshot of Stream Analytics overview page." lightbox="media/howto-create-custom-rules/stream-analytics.png":::

## Configure export in IoT Central

On the [Azure IoT Central My apps](https://apps.azureiotcentral.com/myapps) page, locate the IoT Central application the script created. The name of the app is **In-store analytics - Condition Monitoring (custom rules scenario)**.

To enable the data export to Event Hubs, navigate to the **Data Export** page and enable the **All telemetry** export.
Wait until the export status is **Running** before you continue.

## Test

To test the solution, you can block one of the devices to  simulate a stopped device:

1. In your IoT Central application, navigate to the **Devices** page and select one of the two thermostat devices.
1. Select **Block** to stop the device sending telemetry.
1. After about two minutes, the **To** email address receives one or more emails that look like the following example:

    ```txt
    The following device(s) have stopped sending telemetry:

    Device ID         Time
    Thermostat-Zone1  2022-11-01T12:45:14.686Z
    ```

## Tidy up

To tidy up after this how-to and avoid unnecessary costs, delete the **DetectStoppedDevices** resource group in the Azure portal.

## Next steps

In this how-to guide, you learned how to:

* Stream telemetry from an IoT Central application using the data export feature.
* Create a Stream Analytics query that detects when a device stops sending data.
* Send an email notification using the Azure Functions and SendGrid services.

Now that you know how to create custom rules and notifications, the suggested next step is to learn how to [Extend Azure IoT Central with custom analytics](howto-create-custom-analytics.md).
