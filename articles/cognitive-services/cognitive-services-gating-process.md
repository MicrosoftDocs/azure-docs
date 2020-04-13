---
title: Gating Process
titleSuffix: Azure Cognitive Services
description: Learn how to apply for early access to a gated Cognitive Services offering.
services: cognitive-services
author: IEvangelist
manager: nitinme
ms.service: cognitive-services
ms.topic: conceptual
ms.date: 03/04/2020
ms.author: dapine
---

# Gating process for Azure Cognitive Services containers

As new Azure Cognitive Services are containerized, they go through a gated preview where customers have to explicitly request access. This gating process helps identify opportunities for improvements to the offering, before making it's publicly available. This article will guide you through the application process for gated Cognitive Services offerings.

Currently, the services below are offered through the gating process:

## Online Containers

| Service                             | Container(s)                                                                  |
|-------------------------------------|-------------------------------------------------------------------------------|
| [Computer Vision][cv-containers]    | Read                                                                          |
| [Face][fa-containers]               | Face                                                                          |
| [Form Recognizer][fr-containers]    | Form Recognizer                                                               |
| [Speech Service API][sp-containers] | Speech-to-text (Custom and Standard) and Text-to-speech (Custom and Standard) |
| [Translator Text][tt-containers]    | Translator Text                                                               |

## Offline containers

| Service                                        | Container(s)       |
|------------------------------------------------|--------------------|
| [Anomaly Detector][ad-containers]              | Anomaly Detector   |
| [Language Understanding (LUIS)][lu-containers] | LUIS               |
| [Text Analytics][ta-containers]                | Sentiment Analysis |
| [Translator Text][tt-containers]               | Translator Text    |

> [!IMPORTANT]
> If a service or containerized offering is not listed, it's either not available or generally available.

## Eligibility and Approval process

The gating process is in place to help gauge interest and better understand customer needs. The Microsoft team accepts applications from Microsoft commercial customers with a valid Azure subscription and a valid business scenario. Customers will potentially have their applications denied when:

 - They're not associated with any organization
 - They do not have a valid Azure subscription
 - The application was submitted through personal email (@hotmail.com, @gmail.com, @yahoo.com)
 - There was no proper justification or business scenario provided

Given the demand from different customer segments, we're attempting to expedite approval process. However, we cannot commit to a timeline. Once a decision is made, the Microsoft team will contact you and your account management team for the next steps. We appreciate your understanding and patience.

If the application is approved, the Microsoft team will send an email with all details, documentation, and guidance. Cognitive Services pricing details available [here](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Next steps

If you have questions, email the Microsoft team at <a href="mailto:email@microsoft.com">email@microsoft.com</a>.

> [!div class="nextstepaction"]
> [Sign up for gated services](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyQZ7B8Cg2FEjpibPziwPcZUNlQ4SEVORFVLTjlBSzNLRlo0UzRRVVNPVy4u)

[ad-containers]: ./anomaly-detector/anomaly-detector-container-howto.md
[cv-containers]: ./computer-vision/computer-vision-how-to-install-containers.md
[fa-containers]: ./face/face-how-to-install-containers.md
[fr-containers]: ./form-recognizer/form-recognizer-container-howto.md
[lu-containers]: ./luis/luis-container-howto.md
[sp-containers]: ./speech-service/speech-container-howto.md
[ta-containers]: ./text-analytics/how-tos/text-analytics-how-to-install-containers.md
[tt-containers]: ./translator/how-to-install-containers.md
