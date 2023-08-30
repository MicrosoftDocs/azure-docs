---
title: Record a call when it starts
titleSuffix: An Azure Communication Services how-to document
description: In this how-to document, you can learn how to record a call through Azure Communication Services once it starts.
author: tophpalmer
manager: shahen
services: azure-communication-services
ms.author: chpalm
ms.topic: how-to
ms.service: azure-communication-services
ms.date: 03/01/2023
---

# Record a call when it starts

Call recording is often used directly through the UI of a calling application, where the user triggers the recording. For applications within industries like banking or healthcare, call recording is required from the get-go. The service needs to automatically record for compliance purposes. This sample shows how to record a call when it starts. It uses Azure Communication Services and Azure Event Grid to trigger an Azure Function when a call starts. It automatically records every call within your Azure Communication Services resource.

In this QuickStart, we focus on showcasing the processing of call started events through Azure Functions using Event Grid triggers. We use the Call Automation SDK for Azure Communication Services to start recording.

The Call Started event when a call start is formatted in the following way:

```json

[
  {
    "id": "a8bcd8a3-12d7-46ba-8cde-f6d0bda8feeb",
    "topic": "/subscriptions/{subscription-id}/resourcegroups/{group-name}/providers/microsoft.communication/communicationservices/{communication-services-resource-name}",
    "subject": "call/{serverCallId}/startedBy/8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
    "data": {
      "startedBy": {
        "communicationIdentifier": {
          "rawId": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1",
          "communicationUser": {
            "id": "8:acs:bc360ba8-d29b-4ef2-b698-769ebef85521_0000000c-1fb9-4878-07fd-0848220077e1"
          }
        },
        "role": "{role}"
      },
      "serverCallId": "{serverCallId}",
      "group": {
        "id": "00000000-0000-0000-0000-000000000000"
      },
      "room": {
        "id": "{roomId}"
      },
      "isTwoParty": false,
      "correlationId": "{correlationId}",
      "isRoomsCall": true
    },
    "eventType": "Microsoft.Communication.CallStarted",
    "dataVersion": "1.0",
    "metadataVersion": "1",
    "eventTime": "2021-09-22T17:02:38.6905856Z"
  }
]

```

> [!NOTE] 
> Using Azure Event Grid incurs additional costs. For more information, see [Azure Event Grid pricing](https://azure.microsoft.com/pricing/details/event-grid/).

## Pre-requisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- An active Communication Services resource and connection string. [Create a Communication Services resource](../../quickstarts/create-communication-resource.md).
- Install [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli).

## Setting up our local environment

1. Using [Visual Studio Code](https://code.visualstudio.com/), install the [Azure Functions Extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions).
2. With the extension, create an Azure Function following these [instructions](../../../azure-functions/create-first-function-vs-code-csharp.md).

   Configure the function with the following instructions:
   - Language: C#
   - Template: Azure Event Grid Trigger
   - Function Name: User defined

    Once created, you see a function created in your directory like this:

    ```csharp
    
    using System;
    using Microsoft.Azure.WebJobs;
    using Microsoft.Azure.WebJobs.Extensions.EventGrid;
    using Microsoft.Extensions.Logging;
    using Azure.Messaging.EventGrid;
    using System.Threading.Tasks;
    
    namespace Company.Function
    {
        public static class acs_recording_test
        {
            [FunctionName("acs_recording_test")]
            public static async Task RunAsync([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
            {
                log.LogInformation(eventGridEvent.EventType);
            }
    
        }
    }

    ```

## Configure Azure Function to receive `CallStarted` event

1. Configure Azure Function to perform actions when the `CallStarted` event triggers.

```csharp

    public static async Task RunAsync([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
    {
        if(eventGridEvent.EventType == "Microsoft.Communication.CallStarted")
        {
            log.LogInformation("Call started");
            var callEvent = eventGridEvent.Data.ToObjectFromJson<CallStartedEvent>();
            
            // CallStartedEvent class is defined in documentation, but the objects looks like this:
            // public class CallStartedEvent
            // {
            //     public StartedBy startedBy { get; set; }
            //     public string serverCallId { get; set; }
            //     public Group group { get; set; }
            //     public bool isTwoParty { get; set; }
            //     public string correlationId { get; set; }
            //     public bool isRoomsCall { get; set; }
            // }
            // public class Group
            // {
            //     public string id { get; set; }
            // }
            // public class StartedBy
            // {
            //     public CommunicationIdentifier communicationIdentifier { get; set; }
            //     public string role { get; set; }
            // }
            // public class CommunicationIdentifier
            // {
            //     public string rawId { get; set; }
            //     public CommunicationUser communicationUser { get; set; }
            // }
            // public class CommunicationUser
            // {
            //     public string id { get; set; }
            // }
        }
    }

```

## Start recording

1. Create a method to handle the `CallStarted` events. This method trigger recording to start when the call started.

```csharp

    public static async Task RunAsync([EventGridTrigger]EventGridEvent eventGridEvent, ILogger log)
    {
        if(eventGridEvent.EventType == "Microsoft.Communication.CallStarted")
        {
            log.LogInformation("Call started");
            var callEvent = eventGridEvent.Data.ToObjectFromJson<CallStartedEvent>();
            await startRecordingAsync(callEvent.serverCallId);
        }
    }

    public static async Task startRecordingAsync (String serverCallId)
    {
        CallAutomationClient callAutomationClient = new CallAutomationClient(Environment.GetEnvironmentVariable("ACS_CONNECTION_STRING"));
        StartRecordingOptions recordingOptions = new StartRecordingOptions(new ServerCallLocator(serverCallId));
        recordingOptions.RecordingChannel = RecordingChannel.Mixed;
        recordingOptions.RecordingContent = RecordingContent.AudioVideo;
        recordingOptions.RecordingFormat = RecordingFormat.Mp4;        
        var startRecordingResponse = await callAutomationClient.GetCallRecording()
            .StartRecordingAsync(recordingOptions).ConfigureAwait(false);
    }

```

### Running locally

To run the function locally, you can press `F5` in Visual Studio Code. We use [ngrok](https://ngrok.com/) to hook our locally running Azure Function with Azure Event Grid.

1. Once the function is running, we configure ngrok. (You need to [download ngrok](https://ngrok.com/download) for your environment.)

   ```bash

    ngrok http 7071

    ```

    Copy the ngrok link provided where your function is running.

2. Configure C`allStarted` events through Event Grid within your Azure Communication Services resource. We do this using the [Azure CLI](/cli/azure/install-azure-cli-windows?tabs=azure-cli). You need the resource ID for your Azure Communication Services resource found in the Azure portal. (The resource ID looks something like:  `/subscriptions/<<AZURE SUBSCRIPTION ID>>/resourceGroups/<<RESOURCE GROUP NAME>>/providers/Microsoft.Communication/CommunicationServices/<<RESOURCE NAME>>`)

    ```bash

    az eventgrid event-subscription create --name "<<EVENT_SUBSCRIPTION_NAME>>" --endpoint-type webhook --endpoint "<<NGROK URL>>/runtime/webhooks/EventGrid?functionName=<<FUNCTION NAME>> " --source-resource-id "<<RESOURCE_ID>>"  --included-event-types Microsoft.Communication.CallStarted

    ```

3. Now that everything is hooked up, test the flow by starting a call on your resource. You should see the console logs on your terminal where the function is running. You can check that the recording is starting by using the [call recording feature](../calling-sdk/record-calls.md?pivots=platform-web) on the calling SDK and check for the boolean to turn TRUE.

### Deploy to Azure

To deploy the Azure Function to Azure, you need to follow these [instructions](../../../azure-functions/create-first-function-vs-code-csharp.md#deploy-the-project-to-azure). Once deployed, we configure Event Grid for the Azure Communication Services resource. With the URL for the Azure Function that was deployed (URL found in the Azure portal under the function), we run a similar command:

```bash

az eventgrid event-subscription update --name "<<EVENT_SUBSCRIPTION_NAME>>" --endpoint-type azurefunction --endpoint "<<AZ FUNCTION URL>> " --source-resource-id "<<RESOURCE_ID>>"

```

Since we're updating the event subscription we created, make sure to use the same event subscription name you used in the previous step.

You can test by starting a call in your resource, similar to the previous step.
