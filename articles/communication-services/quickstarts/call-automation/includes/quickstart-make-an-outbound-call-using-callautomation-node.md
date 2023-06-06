---
title: Quickstart - Outbound calling using Call Automation
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to make an outbound PSTN call using Azure Communication Services using Call Automation
author: anujb-msft
ms.author: anujb-msft
ms.date: 05/26/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: callautomation
ms.custom: mode-other
---

Azure Communication Services (ACS) Call Automation APIs are a powerful way to create interactive calling experiences. In this quick start we'll cover a way to make an outbound call and recognize various events in the call.

## Sample Code

Find the complete sample code for this quick start on [GitHub]("TODO_URL_GOES_HERE")

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [phone number](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number) in your Azure Communication Services resource that can make outbound calls
- Create and host a Azure Dev Tunnel. Instructions [here](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started?tabs=macos)
- [Node.js](https://nodejs.org/en/) LTS installation.

## Setup the environment

```bash
npm install
```

## Setup and host your Azure DevTunnel

[Azure DevTunnels](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the command below to connect your local development environment to the public internet. We will then use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

## Update your application configuration

Then update your `.env` file with following values:

- `CONNECTION_STRING`: The connection string for your ACS resource. You can find your ACS connection string using the instructions [here](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=linux&pivots=platform-azp#access-your-connection-strings-and-service-endpoints). 
- `CALLBACK_URI`: Once you have your DevTunnel host initialized, update this field with that URI.
- `TARGET_PHONE_NUMBER`: update field with the phone number you would like your application to call. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `ACS_RESOURCE_PHONE_NUMBER`: update this field with with the ACS phone number you have acquired. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)


```dosini
CONNECTION_STRING="<YOUR_CONNECTION_STRING>"
ACS_RESOURCE_PHONE_NUMBER ="<YOUR_ACS_NUMBER>"
TARGET_PHONE_NUMBER="<+1XXXXXXXXXX>"
CALLBACK_URI="<VS_TUNNEL_URL>"
```


## Make an outbound call and play media

To make the outbound call from ACS, you will leverage the phone number you provided to the environment. Ensure that the phone number is in the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

The code below will create make an outbound call using the target_phone_number you've provided and place an outbound call to that number: 

```typescript
const callInvite: CallInvite = {
    targetParticipant: callee,
    sourceCallIdNumber: {
      phoneNumber: process.env.ACS_RESOURCE_PHONE_NUMBER || "",
    },
  };

  console.log("Placing outbound call...");
  acsClient.createCall(callInvite, process.env.CALLBACK_URI + "ongoingcall");
```

## Start Recording a Call

The Call Automation service also enables the capability to start recording and store recordings of voice and video calls. You can learn more about the various capabilities in the Call Recording APIs [here](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-call-recording).

```typescript
const callLocator: CallLocator = {
    id: serverCallId,
    kind: "serverCallLocator",
};

const recordingOptions: StartRecordingOptions = {
    callLocator: callLocator,
};

const response = await acsClient.getCallRecording().start(recordingOptions);

recordingId = response.recordingId;
```


## Respond to calling events

Earlier in our application, we registerd the `CALLBACK_URI` to the Call Automation Service. This indicates the endpoint the service will use to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. In the code be below we respond to the `CallConnected` event.


```typescript
if (event.type === "Microsoft.Communication.CallConnected") {
		console.log("Received CallConnected event");

		callConnectionId = eventData.callConnectionId;
		serverCallId = eventData.serverCallId;
		callConnection = acsClient.getCallConnection(callConnectionId);

		await startRecording();
		await startToneRecognition();
	} 
```

## Play welcome message and recognize 

Using the `FileSource` API, you can provide the service the audio file you want to use for your welcome message. The ACS Call Automation service will play this message upon the `CallConnected` event. 

In the code below, we pass the audio file into the `CallMediaRecognizeDtmfOptions` and then call `startRecognizing`. This recognize and options API enables the telephony client to send DTMF tones that we can recognize.

```typescript
const audioPrompt: FileSource = {
  url: MEDIA_URI + "MainMenu.wav",
  kind: "fileSource",
};

const recognizeOptions: CallMediaRecognizeDtmfOptions = {
  playPrompt: audioPrompt,
  kind: "callMediaRecognizeDtmfOptions",
};

await callConnection.getCallMedia().startRecognizing(callee, 1, recognizeOptions);
```

## Recognize DTMF Events

When the telephony endpoint selects a DTMF tone, ACS Call Automation will trigger the webhook we have setup and notify us with the `Microsoft.Communication.RecognizeCompleted` event. This gives us the ability to respond to a specific DTMF tone and trigger an action. 

```typescript
 if (event.type === "Microsoft.Communication.RecognizeCompleted") {
    const tone = event.data.dtmfResult.tones[0];
    console.log("Received RecognizeCompleted event, with following tone: " + tone);

    if (tone === "one") {
      await playAudio("Confirmed.wav");
      terminateCall = true;
    } else {
      await playAudio("Goodbye.wav");
    }
 }
```

## Hang up the call

Finally, when we detect a condition that makes sense for us to terminate the call, we can use the `hangUp()` method to hang up the call.

```typescript
  await acsClient.getCallRecording().stop(recordingId);
  callConnection.hangUp(true);
```

## Run the code

# [Visual Studio Code](#tab/visual-studio-code)

To run the application with VS Code, open a Terminal window and run the following command

```bash
node app.ts
```

# [Visual Studio](#tab/visual-studio)

Press Ctrl+F5 to run without the debugger.


