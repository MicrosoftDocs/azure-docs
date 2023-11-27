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
- Create and host an Azure Dev Tunnel. Instructions [here](/azure/developer/dev-tunnels/get-started)
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

```python
# Your Azure Communication Services resource connection string
ACS_CONNECTION_STRING = "<ACS_CONNECTION_STRING>"

# Your Azure Communication Services resource phone number will act as source number to start outbound call
ACS_PHONE_NUMBER = "<ACS_PHONE_NUMBER>"

# Target phone number you want to receive the call.
TARGET_PHONE_NUMBER = "<TARGET_PHONE_NUMBER>"

# Callback events URI to handle callback events.
CALLBACK_URI_HOST = "<CALLBACK_URI_HOST_WITH_PROTOCOL>"
```

## Make an outbound call

To make the outbound call from ACS, first you provide the phone number you want to receive the call. To make it simple, you can update the `target_phone_number` with a phone number in the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

Make an outbound call using the target_phone_number you've provided: 

```python
target_participant = PhoneNumberIdentifier(TARGET_PHONE_NUMBER)
source_caller = PhoneNumberIdentifier(ACS_PHONE_NUMBER)
call_invite = CallInvite(target=target_participant, source_caller_id_number=source_caller)
call_automation_client = CallAutomationClient.from_connection_string(ACS_CONNECTION_STRING)
call_connection_properties = call_automation_client.create_call(call_invite, CALLBACK_EVENTS_URI)
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

With the `file_source` parameter, you can provide the service the audio file you want to use for your welcome message. Finally, the Azure Communication Services Call Automation service plays the message upon detecting the `CallConnected` event. 

We pass the audio file into the `play_prompt` parameter and then call `start_recognizing_media`. The API enables the telephony client to send DTMF tones that we can recognize.

```python
file_source = FileSource(MAIN_MENU_PROMPT_URI)
call_automation_client.start_recognizing_media(input_type=RecognizeInputType.DTMF,
        target_participant=target_participant,
        play_prompt=file_source,
        interrupt_prompt=True,
        initial_silence_timeout=10,
        dtmf_inter_tone_timeout=10,
        dtmf_max_tones_to_collect=1,
        dtmf_stop_tones=[DtmfTone.POUND])
```

## Recognize DTMF Events

When the telephony endpoint selects a DTMF tone, Azure Communication Services Call Automation triggers the webhook we have set up and notify us with the `RECOGNIZE_COMPLETED_EVENT` event. This event gives us the ability to respond to a specific DTMF tone and trigger an action. 

```python
event = CloudEvent.from_dict(event_dict)
call_connection_id = event.data['callConnectionId']
call_connection_client = call_automation_client.get_call_connection(call_connection_id)
if event.type == "Microsoft.Communication.RecognizeCompleted":
    selected_tone = event.data['dtmfResult']['tones'][0]
    if selected_tone == DtmfTone.ONE:
        app.logger.info("Playing confirmed prompt")
        call_connection_client.play_media_to_all([FileSource(CONFIRMED_PROMPT_URI)])
    elif selected_tone == DtmfTone.TWO:
        # Handle other options
        ...
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


