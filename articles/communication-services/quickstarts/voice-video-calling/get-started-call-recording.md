---
ms.author: dbasantes
title: Azure Communication Services Call Recording refreshed API quickstart
titleSuffix: An Azure Communication Services document
description: Public Preview quickstart for Call Recording APIs
author: dbasantes
services: azure-communication-services
ms.date: 06/12/2023
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
zone_pivot_groups: acs-js-csharp-java-python
ms.custom: mode-api, devx-track-extended-java, devx-track-js, devx-track-python
---
# Call Recording Quickstart

This quickstart gets you started with Call Recording for voice and video calls. To start using the Call Recording APIs, you must have a call in place. Make sure you're familiar with [Calling client SDK](get-started-with-video-calling.md) and/or [Call Automation](../call-automation/callflows-for-customer-interactions.md#build-a-customer-interaction-workflow-using-call-automation) to build the end-user calling experience.

::: zone pivot="programming-language-csharp"
[!INCLUDE [Test Call Recording with C#](./includes/call-recording-samples/call-recording-csharp.md)]
::: zone-end

::: zone pivot="programming-language-java"
[!INCLUDE [Test Call Recording with Java](./includes/call-recording-samples/call-recording-java.md)]
::: zone-end

::: zone pivot="programming-language-python"
[!INCLUDE [Test Call Recording with Python](./includes/call-recording-samples/call-recording-python.md)]
::: zone-end

::: zone pivot="programming-language-javascript"
[!INCLUDE [Test Call Recording with JavaScript](./includes/call-recording-samples/call-recording-javascript.md)]
::: zone-end


## Clean up resources

If you want to clean up and remove a Communication Services subscription, you can delete the resource or resource group. Deleting the resource group also deletes any other resources associated with it. Learn more about [cleaning up resources](../create-communication-resource.md#clean-up-resources).

## Next steps

For more information, see the following articles:

- Download our [Java](https://github.com/Azure-Samples/communication-services-java-quickstarts/tree/main/ServerRecording), [Python](https://github.com/Azure-Samples/communication-services-python-quickstarts/tree/main/call-recording), and [JavaScript](https://github.com/Azure-Samples/communication-services-javascript-quickstarts/tree/main/call-recording) call recording sample apps
- Learn more about [Call Recording](../../concepts/voice-video-calling/call-recording.md)
- Learn more about [Call Automation](../../concepts/call-automation/call-automation.md)
