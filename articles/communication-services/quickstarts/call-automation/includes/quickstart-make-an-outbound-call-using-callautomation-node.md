---
title: Quickstart - Outbound calling using Call Automation
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to make an outbound PSTN call using Azure Communication Services using Call Automation
author: anujb-msft
ms.author: anujb-msft
ms.date: 06/19/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: call-automation
ms.custom: mode-other
---

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [phone number](../../telephony/get-phone-number.md) in your Azure Communication Services resource that can make outbound calls. If you have a free subscription, you can [get a trial phone number](../../telephony/get-trial-phone-number.md).
- Create and host an Azure Dev Tunnel. Instructions [here](/azure/developer/dev-tunnels/get-started)
- [Node.js](https://nodejs.org/en/) LTS installation.
- [Visual Studio Code](https://code.visualstudio.com/download) installed

## Sample code
Download or clone quickstart sample code from [GitHub](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/CallAutomation_OutboundCalling).

Navigate to `CallAutomation_OutboundCalling` folder and open the solution in a code editor.

## Set up the environment

Download the sample code and navigate to the project directory and run the `npm` command that installs the necessary dependencies and set up your developer environment.

```bash
npm install
```

## Set up and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the DevTunnel CLI commands to connect your local development environment to the public internet. We use this endpoint to notify your application of calling events from the Azure Communication Services Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

## Update your application configuration

Then update your `.env` file with following values:

- `CONNECTION_STRING`: The connection string for your Azure Communication Services resource. You can find your Azure Communication Services connection string using the instructions [here](../../create-communication-resource.md). 
- `CALLBACK_URI`: Once you have your DevTunnel host initialized, update this field with that URI.
- `TARGET_PHONE_NUMBER`: update field with the phone number you would like your application to call. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `ACS_RESOURCE_PHONE_NUMBER`: update this field with the Azure Communication Services phone number you have acquired. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)


```dosini
CONNECTION_STRING="<YOUR_CONNECTION_STRING>"
ACS_RESOURCE_PHONE_NUMBER ="<YOUR_ACS_NUMBER>"
TARGET_PHONE_NUMBER="<+1XXXXXXXXXX>"
CALLBACK_URI="<VS_TUNNEL_URL>"
```


## Make an outbound call and play media

To make the outbound call from Azure Communication Services, you use the phone number you provided to the environment. Ensure that the phone number is in the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

The code makes an outbound call using the target_phone_number you've provided and place an outbound call to that number: 

```typescript
const callInvite: CallInvite = {
    targetParticipant: callee,
    sourceCallIdNumber: {
      phoneNumber: process.env.ACS_RESOURCE_PHONE_NUMBER || "",
    },
  };

  console.log("Placing outbound call...");
  acsClient.createCall(callInvite, process.env.CALLBACK_URI + "/api/callbacks");
```

## Start recording a call

The Call Automation service also enables the capability to start recording and store recordings of voice and video calls. You can learn more about the various capabilities in the Call Recording APIs [here](../../voice-video-calling/get-started-call-recording.md).

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

Earlier in our application, we registered the `CALLBACK_URI` to the Call Automation Service. The URI indicates the endpoint the service uses to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. We respond to the `CallConnected` event to get notified and initiate downstream operations.


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

Using the `FileSource` API, you can provide the service the audio file you want to use for your welcome message. The Azure Communication Services Call Automation service plays this message upon the `CallConnected` event. 

In this code snippet, we pass the audio file into the `CallMediaRecognizeDtmfOptions` and then call `startRecognizing`. The API enables the telephony client to send DTMF tones that we can recognize.

```typescript
const audioPrompt: FileSource = {
    url: process.env.MEDIA_CALLBACK_URI + "MainMenu.wav",
    kind: "fileSource",
};

const recognizeOptions: CallMediaRecognizeDtmfOptions = {
    playPrompt: audioPrompt,
    kind: "callMediaRecognizeDtmfOptions",
};

await callConnection.getCallMedia().startRecognizing(callee, 1, recognizeOptions);
```


## Recognize DTMF Events

When the telephony endpoint selects a DTMF tone, Azure Communication Services Call Automation triggers the webhook we have set up and notify us with the `Microsoft.Communication.RecognizeCompleted` event. This event gives us the ability to respond to a specific DTMF tone and trigger an action. 

```typescript
else if (event.type === "Microsoft.Communication.RecognizeCompleted") {
  const tone = event.data.dtmfResult.tones[0];
  console.log("Received RecognizeCompleted event, with following tone: " + tone);

  if (tone === "one")
    await playAudio("Confirmed.wav");
  else if (tone === "two")
    await playAudio("Goodbye.wav");
  else
    await playAudio("Invalid.wav");
} 
```

## Hang up the call

Finally, when we detect a condition that makes sense for us to terminate the call, we can use the `hangUp()` method to hang up the call.

```typescript
  await acsClient.getCallRecording().stop(recordingId);
  callConnection.hangUp(true);
```

## Run the code

To run the application, open a Terminal window and run the following command:

```bash
  npm run dev
```


