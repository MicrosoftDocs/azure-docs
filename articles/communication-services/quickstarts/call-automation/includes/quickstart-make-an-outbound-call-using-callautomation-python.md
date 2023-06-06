---
title: Quickstart - Make an outbound call using Call Automation
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

Find the complete sample code for this quick start on [GitHub](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/callautomation-outboundcalling)

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). 
- A deployed Communication Services resource. [Create a Communication Services resource](../../create-communication-resource.md).
- A [phone number](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/telephony/get-phone-number) in your Azure Communication Services resource that can make outbound calls. NB: phone numbers are not available in free subscriptions.
- Create and host a Azure Dev Tunnel. Instructions [here](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/get-started)
- [Python](https://www.python.org/downloads/) 3.7+.

## Setup the Python environment

Create and activate python environment and install required packages using following command. You can learn more about managing packages [here](https://code.visualstudio.com/docs/python/python-tutorial#_install-and-use-packages)

```bash
pip install -r requirements.txt
```

## Setup and host your Azure DevTunnel

[Azure DevTunnels](https://learn.microsoft.com/en-us/azure/developer/dev-tunnels/overview) is an Azure service that enables you to share local web services hosted on the internet. Use the commands below to connect your local development environment to the public internet. This creates a tunnel with a persistent endpoint URL and which allows anonymous access. We will then use this endpoint to notify your application of calling events from the ACS Call Automation service.

```bash
devtunnel create --allow-anonymous
devtunnel port create -p MY_PYTHON_APPPORT
devtunnel host
```

## Update your application configuration

Then update your `main.py` file with the following values:

- `ACS_CONNECTION_STRING`: The connection string for your ACS resource. You can find your ACS connection string using the instructions [here](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/create-communication-resource?tabs=linux&pivots=platform-azp#access-your-connection-strings-and-service-endpoints). 
- `CALLBACK_URI_HOST`: Once you have your DevTunnel host initialized, update this field with that URI.
- `TARGET_PHONE_NUMBER`: update field with the phone number you would like your application to call. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)
- `ACS_PHONE_NUMBER`: update this field with with the ACS phone number you have acquired. This phone number should use the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

```python
# Your ACS resource connection string
ACS_CONNECTION_STRING = "<ACS_CONNECTION_STRING>"

# Your ACS resource phone number will act as source number to start outbound call
ACS_PHONE_NUMBER = "<ACS_PHONE_NUMBER>"

# Target phone number you want to receive the call.
TARGET_PHONE_NUMBER = "<TARGET_PHONE_NUMBER>"

# Callback events URI to handle callback events.
CALLBACK_URI_HOST = "<CALLBACK_URI_HOST_WITH_PROTOCOL>"
```


## Make an outbound call and play media

To make the outbound call from ACS, first you will to provide the phone number you want to receive the call. To make it simple, you can update the `target_phone_number` with a phone number in the [E164](https://en.wikipedia.org/wiki/E.164) phone number format (e.g +18881234567)

The code below will create make an outbound call using the target_phone_number you've provided and place an outbound call to that number:

```python
target_participant = PhoneNumberIdentifier(TARGET_PHONE_NUMBER)
source_caller = PhoneNumberIdentifier(ACS_PHONE_NUMBER)
call_invite = CallInvite(target=target_participant, source_caller_id_number=source_caller)
call_automation_client = CallAutomationClient.from_connection_string(ACS_CONNECTION_STRING)
call_connection_properties = call_automation_client.create_call(call_invite, CALLBACK_EVENTS_URI)
```

## Start Recording a Call

The Call Automation service also enables the capability to start recording and store recordings of voice and video calls. You can learn more about the various capabilities in the Call Recording APIs [here](https://learn.microsoft.com/en-us/azure/communication-services/quickstarts/voice-video-calling/get-started-call-recording).

```python
server_call_id = event.data['serverCallId']
recording_properties = call_automation_client.start_recording(ServerCallLocator(server_call_id))
```


## Respond to calling events

Earlier in our application, we registerd the `CALLBACK_URI_HOST` to the Call Automation Service. This indicates the endpoint the service will use to notify us of calling events that happen. We can then iterate through the events and detect specific events our application wants to understand. In the code be below we respond to the `CallConnected` event.

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

Using the `file_source` parameter, you can provide the service the audio file you want to use for your welcome message. Using our sample code, the ACS Call Automtaion service will play this message upon the `CallConnected` event. 

In the code below, we pass the audio file into the `play_prompt` parameter and then call `start_recognizing_media`. This recognize and options API enables the telephony client to send DTMF tones that we can recognize.

```python
file_source = FileSource(MAIN_MENU_PROMPT_URI)
call_connection_client.start_recognizing_media(input_type=RecognizeInputType.DTMF,
        target_participant=target_participant,
        play_prompt=file_source,
        interrupt_prompt=True,
        initial_silence_timeout=10,
        dtmf_inter_tone_timeout=10,
        dtmf_max_tones_to_collect=1,
        dtmf_stop_tones=[DtmfTone.POUND])
```

## Recognize DTMF Events

When the telephony endpoint selects a DTMF tone, ACS Call Automation will trigger the webhook we have setup and notify us with the `RECOGNIZE_COMPLETED_EVENT` event. This gives us the ability to respond to a specific DTMF tone and trigger an action. 

```python
if event.type == constants.RECOGNIZE_COMPLETED_EVENT:
    # check if it collected the minimum digit it needed
    if len(event.data['collectTonesResult']['tones']) == 1:
        choice = event.data['collectTonesResult']['tones'][0]
        return choice
    else:
        return None
```

## Hang up the call

Finally, when we detect a condition that makes sense for us to terminate the call, we can use the `hang_up()` method to hang up the call. At this point we can also safely stop the call recording operation.

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


