---
title: Store Azure Media Services events in Azure Log Analytics
titleSuffix: Azure Media Services
description: Learn how to store Azure Media Services events in Azure Log Analytics.
services: media-services
documentationcenter: ''
author: IngridAtMicrosoft
manager: femila
editor: ''
ms.service: media-services
ms.workload: 
ms.topic: tutorial
ms.date: 08/24/2020
ms.author: inhenkel
---

# Tutorial: Store Azure Media Services events in Azure Log Analytics

In this tutorial, you will learn how to:

> [!div class="checklist"]
> * Create a no code Logic App Flow
> * Subscribe to Azure Media Services event topics
> * Parse events and store to Azure Log Analytics
> * Query events from Azure Log Analytics

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

> * An Azure subscription
> * An Azure Media Services account.
> * A [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace) workspace

> [!NOTE]
> The screenshots in this tutorial were captured in the Azure portal dark mode.

## Azure Media Services Events

Azure Media Services v3 emits events on [Azure Event Grid](media-services-event-schemas.md). You can subscribe to these events in many ways and store them in various data stores. In this tutorial, you will subscribe to these events using a [Log App Flow](https://azure.microsoft.com/services/logic-apps/). The Logic App will be triggered for each event and store the body of the event in Azure Log Analytics. Once the events are in Azure Log Analytics, you can use other Azure services to create a dashboard, monitor, and alert on these events.

## Set up

1. In the Azure portal, navigate to your Azure Media Services account and select "Events". This will show all the methods for subscribing to Azure Media Services events.
1. 
    ![Azure Media Services Portal](media/tutorial-events-log-analytics/01a.png)

1. Select the "Logic Apps" icon to create a Logic App. This will open the Logic App Designer where you can create the flow to capture the events and push them to Log Analytics. 

    ![Create Logic App](media/tutorial-events-log-analytics/02.png)

1. Select the + icon. This will allow you to authenticate and subscribe to the Event Grid. Once the authentication is complete, you should see the user email and a green checkmark.

    ![Connect to Azure Event Grid](media/tutorial-events-log-analytics/03.png)

1. Select "Continue" to subscribe to the Media Services Events.

    ![Connected to Azure Event Grid](media/tutorial-events-log-analytics/04.png)

1. In the "Resource Type" list, locate "Microsoft.Media.MediaServices".

    ![Azure Media Services Resource Events](media/tutorial-events-log-analytics/05.png)

1. In the "Event Type Item", there will be a list of all the events Azure Media Services emits. You can select the events you would like to track. You can add multiple event types. Later, you will make a small change to the Logic App flow to store each event type in a separate Log Analytics Log and propagate the Event Type name to the Log Analytics Log name dynamically.

    ![Azure Media Services Event Type](media/tutorial-events-log-analytics/06.png)

1. Now that you are subscribed to the event(s), create an action. Since you want to push the events to the Azure Log Analytics service, search for "Azure Log Analytics" and select the "Azure Log Analytics Data Collector".

    ![Azure Log Analytics Data Collector](media/tutorial-events-log-analytics/07.png)

1. To connect to the Log Analytics Workspace, you need the Workspace ID and an Agent Key. In the Azure portal, navigate to your Log Analytics Workspace you created before the start of this tutorial. (To keep the Logic App designer open, you can do this in a separate browser tab.) In the Azure portal, in the Log Analytics workspace you can find the Workspace ID at the top.

    ![Azure Log Analytics Workspace ID](media/tutorial-events-log-analytics/08.png)

1. On the left menu, locate "Agents Management" and select it. This will show you the agent keys that have been generated.

    ![Azure Log Analytics Agents management](media/tutorial-events-log-analytics/09.png)

1. Copy one of the keys over to your Logic App.

    ![Log Analytics Agent Key](media/tutorial-events-log-analytics/10.png)

1. Select "Create".

    ![Create Azure Logic App Connector](media/tutorial-events-log-analytics/11.png)

1. Select "Add Dynamic content" and then select "Topic".
1. Do the same for "Custom Log Name".

    ![Add Event Topic](media/tutorial-events-log-analytics/11b.png)

1. Go into the "Code View" of the Logic App. Look for the Inputs and Log-Type lines.

    ![Change json of the Logic App](media/tutorial-events-log-analytics/12.png)

1. Replace `"@triggerBody()?['topic']"` with `"@{triggerBody()}"`. This is for parsing the entire message to Log Analytics.

1. Change the "Log-Type" from `"@triggerBody()?['topic']"` to `"@replace(triggerBody()?['eventType'],'.','')"`. (This will replace "." as these are not allowed in Log Analytics Log Names.)

    ![Logic App json after change](media/tutorial-events-log-analytics/25.png)

1. Select "Save As" at the top.

    ![Save Logic App](media/tutorial-events-log-analytics/13.png)

1. Give the Logic App a name and add it to a resource group.

    ![Create new Logic App](media/tutorial-events-log-analytics/14.png)

1. To verify, go the Logic App and then select "Logic app designer".

    ![Verify config in Logic App Designer](media/tutorial-events-log-analytics/15.png)

    ![Verify Body and Function steps](media/tutorial-events-log-analytics/16.png)

1. When you examine all the resources in the resource group, there will be a Logic App and two Logic App API connectors listed, one for the Events and one for Log Analytics. There is also an [Event Grid System Topic](https://docs.microsoft.com/azure/event-grid/system-topics).

    ![See all new resources in Resource Group](media/tutorial-events-log-analytics/26.png).

    ![Create an Azure Media Services Live Event](media/tutorial-events-log-analytics/17.png)

## Test

To test how it actually works, create a Live Event in Azure Media Services. Create an RTMP Live Event and use ffmpeg to push a "live" stream based on a .mp4 sample file. After the event is created, get the RTMP ingest URL. Copy this url over to the ffmpeg command line below and add a unique name at the end, for example, "mystream". Adjust the command line to reflect your test source file and any other system variables.

```AzureCLI
ffmpeg -i bbb_sunflower_720p_25fps_encoded.mp4 -map 0 -c:v libx264 -c:a copy -f flv rtmp://amsevent-amseventdemo-euwe.channel.media.azure.net:1935/live/4b968cd6ac3e4ad68b539c2a38c6f8f3/mystream
```

After a couple seconds, the "Producer view" player should start streaming. (Refresh the player if the video doesn't show up automatically.)

![Verify proper video ingest in Producer Preview Player](media/tutorial-events-log-analytics/18.png)

With the live stream, Azure Media Services is emitting various events that are triggering the Logic App flow. To verify, navigate to the Logic App and determine if there are any triggers being fired by the events from Media Services.

![Verify successful job execution in Logic App](media/tutorial-events-log-analytics/19.png)

In the Logic App Overview page, you should see "Run History" listing jobs that have completed successfully.

![See Job Details during Runtime](media/tutorial-events-log-analytics/20.png)

When you select a successful job, the details of the job during runtime are shown. In this case, the `MicrosoftMediaLiveEventEncoderConnected` event shows that it was captured as well as the parsed body. This is what is pushed to the Azure Log Analytics Workspace. Go the Log Analytics Workspace to verify. Navigate to Log Analytics Workspace you created earlier.

![See Events in Log Analytics](media/tutorial-events-log-analytics/21.png)

In Log Analytics, select "Logs". This will open the Log Query. There will be a "Custom Logs" with the event name `MicrosoftMediaLiveEventEncoderConnected`.

> [!NOTE]
> You may need to refresh the page. The first time it can take a couple minutes to create the custom log and the data to populate.

You can expand it to view all the fields for this event. When you select the "eye" icon, it will show a preview of the query result.

![Preview Query](media/tutorial-events-log-analytics/22.png)

You can select "See in query editor" to view the raw data of all fields.

![Run Query in Query editor](media/tutorial-events-log-analytics/23.png)

This is the output from the query showing all the data of the event `MicrosoftMediaLiveEventEncoderConnected`.

![See detailed Event output in Log Analytics](media/tutorial-events-log-analytics/24.png)

## Next steps:

You can create different queries and save them. These can be added to [Azure Dashboard](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-logs-dashboards).
