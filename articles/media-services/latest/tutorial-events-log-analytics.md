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
ms.date: 08/11/2020
ms.author: inhenkel

---

# Tutorial: Store Azure Media Services Events in Azure Log Analytics

In this tutorial, you will learn how to store Azure Media Services events in Azure Log Analytics.
> [!div class="checklist"]
> * create a no code Logic App Flow
> * Subscribe to Azure Media Services Event Topics
> * Parse Events and store to Azure Log Analytics
> * Query Events from Azure Log Analytics

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Prerequisites

> * An Azure subscription
> * An Azure Media Services account.
> * A [Log Analytics](https://docs.microsoft.com/azure/azure-monitor/learn/quick-create-workspace) workspace

> [!NOTE]
> The screenshots in this tutorial were captured in the Azure portal dark mode.

## Azure Media Services Events

Azure Media Services v3 emits events on [Azure Event Grid](media-services-event-schemas.md). You can subscribe to these events in many ways and store the events in various data stores. In this tutorial, we will subscribe to these events using a [Log App Flow](https://azure.microsoft.com/services/logic-apps/). The Logic App will be triggered for each event and store the body of the event in Azure Log Analytics. Once the events are in Azure Log Analytics, we can use other Azure services to create a dashboard, monitor, and alert on these events.

## Set up

1. In the Azure portal, navigate to your Azure Media Services account and click "Events" on the left-hand side in the navigation pane. This will show all the various ways to subscribe to the Azure Media Services events.
    ![Azure Media Services Portal](media/tutorial-events-log-analytics/01a.png)

1. Click on the "Logic Apps" icon to create a Logic App.

    ![Create Logic App](media/tutorial-events-log-analytics/02.png)

1. This will open the Logic App Designer where we can create the flow to capture the events and push them to Log Analytics. First step here is to click  the + sign-on the right. This will allow us to authenticate and subscribe to the Event Grid.

    ![Connect to Azure Event Grid](media/tutorial-events-log-analytics/03.png)

1. Once the authentication is complete, you should see the user email and a green checkmark. Click "Continue" to subscribe to the Media Services Events.

    ![Connected to Azure Event Grid](media/tutorial-events-log-analytics/04.png)

1. In the "Resource Type" list locate "Microsoft.Media.MediaServices". 

    ![Azure Media Services Resource Events](media/tutorial-events-log-analytics/05.png)

1. In the "Event Type Item", there will be a list of all the events Azure Media Services emits. You can select the events you would like to track. You can add multiple event types. **Later we will make a small change to the Logic App flow to store each event type in a separate Log Analytics Log and propagate the Event Type name to the Log Analytics Log name dynamically.**

    ![Azure Media Services Event Type](media/tutorial-events-log-analytics/06.png)

1. Now we are subscribed to the Event(s) we need to create an action. Since we want to push the events to the Azure Log Analytics service search for "Azure Log Analytics" and select the "Azure Log Analytics Data Collector".

    ![Azure Log Analytics Data Collector](media/tutorial-events-log-analytics/07.png)

1. To connect to the Log Analytics Workspace, you need the Workspace ID and an Agent Key. In the Azure portal navigate to your Log Analytics Workspace you created before the start of this tutorial. **To keep the Logic App designer open, you can do this in a separate browser tab.** In the Azure portal, in the Log Analytics workspace you can find the Workspace ID at the top.

    ![Azure Log Analytics Workspace ID](media/tutorial-events-log-analytics/08.png)

1. On the left menu, locate "Agents Management" and click on it. This will show you the agent keys that have been generated.

    ![Azure Log Analytics Agents management](media/tutorial-events-log-analytics/09.png)

1. Copy one of the keys over to your Logic App.

    ![Log Analytics Agent Key](media/tutorial-events-log-analytics/10.png)

1. Now click on "Create".

    ![Create Azure Logic App Connector](media/tutorial-events-log-analytics/11.png)

1. Click "Add Dynamic content" and select "Topic". Do the same for "Custom Log Name".

    ![Add Event Topic](media/tutorial-events-log-analytics/11b.png)

1. Go into the "Code View" of the Logic App. We need to change two lines.

    ![Change json of the Logic App](media/tutorial-events-log-analytics/12.png)

1. Locate the "Inputs" section and replace `"@triggerBody()?['topic']"` with `"@{triggerBody()}"`. This is for parsing the entire message to Log Analytics. 
1. Change the "Log-Type" from `"@triggerBody()?['topic']"` to `"@replace(triggerBody()?['eventType'],'.','')"`. This will replace "." as these are not allowed in Log Analytics Log Names.

    ![Logic App json after change](media/tutorial-events-log-analytics/25.png)

1. Click "Save As" at the top.

    ![Save Logic App](media/tutorial-events-log-analytics/13.png)

1. Give the Logic App a name and add it to a resource group.

    ![Create new Logic App](media/tutorial-events-log-analytics/14.png)

1. Let's verify once more, go the Logic App and click on "Logic app designer"

    ![Verify config in Logic App Designer](media/tutorial-events-log-analytics/15.png)

    ![Verify Body and Function steps](media/tutorial-events-log-analytics/16.png)

1. When we have a look at all the resources in the resource group we can see a Logic App and two Logic App API connectors, one for the Events and one for Log Analytics. There is also an [Event Grid System Topic](https://docs.microsoft.com/azure/event-grid/system-topics).

    ![See all new resources in Resource Group](media/tutorial-events-log-analytics/26.png).

    ![Create an Azure Media Services Live Event](media/tutorial-events-log-analytics/17.png)

## Test

Now we would like see it actually work. To test, let's create a Live Event in Azure Media Services. For this test, we create an RTMP Live Event and we are going to use ffmpeg to push a "live" stream based on a mp4 sample file. After the event is created, you get the RTMP ingest URL. Copy this url over to the ffmpeg commandline below and add a unique name at the end like "mystream" for instance. Adjust the commandline to reflect your test source file and any other system variables.

```AzureCLI
ffmpeg -i bbb_sunflower_720p_25fps_encoded.mp4 -map 0 -c:v libx264 -c:a copy -f flv rtmp://amsevent-amseventdemo-euwe.channel.media.azure.net:1935/live/4b968cd6ac3e4ad68b539c2a38c6f8f3/mystream
```

After a couple seconds, you should see the stream in the "Producer view" player. **Refresh the player if needed.**

![Verify proper video ingest in Producer Preview Player](media/tutorial-events-log-analytics/18.png)

By now we have a livestream so Azure Media Services is emitting various events that are triggering the Logic App flow. To verify, navigate to the Logic App and see if you can see any triggers being fired by the events from Media Services.

![Verify successful job execution in Logic App](media/tutorial-events-log-analytics/19.png)

In the Logic App Overview page, we should see "Run History" at the bottom of the page with jobs that have completed successfully.

![See Job Details during Runtime](media/tutorial-events-log-analytics/20.png)

When you click on a successful job, you can see the details of the job during runtime. In this case, you can see that the "MicrosoftMediaLiveEventEncoderConnected" event was captured and we can see the parsed body. This is what is pushed to the Azure Log Analytics Workspace. Let’s go the Log Analytics Workspace to verify. Navigate to Log Analytics Workspace you created earlier.

![See Events in Log Analytics](media/tutorial-events-log-analytics/21.png)

In the Log Analytics clicks on "Logs" in the left menu. This should open the Log Query. There should be a "Custom Logs" with the event name "MicrosoftMediaLiveEventEncoderConnected". 

> [!NOTE]
> You may need to refresh the page. The first time it can take a couple minutes to create the custom log and the data to populate.

You can expand to see all the fields for this event. When you click on the "eye" icon, you can see a preview of the query result.

![Preview Query](media/tutorial-events-log-analytics/22.png)

You can click "See in query editor" to see the raw data of all fields.

![Run Query in Query editor](media/tutorial-events-log-analytics/23.png)

This is the output from the query where we see all the data of the event "MicrosoftMediaLiveEventEncoderConnected".

![See detailed Event output in Log Analytics](media/tutorial-events-log-analytics/24.png)

## Next steps:

You can create different queries and save them. These can be added to [Azure Dashboard](https://docs.microsoft.com/azure/azure-monitor/learn/tutorial-logs-dashboards).
