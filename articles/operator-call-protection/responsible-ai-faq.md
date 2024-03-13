---
title: Responsible AI FAQ
description: Explain common questions around the use of AI in the product.
author: msft-andrew
ms.author: andrewwright
ms.service: azure
ms.topic: conceptual
ms.date: 01/31/2024
ms.custom:
    - update-for-call-protection-service-slug

#CustomerIntent: As a user, I want to understand the role of AI in this service so that I can be reassured Microsoft is providing an effective service.
---

# Responsible AI FAQ for Azure Operator Call Protection (preview)

## What is Azure Operator Call Protection?

Azure Operator Call Protection is a service that uses AI to analyze the content of calls to consumers to detect and warn about likely fraudulent or scam calls.

It's sold to telecommunications operators who rebrand the service as part of their consumer offering, for example as an add-on to their existing consumer landline or mobile voice service. It's network-derived and can be made available on any end device.

If a potential scam is detected, the service notifies the user by sending them an operator-branded SMS alert that includes guidance on why a fraud is suspected. This SMS assists the user with making an informed decision about whether to proceed with the call.

## What does Azure Operator Call Protection do?

Azure Operator Call Protection runs on the Microsoft Azure platform and is integrated with operator networks using Microsoft's Azure Communications Gateway. The operator network is configured to invoke the service for calls to configured subscribers.

A call routed to the service is transcribed into text in real time, which is then analyzed using AI to determine whether the call is likely to represent an attempted scam, for instance, a fraudulent attempt to acquire the user's password or PIN.

If a potential scam is detected, the service immediately sends an SMS alert to the user that provides guidance on why a scam was suspected, assisting the user with making an informed decision about whether to proceed with the call.

## What is Azure Operator Call Protection's intended use?

Azure Operator Call Protection is intended to reduce the impact of fraud committed via voice calls to consumers over landline and mobile networks. It alerts users to potential fraud attempts in real-time and provides information that assists them in making an informed judgment on how to proceed.

It helps protect against a wide range of common scam types including bank scams, pension scams, computer support scams and many more.

## How was Azure Operator Call Protection evaluated? What metrics are used to measure performance?

Azure Operator Call Protection is tested against a range of sample call data. This call data doesn't include any actual customer call content, but does include representative transcripts of a wide variety of different types of voice call scams, along with a range of different accents and dialects.

The service sends end users AI-generated SMS alerts that explain why Azure Operator Call Protection suspects a call is a scam. These alerts have been tested to assure they're accurate and helpful to the user.

Scams tend to evolve over time and vary substantially between different cultures and geographies. Azure Operator Call Protection is therefore continually tested, monitored, and adjusted to ensure that it's effective at combatting evolving scam trends.

## What are the limitations of Azure Operator Call Protection? How can users minimize the impact of Azure Operator Call Protection's limitations when using the system?

There is inevitably a small proportion of calls for which the AI is unable to make an accurate scam judgment. The service is undergoing ongoing development and user testing to find ways in which to handle these calls, minimizing impact to the users, while still enabling them to make an informed judgment on how to proceed.

Azure Operator Call Protection uses speech-to-text processing. The accuracy of this processing is affected by factors such as background noise, call participant volumes, and call participant accents. If these factors are outside typical parameters, the accuracy of the scam detection may be affected.

End users always have control over the call and decide whether to continue or end the call, based on alerts about potential scams from Azure Operator Call Protection.

## What operational factors and settings allow for effective and responsible use of Azure Operator Call Protection?

Azure Operator Call Protection is designed to work with standard mobile and landline voice calls. However, significant amounts of background noise or a poor quality connection may impact the service's ability to accurately detect potential frauds, in the same way that a human listener might struggle to accurately hear the conversation.

The service is also tested and evaluated with a range of accents and dialects. However, if the service is unable to recognize individual words or phrases from the call content then the accuracy of the scam detection may be affected.

## What interactions do end users have with the Azure Operator Call Protection's AI?

Azure Operator Call Protection uses speech-to-text processing to transcribe the call into text in real time, and AI to analyze the text. If it determines that the call is likely to be a scam, an SMS alert is sent to the user. This SMS contains AI-generated content that summarizes why the call might be a scam.
This alert message SMS also contains a reminder to the user that some of the text therein is AI-generated, and therefore may be inaccurate.
The SMS alert is intended to enable users of the service to make an informed judgment on whether to proceed with the call.
