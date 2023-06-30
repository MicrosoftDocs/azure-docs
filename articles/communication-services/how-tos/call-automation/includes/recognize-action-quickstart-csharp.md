---
title: include file
description: C# recognize action quickstart
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 09/16/2022
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- The latest [.NET library](https://dotnet.microsoft.com/download/dotnet-core) for your operating system.
- Obtain the latest [NuGet package](https://www.nuget.org/packages/Azure.Communication.CallAutomation/).

## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type|Default (if not specified) | Description | Required or Optional |
| ------- |--| ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this how-to guide](../play-action.md))* | FileSource | Not set |This will be the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that ACS will wait for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSilenceTimeout | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds | How long recognize action will wait for input before considering it a timeout. | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| StopTones |IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it will interrupt the current call media operation. For example if any audio is being played it will interrupt that operation and initiate recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |

## Create a new C# application

In the console window of your operating system, use the `dotnet` command to create a new web application.

```console
dotnet new web -n MyApplication
```

## Install the NuGet package

The NuGet package can be obtained from [here](https://www.nuget.org/packages/Azure.Communication.CallAutomation/), if you have not already done so. 

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

``` csharp
var targetParticipant = new PhoneNumberIdentifier("+1XXXXXXXXXXX");
                var recognizeOptions = new CallMediaRecognizeDtmfOptions(targetParticipant, maxTonesToCollect)
                {
                    InterruptCallMediaOperation = true,
                    InitialSilenceTimeout = TimeSpan.FromSeconds(30),
                    Prompt = new FileSource(new System.Uri("file://path/to/file")),
                    InterToneTimeout = TimeSpan.FromSeconds(5),
                    InterruptPrompt = true,
                    StopTones = new DtmfTone[] { DtmfTone.Pound },
                };
                await _callConnection.GetCallMedia().StartRecognizingAsync(recognizeOptions).ConfigureAwait(false);

```

**Note:** If parameters aren't set, the defaults will be applied where possible.

## Receiving recognize event updates

Developers can subscribe to the *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the previously mentioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:
``` csharp
app.MapPost("<WEB_HOOK_ENDPOINT>", async (
    [FromBody] CloudEvent[] cloudEvents,
    [FromRoute] string contextId) =>{
    foreach (var cloudEvent in cloudEvents)
    {
        CallAutomationEventBase @event = CallAutomationEventParser.Parse(cloudEvent);
        If (@event is RecognizeCompleted recognizeCompleted)
        {
            // Access to the Collected Tones
            foreach(DtmfTone tone in recognizeCompleted.CollectTonesResult.Tones) {
                   // work on each of the Dtmf tones.
        }
    }
```

### Example of how you can deserialize the *RecognizeFailed* event:

``` csharp
app.MapPost("<WEB_HOOK_ENDPOINT>", async (
    [FromBody] CloudEvent[] cloudEvents,
    [FromRoute] string contextId) =>{
    foreach (var cloudEvent in cloudEvents)
    {
        CallAutomationEventBase @event = CallAutomationEventParser.Parse(cloudEvent);
        If (@event is RecognizeFailed recognizeFailed)
        {
            Log.error($”Recognize failed due to: {recognizeFailed.ResultInformation.Message}”);

        }
    }
```

### Example of how you can deserialize the *RecognizeCanceled* event:
``` csharp
if (@event is RecognizeCanceled { OperationContext: "AppointmentReminderMenu" })
        {
            logger.LogInformation($"RecognizeCanceled event received for call connection id: {@event.CallConnectionId}");
            //Take action on recognize canceled operation
           await callConnection.HangUpAsync(forEveryone: true);
        }
```
