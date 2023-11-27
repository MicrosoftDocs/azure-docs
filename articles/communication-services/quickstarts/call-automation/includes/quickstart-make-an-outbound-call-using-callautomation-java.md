---
title: Quickstart - Make an outbound call using Call Automation
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to make an outbound PSTN call using Azure Communication Services Call Automation
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
- [Java Development Kit (JDK) version 11 or above](/azure/developer/java/fundamentals/java-jdk-install)
- [Apache Maven](https://maven.apache.org/download.cgi)

## Sample code
Download or clone quickstart sample code from [GitHub](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/CallAutomation_OutboundCalling). 

Navigate to `CallAutomation_OutboundCalling` folder and open the solution in a code editor.

## Setup and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Run the DevTunnel commands to connect your local development environment to the public internet. DevTunnels then creates a tunnel with a persistent endpoint URL and which allows anonymous access. Azure Communication Services uses this endpoint to notify your application of calling events from the Azure Communication Services Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p MY_SPRINGAPP_PORT
devtunnel host
```

## Update your application configuration

Then open the `application.yml` file in the `/resources` folder to configure the following values:

- `connectionstring`: The connection string for your Azure Communication Services resource. You can find your Azure Communication Services connection string using the instructions [here](../../create-communication-resource.md). 
- `basecallbackuri`: Once you have your DevTunnel host initialized, update this field with that URI.
- `callerphonenumber`: update this field with the Azure Communication Services phone number you have acquired. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `targetphonenumber`: update field with the phone number you would like your application to call. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

```yaml
acs:
  connectionstring: <YOUR Azure Communication Services CONNECTION STRING>
  basecallbackuri: <YOUR DEV TUNNEL ENDPOINT>
  callerphonenumber: <YOUR Azure Communication Services PHONE NUMBER>
  targetphonenumber: <YOUR TARGET PHONE NUMBER>
```


## Make an outbound call and play media

To make the outbound call from Azure Communication Services, this sample uses the `targetphonenumber` you defined in the `application.yml` file to create the call using the `createCallWithResponse` API.

```java
PhoneNumberIdentifier caller = new PhoneNumberIdentifier(appConfig.getCallerphonenumber());
PhoneNumberIdentifier target = new PhoneNumberIdentifier(appConfig.getTargetphonenumber());
CallInvite callInvite = new CallInvite(target, caller);
CreateCallOptions createCallOptions = new CreateCallOptions(callInvite, appConfig.getCallBackUri());
Response<CreateCallResult> result = client.createCallWithResponse(createCallOptions, Context.NONE);
```

## Start recording a call

The Call Automation service also enables the capability to start recording and store recordings of voice and video calls. You can learn more about the various capabilities in the Call Recording APIs [here](../../voice-video-calling/get-started-call-recording.md).


```java
ServerCallLocator serverCallLocator = new ServerCallLocator(
    client.getCallConnection(callConnectionId)
        .getCallProperties()
        .getServerCallId());
        
StartRecordingOptions startRecordingOptions = new StartRecordingOptions(serverCallLocator);

Response<RecordingStateResult> response = client.getCallRecording()
    .startWithResponse(startRecordingOptions, Context.NONE);

recordingId = response.getValue().getRecordingId();
```


## Respond to calling events

Earlier in our application, we registered the `basecallbackuri` to the Call Automation Service. The URI indicates endpoint the service will use to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. In the code be below we respond to the `CallConnected` event.

```java
List<CallAutomationEventBase> events = CallAutomationEventParser.parseEvents(reqBody);
for (CallAutomationEventBase event : events) {
    String callConnectionId = event.getCallConnectionId();
    if (event instanceof CallConnected) {
        log.info("CallConnected event received");
    }
    else if (event instanceof RecognizeCompleted) {
        log.info("Recognize Completed event received");
    }
}
```

## Play welcome message and recognize 

Using the `FileSource` API, you can provide the service the audio file you want to use for your welcome message. The Azure Communication Services Call Automation service plays this message upon the `CallConnected` event. 

Next we pass the audio file into the `CallMediaRecognizeDtmfOptions` and then call `startRecognizingWithResponse`. This recognizes and options API enables the telephony client to send DTMF tones that we can recognize.

```java
PhoneNumberIdentifier target = new PhoneNumberIdentifier(appConfig.getTargetphonenumber());
CallMediaRecognizeDtmfOptions recognizeDtmfOptions = new CallMediaRecognizeDtmfOptions(target, 1);

PlaySource playSource = new FileSource()
    .setUrl(appConfig.getBasecallbackuri() + "/" + mediaFile)
    .setPlaySourceCacheId(mediaFile);

recognizeDtmfOptions.setPlayPrompt(playSource)
    .setInterruptPrompt(true)
    .setInitialSilenceTimeout(Duration.ofSeconds(15));

client.getCallConnection(callConnectionId)
    .getCallMedia()
    .startRecognizingWithResponse(recognizeDtmfOptions, Context.NONE);
```

## Recognize DTMF Events

When the telephony endpoint selects a DTMF tone, Azure Communication Services Call Automation triggers the webhook we have setup and notify us with the `RecognizeCompleted` event. The event gives us the ability to respond to a specific DTMF tone and trigger an action. 

```java
else if (event instanceof RecognizeCompleted) {
    log.info("Recognize Completed event received");
    RecognizeCompleted recognizeEvent = (RecognizeCompleted) event;
    DtmfResult dtmfResult = (DtmfResult) recognizeEvent
            .getRecognizeResult().get();
    DtmfTone selectedTone = dtmfResult.getTones().get(0);

    switch(selectedTone.convertToString()) {
        case "1":
            log.info("Received DTMF tone 1.");
            playToAll(callConnectionId, "Confirmed.wav");
            break;

        case "2":
            log.info("Received DTMF tone 2.");
            playToAll(callConnectionId, "Goodbye.wav");
            break;

        default:
            log.info("Unexpected DTMF received: {}", selectedTone.convertToString());
            playToAll(callConnectionId, "Invalid.wav");
            break;
    }

```

## Hang up the call

Finally, when we detect a condition that makes sense for us to terminate the call, we can use the `hangUp` method to hang up the call.

```java
client.getCallConnection(callConnectionId).hangUp(true);
```

## Run the code

Navigate to the directory containing the pom.xml file and use the following mvn commands:
- Compile the application: `mvn compile`
- Build the package: `mvn package`
- Execute the app: `mvn exec:java`


