---
title: Tutorial on how to attach custom tags to your client telemetry
titleSuffix: An Azure Communication Services tutorial
description: Assign a custom attribute tag to participants telemetry using the calling SDK.
author: amagginetti
ms.author: amagginetti

services: azure-communication-services
ms.date: 10/24/2024
ms.topic: tutorial
ms.service: azure-communication-services
ms.subservice: calling
---

# Tutorial on adding custom tags to your client telemetry
This tutorial shows you how to add a custom data attribute, called the **Diagnostic Options** tag, to the telemetry data that your WebJS client sends to Azure Monitor. This telemetry can be used for post-call analysis.

## Why A/B Testing Matters
A/B testing is an essential technique for making data-informed decisions in product development. Examining two variations of an application output, developers can identify which version excels based on specific metrics that track call reliability and quality. This method enables companies to test different designs, content, and functionalities within a controlled setting, ensuring that any modifications result in measurable enhancements. Additionally, A/B testing reduces the risks tied to introducing new features or strategies by offering evidence-based insights before a full-scale launch.

Another key benefit of A/B testing is its capacity to reveal user preferences and behaviors that may not be evident through traditional testing techniques. Analyzing the outcomes of these tests allows developers to gain a deeper understanding how two different versions of your application result in end user improvements in calling reliability and quality. This iterative cycle of testing and optimization cultivates a culture of continual enhancement, helping developers remain competitive and adaptable to evolving market trends.

## Benefits of the Diagnostic Options tag
Consider the possibility that specific segments of your user base are encountering issues, and you aim to better identify and understand these problems. For instance, imagine all your customers utilizing Azure Communication Services WebJS in a single particular location face difficulty. To pinpoint the users experiencing issues, you can incorporate a diagnostic options tag on clients initiating a call in the specified location. This tagging allows you to filter and examine calling logs effectively. By applying targeted tag, you can segregate and analyze this data more efficiently. Monitoring tools such as ACS Calling Insights and Call Diagnostic Center (CDC) can help tracking these tag and identifying recurring issues or patterns. Through ongoing analysis of these tagged sessions, you gain valuable insights into user problems, enabling you to proactively address them and enhance the overall user experience.experience.

## How to add a Diagnostic Options tag to your JavaScript code
There are three optional fields that you can use to tag give to add various level of. Telemetry tracking for your needs.
- `appName`
- `appVersion`
- `tags`

Each value can have a maximum length of 64 characters, with support for only letters [aA, bB, cC, etc.], numbers[0-9], and basic symbols (dash "-", underscore "_", period ".", colon ":", number sign "#" ).

Here is an example of how to use the **Diagnostic Options** parameters from within your WebJS application:
```js
const callClient = new CallClient({
    diagnostics: {
        appName: 'contoso-healthcare-calling-services',
        appVersion: '2.1',
        tags: ["contoso_virtual_visits",`#clientTag:participant0001}`]
    }
});
```

## How to view the tag
Once you add the values to your client SDK, they're populated and appear in your telemetry and metrics as you're calling. These values appear as key-value pairs appended to the user agent field that appears within the [call client log schema](../../concepts/analytics/logs/voice-and-video-logs.md#call-client-operations-log-schema)

**contoso-healthcare-calling-services**/**2.1** azsdk-js-communication-calling/1.27.1-rc.10 (contoso_virtual_visits, participant0001). Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0

> [!NOTE]
> If you don't set a value for 'appName', 'appVersion, or 'tag' from within the client API, then the default value for that field will be empty.

## Next steps
- Learn more about Azure Communication Services Call Diagnostic Center [here](../../concepts//voice-video-calling/call-diagnostics.md)
- Learn more about Voice and Video calling Insights [here](../../concepts/analytics/insights/voice-and-video-insights.md)
- Learn more about how to enable Azure Communication Services logs [here](../../concepts/analytics/enable-logging.md)
