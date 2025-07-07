---
title: Building Answer Machine Detection
titleSuffix: An Azure Communication Services concept document
description: Learn how to 
author: Kunaal
ms.service: azure-communication-services
ms.subservice: call-automation
ms.topic: conceptual
ms.date: 03/07/2025
ms.author: kpunjabi
ms.custom: public_preview
---

# Implementing Answer Machine Detection with Call Automation

Answer Machine Detection (AMD) helps contact centers identify whether a call is answered by a human or an answering machine. This article describes how to implement an AMD solution using Dual-Tone Multi-Frequency (DTMF) tones with Azure Communication Services existing play and recognize APIs.

To achieve this goal, developers can implement logic that uses the call connected event and plays an automated message. This message requests the callee to press a specific key to verify they're human before connecting them to an agent or playing a more specific message.

## Step-by-step guide 
1. Create an outbound call. For more information about creating outbound calls, see [Make an outbound call using Call Automation](../../quickstarts/call-automation/quickstart-make-an-outbound-call.md).
2. Once the call is answered, you get a `CallConnected` event. This event lets your application know that the call is answered. At this stage, it could be a human or an answer machine.
3. After receiving the `CallConnected` event your application should use the [recognize API](./recognize-action.md) and play a message to the callee requesting them to press a number on their dial pad to validate they're human, for example, your application might say "This is a call from [your company name] regarding [reason for call]. Press 1 to be connected to an agent."
4. If the user presses a key on the dialpad, Azure Communication Services sends a `RecognizeCompleted` event to your application. This indicates that a human answered the call and you should continue with your regular workflow.
5. If no DTMF input is received, Azure Communication Services sends a `RecognizeFailed` event to your application. This indicates that this call went to voicemail and you should follow your voicemail flow for this call.

## Example code 

```csharp
//... rest of your code

var ttsMessage = "This is a call from [your company name] regarding [reason for call]. Please press 1 to be connected to an agent.";
var playSource = new TextSource(ttsMessage)
{
    PlaySourceId = "playSourceId"
};

var playOptions = new PlayOptions
{
    Loop = false
};

callConnection.Play(playSource, playOptions);

var recognizeOptions = new RecognizeOptions(new DtmfOptions(new[] { DtmfTone.One }))
{
    InterruptPrompt = false,
    InitialSilenceTimeout = TimeSpan.FromSeconds(5),
    PlayPrompt = playSource
};

var recognizeResult = callConnection.Recognize(recognizeOptions);

// Handle the recognition result
if (recognizeResult.Status == RecognizeResultStatus.Recognized && recognizeResult.RecognizedTone == DtmfTone.One)
{
    // Connect the call to an agent
    Console.WriteLine("Human detected. Connecting to an agent...");
    // Add your logic to connect the call to an agent
}
else
{
    // Classify the call as an answering machine
    Console.WriteLine("No response detected. Classifying as an answering machine...");
    // Add your logic to handle answering machine
}

//... rest of your code
```

## Next steps
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md) and its features. 
- Learn more about [Play action](../../concepts/call-automation/play-action.md).
- Learn more about [Recognize action](../../concepts/call-automation/recognize-action.md).
