---
title: What is Azure Operator Call Protection Preview?
description: Learn how telecommunications operators can use Azure Operator Call Protection Preview to detect fraud with AI.
author: rcdun
ms.author: rdunstan
ms.service: azure-operator-call-protection
ms.topic: overview
ms.date: 01/31/2024

#CustomerIntent: As a business development manager for an operator, I want to understand what Azure Operator Call Protection does so that I can decide whether it's right for my organization.
---

# What is Azure Operator Call Protection Preview?

Azure Operator Call Protection Preview is a service targeted at telecommunications operators. It uses AI to perform real-time analysis of consumer phone calls to detect potential phone scams and alert subscribers when they are at risk of being scammed.

[!INCLUDE [operator-call-protection-provider-restriction](includes/operator-call-protection-provider-restriction.md)]

Azure Operator Call Protection harnesses the power and responsible AI safeguards of Azure speech-to-text and Azure OpenAI.

It's built on the Azure Communications Gateway platform, enabling quick, reliable, and secure integration between your landline or mobile voice network and the Call Protection service running on the Azure platform.

> [!NOTE]
> Azure Operator Call Protection Preview can be used in a live production environment.

## Scam detection and alerting

Azure Operator Call Protection Preview is invoked on incoming calls to your subscribers.
It analyses the call content in real time to determine whether it's likely to be a scam or fraud call.

If Azure Operator Call Protection determines at any point during the call that it's likely to be a scam or fraud, it sends an operator-branded SMS message notification to the subscriber.

This notification contains a warning that the current call is likely to be a scam or fraud, and an explanation of why that determination has been made.
The notification and explanation enable the subscriber to make an informed decision about whether to proceed with the call.

## Architecture

Azure Operator Call Protection Preview connects to your network over IP via Azure Communications Gateway for the voice call. It uses the global SMS network to deliver fraud call notifications.

:::image type="complex" source="media/azure-operator-call-protection-architecture.svg" alt-text="Diagram of an operator network invoking Azure Operator Call Protection for a subscriber, showing SIP,  RTP and SMS flows" lightbox="media/azure-operator-call-protection-architecture.svg":::
    A subscriber in an operator network receives a call from an off-net or on-net calling party. The switch, TAS, or IMS core in the operator network causes a SIPREC recording client to contact Azure Communications Gateway with SIP and RTP. Azure Communications Gateway forwards the SIP and RTP to Azure Operator Call Protection. If Azure Operator Call Protection determines that the call might be a scam, it sends an SMS to the subscriber through the global SMS network to alert the subscriber to the potential scam.
:::image-end:::

Your network communicates with the Operator Call Protection service deployed in Azure.
Connection is over any means using public IP addressing including:
* Microsoft Azure Peering Services Voice (also known as MAPS Voice)
* ExpressRoute Microsoft peering

Your network must connect to Azure Communications Gateway and thus Azure Operator Call Protection over SIPREC.

- Azure Communications Gateway takes the role of the SIPREC Session Recording Server (SRS).
- An element in your network, typically a session border controller (SBC), must be set up as a SIPREC Session Recording Client (SRC).

Azure Operator Call Protection is supported in many Microsoft Azure regions globally. Contact your account team to discuss which local regions support this service.

Azure Operator Call Protection and Azure Communications Gateway are fully managed services. This simplifies network operations integration and accelerates the timeline for adding new network functions into production.

## Privacy and security

Azure Operator Call Protection Preview is architected to defend the security and privacy of customer data.

Azure Operator Call Protection doesn't record the call or store the content of calls. No call content can be accessed or listened to by Microsoft.

Customer data is protected by Azure's robust security and privacy measures, including encryption for data at rest and in transit, identity and access management, threat detection, and compliance certifications.

No customer data, including call content, is used to train the AI.

## Next step

> [!div class="nextstepaction"]
> [Learn about deploying and setting up Azure Operator Call Protection Preview](deployment-overview.md)
