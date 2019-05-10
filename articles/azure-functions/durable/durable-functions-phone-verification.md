---
title: Human interaction and timeouts in Durable Functions - Azure
description: Learn how to handle human interaction and timeouts in the Durable Functions extension for Azure Functions.
services: functions
author: ggailey777
manager: jeconnoc
keywords:
ms.service: azure-functions
ms.devlang: multiple
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: azfuncdf
---

# Human interaction in Durable Functions - Phone verification sample

This sample demonstrates how to build a [Durable Functions](durable-functions-overview.md) orchestration that involves human interaction. Whenever a real person is involved in an automated process, the process must be able to send notifications to the person and receive responses asynchronously. It must also allow for the possibility that the person is unavailable. (This last part is where timeouts become important.)

This sample implements an SMS-based phone verification system. These types of flows are often used when verifying a customer's phone number or for multi-factor authentication (MFA). This is a powerful example because the entire implementation is done using a couple small functions. No external data store, such as a database, is required.

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

## Scenario overview

Phone verification is used to verify that end users of your application are not spammers and that they are who they say they are. Multi-factor authentication is a common use case for protecting user accounts from hackers. The challenge with implementing your own phone verification is that it requires a **stateful interaction** with a human being. An end user is typically provided some code (for example, a 4-digit number) and must respond **in a reasonable amount of time**.

Ordinary Azure Functions are stateless (as are many other cloud endpoints on other platforms), so these types of interactions involve explicitly managing state externally in a database or some other persistent store. In addition, the interaction must be broken up into multiple functions that can be coordinated together. For example, you need at least one function for deciding on a code, persisting it somewhere, and sending it to the user's phone. Additionally, you need at least one other function to receive a response from the user and somehow map it back to the original function call in order to do the code validation. A timeout is also an important aspect to ensure security. This can get fairly complex quickly.

The complexity of this scenario is greatly reduced when you use Durable Functions. As you will see in this sample, an orchestrator function can manage the stateful interaction easily and without involving any external data stores. Because orchestrator functions are *durable*, these interactive flows are also highly reliable.

## Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

## The functions

This article walks through the following functions in the sample app:

* **E4_SmsPhoneVerification**
* **E4_SendSmsChallenge**

The following sections explain the configuration and code that are used for C# scripting and JavaScript. The code for Visual Studio development is shown at the end of the article.

## The SMS verification orchestration (Visual Studio Code and Azure portal sample code)

The **E4_SmsPhoneVerification** function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions/samples/csx/E4_SmsPhoneVerification/function.json)]

Here is the code that implements the function:

### C#

[!code-csharp[Main](~/samples-durable-functions/samples/csx/E4_SmsPhoneVerification/run.csx)]

### JavaScript (Functions 2.x only)

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E4_SmsPhoneVerification/index.js)]

Once started, this orchestrator function does the following:

1. Gets a phone number to which it will *send* the SMS notification.
2. Calls **E4_SendSmsChallenge** to send an SMS message to the user and returns back the expected 4-digit challenge code.
3. Creates a durable timer that triggers 90 seconds from the current time.
4. In parallel with the timer, waits for an **SmsChallengeResponse** event from the user.

The user receives an SMS message with a four-digit code. They have 90 seconds to send that same 4-digit code back to the orchestrator function instance to complete the verification process. If they submit the wrong code, they get an additional three tries to get it right (within the same 90-second window).

> [!NOTE]
> It may not be obvious at first, but this orchestrator function is completely deterministic. This is because the `CurrentUtcDateTime` (.NET) and `currentUtcDateTime` (JavaScript) properties are used to calculate the timer expiration time, and these properties return the same value on every replay at this point in the orchestrator code. This is important to ensure that the same `winner` results from every repeated call to `Task.WhenAny` (.NET) or `context.df.Task.any` (JavaScript).

> [!WARNING]
> It's important to [cancel timers](durable-functions-timers.md) if you no longer need them to expire, as in the example above when a challenge response is accepted.

## Send the SMS message

The **E4_SendSmsChallenge** function uses the Twilio binding to send the SMS message with the 4-digit code to the end user. The *function.json* is defined as follows:

[!code-json[Main](~/samples-durable-functions/samples/csx/E4_SendSmsChallenge/function.json)]

And here is the code that generates the 4-digit challenge code and sends the SMS message:

### C#

[!code-csharp[Main](~/samples-durable-functions/samples/csx/E4_SendSmsChallenge/run.csx)]

### JavaScript (Functions 2.x only)

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E4_SendSmsChallenge/index.js)]

This **E4_SendSmsChallenge** function only gets called once, even if the process crashes or gets replayed. This is good because you don't want the end user getting multiple SMS messages. The `challengeCode` return value is automatically persisted, so the orchestrator function always knows what the correct code is.

## Run the sample

Using the HTTP-triggered functions included in the sample, you can start the orchestration by sending the following HTTP POST request:

```
POST http://{host}/orchestrators/E4_SmsPhoneVerification
Content-Length: 14
Content-Type: application/json

"+1425XXXXXXX"
```

```
HTTP/1.1 202 Accepted
Content-Length: 695
Content-Type: application/json; charset=utf-8
Location: http://{host}/admin/extensions/DurableTaskExtension/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"id":"741c65651d4c40cea29acdd5bb47baf1","statusQueryGetUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","sendEventPostUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/741c65651d4c40cea29acdd5bb47baf1/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","terminatePostUri":"http://{host}/admin/extensions/DurableTaskExtension/instances/741c65651d4c40cea29acdd5bb47baf1/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}"}
```

The orchestrator function receives the supplied phone number and immediately sends it an SMS message with a randomly generated 4-digit verification code &mdash; for example, *2168*. The function then waits 90 seconds for a response.

To reply with the code, you can use [`RaiseEventAsync` (.NET) or `raiseEvent` (JavaScript)](durable-functions-instance-management.md) inside another function or invoke the **sendEventUrl** HTTP POST webhook referenced in the 202 response above, replacing `{eventName}` with the name of the event, `SmsChallengeResponse`:

```
POST http://{host}/admin/extensions/DurableTaskExtension/instances/741c65651d4c40cea29acdd5bb47baf1/raiseEvent/SmsChallengeResponse?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
Content-Length: 4
Content-Type: application/json

2168
```

If you send this before the timer expires, the orchestration completes and the `output` field is set to `true`, indicating a successful verification.

```
GET http://{host}/admin/extensions/DurableTaskExtension/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
```

```
HTTP/1.1 200 OK
Content-Length: 144
Content-Type: application/json; charset=utf-8

{"runtimeStatus":"Completed","input":"+1425XXXXXXX","output":true,"createdTime":"2017-06-29T19:10:49Z","lastUpdatedTime":"2017-06-29T19:12:23Z"}
```

If you let the timer expire, or if you enter the wrong code four times, you can query for the status and see a `false` orchestration function output, indicating that phone verification failed.

```
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 145

{"runtimeStatus":"Completed","input":"+1425XXXXXXX","output":false,"createdTime":"2017-06-29T19:20:49Z","lastUpdatedTime":"2017-06-29T19:22:23Z"}
```

## Visual Studio sample code

Here is the orchestration as a single C# file in a Visual Studio project:

> [!NOTE]
> You will need to install the `Microsoft.Azure.WebJobs.Extensions.Twilio` Nuget package to run the sample code below.

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/PhoneVerification.cs)]

## Next steps

This sample has demonstrated some of the advanced capabilities of Durable Functions, notably `WaitForExternalEvent` and `CreateTimer`. You've seen how these can be combined with `Task.WaitAny` to implement a reliable timeout system, which is often useful for interacting with real people. You can learn more about how to use Durable Functions by reading a series of articles that offer in-depth coverage of specific topics.

> [!div class="nextstepaction"]
> [Go to the first article in the series](durable-functions-bindings.md)
