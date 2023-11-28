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
- Create and host an Azure Dev Tunnel. Instructions [here](/azure/developer/dev-tunnels/get-started).
- Create and connect [a Multi-service Azure AI services to your Azure Communication Services resource](../../../concepts/call-automation/azure-communication-services-azure-cognitive-services-integration.md).
- Create a [custom subdomain](../../../../ai-services/cognitive-services-custom-subdomains.md) for your Azure AI services resource. 
- [Java Development Kit (JDK) version 11 or above](/azure/developer/java/fundamentals/java-jdk-install).
- [Apache Maven](https://maven.apache.org/download.cgi).

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
- `cognitiveServiceEndpoint`: update field with your cognitive services endpoint.

```yaml
acs:
  connectionstring: <YOUR ACS CONNECTION STRING> 
  basecallbackuri: <YOUR DEV TUNNEL ENDPOINT> 
  callerphonenumber: <YOUR ACS PHONE NUMBER ex. "+1425XXXAAAA"> 
  targetphonenumber: <YOUR TARGET PHONE NUMBER ex. "+1425XXXAAAA"> 
  cognitiveServiceEndpoint: <YOUR COGNITIVE SERVICE ENDPOINT> 
```


## Make an outbound call and play media

To make the outbound call from Azure Communication Services, this sample uses the `targetphonenumber` you defined in the `application.yml` file to create the call using the `createCallWithResponse` API.

```java
PhoneNumberIdentifier caller = new PhoneNumberIdentifier(appConfig.getCallerphonenumber());
PhoneNumberIdentifier target = new PhoneNumberIdentifier(appConfig.getTargetphonenumber());
CallInvite callInvite = new CallInvite(target, caller);
CreateCallOptions createCallOptions = new CreateCallOptions(callInvite, appConfig.getCallBackUri());
CallIntelligenceOptions callIntelligenceOptions = new CallIntelligenceOptions().setCognitiveServicesEndpoint(appConfig.getCognitiveServiceEndpoint());
createCallOptions = createCallOptions.setCallIntelligenceOptions(callIntelligenceOptions);
Response < CreateCallResult > result = client.createCallWithResponse(createCallOptions, Context.NONE);
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

Using the `TextSource`, you can provide the service with the text you want synthesized and used for your welcome message. The Azure Communication Services Call Automation service plays this message upon the `CallConnected` event. 

Next, we pass the text into the `CallMediaRecognizeChoiceOptions` and then call `StartRecognizingAsync`. This allows your application to recognize the option the caller chooses.

```java
var playSource = new TextSource().setText(content).setVoiceName("en-US-NancyNeural");

var recognizeOptions = new CallMediaRecognizeChoiceOptions(new PhoneNumberIdentifier(targetParticipant), getChoices())
  .setInterruptCallMediaOperation(false)
  .setInterruptPrompt(false)
  .setInitialSilenceTimeout(Duration.ofSeconds(10))
  .setPlayPrompt(playSource)
  .setOperationContext(context);

client.getCallConnection(callConnectionId)
  .getCallMedia()
  .startRecognizing(recognizeOptions);

private List < RecognitionChoice > getChoices() {
  var choices = Arrays.asList(
    new RecognitionChoice().setLabel(confirmLabel).setPhrases(Arrays.asList("Confirm", "First", "One")).setTone(DtmfTone.ONE),
    new RecognitionChoice().setLabel(cancelLabel).setPhrases(Arrays.asList("Cancel", "Second", "Two")).setTone(DtmfTone.TWO)
  );

  return choices;
}
```

## Handle Choice Events

Azure Communication Services Call Automation triggers the `api/callbacks` to the webhook we have setup and will notify us with the `RecognizeCompleted` event. The event gives us the ability to respond to input received and trigger an action. The application then plays a message to the caller based on the specific input received.

```java
else if (event instanceof RecognizeCompleted) {
  log.info("Recognize Completed event received");

  RecognizeCompleted acsEvent = (RecognizeCompleted) event;

  var choiceResult = (ChoiceResult) acsEvent.getRecognizeResult().get();

  String labelDetected = choiceResult.getLabel();

  String phraseDetected = choiceResult.getRecognizedPhrase();

  log.info("Recognition completed, labelDetected=" + labelDetected + ", phraseDetected=" + phraseDetected + ", context=" + event.getOperationContext());

  String textToPlay = labelDetected.equals(confirmLabel) ? confirmedText : cancelText;

  handlePlay(callConnectionId, textToPlay);
}

private void handlePlay(final String callConnectionId, String textToPlay) {
  var textPlay = new TextSource()
    .setText(textToPlay)
    .setVoiceName("en-US-NancyNeural");

  client.getCallConnection(callConnectionId)
    .getCallMedia()
    .playToAll(textPlay);
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


