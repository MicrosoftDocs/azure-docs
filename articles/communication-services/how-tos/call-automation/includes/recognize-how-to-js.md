---
title: include file
description: JS recognize action how-to guide
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
- Have Node.js installed, you can install it from their [official website](https://nodejs.org).

## Technical specifications

The following parameters are available to customize the Recognize function:

| Parameter | Type|Default (if not specified) | Description | Required or Optional |
| ------- |--| ------------------------ | --------- | ------------------ |
| Prompt <br/><br/> *(for details on Play action, refer to [this how-to guide](../play-action.md))* | FileSource | Not set |This is the message you wish to play before recognizing input. | Optional |
| InterToneTimeout | TimeSpan | 2 seconds <br/><br/>**Min:** 1 second <br/>**Max:** 60 seconds | Limit in seconds that ACS waits for the caller to press another digit (inter-digit timeout). | Optional |
| InitialSilenceTimeout | TimeSpan | 5 seconds<br/><br/>**Min:** 0 seconds <br/>**Max:** 300 seconds | How long recognize action waits for input before considering it a timeout. | Optional |
| MaxTonesToCollect | Integer | No default<br/><br/>**Min:** 1|Number of digits a developer expects as input from the participant.| Required |
| StopTones |IEnumeration\<DtmfTone\> | Not set | The digit participants can press to escape out of a batch DTMF event. | Optional |
| InterruptPrompt | Bool | True | If the participant has the ability to interrupt the playMessage by pressing a digit. | Optional |
| InterruptCallMediaOperation | Bool | True | If this flag is set it interrupts the current call media operation. For example if any audio is being played it interrupts that operation and initiates recognize. | Optional |
| OperationContext | String | Not set | String that developers can pass mid action, useful for allowing developers to store context about the events they receive. | Optional |

## Create a new JavaScript application
Create a new JavaScript application in your project directory. Initialize a new Node.js project with the following command. This creates a package.json file for your project, which is used to manage your project's dependencies. 

``` console
npm init -y
```

### Install the Azure Communication Services Call Automation package
``` console
npm install @azure/communication-call-automation
```

Create a new JavaScript file in your project directory, for example, name it app.js. You write your JavaScript code in this file. Run your application using Node.js with the following command. This executes the JavaScript code you have written. 

``` console
node app.js
```

## Establish a call

By this point you should be familiar with starting calls, if you need to learn more about making a call, follow our [quickstart](../../../quickstarts/call-automation/quickstart-make-an-outbound-call.md). In this quickstart, we'll create an outbound call.

## Call the recognize action

When your application answers the call, you can provide information about recognizing participant input and playing a prompt.

``` javascript
const callConnection = client.getCallConnection(callConnectionId);
const callMedia = callConnection.getCallMedia();
            
const targetParticipant: PhoneNumberIdentifier = {
    phoneNumber: targetPhoneNumber
};
const maxTonesToCollect = 3;
const fileSource: FileSource = {
    url: fileSourceUrl,
    kind: "fileSource"
};
const recognizeOptions: CallMediaRecognizeDtmfOptions = {
    playPrompt: fileSource,
    stopDtmfTones: [ DtmfTone.Pound ],
    kind: "callMediaRecognizeDtmfOptions"
};
callMedia.startRecognizing(targetParticipant, maxTonesToCollect, recognizeOptions);
```

**Note:** If parameters aren't set, the defaults are applied where possible.

## Receiving recognize event updates

Developers can subscribe to the *RecognizeCompleted* and *RecognizeFailed* events on the webhook callback they registered for the call to create business logic in their application for determining next steps when one of the previously mentioned events occurs. 

### Example of how you can deserialize the *RecognizeCompleted* event:

``` javascript
var body = req.body[events];

if (body.data && body.type == "Microsoft.Communication.RecognizeCompleted") {
    var recognizeCompletedEvent: RecognizeCompleted = body.data;
    if (recognizeCompletedEvent.collectTonesResult?.tones?.pop() == "two") {
        // Handle the RecognizeCompleted event according to your application logic
    }
}
```

### Example of how you can deserialize the *RecognizeFailed* event:

``` javascript
var body = req.body[events];

if (body.data && body.type == "Microsoft.Communication.RecognizeFailed") {
    var recognizeFailedEvent: RecognizeFailed = body.data;
    // Handle the RecognizeFailed event according to your application logic
    throw new Error(recognizeFailedEvent.resultInformation?.message);
}
```

### Example of how you can deserialize the *RecognizeCanceled* event:

``` javascript
var body = req.body[events];

if (body.data && body.type === "Microsoft.Communication.RecognizeCanceled") {
    var recognizeCanceledEvent: RecognizeCanceled = body.data;
        // Handle the RecognizeCanceled event according to your application logic
}
```
