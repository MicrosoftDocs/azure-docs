---
title: Human interaction and timeouts in Durable Functions - Azure
description: Learn how to handle human interaction and timeouts in the Durable Functions extension for Azure Functions.
ms.topic: conceptual
ms.date: 12/07/2018
ms.author: azfuncdf
---

# Human interaction in Durable Functions - Phone verification sample

This sample demonstrates how to build a [Durable Functions](durable-functions-overview.md) orchestration that involves human interaction. Whenever a real person is involved in an automated process, the process must be able to send notifications to the person and receive responses asynchronously. It must also allow for the possibility that the person is unavailable. (This last part is where timeouts become important.)

This sample implements an SMS-based phone verification system. These types of flows are often used when verifying a customer's phone number or for multi-factor authentication (MFA). It is a powerful example because the entire implementation is done using a couple small functions. No external data store, such as a database, is required.

[!INCLUDE [durable-functions-prerequisites](../../../includes/durable-functions-prerequisites.md)]

## Scenario overview

Phone verification is used to verify that end users of your application are not spammers and that they are who they say they are. Multi-factor authentication is a common use case for protecting user accounts from hackers. The challenge with implementing your own phone verification is that it requires a **stateful interaction** with a human being. An end user is typically provided some code (for example, a 4-digit number) and must respond **in a reasonable amount of time**.

Ordinary Azure Functions are stateless (as are many other cloud endpoints on other platforms), so these types of interactions involve explicitly managing state externally in a database or some other persistent store. In addition, the interaction must be broken up into multiple functions that can be coordinated together. For example, you need at least one function for deciding on a code, persisting it somewhere, and sending it to the user's phone. Additionally, you need at least one other function to receive a response from the user and somehow map it back to the original function call in order to do the code validation. A timeout is also an important aspect to ensure security. It can get fairly complex quickly.

The complexity of this scenario is greatly reduced when you use Durable Functions. As you will see in this sample, an orchestrator function can manage the stateful interaction easily and without involving any external data stores. Because orchestrator functions are *durable*, these interactive flows are also highly reliable.

## Configuring Twilio integration

[!INCLUDE [functions-twilio-integration](../../../includes/functions-twilio-integration.md)]

## The functions

This article walks through the following functions in the sample app:

* `E4_SmsPhoneVerification`: An [orchestrator function](durable-functions-bindings.md#orchestration-trigger) that performs the phone verification process, including managing timeouts and retries.
* `E4_SendSmsChallenge`: An [activity function](durable-functions-bindings.md#activity-trigger) that sends a code via text message.

### E4_SmsPhoneVerification orchestrator function

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/PhoneVerification.cs?range=17-70)]

> [!NOTE]
> It may not be obvious at first, but this orchestrator function is completely deterministic. It is deterministic because the `CurrentUtcDateTime` property is used to calculate the timer expiration time, and it returns the same value on every replay at this point in the orchestrator code. This behavior is important to ensure that the same `winner` results from every repeated call to `Task.WhenAny`.

# [JavaScript](#tab/javascript)

The **E4_SmsPhoneVerification** function uses the standard *function.json* for orchestrator functions.

[!code-json[Main](~/samples-durable-functions/samples/javascript/E4_SmsPhoneVerification/function.json)]

Here is the code that implements the function:

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E4_SmsPhoneVerification/index.js)]

> [!NOTE]
> It may not be obvious at first, but this orchestrator function is completely deterministic. It is deterministic because the `currentUtcDateTime` property is used to calculate the timer expiration time, and it returns the same value on every replay at this point in the orchestrator code. This behavior is important to ensure that the same `winner` results from every repeated call to `context.df.Task.any`.

---

Once started, this orchestrator function does the following:

1. Gets a phone number to which it will *send* the SMS notification.
2. Calls **E4_SendSmsChallenge** to send an SMS message to the user and returns back the expected 4-digit challenge code.
3. Creates a durable timer that triggers 90 seconds from the current time.
4. In parallel with the timer, waits for an **SmsChallengeResponse** event from the user.

The user receives an SMS message with a four-digit code. They have 90 seconds to send that same four-digit code back to the orchestrator function instance to complete the verification process. If they submit the wrong code, they get an additional three tries to get it right (within the same 90-second window).

> [!WARNING]
> It's important to [cancel timers](durable-functions-timers.md) if you no longer need them to expire, as in the example above when a challenge response is accepted.

## E4_SendSmsChallenge activity function

The **E4_SendSmsChallenge** function uses the Twilio binding to send the SMS message with the four-digit code to the end user.

# [C#](#tab/csharp)

[!code-csharp[Main](~/samples-durable-functions/samples/precompiled/PhoneVerification.cs?range=72-89)]

> [!NOTE]
> You will need to install the `Microsoft.Azure.WebJobs.Extensions.Twilio` Nuget package to run the sample code.

# [JavaScript](#tab/javascript)

The *function.json* is defined as follows:

[!code-json[Main](~/samples-durable-functions/samples/javascript/E4_SendSmsChallenge/function.json)]

And here is the code that generates the four-digit challenge code and sends the SMS message:

[!code-javascript[Main](~/samples-durable-functions/samples/javascript/E4_SendSmsChallenge/index.js)]

---

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
Location: http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}

{"id":"741c65651d4c40cea29acdd5bb47baf1","statusQueryGetUri":"http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","sendEventPostUri":"http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1/raiseEvent/{eventName}?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}","terminatePostUri":"http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1/terminate?reason={text}&taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}"}
```

The orchestrator function receives the supplied phone number and immediately sends it an SMS message with a randomly generated 4-digit verification code &mdash; for example, *2168*. The function then waits 90 seconds for a response.

To reply with the code, you can use [`RaiseEventAsync` (.NET) or `raiseEvent` (JavaScript)](durable-functions-instance-management.md) inside another function or invoke the **sendEventUrl** HTTP POST webhook referenced in the 202 response above, replacing `{eventName}` with the name of the event, `SmsChallengeResponse`:

```
POST http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1/raiseEvent/SmsChallengeResponse?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
Content-Length: 4
Content-Type: application/json

2168
```

If you send this before the timer expires, the orchestration completes and the `output` field is set to `true`, indicating a successful verification.

```
GET http://{host}/runtime/webhooks/durabletask/instances/741c65651d4c40cea29acdd5bb47baf1?taskHub=DurableFunctionsHub&connection=Storage&code={systemKey}
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

## Next steps

This sample has demonstrated some of the advanced capabilities of Durable Functions, notably `WaitForExternalEvent` and `CreateTimer` APIs. You've seen how these can be combined with `Task.WaitAny` to implement a reliable timeout system, which is often useful for interacting with real people. You can learn more about how to use Durable Functions by reading a series of articles that offer in-depth coverage of specific topics.

> [!div class="nextstepaction"]
> [Go to the first article in the series](durable-functions-bindings.md)
