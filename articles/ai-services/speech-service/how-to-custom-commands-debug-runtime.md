---
title: 'Troubleshooting guide for a Custom Commands application at runtime'
titleSuffix: Azure AI services
description: In this article, you learn how to debug runtime errors in a Custom Commands application.
author: eric-urban
manager: nitinme
ms.service: azure-ai-speech
ms.topic: how-to
ms.date: 06/18/2020
ms.author: eur
ms.custom: cogserv-non-critical-speech
---

# Troubleshoot a Custom Commands application at runtime

[!INCLUDE [deprecation notice](./includes/custom-commands-retire.md)]

This article describes how to debug when you see errors while running Custom Commands application. 

## Connection failed

If your run Custom Commands application from [client application (with Speech SDK)](./how-to-custom-commands-setup-speech-sdk.md) or [Windows Voice Assistant Client](./how-to-custom-commands-developer-flow-test.md), you may experience connection errors as listed below:

| Error code | Details |
| ------- | -------- |
| [401](#error-401) | AuthenticationFailure: WebSocket Upgrade failed with an authentication error |
| [1002](#error-1002) | The server returned status code '404' when status code '101' was expected. |

### Error 401
- The region specified in client application doesn't match with the region of the custom command application

- Speech resource Key is invalid
    
    Make sure your speech resource key is correct.

### Error 1002 
- Your custom command application isn't published
    
    Publish your application in the portal.

- Your custom command applicationId isn't valid

    Make sure your custom command application ID is correct.
 custom command application outside your speech resource

    Make sure the custom command application is created under your speech resource.

For more information on troubleshooting the connection issues, reference [Windows Voice Assistant Client Troubleshooting](https://github.com/Azure-Samples/Cognitive-Services-Voice-Assistant/tree/master/clients/csharp-wpf#troubleshooting)


## Dialog is canceled

When your Custom Commands application is running, the dialog would be canceled when some errors occur.

- If you're testing the application in the portal, it would directly display the cancellation description and play out an error earcon. 

- If you're running the application with [Windows Voice Assistant Client](./how-to-custom-commands-developer-flow-test.md), it would play out an error earcon. You can find the **Event: CancelledDialog** under the **Activity Logs**.

- If you're following our client application example [client application (with Speech SDK)](./how-to-custom-commands-setup-speech-sdk.md), it would play out an error earcon. You can find the **Event: CancelledDialog** under the **Status**.

- If you're building your own client application, you can always design your desired logics to handle the CancelledDialog events.

The CancelledDialog event consists of cancellation code and description, as listed below:

| Cancellation Code | Cancellation Description |
| ------- | --------------- | ----------- |
| [MaxTurnThresholdReached](#no-progress-was-made-after-the-max-number-of-turns-allowed) | No progress was made after the max number of turns allowed |
| [RecognizerQuotaExceeded](#recognizer-usage-quota-exceeded) | Recognizer usage quota exceeded |
| [RecognizerConnectionFailed](#connection-to-the-recognizer-failed) | Connection to the recognizer failed |
| [RecognizerUnauthorized](#this-application-cant-be-accessed-with-the-current-subscription) | This application can't be accessed with the current subscription |
| [RecognizerInputExceededAllowedLength](#input-exceeds-the-maximum-supported-length) | Input exceeds the maximum supported length for the recognizer |
| [RecognizerNotFound](#recognizer-not-found) | Recognizer not found |
| [RecognizerInvalidQuery](#invalid-query-for-the-recognizer) | Invalid query for the recognizer |
| [RecognizerError](#recognizer-return-an-error) | Recognizer returns an error |

### No progress was made after the max number of turns allowed
The dialog is canceled when a required slot isn't successfully updated after certain number of turns. The build-in max number is 3.

### Recognizer usage quota exceeded
Language Understanding (LUIS) has limits on resource usage. Usually "Recognizer usage quota exceeded error" can be caused by: 
- Your LUIS authoring exceeds the limit

    Add a prediction resource to your Custom Commands application: 
    1. go to **Settings**, LUIS resource
    1. Choose a prediction resource from **Prediction resource**, or select **Create new resource** 

- Your LUIS prediction resource exceeds the limit

    If you are on a F0 prediction resource, it has limit of 10 thousand/month, 5 queries/second.

For more details on LUIS resource limits, refer [Language Understanding resource usage and limit](../luis/luis-limits.md#resource-usage-and-limits)

### Connection to the recognizer failed
Usually it means transient connection failure to Language Understanding (LUIS) recognizer. Try it again and the issue should be resolved.

### This application can't be accessed with the current subscription
Your subscription isn't authorized to access the LUIS application. 

### Input exceeds the maximum supported length
Your input has exceeded 500 characters. We only allow at most 500 characters for input utterance.

### Invalid query for the recognizer
Your input has exceeded 500 characters. We only allow at most 500 characters for input utterance.

### Recognizer return an error
The LUIS recognizer returned an error when trying to recognize your input.

### Recognizer not found
Can't find the recognizer type specified in your custom commands dialog model. Currently, we only support [Language Understanding (LUIS) Recognizer](https://www.luis.ai/).

## Other common errors
### Unexpected response
Unexpected responses may be caused multiple things. 
A few checks to start with:
- Yes/No Intents in example sentences

    As we currently don't support Yes/No Intents except when using with confirmation feature. All the Yes/No Intents defined in example sentences wouldn't be detected.

- Similar intents and examples sentences among commands

    The LUIS recognition accuracy may get affected when two commands share similar intents and examples sentences. You can try to make commands functionality and example sentences as distinct as possible.

    For best practice of improving recognition accuracy, refer [LUIS best practice](../luis/faq.md).

- Dialog is canceled
    
    Check the reasons of cancellation in the section above.

### Error while rendering the template
An undefined parameter is used in the speech response. 

### Object reference not set to an instance of an object
You have an empty parameter in the JSON payload defined in **Send Activity to Client** action.

## Next steps

> [!div class="nextstepaction"]
> [See samples on GitHub](https://aka.ms/speech/cc-samples)
