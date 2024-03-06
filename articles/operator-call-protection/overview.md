---
title: What is Azure Operator Call Protection?
description: Learn how telecommunications operators can use Azure Operator Call Protection to detect fraud with AI.
author: rcdun
ms.author: rdunstan
ms.service: azure
ms.topic: overview
ms.date: 01/31/2024
ms.custom:
    - update-for-call-protection-service-slug

#CustomerIntent: As a <type of user>, I want <what?> so that <why?>.
---

# What is Azure Operator Call Protection?

Azure Operator Call Protection is a service targeted at telecommunications operators that uses AI to perform real-time analysis of consumer phone calls to detect potential phone scams and alert subscribers when they are at risk of being scammed.

[!INCLUDE [operator-call-protection-tsp-restriction](includes/operator-call-protection-tsp-restriction.md)]

Azure Operator Call Protection harnesses the power and responsible AI safeguards of Azure speech-to-text and Azure OpenAI.

It is built on the Azure Communications Gateway platform, enabling quick, reliable and secure integration between your landline or mobile voice network and the Call Protection service running in the Azure cloud.

This service is now available at Preview.

> [!IMPORTANT]
> Azure Operator Call Protection preview can be used in a live production environment.

## Architecture

Azure Operator Call Protection connects to your network over IP for the voice call, and via the global SMS network for the delivery of fraud call notifications.

:::image type="complex" source="media/azure-operator-call-protection-architecture.svg" alt-text="Diagram of an operator network invoking Azure Operator Call Protection for a subscriber, showing SIP,  RTP and SMS flows" lightbox="media/azure-operator-call-protection-architecture.svg":::
    A subscriber in an operator network receives a call from an off-net or on-net calling party. The switch, TAS, or IMS core in the operator network causes a SIPREC recording client to contact Azure Communications Gateway with SIP and RTP. Azure Communications Gateway forwards the SIP and RTP to Azure Operator Call Protection. If Azure Operator Call Protection determines that the call might be a scam, it sends an SMS to the subscriber through the global SMS network to alert the subscriber to the potential scam.
:::image-end:::

Your network communicates with the Call Protection service deployed in a suitable Azure region.
Connection is over any means using public IP addressing including:
* Azure Internet Peering for Communications Services ("MAPS for Voice")
* ExpressRoute Microsoft peering

The connection to Azure Operator Call Protection is over SIPREC.
The Call Protection service takes the role of the SIPREC Session Recording Server (SRS).
An element in your network, typically a session border controller (SBC), is set up as a SIPREC Session Recording Client (SRC).

Azure Operator Call Protection is supported in many Microsoft Azure regions globally. Please contact your account team to discuss which local regions support this service.

Azure Operator Call Protection and Azure Communications Gateway are fully managed services. This simplifies network operations integration and accelerates the timeline for adding new network functions into production.

## Features

Azure Operator Call Protection is invoked on incoming calls to your subscribers.
It analyses the call content in real time to determine whether it is likely to be a scam or fraud call.

If Azure Operator Call Protection determines at any point during the call that it is likely to be a scam or fraud, it sends an operator-branded SMS message notification to the subscriber via the global SMS network.

This notification contains a warning that the current call is likely to be a scam or fraud, and an explanation of why that determination has been made.
This enables the subscriber to make an informed decision about whether to proceed with the call.

## Privacy and security

> TODO: This might change depending on CELA input on Transparency FAQs.

Azure Operator Call Protection is architected to ensure the security and privacy of customer data.

Azure Operator Call Protection does not record the call or store the content of calls. No call content can be accessed or listened to by Microsoft.

All customer data, including call content, is processed in the operator's Azure subscription and is protected by Azure's robust security and privacy measures, including encryption for data at rest and in transit, identity and access management, threat detection, and compliance certifications.

No customer data, including call content, is used to train the AI.

## Next step

> [!div class="nextstepaction"]
> [Learn about deploying and setting up Azure Operator Call Protection](deployment-overview.md)
