---
title: Quickstart - Make an outbound call using Call Automation
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, we learn how to make an outbound PSTN call using Azure Communication Services Call Automation
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
- [Python](https://www.python.org/downloads/) 3.7+.

## Sample code
Download or clone quickstart sample code from [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/callautomation-outboundcalling).

Navigate to `CallAutomation_OutboundCalling` folder and open the solution in a code editor.

## Set up the Python environment

Create and activate python environment and install required packages using following command. You can learn more about managing packages [here](https://code.visualstudio.com/docs/python/python-tutorial#_install-and-use-packages)

```bash
pip install -r requirements.txt
```

## Set up and host your Azure DevTunnel

[Azure DevTunnels](/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands to connect your local development environment to the public internet. DevTunnels creates a tunnel with a persistent endpoint URL and which allows anonymous access. We use this endpoint to notify your application of calling events from the Azure Communication Services Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p 8080
devtunnel host
```

## Update your application configuration

Then update your `main.py` file with the following values:

- `ACS_CONNECTION_STRING`: The connection string for your Azure Communication Services resource. You can find your Azure Communication Services connection string using the instructions [here](../../create-communication-resource.md). 
- `CALLBACK_URI_HOST`: Once you have your DevTunnel host initialized, update this field with that URI.
- `TARGET_PHONE_NUMBER`: update field with the phone number you would like your application to call. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `ACS_PHONE_NUMBER`: update this field with the Azure Communication Services phone number you have acquired. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `COGNITIVE_SERVICES_ENDPOINT`: update field with your cognitive services endpoint.


```python
# Your ACS resource connection string 
ACS_CONNECTION_STRING = "<ACS_CONNECTION_STRING>" 

# Your ACS resource phone number will act as source number to start outbound call 
ACS_PHONE_NUMBER = "<ACS_PHONE_NUMBER>" 

# Target phone number you want to receive the call. 
TARGET_PHONE_NUMBER = "<TARGET_PHONE_NUMBER>" 

# Callback events URI to handle callback events. 
CALLBACK_URI_HOST = "<CALLBACK_URI_HOST_WITH_PROTOCOL>" 
CALLBACK_EVENTS_URI = CALLBACK_URI_HOST + "/api/callbacks" 

#Your Cognitive service endpoint 
COGNITIVE_SERVICES_ENDPOINT = "<COGNITIVE_SERVICES_ENDPOINT>" 
```

## Make an outbound call

To make the outbound call from ACS, first you provide the phone number you want to receive the call. To make it simple, you can update the `target_phone_number` with a phone number in the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

Make an outbound call using the target_phone_number you've provided: 

```python
target_participant = PhoneNumberIdentifier(TARGET_PHONE_NUMBER) 
source_caller = PhoneNumberIdentifier(ACS_PHONE_NUMBER) 
call_invite = CallInvite(target=target_participant, source_caller_id_number=source_caller) 
call_connection_properties = call_automation_client.create_call(call_invite, CALLBACK_EVENTS_URI, 
cognitive_services_endpoint=COGNITIVE_SERVICES_ENDPOINT) 
    app.logger.info("Created call with connection id: %s",
call_connection_properties.call_connection_id) 
return redirect("/") 
```

## Start recording a call

The Call Automation service also enables the capability to start recording and store recordings of voice and video calls. You can learn more about the various capabilities in the Call Recording APIs [here](../../voice-video-calling/get-started-call-recording.md).

```python
recording_properties = call_automation_client.start_recording(ServerCallLocator(event.data['serverCallId']))
recording_id = recording_properties.recording_id
```

## Respond to calling events

Earlier in our application, we registered the `CALLBACK_URI_HOST` to the Call Automation Service. The URI indicates the endpoint the service uses to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. In the code be below we respond to the `CallConnected` event.

```python
@app.route('/api/callbacks', methods=['POST'])
def callback_events_handler():
    for event_dict in request.json:
        event = CloudEvent.from_dict(event_dict)
        if event.type == "Microsoft.Communication.CallConnected":
            # Handle Call Connected Event
            ...
            return Response(status=200)
```

## Play welcome message and recognize 

Using the `TextSource`, you can provide the service with the text you want synthesized and used for your welcome message. The Azure Communication Services Call Automation service plays this message upon the `CallConnected` event. 

Next, we pass the text into the `CallMediaRecognizeChoiceOptions` and then call `StartRecognizingAsync`. This allows your application to recognize the option the caller chooses.

```python
get_media_recognize_choice_options( 
    call_connection_client=call_connection_client, 
    text_to_play=MainMenu,  
    target_participant=target_participant, 
    choices=get_choices(),context="") 

def get_media_recognize_choice_options(call_connection_client: CallConnectionClient, text_to_play: str, target_participant:str, choices: any, context: str): 
    play_source =  TextSource (text= text_to_play, voice_name= SpeechToTextVoice) 
    call_connection_client.start_recognizing_media( 
        input_type=RecognizeInputType.CHOICES, 
        target_participant=target_participant,
        choices=choices, 
        play_prompt=play_source, 
        interrupt_prompt=False, 
        initial_silence_timeout=10, 
        operation_context=context 
    ) 

def get_choices(): 
    choices = [ 
        RecognitionChoice(label = ConfirmChoiceLabel, phrases= ["Confirm", "First", "One"], tone = DtmfTone.ONE), 
        RecognitionChoice(label = CancelChoiceLabel, phrases= ["Cancel", "Second", "Two"], tone = DtmfTone.TWO) 
    ] 
return choices 
```

## Recognize DTMF Events

Azure Communication Services Call Automation triggers the `api/callbacks` to the webhook we have setup and will notify us with the `RecognizeCompleted` event. The event gives us the ability to respond to input recieved and trigger an action. The application then plays a message to the caller based on the specific input received.

```python
elif event.type == "Microsoft.Communication.RecognizeCompleted":
	app.logger.info("Recognize completed: data=%s", event.data)
if event.data['recognitionType'] == "choices":
	labelDetected = event.data['choiceResult']['label'];
phraseDetected = event.data['choiceResult']['recognizedPhrase'];
app.logger.info("Recognition completed, labelDetected=%s, phraseDetected=%s, context=%s", labelDetected, phraseDetected, event.data.get('operationContext'))
if labelDetected == ConfirmChoiceLabel:
	textToPlay = ConfirmedText
else:
	textToPlay = CancelText
handle_play(call_connection_client = call_connection_client, text_to_play = textToPlay)
def handle_play(call_connection_client: CallConnectionClient, text_to_play: str):
	play_source = TextSource(text = text_to_play, voice_name = SpeechToTextVoice)
call_connection_client.play_media_to_all(play_source)
```

## Hang up the call

Finally, when we detect a condition that makes sense for us to terminate the call, we can use the `hang_up()` method to hang up the call. Finally, we can also safely stop the call recording operation.

```python
call_automation_client.stop_recording(recording_id)
call_connection_client.hang_up(is_for_everyone=True)
```

## Run the code

# [Visual Studio Code](#tab/visual-studio-code)

To run the application with VS Code, open a Terminal window and run the following command

```bash
python main.py
```

# [Visual Studio](#tab/visual-studio)

Press Ctrl+F5 to run without the debugger.


