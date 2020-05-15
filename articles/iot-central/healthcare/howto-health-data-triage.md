---
title: Create a health data triage dashboard with Azure IoT Central | Microsoft Docs
description: Learn to build a health data triage dashboard using Azure IoT Central application templates.
author: philmea
ms.author: philmea
ms.date: 10/23/2019
ms.topic: tutorial
ms.service: iot-central
services: iot-central
manager: eliotgra
---

# Tutorial: Build a Power BI provider dashboard



When building your continuous patient monitoring solution, you can also create a dashboard for a hospital care team to visualize patient data. In this tutorial, you will learn how to create a Power BI real-time streaming dashboard from your IoT Central continuous patient monitoring application template.

>[!div class="mx-imgBorder"]
>![Dashboard GIF](media/dashboard-gif-3.gif)

The basic architecture will follow this structure:

>[!div class="mx-imgBorder"] 
>![Provider Triage Dashboard](media/dashboard-architecture.png)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Export data from Azure IoT Central to Azure Event Hubs
> * Set up a Power BI streaming dataset
> * Connect your Logic App to Azure Event Hubs
> * Stream data to Power BI from your Logic App
> * Build a real-time dashboard for patient vitals

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* An Azure IoT Central continuous patient monitoring application template. If you don't have one already, you can follow steps to [Deploy an application template](overview-iot-central-healthcare.md).

* An Azure [Event Hubs namespace and Event Hub](https://docs.microsoft.com/azure/event-hubs/event-hubs-create).

* The Logic App that you want to access your Event Hub. To start your Logic App with an Azure Event Hubs trigger, you need a [blank Logic App](https://docs.microsoft.com/azure/logic-apps/quickstart-create-first-logic-app-workflow).

* A Power BI service account. If you don't have one already, you can [create a free trial account for Power BI service](https://app.powerbi.com/). If you haven't used Power BI before, it might be helpful to go through [Get started with Power BI](https://docs.microsoft.com/power-bi/service-get-started).

## Set up a continuous data export to Azure Event Hubs
You will first need to set up a continuous data export from your Azure IoT Central app template to the Azure Event Hub in your subscription. You can do so by following the steps in this Azure IoT Central tutorial for [Exporting to Event Hubs](https://docs.microsoft.com/azure/iot-central/core/howto-export-data). You will only need to export for the telemetry for the purposes of this tutorial.

## Create a Power BI streaming dataset

1. Sign in to your Power BI account.

2. In your preferred Workspace, create a new streaming dataset by selecting the **+ Create** button in the upper-right corner of the toolbar. You will need to create a separate dataset for  each patient that you would like to have on your dashboard.

    >[!div class="mx-imgBorder"] 
    >![Create streaming dataset](media/create-streaming-dataset.png)

3. Choose **API** for the source of your dataset.

4. Enter a **name** (for example, a patient's name) for your dataset and then fill out the values from your stream. You can see an example below based on values coming from the simulated devices in the continuous patient monitoring application template. The example has two patients:

    * Teddy Silvers, who has data from the Smart Knee Brace
    * Yesenia Sanford, who has data from the Smart Vitals Patch

    >[!div class="mx-imgBorder"] 
    >![Enter dataset values](media/enter-dataset-values.png)

To learn more about streaming datasets in Power BI, you can read this document on [real-time streaming in Power BI](https://docs.microsoft.com/power-bi/service-real-time-streaming).

## Connect your Logic App to Azure Event Hubs
To connect your Logic App to Azure Event Hubs, you can follow the instructions outlined in this document on [Sending events with Azure Event Hubs and Azure Logic Apps](https://docs.microsoft.com/azure/connectors/connectors-create-api-azure-event-hubs#add-event-hubs-action). Here are some suggested parameters:

|Parameter|Value|
|---|---|
|Content type|application/json|
|Interval|3|
|Frequency|Second|

At the end of this step, your Logic App Designer should look like this:

>[!div class="mx-imgBorder"] 
>![Logic Apps connects to Event Hubs](media/eh-logic-app.png)

## Stream data to Power BI from your Logic App
The next step will be to parse the data coming from your Event Hub to stream it into the Power BI datasets that you have previously created.

1. Before you can do this, you will need to understand the JSON payload that is being sent from your device to your Event Hub. You can do so by looking at this [sample schema](https://docs.microsoft.com/azure/iot-central/core/howto-export-data#telemetry) and modifying it to match your schema or using [Service Bus explorer](https://github.com/paolosalvatori/ServiceBusExplorer) to inspect the messages. If you are using the continuous patient monitoring applications, your messages will look like this:

**Smart Vitals Patch telemetry**

```json
{
  "HeartRate": 80,
  "RespiratoryRate": 12,
  "HeartRateVariability": 64,
  "BodyTemperature": 99.08839032397609,
  "BloodPressure": {
    "Systolic": 23,
    "Diastolic": 34
  },
  "Activity": "walking"
}
```

**Smart Knee Brace telemetry**

```json
{
  "Acceleration": {
    "x": 72.73510947763711,
    "y": 72.73510947763711,
    "z": 72.73510947763711
  },
  "RangeOfMotion": 123,
  "KneeBend": 3
}
```

**Properties**

```json
{
  "iothub-connection-device-id": "1qsi9p8t5l2",
  "iothub-connection-auth-method": "{\"scope\":\"device\",\"type\":\"sas\",  \"issuer\":\"iothub\",\"acceptingIpFilterRule\":null}",
  "iothub-connection-auth-generation-id": "637063718586331040",
  "iothub-enqueuedtime": 1571681440990,
  "iothub-message-source": "Telemetry",
  "iothub-interface-name": "Patient_health_data_3bk",
  "x-opt-sequence-number": 7,
  "x-opt-offset": "3672",
  "x-opt-enqueued-time": 1571681441317
}
```

2. Now that you have inspected your JSON payloads, go back to your Logic App Designer and select **+ New Step**. Search and add **Initialize variable** as your next step and enter the following parameters:

    |Parameter|Value|
    |---|---|
    |Name|Interface Name|
    |Type|String|

    Hit **Save**. 

3. Add another variable called **Body** with Type as **String**. Your Logic App will have these actions added:

    >[!div class="mx-imgBorder"]
    >![Initialize variables](media/initialize-string-variables.png)
    
4. Select **+ New Step** and add a **Parse JSON** action. Rename this to **Parse Properties**. For the Content, choose **Properties** coming from the Event Hub. Select **Use sample payload to generate schema** at the bottom, and paste the sample payload from the Properties section above.

5. Next, choose the **Set variable** action and update your **Interface Name** variable with the **iothub-interface-name** from the parsed JSON properties.

6. Add a **Split** Control as your next action and choose the **Interface Name** variable as the On parameter. You will use this to funnel the data to the correct dataset.

7. In your Azure IoT Central application, find the Interface Name for the Smart Vitals Patch health data and the Smart Knee Brace health data from the **Device Templates** view. Create two different cases for the **Switch** Control for each Interface Name and rename the control appropriately. You can set the Default case to use the **Terminate** Control and choose what status you would like to show.

    >[!div class="mx-imgBorder"] 
    >![Split control](media/split-by-interface.png)

8. For the **Smart Vitals Patch** case, add a **Parse JSON** action. For the Content, choose **Content** coming from the Event Hub. Copy and paste the sample payloads for the Smart Vitals Patch above to generate the schema.

9. Add a **Set variable** action and update the **Body** variable with the **Body** from the parsed JSON in Step 7.

10. Add a **Condition** Control as your next action and set the condition to **Body**, **contains**, **HeartRate**. This will make sure that you have the right set of data coming from the Smart Vitals Patch before populating the Power BI dataset. Steps 7-9 will look like this:

    >[!div class="mx-imgBorder"] 
    >![Smart Vitals add condition](media/smart-vitals-pbi.png)

11. For the **True** case of the Condition, add an action that calls the **Add rows to a dataset** Power BI functionality. You will have to sign into Power BI for this. Your **False** case can again use the **Terminate** control.

12. Choose the appropriate **Workspace**, **Dataset**, and **Table**. Map the parameters that you specified when creating your streaming dataset in Power BI to the parsed JSON values that are coming from your Event Hub. Your filled-out actions should look like this:

    >[!div class="mx-imgBorder"] 
    >![Add rows to Power BI](media/add-rows-yesenia.png)

13. For the **Smart Knee Brace** switch case, add a **Parse JSON** action to parse the content, similar to Step 7. Then **Add rows to a dataset** to update your Teddy Silvers dataset in Power BI.

    >[!div class="mx-imgBorder"] 
    >![Smart Vitals add condition](media/knee-brace-pbi.png)

14. Press **Save** and then run your Logic App.

## Build a real-time dashboard for patient vitals
Now go back to Power BI and select **+ Create** to create a new **Dashboard**. Give your dashboard a name and hit **Create**.

Select the three dots in the top navigation bar and then select **+ Add tile**.

>[!div class="mx-imgBorder"] 
>![Add tile to dashboard](media/add-tile.png)

Choose the type of tile you would like to add and customize your app however you'd like.

## Clean up resources

If you're not going to continue to use this application, delete your resources with the following steps:

1. From the Azure portal, you can delete the Event Hub and Logic Apps resources that you created.

2. For your IoT Central application, go to the Administration tab and select **Delete**.

## Next steps

* Review the [continuous patient monitoring architecture guidance](concept-continuous-patient-monitoring-architecture.md).
