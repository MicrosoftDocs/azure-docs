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
- Create and host an Azure Dev Tunnel. Instructions [here](/azure/developer/dev-tunnels/get-started).
- - Create and connect [a Multi-service Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 
- [Node.js](https://nodejs.org/en/) LTS installation.
- [Visual Studio Code](https://code.visualstudio.com/download) installed.

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
COGNITIVE_SERVICES_ENDPOINT="<COGNITIVE_SERVICEs_ENDPOINT>" 
```


## Make an outbound call and play media

To make the outbound call from ACS, you use the phone number you provided to the environment. Ensure that the phone number is in the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

The code makes an outbound call using the target_phone_number you've provided and place an outbound call to that number: 

```typescript
const callInvite: CallInvite = {
	targetParticipant: callee,
	sourceCallIdNumber: {
		phoneNumber: process.env.ACS_RESOURCE_PHONE_NUMBER || "",
	},
};

const options: CreateCallOptions = {
	cognitiveServicesEndpoint: process.env.COGNITIVE_SERVICES_ENDPOINT
};

console.log("Placing outbound call...");
acsClient.createCall(callInvite, process.env.CALLBACK_URI + "/api/callbacks", options);
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

Earlier in our application, we registered the `CALLBACK_URI` to the Call Automation Service. The URI indicates the endpoint the service uses to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. We respond to the `CallConnected` event to get notified and initiate downstream operations. Using the `TextSource`, you can provide the service with the text you want synthesized and used for your welcome message. The Azure Communication Services Call Automation service plays this message upon the `CallConnected` event. 

Next, we pass the text into the `CallMediaRecognizeChoiceOptions` and then call `StartRecognizingAsync`. This allows your application to recognize the option the caller chooses.

```typescript
callConnectionId = eventData.callConnectionId;
serverCallId = eventData.serverCallId;
console.log("Call back event received, callConnectionId=%s, serverCallId=%s, eventType=%s", callConnectionId, serverCallId, event.type);
callConnection = acsClient.getCallConnection(callConnectionId);
const callMedia = callConnection.getCallMedia();

if (event.type === "Microsoft.Communication.CallConnected") {
 	console.log("Received CallConnected event");
 	await startRecording();
	await startRecognizing(callMedia, mainMenu, "");
}

async function startRecognizing(callMedia: CallMedia, textToPlay: string, context: string) {
	const playSource: TextSource = {
 		text: textToPlay,
 		voiceName: "en-US-NancyNeural",
 		kind: "textSource"
 	};

 	const recognizeOptions: CallMediaRecognizeChoiceOptions = {
 		choices: await getChoices(),
 		interruptPrompt: false,
 		initialSilenceTimeoutInSeconds: 10,
 		playPrompt: playSource,
 		operationContext: context,
 		kind: "callMediaRecognizeChoiceOptions"
 	};

 	await callMedia.startRecognizing(callee, recognizeOptions)
 }
```

## Handle Choice Events

Azure Communication Services Call Automation triggers the `api/callbacks` to the webhook we have setup and will notify us with the `RecognizeCompleted` event. The event gives us the ability to respond to input recieved and trigger an action. The application then plays a message to the caller based on the specific input received.

```typescript
else if (event.type === "Microsoft.Communication.RecognizeCompleted") { 
	if(eventData.recognitionType === "choices"){ 
        	console.log("Recognition completed, event=%s, resultInformation=%s",eventData, eventData.resultInformation); 
        	var context = eventData.operationContext; 
            	const labelDetected = eventData.choiceResult.label;  
            	const phraseDetected = eventData.choiceResult.recognizedPhrase; 
            	console.log("Recognition completed, labelDetected=%s, phraseDetected=%s, context=%s", labelDetected, phraseDetected, eventData.operationContext); 
            	const textToPlay = labelDetected === confirmLabel ? confirmText : cancelText;            
            	await handlePlay(callMedia, textToPlay); 
        } 
}  
 
async function handlePlay(callConnectionMedia:CallMedia, textContent:string){ 
	const play : TextSource = { text:textContent , voiceName: "en-US-NancyNeural", kind: "textSource"} 
	await callConnectionMedia.playToAll([play]); 
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


