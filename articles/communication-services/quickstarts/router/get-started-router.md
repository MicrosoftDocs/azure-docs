---
title: Quickstart - Submit a Job for queuing and routing
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to create a Job Router client, Distribution Policy, Queue, and Job within your Azure Communication Services resource.
author: jasonshave
manager: phans
services: azure-communication-services
ms.author: jassha
ms.date: 10/18/2021
ms.topic: quickstart
ms.service: azure-communication-services
ms.custom: mode-other, devx-track-extended-java, devx-track-js, devx-track-python
zone_pivot_groups: acs-js-csharp-java-python
---
# Quickstart: Submit a job for queuing and routing

[!INCLUDE [Public Preview Disclaimer](../../includes/public-preview-include-document.md)]

Get started with Azure Communication Services Job Router by setting up your client, then configuring core functionality such as queues, policies, workers, and Jobs. To learn more about Job Router concepts, visit [Job Router conceptual documentation](../../concepts/router/concepts.md)

::: zone pivot="programming-language-csharp"

[!INCLUDE [Use Job Router with .NET SDK](./includes/router-quickstart-net.md)]

::: zone-end

::: zone pivot="programming-language-javascript"

[!INCLUDE [Use Job Router with JavaScript SDK](./includes/router-quickstart-javascript.md)]
::: zone-end

::: zone pivot="programming-language-python"

[!INCLUDE [Use Job Router with Python SDK](./includes/router-quickstart-python.md)]
::: zone-end

::: zone pivot="programming-language-java"

[!INCLUDE [Use Job Router with Java SDK](./includes/router-quickstart-java.md)]
::: zone-end

## Next Steps
Explore Job Router How-To's [tutorials](/azure/communication-services/concepts/router/concepts#check-out-our-how-to-guides)

<!-- LINKS -->
[subscribe_events]: ../../how-tos/router-sdk/subscribe-events.md
[worker_registered_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerregistered
[job_classified_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterjobclassified
[offer_issued_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferissued
[offer_accepted_event]: ../../how-tos/router-sdk/subscribe-events.md#microsoftcommunicationrouterworkerofferaccepted
