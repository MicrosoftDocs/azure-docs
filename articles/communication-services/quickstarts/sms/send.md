---
title: Quickstart - Send an SMS message
titleSuffix: Azure Communication Services
description: "In this quickstart, you'll learn how to send an SMS message by using Azure Communication Services. See code examples in C#, JavaScript, Java, and Python."
author: tophpalmer
manager: chpalm
services: azure-communication-services
ms.author: chpalm
ms.date: 05/25/2022
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: sms
ms.custom:
   - tracking-python
   - devx-track-js
   - mode-other
   - kr2b-contr-experiment
zone_pivot_groups: acs-azcli-js-csharp-java-python-power-platform
---
# Quickstart: Send an SMS message

> [!IMPORTANT]
> SMS capabilities depend on the phone number you use and the country that you're operating within as determined by your Azure billing address. For more information, visit the [Subscription eligibility](../../concepts/numbers/sub-eligibility-number-capability.md) documentation.

<br/>

>[!VIDEO https://www.youtube.com/embed/YEyxSZqzF4o]

::: zone pivot="platform-azcli"
[!INCLUDE [Send SMS with Azure CLI](./includes/send-sms-az-cli.md)]
::: zone-end

::: zone pivot="programming-language-csharp"
[!INCLUDE [Send SMS with .NET SDK](./includes/send-sms-net.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Send SMS with JavaScript SDK](./includes/send-sms-js.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Send SMS with Python SDK](./includes/send-sms-python.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Send SMS with Java SDK](./includes/send-sms-java.md)]
::: zone-end

::: zone pivot="programming-language-power-platform"
[!INCLUDE [Send SMS with Power Platform](./includes/send-sms-logic-app.md)]
::: zone-end

## Troubleshooting

To troubleshoot issues related to SMS delivery, you can [enable delivery reporting with Event Grid](./handle-sms-events.md) to capture delivery details.

## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Toll-free verification

If you have a new toll-free number and want to send [high volume of SMS messages](../../concepts/sms/sms-faq.md#what-happens-if-i-dont-verify-my-toll-free-numbers) or send SMS messages to Canadian phone numbers, please visit [here](../../concepts/sms/sms-faq.md#how-do-i-submit-a-toll-free-verification) to learn how to verify your toll-free number. 

## Next steps

In this quickstart, you learned how to send SMS messages by using Communication Services.

> [!div class="nextstepaction"]
> [Receive and reply to SMS](./receive-sms.md)

> [!div class="nextstepaction"]
> [Enable SMS analytics](../../concepts/analytics/insights/sms-insights.md)

> [!div class="nextstepaction"]
> [Phone number types](../../concepts/telephony/plan-solution.md)
