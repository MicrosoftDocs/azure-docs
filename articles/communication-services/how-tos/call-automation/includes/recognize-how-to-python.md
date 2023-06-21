---
title: include file
description: Python recognize action how-to guide
services: azure-communication-services
author: Kunaal
ms.service: azure-communication-services
ms.subservice: azure-communication-services
ms.date: 05/28/2023
ms.topic: include
ms.topic: include file
ms.author: kpunjabi
---

## Prerequisites
- Azure account with an active subscription, for details see [Create an account for free.](https://azure.microsoft.com/free/)
- Azure Communication Services resource. See [Create an Azure Communication Services resource](../../../quickstarts/create-communication-resource.md?tabs=windows&pivots=platform-azp). Note the connection string for this resource. 
- Create a new web service application using the [Call Automation SDK](../../../quickstarts/call-automation/callflows-for-customer-interactions.md).
- Have Python installed, you can install from the [official site](https://www.python.org/).

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

## Create a new Python application

### Setup a Python virtual environment for your project
``` console
python -m venv play-audio-app
```

### Activate your virtual environment
On windows, use the following command:
``` console
.\ play-audio-quickstart \Scripts\activate
```
On Unix, use the following command:
``` console
source play-audio-quickstart /bin/activate
```

### Install the Azure Communication Services Call Automation package 

``` console
pip install azure-communication-callautomation
```
Create your application file in your project directory, for example, name it app.py. You will write your Python code in this file.  

Run your application using Python with the following command. This will execute the Python code you have written.  

``` console
python app.py
```

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

``` python
call_connection.start_recognizing_media(
    input_type='dtmf', 
    target_participant=PhoneNumberIdentifier(target_phone_number), 
    play_prompt=file_source,
    dtmf_stop_tones=[ "pound" ],
    max_tones_to_collect=3
    )
```

**Note:** If parameters aren't set, the defaults will be applied where possible.

## Receiving recognize event updates

Developers can subscribe to the *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the previously mentioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:

``` python
if event['type'] == "Microsoft.Communication.RecognizeCompleted":
    tones = event['data']['dtmfResult']['tones']
    # Handle the RecognizeCompleted event according to your application logic
```

### Example of how you can deserialize the *RecognizeFailed* event:

``` python
if event['type'] == "Microsoft.Communication.RecognizeFailed":
    error_message = event['data']['resultInformation']['message']
    # Handle the RecognizeFailed event according to your application logic
```

### Example of how you can deserialize the *RecognizeCanceled* event:

```python
if event['type'] == "Microsoft.Communication.RecognizeCanceled":
    # Handle the RecognizeCanceled event according to your application logic
```
